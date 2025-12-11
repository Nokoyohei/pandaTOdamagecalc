<template>
  <v-container>
    <h1>Deadly Fen</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
        <lk-buff :buff.sync="LKBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="740"
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
                :max="740"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraStats.ma"
          label="MA"
        />
        <stats-text-field
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
import MaBuff from '~/components/MABuff.vue'
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { torobbie} from '~/utils/monsters'
import {
  calcDeadlyFenDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcLKBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { Monster, MABuffName, LKBuffName, Status, Attributes } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class DeadlyFen extends Vue {
  monster: Monster = torobbie

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  MABuff: MABuffName[] = []
  LKBuff: LKBuffName[] = []
  basePower: number = BASE_POWER.DeadlyFen

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

  get buffedMA() {
    return (
      Math.floor(
        (this.stats.ma - this.extraStats.ma) * calcMABuffRatio(this.MABuff)
      ) + this.extraStats.ma
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
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      calcDeadlyFenDamage(this.buffedMA, this.buffedLK, this.basePower)
    )
  }

  get resStat() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      SkillRatio.DeadlyFen(this.basePower),
      this.buffedMA + this.buffedLK,
      25
    )
  }

  get resMA() {
    return Math.ceil(this.resStat / calcMABuffRatio(this.MABuff))
  }

  get resLK() {
    return Math.ceil(this.resStat / calcLKBuffRatio(this.LKBuff))
  }
}
</script>
