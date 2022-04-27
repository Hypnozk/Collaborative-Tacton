/**
 * Types
 * 
 */
export type Channel = {
  id: string[],
  intensities: number[]
};

export type InputButton = {
  channels: string[],
  color: string,
  intensity: number,
  name: string,
  key: string,
  i: number,
  h: number,
  w: number,
  x: number,
  y: number,
}