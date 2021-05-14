<template>
  <v-container>
    <h1>Champion's Blade</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraAP"
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
import { isabelle } from '~/utils/monsters'
import {
  calcChampionsBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { Monster, APBuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    StatsTextField
  }
})
export default class ChampionsBlade extends Vue {
  ap = 100000
  extraAP = 0
  fire = 1000
  monster: Monster = isabelle

  APBuff: APBuffName[] = []

  created() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.ap = stats?.ap ?? 10000
    this.fire = stats?.fire ?? 1000
    this.extraAP = stats?.extraAP ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.ap = this.ap
    stats.fire = this.fire
    stats.extraAP = this.extraAP
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      calcChampionsBladeDamage(this.buffedAP, this.fire)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.ChampionsBlade(this.fire),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resFire() {
    return Math.ceil(
      calcNeedStats(
        this.monster.hp,
        calcMonsterDef(this.monster, 'physical'),
        this.monster.physicalR,
        this.buffedAP,
        SkillRatio.ChampionsBlade(this.fire),
        0
      ) * 100
    )
  }
}
</script>
