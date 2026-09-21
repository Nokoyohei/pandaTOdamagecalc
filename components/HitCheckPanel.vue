<template>
  <div v-if="hit" class="hit-check px-4 pb-3">
    <div class="text-center text-caption">
      <v-tooltip location="bottom">
        <template #activator="{ props: activatorProps }">
          <span v-bind="activatorProps">
            <span :class="sure ? 'text-green-lighten-2' : 'text-amber'" class="font-weight-bold">
              hit {{ hit.hitRate }}%
            </span>
            <span v-if="sure"> · sure hit</span>
            <span v-else>
              · sure hit needs buffed {{ statLabel }} ≥
              <span class="font-weight-bold text-amber">{{ hit.need.value.toLocaleString() }}</span>
              (now {{ hit.need.now.toLocaleString() }})
            </span>
          </span>
        </template>
        <div v-if="hit.attackType === 'physical'">
          hit% = clamp(⌊(AC − target HV × 2.5 + 40) × 1.2 × {{ hit.bonus }}⌋, 20, 100)
        </div>
        <div v-else-if="hit.attackType === 'gun'">
          miss when (LK − target LK + 80) &lt; rand() % 100 — sure hit at target LK + 19
        </div>
        <div v-else>hit% = clamp(⌊(LK − target LK + 90) × 1.2 × {{ hit.bonus }}⌋, 20, 100)</div>
        <div style="opacity: 0.7">
          {{ hit.bonus === 1 ? 'No ApplyRatio on gun attacks' : `ApplyRatio ${hit.bonus} of this skill's table` }}
        </div>
      </v-tooltip>
    </div>

    <!-- ページ側に入力欄が無いステータスはここで入力する（バフも一緒に） -->
    <template v-if="!hit.ownsStat">
      <StatsTextField
        v-model:input-stats="ctx.stats.value[stat]"
        v-model:extra-stats="ctx.extraStats.value[stat]"
        :need-stats="delta"
        :buffed-stats="hit.need.now"
        :label="statLabel"
        class="mt-2"
      />
      <LKBuff v-if="stat === 'lk'" v-model:buff="ctx.lkBuffs.value" />
      <ACBuff v-else v-model:buff="ctx.acBuffs.value" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { needInputDelta } from '~/utils/hitCheck'
import type { HitCheckContext } from '~/utils/hitCheck'

const props = defineProps<{ ctx: HitCheckContext }>()

const hit = computed(() => props.ctx.hitCheck.value)
const stat = computed(() => hit.value?.need.stat ?? 'lk')
const statLabel = computed(() => stat.value.toUpperCase())
const sure = computed(() => (hit.value?.hitRate ?? 0) >= 100)

// need 欄に出す「あといくら」（バフ前の入力値ベース）
const delta = computed(() => {
  if (!hit.value || sure.value) return 0
  const ratio = stat.value === 'lk' ? props.ctx.lkBuffRatio.value : props.ctx.acBuffRatio.value
  return needInputDelta(
    hit.value.need.value,
    props.ctx.stats.value[stat.value],
    props.ctx.extraStats.value[stat.value],
    ratio
  )
})
</script>
