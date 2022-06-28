
import { LoggingLevel } from "@/electron/FileManager/LoggingLevel";
import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { GeneralMutations } from "../../store/modules/generalSettings/generalSettings";
import { Store } from "../../store/store";
import { handleMessage } from "./messageHandler";
import { WS_MSG_TYPE } from "./ws_types";

let clientWs = null as WebSocket | null;
export const initWebsocket = (store: Store) => {
    //store.dispatch(GeneralSettingsActionTypes.addSocketClient, new WebSocket("ws://localhost:8080/patth?token=secure"));
    clientWs = new WebSocket("ws://141.56.132.33:8080/patth?token=secure")
    if (clientWs !== null) {
        clientWs.onopen = function (event: Event) {
            store.commit(GeneralMutations.UPDATE_SOCKET_CONNECTION, true);
            console.log("Opened websocket  connection " + event);
        };
        clientWs.onclose = function (event: Event) {
            store.commit(GeneralMutations.UPDATE_SOCKET_CONNECTION, false);
            console.log("Closed websocket  connection " + event);
        };
        clientWs.onerror = function (event: Event) {
            store.commit(GeneralMutations.UPDATE_SOCKET_CONNECTION, false);
            console.log("Error websocket  connection " + event);
        };
        clientWs.onmessage = function (event: MessageEvent<any>) {
            console.log("Message websocket  connection ");
            console.log(JSON.parse(event.data));
            try {
                const data = JSON.parse(event.data)
                handleMessage(store, data);
                window.api.send(IPC_CHANNELS.main.logMessageInfos, {
                    level: LoggingLevel.INFO,
                    type: data.type,
                    startTimeStamp: data.startTimeStamp,
                    endTimeStamp: data.endTimeStamp
                });
            } catch (err) {
                console.log("error Past");
                console.log(`Error occured ${err}`)
            }
        };
    }
}

export const sendSocketMessage = (msgType: WS_MSG_TYPE, payload: any) => {
    if (clientWs?.readyState == 1) {
        clientWs?.send(JSON.stringify({
            type: msgType,
            startTimeStamp: new Date().getTime(),
            payload: payload,
        }))
    }
}