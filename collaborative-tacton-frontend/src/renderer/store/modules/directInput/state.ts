import { Channel, InputButton } from "@/types/GeneralType";
/**
 * state of DirectInput
 * 
 */

export type State = typeof state;

export const state = {
    activeChannels: [] as Channel[],
    activeKeys: [] as string[],
    globalIntensity: 1,
    gridColNum: 10,
    gridLayout: [] as InputButton[],
};