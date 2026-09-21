/*
  クリティカル倍率。いずれも防御を引く「前」の攻撃力に掛かる（utils/calc.ts の rawDamage）。
    physical : FUN_0059AF40 の 1.5f  @0x97AF88
    magic    : FUN_0059C230 の 1.1f  @0x97AFF0
    gun      : FUN_0059D4A0 に渡る倍率（Character +0x428）
  ゲーム側は float なので float32 に丸めた値を使う。
*/
export const CRIT_MULTIPLIER = {
  physical: 1.5,
  gun: Math.fround(1.2),
  magic: Math.fround(1.1),
} as const

export type CritType = keyof typeof CRIT_MULTIPLIER

export const SHARP_SENSE_MULTIPLIER = 6.0
export const GODLY_SHARP_SENSE_MULTIPLIER = 8.0
