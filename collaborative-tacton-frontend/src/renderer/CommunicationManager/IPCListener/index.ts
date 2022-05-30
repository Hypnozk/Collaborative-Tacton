import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { useStore } from "../../store/store";
import { GeneralSettingsActionTypes, VibrotactileDevice } from "@/renderer/store/modules/generalSettings/generalSettings";

const store = useStore()
export const initIPCListener = () => {
  window.api.receive(IPC_CHANNELS.renderer.foundDevice, (device: VibrotactileDevice) => {
    //console.log("Get from main " + device);
    store.dispatch(GeneralSettingsActionTypes.addNewDevice, device)
  });

  window.api.receive(IPC_CHANNELS.renderer.deviceStatusChanged, (device: VibrotactileDevice) => {
    console.log("Get from main " + device);
    store.dispatch(GeneralSettingsActionTypes.updateDeviceStatus, device)
  });

  window.api.receive(IPC_CHANNELS.renderer.numberOfOutputsDiscovered, (payload:{deviceId:string, numOfOutputs:number}) => {
    store.dispatch(GeneralSettingsActionTypes.setNumberOfOutPuts, payload)
  });

}