<template>
  <v-container>
    <h1>Flaming Fist</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <APBuff v-model:buff="apBuffs" />
        <MABuff v-model:buff="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="1140"
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
                :max="1140"
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
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
        />
        <StatsTextField
          v-model:input-stats="stats.fire"
          :need-stats="resFire"
          label="Fire Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcFlamingFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, monsterHP, apBuffs, maBuffs, debuffSkills, buffedAP, buffedMA, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.FlamingFist)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'RaionsSpace',
    name: "Raion's space",
    img: '/thunderarea.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    calcFlamingFistDamage(buffedAP.value, stats.value.fire, buffedMA.value, localBasePower.value)
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    (SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedMA.value) / 100,
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resMA = computed(() => {
  const needMA =
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedAP.value,
      buffedMA.value / 100,
      0
    ) * 100

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})

const resFire = computed(() => {
  return Math.ceil(
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      (buffedAP.value * buffedMA.value) / 100,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value),
      0
    ) * 100
  )
})
</script>
