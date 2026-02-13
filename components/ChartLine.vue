<template>
  <div :style="styles">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ScatterController,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  ScatterController,
  Title,
  Tooltip,
  Legend
)

defineProps<{
  chartData: ChartData<'line'>
  options: ChartOptions<'line'>
  styles?: Record<string, string>
}>()
</script>
