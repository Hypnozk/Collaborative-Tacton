import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
import { User } from "../types";
interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

const getID = (address: string): string | undefined => {
    const index = address.lastIndexOf("#")
    if (index == -1)
        return;
    return address.slice(index, -1);
}

export const onMessage = (ws: WebSocket, data: any, client: string) => {
    console.log(`Received message ${data} from user ${client}`);
    //StorageManager.temp()
    try {
        let msg: SocketMessage = JSON.parse(data);
        console.log(msg.payload)
        switch (msg.type) {
            case WS_MSG_TYPE.UPDATE_ENTER_ROOM_SERV: {
                /**
                * recieve {room:Room, userName:string} as payload --> room don't contain participants list
                * return {userId:string, participants:User[]}
                * userId is the id of the user, who entered or created the room; 
                * participants is list, of all users of the room, with the new person included
                */
                console.log("UPDATE_ENTER_ROOM_SERV " + msg.payload )
                console.log(msg.payload )

                    //check if there is already a room
                    let roomInfo = StorageManager.getRoomInfo(msg.payload.room.id)
                console.log(roomInfo)
                    let updateAllUsers = false;
                    if (roomInfo == undefined) {
                        //create a new room
                        roomInfo = StorageManager.createRoom(msg.payload.room);
                    } else {
                        //update otherwise room information, return true if something is updated
                        updateAllUsers = StorageManager.updateRoomInformation(msg.payload.room.id, msg.payload.room.name, msg.payload.room.id)
                    }

                    const data = StorageManager.enterRoom(ws, client, msg.payload.userName, roomInfo.id);
                    if (data !== undefined) {
                        if (updateAllUsers == true || data.newParticipant == true) {
                            StorageManager.broadCastMessage(roomInfo.id,
                                WS_MSG_TYPE.UPDATE_ENTER_ROOM_CLI,
                                { room: roomInfo, userId: data.participants.userId, participants: data.participants.userList })
                        } else {
                            ws.send(JSON.stringify({
                                type: WS_MSG_TYPE.UPDATE_ENTER_ROOM_CLI,
                                payload: { room: roomInfo, userId: data.participants.userId, participants: data.participants.userList },
                            }))
                        }
                    }
          
                break;
            }
            case WS_MSG_TYPE.GET_ROOM_INFO: {
                /**
                 * recieve "roomName#id":string as payload
                 * return {existRoom:boolean, roomInfo:Room}
                 */
                let existRoom = true;
                let roomInfo = undefined;
                const id = getID(msg.payload);
                if (id !== undefined)
                    roomInfo = StorageManager.getRoomInfo(id);

                if (roomInfo == undefined) {
                    existRoom = false;
                    roomInfo = {
                        id: undefined,
                        description: "",
                        name: msg.payload ? msg.payload : StorageManager.getNewRoomName(),
                        participants: []
                    }
                }

                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.SEND_ROOM_INFO,
                    payload: { existRoom: existRoom, roomInfo: roomInfo },
                }))
                break;
            }
            case WS_MSG_TYPE.UPDATE_USER_ACCOUNT_SERV: {
                /**
                 * recieve "{roomId:string, user:{id:string,userName:string}}" as payload
                 * update all clients with new username
                 */
                const partId = StorageManager.updateParticipants(msg.payload.roomId, msg.payload.user)
                if (partId !== undefined)
                    StorageManager.sendUpdatedParticipants(partId)
                break;
            }
            case WS_MSG_TYPE.LOG_OUT: {
                /**
                 * recieve "{roomId:string, user:{id:string,userName:string}}" as payload
                 * remove Room if there are no participants anymore
                 * update all clients with new username
                 */
                const userInRoom = StorageManager.removeParticipant(msg.payload.roomId, msg.payload.user.id);
                if (userInRoom !== undefined) {
                    if (userInRoom == 0) {
                        StorageManager.removeRoom(msg.payload.roomId);
                    } else {
                        StorageManager.sendUpdatedParticipants(msg.payload.roomId);
                    }
                }
                break;
            }
            case WS_MSG_TYPE.SEND_INSTRUCTION_SERV: {
                /**
                 * recieve "{roomId:string, user:{id:string,userName:string}}" as payload
                 * remove Room if there are no participants anymore
                 * update all clients with new username
                 */
                console.log("recieve Instruction");
                console.log(msg.payload);
                const newInstructions = StorageManager.updateIntensities(client, msg.payload.roomId, msg.payload.keyId, msg.payload.channels, msg.payload.intensity)
                if (newInstructions == undefined || newInstructions.length == 0) return;
                console.log("sended Instruction")
                console.log(newInstructions)
                StorageManager.broadCastMessage(msg.payload.roomId, WS_MSG_TYPE.SEND_INSTRUCTION_CLI, newInstructions)
                break;
            }
            case WS_MSG_TYPE.UPDATE_RECORD_MODE_SERV: {
                /**
                 * recieve "{roomId:string,shouldRecord":boolean} as payload
                 * change RecordMode of the room, if correct roomID transmitted
                 * update all clients with the new recordmode
                 */
                StorageManager.updateRecordMode(msg.payload.roomId, msg.payload.shouldRecord)
                break;
            }
            case WS_MSG_TYPE.CHANGE_DURATION_SERV: {
                /**
                 * recieve "{roomId:string,duration":number} as payload
                 * change Max_Duration of the room, if correct roomID transmitted
                 * update all clients with the new maximal duration
                 */
                StorageManager.updateMaxDuration(msg.payload.roomId, msg.payload.duration)
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
    const roomId = StorageManager.findRoomIdOfUser(client);
    if (roomId !== undefined) {
        const userInRoom = StorageManager.removeParticipant(roomId, client);
        console.log(userInRoom)
        if (userInRoom !== undefined) {
            if (userInRoom == 0) {
                StorageManager.removeRoom(roomId);
            } else {
                StorageManager.sendUpdatedParticipants(roomId);
            }
        }
    }
}