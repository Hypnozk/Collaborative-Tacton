import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
import { User } from "../types";
interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

const getID = (address: string): string => {
    const index = address.lastIndexOf("#")
    console.log("index")
    console.log(index)
    if (index == -1)
        return address;
    return address.slice(index + 1, address.length);
}

export const onMessage = (ws: WebSocket, data: any, client: string) => {
    //console.log(`Received message from user ${client}`);
    //StorageManager.temp()
    try {
        let msg: SocketMessage = JSON.parse(data);
        //console.log(msg.payload)
        switch (msg.type) {
            case WS_MSG_TYPE.UPDATE_ROOM_SERV: {
                /**
                * recieve {room:Room, userName:string} as payload --> room don't contain participants list
                * return {userId:string, participants:User[]}
                * userId is the id of the user, who entered or created the room; 
                * participants is list, of all users of the room, with the new person included
                */

                //check if there is already a room
                let roomInfo = StorageManager.getRoomInfo(msg.payload.room.id)
                if (roomInfo == undefined)
                    break;

                //update otherwise room information, return true if something is updated
                //StorageManager.updateParticipants(msg.payload.room.id, msg.payload.userName)
                const updateAllUsers = StorageManager.updateRoomInformation(roomInfo.id, msg.payload.room.name, msg.payload.room.description)
                const userData = StorageManager.updateUserOfRoom(ws, client, msg.payload.userName, roomInfo.id);

                if (userData !== undefined) {
                    console.log(userData.participants)
                    if (updateAllUsers == true || userData.updateParticipant == true) {
                        console.log("broadCastMasage")
                        StorageManager.broadCastMessage(roomInfo.id,
                            WS_MSG_TYPE.UPDATE_ROOM_CLI,
                            { room: roomInfo, participants: userData.participants.userList })
                    } else {
                        ws.send(JSON.stringify({
                            type: WS_MSG_TYPE.NO_CHANGE_ROOM_CLI,
                        }))
                    }
                }

                break;
            }
            case WS_MSG_TYPE.ENTER_ROOM_SERV: {
                let roomInfo = StorageManager.getRoomInfo(msg.payload.room.id)
                if (roomInfo == undefined)
                    roomInfo = StorageManager.createRoom(msg.payload.room);

                const userData = StorageManager.updateUserOfRoom(ws, client, msg.payload.userName, roomInfo.id);

                //send the new user all data and his uerid
                if (userData !== undefined) {
                    ws.send(JSON.stringify({
                        type: WS_MSG_TYPE.ENTER_ROOM_CLI,
                        payload: { room: roomInfo, userId: userData.participants.userId, participants: userData.participants.userList },
                    }))

                    StorageManager.broadCastMessage(roomInfo.id,
                        WS_MSG_TYPE.UPDATE_ROOM_CLI,
                        { room: roomInfo, participants: userData.participants.userList })
                }
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

                const partipantList = StorageManager.getParticipants(id);
                console.log({ existRoom: existRoom, roomInfo: roomInfo, participants: partipantList });

                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.ROOM_INFO_CLI,
                    payload: { existRoom: existRoom, roomInfo: roomInfo, participants: partipantList },
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
                 * recieve "{roomId:string, instructions:[{keyId:string, channels:number[], intensity:number}]" as payload
                 * {keyId:string, channels:number[], intensity:number} --> user pressed one key with some intensity, one key could assign multiple values
                 * send the new instruction to all clients
                 * return [{channelId:number, intensity:number}] --> for every channel new object in array
                 */
                const newInstructions = StorageManager.updateIntensities(client, msg.payload.roomId, msg.payload.instructions)
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