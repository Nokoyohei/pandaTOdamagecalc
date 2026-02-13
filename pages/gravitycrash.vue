<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />

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
            :max="1800"
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
                :max="1800"
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcDarkCommandoDamage,
  calcGravityCrashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    DarkLoadBuff,
    MaBuff,
    StatsTextField
  }
})
export default class GravityCrash extends BaseSkillPage {
  get skillMode() { return 'dual' as const }
  basePower: number = BASE_POWER.GravityCrash

  get damage() {
    let darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    let gravityCrashDamage = calcGravityCrashDamage(this.buffedMA, this.basePower)
    if (this.DLBuff.includes('bloodTestament')) {
      darkCommandoDamage = Math.round(
        darkCommandoDamage * (1 + BloodTestamentBuff)
      )
      gravityCrashDamage = Math.round(
        gravityCrashDamage * (1 + BloodTestamentBuff)
      )
    }

    return (
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        gravityCrashDamage
      ) +
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        darkCommandoDamage
      )
    )
  }

  get resMA() {
    const attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.GravityCrash(this.basePower) + SkillRatio.DarkCommando()
      : SkillRatio.GravityCrash(this.basePower)
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
}
</script>
