<template>
  <v-container>
    <h1>Staff of Agony</h1>
    <BossMonsterPanel :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" v-model:dl-buffs="dlBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-switch v-model="isGodly" color="amber-darken-3" hide-details density="compact">
          <template #label><span class="godly-label">Godly Staff of Agony</span></template>
        </v-switch>
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
        />
        <StatsTextField
          v-model:input-stats="stats.dark"
          :need-stats="resDark"
          label="DARK attr"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcDarkCommandoDamage,
  calcStaffOfAgony,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio
} from '~/utils/calc'
import { BloodTestamentBuff } from '~/utils/buffRatio'
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, maBuffs, dlBuffs, buffedMA } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref<number>(BASE_POWER.StaffOfAgony)
const isGodly = ref(false)
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.StaffOfAgony : BASE_POWER.StaffOfAgony
)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const idealStaffOfAgonyDamage = computed(() =>
  calcStaffOfAgony(buffedMA.value, stats.value.dark, localBasePower.value)
)

const idealDarkCommandoDamage = computed(() =>
  dlBuffs.value.includes('darkCommando')
    ? calcDarkCommandoDamage(buffedMA.value)
    : 0
)

const bossBuff = computed(() =>
  dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.darkR,
    idealStaffOfAgonyDamage.value,
    bossBuff.value
  ) +
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.darkR,
    idealDarkCommandoDamage.value,
    bossBuff.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.darkR,
    idealStaffOfAgonyDamage.value,
    bossBuff.value,
    CRIT_MULTIPLIER.magic
  ) +
  calcDamage(
    calcMonsterDef(monster.value, 'magic'),
    monster.value.darkR,
    idealDarkCommandoDamage.value,
    bossBuff.value,
    CRIT_MULTIPLIER.magic
  )
)

const resMA = computed(() => {
  const attackRatio = dlBuffs.value.includes('darkCommando')
    ? SkillRatio.StaffOfAgony(stats.value.dark, localBasePower.value) + SkillRatio.DarkCommando()
    : SkillRatio.StaffOfAgony(stats.value.dark, localBasePower.value)
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1

  const needMA = calcNeedStats(
    monsterHP.value,
    monsterDef,
    monster.value.darkR,
    attackRatio,
    buffedMA.value,
    constStats,
    buff
  )

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})

const resDark = computed(() => {
  const attackRatio = dlBuffs.value.includes('darkCommando')
    ? SkillRatio.StaffOfAgony(stats.value.dark, localBasePower.value) + SkillRatio.DarkCommando()
    : SkillRatio.StaffOfAgony(stats.value.dark, localBasePower.value)
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = dlBuffs.value.includes('bloodTestament')
    ? 1 + BloodTestamentBuff
    : 1

  return Math.ceil(
    (calcNeedStats(
      monsterHP.value,
      monsterDef,
      monster.value.darkR,
      buffedMA.value - constStats,
      attackRatio,
      0,
      buff
    ) *
      100) /
      30
  )
})
</script>
