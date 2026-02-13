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
      :crit-multiplier="CRIT_MULTIPLIER.physical"
      :crit-damage-string="[
        `1st hit: ${Math.floor(fisrtHitDamage * CRIT_MULTIPLIER.physical).toLocaleString()}`,
        `2nd hit: ${Math.floor(secondHitDamage * CRIT_MULTIPLIER.physical).toLocaleString()}`
      ]"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.HitCombo" />
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
import { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, apBuffs, hvBuffs, debuffSkills, buffedAP, buffedHV, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.HitCombo)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const fisrtHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcFirstHitComboDamage(buffedAP.value, localBasePower.value)
  )
})

const secondHitDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcSecondHitComboDamage(buffedAP.value, buffedHV.value, localBasePower.value)
  )
})

const resAP = computed(() => {
  return 0
})

const resHV = computed(() => {
  return 0
})
</script>
