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
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="12"
            :step="0.1"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="basePower"
                type="number"
                :min="0"
                :max="1020"
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
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import ApBuff from '~/components/APBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcSharpScreamDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class SharpScream extends BaseSkillPage {
  basePower: number = BASE_POWER.SharpScream

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      calcSharpScreamDamage(this.buffedAP, this.buffedHV, this.basePower)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.SharpScream(this.basePower),
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
