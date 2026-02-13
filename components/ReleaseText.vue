<template>
  <div :class="color">
    <v-list-item class="text-left">
      <div>
        <div class="text-subtitle-2 mb-4 text-blue-grey">{{ date }}</div>
        <v-list-item-title v-for="text in [texts].flat()" :key="text">
          <p class="text-wrap">{{ text }}</p>
        </v-list-item-title>
      </div>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date: string
  texts: string | string[]
  color: string
}>()
</script>
