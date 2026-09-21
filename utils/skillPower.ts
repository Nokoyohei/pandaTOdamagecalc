import { ftol } from '~/utils/x87'

/*
 * 各スキルが BattleHelper に渡す power を、サーバ実装と同じ形で組み立てる。
 * 出典: SPEC/05_skills.md「威力 power」列（`P.X` = ESAction_* テーブルの列）
 *
 *   魔法 FUN_0059C230 : power はテーブルの AP そのもの（+ 属性値の項）。
 *                       ダメージ側が power × (MA − maPenalty) / 100 を計算する。
 *   物理 FUN_0059C000 : power = ftol(ステータス式 × P.Ratio)。呼び出し側で切り捨てる。
 *   射撃 FUN_0059D440 : power = ((AC − 49) × 20 + 弾丸AP + 20) × mul、mul = P.Ratio。
 *
 * したがって魔法スキルの既定値は AP（power そのもの）、物理・射撃スキルの既定値は
 * Ratio を百分率にしたもの（UI の刻みを整数に保つため）。
 */

/** ESAction_* テーブルの該当行の値。魔法 = AP、物理・射撃 = Ratio × 100 */
export const SKILL_POWER = {
  // --- 魔法: P.AP ---
  DarkCommando: 184,
  GravityCrash: 900,
  CelestialStrike: 500,
  Scythe: 5500,
  StaffOfAgony: 7500,
  Blessing: 1620,
  WindBlade: 2680,
  RagingStorm: 2700,
  ElectroAttack: 2510,
  StaffOfThunder: 1500,
  TeslaField: 1720,
  DeadlyFen: 2000,
  TornadoBlast: 1320,
  Earthquake: 3500,
  CleavingTerra: 2250,
  // --- 物理・射撃: P.Ratio × 100 ---
  FlamingFist: 530,
  FullHouse: 400,
  SharpScream: 340,
  HitCombo: 2000,
  OnePair: 3000,
  LadyLuck: 6,
  EarthquakeBlade: 440,
  SonicSlash: 1000,
  TidalSlash: 1000,
  TempestStrike: 240,
  GaleStrike: 260,
  ChampionsBlade: 490,
  FanOfKnives: 600,
  ChainOfKnives: 2000,
  PoisonAssault: 1200,
  SuddenAttack: 2500,
  LuckyFist: 100,
  ShootingSpree: 245,
  Berserk: 350,
  PowerShot: 2000,
  DoubleShot: 2000
} as const

export const GODLY_SKILL_POWER = {
  GravityCrash: 20000,
  Scythe: 10000,
  StaffOfAgony: 15000,
  SonicSlash: 1200,
  GaleStrike: 350,
  EarthquakeBlade: 1000,
  ChainOfKnives: 4000,
  PowerShot: 6000,
  DoubleShot: 7000,
  PoisonAssault: 2400,
  Berserk: 1000,
  OnePair: 10000,
  HitCombo: 8000,
  FullHouse: 2000,
  FanOfKnives: 1500
} as const

/*
 * 物理・射撃スキルの P.Ratio（テーブル値を実際の係数に直したもの）。
 * power が「ステータス × Ratio」なので、必要ステータスの逆算にはこちらを使う。
 */
