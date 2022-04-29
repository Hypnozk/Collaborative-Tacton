import { MutationTree } from 'vuex'
import { State } from "./state"
import { InputButton } from "@/types/GeneralType"
/**
 * mutations
 * 
 */

export enum MutationTypes {
    CHANGE_ACTIVE_KEY = "CHANGE_ACTIVE_KEY",
}

export type Mutations<S = State> = {
    [MutationTypes.CHANGE_ACTIVE_KEY](state: S, button: { index: number, isActive: boolean }): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.CHANGE_ACTIVE_KEY](state, { index, isActive }) {
        state.gridLayout[index] = {...state.gridLayout[index], isActive:isActive}
    },
};