<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="sixthSense">
        <template #label>
          <img src="/Isp.png" />
          Sixth Sense
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlySixthSense">
        <template #label>
          <img src="/Isp.png" />
          Godly Sixth Sense
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="secondAnniversary">
        <template #label>
          <img src="/2ndanniv.gif" />
          2nd Anniversary
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { DABuffName } from '~/types'

const buff = defineModel<DABuffName[]>('buff', { required: true })
</script>
