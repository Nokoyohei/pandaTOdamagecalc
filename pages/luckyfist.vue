<template>
  <v-container>
    <h1>Lucky Fist</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
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
            :max="880"
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
                :max="880"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcLuckyFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class LuckyFist extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.LuckyFist

  debuffSkillsDef = [
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
      calcLuckyFistDamage(this.monster.hp, this.buffedLK, this.basePower)
    )
  }

  get resLK() {
    const needLK = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.LuckyFist(this.basePower),
      this.monster.hp + this.buffedLK * 80,
      0
    )

    return Math.ceil(needLK / calcLKBuffRatio(this.LKBuff) / 80)
  }
}
</script>
