<template>
  <v-card class="mb-4 pa-4">
    <v-card-title class="text-subtitle-1 pa-0 pb-2">
      Base Power Adjustment
    </v-card-title>
    <v-slider
      v-model="basePower"
      :min="0"
      :max="maxPower"
      :step="step"
      thumb-label="always"
      label="Base Power"
      class="mt-4"
    >
      <template v-slot:append>
        <v-text-field
          v-model.number="basePower"
          type="number"
          :min="0"
          :max="maxPower"
          style="width: 80px"
          density="compact"
          hide-details
        />
      </template>
    </v-slider>
  </v-card>
</template>

<script setup lang="ts">
const basePower = defineModel<number>({ required: true })

const props = defineProps<{
  defaultPower: number
}>()

const maxPower = computed(() => Math.ceil(props.defaultPower * 6))

const step = computed(() => {
  if (props.defaultPower < 10) return 0.5
  if (props.defaultPower < 100) return 1
  return 10
})
</script>
