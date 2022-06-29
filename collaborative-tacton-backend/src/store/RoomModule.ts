import { Channel, Room } from "../types";
const uuid = require('uuid');

let roomList: Map<string, Room> = new Map<string, Room>();
let channelList: Map<string, Channel[]> = new Map<string, Channel[]>();

const getRoomInfo = (id: string): Room | undefined => {
    return roomList.get(id);
}

const getNewRoomName = () => {
    const today = new Date();
    return `room${roomList.size}--${today.getHours()}:${today.getMinutes()}`;
}

const createRoom = (room: Room): string => {
    console.log("createRoom")
    const roomId: string = uuid.v1();
    channelList.set(roomId, []);
    roomList.set(roomId, {
        id: roomId,
        name: room.name,
        description: room.description,
        isRecording: false,
        maxDurationRecord: 5000,
    });

    return roomId;
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

const removeRoom = (roomId: string) => {
    channelList.delete(roomId);
    roomList.delete(roomId);
    console.log("Delete Room: " + roomList.size)
}



const updateIntensities = (clientId: string, roomId: string, instructionList: [{ keyId: string, channels: string[], intensity: number }]): Array<{ channelId: string, intensity: number }> | undefined => {
    const roomChannels = channelList.get(roomId);
    const clientInstruction: Array<{ channelId: string, intensity: number }> = [];
    //console.log("roomId: " + roomId)
    //console.log("clientId: " + clientId)
    //console.log("keyId: " + keyId)
    //console.log("channels: " + channels)
    if (roomChannels == undefined) return;

    instructionList.forEach(instruction => {
        for (let i = 0; i < instruction.channels.length; i++) {
            let roomChannel = roomChannels.find(roomChannel => roomChannel.id == instruction.channels[i]);
            let intensityIndex = -1;
            let lastEntry = false;
            if (roomChannel == undefined) {
                //channel doesn't exist create new one
                const length = roomChannels.push({ id: instruction.channels[i], intensityList: [] });
                roomChannel = roomChannels[length - 1];
            } else {
                //channel exist, check if one intensity value could be deleted
                intensityIndex = roomChannel.intensityList.findIndex(intensity => intensity.clientId == clientId && intensity.keyId == instruction.keyId);
                if (intensityIndex !== -1) {
                    lastEntry = intensityIndex == roomChannel.intensityList.length - 1;
                    roomChannel.intensityList.splice(intensityIndex, 1);
                }

            }

            if (intensityIndex !== -1 && instruction.intensity == 0) {
                //instruction was key up event,
                //console.log("instruction was key up");
                if (lastEntry) {
                    //the entry at the end was deleted, calculate new instruction for cli
                    if (roomChannel.intensityList.length == 0) {
                        // there are now no entries anymore in the list  --> tell client to stop vibrate
                        clientInstruction.push({ channelId: instruction.channels[i], intensity: 0 });
                    } else {
                        //there are still some entries --> tell client to execute latest vibration now again
                        clientInstruction.push({
                            channelId: instruction.channels[i],
                            intensity: roomChannel.intensityList[roomChannel.intensityList.length - 1].intensity
                        });
                    }
                }
            } else {
                //instruction was key down event
                //console.log("instruction was key down event");
                roomChannel.intensityList.push({
                    clientId: clientId,
                    keyId: instruction.keyId,
                    intensity: instruction.intensity
                });
                clientInstruction.push({ channelId: instruction.channels[i], intensity: instruction.intensity });
            }
        }
    });
    return clientInstruction;
}

const updateRecordMode = (roomId: string, shouldRecord: boolean):boolean => {
    const room = roomList.get(roomId);
    if (room == undefined) return false;

    room.isRecording = shouldRecord;
    return true;
}

const updateMaxDuration = (roomId: string, maxDuration: number):boolean => {
    const room = roomList.get(roomId);
    if (room == undefined) return false;
    if (room.isRecording) return false;

    room.maxDurationRecord = maxDuration;
    return true
}

export default {
    createRoom,
    getRoomInfo,
    getNewRoomName,
    updateRoomInformation,
    removeRoom,
    updateIntensities,
    updateRecordMode,
    updateMaxDuration
}