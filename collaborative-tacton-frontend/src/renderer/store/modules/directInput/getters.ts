
import { GetterTree } from 'vuex'
import {State} from "./state"
import { State as RootState } from '../../store';

export type Getters = {
  globalIntensity(state: State): number
  gridColNum(state: State): number
  gridLayout(state: State): any[]
}

export const getters: GetterTree<State, RootState> & Getters = {
  globalIntensity: (state) => state.globalIntensity,
  gridColNum: (state) => state.gridColNum,
  gridLayout: (state) => state.gridLayout,
};
