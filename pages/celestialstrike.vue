<template>
  <v-container>
    <h1>Celestial Strike</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
      :crit-multiplier="CRIT_MULTIPLIER.magic"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" :crit-multiplier="CRIT_MULTIPLIER.magic" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" />
        <p>Light Skills</p>
        <v-btn-toggle
          v-model="selectedLightSkills"
          multiple
          bg-color="black"
        >
          <v-tooltip v-for="skill in lightSkills" :key="skill.name" location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-btn :value="skill.value" v-bind="activatorProps">
                <img :src="skill.img" />
              </v-btn>
            </template>
            <span>{{ skill.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.CelestialStrike" />
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
  calcCelestialStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { LightSkillName } from '~/types'

const { mode, monster, stats, extraStats, maBuffs, buffedMA, monsterHP } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref(BASE_POWER.CelestialStrike)

const selectedLightSkills = ref<LightSkillName[]>([])

const lightSkills = [
  {
    value: 'ArrowOfLight',
    name: 'Arrow of Light',
    img: '/light_arrow.gif'
  },
  {
    value: 'CatastropheHeal',
    name: 'Catastrophe Heal',
    img: '/emergency.gif'
  },
  {
    value: 'BasicHealing',
    name: 'Basic Healing',
    img: '/treatment.gif'
  },
  {
    value: 'LightWave',
    name: 'Light Wave',
    img: '/plasma_shock.gif'
  },
  {
    value: 'RadientStrike',
    name: 'Radient Strike',
    img: '/shining_burst.gif'
  },
  {
    value: 'HeartsGrace',
    name: "Heart's Grase",
    img: '/force_field.gif'
  },
  {
    value: 'SealingLight',
    name: 'Sealing Light',
    img: '/holylance.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.lightR,
    calcCelestialStrikeDamage(buffedMA.value, selectedLightSkills.value.length, localBasePower.value)
  )
})

const resMA = computed(() => {
  const needMA = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.lightR,
    SkillRatio.CelestialStrike(selectedLightSkills.value.length, localBasePower.value),
    buffedMA.value,
    25
  )

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
