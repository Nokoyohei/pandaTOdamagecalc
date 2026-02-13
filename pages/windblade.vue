<template>
  <v-container>
    <h1>Wind Blade</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.WindBlade" />
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
  calcWindBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, maBuffs, buffedMA } = useSkillPage()

const localBasePower = ref(BASE_POWER.WindBlade)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    calcWindBladeDamage(buffedMA.value, localBasePower.value)
  )
)

const resMA = computed(() => {
  const needMA = calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    SkillRatio.WindBlade(localBasePower.value),
    buffedMA.value,
    49
  )
  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
