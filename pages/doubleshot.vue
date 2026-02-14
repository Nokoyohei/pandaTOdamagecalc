<template>
  <v-container>
    <h1>{{ isGodly ? 'Godly Double Shot' : 'Double Shot' }}</h1>
    <BossMonsterPanel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * 2`"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
      :crit-damage="critDamage"
      :crit-damage-string="`${critDamage.toLocaleString()} * 2`"
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
        <v-tooltip location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-btn value="godlySharpSense" v-bind="activatorProps">
              <img src="/sharpsense.gif" />
            </v-btn>
          </template>
          <span>Godly Sharp Sense</span>
        </v-tooltip>
      </v-btn-toggle>
    </div>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="activeDefaultPower" />
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
  calcDoubleShotDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER, GODLY_BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER, SHARP_SENSE_MULTIPLIER, GODLY_SHARP_SENSE_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, monsterHP, acBuffs, debuffSkills, buffedAC, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const isGodly = useGodly()
const activeDefaultPower = computed(() =>
  isGodly.value ? GODLY_BASE_POWER.DoubleShot : BASE_POWER.DoubleShot
)
const localBasePower = ref<number>(activeDefaultPower.value)
watch(isGodly, () => {
  localBasePower.value = activeDefaultPower.value
})
const sharpSense = ref<string[]>([])
const effectiveCritMultiplier = computed(() => {
  if (sharpSense.value.includes('godlySharpSense')) return CRIT_MULTIPLIER.gun * GODLY_SHARP_SENSE_MULTIPLIER
  if (sharpSense.value.includes('sharpSense')) return CRIT_MULTIPLIER.gun * SHARP_SENSE_MULTIPLIER
  return CRIT_MULTIPLIER.gun
})

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const idealDamage = computed(() =>
  calcDoubleShotDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
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
    idealDamage.value,
    1,
    effectiveCritMultiplier.value
  )
)

const needStats = computed(() => {
  return calcNeedStats(
    monsterHP.value,
    calcMonsterDef(monster.value, 'gun'),
    debuffedMonster.value.gunR,
    SkillRatio.DoubleShot(localBasePower.value),
    buffedAC.value * 20 + stats.value.gunAP,
    48 * 20
  )
})

const resAC = computed(() => {
  return 0
})

const resGunAP = computed(() => {
  return needStats.value
})
</script>
