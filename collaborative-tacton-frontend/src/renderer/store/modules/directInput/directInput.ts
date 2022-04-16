import { MutationTree, GetterTree } from 'vuex'
import { ActionTree, ActionContext } from 'vuex'
import { State as RootState } from '../../store';
import { ipcRenderer } from 'electron'

/**
 * Tyopes
 * 
 */
type Channel = {
  id: string[],
  intensities: number[]
};

export type InputButton = {
  channels: string[],
  color: string,
  intensity: number,
  name: string,
  key: string,
  i: number,
  h: number,
  w: number,
  x: number,
  y: number,
}
/**
 * state
 * 
 */

export type State = typeof state;

export const state = {
  activeChannels: [] as Channel[],
  activeKeys: [] as string[],
  globalIntensity: 1,
  gridColNum: 10,
  gridLayout: [] as InputButton[],
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
  ADD_ACTIVE_CHANNEL = "ADD_ACTIVE_CHANNEL",
  ADD_ACTIVE_KEY = "ADD_ACTIVE_KEY",
  ADD_BUTTON_TO_GRID = "ADD_BUTTON_TO_GRID",
  DELETE_BUTTON_FROM_GRID = "DELETE_BUTTON_FROM_GRID",
  EDIT_BUTTON_FROM_GRID = "EDIT_BUTTON_FROM_GRID",
  REMOVE_ACTIVE_CHANNEL = "REMOVE_ACTIVE_CHANNEL",
  REMOVE_ACTIVE_KEY = "REMOVE_ACTIVE_KEY",
  RESET_GRID = "RESET_GRID",
  SET_GLOBAL_INTENSITY = "SET_GLOBAL_INTENSITY",
  UPDATE_POSITION_BUTTON = "UPDATE_POSITION_BUTTON",
}

export type Mutations<S = State> = {
  [MutationTypes.ADD_ACTIVE_CHANNEL](state: S, adChannel: { id: string[], intensity: number }): void
  [MutationTypes.ADD_ACTIVE_KEY](state: S, key: string): void
  [MutationTypes.ADD_BUTTON_TO_GRID](state: S, inputButton: InputButton): void
  [MutationTypes.DELETE_BUTTON_FROM_GRID](state: S, key: string): void
  [MutationTypes.EDIT_BUTTON_FROM_GRID](state: S, inputButton: InputButton): void
  [MutationTypes.UPDATE_POSITION_BUTTON](state: S, updateInfo: { key: string, x: number, y: number }): void
  [MutationTypes.REMOVE_ACTIVE_CHANNEL](state: S, activeChannel: { id: string[], intensity: number }): void
  [MutationTypes.REMOVE_ACTIVE_KEY](state: S, key: string): void
  [MutationTypes.RESET_GRID](state: S, temp: string): void
  [MutationTypes.SET_GLOBAL_INTENSITY](state: S, intensity: number): void
}
/**
 const ADD_ACTIVE_CHANNEL = "ADD_ACTIVE_CHANNEL";
 const ADD_ACTIVE_KEY = "ADD_ACTIVE_KEY";
 const ADD_BUTTON_TO_GRID = "ADD_BUTTON_TO_GRID";
 const DELETE_BUTTON_FROM_GRID = "DELETE_BUTTON_FROM_GRID";
 const EDIT_BUTTON_FROM_GRID = "EDIT_BUTTON_FROM_GRID";
 const REMOVE_ACTIVE_CHANNEL = "REMOVE_ACTIVE_CHANNEL";
 const REMOVE_ACTIVE_KEY = "REMOVE_ACTIVE_KEY";
 const RESET_GRID = "RESET_GRID";
 const SET_GLOBAL_INTENSITY = "SET_GLOBAL_INTENSITY";
 */

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_ACTIVE_CHANNEL](state, { id, intensity }) {
    const index = state.activeChannels.findIndex(
      (channel) => channel.id === id
    );
    if (index < 0) state.activeChannels.push({ id, intensities: [intensity] });
    else state.activeChannels[index].intensities.push(intensity);
  },
  [MutationTypes.ADD_ACTIVE_KEY](state, key) {
    if (!state.activeKeys.includes(key)) state.activeKeys.push(key);
  },
  [MutationTypes.ADD_BUTTON_TO_GRID](
    state,
    inputButton: InputButton
  ) {
    state.gridLayout.push(
      inputButton
    );
  },

  [MutationTypes.DELETE_BUTTON_FROM_GRID](state, key) {
    const button = state.gridLayout.find((b) => b.key === key);
    if (button !== undefined) {
      const index = state.gridLayout.indexOf(button);
      if (index > -1) state.gridLayout.splice(index, 1);
    }
  },
  [MutationTypes.EDIT_BUTTON_FROM_GRID](state, inputButton) {
    const button = state.gridLayout.find((b) => b.key === inputButton.key);
    if (button !== undefined) {
      const index = state.gridLayout.indexOf(button);
      if (index > -1) {
        state.gridLayout[index].color = inputButton.color;
        state.gridLayout[index].name = inputButton.name;
        state.gridLayout[index].intensity = inputButton.intensity;
        state.gridLayout[index].key = inputButton.key;
        state.gridLayout[index].channels = inputButton.channels;
      }
    }
  },
  [MutationTypes.UPDATE_POSITION_BUTTON](state, { key, x, y }) {
    const button = state.gridLayout.find((b) => b.key === key);
    if (button !== undefined) {
      const index = state.gridLayout.indexOf(button);
      if (index > -1) {
        state.gridLayout[index].x = x;
        state.gridLayout[index].y = y;
      }
    }
  },
  [MutationTypes.REMOVE_ACTIVE_CHANNEL](state, activeChannel: { id: string[], intensity: number }) {
    const index = state.activeChannels.findIndex(
      (channel) => channel.id === activeChannel.id
    );
    if (index > -1) {
      if (state.activeChannels[index].intensities.length <= 1)
        state.activeChannels.splice(index, 1);
      else {
        const intensityIndex =
          state.activeChannels[index].intensities.indexOf(activeChannel.intensity);
        state.activeChannels[index].intensities.splice(intensityIndex, 1);
      }
    }
  },
  [MutationTypes.REMOVE_ACTIVE_KEY](state, key: string) {
    const index = state.activeKeys.indexOf(key);
    if (index > -1) state.activeKeys.splice(index, 1);
  },
  [MutationTypes.RESET_GRID](state) {
    state.gridLayout = [];
  },
  [MutationTypes.SET_GLOBAL_INTENSITY](state, intensity) {
    state.globalIntensity = intensity;
  },
};

