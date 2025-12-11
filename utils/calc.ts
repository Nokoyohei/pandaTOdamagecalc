import BuffRatio from '~/utils/buffRatio'
import { Monster, DebuffName, BossMonster, Status, Attributes } from '~/types'
import SkillRatio from '~/utils/skillRatio'

export const initStatus = (): Status & Attributes => {
  return {
    ap: 100000,
    ac: 10000,
    dx: -1000,
    mp: 200000,
    ma: 10000,
    md: 200000,
    wt: 200000,
    da: 10000,
    lk: 10000,
    hp: 200000,
    dp: 200000,
    hv: 10000,
    gunAP: 32000,
    throwAP: 32000,
    fire: 2000,
    water: 2000,
    elec: 2000,
    wind: 2000,
    soil: 2000,
    holy: 2000,
    dark: 2000
  }
}

export const initExtraStatus = (): Status => {
  return {
    ap: 0,
    ac: 0,
    dx: 0,
    mp: 0,
    ma: 0,
    md: 0,
    wt: 0,
    da: 0,
    lk: 0,
    hp: 0,
    dp: 0,
    hv: 0
  }
}

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

export const calcDarkCommandoDamage = (ma: number, basePower: number = 184) =>
  Math.ceil((ma - 49) * SkillRatio.DarkCommando(basePower))
export const calcGravityCrashDamage = (ma: number, basePower: number = 900) =>
  Math.ceil((ma - 49) * SkillRatio.GravityCrash(basePower))
export const calcCelestialStrikeDamage = (ma: number, skillNum: number, basePower: number = 550) =>
  Math.ceil((ma - 25) * SkillRatio.CelestialStrike(skillNum, basePower))
export const calcBlessingDamage = (ac: number, lk: number, ratio: number) =>
  Math.ceil(ac + lk) * ratio
export const calcCleavingTerraDamage = (ma: number, basePower: number = 337) =>
  Math.ceil((ma - 25) * SkillRatio.CleavingTerra(basePower))
export const calcWindBladeDamage = (ma: number, basePower: number = 268) =>
  Math.ceil((ma - 49) * SkillRatio.WindBlade(basePower))
export const calcRagingStormDamage = (ac: number, ma: number, basePower: number = 360) =>
  Math.ceil((ac + ma - 49) * SkillRatio.RasingStorm(basePower))
export const calcElectroAttackDamage = (ma: number, basePower: number = 376) =>
  Math.ceil((ma - 25) * SkillRatio.ElectroAttack(basePower))
export const calcScytheDamage = (ma: number, dark: number, basePower: number = 45) =>
  Math.ceil((ma - 49) * SkillRatio.Scythe(dark, basePower))
export const calcStaffOfAgony = (ma: number, dark: number, basePower: number = 65) =>
  Math.ceil((ma - 49) * SkillRatio.StaffOfAgony(dark, basePower))
export const calcMagicalSoulDamage = (ap: number, ma: number) => ap * (ma / 100)
export const calcStaffOfThunderDamage = (ma: number, basePower: number = 510) =>
  Math.ceil((ma - 25) * SkillRatio.StaffOfThunder(basePower))
export const calcTeslaFieldDamage = (ma: number, mp: number, basePower: number = 430) =>
  Math.ceil((ma + Math.floor(mp / 120)) * SkillRatio.TeslaField(basePower))
export const calcDeadlyFenDamage = (ma: number, lk: number, basePower: number = 368) =>
  Math.ceil((ma + lk - 25) * SkillRatio.DeadlyFen(basePower))
export const calcTornadoBlastDamage = (ma: number, basePower: number = 330) =>
  Math.ceil((ma - 49) * SkillRatio.TornadoBlast(basePower))
export const calcEarthquakeDamage = (ma: number, basePower: number = 495) =>
  Math.ceil((ma - 25) * SkillRatio.Earthquake(basePower))

export const calcFullHouseDamage = (ap: number, lk: number, hv: number, basePower: number = 800) =>
  Math.ceil((ap + (lk + hv) * 8) * SkillRatio.FullHouse(basePower))
export const calcSharpScreamDamage = (ap: number, hv: number, basePower: number = 510) =>
  Math.ceil((ap + hv * 16) * SkillRatio.SharpScream(basePower))
export const calcFirstHitComboDamage = (ap: number, basePower: number = 620) =>
  Math.ceil(ap * (11 * 0.6 + 3) * SkillRatio.FirstHitCombo(basePower))
export const calcSecondHitComboDamage = (ap: number, hv: number, basePower: number = 620) =>
  Math.ceil((ap + hv * 16) * (11 * 0.6 + 3) * SkillRatio.SecondHitCombo(basePower))
export const calcOnePairDamage = (
  ap: number,
  hv: number,
  isLadyLuck?: boolean,
  basePower: number = 690,
  ladyLuckPower: number = 6
) => {
  const onePairDamage = Math.ceil((ap + hv * 8) * SkillRatio.OnePair(basePower))
  return isLadyLuck
    ? onePairDamage + onePairDamage * SkillRatio.LadyLuck(ladyLuckPower)
    : onePairDamage
}

