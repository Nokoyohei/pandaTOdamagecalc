<template>
  <v-container>
    <h1>Power Shot</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
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
            :max="5000"
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
                :max="600"
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcPowerShotDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    AcBuff,
    StatsTextField
  }
})
export default class PowerShot extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.PowerShot

  debuffSkillsDef = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'gun'),
      this.debuffedMonster.gunR,
      calcPowerShotDamage(this.buffedAC * 20 + this.stats.gunAP, this.basePower)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.monster, 'gun'),
      this.debuffedMonster.gunR,
      SkillRatio.PowerShot(this.basePower),
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
