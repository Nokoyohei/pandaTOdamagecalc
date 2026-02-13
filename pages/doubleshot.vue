<template>
  <v-container>
    <h1>Double Shot</h1>
    <BossMonsterPanel
      :damage="damage"
      :damage-string="`${damage.toLocaleString()} * 2`"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    ></BossMonsterPanel>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="5000"
            :step="10"
            thumb-label="always"
            label="Base Power"
            class="mt-4"
          >
            <template v-slot:append>
              <v-text-field
                v-model.number="localBasePower"
                type="number"
                :min="0"
                :max="960"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
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
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, acBuffs, debuffSkills, buffedAC, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.DoubleShot)

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
    calcDoubleShotDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
  )
})

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
