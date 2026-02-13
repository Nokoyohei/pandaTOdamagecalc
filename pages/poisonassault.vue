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
import { Component } from 'nuxt-property-decorator'
import BaseSkillPage from '~/utils/BaseSkillPage'
import BossMonsterPanel from '~/components/BossMonsterPanel.vue'
import DaBuff from '~/components/DABuff.vue'
import ThrowBuff from '~/components/ThrowBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import {
  calcPoisonDamage,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

@Component({
  components: {
    BossMonsterPanel,
    DaBuff,
    ThrowBuff,
    StatsTextField,
    DamageArea
  }
})
export default class PoisonAssault extends BaseSkillPage {
  get skillMode() { return 'boss' as const }
  basePower: number = BASE_POWER.PoisonAssault

  get poison() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP)
  }

  get damage() {
    return calcPoisonDamage(this.buffedDA, this.buffedThrowAP, this.basePower)
  }

  get resDA() {
    const needDA =
      (this.monsterHP) /
        (SkillRatio.PoisonAssault(this.basePower) * 0.412 * 30) -
      (this.buffedDA * 16 + this.buffedThrowAP)

    return Math.ceil(needDA / calcDABuffRatio(this.DABuff) / 16)
  }
}
</script>
