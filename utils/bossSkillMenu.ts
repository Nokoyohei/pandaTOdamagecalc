/*
 * utils/bossSkills.ts のスキルをメニューに並べる順（職種別）。
 * nuxt.config.ts が prerender するルートの一覧としても読むので、依存を持たせない。
 */
export const BOSS_SKILL_MENU: { title: string; keys: string[] }[] = [
  {
    title: 'ATTACK TYPE',
    keys: ['lacerator', 'piercing_wave', 'blazing_strike', 'inferno_blade', 'flash_cut', 'mega_flash_cut', 'shadow']
  },
  {
    title: 'MAGIC TYPE',
    keys: [
      'hellfire',
      'arrow_of_light',
      'dark_lance',
      'light_wave',
      'radiant_strike',
      'aqua_bomb',
      'dragon_storm',
      'searing_light',
      'ghostly_whisper',
      'godly_arrow_rush'
    ]
  },
  { title: 'SENSE TYPE', keys: ['butt_plate', 'poison_pouch'] },
  {
    title: 'CHARM TYPE',
    keys: ['fatal_wound', 'card_strike', 'impelling_rage', 'power_charging', 'wild_nail', 'furious_galder_throw', 'raging_nail', 'heavy_hit']
  }
]

export const BOSS_SKILL_KEYS = BOSS_SKILL_MENU.flatMap((g) => g.keys)
