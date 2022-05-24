import {
  createStore,
} from 'vuex'

import {
  store as generalSettings,
  GeneralSettingsStore,
} from './modules/generalSettings'

import {
  State as GeneralSettingsState,
} from './modules/generalSettings/generalSettings'

import {
  store as roomSettings,
  RoomSettingsStore,
} from './modules/roomSettings'

import {
  State as RoomSettingsState,
} from './modules/roomSettings/roomSettings'


import {
  store as playGround,
  PlayGroundStore,
} from './modules/playGround'

import {
  State as PlayGroundState,
} from './modules/playGround/playGround'

import {
  store as tactonSettings,
  TactonSettingsStore,
} from './modules/tactonSettings'

import {
  State as TactonSettingsState,
} from './modules/tactonSettings/tactonSettings'


export type RootState = {
  generalSettings: GeneralSettingsState,
  roomSettings: RoomSettingsState,
  playGround:PlayGroundState,
  tactonSettings:TactonSettingsState
}

/**
 * interface State extends StateDirectInput,StateBreakPoint {}
interface Mutations extends MutationsDirectInput,MutationsBreakPoint {}
interface Actions extends ActionsDirectInput,ActionsBreakPoint {}
interface Getters extends GettersDirectInput,GettersBreakPoint {}
*/
export type Store = GeneralSettingsStore<Pick<RootState, 'generalSettings'>> & RoomSettingsStore<Pick<RootState, 'roomSettings'>> & PlayGroundStore<Pick<RootState, 'playGround'>> & TactonSettingsStore<Pick<RootState, 'tactonSettings'>>

export const store = createStore({
  modules: {
    generalSettings,
    roomSettings,
    playGround,
    tactonSettings
  },
})

declare global {
  interface Window {
    api: any;
  }
}



/**
 * use following to get the store in every file of the renderer 
 * useStore function of this file
 * const store = useStore()
 */
export function useStore(): Store {
  return store as Store;
}