import { MutationTree } from 'vuex'
import { State } from "./state"
import { InputButton } from "@/types/GeneralType"
/**
 * mutations
 * 
 */

export enum MutationTypes {
    ADD_ACTIVE_CHANNEL = "ADD_ACTIVE_CHANNEL",
    ADD_ACTIVE_KEY = "ADD_ACTIVE_KEY",
    ADD_BUTTON_TO_GRID = "ADD_BUTTON_TO_GRID",
    DELETE_BUTTON_FROM_GRID = "DELETE_BUTTON_FROM_GRID",
    EDIT_BUTTON_FROM_GRID = "EDIT_BUTTON_FROM_GRID",
    REMOVE_ACTIVE_CHANNEL = "REMOVE_ACTIVE_CHANNEL",
    REMOVE_ACTIVE_KEY = "REMOVE_ACTIVE_KEY",
    RESET_GRID = "RESET_GRID",
    SET_GLOBAL_INTENSITY = "SET_GLOBAL_INTENSITY",
    UPDATE_POSITION_BUTTON = "UPDATE_POSITION_BUTTON",
}

export type Mutations<S = State> = {
    [MutationTypes.ADD_ACTIVE_CHANNEL](state: S, adChannel: { id: string[], intensity: number }): void
    [MutationTypes.ADD_ACTIVE_KEY](state: S, key: string): void
    [MutationTypes.ADD_BUTTON_TO_GRID](state: S, inputButton: InputButton): void
    [MutationTypes.DELETE_BUTTON_FROM_GRID](state: S, key: string): void
    [MutationTypes.EDIT_BUTTON_FROM_GRID](state: S, inputButton: InputButton): void
    [MutationTypes.UPDATE_POSITION_BUTTON](state: S, updateInfo: { key: string, x: number, y: number }): void
    [MutationTypes.REMOVE_ACTIVE_CHANNEL](state: S, activeChannel: { id: string[], intensity: number }): void
    [MutationTypes.REMOVE_ACTIVE_KEY](state: S, key: string): void
    [MutationTypes.RESET_GRID](state: S, temp: string): void
    [MutationTypes.SET_GLOBAL_INTENSITY](state: S, intensity: number): void
}

export const mutations: MutationTree<State> & Mutations = {
    [MutationTypes.ADD_ACTIVE_CHANNEL](state, { id, intensity }) {
        const index = state.activeChannels.findIndex(
            (channel) => channel.id === id
        );
        if (index < 0) state.activeChannels.push({ id, intensities: [intensity] });
        else state.activeChannels[index].intensities.push(intensity);
    },
    [MutationTypes.ADD_ACTIVE_KEY](state, key) {
        if (!state.activeKeys.includes(key)) state.activeKeys.push(key);
    },
    [MutationTypes.ADD_BUTTON_TO_GRID](
        state,
        inputButton: InputButton
    ) {
        state.gridLayout.push(
            inputButton
        );
    },

    [MutationTypes.DELETE_BUTTON_FROM_GRID](state, key) {
        const button = state.gridLayout.find((b) => b.key === key);
        if (button !== undefined) {
            const index = state.gridLayout.indexOf(button);
            if (index > -1) state.gridLayout.splice(index, 1);
        }
    },
    [MutationTypes.EDIT_BUTTON_FROM_GRID](state, inputButton) {
        const button = state.gridLayout.find((b) => b.key === inputButton.key);
        if (button !== undefined) {
            const index = state.gridLayout.indexOf(button);
            if (index > -1) {
                state.gridLayout[index].color = inputButton.color;
                state.gridLayout[index].name = inputButton.name;
                state.gridLayout[index].intensity = inputButton.intensity;
                state.gridLayout[index].key = inputButton.key;
                state.gridLayout[index].channels = inputButton.channels;
            }
        }
    },
    [MutationTypes.UPDATE_POSITION_BUTTON](state, { key, x, y }) {
        const button = state.gridLayout.find((b) => b.key === key);
        if (button !== undefined) {
            const index = state.gridLayout.indexOf(button);
            if (index > -1) {
                state.gridLayout[index].x = x;
                state.gridLayout[index].y = y;
            }
        }
    },
    [MutationTypes.REMOVE_ACTIVE_CHANNEL](state, activeChannel: { id: string[], intensity: number }) {
        const index = state.activeChannels.findIndex(
            (channel) => channel.id === activeChannel.id
        );
        if (index > -1) {
            if (state.activeChannels[index].intensities.length <= 1)
                state.activeChannels.splice(index, 1);
            else {
                const intensityIndex =
                    state.activeChannels[index].intensities.indexOf(activeChannel.intensity);
                state.activeChannels[index].intensities.splice(intensityIndex, 1);
            }
        }
    },
    [MutationTypes.REMOVE_ACTIVE_KEY](state, key: string) {
        const index = state.activeKeys.indexOf(key);
        if (index > -1) {
            console.log("removeKey " + key)
            state.activeKeys.splice(index, 1)
        }
    },
    [MutationTypes.RESET_GRID](state) {
        state.gridLayout = [];
    },
    [MutationTypes.SET_GLOBAL_INTENSITY](state, intensity) {
        state.globalIntensity = intensity;
    },
};