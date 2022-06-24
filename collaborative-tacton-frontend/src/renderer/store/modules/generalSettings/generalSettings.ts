
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
  state: DeviceStatus,
  numOfOutputs: number,
}
/**
 * state
 * 
 */

export type State = {
  currentView: RouterNames,
  socketConnectionStatus: boolean,
  userNameChanged: boolean,
  copiedToClipboard: boolean,
  deviceList: VibrotactileDevice[]
};

export const state: State = {
  currentView: RouterNames.ROOM,
  socketConnectionStatus: false,
  userNameChanged: false,
  copiedToClipboard: false,
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
  COPIED_TO_CLIPBOARD = "COPIED_TO_CLIPBOARD"
}

export type Mutations<S = State> = {
  [GeneralMutations.CHANGE_VISIBILE_VIEW](state: S, view: RouterNames): void
  [GeneralMutations.UPDATE_SOCKET_CONNECTION](state: S, status: boolean): void
  [GeneralMutations.USER_NAME_CHANGED](state: S, isChanged: boolean): void
  [GeneralMutations.COPIED_TO_CLIPBOARD](state: S, copiedToClipboard: boolean): void
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
  [GeneralMutations.COPIED_TO_CLIPBOARD](state, copiedToClipboard) {
    state.copiedToClipboard = copiedToClipboard;
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
  userNameGetSaved = "userNameGetSaved",
  copyAdressToClipboard = "copyAdressToClipboard",
  setNumberOfOutPuts = "setNumberOfOutPuts"
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
  [GeneralSettingsActionTypes.copyAdressToClipboard](
    { commit }: AugmentedActionContext
  ): void;
  [GeneralSettingsActionTypes.setNumberOfOutPuts](
    { commit }: AugmentedActionContext,
    payload: { deviceId: string, numOfOutputs: number }
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
    commit(GeneralMutations.USER_NAME_CHANGED, true);
    setTimeout(() => (commit(GeneralMutations.USER_NAME_CHANGED, false)), 3000);
  },
  [GeneralSettingsActionTypes.copyAdressToClipboard]({ commit }) {
    commit(GeneralMutations.COPIED_TO_CLIPBOARD, true);
    setTimeout(() => (commit(GeneralMutations.COPIED_TO_CLIPBOARD, false)), 3000);
  },
  [GeneralSettingsActionTypes.addNewDevice]({ commit }, newDevice: VibrotactileDevice) {
    if (state.deviceList.some(device => device.id == newDevice.id))
      return;

    commit(GeneralMutations.ADD_DEVICE, newDevice);
  },
  [GeneralSettingsActionTypes.updateDeviceStatus]({ commit }, modifiedDevice: VibrotactileDevice) {
    const index = state.deviceList.findIndex(device => device.id === modifiedDevice.id);
    //no device found
    if (index == -1)
      return;

    commit(GeneralMutations.UPDATE_DEVICE, { index: index, device: modifiedDevice });
  },
  [GeneralSettingsActionTypes.setNumberOfOutPuts]({ commit }, payload: { deviceId: string, numOfOutputs: number }) {
    const index = state.deviceList.findIndex(device => device.id === payload.deviceId);
    //no device found
    if (index == -1)
      return;

    commit(GeneralMutations.UPDATE_DEVICE, { index: index, device: { ...state.deviceList[index], numOfOutputs: payload.numOfOutputs } });
  },
};

/**
 * Getters
 */
export type Getters = {
  currentView(state: State): RouterNames,
  isConnectedToSocket(state: State): boolean,
  getDeviceStatus(state: State): (id: string) => DeviceStatus,
  getConnectedDevice(state: State): VibrotactileDevice | undefined,
  getNumberOfOutputs(state: State): number
}

export const getters: GetterTree<State, RootState> & Getters = {
  currentView: (state) => state.currentView,
  isConnectedToSocket: (state) => state.socketConnectionStatus,
  getDeviceStatus: (state) => (id) => {
    const index = state.deviceList.findIndex(
      (deviceStore) => deviceStore.id === id
    );
    if (index == -1)
      return DeviceStatus.loading;

    return state.deviceList[index].state;
  },
  getConnectedDevice: (state) => {
    return state.deviceList.find(device => device.state == "connected");
  },
  getNumberOfOutputs: (state) => {
    const device = getters.getConnectedDevice(state);
    //12 is default so the user without the device will at least see 12 graphs
    /**
     * for testing we use only 8 actauators always just, uncomment the code to set default to 12 and use the number you get from the device
    if (device == undefined) return 12;
    if (device.numOfOutputs == undefined) return 12;
    return device.numOfOutputs;
     */
    return 8;
  }
};
