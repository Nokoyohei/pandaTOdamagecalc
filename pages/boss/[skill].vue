<template>
  <v-container>
    <h1>{{ title }}</h1>
    <BossMonsterPanel
      :damage="damage"
      :damage-string="damageString"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
      :crit-damage-string="critDamageString"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel
          v-model:ap-buffs="apBuffsModel"
          v-model:ma-buffs="maBuffsModel"
          v-model:da-buffs="daBuffsModel"
          v-model:lk-buffs="lkBuffsModel"
          v-model:ac-buffs="acBuffsModel"
          v-model:hv-buffs="hvBuffsModel"
          v-model:dl-buffs="dlBuffsModel"
        />
        <v-card v-if="def.params?.length" class="mb-4 pa-4" color="surface" rounded="lg" elevation="2">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">Parameters</v-card-title>
          <v-text-field
            v-for="p in def.params"
            :key="p.key"
            v-model.number="params[p.key]"
            type="number"
            :label="p.label"
            :hint="p.hint"
            persistent-hint
            density="compact"
            class="mb-2"
          />
        </v-card>
        <v-alert v-if="def.note" type="info" variant="tonal" density="compact" class="mb-4">
          {{ def.note }}
        </v-alert>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localTable" :default-power="tableDefault" />
        <StatsTextField
          v-for="key in def.stats"
          :key="key"
          v-model:input-stats="stats[key]"
          v-model:extra-stats="extraStats[key as keyof Status]"
          :need-stats="needStats[key]"
          :buffed-stats="skillStats[key]"
          :label="key.toUpperCase()"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  magicAttackPower,
  calcAPBuffRatio,
  calcMABuffRatio,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcDABuffRatio,
  calcACBuffRatio
} from '~/utils/calc'
import { ftol } from '~/utils/x87'
import SkillPower from '~/utils/skillPower'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import { BOSS_SKILLS } from '~/utils/bossSkills'
import { debuffDefsFor } from '~/utils/debuffs'
import type { SkillStats, StatKey } from '~/utils/bossSkills'
import type { Status, skillPanel } from '~/types'

const route = useRoute()
const def = BOSS_SKILLS[route.params.skill as string]
if (!def) {
  throw createError({ statusCode: 404, statusMessage: `unknown skill: ${route.params.skill}` })
}

const isGodly = useGodly()
const title = computed(() => (isGodly.value && def.table.godly != null ? `Godly ${def.title}` : def.title))

const {
  stats,
  extraStats,
  monster,
  monsterHP,
  apBuffs,
  maBuffs,
  lkBuffs,
  hvBuffs,
  daBuffs,
  acBuffs,
  dlBuffs,
  debuffSkills,
  buffedAP,
  buffedMA,
  buffedLK,
  buffedHV,
  buffedDA,
  buffedAC,
  debuffedMonster
} = useSkillPage({ skillMode: 'boss' })

// 使うステータスに対応するバフだけ BuffPanel に出す（BuffPanel は null のモデルを描画しない）
const uses = (key: StatKey) => def.stats.includes(key)
const isDarkMagic = def.attackType === 'magic' && def.resist === 'darkR'
const apBuffsModel = uses('ap') ? apBuffs : ref(undefined)
const maBuffsModel = uses('ma') ? maBuffs : ref(undefined)
const daBuffsModel = uses('da') ? daBuffs : ref(undefined)
const lkBuffsModel = uses('lk') ? lkBuffs : ref(undefined)
const acBuffsModel = uses('ac') ? acBuffs : ref(undefined)
const hvBuffsModel = uses('hv') ? hvBuffs : ref(undefined)
const dlBuffsModel = isDarkMagic ? dlBuffs : ref(undefined)

// 物理・銃には Shield Breaker、属性には対応する Area デバフ
const debuffSkillsDef = computed<skillPanel[] | undefined>(() => debuffDefsFor(def.attackType, def.resist))

// --- スライダー値（テーブル列）とスキル固有パラメータ ---------------------------
const tableDefault = computed(() =>
  isGodly.value && def.table.godly != null ? def.table.godly : def.table.default
)
const localTable = ref<number>(tableDefault.value)

const paramDefaults = () =>
  Object.fromEntries(
    (def.params ?? []).map((p) => [
      p.key,
      isGodly.value && p.godlyDefault != null ? p.godlyDefault : p.default
    ])
  )
const params = reactive<Record<string, number>>(paramDefaults())

