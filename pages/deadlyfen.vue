<template>
  <v-container>
    <h1>Deadly Fen</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <MABuff v-model:buff="maBuffs" />
        <LKBuff v-model:buff="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="740"
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
                :max="740"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
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
  calcDeadlyFenDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, maBuffs, lkBuffs, buffedMA, buffedLK } = useSkillPage()

const localBasePower = ref(BASE_POWER.DeadlyFen)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    calcDeadlyFenDamage(buffedMA.value, buffedLK.value, localBasePower.value)
  )
)

const resStat = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    SkillRatio.DeadlyFen(localBasePower.value),
    buffedMA.value + buffedLK.value,
    25
  )
)

const resMA = computed(() =>
  Math.ceil(resStat.value / calcMABuffRatio(maBuffs.value))
)

const resLK = computed(() =>
  Math.ceil(resStat.value / calcLKBuffRatio(lkBuffs.value))
)
</script>
