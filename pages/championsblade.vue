<template>
  <v-container>
    <h1>Champion's Blade</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="980"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="basePower"
                type="number"
                :min="0"
                :max="980"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="stats.fire"
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
import { torobbie} from '~/utils/monsters'
import {
  calcChampionsBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

import { Monster, APBuffName, Status, Attributes } from '~/types'

@Component({
  components: {
    FarmingMonster,
    ApBuff,
    StatsTextField
  }
})
export default class ChampionsBlade extends Vue {
  monster: Monster = torobbie

  APBuff: APBuffName[] = []
  basePower: number = BASE_POWER.ChampionsBlade

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

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      calcChampionsBladeDamage(this.buffedAP, this.stats.fire, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.ChampionsBlade(this.stats.fire, this.basePower),
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
        SkillRatio.ChampionsBlade(this.stats.fire, this.basePower),
        0
      ) * 100
    )
  }
}
</script>
