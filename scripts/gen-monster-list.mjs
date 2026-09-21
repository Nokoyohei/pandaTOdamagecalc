// pandaTO-internal-bot の MonsterParamEx2.json から utils/monsterList.ts を生成する
//   node scripts/gen-monster-list.mjs <path/to/json_output/MonsterParamEx2.json>
import { readFileSync, writeFileSync } from 'node:fs'

const src = process.argv[2] ?? 'C:/Users/USER/Desktop/PandaTO2.0/pandaTO-internal-bot/json_output/MonsterParamEx2.json'
const rows = JSON.parse(readFileSync(src, 'utf8')).rows

const COLS = ['ID', 'Name', 'Level', 'IsBoss', 'MaxHpLv', 'DpLv', 'MdLv', 'HvLv', 'DaLv',
  'FireR', 'WaterR', 'WindR', 'EarthR', 'ElecR', 'LightR', 'DarkR', 'NoPropR', 'PhysicalR', 'GunR']

const tuples = rows
  .map((r) => COLS.map((c) => (c === 'Name' ? JSON.stringify(r[c].trim()) : String(Number(r[c]) || 0))))
  .map((t) => `  [${t.join(', ')}]`)

const out = `/* eslint-disable */
// 自動生成: scripts/gen-monster-list.mjs（元データ MonsterParamEx2.json, ${rows.length} 行）
// [ID, Name, Level, IsBoss, MaxHpLv, DpLv, MdLv, HvLv, DaLv, FireR, WaterR, WindR, EarthR, ElecR, LightR, DarkR, NoPropR, PhysicalR, GunR]
export type MonsterRow = [
  number, string, number, number, number, number, number, number, number,
  number, number, number, number, number, number, number, number, number, number
]

export const MONSTER_ROWS: MonsterRow[] = [
${tuples.join(',\n')}
]
`
writeFileSync(new URL('../utils/monsterList.ts', import.meta.url), out)
console.log(`wrote utils/monsterList.ts (${rows.length} rows)`)
