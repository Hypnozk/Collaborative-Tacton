
import { MutationTree, GetterTree, ActionTree, ActionContext } from 'vuex'
import { RootState, useStore } from '../../store';
import { v4 as uuidv4 } from 'uuid';
import { KeyBoardAttributes, KeyBoardButton } from '@/types/GeneralType';
import { sendSocketMessage } from '@/renderer/CommunicationManager/WebSocketManager';
import { WS_MSG_TYPE } from '@/renderer/CommunicationManager/WebSocketManager/ws_types';
import { PlayGroundActionTypes, PlayGroundMutations } from './types';

export interface Layout {
    x: number,
    y: number
}
/**
 * state
 * 
 */

export type State = {
    gridLayout: Layout
    gridItems: KeyBoardButton[],
    globalIntensity: number,
};

export const state: State = {
    gridLayout: { x: 11, y: 8 },
    gridItems: [],
    globalIntensity: 1,
};
/**
 * mutations
 * 
 */
export type Mutations<S = State> = {
    [PlayGroundMutations.BULK_GRID_UPDATE](state: S, buttons: KeyBoardButton[]): void
    [PlayGroundMutations.UPDATE_GRID_ITEM](state: S, payload: { index: number, button: KeyBoardButton }): void
    [PlayGroundMutations.ADD_ITEM_TO_GRID](state: S, button: KeyBoardButton): void
    [PlayGroundMutations.DELETE_ITEM_FROM_GRID](state: S, key: string): void
    [PlayGroundMutations.UPDATE_GLOBAL_INTENSITY](state: S, intensity: number): void
}

export const mutations: MutationTree<State> & Mutations = {
    [PlayGroundMutations.BULK_GRID_UPDATE](state, buttons) {
        state.gridItems = buttons;
    },
    [PlayGroundMutations.UPDATE_GRID_ITEM](state, payload) {
        state.gridItems[payload.index] = payload.button;
    },
    [PlayGroundMutations.ADD_ITEM_TO_GRID](state, button) {
        state.gridItems.push(button);
    },
    [PlayGroundMutations.DELETE_ITEM_FROM_GRID](state, key) {
        const index = state.gridItems.findIndex(keyBoardButton => keyBoardButton.i == key)
        if (index != -1)
            state.gridItems.splice(index, 1);
    },
    [PlayGroundMutations.UPDATE_GLOBAL_INTENSITY](state, intensity) {
        state.globalIntensity = intensity;
    },
};

/**
 * actions
 * 
 */

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [PlayGroundActionTypes.activateKey](
        { commit }: AugmentedActionContext,
        payload: string, // Obsolete in here but left as an example
    ): void;
    [PlayGroundActionTypes.deactivateKey](
        { commit }: AugmentedActionContext,
        payload: string, // Obsolete in here but left as an example
    ): void;
    [PlayGroundActionTypes.addButtonToGrid](
        { commit }: AugmentedActionContext,
        payload: KeyBoardAttributes, // Obsolete in here but left as an example
    ): void;
    [PlayGroundActionTypes.updateKeyButton](
        { commit }: AugmentedActionContext,
        payload: { id: string, props: any }, // Obsolete in here but left as an example
    ): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
    [PlayGroundActionTypes.activateKey]({ commit }, buttonKey: string) {
        const index = state.gridItems.findIndex((keyBoardButton) => keyBoardButton.key === buttonKey);
        if (index == -1 || state.gridItems[index].isActive) return;

        commit(PlayGroundMutations.UPDATE_GRID_ITEM, { index: index, button: { ...state.gridItems[index], isActive: true } });
        const store = useStore();
        sendSocketMessage(WS_MSG_TYPE.SEND_INSTRUCTION_SERV, {
            roomId: store.state.roomSettings.id,
            keyId: state.gridItems[index].i,
            channels: state.gridItems[index].channels,
            intensity: state.gridItems[index].intensity * state.globalIntensity
        });
    },
    [PlayGroundActionTypes.deactivateKey]({ commit }, buttonKey: string) {
        const index = state.gridItems.findIndex((keyBoardButton) => keyBoardButton.key === buttonKey);
        if (index == -1 || !state.gridItems[index].isActive) return;

        commit(PlayGroundMutations.UPDATE_GRID_ITEM, { index: index, button: { ...state.gridItems[index], isActive: false } });
        const store = useStore();
        sendSocketMessage(WS_MSG_TYPE.SEND_INSTRUCTION_SERV, {
            roomId: store.state.roomSettings.id,
            keyId: state.gridItems[index].i,
            channels: state.gridItems[index].channels,
            intensity: 0
        });

    },
    [PlayGroundActionTypes.addButtonToGrid]({ commit }, button: KeyBoardAttributes) {
        const uid = uuidv4();
        /**function to find free Space at start, 
         * if there is no space set it x:0,y:0 
         * */
        let space = { x: 0, y: 0 };
        loop1: for (let posY = 0; posY < state.gridLayout.y; posY++) {
            for (let posX = 0; posX < state.gridLayout.x; posX++) {
                let freeSpace = true;
                for (const button of state.gridItems) {
                    if (button.x == posX && button.y == posY) {
                        freeSpace = false;
                        break;
                    }
                }
                if (freeSpace) {
                    space = { x: posX, y: posY };
                    break loop1;
                }
            }
        }
        commit(PlayGroundMutations.ADD_ITEM_TO_GRID, { i: uid, x: space.x, y: space.y, h: 1, w: 1, ...button });
    },
    [PlayGroundActionTypes.updateKeyButton]({ commit }, payload: { id: string, props: any }) {
        const index = state.gridItems.findIndex(keyButton => keyButton.i == payload.id);
        if (index == -1) return;

        commit(PlayGroundMutations.UPDATE_GRID_ITEM, { index: index, button: { ...state.gridItems[index], ...payload.props } });
    },
};

/**
 * Getters
 */
export type Getters = {
    getKeyButton(state: State): (id: string) => KeyBoardButton | undefined,
    isActiveKey(state: State): (id: string) => boolean,
    isKeyAlreadyTaken(state: State): (originalId: string | undefined, key: string) => boolean,
}

export const getters: GetterTree<State, RootState> & Getters = {
    getKeyButton: (state) => (id) => {
        const index = state.gridItems.findIndex((keyBoardButton) => keyBoardButton.i === id);
        if (index == -1) return;

        return state.gridItems[index];
    },
    isActiveKey: (state) => (id) => {
        const index = state.gridItems.findIndex((keyBoardButton) => keyBoardButton.i === id);
        if (index == -1)
            return false;

        return state.gridItems[index].isActive;
    },
    isKeyAlreadyTaken: (state) => (originalId, key) => {
        const index = state.gridItems.findIndex((keyBoardButton) => keyBoardButton.key === key);
        if (index == -1)
            return false;

        if (originalId !== undefined) {
            //find the same button as updated, its valid to change
            return state.gridItems[index].i !== originalId
        }

        return true;
    }
};
