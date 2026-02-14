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
      :crit-damage="critAvgDamage"
      :crit-damage-string="[
        `maximum:${critMaxDamage.toLocaleString()}`,
        `average:${critAvgDamage.toLocaleString()}`,
        `minimum:${critMinDamage.toLocaleString()}`
      ]"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="purple" hide-details density="compact">
          <template #label><span style="font-weight:bold;font-size:1.1rem;color:#d500f9">⚔ Godly Gale Strike</span></template>
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
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, apBuffs, debuffSkills, buffedAP, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref<number>(BASE_POWER.GaleStrike)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.GaleStrike : BASE_POWER.GaleStrike
)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const maxIdealDamage = computed(() => {
  return calcGaleStrikeDamage(buffedAP.value, stats.value.wind, localBasePower.value)
})

const minIdealDamage = computed(() => {
  return calcGaleStrikeDamage(buffedAP.value, 0, localBasePower.value)
})

const avgIdealDamage = computed(() => {
  return calcGaleStrikeDamage(buffedAP.value, stats.value.wind / 2, localBasePower.value)
})

const maxDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    maxIdealDamage.value
  )
})

const minDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    minIdealDamage.value
  )
})

const avgDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    avgIdealDamage.value
  )
})

const critMaxDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    maxIdealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
})

const critMinDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    minIdealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
})

const critAvgDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    avgIdealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
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
