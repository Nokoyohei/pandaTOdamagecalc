<template>
  <v-container>
    <h1>Magical Soul</h1>
    <boss-monster-panel :damage="damage" :monster.sync="monster" />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcMagicalSoulDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class MagicalSoul extends BaseSkillPage {
  get skillMode() { return 'boss' as const }

  get damage() {
    const magicalSoulDamage = calcMagicalSoulDamage(
      this.buffedAP,
      this.buffedMA
    )
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.noPropR,
      magicalSoulDamage
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.noPropR,
      this.buffedMA / 100,
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resMA() {
    const needMA =
      calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.monster, 'magic'),
        this.monster.noPropR,
        this.buffedAP,
        this.buffedMA / 100,
        0
      ) * 100

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>
