<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="dodgeMaster">
        <template #label>
          <img src="/su.gif" />
          Dodge Master
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlyDodgeMaster">
        <template #label>
          <img src="/su.gif" />
          Godly Dodge Master
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { HVBuffName } from '~/types'

const buff = defineModel<HVBuffName[]>('buff', { required: true })
</script>
