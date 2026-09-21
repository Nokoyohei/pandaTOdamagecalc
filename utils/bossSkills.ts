import { ftol, F32_0_01 } from '~/utils/x87'
import { magicAttackPower } from '~/utils/calc'
import type { AttackType } from '~/utils/calc'
import type { Monster } from '~/types'

/*
 * ボス用に追加した 3 次職以降の攻撃スキル。
 * 式は GameServer.exe の各ハンドラを逆アセンブルして確認したもの（ref にアドレス）。
 * 既定値は PandaTO の ESAction_* テーブル最大レベル行。
 *   物理: table = P.Ratio × 100（UI の刻みを整数にするため）
 *   魔法: table = P.AP / P.M_AP そのもの。power × (MA − maPenalty) / 100 で攻撃力になる
 */

export type StatKey = 'ap' | 'ac' | 'dx' | 'ma' | 'da' | 'lk' | 'hv' | 'hp' | 'wt' | 'fire'

/** バフ適用後のステータス（hp / wt / dx / fire はバフ無し） */
export type SkillStats = Record<StatKey, number>

export interface BossSkillParam {
  key: string
  label: string
  default: number
  godlyDefault?: number
  hint?: string
}

export interface BossSkillDef {
  key: string
  title: string
  icon: string
  attackType: AttackType
  /** 参照する耐性。'none' は耐性無視（propMask 0x200） */
  resist: keyof Monster | 'none'
  /** 入力欄に出すステータス */
  stats: StatKey[]
  /** スライダーの既定値（Godly テーブルがあれば godly） */
  table: { label: string; default: number; godly?: number }
  params?: BossSkillParam[]
  /** 防御・耐性を引く前の攻撃力（魔法は MA を反映済み） */
  power: (s: SkillStats, table: number, p: Record<string, number>) => number
  /** 1 発あたりの表示に対する回数（表示用） */
  hits?: (s: SkillStats, table: number, p: Record<string, number>) => number
  /** 連撃で耐性適用後のダメージに掛かる倍率列（Tetra Punch の 1, 2, 4, 8） */
  hitMultipliers?: number[]
  /** 対象 DP に掛かる係数（Raging Nail の DisDefenceRatio） */
  defenseScale?: (table: number, p: Record<string, number>) => number
  /** DP を 0 として BattleHelper に渡す（Furious Galder Throw） */
  ignoreDefense?: boolean
  /** 耐性適用後のダメージに掛かる係数（Card Strike の距離減衰） */
  postMultiplier?: (s: SkillStats, table: number, p: Record<string, number>) => number
  note?: string
  ref: string
}

const ratio = (table: number) => table / 100

const magic = (
  key: string,
  title: string,
  resist: keyof Monster,
  ap: number,
  maPenalty: number,
  ref: string,
  label = 'AP',
  note?: string
): BossSkillDef => ({
  key,
  title,
  icon: `/${key}.gif`,
  attackType: 'magic',
  resist,
  stats: ['ma'],
  table: { label, default: ap },
  power: (s, table) => magicAttackPower(table, s.ma, maPenalty),
  note,
  ref
})

