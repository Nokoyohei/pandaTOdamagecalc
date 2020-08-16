<template>
  <v-container>
    <h1>One Pair</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <hv-buff :buff.sync="HVBuff" />
        <v-switch v-model="buff" value="ladyluck">
          <template #label>
            <img src="~/static/ladyluck.gif" />
            LadyLuck
          </template>
        </v-switch>
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
          :input-stats.sync="hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          :extra-stats.sync="extraHV"
          label="HV"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import HvBuff from '~/components/HVBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { requiem } from '~/utils/monsters'
import {
  calcOnePairDamage,
  calcDamage,
  calcMonsterDef,
  calcNeedStats,
  calcAPBuffRatio,
  calcHVBuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import {
  BossMonster,
  APBuffName,
  HVBuffName,
  DebuffName,
  skillPanel
} from '~/types'
import SkillRatio from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    HvBuff,
    StatsTextField
  }
})
export default class TempestStrike extends Vue {
  ap = 100000
  extraAP = 0
  hv = 10000
  extraHV = 0
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  HVBuff: HVBuffName[] = []
  debuffSkills: DebuffName[] = []
  buff: 'ladyluck' | null = null

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

  get isLadyLuck() {
    return this.buff?.includes('ladyluck')
  }

  get buffedAP() {
    return (
      Math.floor((this.ap - this.extraAP) * calcAPBuffRatio(this.APBuff)) +
      this.extraAP
    )
  }

  get buffedHV() {
    return (
      Math.floor((this.hv - this.extraHV) * calcHVBuffRatio(this.HVBuff)) +
      this.extraHV
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcOnePairDamage(this.buffedAP, this.buffedHV, this.isLadyLuck)
    )
  }

  resStats() {
    const multiplier = this.isLadyLuck ? 1 + SkillRatio.LadyLuck : 1
    return calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.OnePair * multiplier,
      this.buffedAP + this.buffedHV * 8,
      0
    )
  }

  get resAP() {
    return Math.ceil(this.resStats())
  }

  get resHV() {
    return Math.ceil(this.resStats() / 8)
  }
}
</script>
