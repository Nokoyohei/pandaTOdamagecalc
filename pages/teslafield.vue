<template>
  <v-container>
    <h1>Tesla Field</h1>
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
        <stats-text-field
          :input-stats.sync="stats.mp"
          :need-stats="resMP"
          :extra-stats.sync="extraStats.mp"
          label="MAX MP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { torobbie} from '~/utils/monsters'
import {
  calcTeslaFieldDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName, Status, Attributes } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class TeslaField extends Vue {
  monster: Monster = torobbie

  MABuff: MABuffName[] = []

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  beforeMount() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get buffedMA() {
    return (
      Math.floor(
        (this.stats.ma - this.extraStats.ma) * calcMABuffRatio(this.MABuff)
      ) + this.extraStats.ma
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.elecR,
      calcTeslaFieldDamage(this.buffedMA, this.stats.mp)
    )
  }

  get resStat() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.elecR,
      SkillRatio.TeslaField(),
      this.buffedMA + Math.floor(this.stats.mp / 120),
      0
    )
  }

  get resMA() {
    return Math.ceil(this.resStat / calcMABuffRatio(this.MABuff))
  }

  get resMP() {
    // Round to the nearest multiple of 120
    return (
      Math.ceil((this.resStat * 120 + this.stats.mp) / 120) * 120 -
      this.stats.mp
    )
  }
}
</script>
