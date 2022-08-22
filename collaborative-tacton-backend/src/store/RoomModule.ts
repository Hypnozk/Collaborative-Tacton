import { Channel, ClientInstrution, Room, User } from "../types";
import TactonModule from "./TactonModule";
import UserModule from "./UserModule";

//contain all metadata of one room
let roomList: Map<string, Room> = new Map<string, Room>();
//custom list, to calculate the operations of the vibrotactile device for the distributon
let channelList: Map<string, Channel[]> = new Map<string, Channel[]>();

const getRoomInfo = (id: string): Room | undefined => {
    return roomList.get(id);
}

const getNewRoomName = () => {
    const today = new Date();
    return `room${roomList.size}--${today.getHours()}:${today.getMinutes()}`;
}

const generateRoomId = (): string => {
    let isNewId = false;
    const min = 100000;
    const max = 900000;
    let num: string;
    do {
        num = (Math.floor(Math.random() * max) + min).toString();
        isNewId = roomList.has(num);
    } while (isNewId)


    return num;
}

const createRoom = (room: Room): string => {
    console.log("createRoom")
    const roomId = generateRoomId();
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
    if (room == undefined) return undefined;

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


/**
 * method to calculate the vibrotactile device operation for every delivered instruction
 * @param clientId:string of the user
 * @param roomId:string the room of the user 
 * @param instructionList:[] instructions of the user
 * @returns clientinstructions to distribute on all clients
 */
const updateIntensities = (clientId: string, roomId: string, instructionList: [{ keyId: string, channels: string[], intensity: number }]): Array<{ channelId: string, intensity: number, author: User | undefined }> | undefined => {
    const roomChannels = channelList.get(roomId);
    const clientInstruction: ClientInstrution[] = [];
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
                        const user = UserModule.getUser(roomId, clientId)
                        clientInstruction.push({ channelId: instruction.channels[i], intensity: 0, author: user });
                    } else {
                        //there are still some entries --> tell client to execute latest vibration now again
                        const user = UserModule.getUser(roomId, roomChannel.intensityList[roomChannel.intensityList.length - 1].clientId)
                        clientInstruction.push({
                            channelId: instruction.channels[i],
                            intensity: roomChannel.intensityList[roomChannel.intensityList.length - 1].intensity,
                            author: user
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
                const user = UserModule.getUser(roomId, clientId)
                clientInstruction.push({ channelId: instruction.channels[i], intensity: instruction.intensity, author: user });
            }
        }
    });
    return clientInstruction;
}

const updateRecordMode = (roomId: string, shouldRecord: boolean): boolean => {
    const room = roomList.get(roomId);
    if (room == undefined) return false;

    room.isRecording = shouldRecord;
    return true;
}

const updateMaxDuration = (roomId: string, maxDuration: number): boolean => {
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