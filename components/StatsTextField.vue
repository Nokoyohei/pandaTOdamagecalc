<template>
  <v-text-field v-model.number="_inputStats" :label="label">
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
}
</script>
