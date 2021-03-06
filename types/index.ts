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
  physicalR: number
  gunR: number
}
export type attribute = keyof Monster

export interface Skill {
  value: number
  name: string
  attr: attribute
  ratio: number
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
  physicalR: number
  gunR: number
  gaugeNum: number
}

export interface Status {
  ap: number
  ac: number
  dx: number
  mp: number
  ma: number
  md: number
  wt: number
  da: number
  lk: number
  hp: number
  dp: number
  hv: number
}

export interface Attributes {
  fire: number
  water: number
  elec: number
  wind: number
  soil: number
  holy: number
  dark: number
  gunAP: number
  throwAP: number
}

export type APBuffName = 'pumpingHeart' | 'adrenaline'
export type ACBuffName = 'gunBooster' | 'bullsEye' | 'eagleEye'
export type LKBuffName = 'luckySeven' | 'auraOfLuck' | 'firstAnniversary'
export type ThrowBuffName = 'precisePitch'
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
