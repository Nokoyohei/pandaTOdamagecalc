<template>
  <div>
    <v-card>
      <release-text
        v-for="(item, i) in displayNotes"
        :key="i"
        :date="item.date"
        :text="item.text"
        :color="i === 0 ? 'blue-grey darken-3' : 'default'"
      ></release-text>
      <v-list-item v-if="displayNotes.length !== releaseNotes.length">
        <v-btn
          block
          :ripple="false"
          text
          class="blue--text custom-button"
          @click="expandReleaseNote"
        >
          read more
        </v-btn>
      </v-list-item>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ReleaseText from '~/components/ReleaseText.vue'

@Component({
  components: {
    ReleaseText
  }
})
export default class ReleaseNote extends Vue {
  releaseNotes = [
    {
      date: '2020/04/29',
      text: 'Added 2nd Anniversary skill'
    },
    {
      date: '2020/04/28',
      text: 'Followed the Eqrthquake Blade nerf'
    },
    {
      date: '2020/04/22',
      text: 'Fixed the method of calculation buff'
    },
    {
      date: '2020/04/19',
      text: 'Changed the behavior of the graph'
    },
    {
      date: '2020/04/17',
      text: "Fixed Isabelle's HP 200k to 180k"
    },
    {
      date: '2020/04/16',
      text: "Added champion's blade page"
    },
    {
      date: '2020/04/15',
      text: 'Added 2nd Anniversary skill'
    },
    {
      date: '2020/04/29',
      text: 'Opened this site as a beta version'
    }
  ]

  displayNotes = this.releaseNotes.slice(0, 5)

  expandReleaseNote() {
    this.displayNotes = [
      ...this.displayNotes,
      // Load 5 items at a time (note the last item)
      ...this.releaseNotes.slice(
        this.displayNotes.length,
        Math.min(this.releaseNotes.length, this.displayNotes.length + 5)
      )
    ]
  }
}
</script>

<style>
.custom-button::before {
  color: transparent;
}
</style>
