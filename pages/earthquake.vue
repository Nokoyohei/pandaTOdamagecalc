<template>
  <v-container>
    <h1>Earthquake</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="990"
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
                :max="990"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcEarthquakeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class Earthquake extends BaseSkillPage {
  basePower: number = BASE_POWER.Earthquake

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      calcEarthquakeDamage(this.buffedMA, this.basePower)
    )
  }

  get resMA() {
    const needMA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      SkillRatio.Earthquake(this.basePower),
      this.buffedMA,
      25
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
