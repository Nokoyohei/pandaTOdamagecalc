<template>
  <v-container>
    <h1>Tornado Blast</h1>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcTornadoBlastDamage,
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
    monster.value.windR,
    calcTornadoBlastDamage(buffedMA.value)
  )
)

const resMA = computed(() => {
  const needMA = calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.windR,
    SkillRatio.TornadoBlast(),
    buffedMA.value,
    49
  )
  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
