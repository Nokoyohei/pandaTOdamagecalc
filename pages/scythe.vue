<template>
  <v-container>
    <h1>Scythe</h1>
    <BossMonsterPanel :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" v-model:dl-buffs="dlBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Scythe Power
          </v-card-title>
          <v-slider
            v-model="scythePower"
            :min="0"
            :max="550"
            :step="0.5"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="scythePower"
                type="number"
                :min="0"
                :max="50"
                :step="0.5"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
        />
        <StatsTextField
          v-model:input-stats="stats.dark"
          :need-stats="resDark"
          label="DARK attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcDarkCommandoDamage,
  calcScytheDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, maBuffs, dlBuffs, buffedMA } = useSkillPage({ skillMode: 'boss' })

const scythePower = ref(45)

const damage = computed(() => {
  const darkCommandoDamage = dlBuffs.value.includes('darkCommando')
    ? calcDarkCommandoDamage(buffedMA.value)
    : 0
  const scytheDamage = calcScytheDamage(buffedMA.value, stats.value.dark, scythePower.value)

  const buff = dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1

  return (
    calcDamage(
      calcMonsterDef(monster.value, 'magic'),
      monster.value.darkR,
      scytheDamage,
      buff
    ) +
    calcDamage(
      calcMonsterDef(monster.value, 'magic'),
      monster.value.darkR,
      darkCommandoDamage,
      buff
    )
  )
})

const resMA = computed(() => {
  const scytheRatio = SkillRatio.Scythe(stats.value.dark, scythePower.value)
  const attackRatio = dlBuffs.value.includes('darkCommando')
    ? scytheRatio + SkillRatio.DarkCommando()
    : scytheRatio
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

const resDark = computed(() => {
  const scytheRatio = SkillRatio.Scythe(stats.value.dark, scythePower.value)
  const attackRatio = dlBuffs.value.includes('darkCommando')
    ? scytheRatio + SkillRatio.DarkCommando()
    : scytheRatio
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1

  return Math.ceil(
    (calcNeedStats(
      monsterHP.value,
      monsterDef,
      monster.value.darkR,
      buffedMA.value - constStats,
      attackRatio,
      0,
      buff
    ) *
      100) /
      30
  )
})
</script>
