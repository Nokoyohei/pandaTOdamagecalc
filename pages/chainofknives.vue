<template>
  <v-container>
    <h1>Chain of Knives</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <da-buff :buff.sync="DABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1260"
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
                :max="1260"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraStats.da"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="stats.throwAP"
          :need-stats="0"
          label="Throw AP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DaBuff from '~/components/DABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcChainOfKnivesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    DaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class ChainOfKnives extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.ChainOfKnives

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get damage() {
    const chainOfKnivesDamage = calcChainOfKnivesDamage(
      this.buffedDA,
      this.stats.throwAP,
      this.basePower
    )
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      chainOfKnivesDamage
    )
  }

  get resDA() {
    const needDA = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.ChainOfKnives(this.basePower),
      this.buffedDA * 16 + this.stats.throwAP * 6,
      0
    )

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff) / 16)
  }
}
</script>
