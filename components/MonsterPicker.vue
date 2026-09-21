<template>
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
    class="monster-picker mx-auto my-3"
    @update:model-value="onSelect"
  />
</template>

<script setup lang="ts">
import { MONSTER_CHOICES, monsterFromRow } from '~/utils/monsterPick'
import type { BossMonster } from '~/types'

// 選んだ行のモンスターを親に渡す。タブ側で別のモンスターを選んだら null にして表示を消す
const selected = defineModel<number | null>('selected', { default: null })
const emit = defineEmits<{ pick: [monster: BossMonster] }>()

function onSelect(id: number | null) {
  if (id == null) return
  const choice = MONSTER_CHOICES.find((c) => c.id === id)
  if (choice) emit('pick', monsterFromRow(choice.row))
}
</script>

<style scoped>
.monster-picker {
  max-width: 520px;
}
</style>
