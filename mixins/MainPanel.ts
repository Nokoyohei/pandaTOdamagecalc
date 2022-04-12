import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import { isabelle, requiem } from '~/utils/monsters'
import { initStatus, initExtraStatus } from '~/utils/calc'
import { Monster, BossMonster, Status, Attributes } from '~/types'

@Component
export default class Test extends Vue {
  mode = 'farming'
  monster: Monster | BossMonster = isabelle

  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()

  async asyncData(context: Context) {
    const data = await context.$axios.$get('https://httpbin.org/get')
    context.store.commit('buff/load', data.url)
  }

  beforeMount() {
    this.mode = this.$route.query.mode === 'boss' ? 'boss' : 'farming'
    if (this.mode === 'boss') {
      this.monster = requiem
    }

    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')

    if (Object.keys(stats).length !== 0)
      this.$store.commit('stats/loadStats', stats)
    if (Object.keys(extraStats).length !== 0)
      this.$store.commit('stats/loadExtraStats', extraStats)
  }

  get monsterHP() {
    return this.mode === 'boss'
      ? (this.monster as BossMonster).gaugeNum * this.monster.hp
      : this.monster.hp
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }
}
