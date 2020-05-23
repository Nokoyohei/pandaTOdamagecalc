<template>
  <v-container>
    <h1>Chain of Knives</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />

    <v-row>
      <v-col cols="12" md="6">
        <da-buff :buff.sync="DABuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraDA"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="throwAp"
          :need-stats="0"
          label="Throw AP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DaBuff from '~/components/DABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcChainOfKnivesDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcDABuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { BossMonster, DABuffName, DebuffName, skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    DaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class MagicalSoul extends Vue {
  da = 10000
  throwAp = 20
  extraDA = 0
  monster: BossMonster = requiem

  DABuff: DABuffName[] = []
  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get buffedDA() {
    return (
      Math.floor((this.da - this.extraDA) * calcDABuffRatio(this.DABuff)) +
      this.extraDA
    )
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get damage() {
    const chainOfKnivesDamage = calcChainOfKnivesDamage(
      this.buffedDA,
      this.throwAp
    )
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      chainOfKnivesDamage
    )
  }

  get resDA() {
    const needDA = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.ChainOfKnives,
      this.buffedDA * 16 + this.throwAp * 6,
      0
    )

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff) / 16)
  }
}
</script>
