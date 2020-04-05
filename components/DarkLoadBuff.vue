<template>
  <v-row>
    <v-col cols="6" md="2">
      <v-switch
        v-model="_buff"
        label="Mist Of Mana"
        value="mistOfMana"
      ></v-switch>
    </v-col>
    <v-col cols="6" md="2">
      <v-switch
        v-model="_buff"
        label="Dark Commando"
        value="darkCommando"
      ></v-switch>
    </v-col>
    <v-col cols="6" md="2">
      <v-switch
        v-model="_buff"
        label="Blood Testament"
        value="bloodTestament"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class DarkLoadBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ('mistOfMana' | 'bloodTestament' | 'darkCommando')[]
}
</script>
