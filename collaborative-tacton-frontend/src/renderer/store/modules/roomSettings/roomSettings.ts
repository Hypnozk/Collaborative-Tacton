
import { RouterNames } from '@/types/Routernames';
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '../../store';
import { GeneralMutations } from "../generalSettings/generalSettings"
/**
 * Tyopes
 * 
 */
export interface User {
  id: string,
  userName: string,
}

export interface Room {
  id: string,
  name: string,
  description: string,
  participants: User[]
}


/**
 * state
 * 
 */

export type State = {
  existRoom: boolean
  id: string,
  roomName: string,
  description: string,
  participants: User[],
  userName: string,
};

export const state: State = {
  existRoom: false,
  id: "",
  roomName: "",
  description: "",
  participants: [],
  userName: "",
};
/**
 * mutations
 * 
 */
export enum RoomMutations {
  CHANGE_ROOM = "CHANGE_ROOM",
  UPDATE_ROOM_NAME = "CHANGE_ROOM_NAME",
  UPDATE_ROOM_DESCRIPTION = "UPDATE_ROOM_DESCRIPTION",
  UPDATE_USER_NAME = "UPDATE_USER_NAME",
}

export type Mutations<S = State> = {
  [RoomMutations.CHANGE_ROOM](state: S, props: { existRoom: boolean, roomInfo: Room }): void
  [RoomMutations.UPDATE_ROOM_NAME](state: S, roomName: string): void
  [RoomMutations.UPDATE_ROOM_DESCRIPTION](state: S, description: string): void
  [RoomMutations.UPDATE_USER_NAME](state: S, userName: string): void
}

export const mutations: MutationTree<State> & Mutations = {
  [RoomMutations.CHANGE_ROOM](state, props) {
    state.existRoom = props.existRoom;
    state.id = props.roomInfo.id;
    state.roomName = props.roomInfo.name;
    state.description = props.roomInfo.description;
    state.participants = props.roomInfo.participants;
  },
  [RoomMutations.UPDATE_ROOM_NAME](state, roomName) {
    state.roomName = roomName;
  },
  [RoomMutations.UPDATE_ROOM_DESCRIPTION](state, description) {
    state.description = description;
  },
  [RoomMutations.UPDATE_USER_NAME](state, userName) {
    state.userName = userName;
  },
};

/**
 * actions
 * 
 */
export enum RoomSettingsActionTypes {
  addRoomInformations = 'addRoomInformations',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [RoomSettingsActionTypes.addRoomInformations](
    { commit }: AugmentedActionContext,
    payload: { existRoom: boolean, roomInfo: Room }, // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [RoomSettingsActionTypes.addRoomInformations]({ commit }, props: { existRoom: boolean, roomInfo: Room }) {
    console.log(props)
    commit(RoomMutations.CHANGE_ROOM, props);
  },
};

/**
 * Getters
 */
export type Getters = {
  roomTitle(state: State): string
}

export const getters: GetterTree<State, RootState> & Getters = {
  roomTitle: (state) => state.roomName + "#" + state.id,
};
