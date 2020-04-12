<template>
  <v-app dark>
    <v-navigation-drawer expand-on-hover permanent clipped fixed app>
      <v-list-item>
        <v-list-item-icon>
          <img src="~/assets/mac.gif" />
        </v-list-item-icon>
        <v-list-item-title> Farming </v-list-item-title>
      </v-list-item>
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
  drawer = false
  farmingMenu = [
    {
      imgsrc: require('~/assets/hardgravity.gif'),
      title: 'GRAVITY CRASH',
      to: '/gravitycrash'
    },
    {
      imgsrc: require('~/assets/hardgravity.gif'),
      title: 'FULL HOUSE',
      to: '/fullhouse'
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
