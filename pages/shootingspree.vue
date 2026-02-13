<template>
  <v-container>
    <h1>Shooting Spree</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="480"
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
                :max="480"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraStats.ac"
          label="AC"
        />
        <stats-text-field
          :input-stats.sync="stats.gunAP"
          :need-stats="0"
          label="GunAP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcShootingSpreeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    AcBuff,
    StatsTextField
  }
})
export default class ShootingSpree extends BaseSkillPage {
  basePower: number = BASE_POWER.ShootingSpree

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'gun'),
      this.monster.gunR,
      calcShootingSpreeDamage(this.buffedAC * 20 + this.stats.gunAP, this.basePower)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'gun'),
      this.monster.gunR,
      SkillRatio.ShootingSpree(this.basePower),
      this.buffedAC * 20 + this.stats.gunAP,
      48 * 20
    )
  }

  get resAC() {
    return Math.ceil(this.needStats / calcACBuffRatio(this.ACBuff) / 20)
  }

  get resGunAP() {
    return this.needStats
  }
}
</script>
