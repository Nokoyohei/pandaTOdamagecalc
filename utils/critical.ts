export const CRIT_MULTIPLIER = {
  physical: 1.5,
  gun: 1.2,
  magic: 1.1,
} as const

export type CritType = keyof typeof CRIT_MULTIPLIER
