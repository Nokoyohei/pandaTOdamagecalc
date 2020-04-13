import { Monster } from '~/types'
import SkillRatio from '~/utils/skillRatio'

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
  Math.ceil((ma - 49) * SkillRatio.DarkCommandoRatio)
export const calcGravityCrashDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.GravityCrashRatio)
export const calcFullHouseDamage = (ap: number, lk: number, hv: number) =>
  Math.ceil((ap + (lk + hv) * 8) * SkillRatio.FullHouseRatio)
export const calcEarthquakeBladeDamage = (ap: number, soil: number) =>
  Math.ceil(ap * SkillRatio.EarthquakeBladeRatio(soil))

export const calcMonsterDef = (
  monster: Monster,
  attacktype: 'magic' | 'physical'
) =>
  attacktype === 'magic'
    ? Math.ceil(monster.md * 0.9)
    : Math.ceil(monster.dp * 0.75)

export const calcDamage = (
  monsterDef: number,
  monsterResist: number,
  rogicalDamage: number
) => {
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (rogicalDamage - monsterDef)
  )
  return Math.floor(damage < 0 ? 0 : damage)
}

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
