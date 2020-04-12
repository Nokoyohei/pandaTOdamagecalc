<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <p>{{ damage }} damage!!</p>
    less than {{ resMa }} MA

    <v-row>
      <v-col cols="12" md="6">
        <dark-load-buff :buff.sync="buff" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="ma" label="MA"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
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
    DarkLoadBuff
  }
})
export default class GravityCrash extends Vue {
  ma = 53129
  monster: Monster = isabelle

  buff: ('mistOfMana' | 'bloodTestament' | 'darkCommando')[] = []

  get damage() {
    const buffedMa = this.buff.includes('mistOfMana')
      ? Math.round(MistOfManaBuff * this.ma)
      : this.ma
    let darkCommandoDamage = this.buff.includes('darkCommando')
      ? calcDarkCommandoDamage(buffedMa)
      : 0
    let gravityCrashDamage = calcGravityCrashDamage(buffedMa)
    if (this.buff.includes('bloodTestament')) {
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
    let attackRatio = this.buff.includes('darkCommando')
      ? SkillRatio.GravityCrashRatio + SkillRatio.DarkCommandoRatio
      : SkillRatio.GravityCrashRatio
    attackRatio = this.buff.includes('bloodTestament')
      ? attackRatio * BloodyTestamentBuff
      : attackRatio
    const constStats = 49
    const monsterDef =
      calcMonsterDef(this.monster, 'magic') *
      (this.buff.includes('darkCommando') ? 2 : 1)
    const nowStats = this.buff.includes('mistOfMana')
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
      this.buff.includes('mistOfMana') ? needMa / MistOfManaBuff : needMa
    )
  }
}
</script>
