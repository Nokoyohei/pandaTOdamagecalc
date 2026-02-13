<template>
  <v-container>
    <h1>Tesla Field</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <MABuff v-model:buff="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
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
import SkillRatio from '~/utils/skillRatio'

const { stats, extraStats, monster, maBuffs, buffedMA } = useSkillPage()

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.elecR,
    calcTeslaFieldDamage(buffedMA.value, stats.value.mp)
  )
)

const resStat = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.elecR,
    SkillRatio.TeslaField(),
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
