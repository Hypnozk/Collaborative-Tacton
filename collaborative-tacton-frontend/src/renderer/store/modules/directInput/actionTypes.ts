import { ActionContext } from 'vuex'
import { Mutations } from './mutations';
import {State} from "./state"
import { State as RootState } from '../../store';

/**
 * actions
 * 
 */

export enum ActionTypes {
  addActiveKey = 'addActiveKey',
  removeActiveKey = 'removeActiveKey',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [ActionTypes.addActiveKey](
    { commit }: AugmentedActionContext,
    payload: string
  ): void,
  [ActionTypes.removeActiveKey](
    { commit }: AugmentedActionContext,
    payload: string
  ): void,
}