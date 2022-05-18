
import { RouterNames } from '@/types/Routernames';
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { store } from '.';
import { RootState, useStore } from '../../store';
import { GeneralMutations } from "../generalSettings/generalSettings"
/**
 * Tyopes
 * 
 */
export interface User {
  id: string,
  name: string,
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
  id: string | undefined,
  roomName: string,
  description: string,
  participants: User[],
  user: User,
};

export const state: State = {
  existRoom: false,
  id: undefined,
  roomName: "",
  description: "",
  participants: [],
  user: { id: "", name: "" },
};
/**
 * mutations
 * 
 */
export enum RoomMutations {
  CHANGE_ROOM = "CHANGE_ROOM",
  UPDATE_ROOM_NAME = "CHANGE_ROOM_NAME",
  UPDATE_ROOM_DESCRIPTION = "UPDATE_ROOM_DESCRIPTION",
  UPDATE_USER = "UPDATE_USER",
  UPDATE_USER_NAME = "UPDATE_USER_NAME",
  UPDATE_PARTICIPANTS = "UPDATE_PARTICIPANTS",
}

export type Mutations<S = State> = {
  [RoomMutations.CHANGE_ROOM](state: S, props: { existRoom: boolean, roomInfo: Room }): void
  [RoomMutations.UPDATE_ROOM_NAME](state: S, roomName: string): void
  [RoomMutations.UPDATE_ROOM_DESCRIPTION](state: S, description: string): void
  [RoomMutations.UPDATE_USER](state: S, user: User): void
  [RoomMutations.UPDATE_USER_NAME](state: S, userName: string): void
  [RoomMutations.UPDATE_PARTICIPANTS](state: S, participants: User[]): void
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
  [RoomMutations.UPDATE_USER](state, user) {
    state.user = user;
  },
  [RoomMutations.UPDATE_USER_NAME](state, userName) {
    state.user.name = userName;
  },
  [RoomMutations.UPDATE_PARTICIPANTS](state, participants) {
    state.participants = participants;
  },
};

/**
 * actions
 * 
 */
export enum RoomSettingsActionTypes {
  addRoomInformations = 'addRoomInformations',
  enterRoom = "enterRoom"
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
  [RoomSettingsActionTypes.enterRoom](
    { commit }: AugmentedActionContext,
    payload: { room: Room, userId: string, participants: User[] }, // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [RoomSettingsActionTypes.addRoomInformations]({ commit }, props: { existRoom: boolean, roomInfo: Room }) {
    commit(RoomMutations.CHANGE_ROOM, props);
  },
  [RoomSettingsActionTypes.enterRoom]({ commit }, props: { room: Room, userId: string, participants: User[] }) {
    const user = props.participants.find(participant => participant.id == props.userId);
    commit(RoomMutations.UPDATE_USER, { id: user!.id, name: user!.name });
    commit(RoomMutations.CHANGE_ROOM, {
      existRoom: true,
      roomInfo: {
        id: props.room.id,
        name: props.room.name,
        description: props.room.description,
        participants: props.participants,
      }
    })
  },
};

/**
 * Getters
 */
export type Getters = {
  roomTitle(state: State): string,
  userNameUpdated(state: State): boolean,
}

export const getters: GetterTree<State, RootState> & Getters = {
  roomTitle: (state) => state.roomName + "#" + state.id,
  userNameUpdated: (state) => {
    const serverItem = state.participants.find(participant => participant.id == state.user.id)
    if (serverItem == undefined) return false;

    console.log("userNameUpdated")
    console.log(serverItem)
    console.log(state.user.name)
    return serverItem.name !== state.user.name;
  }
};