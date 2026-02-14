<template>
  <v-container>
    <h1>Sudden Attack</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:da-buffs="daBuffs" v-model:lk-buffs="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.SuddenAttack" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          v-model:extra-stats="extraStats.da"
          label="DA"
        />
        <StatsTextField
          v-model:input-stats="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          v-model:extra-stats="extraStats.lk"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcSuddenAttackDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio,
  calcAPBuffRatio,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, monsterHP, apBuffs, daBuffs, lkBuffs, debuffSkills, buffedAP, buffedDA, buffedLK, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.SuddenAttack)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const idealDamage = computed(() =>
  calcSuddenAttackDamage(
    buffedAP.value,
    buffedDA.value,
    buffedLK.value,
    localBasePower.value
  )
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
)

const needStats = computed(() => {
  return calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.SuddenAttack(localBasePower.value),
    buffedAP.value + (buffedDA.value + buffedLK.value) * 16,
    0
  )
})

const resAP = computed(() => {
  return Math.ceil(needStats.value / calcAPBuffRatio(apBuffs.value))
})

const resDA = computed(() => {
  const needDA = needStats.value / 16
  return Math.ceil(needDA / calcDABuffRatio(daBuffs.value))
})

const resLK = computed(() => {
  const needLK = needStats.value / 16
  return Math.ceil(needLK / calcLKBuffRatio(lkBuffs.value))
})
</script>
