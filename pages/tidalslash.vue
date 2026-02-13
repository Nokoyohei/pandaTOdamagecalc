<template>
  <v-container>
    <h1>Tidal Slash</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
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
          :input-stats.sync="stats.water"
          :need-stats="resWater"
          label="Water Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import FarmingMonster from '~/components/FarmingMonster.vue'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import {
  calcTidalSlashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class TidalSlash extends BaseSkillPage {
  get skillMode() { return 'dual' as const }

  debuffSkillsDef = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTidalSlashDamage(this.buffedAP, this.stats.water)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.TidalSlash(this.stats.water),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWater() {
    return Math.ceil(
      (calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.TidalSlash(this.stats.water),
        0
      ) *
        100) /
        2.5
    )
  }
}
</script>
