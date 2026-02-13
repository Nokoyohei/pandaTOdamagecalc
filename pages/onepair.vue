<template>
  <v-container>
    <h1>One Pair</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <hv-buff :buff.sync="HVBuff" />
        <v-switch v-model="buff" value="ladyluck">
          <template #label>
            <img src="~/static/ladyluck.gif" />
            LadyLuck
          </template>
        </v-switch>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1380"
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
                :max="1380"
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
  calcOnePairDamage,
  calcDamage,
  calcMonsterDef,
  calcNeedStats,
  calcAPBuffRatio,
  calcHVBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class OnePair extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.OnePair
  buff: 'ladyluck' | null = null

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get isLadyLuck() {
    return this.buff?.includes('ladyluck')
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcOnePairDamage(this.buffedAP, this.buffedHV, this.isLadyLuck, this.basePower)
    )
  }

  resStats() {
    const multiplier = this.isLadyLuck ? 1 + SkillRatio.LadyLuck() : 1
    return calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.OnePair(this.basePower) * multiplier,
      this.buffedAP + this.buffedHV * 8,
      0
    )
  }

  get resAP() {
    return Math.ceil(this.resStats())
  }

  get resHV() {
    return Math.ceil(this.resStats() / 8)
  }
}
</script>
