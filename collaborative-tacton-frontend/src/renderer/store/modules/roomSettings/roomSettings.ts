
import { RouterNames } from '@/types/Routernames';
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '../../store';
import { MutationTypes as GeneralMutations } from "../generalSettings/generalSettings"
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
  participants: User[]
}


/**
 * state
 * 
 */

export type State = {
  id: string,
  name: string,
  participants: User[]
};

export const state: State = {
  id: "",
  name: "",
  participants: []
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
  CHANGE_ROOM = "CHANGE_ROOM",
  UPDATE_ROOM_NAME = "CHANGE_ROOM_NAME",
}

export type Mutations<S = State> = {
  [MutationTypes.CHANGE_ROOM](state: S, room: Room): void
  [MutationTypes.UPDATE_ROOM_NAME](state: S, name: string): void
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.CHANGE_ROOM](state, room) {
    state.id = room.id;
    state.name = room.name;
    state.participants = room.participants;
  },
  [MutationTypes.UPDATE_ROOM_NAME](state, name) {
    console.log("is updating")
    state.name = name;
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
    payload: Room, // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [RoomSettingsActionTypes.addRoomInformations]({ commit }, room: Room) {
    //commit(MutationTypes.CHANGE_VISIBILE_VIEW, view);
    const newRoom: Room = { id: "", name: state.name, participants: [] };
    if (room !== undefined) {
      if (room.id !== undefined)
        newRoom.id = room.id;
      if (room.participants !== undefined)
        newRoom.participants = room.participants;
    }
    
    const store = useStore();
    store.commit(MutationTypes.CHANGE_ROOM, newRoom);
    store.commit(GeneralMutations.CHANGE_VISIBILE_VIEW, RouterNames.ROOM_DIALOG)
  },
};

/**
 * Getters
 */
export type Getters = {
  roomTitle(state: State): string
}

export const getters: GetterTree<State, RootState> & Getters = {
  roomTitle: (state) => state.name + "#" + state.id,
};
