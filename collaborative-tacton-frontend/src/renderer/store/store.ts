import {
  createStore,
} from 'vuex'

import {
  DirectInputModule,
  Store as DirectInputStore,
} from './modules/directInput'

import {
  State as DirectInputState,
} from './modules/directInput/state'

import {
  GeneralSettingsModule,
  Store as GeneralSettingsStore,
} from './modules/generalSettings'

import {
  State as GeneralSettingsState,
} from './modules/generalSettings/generalSettings'

export type State = {
  generalSettings: GeneralSettingsState
  directInput: DirectInputState,
}

const store = createStore({
  modules: {
    GeneralSettingsModule,
    DirectInputModule
  },
})

declare global {
  interface Window {
    api: any;
  }
}

/**
 * interface State extends StateDirectInput,StateBreakPoint {}
interface Mutations extends MutationsDirectInput,MutationsBreakPoint {}
interface Actions extends ActionsDirectInput,ActionsBreakPoint {}
interface Getters extends GettersDirectInput,GettersBreakPoint {}
*/
export type Store = GeneralSettingsStore<Pick<State, 'generalSettings'>> & DirectInputStore<Pick<State, 'directInput'>>;

/**
 * use following to get the store in every file of the renderer 
 * useStore function of this file
 * const store = useStore()
 */
export function useStore(): Store {
  return store as Store
}