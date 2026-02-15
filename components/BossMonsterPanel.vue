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
          <div>
            <DamageArea v-if="damageAreaMessage.length === 0" :damage="damage" />
            <DamageArea
              v-for="(mes, i) in damageAreaMessage"
              v-else
              :key="mes"
              :damage="mes"
              :color="textColor[i]"
            />
          </div>
          <v-divider v-if="critDamage != null" vertical class="damage-divider" />
          <div v-if="critDamage != null">
            <DamageArea v-if="critDamageAreaMessage.length === 0" :damage="critDamage" color="yellow" label="critical" />
            <DamageArea
              v-for="mes in critDamageAreaMessage"
              v-else
              :key="mes"
              :damage="mes"
              color="yellow"
              label="critical"
            />
          </div>
        </div>
      </v-card>
      <div v-if="debuff" class="text-center">
        debuff:
        <v-btn-toggle
          v-model="debuff"
          multiple
          bg-color="black"
        >
          <v-tooltip v-for="skill in debuffSkillsDef" :key="skill.name" location="bottom">
            <template #activator="{ props: activatorProps }">
              <v-btn :value="skill.value" v-bind="activatorProps">
                <img :src="skill.img" />
              </v-btn>
            </template>
            <span>{{ skill.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { makeArr } from '~/utils/calc'
import {
  requiem,
  bossTorrobie,
  predator,
  mong,
  kevin,
  madray,
  koiosu,
  chronos,
  requiemHarbinger,
  rosaspina,
  punisherRosaspina,
  trueGodKoiosu,
  ed
} from '~/utils/monsters'
import type { Monster, BossMonster, DebuffName, skillPanel } from '~/types'

const props = defineProps<{
  damage: number
  damageString?: string[] | string
  debuffSkillsDef?: skillPanel[]
  critDamage?: number
  critDamageString?: string[] | string
}>()

const monster = defineModel<Monster | BossMonster>('monster', { required: true })
const debuff = defineModel<DebuffName[]>('debuff')

const boss = computed(() => monster.value as BossMonster)

const datanum = 100
const tab = ref(0)

const textColor = ['pink', 'red', 'deep-orange']

const tabContents = [
  {
    srcimg: '/torobbie.gif',
    height: '30',
    title: 'Torobbie',
    alt: 'TOROBBIE'
  },
  {
    srcimg: '/requiem.gif',
    height: '68',
    title: 'Requiem Apocrypha',
    alt: 'REQUIEM APOCRYPHA'
  },
  {
    srcimg: '/predator.gif',
    height: '76',
    title: 'Predator G',
    alt: 'PREDATOR G'
  },
  {
    srcimg: '/mong.gif',
    height: '60',
    title: 'Master Mong',
    alt: 'MASTER MONG'
  },
  {
    srcimg: '/koiosu.gif',
    height: '76',
    title: 'Koiosu',
    alt: 'KOIOSU'
  },
  {
    srcimg: '/madray.gif',
    height: '76',
    title: 'Mad Ray',
    alt: 'MAD RAY'
  },
  {
    srcimg: '/gm_kevin.gif',
    height: '60',
    title: 'GM Kevin',
    alt: 'GM KEVIN'
  },
  {
    srcimg: '/chronos.gif',
    height: '76',
    title: 'Chronos',
    alt: 'CHRONOS'
  },
  {
    srcimg: '/ed.gif',
    height: '76',
    title: 'Ed',
    alt: 'ED'
  },
  {
    srcimg: '/requiem.gif',
    height: '68',
    title: 'Requiem Harbinger G',
    alt: 'REQUIEM HARBINGER G'
  },
  {
    srcimg: '/rosaspina.gif',
    height: '76',
    title: 'Mystical Rosaspina',
    alt: 'MYSTICAL ROSASPINA'
  },
  {
    srcimg: '/rosaspina.gif',
    height: '76',
    title: 'Punisher Rosaspina',
    alt: 'PUNISHER ROSASPINA'
  },
  {
    srcimg: '/koiosu.gif',
    height: '76',
    title: 'True God of Steel Koiosu',
    alt: 'TRUE GOD OF STEEL KOIOSU'
  }
]

const damageAreaMessage = computed(() => {
  if (props.damageString == null) return []
  return [props.damageString].flat()
})

const critDamageAreaMessage = computed(() => {
  if (props.critDamageString == null) return []
  return [props.critDamageString].flat()
})

function changeSelectedMonster() {
  monster.value = [
    bossTorrobie,
    requiem,
    predator,
    mong,
    koiosu,
    madray,
    kevin,
    chronos,
    ed,
    requiemHarbinger,
    rosaspina,
    punisherRosaspina,
    trueGodKoiosu,
  ][tab.value]
}

const totalHp = computed(() => monster.value.hp * boss.value.gaugeNum)

const dmgList = computed(() =>
  [
    ...makeArr(
      0,
      totalHp.value * 1.2,
      datanum
    )
  ].map((x) => Math.round(x))
)

const hpBar = computed(() => {
  const hpColor = ['purple', 'blue', 'green', 'yellow', 'red']
  return [...Array(boss.value.gaugeNum).keys()].map((d) => ({
    label: `enemy's hp`,
    borderColor: hpColor[5 - boss.value.gaugeNum + d],
    data: new Array<number>(datanum).fill(monster.value.hp * (d + 1)),
    pointRadius: 0,
    borderDash: [5] as number[],
    tension: 0
  }))
})

const killLineAnnotations = computed(() => {
  const annotations: Record<string, any> = {}
  annotations['killLine'] = {
    type: 'line',
    yMin: totalHp.value,
    yMax: totalHp.value,
    borderColor: 'rgba(255, 82, 82, 0.7)',
    borderWidth: 2,
    borderDash: [6, 4],
    label: {
      display: true,
      content: 'ONE SHOT LINE',
      position: 'start',
      backgroundColor: 'rgba(255, 82, 82, 0.8)',
      color: '#fff',
      font: { size: 11, weight: 'bold' },
      padding: 4
    }
  }
  return annotations
})

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
            props.damage > totalHp.value * 1.2
              ? totalHp.value * 1.2
              : props.damage
        }
      ],
      pointBackgroundColor:
        props.damage >= totalHp.value
          ? 'green'
          : 'gray',
      type: 'scatter' as const,
      pointRadius: 8
    },
    ...hpBar.value,
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
      annotations: killLineAnnotations.value
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

