<template>
  <div class="monster-picker mx-auto my-3">
    <v-autocomplete
      v-model="selected"
      :items="MONSTER_CHOICES"
      item-title="title"
      item-value="id"
      label="Any monster (MonsterParamEx2)"
      placeholder="Search by name or ID"
      prepend-inner-icon="mdi-magnify"
      clearable
      density="compact"
      variant="outlined"
      hide-details
      @update:model-value="onSelect"
    />
    <div v-if="choice" class="d-flex align-center justify-center ga-4 mt-3">
      <img v-if="choice.image" :src="choice.image" :alt="choice.name" class="monster-picker__image" />
      <div class="text-center">
        <div class="font-weight-bold">{{ choice.name }}</div>
        <div class="text-caption" style="opacity: 0.7">
          Lv {{ choice.level }} · #{{ choice.id }} · {{ choice.row[19] + 1 }} HP gauge{{ choice.row[19] ? 's' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MONSTER_CHOICES, monsterFromRow } from '~/utils/monsterPick'
import type { BossMonster } from '~/types'

// 選んだ行のモンスターを親に渡す。タブ側で別のモンスターを選んだら null にして表示を消す
const selected = defineModel<number | null>('selected', { default: null })
const emit = defineEmits<{ pick: [monster: BossMonster] }>()

const choice = computed(() =>
  selected.value == null ? null : (MONSTER_CHOICES.find((c) => c.id === selected.value) ?? null)
)

function onSelect(id: number | null) {
  if (id == null) return
  const picked = MONSTER_CHOICES.find((c) => c.id === id)
  if (picked) emit('pick', monsterFromRow(picked.row))
}
</script>

<style scoped>
.monster-picker {
  max-width: 520px;
}

.monster-picker__image {
  max-height: 96px;
  max-width: 160px;
  image-rendering: pixelated;
}
</style>
