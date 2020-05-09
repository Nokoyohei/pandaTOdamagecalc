const DarkCommando = 300 / 10
const GravityCrash = 1200 / 10
const CelestialStrike = (skillNum: number) =>
  (950 / 10) * (1.5 + 0.05 * skillNum)
const FullHouse = 800 / 100
const EarthquakeBlade = (attr: number) => 190 / 100 + (attr * 2) / 100
const ChampionsBlade = (attr: number) => 400 / 100 + attr / 100
const FanOfKnives = 800 / 10
const ShootingSpree = 400 / 100
const Berserk = 550 / 100
const Blessing = 300 / 20
const WindBlade = 700 / 10
const ElectroAttack = 800 / 10
const CleavingTerra = 650 / 10

export default {
  DarkCommando,
  GravityCrash,
  CelestialStrike,
  FullHouse,
  EarthquakeBlade,
  ChampionsBlade,
  FanOfKnives,
  ShootingSpree,
  Berserk,
  Blessing,
  WindBlade,
  ElectroAttack,
  CleavingTerra
}
