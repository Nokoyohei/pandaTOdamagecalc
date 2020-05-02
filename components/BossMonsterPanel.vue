<template>
  <div>
    <v-layout column justify-center align-center>
      <v-tabs v-model="tab" fixed-tabs @change="changeSelectedMonster">
        <v-tab> Requiem Apocrypha </v-tab>
        <v-tab> Flashire Snake </v-tab>
        <v-tab> Easter Monster </v-tab>
        <v-tab> Master Mong </v-tab>
        <v-tab> Hecate </v-tab>
        <v-tab> Janus </v-tab>
        <v-tab> Chronos </v-tab>
        <v-tab> GM Kevin </v-tab>
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
import {
  requiem,
  snake,
  lucia,
  mong,
  hecate,
  janus,
  chronos,
  kevin
} from '~/utils/monsters'
import { BossMonster } from '~/types'

@Component({
  components: {
    ChartLine
  }
})
export default class BossMonsterPanel extends Vue {
  @Prop({ required: true })
  damage!: number

  @PropSync('monster', { required: true })
  _monster!: BossMonster

  datanum = 100
  tab = 0

  changeSelectedMonster() {
    this._monster = [
      requiem,
      snake,
      lucia,
      mong,
      hecate,
      janus,
      chronos,
      kevin
    ][this.tab]
  }

  // Limit the drawing range to 0-monster.hp*1.2 so that the drawing of the graph is not corrupted
  get dmgList() {
    return [
      ...makeArr(
        0,
        this._monster.hp * this._monster.gaugeNum * 1.2,
        this.datanum
      )
    ].map((x) => Math.round(x))
  }

  get hpBar() {
    const hpColor = ['purple', 'blue', 'green', 'yellow', 'red']
    return [...Array(this._monster.gaugeNum).keys()].map((d) => {
      return {
        label: `enemy's hp`,
        borderColor: hpColor[5 - this._monster.gaugeNum + d],
        data: new Array<number>(this.datanum).fill(this._monster.hp * (d + 1)),
        radius: 0,
        borderDash: [5],
        tension: 0
      }
    })
  }

  get chartData(): ChartData {
    return {
      labels: this.dmgList,
      datasets: [
        {
          label: 'your damage',
          // scatter
          data: [
            {
              // If you set a value that is not in dmgList, the graph will be corrupted, so set the value closest to the current damage as x
              x:
                this.dmgList.find((x) => x > this.damage) == null
                  ? this.dmgList[this.dmgList.length - 1]
                  : this.dmgList.find((x) => x > this.damage),
              // Set the maximum value to monster.hp*1.2 because the graph will be corrupted if damage is too large
              y:
                this.damage > this._monster.hp * this._monster.gaugeNum * 1.2
                  ? this._monster.hp * this._monster.gaugeNum * 1.2
                  : this.damage
            }
          ],
          // For usability, the color of the pointer will be green when damage is larger than monster.hp
          pointBackgroundColor:
            this.damage >= this._monster.hp * this._monster.gaugeNum
              ? 'green'
              : 'gray',
          type: 'scatter',
          radius: 8
        },
        ...this.hpBar,
        {
          // damage line (linear line)
          label: 'DAMAGE',
          data: this.dmgList,
          radius: 0,
          borderColor: 'orange'
        }
      ]
    }
  }

  private chartOption: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      display: false
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

  private chartStyles = {
    height: '100%',
    width: '100%'
  }
}
</script>
