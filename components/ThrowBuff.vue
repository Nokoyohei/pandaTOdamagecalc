<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="precisePitch">
        <template #label>
          <img src="/Bribe.gif" />
          Precise Pitch
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { ThrowBuffName } from '~/types'

const buff = defineModel<ThrowBuffName[]>('buff', { required: true })
</script>
