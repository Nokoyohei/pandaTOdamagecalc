<template>
  <v-container>
    <h1>Celestial Strike</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
      :crit-damage="critDamage"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
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
                <img v-if="skill.img" :src="skill.img" />
                <span v-else class="text-caption">{{ skill.name }}</span>
              </v-btn>
            </template>
            <span>{{ skill.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="SKILL_POWER.CelestialStrike" />
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
  magicAttackPower,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillPower, { SKILL_POWER } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'
import type { LightSkillName } from '~/types'

const { mode, monster, stats, extraStats, maBuffs, buffedMA, monsterHP } =
  useSkillPage({ skillMode: 'dual' })

const localBasePower = ref(SKILL_POWER.CelestialStrike)

const selectedLightSkills = ref<LightSkillName[]>([])

// サーバは習得済みスキルのうち eSkillSymbolType == 7 の個数を数える（FUN_0067F700）。
// SkillParam2 で該当するプレイヤースキルはこの 9 つ
const lightSkills: { value: LightSkillName; name: string; img?: string }[] = [
  {
    value: 'LightPact',
    name: 'Light Pact'
  },
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
    value: 'LightWave',
    name: 'Light Wave',
    img: '/plasma_shock.gif'
  },
  {
    value: 'BasicHealing',
    name: 'Basic Healing',
    img: '/treatment.gif'
  },
  {
    value: 'LightShield',
    name: 'Light Shield'
  },
  {
    value: 'RadiantStrike',
    name: 'Radiant Strike',
    img: '/shining_burst.gif'
  },
  {
    value: 'MedCure',
    name: 'Med. Cure'
  },
  {
    value: 'SearingLight',
    name: 'Searing Light',
    img: '/holylance.gif'
  }
]

const idealDamage = computed(() => {
  return magicAttackPower(
    SkillPower.CelestialStrike(selectedLightSkills.value.length, localBasePower.value),
    buffedMA.value,
    25
  )
})

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.lightR,
    idealDamage.value
  )
})

const critDamage = computed(() => {
  return calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.lightR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.magic
  )
})

const resMA = computed(() => {
  const needMA = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(monster.value, 'magic'),
    monster.value.lightR,
    SkillPower.CelestialStrike(selectedLightSkills.value.length, localBasePower.value) / 100,
    buffedMA.value,
    25
  )

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})
</script>
