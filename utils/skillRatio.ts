// Base Power defaults
export const BASE_POWER = {
  DarkCommando: 1840,
  GravityCrash: 9000,
  CelestialStrike: 5000,
  Scythe: 100,
  StaffOfAgony: 65,
  FullHouse: 400,
  EarthquakeBlade: 440,
  SonicSlash: 1000,
  TidalSlash: 1000,
  TempestStrike: 240,
  GaleStrike: 260,
  ChampionsBlade: 490,
  FlamingFist: 530,
  FanOfKnives: 600,
  ChainOfKnives: 2000,
  SuddenAttack: 2500,
  PoisonAssault: 1200,
  LuckyFist: 100,
  ShootingSpree: 245,
  Berserk: 350,
  PowerShot: 2000,
  DoubleShot: 2000,
  Blessing: 1620,
  WindBlade: 2680,
  RasingStorm: 2700,
  ElectroAttack: 2510,
  StaffOfThunder: 15000,
  TeslaField: 1720,
  DeadlyFen: 4000,
  Earthquake: 3500,
  TornadoBlast: 1320,
  CleavingTerra: 2250,
  SharpScream: 340,
  HitCombo: 2000,
  OnePair: 3000,
  LadyLuck: 6
} as const

const DarkCommando = (basePower: number = BASE_POWER.DarkCommando) => basePower / 1000
const GravityCrash = (basePower: number = BASE_POWER.GravityCrash) => basePower / 1000
const CelestialStrike = (skillNum: number, basePower: number = BASE_POWER.CelestialStrike) =>
  basePower / 1000 * (34 + skillNum) / 22.5
const Scythe = (attr: number, basePower: number = BASE_POWER.Scythe) => basePower + (30 * attr / 100)
const StaffOfAgony = (attr: number, basePower: number = BASE_POWER.StaffOfAgony) => basePower + (15 * attr) / 100
const FullHouse = (basePower: number = BASE_POWER.FullHouse) => basePower / 100
const EarthquakeBlade = (attr: number, basePower: number = BASE_POWER.EarthquakeBlade) => basePower / 100 + (attr * 2) / 100
const SonicSlash = (attr: number, basePower: number = BASE_POWER.SonicSlash) => basePower / 100 + (attr * 3.5) / 100 //
const TidalSlash = (attr: number, basePower: number = BASE_POWER.TidalSlash) => basePower / 100 + (attr * 2.5) / 100 //
const TempestStrike = (attr: number, basePower: number = BASE_POWER.TempestStrike) => basePower / 100 + (attr * 5) / 100 //
const GaleStrike = (attr: number, basePower: number = BASE_POWER.GaleStrike) => basePower / 100 + (attr * 7) / 100 //
const ChampionsBlade = (attr: number, basePower: number = BASE_POWER.ChampionsBlade) => basePower / 100 + attr / 100
const FlamingFist = (attr: number, basePower: number = BASE_POWER.FlamingFist) => basePower / 100 + attr / 100
const FanOfKnives = (basePower: number = BASE_POWER.FanOfKnives) => basePower / 10 
const ChainOfKnives = (basePower: number = BASE_POWER.ChainOfKnives) => basePower / 100 //
const SuddenAttack = (basePower: number = BASE_POWER.SuddenAttack) => basePower / 100 //
const PoisonAssault = (basePower: number = BASE_POWER.PoisonAssault) => basePower / 100 //
const LuckyFist = (basePower: number = BASE_POWER.LuckyFist) => basePower / 1000
const ShootingSpree = (basePower: number = BASE_POWER.ShootingSpree) => basePower / 100 //
const Berserk = (basePower: number = BASE_POWER.Berserk) => basePower / 100 //
const PowerShot = (basePower: number = BASE_POWER.PowerShot) => basePower / 100 //
const DoubleShot = (basePower: number = BASE_POWER.DoubleShot) => basePower / 100 //
const FireBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 200 //
const WaterBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 200 //
const EarthBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 200 //
const ElecBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 200 //
const WindBlessing = (basePower: number = BASE_POWER.Blessing) => basePower / 200 //
const WindBlade = (basePower: number = BASE_POWER.WindBlade) => basePower / 100
const RasingStorm = (basePower: number = BASE_POWER.RasingStorm) => basePower / 100 //
const ElectroAttack = (basePower: number = BASE_POWER.ElectroAttack) => basePower / 100 //
const StaffOfThunder = (basePower: number = BASE_POWER.StaffOfThunder) => basePower / 1000 //
const TeslaField = (basePower: number = BASE_POWER.TeslaField) => basePower / 100 //
const DeadlyFen = (basePower: number = BASE_POWER.DeadlyFen) => basePower / 200 //
const Earthquake = (basePower: number = BASE_POWER.Earthquake) => basePower / 100 //
const TornadoBlast = (basePower: number = BASE_POWER.TornadoBlast) => basePower / 100 //
const CleavingTerra = (basePower: number = BASE_POWER.CleavingTerra) => basePower / 100
const SharpScream = (basePower: number = BASE_POWER.SharpScream) => basePower / 100 //
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

