<template>
  <v-container>
    <p>{{ cdamage }}</p>
    <h1>Celestial Strike</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />
    <v-row>
      <v-col cols="12" md="6">
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraMA"
          label="MA"
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
import { isabelle } from '~/utils/monsters'
import {
  calcCelestialStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, MABuffName } from '~/types'

@Component({
  components: {
    FarmingMonster,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class CelestialStrike extends Vue {
  ma = 10000
  extraMA = 0
  monster: Monster = isabelle

  MABuff: MABuffName[] = []

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      calcCelestialStrikeDamage(this.buffedMA)
    )
  }

  get resMA() {
    const needMA = calcNeedStats(
      this.monster.hp,
      calcMonsterDef(this.monster, 'magic'),
      this.monster.lightR,
      SkillRatio.CelestialStrike,
      this.buffedMA,
      25
    )

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }
}
</script>