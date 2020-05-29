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
        <stats-text-field
          :input-stats.sync="ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraMA"
          label="MA"
        />
        <stats-text-field
          :input-stats.sync="dark"
          :need-stats="resDark"
          label="DARK attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcDarkCommandoDamage,
  calcStaffOfAgony,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { BossMonster, MABuffName, DLBuffName } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    DarkLoadBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class StaffOfAgony extends Vue {
  ma = 10000
  extraMA = 0
  dark = 1000
  monster: BossMonster = requiem

  MABuff: MABuffName[] = []
  DLBuff: DLBuffName[] = []

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get damage() {
    const darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    const staffOfAgonyDamage = calcStaffOfAgony(this.buffedMA, this.dark)

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
      ? SkillRatio.StaffOfAgony(this.dark) + SkillRatio.DarkCommando
      : SkillRatio.StaffOfAgony(this.dark)
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    const needMA = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
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
      ? SkillRatio.StaffOfAgony(this.dark) + SkillRatio.DarkCommando
      : SkillRatio.StaffOfAgony(this.dark)
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const buff = this.DLBuff.includes('bloodTestament')
      ? 1 + BloodTestamentBuff
      : 1

    return Math.ceil(
      (calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
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
