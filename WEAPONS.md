# Psion Chronicles — Weapon Compendium

> Example weapons for every weapon type & subtype, with **suggested damage dice** (and ranges for ranged
> weapons). Built with Luke. Damage dice are **proposals** — the official damage-die table is still open,
> so tweak freely. Attack + damage follow D&D-style rules:
> - **Attack roll** = d20 + governing-attribute mod + proficiency (if proficient) vs. target Defense Score
> - **Damage** = weapon die + governing-attribute mod
>
> Governing attribute per type: **STR** = Heavy/Archery/Fist · **AGI** = Light/Quick/Thrown ·
> **CON** = Firearms/Explosives/Volatile · **INT** = Laser/Plasma/Tech · **WIS** = Channel/Living/Ritual ·
> **CHA** = Finesse/Art/Noise.
>
> Each weapon in the app also carries **hands** (one- or two-handed — dual-wielding needs a one-handed weapon
> in each hand) and a **rarity** (Common · Uncommon · Rare · Very Rare · Legendary). Only Common weapons are
> starting gear; higher rarities have bigger dice + special properties and are found in play. See
> `app/items.js` (`PC.ITEMS`) for the authoritative per-weapon stats.

---

# MELEE WEAPONS

## 💪 STRENGTH

### Heavy Weapons — two-handed, crushing/cleaving
| Subtype | Example weapons | Damage |
|---|---|---|
| Great Hammers | Warmaul, Siege Sledge, Titan's Gavel, Pile Driver | `2d6` |
| Great Swords | Zweihänder, Claymore, Executioner's Blade, Slab Sword | `2d6` |
| Great Axes | Headsman's Axe, Bardiche, Rendcleaver, Lumber Maul | `1d12` |
| Maces | War Mace, Spiked Bludgeon, Morning Star, Flanged Mace | `1d10` |
| Axes | Battleaxe, Hatchet, Tomahawk, Cleaver | `1d8` |

### Fist Weapons — worn over the hands
| Subtype | Example weapons | Damage |
|---|---|---|
| Knuckles | Brass Knuckles, Weighted Wraps, Rebar Knucks | `1d4` |
| Full Fists | Iron Gauntlets, Powered Cestus, Scrap Gauntlets | `1d6` |
| Knuckle Blades | Punch Daggers, Katar, Bladed Wraps, Claw Fists | `1d6` |

## 🤸 AGILITY

### Light Weapons — fast, precise
| Subtype | Example weapons | Damage |
|---|---|---|
| Knives | Combat Knife, Switchblade, Utility Shiv, Kunai | `1d4` |
| Daggers | Stiletto, Parrying Dagger, Rondel, Fang Dagger | `1d4` |
| Batons | Nightstick, Weighted Club, Tactical Baton, Cudgel | `1d6` |
| Short Swords | Gladius, Wakizashi, Cutlass, Falchion | `1d6` |

### Quick Weapons — melee subtypes
| Subtype | Example weapons | Damage |
|---|---|---|
| Tonfa | Riot Tonfa, Twin Tonfa, Hooked Tonfa | `1d6` |
| Wrist Blades | Bracer Blades, Hidden Blade, Retractable Talons | `1d6` |

## 🧠 INTELLIGENCE

### Laser Weapons — melee subtype
| Subtype | Example weapons | Damage |
|---|---|---|
| Laser Swords | Plasma Saber, Light-Edge, Photon Blade, Beam Katana | `1d10` |

### Plasma Weapons — melee subtype
| Subtype | Example weapons | Damage |
|---|---|---|
| Plasma Blades | Plasma Sword, Ion Axe, Superheated Falchion, Fusion Cutter | `1d10` |

### Tech Weapons — all melee
| Subtype | Example weapons | Damage |
|---|---|---|
| Chain Blades | Chainsword, Buzz-Axe, Ripsaw Blade, Rotor Cleaver | `1d10` |
| Power Weapons | Shock Maul, Arc Gauntlet, Power Fist, Voltaic Hammer | `1d10` |
| Rocket Weapons | Rocket Hammer, Thruster Axe, Booster Maul | `1d12` |

## 🕊️ WISDOM

### Channel Weapons — melee subtype
| Subtype | Example weapons | Damage |
|---|---|---|
| Staffs | Quarterstaff, Bo Staff, Rune Staff, Iron Cane | `1d6` |

### Living Weapons — melee-capable
| Subtype | Example weapons | Damage |
|---|---|---|
| Sentient Plants | Thornwhip Vine, Bramble Lash, Barkfist | `1d8` |
| Living Oozes | Slime Morningstar, Amorphous Flail, Ooze Gauntlet | `1d8` |

### Ritual Weapons — all melee
| Subtype | Example weapons | Damage |
|---|---|---|
| Ritual Blades | Athame, Kris Dagger, Sacrificial Knife, Rune Sickle | `1d6` |
| Incense Flails | Censer Flail, Smoke Chain, Sanctified Mace | `1d8` |

## 🎭 CHARISMA

### Finesse Weapons — melee subtypes
| Subtype | Example weapons | Damage |
|---|---|---|
| Fencing Swords | Rapier, Épée, Sabre, Estoc | `1d8` |
| Rope Weapons | Whip, Meteor Hammer, Rope Dart, Chain Whip | `1d6` |

