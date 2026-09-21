import { ftol, f32, F32_0_01 } from '~/utils/x87'
import { SKILL_TABLE, GODLY_SKILL_TABLE, MISC_SKILL_TABLE } from '~/utils/skillTable'

/*
 * 各スキルが BattleHelper に渡す power を、サーバ実装と同じ形で組み立てる。
 * 出典: SPEC/05_skills.md を元に GameServer.exe の各ハンドラを再度逆アセンブルして確認
 *      （アドレスは各関数のコメントに記載。`P.X` = ESAction_* テーブルの列）
 *
 *   魔法 FUN_0059C230 : power はテーブルの AP そのもの（+ 属性値の項）。
 *                       ダメージ側が power × (MA − maPenalty) / 100 を計算する。
 *   物理 FUN_0059C000 : power = ftol(ステータス式 × P.Ratio)。呼び出し側で切り捨てる。
 *   射撃 FUN_0059D440 : power = ((AC − 49) × 20 + 弾丸AP + 20) × mul、mul = P.Ratio。
 *
 * したがって魔法スキルの既定値は AP（power そのもの）、物理・射撃スキルの既定値は
 * Ratio を百分率にしたもの（UI の刻みを整数に保つため）。
 */

/**
 * ESAction_* テーブル最大レベル行の値（utils/skillTable.ts、scripts/gen-skill-tables.mjs が生成）。
 * 魔法 = AP、物理・射撃 = Ratio × 100
 */
export const SKILL_POWER = SKILL_TABLE

export const GODLY_SKILL_POWER = GODLY_SKILL_TABLE

// 2 Hit Combo が参照するパッシブのスキルレベル（Power Blow 4001 / Volley Kick 4101、最大 11）
export const HIT_COMBO_SKILL_LEVEL: number = MISC_SKILL_TABLE.hitComboPassiveLevel

/*
 * 物理・射撃スキルの P.Ratio（テーブル値を実際の係数に直したもの）。
 * power が「ステータス × Ratio」なので、必要ステータスの逆算にはこちらを使う。
 */
export const SkillRatio = {
  // @0x73e6d7: 火属性 × 0.01f（0x935660）+ P.Ratio
  FlamingFist: (fire: number, ratio: number = SKILL_POWER.FlamingFist) =>
    ratio / 100 + fire * F32_0_01,
  FullHouse: (ratio: number = SKILL_POWER.FullHouse) => ratio / 100,
  SharpScream: (ratio: number = SKILL_POWER.SharpScream) => ratio / 100,
  HitCombo: (ratio: number = SKILL_POWER.HitCombo) => ratio / 100,
  OnePair: (ratio: number = SKILL_POWER.OnePair) => ratio / 100,
  // Lady Luck 習得時の倍率 × (1 + cards / 15)。cards は MinCard〜MaxCard の一様乱数
  LadyLuck: (cards: number = SKILL_POWER.LadyLuck) => f32(cards / 15),
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
  FanOfKnives: (ratio: number = SKILL_POWER.FanOfKnives) => ratio / 100,
  ChainOfKnives: (ratio: number = SKILL_POWER.ChainOfKnives) => ratio / 100,
  PoisonAssault: (ratio: number = SKILL_POWER.PoisonAssault) => ratio / 100,
  SuddenAttack: (ratio: number = SKILL_POWER.SuddenAttack) => ratio / 100,
  LuckyFist: (ratio: number = SKILL_POWER.LuckyFist) => ratio / 100,
  ShootingSpree: (ratio: number = SKILL_POWER.ShootingSpree) => ratio / 100,
  Berserk: (ratio: number = SKILL_POWER.Berserk) => ratio / 100,
  PowerShot: (ratio: number = SKILL_POWER.PowerShot) => ratio / 100,
  DoubleShot: (ratio: number = SKILL_POWER.DoubleShot) => ratio / 100
}

/* ============================================================================
 * 魔法スキルの power = P.AP（+ 属性値の項）
 * MA 減算値は各ページで magicAttackPower に渡す
 * ==========================================================================*/

