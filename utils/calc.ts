import { Monster } from '~/types'
import SkillRatio from '~/utils/skillRatio'

// like python's np.linspace
// Returns a cardinality-divided value from startValue to stopValue
export const makeArr = (
  startValue: number,
  stopValue: number,
  cardinality: number
) => {
  const arr = []
  const step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i)
  }
  return arr
}

export const calcDarkCommandoDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.DarkCommando)
export const calcGravityCrashDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.GravityCrash)

export const calcFullHouseDamage = (ap: number, lk: number, hv: number) =>
  Math.ceil((ap + (lk + hv) * 8) * SkillRatio.FullHouse)

export const calcEarthquakeBladeDamage = (ap: number, soil: number) =>
  Math.ceil(ap * SkillRatio.EarthquakeBlade(soil))
export const calcChampionsBladeDamage = (ap: number, fire: number) =>
  Math.ceil(ap * SkillRatio.ChampionsBlade(fire))

export const calcFanOfKnicesDamage = (da: number, throwAp: number) =>
  Math.ceil((da + throwAp / 10) * SkillRatio.FanOfKnives)
export const calcShootingSpreeDamage = (gunAP: number) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.ShootingSpree)
export const calcBerserkDamage = (gunAP: number) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.Berserk)

// Calculate the monster's effective defense
export const calcMonsterDef = (
  monster: Monster,
  attacktype: 'magic' | 'physical' | 'gun'
) => {
  if (attacktype === 'magic') return Math.ceil(monster.md * 0.9)
  if (attacktype === 'physical') return Math.ceil(monster.dp * 0.75)
  return monster.hv * 30
}

// Calculate the damage considering defensive and resistance
/* 
  args: 
    monsterDef: effective defence -> calcMonsterDef
    monsterResist: monster's resistance for example fireR, waterR... etc.
    ideallDamage: Ideal damage against opponents with 0 defense and 0 resistance
*/
export const calcDamage = (
  monsterDef: number,
  monsterResist: number,
  idealDamage: number
) => {
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (idealDamage - monsterDef)
  )
  return Math.floor(damage < 0 ? 0 : damage) + 1
}

// Calculate the missing status
/* 
  args: 
    monsterHp: monster's max hp
    monsterDef: effective defence -> calcMonsterDef
    monsterResist: monster's resistance for example fireR, waterR... etc.
    attackRatio: skill magnification -> skillRatio 
    nowStats: Status when you deal current damage
    constStats: Last Subtract Status. For example, GravityCrash's 49
*/
/*
  logic: e.g. gravity crash ; x -> needed stats what we know
    ((MA + x - 49) * skillRatio.GravityCrash - monsterDef) * monsterResist = monsterHp
    (MA + x - 49) * skillRatio.GravityCrash = monsterHp / monsterReist + monsterDef
    x = (monsterHp / monsterresist + monsterDef) / skillRatio.GravityCrash 49 - MA

*/
export const calcNeedStats = (
  monsterHp: number,
  monsterDef: number,
  monsterResist: number,
  attackRatio: number,
  nowStats: number,
  constStats = 49
) => {
  const resistance = (100 - monsterResist) / 100
  return (
    (monsterHp / resistance + monsterDef) / attackRatio + constStats - nowStats
  )
}
