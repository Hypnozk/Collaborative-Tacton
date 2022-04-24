import { ActionTree } from 'vuex'
import { State as RootState } from '../../store';
import { IPC_CHANNELS } from "../../../../electron/IPCManager/IPCChannels";
import { State, state } from "./state"
import { ActionTypes, Actions } from "./actionTypes"
import { MutationTypes } from './mutations';
import { InputButton } from '@/types/GeneralType';

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.addActiveChannel]({ commit }, adChannels: { id: string[], intensity: number }) {
    commit(MutationTypes.ADD_ACTIVE_CHANNEL, adChannels);
  },
  [ActionTypes.addActiveKey]({ commit, state }, key: string) {
    // window.api.send(IPC_CHANNELS.send.actuator, "renderer");

    const item = state.gridLayout.find(
      (item: any) => item.key.toUpperCase() === key
    );
    if (item && !state.activeKeys.includes(key)) {
      console.log("addItem" + item)
      commit(MutationTypes.ADD_ACTIVE_KEY, key);
    }
  },
  [ActionTypes.addButtonToGrid]({ commit }, button: InputButton) {
    commit(MutationTypes.ADD_BUTTON_TO_GRID, { ...button, i: state.gridLayout.length });
  },
  [ActionTypes.deleteButtonFromGrid]({ commit }, key: string) {
    commit(MutationTypes.DELETE_BUTTON_FROM_GRID, key);
  },
  [ActionTypes.editButtonFromGrid]({ commit }, inputButton: InputButton) {
    commit(MutationTypes.EDIT_BUTTON_FROM_GRID, inputButton);
  },
  [ActionTypes.loadGridFromFile]({ commit }, newGrid: InputButton[]) {
    if (newGrid.length <= 0) return;
    commit(MutationTypes.RESET_GRID, "strting");
    newGrid.forEach((item: any) => {
      // dispatch("addButtonToGrid", item);
    });
  },
  [ActionTypes.removeActiveChannel]({ commit }, adChannels: { id: string[], intensity: number }) {
    commit(MutationTypes.REMOVE_ACTIVE_CHANNEL, adChannels);
  },
  [ActionTypes.removeActiveKey]({ commit }, key: string) {
    commit(MutationTypes.REMOVE_ACTIVE_KEY, key);
  },
  [ActionTypes.setGlobalIntensity]({ commit }, intensity: number) {
    commit(MutationTypes.SET_GLOBAL_INTENSITY, intensity);
  },
  [ActionTypes.updateButtonPosition]({ commit }, updateInfo: { key: string, x: number, y: number }) {
    commit(MutationTypes.UPDATE_POSITION_BUTTON, updateInfo);
  }
};

