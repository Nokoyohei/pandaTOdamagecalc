<template>
  <div>
    <v-card>
      <release-text
        v-for="(item, i) in displayNotes"
        :key="i"
        :date="item.date"
        :texts="item.texts"
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
      date: '2021/05/14',
      texts: ['Changed to remember info of the stats you entered.']
    },
    {
      date: '2021/05/11',
      texts: ['Apply blessings nerf (maybe unstable).']
    },
    {
      date: '2021/04/21',
      texts: ['1. Added Ixion', '2. Added TeslaField skill to farming panel']
    },
    {
      date: '2021/04/16',
      texts: [
        '1. Apply buffed/nerfed skills',
        '2. Apply nerfed monster resistance'
      ]
    },
    {
      date: '2021/04/14',
      texts: [
        '1. Apply buffed/nerfed skills',
        '2. Added following skills to farming panel',
        'StaffofThunder/DeadlyFen/Earthquake/TornadoBlast'
      ]
    },
    {
      date: '2021/03/28',
      texts: [
        '1. Apply buffed skills',
        '2. Added following skills to farming panel',
        'TidalSlash/SonicSlash'
      ]
    },
    {
      date: '2021/03/13',
      texts: ['Apply buffed skills']
    },
    {
      date: '2020/08/16',
      texts: [
        '1. Added following skills',
        'SarpScream/OnePair/2HitCombo/DoubleShot/PowerShot'
      ]
    },
    {
      date: '2020/06/18',
      texts: ['1. Fixed some farming monsters stats']
    },
    {
      date: '2020/06/09',
      texts: [
        '1. Added following monsters',
        'PictureGhost(to farming)/Ed(to Boss)'
      ]
    },
    {
      date: '2020/05/29',
      texts: [
        '1. Added following skills to boss panel',
        'TidalSlash/SonicSlash/TempestStrike/GaleStrike',
        '2. Changed the layout slightly'
      ]
    },
    {
      date: '2020/05/25',
      texts: [
        '1. Added following skills',
        'RagingStorm/EarthquakeBlade(to Boss)',
        '2. Added MadRay/Koiosu/OutragedRequiem to boss panel',
        '3. Fixed the behavior of shield breaker'
      ]
    },
    {
      date: '2020/05/24',
      texts: [
        '1. Added following skills to boss panel',
        'ChainOfKnives/SuddenAttack/PoisonAssault',
        'Note: Poison Assault is only implemented for poison damage. The unpoisoned damage is about 70% of Chain of Knives'
      ]
    },
    {
      date: '2020/05/17',
      texts: [
        "1. We've solved the mysterious damage phenomenon!!!!",
        'You should be able to calculate the damage accurately, albeit with some error',
        'Note: the complex formula is not fully simulated and there is a deviation in the calculation of necessary status for some monsters',
        '2. Added following skills',
        'StaffOfAgony'
      ]
    },
    {
      date: '2020/05/10',
      texts: [
        '1. Added following skills',
        'WindBlade/CleavingTerra/ElectroAttack/Blessings',
        '2. Added Boss contents(but it is not yet implemented because there is not enough verification on the phenomenon that damage increases greatly when a certain amount of damage is dealt)',
        '3. Added following skills because of Boss contents implemented',
        'FlamingFist/Scythe/MagicalSoul/GravityCrash(for boss)/CelestialStrike(for boss)'
      ]
    },
    {
      date: '2020/05/01',
      texts: [
        '1. Added Celestial Strike skill',
        '2. Renewed top page',
        '3. Renewed sidebar (still WIP on boss column)'
      ]
    },
    {
      date: '2020/04/29',
      texts: [
        '1. Added 2nd Anniversary skill',
        '2. Followed the Earthquake Blade nerf'
      ]
    },
    {
      date: '2020/04/28',
      texts: 'Followed the Earthquake Blade nerf'
    },
    {
      date: '2020/04/22',
      texts: 'Fixed the method of calculation buff'
    },
    {
      date: '2020/04/19',
      texts: 'Changed the behavior of the graph'
    },
    {
      date: '2020/04/17',
      texts: "Fixed Isabelle's HP 200k to 180k"
    },
    {
      date: '2020/04/16',
      texts: "Added champion's blade page"
    },
    {
      date: '2020/04/15',
      texts: 'Added 2nd Anniversary skill'
    },
    {
      date: '2020/04/09',
      texts: 'Opened this site as a beta version'
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
