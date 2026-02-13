<template>
  <v-container>
    <h1>Sonic Slash</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="1400"
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
                :max="1400"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
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
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import type { skillPanel } from '~/types'

const { mode, monster, stats, extraStats, apBuffs, buffedAP, monsterHP, debuffSkills, debuffedMonster } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref(BASE_POWER.SonicSlash)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcSonicSlashDamage(buffedAP.value, stats.value.water, localBasePower.value)
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
