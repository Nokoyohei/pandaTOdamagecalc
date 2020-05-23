<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="precisePitch">
        <template #label>
          <img src="~/static/Bribe.gif" />
          Precise Pitch
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'
import { ThrowBuffName } from '~/types'

@Component({})
export default class ThrowBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ThrowBuffName[]
}
</script>
