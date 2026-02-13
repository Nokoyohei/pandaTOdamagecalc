<template>
  <v-container>
    <h1>Sharp Scream</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-multiplier="CRIT_MULTIPLIER.physical" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.SharpScream" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
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
  calcSharpScreamDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, apBuffs, hvBuffs, buffedAP, buffedHV } = useSkillPage()

const localBasePower = ref(BASE_POWER.SharpScream)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    calcSharpScreamDamage(buffedAP.value, buffedHV.value, localBasePower.value)
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.SharpScream(localBasePower.value),
    buffedAP.value + buffedHV.value * 16,
    0
  )
)

const resAP = computed(() =>
  Math.ceil(needStats.value / calcAPBuffRatio(apBuffs.value))
)

const resHV = computed(() => {
  const needHV = needStats.value / 16
  return Math.ceil(needHV / calcHVBuffRatio(hvBuffs.value))
})
</script>
