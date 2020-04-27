<template>
  <v-container>
    <h1>Shooting Spree</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
        <ac-buff :buff.sync="ACBuff" />
      </v-col>
      <v-col cols="12" md="6">
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
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcShootingSpreeDamage,
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
    StatsTextField,
    DamageArea
  }
})
export default class ShootingSpree extends Vue {
  ac = 1092
  extraAC = 0
  gunAP = 12480
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []

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
      calcShootingSpreeDamage(this.buffedAC * 20 + this.gunAP)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'gun'),
      this.monster.gunR,
      SkillRatio.ShootingSpree,
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
