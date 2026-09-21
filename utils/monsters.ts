import type { Monster, BossMonster } from '~/types'

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

// MonsterParamEx2 2371 Haunted Toilet (Lv 400)
const toilet: Monster = {
  hp: 40000,
  dp: 10000,
  md: 1700,
  hv: 300,
  fireR: 65,
  waterR: 65,
  windR: 65,
  earthR: 65,
  elecR: 65,
  lightR: 65,
  darkR: 82,
  noPropR: 65,
  physicalR: 65,
  gunR: 65
}

// MonsterParamEx2 2775 Cora Merrymaker (Lv 999)
const cora: Monster = {
  hp: 40000,
  dp: 5000,
  md: 5000,
  hv: 400,
  fireR: 90,
  waterR: 90,
  windR: 75,
  earthR: 75,
  elecR: 75,
  lightR: 75,
  darkR: 75,
  noPropR: 75,
  physicalR: 75,
  gunR: 70
}

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

// MonsterParamEx2 16760 Tantalos (Lv 950)
const tantalos: Monster = {
  hp: 300000,
  dp: 300000,
  md: 300000,
  hv: 15000,
  fireR: 90,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 90,
  lightR: 90,
  darkR: 90,
  noPropR: 90,
  physicalR: 90,
  gunR: 90
}

const bossTorrobie: BossMonster = {
  hp: 100000000,
  dp: 0,
  md: 0,
  hv: 0,
  da: 0,
  fireR: 0,
  waterR: 0,
  windR: 0,
  earthR: 0,
  elecR: 0,
  lightR: 0,
  darkR: 0,
  noPropR: 0,
  physicalR: 0,
  gunR: 0,
  gaugeNum: 5
}

// MonsterParamEx2 2450 Requiem Apocrypha (Lv 999)
const requiem: BossMonster = {
  hp: 800000,
  dp: 70000,
  md: 4500,
  hv: 400,
  da: 4000,
  fireR: 150,
  waterR: 80,
  windR: 80,
  earthR: 80,
  elecR: 80,
  lightR: 80,
  darkR: 40,
  noPropR: 40,
  physicalR: 80,
  gunR: 110,
  gaugeNum: 5
}

// MonsterParamEx2 3051 Koiosu (Lv 999)
const koiosu: BossMonster = {
  hp: 999999,
  dp: 70000,
  md: 5000,
  hv: 600,
  da: 999,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 90,
  lightR: 90,
  darkR: 60,
  noPropR: 40,
  physicalR: 95,
  gunR: 95,
  gaugeNum: 5
}

// MonsterParamEx2 2214 Mad Ray (Lv 999)
const madray: BossMonster = {
  hp: 999999,
  dp: 100000,
  md: 4000,
  hv: 600,
  da: 999,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 75,
  lightR: 75,
  darkR: 60,
  noPropR: 40,
  physicalR: 95,
  gunR: 95,
  gaugeNum: 5
}

// MonsterParamEx2 2210 Predator G (Lv 999)
const predator: BossMonster = {
  hp: 999999,
  dp: 100000,
  md: 4000,
  hv: 600,
  da: 999,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 80,
  lightR: 80,
  darkR: 80,
  noPropR: 50,
  physicalR: 95,
  gunR: 95,
  gaugeNum: 5
}

// MonsterParamEx2 2215 Master Mong (Lv 999)
const mong: BossMonster = {
  hp: 1999999,
  dp: 120000,
  md: 8000,
  hv: 1500,
  da: 3000,
  fireR: 150,
  waterR: 93,
  windR: 93,
  earthR: 93,
  elecR: 85,
  lightR: 85,
  darkR: 85,
  noPropR: 60,
  physicalR: 95,
  gunR: 95,
  gaugeNum: 5
}

// MonsterParamEx2 2211 GM Kevin (Lv 999)
const kevin: BossMonster = {
  hp: 10000000,
  dp: 300000,
  md: 50000,
  hv: 3000,
  da: 10000,
  fireR: 150,
  waterR: 99,
  windR: 99,
  earthR: 96,
  elecR: 90,
  lightR: 90,
  darkR: 80,
  noPropR: 65,
  physicalR: 96,
  gunR: 96,
  gaugeNum: 5
}

// MonsterParamEx2 2209 Chronos (Lv 3000)
const chronos: BossMonster = {
  hp: 20000000,
  dp: 500000,
  md: 50000,
  hv: 4000,
  da: 15000,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 99,
  elecR: 99,
  lightR: 99,
  darkR: 65,
  noPropR: 70,
  physicalR: 96,
  gunR: 99,
  gaugeNum: 5
}

// MonsterParamEx2 2521 Requiem Harbinger G (Lv 4500)
const requiemHarbinger: BossMonster = {
  hp: 200000000,
  dp: 2000000,
  md: 750000,
  hv: 20000,
  da: 75000,
  fireR: 150,
  waterR: 99,
  windR: 99,
  earthR: 99,
  elecR: 99,
  lightR: 99,
  darkR: 65,
  noPropR: 70,
  physicalR: 96,
  gunR: 99,
  gaugeNum: 5
}

// MonsterParamEx2 2513 Mystical Rosaspina (Lv 4000)
const rosaspina: BossMonster = {
  hp: 200000000,
  dp: 1400000,
  md: 500000,
  hv: 10000,
  da: 50000,
  fireR: 150,
  waterR: 99,
  windR: 99,
  earthR: 99,
  elecR: 99,
  lightR: 99,
  darkR: 99,
  noPropR: 99,
  physicalR: 99,
  gunR: 99,
  gaugeNum: 5
}

// MonsterParamEx2 16786 True God of Steel Koiosu (Lv 9999)
// MaxHpLv 100000000000 は int32 に収まらないので、ゲーム内と同じく折り返した値
const trueGodKoiosu: BossMonster = {
  hp: 1215752192,
  dp: 1000000,
  md: 1000000,
  hv: 55000,
  da: 120000,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 90,
  lightR: 90,
  darkR: 99,
  noPropR: 99,
  physicalR: 90,
  gunR: 99,
  gaugeNum: 5
}

// MonsterParamEx2 2490 Punisher Rosaspina (Lv 9999)
// MaxHpLv 100000000000 は int32 に収まらないので、ゲーム内と同じく折り返した値
const punisherRosaspina: BossMonster = {
  hp: 1215752192,
  dp: 1000000,
  md: 1000000,
  hv: 55000,
  da: 120000,
  fireR: 150,
  waterR: 99,
  windR: 99,
  earthR: 99,
  elecR: 99,
  lightR: 99,
  darkR: 100,
  noPropR: 99,
  physicalR: 99,
  gunR: 99,
  gaugeNum: 5
}

// MonsterParamEx2 2518 Ed (Lv 4000)
const ed: BossMonster = {
  hp: 200000000,
  dp: 1400000,
  md: 500000,
  hv: 10000,
  da: 50000,
  fireR: 150,
  waterR: 90,
  windR: 90,
  earthR: 99,
  elecR: 99,
  lightR: 99,
  darkR: 65,
  noPropR: 90,
  physicalR: 90,
  gunR: 99,
  gaugeNum: 5
}

export {
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
