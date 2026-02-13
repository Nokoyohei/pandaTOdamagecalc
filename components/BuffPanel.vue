<template>
  <div>
    <APBuff v-if="apBuffs != null" v-model:buff="apBuffs" />
    <MABuff v-if="maBuffs != null" v-model:buff="maBuffs" />
    <DABuff v-if="daBuffs != null" v-model:buff="daBuffs" />
    <LKBuff v-if="lkBuffs != null" v-model:buff="lkBuffs" />
    <ACBuff v-if="acBuffs != null" v-model:buff="acBuffs" />
    <HVBuff v-if="hvBuffs != null" v-model:buff="hvBuffs" />
    <ThrowBuff v-if="throwBuffs != null" v-model:buff="throwBuffs" />
    <DarkLoadBuff v-if="dlBuffs != null" v-model:buff="dlBuffs" />
  </div>
</template>

<script setup lang="ts">
import type {
  APBuffName,
  MABuffName,
  DABuffName,
  LKBuffName,
  ACBuffName,
  HVBuffName,
  ThrowBuffName,
  DLBuffName
} from '~/types'

const apBuffs = defineModel<APBuffName[]>('apBuffs')
const maBuffs = defineModel<MABuffName[]>('maBuffs')
const daBuffs = defineModel<DABuffName[]>('daBuffs')
const lkBuffs = defineModel<LKBuffName[]>('lkBuffs')
const acBuffs = defineModel<ACBuffName[]>('acBuffs')
const hvBuffs = defineModel<HVBuffName[]>('hvBuffs')
const throwBuffs = defineModel<ThrowBuffName[]>('throwBuffs')
const dlBuffs = defineModel<DLBuffName[]>('dlBuffs')
</script>