export const SkillRatio = {
  FlamingFist: (fire: number, ratio: number = SKILL_POWER.FlamingFist) =>
    ratio / 100 + fire / 100,
  FullHouse: (ratio: number = SKILL_POWER.FullHouse) => ratio / 100,
  SharpScream: (ratio: number = SKILL_POWER.SharpScream) => ratio / 100,
  FirstHitCombo: (ratio: number = SKILL_POWER.HitCombo) => ratio / 300,
  SecondHitCombo: (ratio: number = SKILL_POWER.HitCombo) => ratio / 400,
  OnePair: (ratio: number = SKILL_POWER.OnePair) => ratio / 100,
  // Lady Luck 習得時の倍率 × (1 + cards / 15)。cards は MinCard〜MaxCard の一様乱数
  LadyLuck: (cards: number = SKILL_POWER.LadyLuck) => cards / 15,
  EarthquakeBlade: (soil: number, ratio: number = SKILL_POWER.EarthquakeBlade) =>
    ratio / 100 + soil * 0.02,
  SonicSlash: (water: number, ratio: number = SKILL_POWER.SonicSlash) =>
    ratio / 100 + water * 0.035,
  TidalSlash: (water: number, ratio: number = SKILL_POWER.TidalSlash) =>
    ratio / 100 + water * 0.025,
  TempestStrike: (wind: number, ratio: number = SKILL_POWER.TempestStrike) =>
    ratio / 100 + wind * 0.05,
  GaleStrike: (wind: number, ratio: number = SKILL_POWER.GaleStrike) =>
    ratio / 100 + wind * 0.07,
  ChampionsBlade: (fire: number, ratio: number = SKILL_POWER.ChampionsBlade) =>
    ratio / 100 + fire / 100,
  FanOfKnives: (ratio: number = SKILL_POWER.FanOfKnives) => ratio / 10,
  ChainOfKnives: (ratio: number = SKILL_POWER.ChainOfKnives) => ratio / 100,
  PoisonAssault: (ratio: number = SKILL_POWER.PoisonAssault) => ratio / 100,
  SuddenAttack: (ratio: number = SKILL_POWER.SuddenAttack) => ratio / 100,
  LuckyFist: (ratio: number = SKILL_POWER.LuckyFist) => ratio / 1000,
  ShootingSpree: (ratio: number = SKILL_POWER.ShootingSpree) => ratio / 100,
  Berserk: (ratio: number = SKILL_POWER.Berserk) => ratio / 100,
  PowerShot: (ratio: number = SKILL_POWER.PowerShot) => ratio / 100,
  DoubleShot: (ratio: number = SKILL_POWER.DoubleShot) => ratio / 100
}

/* ============================================================================
 * 魔法スキルの power = P.AP（+ 属性値の項）
 * MA 減算値は calc.ts の calc*Damage 側で渡す
 * ==========================================================================*/

// Dark Commando (2704) ESAction_DarkGhost / MA−49
const DarkCommando = (ap: number = SKILL_POWER.DarkCommando) => ap
// Gravity Crush (2210) ESAction_Gravity / MA−49
const GravityCrash = (ap: number = SKILL_POWER.GravityCrash) => ap
// Celestial Strike (2503) / MA−25。光スキル数で伸びる
const CelestialStrike = (lightSkills: number, ap: number = SKILL_POWER.CelestialStrike) =>
  (ap * (34 + lightSkills)) / 22.5
// Scythe (2701) ESAction_DeathScythe / MA−49 : 闇属性 × 30 + P.AP
const Scythe = (dark: number, ap: number = SKILL_POWER.Scythe) => dark * 30 + ap
// Staff of Agony (2703) ESAction_DespairSpear / MA−49 : 闇属性 × 15 + P.AP
const StaffOfAgony = (dark: number, ap: number = SKILL_POWER.StaffOfAgony) => dark * 15 + ap
// *'s Blessing (2306-2310) ESA*Counter : power = ftol(P.AP × 0.5)、MA が打ち消されて AC+LK になる
const Blessing = (ap: number = SKILL_POWER.Blessing) => ftol(ap * 0.5)
// Wind Blade (2111) ESAction_WindSlash / MA−49
const WindBlade = (ap: number = SKILL_POWER.WindBlade) => ap
// Raging Storm (2305) ESAction_MustangWind / MA−(49−AC) なので実効 MA+AC−49
const RagingStorm = (ap: number = SKILL_POWER.RagingStorm) => ap
// Electro Attack (2105) ESAction_ThunderBolt / MA−25
const ElectroAttack = (ap: number = SKILL_POWER.ElectroAttack) => ap
// Staff of Thunder (2302) ESAction_ElectricSpear / MA−25
const StaffOfThunder = (ap: number = SKILL_POWER.StaffOfThunder) => ap
// Tesla Field : SPEC 未収録。MA + ⌊MP/120⌋ で効く
const TeslaField = (ap: number = SKILL_POWER.TeslaField) => ap
// Deadly Fen : SPEC 未収録。MA + LK − 25 で効く
const DeadlyFen = (ap: number = SKILL_POWER.DeadlyFen) => ap
// Tornado Blast (2131) ESAction_GaleBreak の P.MagicAP / MA−49
const TornadoBlast = (ap: number = SKILL_POWER.TornadoBlast) => ap
// Earthquake (2304) ESAction_Earthquake / MA−25
const Earthquake = (ap: number = SKILL_POWER.Earthquake) => ap
// Cleaving Terra (2109) ESAction_Earth_Divide / MA−25
const CleavingTerra = (ap: number = SKILL_POWER.CleavingTerra) => ap
// Magical Soul (2014) ESAction_FairyOfMagic / MA−0 : 威力は術者の AP
const MagicalSoul = (attackerAp: number) => attackerAp
// Flaming Fist (1303) ESAction_FightingFire / MA−0 : ftol(AP × (火属性/100 + P.Ratio))
const FlamingFist = (
  attackerAp: number,
  fire: number,
  ratio: number = SKILL_POWER.FlamingFist
) => ftol(attackerAp * SkillRatio.FlamingFist(fire, ratio))

