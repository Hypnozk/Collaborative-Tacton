import { WS_MSG_TYPE } from "./ws_types";
import StorageManager from "../store/StoreManager"
interface SocketMessage {
    type: WS_MSG_TYPE;
    data: any;
}
export const onMessage = (data: any, client: string) => {
    console.log(`Received message ${data} from user ${client}`);
    //StorageManager.temp()
    let msg: SocketMessage;
    try {
        msg = JSON.parse(data + "}");
        switch (msg.type) {
            case WS_MSG_TYPE.ENTER_ROOM: {
                break;
            }
            case WS_MSG_TYPE.GET_ROOM_INFO: {
                if (msg.data !== undefined) {
                    const roomInfo = StorageManager.getRoomInfo(msg.data);
                    console.log(roomInfo)
                }
                break;
            }
        }
    } catch (err) {
        console.log("Error occured: " + err);
        
    }
}

export const onClose = (data: any, client: string) => {
    console.log(`Received close message ${data} from user ${client}`);
}