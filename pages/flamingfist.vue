<template>
  <v-container>
    <h1>Flaming Fist</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="SKILL_POWER.FlamingFist" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
        />
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
        />
        <StatsTextField
          v-model:input-stats="stats.fire"
          :need-stats="resFire"
          label="Fire Attr"
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
  calcAPBuffRatio,
  calcMABuffRatio
} from '~/utils/calc'
import { debuffDefsFor } from '~/utils/debuffs'
import SkillPower, { SKILL_POWER, SkillRatio } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, apBuffs, maBuffs, debuffSkills, buffedAP, buffedMA, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(SKILL_POWER.FlamingFist)

// FUN_0073E640 @0x73e705: 術者の火属性が 0 より大きければ火魔法 (BH_MagicSkill, MA−0)、
// 0 なら物理 (BH_Physical, PhysicalR) として同じ power を投げる
const isFireMagic = computed(() => stats.value.fire > 0)

const debuffSkillsDef = computed(() =>
  isFireMagic.value ? debuffDefsFor('magic', 'fireR') : debuffDefsFor('physical', 'physicalR')
)

const power = computed(() =>
  SkillPower.FlamingFist(buffedAP.value, stats.value.fire, localBasePower.value)
)

const idealDamage = computed(() =>
  isFireMagic.value ? magicAttackPower(power.value, buffedMA.value, 0) : power.value
)

const hitDamage = (critical: boolean) =>
  isFireMagic.value
    ? calcDamage(
        calcMonsterDef(debuffedMonster.value, 'magic'),
        debuffedMonster.value.fireR,
        idealDamage.value,
        1,
        critical ? CRIT_MULTIPLIER.magic : 1,
        'magic'
      )
    : calcDamage(
        calcMonsterDef(debuffedMonster.value, 'physical'),
        debuffedMonster.value.physicalR,
        idealDamage.value,
        1,
        critical ? CRIT_MULTIPLIER.physical : 1,
        'physical'
      )

const damage = computed(() => hitDamage(false))
const critDamage = computed(() => hitDamage(true))

const resAP = computed(() => {
  const needAP = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.fireR,
    (SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedMA.value) / 100,
    buffedAP.value,
    0
  )

  return Math.ceil(needAP / calcAPBuffRatio(apBuffs.value))
})

const resMA = computed(() => {
  const needMA =
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value) * buffedAP.value,
      buffedMA.value / 100,
      0
    ) * 100

  return Math.ceil(needMA / calcMABuffRatio(maBuffs.value))
})

const resFire = computed(() => {
  return Math.ceil(
    calcNeedStats(
      monsterHP.value,
      calcMonsterDef(debuffedMonster.value, 'magic'),
      debuffedMonster.value.fireR,
      (buffedAP.value * buffedMA.value) / 100,
      SkillRatio.FlamingFist(stats.value.fire, localBasePower.value),
      0
    ) * 100
  )
})
</script>
