const DarkCommando = 300 / 10
const GravityCrash = 1200 / 10
const CelestialStrike = (skillNum: number) =>
  (950 / 10) * (1.5 + 0.05 * skillNum)
const Scythe = (attr: number) => 55 + (30 * attr) / 100
const StaffOfAgony = (attr: number) => 85 + (15 * attr) / 100
const FullHouse = 800 / 100
const EarthquakeBlade = (attr: number) => 190 / 100 + (attr * 2) / 100
const SonicSlash = (attr: number) => 700 / 100 + (attr * 3.5) / 100
const TidalSlash = (attr: number) => 500 / 100 + (attr * 2.5) / 100
const TempestStrike = (attr: number) => 280 / 100 + (attr * 5) / 100
const GaleStrike = (attr: number) => 300 / 100 + (attr * 7) / 100
const ChampionsBlade = (attr: number) => 400 / 100 + attr / 100
const FlamingFist = (attr: number) => 40 / 100 + attr / 100
const FanOfKnives = 800 / 10
const ChainOfKnives = 950 / 100
const SuddenAttack = 1600 / 100
const PoisonAssault = 800 / 100
const LuckyFist = 380 / 1000
const ShootingSpree = 400 / 100
const Berserk = 550 / 100
const PowerShot = 800 / 100
const DoubleShot = 1000 / 100
const Blessing = 250 / 20
const WindBlade = 850 / 10
const RasingStorm = 600 / 10
const ElectroAttack = 800 / 10
const CleavingTerra = 650 / 10
const SharpScream = (640 / 200) * 1.5
const FirstHitCombo = 800 / 300
const SecondHitCombo = 800 / 400
const OnePair = 1200 / 100
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
  Blessing,
  WindBlade,
  RasingStorm,
  ElectroAttack,
  CleavingTerra,
  SharpScream,
  FirstHitCombo,
  SecondHitCombo,
  OnePair,
  LadyLuck
}
