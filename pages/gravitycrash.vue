<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <damage-area :damage="damage" />

    <v-row>
      <v-col cols="12" md="6">
        <ma-buff :buff.sync="MABuff" />
        <dark-load-buff :buff.sync="DLBuff" />
      </v-col>
      <v-col cols="12" md="6">
        <stats-text-field
          :input-stats.sync="ma"
          :need-stats="resMa"
          label="MA"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import MaBuff from '~/components/MABuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcDarkCommandoDamage,
  calcGravityCrashDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef
} from '~/utils/calc'
import { MistOfManaBuff, BloodyTestamentBuff } from '~/utils/buffRatio'
import SkillRatio from '~/utils/skillRatio'

import { Monster } from '~/types'

@Component({
  components: {
    FarmingMonster,
    DarkLoadBuff,
    MaBuff,
    StatsTextField,
    DamageArea
  }
})
export default class GravityCrash extends Vue {
  ma = 53129
  monster: Monster = isabelle

  MABuff: 'mistOfMana'[] = []
  DLBuff: ('bloodTestament' | 'darkCommando')[] = []

  get damage() {
    const buffedMa = this.MABuff.includes('mistOfMana')
      ? Math.round(MistOfManaBuff * this.ma)
      : this.ma
    let darkCommandoDamage = this.DLBuff.includes('darkCommando')
      ? calcDarkCommandoDamage(buffedMa)
      : 0
    let gravityCrashDamage = calcGravityCrashDamage(buffedMa)
    if (this.DLBuff.includes('bloodTestament')) {
      darkCommandoDamage = Math.round(darkCommandoDamage * BloodyTestamentBuff)
      gravityCrashDamage = Math.round(gravityCrashDamage * BloodyTestamentBuff)
    }

    return (
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        gravityCrashDamage
      ) +
      calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster.darkR,
        darkCommandoDamage
      )
    )
  }

  get resMa() {
    let attackRatio = this.DLBuff.includes('darkCommando')
      ? SkillRatio.GravityCrashRatio + SkillRatio.DarkCommandoRatio
      : SkillRatio.GravityCrashRatio
    attackRatio = this.DLBuff.includes('bloodTestament')
      ? attackRatio * BloodyTestamentBuff
      : attackRatio
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.DLBuff.includes('darkCommando') ? 2 : 1)
    const nowStats = this.MABuff.includes('mistOfMana')
      ? this.ma * MistOfManaBuff
      : this.ma

    const needMa = calcNeedStats(
      this.monster.hp,
      monsterDef,
      this.monster.darkR,
      attackRatio,
      nowStats,
      constStats
    )

    return Math.ceil(
      this.MABuff.includes('mistOfMana') ? needMa / MistOfManaBuff : needMa
    )
  }
}
</script>
