/* ============================================================
   Psion Chronicles — Item Catalog
   Master list browsable/searchable from the Inventory tab.
   Weapons carry weaponType + damage die (so they're attack-ready);
   armor carries dsBonus. Depends on data.js (window.PC).
   ============================================================ */
window.PC = window.PC || {};
(function () {
  /* helpers to keep the list terse (local to this IIFE) */
  function W(name, weaponType, damage, weight) { return { name: name, category: "Weapon", weaponType: weaponType, damage: damage, weight: weight }; }
  function A(name, dsBonus, weight) { return { name: name, category: "Armor", dsBonus: dsBonus, weight: weight }; }
  function C(name, weight, note) { return { name: name, category: "Consumable", weight: weight, note: note }; }
  function T(name, weight, note) { return { name: name, category: "Tool", weight: weight, note: note }; }
  function M(name, weight, note) { return { name: name, category: "Misc", weight: weight, note: note }; }

  PC.ITEMS = [
  /* ===== MELEE WEAPONS ===== */
  // STR — Heavy Weapons
  W("Warmaul", "Heavy Weapons", "2d6", 12), W("Siege Sledge", "Heavy Weapons", "2d6", 14), W("Titan's Gavel", "Heavy Weapons", "2d6", 13),
  W("Zweihander", "Heavy Weapons", "2d6", 12), W("Claymore", "Heavy Weapons", "2d6", 11), W("Executioner's Blade", "Heavy Weapons", "2d6", 13),
  W("Headsman's Axe", "Heavy Weapons", "1d12", 12), W("Bardiche", "Heavy Weapons", "1d12", 12), W("Great Axe", "Heavy Weapons", "1d12", 12),
  W("War Mace", "Heavy Weapons", "1d10", 8), W("Morning Star", "Heavy Weapons", "1d10", 8), W("Flanged Mace", "Heavy Weapons", "1d10", 8),
  W("Battleaxe", "Heavy Weapons", "1d8", 4), W("Hatchet", "Heavy Weapons", "1d8", 3), W("Cleaver", "Heavy Weapons", "1d8", 4),
  // STR — Fist Weapons
  W("Brass Knuckles", "Fist Weapons", "1d4", 1), W("Weighted Wraps", "Fist Weapons", "1d4", 1),
  W("Iron Gauntlets", "Fist Weapons", "1d6", 3), W("Powered Cestus", "Fist Weapons", "1d6", 4),
  W("Punch Daggers", "Fist Weapons", "1d6", 2), W("Katar", "Fist Weapons", "1d6", 2), W("Claw Fists", "Fist Weapons", "1d6", 2),
  // AGI — Light Weapons
  W("Combat Knife", "Light Weapons", "1d4", 1), W("Switchblade", "Light Weapons", "1d4", 1), W("Kunai", "Light Weapons", "1d4", 1),
  W("Stiletto", "Light Weapons", "1d4", 1), W("Parrying Dagger", "Light Weapons", "1d4", 1), W("Rondel", "Light Weapons", "1d4", 1),
  W("Nightstick", "Light Weapons", "1d6", 2), W("Tactical Baton", "Light Weapons", "1d6", 2), W("Cudgel", "Light Weapons", "1d6", 3),
  W("Gladius", "Light Weapons", "1d6", 3), W("Wakizashi", "Light Weapons", "1d6", 2), W("Cutlass", "Light Weapons", "1d6", 3), W("Falchion", "Light Weapons", "1d6", 3),
  // AGI — Quick Weapons (melee)
  W("Riot Tonfa", "Quick Weapons", "1d6", 2), W("Twin Tonfa", "Quick Weapons", "1d6", 3),
  W("Bracer Blades", "Quick Weapons", "1d6", 2), W("Hidden Blade", "Quick Weapons", "1d6", 1), W("Retractable Talons", "Quick Weapons", "1d6", 2),
  // INT — Laser/Plasma melee
  W("Plasma Saber", "Laser Weapons", "1d10", 3), W("Photon Blade", "Laser Weapons", "1d10", 3), W("Beam Katana", "Laser Weapons", "1d10", 3),
  W("Plasma Sword", "Plasma Weapons", "1d10", 3), W("Ion Axe", "Plasma Weapons", "1d10", 4), W("Fusion Cutter", "Plasma Weapons", "1d10", 3),
  // INT — Tech Weapons
  W("Chainsword", "Tech Weapons", "1d10", 8), W("Buzz-Axe", "Tech Weapons", "1d10", 8), W("Ripsaw Blade", "Tech Weapons", "1d10", 7),
  W("Shock Maul", "Tech Weapons", "1d10", 6), W("Arc Gauntlet", "Tech Weapons", "1d10", 5), W("Power Fist", "Tech Weapons", "1d8", 4), W("Voltaic Hammer", "Tech Weapons", "1d10", 8),
  W("Rocket Hammer", "Tech Weapons", "1d12", 12), W("Thruster Axe", "Tech Weapons", "1d12", 11),
  // WIS — Channel (melee) / Living / Ritual
  W("Quarterstaff", "Channel Weapons", "1d6", 4), W("Bo Staff", "Channel Weapons", "1d6", 4), W("Rune Staff", "Channel Weapons", "1d6", 4), W("Iron Cane", "Channel Weapons", "1d6", 3),
  W("Thornwhip Vine", "Living Weapons", "1d8", 3), W("Bramble Lash", "Living Weapons", "1d8", 3), W("Barkfist", "Living Weapons", "1d8", 4),
  W("Slime Morningstar", "Living Weapons", "1d8", 4), W("Amorphous Flail", "Living Weapons", "1d8", 4), W("Ooze Gauntlet", "Living Weapons", "1d8", 3),
  W("Athame", "Ritual Weapons", "1d6", 1), W("Kris Dagger", "Ritual Weapons", "1d6", 1), W("Rune Sickle", "Ritual Weapons", "1d6", 2),
  W("Censer Flail", "Ritual Weapons", "1d8", 4), W("Smoke Chain", "Ritual Weapons", "1d8", 4), W("Sanctified Mace", "Ritual Weapons", "1d8", 5),
  // CHA — Finesse / Art / Noise (melee)
  W("Rapier", "Finesse Weapons", "1d8", 2), W("Epee", "Finesse Weapons", "1d8", 2), W("Sabre", "Finesse Weapons", "1d8", 3), W("Estoc", "Finesse Weapons", "1d8", 3),
  W("Whip", "Finesse Weapons", "1d6", 2), W("Meteor Hammer", "Finesse Weapons", "1d6", 4), W("Chain Whip", "Finesse Weapons", "1d6", 3),
  W("War Fan", "Art Weapons", "1d6", 1), W("Bladed Fan", "Art Weapons", "1d6", 1), W("Twin Fans", "Art Weapons", "1d6", 2),
  W("Wind-and-Fire Wheels", "Art Weapons", "1d6", 3), W("Ring Blades", "Art Weapons", "1d6", 3),
  W("Nunchaku", "Art Weapons", "1d8", 2), W("Triple-Section Staff", "Art Weapons", "1d8", 4),
  W("Bladed Guitar", "Noise Weapons", "1d8", 6), W("War Drum Hammer", "Noise Weapons", "1d8", 7), W("Axe-Bass", "Noise Weapons", "1d8", 8),
  W("Resonance Maul", "Noise Weapons", "1d10", 8), W("Shockwave Drumstick", "Noise Weapons", "1d10", 6), W("Seismic Hammer", "Noise Weapons", "1d10", 10),

  /* ===== RANGED WEAPONS ===== */
  // STR — Archery
  W("War Longbow", "Archery", "1d8", 3), W("Yew Longbow", "Archery", "1d8", 3), W("Composite Longbow", "Archery", "1d8", 3),
  W("Hunting Bow", "Archery", "1d6", 2), W("Recurve Bow", "Archery", "1d6", 2), W("Horsebow", "Archery", "1d6", 2),
  W("Leather Sling", "Archery", "1d4", 1), W("War Sling", "Archery", "1d4", 1), W("Steel Slingshot", "Archery", "1d4", 1), W("Wrist Rocket", "Archery", "1d4", 1),
  // AGI — Quick (ranged) / Thrown
  W("Pistol Crossbow", "Quick Weapons", "1d6", 3), W("Repeater Crossbow", "Quick Weapons", "1d6", 4), W("Bracer Bow", "Quick Weapons", "1d6", 2),
  W("Poison Blowpipe", "Quick Weapons", "1d4", 1), W("Reed Blowgun", "Quick Weapons", "1d4", 1),
  W("Shuriken", "Thrown Weapons", "1d4", 1), W("Bo-Shuriken", "Thrown Weapons", "1d4", 1),
  W("Throwing Knives", "Thrown Weapons", "1d4", 1), W("Flechettes", "Thrown Weapons", "1d4", 1), W("Throwing Darts", "Thrown Weapons", "1d4", 1),
  // CON — Firearms / Explosives / Volatile
  W("Bolt-Action Rifle", "Firearms", "1d10", 8), W("Hunting Rifle", "Firearms", "1d10", 8), W("Marksman Rifle", "Firearms", "1d10", 9), W("Assault Rifle", "Firearms", "1d10", 8),
  W("Semi-Auto Pistol", "Firearms", "1d8", 3), W("Machine Pistol", "Firearms", "1d8", 4), W("Sidearm", "Firearms", "1d8", 2),
  W("Six-Shooter", "Firearms", "1d10", 3), W("Magnum Revolver", "Firearms", "1d10", 4), W("Hand Cannon", "Firearms", "1d10", 5),
  W("Pump Shotgun", "Firearms", "1d12", 7),
  W("Frag Grenade", "Explosives", "2d6", 1), W("Concussion Grenade", "Explosives", "2d6", 1), W("Pipe Bomb", "Explosives", "2d6", 2),
  W("Proximity Mine", "Explosives", "2d8", 2), W("Land Mine", "Explosives", "2d8", 3),
  W("Molotov", "Explosives", "2d6", 2), W("Nail Bomb", "Explosives", "2d6", 2),
  W("Flamethrower", "Volatile Weapons", "2d6", 12), W("Napalm Sprayer", "Volatile Weapons", "2d6", 13),
  W("Rocket Launcher", "Volatile Weapons", "3d6", 15), W("Bazooka", "Volatile Weapons", "3d6", 16),
  W("Acid Sprayer", "Volatile Weapons", "1d8", 8), W("Gas Canister Gun", "Volatile Weapons", "1d8", 8),
  // INT — Laser / Plasma (ranged)
  W("Pulse Rifle", "Laser Weapons", "1d10", 8), W("Beam Carbine", "Laser Weapons", "1d10", 7), W("Long Blaster", "Laser Weapons", "1d10", 9),
  W("Hand Blaster", "Laser Weapons", "1d8", 3), W("Prism Pistol", "Laser Weapons", "1d8", 3), W("Ion Sidearm", "Laser Weapons", "1d8", 3),
  W("Plasma Carbine", "Plasma Weapons", "1d12", 10), W("Ion Beam Rifle", "Plasma Weapons", "1d12", 11), W("Fusion Lance", "Plasma Weapons", "1d12", 12),
  W("Heavy Plasma Cannon", "Plasma Weapons", "3d6", 20), W("Ion Mortar", "Plasma Weapons", "3d6", 22),
  // WIS — Channel (ranged) / Living (ranged)
  W("Focus Wand", "Channel Weapons", "1d8", 1), W("Rune Wand", "Channel Weapons", "1d8", 1), W("Spirit Rod", "Channel Weapons", "1d8", 2),
  W("Radiant Amulet", "Channel Weapons", "1d6", 1), W("Pulse Charm", "Channel Weapons", "1d6", 1), W("Aura Medallion", "Channel Weapons", "1d6", 1),
  W("Wasp Bracer", "Living Weapons", "1d6", 2), W("Hornet Pauldron", "Living Weapons", "1d6", 3),
  // CHA — Finesse (thrown) / Noise (ranged)
  W("Throwing Ring", "Finesse Weapons", "1d6", 1), W("Bladed Chakram", "Finesse Weapons", "1d6", 2), W("Twin Chakrams", "Finesse Weapons", "1d6", 3),
  W("Sonic Amp", "Noise Weapons", "1d10", 6), W("Bass Cannon", "Noise Weapons", "1d10", 8), W("Resonator", "Noise Weapons", "1d10", 5),

  /* ===== ARMOR ===== */
  A("Padded Cloak", 1, 4), A("Traveling Robes", 1, 4), A("Fine Clothes", 1, 3), A("Fine Robes", 1, 3), A("Monk's Wraps", 1, 2), A("Combat Fatigues", 1, 4), A("Reinforced Coat", 1, 6), A("Camo Poncho", 1, 4),
  A("Leather Armor", 2, 8), A("Shadowed Leathers", 2, 8), A("Weathered Leathers", 2, 8), A("Reinforced Vest", 2, 15), A("Enchanted Shawl", 2, 5), A("Ceremonial Vestments", 2, 6), A("Lab Exosuit", 2, 18), A("Riot Shield", 2, 10),
  A("Kevlar Vest", 3, 12), A("Heavy Plating", 3, 25), A("Riot Gear", 3, 22), A("Combat Exosuit", 3, 20),
  A("Powered Armor", 4, 40),

  /* ===== CONSUMABLES ===== */
  C("Trail Rations", 2, "A day's food."),
  C("Waterskin", 3, "Holds a day of water."),
  C("Health Draught", 0.5, "Restores 2d6 HP when used."),
  C("Greater Health Draught", 0.5, "Restores 4d6 HP when used."),
  C("Stimpak", 0.5, "Restores 3d6 HP; can un-cripple one limb."),
  C("KP Elixir", 0.5, "Restores 2d6 KP when used."),
  C("Chakra Salve", 0.5, "Heals 1 hit on each damaged chakra."),
  C("Antitoxin", 0.5, "Cures poison / ends Weakened."),
  C("Bandages", 1, "Stabilize a downed ally / heal 1d4 HP."),
  C("Adrenaline Shot", 0.5, "Gain an extra action this turn (once)."),
  C("Smoke Bomb", 1, "Creates a 15-ft smoke cloud (obscured)."),
  C("Flare", 0.5, "Bright light for several minutes."),
  C("Rez Serum", 1, "Revives a downed ally to 1 HP."),

  /* ===== TOOLS ===== */
  T("Lockpicks", 1, "Deft Tools / Sleight of Hand checks to open locks."),
  T("Medkit", 3, "Medicine checks; heal or stabilize."),
  T("Survival Kit", 3, "Survival checks; fire, shelter, foraging."),
  T("Herbalism Kit", 3, "Herbalism checks; brew remedies."),
  T("Engineer's Tools", 4, "Technology checks; repair & build."),
  T("Toolkit", 5, "General repairs and Laborer's Tools checks."),
  T("Climbing Kit", 5, "Ropes, pitons, harness for climbing."),
  T("Rope (50 ft)", 5, "Hemp or synthetic rope."),
  T("Grappling Hook", 2, "Anchor for climbing / swinging."),
  T("Old-World Datapad", 1, "Access old-world data & History/Technology."),
  T("Comm Device", 1, "Short-range communication."),
  T("Lantern", 2, "Bright light in a radius."),
  T("Torch", 1, "Improvised light / fire source."),
  T("Binoculars", 1, "See distant targets (Awareness)."),
  T("Musical Instrument", 4, "Music / Performance checks (lute, drum, etc.)."),
  T("Incense Kit", 2, "Ritual / Paranormal focus."),

  /* ===== MISC ===== */
  M("Backpack", 2, "Carries your gear."),
  M("Bedroll", 4, "For resting."),
  M("Component Pouch", 2, "Spell / ritual components."),
  M("Holy Charm", 1, "A blessed token."),
  M("Prayer Beads", 1, "A focus for meditation."),
  M("Meditation Stone", 1, "A calming focus."),
  M("Old-World Relic", 1, "A curiosity from before the Veil."),
  M("Scrip / Currency", 0, "The coin of the Post-Veil world."),
  M("Journal & Pen", 1, "For notes and records."),
  M("Sigil Talisman", 1, "A personal ward."),
  ];
})();
