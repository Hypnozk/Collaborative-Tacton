
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState } from '../../store';
import { RouterNames } from '../../../../types/Routernames';
/**
 * Tyopes
 * 
 */
export enum DeviceStatus {
  connected = "connected",
  disconnected = "disconnected",
  loading = "loading"
}

export interface VibrotactileDevice {
  id: string,
  name: string,
  rssi: number,
  state: DeviceStatus
}
/**
 * state
 * 
 */

export type State = {
  currentView: RouterNames,
  socketConnectionStatus: boolean,
  userNameChanged: boolean,
  deviceList: VibrotactileDevice[]
};

export const state: State = {
  currentView: RouterNames.ROOM,
  socketConnectionStatus: false,
  userNameChanged: false,
  deviceList: []
};
/**
 * mutations
 * 
 */
export enum GeneralMutations {
  CHANGE_VISIBILE_VIEW = "CHANGE_VISIBILE_VIEW",
  UPDATE_SOCKET_CONNECTION = "UPDATE_SOCKET_CONNECTION",
  USER_NAME_CHANGED = "USER_NAME_CHANGED",
  ADD_DEVICE = "ADD_DEVICE",
  UPDATE_DEVICE_LIST = "UPDATE_DEVICE_LIST",
  UPDATE_DEVICE = "UPDATE_DEVICE",
}

export type Mutations<S = State> = {
  [GeneralMutations.CHANGE_VISIBILE_VIEW](state: S, view: RouterNames): void
  [GeneralMutations.UPDATE_SOCKET_CONNECTION](state: S, status: boolean): void
  [GeneralMutations.USER_NAME_CHANGED](state: S, isChanged: boolean): void
  [GeneralMutations.ADD_DEVICE](state: S, device: VibrotactileDevice): void
  [GeneralMutations.UPDATE_DEVICE_LIST](state: S, deviceList: VibrotactileDevice[]): void
  [GeneralMutations.UPDATE_DEVICE](state: S, item: { index: number, device: VibrotactileDevice }): void
}

export const mutations: MutationTree<State> & Mutations = {
  [GeneralMutations.CHANGE_VISIBILE_VIEW](state, view) {
    state.currentView = view;
  },
  [GeneralMutations.UPDATE_SOCKET_CONNECTION](state, status) {
    state.socketConnectionStatus = status;
  },
  [GeneralMutations.USER_NAME_CHANGED](state, isChanged) {
    state.userNameChanged = isChanged;
  },
  [GeneralMutations.ADD_DEVICE](state, device) {
    state.deviceList.push(device);
  },
  [GeneralMutations.UPDATE_DEVICE_LIST](state, deviceList) {
    state.deviceList = deviceList;
  },
  [GeneralMutations.UPDATE_DEVICE](state, item) {
    state.deviceList[item.index] = item.device;
  },
};

/**
 * actions
 * 
 */
export enum GeneralSettingsActionTypes {
  changeCurrentView = 'changeCurrentView',
  updateSocketConnectionStatus = 'updateSocketConnectionStatus',
  addNewDevice = 'addNewDevice',
  updateDeviceStatus = 'updateDeviceStatus',
  userNameGetSaved = "userNameGetSaved"
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [GeneralSettingsActionTypes.changeCurrentView](
    { commit }: AugmentedActionContext,
    payload: RouterNames, // Obsolete in here but left as an example
  ): void;
  [GeneralSettingsActionTypes.updateSocketConnectionStatus](
    { commit }: AugmentedActionContext,
    payload: boolean, // Obsolete in here but left as an example
  ): void;
  [GeneralSettingsActionTypes.userNameGetSaved](
    { commit }: AugmentedActionContext, // Obsolete in here but left as an example
  ): void;
  [GeneralSettingsActionTypes.addNewDevice](
    { commit }: AugmentedActionContext,
    payload: VibrotactileDevice, // Obsolete in here but left as an example
  ): void;
  [GeneralSettingsActionTypes.updateDeviceStatus](
    { commit }: AugmentedActionContext,
    payload: VibrotactileDevice, // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [GeneralSettingsActionTypes.changeCurrentView]({ commit }, view: RouterNames) {
    commit(GeneralMutations.CHANGE_VISIBILE_VIEW, view);
  },
  [GeneralSettingsActionTypes.updateSocketConnectionStatus]({ commit }, status: boolean) {
    commit(GeneralMutations.UPDATE_SOCKET_CONNECTION, status);
  },
  [GeneralSettingsActionTypes.userNameGetSaved]({ commit }) {
    //commit(GeneralMutations.USER_NAME_CHANGED, true);
    //setTimeout(() => (commit(GeneralMutations.USER_NAME_CHANGED, false)), 3000);
  },
  [GeneralSettingsActionTypes.addNewDevice]({ commit }, newDevice: VibrotactileDevice) {
    console.log("newDevice")
    console.log(newDevice)
    if (state.deviceList.some(device => device.id == newDevice.id))
      return;

    commit(GeneralMutations.ADD_DEVICE, newDevice);
  },
  [GeneralSettingsActionTypes.updateDeviceStatus]({ commit }, modifiedDevice: VibrotactileDevice) {
    console.log("updateDeviceStatus")
    console.log(state.deviceList)
    console.log(modifiedDevice.id)
    const index = state.deviceList.findIndex(device => device.id === modifiedDevice.id);
    //no device found
    console.log(index == -1)
    if (index == -1)
      return;

    commit(GeneralMutations.UPDATE_DEVICE, { index: index, device: modifiedDevice });
  },
};

/**
 * Getters
 */
export type Getters = {
  currentView(state: State): RouterNames,
  isConnectedToSocket(state: State): boolean,
  getDeviceStatus(state: State): (id: string) => DeviceStatus,
  getConnectedDevice(state: State): VibrotactileDevice | undefined
}

export const getters: GetterTree<State, RootState> & Getters = {
  currentView: (state) => state.currentView,
  isConnectedToSocket: (state) => state.socketConnectionStatus,
  getDeviceStatus: (state) => (id) => {
    console.log("deviceId + ")
    console.log(id)

    const index = state.deviceList.findIndex(
      (deviceStore) => deviceStore.id === id
    );
    if (index == -1)
      return DeviceStatus.loading;

    return state.deviceList[index].state;
  },
  getConnectedDevice: (state) => {
    return state.deviceList.find(device => device.state == "connected");
  }
};
