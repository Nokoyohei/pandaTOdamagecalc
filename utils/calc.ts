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
    ? Math.ceil(monster.md * 0.9)
    : Math.ceil(monster.dp * 0.75)

const calcDamage = (
  monsterDef: number,
  monsterResist: number,
  rogicalDamage: number
) => {
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (rogicalDamage - monsterDef)
  )
  return damage < 0 ? 0 : damage
}

// const calcNeedStats = (
//   monster: Monster,
//   attacktype: 'magic' | 'physical',
//   attribute: attribute,
//   attackRatio: number,
//   dependStats: number,
//   constStats = 49,
//   attacknum: number = 1
// ) => {
//   const monsterDef = calcMonsterDef(monster, attacktype)
//   const resistance = (100 - monster[attribute]) / 100
//   return (
//     (monster.hp / resistance + attacknum * monsterDef) / attackRatio +
//     constStats -
//     dependStats
//   )
// }

const calcNeedStats = (
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

export {
  makeArr,
  calcDarkCommandoDamage,
  calcGravityCrashDamage,
  calcMonsterDef,
  calcDamage,
  calcNeedStats
}
