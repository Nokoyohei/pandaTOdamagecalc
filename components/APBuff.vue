<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="pumpingHeart">
        <template #label>
          <img src="/bh.gif" />
          Pumping Heart
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="adrenaline">
        <template #label>
          <img src="/adrenaline.gif" />
          Adrenaline
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlyAdrenaline">
        <template #label>
          <img src="/adrenaline.gif" />
          Godly Adrenaline
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { APBuffName } from '~/types'

const buff = defineModel<APBuffName[]>('buff', { required: true })
</script>
