<template>
  <v-container>
    <h1>Champion's Blade</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ap"
          :need-stats="resAP"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="fire"
          :need-stats="resFire"
          label="Fire Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import ApBuff from '~/components/APBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcChampionsBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef
} from '~/utils/calc'
import { PumpingHeartBuff, AdrenalineBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { Monster } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    StatsTextField,
    DamageArea
  }
})
export default class ChampionsBlade extends Vue {
  ap = 100000
  fire = 1000
  monster: Monster = isabelle

  APBuff: ('pumpingHeart' | 'adrenaline')[] = []

  get buffedAP() {
    let buffedAP = this.ap

    if (this.APBuff.includes('pumpingHeart')) buffedAP *= PumpingHeartBuff
    if (this.APBuff.includes('adrenaline')) buffedAP *= AdrenalineBuff
    return buffedAP
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      calcChampionsBladeDamage(this.buffedAP, this.fire)
    )
  }

  get resAP() {
    let needAP = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.phisicalR,
      SkillRatio.ChampionsBlade(this.fire),
      this.buffedAP + (this.fire * 2) / 100,
      0
    )
    if (this.APBuff.includes('pumpingHeart')) needAP /= PumpingHeartBuff
    if (this.APBuff.includes('adrenaline')) needAP /= AdrenalineBuff
    return Math.ceil(needAP)
  }

  get resFire() {
    return Math.ceil(
      calcNeedStats(
        this.monster.hp,
        calcMonsterDef(this.monster, 'physical'),
        this.monster.phisicalR,
        this.buffedAP + this.fire / 100,
        SkillRatio.ChampionsBlade(this.fire),
        0
      ) * 100
    )
  }
}
</script>
