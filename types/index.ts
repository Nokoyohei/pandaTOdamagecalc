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

export interface Skill {
  value: number
  name: string
  attr: attribute
  img: NodeRequire
}

export interface BossMonster {
  hp: number
  dp: number
  md: number
  hv: number
  da: number
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
  gaugeNum: number
}

export type APBuffName = 'pumpingHeart' | 'adrenaline'
export type ACBuffName = 'gunBooster' | 'bullsEye' | 'eagleEye'
export type LKBuffName = 'luckySeven' | 'auraOfLuck'
export type DABuffName = 'sixthSense' | 'secondAnniversary'
export type MABuffName = 'mistOfMana'
export type DLBuffName = 'bloodTestament' | 'darkCommando'
export type HVBuffName = 'dodgeMaster'
export type LightSkillName =
  | 'ArrowOfLight'
  | 'BasicHealing'
  | 'LightWave'
  | 'RadientStrike'
  | 'CatastropheHeal'
  | 'HeartsGrace'
  | 'SealingLight'
export type BlessingSkillName =
  | 'SalamanderBlessing'
  | 'RaionBlessing'
  | 'GnomeBlessing'
  | 'UndineBlessing'
  | 'SylphBlessing'
export type DebuffName = 'ShieldBreaker' | 'RaionsSpace'

export type skillPanel = {
  name: string
  value: string
  img: NodeRequire
}
