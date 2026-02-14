<template>
  <v-container>
    <h1>Sonic Slash</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
      :crit-damage="critDamage"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="amber-darken-3" hide-details density="compact">
          <template #label><span class="godly-label">Godly Sonic Slash</span></template>
        </v-switch>
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
        <stats-text-field
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          v-model:input-stats="stats.water"
          :need-stats="resWater"
          label="Water Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcSonicSlashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { mode, monster, stats, extraStats, apBuffs, buffedAP, monsterHP, debuffSkills, debuffedMonster } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref<number>(BASE_POWER.SonicSlash)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.SonicSlash : BASE_POWER.SonicSlash
)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const idealDamage = computed(() => {
  return calcSonicSlashDamage(buffedAP.value, stats.value.water, localBasePower.value)
})

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value
  )
})

const critDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.SonicSlash(stats.value.water, localBasePower.value),
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resWater = computed(() => {
  return Math.ceil(
    (calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'physical'),
      debuffedMonster.value.physicalR,
      buffedAP.value,
      SkillRatio.SonicSlash(stats.value.water, localBasePower.value),
      0
    ) *
      100) /
      3.5
  )
})
</script>
