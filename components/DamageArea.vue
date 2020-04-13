<template>
  <p class="font-weight-bold text-center red--text text--lighten-2 headline">
    {{ damage.toLocaleString() }} damage!!
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class DamageArea extends Vue {
  @Prop({ required: true })
  damage!: string
}
</script>
