<template>
  <v-container>
    <h1>Cleaving Terra</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.CleavingTerra" />
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
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, maBuffs, buffedMA } = useSkillPage()

const localBasePower = ref(BASE_POWER.CleavingTerra)

const idealDamage = computed(() =>
  calcCleavingTerraDamage(buffedMA.value, localBasePower.value)
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
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.magic
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
