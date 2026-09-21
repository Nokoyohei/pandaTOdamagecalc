import type { Monster, BossMonster } from '~/types'
import { MONSTER_ROWS } from '~/utils/monsterList'
import { monsterFromRow } from '~/utils/monsterPick'

/*
 * タブに並べるモンスター。値は MonsterParamEx2 の行から取る
 * （utils/monsterList.ts は internal-bot から生成。`npm run sync-data` で更新される）。
 * HP ゲージ数は BossMonsterparamEx.LifeCnt + 1。
 */
const byId = (id: number): BossMonster => {
  const row = MONSTER_ROWS.find((r) => r[0] === id)
  if (!row) throw new Error(`MonsterParamEx2 ${id} is not in utils/monsterList.ts`)
  return monsterFromRow(row)
}

// 防御・耐性 0 の的（libconfig の Torobbie 2183 は HP 100 なので使わない）
const torobbie: Monster = {
  hp: 100000000,
  dp: 0,
  md: 0,
  hv: 0,
  fireR: 0,
  waterR: 0,
  windR: 0,
  earthR: 0,
  elecR: 0,
  lightR: 0,
  darkR: 0,
  noPropR: 0,
  physicalR: 0,
  gunR: 0
}

const toilet: Monster = byId(2371) // Haunted Toilet
const cora: Monster = byId(2775) // Cora Merrymaker
const tantalos: Monster = byId(16760) // Tantalos

// libconfig の MonsterParamEx2 に一致する行が無い（HP 100000 / DP 100000 の Werepot は存在しない）ので旧値のまま
const werepot: Monster = {
  hp: 100000,
  dp: 100000,
  md: 100000,
  hv: 10000,
  fireR: 80,
  waterR: 80,
  windR: 80,
  earthR: 80,
  elecR: 80,
  lightR: 80,
  darkR: 0,
  noPropR: 80,
  physicalR: 80,
  gunR: 80
}

const bossTorrobie: BossMonster = {
  ...torobbie,
  da: 0,
  gaugeNum: 5
}

const requiem = byId(2450) // Requiem Apocrypha
const koiosu = byId(3051) // Koiosu
const madray = byId(2214) // Mad Ray
const predator = byId(2210) // Predator G
const mong = byId(2215) // Master Mong
const kevin = byId(2211) // GM Kevin
const chronos = byId(2209) // Chronos
const ixion = byId(2208) // Ixion
const ed = byId(2518) // Ed
const requiemHarbinger = byId(2521) // Requiem Harbinger G
const rosaspina = byId(2513) // Mystical Rosaspina
const punisherRosaspina = byId(2490) // Punisher Rosaspina (MaxHpLv は int32 に折り返す)
const trueGodKoiosu = byId(16786) // True God of Steel Koiosu (MaxHpLv は int32 に折り返す)

export {
  ixion,
  torobbie,
  toilet,
  cora,
  werepot,
  tantalos,
  requiem,
  bossTorrobie,
  predator,
  mong,
  kevin,
  madray,
  koiosu,
  chronos,
  requiemHarbinger,
  rosaspina,
  punisherRosaspina,
  trueGodKoiosu,
  ed
}
