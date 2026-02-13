<template>
  <v-app>
    <v-navigation-drawer
      expand-on-hover
      permanent
      v-model:rail="rail"
      width="300"
    >
      <v-list-item>
        <template #prepend>
          <img :src="currentHeader.img" height="100" />
        </template>
        <v-list-item-title> {{ currentHeader.title }} </v-list-item-title>
        <template #append>
          <v-divider vertical />
          <img
            :src="otherHeader.img"
            style="cursor: pointer;"
            @click="menuChange"
          />
        </template>
      </v-list-item>
      <v-expansion-panels v-model="farmingPanel" multiple variant="accordion">
        <v-expansion-panel v-for="item in currentMenu" :key="item.title">
          <v-expansion-panel-title>
            <div>
              <img :src="item.imgsrc" />
              <span :hidden="rail">{{ item.title }}</span>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <v-list-item
                v-for="skill in item.skills"
                :key="skill.title"
                :to="skill.to"
                exact
              >
                <template #prepend>
                  <v-img :src="skill.imgsrc" width="32" />
                </template>
                <v-list-item-title v-text="skill.title" />
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-app-bar>
      <v-toolbar-title style="cursor: pointer" @click="navigateTo('/')">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>

    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} noko</span>
    </v-footer>
  </v-app>
</template>

<script setup>
const rail = ref(true)
const farmingPanel = ref([])
const title = 'PandaTO Damage calculator'

const farmingMenu = [
  {
    imgsrc: '/attacktype.jpg',
    title: 'ATTACK TYPE',
    skills: [
      { imgsrc: '/earthquakeblade.gif', title: 'EARTHQUAKE BLADE', to: '/earthquakeblade' },
      { imgsrc: '/championsblade.gif', title: "CHAMPION'S BLADE", to: '/championsblade' },
      { imgsrc: '/tidalslash.gif', title: 'TIDAL SLASH', to: '/tidalslash' },
      { imgsrc: '/sonicslash.gif', title: 'SONIC SLASH', to: '/sonicslash' }
    ]
  },
  {
    imgsrc: '/magictype.jpg',
    title: 'MAGIC TYPE',
    skills: [
      { imgsrc: '/lightning.gif', title: 'ELECTRO ATTACK', to: '/electroattack' },
      { imgsrc: '/raizin.gif', title: 'STAFF OF THUNDER', to: '/staffofthunder' },
      { imgsrc: '/electric_bomb.gif', title: 'TESLA FIELD', to: '/teslafield' },
      { imgsrc: '/wind_edgh.gif', title: 'WIND BLADE', to: '/windblade' },
      { imgsrc: '/tornadoblast.gif', title: 'TORNADO BLAST', to: '/tornadoblast' },
      { imgsrc: '/tempest.gif', title: 'RAGING STORM', to: '/ragingstorm' },
      { imgsrc: '/earthquake.gif', title: 'CLEAVING TERRA', to: '/cleavingterra' },
      { imgsrc: '/earthshaker.gif', title: 'EARTHQUAKE', to: '/earthquake' },
      { imgsrc: '/deadlyfen.gif', title: 'DEADLY FEN', to: '/deadlyfen' },
      { imgsrc: '/salamanderBlessing.gif', title: 'BLESSINGS', to: '/blessing' },
      { imgsrc: '/hardgravity.gif', title: 'GRAVITY CRASH', to: '/gravitycrash' },
      { imgsrc: '/celestialstrike.gif', title: 'CELESTIAL STRIKE', to: '/celestialstrike' }
    ]
  },
  {
    imgsrc: '/sensetype.jpg',
    title: 'SENSE TYPE',
    skills: [
      { imgsrc: '/fanofknives.gif', title: 'FAN OF KNIVES', to: '/fanofknives' },
      { imgsrc: '/shootingspree.gif', title: 'SHOOTING SPREE', to: '/shootingspree' },
      { imgsrc: '/violenceshot.gif', title: 'BERSERK', to: '/berserk' }
    ]
  },
  {
    imgsrc: '/charmtype.jpg',
    title: 'CHARM TYPE',
    skills: [
      { imgsrc: '/fullhouse.gif', title: 'FULL HOUSE', to: '/fullhouse' },
      { imgsrc: '/sharpscream.gif', title: 'SHARP SCREAM', to: '/sharpscream' }
    ]
  }
]

const bossMenu = [
  {
    imgsrc: '/attacktype.jpg',
    title: 'ATTACK TYPE',
    skills: [
      { imgsrc: '/earthquakeblade.gif', title: 'EARTHQUAKE BLADE', to: '/earthquakeblade?mode=boss' },
      { imgsrc: '/tidalslash.gif', title: 'TIDAL SLASH', to: '/tidalslash?mode=boss' },
      { imgsrc: '/sonicslash.gif', title: 'SONIC SLASH', to: '/sonicslash?mode=boss' },
      { imgsrc: '/tempeststrike.gif', title: 'TEMPEST STRIKE', to: '/tempeststrike' },
      { imgsrc: '/galestrike.gif', title: 'GALE STRIKE', to: '/galestrike' },
      { imgsrc: '/flamingfist.gif', title: 'FLAMING FIST', to: '/flamingfist' }
    ]
  },
  {
    imgsrc: '/magictype.jpg',
    title: 'MAGIC TYPE',
    skills: [
      { imgsrc: '/sr.gif', title: 'MAGICAL SOUL', to: '/magicalsoul' },
      { imgsrc: '/hellfulks.gif', title: 'SCYTHE', to: '/scythe' },
      { imgsrc: '/maristrident.gif', title: 'STAFF OF AGONY', to: '/staffofagony' },
      { imgsrc: '/hardgravity.gif', title: 'GRAVITY CRASH', to: '/gravitycrash?mode=boss' },
      { imgsrc: '/celestialstrike.gif', title: 'CELESTIAL STRIKE', to: '/celestialstrike?mode=boss' }
    ]
  },
  {
    imgsrc: '/sensetype.jpg',
    title: 'SENSE TYPE',
    skills: [
      { imgsrc: '/chainofknives.gif', title: 'CHAIN OF KNIVES', to: '/chainofknives' },
      { imgsrc: '/suddenattack.gif', title: 'SUDDEN ATTACK', to: '/suddenattack' },
      { imgsrc: '/poison.gif', title: 'POISON ASSAULT', to: '/poisonassault' },
      { imgsrc: '/fotune_hit.gif', title: 'LUCKY FIST', to: '/luckyfist' },
      { imgsrc: '/power_shot.gif', title: 'POWER SHOT', to: '/powershot' },
      { imgsrc: '/quick_shot.gif', title: 'DOUBLE SHOT', to: '/doubleshot' }
    ]
  },
  {
    imgsrc: '/charmtype.jpg',
    title: 'CHARM TYPE',
    skills: [
      { imgsrc: '/jazzcombo.gif', title: '2 HIT COMBO', to: '/2hitcombo' },
      { imgsrc: '/one_pair.gif', title: 'ONE PAIR', to: '/onepair' }
    ]
  }
]

const currentHeader = ref({ img: '/mac.gif', title: 'Farming' })
const otherHeader = ref({ img: '/hecate.gif', title: 'Boss' })
const currentMenu = ref(farmingMenu)
const otherMenu = ref(bossMenu)

function menuChange() {
  farmingPanel.value = []
  const tmpHeader = currentHeader.value
  currentHeader.value = otherHeader.value
  otherHeader.value = tmpHeader
  const tmpMenu = currentMenu.value
  currentMenu.value = otherMenu.value
  otherMenu.value = tmpMenu
}
</script>
