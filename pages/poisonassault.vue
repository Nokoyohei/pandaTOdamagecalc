<template>
  <v-container>
    <h1>Poison Assault (Only Poison Damage)</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <da-buff :buff.sync="DABuff" />
        <throw-buff :buff.sync="ThrowBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraDA"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="throwAp"
          :need-stats="0"
          label="Throw AP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DaBuff from '~/components/DABuff.vue'
import ThrowBuff from '~/components/ThrowBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcPoisonDamage,
  calcDABuffRatio,
  calcThrowBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { BossMonster, DABuffName, ThrowBuffName } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    DaBuff,
    ThrowBuff,
    StatsTextField,
    DamageArea
  }
})
export default class PoisonAssault extends Vue {
  da = 10000
  throwAp = 60
  extraDA = 0
  monster: BossMonster = requiem

  DABuff: DABuffName[] = []
  ThrowBuff: ThrowBuffName[] = []

  get buffedDA() {
    return (
      Math.floor((this.da - this.extraDA) * calcDABuffRatio(this.DABuff)) +
      this.extraDA
    )
  }

  get poison() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP)
  }

  get buffedThrowAP() {
    return this.throwAp * calcThrowBuffRatio(this.ThrowBuff)
  }

  get damage() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP) * 20
  }

  get resDA() {
    const needDA =
      (this.monster.hp * this.monster.gaugeNum) /
        (SkillRatio.PoisonAssault * 0.312 * 20) -
      (this.buffedDA * 16 + this.buffedThrowAP)

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff) / 16)
  }
}
</script>
