<template>
  <v-container>
    <h1>Full House</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:lk-buffs="lkBuffs" v-model:hv-buffs="hvBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="amber-darken-3" hide-details density="compact">
          <template #label><span class="godly-label">Godly Full House</span></template>
        </v-switch>
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          v-model:extra-stats="extraStats.lk"
          label="LK"
        />
        <StatsTextField
          v-model:input-stats="stats.hv"
          :need-stats="resHV"
          :buffed-stats="buffedHV"
          v-model:extra-stats="extraStats.hv"
          label="HV"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcFullHouseDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcAPBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, apBuffs, lkBuffs, hvBuffs, buffedAP, buffedLK, buffedHV } = useSkillPage()

const localBasePower = ref<number>(BASE_POWER.FullHouse)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.FullHouse : BASE_POWER.FullHouse
)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const idealDamage = computed(() =>
  calcFullHouseDamage(buffedAP.value, buffedLK.value, buffedHV.value, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'physical'),
    monster.value.physicalR,
    SkillRatio.FullHouse(localBasePower.value),
    buffedAP.value + (buffedLK.value + buffedHV.value) * 8,
    0
  )
)

const resAP = computed(() =>
  Math.ceil(needStats.value / calcAPBuffRatio(apBuffs.value))
)

const resLK = computed(() => {
  const needLK = needStats.value / 8
  return Math.ceil(needLK / calcLKBuffRatio(lkBuffs.value))
})

const resHV = computed(() => {
  const needHV = needStats.value / 8
  return Math.ceil(needHV / calcHVBuffRatio(hvBuffs.value))
})
</script>
