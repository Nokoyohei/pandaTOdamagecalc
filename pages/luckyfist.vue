<template>
  <v-container>
    <h1>Lucky Fist</h1>
    <BossMonsterPanel
      :damage="damage"
      v-model:monster="monster"
      :debuff-skills-def="debuffSkillsDef"
      v-model:debuff="debuffSkills"
    />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <LKBuff v-model:buff="lkBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <v-card class="mb-4 pa-4">
          <v-card-title class="text-subtitle-1 pa-0 pb-2">
            Base Power Adjustment
          </v-card-title>
          <v-slider
            v-model="localBasePower"
            :min="0"
            :max="880"
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
                :max="880"
                style="width: 80px"
                density="compact"
                hide-details
              />
            </template>
          </v-slider>
        </v-card>
        <StatsTextField
          v-model:input-stats="stats.lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          v-model:extra-stats="extraStats.lk"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  calcLuckyFistDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, monsterHP, lkBuffs, debuffSkills, buffedLK, debuffedMonster } = useSkillPage({ skillMode: 'boss' })

const localBasePower = ref(BASE_POWER.LuckyFist)

const debuffSkillsDef = [
  {
    value: 'ShieldBreaker',
    name: 'Shield Breaker',
    img: '/barrier_break.gif'
  }
]

const damage = computed(() => {
  return calcDamage(
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    calcLuckyFistDamage(monster.value.hp, buffedLK.value, localBasePower.value)
  )
})

const resLK = computed(() => {
  const needLK = calcNeedStats(
    monsterHP.value,
    calcMonsterDef(debuffedMonster.value, 'physical'),
    debuffedMonster.value.physicalR,
    SkillRatio.LuckyFist(localBasePower.value),
    monster.value.hp + buffedLK.value * 80,
    0
  )

  return Math.ceil(needLK / calcLKBuffRatio(lkBuffs.value) / 80)
})
</script>
