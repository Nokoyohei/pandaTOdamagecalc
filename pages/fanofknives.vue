<template>
  <v-container>
    <h1>Fan of Knives</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
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
            :max="120"
            :step="1"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="1200"
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
  calcFanOfKnicesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, daBuffs, throwBuffs, buffedDA, buffedThrowAP } = useSkillPage()

const localBasePower = ref(BASE_POWER.FanOfKnives)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    calcFanOfKnicesDamage(buffedDA.value, buffedThrowAP.value, localBasePower.value)
  )
)

const resDA = computed(() => {
  const needDA = calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.FanOfKnives(localBasePower.value),
    buffedDA.value + buffedThrowAP.value / 10,
    0
  )
  return Math.ceil(needDA / calcDABuffRatio(daBuffs.value))
})
</script>
