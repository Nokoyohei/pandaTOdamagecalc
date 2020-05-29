<template>
  <v-container>
    <h1>Tidal Slash</h1>
    <boss-monster-panel
      :damage="damage"
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
          :input-stats.sync="water"
          :need-stats="resWater"
          label="Water Attr"
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
  calcTidalSlashDamage,
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
export default class TidalSlash extends Vue {
  ap = 100000
  extraAP = 0
  water = 1000
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

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTidalSlashDamage(this.buffedAP, this.water)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.TidalSlash(this.water),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWater() {
    return Math.ceil(
      (calcNeedStats(
        this.monster.hp * this.monster.gaugeNum,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.TidalSlash(this.water),
        0
      ) *
        100) /
        2.5
    )
  }
}
</script>
