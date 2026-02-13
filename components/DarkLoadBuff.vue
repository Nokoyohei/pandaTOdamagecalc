<template>
  <v-row>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="darkCommando">
        <template #label>
          <img src="/darkcommando.gif" />
          Dark Commando
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="bloodTestament">
        <template #label>
          <img src="/bloodTestament.gif" />
          Blood Testament
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { DLBuffName } from '~/types'

const buff = defineModel<DLBuffName[]>('buff', { required: true })
</script>
