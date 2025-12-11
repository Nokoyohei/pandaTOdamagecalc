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
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="520"
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
                :max="520"
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
          :input-stats.sync="stats.wind"
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
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import {
  BossMonster,
  APBuffName,
  DebuffName,
  skillPanel,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    ApBuff,
    StatsTextField
  }
})
export default class GaleStrike extends Vue {
  monster: BossMonster = requiem

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  APBuff: APBuffName[] = []
  debuffSkills: DebuffName[] = []
  basePower: number = BASE_POWER.GaleStrike

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

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

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get maxDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, this.stats.wind, this.basePower)
    )
  }

  get minDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, 0, this.basePower)
    )
  }

  get avgDamage() {
    return calcDamage(
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      calcGaleStrikeDamage(this.buffedAP, this.stats.wind / 2, this.basePower)
    )
  }

  get resAP() {
    const needAP = calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.debuffedMonster, 'physical'),
      this.debuffedMonster.physicalR,
      SkillRatio.GaleStrike(this.stats.wind, this.basePower),
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
        SkillRatio.GaleStrike(this.stats.wind / 2, this.basePower),
        0
      ) *
        ((100 / 7) * 2)
    )
  }
}
</script>
