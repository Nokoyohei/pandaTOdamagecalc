<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import Chart from 'chart.js'
import VueChart, { Line } from 'vue-chartjs'
const reactiveProp = VueChart.mixins.reactiveProp

@Component
export default class ChartLine extends mixins(Line, reactiveProp) {
  @Prop({ default: {} })
  chartData!: Chart.ChartData

  @Prop({ default: {} })
  options!: Chart.ChartOptions

  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
