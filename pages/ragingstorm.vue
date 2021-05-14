<template>
  <v-container>
    <h1>Raging Storm</h1>
    <p>{{ cdamage }}</p>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraAC"
          label="AC"
        />
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
import AcBuff from '~/components/ACBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcRagingStormDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName, ACBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    AcBuff,
    StatsTextField,
    DamageArea
  }
})
export default class RagingStorm extends Vue {
  ac = 10000
  ma = 10000
  extraMA = 0
  extraAC = 0
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []
  MABuff: MABuffName[] = []

  created() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.ma = stats?.ma ?? 10000
    this.extraMA = stats?.extraMA ?? 0
    this.ac = stats?.ac ?? 10000
    this.extraAC = stats?.extraAC ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.ma = this.ma
    stats.extraMA = this.extraMA
    stats.ac = this.ac
    stats.extraAC = this.extraAC
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get buffedAC() {
    return (
      Math.floor((this.ac - this.extraAC) * calcACBuffRatio(this.ACBuff)) +
      this.extraAC
    )
  }

  get cdamage() {
    return calcRagingStormDamage(this.buffedAC, this.buffedMA)
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      calcRagingStormDamage(this.buffedAC, this.buffedMA)
    )
  }

  needStat() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      SkillRatio.RasingStorm,
      this.buffedMA + this.buffedAC,
      49
    )
  }

  get resMA() {
    const needMA = this.needStat()

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resAC() {
    const needAC = this.needStat()

    return Math.ceil(needAC / calcACBuffRatio(this.ACBuff))
  }
}
</script>
