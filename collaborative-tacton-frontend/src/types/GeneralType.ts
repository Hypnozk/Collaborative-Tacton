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
  isActive: boolean
}

export interface KeyBoardButton extends KeyBoardAttributes {
  i: string,
  x: number,
  y: number,
  h: number,
  w: number,
}
export interface TactileTask {
  channelId: number,
  intensity: number,
}