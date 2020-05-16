<template>
  <div>
    <v-layout column justify-center align-center>
      <v-tabs
        v-model="tab"
        fixed-tabs
        center-active
        @change="changeSelectedMonster"
      >
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
      <damage-area :damage="damage" />
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'
import { ChartData, ChartOptions } from 'chart.js'
import { makeArr } from '~/utils/calc'
import ChartLine from '~/components/ChartLine.vue'
import DamageArea from '~/components/DamageArea.vue'
import { isabelle, toilet, little, straw } from '~/utils/monsters'
import { Monster } from '~/types'

@Component({
  components: {
    ChartLine,
    DamageArea
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
    this._monster = [isabelle, little, toilet, straw][this.tab]
  }

  // Limit the drawing range to 0-monster.hp*1.2 so that the drawing of the graph is not corrupted
  get dmgList() {
    return [...makeArr(0, this._monster.hp * 1.2, this.datanum)].map((x) =>
      Math.round(x)
    )
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
                this.damage > this._monster.hp * 1.2
                  ? this._monster.hp * 1.2
                  : this.damage
            }
          ],
          // For usability, the color of the pointer will be green when damage is larger than monster.hp
          pointBackgroundColor:
            this.damage >= this._monster.hp ? 'green' : 'gray',
          type: 'scatter',
          radius: 8
        },
        {
          // mosnter's HP line (horizontal line)
          label: `Isabelle's hp`,
          borderColor: 'red',
          data: new Array<number>(this.datanum).fill(this._monster.hp),
          radius: 0
        },
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
