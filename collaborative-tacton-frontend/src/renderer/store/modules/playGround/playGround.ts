
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState } from '../../store';
import { v4 as uuidv4 } from 'uuid';
import { KeyBoardAttributes, KeyBoardButton } from '@/types/GeneralType';

/**
 * state
 * 
 */

export type State = {
    gridLayout: KeyBoardButton[],
    globalIntensity: number,
};

export const state: State = {
    gridLayout: [],
    globalIntensity: 1,
};
/**
 * mutations
 * 
 */
export enum PlayGroundMutations {
    BULK_GRID_UPDATE = "BULK_GRID_UPDATE",
    UPDATE_GRID_ITEM = "UPDATE_GRID_ITEM",
    ADD_ITEM_TO_GRID = "UPDATE_ITEM_TO_GRID",
    UPDATE_GLOBAL_INTENSITY = "UPDATE_GLOBAL_INTENSITY",
}

export type Mutations<S = State> = {
    [PlayGroundMutations.BULK_GRID_UPDATE](state: S, buttons: KeyBoardButton[]): void
    [PlayGroundMutations.UPDATE_GRID_ITEM](state: S, button: KeyBoardButton): void
    [PlayGroundMutations.ADD_ITEM_TO_GRID](state: S, button: KeyBoardButton): void
    [PlayGroundMutations.UPDATE_GLOBAL_INTENSITY](state: S, intensity: number): void
}

export const mutations: MutationTree<State> & Mutations = {
    [PlayGroundMutations.BULK_GRID_UPDATE](state, buttons) {
        console.log("getButtons")
        console.log(buttons)
        state.gridLayout = buttons;
    },
    [PlayGroundMutations.UPDATE_GRID_ITEM](state, button) {
        const index = state.gridLayout.findIndex(keyBoardButton => keyBoardButton.i == button.i)
        if (index != -1)
            state.gridLayout[index] = button;
    },
    [PlayGroundMutations.ADD_ITEM_TO_GRID](state, button) {
        const index = state.gridLayout.findIndex(keyBoardButton => keyBoardButton.i == button.i)
        if (index != -1)
            state.gridLayout[index] = button;
    },
    [PlayGroundMutations.UPDATE_GLOBAL_INTENSITY](state, intensity) {
        state.globalIntensity = intensity;
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
        commit(PlayGroundMutations.ADD_ITEM_TO_GRID, { i: uid, ...button });
    },
};

/**
 * Getters
 */
export type Getters = {
    getKeyButton(state: State): (id: string) => KeyBoardButton | undefined,
    isActiveKey(state: State): (id: string) => boolean,
    isKeyAlreadyTaken(state: State): (originalId:string|undefined, key: string) => boolean,
}

export const getters: GetterTree<State, RootState> & Getters = {
    getKeyButton: (state) => (id) => {
        const index = state.gridLayout.findIndex((keyBoardButton) => keyBoardButton.i === id);
        if (index == -1) return;

        return state.gridLayout[index];
    },
    isActiveKey: (state) => (id) => {
        const index = state.gridLayout.findIndex((keyBoardButton) => keyBoardButton.i === id);
        if (index == -1)
            return false;

        return state.gridLayout[index].isActive;
    },
    isKeyAlreadyTaken: (state) => (originalId, key) => {
        const index = state.gridLayout.findIndex((keyBoardButton) => keyBoardButton.key === key);
        if (index == -1)
            return false;

        if(originalId !== undefined){
            //find the same button as updated, its valid to change
            return state.gridLayout[index].i !== originalId
        }

        return true;
    }
};
