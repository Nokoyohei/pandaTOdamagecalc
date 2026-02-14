<template>
  <v-container>
    <h1>Power Shot</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
    ></BossMonsterPanel>
    <div class="d-flex justify-center mb-4">
      <v-btn-toggle v-model="sharpSense" multiple bg-color="black">
        <v-tooltip location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-btn value="sharpSense" v-bind="activatorProps">
              <img src="/sharpsense.gif" />
            </v-btn>
          </template>
          <span>Sharp Sense</span>
        </v-tooltip>
      </v-btn-toggle>
    </div>
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
import { CRIT_MULTIPLIER, SHARP_SENSE_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, acBuffs, debuffSkills, buffedAC, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.PowerShot)
const sharpSense = ref<string[]>([])
const effectiveCritMultiplier = computed(() =>
  CRIT_MULTIPLIER.gun * (sharpSense.value.length > 0 ? SHARP_SENSE_MULTIPLIER : 1)
)

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const idealDamage = computed(() =>
  calcPowerShotDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
)

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    debuffedMonster.value.gunR,
    idealDamage.value
  )
})

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    debuffedMonster.value.gunR,
    idealDamage.value * effectiveCritMultiplier.value
  )
)

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
