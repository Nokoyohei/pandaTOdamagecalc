/* eslint-disable */
// 自動生成: scripts/gen-skill-tables.mjs（pandaTO-internal-bot の SkillParam2 → ESAction_* 最大 Level 行）
// 手で編集しない。値を変えたいときは internal-bot のデータを更新して `npm run sync-data`
//   魔法: AP / M_AP / MagicAP そのまま（power × (MA − maPenalty) / 100 で攻撃力になる）
//   物理・射撃: Ratio × 100（UI の刻みを整数にするため）

/** utils/skillPower.ts の SKILL_POWER */
export const SKILL_TABLE = {
  /** 2704 Dark Commando — ESAction_DarkGhost.M_AP (Lv11) */
  DarkCommando: 1840,
  /** 2210 Gravity Crush — ESAction_Gravity.AP (Lv11) */
  GravityCrash: 9000,
  /** 2503 Celestial Strike — ESAction_LightWeight.AP (Lv11) */
  CelestialStrike: 5000,
  /** 2701 Scythe — ESAction_DeathScythe.AP (Lv11) */
  Scythe: 5500,
  /** 2703 Staff of Agony — ESAction_DespairSpear.AP (Lv11) */
  StaffOfAgony: 7500,
  /** 2306 Undine's Blessing — ESAction_WaterCounter.AP (Lv11) */
  Blessing: 1620,
  /** 2111 Wind Blade — ESAction_WindSlash.AP (Lv11) */
  WindBlade: 3500,
  /** 2305 Raging Storm — ESAction_MustangWind.AP (Lv11) */
  RagingStorm: 2700,
  /** 2105 Electro Attack — ESAction_ThunderBolt.AP (Lv11) */
  ElectroAttack: 2510,
  /** 2302 Staff of Thunder — ESAction_ElectricSpear.AP (Lv11) */
  StaffOfThunder: 35000,
  /** 2123 Tesla Field — ESAction_ElectricField.AP (Lv11) */
  TeslaField: 1720,
  /** 2130 Deadly Fen — ESAction_SwampField.M_AP (Lv11) */
  DeadlyFen: 4000,
  /** 2131 Tornado Blast — ESAction_GaleBreak.MagicAP (Lv11) */
  TornadoBlast: 3300,
  /** 2304 Earthquake — ESAction_Earthquake.AP (Lv11) */
  Earthquake: 4000,
  /** 2109 Cleaving Terra — ESAction_Earth_Divide.AP (Lv11) */
  CleavingTerra: 2250,
  /** 1303 Flaming Fist — ESAction_FightingFire.Ratio (Lv11, ×100) */
  FlamingFist: 460,
  /** 4501 Full House — ESAction_FullHouse.Ratio (Lv11, ×100) */
  FullHouse: 400,
  /** 4304 Sharp Scream — ESAction_SharpScream.Ratio (Lv11, ×100) */
  SharpScream: 340,
  /** 4302 2 Hit Combo — ESAction_TwoChainAttack.Ratio (Lv11, ×100) */
  HitCombo: 2000,
  /** 4204 One Pair — ESAction_OnePair.Ratio (Lv11, ×100) */
  OnePair: 3000,
  /** 4210 Lady Luck — ESAction_LuckyGoddess.MaxCard (Lv11) */
  LadyLuck: 6,
  /** 1210 Earthquake Blade — ESAction_EarthquakeSword.Ratio (Lv11, ×100) */
  EarthquakeBlade: 440,
  /** 1502 Sonic Slash — ESAction_PowerSeaBrandish.Ratio (Lv11, ×100) */
  SonicSlash: 1000,
  /** 1207 Tidal Slash — ESAction_PowerBrandish.Ratio (Lv11, ×100) */
  TidalSlash: 1000,
  /** 1209 Tempest Strike — ESAction_WindBrandish.Ratio (Lv11, ×100) */
  TempestStrike: 240,
  /** 1504 Gale Strike — ESAction_WindCircleBrandish.Ratio (Lv11, ×100) */
  GaleStrike: 260,
  /** 1110 Champion's Blade — ESAction_BlastBrandish.Ratio (Lv11, ×100) */
  ChampionsBlade: 450,
  /** 3109 Fan of Knives — ESAction_WideThrow.Ratio (Lv11, ×100) */
  FanOfKnives: 600,
  /** 3110 Chain of Knives — ESAction_ChainThrow.Ratio (Lv11, ×100) */
  ChainOfKnives: 3000,
  /** 3306 Poison Assult — ESAction_PoisonAssault.Ratio (Lv11, ×100) */
  PoisonAssault: 3000,
  /** 3302 Sudden Attack — ESAction_SuddenAttack.Ratio (Lv11, ×100) */
  SuddenAttack: 2500,
  /** 3204 Lucky Fist — ESAction_UnHappyDay.Ratio (Lv11, ×100) */
  LuckyFist: 100,
  /** 3203 Shooting Spree — ESAction_MeleeShot.Ratio (Lv11, ×100) */
  ShootingSpree: 245,
  /** 3501 Berserk — ESAction_Reckless.Ratio (Lv11, ×100) */
  Berserk: 350,
  /** 3202 Power Shot — ESAction_PowerShot.Ratio (Lv11, ×100) */
  PowerShot: 1500,
  /** 3206 Double Shot — ESAction_DoubleShot.Ratio (Lv11, ×100) */
  DoubleShot: 1000,
} as const

