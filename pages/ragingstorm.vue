<template>
  <v-container>
    <h1>Raging Storm</h1>
    <p>{{ idealDamage.toFixed(0) }}</p>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="SKILL_POWER.RagingStorm" />
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
  magicAttackPower,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcACBuffRatio
} from '~/utils/calc'
import SkillPower, { SKILL_POWER } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, maBuffs, acBuffs, buffedMA, buffedAC } = useSkillPage()

const localBasePower = ref(SKILL_POWER.RagingStorm)

const idealDamage = computed(() =>
  magicAttackPower(
    SkillPower.RagingStorm(localBasePower.value),
    buffedMA.value + stats.value.ac,
    49
  )
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
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.magic
  )
)

const needStat = () =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    SkillPower.RagingStorm(localBasePower.value) / 100,
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
