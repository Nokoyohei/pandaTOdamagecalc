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
      <v-col cols="12" md="6">
        <ap-buff :buff.sync="APBuff" />
        <ma-buff :buff.sync="MABuff" />
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
          :input-stats.sync="ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          :extra-stats.sync="extraMA"
          label="MA"
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
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcFlamingFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcMABuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import {
  BossMonster,
  APBuffName,
  MABuffName,
  DebuffName,
  skillPanel
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class ChampionsBlade extends Vue {
  ap = 143939
  extraAP = 0
  ma = 44998
  extraMA = 0
  fire = 522
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  MABuff: MABuffName[] = []

  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'RaionsSpace',
      name: "Raion's space",
      img: require('~/static/thunderarea.gif')
    }
  ]

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedMA() {
    return (
      Math.floor((this.ma - this.extraMA) * calcMABuffRatio(this.MABuff)) +
      this.extraMA
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'magic'),
      this.debuffedMonster.fireR,
      calcFlamingFistDamage(this.buffedAP, this.fire, this.buffedMA)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'magic'),
      this.debuffedMonster.fireR,
      (SkillRatio.FlamingFist(this.fire) * this.buffedMA) / 100,
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resMA() {
    const needMA =
      calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        calcMonsterDef(this.debuffedMonster, 'magic'),
        this.debuffedMonster.fireR,
        SkillRatio.FlamingFist(this.fire) * this.buffedAP,
        this.buffedMA / 100,
        0
      ) * 100

    return Math.ceil(needMA / calcMABuffRatio(this.MABuff))
  }

  get resFire() {
    return Math.ceil(
      calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        calcMonsterDef(this.debuffedMonster, 'magic'),
        this.debuffedMonster.fireR,
        (this.buffedAP * this.buffedMA) / 100,
        SkillRatio.FlamingFist(this.fire),
        0
      ) * 100
    )
  }
}
</script>
