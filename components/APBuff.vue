<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="pumpingHeart">
        <template #label>
          <img src="~/static/bh.gif" />
          Pumping Heart
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="adrenaline"
        ><template #label>
          <img src="~/static/adrenaline.gif" />
          Adrenaline
        </template></v-switch
      >
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
