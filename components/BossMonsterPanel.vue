<template>
  <div>
    <div class="d-flex flex-column justify-center">
      <v-tabs
        v-model="tab"
        fixed-tabs
        centered
        center-active
        bg-color="#424242"
        hide-slider
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
      <div class="text-center">
        <DamageArea v-if="damageAreaMessage.length === 0" :damage="damage" />
        <DamageArea
          v-for="(mes, i) in damageAreaMessage"
          v-else
          :key="mes"
          :damage="mes"
          :color="textColor[i]"
        />
      </div>
      <div v-if="debuff" class="text-center">
        debuff:
        <v-btn-toggle
          v-model="debuff"
          multiple
          borderless
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
  chronos
} from '~/utils/monsters'
import type { BossMonster, DebuffName, skillPanel } from '~/types'

const props = defineProps<{
  damage: number
  damageString?: string[] | string
  debuffSkillsDef?: skillPanel[]
}>()

const monster = defineModel<BossMonster>('monster', { required: true })
const debuff = defineModel<DebuffName[]>('debuff')

const datanum = 100
const tab = ref(0)

const textColor = ['pink', 'red', 'deep-orange']

const tabContents = [
  {
    srcimg: '/torobbie.gif',
    height: '60%',
    title: 'Torobbie',
    alt: 'TOROBBIE'
  },
  {
    srcimg: '/requiem.gif',
    height: '140%',
    title: 'Requiem Apocrypha',
    alt: 'REQUIEM APOCRYPHA'
  },
  {
    srcimg: '/predator.gif',
    height: '160%',
    title: 'Predator G',
    alt: 'PREDATOR G'
  },
  {
    srcimg: '/mong.gif',
    height: '120%',
    title: 'Master Mong',
    alt: 'MASTER MONG'
  },
  {
    srcimg: '/koiosu.gif',
    height: '160%',
    title: 'Koiosu',
    alt: 'KOIOSU'
  },
  {
    srcimg: '/madray.gif',
    height: '160%',
    title: 'Mad Ray',
    alt: 'MAD RAY'
  },
  {
    srcimg: '/gm_kevin.gif',
    height: '120%',
    title: 'GM Kevin',
    alt: 'GM KEVIN'
  },
  {
    srcimg: '/chronos.gif',
    height: '160%',
    title: 'Chronos',
    alt: 'CHRONOS'
  }
]

const damageAreaMessage = computed(() => {
  if (props.damageString == null) return []
  return [props.damageString].flat()
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
    chronos
  ][tab.value]
}

const dmgList = computed(() =>
  [
    ...makeArr(
      0,
      monster.value.hp * monster.value.gaugeNum * 1.2,
      datanum
    )
  ].map((x) => Math.round(x))
)

const hpBar = computed(() => {
  const hpColor = ['purple', 'blue', 'green', 'yellow', 'red']
  return [...Array(monster.value.gaugeNum).keys()].map((d) => ({
    label: `enemy's hp`,
    borderColor: hpColor[5 - monster.value.gaugeNum + d],
    data: new Array<number>(datanum).fill(monster.value.hp * (d + 1)),
    pointRadius: 0,
    borderDash: [5] as number[],
    tension: 0
  }))
})

const chartData = computed<ChartData<'line'>>(() => ({
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
            props.damage > monster.value.hp * monster.value.gaugeNum * 1.2
              ? monster.value.hp * monster.value.gaugeNum * 1.2
              : props.damage
        }
      ],
      pointBackgroundColor:
        props.damage >= monster.value.hp * monster.value.gaugeNum
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
      borderColor: 'orange'
    }
  ]
}))

const chartOption = computed<ChartOptions<'line'>>(() => ({
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

<style scoped>
.v-tab--active {
  background: #616161;
  border-top: solid 2px #90caf9;
}
</style>