// Dark Commando (2704) ESADarkGhost @0x6f3300 : power = (short)this+0xC0 ← P.M_AP / MA−49 / 闇
// 自分の闇属性ヒット（DamageInfo.prop == 0x40）を受け取るたびに発火する追撃
const DarkCommando = (mAp: number = SKILL_POWER.DarkCommando) => mAp
// Gravity Crush (2210) @0x732680 : P.AP / MA−49
const GravityCrash = (ap: number = SKILL_POWER.GravityCrash) => ap
/*
  Celestial Strike (2503) FUN_0073F0F0 @0x73f314 / MA−25 / 光

      fild [P.AP] ; fild n ; fadd 10.0 ; fstp DWORD      <- f32(n + 10)
      fmul ; fdiv 20.0 ; _ftol                             -> ftol(AP × (n + 10) / 20)

  n = FUN_0067F700: 習得スキルのうち eSkillSymbolType == 7（光）の個数。上限なし。
  該当スキルは SkillParam2 に 9 つ（Light Pact / Arrow of Light / Catastrophe Heal /
  Light Wave / Basic Healing / Light Shield / Radiant Strike / Med. Cure / Searing Light）。
*/
const CelestialStrike = (lightSkills: number, ap: number = SKILL_POWER.CelestialStrike) =>
  ftol((ap * f32(lightSkills + 10)) / 20)
// Scythe (2701) @0x7385d0 : 闇属性 × 30 + P.AP / MA−49
const Scythe = (dark: number, ap: number = SKILL_POWER.Scythe) => dark * 30 + ap
// Staff of Agony (2703) @0x738900 : 闇属性 × 15 + P.AP / MA−49
const StaffOfAgony = (dark: number, ap: number = SKILL_POWER.StaffOfAgony) => dark * 15 + ap
// *'s Blessing (2306-2310) ESA*Counter : power = ftol(P.AP × 0.5)、MA が打ち消されて AC+LK になる
const Blessing = (ap: number = SKILL_POWER.Blessing) => ftol(ap * 0.5)
// Wind Blade (2111) ESAWindSlash @0x6cb340 : P.AP / MA−49 / 風
const WindBlade = (ap: number = SKILL_POWER.WindBlade) => ap
// Raging Storm (2305) @0x739d20 : P.AP / MA−(49−AC) なので実効 MA+AC−49 / 風
const RagingStorm = (ap: number = SKILL_POWER.RagingStorm) => ap
// Electro Attack (2105) ESAThunderBolt @0x6cca70 : P.AP / MA−25 / 雷
const ElectroAttack = (ap: number = SKILL_POWER.ElectroAttack) => ap
// Staff of Thunder (2302) @0x7390e0 : P.AP / MA−25 / 雷
const StaffOfThunder = (ap: number = SKILL_POWER.StaffOfThunder) => ap
/*
  Tesla Field (2123) ESAElectricField → exec 0x525 → FUN_0073B690 @0x73b73b / 雷

      mov eax,[MaxMP] ; cdq ; mov ecx,0x78 ; idiv ecx ; neg   -> maPenalty = −(MaxMP / 120)

  power = P.AP。実効 MA は MA + trunc(MaxMP / 120)
*/
const TeslaField = (ap: number = SKILL_POWER.TeslaField) => ap
/*
  Deadly Fen (2130) ESABreakdownGround @0x6b005f / 地

      mov edx,0x19 ; sub edx,[LK]                      -> maPenalty = 25 − LK（実効 MA+LK−25）
      fild [this+0xC4 = P.M_AP] ; fmul 0.5 ; _ftol     -> power = ftol(M_AP × 0.5)
*/
const DeadlyFen = (mAp: number = SKILL_POWER.DeadlyFen) => ftol(mAp * 0.5)
// Tornado Blast (2131) ESAGaleBreak @0x6f67d4 : (short)this+0xCC ← P.MagicAP / MA−49 / 風
const TornadoBlast = (magicAp: number = SKILL_POWER.TornadoBlast) => magicAp
// Earthquake (2304) ESAEarthquakeDo : P.AP / MA−25 / 地
const Earthquake = (ap: number = SKILL_POWER.Earthquake) => ap
// Cleaving Terra (2109) ESAEarthDivideHit : P.AP / MA−25 / 地
const CleavingTerra = (ap: number = SKILL_POWER.CleavingTerra) => ap
/*
  Magical Soul (2014) FUN_0073A870 @0x73a8ed / MA−0 / 無属性

      Lv = min(術者 Lv, 30)
      power = AP + Lv × P.Ratio1 + P.Ratio2          (ESAction_FairyOfMagic: Ratio1 10, Ratio2 220)
*/
const MagicalSoul = (attackerAp: number, level = 30) =>
  attackerAp + Math.min(level, 30) * MISC_SKILL_TABLE.magicalSoulRatio1 + MISC_SKILL_TABLE.magicalSoulRatio2
