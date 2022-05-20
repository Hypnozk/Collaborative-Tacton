export interface User {
    id: string,
    name: string,
    ws?: WebSocket
}

export interface Room {
    id: string,
    name: string,
    description: string,
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
    intensityList: Intensity[]
}