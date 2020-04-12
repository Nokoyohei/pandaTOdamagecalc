<template>
  <v-row dense>
    <v-col cols="6" md="6">
      <v-switch
        v-model="_buff"
        label="Dodge Master"
        value="dodgeMaster"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class HvBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: 'DodgeMaster'[]
}
</script>
