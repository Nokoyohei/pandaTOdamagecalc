<template>
  <v-container>
    <h1>2 Hit Combo</h1>
    <boss-monster-panel
      :damage="fisrtHitDamage + secondHitDamage"
      :damage-string="[
        `1st hit: ${fisrtHitDamage.toLocaleString()}`,
        `2nd hit: ${secondHitDamage.toLocaleString()}`
      ]"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
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
            :max="1240"
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
                :max="1240"
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcFirstHitComboDamage,
  calcSecondHitComboDamage,
  calcDamage,
  calcMonsterDef
} from '~/utils/calc'
import { BASE_POWER } from '~/utils/skillRatio'
import { skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class HitCombo extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.HitCombo

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get fisrtHitDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcFirstHitComboDamage(this.buffedAP, this.basePower)
    )
  }

  get secondHitDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcSecondHitComboDamage(this.buffedAP, this.buffedHV, this.basePower)
    )
  }

  get resAP() {
    return 0
  }

  get resHV() {
    return 0
  }
}
</script>
