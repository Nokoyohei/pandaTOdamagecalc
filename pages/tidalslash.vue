<template>
  <v-container>
    <h1>Tidal Slash</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
      :crit-multiplier="CRIT_MULTIPLIER.physical"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" :crit-multiplier="CRIT_MULTIPLIER.physical" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.TidalSlash" />
        <stats-text-field
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          v-model:input-stats="stats.water"
          :need-stats="resWater"
          label="Water Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcTidalSlashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { mode, monster, stats, extraStats, apBuffs, buffedAP, monsterHP, debuffSkills, debuffedMonster } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref(BASE_POWER.TidalSlash)

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcTidalSlashDamage(buffedAP.value, stats.value.water, localBasePower.value)
  )
})

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.TidalSlash(stats.value.water, localBasePower.value),
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resWater = computed(() => {
  return Math.ceil(
    (calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'physical'),
      debuffedMonster.value.physicalR,
      buffedAP.value,
      SkillRatio.TidalSlash(stats.value.water, localBasePower.value),
      0
    ) *
      100) /
      2.5
  )
})
</script>
