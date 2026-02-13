<template>
  <v-container>
    <h1>Scythe</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
        <dark-load-buff :buff.sync="DLBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Scythe Power
          </v-card-title>
          <v-slider
            v-model="scythePower"
            :min="0"
            :max="550"
            :step="0.5"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="scythePower"
                type="number"
                :min="0"
                :max="50"
                :step="0.5"
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
  calcScytheDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    DarkLoadBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class Scythe extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  scythePower: number = 45

  get damage() {
    const darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    const scytheDamage = calcScytheDamage(this.buffedMA, this.stats.dark, this.scythePower)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    return (
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        scytheDamage,
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
    const scytheRatio = SkillRatio.Scythe(this.stats.dark, this.scythePower)
    const attackRatio = this.DLBuff.includes('darkCommando')
      ? scytheRatio + SkillRatio.DarkCommando()
      : scytheRatio
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
    const scytheRatio = SkillRatio.Scythe(this.stats.dark, this.scythePower)
    const attackRatio = this.DLBuff.includes('darkCommando')
      ? scytheRatio + SkillRatio.DarkCommando()
      : scytheRatio
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
