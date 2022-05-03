
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState } from '../../store';
import { RouterNames } from '../../../../types/Routernames';
/**
 * Tyopes
 * 
 */

/**
 * state
 * 
 */

export type State = {
  currentView: RouterNames,
  webSocketClient: WebSocket | null,
  socketConnectionStatus: boolean
};

export const state: State = {
  currentView: RouterNames.ROOM,
  webSocketClient: null,
  socketConnectionStatus: true
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
  CHANGE_VISIBILE_VIEW = "CHANGE_VISIBILE_VIEW",
  UPDATE_WEBSOCKET_CLIENT = "UPDATE_WEBSOCKET_CLIENT",
  UPDATE_SOCKET_CONNECTION = "UPDATE_SOCKET_CONNECTION"
}

export type Mutations<S = State> = {
  [MutationTypes.CHANGE_VISIBILE_VIEW](state: S, view: RouterNames): void
  [MutationTypes.UPDATE_WEBSOCKET_CLIENT](state: S, webSocket: WebSocket): void
  [MutationTypes.UPDATE_SOCKET_CONNECTION](state: S, status: boolean): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.CHANGE_VISIBILE_VIEW](state, view) {
    state.currentView = view;
  },
  [MutationTypes.UPDATE_WEBSOCKET_CLIENT](state, webSocket) {
    state.webSocketClient = webSocket;
  },
  [MutationTypes.UPDATE_SOCKET_CONNECTION](state, status) {
    state.socketConnectionStatus = status;
  },
};

/**
 * actions
 * 
 */
export enum GeneralSettingsActionTypes {
  changeCurrentView = 'changeCurrentView',
  addSocketClient = 'addSocketClient',
  updateSocketConnectionStatus = 'updateSocketConnectionStatus',
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
  [GeneralSettingsActionTypes.addSocketClient](
    { commit }: AugmentedActionContext,
    payload: WebSocket, // Obsolete in here but left as an example
  ): void;
  [GeneralSettingsActionTypes.updateSocketConnectionStatus](
    { commit }: AugmentedActionContext,
    payload: boolean, // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [GeneralSettingsActionTypes.changeCurrentView]({ commit }, view: RouterNames) {
    commit(MutationTypes.CHANGE_VISIBILE_VIEW, view);
  },
  [GeneralSettingsActionTypes.addSocketClient]({ commit }, webSocket: WebSocket) {
    commit(MutationTypes.UPDATE_WEBSOCKET_CLIENT, webSocket);
  },
  [GeneralSettingsActionTypes.updateSocketConnectionStatus]({ commit }, status: boolean) {
    commit(MutationTypes.UPDATE_SOCKET_CONNECTION, status);
  },
};

/**
 * Getters
 */
export type Getters = {
  currentView(state: State): RouterNames,
  currentSocketClient(state: State): WebSocket | null,
  isConnectedToSocket(state: State): boolean
}

export const getters: GetterTree<State, RootState> & Getters = {
  currentView: (state) => state.currentView,
  currentSocketClient: (state) => state.webSocketClient,
  isConnectedToSocket: (state) => state.socketConnectionStatus
};
