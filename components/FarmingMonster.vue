<template>
  <div>
    <v-layout column justify-center align-center>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab> Caotic Isabelle </v-tab>
        <v-tab> Mermaid little </v-tab>
        <v-tab> Haunted Toilet </v-tab>
        <v-tab> Haunted Straw </v-tab>
      </v-tabs>
      <v-container fluid>
        <v-tabs-items>
          <v-card flat>
            <ChartLine
              :chart-data="chartData"
              :options="chartOption"
              :styles="chartStyles"
            />
          </v-card>
        </v-tabs-items>
      </v-container>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
import { makeArr, calcDamage } from '~/utils/calc'
import ChartLine from '~/components/ChartLine.vue'
import { isabelle, toilet, little, straw } from '~/utils/monsters'
import { attribute } from '~/types'

@Component({
  components: {
    ChartLine
  }
})
export default class FarmingMonster extends Vue {
  @Prop({ required: true })
  attack!: number

  @Prop({ required: true })
  attacktype!: 'magic' | 'physical'

  @Prop({ required: true })
  attribute!: attribute

  @Prop({ required: false })
  attacknum?: number

  datanum = 5
  tab = 0

  get monster() {
    switch (this.tab) {
      case 0:
        return isabelle
      case 1:
        return little
      case 2:
        return toilet
      case 3:
        return straw
      default:
        return isabelle
    }
  }

  get damage() {
    return calcDamage(
      this.monster,
      this.attack,
      this.attacktype,
      this.attribute,
      this.attacknum ?? 1
    )
  }

  get dmgList() {
    return [
      ...makeArr(0, this.damage, this.datanum),
      this.damage + this.damage / this.datanum
    ].map((x) => Math.round(x))
  }

  // チャートのデータ
  get chartData(): ChartData {
    return {
      // 横軸のラベル
      labels: this.dmgList,
      // データのリスト
      datasets: [
        {
          label: 'your damage',
          data: [{ x: this.dmgList[this.datanum - 1], y: this.damage }],
          borderColor: 'orange',
          pointBackgroundColor: 'orange',
          type: 'scatter',
          radius: 8
        },
        {
          label: `Isabelle's hp`,
          borderColor: 'red',
          data: new Array<number>(this.datanum + 1).fill(this.monster.hp),
          radius: 0
        },
        {
          label: 'DAMAGE',
          data: this.dmgList,
          radius: 0,
          borderColor: 'orange'
        }
      ]
    }
  }

  // チャートのオプション
  private chartOption: ChartOptions = {
    // アスペクト比を固定しないように変更
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom'
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

  // チャートのスタイル: <canvas>のstyle属性として設定
  private chartStyles = {
    height: '100%',
    width: '100%'
  }
}
</script>
