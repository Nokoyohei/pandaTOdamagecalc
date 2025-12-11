<template>
  <v-container>
    <h1>Full House</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <lk-buff :buff.sync="LKBuff" />
        <hv-buff :buff.sync="HVBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1600"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="basePower"
                type="number"
                :min="0"
                :max="1600"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraStats.lk"
          label="LK"
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
import LkBuff from '~/components/LKBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { torobbie} from '~/utils/monsters'
import {
  calcFullHouseDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcAPBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

import {
  Monster,
  APBuffName,
  LKBuffName,
  HVBuffName,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    LkBuff,
    HvBuff,
    StatsTextField
  }
})
export default class FullHouse extends Vue {
  monster: Monster = torobbie

  APBuff: APBuffName[] = []
  LKBuff: LKBuffName[] = []
  HVBuff: HVBuffName[] = []
  basePower: number = BASE_POWER.FullHouse

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

  get buffedLK() {
    return (
      Math.floor(
        (this.stats.lk - this.extraStats.lk) * calcLKBuffRatio(this.LKBuff)
      ) + this.extraStats.lk
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
      calcFullHouseDamage(this.buffedAP, this.buffedLK, this.buffedHV, this.basePower)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.FullHouse(this.basePower),
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
