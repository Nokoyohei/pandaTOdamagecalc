<template>
  <v-container>
    <h1>One Pair</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-multiplier="CRIT_MULTIPLIER.physical"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
        <v-switch v-model="buff" value="ladyluck">
          <template #label>
            <img src="/ladyluck.gif" />
            LadyLuck
          </template>
        </v-switch>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.OnePair" />
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
  calcOnePairDamage,
  calcDamage,
  calcMonsterDef,
  calcNeedStats,
  calcAPBuffRatio,
  calcHVBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, monsterHP, apBuffs, hvBuffs, debuffSkills, buffedAP, buffedHV, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.OnePair)
const buff = ref<'ladyluck' | null>(null)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const isLadyLuck = computed(() => {
  return buff.value?.includes('ladyluck')
})

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcOnePairDamage(buffedAP.value, buffedHV.value, isLadyLuck.value, localBasePower.value)
  )
})

const resStats = () => {
  const multiplier = isLadyLuck.value ? 1 + SkillRatio.LadyLuck() : 1
  return calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.OnePair(localBasePower.value) * multiplier,
    buffedAP.value + buffedHV.value * 8,
    0
  )
}

const resAP = computed(() => {
  return Math.ceil(resStats())
})

const resHV = computed(() => {
  return Math.ceil(resStats() / 8)
})
</script>
