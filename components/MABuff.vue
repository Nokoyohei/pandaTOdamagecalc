<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="mistOfMana">
        <template #label>
          <img src="/fw.gif" />
          Mist of Mana
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="buff" value="godlyMistOfMana">
        <template #label>
          <img src="/fw.gif" />
          Godly Mist of Mana
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { MABuffName } from '~/types'

const buff = defineModel<MABuffName[]>('buff', { required: true })
</script>
