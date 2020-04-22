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
  calcMonsterDef
} from '~/utils/calc'
import { GunBoosterBuff, BullsEyeBuff, EagleEyeBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { Monster } from '~/types'

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
  gunAP = 12480
  monster: Monster = isabelle

  ACBuff: ('gunbooster' | 'bullseye' | 'eagleeye')[] = []

  get buffedAC() {
    let buffedAC = this.ac

    if (this.ACBuff.includes('gunbooster'))
      buffedAC += Math.floor(this.ac * GunBoosterBuff)
    if (this.ACBuff.includes('bullseye'))
      buffedAC += Math.floor(this.ac * BullsEyeBuff)
    if (this.ACBuff.includes('eagleeye'))
      buffedAC += Math.floor(this.ac * EagleEyeBuff)
    return buffedAC
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
    const needAC = this.needStats
    let buffRatio = 1
    if (this.ACBuff.includes('gunbooster')) buffRatio += GunBoosterBuff
    if (this.ACBuff.includes('bullseye')) buffRatio += BullsEyeBuff
    if (this.ACBuff.includes('eagleeye')) buffRatio += EagleEyeBuff
    return Math.ceil(needAC / buffRatio / 20)
  }

  get resGunAP() {
    const needGunAP = this.needStats
    return Math.ceil(needGunAP)
  }
}
</script>
