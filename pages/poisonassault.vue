<template>
  <v-container>
    <h1>Poison Assault (Only Poison Damage)</h1>
    <BossMonsterPanel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * ${poisonTicks}`"
      v-model:monster="monster"
    />

    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:da-buffs="daBuffs" v-model:throw-buffs="throwBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="amber-darken-3" hide-details density="compact">
          <template #label><span class="godly-label">Godly Poison Assault</span></template>
        </v-switch>
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
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
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, daBuffs, throwBuffs, buffedDA, buffedThrowAP } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref<number>(BASE_POWER.PoisonAssault)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.PoisonAssault : BASE_POWER.PoisonAssault
)
const poisonTicks = computed(() => isGodly.value ? 10 : 30)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const poison = computed(() => {
  return calcPoisonDamage(buffedDA.value, buffedThrowAP.value)
})

const damage = computed(() => {
  return calcPoisonDamage(buffedDA.value, buffedThrowAP.value, localBasePower.value)
})

const resDA = computed(() => {
  const needDA =
    (monsterHP.value) /
      (SkillRatio.PoisonAssault(localBasePower.value) * 0.412 * poisonTicks.value) -
    (buffedDA.value * 16 + buffedThrowAP.value)

  return Math.ceil(needDA / calcDABuffRatio(daBuffs.value) / 16)
})
</script>
