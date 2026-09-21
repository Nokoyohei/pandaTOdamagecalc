// pandaTO-internal-bot の libconfig JSON から utils/skillTable.ts を生成する
//   node scripts/gen-skill-tables.mjs [--bot=<pandaTO-internal-bot dir>]
//
//   SkillParam2.json  : スキル ID → Name / ESATable（ESAction_* テーブル名）/ MaxSKLV
//   ESAction_*.json   : レベル別のパラメータ。最大 Level の行を使う
//
//   どのスキルのどの列を使うかは下の SOURCES に書く（式は GameServer.exe の逆アセンブルで確認したもの。
//   utils/skillPower.ts / utils/bossSkills.ts のコメント参照）。
//   Ratio 系は UI の刻みを整数にするため ×100 して出す。
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { parseArgs, botDir, loadTable, maxLevelRow } from './lib/internalBot.mjs'

const args = parseArgs()
const bot = botDir(args)

const skillParam = new Map(loadTable(bot, 'SkillParam2').map((r) => [Number(r.ID), r]))

/*
  各エントリ: { key, id | table, field, kind?, transform? }
    id        SkillParam2 の ID。ESATable をたどる
    table     SkillParam2 に行が無いテーブルを直接指定（Godly Fan of Knives など）
    kind      'ratio100'（既定: field が *Ratio）| 'raw'
    transform 追加の変換（Phoenix Rising の Seconds → tick 数など）
*/
const ratio = (key, id, extra = {}) => ({ key, id, field: 'Ratio', ...extra })
const ap = (key, id, field = 'AP') => ({ key, id, field, kind: 'raw' })

// utils/skillPower.ts の SKILL_POWER（farming / boss 共通のページ）
const SKILL = [
  ap('DarkCommando', 2704, 'M_AP'),
  ap('GravityCrash', 2210),
  ap('CelestialStrike', 2503),
  ap('Scythe', 2701),
  ap('StaffOfAgony', 2703),
  ap('Blessing', 2306), // 2306-2310 の 5 テーブルは同値
  ap('WindBlade', 2111),
  ap('RagingStorm', 2305),
  ap('ElectroAttack', 2105),
  ap('StaffOfThunder', 2302),
  ap('TeslaField', 2123),
  ap('DeadlyFen', 2130, 'M_AP'),
  ap('TornadoBlast', 2131, 'MagicAP'),
  ap('Earthquake', 2304),
  ap('CleavingTerra', 2109),
  ratio('FlamingFist', 1303),
  ratio('FullHouse', 4501),
  ratio('SharpScream', 4304),
  ratio('HitCombo', 4302),
  ratio('OnePair', 4204),
  { key: 'LadyLuck', id: 4210, field: 'MaxCard', kind: 'raw' },
  ratio('EarthquakeBlade', 1210),
  ratio('SonicSlash', 1502),
  ratio('TidalSlash', 1207),
  ratio('TempestStrike', 1209),
  ratio('GaleStrike', 1504),
  ratio('ChampionsBlade', 1110),
  ratio('FanOfKnives', 3109),
  ratio('ChainOfKnives', 3110),
  ratio('PoisonAssault', 3306),
  ratio('SuddenAttack', 3302),
  ratio('LuckyFist', 3204),
  ratio('ShootingSpree', 3203),
  ratio('Berserk', 3501),
  ratio('PowerShot', 3202),
  ratio('DoubleShot', 3206)
]

const GODLY_SKILL = [
  ap('GravityCrash', 12210),
  ap('Scythe', 12701),
  ap('StaffOfAgony', 12703),
  ratio('SonicSlash', 11502),
  ratio('GaleStrike', 11504),
  ratio('EarthquakeBlade', 12100),
  ratio('ChainOfKnives', 13110),
  ratio('PowerShot', 13202),
  ratio('DoubleShot', 13206),
  ratio('PoisonAssault', 13306),
  ratio('Berserk', 13501),
  ratio('OnePair', 14204),
  ratio('HitCombo', 14302),
  ratio('FullHouse', 14501),
  { key: 'FanOfKnives', table: 'ESAction_GodlyWideThrow', field: 'Ratio' } // SkillParam2 に Godly 行が無い
]

