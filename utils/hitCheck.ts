import { ftol, f32 } from '~/utils/x87'
import { BOSS_SKILLS } from '~/utils/bossSkills'
import {
  SKILL_APPLY_RATIO,
  GODLY_SKILL_APPLY_RATIO,
  BOSS_SKILL_APPLY_RATIO,
  GODLY_BOSS_SKILL_APPLY_RATIO
} from '~/utils/skillTable'
import type { AttackType } from '~/utils/calc'
import type { Monster } from '~/types'
import type { InjectionKey, Ref } from 'vue'

/*
 * 命中判定。出典: SPEC/04_damage.md 「命中判定」「3.4b」「3.5」
 *
 *  物理スキル FUN_0059BDD0（プレイヤー → モンスター）
 *      hit = clamp(ftol((AC − HV_tgt × 2.5 + 40) × 1.2 × bonus), 20, 100)  → rand() % 100 < hit
 *  魔法スキル FUN_0059BEB0
 *      hit = clamp(ftol((LK − LK_tgt + 90) × 1.2 × bonus), 20, 100)
 *      （FUN_0059D370 の回避 min(LK_tgt × 0.5, 50)% は攻撃側では消せないので表示しない）
 *  射撃 FUN_0059D500
 *      (LK − LK_tgt + 80) < rand() % 100 で外れ。bonus は掛からない
 *
 *  bonus は使ったスキルの ESAction_*.ApplyRatio（utils/skillTable.ts の *_APPLY_RATIO、生成物）。
 *  射撃スキル本体（FUN_0059B5E0）は SPEC で未解析なので、通常射撃と同じ LK 判定として扱う。
 */

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

export const physicalHitRate = (ac: number, targetHv: number, bonus: number) =>
  clamp(ftol((ac - targetHv * 2.5 + 40) * 1.2 * f32(bonus)), 20, 100)

export const magicHitRate = (lk: number, targetLk: number, bonus: number) =>
  clamp(ftol((lk - targetLk + 90) * 1.2 * f32(bonus)), 20, 100)

// rand() % 100 は 0〜99。X = LK − LK_tgt + 80 に対して r ≤ X で命中なので X + 1 通り
export const gunHitRate = (lk: number, targetLk: number) => clamp(lk - targetLk + 81, 0, 100)

/** rate(stat) が 100 になる最小の整数ステータス */
const minStatFor = (rate: (stat: number) => number, estimate: number) => {
  let stat = Math.ceil(estimate)
  while (stat > 0 && rate(stat - 1) >= 100) stat--
  while (rate(stat) < 100) stat++
  return stat
}

export const needAcForSureHit = (targetHv: number, bonus: number) =>
  minStatFor((ac) => physicalHitRate(ac, targetHv, bonus), targetHv * 2.5 - 40 + 100 / (1.2 * bonus))

export const needLkForSureHit = (targetLk: number, bonus: number) =>
  minStatFor((lk) => magicHitRate(lk, targetLk, bonus), targetLk - 90 + 100 / (1.2 * bonus))

export const needLkForSureGunHit = (targetLk: number) => targetLk + 19

export interface HitCheck {
  attackType: AttackType
  /** 命中判定に掛かる ApplyRatio（射撃は掛からないので 1） */
  bonus: number
  /** 現在の命中率 (%) */
  hitRate: number
  /** 確定ヒットに必要なステータス（バフ前の入力値ベース） */
  need: { stat: 'AC' | 'LK'; value: number; now: number }
}

export const HIT_CHECK_KEY: InjectionKey<Ref<HitCheck | null>> = Symbol('hitCheck')

type SkillKey = keyof typeof SKILL_APPLY_RATIO
type PageHit = { key: SkillKey; attackType: AttackType | ((stats: { fire: number }) => AttackType) }

