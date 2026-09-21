<template>
  <div class="hit-check text-center text-caption pb-3 px-2">
    <v-tooltip location="bottom">
      <template #activator="{ props: activatorProps }">
        <span v-bind="activatorProps">
          <span :class="sure ? 'text-green-lighten-2' : 'text-amber'" class="font-weight-bold">
            hit {{ hit.hitRate }}%
          </span>
          <span v-if="sure"> · sure hit</span>
          <span v-else>
            · sure hit needs {{ hit.need.stat }}
            <span class="font-weight-bold text-amber">{{ hit.need.value.toLocaleString() }}</span>
          </span>
        </span>
      </template>
      <div v-if="hit.attackType === 'physical'">
        hit% = clamp(⌊(AC − target HV × 2.5 + 40) × 1.2 × {{ hit.bonus }}⌋, 20, 100)
      </div>
      <div v-else-if="hit.attackType === 'gun'">
        miss when (LK − target LK + 80) &lt; rand() % 100 — sure hit at target LK + 19
      </div>
      <div v-else>
        hit% = clamp(⌊(LK − target LK + 90) × 1.2 × {{ hit.bonus }}⌋, 20, 100)
      </div>
      <div style="opacity: 0.7">{{ hit.bonus === 1 ? 'No ApplyRatio on gun attacks' : `ApplyRatio ${hit.bonus} of this skill's table` }} · buffed {{ hit.need.stat }} now {{ hit.need.now.toLocaleString() }} · needed value is before buffs</div>
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import type { HitCheck } from '~/utils/hitCheck'

const props = defineProps<{ hit: HitCheck }>()

const sure = computed(() => props.hit.hitRate >= 100)
</script>
