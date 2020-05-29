<template>
  <v-container>
    <h1>Gale Strike</h1>
    <boss-monster-panel
      :damage="avgDamage"
      :damage-string="[
        `maximum:${maxDamage.toLocaleString()}`,
        `average:${avgDamage.toLocaleString()}`,
        `minimum:${minDamage.toLocaleString()}`
      ]"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
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
          :input-stats.sync="wind"
          :need-stats="resWind"
          label="Wind Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { requiem } from '~/utils/monsters'
import {
  calcGaleStrikeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { BossMonster, APBuffName, DebuffName, skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class GaleStrike extends Vue {
  ap = 100000
  extraAP = 0
  wind = 1000
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
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

  get maxDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, this.wind)
    )
  }

  get minDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, 0)
    )
  }

  get avgDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, this.wind / 2)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.GaleStrike(this.wind),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWind() {
    return Math.ceil(
      calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.GaleStrike(this.wind / 2),
        0
      ) *
        ((100 / 7) * 2)
    )
  }
}
</script>
