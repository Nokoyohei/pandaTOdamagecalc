import { Monster, attribute } from '~/types'

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

const calcMistOfManaBuff = (ma: number) => Math.floor(ma * 1.5)
const calcDarkCommandDamage = (ma: number) => Math.floor(((ma - 49) * 300) / 10)
const calcGravityCrashDamage = (ma: number) =>
  Math.floor(((ma - 49) * 1200) / 10)
const calcBloodyTestamentBuff = (darkAttack: number) =>
  Math.floor(darkAttack * 1.2)
const calcDamage = (
  monster: Monster,
  rogicalDamage: number,
  attacktype: 'magic' | 'physical',
  attribute: attribute,
  attacknum: number
) => {
  const monsterDef =
    attacktype === 'magic'
      ? Math.round(monster.md * 0.9)
      : Math.round(monster.dp * 0.75)

  return Math.floor(
    ((100 - monster[attribute]) / 100) *
      (rogicalDamage - monsterDef * attacknum)
  )
}

export {
  makeArr,
  calcDarkCommandDamage,
  calcGravityCrashDamage,
  calcBloodyTestamentBuff,
  calcMistOfManaBuff,
  calcDamage
}
