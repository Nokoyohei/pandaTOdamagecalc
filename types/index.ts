export interface Monster {
  hp: number
  dp: number
  md: number
  hv: number
  fireR: number
  waterR: number
  earthR: number
  windR: number
  elecR: number
  lightR: number
  darkR: number
  noPropR: number
  phisicalR: number
  gunR: number
}
export type attribute = keyof Monster
