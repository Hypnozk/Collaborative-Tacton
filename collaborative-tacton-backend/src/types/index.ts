/**
 * custom types used in the backend
 */
export interface User {
    id: string,
    name: string,
    color:string
}

export interface RoomMetaData {
    id: string,
    name: string,
    description: string,
}

export interface Room extends RoomMetaData{
    isRecording:boolean,
    maxDurationRecord:number,
}

export interface TactileTask {
    channel: number[],
    intensity: number
}

export interface ServerInstruction extends TactileTask {
    keyId: string
}

export interface Intensity {
    keyId: string,
    clientId: string,
    intensity: number
}

export interface Channel {
    id: string,
    intensityList: Intensity[],
}

interface InstructionSetParameter {
    setParameter: any
}

interface InstructionWait {
    wait: {
        miliseconds:number
    }
}
type Instructions = InstructionSetParameter | InstructionWait;

export type TactonInstruction = {
    Instruction: Instructions
}

export interface ClientInstrution{
    channelId: string, 
    intensity: number, 
    author: User | undefined 
}