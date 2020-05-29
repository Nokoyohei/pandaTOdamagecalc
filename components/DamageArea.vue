<template>
  <p>
    <span
      :class="
        `font-weight-bold text-center ${textColor}--text text--lighten-2 headline`
      "
    >
      {{ damage.toLocaleString() }}
    </span>
    <span
      :class="
        `font-weight-bold text-center ${textColor}--text text--lighten-2 headline `
      "
    >
      damage!
    </span>
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class DamageArea extends Vue {
  @Prop({ required: true })
  damage!: string

  @Prop()
  color?: string

  get textColor() {
    if (this.color == null) return 'red'
    return this.color
  }
}
</script>

<style scoped>
.damage-area {
  font-family: 'Jacques Francois Shadow', sans-serif !important;
}
</style>
