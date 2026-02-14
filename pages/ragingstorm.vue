<template>
  <v-container>
    <h1>Raging Storm</h1>
    <p>{{ idealDamage }}</p>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.RasingStorm" />
        <StatsTextField
          v-model:input-stats="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          v-model:extra-stats="extraStats.ac"
          label="AC"
        />
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
  calcRagingStormDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, maBuffs, acBuffs, buffedMA, buffedAC } = useSkillPage()

const localBasePower = ref(BASE_POWER.RasingStorm)

const idealDamage = computed(() =>
  calcRagingStormDamage(stats.value.ac, buffedMA.value, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    idealDamage.value * CRIT_MULTIPLIER.magic
  )
)

const needStat = () =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    SkillRatio.RasingStorm(localBasePower.value),
    buffedMA.value + buffedAC.value,
    49
  )

const resMA = computed(() => {
  const needMA = needStat()
  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})

const resAC = computed(() => {
  const needAC = needStat()
  return Math.ceil(needAC / calcACBuffRatio(acBuffs.value))
})
</script>
