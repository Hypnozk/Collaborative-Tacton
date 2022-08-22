import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
import RoomModule from "../store/RoomModule";
import UserModule from "../store/UserModule";
import TactonModule from "../store/TactonModule";

interface SocketMessage {
    type: WS_MSG_TYPE;
    startTimeStamp: number;
    payload: any;
}

const getID = (address: string): string => {
    const index = address.lastIndexOf("#")
    if (index == -1)
        return address;
    return address.slice(index + 1, address.length);
}

export const onMessage = (ws: WebSocket, data: any, client: string) => {
    /**
     * every message has an startTimeStamp, to calculate the latency
     */
    //console.log(`Received message from user ${client}`);
    try {
        let msg: SocketMessage = JSON.parse(data);
        //console.log(msg.payload)
        switch (msg.type) {
            case WS_MSG_TYPE.UPDATE_ROOM_SERV: {
                /**
                 * method if one user, which is still part of the room, update the medata
                * recieve {
                *       room:{id:string,name:string,description:string}, 
                *       user:{id:string, name:string}
                *   } as payload
                * return {room:Room, participants:User[]} to all users
                * participants is list, of all users of the room
                * 
                * message ENTER_ROOM_CLI for notification of initial client about finishing the changes
                */
                const updateRoom = RoomModule.updateRoomInformation(msg.payload.room.id, msg.payload.room.name, msg.payload.room.description)
                const updateUser = UserModule.updateUser(msg.payload.room.id, msg.payload.user);
                if ((updateRoom !== undefined && updateRoom == true) || updateUser == true) {
                    const roomInfo = RoomModule.getRoomInfo(msg.payload.room.id);
                    const participants = UserModule.getParticipants(msg.payload.room.id);

                    StorageManager.broadCastMessage(msg.payload.room.id,
                        WS_MSG_TYPE.UPDATE_ROOM_CLI,
                        { room: roomInfo, participants: participants },
                        msg.startTimeStamp)
                }

                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.ENTER_ROOM_CLI,
                    startTimeStamp: msg.startTimeStamp,
                }))

                break;
            }
            case WS_MSG_TYPE.ENTER_ROOM_SERV: {
                /**
                * method if one user enter the room
                * metadata and participants get updated
                * recieve {
                *       room:RoomMetaData, 
                *   } as payload
                */
                const updateRoom = RoomModule.updateRoomInformation(msg.payload.room.id, msg.payload.room.name, msg.payload.room.description)
                let roomInfo = null;
                if (updateRoom == undefined) {
                    roomInfo = StorageManager.createSession(msg.payload.room);
                } else {
                    roomInfo = RoomModule.getRoomInfo(msg.payload.room.id)!
                }

                StorageManager.enterSession(ws, client, msg.payload.userName, roomInfo, msg.payload.startTimeStamp);

                break;
            }
            case WS_MSG_TYPE.ROOM_INFO_SERV: {
                /**
                 * method to request all metadata of one room
                 * recieve "roomName#id":string as payload
                 * return {
                 *      existRoom:boolean, 
                 *      roomInfo:Room
                 *      participants: User[]
                 *  } as payload
                 */
                let existRoom = true;
                let roomInfo = undefined;

                const id = getID(msg.payload);
                if (id !== undefined)
                    roomInfo = RoomModule.getRoomInfo(id);

                if (roomInfo == undefined) {
                    existRoom = false;
                    roomInfo = {
                        id: undefined,
                        description: "",
                        name: msg.payload ? msg.payload : RoomModule.getNewRoomName(),
                        participants: []
                    }
                }

                const partipantList = UserModule.getParticipants(id);
                //console.log({ existRoom: existRoom, roomInfo: roomInfo, participants: partipantList });

                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.ROOM_INFO_CLI,
                    payload: { existRoom: existRoom, roomInfo: roomInfo, participants: partipantList },
                    startTimeStamp: msg.startTimeStamp
                }))
                break;
            }
            case WS_MSG_TYPE.UPDATE_USER_ACCOUNT_SERV: {
                /**
                 * method to update all clients with new username
                 * recieve {
                 *      roomId:string
                 *      user: User
                 *  } as payload
                 * 
                 * return {
                 *      participants: User[] ==> modified list
                 *  } as payload
                 */
                const needUpdate = UserModule.updateUser(msg.payload.roomId, msg.payload.user)
                if (needUpdate == false)
                    break;

                const participants = UserModule.getParticipants(msg.payload.roomId);
                StorageManager.broadCastMessage(msg.payload.roomId, WS_MSG_TYPE.UPDATE_USER_ACCOUNT_CLI, participants, msg.startTimeStamp);
                break;
            }
            case WS_MSG_TYPE.LOG_OUT: {
                /**
                * method to remove one client --> remove Room if there are no participants anymore
                * recieve {
                *      roomId:string
                *      user: User
                *  } as payload
                */
                StorageManager.removeUserOfSession(msg.payload.roomId, msg.payload.user, msg.startTimeStamp);
                break;
            }
            case WS_MSG_TYPE.SEND_INSTRUCTION_SERV: {
                /**
                * method to distribute one vibrotactile instruction
                * recieve {
                *      "roomId":string
                *      instructions:[{ keyId: string, channels: string[], intensity: number }]
                *  } as payload
                */
                StorageManager.enterInstruction(msg.payload.roomId, client, msg.payload.instructions, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV: {
                /**
                * method to update all clients with the new recordmode
                * recieve {
                *      "roomId":string
                *      shouldRecord:boolen
                *  } as payload
                */
                StorageManager.changeRecordMode(msg.payload.roomId, msg.payload.shouldRecord, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.CHANGE_DURATION_SERV: {
                /**
                 * method to update all clients with the new max duration of time profile
                 * recieve "{roomId:string,duration":number} as payload
                 */
                StorageManager.changeDuration(msg.payload.roomId, msg.payload.duration, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.PING: {
                /**
                 * method to measure the latency
                 * recieve no payload
                 * return no payload
                 */
                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.PONG,
                    startTimeStamp: msg.startTimeStamp
                }))
                break;
            }
            case WS_MSG_TYPE.GET_TACTON_SERV: {
                /**
                 * method to request one tacton as json in vtproto format
                 * recieve "{roomId:string} as payload
                 * return {tacton:TactonInstruction}
                 */
                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.GET_TACTON_CLI,
                    payload: TactonModule.getTacton(msg.payload.roomId)
                }))
                break;
            }
        }
    } catch (err) {
        console.log("Error occured: " + err);
        ws.send("Error occured: " + err)
    }
}

/**
 * method to remove one user from the room, if he lost the connection
 */
export const onClose = (client: string) => {
    console.log(`Received close message  from user ${client}`);
    const payload = UserModule.findRoomUserOfClient(client);
    if (payload !== undefined && payload.user !== undefined) {
        StorageManager.removeUserOfSession(payload.roomId, payload.user, new Date().getTime());
    }
}