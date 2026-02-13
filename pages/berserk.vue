<template>
  <v-container>
    <h1>Berserk</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
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
            :max="700"
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
                :max="700"
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
  calcBerserkDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio, { BASE_POWER } from '~/utils/skillRatio'

const { stats, extraStats, monster, acBuffs, buffedAC } = useSkillPage()

const localBasePower = ref(BASE_POWER.Berserk)

const damage = computed(() =>
  calcDamage(
    calcMonsterDef(monster.value, 'gun'),
    monster.value.gunR,
    calcBerserkDamage(buffedAC.value * 20 + stats.value.gunAP, localBasePower.value)
  )
)

const needStats = computed(() =>
  calcNeedStats(
    monster.value.hp,
    calcMonsterDef(monster.value, 'gun'),
    monster.value.gunR,
    SkillRatio.Berserk(localBasePower.value),
    buffedAC.value * 20 + stats.value.gunAP,
    48 * 20
  )
)

const resAC = computed(() =>
  Math.ceil(needStats.value / calcACBuffRatio(acBuffs.value) / 20)
)

const resGunAP = computed(() => needStats.value)
</script>
