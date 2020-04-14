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
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="lk"
          :need-stats="resLK"
          label="LK"
        />
        <stats-text-field
          :input-stats.sync="hv"
          :need-stats="resHV"
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
  calcMonsterDef
} from '~/utils/calc'
import {
  PumpingHeartBuff,
  AdrenalineBuff,
  LuckySevenBuff,
  AuraOfLuckBuff,
  DodgeMasterBuff
} from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { Monster } from '~/types'

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
  ap = 244498
  lk = 36395
  hv = 68403
  monster: Monster = isabelle

  APBuff: ('pumpingHeart' | 'adrenaline')[] = []
  LKBuff: ('luckySeven' | 'auraOfLuck')[] = []
  HVBuff: 'dodgeMaster'[] = []

  get buffedAP() {
    let buffedAP = this.ap

    if (this.APBuff.includes('pumpingHeart')) buffedAP *= PumpingHeartBuff
    if (this.APBuff.includes('adrenaline')) buffedAP *= AdrenalineBuff
    return buffedAP
  }

  get buffedLK() {
    let buffedLK = this.lk

    if (this.LKBuff.includes('luckySeven')) buffedLK *= LuckySevenBuff
    if (this.LKBuff.includes('auraOfLuck')) buffedLK *= AuraOfLuckBuff
    return buffedLK
  }

  get buffedHV() {
    let buffedHV = this.hv

    if (this.HVBuff.includes('dodgeMaster')) buffedHV *= DodgeMasterBuff
    return buffedHV
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
    let needAP = this.needStats
    if (this.APBuff.includes('pumpingHeart')) needAP /= PumpingHeartBuff
    if (this.APBuff.includes('adrenaline')) needAP /= AdrenalineBuff
    return Math.ceil(needAP)
  }

  get resLK() {
    let needLK = this.needStats / 8
    if (this.LKBuff.includes('luckySeven')) needLK /= LuckySevenBuff
    if (this.LKBuff.includes('auraOfLuck')) needLK /= AuraOfLuckBuff
    return Math.ceil(needLK)
  }

  get resHV() {
    let needHV = this.needStats / 8
    if (this.HVBuff.includes('dodgeMaster')) needHV /= DodgeMasterBuff
    return Math.ceil(needHV)
  }
}
</script>
