<template>
  <div>
    <v-layout column justify-center align-center>
      <v-tabs v-model="tab" fixed-tabs @change="changeSelectedMonster">
        <v-tab> Chaotic Isabelle </v-tab>
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
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
import { makeArr } from '~/utils/calc'
import ChartLine from '~/components/ChartLine.vue'
import { isabelle, toilet, little, straw } from '~/utils/monsters'
import { Monster } from '~/types'

@Component({
  components: {
    ChartLine
  }
})
export default class FarmingMonster extends Vue {
  @Prop({ required: true })
  damage!: number

  @PropSync('monster', { required: true })
  _monster!: Monster

  datanum = 100
  tab = 0

  changeSelectedMonster() {
    switch (this.tab) {
      case 0:
        this._monster = isabelle
        break
      case 1:
        this._monster = little
        break
      case 2:
        this._monster = toilet
        break
      case 3:
        this._monster = straw
        break
      default:
        return isabelle
    }
  }

  get dmgList() {
    return [
      ...makeArr(0, this._monster.hp + this._monster.hp * 0.2, this.datanum)
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
          data: [
            {
              x:
                this.dmgList.find((x) => x > this.damage) == null
                  ? this.dmgList[this.dmgList.length - 1]
                  : this.dmgList.find((x) => x > this.damage),
              y:
                this.damage > this._monster.hp * 1.2
                  ? this._monster.hp * 1.2
                  : this.damage,
              t: this.damage
            }
          ],
          pointBackgroundColor:
            this.damage >= this._monster.hp ? 'green' : 'gray',
          type: 'scatter',
          radius: 8
        },
        {
          label: `Isabelle's hp`,
          borderColor: 'red',
          data: new Array<number>(this.datanum + 1).fill(this._monster.hp),
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
    tooltips: {
      callbacks: {
        title: (_tooltipItem, _chart) => 'your damage',
        label: (_tooltipItem, _chart) => this.damage.toLocaleString()
      }
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
