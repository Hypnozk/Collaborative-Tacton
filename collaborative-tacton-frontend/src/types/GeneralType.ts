/**
 * Types
 * 
 */

export interface KeyBoardAttributes {
  channels: number[],
  color: string,
  intensity: number,
  name?: string,
  key: string,
  h: number,
  w: number,
  x: number,
  y: number,
  isActive: boolean
}

export interface KeyBoardButton extends KeyBoardAttributes {
  i: string,
}
export interface TactileTask {
  channel:number[],
  intensity:number
}