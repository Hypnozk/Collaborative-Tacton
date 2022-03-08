import { MutationTree, GetterTree } from 'vuex'
/**
 * Tyopes
 * 
 */
type Channel = {
  id: string[],
  intensities: number[]
};

type InputButton = {
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

const state = {
  activeChannels: [] as Channel[],
  activeKeys: [] as string[],
  globalIntensity: 1,
  gridColNum: 10,
  gridLayout: [] as any[],
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
  [MutationTypes.RESET_GRID](state: S): void
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

const mutations: MutationTree<State> & Mutations = {
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
    const index = state.gridLayout.indexOf(button);
    if (index > -1) state.gridLayout.splice(index, 1);
  },
  [MutationTypes.EDIT_BUTTON_FROM_GRID](state, inputButton) {
    const button = state.gridLayout.find((b) => b.key === inputButton.key);
    const index = state.gridLayout.indexOf(button);
    if (index > -1) {
      state.gridLayout[index].color = inputButton.color;
      state.gridLayout[index].name = inputButton.name;
      state.gridLayout[index].intensity = inputButton.intensity;
      state.gridLayout[index].key = inputButton.key;
      state.gridLayout[index].channels = inputButton.channels;
    }
  },
  [MutationTypes.UPDATE_POSITION_BUTTON](state, {key, x, y }){
    const button = state.gridLayout.find((b) => b.key === key);
    const index = state.gridLayout.indexOf(button);
    if (index > -1) {
      state.gridLayout[index].x = x;
      state.gridLayout[index].y = y;
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
}


const actions = {
  addActiveChannel({ commit }: any, adChannels: { channels: string[], intensity: number }) {
    commit(MutationTypes.ADD_ACTIVE_CHANNEL, adChannels);
  },
  addActiveKey({ commit }: any, key: string) {
    commit(MutationTypes.ADD_ACTIVE_KEY, key);
  },
  addButtonToGrid({ commit }: any, button: InputButton) {
    button.i = state.gridLayout.length;
    commit(MutationTypes.ADD_BUTTON_TO_GRID, button);
  },
  deleteButtonFromGrid({ commit }: any, key: string) {
    commit(MutationTypes.DELETE_BUTTON_FROM_GRID, key);
  },
  editButtonFromGrid({ commit }: any, inputButton: InputButton) {
    commit(MutationTypes.EDIT_BUTTON_FROM_GRID, inputButton);
  },
  loadGridFromFile({ commit, dispatch }: any, newGrid: InputButton[]) {
    if (newGrid.length <= 0) return;
    commit(MutationTypes.RESET_GRID);
    newGrid.forEach((item: any) => {
      dispatch("addButtonToGrid", item);
    });
  },
  removeActiveChannel({ commit }: any, adChannels: { id: string[], intensity: number }) {
    commit(MutationTypes.REMOVE_ACTIVE_CHANNEL, adChannels);
  },
  removeActiveKey({ commit }: any, key: string) {
    commit(MutationTypes.REMOVE_ACTIVE_KEY, key);
  },
  setGlobalIntensity({ commit }: any, intensity: number) {
    commit(MutationTypes.SET_GLOBAL_INTENSITY, intensity);
  },
  updateButtonPosition({ commit }: any, updateInfo: { key: string, x: number, y: number }) {
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

const getters: GetterTree<State, State> & Getters = {
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

export default {
  state,
  mutations,
  actions,
  getters,
};
