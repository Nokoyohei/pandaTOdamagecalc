<template>
  <v-container>
    <h1>Raging Storm</h1>
    <p>{{ cdamage }}</p>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraStats.ac"
          label="AC"
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
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import AcBuff from '~/components/ACBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcRagingStormDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcACBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName, ACBuffName, Status, Attributes } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    AcBuff,
    StatsTextField,
    DamageArea
  }
})
export default class RagingStorm extends Vue {
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []
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

  get buffedAC() {
    return (
      Math.floor(
        (this.stats.ac - this.extraStats.ac) * calcACBuffRatio(this.ACBuff)
      ) + this.extraStats.ac
    )
  }

  get cdamage() {
    return calcRagingStormDamage(this.buffedAC, this.buffedMA)
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      calcRagingStormDamage(this.buffedAC, this.buffedMA)
    )
  }

  needStat() {
    return calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.windR,
      SkillRatio.RasingStorm,
      this.buffedMA + this.buffedAC,
      49
    )
  }

  get resMA() {
    const needMA = this.needStat()

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resAC() {
    const needAC = this.needStat()

    return Math.ceil(needAC / calcACBuffRatio(this.ACBuff))
  }
}
</script>
