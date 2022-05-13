import { Room, User } from "../types";

let roomList: Room[] = [];



const getRoomInfo = (id: string): Room | undefined => {
    return roomList.find(item => `${item.name}#${item.id}` == id);
}

const getNewRoomName = () =>{
    const today = new Date();
    return `room${roomList.length}--${today.getHours()}:${today.getMinutes()}`
}
export default {
    getNewRoomName,
    getRoomInfo
}