import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { State as RootState } from '../../store';
/**
 * state
 * 
 */
export type State = typeof state;
export const state = {
  deviceList: <any[]>[]
};

/**
 * mutations
 * 
 */
 export enum MutationTypes {
  ADD_DEVICE ="ADD_DEVICE"
}
export type Mutations<S = State> = {
  [MutationTypes.ADD_DEVICE](state: S, device:any): void
}
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_DEVICE](state, device) {
   state.deviceList.push(device)
  },
};

/**
 * actions
 * 
 */
 export enum ActionTypes {
  addDevice = 'addDevice',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, RootState>, 'commit'>


 export interface Actions {
  [ActionTypes.addDevice](
    { commit }: AugmentedActionContext,
    payload: any
  ): void
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.addDevice]({ commit }, device) {
    commit(MutationTypes.ADD_DEVICE, device);
  },
};

/**
 * Getters
 */
 export type Getters = {
  deviceList(state: State): Array<any>
  numberOfOutputs(state: State): number
}

export const getters: GetterTree<State, RootState> & Getters = {
  deviceList: (state) => state.deviceList,
  /**
   * original
   * @returns  
   * numberOfOutputs: (state) => {
    if (state.connectedDevices.length > 0)
      return state.connectedDevices[0][WS_DEVICE_DISPLAY.numOfOutputs];
  },
   */
  numberOfOutputs: () => {
    return 10;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
