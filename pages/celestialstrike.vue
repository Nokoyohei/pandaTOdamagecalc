<template>
  <v-container>
    <h1>Celestial Strike</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
        <p>Light Skills</p>
        <v-btn-toggle
          v-model="selectedLightSkills"
          multiple
          borderless
          background-color="black"
        >
          <v-tooltip v-for="skill in lightSkills" :key="skill.name" bottom>
            <template #activator="{on}">
              <v-btn :value="skill.value" v-on="on">
                <img :src="skill.img" />
              </v-btn>
            </template>
            <span>{{ skill.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1100"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="basePower"
                type="number"
                :min="0"
                :max="1100"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraStats.ma"
          label="MA"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcCelestialStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { LightSkillName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    MaBuff,
    StatsTextField
  }
})
export default class CelestialStrike extends BaseSkillPage {
  get skillMode() { return 'dual' as const }
  basePower: number = BASE_POWER.CelestialStrike

  selectedLightSkills: LightSkillName[] = []

  lightSkills = [
    {
      value: 'ArrowOfLight',
      name: 'Arrow of Light',
      img: require('~/static/light_arrow.gif')
    },
    {
      value: 'CatastropheHeal',
      name: 'Catastrophe Heal',
      img: require('~/static/emergency.gif')
    },
    {
      value: 'BasicHealing',
      name: 'Basic Healing',
      img: require('~/static/treatment.gif')
    },
    {
      value: 'LightWave',
      name: 'Light Wave',
      img: require('~/static/plasma_shock.gif')
    },
    {
      value: 'RadientStrike',
      name: 'Radient Strike',
      img: require('~/static/shining_burst.gif')
    },
    {
      value: 'HeartsGrace',
      name: "Heart's Grase",
      img: require('~/static/force_field.gif')
    },
    {
      value: 'SealingLight',
      name: 'Sealing Light',
      img: require('~/static/holylance.gif')
    }
  ]

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      calcCelestialStrikeDamage(this.buffedMA, this.selectedLightSkills.length, this.basePower)
    )
  }

  get resMA() {
    const needMA = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      SkillRatio.CelestialStrike(this.selectedLightSkills.length, this.basePower),
      this.buffedMA,
      25
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
