<template>
  <v-container>
    <h1>Flaming Fist</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <ma-buff :buff.sync="MABuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1140"
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
                :max="1140"
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
          :input-stats.sync="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraStats.ma"
          label="MA"
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
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcFlamingFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class FlamingFist extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.FlamingFist

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'RaionsSpace',
      name: "Raion's space",
      img: require('~/static/thunderarea.gif')
    }
  ]

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'magic'),
      this.debuffedMonster.fireR,
      calcFlamingFistDamage(this.buffedAP, this.stats.fire, this.buffedMA, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'magic'),
      this.debuffedMonster.fireR,
      (SkillRatio.FlamingFist(this.stats.fire, this.basePower) * this.buffedMA) / 100,
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resMA() {
    const needMA =
      calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'magic'),
        this.debuffedMonster.fireR,
        SkillRatio.FlamingFist(this.stats.fire, this.basePower) * this.buffedAP,
        this.buffedMA / 100,
        0
      ) * 100

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resFire() {
    return Math.ceil(
      calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'magic'),
        this.debuffedMonster.fireR,
        (this.buffedAP * this.buffedMA) / 100,
        SkillRatio.FlamingFist(this.stats.fire, this.basePower),
        0
      ) * 100
    )
  }
}
</script>
