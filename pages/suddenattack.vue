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
      <v-col cols="12" md="5" order-md="1">
        <ap-buff :buff.sync="APBuff" />
        <da-buff :buff.sync="DABuff" />
        <lk-buff :buff.sync="LKBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="1680"
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
                :max="1680"
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
          :input-stats.sync="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraStats.da"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraStats.lk"
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
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

import {
  BossMonster,
  APBuffName,
  DABuffName,
  LKBuffName,
  DebuffName,
  skillPanel,
  Status,
  Attributes
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
  monster: BossMonster = requiem

  APBuff: APBuffName[] = []
  DABuff: DABuffName[] = []
  LKBuff: LKBuffName[] = []
  debuffSkills: DebuffName[] = []
  basePower: number = BASE_POWER.SuddenAttack

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

  debuffSkillsDef: skillPanel[] = [
    {
      value: 'ShieldBreaker',
      name: 'Shield Breaker',
      img: require('~/static/barrier_break.gif')
    }
  ]

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get buffedDA() {
    return (
      Math.floor(
        (this.stats.da - this.extraStats.da) * calcDABuffRatio(this.DABuff)
      ) + this.extraStats.da
    )
  }

  get buffedLK() {
    return (
      Math.floor(
        (this.stats.lk - this.extraStats.lk) * calcLKBuffRatio(this.LKBuff)
      ) + this.extraStats.lk
    )
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }

  get damage() {
    const suddenAttackDamage = calcSuddenAttackDamage(
      this.buffedAP,
      this.buffedDA,
      this.buffedLK,
      this.basePower
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
      SkillRatio.SuddenAttack(this.basePower),
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
