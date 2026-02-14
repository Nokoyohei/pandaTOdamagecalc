<template>
  <v-container>
    <h1>Flaming Fist</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.FlamingFist" />
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
  calcFlamingFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { skillPanel } from '~/types'

const { stats, extraStats, monster, monsterHP, apBuffs, maBuffs, debuffSkills, buffedAP, buffedMA, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.FlamingFist)

const debuffSkillsDef: skillPanel[] = [
  {
    value: 'RaionsSpace',
    name: "Raion's space",
    img: '/thunderarea.gif'
  }
]

const idealDamage = computed(() => {
  return calcFlamingFistDamage(buffedAP.value, stats.value.fire, buffedMA.value, localBasePower.value)
})

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    idealDamage.value
  )
})

const critDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.magic
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    (SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedMA.value) / 100,
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resMA = computed(() => {
  const needMA =
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedAP.value,
      buffedMA.value / 100,
      0
    ) * 100

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})

const resFire = computed(() => {
  return Math.ceil(
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      (buffedAP.value * buffedMA.value) / 100,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value),
      0
    ) * 100
  )
})
</script>
