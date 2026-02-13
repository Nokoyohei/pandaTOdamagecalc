<template>
  <v-container>
    <h1>Sharp Scream</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="12"
            :step="0.1"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="1020"
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
  calcSharpScreamDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, apBuffs, hvBuffs, buffedAP, buffedHV } = useSkillPage()

const localBasePower = ref(BASE_POWER.SharpScream)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    calcSharpScreamDamage(buffedAP.value, buffedHV.value, localBasePower.value)
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.SharpScream(localBasePower.value),
    buffedAP.value + buffedHV.value * 16,
    0
  )
)

const resAP = computed(() =>
  Math.ceil(needStats.value / calcAPBuffRatio(apBuffs.value))
)

const resHV = computed(() => {
  const needHV = needStats.value / 16
  return Math.ceil(needHV / calcHVBuffRatio(hvBuffs.value))
})
</script>
