/*
 * デバフを掛ける側のステータス。
 * Shield Breaker の量は術者の DA、Area 系の量は術者の MA で決まるが、
 * どちらも普通は別キャラ（パーティのセンス職 / 魔法職）が掛けるので、
 * 入力中のキャラとは別に持つ。既定値はどちらも上限に届く値。
 *   Shield Breaker: DA 275 以上で 80（上限）
 *   Area:           MA 991 以上で 50%（上限）
 */
export const useDebuffCaster = () =>
  useState('debuffCaster', () => ({ da: 300, ma: 2000 }))