### Art Weapons — all melee
| Subtype | Example weapons | Damage |
|---|---|---|
| Battle Fans | War Fan (Tessen), Bladed Fan, Twin Fans | `1d6` |
| Hoop Blades | Wind-and-Fire Wheels, Ring Blades, Chakram Hoops | `1d6` |
| Nunchucku | Nunchaku, Weighted Chucks, Triple-Section Staff | `1d8` |

### Noise Weapons — melee subtypes
| Subtype | Example weapons | Damage |
|---|---|---|
| Instrument Weapons | Bladed Guitar, War Drum Hammer, Fife Dagger, Axe-Bass | `1d8` |
| Percussive Weapons | Resonance Maul, Shockwave Drumstick, Seismic Hammer | `1d10` |

---

# RANGED WEAPONS

## 💪 STRENGTH

### Archery
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Longbows | War Longbow, Yew Longbow, Composite Longbow | `1d8` | 150 ft |
| Shortbows | Hunting Bow, Recurve Bow, Horsebow | `1d6` | 80 ft |
| Slings | Leather Sling, Shepherd's Sling, War Sling | `1d4` | 60 ft |
| Slingshots | Wrist Rocket, Y-Frame Slingshot, Steel Slingshot | `1d4` | 40 ft |

## 🤸 AGILITY

### Quick Weapons — ranged subtypes
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Hand Crossbows | Pistol Crossbow, Repeater Crossbow, Bracer Bow | `1d6` | 60 ft |
| Blowguns | Dart Tube, Poison Blowpipe, Reed Blowgun | `1d4` + status | 30 ft |

### Thrown Weapons
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Shuriken | Throwing Stars, Ninja Stars, Bo-Shuriken | `1d4` | 20/40 ft |
| Throwing Knives | Balanced Knives, Kunai Set, Flechettes | `1d4` | 20/60 ft |
| Darts | Weighted Darts, Fletched Darts, Needle Darts | `1d4` | 20/40 ft |

## 🛡️ CONSTITUTION

### Firearms
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Rifles | Bolt-Action Rifle, Hunting Rifle, Marksman Rifle, Assault Rifle | `1d10` | 120 ft |
| Handguns | Semi-Auto Pistol, Machine Pistol, Sidearm | `1d8` | 50 ft |
| Revolvers | Six-Shooter, Magnum Revolver, Hand Cannon | `1d10` | 45 ft |

### Explosives — area of effect
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Grenades | Frag Grenade, Concussion Grenade, Pipe Bomb | `2d6` (radius) | thrown 30 ft |
| Mines | Proximity Mine, Land Mine, Bouncing Betty | `2d8` (radius) | placed |
| Improvised Explosives | Molotov, Nail Bomb, Scrap Charge | `2d6` | thrown 20 ft |

### Volatile Weapons
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Flamethrowers | Fuel Projector, Napalm Sprayer, Pyro Lance | `2d6` | 15-ft cone |
| Rocket Launchers | RPG, Missile Tube, Bazooka | `3d6` (radius) | 100 ft |
| Chemical Weapons | Acid Sprayer, Gas Canister Gun, Corrosive Launcher | `1d8` + effect | 30 ft |

## 🧠 INTELLIGENCE

### Laser Weapons — ranged subtypes
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Blaster Rifles | Pulse Rifle, Beam Carbine, Long Blaster | `1d10` | 120 ft |
| Blaster Pistols | Hand Blaster, Prism Pistol, Ion Sidearm | `1d8` | 50 ft |

### Plasma Weapons — ranged subtypes
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Beam Rifles | Plasma Carbine, Ion Beam Rifle, Fusion Lance | `1d12` | 100 ft |
| Plasma Cannons | Heavy Plasma Cannon, Siege Cannon, Ion Mortar | `3d6` (radius) | 90 ft |

## 🕊️ WISDOM

### Channel Weapons — ranged subtypes (project Ki, no KP cost)
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Wands | Focus Wand, Rune Wand, Spirit Rod | `1d8` | 90 ft |
| Amulets | Radiant Amulet, Pulse Charm, Aura Medallion | `1d6` (AoE burst/cone) | 30 ft |

### Living Weapons — ranged subtype
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Insect Hives | Wasp Bracer, Hornet Pauldron, Swarm Hive | `1d6` (swarm, multi-target) | 40 ft |

## 🎭 CHARISMA

### Finesse Weapons — thrown subtype
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Chakrams | Throwing Ring, Bladed Chakram, Twin Chakrams | `1d6` | 30/60 ft (returns) |

### Noise Weapons — ranged subtype
| Subtype | Example weapons | Damage | Range |
|---|---|---|---|
| Amp Weapons | Sonic Amp, Bass Cannon, Resonator | `1d10` (sonic AoE) | 30-ft cone |

---

## Notes & open items
- **Damage dice are suggestions** — scaled D&D-style (fists/knives small; two-handed heavies & energy
  weapons large; explosives/AoE use multi-die). Rebalance as you playtest.
- **Ranges are suggestions** too; thrown weapons list `normal/long` where relevant.
- Some subtypes carry **rider effects** (Blowguns/Chemical = status; Amp/Percussive = sonic/stun;
  Chakrams return) — define these when the effects system is fleshed out.
- **Next step for the app:** wire this into an inventory + equipped-weapon panel on the play sheet, so a
  weapon shows its attack roll (d20 + attr mod + prof) and damage roll (die + attr mod) as tap-to-roll buttons.
