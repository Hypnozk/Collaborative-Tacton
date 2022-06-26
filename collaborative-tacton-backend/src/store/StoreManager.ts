const uuid = require('uuid');
import { Channel, Intensity, Room, User } from "../types";
import { WS_MSG_TYPE } from "../webSocket/ws_types";

let roomList: Map<string, Room> = new Map<string, Room>();
let participantList: Map<string, User[]> = new Map<string, User[]>();
let channelList: Map<string, Channel[]> = new Map<string, Channel[]>();

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
    participantList.set(roomId, []);
    channelList.set(roomId, []);
    roomList.set(roomId, {
        id: roomId,
        name: room.name,
        description: room.description,
        isRecording: false,
        maxDurationRecord: 5000,
    });

    return roomList.get(roomId)!;
}

const updateRoomInformation = (id: string, name: string, description: string) => {
    const room = getRoomInfo(id)
    if (room == undefined) return false;

    let needUpdate = false;
    if (room.name !== name) {
        room.name = name;
        needUpdate = true;
    }
    if (room.description !== description) {
        room.description = description;
        needUpdate = true;
    }
    return needUpdate;
}
const enterRoom = (ws: WebSocket, userID: string, userName: string, roomId: string): { participants: { userId: string, userList: User[] }, updateParticipant: boolean } | undefined => {
    const participants = participantList.get(roomId);
    if (participants == undefined) return;
    let newUser = true;
    let indexUpdatedName = -1;
    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == userID) {
            newUser = false;
            if (participants[i].name !== userName)
                indexUpdatedName = i;
            break;
        }
    }
    if (newUser)
        participantList.set(roomId, [...participants, { id: userID, name: userName, ws: ws }])

    if (indexUpdatedName > -1) {
        participants[indexUpdatedName].name = userName;
        participantList.set(roomId, participants)
    }


    return {
        participants: { userId: userID, userList: Array.from(participantList.get(roomId)!, item => { return { id: item.id, name: item.name } }) },
        updateParticipant: newUser || indexUpdatedName > -1
    };
}

const updateParticipants = (roomId: string, user: User): string | undefined => {
    const participants = participantList.get(roomId);
    if (participants == undefined)
        return;

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id == user.id) {
            participants[i] = { ...participants[i], name: user.name };
            break;
        }
    }

    return roomId
}

const sendUpdatedParticipants = (roomId: string) => {
    const participants = participantList.get(roomId)!;
    const list = Array.from(participants, item => { return { id: item.id, name: item.name } })
    console.log("sendUpdatedParticipants: ");
    console.log(list);
    broadCastMessage(roomId, WS_MSG_TYPE.UPDATE_USER_ACCOUNT_CLI, list)
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

const removeRoom = (roomId: string) => {
    participantList.delete(roomId);
    channelList.delete(roomId);
    roomList.delete(roomId);
    console.log("Delete Room: " + roomList.size)
}

const findRoomIdOfUser = (userId: string) => {
    let roomId: string | undefined = undefined;
    loop1: for (let [key, user] of participantList) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].id == userId) {
                roomId = key;
                break loop1;
            }
        }
    }

    if (roomId == undefined) return;
    return roomId;
}

const updateIntensities = (clientId: string, roomId: string, keyId: string, channelsModified: string[], intensityValue: number): Array<{ channelId: string, intensity: number }> | undefined => {
    const roomChannels = channelList.get(roomId);
    const clientInstruction: Array<{ channelId: string, intensity: number }> = [];
    console.log("roomId: " + roomId)
    console.log("clientId: " + clientId)
    console.log("keyId: " + keyId)
    console.log("channelsModified: " + channelsModified)
    if (roomChannels == undefined) return;

    for (let i = 0; i < channelsModified.length; i++) {
        let roomChannel = roomChannels.find(roomChannel => roomChannel.id == channelsModified[i]);
        let intensityIndex = -1;
        let lastEntry = false;
        if (roomChannel == undefined) {
            //channel doesn't exist create new one
            console.log("createRoomChannel");
            const length = roomChannels.push({ id: channelsModified[i], intensityList: [] });
            roomChannel = roomChannels[length - 1];
        } else {
            //channel exist, check if one intensity value could be deleted
            intensityIndex = roomChannel.intensityList.findIndex(intensity => intensity.clientId == clientId && intensity.keyId == keyId);
            if (intensityIndex !== -1) {
                lastEntry = intensityIndex == roomChannel.intensityList.length - 1;
                roomChannel.intensityList.splice(intensityIndex, 1);
            }

        }

        if (intensityIndex !== -1 && intensityValue == 0) {
            //instruction was key up event,
            console.log("instruction was key up");
            if (lastEntry) {
                //the entry at the end was deleted, calculate new instruction for cli
                if (roomChannel.intensityList.length == 0) {
                    // there are now no entries anymore in the list  --> tell client to stop vibrate
                    clientInstruction.push({ channelId: channelsModified[i], intensity: 0 });
                } else {
                    //there are still some entries --> tell client to execute latest vibration now again
                    clientInstruction.push({ channelId: channelsModified[i], intensity: roomChannel.intensityList[roomChannel.intensityList.length - 1].intensity });
                }
            }
        } else {
            //instruction was key down event
            console.log("instruction was key down event");
            console.log(roomChannel)
            roomChannel.intensityList.push({
                clientId: clientId,
                keyId: keyId,
                intensity: intensityValue
            });
            clientInstruction.push({ channelId: channelsModified[i], intensity: intensityValue });
        }
    }
    return clientInstruction;
}

const broadCastMessage = (roomId: string, type: WS_MSG_TYPE, payload: any) => {
    const participants = participantList.get(roomId);
    if (participants == undefined) return;

    for (let i = 0; i < participants.length; i++) {
        participants[i].ws?.send(JSON.stringify({
            type: type,
            payload: payload,
        }))
    };
}
const updateRecordMode = (roomId: string, shouldRecord: boolean) => {
    const room = roomList.get(roomId);
    if (room == undefined) return;
    room.isRecording = shouldRecord;

    broadCastMessage(roomId, WS_MSG_TYPE.UPDATE_RECORD_MODE_CLI, room.isRecording)
}

const updateMaxDuration = (roomId: string, maxDuration: number) => {
    const room = roomList.get(roomId);
    if (room == undefined) return;
    if (room.isRecording) return;

    room.maxDurationRecord = maxDuration;
    broadCastMessage(roomId, WS_MSG_TYPE.CHANGE_DURATION_CLI, room.maxDurationRecord)
}

export default {
    getNewRoomName,
    updateRoomInformation,
    getRoomInfo,
    hasRoom,
    createRoom,
    enterRoom,
    updateParticipants,
    sendUpdatedParticipants,
    removeParticipant,
    removeRoom,
    findRoomIdOfUser,
    updateIntensities,
    broadCastMessage,
    updateRecordMode,
    updateMaxDuration
}