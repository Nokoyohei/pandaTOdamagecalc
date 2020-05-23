<template>
  <v-container>
    <h1>Sudden Attack</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />

    <v-row>
      <v-col cols="12" md="6">
        <ap-buff :buff.sync="APBuff" />
        <da-buff :buff.sync="DABuff" />
        <lk-buff :buff.sync="LKBuff" />
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
          :input-stats.sync="da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraDA"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraLK"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import DaBuff from '~/components/DABuff.vue'
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcSuddenAttackDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio,
  calcAPBuffRatio,
  calcLKBuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import {
  BossMonster,
  APBuffName,
  DABuffName,
  LKBuffName,
  DebuffName,
  skillPanel
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    DaBuff,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class SuddenAttack extends Vue {
  ap = 100000
  da = 10000
  lk = 10000
  extraAP = 0
  extraDA = 0
  extraLK = 0
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  DABuff: DABuffName[] = []
  LKBuff: LKBuffName[] = []
  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedDA() {
    return (
      Math.floor((this.da - this.extraDA) * calcDABuffRatio(this.DABuff)) +
      this.extraDA
    )
  }

  get buffedLK() {
    return (
      Math.floor((this.lk - this.extraLK) * calcLKBuffRatio(this.LKBuff)) +
      this.extraLK
    )
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get damage() {
    const suddenAttackDamage = calcSuddenAttackDamage(
      this.buffedAP,
      this.buffedDA,
      this.buffedLK
    )
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      suddenAttackDamage
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.SuddenAttack,
      this.buffedAP + (this.buffedDA + this.buffedLK) * 16,
      0
    )
  }

  get resAP() {
    return Math.ceil(this.needStats / calcAPBuffRatio(this.APBuff))
  }

  get resDA() {
    const needDA = this.needStats / 16
    return Math.ceil(needDA / calcDABuffRatio(this.DABuff))
  }

  get resLK() {
    const needLK = this.needStats / 16
    return Math.ceil(needLK / calcLKBuffRatio(this.LKBuff))
  }
}
</script>
