<template>
  <v-container>
    <h1>Scythe</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />

    <v-row>
      <v-col cols="12" md="6">
        <ma-buff :buff.sync="MABuff" />
        <dark-load-buff :buff.sync="DLBuff" />
      </v-col>
      <v-col cols="12" md="6">
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
  calcScytheDamage,
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
export default class Scythe extends Vue {
  ma = 13541
  extraMA = 0
  dark = 1295
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
    let darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(this.buffedMA)
      : 0
    let scytheDamage = calcScytheDamage(this.buffedMA, this.dark)
    if (this.DLBuff.includes('bloodTestament')) {
      darkCommandoDamage = Math.round(
        darkCommandoDamage * (1 + BloodTestamentBuff)
      )
      scytheDamage = Math.round(scytheDamage * (1 + BloodTestamentBuff))
    }

    return (
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        scytheDamage
      ) +
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        darkCommandoDamage
      )
    )
  }

  get resMA() {
    let attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.Scythe(this.dark) + SkillRatio.DarkCommando
      : SkillRatio.Scythe(this.dark)
    attackRatio = this.DLBuff.includes('bloodTestament')
      ? attackRatio * (1 + BloodTestamentBuff)
      : attackRatio
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const needMA = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      monsterDef,
      this.monster.darkR,
      attackRatio,
      this.buffedMA,
      constStats
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resDark() {
    let attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.Scythe(this.dark) + SkillRatio.DarkCommando
      : SkillRatio.Scythe(this.dark)
    attackRatio = this.DLBuff.includes('bloodTestament')
      ? attackRatio * (1 + BloodTestamentBuff)
      : attackRatio
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    return Math.ceil(
      (calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        monsterDef,
        this.monster.darkR,
        this.buffedMA - constStats,
        attackRatio,
        0
      ) *
        100) /
        30
    )
  }
}
</script>
