<template>
  <v-container>
    <h1>Chain of Knives</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:da-buffs="daBuffs" v-model:throw-buffs="throwBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="1260"
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
                :max="1260"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <StatsTextField
          v-model:input-stats="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          v-model:extra-stats="extraStats.da"
          label="DA"
        />
        <StatsTextField
          v-model:input-stats="stats.throwAP"
          :need-stats="0"
          label="Throw AP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcChainOfKnivesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, monsterHP, daBuffs, throwBuffs, debuffSkills, buffedDA, buffedThrowAP, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.ChainOfKnives)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const damage = computed(() => {
  const chainOfKnivesDamage = calcChainOfKnivesDamage(
    buffedDA.value,
    buffedThrowAP.value,
    localBasePower.value
  )
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    chainOfKnivesDamage
  )
})

const resDA = computed(() => {
  const needDA = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.ChainOfKnives(localBasePower.value),
    buffedDA.value * 16 + buffedThrowAP.value * 6,
    0
  )

  return Math.ceil(needDA / calcDABuffRatio(daBuffs.value) / 16)
})
</script>
