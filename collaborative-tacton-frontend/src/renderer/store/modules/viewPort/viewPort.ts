import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { State as RootState } from '../../store';
/**
 * Tyopes
 * 
 */

/**
 * state
 * 
 */

export type State = typeof state;

export const state = {
    playGroundVisible: false,
    editModeActive: false,
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
    CHANGE_PLAY_GROUND_VISIBILE = "CHANGE_PLAY_GROUND_VISIBILE",
    CHANGE_EDIT_MODE_ACTIVE = "CHANGE_EDIT_MODE_ACTIVE",
}

export type Mutations<S = State> = {
    [MutationTypes.CHANGE_PLAY_GROUND_VISIBILE](state: S, visible: boolean): void
    [MutationTypes.CHANGE_EDIT_MODE_ACTIVE](state: S, active: boolean): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.CHANGE_PLAY_GROUND_VISIBILE](state, visible) {
        state.playGroundVisible = visible;
    },
    [MutationTypes.CHANGE_EDIT_MODE_ACTIVE](state, active) {
        state.editModeActive = active;
    },
};

/**
 * actions
 * 
 */
 export enum ActionTypes {
    changePlayGroundVisible = 'changePlayGroundVisible',
    changeEditModeActive = 'changeEditModeActive',
  }
  type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
      key: K,
      payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
  } & Omit<ActionContext<State, RootState>, 'commit'>
  
  export interface Actions {
    [ActionTypes.changePlayGroundVisible](
      { commit }: AugmentedActionContext,
      payload: boolean
    ): void,
    [ActionTypes.changeEditModeActive](
        { commit }: AugmentedActionContext,
        payload: boolean
      ): void,
  }

 export const actions: ActionTree<State, RootState> & Actions = {
    changePlayGroundVisible({ commit }, visible: boolean) {
        commit(MutationTypes.CHANGE_PLAY_GROUND_VISIBILE, visible);
    },
    changeEditModeActive({ commit }, active: boolean) {
        commit(MutationTypes.CHANGE_EDIT_MODE_ACTIVE, active);
    },
};

/**
 * Getters
 */
export type Getters = {
    playGroundVisible(state: State): boolean
    editModeActive(state: State): boolean
}

export const getters: GetterTree<State, RootState> & Getters = {
    playGroundVisible: (state) => state.playGroundVisible,
    editModeActive: (state) => state.editModeActive,
};
