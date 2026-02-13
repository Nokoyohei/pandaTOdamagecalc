import { Component, Vue } from 'nuxt-property-decorator'
import { torobbie, requiem } from '~/utils/monsters'
import {
  calcMABuffRatio,
  calcAPBuffRatio,
  calcLKBuffRatio,
  calcHVBuffRatio,
  calcDABuffRatio,
  calcACBuffRatio,
  calcThrowBuffRatio,
  calcDebuffedMonster,
  initStatus,
  initExtraStatus
} from '~/utils/calc'
import {
  Monster,
  BossMonster,
  MABuffName,
  APBuffName,
  LKBuffName,
  HVBuffName,
  DABuffName,
  ACBuffName,
  DLBuffName,
  ThrowBuffName,
  DebuffName,
  Status,
  Attributes
} from '~/types'

@Component({})
export default class BaseSkillPage extends Vue {
  stats: Status & Attributes = initStatus()
  extraStats: Status = initExtraStatus()
  mode: string = 'farming'
  monster: Monster | BossMonster = torobbie
  basePower: number = 0

  MABuff: MABuffName[] = []
  APBuff: APBuffName[] = []
  LKBuff: LKBuffName[] = []
  HVBuff: HVBuffName[] = []
  DABuff: DABuffName[] = []
  ACBuff: ACBuffName[] = []
  DLBuff: DLBuffName[] = []
  ThrowBuff: ThrowBuffName[] = []
  debuffSkills: DebuffName[] = []

  get skillMode(): 'farming' | 'boss' | 'dual' {
    return 'farming'
  }

  beforeMount() {
    if (this.skillMode === 'boss') {
      this.mode = 'boss'
      this.monster = requiem
    } else if (this.skillMode === 'dual') {
      this.mode = this.$route.query.mode === 'boss' ? 'boss' : 'farming'
      if (this.mode === 'boss') {
        this.monster = requiem
      }
    }

    const stats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const extraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(stats).length !== 0) this.stats = stats
    if (Object.keys(extraStats).length !== 0) this.extraStats = extraStats
  }

  beforeDestroy() {
    localStorage.setItem('stats', JSON.stringify(this.stats))
    localStorage.setItem('extraStats', JSON.stringify(this.extraStats))
  }

  get buffedMA() {
    return (
      Math.floor(
        (this.stats.ma - this.extraStats.ma) * calcMABuffRatio(this.MABuff)
      ) + this.extraStats.ma
    )
  }

  get buffedAP() {
    return (
      Math.floor(
        (this.stats.ap - this.extraStats.ap) * calcAPBuffRatio(this.APBuff)
      ) + this.extraStats.ap
    )
  }

  get buffedLK() {
    return (
      Math.floor(
        (this.stats.lk - this.extraStats.lk) * calcLKBuffRatio(this.LKBuff)
      ) + this.extraStats.lk
    )
  }

  get buffedHV() {
    return (
      Math.floor(
        (this.stats.hv - this.extraStats.hv) * calcHVBuffRatio(this.HVBuff)
      ) + this.extraStats.hv
    )
  }

  get buffedDA() {
    return (
      Math.floor(
        (this.stats.da - this.extraStats.da) * calcDABuffRatio(this.DABuff)
      ) + this.extraStats.da
    )
  }

  get buffedAC() {
    return (
      Math.floor(
        (this.stats.ac - this.extraStats.ac) * calcACBuffRatio(this.ACBuff)
      ) + this.extraStats.ac
    )
  }

  get buffedThrowAP() {
    return this.stats.throwAP * calcThrowBuffRatio(this.ThrowBuff)
  }

  get monsterHP() {
    return this.mode === 'boss'
      ? (this.monster as BossMonster).gaugeNum * this.monster.hp
      : this.monster.hp
  }

  get debuffedMonster() {
    return calcDebuffedMonster(this.monster, this.debuffSkills)
  }
}
