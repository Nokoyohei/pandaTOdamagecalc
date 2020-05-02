<template>
  <v-col cols="12" sm="12">
    <v-row align-content="center">
      <v-col class="mt-n5">
        <p class="display-1 font-weight-light text-center">
          On this site you can calculate how much status
        </p>
        <p class="display-1 font-weight-light text-center mt-n5">
          you need to kill a monster for money farming!
        </p>
      </v-col>
      <v-col cols="12" sm="12" class="mt-3">
        <p class="text-center headline red--text text--lighten-3">
          Have you ever had this experience?
        </p>
      </v-col>
      <v-col cols="12" sm="12" class="mt-n5">
        <v-icon>mdi-cash-usd-outline</v-icon>
        <p class="text-center font-weight-light">
          "I don't know which avatar skill will allow me to OHKO enemies, but
          it's too expensive to try..."
        </p>
        <v-icon>mdi-sword</v-icon>
        <p class="text-center font-weight-light">
          "I want to be able to OHKO with 2 skills, but I don't know how much I
          should narrow down the status"
        </p>
        <p class="headline  red--text text--lighten-2">
          These worries can be solved on this site!
        </p>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class WhatsThisSite extends Vue {}
</script>
