<template>
  <v-container>
    <h1>Berserk</h1>
    <FarmingMonster :damage="damage" v-model:monster="monster" />
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <BuffPanel v-model:ac-buffs="acBuffs" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <BasePowerSlider v-model="localBasePower" :default-power="BASE_POWER.Berserk" />
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
