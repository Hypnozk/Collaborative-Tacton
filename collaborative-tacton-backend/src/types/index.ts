export interface User {
    id: string,
    userName: string,
}

export interface Room {
    id: string,
    name: string,
    description:string,
    participants: User[]
}