/* ============================================================================
 * 物理スキルの power = ftol(ステータス式 × P.Ratio)
 * ==========================================================================*/

// Full House (4501) ESAFullHouseHit : ftol((AP + 8 × (HV + LK)) × P.Ratio)
const FullHouse = (
  attackerAp: number,
  lk: number,
  hv: number,
  ratio: number = SKILL_POWER.FullHouse
) => ftol((attackerAp + (lk + hv) * 8) * SkillRatio.FullHouse(ratio))

// Sharp Scream (4304) ESAction_SharpScream
const SharpScream = (
  attackerAp: number,
  hv: number,
  ratio: number = SKILL_POWER.SharpScream
) => ftol((attackerAp + hv * 16) * SkillRatio.SharpScream(ratio))

// 2 Hit Combo (4302) ESAction_TwoChainAttack
const FirstHitCombo = (attackerAp: number, ratio: number = SKILL_POWER.HitCombo) =>
  ftol(attackerAp * (11 * 0.6 + 3) * SkillRatio.FirstHitCombo(ratio))
const SecondHitCombo = (
  attackerAp: number,
  hv: number,
  ratio: number = SKILL_POWER.HitCombo
) => ftol((attackerAp + hv * 16) * (11 * 0.6 + 3) * SkillRatio.SecondHitCombo(ratio))

// One Pair (4204) ESAction_OnePair : ftol((AP + HV × 8) × P.Ratio)
// Lady Luck 習得時のみ × (1 + cards / 15)
const OnePair = (
  attackerAp: number,
  hv: number,
  isLadyLuck = false,
  ratio: number = SKILL_POWER.OnePair,
  cards: number = SKILL_POWER.LadyLuck
) => {
  const power = ftol((attackerAp + hv * 8) * SkillRatio.OnePair(ratio))
  return isLadyLuck ? ftol(power * (1 + SkillRatio.LadyLuck(cards))) : power
}

// Earthquake Blade (1210) ESAction_EarthquakeSword : ftol(AP × (P.Ratio + 2 × 地属性 × 0.01))
const EarthquakeBlade = (
  attackerAp: number,
  soil: number,
  ratio: number = SKILL_POWER.EarthquakeBlade
) => ftol(attackerAp * SkillRatio.EarthquakeBlade(soil, ratio))

// Sonic Slash (1502) ESAction_PowerSeaBrandish : ftol(AP × (水属性 × 0.035 + P.Ratio))
const SonicSlash = (
  attackerAp: number,
  water: number,
  ratio: number = SKILL_POWER.SonicSlash
) => ftol(attackerAp * SkillRatio.SonicSlash(water, ratio))

// Tidal Slash (1207) ESAction_PowerBrandish : ftol(AP × (水属性 × 0.025 + P.Ratio))
const TidalSlash = (
  attackerAp: number,
  water: number,
  ratio: number = SKILL_POWER.TidalSlash
) => ftol(attackerAp * SkillRatio.TidalSlash(water, ratio))

// Tempest Strike (1209) ESAction_WindBrandish : ftol(AP × (P.Ratio + 5 × w))
// w はゲームでは (rand() % 風属性)/100。ここは最大値を採る
const TempestStrike = (
  attackerAp: number,
  wind: number,
  ratio: number = SKILL_POWER.TempestStrike
) => ftol(attackerAp * SkillRatio.TempestStrike(wind, ratio))

