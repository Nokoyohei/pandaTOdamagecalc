<template>
  <v-container>
    <h1>Celestial Strike</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
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
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraMA"
          label="MA"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcCelestialStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName, LightSkillName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class CelestialStrike extends Vue {
  ma = 10000
  extraMA = 0
  monster: Monster = isabelle

  MABuff: MABuffName[] = []
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

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      calcCelestialStrikeDamage(this.buffedMA, this.selectedLightSkills.length)
    )
  }

  get resMA() {
    const needMA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      SkillRatio.CelestialStrike(this.selectedLightSkills.length),
      this.buffedMA,
      25
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
