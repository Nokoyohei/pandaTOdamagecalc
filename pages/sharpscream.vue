<template>
  <v-container>
    <h1>Sharp Scream</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
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
import FarmingMonster from '~/components/FarmingMonster.vue'
import ApBuff from '~/components/APBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcSharpScreamDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, APBuffName, HVBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class SharpScream extends Vue {
  ap = 100000
  extraAP = 0
  hv = 10000
  extraHV = 0
  monster: Monster = isabelle

  APBuff: APBuffName[] = []
  HVBuff: HVBuffName[] = []

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

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      calcSharpScreamDamage(this.buffedAP, this.buffedHV)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.SharpScream,
      this.buffedAP + this.buffedHV * 16,
      0
    )
  }

  get resAP() {
    return Math.ceil(this.needStats / calcAPBuffRatio(this.APBuff))
  }

  get resHV() {
    const needHV = this.needStats / 16
    return Math.ceil(needHV / calcHVBuffRatio(this.HVBuff))
  }
}
</script>