// Gale Strike (1504) ESAction_WindCircleBrandish : ftol(AP × (P.Ratio + 7 × w))
const GaleStrike = (
  attackerAp: number,
  wind: number,
  ratio: number = SKILL_POWER.GaleStrike
) => ftol(attackerAp * SkillRatio.GaleStrike(wind, ratio))

// Champion's Blade (1110) ESAction_BlastBrandish : ftol(AP × (火属性 × 0.01 + P.Ratio))
const ChampionsBlade = (
  attackerAp: number,
  fire: number,
  ratio: number = SKILL_POWER.ChampionsBlade
) => ftol(attackerAp * SkillRatio.ChampionsBlade(fire, ratio))

// Fan of Knives (3109) ESAction_WideThrow
const FanOfKnives = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.FanOfKnives
) => ftol((da + throwAp / 10) * SkillRatio.FanOfKnives(ratio))

// Chain of Knives (3110) ESAction_ChainThrow
const ChainOfKnives = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.ChainOfKnives
) => ftol((da * 16 + throwAp * 6) * SkillRatio.ChainOfKnives(ratio))

// Poison Assault (3306) ESAction_PoisonAssault : ftol(base + DA × 16 × P.Ratio)
// base は投擲武器由来なので throwAP を充てている
const PoisonAssault = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.PoisonAssault
) => ftol(da * 16 * SkillRatio.PoisonAssault(ratio)) + throwAp

// Poison Assault の毒 tick。防御・耐性を通さず直接適用される
const Poison = (da: number, throwAp: number, ratio: number = SKILL_POWER.PoisonAssault) =>
  ftol((da * 16 + throwAp) * 0.412 * SkillRatio.PoisonAssault(ratio))

// Sudden Attack (3302) ESAction_SuddenAttack
const SuddenAttack = (
  attackerAp: number,
  da: number,
  lk: number,
  ratio: number = SKILL_POWER.SuddenAttack
) => ftol(((da + lk) * 16 + attackerAp) * SkillRatio.SuddenAttack(ratio))

// Lucky Fist (3204) ESAction_UnHappyDay : 対象の MaxHP を使う
const LuckyFist = (
  enemyHp: number,
  lk: number,
  ratio: number = SKILL_POWER.LuckyFist
) => ftol((enemyHp + lk * 80) * SkillRatio.LuckyFist(ratio))

/* ============================================================================
 * 射撃スキルの power = ((AC − 49) × 20 + 弾丸AP + 20) × mul   (FUN_0059D440)
 * ==========================================================================*/

const gunPower = (ac: number, bulletAp: number, mul: number) =>
  (ac * 20 + bulletAp - 49 * 20 + 20) * mul

const ShootingSpree = (ac: number, bulletAp: number, ratio: number = SKILL_POWER.ShootingSpree) =>
  gunPower(ac, bulletAp, SkillRatio.ShootingSpree(ratio))
const Berserk = (ac: number, bulletAp: number, ratio: number = SKILL_POWER.Berserk) =>
  gunPower(ac, bulletAp, SkillRatio.Berserk(ratio))
const PowerShot = (ac: number, bulletAp: number, ratio: number = SKILL_POWER.PowerShot) =>
  gunPower(ac, bulletAp, SkillRatio.PowerShot(ratio))
const DoubleShot = (ac: number, bulletAp: number, ratio: number = SKILL_POWER.DoubleShot) =>
  gunPower(ac, bulletAp, SkillRatio.DoubleShot(ratio))

export default {
  // 魔法
  DarkCommando,
  GravityCrash,
  CelestialStrike,
  Scythe,
  StaffOfAgony,
  Blessing,
  WindBlade,
  RagingStorm,
  ElectroAttack,
  StaffOfThunder,
  TeslaField,
  DeadlyFen,
  TornadoBlast,
  Earthquake,
  CleavingTerra,
  MagicalSoul,
  FlamingFist,
  // 物理
  FullHouse,
  SharpScream,
  FirstHitCombo,
  SecondHitCombo,
  OnePair,
  EarthquakeBlade,
  SonicSlash,
  TidalSlash,
  TempestStrike,
  GaleStrike,
  ChampionsBlade,
  FanOfKnives,
  ChainOfKnives,
  PoisonAssault,
  Poison,
  SuddenAttack,
  LuckyFist,
  // 射撃
  gunPower,
  ShootingSpree,
  Berserk,
  PowerShot,
  DoubleShot
}
