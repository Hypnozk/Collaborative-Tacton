import { Store } from "../../store/store";
import { RoomMutations, RoomSettingsActionTypes } from "../../store/modules/roomSettings/roomSettings";
import { WS_MSG_TYPE } from "./ws_types";
import { RouterNames } from "@/types/Routernames";
import router from "@/renderer/router";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";

export interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

export const handleMessage = (store: Store, msg: SocketMessage) => {
    switch (msg.type) {
        case WS_MSG_TYPE.SEND_ROOM_INFO: {
            store.dispatch(RoomSettingsActionTypes.addRoomInformations, msg.payload)
            console.log("SEND_ROOM_INFO")
            console.log(msg.payload)
            if (store.state.generalSettings.currentView == RouterNames.ROOM)
                router.push("/setup");
            break;
        }
        case WS_MSG_TYPE.ENTER_ROOM_FINISHED: {
            store.dispatch(RoomSettingsActionTypes.enterRoom, msg.payload)
            console.log(store.state.generalSettings.currentView)
            if (store.state.generalSettings.currentView == RouterNames.SETUP)
                router.push("/playGround");
            break;
        }
        case WS_MSG_TYPE.UPDATE_USER_ACCOUNT_CLI: {
            console.log("UPDATE_USER_ACCOUNT_CLI")
            console.log(msg.payload)
            store.commit(RoomMutations.UPDATE_PARTICIPANTS, msg.payload)
            break;
        }
        case WS_MSG_TYPE.SEND_INSTRUCTION_CLI: {
            window.api.send(IPC_CHANNELS.main.executeTask, msg.payload);
            store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, msg.payload)
            break;
        }
        case WS_MSG_TYPE.UPDATE_RECORD_MODE_CLI: {
            store.commit(RoomMutations.UPDATE_RECORD_MODE, msg.payload)
            break;
        }
    }

}