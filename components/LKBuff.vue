<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="luckySeven">
        <template #label>
          <img src="~/static/lucky7.gif" />
          Lucky Seven
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="auraOfLuck">
        <template #label>
          <img src="~/static/luckyday.gif" />
          Aura of Luck
        </template>
      </v-switch>
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
