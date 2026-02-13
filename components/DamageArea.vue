<template>
  <p>
    <span
      :class="`font-weight-bold text-center text-${textColor}-lighten-2 text-h5`"
    >
      {{ damage.toLocaleString() }}
    </span>
    <span
      :class="`font-weight-bold text-center text-${textColor}-lighten-2 text-h5`"
    >
      damage!
    </span>
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{
  damage: string | number
  color?: string
}>()

const textColor = computed(() => props.color ?? 'red')
</script>

<style scoped>
.damage-area {
  font-family: 'Jacques Francois Shadow', sans-serif !important;
}
</style>
