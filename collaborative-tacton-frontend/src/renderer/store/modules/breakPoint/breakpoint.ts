import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { State as RootState } from '../../store';

const breakpoints = {
  mobile: 600,
  tabletPortrait: 960,
  desktop: 1280,
  bigDesktop: 1921,
};

/**
 * state
 * 
 */
export type State = typeof state;
export const state = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * mutations
 * 
 */
export enum MutationTypes {
  UPDATE_SIZE = "UPDATE_SIZE",
}

export type Mutations<S = State> = {
  [MutationTypes.UPDATE_SIZE](state: S, size: { width: number, height: number }): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.UPDATE_SIZE](state, { width, height }) {
    state.width = width;
    state.height = height;
  },
};


/**
 * actions
 * 
 */
export enum ActionTypes {
  handleResize = 'handleResize',
}
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [ActionTypes.handleResize](
    { commit }: AugmentedActionContext,
    payload: { width: number, height: number }
  ): void,
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.handleResize]({ commit }: AugmentedActionContext, size: { width: number, height: number }) {
    commit(MutationTypes.UPDATE_SIZE, size);
  },
};

/**
 * Getters
 */
export type Getters = {
  forPhoneOnly(state: State): boolean
  forTabletPortraitUp(state: State): boolean
  forTabletPortraitDown(state: State): boolean
  forTabletLandscapeUp(state: State): boolean
  forTabletLandscapeDown(state: State): boolean
  forDesktopUp(state: State): boolean
  forDesktopDown(state: State): boolean
  forBigDesktopUp(state: State): boolean
  forTabletOnly(state: State): boolean
  forTabletAndDesktop(state: State): boolean
}

export const getters: GetterTree<State, RootState> & Getters = {
  forPhoneOnly: (state) => state.width <= breakpoints.mobile,
  forTabletPortraitUp: (state) => state.width >= breakpoints.mobile,
  forTabletPortraitDown: (state) => state.width < breakpoints.tabletPortrait,
  forTabletLandscapeUp: (state) => state.width >= breakpoints.tabletPortrait,
  forTabletLandscapeDown: (state) => state.width < breakpoints.desktop,
  forDesktopUp: (state) => state.width >= breakpoints.desktop,
  forDesktopDown: (state) => state.width < breakpoints.bigDesktop,
  forBigDesktopUp: (state) => state.width >= breakpoints.bigDesktop,
  forTabletOnly: (state) =>
    state.width >= breakpoints.mobile && state.width < breakpoints.desktop,
  forTabletAndDesktop: (state) =>
    state.width >= breakpoints.mobile && state.width < breakpoints.bigDesktop,
};
