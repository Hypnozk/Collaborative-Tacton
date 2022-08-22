import { IPC_CHANNELS } from "@/electron/IPCMainManager/IPCChannels";
import { useStore } from "../../store/store";
import { GeneralSettingsActionTypes, VibrotactileDevice } from "@/renderer/store/modules/generalSettings/generalSettings";
import { PlayGroundMutations } from "@/renderer/store/modules/playGround/types";
import { CustomSettings } from "@/electron/FileManager/initSettings";
import { RoomMutations } from "@/renderer/store/modules/roomSettings/roomSettings";

const store = useStore()
/**
 * initiate listener from the main process
 */
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

  window.api.receive(IPC_CHANNELS.renderer.initConfig, (setting:CustomSettings) => {
    store.commit(PlayGroundMutations.BULK_GRID_UPDATE, setting.buttons);
    store.commit(RoomMutations.UPDATE_USER_NAME, setting.userName);
  });

}