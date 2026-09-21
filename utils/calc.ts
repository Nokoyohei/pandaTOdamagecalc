import BuffRatio from '~/utils/buffRatio'
import type { Monster, DebuffName, BossMonster, Status, Attributes } from '~/types'
import { ftol, f32, toInt32, F32_0_9, F32_0_75, F32_0_01 } from '~/utils/x87'

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

/* ============================================================================
 * GameServer.exe / BattleHelper (0x0059A000-0x0059E000) の再現
 * 出典: SPEC/04_damage.md, SPEC/generated/server/battlehelper_annot.asm
 * ==========================================================================*/

export type AttackType = 'magic' | 'physical' | 'gun'

/*
  魔法スキルの攻撃力 FUN_0059D3E0。

      fild power ; fmul 1.0
      fild MA    ; fdiv 100.0
      fmulp                       -> power × (MA − maPenalty) / 100

  power は ESAction_* テーブル由来の整数（utils/skillPower.ts）。
  maPenalty はスキル固有の定数（Scythe 49 / Searing Light 25 など）。
  float32 への丸めと防御の減算は rawDamage 側で行われる。
*/
export const magicAttackPower = (power: number, ma: number, maPenalty = 0) =>
  (power * (ma - maPenalty)) / 100

/*
  ダメージ本体。
    物理 FUN_0059AEF0（通常） / FUN_0059AF40（クリティカル）
    魔法 FUN_0059D3E0
    射撃 FUN_0059D440（通常） / FUN_0059D4A0（クリティカル）
  はいずれも

      fild 攻撃力 ; fmul 倍率 ; fstp DWORD [a]     <- float32 へ丸め
      fild 防御   ; fmul 係数 ; fstp DWORD [b]     <- float32 へ丸め
      fld [a] ; fsub [b] ; call _ftol              <- 引いてから切り捨て

  という同一構造を持つ。すなわち
  クリティカル倍率は防御を引く「前」に攻撃力へ掛かる。
  下限はクリティカル系（FUN_0059AF40 / FUN_0059D4A0）のみ 1、それ以外は 0。
*/
export const rawDamage = (
  attackPower: number,
  monsterDef: number,
  multiplier = 1,
  isCritical = false
) => {
  const damage = ftol(f32(attackPower * multiplier) - f32(monsterDef))
  return Math.max(damage, isCritical ? 1 : 0)
}

/*
  属性耐性の適用 FUN_0059C6F0。

      59c869  cmp  [r],0x64            ; if (r > 100)
      59c872  sub  ecx,0x64            ;   r -= 100
      59c87b  mov  [di.damage],0x0     ;   di.damage = 0   (100 超過分は吸収＝回復)
      59c881  mov  eax,[base]          ; base = 耐性適用前のダメージ
      59c884  imul eax,[r]             ; ★ 32bit 整数乗算。溢れると折り返す
      59c88b  fild [..] ; fmul 0.01f ; call _ftol
      59c89c  sub  ecx,eax             ; di.damage -= reduce

  - imul が符号付き 32bit で折り返すため、base * r が 2^31 を超えると reduce が
    負になりダメージが跳ね上がる（このツールで extra damage と呼んでいた現象）。
  - 0.01f は正確な 1/100 より僅かに小さいので、base * r が 100 の倍数のときは
    reduce が 1 だけ小さくなる。
  - 結果は int フィールドに書き戻されてから負数判定されるので、ここでも折り返す。
*/
export const applyResistance = (damage: number, resistance: number) => {
  const base = toInt32(damage)
  let resist = Math.trunc(resistance)
  let result = base

  if (resist > 100) {
    resist -= 100
    result = 0
  }

  const reduce = ftol(toInt32(base * resist) * F32_0_01)
  result = toInt32(result - reduce)

  // FUN_0059C6F0 末尾: 負の分は ICMD 0x75E6（回復）に回り、ダメージは 0
  return result < 0 ? 0 : result
}

// 折り返し 1 回あたりのダメージ増分 = 2^32 * 0.01f
export const EXTRA_DAMAGE_UNIT = Math.trunc(2 ** 32 * F32_0_01)

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

