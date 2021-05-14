<template>
  <v-container>
    <h1>Lucky Fist</h1>
    <boss-monster-panel
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <lk-buff :buff.sync="LKBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
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
import LkBuff from '~/components/LKBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcLuckyFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcDebuffedMonster
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'

import { BossMonster, LKBuffName, DebuffName, skillPanel } from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    LkBuff,
    StatsTextField,
    DamageArea
  }
})
export default class ChampionsBlade extends Vue {
  lk = 52796
  extraLK = 0
  monster: BossMonster = requiem

  LKBuff: LKBuffName[] = []

  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  created() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    this.lk = stats?.lk ?? 10000
    this.extraLK = stats?.extraLK ?? 0
  }

  beforeDestroy() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    stats.lk = this.lk
    stats.extraLK = this.extraLK
    localStorage.setItem('stats', JSON.stringify(stats))
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get buffedLK() {
    return (
      Math.floor((this.lk - this.extraLK) * calcLKBuffRatio(this.LKBuff)) +
      this.extraLK
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcLuckyFistDamage(this.monster.hp, this.buffedLK)
    )
  }

  get resLK() {
    const needLK = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.LuckyFist,
      this.monster.hp + this.buffedLK * 80,
      0
    )

    return Math.ceil(needLK / calcLKBuffRatio(this.LKBuff) / 80)
  }
}
</script>
