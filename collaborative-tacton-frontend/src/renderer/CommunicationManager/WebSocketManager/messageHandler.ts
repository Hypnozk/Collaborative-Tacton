import { useStore } from "../../store/store";
import { RoomSettingsActionTypes } from "../../store/modules/roomSettings/roomSettings";
import { WS_MSG_TYPE } from "./ws_types";

export interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

const store = useStore();
export const handleMessage = (msg: SocketMessage) => {
    switch (msg.type) {
        case WS_MSG_TYPE.SEND_ROOM_INFO: {
            store.dispatch(RoomSettingsActionTypes.addRoomInformations, msg.payload)
            break;
        }
    }

}