<template>
  <v-container>
    <h1>Full House</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:lk-buffs="lkBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="1600"
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
                :max="1600"
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
          v-model:input-stats="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          v-model:extra-stats="extraStats.lk"
          label="LK"
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
  calcFullHouseDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, apBuffs, lkBuffs, hvBuffs, buffedAP, buffedLK, buffedHV } = useSkillPage()

const localBasePower = ref(BASE_POWER.FullHouse)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    calcFullHouseDamage(buffedAP.value, buffedLK.value, buffedHV.value, localBasePower.value)
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.FullHouse(localBasePower.value),
    buffedAP.value + (buffedLK.value + buffedHV.value) * 8,
    0
  )
)

const resAP = computed(() =>
  Math.ceil(needStats.value / calcAPBuffRatio(apBuffs.value))
)

const resLK = computed(() => {
  const needLK = needStats.value / 8
  return Math.ceil(needLK / calcLKBuffRatio(lkBuffs.value))
})

const resHV = computed(() => {
  const needHV = needStats.value / 8
  return Math.ceil(needHV / calcHVBuffRatio(hvBuffs.value))
})
</script>
