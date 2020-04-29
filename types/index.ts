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

export type APBuffName = 'pumpingHeart' | 'adrenaline'
export type ACBuffName = 'gunBooster' | 'bullsEye' | 'eagleEye'
export type LKBuffName = 'luckySeven' | 'auraOfLuck'
export type DABuffName = 'sixthSense' | 'secondAnniversary'
export type MABuffName = 'mistOfMana'
export type DLBuffName = 'bloodTestament' | 'darkCommando'
export type HVBuffName = 'dodgeMaster'
