<template>
  <v-row dense>
    <v-col cols="6" md="4">
      <v-switch
        v-model="_buff"
        label="Lucky Seven"
        value="luckySeven"
      ></v-switch>
    </v-col>
    <v-col cols="6" md="4">
      <v-switch
        v-model="_buff"
        label="Aura of Luck"
        value="auraOfLuck"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class LkBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ('luckySeven' | 'auraOfLuck')[]
}
</script>