// utils/bossSkills.ts の BOSS_SKILLS。'<key>' = table 既定値、'<key>.<param>' = params 既定値
const BOSS = [
  ratio('lacerator', 1202),
  ratio('piercing_wave', 1204),
  ratio('blazing_strike', 1205),
  ratio('inferno_blade', 1208),
  ratio('flash_cut', 1302),
  ratio('mega_flash_cut', 1304),
  ratio('tetra_punch', 1108),
  ratio('shadow', 1501),
  { key: 'shadow.count', id: 1501, field: 'Count', kind: 'raw' },
  ap('hellfire', 2203),
  ap('arrow_of_light', 2205),
  ap('dark_lance', 2208),
  ap('light_wave', 2209),
  ap('radiant_strike', 2214),
  ap('aqua_bomb', 2301),
  ap('dragon_storm', 2303),
  ap('searing_light', 2502),
  ap('ghostly_whisper', 2705, 'M_AP'),
  ap('razor_gale', 2126),
  ap('phoenix_rising', 2124),
  // 2 秒ごとに 1 tick なので Seconds / 2
  { key: 'phoenix_rising.ticks', id: 2124, field: 'Seconds', kind: 'raw', transform: (v) => Math.trunc(v / 2) },
  ap('godly_arrow_rush', 12007),
  { key: 'godly_arrow_rush.count', id: 12007, field: 'Count', kind: 'raw' },
  ratio('butt_plate', 3201),
  ratio('poison_pouch', 3105), // 初撃は Pouch of Pain (3105) の Ratio
  ratio('beast_claw', 4106),
  ratio('fist_full_of_galders', 4109),
  { key: 'fist_full_of_galders.count', id: 4109, field: 'Count', kind: 'raw' },
  ratio('fatal_wound', 4107),
  ratio('card_strike', 4201),
  { key: 'card_strike.radius', id: 4201, field: 'Radius', kind: 'raw' },
  ratio('impelling_rage', 4205),
  { key: 'impelling_rage.distance', id: 4205, field: 'Radius', kind: 'raw' },
  ratio('power_charging', 4502),
  { key: 'power_charging.distance', id: 4502, field: 'Radius', kind: 'raw' },
  ratio('wild_nail', 4207),
  ratio('furious_galder_throw', 4209),
  ratio('raging_nail', 4303),
  { key: 'raging_nail.disDefence', id: 4303, field: 'DisDefenceRatio', kind: 'raw' },
  ratio('heavy_hit', 4503)
]

const GODLY_BOSS = [
  ratio('mega_flash_cut', 11304),
  ratio('tetra_punch', 11108),
  ratio('shadow', 11501),
  { key: 'shadow.count', id: 11501, field: 'Count', kind: 'raw' },
  ratio('wild_nail', 14207)
]

// パッシブ・デバフ・その他（値はそのまま）
const MISC = [
  { key: 'precisePitchRatio', id: 3101, field: 'Ratio', kind: 'raw' }, // utils/buffRatio.ts
  { key: 'shieldBreakerRatio', id: 3207, field: 'Ratio', kind: 'raw' }, // utils/debuffs.ts
  { key: 'areaRegiDown', id: 2313, field: 'RegiDown', kind: 'raw' }, // 2311-2315 の 5 テーブルは同値
  { key: 'magicalSoulRatio1', id: 2014, field: 'Ratio1', kind: 'raw' },
  { key: 'magicalSoulRatio2', id: 2014, field: 'Ratio2', kind: 'raw' },
  // 2 Hit Combo が参照するパッシブ (Power Blow 4001) の最大レベル
  { key: 'hitComboPassiveLevel', id: 4001, field: 'MaxSKLV', kind: 'raw' },
  // Blood Testament (2219) / Godly (12219): 闇魔法ダメージ × (1 + MARatio)
  { key: 'bloodTestamentRatio', id: 2219, field: 'MARatio', kind: 'raw' },
  { key: 'godlyBloodTestamentRatio', id: 12219, field: 'MARatio', kind: 'raw' }
]

function resolve(entry) {
  let tableName = entry.table
  let skill = null
  if (entry.id != null) {
    skill = skillParam.get(entry.id)
    if (!skill) throw new Error(`${entry.key}: skill ${entry.id} not in SkillParam2`)
    tableName = skill.ESATable
  }
  if (entry.field === 'MaxSKLV') {
    return { value: Number(skill.MaxSKLV), source: `${entry.id} ${skill.Name.trim()} — SkillParam2.MaxSKLV` }
  }
  const row = maxLevelRow(loadTable(bot, tableName))
  // field は候補を配列で渡せる（SwampField / FireField は ApplyRatio が ApplyRT という列名）
  const field = [entry.field].flat().find((f) => row && f in row)
  if (!field) throw new Error(`${entry.key}: ${tableName}.${[entry.field].flat().join('|')} missing`)
  let value = Number(row[field])
  if (!Number.isFinite(value)) throw new Error(`${entry.key}: ${tableName}.${field} = ${row[field]}`)
  const kind = entry.kind ?? (field.endsWith('Ratio') ? 'ratio100' : 'raw')
  if (kind === 'ratio100') value = Math.round(value * 100)
  if (entry.transform) value = entry.transform(value)
  const who = skill ? `${entry.id} ${skill.Name.trim()}` : tableName
  return { value, source: `${who} — ${tableName}.${field} (Lv${row.Level}${kind === 'ratio100' ? ', ×100' : ''})` }
}

