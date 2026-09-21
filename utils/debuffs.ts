import { ftol } from '~/utils/x87'
import type { AttackType } from '~/utils/calc'
import type { Monster, BossMonster, DebuffName, skillPanel } from '~/types'

/*
 * 対象の耐性を下げるデバフ。出典: SPEC/04_damage.md 3.7 / 3.8
 *
 *  Shield Breaker (3207) ESABreakBarrier @0x6ef090
 *      amount = ftol((術者 DA × P.Ratio + 20) / 3)、上限 80
 *      PhysicalR と GunR を同量下げる。DP には触れない
 *
 *  Area 系 (2311-2315) ESA*AreaDo FUN_006FA520
 *      ratio  = min((術者 MA / 400 + 0.3) × P.RegiDown, 0.5)
 *      amount = max(ftol((基本 + 装備) 耐性 × ratio), 1)
 *      属性ごとに 1 種類の耐性だけ下げる。100 超の耐性にも特別処理は無い
 */

/** ESAction_* テーブル最大レベル行 */
export const DEBUFF_TABLE = {
  /** ESAction_BreakBarrier.Ratio (Lv11) */
  shieldBreakerRatio: 0.8,
  /** ESAction_*Area.RegiDown (Lv11) */
  areaRegiDown: 0.18
} as const

export const SHIELD_BREAKER_CAP = 80

/** Area デバフが下げる耐性（SPEC 3.7 の対応表） */
export const AREA_TARGET: Record<Exclude<DebuffName, 'ShieldBreaker'>, keyof Monster> = {
  UndinesGarden: 'elecR',
  RaionsSpace: 'fireR',
  SalamandersTerritory: 'earthR',
  GnomesDomain: 'windR',
  SylphsPlayground: 'waterR'
}

export const DEBUFF_PANEL: Record<DebuffName, skillPanel> = {
  ShieldBreaker: { value: 'ShieldBreaker', name: 'Shield Breaker', img: '/barrier_break.gif' },
  UndinesGarden: { value: 'UndinesGarden', name: "Undine's Garden", img: '/undines_garden.gif' },
  RaionsSpace: { value: 'RaionsSpace', name: "Raion's Space", img: '/thunderarea.gif' },
  SalamandersTerritory: {
    value: 'SalamandersTerritory',
    name: "Salamander's Territory",
    img: '/salamanders_territory.gif'
  },
  GnomesDomain: { value: 'GnomesDomain', name: "Gnome's Domain", img: '/gnomes_domain.gif' },
  SylphsPlayground: { value: 'SylphsPlayground', name: "Sylph's Playground", img: '/sylphs_playground.gif' }
}

export interface DebuffCaster {
  da: number
  ma: number
}

// FUN_006EEED0: ftol((DA × Ratio + 20.0) / 3.0)、80 で頭打ち
export const shieldBreakerAmount = (da: number, ratio: number = DEBUFF_TABLE.shieldBreakerRatio) =>
  Math.min(ftol((da * ratio + 20) / 3), SHIELD_BREAKER_CAP)

// FUN_006FA520: ratio = min((MA / 400 + 0.3) × RegiDown, 0.5)、amount = max(ftol(耐性 × ratio), 1)
export const areaRatio = (ma: number, regiDown: number = DEBUFF_TABLE.areaRegiDown) =>
  Math.min((ma / 400 + 0.3) * regiDown, 0.5)

export const areaAmount = (resist: number, ma: number, regiDown: number = DEBUFF_TABLE.areaRegiDown) =>
  Math.max(ftol(resist * areaRatio(ma, regiDown)), 1)

/** デバフを掛けた後のモンスター */
export const calcDebuffedMonster = <T extends Monster | BossMonster>(
  monster: T,
  debuffs: DebuffName[],
  caster: DebuffCaster
): T => {
  const result = { ...monster }
  if (debuffs.includes('ShieldBreaker')) {
    const amount = shieldBreakerAmount(caster.da)
    result.physicalR = monster.physicalR - amount
    result.gunR = monster.gunR - amount
  }
  for (const debuff of debuffs) {
    if (debuff === 'ShieldBreaker') continue
    const key = AREA_TARGET[debuff]
    result[key] = monster[key] - areaAmount(monster[key], caster.ma)
  }
  return result
}

/** そのスキルに意味のあるデバフだけ返す。無ければ undefined（パネルにデバフ欄を出さない） */
export const debuffDefsFor = (
  attackType: AttackType,
  resist: keyof Monster | 'none'
): skillPanel[] | undefined => {
  if (resist === 'physicalR' || resist === 'gunR') return [DEBUFF_PANEL.ShieldBreaker]
  if (attackType === 'physical' && resist === 'none') return undefined
  const area = (Object.keys(AREA_TARGET) as Exclude<DebuffName, 'ShieldBreaker'>[]).find(
    (name) => AREA_TARGET[name] === resist
  )
  return area ? [DEBUFF_PANEL[area]] : undefined
}