/** utils/skillPower.ts の GODLY_SKILL_POWER */
export const GODLY_SKILL_TABLE = {
  /** 12210 Godly Gravity Crush — ESAction_GodlyGravity.AP (Lv11) */
  GravityCrash: 20000,
  /** 12701 Godly Scythe — ESAction_GodlyDeathScythe.AP (Lv11) */
  Scythe: 10000,
  /** 12703 Godly Staff of Agony — ESAction_GodlyDespairSpear.AP (Lv11) */
  StaffOfAgony: 15000,
  /** 11502 Godly Sonic Slash — ESAction_GodlyPowerSeaBrandish.Ratio (Lv11, ×100) */
  SonicSlash: 3500,
  /** 11504 Godly Gale Strike — ESAction_GodlyWindCircleBrandish.Ratio (Lv11, ×100) */
  GaleStrike: 350,
  /** 12100 Godly Earthquake Blade — ESAction_GodlyEarthquakeSword.Ratio (Lv11, ×100) */
  EarthquakeBlade: 1000,
  /** 13110 Godly Chain of Knives — ESAction_GodlyChainThrow.Ratio (Lv11, ×100) */
  ChainOfKnives: 8000,
  /** 13202 Godly Power Shot — ESAction_GodlyPowerShot.Ratio (Lv11, ×100) */
  PowerShot: 4500,
  /** 13206 Godly Double Shot — ESAction_GodlyDoubleShot.Ratio (Lv11, ×100) */
  DoubleShot: 3000,
  /** 13306 Godly Poison Assult — ESAction_GodlyPoisonAssault.Ratio (Lv11, ×100) */
  PoisonAssault: 7000,
  /** 13501 Godly Berserk — ESAction_GodlyReckless.Ratio (Lv11, ×100) */
  Berserk: 1000,
  /** 14204 Godly One Pair — ESAction_GodlyOnePair.Ratio (Lv11, ×100) */
  OnePair: 10000,
  /** 14302 Godly 2 Hit Combo — ESAction_GodlyTwoChainAttack.Ratio (Lv11, ×100) */
  HitCombo: 8000,
  /** 14501 Godly Full House — ESAction_GodlyFullHouse.Ratio (Lv11, ×100) */
  FullHouse: 2000,
  /** ESAction_GodlyWideThrow — ESAction_GodlyWideThrow.Ratio (Lv11, ×100) */
  FanOfKnives: 1500,
} as const

