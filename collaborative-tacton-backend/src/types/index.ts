export interface User {
    id: string,
    name: string,
    ws?: WebSocket
}

export interface Room {
    id: string,
    name: string,
    description: string,
    participantId: string
}