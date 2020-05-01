<template>
  <v-app>
    <v-container fluid>
      <v-row class="text-center pb-5">
        <v-col cols="12" sm="12">
          <v-img :src="require('~/static/vampcastle.jpg')"> </v-img>
          <h1 class="display-2 font-weight-bold">What's this site?</h1>
        </v-col>
        <whats-this-site></whats-this-site>
      </v-row>
      <v-row class="grey darken-4 text-center py-5">
        <v-col cols="12" sm="12">
          <h1 class="display-1 font-weight-bold">How To Use</h1>
          <p>WIP</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" class="pt-10 text-center">
          <h1 class="display-1 font-weight-bold">Release Note</h1>
          <release-note></release-note>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ReleaseNote from '~/components/ReleaseNote.vue'
import WhatsThisSite from '~/components/WhatsThisSite.vue'

@Component({
  components: {
    ReleaseNote,
    WhatsThisSite
  }
})
export default class Index extends Vue {}
</script>

<style>
.title-text {
  font-family: 'Bellefair', serif !important;
}
</style>
