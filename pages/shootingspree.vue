<template>
  <v-container>
    <h1>Shooting Spree</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" :crit-damage="critDamage" />
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
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.ShootingSpree" />
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
  calcShootingSpreeDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'
import { CRIT_MULTIPLIER, SHARP_SENSE_MULTIPLIER, GODLY_SHARP_SENSE_MULTIPLIER } from '~/utils/critical'

const { stats, extraStats, monster, acBuffs, buffedAC } = useSkillPage()

const localBasePower = ref(BASE_POWER.ShootingSpree)
const sharpSense = ref<string[]>([])
const effectiveCritMultiplier = computed(() => {
  if (sharpSense.value.includes('godlySharpSense')) return CRIT_MULTIPLIER.gun * GODLY_SHARP_SENSE_MULTIPLIER
  if (sharpSense.value.includes('sharpSense')) return CRIT_MULTIPLIER.gun * SHARP_SENSE_MULTIPLIER
  return CRIT_MULTIPLIER.gun
})

const idealDamage = computed(() =>
  calcShootingSpreeDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    monster.value.gunR,
    idealDamage.value
  )
)

const critDamage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    monster.value.gunR,
    idealDamage.value,
    1,
    effectiveCritMultiplier.value
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'gun'),
    monster.value.gunR,
    SkillRatio.ShootingSpree(localBasePower.value),
    buffedAC.value * 20 + stats.value.gunAP,
    48 * 20
  )
)

const resAC = computed(() =>
  Math.ceil(needStats.value / calcACBuffRatio(acBuffs.value) / 20)
)

const resGunAP = computed(() => needStats.value)
</script>
