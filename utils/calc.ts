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
  return Math.floor(damage < 0 ? 0 : damage) + 1
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
