import { MISC_SKILL_TABLE } from '~/utils/skillTable'

const MistOfManaBuff = 0.65
// Blood Testament (2219) ESAction_BloodyOath.MARatio / Godly (12219) GodlyBloodyOath.MARatio（utils/skillTable.ts、生成物）
export const BloodTestamentBuff: number = MISC_SKILL_TABLE.bloodTestamentRatio
export const GodlyBloodTestamentBuff: number = MISC_SKILL_TABLE.godlyBloodTestamentRatio
const PumpingHeartBuff = 0.16
const AdrenalineBuff = 0.26
const LuckySevenBuff = 0.65
const AuraOfLuckBuff = 0.18
const FirstdAnniversaryBuff = 0.3
const DodgeMasterBuff = 0.8
const SixthSenseBuff = 0.8
const secondAnniversaryBuff = 0.4
const GunBoosterBuff = 0.65
const BullsEyeBuff = 0.65
const EagleEyeBuff = 0.45
// Precise Pitch (3101) ESAction_PowerThrow.Ratio Lv11（utils/skillTable.ts、生成物）
const PrecisePitch: number = MISC_SKILL_TABLE.precisePitchRatio

// Godly versions
const GodlyAdrenalineBuff = 1.5
const GodlyBullsEyeBuff = 1.5
const GodlyEagleEyeBuff = 1.5
const GodlyLuckySevenBuff = 1.5
const GodlyAuraOfLuckBuff = 1.5
const GodlyDodgeMasterBuff = 1.5
const GodlyMistOfManaBuff = 1.5
const GodlySixthSenseBuff = 1.5

export default {
  MistOfManaBuff,
  BloodTestamentBuff,
  GodlyBloodTestamentBuff,
  PumpingHeartBuff,
  AdrenalineBuff,
  LuckySevenBuff,
  AuraOfLuckBuff,
  FirstdAnniversaryBuff,
  DodgeMasterBuff,
  SixthSenseBuff,
  secondAnniversaryBuff,
  GunBoosterBuff,
  BullsEyeBuff,
  EagleEyeBuff,
  PrecisePitch,
  GodlyAdrenalineBuff,
  GodlyBullsEyeBuff,
  GodlyEagleEyeBuff,
  GodlyLuckySevenBuff,
  GodlyAuraOfLuckBuff,
  GodlyDodgeMasterBuff,
  GodlyMistOfManaBuff,
  GodlySixthSenseBuff
}