/** utils/bossSkills.ts の既定値。'<key>' = table、'<key>.<param>' = params */
export const BOSS_SKILL_TABLE = {
  /** 1202 Lacerator — ESAction_SharpBrandish.Ratio (Lv11, ×100) */
  lacerator: 355,
  /** 1204 Piercing Wave — ESAction_FlyingAura.Ratio (Lv11, ×100) */
  piercing_wave: 500,
  /** 1205 Blazing Strike — ESAction_FastSword.Ratio (Lv11, ×100) */
  blazing_strike: 108,
  /** 1208 Inferno Blade — ESAction_BlastBrandish.Ratio (Lv11, ×100) */
  inferno_blade: 450,
  /** 1302 Flash Cut — ESAction_FlashAttacking.Ratio (Lv11, ×100) */
  flash_cut: 2000,
  /** 1304 Mega Flash Cut — ESAction_PowerFlashAttack.Ratio (Lv11, ×100) */
  mega_flash_cut: 2000,
  /** 1108 Tetra Punch — ESAction_ComboHit.Ratio (Lv11, ×100) */
  tetra_punch: 1200,
  /** 1501 Shadow — ESAction_OnesOtherSelf.Ratio (Lv11, ×100) */
  shadow: 1000,
  /** 1501 Shadow — ESAction_OnesOtherSelf.Count (Lv11) */
  'shadow.count': 10,
  /** 2203 Hellfire — ESAction_HellFire.AP (Lv11) */
  hellfire: 5500,
  /** 2205 Arrow of Light — ESAction_LightningBolt.AP (Lv11) */
  arrow_of_light: 6000,
  /** 2208 Dark Lance — ESAction_DarkSpear.AP (Lv11) */
  dark_lance: 6100,
  /** 2209 Light Wave — ESAction_LightWave.AP (Lv11) */
  light_wave: 5000,
  /** 2214 Radiant Strike — ESAction_ShiningRay.AP (Lv11) */
  radiant_strike: 5300,
  /** 2301 Aqua Bomb — ESAction_WaterShower.AP (Lv11) */
  aqua_bomb: 20000,
  /** 2303 Dragon Storm — ESAction_FireDragon.AP (Lv11) */
  dragon_storm: 20000,
  /** 2502 Searing Light — ESAction_SkyRay.AP (Lv11) */
  searing_light: 6000,
  /** 2705 Ghostly Whisper — ESAction_DarkWhisper.M_AP (Lv11) */
  ghostly_whisper: 2160,
  /** 2126 Razor Gale — ESAction_SharpWind.AP (Lv11) */
  razor_gale: 2640,
  /** 2124 Phoenix Rising — ESAction_FireBurn.AP (Lv11) */
  phoenix_rising: 4000,
  /** 2124 Phoenix Rising — ESAction_FireBurn.Seconds (Lv11) */
  'phoenix_rising.ticks': 10,
  /** 12007 Godly Arrow Rush — ESAction_GodlyChainArrow.AP (Lv11) */
  godly_arrow_rush: 35000,
  /** 12007 Godly Arrow Rush — ESAction_GodlyChainArrow.Count (Lv11) */
  'godly_arrow_rush.count': 15,
  /** 3201 Butt Plate — ESAction_GunStock.Ratio (Lv11, ×100) */
  butt_plate: 355,
  /** 3105 Pouch of Pain — ESAction_HeavyBaggage.Ratio (Lv11, ×100) */
  poison_pouch: 70,
  /** 4106 Beast Claw — ESAction_Rush.Ratio (Lv11, ×100) */
  beast_claw: 600,
  /** 4109 Fist Full of Galders — ESAction_GellderChainHit.Ratio (Lv11, ×100) */
  fist_full_of_galders: 920,
  /** 4109 Fist Full of Galders — ESAction_GellderChainHit.Count (Lv11) */
  'fist_full_of_galders.count': 4,
  /** 4107 Fatal Wound — ESAction_SharpClaw.Ratio (Lv11, ×100) */
  fatal_wound: 1200,
  /** 4201 Card Strike — ESAction_CardThrow.Ratio (Lv11, ×100) */
  card_strike: 265,
  /** 4201 Card Strike — ESAction_CardThrow.Radius (Lv11) */
  'card_strike.radius': 52,
  /** 4205 Impelling Rage — ESAction_Charging.Ratio (Lv11, ×100) */
  impelling_rage: 600,
  /** 4205 Impelling Rage — ESAction_Charging.Radius (Lv11) */
  'impelling_rage.distance': 250,
  /** 4502 Power Charging — ESAction_PowerCharging.Ratio (Lv11, ×100) */
  power_charging: 650,
  /** 4502 Power Charging — ESAction_PowerCharging.Radius (Lv11) */
  'power_charging.distance': 240,
  /** 4207 Wild Nail — ESAction_WildAttack.Ratio (Lv11, ×100) */
  wild_nail: 1500,
  /** 4209 Furious Galder Throw — ESAction_LuckyGellderHit.Ratio (Lv11, ×100) */
  furious_galder_throw: 680,
  /** 4303 Raging Nail — ESAction_WildTalon.Ratio (Lv11, ×100) */
  raging_nail: 2500,
  /** 4303 Raging Nail — ESAction_WildTalon.DisDefenceRatio (Lv11) */
  'raging_nail.disDefence': 80,
  /** 4503 Heavy Hit — ESAction_MassiveAttack.Ratio (Lv11, ×100) */
  heavy_hit: 700,
} as const

