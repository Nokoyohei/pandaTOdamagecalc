<template>
  <v-container>
    <h1>Deadly Fen</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" v-model:lk-buffs="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.DeadlyFen" />
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
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, maBuffs, lkBuffs, buffedMA, buffedLK } = useSkillPage()

const localBasePower = ref(BASE_POWER.DeadlyFen)

const idealDamage = computed(() =>
  calcDeadlyFenDamage(buffedMA.value, buffedLK.value, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.earthR,
    idealDamage.value * CRIT_MULTIPLIER.magic
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
