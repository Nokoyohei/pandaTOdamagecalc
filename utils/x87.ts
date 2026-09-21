/*
  GameServer.exe が使っている x87 / MSVC ランタイムの挙動。
  出典: SPEC/generated/server/battlehelper_annot.asm
*/

export const INT32_MAX = 2 ** 31 - 1

// 符号付き 32bit 整数への折り返し
export const toInt32 = (n: number): number => {
  if (n >= -(INT32_MAX + 1) && n <= INT32_MAX) return n
  const mod = ((n % 2 ** 32) + 2 ** 32) % 2 ** 32
  return mod > INT32_MAX ? mod - 2 ** 32 : mod
}

/*
  MSVC の _ftol (FUN_008a7cf0)。
  丸めモードを truncate に切り替えて fistp qword し、下位 32bit (eax) を int として返す。
  つまり「0 方向への切り捨て」＋「32bit 折り返し」。
*/
export const ftol = (x: number): number => toInt32(Math.trunc(x))

/*
  x87 の fstp DWORD PTR（float32 への書き戻し）。
  ダメージ計算の中間値は全て float(32bit) のスタック変数を経由するので、
  16,777,216 を超える領域では実際に精度が落ちる。
*/
export const f32 = (x: number): number => Math.fround(x)

// .rdata の浮動小数定数（いずれも float リテラルを double に広げたもの）
export const F32_0_9 = Math.fround(0.9) // 0x97AFA8 : 魔法防御 MD の係数
export const F32_0_75 = 0.75 // 0x95E0E8 : 物理防御 DP の係数
export const F32_0_01 = Math.fround(0.01) // 0x935660 : 属性耐性の百分率
