<template>
  <v-container>
    <h1>Tornado Blast</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraStats.ma"
          label="MA"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcTornadoBlastDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class TornadoBlast extends BaseSkillPage {
  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      calcTornadoBlastDamage(this.buffedMA)
    )
  }

  get resMA() {
    const needMA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      SkillRatio.TornadoBlast(),
      this.buffedMA,
      49
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
