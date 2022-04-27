import { ActionContext } from 'vuex'
import { Mutations } from './mutations';
import {State} from "./state"
import { State as RootState } from '../../store';
import { InputButton } from '@/types/GeneralType';

/**
 * actions
 * 
 */

export enum ActionTypes {
  addActiveChannel = 'addActiveChannel',
  addActiveKey = 'addActiveKey',
  addButtonToGrid = 'addButtonToGrid',
  deleteButtonFromGrid = 'deleteButtonFromGrid',
  editButtonFromGrid = 'editButtonFromGrid',
  loadGridFromFile = 'loadGridFromFile',
  removeActiveChannel = 'removeActiveChannel',
  removeActiveKey = 'removeActiveKey',
  setGlobalIntensity = 'setGlobalIntensity',
  updateButtonPosition = 'updateButtonPosition',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
  [ActionTypes.addActiveChannel](
    { commit }: AugmentedActionContext,
    payload: { id: string[], intensity: number }
  ): void,
  [ActionTypes.addActiveKey](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.addButtonToGrid](
    { commit }: AugmentedActionContext,
    payload: InputButton
  ): void,
  [ActionTypes.deleteButtonFromGrid](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.editButtonFromGrid](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.loadGridFromFile](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.removeActiveChannel](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.removeActiveKey](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.setGlobalIntensity](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
  [ActionTypes.updateButtonPosition](
    { commit }: AugmentedActionContext,
    payload: any
  ): void,
}