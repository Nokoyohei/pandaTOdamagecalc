<template>
  <v-text-field v-model="input" :label="label" @keyup="parseInput">
    <template #prepend>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-help-circle-outline</v-icon>
        </template>
        <div>Enter the value before buffing</div>
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
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class StatsTextField extends Vue {
  @PropSync('inputStats', { required: true })
  _inputStats!: number

  @Prop({ required: true })
  label!: string

  @Prop()
  needStats?: number

  @Prop()
  buffedStats?: number

  input: string = ''

  created() {
    this.input = this._inputStats.toString()
  }

  parseInput() {
    console.log(this.input.match(/^[^\D]\d+\+*\d+$/g)?.length)
    if (this.input.match(/^[^\D]\d+\+*\d+$/g)?.length == null) return

    if (this.input.includes('+')) {
      const left = this.input.split('+')[0]
      const right = this.input.split('+')[1]
      this._inputStats = parseInt(left) + parseInt(right)
      return
    }

    this._inputStats = this.input.length === 0 ? 0 : parseInt(this.input)
  }
}
</script>
