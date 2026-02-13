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
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcDeadlyFenDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class DeadlyFen extends BaseSkillPage {
  basePower: number = BASE_POWER.DeadlyFen

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
