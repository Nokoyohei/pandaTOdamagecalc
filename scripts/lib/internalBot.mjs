// pandaTO-internal-bot (Nokoyohei/pto-data-internal) の libconfig JSON を読むための共通処理
//
//   場所の指定: --bot=<dir> | 第 1 引数 | $PANDATO_INTERNAL_BOT | ローカル既定
//   読む順序 : json_output/<name>.json（ローカルで変換した全テーブル、git 管理外）
//              → viewer/public/<name>.json（git 管理。ESAction_* は SkillESAction.json に統合済み）
//   CI では viewer/public だけを sparse checkout して使う
import { readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEFAULT_BOT = 'C:/Users/USER/Desktop/PandaTO2.0/pandaTO-internal-bot'
const DEFAULT_CLIENT_DATA = 'C:/Users/USER/Desktop/PandaTO2.0/data'

// viewer/public にコピーされるときに改名されるファイル（update-data.js の RENAME_FILES）
const RENAMED = { BossMonsterparamEx: 'BossMonsterParamEx' }

/** `--key=value` / `--flag` と位置引数に分ける */
export function parseArgs(argv = process.argv.slice(2)) {
  const flags = {}
  const positional = []
  for (const a of argv) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      flags[k] = v ?? true
    } else {
      positional.push(a)
    }
  }
  return { flags, positional }
}

export function botDir({ flags, positional }) {
  return resolve(flags.bot ?? positional[0] ?? process.env.PANDATO_INTERNAL_BOT ?? DEFAULT_BOT)
}

export function clientDataDir({ flags, positional }) {
  return resolve(flags.data ?? positional[1] ?? process.env.PANDATO_CLIENT_DATA ?? DEFAULT_CLIENT_DATA)
}

const mergedCache = new Map()

/** テーブル名（拡張子なし）→ rows */
export function loadTable(bot, name) {
  const direct = join(bot, 'json_output', `${name}.json`)
  if (existsSync(direct)) return JSON.parse(readFileSync(direct, 'utf8')).rows

  if (name.startsWith('ESAction_')) {
    const mergedPath = join(bot, 'viewer/public/SkillESAction.json')
    if (!mergedCache.has(mergedPath)) {
      if (!existsSync(mergedPath)) throw new Error(`${name}: neither json_output/${name}.json nor ${mergedPath} exists`)
      mergedCache.set(mergedPath, JSON.parse(readFileSync(mergedPath, 'utf8')))
    }
    const rows = mergedCache.get(mergedPath)[name]
    if (!rows) throw new Error(`${name}: not found in SkillESAction.json`)
    return rows
  }

  const pub = join(bot, 'viewer/public', `${RENAMED[name] ?? name}.json`)
  if (existsSync(pub)) return JSON.parse(readFileSync(pub, 'utf8')).rows
  throw new Error(`${name}: not found under ${bot} (json_output or viewer/public)`)
}

/** Level 列が最大の行（rows は Level 順に並んでいないことがある） */
export function maxLevelRow(rows) {
  return rows.reduce((best, r) => (best == null || Number(r.Level) > Number(best.Level) ? r : best), null)
}