/** utils/bossSkills.ts の Godly 既定値 */
export const GODLY_BOSS_SKILL_TABLE = {
  /** 11304 Godly Mega Flash Cut — ESAction_GodlyPowerFlashAttack.Ratio (Lv11, ×100) */
  mega_flash_cut: 10000,
  /** 11108 Godly Tetra Punch — ESAction_GodlyComboHit.Ratio (Lv11, ×100) */
  tetra_punch: 6000,
  /** 11501 Godly Shadow — ESAction_GodlyOnesOtherSelf.Ratio (Lv11, ×100) */
  shadow: 2000,
  /** 11501 Godly Shadow — ESAction_GodlyOnesOtherSelf.Count (Lv11) */
  'shadow.count': 20,
  /** 14207 Godly Wild Nail — ESAction_GodlyWildAttack.Ratio (Lv11, ×100) */
  wild_nail: 12000,
} as const

/** パッシブ・デバフなど */
export const MISC_SKILL_TABLE = {
  /** 3101 Precise Pitch — ESAction_PowerThrow.Ratio (Lv11) */
  precisePitchRatio: 15,
  /** 3207 Shield Breaker — ESAction_BreakBarrier.Ratio (Lv11) */
  shieldBreakerRatio: 0.8,
  /** 2313 Salamander's Territory — ESAction_FireArea.RegiDown (Lv11) */
  areaRegiDown: 0.18,
  /** 2014 Magical Soul — ESAction_FairyOfMagic.Ratio1 (Lv1) */
  magicalSoulRatio1: 10,
  /** 2014 Magical Soul — ESAction_FairyOfMagic.Ratio2 (Lv1) */
  magicalSoulRatio2: 220,
  /** 4001 Power Blow — SkillParam2.MaxSKLV */
  hitComboPassiveLevel: 11,
} as const

