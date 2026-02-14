<template>
  <v-container>
    <h1>Tesla Field</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.TeslaField" />
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
        />
        <StatsTextField
          v-model:input-stats="stats.mp"
          :need-stats="resMP"
          v-model:extra-stats="extraStats.mp"
          label="MAX MP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcTeslaFieldDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, maBuffs, buffedMA } = useSkillPage()

const localBasePower = ref(BASE_POWER.TeslaField)

const idealDamage = computed(() =>
  calcTeslaFieldDamage(buffedMA.value, stats.value.mp, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.elecR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.elecR,
    idealDamage.value * CRIT_MULTIPLIER.magic
  )
)

const resStat = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.elecR,
    SkillRatio.TeslaField(localBasePower.value),
    buffedMA.value + Math.floor(stats.value.mp / 120),
    0
  )
)

const resMA = computed(() =>
  Math.ceil(resStat.value / calcMABuffRatio(maBuffs.value))
)

const resMP = computed(() =>
  Math.ceil((resStat.value * 120 + stats.value.mp) / 120) * 120 -
  stats.value.mp
)
</script>