export const calcEarthquakeBladeDamage = (ap: number, soil: number, basePower: number = 440) =>
  Math.ceil(ap * SkillRatio.EarthquakeBlade(soil, basePower))
export const calcSonicSlashDamage = (ap: number, water: number, basePower: number = 700) =>
  Math.ceil(ap * SkillRatio.SonicSlash(water, basePower))
export const calcTidalSlashDamage = (ap: number, water: number, basePower: number = 550) =>
  Math.ceil(ap * SkillRatio.TidalSlash(water, basePower))
export const calcTempestStrikeDamage = (ap: number, wind: number, basePower: number = 240) =>
  Math.ceil(ap * SkillRatio.TempestStrike(wind, basePower))
export const calcGaleStrikeDamage = (ap: number, wind: number, basePower: number = 260) =>
  Math.ceil(ap * SkillRatio.GaleStrike(wind, basePower))
export const calcChampionsBladeDamage = (ap: number, fire: number, basePower: number = 490) =>
  Math.ceil(ap * SkillRatio.ChampionsBlade(fire, basePower))
export const calcFlamingFistDamage = (ap: number, fire: number, ma: number, basePower: number = 570) =>
  Math.ceil((ap * SkillRatio.FlamingFist(fire, basePower) * ma) / 100)

export const calcFanOfKnicesDamage = (da: number, throwAp: number, basePower: number = 600) =>
  Math.ceil((da + throwAp / 10) * SkillRatio.FanOfKnives(basePower))
export const calcShootingSpreeDamage = (gunAP: number, basePower: number = 240) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.ShootingSpree(basePower))
export const calcBerserkDamage = (gunAP: number, basePower: number = 350) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.Berserk(basePower))
export const calcChainOfKnivesDamage = (da: number, throwAp: number, basePower: number = 630) =>
  Math.ceil((da * 16 + throwAp * 6) * SkillRatio.ChainOfKnives(basePower))
export const calcPoisonAssaultDamage = (da: number, throwAp: number, basePower: number = 390) =>
  Math.ceil(da * 16 * SkillRatio.PoisonAssault(basePower)) + throwAp
export const calcPoisonDamage = (da: number, throwAp: number, basePower: number = 390) =>
  Math.ceil((da * 16 + throwAp) * 0.412 * SkillRatio.PoisonAssault(basePower))
export const calcSuddenAttackDamage = (ap: number, da: number, lk: number, basePower: number = 840) =>
  Math.ceil(((da + lk) * 16 + ap) * SkillRatio.SuddenAttack(basePower))
export const calcLuckyFistDamage = (enemyHp: number, lk: number, basePower: number = 440) =>
  Math.ceil((enemyHp + lk * 80) * SkillRatio.LuckyFist(basePower))
export const calcPowerShotDamage = (gunAP: number, basePower: number = 300) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.PowerShot(basePower))
export const calcDoubleShotDamage = (gunAP: number, basePower: number = 480) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.DoubleShot(basePower))

// In Trickster, there is a spec that deals 2^32/100 damage for every 2^32 damage
// if the resistance *idealDamage exceeds 2^31, with no resistance or defense
// It's probably an overflow measure, but it feels to me like it's being handled the wrong way
export const calcExtraDamage = (
  idealDamage: number,
  resistance: number,
  extraMultiplier: number = 1
) => {
  if (resistance >= 100) return 0
  const extraDamageNum = (idealDamage * resistance - 2 ** 31) / 2 ** 32
  let extraDamage: number = 0
  const EXTRA_DAMAGE = Math.floor(2 ** 32 / 100) * extraMultiplier
  for (let i = 0; i < extraDamageNum; i++) {
    // first extra damage is special case
    if (i !== 0 && extraDamage + EXTRA_DAMAGE >= idealDamage * extraMultiplier)
      break
    extraDamage += EXTRA_DAMAGE
  }

  return extraDamage
}

// Calculate the debuffed monster's
export const calcDebuffedMonster = (
  monster: Monster | BossMonster,
  debuff: DebuffName[]
) => {
  const debuffedMonster = { ...monster } as BossMonster
  if (debuff.includes('RaionsSpace')) {
    debuffedMonster.fireR = debuffedMonster.fireR > 150 ? 100 : 1
  }
  if (debuff.includes('ShieldBreaker')) {
    debuffedMonster.physicalR = monster.physicalR - 80
    debuffedMonster.gunR = monster.gunR - 80
    debuffedMonster.dp = monster.dp * 0.72
  }
  return debuffedMonster
}

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
  idealDamage: number,
  extraMultiplier = 1,
  damageMultiplier = 1
) => {
  const extraDamage = calcExtraDamage(
    idealDamage,
    monsterResist,
    extraMultiplier
  )
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (idealDamage * extraMultiplier - monsterDef)
  )
  return (Math.floor(damage + extraDamage < 0 ? 0 : damage + extraDamage) + 1) * damageMultiplier
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
    extraMultiplier: it is a multiplier for skills that multiply directly by IdealDamage. 
                     Currently only BloodTestement is available