// Flaming Fist (1303) @0x73e640 / MA−0 : ftol(AP × (火属性/100 + P.Ratio))。魔法(火)→物理の 2 段
const FlamingFist = (
  attackerAp: number,
  fire: number,
  ratio: number = SKILL_POWER.FlamingFist
) => ftol(attackerAp * SkillRatio.FlamingFist(fire, ratio))

/* ============================================================================
 * 物理スキルの power = ftol(ステータス式 × P.Ratio)
 * ==========================================================================*/

// Full House (4501) ESAFullHouseHit @0x6dcc09 : ftol((AP + 8 × (HV + LK)) × P.Ratio)
const FullHouse = (
  attackerAp: number,
  lk: number,
  hv: number,
  ratio: number = SKILL_POWER.FullHouse
) => ftol((attackerAp + (lk + hv) * 8) * SkillRatio.FullHouse(ratio))

/*
  Sharp Scream (4304) FUN_00740860 @0x7409dc

      mov edx,[HV] ; shl edx,4 ; add ecx(AP),edx      -> AP + HV × 16
      fild ; fmul [P.Ratio] ; fmul 0.75 ; _ftol       -> ftol((AP + HV×16) × Ratio × 0.75)
*/
const SharpScream = (
  attackerAp: number,
  hv: number,
  ratio: number = SKILL_POWER.SharpScream
) => ftol((attackerAp + hv * 16) * SkillRatio.SharpScream(ratio) * 0.75)

/*
  2 Hit Combo (4302) FUN_00737460 @0x737515

      1 撃目: k1 = (Lv(Power Blow 4001) + 20) × 0.2f − 3
              ftol(k1 × (AP × P.Ratio))
      2 撃目: k2 = (Lv(Volley Kick 4101) + 20) × 0.2f − 3
              ftol(k2 × (AP + HV × 16) × P.Ratio × 0.75)

  どちらのパッシブも未習得（Lv 0）なら不発。Lv 11 で k = 3.2
*/
const hitComboFactor = (skillLevel: number) => (skillLevel + 20) * f32(0.2) - 3
const FirstHitCombo = (
  attackerAp: number,
  ratio: number = SKILL_POWER.HitCombo,
  powerBlowLevel: number = HIT_COMBO_SKILL_LEVEL
) => ftol(hitComboFactor(powerBlowLevel) * (attackerAp * SkillRatio.HitCombo(ratio)))
const SecondHitCombo = (
  attackerAp: number,
  hv: number,
  ratio: number = SKILL_POWER.HitCombo,
  volleyKickLevel: number = HIT_COMBO_SKILL_LEVEL
) =>
  ftol(
    hitComboFactor(volleyKickLevel) *
      (attackerAp + hv * 16) *
      SkillRatio.HitCombo(ratio) *
      0.75
  )

/*
  One Pair (4204) FUN_00730550 @0x730712 : ftol((AP + HV × 8) × P.Ratio)
  Lady Luck 習得時のみ @0x73078a : ftol(power × (1 + f32(cards / 15)))
*/
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

// Earthquake Blade (1210) @0x740510 : ftol(AP × (P.Ratio + 2 × 地属性 × 0.01))
const EarthquakeBlade = (
  attackerAp: number,
  soil: number,
  ratio: number = SKILL_POWER.EarthquakeBlade
) => ftol(attackerAp * SkillRatio.EarthquakeBlade(soil, ratio))

// Sonic Slash (1502) @0x738d00 : ftol(AP × (水属性 × 0.035 + P.Ratio))
const SonicSlash = (
  attackerAp: number,
  water: number,
  ratio: number = SKILL_POWER.SonicSlash
) => ftol(attackerAp * SkillRatio.SonicSlash(water, ratio))

// Tidal Slash (1207) @0x734a90 : ftol(AP × (水属性 × 0.025 + P.Ratio))
const TidalSlash = (
  attackerAp: number,
  water: number,
  ratio: number = SKILL_POWER.TidalSlash
) => ftol(attackerAp * SkillRatio.TidalSlash(water, ratio))

