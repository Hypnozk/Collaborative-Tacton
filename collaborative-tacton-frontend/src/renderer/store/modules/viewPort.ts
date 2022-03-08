import { MutationTree, GetterTree } from 'vuex'
/**
 * Tyopes
 * 
 */

/**
 * state
 * 
 */

export type State = typeof state;

const state = {
    playGroundVisible: false,
    editModeActive: false,
};
/**
 * mutations
 * 
 */
export enum MutationTypes {
    CHANGE_PLAY_GROUND_VISIBILE = "CHANGE_PLAY_GROUND_VISIBILE",
    CHANGE_EDIT_MODE_ACTIVE = "CHANGE_EDIT_MODE_ACTIVE",
}

export type Mutations<S = State> = {
    [MutationTypes.CHANGE_PLAY_GROUND_VISIBILE](state: S, visible: boolean): void
    [MutationTypes.CHANGE_EDIT_MODE_ACTIVE](state: S, active: boolean): void
}

const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.CHANGE_PLAY_GROUND_VISIBILE](state, visible) {
        state.playGroundVisible = visible;
    },
    [MutationTypes.CHANGE_EDIT_MODE_ACTIVE](state, active) {
        state.editModeActive = active;
    },
};

/**
 * actions
 * 
 */
const actions = {
    changePlayGroundVisible({ commit }: any, visible: boolean) {
        commit(MutationTypes.CHANGE_PLAY_GROUND_VISIBILE, visible);
    },
    changeEditModeActive({ commit }: any, active: boolean) {
        commit(MutationTypes.CHANGE_EDIT_MODE_ACTIVE, active);
    },
};

export type Getters = {
    playGroundVisible(state: State): boolean
    editModeActive(state: State): boolean
}

const getters: GetterTree<State, State> & Getters = {
    playGroundVisible: (state) => state.playGroundVisible,
    editModeActive: (state) => state.editModeActive,
};

export default {
    state,
    mutations,
    actions,
    getters,
};
