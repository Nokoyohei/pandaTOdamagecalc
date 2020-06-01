<template>
  <v-container>
    <h1>Fan of Knives</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
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
import FarmingMonster from '~/components/FarmingMonster.vue'
import DaBuff from '~/components/DABuff.vue'
import ThrowBuff from '~/components/ThrowBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcFanOfKnicesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcThrowBuffRatio,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, DABuffName, ThrowBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    DaBuff,
    ThrowBuff,
    StatsTextField
  }
})
export default class FanOfKnives extends Vue {
  da = 10000
  extraDA = 0
  throwAp = 20
  monster: Monster = isabelle

  DABuff: DABuffName[] = []
  ThrowBuff: ThrowBuffName[] = []

  get buffedDA() {
    return (
      Math.floor((this.da - this.extraDA) * calcDABuffRatio(this.DABuff)) +
      this.extraDA
    )
  }

  get buffedThrowAP() {
    return this.throwAp * calcThrowBuffRatio(this.ThrowBuff)
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      calcFanOfKnicesDamage(this.buffedDA, this.buffedThrowAP)
    )
  }

  get resDA() {
    const needDA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.FanOfKnives,
      this.buffedDA + this.buffedThrowAP / 10,
      0
    )

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff))
  }
}
</script>
