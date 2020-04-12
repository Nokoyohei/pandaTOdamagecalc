<template>
  <v-row dense>
    <v-col cols="6" md="4">
      <v-switch
        v-model="_buff"
        label="Pumping Heart"
        value="pumpingHeart"
      ></v-switch>
    </v-col>
    <v-col cols="6" md="4">
      <v-switch
        v-model="_buff"
        label="Adrenaline"
        value="adrenaline"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class ApBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ('pumpingHeart' | 'adrenaline')[]
}
</script>
