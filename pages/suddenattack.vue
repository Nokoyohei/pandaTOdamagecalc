<template>
  <v-container>
    <h1>Sudden Attack</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:da-buffs="daBuffs" v-model:lk-buffs="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="1680"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="1680"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
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

const damage = computed(() => {
  const suddenAttackDamage = calcSuddenAttackDamage(
    buffedAP.value,
    buffedDA.value,
    buffedLK.value,
    localBasePower.value
  )
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    suddenAttackDamage
  )
})

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
