<template>
  <v-container>
    <h1>Tidal Slash</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
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
          :input-stats.sync="stats.water"
          :need-stats="resWater"
          label="Water Attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import ApBuff from '~/components/APBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { torobbie, requiem } from '~/utils/monsters'
import {
  calcTidalSlashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import {
  BossMonster,
  Monster,
  APBuffName,
  DebuffName,
  skillPanel,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    FarmingMonster,
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class TidalSlash extends Vue {
  mode = 'farming'
  monster: Monster | BossMonster = torobbie

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  APBuff: APBuffName[] = []
  debuffSkills: DebuffName[] = []

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  beforeMount() {
    this.mode = this.$route.query.mode === 'boss' ? 'boss' : 'farming'
    if (this.mode === 'boss') {
      this.monster = requiem
    }

    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get monsterHP() {
    return this.mode === 'boss'
      ? (this.monster as BossMonster).gaugeNum * this.monster.hp
      : this.monster.hp
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcTidalSlashDamage(this.buffedAP, this.stats.water)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.TidalSlash(this.stats.water),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resWater() {
    return Math.ceil(
      (calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.TidalSlash(this.stats.water),
        0
      ) *
        100) /
        2.5
    )
  }
}
</script>
