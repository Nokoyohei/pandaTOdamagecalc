<template>
  <v-container>
    <h1>{{ isGodly ? 'Godly Staff of Agony' : 'Staff of Agony' }}</h1>
    <BossMonsterPanel :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ma-buffs="maBuffs" v-model:dl-buffs="dlBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
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
  magicAttackPower,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcMABuffRatio,
  calcBloodTestamentRatio
} from '~/utils/calc'
import SkillPower, { SKILL_POWER, GODLY_SKILL_POWER } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, maBuffs, dlBuffs, buffedMA } = useSkillPage({ skillMode: 'boss' })

const isGodly = useGodly()
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_SKILL_POWER.StaffOfAgony : SKILL_POWER.StaffOfAgony
)
const localBasePower = ref<number>(activeDefaultPower.value)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const idealStaffOfAgonyDamage = computed(() =>
  magicAttackPower(
    SkillPower.StaffOfAgony(stats.value.dark, localBasePower.value),
    buffedMA.value,
    49
  )
)

const idealDarkCommandoDamage = computed(() =>
  dlBuffs.value.includes('darkCommando')
    ? magicAttackPower(SkillPower.DarkCommando(), buffedMA.value, 49)
    : 0
)

const bossBuff = computed(() =>
  calcBloodTestamentRatio(dlBuffs.value)
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
  const agonyPower = SkillPower.StaffOfAgony(stats.value.dark, localBasePower.value)
  const attackRatio =
    (dlBuffs.value.includes('darkCommando')
      ? agonyPower + SkillPower.DarkCommando()
      : agonyPower) / 100
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = calcBloodTestamentRatio(dlBuffs.value)

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
  const agonyPower = SkillPower.StaffOfAgony(stats.value.dark, localBasePower.value)
  const attackRatio =
    (dlBuffs.value.includes('darkCommando')
      ? agonyPower + SkillPower.DarkCommando()
      : agonyPower) / 100
  const constStats = 49
  const monsterDef =
    calcMonsterDef(monster.value, 'magic') *
    (dlBuffs.value.includes('darkCommando') ? 2 : 1)

  const buff = calcBloodTestamentRatio(dlBuffs.value)

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
