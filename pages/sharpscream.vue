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
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="stats.hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          :extra-stats.sync="extraStats.hv"
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
  calcAPBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, APBuffName, HVBuffName, Status, Attributes } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class SharpScream extends Vue {
  monster: Monster = isabelle

  APBuff: APBuffName[] = []
  HVBuff: HVBuffName[] = []

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

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get buffedHV() {
    return (
      Math.floor(
        (this.stats.hv - this.extraStats.hv) * calcHVBuffRatio(this.HVBuff)
      ) + this.extraStats.hv
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
