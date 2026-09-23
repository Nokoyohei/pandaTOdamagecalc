<template>
  <v-container>
    <h1>{{ isGodly ? 'Godly One Pair' : 'One Pair' }}</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ap-buffs="apBuffs" v-model:hv-buffs="hvBuffs" />
        <v-switch v-model="isLadyLuck">
          <template #label>
            <img src="/ladyluck.gif" />
            Lady Luck ×{{ ladyLuckMultiplier.toFixed(2) }} ({{ SKILL_POWER.LadyLuck }} cards)
          </template>
        </v-switch>
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
        <StatsTextField
          v-model:input-stats="stats.ap"
          :need-stats="resAP"
          :buffed-stats="buffedAP"
          v-model:extra-stats="extraStats.ap"
          label="AP"
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
  calcDamage,
  calcMonsterDef,
  calcNeedStats,
  calcAPBuffRatio,
  calcHVBuffRatio
} from '~/utils/calc'
import { debuffDefsFor } from '~/utils/debuffs'
import SkillPower, { SKILL_POWER, GODLY_SKILL_POWER, SkillRatio } from '~/utils/skillPower'
import { CRIT_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, apBuffs, hvBuffs, debuffSkills, buffedAP, buffedHV, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const isGodly = useGodly()
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_SKILL_POWER.OnePair : SKILL_POWER.OnePair
)
const localBasePower = ref<number>(activeDefaultPower.value)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})

const debuffSkillsDef = debuffDefsFor('physical', 'physicalR')

// v-switch を value 付きで使うと OFF 時に false が入り `false.includes` で落ちていたので、素の boolean にする
const isLadyLuck = ref(false)

// power × (1 + cards / 15)。cards は ESAction_LuckyGoddess の MaxCard（生成テーブル）
const ladyLuckMultiplier = computed(() => 1 + SkillRatio.LadyLuck())

const idealDamage = computed(() =>
  SkillPower.OnePair(buffedAP.value, buffedHV.value, isLadyLuck.value, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    idealDamage.value,
    1,
    CRIT_MULTIPLIER.physical
  )
)

const resStats = () => {
  const multiplier = isLadyLuck.value ? 1 + SkillRatio.LadyLuck() : 1
  return calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.OnePair(localBasePower.value) * multiplier,
    buffedAP.value + buffedHV.value * 8,
    0
  )
}

const resAP = computed(() => {
  return Math.ceil(resStats())
})

const resHV = computed(() => {
  return Math.ceil(resStats() / 8)
})
</script>
