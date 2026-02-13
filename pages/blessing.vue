<template>
  <v-container>
    <h1>Blessings</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <p class="text-center">Blessings</p>
    <div class="d-flex justify-center">
      <v-btn-toggle
        v-model="selectedBlessingSkills"
        multiple
        mandatory
        bg-color="black"
      >
        <v-tooltip v-for="skill in BlessingSkills" :key="skill.name" location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-btn :value="skill.value" v-bind="activatorProps">
              <img :src="skill.img" />
            </v-btn>
          </template>
          <span>{{ skill.name }}</span>
        </v-tooltip>
      </v-btn-toggle>
    </div>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" v-model:lk-buffs="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.Blessing" />
        <StatsTextField
          v-model:input-stats="stats.ac"
          :buffed-stats="buffedAC"
          v-model:extra-stats="extraStats.ac"
          label="AC"
        />
        <StatsTextField
          v-model:input-stats="stats.lk"
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
import skillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, acBuffs, lkBuffs, buffedAC, buffedLK } = useSkillPage()

const localBasePower = ref(BASE_POWER.Blessing)
const selectedBlessingSkills = ref<number[]>([])

const BlessingSkills = computed<Skill[]>(() => [
  {
    value: 0,
    name: "Salamander's Blessing",
    attr: 'fireR',
    ratio: skillRatio.FireBlessing(localBasePower.value),
    img: '/salamanderBlessing.gif'
  },
  {
    value: 1,
    name: "Raion's Blessing",
    attr: 'elecR',
    ratio: skillRatio.ElecBlessing(localBasePower.value),
    img: '/raionBlessing.gif'
  },
  {
    value: 2,
    name: "Gnome's Blessing",
    attr: 'earthR',
    ratio: skillRatio.EarthBlessing(localBasePower.value),
    img: '/gnomeBlessing.gif'
  },
  {
    value: 3,
    name: "Undine's Blessing",
    attr: 'waterR',
    ratio: skillRatio.WaterBlessing(localBasePower.value),
    img: '/undineBlessing.gif'
  },
  {
    value: 4,
    name: "Sylph's Blessing",
    attr: 'windR',
    ratio: skillRatio.WindBlessing(localBasePower.value),
    img: '/sylphBlessing.gif'
  }
])

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
