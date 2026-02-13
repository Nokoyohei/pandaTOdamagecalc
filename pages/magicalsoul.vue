<template>
  <v-container>
    <h1>Magical Soul</h1>
    <BossMonsterPanel :damage="damage" v-model:monster="monster" />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <APBuff v-model:buff="apBuffs" />
        <MABuff v-model:buff="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
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
  calcMagicalSoulDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'

const { stats, extraStats, monster, monsterHP, apBuffs, maBuffs, buffedAP, buffedMA } = useSkillPage({ skillMode: 'boss' })

const damage = computed(() => {
  const magicalSoulDamage = calcMagicalSoulDamage(
    buffedAP.value,
    buffedMA.value
  )
  return calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.noPropR,
    magicalSoulDamage
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.noPropR,
    buffedMA.value / 100,
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resMA = computed(() => {
  const needMA =
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(monster.value, 'magic'),
      monster.value.noPropR,
      buffedAP.value,
      buffedMA.value / 100,
      0
    ) * 100

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
