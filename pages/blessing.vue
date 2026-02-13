<template>
  <v-container>
    <h1>Blessings</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <p class="text-center">Blessings</p>
    <v-layout justify-center>
      <v-btn-toggle
        v-model="selectedBlessingSkills"
        multiple
        borderless
        mandatory
        background-color="black"
      >
        <v-tooltip v-for="skill in BlessingSkills" :key="skill.name" bottom>
          <template #activator="{on}">
            <v-btn :value="skill.value" v-on="on">
              <img :src="skill.img" />
            </v-btn>
          </template>
          <span>{{ skill.name }}</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-layout>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ACBuff v-model:buff="acBuffs" />
        <LKBuff v-model:buff="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <StatsTextField
          v-model:input-stats="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          v-model:extra-stats="extraStats.ac"
          label="AC"
        /><StatsTextField
          v-model:input-stats="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          v-model:extra-stats="extraStats.lk"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcBlessingDamage,
  calcDamage,
  calcMonsterDef
} from '~/utils/calc'
import type { Skill } from '~/types'
import skillRatio from '~/utils/skillRatio'

const { stats, extraStats, monster, acBuffs, lkBuffs, buffedAC, buffedLK } = useSkillPage()

const selectedBlessingSkills = ref<number[]>([])

const BlessingSkills: Skill[] = [
  {
    value: 0,
    name: "Salamander's Blessing",
    attr: 'fireR',
    ratio: skillRatio.FireBlessing(),
    img: '/salamanderBlessing.gif'
  },
  {
    value: 1,
    name: "Raion's Blessing",
    attr: 'elecR',
    ratio: skillRatio.ElecBlessing(),
    img: '/raionBlessing.gif'
  },
  {
    value: 2,
    name: "Gnome's Blessing",
    attr: 'earthR',
    ratio: skillRatio.EarthBlessing(),
    img: '/gnomeBlessing.gif'
  },
  {
    value: 3,
    name: "Undine's Blessing",
    attr: 'waterR',
    ratio: skillRatio.WaterBlessing(),
    img: '/undineBlessing.gif'
  },
  {
    value: 4,
    name: "Sylph's Blessing",
    attr: 'windR',
    ratio: skillRatio.WindBlessing(),
    img: '/sylphBlessing.gif'
  }
]

const damage = computed(() => {
  let damage = 0
  selectedBlessingSkills.value.forEach((e: number) => {
    damage += calcDamage(
      calcMonsterDef(monster.value, 'magic'),
      monster.value[BlessingSkills[e].attr],
      calcBlessingDamage(
        buffedAC.value,
        buffedLK.value,
        BlessingSkills[e].ratio
      )
    )
  })
  return damage
})
</script>
