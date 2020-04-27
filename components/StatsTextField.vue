<template>
  <v-row>
    <v-col cols="12" :sm="3">
      <v-text-field
        v-if="_extraStats == 0 || _extraStats"
        v-model="extraStatsInput"
        color="indigo lighten-4"
        :label="`extra ${label}`"
        loading
        @keyup="changeExtraStatsField"
      >
        <template #progress>
          <v-progress-linear
            :value="100"
            color="indigo lighten-2"
            absolute
            height="3"
          ></v-progress-linear>
        </template>
        <template #prepend>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon color="indigo lighten-4" v-on="on"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <div>Enter the extra stats like set effect</div>
            <div>set effect, star power, scroll, etc. do not apply buffed</div>
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>

    <v-col cols="12" :sm="inputFieldCols">
      <v-text-field
        v-model="statsInput"
        :label="label"
        @keyup="changeStatsField"
      >
        <template #prepend>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">mdi-help-circle-outline</v-icon>
            </template>
            <div>Enter the value before buffing</div>
            <div>and after adding extra stats</div>
          </v-tooltip>
        </template>
        <template v-if="buffedStats" #append>
          <div class="font-weight-bold text-center blue--text text--lighten-2">
            = {{ buffedStats }}
          </div>
        </template>
        <template v-if="needStats > 0" #append-outer>
          <v-icon>mdi-arrow-right-bold</v-icon>
          <div class="font-weight-bold text-center red--text text--lighten-2">
            need more {{ needStats }}
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class StatsTextField extends Vue {
  @PropSync('inputStats', { required: true })
  _inputStats!: number

  @PropSync('extraStats')
  _extraStats?: number

  @Prop({ required: true })
  label!: string

  @Prop()
  needStats?: number

  @Prop()
  buffedStats?: number

  statsInput: string = ''
  extraStatsInput: string = ''

  inputFieldCols = this._extraStats == null ? 9 : 12

  created() {
    this.statsInput = this._inputStats.toString()
    this.extraStatsInput = this._extraStats?.toString() ?? ''
  }

  changeStatsField() {
    this._inputStats = this.parseInput(this.statsInput, this._inputStats)
  }

  changeExtraStatsField() {
    const defaultValue = this._extraStats ?? 0
    this._extraStats = this.parseInput(this.extraStatsInput, defaultValue)
  }

  parseInput(input: string, defaultValue: number) {
    // Only accept 'number' '+' 'number' or 'number'
    if (!/^[^\D]\d*(\+\d+)*$/g.test(input)) return defaultValue

    if (input.includes('+')) {
      const left = input.split('+')[0]
      const right = input.split('+')[1]
      return parseInt(left) + parseInt(right)
    }

    return input.length === 0 ? 0 : parseInt(input)
  }
}
</script>
