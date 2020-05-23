<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="sixthSense">
        <template #label>
          <img src="~/static/Isp.png" />
          Sixth Sense
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="secondAnniversary">
        <template #label>
          <img src="~/static/2ndanniv.gif" />
          2nd Anniversary
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'
import { DABuffName } from '~/types'

@Component({})
export default class DaBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: DABuffName[]
}
</script>
