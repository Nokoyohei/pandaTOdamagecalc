<template>
  <v-container>
    <h1>Blessings</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
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
        <ac-buff :buff.sync="ACBuff" />
        <lk-buff :buff.sync="LKBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraStats.ac"
          label="AC"
        /><stats-text-field
          :input-stats.sync="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraStats.lk"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import LkBuff from '~/components/LKBuff.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcBlessingDamage,
  calcDamage,
  calcMonsterDef
} from '~/utils/calc'
import { Skill } from '~/types'
import skillRatio from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    LkBuff,
    AcBuff,
    StatsTextField,
    DamageArea
  }
})
export default class Blessing extends BaseSkillPage {
  selectedBlessingSkills: number[] = []

  BlessingSkills: Skill[] = [
    {
      value: 0,
      name: "Salamander's Blessing",
      attr: 'fireR',
      ratio: skillRatio.FireBlessing(),
      img: require('~/static/salamanderBlessing.gif')
    },
    {
      value: 1,
      name: "Raion's Blessing",
      attr: 'elecR',
      ratio: skillRatio.ElecBlessing(),
      img: require('~/static/raionBlessing.gif')
    },
    {
      value: 2,
      name: "Gnome's Blessing",
      attr: 'earthR',
      ratio: skillRatio.EarthBlessing(),
      img: require('~/static/gnomeBlessing.gif')
    },
    {
      value: 3,
      name: "Undine's Blessing",
      attr: 'waterR',
      ratio: skillRatio.WaterBlessing(),
      img: require('~/static/undineBlessing.gif')
    },
    {
      value: 4,
      name: "Sylph's Blessing",
      attr: 'windR',
      ratio: skillRatio.WindBlessing(),
      img: require('~/static/sylphBlessing.gif')
    }
  ]

  get damage() {
    let damage = 0
    this.selectedBlessingSkills.forEach((e: number) => {
      damage += calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster[this.BlessingSkills[e].attr],
        calcBlessingDamage(
          this.buffedAC,
          this.buffedLK,
          this.BlessingSkills[e].ratio
        )
      )
    })
    return damage
  }
}
</script>
