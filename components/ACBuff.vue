<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="bullsEye">
        <template #label>
          <img src="/be.gif" />
          Bull's Eye
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="eagleEye">
        <template #label>
          <img src="/hawk_eye.gif" />
          Eagle Eye
        </template>
      </v-switch>
    </v-col>
    <v-col cols="12" md="8">
      <v-switch v-model="buff" value="gunBooster">
        <template #label>
          <img src="/guns.gif" />
          Gun Booster
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { ACBuffName } from '~/types'

const buff = defineModel<ACBuffName[]>('buff', { required: true })
</script>
