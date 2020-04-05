<template>
  <v-container>
    <h1>Gravity Crash</h1>
    <farming-monster
      :attack="attack"
      attacktype="magic"
      attribute="darkR"
      :attacknum="attacknum"
    />
    <dark-load-buff :buff.sync="buff" />
    <v-text-field v-model="ma" label="MA"></v-text-field>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import DarkLoadBuff from '~/components/DarkLoadBuff.vue'
import {
  calcDarkCommandDamage,
  calcGravityCrashDamage,
  calcBloodyTestamentBuff,
  calcMistOfManaBuff
} from '~/utils/calc'

@Component({
  components: {
    FarmingMonster,
    DarkLoadBuff
  }
})
export default class GravityCrash extends Vue {
  ma = 55101
  buff: ('mistOfMana' | 'bloodTestament' | 'darkCommando')[] = []

  get attacknum() {
    return this.buff.includes('darkCommando') ? 2 : 1
  }

  get attack() {
    const buffedMa = this.buff.includes('mistOfMana')
      ? calcMistOfManaBuff(this.ma)
      : this.ma
    let DarkCommandoDamage = this.buff.includes('darkCommando')
      ? calcDarkCommandDamage(buffedMa)
      : 0
    let tmpDmg = calcGravityCrashDamage(buffedMa)
    if (this.buff.includes('bloodTestament')) {
      DarkCommandoDamage = calcBloodyTestamentBuff(DarkCommandoDamage)
      tmpDmg = calcBloodyTestamentBuff(tmpDmg)
    }

    return tmpDmg + DarkCommandoDamage
  }
}
</script>
