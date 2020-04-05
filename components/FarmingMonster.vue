<template>
  <div>
    <h1>Gravity Crash</h1>

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
            <v-text-field v-model="x" label="MA"></v-text-field>
          </v-card>
        </v-tabs-items>
      </v-container>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
import ChartLine from '~/components/ChartLine.vue'
import { isabelle, toilet, little, straw } from '~/utils/monsters'

@Component({
  components: {
    ChartLine
  }
})
export default class Index extends Vue {
  x = 1000
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

  get dmg() {
    return (
      ((100 - this.monster.darkR) / 100) *
      ((this.x * 1200) / 10 - this.monster.md * 0.75)
    )
  }

  makeArr = (startValue: number, stopValue: number, cardinality: number) => {
    const arr = []
    const step = (stopValue - startValue) / (cardinality - 1)
    for (let i = 0; i < cardinality; i++) {
      arr.push(startValue + step * i)
    }
    return arr
  }

  get dmgList() {
    return [
      ...this.makeArr(0, this.dmg, this.datanum),
      this.dmg + this.dmg / this.datanum
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
          data: [{ x: this.dmgList[this.datanum - 1], y: this.dmg }],
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
