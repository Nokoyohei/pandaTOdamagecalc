import BuffRatio from '~/utils/buffRatio'
import { Monster, DebuffName, BossMonster } from '~/types'
import SkillRatio from '~/utils/skillRatio'

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

export const calcDarkCommandoDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.DarkCommando)
export const calcGravityCrashDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.GravityCrash)
export const calcCelestialStrikeDamage = (ma: number, skillNum: number) =>
  Math.ceil((ma - 25) * SkillRatio.CelestialStrike(skillNum))
export const calcBlessingDamage = (ac: number, lk: number) =>
  Math.ceil(ac + lk) * SkillRatio.Blessing
export const calcCleavingTerraDamage = (ma: number) =>
  Math.ceil((ma - 25) * SkillRatio.CleavingTerra)
export const calcWindBladeDamage = (ma: number) =>
  Math.ceil((ma - 49) * SkillRatio.WindBlade)
export const calcRagingStormDamage = (ac: number, ma: number) =>
  Math.ceil((ac + ma - 49) * SkillRatio.RasingStorm)
export const calcElectroAttackDamage = (ma: number) =>
  Math.ceil((ma - 25) * SkillRatio.ElectroAttack)
export const calcScytheDamage = (ma: number, dark: number) =>
  Math.ceil((ma - 49) * SkillRatio.Scythe(dark))
export const calcStaffOfAgony = (ma: number, dark: number) =>
  Math.ceil((ma - 49) * SkillRatio.StaffOfAgony(dark))
export const calcMagicalSoulDamage = (ap: number, ma: number) => ap * (ma / 100)

export const calcFullHouseDamage = (ap: number, lk: number, hv: number) =>
  Math.ceil((ap + (lk + hv) * 8) * SkillRatio.FullHouse)
export const calcSharpScreamDamage = (ap: number, hv: number) =>
  Math.ceil((ap + hv * 16) * SkillRatio.SharpScream)

export const calcEarthquakeBladeDamage = (ap: number, soil: number) =>
  Math.ceil(ap * SkillRatio.EarthquakeBlade(soil))
export const calcSonicSlashDamage = (ap: number, water: number) =>
  Math.ceil(ap * SkillRatio.SonicSlash(water))
export const calcTidalSlashDamage = (ap: number, water: number) =>
  Math.ceil(ap * SkillRatio.TidalSlash(water))
export const calcTempestStrikeDamage = (ap: number, wind: number) =>
  Math.ceil(ap * SkillRatio.TempestStrike(wind))
export const calcGaleStrikeDamage = (ap: number, wind: number) =>
  Math.ceil(ap * SkillRatio.GaleStrike(wind))
export const calcChampionsBladeDamage = (ap: number, fire: number) =>
  Math.ceil(ap * SkillRatio.ChampionsBlade(fire))
export const calcFlamingFistDamage = (ap: number, fire: number, ma: number) =>
  Math.ceil((ap * SkillRatio.FlamingFist(fire) * ma) / 100)

export const calcFanOfKnicesDamage = (da: number, throwAp: number) =>
  Math.ceil((da + throwAp / 10) * SkillRatio.FanOfKnives)
export const calcShootingSpreeDamage = (gunAP: number) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.ShootingSpree)
export const calcBerserkDamage = (gunAP: number) =>
  Math.ceil((gunAP - 48 * 20) * SkillRatio.Berserk)
export const calcChainOfKnivesDamage = (da: number, throwAp: number) =>
  Math.ceil((da * 16 + throwAp * 6) * SkillRatio.ChainOfKnives)
export const calcPoisonAssaultDamage = (da: number, throwAp: number) =>
  Math.ceil(da * 16 * SkillRatio.PoisonAssault) + throwAp
export const calcPoisonDamage = (da: number, throwAp: number) =>
  Math.ceil((da * 16 + throwAp) * 0.312) * SkillRatio.PoisonAssault
export const calcSuddenAttackDamage = (ap: number, da: number, lk: number) =>
  Math.ceil((da + lk) * 16 + ap) * SkillRatio.SuddenAttack
export const calcLuckyFistDamage = (enemyHp: number, lk: number) =>
  Math.ceil(enemyHp + lk * 80) * SkillRatio.LuckyFist

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
    debuffedMonster.hv = monster.hv * 0.72
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
  extraMultiplier = 1
) => {
  const extraDamage = calcExtraDamage(
    idealDamage,
    monsterResist,
    extraMultiplier
  )
  const damage = Math.floor(
    ((100 - monsterResist) / 100) * (idealDamage * extraMultiplier - monsterDef)
  )
  return Math.floor(damage + extraDamage < 0 ? 0 : damage + extraDamage) + 1
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
