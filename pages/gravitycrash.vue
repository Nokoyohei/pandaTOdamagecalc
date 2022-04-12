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
import { Component, Vue } from 'nuxt-property-decorator'
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
import SkillRatio from '~/utils/skillRatio'

import Test from '~/mixins/MainPanel'

import { MABuffName, DLBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    DarkLoadBuff,
    MaBuff,
    StatsTextField
  },
  mixins: [Test]
})
export default class GravityCrash extends Vue {
  ma = 10000
  extraMA = 0
  MABuff: MABuffName[] = []
  DLBuff: DLBuffName[] = []

  get buffedMA() {
    return (
      Math.floor(
        (this.stats.ma - this.extraStats.ma) * calcMABuffRatio(this.MABuff)
      ) + this.extraStats.ma
    )
  }

  get damage() {
    let darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    let gravityCrashDamage = calcGravityCrashDamage(this.buffedMA)
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
      ? SkillRatio.GravityCrash + SkillRatio.DarkCommando
      : SkillRatio.GravityCrash
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
