<template>
  <v-container>
    <h1>Poison Assault (Only Poison Damage)</h1>
    <BossMonsterPanel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * 30`"
      v-model:monster="monster"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <DABuff v-model:buff="daBuffs" />
        <ThrowBuff v-model:buff="throwBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="780"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="780"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <StatsTextField
          v-model:input-stats="stats.da"
          :need-stats="resDA"
          :buffed-stats="buffedDA"
          v-model:extra-stats="extraStats.da"
          label="DA"
        />
        <StatsTextField
          v-model:input-stats="stats.throwAP"
          :need-stats="0"
          label="Throw AP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcPoisonDamage,
  calcDABuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, daBuffs, throwBuffs, buffedDA, buffedThrowAP } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.PoisonAssault)

const poison = computed(() => {
  return calcPoisonDamage(buffedDA.value, buffedThrowAP.value)
})

const damage = computed(() => {
  return calcPoisonDamage(buffedDA.value, buffedThrowAP.value, localBasePower.value)
})

const resDA = computed(() => {
  const needDA =
    (monsterHP.value) /
      (SkillRatio.PoisonAssault(localBasePower.value) * 0.412 * 30) -
    (buffedDA.value * 16 + buffedThrowAP.value)

  return Math.ceil(needDA / calcDABuffRatio(daBuffs.value) / 16)
})
</script>
