<template>
  <v-container>
    <h1>Blessings</h1>
    <farming-monster :damage="damage" :monster.sync="monster" />
    <p class="text-center">Blessings</p>
    <v-layout justify-center>
      <v-btn-toggle
        v-model="selectedBlessingSkills"
        multiple
        borderless
        mandatory
        background-color="black"
      >
        <v-tooltip v-for="skill in BlessingSkills" :key="skill.name" bottom>
          <template #activator="{on}">
            <v-btn :value="skill.value" v-on="on">
              <img :src="skill.img" />
            </v-btn>
          </template>
          <span>{{ skill.name }}</span>
        </v-tooltip>
      </v-btn-toggle>
    </v-layout>
    <v-row>
      <v-col cols="12" md="5" order-md="1">
        <ac-buff :buff.sync="ACBuff" />
        <lk-buff :buff.sync="LKBuff" />
      </v-col>
      <v-col cols="12" md="7" order-md="0">
        <stats-text-field
          :input-stats.sync="ac"
          :need-stats="resAC"
          :buffed-stats="buffedAC"
          :extra-stats.sync="extraAC"
          label="AC"
        /><stats-text-field
          :input-stats.sync="lk"
          :need-stats="resLK"
          :buffed-stats="buffedLK"
          :extra-stats.sync="extraLK"
          label="LK"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import FarmingMonster from '~/components/FarmingMonster.vue'
import LkBuff from '~/components/LKBuff.vue'
import AcBuff from '~/components/ACBuff.vue'
import StatsTextField from '~/components/StatsTextField.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle } from '~/utils/monsters'
import {
  calcBlessingDamage,
  calcDamage,
  calcNeedStats,
  calcMonsterDef,
  calcLKBuffRatio,
  calcACBuffRatio
} from '~/utils/calc'
import SkillRatio from '~/utils/skillRatio'
import { Monster, ACBuffName, LKBuffName, Skill } from '~/types'

@Component({
  components: {
    FarmingMonster,
    LkBuff,
    AcBuff,
    StatsTextField,
    DamageArea
  }
})
export default class Blessing extends Vue {
  ac = 10000
  lk = 10000
  extraAC = 0
  extraLK = 0
  monster: Monster = isabelle

  ACBuff: ACBuffName[] = []
  LKBuff: LKBuffName[] = []
  selectedBlessingSkills: number[] = []

  BlessingSkills: Skill[] = [
    {
      value: 0,
      name: "Salamander's Blessing",
      attr: 'fireR',
      img: require('~/static/salamanderBlessing.gif')
    },
    {
      value: 1,
      name: "Raion's Blessing",
      attr: 'elecR',
      img: require('~/static/raionBlessing.gif')
    },
    {
      value: 2,
      name: "Gnome's Blessing",
      attr: 'earthR',
      img: require('~/static/gnomeBlessing.gif')
    },
    {
      value: 3,
      name: "Undine's Blessing",
      attr: 'waterR',
      img: require('~/static/undineBlessing.gif')
    },
    {
      value: 4,
      name: "Sylph's Blessing",
      attr: 'windR',
      img: require('~/static/sylphBlessing.gif')
    }
  ]

  get buffedAC() {
    return (
      Math.floor((this.ac - this.extraAC) * calcACBuffRatio(this.ACBuff)) +
      this.extraAC
    )
  }

  get buffedLK() {
    return (
      Math.floor((this.lk - this.extraLK) * calcLKBuffRatio(this.LKBuff)) +
      this.extraLK
    )
  }

  get damage() {
    let damage = 0
    this.selectedBlessingSkills.forEach((e: number) => {
      damage += calcDamage(
        calcMonsterDef(this.monster, 'magic'),
        this.monster[this.BlessingSkills[e].attr],
        calcBlessingDamage(this.buffedAC, this.buffedLK)
      )
    })
    return damage
  }

  get needStats() {
    let lowestIndex = 0
    const lowestResist = this.selectedBlessingSkills.reduce(
      (acc: number, idx: number) => {
        const monsterResist = this.monster[this.BlessingSkills[idx].attr]
        if (monsterResist < acc) {
          acc = monsterResist
          lowestIndex = idx
          return acc
        }
        return acc
      },
      500
    )

    const resistRatio = this.selectedBlessingSkills.reduce(
      (acc: number, idx: number) => {
        if (idx === lowestIndex) return acc
        const monsterResist = this.monster[this.BlessingSkills[idx].attr]
        if (monsterResist >= 100) return acc
        return acc + (100 - monsterResist) / (100 - lowestResist)
      },
      1
    )

    return calcNeedStats(
      this.monster.hp / resistRatio,
      calcMonsterDef(this.monster, 'magic'),
      lowestResist,
      SkillRatio.Blessing,
      this.buffedLK + this.buffedAC,
      0
    )
  }

  get resAC() {
    return Math.ceil(this.needStats / calcACBuffRatio(this.ACBuff))
  }

  get resLK() {
    return Math.ceil(this.needStats / calcLKBuffRatio(this.LKBuff))
  }
}
</script>
