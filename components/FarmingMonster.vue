<template>
  <div class="mb-6">
    <div class="d-flex flex-column justify-center">
      <v-tabs
        v-model="tab"
        fixed-tabs
        centered
        center-active
        bg-color="#424242"
        hide-slider
        height="80"
        @update:model-value="changeSelectedMonster"
      >
        <v-tooltip v-for="content in tabContents" :key="content.title" location="bottom">
          <template #activator="{ props: activatorProps }">
            <v-tab v-bind="activatorProps">
              <img
                :src="content.srcimg"
                :height="content.height"
                :alt="content.alt"
              />
            </v-tab>
          </template>
          {{ content.title }}
        </v-tooltip>
      </v-tabs>
      <v-card color="surface" rounded="lg" elevation="2">
        <ChartLine
          :chart-data="chartData"
          :options="chartOption"
          :styles="chartStyles"
        />
        <div class="damage-bar d-flex justify-center align-center flex-wrap ga-8">
          <DamageArea :damage="damage" />
          <v-divider v-if="critDamage != null" vertical class="damage-divider" />
          <DamageArea v-if="critDamage != null" :damage="critDamage" color="yellow" label="critical" />
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { makeArr } from '~/utils/calc'
import { torobbie, toilet, cora, werepot, tantalos } from '~/utils/monsters'
import type { Monster } from '~/types'

const props = defineProps<{
  damage: number
  critDamage?: number
}>()

const monster = defineModel<Monster>('monster', { required: true })

const datanum = 100
const tab = ref(0)

const tabContents = [
  {
    srcimg: '/torobbie.gif',
    height: '30',
    title: 'Torobbie',
    alt: 'TOROBBIE'
  },
  {
    srcimg: '/mac.gif',
    height: '60',
    title: 'Haunted Toilet',
    alt: 'HAUNTED TOILET'
  },
  {
    srcimg: '/cora.gif',
    height: '60',
    title: 'Cora Merrymaker',
    alt: 'CORA MERRYMAKER'
  },
  {
    srcimg: '/werepot.gif',
    height: '60',
    title: 'Werepot M4',
    alt: 'WEREPOT M4'
  },
  {
    srcimg: '/tantlus.gif',
    height: '60',
    title: 'Tartarus Mobs',
    alt: 'TARTARUS MOBS'
  }
]

function changeSelectedMonster() {
  monster.value = [torobbie, toilet, cora, werepot, tantalos][tab.value]
}

const dmgList = computed(() =>
  [...makeArr(0, monster.value.hp * 1.2, datanum)].map((x) => Math.round(x))
)

const killLineAnnotation = computed(() => ({
  killLine: {
    type: 'line' as const,
    yMin: monster.value.hp,
    yMax: monster.value.hp,
    borderColor: 'rgba(255, 82, 82, 0.7)',
    borderWidth: 2,
    borderDash: [6, 4],
    label: {
      display: true,
      content: 'ONE SHOT LINE',
      position: 'start' as const,
      backgroundColor: 'rgba(255, 82, 82, 0.8)',
      color: '#fff',
      font: { size: 11, weight: 'bold' as const },
      padding: 4
    }
  }
}))

const chartData = computed<ChartData>(() => ({
  labels: dmgList.value,
  datasets: [
    {
      label: 'your damage',
      data: [
        {
          x:
            dmgList.value.find((x) => x > props.damage) == null
              ? dmgList.value[dmgList.value.length - 1]
              : dmgList.value.find((x) => x > props.damage)!,
          y:
            props.damage > monster.value.hp * 1.2
              ? monster.value.hp * 1.2
              : props.damage
        }
      ],
      pointBackgroundColor:
        props.damage >= monster.value.hp ? 'green' : 'gray',
      type: 'scatter' as const,
      pointRadius: 8
    },
    {
      label: `Isabelle's hp`,
      borderColor: 'red',
      data: new Array<number>(datanum).fill(monster.value.hp),
      pointRadius: 0
    },
    {
      label: 'DAMAGE',
      data: dmgList.value,
      pointRadius: 0,
      borderColor: 'orange',
      borderWidth: 3,
      fill: true,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return 'rgba(255, 165, 0, 0.1)'
        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)')
        return gradient
      }
    }
  ]
}))

const chartOption = computed<ChartOptions>(() => ({
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      callbacks: {
        title: () => 'your damage',
        label: () => props.damage.toLocaleString()
      }
    },
    annotation: {
      annotations: killLineAnnotation.value
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(100, 181, 246, 0.1)'
      },
      ticks: {
        color: '#90caf9'
      }
    }
  }
}))

const chartStyles = {
  height: '400px',
  width: '100%'
}
</script>

