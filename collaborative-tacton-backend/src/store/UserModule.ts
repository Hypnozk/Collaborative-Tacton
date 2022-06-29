import { User } from "../types";

let participantList: Map<string, User[]> = new Map<string, User[]>();
let wsRoomList: Map<string, WebSocket[]> = new Map<string, WebSocket[]>();

const createRoomRef = (roomId: string) => {
    console.log("createRoomRef")
    participantList.set(roomId, []);
    wsRoomList.set(roomId, []);
}

const removeRoomRef = (roomId: string) => {
    participantList.delete(roomId);
    wsRoomList.delete(roomId);
}

const getParticipants = (roomId: string): { id: string, name: string }[] => {
    const participants = participantList.get(roomId);
    if (participants == undefined)
        return [];

    return Array.from(participants, item => { return { id: item.id, name: item.name } });
}

const getWsRoomList = (roomId: string): WebSocket[] => {
    const wList = wsRoomList.get(roomId);
    if (wList == undefined)
        return [];

    return wList;
}

const updateUser = (roomId: string, user: User): boolean => {
    let updated = false;
    const participants = participantList.get(roomId);
    if (participants == undefined)
        return updated;

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == user.id) {
            participants[i] = { ...participants[i], name: user.name };
            updated = true;
            break;
        }
    }

    return updated
}

const enterUserInRoom = (ws: WebSocket, userID: string, userName: string, roomId: string): boolean => {
    const participants = participantList.get(roomId);
    if (participants == undefined) return false;
    let newUser = true;
    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == userID) {
            newUser = false;
            break;
        }
    }
    if (newUser) {
        participantList.set(roomId, [...participants, { id: userID, name: userName }])
        const wsList = wsRoomList.get(roomId)
        if (wsList !== undefined)
            wsRoomList.set(roomId, [...wsList, ws])
    }

    return newUser;

}

const removeParticipant = (roomId: string, userId: string): number | undefined => {
    //console.log("removeParticipant")
    //console.log(roomList)
    //console.log(roomList.get(roomId))
    const participants = participantList.get(roomId);
    if (participants == undefined)
        return;

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == userId) {
            participants.splice(i, 1);
            break;
        }
    }

    return participants.length;
}

const findRoomUserOfClient = (userId: string) => {
    let roomId: string | undefined = undefined;
    let foundUser: User | undefined = undefined;
    loop1: for (let [key, user] of participantList) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].id == userId) {
                roomId = key;
                foundUser = user[i];
                break loop1;
            }
        }
    }

    if (roomId == undefined) return;
    return { roomId: roomId, user: foundUser };
}

export default {
    getParticipants,
    getWsRoomList,
    createRoomRef,
    removeRoomRef,
    enterUserInRoom,
    updateUser,
    removeParticipant,
    findRoomUserOfClient
}