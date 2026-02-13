<template>
  <v-row class="mb-2">
    <v-col cols="12" :sm="3">
      <v-text-field
        v-if="extraStatsModel != null"
        v-model="extraStatsInput"
        color="indigo-lighten-4"
        :label="`extra ${label}`"
        @keyup="changeExtraStatsField"
      >
        <template #prepend>
          <v-tooltip location="top">
            <template #activator="{ props: activatorProps }">
              <v-icon color="indigo-lighten-4" v-bind="activatorProps"
                >mdi-help-circle-outline</v-icon
              >
            </template>
            <div>Enter the extra stats like set effect</div>
            <div>star power, scroll, etc. do not apply buffed</div>
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>

    <v-col cols="12" :sm="inputFieldCols">
      <v-text-field
        v-model="statsInput"
        :label="label"
        @keyup="changeStatsField"
      >
        <template #prepend>
          <v-tooltip location="top">
            <template #activator="{ props: activatorProps }">
              <v-icon v-bind="activatorProps">mdi-help-circle-outline</v-icon>
            </template>
            <div>Enter the value before buffing</div>
            <div>and after adding extra stats</div>
          </v-tooltip>
        </template>
        <template v-if="buffedStats" #append>
          <div class="font-weight-bold text-center text-blue-lighten-2">
            = {{ buffedStats.toLocaleString() }}
          </div>
        </template>
        <template v-if="needStats != null && needStats > 0" #append-inner>
          <v-icon>mdi-arrow-right-bold</v-icon>
          <div class="font-weight-bold text-center text-red-lighten-2">
            need more {{ needStats.toLocaleString() }}
          </div>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  needStats?: number
  buffedStats?: number
}>()

const inputStatsModel = defineModel<number>('inputStats', { required: true })
const extraStatsModel = defineModel<number>('extraStats')

const statsInput = ref('')
const extraStatsInput = ref('')
const inputFieldCols = extraStatsModel.value == null ? 12 : 9

onMounted(() => {
  statsInput.value = inputStatsModel.value.toString()
  extraStatsInput.value = extraStatsModel.value?.toString() ?? ''
})

function parseInput(input: string, defaultValue: number) {
  if (!/^[^\D]\d*(\+\d+)*$/g.test(input)) return defaultValue
  if (input.includes('+')) {
    const left = input.split('+')[0]
    const right = input.split('+')[1]
    return parseInt(left) + parseInt(right)
  }
  return input.length === 0 ? 0 : parseInt(input)
}

function changeStatsField() {
  inputStatsModel.value = parseInput(statsInput.value, inputStatsModel.value)
}

function changeExtraStatsField() {
  const defaultValue = extraStatsModel.value ?? 0
  extraStatsModel.value = parseInput(extraStatsInput.value, defaultValue)
}
</script>