/** 命中判定の bonus（ApplyRatio）。キーは SKILL_TABLE と同じ */
export const SKILL_APPLY_RATIO = {
  /** 2704 Dark Commando — ESAction_DarkGhost.ApplyRatio (Lv11) */
  DarkCommando: 1,
  /** 2210 Gravity Crush — ESAction_Gravity.ApplyRatio (Lv11) */
  GravityCrash: 0.89,
  /** 2503 Celestial Strike — ESAction_LightWeight.ApplyRatio (Lv11) */
  CelestialStrike: 1.06,
  /** 2701 Scythe — ESAction_DeathScythe.ApplyRatio (Lv11) */
  Scythe: 0.86,
  /** 2703 Staff of Agony — ESAction_DespairSpear.ApplyRatio (Lv11) */
  StaffOfAgony: 0.94,
  /** 2306 Undine's Blessing — ESAction_WaterCounter.ApplyRatio (Lv11) */
  Blessing: 1,
  /** 2111 Wind Blade — ESAction_WindSlash.ApplyRatio (Lv11) */
  WindBlade: 1,
  /** 2305 Raging Storm — ESAction_MustangWind.ApplyRatio (Lv11) */
  RagingStorm: 0.94,
  /** 2105 Electro Attack — ESAction_ThunderBolt.ApplyRatio (Lv11) */
  ElectroAttack: 1.04,
  /** 2302 Staff of Thunder — ESAction_ElectricSpear.ApplyRatio (Lv11) */
  StaffOfThunder: 1.04,
  /** 2123 Tesla Field — ESAction_ElectricField.ApplyRatio (Lv11) */
  TeslaField: 0.94,
  /** 2130 Deadly Fen — ESAction_SwampField.ApplyRT (Lv11) */
  DeadlyFen: 1.16,
  /** 2131 Tornado Blast — ESAction_GaleBreak.ApplyRatio (Lv11) */
  TornadoBlast: 0.96,
  /** 2304 Earthquake — ESAction_Earthquake.ApplyRatio (Lv11) */
  Earthquake: 1.14,
  /** 2109 Cleaving Terra — ESAction_Earth_Divide.ApplyRatio (Lv11) */
  CleavingTerra: 1.24,
  /** 1303 Flaming Fist — ESAction_FightingFire.ApplyRatio (Lv11) */
  FlamingFist: 0.98,
  /** 4501 Full House — ESAction_FullHouse.ApplyRatio (Lv11) */
  FullHouse: 1.06,
  /** 4304 Sharp Scream — ESAction_SharpScream.ApplyRatio (Lv11) */
  SharpScream: 0.94,
  /** 4302 2 Hit Combo — ESAction_TwoChainAttack.ApplyRatio (Lv11) */
  HitCombo: 1,
  /** 4204 One Pair — ESAction_OnePair.ApplyRatio (Lv11) */
  OnePair: 1.16,
  /** 4210 Lady Luck — ESAction_LuckyGoddess.ApplyRatio (Lv11) */
  LadyLuck: 0,
  /** 1210 Earthquake Blade — ESAction_EarthquakeSword.ApplyRatio (Lv11) */
  EarthquakeBlade: 1.16,
  /** 1502 Sonic Slash — ESAction_PowerSeaBrandish.ApplyRatio (Lv11) */
  SonicSlash: 1,
  /** 1207 Tidal Slash — ESAction_PowerBrandish.ApplyRatio (Lv11) */
  TidalSlash: 1,
  /** 1209 Tempest Strike — ESAction_WindBrandish.ApplyRatio (Lv11) */
  TempestStrike: 0.94,
  /** 1504 Gale Strike — ESAction_WindCircleBrandish.ApplyRatio (Lv11) */
  GaleStrike: 0.94,
  /** 1110 Champion's Blade — ESAction_BlastBrandish.ApplyRatio (Lv11) */
  ChampionsBlade: 0.94,
  /** 3109 Fan of Knives — ESAction_WideThrow.ApplyRatio (Lv11) */
  FanOfKnives: 1.16,
  /** 3110 Chain of Knives — ESAction_ChainThrow.ApplyRatio (Lv11) */
  ChainOfKnives: 1.16,
  /** 3306 Poison Assult — ESAction_PoisonAssault.ApplyRatio (Lv11) */
  PoisonAssault: 1.14,
  /** 3302 Sudden Attack — ESAction_SuddenAttack.ApplyRatio (Lv11) */
  SuddenAttack: 1.04,
  /** 3204 Lucky Fist — ESAction_UnHappyDay.ApplyRatio (Lv11) */
  LuckyFist: 1,
  /** 3203 Shooting Spree — ESAction_MeleeShot.ApplyRatio (Lv11) */
  ShootingSpree: 1.06,
  /** 3501 Berserk — ESAction_Reckless.ApplyRatio (Lv11) */
  Berserk: 1,
  /** 3202 Power Shot — ESAction_PowerShot.ApplyRatio (Lv11) */
  PowerShot: 1.18,
  /** 3206 Double Shot — ESAction_DoubleShot.ApplyRatio (Lv11) */
  DoubleShot: 1,
  /** 2014 Magical Soul — ESAction_FairyOfMagic.ApplyRatio (Lv1) */
  MagicalSoul: 0.8,
} as const

