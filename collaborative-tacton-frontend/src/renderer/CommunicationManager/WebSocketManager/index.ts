
import { GeneralSettingsActionTypes, GeneralMutations } from "../../store/modules/generalSettings/generalSettings";
import { Store } from "../../store/store";
import { handleMessage, SocketMessage } from "./messageHandler";
import { WS_MSG_TYPE } from "./ws_types";

let clientWs = null as WebSocket | null;
export const initWebsocket = (store: Store) => {
    //store.dispatch(GeneralSettingsActionTypes.addSocketClient, new WebSocket("ws://localhost:8080/patth?token=secure"));
    clientWs = new WebSocket("ws://localhost:8080/patth?token=secure")
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
                handleMessage(store, JSON.parse(event.data));
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
            payload: payload,
        }))
    }
}