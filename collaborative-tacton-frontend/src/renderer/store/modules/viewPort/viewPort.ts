import { RouterNames } from '@/renderer/router/routes';
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
    currentView: RouterNames.ROOM,
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
    CHANGE_VISIBILE_VIEW = "CHANGE_VISIBILE_VIEW",
}

export type Mutations<S = State> = {
    [MutationTypes.CHANGE_VISIBILE_VIEW](state: S, view: RouterNames): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.CHANGE_VISIBILE_VIEW](state, view) {
        state.currentView = view;
    },
};

/**
 * actions
 * 
 */
 export enum ActionTypes {
    changeCurrentView = 'changeCurrentView',
  }

  type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
      key: K,
      payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>
  } & Omit<ActionContext<State, RootState>, 'commit'>
  
  export interface Actions {
    [ActionTypes.changeCurrentView](
      { commit }: AugmentedActionContext,
      payload: RouterNames
    ): void,
  }

 export const actions: ActionTree<State, RootState> & Actions = {
    changeCurrentView({ commit }, view: RouterNames) {
        commit(MutationTypes.CHANGE_VISIBILE_VIEW, view);
    },
};

/**
 * Getters
 */
export type Getters = {
    currentView(state: State): RouterNames
}

export const getters: GetterTree<State, RootState> & Getters = {
    currentView: (state) => state.currentView
};
