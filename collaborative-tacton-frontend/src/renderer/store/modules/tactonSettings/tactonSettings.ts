
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '../../store';
import { RouterNames } from '../../../../types/Routernames';
/**
 * Tyopes
 * 
 */
interface DeviceChannel {
  channelId: number,
  intensity: number
}
/**
 * state
 * 
 */

export type State = {
  deviceChannel: DeviceChannel[],
  insertValues: boolean
};

export const state: State = {
  deviceChannel: [],
  insertValues: false
};
/**
 * mutations
 * 
 */
export enum TactonMutations {
  UDPATE_CHANNELS = "UDPATE_CHANNELS",
  UPDATE_SPECIFIC_CHANNEL = "UPDATE_SPECIFIC_CHANNEL",
  UPDATE_INSERT_VALUES = "UPDATE_INSERT_VALUES",
}

export type Mutations<S = State> = {
  [TactonMutations.UDPATE_CHANNELS](state: S, channels: DeviceChannel[]): void
  [TactonMutations.UPDATE_SPECIFIC_CHANNEL](state: S, payload: { index: number, channel: DeviceChannel }): void
  [TactonMutations.UPDATE_INSERT_VALUES](state: S, insertFirtsValue: boolean): void
}

export const mutations: MutationTree<State> & Mutations = {
  [TactonMutations.UDPATE_CHANNELS](state, channels) {
    state.deviceChannel = channels;
  },
  [TactonMutations.UPDATE_SPECIFIC_CHANNEL](state, payload) {
    state.deviceChannel[payload.index] = payload.channel;
  },
  [TactonMutations.UPDATE_INSERT_VALUES](state, insertFirtsValue) {
    state.insertValues = insertFirtsValue;
  },
};

/**
 * actions
 * 
 */
export enum TactonSettingsActionTypes {
  instantiateArray = 'instantiateArray',
  modifySpecificChannel = 'modifySpecificChannel'
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [TactonSettingsActionTypes.instantiateArray](
    { commit }: AugmentedActionContext,
  ): void;
  [TactonSettingsActionTypes.modifySpecificChannel](
    { commit }: AugmentedActionContext,
    payload: DeviceChannel[], // Obsolete in here but left as an example
  ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  [TactonSettingsActionTypes.instantiateArray]({ commit }) {
    const store = useStore();

    const numberOfOutputs = store.getters.getNumberOfOutputs;
    console.log("instantiate channels: " + numberOfOutputs)
    const deviceChannelArray: DeviceChannel[] = [];
    for (let i = 0; i < numberOfOutputs; i++) {
      deviceChannelArray.push({ channelId: i, intensity: 0 })
    }
    commit(TactonMutations.UDPATE_CHANNELS, deviceChannelArray);
  },
  [TactonSettingsActionTypes.modifySpecificChannel]({ commit }, channels: DeviceChannel[]) {
    //console.log("action " + state.deviceChannel)
    for (let i = 0; i < channels.length; i++) {
      const index = state.deviceChannel.findIndex(channelDevice => channelDevice.channelId == channels[i].channelId);

      if (index == -1) {
        continue
      }
      commit(TactonMutations.UPDATE_INSERT_VALUES, true);

      commit(TactonMutations.UPDATE_SPECIFIC_CHANNEL, { index: index, channel: channels[i] });
    }
  },
};

/**
 * Getters
 */
export type Getters = {
  getIntensityOfChannel(state: State): (id: number) => number,
}

export const getters: GetterTree<State, RootState> & Getters = {
  getIntensityOfChannel: (state) => (id) => {
    const index = state.deviceChannel.findIndex(
      (channel) => channel.channelId === id
    );
    if (index == -1)
      return 0;

    return state.deviceChannel[index].intensity;
  },
};
