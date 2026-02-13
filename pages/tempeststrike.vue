<template>
  <v-container>
    <h1>Tempest Strike</h1>
    <boss-monster-panel
      :damage="avgDamage"
      :damage-string="[
        `maximum:${maxDamage.toLocaleString()}`,
        `average:${avgDamage.toLocaleString()}`,
        `minimum:${minDamage.toLocaleString()}`
      ]"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
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
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="stats.wind"
          :need-stats="resWind"
          label="Wind Attr"
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
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcTempestStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class TempestStrike extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.TempestStrike

  debuffSkillsDef = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get maxDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTempestStrikeDamage(this.buffedAP, this.stats.wind, this.basePower)
    )
  }

  get minDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTempestStrikeDamage(this.buffedAP, 0, this.basePower)
    )
  }

  get avgDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTempestStrikeDamage(this.buffedAP, this.stats.wind / 2, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.TempestStrike(this.stats.wind / 2, this.basePower),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWind() {
    return Math.ceil(
      calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.TempestStrike(this.stats.wind / 2, this.basePower),
        0
      ) *
        ((100 / 5) * 2)
    )
  }
}
</script>
