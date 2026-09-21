/*
 * utils/bossSkills.ts のスキルをメニューに並べる順（職種別）。
 * nuxt.config.ts が prerender するルートの一覧としても読むので、依存を持たせない。
 */
export const BOSS_SKILL_MENU: { title: string; keys: string[] }[] = [
  {
    title: 'ATTACK TYPE',
    keys: ['tetra_punch', 'lacerator', 'piercing_wave', 'blazing_strike', 'inferno_blade', 'flash_cut', 'mega_flash_cut', 'shadow']
  },
  {
    title: 'MAGIC TYPE',
    keys: [
      'drip_bomb',
      'whirlwind_blaze',
      'incinerate',
      'thunderbolt',
      'hellfire',
      'arrow_of_light',
      'dark_lance',
      'light_wave',
      'radiant_strike',
      'aqua_bomb',
      'dragon_storm',
      'razor_gale',
      'phoenix_rising',
      'searing_light',
      'ghostly_whisper',
      'godly_arrow_rush'
    ]
  },
  { title: 'SENSE TYPE', keys: ['butt_plate', 'poison_pouch'] },
  {
    title: 'CHARM TYPE',
    keys: [
      'beast_claw',
      'fatal_wound',
      'card_strike',
      'impelling_rage',
      'power_charging',
      'wild_nail',
      'fist_full_of_galders',
      'furious_galder_throw',
      'raging_nail',
      'heavy_hit'
    ]
  }
]

export const BOSS_SKILL_KEYS = BOSS_SKILL_MENU.flatMap((g) => g.keys)
