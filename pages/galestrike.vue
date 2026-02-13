<template>
  <v-container>
    <h1>Gale Strike</h1>
    <BossMonsterPanel
      :damage="avgDamage"
      :damage-string="[
        `maximum:${maxDamage.toLocaleString()}`,
        `average:${avgDamage.toLocaleString()}`,
        `minimum:${minDamage.toLocaleString()}`
      ]"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-multiplier="CRIT_MULTIPLIER.physical"
      :crit-damage-string="[
        `maximum:${Math.floor(maxDamage * CRIT_MULTIPLIER.physical).toLocaleString()}`,
        `average:${Math.floor(avgDamage * CRIT_MULTIPLIER.physical).toLocaleString()}`,
        `minimum:${Math.floor(minDamage * CRIT_MULTIPLIER.physical).toLocaleString()}`
      ]"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.GaleStrike" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.wind"
          :need-stats="resWind"
          label="Wind Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcGaleStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, apBuffs, debuffSkills, buffedAP, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.GaleStrike)

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const maxDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcGaleStrikeDamage(buffedAP.value, stats.value.wind, localBasePower.value)
  )
})

const minDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcGaleStrikeDamage(buffedAP.value, 0, localBasePower.value)
  )
})

const avgDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcGaleStrikeDamage(buffedAP.value, stats.value.wind / 2, localBasePower.value)
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.GaleStrike(stats.value.wind, localBasePower.value),
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resWind = computed(() => {
  return Math.ceil(
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'physical'),
      debuffedMonster.value.physicalR,
      buffedAP.value,
      SkillRatio.GaleStrike(stats.value.wind / 2, localBasePower.value),
      0
    ) *
      ((100 / 7) * 2)
  )
})
</script>
