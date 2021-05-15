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
          :input-stats.sync="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          :extra-stats.sync="extraStats.ap"
          label="AP"
        />
        <stats-text-field
          :input-stats.sync="stats.hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          :extra-stats.sync="extraStats.hv"
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
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import {
  BossMonster,
  APBuffName,
  HVBuffName,
  DebuffName,
  skillPanel,
  Status,
  Attributes
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

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  beforeMount() {
    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get isLadyLuck() {
    return this.buff?.includes('ladyluck')
  }

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get buffedHV() {
    return (
      Math.floor(
        (this.stats.hv - this.extraStats.hv) * calcHVBuffRatio(this.HVBuff)
      ) + this.extraStats.hv
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