export const BOSS_SKILLS: Record<string, BossSkillDef> = {
  /* ------------------------------------------------------------------ Power */
  lacerator: {
    key: 'lacerator',
    title: 'Lacerator',
    icon: '/lacerator.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap'],
    table: { label: 'Ratio', default: 355 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    ref: 'ESASharpBrandish 0x6cdbe0 → FUN_006CDDC0: ftol(AP × P.Ratio)'
  },
  piercing_wave: {
    key: 'piercing_wave',
    title: 'Piercing Wave',
    icon: '/piercing_wave.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap'],
    table: { label: 'Ratio', default: 500 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    ref: 'FUN_0072F9F0 @0x72fa8b → FUN_006CDDC0: ftol(AP × P.Ratio)'
  },
  blazing_strike: {
    key: 'blazing_strike',
    title: 'Blazing Strike',
    icon: '/blazing_strike.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'dx'],
    table: { label: 'Ratio', default: 108 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    // 0x733277: (10 − DX) / 6 + 1 回（idiv、上限 10）。DX が低いほど回数が増える
    hits: (s) => Math.min(Math.trunc((10 - s.dx) / 6) + 1, 10),
    note: 'Damage shown is per hit. Hits = min((10 − DX) / 6 + 1, 10)',
    ref: 'FUN_00733210 @0x733277 (hit count), FUN_00733910 @0x73397f → FUN_006CDDC0 (ftol(AP × P.Ratio))'
  },
  inferno_blade: {
    key: 'inferno_blade',
    title: 'Inferno Blade',
    icon: '/inferno_blade.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'fire'],
    table: { label: 'Ratio', default: 450 },
    power: (s, t) => ftol(s.ap * (s.fire * F32_0_01 + ratio(t))),
    note: "Shares ESAction_BlastBrandish with Champion's Blade",
    ref: 'FUN_0073B200 @0x73b228: ftol(AP × (Fire × 0.01f + P.Ratio))'
  },
  flash_cut: {
    key: 'flash_cut',
    title: 'Flash Cut',
    icon: '/flash_cut.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'ac'],
    table: { label: 'Ratio', default: 2000 },
    power: (s, t) => ftol((s.ap + s.ac * 8) * ratio(t)),
    ref: 'ESA(0x6e0400) → exec 0x4FC → FUN_0073A0C0 @0x73a103: ftol((AP + AC × 8) × P.Ratio)'
  },
  mega_flash_cut: {
    key: 'mega_flash_cut',
    title: 'Mega Flash Cut',
    icon: '/mega_flash_cut.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'ac'],
    table: { label: 'Ratio', default: 2000, godly: 10000 },
    power: (s, t) => ftol((s.ap + s.ac * 16) * ratio(t)),
    ref: 'ESA(0x6f8670) → exec 0x4FC → FUN_0073A0C0 @0x73a0ef: AC × 16 for skill 1304'
  },
  tetra_punch: {
    key: 'tetra_punch',
    title: 'Tetra Punch',
    icon: '/tetra_punch.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap'],
    table: { label: 'Ratio', default: 400, godly: 3000 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    // 4 連撃。2 発目以降は直前のダメージが通っていればその 2 倍（shl eax,1）、外れたら 0
    hitMultipliers: [1, 2, 4, 8],
    note: 'Four hits: d, 2d, 4d, 8d (each doubles the previous hit if it landed). Total 15d',
    ref: 'FUN_0073C940 @0x73c9eb: ftol(AP × P.Ratio) via FUN_006CDDC0, loop @0x73ca43 (4 hits) with @0x73caab shl eax,1'
  },
  shadow: {
    key: 'shadow',
    title: 'Shadow',
    icon: '/shadow_skill.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'dx'],
    table: { label: 'Ratio', default: 1000, godly: 2000 },
    params: [{ key: 'count', label: 'Count', default: 10, godlyDefault: 20, hint: 'ESAction_OnesOtherSelf.Count (multiplier on a single hit)' }],
    power: (s, t, p) => ftol((s.ap + (11 - s.dx) * 24) * ratio(t) * p.count),
    ref: 'FUN_00738150 @0x7381c5: ftol((AP + (11 − DX) × 24) × P.Ratio × P.Count)'
  },

  /* ------------------------------------------------------------------ Magic */
  hellfire: magic('hellfire', 'Hellfire', 'darkR', 5500, 49, 'FUN_0072D030 @0x72d0d0: P.AP / MA−49 / Dark'),
  arrow_of_light: magic('arrow_of_light', 'Arrow of Light', 'lightR', 6000, 49, 'FUN_0072D490 @0x72d537: P.AP / MA−49 / Light'),
  dark_lance: magic('dark_lance', 'Dark Lance', 'darkR', 6100, 49, 'FUN_0072EF20 @0x72efc7: P.AP / MA−49 / Dark'),
  light_wave: magic('light_wave', 'Light Wave', 'lightR', 5000, 49, 'FUN_0072F840 @0x72f90e: P.AP / MA−49 / Light'),
  radiant_strike: magic('radiant_strike', 'Radiant Strike', 'lightR', 5300, 49, 'FUN_007348E0 @0x7349ae: P.AP / MA−49 / Light'),
  aqua_bomb: magic('aqua_bomb', 'Aqua Bomb', 'waterR', 20000, 49, 'FUN_00737200 @0x73729f: P.AP / MA−49 / Water'),
  dragon_storm: magic('dragon_storm', 'Dragon Storm', 'fireR', 20000, 49, 'FUN_007394A0 @0x7394f5: P.AP / MA−49 / Fire'),
  searing_light: magic('searing_light', 'Searing Light', 'lightR', 6000, 25, 'ESASkyRay 0x6dd540 @0x6dd5cf: P.AP / MA−25 / Light'),
  ghostly_whisper: magic(
    'ghostly_whisper',
    'Ghostly Whisper',
    'darkR',
    2160,
    49,
    'ESADarkWhisper 0x6fbf80 @0x6fc1ba: (short)this+0xCC ← P.M_AP / MA−49 / Dark',
    'M_AP'
  ),
  razor_gale: {
    key: 'razor_gale',
    title: 'Razor Gale',
    icon: '/razor_gale.gif',
    attackType: 'magic',
    resist: 'windR',
    stats: ['ma', 'ac'],
    table: { label: 'AP', default: 2640 },
    // maPenalty = 49 − AC なので MA + AC − 49 で効く（Raging Storm と同型）
    power: (s, t) => magicAttackPower(t, s.ma + s.ac, 49),
    ref: 'FUN_0073BB30 @0x73bc13: mov edx,0x31 ; sub edx,[AC] → maPenalty = 49 − AC / P.AP / Wind'
  },
  phoenix_rising: {
    key: 'phoenix_rising',
    title: 'Phoenix Rising',
    icon: '/phoenix_rising.gif',
    attackType: 'magic',
    resist: 'fireR',
    stats: ['ma'],
    table: { label: 'AP', default: 4000 },
    params: [{ key: 'ticks', label: 'Ticks', default: 10, hint: 'One tick every 2 s for Seconds (Lv11: 20 s)' }],
    power: (s, t) => magicAttackPower(t, s.ma, 49),
    hits: (_s, _t, p) => Math.max(1, Math.trunc(p.ticks)),
    note: 'Damage shown is per tick. Each tick rolls its own critical',
    ref: 'ESAFireBurnDo 0x6ebdc0 @0x6ebe07: (this+0xF4 ← P.AP) / MA−49 / Fire, bonus 1.0, every 2000 ms'
  },
  godly_arrow_rush: magic(
    'godly_arrow_rush',
    'Godly Arrow Rush',
    'noPropR',
    35000,
    49,
    'FUN_0072A7E0 @0x72a887: P.AP / MA−49 / NoProp (0x80). One hit per target',
    'AP'
  ),

  /* ------------------------------------------------------------------ Sense */
  butt_plate: {
    key: 'butt_plate',
    title: 'Butt Plate',
    icon: '/butt_plate.gif',
    attackType: 'physical',
    resist: 'gunR',
    stats: ['da', 'ac'],
    table: { label: 'Ratio', default: 355 },
    power: (s, t) => ftol(((s.da + s.ac) * 8 - 392) * ratio(t)),
    note: 'Defense is DP, resistance is GunR (propMask 0x100)',
    ref: 'FUN_0072B6E0 @0x72b765: ftol(((DA + AC) × 8 − 392) × P.Ratio)'
  },
  poison_pouch: {
    key: 'poison_pouch',
    title: 'Poison Pouch',
    icon: '/poison_pouch.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['wt'],
    table: { label: 'Pouch of Pain Ratio', default: 70 },
    params: [{ key: 'weight', label: 'Carried weight', default: 0, hint: '0 = assume carrying MaxWT' }],
    power: (s, t, p) => ftol((p.weight > 0 ? Math.min(p.weight, s.wt) : s.wt) * ratio(t)),
    note: 'Initial hit only. The ratio is Pouch of Pain (3105) Lv11 Ratio, 0 if not learned. Poison ticks are not included',
    ref: 'FUN_0073F4A0 @0x73f511: ftol(min(carried weight, MaxWT) × HeavyBaggage.Ratio)'
  },

  /* ------------------------------------------------------------------ Charm */
  beast_claw: {
    key: 'beast_claw',
    title: 'Beast Claw',
    icon: '/beast_claw.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap'],
    table: { label: 'Ratio', default: 600 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    ref: 'FUN_00732FB0 @0x73304b → FUN_006CDDC0: ftol(AP × P.Ratio)'
  },
  fist_full_of_galders: {
    key: 'fist_full_of_galders',
    title: 'Fist Full of Galders',
    icon: '/fist_full_of_galders.gif',
    attackType: 'physical',
    resist: 'none',
    stats: [],
    table: { label: 'Ratio', default: 920 },
    params: [
      { key: 'galder', label: 'Galder per hit', default: 100 },
      { key: 'count', label: 'Hits', default: 4, hint: 'ESAction_GellderChainHit.Count (Lv11: 4). Needs Count × 100 galder' }
    ],
    power: (_s, t, p) => ftol(Math.max(p.galder, 0) * ratio(t)),
    hits: (_s, _t, p) => Math.max(1, Math.trunc(p.count)),
    ignoreDefense: true,
    note: 'DP 0 and resistance ignored (propMask 0x200). Damage shown is per hit',
    ref: 'FUN_0073D600 @0x73d6db (Count × 100 galder check) → FUN_0073DBB0: BH_Physical(ftol(galder × P.Ratio), DP 0, prop 0x200)'
  },
  fatal_wound: {
    key: 'fatal_wound',
    title: 'Fatal Wound',
    icon: '/fatal_wound.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap'],
    table: { label: 'Ratio', default: 1200 },
    power: (s, t) => ftol(s.ap * ratio(t)),
    note: 'Initial hit only. ConRatio damage over time is not included',
    ref: 'ESASharpClaw 0x6d6fa0 → FUN_006CDDC0: ftol(AP × P.Ratio)'
  },
  card_strike: {
    key: 'card_strike',
    title: 'Card Strike',
    icon: '/card_strike.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'hv'],
    table: { label: 'Ratio', default: 265 },
    params: [
      { key: 'distance', label: 'Distance', default: 0, hint: 'Distance to the target. Damage falls off toward Radius' },
      { key: 'radius', label: 'Radius', default: 52 }
    ],
    power: (s, t) => ftol((s.ap + s.hv * 8) * ratio(t)),
    postMultiplier: (_s, _t, p) => (p.radius > 0 ? Math.max(0, 1 - p.distance / p.radius) : 1),
    ref: 'ESACardThrow 0x6c8ff0 @0x6c9152: ftol((AP + HV × 8) × P.Ratio), 0x6c955d: damage × (1 − distance / Radius)'
  },
  impelling_rage: {
    key: 'impelling_rage',
    title: 'Impelling Rage',
    icon: '/impelling_rage.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['hp'],
    table: { label: 'Ratio', default: 600 },
    params: [{ key: 'distance', label: 'Dash distance', default: 196, hint: 'Up to Radius (Lv11: 196)' }],
    power: (s, t, p) => ftol((p.distance + 40) * s.hp * ratio(t) / 800),
    note: 'HP is current HP (assumed full)',
    ref: 'ESAChargingHit 0x6d6370 @0x6d654c: ftol((√(dx²+dy²) + 40) × HP × P.Ratio / 800)'
  },
  power_charging: {
    key: 'power_charging',
    title: 'Power Charging',
    icon: '/power_charging.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['hp'],
    table: { label: 'Ratio', default: 650 },
    params: [{ key: 'distance', label: 'Dash distance', default: 240, hint: 'Up to Radius (Lv11: 240)' }],
    power: (s, t, p) => ftol((p.distance + 40) * s.hp * ratio(t) / 800),
    note: 'HP is current HP (assumed full)',
    ref: 'ESAPowerChargingDo 0x6decf0 @0x6deec3: ftol((distance + 40) × HP × P.Ratio / 800)'
  },
  wild_nail: {
    key: 'wild_nail',
    title: 'Wild Nail',
    icon: '/wild_nail.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['hv'],
    table: { label: 'Ratio', default: 1500, godly: 12000 },
    power: (s, t) => ftol(s.hv * 16 * ratio(t)),
    ref: 'FUN_00735330 @0x7353ab: ftol((HV << 4) × P.Ratio)'
  },
  furious_galder_throw: {
    key: 'furious_galder_throw',
    title: 'Furious Galder Throw',
    icon: '/furious_galder_throw.gif',
    attackType: 'physical',
    resist: 'none',
    stats: [],
    table: { label: 'Ratio', default: 680 },
    params: [
      {
        key: 'galder',
        label: 'Galder thrown',
        default: 500,
        hint: 'Random: 1 (15%) / 200 (10%) / 300 (10%) / 400 (10%) / 500 (20%) / 600 (15%) / 700 (10%) / 800 (5%) / 1000 (5%)'
      }
    ],
    power: (_s, t, p) => ftol(Math.max(p.galder, 0) * ratio(t)),
    ignoreDefense: true,
    note: 'DP 0 and resistance ignored (propMask 0x200). Fails with less than 500 galder',
    ref: 'FUN_0073DC60 @0x73dd2e: BH_Physical(power = FUN_0073E030 = ftol(galder × P.Ratio), DP = 0, prop 0x200). Galder amount from the FUN_0073DF00 random table'
  },
  raging_nail: {
    key: 'raging_nail',
    title: 'Raging Nail',
    icon: '/raging_nail.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'hv'],
    table: { label: 'Ratio', default: 2500 },
    params: [{ key: 'disDefence', label: 'DisDefenceRatio', default: 80, hint: 'Target DP is scaled to this %' }],
    power: (s, t) => ftol((s.ap + s.hv * 16) * ratio(t) * 0.5),
    defenseScale: (_t, p) => p.disDefence / 100,
    ref: 'FUN_0073EA00 @0x73ea8a: ftol((AP + HV × 16) × P.Ratio × 0.5), DP = ftol(DP × DisDefenceRatio / 100)'
  },
  heavy_hit: {
    key: 'heavy_hit',
    title: 'Heavy Hit',
    icon: '/heavy_hit.gif',
    attackType: 'physical',
    resist: 'physicalR',
    stats: ['ap', 'hp'],
    table: { label: 'Ratio', default: 700 },
    power: (s, t) => ftol((s.ap + s.hp / 8) * ratio(t)),
    note: 'HP is current HP (assumed full)',
    ref: 'FUN_0073EDA0 @0x73ee3c: ftol((AP + HP / 8.0) × P.Ratio)'
  }
}
