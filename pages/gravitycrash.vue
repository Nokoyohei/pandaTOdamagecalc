<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />

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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
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

import { Monster, MABuffName, DLBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    DarkLoadBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class GravityCrash extends Vue {
  ma = 10000
  extraMA = 0
  monster: Monster = isabelle

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
    let attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.GravityCrash + SkillRatio.DarkCommando
      : SkillRatio.GravityCrash
    attackRatio = this.DLBuff.includes('bloodTestament')
      ? attackRatio * (1 + BloodTestamentBuff)
      : attackRatio
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)

    const needMA = calcNeedStats(
      this.monster.hp,
      monsterDef,
      this.monster.darkR,
      attackRatio,
      this.buffedMA,
      constStats
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
