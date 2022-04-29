import { ActionTree } from 'vuex'
import { State as RootState } from '../../store';
import { IPC_CHANNELS } from "../../../../electron/IPCManager/IPCChannels";
import { State, state } from "./state"
import { ActionTypes, Actions } from "./actionTypes"
import { MutationTypes } from './mutations';
import { InputButton } from '@/types/GeneralType';

export const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.addActiveKey]({ commit, state }, key: string) {
    //window.api.send(IPC_CHANNELS.main.actuator, "renderer");

    const index = state.gridLayout.findIndex(
      (item: InputButton) => item.key === key
    );

    if (index >= 0 && !state.gridLayout[index].isActive) {
      console.log("addItem" + state.gridLayout[index])
      commit(MutationTypes.CHANGE_ACTIVE_KEY, { index: index, isActive: false });
    }
  },
  [ActionTypes.removeActiveKey]({ commit }, key: string) {
    const index = state.gridLayout.findIndex(
      (item: InputButton) => item.key === key
    );

    if (index >= 0 && state.gridLayout[index].isActive) {
      console.log("removeItem" + state.gridLayout[index])
      commit(MutationTypes.CHANGE_ACTIVE_KEY, { index: index, isActive: false });
    }
  },
};

