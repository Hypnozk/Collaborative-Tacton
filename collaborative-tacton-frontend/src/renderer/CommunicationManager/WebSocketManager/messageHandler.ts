import { Store } from "../../store/store";
import { RoomMutations, RoomSettingsActionTypes, RoomState } from "../../store/modules/roomSettings/roomSettings";
import { WS_MSG_TYPE } from "./ws_types";
import { RouterNames } from "@/types/Routernames";
import router from "@/renderer/router";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { TactonMutations, TactonSettingsActionTypes } from "@/renderer/store/modules/tactonSettings/tactonSettings";
import { GeneralSettingsActionTypes } from "@/renderer/store/modules/generalSettings/generalSettings";

export interface SocketMessage {
    type: WS_MSG_TYPE;
    payload: any;
}

export const handleMessage = (store: Store, msg: SocketMessage) => {
    switch (msg.type) {
        case WS_MSG_TYPE.ROOM_INFO_CLI: {
            console.log(msg.payload)
            if (store.state.generalSettings.currentView == RouterNames.ROOM) {
                store.commit(RoomMutations.CHANGE_ROOM, { roomState: RoomState.Create, roomInfo: { ...msg.payload.roomInfo, participants: msg.payload.participants, } })
                router.push("/setup");
            }

            break;
        }
        case WS_MSG_TYPE.ENTER_ROOM_CLI: {
            console.log("ENTER_ROOM_CLI")
            store.dispatch(RoomSettingsActionTypes.enterRoom, msg.payload)
            if (store.state.generalSettings.currentView == RouterNames.SETUP)
                router.push("/playGround");
            break;
        }
        case WS_MSG_TYPE.UPDATE_ROOM_CLI: {
            console.log("UPDATE_ROOM_CLI")
            //console.log(msg.payload)
            store.dispatch(RoomSettingsActionTypes.updateRoom, msg.payload)
            break;
        }
        case WS_MSG_TYPE.NO_CHANGE_ROOM_CLI: {
            console.log("NO_CHANGE_ROOM_CLI")
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
            //console.log("SEND_INSTRUCTION_CLI")
            //console.log(msg.payload)
            store.dispatch(TactonSettingsActionTypes.modifySpecificChannel, msg.payload)
            store.commit(TactonMutations.UPDATE_INSERT_VALUES, true);
            if (store.state.generalSettings.currentView == RouterNames.PLAY_GROUND && !store.state.playGround.inEditMode) {
                window.api.send(IPC_CHANNELS.main.executeTask, msg.payload);
            }
            break;
        }
        case WS_MSG_TYPE.UPDATE_RECORD_MODE_CLI: {
            store.commit(RoomMutations.UPDATE_RECORD_MODE, msg.payload)
            store.commit(TactonMutations.UPDATE_INSERT_VALUES, !msg.payload);
            break;
        }
        case WS_MSG_TYPE.CHANGE_DURATION_CLI: {
            store.commit(RoomMutations.UPDATE_MAX_DURATION_TACTON, msg.payload);
            break;
        }
        case WS_MSG_TYPE.GET_TACTON_CLI: {
            console.log(msg.payload)
            if (msg.payload.length == 0) {
                store.dispatch(GeneralSettingsActionTypes.tactonLengthChanged);
            } else {
                window.api.send(IPC_CHANNELS.main.saveTacton,
                    msg.payload
                );
            }
            break;
        }
    }

}