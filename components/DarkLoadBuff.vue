<template>
  <v-row>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="darkCommando">
        <template #label>
          <img src="~/assets/darkcommando.gif" />
          Dark Commando
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="bloodTestament">
        <template #label>
          <img src="~/assets/bloodTestament.gif" />
          Blood Testament
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'

@Component({})
export default class DarkLoadBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ('bloodTestament' | 'darkCommando')[]
}
</script>
