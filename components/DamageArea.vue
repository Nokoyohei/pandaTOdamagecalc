<template>
  <div class="damage-area my-2" :style="{ color: glowColor }">
    <div class="damage-label">{{ label }}</div>
    <div class="damage-number">
      {{ typeof damage === 'number' ? damage.toLocaleString() : damage }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  damage: string | number
  color?: string
  label?: string
}>()

const label = computed(() => props.label ?? 'damage')

const glowColor = computed(() => {
  const map: Record<string, string> = {
    red: '#ff5252',
    pink: '#ff80ab',
    'deep-orange': '#ff6e40',
    yellow: '#ffd600',
  }
  return map[props.color ?? 'red'] ?? '#ff5252'
})
</script>

<style scoped>
.damage-area {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  line-height: 1.1;
}

.damage-number {
  font-size: 2rem;
  font-weight: bold;
  text-shadow:
    0 0 8px currentColor,
    0 0 20px currentColor;
  letter-spacing: 2px;
}

.damage-label {
  font-size: 0.85rem;
  font-weight: bold;
  text-shadow:
    0 0 6px currentColor,
    0 0 14px currentColor;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
