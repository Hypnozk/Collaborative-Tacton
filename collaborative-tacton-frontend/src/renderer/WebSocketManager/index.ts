import { GeneralSettingsActionTypes, MutationTypes } from "../store/modules/generalSettings/generalSettings";
import { useStore } from "../store/store";

const store = useStore()
let clientWs = null as WebSocket |null;
export const initWebsocket = () => {
    //store.dispatch(GeneralSettingsActionTypes.addSocketClient, new WebSocket("ws://localhost:8080/patth?token=secure"));
    clientWs = new WebSocket("ws://localhost:8080/patth?token=secure")
    console.log("tests")
    if (clientWs !== null) {
        clientWs.onopen = function (event: Event) {
            store.commit(MutationTypes.UPDATE_SOCKET_CONNECTION, true);
            console.log("Opened websocket  connection " + event);
        };
        clientWs.onclose = function (event: Event) {
            store.commit(MutationTypes.UPDATE_SOCKET_CONNECTION, false);
            console.log("Closed websocket  connection " + event);
        };
        clientWs.onerror = function (event: Event) {
            store.commit(MutationTypes.UPDATE_SOCKET_CONNECTION, false);
            console.log("Error websocket  connection " + event);
        };
        clientWs.onmessage = function (event: Event) {
            console.log("Message websocket  connection " + event);
        };
    }
}

export const sendMessage = () => {
    clientWs?.send("my name is ts")
}