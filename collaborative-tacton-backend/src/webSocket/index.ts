import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

export const onMessage = (ws: WebSocket, data: any, client: string) => {
    console.log(`Received message ${data} from user ${client}`);
    console.log(data)
    //StorageManager.temp()
    try {
        let msg: SocketMessage = JSON.parse(data);
        switch (msg.type) {
            case WS_MSG_TYPE.ENTER_ROOM: {
                break;
            }
            case WS_MSG_TYPE.GET_ROOM_INFO: {
                /**
                 * recieve roomName:string as payload
                 * return {existRoom:boolean, roomInfo:Room}
                 */
                let roomInfo = StorageManager.getRoomInfo(msg.payload);
                let existRoom = true;
                console.log(msg.payload)
                if (roomInfo == undefined) {
                    existRoom = false;
                    roomInfo = {
                        id: "",
                        description: "",
                        name: msg.payload ? msg.payload : StorageManager.getNewRoomName(),
                        participants: []
                    }
                }
                ws.send(JSON.stringify({
                    type: WS_MSG_TYPE.SEND_ROOM_INFO,
                    payload: { existRoom: existRoom, roomInfo: roomInfo },
                }))
                break;
            }
        }
    } catch (err) {
        console.log("Error occured: " + err);
        ws.send("Error occured: " + err)
    }
}

export const onClose = (client: string) => {
    console.log(`Received close message  from user ${client}`);
}