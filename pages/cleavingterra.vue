<template>
  <v-container>
    <h1>Cleaving Terra</h1>
    {{ monster.name }}
    {{ monster.earthR }}
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
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
            :max="680"
            :step="0.5"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="680"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcCleavingTerraDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, maBuffs, buffedMA } = useSkillPage()

const localBasePower = ref(BASE_POWER.CleavingTerra)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    calcCleavingTerraDamage(buffedMA.value, localBasePower.value)
  )
)

const resMA = computed(() => {
  const needMA = calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    SkillRatio.CleavingTerra(localBasePower.value),
    buffedMA.value,
    25
  )
  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
