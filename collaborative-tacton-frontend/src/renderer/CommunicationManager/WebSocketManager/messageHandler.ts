import { useStore } from "../../store/store";
import { RoomSettingsActionTypes } from "../../store/modules/roomSettings/roomSettings";
import { WS_MSG_TYPE } from "./ws_types";
import { RouterNames } from "@/types/Routernames";
import { GeneralMutations } from "@/renderer/store/modules/generalSettings/generalSettings";
import router from "@/renderer/router";

export interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

const store = useStore();
export const handleMessage = (msg: SocketMessage) => {
    switch (msg.type) {
        case WS_MSG_TYPE.SEND_ROOM_INFO: {
            store.dispatch(RoomSettingsActionTypes.addRoomInformations, msg.payload)
            if (store.state.generalSettings.currentView == RouterNames.ROOM)
                router.push("/setup");
            break;
        }
    }

}