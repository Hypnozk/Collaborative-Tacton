
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState } from '../../store';
import { v4 as uuidv4 } from 'uuid';
import { KeyBoardAttributes, KeyBoardButton } from '@/types/GeneralType';

/**
 * state
 * 
 */

export type State = {
    gridLayout: KeyBoardButton[]
};

export const state: State = {
    gridLayout: []
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
    BULK_GRID_UPDATE = "BULK_GRID_UPDATE",
    UPDATE_GRID_ITEM = "UPDATE_GRID_ITEM",
    ADD_ITEM_TO_GRID = "UPDATE_ITEM_TO_GRID",
}

export type Mutations<S = State> = {
    [MutationTypes.BULK_GRID_UPDATE](state: S, buttons: KeyBoardButton[]): void
    [MutationTypes.UPDATE_GRID_ITEM](state: S, button: KeyBoardButton): void
    [MutationTypes.ADD_ITEM_TO_GRID](state: S, UPDATE_ITEM_TO_GRID: KeyBoardButton): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.BULK_GRID_UPDATE](state, buttons) {
        console.log("getButtons")
        console.log(buttons)
        state.gridLayout = buttons;
    },
    [MutationTypes.UPDATE_GRID_ITEM](state, button) {
        const index = state.gridLayout.findIndex(keyBoardButton => keyBoardButton.i == button.i)
        if (index != -1)
            state.gridLayout[index] = button;
    },
    [MutationTypes.ADD_ITEM_TO_GRID](state, button) {
        const index = state.gridLayout.findIndex(keyBoardButton => keyBoardButton.i == button.i)
        if (index != -1)
            state.gridLayout[index] = button;
    },
};

/**
 * actions
 * 
 */
export enum PlayGroundActionTypes {
    addActiveKey = 'addActiveKey',
    addButtonToGrid = 'addButtonToGrid',
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [PlayGroundActionTypes.addActiveKey](
        { commit }: AugmentedActionContext,
        payload: string, // Obsolete in here but left as an example
    ): void;
    [PlayGroundActionTypes.addButtonToGrid](
        { commit }: AugmentedActionContext,
        payload: KeyBoardAttributes, // Obsolete in here but left as an example
    ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    [PlayGroundActionTypes.addActiveKey]({ commit }, key: string) {
        console.log(key)
    },
    [PlayGroundActionTypes.addButtonToGrid]({ commit }, button: KeyBoardAttributes) {
        const uid = uuidv4();
        commit(MutationTypes.ADD_ITEM_TO_GRID, { i: uid, ...button });
    },
};

/**
 * Getters
 */
export type Getters = {
    isActiveKey(state: State): (id: string) => boolean
}

export const getters: GetterTree<State, RootState> & Getters = {
    isActiveKey: (state) => (id) => {
        const index = state.gridLayout.findIndex((keyBoardButton) => keyBoardButton.i === id);
        if (index == -1)
            return false;

        return state.gridLayout[index].isActive;
    }
};
