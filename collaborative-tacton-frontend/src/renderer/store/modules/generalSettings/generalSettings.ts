
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { State as RootState } from '../../store';
import { RouterNames } from '../../../../types/Routernames';
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
  webSocketClient: null as WebSocket | null
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
  CHANGE_VISIBILE_VIEW = "CHANGE_VISIBILE_VIEW",
  UPDATE_WEBSOCKET_CLIENT = "UPDATE_WEBSOCKET_CLIENT"
}

export type Mutations<S = State> = {
  [MutationTypes.CHANGE_VISIBILE_VIEW](state: S, view: RouterNames): void
  [MutationTypes.UPDATE_WEBSOCKET_CLIENT](state: S, webSocket: WebSocket): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.CHANGE_VISIBILE_VIEW](state, view) {
    state.currentView = view;
  },
  [MutationTypes.UPDATE_WEBSOCKET_CLIENT](state, webSocket) {
    state.webSocketClient = webSocket;
  },
};

/**
 * actions
 * 
 */
export enum ActionTypes {
  changeCurrentView = 'changeCurrentView',
  addSocketClient = 'addSocketClient',
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
  [ActionTypes.addSocketClient](
    { commit }: AugmentedActionContext,
  ): void,
}

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.changeCurrentView]({ commit }, view: RouterNames) {
    commit(MutationTypes.CHANGE_VISIBILE_VIEW, view);
  },
  [ActionTypes.addSocketClient]({ commit }) {
    //commit(MutationTypes.CHANGE_VISIBILE_VIEW, view);
    commit(MutationTypes.UPDATE_WEBSOCKET_CLIENT, new WebSocket("ws://localhost:8080/patth?token=secure"));
    console.log(state.webSocketClient?.readyState === WebSocket.CLOSED)
    if(state.webSocketClient !== null){
      console.log("tests")
      state.webSocketClient.onopen = function(event:Event) {
        console.log("Opened websocket  connection " + event);
      };
      state.webSocketClient.onclose = function(event:Event) {
        console.log("Closed websocket  connection " + event);
      };
      state.webSocketClient.onerror = function(event:Event) {
        console.log("Error websocket  connection " + event);
      };
      state.webSocketClient.onmessage = function(event:Event) {
        console.log("Message websocket  connection " + event);
      };
    }
  },
};

/**
 * Getters
 */
export type Getters = {
  currentView(state: State): RouterNames,
  currentSocketClient(state: State): WebSocket | null
}

export const getters: GetterTree<State, RootState> & Getters = {
  currentView: (state) => state.currentView,
  currentSocketClient: (state) => state.webSocketClient
};
