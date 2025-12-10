const DarkCommando = 184 / 10
const GravityCrash = 900 / 10
const CelestialStrike = (skillNum: number, basePower: number = 550 / 10) =>
  basePower * (1.5 + 0.05 * skillNum)
const Scythe = (attr: number, basePower: number = 45) => basePower + (30 * attr / 100)
const StaffOfAgony = (attr: number) => 65 + (15 * attr) / 100
const FullHouse = 800 / 100
const EarthquakeBlade = (attr: number) => 440 / 100 + (attr * 2) / 100
const SonicSlash = (attr: number) => 700 / 100 + (attr * 3.5) / 100 //
const TidalSlash = (attr: number) => 550 / 100 + (attr * 2.5) / 100 //
const TempestStrike = (attr: number) => 240 / 100 + (attr * 5) / 100 //
const GaleStrike = (attr: number) => 260 / 100 + (attr * 7) / 100 //
const ChampionsBlade = (attr: number) => 490 / 100 + attr / 100
const FlamingFist = (attr: number) => 570 / 100 + attr / 100
const FanOfKnives = 600 / 10 //
const ChainOfKnives = 630 / 100 //
const SuddenAttack = 840 / 100 //
const PoisonAssault = 390 / 100 //
const LuckyFist = 440 / 1000 
const ShootingSpree = 240 / 100 //
const Berserk = 350 / 100 //
const PowerShot = 300 / 100 //
const DoubleShot = 480 / 100 //
const FireBlessing = 162 / 20 //
const WaterBlessing = 162 / 20 //
const EarthBlessing = 162 / 20 //
const ElecBlessing = 162 / 20 //
const WindBlessing = 162 / 20 //
const WindBlade = 268 / 10
const RasingStorm = 360 / 10 //
const ElectroAttack = 376 / 10 //
const StaffOfThunder = 510 / 10 //
const TeslaField = 430 / 10 //
const DeadlyFen = 368 / 20 //
const Earthquake = 495 / 10 //
const TornadoBlast = 330 / 10 //
const CleavingTerra = 337 / 10
const SharpScream = (510 / 200) * 1.5 //
const FirstHitCombo = 620 / 300 //
const SecondHitCombo = 620 / 400 //
const OnePair = 690 / 100 //
const LadyLuck = 6 / 15 

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
