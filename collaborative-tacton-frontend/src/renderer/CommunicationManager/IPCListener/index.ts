import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { useStore } from "../../store/store";
import { VibrotactileDevice } from "@/renderer/store/modules/generalSettings/generalSettings";

const store = useStore()
export const initIPCListener = () => {
    window.api.receive(IPC_CHANNELS.renderer.foundDevice, (arg:VibrotactileDevice) => {
        console.log("Get from main " + arg);
        console.log(arg);
      });
    
}