/** pages/<route>.vue → 使うスキルと攻撃種別 */
const PAGE_SKILL: Record<string, PageHit> = {
  '2hitcombo': { key: 'HitCombo', attackType: 'physical' },
  berserk: { key: 'Berserk', attackType: 'gun' },
  blessing: { key: 'Blessing', attackType: 'magic' },
  celestialstrike: { key: 'CelestialStrike', attackType: 'magic' },
  chainofknives: { key: 'ChainOfKnives', attackType: 'physical' },
  championsblade: { key: 'ChampionsBlade', attackType: 'physical' },
  cleavingterra: { key: 'CleavingTerra', attackType: 'magic' },
  deadlyfen: { key: 'DeadlyFen', attackType: 'magic' },
  doubleshot: { key: 'DoubleShot', attackType: 'gun' },
  earthquake: { key: 'Earthquake', attackType: 'magic' },
  earthquakeblade: { key: 'EarthquakeBlade', attackType: 'physical' },
  electroattack: { key: 'ElectroAttack', attackType: 'magic' },
  fanofknives: { key: 'FanOfKnives', attackType: 'physical' },
  // 火属性があるときは火魔法判定（pages/flamingfist.vue と同じ分岐）
  flamingfist: { key: 'FlamingFist', attackType: (s) => (s.fire > 0 ? 'magic' : 'physical') },
  fullhouse: { key: 'FullHouse', attackType: 'physical' },
  galestrike: { key: 'GaleStrike', attackType: 'physical' },
  gravitycrash: { key: 'GravityCrash', attackType: 'magic' },
  luckyfist: { key: 'LuckyFist', attackType: 'physical' },
  magicalsoul: { key: 'MagicalSoul', attackType: 'magic' },
  onepair: { key: 'OnePair', attackType: 'physical' },
  poisonassault: { key: 'PoisonAssault', attackType: 'physical' },
  powershot: { key: 'PowerShot', attackType: 'gun' },
  ragingstorm: { key: 'RagingStorm', attackType: 'magic' },
  scythe: { key: 'Scythe', attackType: 'magic' },
  sharpscream: { key: 'SharpScream', attackType: 'physical' },
  shootingspree: { key: 'ShootingSpree', attackType: 'gun' },
  sonicslash: { key: 'SonicSlash', attackType: 'physical' },
  staffofagony: { key: 'StaffOfAgony', attackType: 'magic' },
  staffofthunder: { key: 'StaffOfThunder', attackType: 'magic' },
  suddenattack: { key: 'SuddenAttack', attackType: 'physical' },
  tempeststrike: { key: 'TempestStrike', attackType: 'physical' },
  teslafield: { key: 'TeslaField', attackType: 'magic' },
  tidalslash: { key: 'TidalSlash', attackType: 'physical' },
  tornadoblast: { key: 'TornadoBlast', attackType: 'magic' },
  windblade: { key: 'WindBlade', attackType: 'magic' }
}

const lookup = <T extends Record<string, number>>(table: T, key: string): number | undefined =>
  (table as Record<string, number>)[key]

/** ページ（ルート名）から攻撃種別と bonus を決める。boss/[skill] は BOSS_SKILLS から */
export function skillHitSource(
  routeName: string,
  bossSkillKey: string | undefined,
  isGodly: boolean,
  stats: { fire: number }
): { attackType: AttackType; bonus: number } | null {
  if (routeName === 'boss-skill' && bossSkillKey) {
    const def = BOSS_SKILLS[bossSkillKey]
    if (!def) return null
    const godly = isGodly && def.table.godly != null ? lookup(GODLY_BOSS_SKILL_APPLY_RATIO, bossSkillKey) : undefined
    const bonus = godly ?? lookup(BOSS_SKILL_APPLY_RATIO, bossSkillKey)
    return bonus == null ? null : { attackType: def.attackType, bonus }
  }
  const page = PAGE_SKILL[routeName]
  if (!page) return null
  const godly = isGodly ? lookup(GODLY_SKILL_APPLY_RATIO, page.key) : undefined
  const bonus = godly ?? SKILL_APPLY_RATIO[page.key]
  const attackType = typeof page.attackType === 'function' ? page.attackType(stats) : page.attackType
  return { attackType, bonus }
}

export function calcHitCheck(
  source: { attackType: AttackType; bonus: number },
  attacker: { ac: number; lk: number; acBuffRatio: number; lkBuffRatio: number },
  target: Monster
): HitCheck {
  const { attackType, bonus } = source
  if (attackType === 'physical') {
    const targetHv = Math.max(target.hv, 0)
    return {
      attackType,
      bonus,
      hitRate: physicalHitRate(attacker.ac, targetHv, bonus),
      need: { stat: 'AC', value: Math.ceil(needAcForSureHit(targetHv, bonus) / attacker.acBuffRatio), now: attacker.ac }
    }
  }
  if (attackType === 'gun') {
    return {
      attackType,
      bonus: 1,
      hitRate: gunHitRate(attacker.lk, target.lk),
      need: { stat: 'LK', value: Math.ceil(needLkForSureGunHit(target.lk) / attacker.lkBuffRatio), now: attacker.lk }
    }
  }
  return {
    attackType,
    bonus,
    hitRate: magicHitRate(attacker.lk, target.lk, bonus),
    need: { stat: 'LK', value: Math.ceil(needLkForSureHit(target.lk, bonus) / attacker.lkBuffRatio), now: attacker.lk }
  }
}
