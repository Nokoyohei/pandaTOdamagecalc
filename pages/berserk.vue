<template>
  <v-container>
    <h1>Berserk</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
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
          :input-stats.sync="gunAP"
          :need-stats="0"
          label="GunAP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcBerserkDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, ACBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    AcBuff,
    StatsTextField
  }
})
export default class ShootingSpree extends Vue {
  ac = 10000
  extraAC = 0
  gunAP = 32000
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []

  created() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.ac = stats?.ac ?? 10000
    this.gunAP = stats?.gunAP ?? 32000
    this.extraAC = stats?.extraAC ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.ac = this.ac
    stats.gunAP = this.gunAP
    stats.extraAC = this.extraAC
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get buffedAC() {
    return (
      Math.floor((this.ac - this.extraAC) * calcACBuffRatio(this.ACBuff)) +
      this.extraAC
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'gun'),
      this.monster.gunR,
      calcBerserkDamage(this.buffedAC * 20 + this.gunAP)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'gun'),
      this.monster.gunR,
      SkillRatio.Berserk,
      this.buffedAC * 20 + this.gunAP,
      48 * 20
    )
  }

  get resAC() {
    return Math.ceil(this.needStats / calcACBuffRatio(this.ACBuff) / 20)
  }

  get resGunAP() {
    return this.needStats
  }
}
</script>
