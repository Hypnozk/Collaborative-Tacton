const uuid = require('uuid');
import { Room, User } from "../types";
import { WS_MSG_TYPE } from "../webSocket/ws_types";

let roomList: Map<string, Room> = new Map<string, Room>();
let participantList: Map<string, User[]> = new Map<string, User[]>();


const getRoomInfo = (id: string): Room | undefined => {
    return roomList.get(id);
}

const hasRoom = (): Map<string, User[]> => {
    return participantList;
}

const getNewRoomName = () => {
    const today = new Date();

    return `room${roomList.size}--${today.getHours()}:${today.getMinutes()}`;
}

const createRoom = (room: Room): Room => {
    console.log("createRoom")
    const roomId: string = uuid.v1();
    const partId: string = uuid.v1();
    participantList.set(partId, []);
    roomList.set(roomId, {
        id: roomId,
        name: room.name,
        description: room.description,
        participantId: partId
    });

    return roomList.get(roomId)!;
}

const enterRoom = (ws: WebSocket, userID: string, userName: string, roomId: string): { userId: string, userList: User[] } | undefined => {
    const rommInfo = roomList.get(roomId)
    if (rommInfo == undefined)
        return;

    const participants = [...participantList.get(rommInfo.participantId)!, { id: userID, name: userName, ws: ws }];
    participantList.set(rommInfo.participantId, participants)

    return { userId: userID, userList: Array.from(participants, item => { return { id: item.id, name: item.name } }) };
}

const updateParticipants = (roomId: string, user: User): string | undefined => {
    const participantId = roomList.get(roomId)?.participantId
    if (participantId == undefined)
        return;
    const participants = participantList.get(participantId);
    if (participants == undefined)
        return;

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == user.id) {
            participants[i] = { ...participants[i], name: user.name };
            break;
        }
    }

    return participantId
}

const sendUpdatedParticipants = (participantId: string) => {
    const participants = participantList.get(participantId)!;
    const list = Array.from(participants, item => { return { id: item.id, name: item.name } })
    console.log("sendUpdatedParticipants: ");
    console.log(list);
    for (let i = 0; i < participants.length; i++) {
        participants[i].ws?.send(JSON.stringify({
            type: WS_MSG_TYPE.UPDATE_USER_ACCOUNT_CLI,
            payload: list,
        }))
    };
}

const removeParticipant = (roomId: string, userId: string): { userInRoom: number, partId: string } | undefined => {
    console.log("removeParticipant")
    console.log(roomList)
    console.log(roomList.get(roomId))
    const participantId = roomList.get(roomId)?.participantId
    if (participantId == undefined)
        return;
    const participants = participantList.get(participantId);
    if (participants == undefined)
        return;

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == userId) {
            participants.splice(i, 1);
            break;
        }
    }

    return { userInRoom: participants.length, partId: participantId };
}

const removeRoom = (roomId: string) => {
    const participantId = roomList.get(roomId)?.participantId;
    if (participantId == undefined)
        return;

    participantList.delete(participantId);
    roomList.delete(roomId);
    console.log("Delete Room: " + roomList.size)
}

const findRoomIdOfUser = (userId: string) => {
    let partId: string | undefined = undefined;
    loop1: for (let [key, user] of participantList) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].id == userId) {
                partId = key;
                break loop1;
            }
        }
    }

    if (partId == undefined) return;
    let roomId: string | undefined = undefined;
    for (let [key, room] of roomList) {
        if (room.participantId == partId) {
            roomId = key;
            break;
        }
    }

    return roomId;
}

export default {
    getNewRoomName,
    getRoomInfo,
    hasRoom,
    createRoom,
    enterRoom,
    updateParticipants,
    sendUpdatedParticipants,
    removeParticipant,
    removeRoom,
    findRoomIdOfUser
}