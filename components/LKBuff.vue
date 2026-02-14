<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="luckySeven">
        <template #label>
          <img src="/lucky7.gif" />
          Lucky Seven
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlyLuckySeven">
        <template #label>
          <img src="/lucky7.gif" />
          Godly Lucky Seven
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="auraOfLuck">
        <template #label>
          <img src="/luckyday.gif" />
          Aura of Luck
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlyAuraOfLuck">
        <template #label>
          <img src="/luckyday.gif" />
          Godly Aura of Luck
        </template>
      </v-switch>
    </v-col>
    <v-col cols="12" md="8">
      <v-switch v-model="buff" value="firstAnniversary">
        <template #label>
          <img src="/1stanniv.gif" />
          1st Anniversary
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { LKBuffName } from '~/types'

const buff = defineModel<LKBuffName[]>('buff', { required: true })
</script>