*/
/*
  logic: e.g. gravity crash ; x -> needed stats what we know
    ((MA + x - 49) * skillRatio.GravityCrash - monsterDef) * monsterResist = monsterHp
    (MA + x - 49) * skillRatio.GravityCrash = monsterHp / monsterReist + monsterDef
    x = (monsterHp / monsterresist + monsterDef) / skillRatio.GravityCrash + 49 - MA

*/
export const calcNeedStats = (
  monsterHp: number,
  monsterDef: number,
  monsterResist: number,
  attackRatio: number,
  nowStats: number,
  constStats = 49,
  extraMultiplier = 1
) => {
  // If there is no overflow when calculating damage in Trickster
  const resistance = (100 - monsterResist) / 100
  const idealDamage = monsterHp / resistance + monsterDef
  if (idealDamage * extraMultiplier * monsterResist <= 2 ** 31) {
    return idealDamage / extraMultiplier / attackRatio + constStats - nowStats
  }

  // If there is overflow when calculating damage in Trickster
  const extraDamage = calcExtraDamage(monsterHp, monsterResist, extraMultiplier)
  const EXTRA_DAMAGE = Math.floor(2 ** 32 / 100) * extraMultiplier
  const calcIdealDamage = (extraNum: number) =>
    (extraNum * 2 ** 32 + 2 ** 31) / monsterResist
  const damage = (idealDamage: number) =>
    (idealDamage * extraMultiplier - monsterDef) * resistance
  let extraDamageNum = extraDamage / EXTRA_DAMAGE

  // If the damage from the attack + overFlowDamage isn't enough to defeat monster,
  // you'll need to strengthen your attack until the next overFlowDamage occurs.
  if (
    damage(calcIdealDamage(extraDamage / EXTRA_DAMAGE)) * extraMultiplier +
      extraDamageNum * EXTRA_DAMAGE <
    monsterHp
  )
    extraDamageNum++

  // If defeat after one extra damage
  let resHp = damage(2 ** 31 / monsterResist)
  // If can not defeat after one extra damage
  if (extraDamageNum !== 1) {
    resHp =
      extraDamageNum * EXTRA_DAMAGE * extraMultiplier <= monsterHp
        ? damage(calcIdealDamage(extraDamageNum - 1))
        : extraDamageNum * EXTRA_DAMAGE * extraMultiplier * resistance +
          monsterDef
  }

  return (
    (resHp / extraMultiplier / resistance + monsterDef) / attackRatio +
    constStats -
    nowStats
  )
}

export const calcLKBuffRatio = (
  LKBuff: ('luckySeven' | 'auraOfLuck' | 'firstAnniversary')[]
) => {
  let buffRatio = 1

  if (LKBuff.includes('luckySeven')) buffRatio += BuffRatio.LuckySevenBuff
  if (LKBuff.includes('auraOfLuck')) buffRatio += BuffRatio.AuraOfLuckBuff
  if (LKBuff.includes('firstAnniversary'))
    buffRatio += BuffRatio.FirstdAnniversaryBuff
  return buffRatio
}

export const calcHVBuffRatio = (HVBuff: 'dodgeMaster'[]) => {
  let buffRatio = 1

  if (HVBuff.includes('dodgeMaster')) buffRatio += BuffRatio.DodgeMasterBuff
  return buffRatio
}

export const calcAPBuffRatio = (APBuff: ('pumpingHeart' | 'adrenaline')[]) => {
  let buffRatio = 1

  if (APBuff.includes('pumpingHeart')) buffRatio += BuffRatio.PumpingHeartBuff
  if (APBuff.includes('adrenaline')) buffRatio += BuffRatio.AdrenalineBuff
  return buffRatio
}

export const calcDABuffRatio = (
  DABuff: ('sixthSense' | 'secondAnniversary')[]
) => {
  let buffRatio = 1

  if (DABuff.includes('sixthSense')) buffRatio += BuffRatio.SixthSenseBuff
  if (DABuff.includes('secondAnniversary'))
    buffRatio += BuffRatio.secondAnniversaryBuff
  return buffRatio
}

export const calcThrowBuffRatio = (ThrowBuff: 'precisePitch'[]) => {
  let buffRatio = 1

  if (ThrowBuff.includes('precisePitch')) buffRatio = BuffRatio.PrecisePitch
  return buffRatio
}

export const calcMABuffRatio = (MABuff: 'mistOfMana'[]) => {
  let buffRatio = 1

  if (MABuff.includes('mistOfMana')) buffRatio += BuffRatio.MistOfManaBuff
  return buffRatio
}

export const calcACBuffRatio = (
  ACBuff: ('gunBooster' | 'bullsEye' | 'eagleEye')[]
) => {
  let buffRatio = 1

  if (ACBuff.includes('gunBooster') || ACBuff.includes('bullsEye'))
    buffRatio += BuffRatio.GunBoosterBuff
  if (ACBuff.includes('eagleEye')) buffRatio += BuffRatio.EagleEyeBuff
  return buffRatio
}
