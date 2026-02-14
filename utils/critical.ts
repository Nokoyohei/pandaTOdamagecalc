export const CRIT_MULTIPLIER = {
  physical: 1.5,
  gun: 1.2,
  magic: 1.1,
} as const

export type CritType = keyof typeof CRIT_MULTIPLIER

export const SHARP_SENSE_MULTIPLIER = 6.0
export const GODLY_SHARP_SENSE_MULTIPLIER = 8.0
