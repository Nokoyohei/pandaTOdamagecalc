// pandaTO-internal-bot の libconfig JSON から utils/monsterList.ts と public/monster/*.gif を生成する
//   node scripts/gen-monster-list.mjs [<pandaTO-internal-bot dir>] [<client data dir>]
//
//   MonsterParamEx2.json     : ステータス・耐性
//   BossMonsterparamEx.json  : LifeCnt（HP ゲージは LifeCnt + 1 本）
//   CharacterInfo.json       : FileName（data\monster\monNNN.nri）
//   <data>/monster/monNNN.nri: internal-bot の nri-converter.js で「正面を向いて動く」アニメ GIF にする
//                              （--list / --anim-index が効く版の converter が必要）
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'

const bot = process.argv[2] ?? 'C:/Users/USER/Desktop/PandaTO2.0/pandaTO-internal-bot'
const dataDir = process.argv[3] ?? 'C:/Users/USER/Desktop/PandaTO2.0/data'
const load = (name) => JSON.parse(readFileSync(join(bot, 'json_output', name), 'utf8')).rows

const monsters = load('MonsterParamEx2.json')
const lifeCnt = new Map(load('BossMonsterparamEx.json').map((r) => [r.ID, Number(r.LifeCnt) || 0]))
const charInfo = new Map(load('CharacterInfo.json').map((r) => [r.ID, r.FileName]))

const converter = join(bot, 'nri-converter.js')
const viewerGifDir = join(bot, 'viewer/public/nri/monster')
const outDir = new URL('../public/monster/', import.meta.url)
mkdirSync(outDir, { recursive: true })
const tmp = join(tmpdir(), 'pandato-monster-gifs')
rmSync(tmp, { recursive: true, force: true })
mkdirSync(tmp, { recursive: true })

/*
  「正面を向いて動く」アニメのインデックスを選ぶ。一覧は converter の --list（index<TAB>frames<TAB>name）から取る。
  名前は「서있기_아래」(立ち_下 = 正面)、「걷기_아래」(歩き_下) など。
  優先順: 立ち正面(2 コマ以上) > 歩き正面(2 コマ以上) > 正面で動く何か > 立ち正面(1 コマ) > 立ち > 0。
*/
function pickFrontAnim(nriPath) {
  const list = execFileSync('node', [converter, nriPath, 'x', '--list'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  const anims = list.split(/\r?\n/).filter(Boolean).map((line) => {
    const [, frames, name] = line.split('\t')
    return { name: name ?? '', frames: Number(frames) || 0 }
  })
  const find = (pred) => anims.findIndex(pred)
  const moving = (a) => a.frames > 1
  const front = (a) => a.name.endsWith('_아래') || a.name.endsWith('앞')
  const standing = (a) => a.name.startsWith('서있기')
  const walking = (a) => a.name.startsWith('걷기')
  for (const pred of [
    (a) => a.name === '서있기_아래' && moving(a),
    (a) => a.name === '걷기_아래' && moving(a),
    (a) => standing(a) && front(a) && moving(a),
    (a) => walking(a) && front(a) && moving(a),
    (a) => front(a) && moving(a),
    (a) => a.name === '서있기_아래',
    (a) => standing(a) && front(a),
    standing
  ]) {
    const i = find(pred)
    if (i !== -1) return i
  }
  return 0
}

const COLS = ['ID', 'Name', 'Level', 'IsBoss', 'MaxHpLv', 'DpLv', 'MdLv', 'HvLv', 'DaLv',
  'FireR', 'WaterR', 'WindR', 'EarthR', 'ElecR', 'LightR', 'DarkR', 'NoPropR', 'PhysicalR', 'GunR']

const done = new Map() // base -> ok
let animated = 0
let fallback = 0

const imageOf = (id) => {
  const file = charInfo.get(id)
  if (!file) return ''
  const base = file.replace(/\\/g, '/').split('/').pop().replace(/\.nri$/i, '')
  if (done.has(base)) return done.get(base) ? base : ''
  const dst = new URL(`${base}.gif`, outDir)
  const nri = join(dataDir, 'monster', `${base}.nri`)
  let ok = false
  if (existsSync(nri)) {
    try {
      const idx = pickFrontAnim(nri)
      const out = join(tmp, `${base}.gif`)
      execFileSync('node', [converter, nri, out, '--animated-gif', `--anim-index=${idx}`, '--silent'], { stdio: 'ignore' })
      const produced = join(tmp, `${base}_a${idx}.gif`)
      if (existsSync(produced)) {
        copyFileSync(produced, dst)
        ok = true
        animated++
      }
    } catch {
      // 変換できないファイルは下の静止画にフォールバック
    }
  }
  if (!ok) {
    // converter が扱えないファイルは viewer にある静止画（先頭アニメの 1 コマ目）を使う
    for (const name of [`${base}_a0.gif`, `${base}_0.gif`, `${base.toLowerCase()}_a0.gif`, `${base.toLowerCase()}_0.gif`]) {
      const src = join(viewerGifDir, name)
      if (existsSync(src)) {
        copyFileSync(src, dst)
        ok = true
        fallback++
        break
      }
    }
  }
  done.set(base, ok)
  return ok ? base : ''
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
rmSync(tmp, { recursive: true, force: true })
console.log(`wrote utils/monsterList.ts (${monsters.length} rows); gifs: ${animated} animated, ${fallback} static fallback, ${readdirSync(outDir).length} files in public/monster/`)
