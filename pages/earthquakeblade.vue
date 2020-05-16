<template>
  <v-container>
    <h1>Earthquake Blade</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="6">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraAP"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="soil"
          :need-stats="resSoil"
          label="Soil Attr"
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
  calcEarthquakeBladeDamage,
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
export default class EarthquakeBlade extends Vue {
  ap = 100000
  extraAP = 0
  soil = 1000
  monster: Monster = isabelle

  APBuff: APBuffName[] = []

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
      calcEarthquakeBladeDamage(this.buffedAP, this.soil)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'physical'),
      this.monster.physicalR,
      SkillRatio.EarthquakeBlade(this.soil),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resSoil() {
    return Math.ceil(
      calcNeedStats(
        this.monster.hp,
        calcMonsterDef(this.monster, 'physical'),
        this.monster.physicalR,
        this.buffedAP,
        SkillRatio.EarthquakeBlade(this.soil),
        0
      ) * 50
    )
  }
}
</script>
