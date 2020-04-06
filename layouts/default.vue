<template>
  <v-app dark>
    <v-navigation-drawer
      expand-on-hover
      clipped
      fixed
      app
      permanent
      :mini-variant.sync="minivaliant"
      width="300"
    >
      <v-list-item>
        <v-list-item-icon>
          <img src="~/assets/mac.gif" />
        </v-list-item-icon>
        <v-list-item-title> Farming </v-list-item-title>
      </v-list-item>
      <v-expansion-panels v-model="farmingPanel" multiple accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <img src="~/assets/attacktype.jpg" />
              <span :hidden="minivaliant">Attack Type</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item
                v-for="(item, i) in farmingMenu"
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
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div>
              <img src="~/assets/magictype.jpg" />
              <span :hidden="minivaliant">Magic Type</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list>
              <v-list-item
                v-for="(item, i) in farmingMenu"
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-list-item>
        <v-list-item-icon>
          <img src="~/assets/hecate.gif" />
        </v-list-item-icon>
        <v-list-item-title> Boss </v-list-item-title>
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
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
      imgsrc: require('~/assets/attacktype.jpg'),
      title: 'ATTACK TYPE',
      skills: [
        {
          imgsrc: require('~/assets/earthquakeblade.gif'),
          title: 'EARTHQUAKE BLADE',
          to: '/earthquakeblade'
        }
      ]
    },
    {
      imgsrc: require('~/assets/magictype.jpg'),
      title: 'MAGIC TYPE',
      skills: [
        {
          imgsrc: require('~/assets/hardgravity.gif'),
          title: 'GRAVITY CRASH',
          to: '/gravitycrash'
        }
      ]
    },
    {
      imgsrc: require('~/assets/attacktype.jpg'),
      title: 'SENSE TYPE',
      skills: [
        {
          imgsrc: require('~/assets/fanofknives.gif'),
          title: 'FAN OF KNIVES',
          to: '/fanofknives'
        }
      ]
    },
    {
      imgsrc: require('~/assets/attacktype.jpg'),
      title: 'CHARM TYPE',
      skills: [
        {
          imgsrc: require('~/assets/fullhouse.gif'),
          title: 'FULL HOUSE',
          to: '/fullhouse'
        }
      ]
    }
  ]

  BossMenu = [
    {
      imgsrc: require('~/assets/hellfulks.gif'),
      title: 'SCYTHE',
      to: '/scythe'
    }
  ]

  title = 'PandaTo Damage calculator'
}
</script>