const block = (name, doc, entries) => {
  const lines = entries.map((e) => {
    const { value, source } = resolve(e)
    const key = /^[A-Za-z_]\w*$/.test(e.key) ? e.key : `'${e.key}'`
    return `  /** ${source} */\n  ${key}: ${value},`
  })
  return `/** ${doc} */\nexport const ${name} = {\n${lines.join('\n')}\n} as const\n`
}

/*
  命中判定の bonus = 同じテーブルの ApplyRatio（SPEC 04_damage.md 「bonus = ESAction_* テーブルの ApplyRatio」）。
  スキルごと（'<key>.<param>' を除く）に power と同じテーブルから取る
*/
const applyRatioOf = (entries, extra = []) =>
  [...entries.filter((e) => !e.key.includes('.')), ...extra].map((e) => ({
    key: e.key,
    id: e.id,
    table: e.table,
    field: ['ApplyRatio', 'ApplyRT'],
    kind: 'raw'
  }))

const out = `/* eslint-disable */
// 自動生成: scripts/gen-skill-tables.mjs（pandaTO-internal-bot の SkillParam2 → ESAction_* 最大 Level 行）
// 手で編集しない。値を変えたいときは internal-bot のデータを更新して \`npm run sync-data\`
//   魔法: AP / M_AP / MagicAP そのまま（power × (MA − maPenalty) / 100 で攻撃力になる）
//   物理・射撃: Ratio × 100（UI の刻みを整数にするため）

${block('SKILL_TABLE', 'utils/skillPower.ts の SKILL_POWER', SKILL)}
${block('GODLY_SKILL_TABLE', 'utils/skillPower.ts の GODLY_SKILL_POWER', GODLY_SKILL)}
${block('BOSS_SKILL_TABLE', "utils/bossSkills.ts の既定値。'<key>' = table、'<key>.<param>' = params", BOSS)}
${block('GODLY_BOSS_SKILL_TABLE', 'utils/bossSkills.ts の Godly 既定値', GODLY_BOSS)}
${block('MISC_SKILL_TABLE', 'パッシブ・デバフなど', MISC)}
${block('SKILL_APPLY_RATIO', '命中判定の bonus（ApplyRatio）。キーは SKILL_TABLE と同じ', applyRatioOf(SKILL, [{ key: 'MagicalSoul', id: 2014 }]))}
${block('GODLY_SKILL_APPLY_RATIO', 'Godly の命中判定 bonus', applyRatioOf(GODLY_SKILL))}
${block('BOSS_SKILL_APPLY_RATIO', 'ボス用スキルの命中判定 bonus。キーは BOSS_SKILL_TABLE と同じ', applyRatioOf(BOSS))}
${block('GODLY_BOSS_SKILL_APPLY_RATIO', 'ボス用 Godly の命中判定 bonus', applyRatioOf(GODLY_BOSS))}`

// 前回の生成結果と比べて変わった値を出す（CI のログで差分が追えるように）
const target = new URL('../utils/skillTable.ts', import.meta.url)
const parse = (src) => {
  const map = new Map()
  let section = ''
  for (const line of src.split(/\r?\n/)) {
    const s = line.match(/^export const (\w+) = \{/)
    if (s) section = s[1]
    const m = line.match(/^\s+'?([\w.]+)'?: (-?[\d.]+),?$/)
    if (m) map.set(`${section}.${m[1]}`, Number(m[2]))
  }
  return map
}
const before = existsSync(target) ? parse(readFileSync(target, 'utf8')) : new Map()
const after = parse(out)
const changes = []
for (const [k, v] of after) if (before.has(k) && before.get(k) !== v) changes.push(`  ${k}: ${before.get(k)} -> ${v}`)
for (const [k, v] of after) if (!before.has(k)) changes.push(`  ${k}: (new) ${v}`)
for (const k of before.keys()) if (!after.has(k)) changes.push(`  ${k}: removed`)

writeFileSync(target, out)
console.log(`wrote utils/skillTable.ts (${after.size} values from ${bot})`)
if (changes.length) console.log(`changed:\n${changes.join('\n')}`)
