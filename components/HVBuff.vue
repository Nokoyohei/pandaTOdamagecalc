<template>
  <v-row dense>
    <v-col cols="6" md="6">
      <v-switch v-model="_buff" value="dodgeMaster">
        <template #label>
          <img src="~/static/su.gif" />
          Dodge Master
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class HvBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: 'dodgeMaster'[]
}
</script>
