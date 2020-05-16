import { Monster, BossMonster } from '~/types'

const isabelle: Monster = {
  hp: 180000,
  dp: 11000,
  md: 3600,
  hv: 250,
  fireR: 60,
  waterR: 84,
  windR: 84,
  earthR: 78,
  elecR: 78,
  lightR: 84,
  darkR: 78,
  noPropR: 78,
  physicalR: 60,
  gunR: 60
}

const little: Monster = {
  hp: 500000,
  dp: 65000,
  md: 15000,
  hv: 1500,
  fireR: 90,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 90,
  lightR: 90,
  darkR: 90,
  noPropR: 90,
  physicalR: 80,
  gunR: 75
}

const toilet: Monster = {
  hp: 600000,
  dp: 100000,
  md: 18000,
  hv: 1800,
  fireR: 90,
  waterR: 90,
  windR: 80,
  earthR: 99,
  elecR: 90,
  lightR: 90,
  darkR: 90,
  noPropR: 90,
  physicalR: 80,
  gunR: 75
}

const straw: Monster = {
  hp: 1400000,
  dp: 200000,
  md: 32000,
  hv: 4000,
  fireR: 105,
  waterR: 90,
  windR: 80,
  earthR: 105,
  elecR: 90,
  lightR: 80,
  darkR: 85,
  noPropR: 90,
  physicalR: 80,
  gunR: 80
}

const requiem: BossMonster = {
  hp: 800000,
  dp: 60000,
  md: 3900,
  hv: 450,
  da: 3000,
  fireR: 80,
  waterR: 80,
  windR: 80,
  earthR: 80,
  elecR: 80,
  lightR: 40,
  darkR: 40,
  noPropR: 40,
  physicalR: 90,
  gunR: 90,
  gaugeNum: 5
}

const snake: BossMonster = {
  hp: 999999,
  dp: 70000,
  md: 4370,
  hv: 600,
  da: 999,
  fireR: 90,
  waterR: 90,
  windR: 90,
  earthR: 90,
  elecR: 90,
  lightR: 40,
  darkR: 60,
  noPropR: 40,
  physicalR: 95,
  gunR: 95,
  gaugeNum: 5
}

const lucia: BossMonster = {
  hp: 999999,
  dp: 99999,
  md: 7000,
  hv: 2500,
  da: 3000,
  fireR: 99,
  waterR: 70,
  windR: 70,
  earthR: 70,
  elecR: 70,
  lightR: 50,
  darkR: 60,
  noPropR: 65,
  physicalR: 97,
  gunR: 97,
  gaugeNum: 5
}

const mong: BossMonster = {
  hp: 999999,
  dp: 130000,
  md: 15000,
  hv: 3500,
  da: 4000,
  fireR: 99,
  waterR: 70,
  windR: 70,
  earthR: 70,
  elecR: 70,
  lightR: 50,
  darkR: 95,
  noPropR: 75,
  physicalR: 99,
  gunR: 99,
  gaugeNum: 5
}

const hecate: BossMonster = {
  hp: 999999,
  dp: 170000,
  md: 25000,
  hv: 4000,
  da: 5000,
  fireR: 99,
  waterR: 70,
  windR: 70,
  earthR: 70,
  elecR: 70,
  lightR: 50,
  darkR: 70,
  noPropR: 80,
  physicalR: 99,
  gunR: 99,
  gaugeNum: 5
}

const janus: BossMonster = {
  hp: 60000000,
  dp: 999999,
  md: 300000,
  hv: 5500,
  da: 8000,
  fireR: 99,
  waterR: 80,
  windR: 80,
  earthR: 50,
  elecR: 50,
  lightR: 50,
  darkR: 80,
  noPropR: 65,
  physicalR: 20,
  gunR: 1,
  gaugeNum: 5
}

const chronos: BossMonster = {
  hp: 60000000,
  dp: 300000,
  md: 99999,
  hv: 5000,
  da: 8000,
  fireR: 130,
  waterR: 130,
  windR: 130,
  earthR: 130,
  elecR: 130,
  lightR: 130,
  darkR: 130,
  noPropR: 60,
  physicalR: 5,
  gunR: 1,
  gaugeNum: 5
}

const kevin: BossMonster = {
  hp: 100000000,
  dp: 600000,
  md: 250000,
  hv: 8500,
  da: 25000,
  fireR: 250,
  waterR: 80,
  windR: 80,
  earthR: 60,
  elecR: 50,
  lightR: 50,
  darkR: 70,
  noPropR: 100,
  physicalR: 1,
  gunR: 1,
  gaugeNum: 5
}

export {
  isabelle,
  little,
  toilet,
  straw,
  requiem,
  snake,
  lucia,
  mong,
  hecate,
  janus,
  chronos,
  kevin
}
