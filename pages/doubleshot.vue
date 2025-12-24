<template>
  <v-container>
    <h1>Double Shot</h1>
    <boss-monster-panel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * 2`"
      :monster.sync="monster"
      :debuff-skills-def="debuffSkillsDef"
      :debuff.sync="debuffSkills"
    ></boss-monster-panel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="5000"
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
                :max="960"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraStats.ac"
          label="AC"
        />
        <stats-text-field
          :input-stats.sync="stats.gunAP"
          :need-stats="0"
          label="GunAP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import { requiem } from '~/utils/monsters'
import {
  calcDoubleShotDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio,
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

import {
  ACBuffName,
  BossMonster,
  skillPanel,
  DebuffName,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    AcBuff,
    StatsTextField
  }
})
export default class ShootingSpree extends Vue {
  monster: BossMonster = requiem

  debuffSkills: DebuffName[] = []
  ACBuff: ACBuffName[] = []
  basePower: number = BASE_POWER.DoubleShot
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

  get buffedAC() {
    return (
      Math.floor(
        (this.stats.ac - this.extraStats.ac) * calcACBuffRatio(this.ACBuff)
      ) + this.extraStats.ac
    )
  }

  get damage() {
    return calcDamage(
      calcMonsterDef(this.monster, 'gun'),
      this.debuffedMonster.gunR,
      calcDoubleShotDamage(this.buffedAC * 20 + this.stats.gunAP, this.basePower)
    )
  }

  get needStats() {
    return calcNeedStats(
      this.monster.hp * this.monster.gaugeNum,
      calcMonsterDef(this.monster, 'gun'),
      this.debuffedMonster.gunR,
      SkillRatio.DoubleShot(this.basePower),
      this.buffedAC * 20 + this.stats.gunAP,
      48 * 20
    )
  }

  get resAC() {
    return 0
  }

  get resGunAP() {
    return this.needStats
  }
}
</script>
