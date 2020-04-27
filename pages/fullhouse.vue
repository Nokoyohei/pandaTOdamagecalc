<template>
  <v-container>
    <h1>Full House</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
        <ap-buff :buff.sync="APBuff" />
        <lk-buff :buff.sync="LKBuff" />
        <hv-buff :buff.sync="HVBuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraAP"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraLK"
          label="LK"
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
import FarmingMonster from '~/components/FarmingMonster.vue'
import ApBuff from '~/components/APBuff.vue'
import LkBuff from '~/components/LKBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcFullHouseDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, APBuffName, LKBuffName, HVBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    LkBuff,
    HvBuff,
    StatsTextField,
    DamageArea
  }
})
export default class FullHouse extends Vue {
  ap = 100000
  extraAP = 0
  lk = 10000
  extraLK = 0
  hv = 10000
  extraHV = 0
  monster: Monster = isabelle

  APBuff: APBuffName[] = []
  LKBuff: LKBuffName[] = []
  HVBuff: HVBuffName[] = []

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedLK() {
    return (
      Math.floor((this.lk - this.extraLK) * calcLKBuffRatio(this.LKBuff)) +
      this.extraLK
    )
  }

  get buffedHV() {
    return (
      Math.floor((this.hv - this.extraHV) * calcHVBuffRatio(this.HVBuff)) +
      this.extraHV
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      calcFullHouseDamage(this.buffedAP, this.buffedLK, this.buffedHV)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      SkillRatio.FullHouse,
      this.buffedAP + (this.buffedLK + this.buffedHV) * 8,
      0
    )
  }

  get resAP() {
    return Math.ceil(this.needStats / calcAPBuffRatio(this.APBuff))
  }

  get resLK() {
    const needLK = this.needStats / 8
    return Math.ceil(needLK / calcLKBuffRatio(this.LKBuff))
  }

  get resHV() {
    const needHV = this.needStats / 8
    return Math.ceil(needHV / calcHVBuffRatio(this.HVBuff))
  }
}
</script>
