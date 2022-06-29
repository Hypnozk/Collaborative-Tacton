import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
import RoomModule from "../store/RoomModule";
import UserModule from "../store/UserModule";

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
                * recieve {
                *       room:{id:string,name:string,description:string}, 
                *       user:User
                *   } as payload --> room don't contain participants list
                * return {room:Room, participants:User[]}
                * participants is list, of all users of the room
                */
                const neeedUpdate = StorageManager.updateSession(msg.payload.room, msg.payload.user, msg.startTimeStamp)
                if (neeedUpdate) {
                    const roomInfo = RoomModule.getRoomInfo(msg.payload.room.id);
                    const participants = UserModule.getParticipants(msg.payload.room.id);

                    StorageManager.broadCastMessage(msg.payload.room.id,
                        WS_MSG_TYPE.UPDATE_ROOM_CLI,
                        { room: roomInfo, participants: participants },
                        msg.startTimeStamp)
                } else {
                    ws.send(JSON.stringify({
                        type: WS_MSG_TYPE.NO_CHANGE_ROOM_CLI,
                        startTimeStamp: msg.startTimeStamp,
                    }))
                }

                break;
            }
            case WS_MSG_TYPE.ENTER_ROOM_SERV: {
                let roomInfo = RoomModule.getRoomInfo(msg.payload.room.id)
                if (roomInfo == undefined)
                    roomInfo = StorageManager.createSession(msg.payload.room);

                StorageManager.enterSession(ws, client, msg.payload.userName, roomInfo, msg.payload.startTimeStamp);

                break;
            }
            case WS_MSG_TYPE.ROOM_INFO_SERV: {
                /**
                 * recieve "roomName#id":string as payload
                 * return {existRoom:boolean, roomInfo:Room}
                 */
                console.log("{ existRoom: existRoom, roomInfo: roomInfo, participants: partipantList }");
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
                console.log({ existRoom: existRoom, roomInfo: roomInfo, participants: partipantList });

                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.ROOM_INFO_CLI,
                    payload: { existRoom: existRoom, roomInfo: roomInfo, participants: partipantList },
                    startTimeStamp: msg.startTimeStamp
                }))
                break;
            }
            case WS_MSG_TYPE.UPDATE_USER_ACCOUNT_SERV: {
                /**
                 * recieve "{roomId:string, user:{id:string,userName:string}}" as payload
                 * update all clients with new username
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
                 * recieve "{roomId:string, user:{id:string,userName:string}}" as payload
                 * remove Room if there are no participants anymore
                 * update all clients with new username
                 */
                StorageManager.removeUserOfSession(msg.payload.roomId, msg.payload.user, msg.startTimeStamp);
                break;
            }
            case WS_MSG_TYPE.SEND_INSTRUCTION_SERV: {
                /**
                 * recieve "{roomId:string, instructions:[{keyId:string, channels:number[], intensity:number}]" as payload
                 * {keyId:string, channels:number[], intensity:number} --> user pressed one key with some intensity, one key could assign multiple values
                 * send the new instruction to all clients
                 * return [{channelId:number, intensity:number}] --> for every channel new object in array
                 */
                const newInstructions = RoomModule.updateIntensities(client, msg.payload.roomId, msg.payload.instructions)
                if (newInstructions == undefined || newInstructions.length == 0) return;
                //console.log("sended Instruction")
                //console.log(newInstructions)
                StorageManager.broadCastMessage(msg.payload.roomId, WS_MSG_TYPE.SEND_INSTRUCTION_CLI, newInstructions, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV: {
                /**
                 * recieve "{roomId:string,shouldRecord":boolean} as payload
                 * change RecordMode of the room, if correct roomID transmitted
                 * update all clients with the new recordmode
                 */
                StorageManager.changeRecordMode(msg.payload.roomId, msg.payload.shouldRecord, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.CHANGE_DURATION_SERV: {
                /**
                 * recieve "{roomId:string,duration":number} as payload
                 * change Max_Duration of the room, if correct roomID transmitted
                 * update all clients with the new maximal duration
                 */
                StorageManager.changeDuration(msg.payload.roomId, msg.payload.duration, msg.startTimeStamp)
                break;
            }
            case WS_MSG_TYPE.PING: {
                /**
                 * recieve "{roomId:string,duration":number} as payload
                 * change Max_Duration of the room, if correct roomID transmitted
                 * update all clients with the new maximal duration
                 */
                 ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.PONG,
                    startTimeStamp: msg.startTimeStamp
                }))
                break;
            }
        }
    } catch (err) {
        console.log("Error occured: " + err);
        ws.send("Error occured: " + err)
    }
}

export const onClose = (client: string) => {
    console.log(`Received close message  from user ${client}`);
    const payload = UserModule.findRoomUserOfClient(client);
    if (payload !== undefined && payload.user !== undefined) {
        StorageManager.removeUserOfSession(payload.roomId, payload.user, new Date().getTime());
    }
}