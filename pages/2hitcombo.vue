<template>
  <v-container>
    <h1>2 Hit Combo</h1>
    <BossMonsterPanel
      :damage="fisrtHitDamage + secondHitDamage"
      :damage-string="[
        `1st hit: ${fisrtHitDamage.toLocaleString()}`,
        `2nd hit: ${secondHitDamage.toLocaleString()}`
      ]"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critFirstHitDamage + critSecondHitDamage"
      :crit-damage-string="[
        `1st hit: ${critFirstHitDamage.toLocaleString()}`,
        `2nd hit: ${critSecondHitDamage.toLocaleString()}`
      ]"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="amber-darken-3" hide-details density="compact">
          <template #label><span class="godly-label">Godly 2 Hit Combo</span></template>
        </v-switch>
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          v-model:extra-stats="extraStats.hv"
          label="HV"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcFirstHitComboDamage,
  calcSecondHitComboDamage,
  calcDamage,
  calcMonsterDef
} from '~/utils/calc'
import { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, apBuffs, hvBuffs, debuffSkills, buffedAP, buffedHV, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref<number>(BASE_POWER.HitCombo)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.HitCombo : BASE_POWER.HitCombo
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

const firstHitIdealDamage = computed(() => {
  return calcFirstHitComboDamage(buffedAP.value, localBasePower.value)
})

const secondHitIdealDamage = computed(() => {
  return calcSecondHitComboDamage(buffedAP.value, buffedHV.value, localBasePower.value)
})

const fisrtHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    firstHitIdealDamage.value
  )
})

const secondHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    secondHitIdealDamage.value
  )
})

const critFirstHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    firstHitIdealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
})

const critSecondHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    secondHitIdealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
})

const resAP = computed(() => {
  return 0
})

const resHV = computed(() => {
  return 0
})
</script>
