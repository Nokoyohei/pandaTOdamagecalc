<template>
  <v-container>
    <h1>Poison Assault (Only Poison Damage)</h1>
    <boss-monster-panel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * 30`"
      :monster.sync="monster"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <da-buff :buff.sync="DABuff" />
        <throw-buff :buff.sync="ThrowBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="basePower"
            :min="0"
            :max="780"
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
                :max="780"
                style="width: 80px"
                dense
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <stats-text-field
          :input-stats.sync="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          :extra-stats.sync="extraStats.da"
          label="DA"
        />
        <stats-text-field
          :input-stats.sync="stats.throwAP"
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
import ThrowBuff from '~/components/ThrowBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { requiem } from '~/utils/monsters'
import {
  calcPoisonDamage,
  calcDABuffRatio,
  calcThrowBuffRatio,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

import {
  BossMonster,
  DABuffName,
  ThrowBuffName,
  Status,
  Attributes
} from '~/types'

@Component({
  components: {
    BossMonsterPanel,
    DaBuff,
    ThrowBuff,
    StatsTextField,
    DamageArea
  }
})
export default class PoisonAssault extends Vue {
  monster: BossMonster = requiem

  DABuff: DABuffName[] = []
  ThrowBuff: ThrowBuffName[] = []
  basePower: number = BASE_POWER.PoisonAssault

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

  get buffedDA() {
    return (
      Math.floor(
        (this.stats.da - this.extraStats.da) * calcDABuffRatio(this.DABuff)
      ) + this.extraStats.da
    )
  }

  get poison() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP)
  }

  get buffedThrowAP() {
    return this.stats.throwAP * calcThrowBuffRatio(this.ThrowBuff)
  }

  get damage() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP, this.basePower)
  }

  get resDA() {
    const needDA =
      (this.monster.hp * this.monster.gaugeNum) /
        (SkillRatio.PoisonAssault(this.basePower) * 0.412 * 30) -
      (this.buffedDA * 16 + this.buffedThrowAP)

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff) / 16)
  }
}
</script>
