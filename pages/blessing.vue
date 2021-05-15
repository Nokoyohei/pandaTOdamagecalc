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
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import LkBuff from '~/components/LKBuff.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcBlessingDamage,
  calcDamage,
  calcMonsterDef,
  calcLKBuffRatio,
  calcACBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import {
  Monster,
  ACBuffName,
  LKBuffName,
  Skill,
  Status,
  Attributes
} from '~/types'
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
export default class Blessing extends Vue {
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []
  LKBuff: LKBuffName[] = []
  selectedBlessingSkills: number[] = []

  BlessingSkills: Skill[] = [
    {
      value: 0,
      name: "Salamander's Blessing",
      attr: 'fireR',
      ratio: skillRatio.FireBlessing,
      img: require('~/static/salamanderBlessing.gif')
    },
    {
      value: 1,
      name: "Raion's Blessing",
      attr: 'elecR',
      ratio: skillRatio.ElecBlessing,
      img: require('~/static/raionBlessing.gif')
    },
    {
      value: 2,
      name: "Gnome's Blessing",
      attr: 'earthR',
      ratio: skillRatio.EarthBlessing,
      img: require('~/static/gnomeBlessing.gif')
    },
    {
      value: 3,
      name: "Undine's Blessing",
      attr: 'waterR',
      ratio: skillRatio.WaterBlessing,
      img: require('~/static/undineBlessing.gif')
    },
    {
      value: 4,
      name: "Sylph's Blessing",
      attr: 'windR',
      ratio: skillRatio.WindBlessing,
      img: require('~/static/sylphBlessing.gif')
    }
  ]

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  beforeMount() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get buffedAC() {
    return (
      Math.floor(
        (this.stats.ac - this.extraStats.ac) * calcACBuffRatio(this.ACBuff)
      ) + this.extraStats.ac
    )
  }

  get buffedLK() {
    return (
      Math.floor(
        (this.stats.lk - this.extraStats.lk) * calcLKBuffRatio(this.LKBuff)
      ) + this.extraStats.lk
    )
  }

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
