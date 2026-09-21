import { toInt32 } from '~/utils/x87'
import { MONSTER_ROWS } from '~/utils/monsterList'
import type { MonsterRow } from '~/utils/monsterList'
import type { BossMonster } from '~/types'

export interface MonsterChoice {
  id: number
  title: string
  row: MonsterRow
}

/** 検索ボックスに並べる一覧。名前が空の行は ID で出す */
export const MONSTER_CHOICES: MonsterChoice[] = MONSTER_ROWS.map((row) => ({
  id: row[0],
  title: `${row[1] || `#${row[0]}`}  (Lv ${row[2]}, #${row[0]})${row[3] ? '  [boss]' : ''}`,
  row
}))

/*
  MonsterParamEx2 の行をツールのモンスターにする。
  FUN_004DDEE0 が ApLv..HvLv をそのまま stat[] に代入し、HP は int なので
  MaxHpLv が 2^31 を超える行（True God Koiosu など）はゲーム内と同じく折り返す。
  ゲージ数は libconfig に無いので 1（HP をそのまま総量として扱う）。
*/
export const monsterFromRow = (row: MonsterRow): BossMonster => ({
  hp: toInt32(row[4]),
  dp: row[5],
  md: row[6],
  hv: row[7],
  da: row[8],
  fireR: row[9],
  waterR: row[10],
  windR: row[11],
  earthR: row[12],
  elecR: row[13],
  lightR: row[14],
  darkR: row[15],
  noPropR: row[16],
  physicalR: row[17],
  gunR: row[18],
  gaugeNum: 1
})
