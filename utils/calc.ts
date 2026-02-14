import BuffRatio from '~/utils/buffRatio'
import type { Monster, DebuffName, BossMonster, Status, Attributes } from '~/types'
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

// Extra damage from int32 overflow in resist calculation
// When effectiveIdeal * resist overflows 2^32, each overflow adds floor(2^32/100) damage
export const EXTRA_DAMAGE_UNIT = Math.floor(2 ** 32 / 100)

export const calcExtraDamage = (
  effectiveIdeal: number,
  resistance: number
) => {
  if (resistance >= 100) return 0
  const overflowCount = Math.floor(effectiveIdeal * resistance / 2 ** 32)
  return overflowCount * EXTRA_DAMAGE_UNIT
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

// Simulate signed 32-bit integer overflow
export const toInt32 = (n: number): number => {
  const INT32_MAX = 2 ** 31 - 1
  if (n >= -(INT32_MAX + 1) && n <= INT32_MAX) return n
  const mod = ((n % 2 ** 32) + 2 ** 32) % 2 ** 32
  return mod > INT32_MAX ? mod - 2 ** 32 : mod
}

export const INT32_MAX = 2 ** 31 - 1

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
  const effectiveIdeal = idealDamage * extraMultiplier
  const extraDamage = calcExtraDamage(effectiveIdeal, monsterResist)
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (effectiveIdeal - monsterDef)
  )
  return Math.max(0, damage + extraDamage) * damageMultiplier
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
  const resistFactor = (100 - monsterResist) / 100

  // No overflow case: effectiveIdeal * resist < 2^32
  const noOverflowEffIdeal = monsterHp / resistFactor + monsterDef
  if (noOverflowEffIdeal * monsterResist < 2 ** 32) {
    return noOverflowEffIdeal / extraMultiplier / attackRatio + constStats - nowStats
  }

  // With overflow: find minimum effectiveIdeal where
  // floor(resistFactor * (effIdeal - def)) + floor(effIdeal * R / 2^32) * EXTRA_DAMAGE_UNIT >= hp
  let bestEffIdeal = noOverflowEffIdeal
  for (let n = 1; n < 200; n++) {
    const minEffIdealForN = n * 2 ** 32 / monsterResist
    // Extra damage alone covers monster HP
    if (n * EXTRA_DAMAGE_UNIT >= monsterHp) {
      bestEffIdeal = Math.min(bestEffIdeal, minEffIdealForN)
      break
    }
    const neededForBase = (monsterHp - n * EXTRA_DAMAGE_UNIT) / resistFactor + monsterDef
    const effIdeal = Math.max(minEffIdealForN, neededForBase)
    if (effIdeal < bestEffIdeal) bestEffIdeal = effIdeal
    if (minEffIdealForN > bestEffIdeal) break
  }

  return bestEffIdeal / extraMultiplier / attackRatio + constStats - nowStats
}

export const calcLKBuffRatio = (
  LKBuff: ('luckySeven' | 'auraOfLuck' | 'firstAnniversary' | 'godlyLuckySeven' | 'godlyAuraOfLuck')[]
) => {
  let buffRatio = 1

  if (LKBuff.includes('godlyLuckySeven')) buffRatio += BuffRatio.GodlyLuckySevenBuff
  else if (LKBuff.includes('luckySeven')) buffRatio += BuffRatio.LuckySevenBuff

  if (LKBuff.includes('godlyAuraOfLuck')) buffRatio += BuffRatio.GodlyAuraOfLuckBuff
  else if (LKBuff.includes('auraOfLuck')) buffRatio += BuffRatio.AuraOfLuckBuff

  if (LKBuff.includes('firstAnniversary'))
    buffRatio += BuffRatio.FirstdAnniversaryBuff
  return buffRatio
}

export const calcHVBuffRatio = (HVBuff: ('dodgeMaster' | 'godlyDodgeMaster')[]) => {
  let buffRatio = 1

  if (HVBuff.includes('godlyDodgeMaster')) buffRatio += BuffRatio.GodlyDodgeMasterBuff
  else if (HVBuff.includes('dodgeMaster')) buffRatio += BuffRatio.DodgeMasterBuff
  return buffRatio
}

export const calcAPBuffRatio = (APBuff: ('pumpingHeart' | 'adrenaline' | 'godlyAdrenaline')[]) => {
  let buffRatio = 1

  if (APBuff.includes('pumpingHeart')) buffRatio += BuffRatio.PumpingHeartBuff

  if (APBuff.includes('godlyAdrenaline')) buffRatio += BuffRatio.GodlyAdrenalineBuff
  else if (APBuff.includes('adrenaline')) buffRatio += BuffRatio.AdrenalineBuff
  return buffRatio
}

export const calcDABuffRatio = (
  DABuff: ('sixthSense' | 'secondAnniversary' | 'godlySixthSense')[]
) => {
  let buffRatio = 1

  if (DABuff.includes('godlySixthSense')) buffRatio += BuffRatio.GodlySixthSenseBuff
  else if (DABuff.includes('sixthSense')) buffRatio += BuffRatio.SixthSenseBuff

  if (DABuff.includes('secondAnniversary'))
    buffRatio += BuffRatio.secondAnniversaryBuff
  return buffRatio
}

export const calcThrowBuffRatio = (ThrowBuff: 'precisePitch'[]) => {
  let buffRatio = 1

  if (ThrowBuff.includes('precisePitch')) buffRatio = BuffRatio.PrecisePitch
  return buffRatio
}

export const calcMABuffRatio = (MABuff: ('mistOfMana' | 'godlyMistOfMana')[]) => {
  let buffRatio = 1

  if (MABuff.includes('godlyMistOfMana')) buffRatio += BuffRatio.GodlyMistOfManaBuff
  else if (MABuff.includes('mistOfMana')) buffRatio += BuffRatio.MistOfManaBuff
  return buffRatio
}

export const calcACBuffRatio = (
  ACBuff: ('gunBooster' | 'bullsEye' | 'eagleEye' | 'godlyBullsEye' | 'godlyEagleEye')[]
) => {
  let buffRatio = 1

  if (ACBuff.includes('godlyBullsEye')) buffRatio += BuffRatio.GodlyBullsEyeBuff
  else if (ACBuff.includes('gunBooster') || ACBuff.includes('bullsEye'))
    buffRatio += BuffRatio.GunBoosterBuff

  if (ACBuff.includes('godlyEagleEye')) buffRatio += BuffRatio.GodlyEagleEyeBuff
  else if (ACBuff.includes('eagleEye')) buffRatio += BuffRatio.EagleEyeBuff
  return buffRatio
}
