<template>
  <div class="damage-area my-2" :style="{ color: glowColor }">
    <div class="damage-label">{{ label }}</div>
    <div class="damage-number" :class="{ 'damage-critical': isCritical }">
      {{ typeof damage === 'number' ? damage.toLocaleString() : damage }}
    </div>
    <div v-if="isOverflow" class="damage-effective">
      effective: {{ effectiveDamage.toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toInt32, INT32_MAX, EXTRA_DAMAGE_UNIT } from '~/utils/calc'

const props = defineProps<{
  damage: string | number
  color?: string
  label?: string
}>()

const label = computed(() => props.label ?? 'damage')

const isCritical = computed(() => props.label === 'critical')

const isOverflow = computed(() =>
  typeof props.damage === 'number' && props.damage > INT32_MAX + EXTRA_DAMAGE_UNIT
)

const effectiveDamage = computed(() =>
  typeof props.damage === 'number' ? toInt32(props.damage) : 0
)

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
  font-family: 'Chakra Petch', 'Roboto Mono', monospace;
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

.damage-critical {
  font-size: 2.4rem;
  text-shadow:
    0 0 8px currentColor,
    0 0 20px currentColor,
    0 0 40px currentColor;
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

.damage-effective {
  font-size: 0.85rem;
  font-weight: bold;
  color: #ff5252;
  text-shadow:
    0 0 6px #ff5252,
    0 0 14px #ff5252;
  margin-top: 2px;
}
</style>
