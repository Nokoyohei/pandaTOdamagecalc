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
      <v-card flat>
        <ChartLine
          :chart-data="chartData"
          :options="chartOption"
          :styles="chartStyles"
        />
      </v-card>
      <div class="d-flex justify-center align-center flex-wrap ga-4">
        <DamageArea :damage="damage" />
        <v-divider v-if="critDamage != null" vertical class="align-self-stretch" />
        <DamageArea v-if="critDamage != null" :damage="critDamage" color="yellow" label="critical" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { makeArr } from '~/utils/calc'
import { torobbie, toilet, cora } from '~/utils/monsters'
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
  }
]

function changeSelectedMonster() {
  monster.value = [torobbie, toilet, cora][tab.value]
}

const dmgList = computed(() =>
  [...makeArr(0, monster.value.hp * 1.2, datanum)].map((x) => Math.round(x))
)

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
      borderColor: 'orange'
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
      callbacks: {
        title: () => 'your damage',
        label: () => props.damage.toLocaleString()
      }
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      beginAtZero: true
    }
  }
}))

const chartStyles = {
  height: '400px',
  width: '100%'
}
</script>

