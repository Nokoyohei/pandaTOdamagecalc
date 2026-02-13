<template>
  <v-container>
    <h1>Champion's Blade</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.ChampionsBlade" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.fire"
          :need-stats="resFire"
          label="Fire Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcChampionsBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, apBuffs, buffedAP } = useSkillPage()

const localBasePower = ref(BASE_POWER.ChampionsBlade)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    calcChampionsBladeDamage(buffedAP.value, stats.value.fire, localBasePower.value)
  )
)

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.ChampionsBlade(stats.value.fire, localBasePower.value),
    buffedAP.value,
    0
  )
  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resFire = computed(() =>
  Math.ceil(
    calcNeedStats(
      monster.value.hp,
      calcMonsterDef(monster.value, 'physical'),
      monster.value.physicalR,
      buffedAP.value,
      SkillRatio.ChampionsBlade(stats.value.fire, localBasePower.value),
      0
    ) * 100
  )
)
</script>
