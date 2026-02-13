<template>
  <v-container>
    <h1>Staff of Agony</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
        <dark-load-buff :buff.sync="DLBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="130"
            :step="1"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="basePower"
                type="number"
                :min="0"
                :max="130"
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
        <stats-text-field
          :input-stats.sync="stats.dark"
          :need-stats="resDark"
          label="DARK attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcDarkCommandoDamage,
  calcStaffOfAgony,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    DarkLoadBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class StaffOfAgony extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.StaffOfAgony

  get damage() {
    const darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    const staffOfAgonyDamage = calcStaffOfAgony(this.buffedMA, this.stats.dark, this.basePower)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    return (
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        staffOfAgonyDamage,
        buff
      ) +
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        darkCommandoDamage,
        buff
      )
    )
  }

  get resMA() {
    const attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.StaffOfAgony(this.stats.dark, this.basePower) + SkillRatio.DarkCommando()
      : SkillRatio.StaffOfAgony(this.stats.dark, this.basePower)
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    const needMA = calcNeedStats(
      this.monsterHP,
      monsterDef,
      this.monster.darkR,
      attackRatio,
      this.buffedMA,
      constStats,
      buff
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resDark() {
    const attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.StaffOfAgony(this.stats.dark, this.basePower) + SkillRatio.DarkCommando()
      : SkillRatio.StaffOfAgony(this.stats.dark, this.basePower)
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    return Math.ceil(
      (calcNeedStats(
        this.monsterHP,
        monsterDef,
        this.monster.darkR,
        this.buffedMA - constStats,
        attackRatio,
        0,
        buff
      ) *
        100) /
        30
    )
  }
}
</script>
