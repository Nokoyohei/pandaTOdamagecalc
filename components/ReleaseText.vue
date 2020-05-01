<template>
  <div :class="color">
    <v-list-item two-line class="text-left">
      <v-list-item-content>
        <div class="subtitle-2 mb-4 blue-grey--text">{{ date }}</div>
        <v-list-item-title v-for="text in [texts].flat()" :key="text">{{
          text
        }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class ReleaseText extends Vue {
  @Prop()
  date!: string

  @Prop()
  texts!: string | string[]

  @Prop()
  color!: string
}
</script>
