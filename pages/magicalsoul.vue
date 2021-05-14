<template>
  <v-container>
    <h1>Magical Soul</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <ma-buff :buff.sync="MABuff" />
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcMagicalSoulDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'

import { BossMonster, APBuffName, MABuffName } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class MagicalSoul extends Vue {
  ma = 10000
  extraMA = 0
  ap = 100000
  extraAP = 0
  monster: BossMonster = requiem

  MABuff: MABuffName[] = []
  APBuff: APBuffName[] = []

  created() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.ap = stats?.ap ?? 10000
    this.ma = stats?.ma ?? 10000
    this.extraAP = stats?.extraAP ?? 0
    this.extraMA = stats?.extraMA ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.ap = this.ap
    stats.ma = this.ma
    stats.extraAP = this.extraAP
    stats.extraMA = this.extraMA
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get damage() {
    const magicalSoulDamage = calcMagicalSoulDamage(
      this.buffedAP,
      this.buffedMA
    )
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.noPropR,
      magicalSoulDamage
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.noPropR,
      this.buffedMA / 100,
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resMA() {
    const needMA =
      calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        calcMonsterDef(this.monster, 'magic'),
        this.monster.noPropR,
        this.buffedAP,
        this.buffedMA / 100,
        0
      ) * 100

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
