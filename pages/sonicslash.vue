<template>
  <v-container>
    <h1>Sonic Slash</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1400"
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
                :max="1400"
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
          :input-stats.sync="stats.water"
          :need-stats="resWater"
          label="Water Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcSonicSlashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { skillPanel } from '~/types'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class SonicSlash extends BaseSkillPage {
  get skillMode() { return 'dual' as const }
  basePower: number = BASE_POWER.SonicSlash

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcSonicSlashDamage(this.buffedAP, this.stats.water, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.SonicSlash(this.stats.water, this.basePower),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWater() {
    return Math.ceil(
      (calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.SonicSlash(this.stats.water, this.basePower),
        0
      ) *
        100) /
        3.5
    )
  }
}
</script>
