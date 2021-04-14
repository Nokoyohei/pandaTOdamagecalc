<template>
  <v-container>
    <h1>Deadly Fen</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
        <lk-buff :buff.sync="LKBuff" />
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
          :input-stats.sync="lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraLK"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcDeadlyFenDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName, LKBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class DeadlyFen extends Vue {
  ma = 10000
  extraMA = 0
  lk = 1000
  extraLK = 0
  monster: Monster = isabelle

  MABuff: MABuffName[] = []
  LKBuff: LKBuffName[] = []

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get buffedLK() {
    return (
      Math.floor((this.lk - this.extraLK) * calcLKBuffRatio(this.LKBuff)) +
      this.extraLK
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      calcDeadlyFenDamage(this.buffedMA, this.buffedLK)
    )
  }

  get resStat() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.earthR,
      SkillRatio.DeadlyFen,
      this.buffedMA + this.buffedLK,
      25
    )
  }

  get resMA() {
    return Math.ceil(this.resStat / calcMABuffRatio(this.MABuff))
  }

  get resLK() {
    return Math.ceil(this.resStat / calcLKBuffRatio(this.LKBuff))
  }
}
</script>
