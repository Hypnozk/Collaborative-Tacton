import { Room, User } from "../types";

let roomList: Room[] = [];



const getRoomInfo = (id: string): Room | undefined => {
    return roomList.find(item => item.id == id);
}

export default {
    getRoomInfo
}