// Tempest Strike (1209) @0x73c430 : ftol(AP × (P.Ratio + 5 × w))
// w はゲームでは (rand() % 風属性)/100。ここは最大値を採る
const TempestStrike = (
  attackerAp: number,
  wind: number,
  ratio: number = SKILL_POWER.TempestStrike
) => ftol(attackerAp * SkillRatio.TempestStrike(wind, ratio))

// Gale Strike (1504) @0x73e0f0 : ftol(AP × (P.Ratio + 7 × w))
const GaleStrike = (
  attackerAp: number,
  wind: number,
  ratio: number = SKILL_POWER.GaleStrike
) => ftol(attackerAp * SkillRatio.GaleStrike(wind, ratio))

// Champion's Blade (1110) @0x73b090 : ftol(AP × (火属性 × 0.01 + P.Ratio))
const ChampionsBlade = (
  attackerAp: number,
  fire: number,
  ratio: number = SKILL_POWER.ChampionsBlade
) => ftol(attackerAp * SkillRatio.ChampionsBlade(fire, ratio))

/*
  Fan of Knives (3109) FUN_0073D500 @0x73d534

      fild [武器+0x64] ; fmul pp            <- 投擲武器の AP × Precise Pitch 倍率
      imul DA,10 ; fiadd                     <- + DA × 10
      fmul [P.Ratio] ; _ftol

  pp = FUN_0073D580: Precise Pitch (3101) を習得していれば ESAction_PowerThrow.Ratio、なければ 1.0。
  習得していれば常時かかるパッシブ。throwAp には Precise Pitch 適用後の値を渡す。
*/
const FanOfKnives = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.FanOfKnives
) => ftol((throwAp + da * 10) * SkillRatio.FanOfKnives(ratio))

/*
  Chain of Knives (3110) ESAChainThrow → FUN_006F7100 @0x6f7146

      fild [武器+0x64] ; fmul pp             <- 投擲武器の AP × Precise Pitch 倍率
      mov ecx,[DA] ; shl ecx,4 ; fild ; fadd <- + DA × 16
      fmul [this+0xC0 = P.Ratio]
      fild [this+0xC4] ; fild [this+0xC6 = P.Count] ; fdivp ; fmulp ; _ftol

  +0xC4 = min(P.Count, 所持している投擲武器の個数)。個数が Count 以上なら ×1。
  ここでは Count ぶん投げられる前提で ×1 としている。
*/
const ChainOfKnives = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.ChainOfKnives
) => ftol((da * 16 + throwAp) * SkillRatio.ChainOfKnives(ratio))

// Poison Assault (3306) @0x740b60 : ftol(base + DA × 16 × P.Ratio)。base は投擲武器由来なので throwAP を充てている
const PoisonAssault = (
  da: number,
  throwAp: number,
  ratio: number = SKILL_POWER.PoisonAssault
) => ftol(da * 16 * SkillRatio.PoisonAssault(ratio)) + throwAp

// Poison Assault の毒 tick。防御・耐性を通さず直接適用される
const Poison = (da: number, throwAp: number, ratio: number = SKILL_POWER.PoisonAssault) =>
  ftol((da * 16 + throwAp) * 0.412 * SkillRatio.PoisonAssault(ratio))

/*
  Sudden Attack (3302) FUN_0073A280 @0x73a2b2

      mov eax,[DA] ; add eax,[LK] ; shl eax,4 ; add eax,[AP]   -> (DA + LK) × 16 + AP
      fild ; fmul [P.Ratio] ; _ftol
*/
const SuddenAttack = (
  attackerAp: number,
  da: number,
  lk: number,
  ratio: number = SKILL_POWER.SuddenAttack
) => ftol(((da + lk) * 16 + attackerAp) * SkillRatio.SuddenAttack(ratio))

/*
  Lucky Fist (3204) FUN_00730120 @0x7301a6

      mov eax,[LK] ; shl eax,3 ; fild                 <- LK × 8
      fild [対.MaxHP] ; fmul 0.1f ; faddp              <- + 対象 MaxHP × 0.1
      fmul [P.Ratio] ; _ftol
*/
const LuckyFist = (
  enemyHp: number,
  lk: number,
  ratio: number = SKILL_POWER.LuckyFist
) => ftol((lk * 8 + enemyHp * f32(0.1)) * SkillRatio.LuckyFist(ratio))

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
