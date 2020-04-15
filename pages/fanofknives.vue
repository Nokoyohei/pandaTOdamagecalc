<template>
  <v-container>
    <h1>Full House</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
        <da-buff :buff.sync="DABuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="da"
          :need-stats="resDA"
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
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcFanOfKnicesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef
} from '~/utils/calc'
import { SixthSenseBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { Monster } from '~/types'

@Component({
  components: {
    FarmingMonster,
    DaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class FanOfKnives extends Vue {
  da = 10000
  throwAp = 20
  monster: Monster = isabelle

  DABuff: 'sixthSense'[] = []

  get buffedDA() {
    let buffedDA = this.da

    if (this.DABuff.includes('sixthSense')) buffedDA *= SixthSenseBuff
    return buffedDA
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      calcFanOfKnicesDamage(this.buffedDA, this.throwAp)
    )
  }

  get resAP() {
    let needDA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      SkillRatio.FanOfKnives,
      this.buffedDA + this.throwAp,
      0
    )
    if (this.DABuff.includes('sixthSense')) needDA /= SixthSenseBuff
    return Math.ceil(needDA)
  }
}
</script>