watch(isGodly, () => {
  localTable.value = tableDefault.value
  Object.assign(params, paramDefaults())
})

// --- バフ適用後のステータス ------------------------------------------------------
const skillStats = computed<SkillStats>(() => ({
  ap: buffedAP.value,
  ac: buffedAC.value,
  dx: stats.value.dx,
  ma: buffedMA.value,
  da: buffedDA.value,
  lk: buffedLK.value,
  hv: buffedHV.value,
  hp: stats.value.hp,
  wt: stats.value.wt,
  fire: stats.value.fire
}))

const target = computed(() => (debuffSkillsDef.value ? debuffedMonster.value : monster.value))

const monsterDef = computed(() => {
  if (def.ignoreDefense) return 0
  const scale = def.defenseScale?.(localTable.value, params) ?? 1
  return calcMonsterDef(target.value, def.attackType) * scale
})

const monsterResist = computed(() => (def.resist === 'none' ? 0 : target.value[def.resist]))

const extraMultiplier = computed(() =>
  isDarkMagic && dlBuffs.value.includes('bloodTestament') ? 1 + BloodTestamentBuff : 1
)

const attackPower = computed(() => def.power(skillStats.value, localTable.value, params))

const hits = computed(() => def.hits?.(skillStats.value, localTable.value, params) ?? 1)

// 1 ヒットぶんのダメージ。闇魔法は Dark Commando の追撃を足す
const hitDamage = (critMultiplier: number) => {
  let damage = calcDamage(
    monsterDef.value,
    monsterResist.value,
    attackPower.value,
    extraMultiplier.value,
    critMultiplier,
    def.attackType
  )
  const post = def.postMultiplier?.(skillStats.value, localTable.value, params) ?? 1
  if (post !== 1) damage = ftol(damage * post)
  if (isDarkMagic && dlBuffs.value.includes('darkCommando')) {
    damage += calcDamage(
      monsterDef.value,
      monsterResist.value,
      magicAttackPower(SkillPower.DarkCommando(), buffedMA.value, 49),
      extraMultiplier.value,
      critMultiplier,
      'magic'
    )
  }
  return damage
}

const damage = computed(() => hitDamage(1))
const critDamage = computed(() => hitDamage(CRIT_MULTIPLIER[def.attackType]))

// 連撃の倍率列（Tetra Punch）。耐性適用後のダメージに整数倍が掛かる
const multipliers = def.hitMultipliers
const multiplierSum = multipliers?.reduce((a, b) => a + b, 0) ?? 1

const describe = (perHit: number) => {
  if (multipliers) {
    const total = multipliers.reduce((sum, m) => sum + perHit * m, 0)
    return [`${total.toLocaleString()} total`, `${perHit.toLocaleString()} × (${multipliers.join(' + ')})`]
  }
  if (hits.value > 1) return `${perHit.toLocaleString()} * ${hits.value}`
  return undefined
}
const damageString = computed(() => describe(damage.value))
const critDamageString = computed(() => describe(critDamage.value))

// --- 必要ステータス ---------------------------------------------------------------
// 攻撃力はどのステータスにも線形なので、1 増やしたときの差分を perStat にして逆算する
const buffRatioOf: Partial<Record<StatKey, () => number>> = {
  ap: () => calcAPBuffRatio(apBuffs.value),
  ma: () => calcMABuffRatio(maBuffs.value),
  lk: () => calcLKBuffRatio(lkBuffs.value),
  hv: () => calcHVBuffRatio(hvBuffs.value),
  da: () => calcDABuffRatio(daBuffs.value),
  ac: () => calcACBuffRatio(acBuffs.value)
}

const needStats = computed<Partial<Record<StatKey, number>>>(() => {
  const result: Partial<Record<StatKey, number>> = {}
  const base = attackPower.value
  const hpPerHit = monsterHP.value / hits.value / multiplierSum
  for (const key of def.stats) {
    const bumped = { ...skillStats.value, [key]: skillStats.value[key] + 1 }
    const perStat = def.power(bumped, localTable.value, params) - base
    if (perStat <= 0) continue
    const constStats = skillStats.value[key] - base / perStat
    const need = calcNeedStats(
      hpPerHit,
      monsterDef.value,
      monsterResist.value,
      perStat,
      skillStats.value[key],
      constStats,
      extraMultiplier.value
    )
    result[key] = Math.ceil(need / (buffRatioOf[key]?.() ?? 1))
  }
  return result
})
</script>
