import { Monster, attribute } from '~/types'
import { DarkCommandoRatio, GravityCrashRatio } from '~/utils/skillRatio'

const makeArr = (
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

const calcDarkCommandoDamage = (ma: number) =>
  Math.floor((ma - 49) * DarkCommandoRatio)
const calcGravityCrashDamage = (ma: number) =>
  Math.floor((ma - 49) * GravityCrashRatio)

const calcMonsterDef = (monster: Monster, attacktype: 'magic' | 'physical') =>
  attacktype === 'magic'
    ? Math.round(monster.md * 0.9)
    : Math.round(monster.dp * 0.75)

const calcDamage = (
  monster: Monster,
  rogicalDamage: number,
  attacktype: 'magic' | 'physical',
  attribute: attribute,
  attacknum: number = 1
) => {
  const monsterDef = calcMonsterDef(monster, attacktype)
  const damage = Math.floor(
    ((100 - monster[attribute]) / 100) *
      (rogicalDamage - monsterDef * attacknum)
  )
  return damage < 0 ? 0 : damage
}

const calcNeedStats = (
  monster: Monster,
  attacktype: 'magic' | 'physical',
  attribute: attribute,
  attackRatio: number,
  dependStats: number,
  constStats = 49,
  attacknum: number = 1
) => {
  const monsterDef = calcMonsterDef(monster, attacktype)
  const resistance = (100 - monster[attribute]) / 100
  return (
    (monster.hp / resistance + attacknum * monsterDef) / attackRatio +
    constStats -
    dependStats
  )
}

export {
  makeArr,
  calcDarkCommandoDamage,
  calcGravityCrashDamage,
  calcDamage,
  calcNeedStats
}
