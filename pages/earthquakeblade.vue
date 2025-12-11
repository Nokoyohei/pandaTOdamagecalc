<template>
  <v-container>
    <h1>Earthquake Blade</h1>
    <boss-monster-panel
      v-if="mode === 'boss'"
      :damage="damage"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
    <farming-monster v-else :damage="damage" :monster.sync="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="880"
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
                :max="880"
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
          :input-stats.sync="stats.soil"
          :need-stats="resSoil"
          label="Soil Attr"
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
  calcEarthquakeBladeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcAPBuffRatio,
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import {
  Monster,
  BossMonster,
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
export default class EarthquakeBlade extends Vue {
  mode = 'farming'
  monster: Monster = torobbie

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  APBuff: APBuffName[] = []
  debuffSkills: DebuffName[] = []
  basePower: number = BASE_POWER.EarthquakeBlade

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
    return this.mode === 'boss'
      ? calcDebuffedMonster(this.monster as BossMonster, this.debuffSkills)
      : this.monster
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
      calcEarthquakeBladeDamage(this.buffedAP, this.stats.soil, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monsterHP,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.EarthquakeBlade(this.stats.soil, this.basePower),
      this.buffedAP,
      0
    )

    return Math.ceil(needAP / calcAPBuffRatio(this.APBuff))
  }

  get resSoil() {
    return Math.ceil(
      calcNeedStats(
        this.monsterHP,
        calcMonsterDef(this.debuffedMonster, 'physical'),
        this.debuffedMonster.physicalR,
        this.buffedAP,
        SkillRatio.EarthquakeBlade(this.stats.soil, this.basePower),
        0
      ) * 50
    )
  }
}
</script>
