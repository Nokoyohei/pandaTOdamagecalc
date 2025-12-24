// Base Power defaults
export const BASE_POWER = {
  DarkCommando: 184,
  GravityCrash: 900,
  CelestialStrike: 550,
  Scythe: 45,
  StaffOfAgony: 65,
  FullHouse: 800,
  EarthquakeBlade: 440,
  SonicSlash: 750,
  TidalSlash: 600,
  TempestStrike: 240,
  GaleStrike: 260,
  ChampionsBlade: 490,
  FlamingFist: 570,
  FanOfKnives: 60,
  ChainOfKnives: 630,
  SuddenAttack: 1200,
  PoisonAssault: 600,
  LuckyFist: 440,
  ShootingSpree: 240,
  Berserk: 350,
  PowerShot: 2500,
  DoubleShot: 2500,
  Blessing: 162,
  WindBlade: 268,
  RasingStorm: 360,
  ElectroAttack: 376,
  StaffOfThunder: 510,
  TeslaField: 430,
  DeadlyFen: 368,
  Earthquake: 495,
  TornadoBlast: 330,
  CleavingTerra: 22.5,
  SharpScream: 3.4,
  HitCombo: 1500,
  OnePair: 2500,
  LadyLuck: 6
} as const

const DarkCommando = (basePower: number = BASE_POWER.DarkCommando) => basePower / 10
const GravityCrash = (basePower: number = BASE_POWER.GravityCrash) => basePower / 10
const CelestialStrike = (skillNum: number, basePower: number = BASE_POWER.CelestialStrike) =>
  basePower / 10 * (1.5 + 0.05 * skillNum)
const Scythe = (attr: number, basePower: number = BASE_POWER.Scythe) => basePower + (30 * attr / 100)
const StaffOfAgony = (attr: number, basePower: number = BASE_POWER.StaffOfAgony) => basePower + (15 * attr) / 100
const FullHouse = (basePower: number = BASE_POWER.FullHouse) => basePower / 200
const EarthquakeBlade = (attr: number, basePower: number = BASE_POWER.EarthquakeBlade) => basePower / 100 + (attr * 2) / 100
const SonicSlash = (attr: number, basePower: number = BASE_POWER.SonicSlash) => basePower / 100 + (attr * 3.5) / 100 //
const TidalSlash = (attr: number, basePower: number = BASE_POWER.TidalSlash) => basePower / 100 + (attr * 2.5) / 100 //
const TempestStrike = (attr: number, basePower: number = BASE_POWER.TempestStrike) => basePower / 100 + (attr * 5) / 100 //
const GaleStrike = (attr: number, basePower: number = BASE_POWER.GaleStrike) => basePower / 100 + (attr * 7) / 100 //
const ChampionsBlade = (attr: number, basePower: number = BASE_POWER.ChampionsBlade) => basePower / 100 + attr / 100
const FlamingFist = (attr: number, basePower: number = BASE_POWER.FlamingFist) => basePower / 100 + attr / 100
const FanOfKnives = (basePower: number = BASE_POWER.FanOfKnives) => basePower //
const ChainOfKnives = (basePower: number = BASE_POWER.ChainOfKnives) => basePower / 100 //
const SuddenAttack = (basePower: number = BASE_POWER.SuddenAttack) => basePower / 100 //
const PoisonAssault = (basePower: number = BASE_POWER.PoisonAssault) => basePower / 100 //
const LuckyFist = (basePower: number = BASE_POWER.LuckyFist) => basePower / 1000
const ShootingSpree = (basePower: number = BASE_POWER.ShootingSpree) => basePower / 100 //
const Berserk = (basePower: number = BASE_POWER.Berserk) => basePower / 100 //
const PowerShot = (basePower: number = BASE_POWER.PowerShot) => basePower / 100 //
const DoubleShot = (basePower: number = BASE_POWER.DoubleShot) => basePower / 100 //
const FireBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 20 //
const WaterBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 20 //
const EarthBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 20 //
const ElecBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 20 //
const WindBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 20 //
const WindBlade = (basePower: number = BASE_POWER.WindBlade) => basePower / 10
const RasingStorm = (basePower: number = BASE_POWER.RasingStorm) => basePower / 10 //
const ElectroAttack = (basePower: number = BASE_POWER.ElectroAttack) => basePower / 10 //
const StaffOfThunder = (basePower: number = BASE_POWER.StaffOfThunder) => basePower / 10 //
const TeslaField = (basePower: number = BASE_POWER.TeslaField) => basePower / 10 //
const DeadlyFen = (basePower: number = BASE_POWER.DeadlyFen) => basePower / 20 //
const Earthquake = (basePower: number = BASE_POWER.Earthquake) => basePower / 10 //
const TornadoBlast = (basePower: number = BASE_POWER.TornadoBlast) => basePower / 10 //
const CleavingTerra = (basePower: number = BASE_POWER.CleavingTerra) => basePower
const SharpScream = (basePower: number = BASE_POWER.SharpScream) => basePower //
const FirstHitCombo = (basePower: number = BASE_POWER.HitCombo) => basePower / 300 //
const SecondHitCombo = (basePower: number = BASE_POWER.HitCombo) => basePower / 400 //
const OnePair = (basePower: number = BASE_POWER.OnePair) => basePower / 100 //
const LadyLuck = (basePower: number = BASE_POWER.LadyLuck) => basePower / 15

export default {
  DarkCommando,
  GravityCrash,
  CelestialStrike,
  Scythe,
  StaffOfAgony,
  FullHouse,
  EarthquakeBlade,
  SonicSlash,
  TidalSlash,
  TempestStrike,
  GaleStrike,
  ChampionsBlade,
  FlamingFist,
  FanOfKnives,
  ChainOfKnives,
  SuddenAttack,
  PoisonAssault,
  ShootingSpree,
  Berserk,
  PowerShot,
  DoubleShot,
  LuckyFist,
  FireBlessing,
  WaterBlessing,
  EarthBlessing,
  ElecBlessing,
  WindBlessing,
  WindBlade,
  RasingStorm,
  ElectroAttack,
  TeslaField,
  CleavingTerra,
  StaffOfThunder,
  DeadlyFen,
  TornadoBlast,
  Earthquake,
  SharpScream,
  FirstHitCombo,
  SecondHitCombo,
  OnePair,
  LadyLuck
}

