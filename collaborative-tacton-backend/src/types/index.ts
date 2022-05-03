export interface User {
    id: string,
    userName: string,
}

export interface Room {
    id: string,
    name: string,
    participants: User[]
}