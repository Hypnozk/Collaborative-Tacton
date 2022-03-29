import {
  createStore,
} from 'vuex'

import {
  BreakPointModule,
  Store as BreakPointStore,
} from './modules/breakPoint'
import {
  State as BreakPointState,
} from './modules/breakPoint/breakpoint'

import {
  DirectInputModule,
  Store as DirectInputStore,
} from './modules/directInput'
import {
  State as DirectInputState,
} from './modules/directInput/directInput'

import {
  DevicesModule,
  Store as DevicesStore,
} from './modules/devices'
import {
  State as DevicesState,
} from './modules/devices/devices'

import {
  ViewPortModule,
  Store as ViewPortStore,
} from './modules/viewPort'
import {
  State as ViewPortState,
} from './modules/viewPort/viewPort'


export type State = {
  breakPoint: BreakPointState,
  directInput:  DirectInputState,
  devices: DevicesState,
  viewPort:ViewPortState
}

export const store = createStore({
  modules: {
    BreakPointModule,
    DirectInputModule,
    DevicesModule,
    ViewPortModule
  },
})


/**
 * interface State extends StateDirectInput,StateBreakPoint {}
interface Mutations extends MutationsDirectInput,MutationsBreakPoint {}
interface Actions extends ActionsDirectInput,ActionsBreakPoint {}
interface Getters extends GettersDirectInput,GettersBreakPoint {}
*/
export type Store = BreakPointStore<Pick<State, 'breakPoint'>> & DirectInputStore<Pick<State, 'directInput'>> 
& DevicesStore<Pick<State, 'devices'>>  & ViewPortStore<Pick<State, 'viewPort'>>

export function useStore(): Store {
  return store as Store
}