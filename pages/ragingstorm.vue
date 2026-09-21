<template>
  <v-container>
    <h1>Raging Storm</h1>
    <BossMonsterPanel
      v-if="mode === 'boss'"
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    />
    <FarmingMonster v-else :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" v-model:ma-buffs="maBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="SKILL_POWER.RagingStorm" />
        <StatsTextField
          v-model:input-stats="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          v-model:extra-stats="extraStats.ac"
          label="AC"
        />
        <StatsTextField
          v-model:input-stats="stats.ma"
          :need-stats="resMA"
          :buffed-stats="buffedMA"
          v-model:extra-stats="extraStats.ma"
          label="MA"
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
  calcACBuffRatio
} from '~/utils/calc'
import { debuffDefsFor } from '~/utils/debuffs'
import SkillPower, { SKILL_POWER } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const {
  mode,
  stats,
  extraStats,
  monster,
  monsterHP,
  maBuffs,
  acBuffs,
  buffedMA,
  buffedAC,
  debuffSkills,
  debuffedMonster
} = useSkillPage({ skillMode: 'dual' })

// 風属性なので Gnome's Domain
const debuffSkillsDef = debuffDefsFor('magic', 'windR')

const localBasePower = ref(SKILL_POWER.RagingStorm)

// maPenalty = 49 − AC なので実効 MA は MA + AC − 49
const idealDamage = computed(() =>
  magicAttackPower(SkillPower.RagingStorm(localBasePower.value), buffedMA.value + buffedAC.value, 49)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.windR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.windR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.magic
  )
)

const needStat = () =>
  calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'magic'),
    debuffedMonster.value.windR,
    SkillPower.RagingStorm(localBasePower.value) / 100,
    buffedMA.value + buffedAC.value,
    49
  )

const resMA = computed(() => Math.ceil(needStat() / calcMABuffRatio(maBuffs.value)))

const resAC = computed(() => Math.ceil(needStat() / calcACBuffRatio(acBuffs.value)))
</script>
