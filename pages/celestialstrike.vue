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
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { isabelle, requiem } from '~/utils/monsters'
import {
  calcCelestialStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import {
  Monster,
  BossMonster,
  MABuffName,
  LightSkillName,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    MaBuff,
    StatsTextField
  }
})
export default class CelestialStrike extends Vue {
  mode = 'farming'
  monster: Monster | BossMonster = isabelle

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

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  beforeMount() {
    this.mode = this.$route.query.mode === 'boss' ? 'boss' : 'farming'
    if (this.mode === 'boss') {
      this.monster = requiem
    }

    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get monsterHP() {
    return this.mode === 'boss'
      ? (this.monster as BossMonster).gaugeNum * this.monster.hp
      : this.monster.hp
  }

  get buffedMA() {
    return (
      Math.floor(
        (this.stats.ma - this.extraStats.ma) * calcMABuffRatio(this.MABuff)
      ) + this.extraStats.ma
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
      this.monsterHP,
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
