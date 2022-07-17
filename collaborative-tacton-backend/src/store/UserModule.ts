import { User } from "../types";
import { defaultColorUsers } from "../types/defaultColorUsers";

let participantList: Map<string, User[]> = new Map<string, User[]>();
let usedColorsList: Map<string, number[]> = new Map<string, number[]>();
let wsRoomList: Map<string, WebSocket[]> = new Map<string, WebSocket[]>();

const createRoomRef = (roomId: string) => {
    console.log("createRoomRef")
    participantList.set(roomId, []);
    usedColorsList.set(roomId, new Array(defaultColorUsers.length).fill(0));
    wsRoomList.set(roomId, []);
}

const removeRoomRef = (roomId: string) => {
    participantList.delete(roomId);
    usedColorsList.delete(roomId);
    wsRoomList.delete(roomId);
}

const getParticipants = (roomId: string): { id: string, name: string, color: string }[] => {
    const participants = participantList.get(roomId);
    if (participants == undefined)
        return [];

    return Array.from(participants, item => { return { id: item.id, name: item.name, color: item.color } });
}

const getWsRoomList = (roomId: string): WebSocket[] => {
    const wList = wsRoomList.get(roomId);
    if (wList == undefined)
        return [];

    return wList;
}

/**
     * calculate the new color for user
     */
const calculateUserColor = (roomId: string, amountOfParticipants: number): string => {
    const usedColors = usedColorsList.get(roomId)!;
    let colorId = 0;
    if (amountOfParticipants <= usedColors.length) {
        colorId = amountOfParticipants;
    } else {
        for (let i = 0; i < usedColors.length - 1; i++) {
            if (usedColors[i] > usedColors[i + 1]) {
                colorId = i + 1;
                break;
            }
        }
    }

    usedColors[colorId]++;
    return defaultColorUsers[colorId];
}
const resetUserColors = (roomId: string, participColor: string) => {
    const usedColors = usedColorsList.get(roomId);
    if (usedColors !== undefined) {
        for (let x = 0; x < defaultColorUsers.length; x++) {
            if (participColor == defaultColorUsers[x]) {
                usedColors[x]--;
                break;
            }
        }
    }
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
        const color = calculateUserColor(roomId, participants.length);
        participantList.set(roomId, [...participants, { id: userID, name: userName, color: color }])
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
            resetUserColors(roomId, participants[i].color)
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