/**
 * actions
 * 
 */

export enum ActionTypes {
  addActiveChannel = 'addActiveChannel',
  addActiveKey = 'addActiveKey',
  addButtonToGrid = 'addButtonToGrid',
  deleteButtonFromGrid = 'deleteButtonFromGrid',
  editButtonFromGrid = 'editButtonFromGrid',
  loadGridFromFile = 'loadGridFromFile',
  removeActiveChannel = 'removeActiveChannel',
  removeActiveKey = 'removeActiveKey',
  setGlobalIntensity = 'setGlobalIntensity',
  updateButtonPosition = 'updateButtonPosition',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [ActionTypes.addActiveChannel](
    { commit }: AugmentedActionContext,
    payload: { id: string[], intensity: number }
  ): void,
  [ActionTypes.addActiveKey](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.addButtonToGrid](
    { commit }: AugmentedActionContext,
    payload: {
      channels: string[],
      color: string,
      intensity: number,
      name: string,
      key: string,
      h: number,
      w: number,
      x: number,
      y: number,
    }
  ): void,
  [ActionTypes.deleteButtonFromGrid](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.editButtonFromGrid](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.loadGridFromFile](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.removeActiveChannel](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.removeActiveKey](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.setGlobalIntensity](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.updateButtonPosition](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
}
/**
export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.GET_COUTNER]({ commit }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = 256
        commit(MutationTypes.SET_COUNTER, data)
        resolve(data)
      }, 500)
    })
  },
}
 */

declare global {
  interface Window {
    api: any;
  }
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.addActiveChannel]({ commit }, adChannels: { id: string[], intensity: number }) {
    commit(MutationTypes.ADD_ACTIVE_CHANNEL, adChannels);
  },
  [ActionTypes.addActiveKey]({ commit, state }, key: string) {
    const win: any = window;
    console.log("Start sending")
    window.api.send("tactile-jam.send.output.scanning", "renderer");
    //ipcRenderer.send('asynchronous-message', 'ping')
    const item = state.gridLayout.find(
      (item: any) => item.key.toUpperCase() === key
    );
    if (item) {
      console.log("correctItem" + item)

      commit(MutationTypes.ADD_ACTIVE_KEY, key);
    }
  },
  [ActionTypes.addButtonToGrid]({ commit }, button: {
    channels: string[],
    color: string,
    intensity: number,
    name: string,
    key: string,
    h: number,
    w: number,
    x: number,
    y: number,
  }) {
    commit(MutationTypes.ADD_BUTTON_TO_GRID, { ...button, i: state.gridLayout.length });
  },
  [ActionTypes.deleteButtonFromGrid]({ commit }, key: string) {
    commit(MutationTypes.DELETE_BUTTON_FROM_GRID, key);
  },
  [ActionTypes.editButtonFromGrid]({ commit }, inputButton: InputButton) {
    commit(MutationTypes.EDIT_BUTTON_FROM_GRID, inputButton);
  },
  [ActionTypes.loadGridFromFile]({ commit }, newGrid: InputButton[]) {
    if (newGrid.length <= 0) return;
    commit(MutationTypes.RESET_GRID, "strting");
    newGrid.forEach((item: any) => {
      // dispatch("addButtonToGrid", item);
    });
  },
  [ActionTypes.removeActiveChannel]({ commit }, adChannels: { id: string[], intensity: number }) {
    commit(MutationTypes.REMOVE_ACTIVE_CHANNEL, adChannels);
  },
  [ActionTypes.removeActiveKey]({ commit }, key: string) {
    commit(MutationTypes.REMOVE_ACTIVE_KEY, key);
  },
  [ActionTypes.setGlobalIntensity]({ commit }, intensity: number) {
    commit(MutationTypes.SET_GLOBAL_INTENSITY, intensity);
  },
  [ActionTypes.updateButtonPosition]({ commit }, updateInfo: { key: string, x: number, y: number }) {
    commit(MutationTypes.UPDATE_POSITION_BUTTON, updateInfo);
  }
};

export type Getters = {
  activeChannels(state: State): Channel[]
  channelsActive(state: State): any
  globalIntensity(state: State): number
  gridColNum(state: State): number
  gridLayout(state: State): any[]
  keyAlreadyActive(state: State): any
  keyAlreadyTaken(state: State): any
}

export const getters: GetterTree<State, RootState> & Getters = {
  activeChannels: (state) => state.activeChannels,
  channelsActive: (state) => (channels: any) =>
    channels.every((ch: any) => state.activeChannels.some((aCh) => aCh.id === ch)),
  globalIntensity: (state) => state.globalIntensity,
  gridColNum: (state) => state.gridColNum,
  gridLayout: (state) => state.gridLayout,
  keyAlreadyActive: (state) => (key: any) =>
    state.activeKeys.some((ak) => ak === key),
  keyAlreadyTaken: (state) => (key: any) =>
    state.gridLayout.some((button) => button.key === key),
};