/*
  対象の実効防御値。rawDamage 側で float32 へ丸められるので、
  ここでは係数を掛けるだけ（ゲーム側も丸めずに fsub している）。
    魔法 FUN_0059D3E0 : MD * 0.9f
    物理 FUN_0059AEF0 : DP * 0.75f
    射撃 FUN_0059D440 : HV * 30.0
*/
export const calcMonsterDef = (
  monster: Monster,
  attacktype: AttackType
) => {
  if (attacktype === 'magic') return monster.md * F32_0_9
  if (attacktype === 'physical') return monster.dp * F32_0_75
  return monster.hv * 30
}

/*
  ダメージ計算本体。

  args:
    monsterDef     : 実効防御 -> calcMonsterDef
    monsterResist  : 対象の属性耐性（fireR, waterR ...）
    attackPower    : スキルの power（物理・射撃）または magicAttackPower の戻り値
    extraMultiplier: 攻撃力そのものに掛かる倍率（Blood Testament など）
    critMultiplier : クリティカル倍率。ゲームと同じく「防御を引く前」に掛かる
    attackType     : 省略可。魔法だけはクリティカルでも下限 0（FUN_0059D3E0）

  ※ 魔法スキルのクリティカルは厳密には ftol(power × 1.1f) と power 側を
     切り捨ててから MA/100 倍する（FUN_0059C230 @0x59c3a7）。ここでは攻撃力側に
     1.1f を掛けている。差は最大で MA/100 程度。
*/
export const calcDamage = (
  monsterDef: number,
  monsterResist: number,
  attackPower: number,
  extraMultiplier = 1,
  critMultiplier = 1,
  attackType?: AttackType
) => {
  const isCritical = critMultiplier !== 1 && attackType !== 'magic'
  return applyResistance(
    rawDamage(attackPower * extraMultiplier, monsterDef, critMultiplier, isCritical),
    monsterResist
  )
}

/*
  monsterHp を削り切るために足りないステータスを求める。

  args:
    monsterHp      : 対象の最大 HP
    monsterDef     : 実効防御 -> calcMonsterDef
    monsterResist  : 対象の属性耐性
    perStat        : ステータス 1 につき増える攻撃力
                     （魔法なら power/100、物理・射撃なら P.Ratio）
    nowStats       : 現在ダメージを出しているときのステータス
    constStats     : 最後に引く定数。例えば Gravity Crash なら 49
    extraMultiplier: 攻撃力に直接掛かる倍率（現状 Blood Testament のみ）

  applyResistance は imul の 32bit 折り返しのせいで単調増加にならないため、
  折り返し回数 q ごとの区間で解析的に候補を出し、各候補の近傍を実際の
  applyResistance で走査して最小の raw ダメージを求めている。
*/
export const calcNeedStats = (
  monsterHp: number,
  monsterDef: number,
  monsterResist: number,
  perStat: number,
  nowStats: number,
  constStats = 49,
  extraMultiplier = 1
) => {
  if (perStat <= 0 || extraMultiplier <= 0) return Infinity

  const resist = Math.trunc(monsterResist)
  // 耐性 100 以上はダメージが通らない（FUN_0059C6F0 の吸収）
  if (resist >= 100) return Infinity

  const slope = 1 - resist * F32_0_01
  const overflowGain = 2 ** 32 * F32_0_01

  // start 付近から、耐性適用後に monsterHp 以上となる最小の raw ダメージを探す
  const minRawFrom = (start: number) => {
    let raw = Math.max(0, Math.ceil(start) - 2)
    for (let i = 0; i < 16; i++, raw++) {
      if (applyResistance(raw, resist) >= monsterHp) return raw
    }
    return Infinity
  }

  let bestRaw = Infinity
  // q = imul の折り返し回数。raw * resist が [q*2^32 - 2^31, q*2^32 + 2^31) の区間
  for (let q = 0; q < 512; q++) {
    const windowStart = resist === 0 ? 0 : (q * 2 ** 32 - 2 ** 31) / resist
    const windowEnd = resist === 0 ? Infinity : (q * 2 ** 32 + 2 ** 31) / resist
    if (windowStart > bestRaw) break

    const needed = (monsterHp - q * overflowGain) / slope
    const candidate = Math.max(windowStart, needed, 0)
    if (candidate >= windowEnd) continue

    const raw = minRawFrom(candidate)
    if (raw < bestRaw) bestRaw = raw
    if (resist === 0) break
  }

  if (!Number.isFinite(bestRaw)) return Infinity

  // raw = ftol(f32(攻撃力) - f32(防御)) を満たす最小の攻撃力
  const attackPower = bestRaw + f32(monsterDef)
  return attackPower / extraMultiplier / perStat + constStats - nowStats
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