/** Godly の命中判定 bonus */
export const GODLY_SKILL_APPLY_RATIO = {
  /** 12210 Godly Gravity Crush — ESAction_GodlyGravity.ApplyRatio (Lv11) */
  GravityCrash: 1.89,
  /** 12701 Godly Scythe — ESAction_GodlyDeathScythe.ApplyRatio (Lv11) */
  Scythe: 1,
  /** 12703 Godly Staff of Agony — ESAction_GodlyDespairSpear.ApplyRatio (Lv11) */
  StaffOfAgony: 1,
  /** 11502 Godly Sonic Slash — ESAction_GodlyPowerSeaBrandish.ApplyRatio (Lv11) */
  SonicSlash: 1,
  /** 11504 Godly Gale Strike — ESAction_GodlyWindCircleBrandish.ApplyRatio (Lv11) */
  GaleStrike: 1,
  /** 12100 Godly Earthquake Blade — ESAction_GodlyEarthquakeSword.ApplyRatio (Lv11) */
  EarthquakeBlade: 1.16,
  /** 13110 Godly Chain of Knives — ESAction_GodlyChainThrow.ApplyRatio (Lv11) */
  ChainOfKnives: 1.16,
  /** 13202 Godly Power Shot — ESAction_GodlyPowerShot.ApplyRatio (Lv11) */
  PowerShot: 1.18,
  /** 13206 Godly Double Shot — ESAction_GodlyDoubleShot.ApplyRatio (Lv11) */
  DoubleShot: 1,
  /** 13306 Godly Poison Assult — ESAction_GodlyPoisonAssault.ApplyRatio (Lv11) */
  PoisonAssault: 1.14,
  /** 13501 Godly Berserk — ESAction_GodlyReckless.ApplyRatio (Lv11) */
  Berserk: 1,
  /** 14204 Godly One Pair — ESAction_GodlyOnePair.ApplyRatio (Lv11) */
  OnePair: 1.16,
  /** 14302 Godly 2 Hit Combo — ESAction_GodlyTwoChainAttack.ApplyRatio (Lv11) */
  HitCombo: 1,
  /** 14501 Godly Full House — ESAction_GodlyFullHouse.ApplyRatio (Lv11) */
  FullHouse: 1.06,
  /** ESAction_GodlyWideThrow — ESAction_GodlyWideThrow.ApplyRatio (Lv11) */
  FanOfKnives: 1.16,
} as const

