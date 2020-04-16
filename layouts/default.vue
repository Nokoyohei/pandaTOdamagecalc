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
      class="test"
    >
      <v-list-item>
        <v-list-item-icon>
          <img src="~/static/mac.gif" />
        </v-list-item-icon>
        <v-list-item-title> Farming </v-list-item-title>
      </v-list-item>
      <v-expansion-panels v-model="farmingPanel" multiple accordion>
        <v-expansion-panel v-for="item in farmingMenu" :key="item.title">
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
      <v-list-item>
        <v-list-item-icon>
          <img src="~/static/hecate.gif" />
        </v-list-item-icon>
        <v-list-item-title> Boss (WIP) </v-list-item-title>
      </v-list-item>
      <v-list>
        <v-list-item
          v-for="(item, i) in BossMenu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-img :src="item.imgsrc" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
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
  farmingPanel = [0]
  minivaliant = false
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
        }
      ]
    },
    {
      imgsrc: require('~/static/magictype.jpg'),
      title: 'MAGIC TYPE',
      skills: [
        {
          imgsrc: require('~/static/hardgravity.gif'),
          title: 'GRAVITY CRASH',
          to: '/gravitycrash'
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
        }
      ]
    }
  ]

  BossMenu = [
    {
      imgsrc: require('~/static/hellfulks.gif'),
      title: 'SCYTHE',
      to: '/scythe'
    }
  ]

  title = 'PandaTO Damage calculator'
}
</script>

<style>
.test {
  overflow: hidden;
}
</style>
