<template>
  <v-app dark>
    <v-navigation-drawer
      expand-on-hover
      clipped
      app
      fixed
      permanent
      :mini-variant.sync="minivaliant"
      width="300"
    >
      <v-list-item>
        <v-list-item-icon>
          <img :src="currentHeader.img" height="100" />
        </v-list-item-icon>
        <v-list-item-title> {{ currentHeader.title }} </v-list-item-title>
        <v-divider vertical dark />
        <img
          :src="otherHeader.img"
          style="cursor: pointer;"
          @click="menuChange"
        />
      </v-list-item>
      <v-expansion-panels v-model="farmingPanel" multiple accordion>
        <v-expansion-panel v-for="item in currentMenu" :key="item.title">
          <v-expansion-panel-header>
            <div>
              <img :src="item.imgsrc" />
              <span :hidden="minivaliant">{{ item.title }}</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item
                v-for="skill in item.skills"
                :key="skill.title"
                :to="skill.to"
                router
                exact
              >
                <v-list-item-action>
                  <v-img :src="skill.imgsrc" />
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="skill.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/')">
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>

    <v-footer fixed app>
      <span>&copy; {{ new Date().getFullYear() }} noko</span>
    </v-footer>
  </v-app>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  drawer = true
  farmingPanel = []
  minivaliant = false
  currentHeader = {
    img: require('~/static/mac.gif'),
    title: 'Farming'
  }

  otherHeader = {
    img: require('~/static/hecate.gif'),
    title: 'Boss'
  }

  farmingMenu = [
    {
      imgsrc: require('~/static/attacktype.jpg'),
      title: 'ATTACK TYPE',
      skills: [
        {
          imgsrc: require('~/static/earthquakeblade.gif'),
          title: 'EARTHQUAKE BLADE',
          to: '/earthquakeblade'
        },
        {
          imgsrc: require('~/static/championsblade.gif'),
          title: "CHAMPION'S BLADE",
          to: '/championsblade'
        },
        {
          imgsrc: require('~/static/tidalslash.gif'),
          title: 'TIDAL SLASH',
          to: '/tidalslash'
        },
        {
          imgsrc: require('~/static/sonicslash.gif'),
          title: 'SONIC SLASH',
          to: '/sonicslash'
        }
      ]
    },
    {
      imgsrc: require('~/static/magictype.jpg'),
      title: 'MAGIC TYPE',
      skills: [
        {
          imgsrc: require('~/static/lightning.gif'),
          title: 'ELECTRO ATTACK',
          to: '/electroattack'
        },
        {
          imgsrc: require('~/static/raizin.gif'),
          title: 'STAFF OF THUNDER',
          to: '/staffofthunder'
        },
        {
          imgsrc: require('~/static/electric_bomb.gif'),
          title: 'TESLA FIELD',
          to: '/teslafield'
        },
        {
          imgsrc: require('~/static/wind_edgh.gif'),
          title: 'WIND BLADE',
          to: '/windblade'
        },
        {
          imgsrc: require('~/static/tornadoblast.gif'),
          title: 'TORNADO BLAST',
          to: '/tornadoblast'
        },
        {
          imgsrc: require('~/static/tempest.gif'),
          title: 'RAGING STORM',
          to: '/ragingstorm'
        },
        {
          imgsrc: require('~/static/earthquake.gif'),
          title: 'CLEAVING TERRA',
          to: '/cleavingterra'
        },
        {
          imgsrc: require('~/static/earthshaker.gif'),
          title: 'EARTHQUAKE',
          to: '/earthquake'
        },
        {
          imgsrc: require('~/static/deadlyfen.gif'),
          title: 'DEADLY FEN',
          to: '/deadlyfen'
        },
        {
          imgsrc: require('~/static/salamanderBlessing.gif'),
          title: 'BLESSINGS',
          to: '/blessing'
        },
        {
          imgsrc: require('~/static/hardgravity.gif'),
          title: 'GRAVITY CRASH',
          to: '/gravitycrash'
        },
        {
          imgsrc: require('~/static/celestialstrike.gif'),
          title: 'CELESTIAL STRIKE',
          to: '/celestialstrike'
        }
      ]
    },
    {
      imgsrc: require('~/static/sensetype.jpg'),
      title: 'SENSE TYPE',
      skills: [
        {
          imgsrc: require('~/static/fanofknives.gif'),
          title: 'FAN OF KNIVES',
          to: '/fanofknives'
        },
        {
          imgsrc: require('~/static/shootingspree.gif'),
          title: 'SHOOTING SPREE',
          to: '/shootingspree'
        },
        {
          imgsrc: require('~/static/violenceshot.gif'),
          title: 'BERSERK',
          to: '/berserk'
        }
      ]
    },
    {
      imgsrc: require('~/static/charmtype.jpg'),
      title: 'CHARM TYPE',
      skills: [
        {
          imgsrc: require('~/static/fullhouse.gif'),
          title: 'FULL HOUSE',
          to: '/fullhouse'
        },
        {
          imgsrc: require('~/static/sharpscream.gif'),
          title: 'SHARP SCREAM',
          to: '/sharpscream'
        }
      ]
    }
  ]

  BossMenu = [
    {
      imgsrc: require('~/static/attacktype.jpg'),
      title: 'ATTACK TYPE',
      skills: [
        {
          imgsrc: require('~/static/earthquakeblade.gif'),
          title: 'EARTHQUAKE BLADE',
          to: '/earthquakeblade?mode=boss'
        },
        {
          imgsrc: require('~/static/tidalslash.gif'),
          title: 'TIDAL SLASH',
          to: '/tidalslash?mode=boss'
        },
        {
          imgsrc: require('~/static/sonicslash.gif'),
          title: 'SONIC SLASH',
          to: '/sonicslash?mode=boss'
        },
        {
          imgsrc: require('~/static/tempeststrike.gif'),
          title: 'TEMPEST STRIKE',
          to: '/tempeststrike'
        },
        {
          imgsrc: require('~/static/galestrike.gif'),
          title: 'GALE STRIKE',
          to: '/galestrike'
        },
        {
          imgsrc: require('~/static/flamingfist.gif'),
          title: 'FLAMING FIST',
          to: '/flamingfist'
        }
      ]
    },
    {
      imgsrc: require('~/static/magictype.jpg'),
      title: 'MAGIC TYPE',
      skills: [
        {
          imgsrc: require('~/static/sr.gif'),
          title: 'MAGICAL SOUL',
          to: '/magicalsoul'
        },
        {
          imgsrc: require('~/static/hellfulks.gif'),
          title: 'SCYTHE',
          to: '/scythe'
        },
        {
          imgsrc: require('~/static/maristrident.gif'),
          title: 'STAFF OF AGONY',
          to: '/staffofagony'
        },
        {
          imgsrc: require('~/static/hardgravity.gif'),
          title: 'GRAVITY CRASH',
          to: '/gravitycrash?mode=boss'
        },
        {
          imgsrc: require('~/static/celestialstrike.gif'),
          title: 'CELESTIAL STRIKE',
          to: '/celestialstrike?mode=boss'
        }
      ]
    },
    {
      imgsrc: require('~/static/sensetype.jpg'),
      title: 'SENSE TYPE',
      skills: [
        {
          imgsrc: require('~/static/chainofknives.gif'),
          title: 'CHAIN OF KNIVES',
          to: '/chainofknives'
        },
        {
          imgsrc: require('~/static/suddenattack.gif'),
          title: 'SUDDEN ATTACK',
          to: '/suddenattack'
        },
        {
          imgsrc: require('~/static/poison.gif'),
          title: 'POISON ASSAULT',
          to: '/poisonassault'
        },
        {
          imgsrc: require('~/static/fotune_hit.gif'),
          title: 'LUCKY FIST',
          to: '/luckyfist'
        },
        {
          imgsrc: require('~/static/power_shot.gif'),
          title: 'POWER SHOT',
          to: '/powershot'
        },
        {
          imgsrc: require('~/static/quick_shot.gif'),
          title: 'DOUBLE SHOT',
          to: '/doubleshot'
        }
      ]
    },
    {
      imgsrc: require('~/static/charmtype.jpg'),
      title: 'CHARM TYPE',
      skills: [
        {
          imgsrc: require('~/static/jazzcombo.gif'),
          title: '2 HIT COMBO',
          to: '/2hitcombo'
        },
        {
          imgsrc: require('~/static/one_pair.gif'),
          title: 'ONE PAIR',
          to: '/onepair'
        }
      ]
    }
  ]

  title = 'PandaTO Damage calculator'
  currentMenu = this.farmingMenu
  otherMenu = this.BossMenu

  menuChange() {
    this.farmingPanel = []
    ;[this.currentHeader, this.otherHeader] = [
      this.otherHeader,
      this.currentHeader
    ]
    ;[this.currentMenu, this.otherMenu] = [this.otherMenu, this.currentMenu]
  }
}
</script>

<style></style>