/** ボス用スキルの命中判定 bonus。キーは BOSS_SKILL_TABLE と同じ */
export const BOSS_SKILL_APPLY_RATIO = {
  /** 1202 Lacerator — ESAction_SharpBrandish.ApplyRatio (Lv11) */
  lacerator: 1.16,
  /** 1204 Piercing Wave — ESAction_FlyingAura.ApplyRatio (Lv11) */
  piercing_wave: 1.16,
  /** 1205 Blazing Strike — ESAction_FastSword.ApplyRatio (Lv11) */
  blazing_strike: 0.94,
  /** 1208 Inferno Blade — ESAction_BlastBrandish.ApplyRatio (Lv11) */
  inferno_blade: 0.94,
  /** 1302 Flash Cut — ESAction_FlashAttacking.ApplyRatio (Lv11) */
  flash_cut: 3,
  /** 1304 Mega Flash Cut — ESAction_PowerFlashAttack.ApplyRatio (Lv11) */
  mega_flash_cut: 1,
  /** 1108 Tetra Punch — ESAction_ComboHit.ApplyRatio (Lv11) */
  tetra_punch: 1,
  /** 1501 Shadow — ESAction_OnesOtherSelf.ApplyRatio (Lv11) */
  shadow: 0.94,
  /** 2203 Hellfire — ESAction_HellFire.ApplyRatio (Lv11) */
  hellfire: 0.84,
  /** 2205 Arrow of Light — ESAction_LightningBolt.ApplyRatio (Lv11) */
  arrow_of_light: 1.14,
  /** 2208 Dark Lance — ESAction_DarkSpear.ApplyRatio (Lv11) */
  dark_lance: 0.94,
  /** 2209 Light Wave — ESAction_LightWave.ApplyRatio (Lv11) */
  light_wave: 1.04,
  /** 2214 Radiant Strike — ESAction_ShiningRay.ApplyRatio (Lv11) */
  radiant_strike: 1.08,
  /** 2301 Aqua Bomb — ESAction_WaterShower.ApplyRatio (Lv11) */
  aqua_bomb: 1.04,
  /** 2303 Dragon Storm — ESAction_FireDragon.ApplyRatio (Lv11) */
  dragon_storm: 1.24,
  /** 2502 Searing Light — ESAction_SkyRay.ApplyRatio (Lv11) */
  searing_light: 1.04,
  /** 2705 Ghostly Whisper — ESAction_DarkWhisper.ApplyRatio (Lv11) */
  ghostly_whisper: 0.94,
  /** 2126 Razor Gale — ESAction_SharpWind.ApplyRatio (Lv11) */
  razor_gale: 1.04,
  /** 2124 Phoenix Rising — ESAction_FireBurn.ApplyRatio (Lv11) */
  phoenix_rising: 0.84,
  /** 12007 Godly Arrow Rush — ESAction_GodlyChainArrow.ApplyRatio (Lv11) */
  godly_arrow_rush: 1.5,
  /** 3201 Butt Plate — ESAction_GunStock.ApplyRatio (Lv11) */
  butt_plate: 1.04,
  /** 3105 Pouch of Pain — ESAction_HeavyBaggage.ApplyRatio (Lv11) */
  poison_pouch: 0.94,
  /** 4106 Beast Claw — ESAction_Rush.ApplyRatio (Lv11) */
  beast_claw: 1.16,
  /** 4109 Fist Full of Galders — ESAction_GellderChainHit.ApplyRatio (Lv11) */
  fist_full_of_galders: 1.16,
  /** 4107 Fatal Wound — ESAction_SharpClaw.ApplyRatio (Lv11) */
  fatal_wound: 1,
  /** 4201 Card Strike — ESAction_CardThrow.ApplyRatio (Lv11) */
  card_strike: 1.16,
  /** 4205 Impelling Rage — ESAction_Charging.ApplyRatio (Lv11) */
  impelling_rage: 1.06,
  /** 4502 Power Charging — ESAction_PowerCharging.ApplyRatio (Lv11) */
  power_charging: 0.9,
  /** 4207 Wild Nail — ESAction_WildAttack.ApplyRatio (Lv11) */
  wild_nail: 1.16,
  /** 4209 Furious Galder Throw — ESAction_LuckyGellderHit.ApplyRatio (Lv11) */
  furious_galder_throw: 1.16,
  /** 4303 Raging Nail — ESAction_WildTalon.ApplyRatio (Lv11) */
  raging_nail: 1,
  /** 4503 Heavy Hit — ESAction_MassiveAttack.ApplyRatio (Lv11) */
  heavy_hit: 1.1,
} as const

/** ボス用 Godly の命中判定 bonus */
export const GODLY_BOSS_SKILL_APPLY_RATIO = {
  /** 11304 Godly Mega Flash Cut — ESAction_GodlyPowerFlashAttack.ApplyRatio (Lv11) */
  mega_flash_cut: 1,
  /** 11108 Godly Tetra Punch — ESAction_GodlyComboHit.ApplyRatio (Lv11) */
  tetra_punch: 1,
  /** 11501 Godly Shadow — ESAction_GodlyOnesOtherSelf.ApplyRatio (Lv11) */
  shadow: 1,
  /** 14207 Godly Wild Nail — ESAction_GodlyWildAttack.ApplyRatio (Lv11) */
  wild_nail: 1.16,
} as const
