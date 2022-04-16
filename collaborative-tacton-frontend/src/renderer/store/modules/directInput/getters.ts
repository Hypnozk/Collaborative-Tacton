
import { GetterTree } from 'vuex'
import {State} from "./state"
import { Channel } from '@/types/GeneralType'
import { State as RootState } from '../../store';

export type Getters = {
  activeChannels(state: State): Channel[]
  channelsActive(state: State): any
  globalIntensity(state: State): number
  gridColNum(state: State): number
  gridLayout(state: State): any[]
  keyAlreadyActive(state: State): any
  keyAlreadyTaken(state: State): any
}

export const getters: GetterTree<State, RootState> & Getters = {
  activeChannels: (state) => state.activeChannels,
  channelsActive: (state) => (channels: any) =>
    channels.every((ch: any) => state.activeChannels.some((aCh) => aCh.id === ch)),
  globalIntensity: (state) => state.globalIntensity,
  gridColNum: (state) => state.gridColNum,
  gridLayout: (state) => state.gridLayout,
  keyAlreadyActive: (state) => (key: any) =>
    state.activeKeys.some((ak) => ak === key),
  keyAlreadyTaken: (state) => (key: any) =>
    state.gridLayout.some((button) => button.key === key),
};
