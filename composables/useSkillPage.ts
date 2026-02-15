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
import type {
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
  DebuffName
} from '~/types'

export function useSkillPage(options: { skillMode?: 'farming' | 'boss' | 'dual' } = {}) {
  const route = useRoute()
  const skillMode = options.skillMode ?? 'farming'

  const stats = ref(initStatus())
  const extraStats = ref(initExtraStatus())
  const mode = ref<string>('farming')
  const monster = ref<Monster | BossMonster>(torobbie)
  const basePower = ref(0)

  const maBuffs = ref<MABuffName[]>([])
  const apBuffs = ref<APBuffName[]>([])
  const lkBuffs = ref<LKBuffName[]>([])
  const hvBuffs = ref<HVBuffName[]>([])
  const daBuffs = ref<DABuffName[]>([])
  const acBuffs = ref<ACBuffName[]>([])
  const dlBuffs = ref<DLBuffName[]>([])
  const throwBuffs = ref<ThrowBuffName[]>([])
  const debuffSkills = ref<DebuffName[]>([])

  const buffedMA = computed(() =>
    Math.floor(
      (stats.value.ma - extraStats.value.ma) * calcMABuffRatio(maBuffs.value)
    ) + extraStats.value.ma
  )

  const buffedAP = computed(() =>
    Math.floor(
      (stats.value.ap - extraStats.value.ap) * calcAPBuffRatio(apBuffs.value)
    ) + extraStats.value.ap
  )

  const buffedLK = computed(() =>
    Math.floor(
      (stats.value.lk - extraStats.value.lk) * calcLKBuffRatio(lkBuffs.value)
    ) + extraStats.value.lk
  )

  const buffedHV = computed(() =>
    Math.floor(
      (stats.value.hv - extraStats.value.hv) * calcHVBuffRatio(hvBuffs.value)
    ) + extraStats.value.hv
  )

  const buffedDA = computed(() =>
    Math.floor(
      (stats.value.da - extraStats.value.da) * calcDABuffRatio(daBuffs.value)
    ) + extraStats.value.da
  )

  const buffedAC = computed(() =>
    Math.floor(
      (stats.value.ac - extraStats.value.ac) * calcACBuffRatio(acBuffs.value)
    ) + extraStats.value.ac
  )

  const buffedThrowAP = computed(() =>
    stats.value.throwAP * calcThrowBuffRatio(throwBuffs.value)
  )

  const monsterHP = computed(() =>
    mode.value === 'boss'
      ? (monster.value as BossMonster).gaugeNum * monster.value.hp
      : monster.value.hp
  )

  const debuffedMonster = computed(() =>
    calcDebuffedMonster(monster.value, debuffSkills.value)
  )

  onBeforeMount(() => {
    if (skillMode === 'boss') {
      mode.value = 'boss'
      monster.value = bossTorrobie
    } else if (skillMode === 'dual') {
      mode.value = route.query.mode === 'boss' ? 'boss' : 'farming'
      if (mode.value === 'boss') {
        monster.value = bossTorrobie
      }
    }

    const savedStats = JSON.parse(localStorage.getItem('stats') ?? '{}')
    const savedExtraStats = JSON.parse(localStorage.getItem('extraStats') ?? '{}')
    if (Object.keys(savedStats).length !== 0) stats.value = savedStats
    if (Object.keys(savedExtraStats).length !== 0) extraStats.value = savedExtraStats
  })

  watch(stats, (val) => {
    localStorage.setItem('stats', JSON.stringify(val))
  }, { deep: true })

  watch(extraStats, (val) => {
    localStorage.setItem('extraStats', JSON.stringify(val))
  }, { deep: true })

  return {
    stats,
    extraStats,
    mode,
    monster,
    basePower,
    maBuffs,
    apBuffs,
    lkBuffs,
    hvBuffs,
    daBuffs,
    acBuffs,
    dlBuffs,
    throwBuffs,
    debuffSkills,
    buffedMA,
    buffedAP,
    buffedLK,
    buffedHV,
    buffedDA,
    buffedAC,
    buffedThrowAP,
    monsterHP,
    debuffedMonster
  }
}
