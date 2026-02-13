<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" v-model:dl-buffs="dlBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.GravityCrash" />
        <stats-text-field
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
  calcDarkCommandoDamage,
  calcGravityCrashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { mode, monster, stats, extraStats, maBuffs, dlBuffs, buffedMA, monsterHP } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref(BASE_POWER.GravityCrash)

const damage = computed(() => {
  let darkCommandoDamage = dlBuffs.value.includes('darkCommando')
    ? calcDarkCommandoDamage(buffedMA.value)
    : 0
  let gravityCrashDamage = calcGravityCrashDamage(buffedMA.value, localBasePower.value)
  if (dlBuffs.value.includes('bloodTestament')) {
    darkCommandoDamage = Math.round(
      darkCommandoDamage * (1 + BloodTestamentBuff)
    )
    gravityCrashDamage = Math.round(
      gravityCrashDamage * (1 + BloodTestamentBuff)
    )
  }

  return (
    calcDamage(
      calcMonsterDef(monster.value, 'magic'),
      monster.value.darkR,
      gravityCrashDamage
    ) +
    calcDamage(
      calcMonsterDef(monster.value, 'magic'),
      monster.value.darkR,
      darkCommandoDamage
    )
  )
})

const resMA = computed(() => {
  const attackRatio = dlBuffs.value.includes('darkCommando')
    ? SkillRatio.GravityCrash(localBasePower.value) + SkillRatio.DarkCommando()
    : SkillRatio.GravityCrash(localBasePower.value)
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1

  const needMA = calcNeedStats(
    monsterHP.value,
    monsterDef,
    monster.value.darkR,
    attackRatio,
    buffedMA.value,
    constStats,
    buff
  )

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
