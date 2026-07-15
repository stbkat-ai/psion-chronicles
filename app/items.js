/* ============================================================
   Psion Chronicles — Item Catalog
   Master list browsable/searchable from the Inventory tab.
   Weapons carry weaponType + damage die (so they're attack-ready);
   armor carries dsBonus. Depends on data.js (window.PC).
   ============================================================ */
window.PC = window.PC || {};
(function () {
  /* helpers to keep the list terse (local to this IIFE) */
  // hands: 1 or 2 (one- vs two-handed — matters for dual-wielding / Two-Weapon Fighting).
  // rarity: "Common" (starting-gear eligible) | "Uncommon" | "Rare" | "Very Rare" | "Legendary".
  // note: optional special property (GM-adjudicated flavor/mechanic).
  function W(name, weaponType, damage, weight, hands, rarity, note) {
    const w = { name: name, category: "Weapon", weaponType: weaponType, damage: damage, weight: weight, hands: hands || 1, rarity: rarity || "Common" };
    if (note) w.note = note;
    return w;
  }
  function A(name, dsBonus, weight) { return { name: name, category: "Armor", dsBonus: dsBonus, weight: weight }; }
  function C(name, weight, note) { return { name: name, category: "Consumable", weight: weight, note: note }; }
  function T(name, weight, note) { return { name: name, category: "Tool", weight: weight, note: note }; }
  function M(name, weight, note) { return { name: name, category: "Misc", weight: weight, note: note }; }

  PC.ITEMS = [
  /* ===== MELEE WEAPONS =====
     5th arg = hands (1 or 2); 6th = rarity (omitted → Common = starting-eligible);
     7th = special note. All Common weapons below are valid starting gear; higher
     rarities (grouped at the end of each subsection) are NOT offered at creation. */
  // STR — Heavy Weapons
  W("Warmaul", "Heavy Weapons", "2d6", 12, 2), W("Siege Sledge", "Heavy Weapons", "2d6", 14, 2), W("Titan's Gavel", "Heavy Weapons", "2d6", 13, 2),
  W("Zweihander", "Heavy Weapons", "2d6", 12, 2), W("Claymore", "Heavy Weapons", "2d6", 11, 2), W("Executioner's Blade", "Heavy Weapons", "2d6", 13, 2),
  W("Headsman's Axe", "Heavy Weapons", "1d12", 12, 2), W("Bardiche", "Heavy Weapons", "1d12", 12, 2), W("Great Axe", "Heavy Weapons", "1d12", 12, 2),
  W("War Mace", "Heavy Weapons", "1d10", 8, 1), W("Morning Star", "Heavy Weapons", "1d10", 8, 1), W("Flanged Mace", "Heavy Weapons", "1d10", 8, 1),
  W("Battleaxe", "Heavy Weapons", "1d8", 4, 1), W("Hatchet", "Heavy Weapons", "1d8", 3, 1), W("Cleaver", "Heavy Weapons", "1d8", 4, 1),
  W("Colossus Maul", "Heavy Weapons", "2d8", 15, 2, "Rare", "On a hit, the target is pushed 5 ft."),
  W("Sunder Greatsword", "Heavy Weapons", "2d10", 14, 2, "Very Rare", "Ignores 2 points of the target's armor Defense bonus."),
  W("Worldbreaker", "Heavy Weapons", "3d8", 16, 2, "Legendary", "On a critical hit, every enemy within 5 ft is knocked prone."),
  // STR — Fist Weapons
  W("Brass Knuckles", "Fist Weapons", "1d4", 1, 1), W("Weighted Wraps", "Fist Weapons", "1d4", 1, 1),
  W("Iron Gauntlets", "Fist Weapons", "1d6", 3, 1), W("Powered Cestus", "Fist Weapons", "1d6", 4, 1),
  W("Punch Daggers", "Fist Weapons", "1d6", 2, 1), W("Katar", "Fist Weapons", "1d6", 2, 1), W("Claw Fists", "Fist Weapons", "1d6", 2, 1),
  W("Seismic Knuckles", "Fist Weapons", "1d8", 3, 1, "Rare", "On a hit, the target can't take reactions until your next turn."),
  W("Dragon's Cestus", "Fist Weapons", "2d6", 4, 1, "Legendary", "Your unarmed and fist attacks deal +1d6 fire damage."),
  // AGI — Light Weapons
  W("Combat Knife", "Light Weapons", "1d4", 1, 1), W("Switchblade", "Light Weapons", "1d4", 1, 1), W("Kunai", "Light Weapons", "1d4", 1, 1),
  W("Stiletto", "Light Weapons", "1d4", 1, 1), W("Parrying Dagger", "Light Weapons", "1d4", 1, 1), W("Rondel", "Light Weapons", "1d4", 1, 1),
  W("Nightstick", "Light Weapons", "1d6", 2, 1), W("Tactical Baton", "Light Weapons", "1d6", 2, 1), W("Cudgel", "Light Weapons", "1d6", 3, 1),
  W("Gladius", "Light Weapons", "1d6", 3, 1), W("Wakizashi", "Light Weapons", "1d6", 2, 1), W("Cutlass", "Light Weapons", "1d6", 3, 1), W("Falchion", "Light Weapons", "1d6", 3, 1),
  W("Venom Fang", "Light Weapons", "1d6", 1, 1, "Uncommon", "On a hit, the target is poisoned until your next turn."),
  W("Mirror Edge", "Light Weapons", "1d8", 2, 1, "Rare", "Advantage on attacks against a target that hasn't acted yet this combat."),
  W("Shadowsliver", "Light Weapons", "2d6", 1, 1, "Legendary", "Attacks made from stealth deal +2d6 damage."),
  // AGI — Quick Weapons (melee)
  W("Riot Tonfa", "Quick Weapons", "1d6", 2, 1), W("Twin Tonfa", "Quick Weapons", "1d6", 3, 1),
  W("Bracer Blades", "Quick Weapons", "1d6", 2, 1), W("Hidden Blade", "Quick Weapons", "1d6", 1, 1), W("Retractable Talons", "Quick Weapons", "1d6", 2, 1),
  W("Whirl Tonfa", "Quick Weapons", "1d8", 2, 1, "Rare", "After you Dodge, your next attack this turn has advantage."),
  // INT — Laser/Plasma melee
  W("Plasma Saber", "Laser Weapons", "1d10", 3, 1), W("Photon Blade", "Laser Weapons", "1d10", 3, 1), W("Beam Katana", "Laser Weapons", "1d10", 3, 1),
  W("Starlight Saber", "Laser Weapons", "2d8", 3, 1, "Very Rare", "Ignores Defense bonuses from non-powered armor."),
  W("Plasma Sword", "Plasma Weapons", "1d10", 3, 1), W("Ion Axe", "Plasma Weapons", "1d10", 4, 1), W("Fusion Cutter", "Plasma Weapons", "1d10", 3, 1),
  W("Solar Lance", "Plasma Weapons", "2d10", 12, 2, "Legendary", "On a hit, the target burns for 1d6 at the start of its next turn."),
  // INT — Tech Weapons
  W("Chainsword", "Tech Weapons", "1d10", 8, 2), W("Buzz-Axe", "Tech Weapons", "1d10", 8, 2), W("Ripsaw Blade", "Tech Weapons", "1d10", 7, 2),
  W("Shock Maul", "Tech Weapons", "1d10", 6, 1), W("Arc Gauntlet", "Tech Weapons", "1d10", 5, 1), W("Power Fist", "Tech Weapons", "1d8", 4, 1), W("Voltaic Hammer", "Tech Weapons", "1d10", 8, 2),
  W("Rocket Hammer", "Tech Weapons", "1d12", 12, 2), W("Thruster Axe", "Tech Weapons", "1d12", 11, 2),
  W("Titan Chainblade", "Tech Weapons", "2d8", 9, 2, "Rare", "Reroll any 1s on this weapon's damage dice."),
  // WIS — Channel (melee) / Living / Ritual
  W("Quarterstaff", "Channel Weapons", "1d6", 4, 2), W("Bo Staff", "Channel Weapons", "1d6", 4, 2), W("Rune Staff", "Channel Weapons", "1d6", 4, 2), W("Iron Cane", "Channel Weapons", "1d6", 3, 1),
  W("Oakheart Staff", "Channel Weapons", "1d8", 4, 2, "Uncommon", "+2 to your KP maximum while wielded."),
  W("Worldtree Bough", "Channel Weapons", "2d6", 4, 2, "Very Rare", "Healing techniques you use restore +2 HP."),
  W("Thornwhip Vine", "Living Weapons", "1d8", 3, 1), W("Bramble Lash", "Living Weapons", "1d8", 3, 1), W("Barkfist", "Living Weapons", "1d8", 4, 1),
  W("Slime Morningstar", "Living Weapons", "1d8", 4, 1), W("Amorphous Flail", "Living Weapons", "1d8", 4, 1), W("Ooze Gauntlet", "Living Weapons", "1d8", 3, 1),
  W("Venomcoil Lash", "Living Weapons", "2d6", 3, 1, "Rare", "On a hit, the target is Rooted until your next turn."),
  W("Athame", "Ritual Weapons", "1d6", 1, 1), W("Kris Dagger", "Ritual Weapons", "1d6", 1, 1), W("Rune Sickle", "Ritual Weapons", "1d6", 2, 1),
  W("Censer Flail", "Ritual Weapons", "1d8", 4, 1), W("Smoke Chain", "Ritual Weapons", "1d8", 4, 1), W("Sanctified Mace", "Ritual Weapons", "1d8", 5, 1),
  W("Wraithedge Athame", "Ritual Weapons", "1d8", 1, 1, "Rare", "Deals full damage to incorporeal foes; +1d6 vs. the Veil-touched."),
  // CHA — Finesse / Art / Noise (melee)
  W("Rapier", "Finesse Weapons", "1d8", 2, 1), W("Epee", "Finesse Weapons", "1d8", 2, 1), W("Sabre", "Finesse Weapons", "1d8", 3, 1), W("Estoc", "Finesse Weapons", "1d8", 3, 1),
  W("Whip", "Finesse Weapons", "1d6", 2, 1), W("Meteor Hammer", "Finesse Weapons", "1d6", 4, 2), W("Chain Whip", "Finesse Weapons", "1d6", 3, 1),
  W("Duelist's Needle", "Finesse Weapons", "1d10", 2, 1, "Rare", "On a critical hit, make one free attack with this weapon."),
  W("Heartpiercer", "Finesse Weapons", "2d8", 2, 1, "Legendary", "This weapon scores a critical hit on a roll of 19–20."),
  W("War Fan", "Art Weapons", "1d6", 1, 1), W("Bladed Fan", "Art Weapons", "1d6", 1, 1), W("Twin Fans", "Art Weapons", "1d6", 2, 1),
  W("Wind-and-Fire Wheels", "Art Weapons", "1d6", 3, 1), W("Ring Blades", "Art Weapons", "1d6", 3, 1),
  W("Nunchaku", "Art Weapons", "1d8", 2, 1), W("Triple-Section Staff", "Art Weapons", "1d8", 4, 2),
  W("Tempest Fans", "Art Weapons", "2d6", 2, 1, "Very Rare", "On a hit, push the target 5 ft; it has disadvantage on its next attack."),
  W("Bladed Guitar", "Noise Weapons", "1d8", 6, 2), W("War Drum Hammer", "Noise Weapons", "1d8", 7, 2), W("Axe-Bass", "Noise Weapons", "1d8", 8, 2),
  W("Resonance Maul", "Noise Weapons", "1d10", 8, 2), W("Shockwave Drumstick", "Noise Weapons", "1d10", 6, 1), W("Seismic Hammer", "Noise Weapons", "1d10", 10, 2),
  W("Subwoofer Maul", "Noise Weapons", "2d8", 9, 2, "Rare", "On a hit, the target is deafened until your next turn."),
  W("Anthem Cannon", "Noise Weapons", "3d6", 8, 2, "Legendary", "On a hit, allies within 15 ft gain temp HP equal to your CHA mod."),

  /* ===== RANGED WEAPONS ===== */
  // STR — Archery
  W("War Longbow", "Archery", "1d8", 3, 2), W("Yew Longbow", "Archery", "1d8", 3, 2), W("Composite Longbow", "Archery", "1d8", 3, 2),
  W("Hunting Bow", "Archery", "1d6", 2, 2), W("Recurve Bow", "Archery", "1d6", 2, 2), W("Horsebow", "Archery", "1d6", 2, 2),
  W("Leather Sling", "Archery", "1d4", 1, 1), W("War Sling", "Archery", "1d4", 1, 1), W("Steel Slingshot", "Archery", "1d4", 1, 1), W("Wrist Rocket", "Archery", "1d4", 1, 1),
  W("Stormstring Longbow", "Archery", "2d6", 3, 2, "Rare", "On a hit, the target has disadvantage on its next attack."),
  W("Skypiercer", "Archery", "2d8", 3, 2, "Legendary", "Ignores half and three-quarters cover."),
  // AGI — Quick (ranged) / Thrown
  W("Pistol Crossbow", "Quick Weapons", "1d6", 3, 1), W("Repeater Crossbow", "Quick Weapons", "1d6", 4, 2), W("Bracer Bow", "Quick Weapons", "1d6", 2, 1),
  W("Poison Blowpipe", "Quick Weapons", "1d4", 1, 2), W("Reed Blowgun", "Quick Weapons", "1d4", 1, 2),
  W("Shuriken", "Thrown Weapons", "1d4", 1, 1), W("Bo-Shuriken", "Thrown Weapons", "1d4", 1, 1),
  W("Throwing Knives", "Thrown Weapons", "1d4", 1, 1), W("Flechettes", "Thrown Weapons", "1d4", 1, 1), W("Throwing Darts", "Thrown Weapons", "1d4", 1, 1),
  W("Returning Kunai", "Thrown Weapons", "1d6", 1, 1, "Uncommon", "Returns to your hand at the end of your turn."),
  // CON — Firearms / Explosives / Volatile
  W("Bolt-Action Rifle", "Firearms", "1d10", 8, 2), W("Hunting Rifle", "Firearms", "1d10", 8, 2), W("Marksman Rifle", "Firearms", "1d10", 9, 2), W("Assault Rifle", "Firearms", "1d10", 8, 2),
  W("Semi-Auto Pistol", "Firearms", "1d8", 3, 1), W("Machine Pistol", "Firearms", "1d8", 4, 1), W("Sidearm", "Firearms", "1d8", 2, 1),
  W("Six-Shooter", "Firearms", "1d10", 3, 1), W("Magnum Revolver", "Firearms", "1d10", 4, 1), W("Hand Cannon", "Firearms", "1d10", 5, 1),
  W("Pump Shotgun", "Firearms", "1d12", 7, 2),
  W("Executioner's Revolver", "Firearms", "2d8", 5, 1, "Rare", "Scores a critical hit on a roll of 19–20."),
  W("Anti-Materiel Rifle", "Firearms", "2d10", 12, 2, "Very Rare", "Ignores 3 points of armor Defense bonus; deafeningly loud."),
  W("Frag Grenade", "Explosives", "2d6", 1, 1), W("Concussion Grenade", "Explosives", "2d6", 1, 1), W("Pipe Bomb", "Explosives", "2d6", 2, 1),
  W("Proximity Mine", "Explosives", "2d8", 2, 1), W("Land Mine", "Explosives", "2d8", 3, 1),
  W("Molotov", "Explosives", "2d6", 2, 1), W("Nail Bomb", "Explosives", "2d6", 2, 1),
  W("Cluster Grenade", "Explosives", "3d6", 2, 1, "Rare", "Hits every creature in a 15-ft radius."),
  W("Flamethrower", "Volatile Weapons", "2d6", 12, 2), W("Napalm Sprayer", "Volatile Weapons", "2d6", 13, 2),
  W("Rocket Launcher", "Volatile Weapons", "3d6", 15, 2), W("Bazooka", "Volatile Weapons", "3d6", 16, 2),
  W("Acid Sprayer", "Volatile Weapons", "1d8", 8, 2), W("Gas Canister Gun", "Volatile Weapons", "1d8", 8, 2),
  W("Inferno Projector", "Volatile Weapons", "3d6", 14, 2, "Very Rare", "20-ft cone; targets burn for 1d6 at the start of their next turn."),
  // INT — Laser / Plasma (ranged)
  W("Pulse Rifle", "Laser Weapons", "1d10", 8, 2), W("Beam Carbine", "Laser Weapons", "1d10", 7, 2), W("Long Blaster", "Laser Weapons", "1d10", 9, 2),
  W("Hand Blaster", "Laser Weapons", "1d8", 3, 1), W("Prism Pistol", "Laser Weapons", "1d8", 3, 1), W("Ion Sidearm", "Laser Weapons", "1d8", 3, 1),
  W("Photon Repeater", "Laser Weapons", "2d8", 8, 2, "Rare", "On a hit, the target's Defense drops by 1 until your next turn."),
  W("Plasma Carbine", "Plasma Weapons", "1d12", 10, 2), W("Ion Beam Rifle", "Plasma Weapons", "1d12", 11, 2), W("Fusion Lance", "Plasma Weapons", "1d12", 12, 2),
  W("Heavy Plasma Cannon", "Plasma Weapons", "3d6", 20, 2), W("Ion Mortar", "Plasma Weapons", "3d6", 22, 2),
  W("Singularity Cannon", "Plasma Weapons", "4d6", 22, 2, "Legendary", "On a hit, enemies within 10 ft of the target are pulled 5 ft toward it."),
  // WIS — Channel (ranged) / Living (ranged)
  W("Focus Wand", "Channel Weapons", "1d8", 1, 1), W("Rune Wand", "Channel Weapons", "1d8", 1, 1), W("Spirit Rod", "Channel Weapons", "1d8", 2, 1),
  W("Radiant Amulet", "Channel Weapons", "1d6", 1, 1), W("Pulse Charm", "Channel Weapons", "1d6", 1, 1), W("Aura Medallion", "Channel Weapons", "1d6", 1, 1),
  W("Seraph Focus", "Channel Weapons", "2d6", 1, 1, "Very Rare", "Once per turn, a technique you cast this turn costs 2 less KP (min 0)."),
  W("Wasp Bracer", "Living Weapons", "1d6", 2, 1), W("Hornet Pauldron", "Living Weapons", "1d6", 3, 1),
  W("Hivemaw Gauntlet", "Living Weapons", "2d6", 3, 1, "Rare", "On a hit, the target takes 1d4 at the start of its next turn."),
  // CHA — Finesse (thrown) / Noise (ranged)
  W("Throwing Ring", "Finesse Weapons", "1d6", 1, 1), W("Bladed Chakram", "Finesse Weapons", "1d6", 2, 1), W("Twin Chakrams", "Finesse Weapons", "1d6", 3, 1),
  W("Razor Halo", "Finesse Weapons", "2d6", 2, 1, "Rare", "Returns to your hand; on a hit, may ricochet to a second target within 10 ft."),
  W("Sonic Amp", "Noise Weapons", "1d10", 6, 2), W("Bass Cannon", "Noise Weapons", "1d10", 8, 2), W("Resonator", "Noise Weapons", "1d10", 5, 1),
  W("Cataclysm Speaker", "Noise Weapons", "3d6", 8, 2, "Legendary", "On a hit, all enemies within 10 ft of the target are pushed 5 ft."),

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
