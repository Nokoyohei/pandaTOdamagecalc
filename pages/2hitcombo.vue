<template>
  <v-container>
    <h1>2 Hit Combo</h1>
    <boss-monster-panel
      :damage="fisrtHitDamage + secondHitDamage"
      :damage-string="[
        `1st hit: ${fisrtHitDamage.toLocaleString()}`,
        `2nd hit: ${secondHitDamage.toLocaleString()}`
      ]"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <hv-buff :buff.sync="HVBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraAP"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          :extra-stats.sync="extraHV"
          label="HV"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { requiem } from '~/utils/monsters'
import {
  calcFirstHitComboDamage,
  calcSecondHitComboDamage,
  calcDamage,
  calcMonsterDef,
  calcAPBuffRatio,
  calcHVBuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import {
  BossMonster,
  APBuffName,
  HVBuffName,
  DebuffName,
  skillPanel
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class TempestStrike extends Vue {
  ap = 100000
  extraAP = 0
  hv = 10000
  extraHV = 0
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  HVBuff: HVBuffName[] = []
  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  beforeMount() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.ap = stats?.ap ?? 100000
    this.hv = stats?.hv ?? 10000
    this.extraAP = stats?.extraAP ?? 0
    this.extraHV = stats?.extraHV ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.ap = this.ap
    stats.hv = this.hv
    stats.extraAP = this.extraAP
    stats.extraHV = this.extraHV
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedHV() {
    return (
      Math.floor((this.hv - this.extraHV) * calcHVBuffRatio(this.HVBuff)) +
      this.extraHV
    )
  }

  get fisrtHitDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcFirstHitComboDamage(this.buffedAP)
    )
  }

  get secondHitDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcSecondHitComboDamage(this.buffedAP, this.buffedHV)
    )
  }

  get resAP() {
    return 0
  }

  get resHV() {
    return 0
  }
}
</script>
