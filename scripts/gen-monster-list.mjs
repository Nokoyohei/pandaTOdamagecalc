// pandaTO-internal-bot の libconfig JSON から utils/monsterList.ts と public/monster/*.gif を生成する
//   node scripts/gen-monster-list.mjs [<path/to/pandaTO-internal-bot>]
//
//   MonsterParamEx2.json     : ステータス・耐性
//   BossMonsterparamEx.json  : LifeCnt（HP ゲージは LifeCnt + 1 本）
//   CharacterInfo.json       : FileName（data\monster\monNNN.nri）→ viewer/public/nri/monster/monNNN_a0.gif
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const bot = process.argv[2] ?? 'C:/Users/USER/Desktop/PandaTO2.0/pandaTO-internal-bot'
const load = (name) => JSON.parse(readFileSync(join(bot, 'json_output', name), 'utf8')).rows

const monsters = load('MonsterParamEx2.json')
const lifeCnt = new Map(load('BossMonsterparamEx.json').map((r) => [r.ID, Number(r.LifeCnt) || 0]))
const charInfo = new Map(load('CharacterInfo.json').map((r) => [r.ID, r.FileName]))

const gifDir = join(bot, 'viewer/public/nri/monster')
const outDir = new URL('../public/monster/', import.meta.url)
mkdirSync(outDir, { recursive: true })

const COLS = ['ID', 'Name', 'Level', 'IsBoss', 'MaxHpLv', 'DpLv', 'MdLv', 'HvLv', 'DaLv',
  'FireR', 'WaterR', 'WindR', 'EarthR', 'ElecR', 'LightR', 'DarkR', 'NoPropR', 'PhysicalR', 'GunR']

let copied = 0
const imageOf = (id) => {
  const file = charInfo.get(id)
  if (!file) return ''
  const base = file.replace(/\\/g, '/').split('/').pop().replace(/\.nri$/i, '')
  for (const name of [`${base}_a0.gif`, `${base}_0.gif`, `${base.toLowerCase()}_a0.gif`, `${base.toLowerCase()}_0.gif`]) {
    const src = join(gifDir, name)
    if (existsSync(src)) {
      const dst = new URL(`${base}.gif`, outDir)
      if (!existsSync(dst)) { copyFileSync(src, dst); copied++ }
      return base
    }
  }
  return ''
}

const tuples = monsters.map((r) => {
  const t = COLS.map((c) => (c === 'Name' ? JSON.stringify(r[c].trim()) : String(Number(r[c]) || 0)))
  t.push(String(lifeCnt.get(r.ID) ?? 0), JSON.stringify(imageOf(r.ID)))
  return `  [${t.join(', ')}]`
})

const out = `/* eslint-disable */
// 自動生成: scripts/gen-monster-list.mjs（MonsterParamEx2 ${monsters.length} 行 + BossMonsterparamEx.LifeCnt + CharacterInfo.FileName）
// [ID, Name, Level, IsBoss, MaxHpLv, DpLv, MdLv, HvLv, DaLv,
//  FireR, WaterR, WindR, EarthR, ElecR, LightR, DarkR, NoPropR, PhysicalR, GunR,
//  LifeCnt, image base name under /monster/ ('' if none)]
export type MonsterRow = [
  number, string, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number, number,
  number, string
]

export const MONSTER_ROWS: MonsterRow[] = [
${tuples.join(',\n')}
]
`
writeFileSync(new URL('../utils/monsterList.ts', import.meta.url), out)
console.log(`wrote utils/monsterList.ts (${monsters.length} rows), copied ${copied} gifs to public/monster/`)
