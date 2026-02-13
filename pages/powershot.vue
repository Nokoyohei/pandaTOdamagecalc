<template>
  <v-container>
    <h1>Power Shot</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.PowerShot" />
        <StatsTextField
          v-model:input-stats="stats.ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          v-model:extra-stats="extraStats.ac"
          label="AC"
        />
        <StatsTextField
          v-model:input-stats="stats.gunAP"
          :need-stats="0"
          label="GunAP"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcPowerShotDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, acBuffs, debuffSkills, buffedAC, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.PowerShot)

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    debuffedMonster.value.gunR,
    calcPowerShotDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
  )
})

const needStats = computed(() => {
  return calcNeedStats(
    monsterHP.value,
    calcMonsterDef(monster.value, 'gun'),
    debuffedMonster.value.gunR,
    SkillRatio.PowerShot(localBasePower.value),
    buffedAC.value * 20 + stats.value.gunAP,
    48 * 20
  )
})

const resAC = computed(() => {
  return Math.ceil(needStats.value / calcACBuffRatio(acBuffs.value) / 20)
})

const resGunAP = computed(() => {
  return needStats.value
})
</script>
