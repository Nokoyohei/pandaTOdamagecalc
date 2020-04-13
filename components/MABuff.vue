<template>
  <v-row dense>
    <v-col cols="6" md="6">
      <v-switch v-model="_buff" value="mistOfMana">
        <template #label>
          <img src="~/assets/fw.gif" />
          Mist of Mana
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class MaBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: 'mistOfMana'[]
}
</script>
