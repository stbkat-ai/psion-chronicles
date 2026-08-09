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
    // Thrown weapons ARE their own ammunition: expended on the throw, recovered afterward. Flagged so the UI
    // can say so; kept deliberately light (see their weights) so players carry several.
    if (weaponType === "Thrown Weapons") w.thrown = true;
    return w;
  }
  // Ammunition — a stack of ROUNDS that feeds a family of ranged weapons. `feeds` = plain-English label of what
  // it supplies; `weight` is PER ROUND (so a stack's weight = weight × rounds); `count` = rounds one pickup adds
  // (a box/quiver/canister). The play sheet spends one round per shot and stacks merge by name.
  function AM(name, feeds, weight, count, note) {
    const a = { name: name, category: "Ammo", feeds: feeds, weight: weight, count: count || 1, rarity: "Common" };
    if (note) a.note = note;
    return a;
  }
  // Armor. cls = "Light"|"Medium"|"Heavy"; rarity default Common. note = descriptive special effect
  // (GM-applied). grants = structured perks the engine auto-applies while equipped & proficient, e.g.
  // { advSkill: "Stealth" } (advantage on that skill) or { noMovePenalty: true }.
  // coverage = which paper-doll slot the piece fills: "full" (whole-body armor → Torso; the entire current
  // catalog) or a single apparel slot ("head"|"torso"|"back"|"arms"|"legs"|"feet") for future per-slot pieces
  // (helmets, capes, gauntlets, greaves, boots…). Omitting it keeps a piece full-body, so the catalog is unchanged.
  function A(name, cls, dsBonus, weight, rarity, note, grants, coverage) {
    const a = { name: name, category: "Armor", armorClass: cls, dsBonus: dsBonus, weight: weight, rarity: rarity || "Common", coverage: coverage || "full" };
    if (note) a.note = note;
    if (grants) a.grants = grants;
    return a;
  }
  // Apparel piece for one specific paper-doll slot (head|back|arms|legs|feet — torso uses A()). It IS armor
  // (armorClass still gates AGI/proficiency, dsBonus still sums into Defense), it just fills a single slot so
  // pieces layer: a helm + cloak + gauntlets + greaves + boots stack alongside body armor. Keep dsBonus modest
  // (0–2) — body armor and shields stay the big Defense contributors; accessories are mostly utility.
  function AP(name, slot, cls, dsBonus, weight, rarity, note, grants) {
    return A(name, cls, dsBonus, weight, rarity, note, grants, slot);
  }
  // effect = structured mechanics applied on Use (optional). Keys the play sheet understands:
  //   hp / kp: dice string ("2d6") or flat number — restore that much HP / KP
  //   hpFull / kpFull: true — restore HP / KP to max
  //   chakraHeal: N — heal N hits on each damaged chakra
  //   uncripple: N — restore N crippled limbs to full; uncrippleAll: true — restore every crippled limb
  //   reviveSelf: true — if you're at 0 HP, come back to 1 HP first
  //   cure / note: text — narrative effects the GM adjudicates (no tracked condition yet)
  function C(name, weight, note, effect) { const c = { name: name, category: "Consumable", weight: weight, note: note }; if (effect) c.effect = effect; return c; }
  // skill = the Skill this kit supports (optional). Skill kits carry it; general gear leaves it null.
  function T(name, weight, note, skill) { const t = { name: name, category: "Tool", weight: weight, note: note }; if (skill) t.skill = skill; return t; }
  function M(name, weight, note) { return { name: name, category: "Misc", weight: weight, note: note }; }
  // Shield — held in one hand; grants dsBonus while equipped, and enables the Block reaction (spend your
  // reaction to add its dsBonus again against one incoming hit until your next turn). category "Shield".
  function S(name, subtype, dsBonus, weight, rarity, note) { const s = { name: name, category: "Shield", subtype: subtype, dsBonus: dsBonus, weight: weight, hands: 1, rarity: rarity || "Common" }; if (note) s.note = note; return s; }

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
  W("Shuriken", "Thrown Weapons", "1d4", 0.5, 1), W("Bo-Shuriken", "Thrown Weapons", "1d4", 0.5, 1),
  W("Throwing Knives", "Thrown Weapons", "1d4", 0.5, 1), W("Flechettes", "Thrown Weapons", "1d4", 0.5, 1), W("Throwing Darts", "Thrown Weapons", "1d4", 0.5, 1),
  W("Returning Kunai", "Thrown Weapons", "1d6", 0.5, 1, "Uncommon", "Returns to your hand at the end of your turn — no need to recover it."),
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

  /* ===== ARMOR — three classes (Light / Medium / Heavy), with rarity like weapons =====
     Light  = full AGI to Defense + Stealth advantage, least Defense.
     Medium = AGI to Defense capped at +2, no move/stealth penalty (the balanced middle).
     Heavy  = no AGI to Defense, −5 ft movement, Stealth disadvantage, most Defense.
     Everyone is proficient with Light; Medium/Heavy proficiency comes from your Heritage. Wearing a
     class you're not proficient with gives NO Defense bonus and disadvantage on AGI checks/attacks.
     `grants` perks (e.g. advSkill) auto-apply while equipped & proficient; `note` effects are GM-applied. */
  /* --- TORSO — body armor (the primary Defense piece; fills the Torso slot) --- */
  // Light (Defense +1..+2)
  A("Traveling Robes", "Light", 1, 4), A("Fine Clothes", "Light", 1, 3),
  A("Fine Robes", "Light", 1, 3), A("Monk's Wraps", "Light", 1, 2), A("Ceremonial Vestments", "Light", 1, 6),
  A("Combat Fatigues", "Light", 2, 4), A("Leather Armor", "Light", 2, 8), A("Weathered Leathers", "Light", 2, 8),
  A("Shadowed Leathers", "Light", 2, 8, "Uncommon", "Matte-black, sound-muffling leathers.", { advSkill: "Stealth" }),
  A("Shadowplate", "Light", 2, 6, "Legendary", "Veil-shadow armor: you leave no tracks and can hide even while observed (GM).", { advSkill: "Stealth" }),
  // Medium (Defense +3..+4)
  A("Reinforced Vest", "Medium", 3, 15), A("Kevlar Vest", "Medium", 3, 12),
  A("Lab Exosuit", "Medium", 3, 18, "Uncommon", "Sealed against gas, acid, and lab hazards (GM)."),
  A("Mirrormail", "Medium", 4, 16, "Rare", "Once per fight, turn a ranged attack back on its attacker (GM)."),
  A("Sentinel's Regalia", "Medium", 4, 14, "Legendary", "You can't be surprised while you wear it.", { advSkill: "Awareness" }),
  // Heavy (Defense +5..+6)
  A("Heavy Plating", "Heavy", 5, 25), A("Riot Gear", "Heavy", 5, 22),
  A("Aegis Plate", "Heavy", 5, 26, "Rare", "Resistance to one physical damage type of your choice (GM)."),
  A("Combat Exosuit", "Heavy", 6, 20, "Rare", "Powered frame sealed against fire and gas (GM)."),
  A("Powered Armor", "Heavy", 6, 40, "Very Rare", "Servos negate Heavy armor's movement penalty; resists ballistic damage (GM).", { noMovePenalty: true }),
  A("Warden's Aegis", "Heavy", 6, 30, "Legendary", "Resistance to physical damage; advantage to resist being moved or knocked prone (GM).", { advSkill: "Hardiness" }),

  /* --- HEAD — hats & helmets --- */
  AP("Cloth Hood", "head", "Light", 0, 1),
  AP("Padded Cap", "head", "Light", 1, 1),
  AP("Leather Coif", "head", "Light", 1, 2),
  AP("Iron Helm", "head", "Medium", 1, 4),
  AP("Combat Helmet", "head", "Medium", 1, 3),
  AP("Great Helm", "head", "Heavy", 2, 7),
  AP("Visored Sallet", "head", "Heavy", 2, 6, "Uncommon", "A full-face plate helm — narrows your sightlines (GM)."),
  AP("Circlet of Insight", "head", "Light", 0, 1, "Rare", "Wards that sharpen the senses.", { advSkill: "Awareness" }),

  /* --- BACK — capes & coats (cloaks/ponchos/shawls moved here from the old body-armor list) --- */
  AP("Padded Cloak", "back", "Light", 1, 4),
  AP("Wool Cloak", "back", "Light", 0, 2),
  AP("Traveler's Cloak", "back", "Light", 0, 3),
  AP("Longcoat", "back", "Light", 1, 4),
  AP("Reinforced Coat", "back", "Medium", 2, 6),
  AP("Trench Coat", "back", "Medium", 1, 6),
  AP("Camo Poncho", "back", "Light", 1, 4, "Uncommon", "Patterned to melt into terrain.", { advSkill: "Stealth" }),
  AP("Enchanted Shawl", "back", "Light", 1, 5, "Uncommon", "Woven wards soften the first blow of each fight (GM)."),
  AP("Nightweave Cloak", "back", "Light", 1, 4, "Rare", "Drinks in the light and sound around you.", { advSkill: "Stealth" }),
  AP("Duelist's Cape", "back", "Light", 1, 3, "Rare", "Flourished to bait a strike — advantage to parry once per fight (GM)."),

  /* --- ARMS — gloves & gauntlets --- */
  AP("Leather Gloves", "arms", "Light", 0, 1),
  AP("Tactical Gloves", "arms", "Light", 0, 1),
  AP("Padded Bracers", "arms", "Light", 1, 2),
  AP("Chain Sleeves", "arms", "Medium", 1, 4),
  AP("Steel Gauntlets", "arms", "Heavy", 1, 5),
  AP("Vanguard Gauntlets", "arms", "Heavy", 2, 6, "Rare", "Reinforced war-gauntlets; advantage to keep a grip or a grapple (GM)."),

  /* --- LEGS — pants, skirts & greaves --- */
  AP("Cloth Trousers", "legs", "Light", 0, 1),
  AP("Combat Trousers", "legs", "Light", 0, 2),
  AP("Leather Leggings", "legs", "Light", 1, 3),
  AP("Chain Faulds", "legs", "Medium", 1, 6),
  AP("Steel Greaves", "legs", "Heavy", 2, 8),
  AP("Padded Kilt", "legs", "Light", 1, 3, "Uncommon", "A layered war-kilt that never binds your stride."),

  /* --- FEET — shoes & boots --- */
  AP("Sandals", "feet", "Light", 0, 1),
  AP("Leather Boots", "feet", "Light", 0, 2),
  AP("Traveler's Boots", "feet", "Light", 1, 3),
  AP("Combat Boots", "feet", "Medium", 1, 3),
  AP("Steel Sabatons", "feet", "Heavy", 1, 5),
  AP("Silent Soles", "feet", "Light", 0, 2, "Uncommon", "A muffled tread.", { advSkill: "Stealth" }),

  /* --- more apparel: gap-fillers across the classes --- */
  AP("Straw Hat", "head", "Light", 0, 1),
  AP("Bascinet", "head", "Heavy", 1, 5),
  AP("Bearskin Mantle", "back", "Medium", 1, 7, "Uncommon", "A heavy bear-pelt mantle — warmth against the cold and a little armor besides."),
  AP("Vambraces", "arms", "Medium", 1, 3),
  AP("Mail Mittens", "arms", "Heavy", 1, 4),
  AP("Mail Chausses", "legs", "Heavy", 1, 6),
  AP("Riding Boots", "feet", "Light", 0, 2),

  /* --- the Wolfhide kit: a matched northern-raider set, one light piece per slot (Uncommon, +1 each) --- */
  AP("Wolfhide Hood", "head", "Light", 1, 2, "Uncommon", "Part of a northern raider's wolfhide kit — warm, quiet, and tough."),
  AP("Wolfhide Cloak", "back", "Light", 1, 3, "Uncommon", "A wolf-pelt cloak from the northern raider's wolfhide kit."),
  AP("Wolfhide Bracers", "arms", "Light", 1, 2, "Uncommon", "Fur-lined leather bracers from the wolfhide kit."),
  AP("Wolfhide Leggings", "legs", "Light", 1, 3, "Uncommon", "Fur-lined leggings from the wolfhide kit."),
  AP("Wolfhide Boots", "feet", "Light", 1, 2, "Uncommon", "Fur-lined boots from the wolfhide kit."),

  /* ===== SHIELDS =====
     Held in one hand (blocks a second weapon or a two-handed weapon). Grants its dsBonus while equipped, and
     enables the Block reaction. Escalating ladder: Buckler → Round → Kite → Tower (more Defense, more weight). */
  S("Buckler", "Buckler", 1, 2, "Common", "A small fist-shield, quick and light."),
  S("Targe", "Buckler", 1, 3, "Common", "A small round Highland shield strapped to the forearm."),
  S("Round Shield", "Round Shield", 2, 6, "Common", "A sturdy wooden round shield banded in iron."),
  S("Heater Shield", "Heater Shield", 2, 7, "Common", "A knight's heater — broad enough to guard the torso."),
  S("Spiked Shield", "Round Shield", 2, 8, "Uncommon", "A round shield rimmed with spikes — shove to deal damage (GM)."),
  S("Kite Shield", "Kite Shield", 3, 10, "Common", "A tall kite shield covering body and leg."),
  S("Tower Shield", "Tower Shield", 4, 16, "Common", "A great slab of a shield — a wall you carry."),
  S("Riot Shield", "Riot Shield", 4, 10, "Common", "A transparent shield built to weather a beating."),
  S("Pavise", "Tower Shield", 4, 20, "Common", "A massive standing shield — plant it and fight from behind a wall."),
  S("Aegis Bulwark", "Tower Shield", 5, 14, "Rare", "A warded tower shield; once per fight, negate a hit entirely (GM)."),
  S("Aegis of the Vault", "Tower Shield", 5, 18, "Legendary", "An ancient bulwark — while raised, allies sheltering behind you share its Defense (GM)."),
  // — more shields: materials, a modern branch, and a few special ones —
  S("Steel Buckler", "Buckler", 1, 3, "Common", "A small steel fist-shield, quick to punch and parry with."),
  S("Norse Round Shield", "Round Shield", 2, 6, "Common", "A broad limewood round shield — the wall of the shield-wall."),
  S("Bronze Aspis", "Round Shield", 3, 13, "Uncommon", "A polished bronze warshield of the old phalanx — heavy, but it guards the whole body."),
  S("Knight's Heater", "Heater Shield", 3, 9, "Common", "A steel heater blazoned with a device — the duelist's guard."),
  S("War Kite", "Kite Shield", 3, 11, "Common", "A long iron-banded kite shield for the mounted charge."),
  S("Wall Shield", "Tower Shield", 4, 18, "Common", "A plank-and-iron wall carried into the breach."),
  S("Mantlet", "Tower Shield", 4, 22, "Common", "A braced siege shield you plant and fight from behind."),
  S("Ballistic Shield", "Ballistic Shield", 4, 12, "Common", "A modern polymer-and-steel shield rated against gunfire."),
  S("Blast Shield", "Ballistic Shield", 4, 16, "Uncommon", "A heavy EOD shield built to eat an explosion."),
  S("Mirror Shield", "Heater Shield", 3, 8, "Rare", "A mirror-bright shield; once per fight your Block can turn a ranged attack back on its attacker (GM)."),
  S("Draugr Bulwark", "Round Shield", 4, 10, "Rare", "A grave-cold shield of northern legend; foes that strike it are chilled (GM)."),
  S("Sunforged Aegis", "Kite Shield", 5, 12, "Legendary", "A shield of caught sunfire — while raised it sheds bright light and sears those who close (GM)."),

  /* ===== AMMUNITION — a stack that feeds a family of ranged weapons =====
     Each ammo item covers a firing mechanism, not one weapon. Thrown weapons are their OWN ammo (they carry a
     `thrown` flag instead). Ki-powered arms (Channel/Ritual/Living) burn KP, not ammo; explosives (grenades,
     mines) are one-use weapons that need no separate ammo. Consumption is tracked by hand for now. */
  AM("Arrows", "Bows — Longbows & Shortbows", 0.05, 20, "A quiver of arrows."),
  AM("Sling Bullets", "Slings & Slingshots", 0.05, 20, "A pouch of lead bullets and smooth stones."),
  AM("Crossbow Bolts", "Crossbows — hand, pistol & repeater", 0.05, 20, "A case of crossbow bolts (quarrels)."),
  AM("Blowgun Darts", "Blowguns & blowpipes", 0.02, 10, "A tube of blowgun darts — easily tipped with venom."),
  AM("Pistol Rounds", "Handguns, revolvers & machine pistols", 0.03, 30, "A box of pistol cartridges."),
  AM("Rifle Rounds", "Rifles — assault, hunting & marksman", 0.05, 20, "A box of rifle cartridges."),
  AM("Shotgun Shells", "Pump & combat shotguns", 0.1, 12, "A box of buckshot and slug shells."),
  AM("Heavy Rounds", "Magnums, hand cannons & anti-materiel rifles", 0.15, 10, "Oversized, armor-punching cartridges."),
  AM("Rockets", "Rocket launchers & bazookas", 6, 1, "A backblast rocket for a launcher."),
  AM("Fuel Canister", "Flamethrowers & napalm sprayers", 0.5, 10, "Pressurized fuel for a flame projector — good for several bursts."),
  AM("Chemical Canister", "Acid & gas sprayers, chemical weapons", 0.5, 8, "A sealed canister of acid or toxic gas — several charges."),
  AM("Charge Pack", "Energy arms — laser, plasma, tech & amp weapons", 0.1, 20, "A rechargeable cell that powers directed-energy and amplified weapons."),

  /* ===== CONSUMABLES =====
     4th arg = structured effect applied on Use (see C() above). Items without one are
     narrative-only (food, light, smoke). HP/KP restores are capped at your maximum. */
  // — HP restore —
  C("Bandages", 1, "Stabilize yourself if downed; heal 1d4 HP.", { hp: "1d4", reviveSelf: true }),
  C("Health Draught", 0.5, "Restores 2d6 HP when used.", { hp: "2d6" }),
  C("Greater Health Draught", 0.5, "Restores 4d6 HP when used.", { hp: "4d6" }),
  C("Stimpak", 0.5, "Restores 3d6 HP and un-cripples one limb.", { hp: "3d6", uncripple: 1 }),
  // — KP restore —
  C("KP Elixir", 0.5, "Restores 2d6 KP when used.", { kp: "2d6" }),
  C("Greater KP Elixir", 0.5, "Restores 4d6 KP when used.", { kp: "4d6" }),
  // — Combined / restorative —
  C("Vital Tonic", 0.5, "Restores 2d6 HP and 2d6 KP.", { hp: "2d6", kp: "2d6" }),
  C("Chakra Salve", 0.5, "Heals 1 hit on each damaged chakra.", { chakraHeal: 1 }),
  C("Panacea", 1, "Fully restores HP & KP, heals all chakras, and un-cripples every limb.", { hpFull: true, kpFull: true, chakraHeal: 4, uncrippleAll: true }),
  C("Rez Serum", 1, "Revives you from downed to 1 HP (or a downed ally).", { reviveSelf: true }),
  C("Antitoxin", 0.5, "Cures poison / ends Weakened.", { cure: "poison / Weakened" }),
  // — Narrative / utility (no tracked mechanic) —
  C("Adrenaline Shot", 0.5, "Gain an extra action this turn (once).", { note: "gain an extra action this turn (toggle it on the This-Turn tracker)" }),
  C("Trail Rations", 2, "A day's food."),
  C("Waterskin", 3, "Holds a day of water."),
  C("Smoke Bomb", 1, "Creates a 15-ft smoke cloud (obscured)."),
  C("Flare", 0.5, "Bright light for several minutes."),

  /* ===== TOOLS =====
     Skill kits (4th arg = the Skill they support): one kit for every tool-using skill, so a
     skill that's about wielding gear now has gear that goes with it. Ordered by governing
     attribute (STR → CHA), then general gear with no skill link. */
  // — STR —
  T("Toolkit", 5, "Hammers, saws, drills, and fasteners for heavy repairs and construction.", "Laborer's Tools"),
  // — AGI —
  T("Tinker's Kit", 2, "Jeweler's drivers, glass cutters, and clockwork picks for delicate mechanisms.", "Deft Tools"),
  T("Lockpicks", 1, "Slim picks and tension wrenches for slipping locks, latches, and pockets.", "Sleight of Hand"),
  T("Climbing Kit", 5, "Ropes, pitons, carabiners, and a harness for scaling sheer heights.", "Athletics"),
  // — CON —
  T("Survival Kit", 3, "Fire-starter, snare wire, water filter, and shelter gear for the wilds.", "Survival"),
  // — INT —
  T("Medkit", 3, "Sutures, splints, antiseptics, and salves for treating wounds in the field.", "Medicine"),
  T("Investigator's Kit", 2, "Magnifier, print powder, tweezers, and evidence pouches for reading a scene.", "Investigation"),
  T("Engineer's Tools", 4, "Precision drivers and diagnostics for repairing and building machinery.", "Technology"),
  T("Linguist's Kit", 2, "Cipher wheels, lexicons, quills, and ink for cracking scripts and codes.", "Language"),
  // — WIS —
  T("Herbalism Kit", 3, "Pouches, pestle, and vials for gathering and brewing herbal remedies.", "Herbalism"),
  T("Naturalist's Kit", 3, "Fishing line, tanning tools, and flint for living off the land.", "Nature Tools"),
  T("Beast-Handler's Kit", 3, "Snares, lures, muzzles, and feed for tracking and handling animals.", "Zoology"),
  T("Incense Kit", 2, "Incense, censer, candles, and chalk for rituals and occult focus.", "Paranormal"),
  T("Binoculars", 1, "Magnifying optics for scouting distant terrain and spotting targets.", "Awareness"),
  // — CHA —
  T("Disguise Kit", 3, "Cosmetics, prosthetics, dyes, and wigs for assuming a false face.", "Deception"),
  T("Musical Instrument", 4, "A portable instrument (lute, drum, flute) for music and performance.", "Music"),
  // — General gear (no skill link) —
  T("Rope (50 ft)", 5, "Hemp or synthetic rope."),
  T("Grappling Hook", 2, "Anchor for climbing / swinging."),
  T("Old-World Datapad", 1, "Access old-world data & History/Technology."),
  T("Comm Device", 1, "Short-range communication."),
  T("Lantern", 2, "Bright light in a radius."),
  T("Torch", 1, "Improvised light / fire source."),

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

  /* ===== BEGINNER (STARTING-GEAR) WEAPONS, grouped by type → subtype =====
     The starting-gear picker offers ONLY these weapons — up to two per weapon *subtype*, chosen as the
     simplest/most iconic of each — instead of every Common weapon of an offered type. This nested map
     (weapon TYPE → SUBTYPE → weapon names) is the single source of truth: it decides both which weapons
     are startable AND how the creator's starting-weapon dropdown is grouped (each subtype is its own
     labelled group). All the other starting-gear rules still stack on top (you may only start with a
     weapon whose TYPE you're proficient with, or that your Heritage's Fighting Style opens as
     "start-only"; two-weapon Heritages still pick one 2H or two 1H). Every weapon here is Common;
     higher rarities are never starting gear. Edit a subtype's array to change what's offered. */
  PC.STARTER_WEAPONS_BY_SUBTYPE = {
    "Heavy Weapons":   { "Great Hammers": ["Warmaul", "Siege Sledge"], "Great Swords": ["Zweihander", "Claymore"], "Great Axes": ["Headsman's Axe", "Great Axe"], "Maces": ["War Mace", "Morning Star"], "Axes": ["Battleaxe", "Hatchet"] },
    "Fist Weapons":    { "Knuckles": ["Brass Knuckles", "Weighted Wraps"], "Full Fists": ["Iron Gauntlets", "Powered Cestus"], "Knuckle Blades": ["Punch Daggers", "Katar"] },
    "Archery":         { "Longbows": ["War Longbow", "Yew Longbow"], "Shortbows": ["Hunting Bow", "Recurve Bow"], "Slings": ["Leather Sling", "War Sling"], "Slingshots": ["Steel Slingshot", "Wrist Rocket"] },
    "Light Weapons":   { "Knives": ["Combat Knife", "Kunai"], "Daggers": ["Stiletto", "Parrying Dagger"], "Batons": ["Nightstick", "Tactical Baton"], "Short Swords": ["Gladius", "Cutlass"] },
    "Quick Weapons":   { "Tonfa": ["Riot Tonfa", "Twin Tonfa"], "Wrist Blades": ["Bracer Blades", "Hidden Blade"], "Hand Crossbows": ["Pistol Crossbow", "Repeater Crossbow"], "Blowguns": ["Poison Blowpipe", "Reed Blowgun"] },
    "Thrown Weapons":  { "Shuriken": ["Shuriken", "Bo-Shuriken"], "Throwing Knives": ["Throwing Knives", "Flechettes"], "Darts": ["Throwing Darts"] },
    "Firearms":        { "Rifles": ["Bolt-Action Rifle", "Hunting Rifle"], "Handguns": ["Semi-Auto Pistol", "Sidearm"], "Revolvers": ["Six-Shooter", "Magnum Revolver"] },
    "Explosives":      { "Grenades": ["Frag Grenade", "Concussion Grenade"], "Mines": ["Proximity Mine", "Land Mine"], "Improvised Explosives": ["Pipe Bomb", "Molotov"] },
    "Volatile Weapons":{ "Flamethrowers": ["Flamethrower", "Napalm Sprayer"], "Rocket Launchers": ["Rocket Launcher", "Bazooka"], "Chemical Weapons": ["Acid Sprayer", "Gas Canister Gun"] },
    "Laser Weapons":   { "Laser Swords": ["Plasma Saber", "Photon Blade"], "Blaster Rifles": ["Pulse Rifle", "Beam Carbine"], "Blaster Pistols": ["Hand Blaster", "Prism Pistol"] },
    "Plasma Weapons":  { "Plasma Blades": ["Plasma Sword", "Ion Axe"], "Beam Rifles": ["Plasma Carbine", "Ion Beam Rifle"], "Plasma Cannons": ["Heavy Plasma Cannon", "Ion Mortar"] },
    "Tech Weapons":    { "Chain Blades": ["Chainsword", "Buzz-Axe"], "Power Weapons": ["Shock Maul", "Power Fist"], "Rocket Weapons": ["Rocket Hammer", "Thruster Axe"] },
    "Channel Weapons": { "Staffs": ["Quarterstaff", "Bo Staff"], "Wands": ["Focus Wand", "Rune Wand"], "Amulets": ["Radiant Amulet", "Pulse Charm"] },
    "Living Weapons":  { "Sentient Plants": ["Thornwhip Vine", "Barkfist"], "Living Oozes": ["Slime Morningstar", "Ooze Gauntlet"], "Insect Hives": ["Wasp Bracer", "Hornet Pauldron"] },
    "Ritual Weapons":  { "Ritual Blades": ["Athame", "Kris Dagger"], "Incense Flails": ["Censer Flail", "Smoke Chain"] },
    "Finesse Weapons": { "Fencing Swords": ["Rapier", "Sabre"], "Rope Weapons": ["Whip", "Chain Whip"], "Chakrams": ["Throwing Ring", "Bladed Chakram"] },
    "Art Weapons":     { "Battle Fans": ["War Fan", "Bladed Fan"], "Hoop Blades": ["Wind-and-Fire Wheels", "Ring Blades"], "Nunchucku": ["Nunchaku", "Triple-Section Staff"] },
    "Noise Weapons":   { "Instrument Weapons": ["Bladed Guitar", "Axe-Bass"], "Percussive Weapons": ["War Drum Hammer", "Shockwave Drumstick"], "Amp Weapons": ["Sonic Amp", "Resonator"] },
  };

  // Derive the flat starter list + a name→subtype lookup from the map above (one source of truth).
  PC.STARTER_WEAPONS = [];
  var _starterSubtype = {};
  Object.keys(PC.STARTER_WEAPONS_BY_SUBTYPE).forEach(function (type) {
    var groups = PC.STARTER_WEAPONS_BY_SUBTYPE[type];
    Object.keys(groups).forEach(function (subtype) {
      groups[subtype].forEach(function (name) { PC.STARTER_WEAPONS.push(name); _starterSubtype[name] = subtype; });
    });
  });
  // Fast membership test + subtype lookup used by the starting-gear picker (app.js).
  PC.isStarterWeapon = function (name) { return PC.STARTER_WEAPONS.indexOf(name) > -1; };
  PC.starterSubtype = function (name) { return _starterSubtype[name] || null; };

  /* ===== ITEM DESCRIPTIONS =====
     A short "what it is" flavor line for every catalog item, shown on the Inventory tab. Kept as a
     name→description map (the single source of truth) and stamped onto each item at load, so weapons,
     armor, consumables, tools and gear all carry a description. Flavor only — mechanics live in each
     item's stats/note. Edit a line here to change what an item reads as. */
  PC.ITEM_DESCRIPTIONS = {
    // — Heavy Weapons —
    "Warmaul": "A massive two-handed hammer with a blunt steel head, built to crush armor and bone alike.",
    "Siege Sledge": "An oversized sledgehammer meant for breaking down walls as easily as warriors.",
    "Titan's Gavel": "A ceremonial warhammer nearly the size of a man, swung in wide, earth-shaking arcs.",
    "Zweihander": "A towering two-handed greatsword with a long ricasso for gripping mid-blade.",
    "Claymore": "A broad Highland greatsword prized for sweeping, momentum-heavy cuts.",
    "Executioner's Blade": "A wide, square-tipped greatsword forged for heavy, decisive strikes.",
    "Headsman's Axe": "A long-hafted axe with a broad crescent blade, brutal on the downswing.",
    "Bardiche": "A polearm axe with a long cleaving blade mounted along a tall shaft.",
    "Great Axe": "A huge two-handed axe that trades finesse for devastating chopping power.",
    "War Mace": "A one-handed bludgeon with a heavy flanged head for caving in armor.",
    "Morning Star": "A spiked steel ball fixed atop a sturdy handle, punishing to be struck by.",
    "Flanged Mace": "A knightly mace whose raised metal flanges bite through plate.",
    "Battleaxe": "A single-handed axe balanced for quick, chopping blows in close combat.",
    "Hatchet": "A compact hand axe, light enough to throw and handy for close work.",
    "Cleaver": "An oversized butcher's blade turned weapon — heavy and wickedly sharp.",
    "Colossus Maul": "A colossal warhammer wreathed in raw force; its impact hurls foes backward.",
    "Sunder Greatsword": "A rune-etched greatsword forged to shear straight through armor plating.",
    "Worldbreaker": "A mythic maul said to crack the very earth with every fall.",
    // — Fist Weapons —
    "Brass Knuckles": "Molded metal grips worn over the fingers to add weight to a punch.",
    "Weighted Wraps": "Hand wraps studded with lead inserts for heavier strikes.",
    "Iron Gauntlets": "Armored gloves of banded iron that turn a fist into a hammer.",
    "Powered Cestus": "A motorized gauntlet that drives each punch with mechanical force.",
    "Punch Daggers": "Short blades that jut from the fist, driven forward with the whole arm.",
    "Katar": "A push-dagger with an H-shaped grip that thrusts straight from the knuckles.",
    "Claw Fists": "Bladed claws strapped across the knuckles for raking, feral strikes.",
    "Seismic Knuckles": "Impact gauntlets whose shockwave leaves foes too rattled to react.",
    "Dragon's Cestus": "A fabled gauntlet that sheathes every blow in dragonfire.",
    // — Archery —
    "War Longbow": "A tall wooden warbow with a heavy draw for long-range volleys.",
    "Yew Longbow": "A classic longbow carved from springy yew heartwood.",
    "Composite Longbow": "A layered bow of wood, horn and sinew for extra power.",
    "Hunting Bow": "A modest bow sized for game and quick shots on the move.",
    "Recurve Bow": "A bow with tips curving away from the archer for a snappier release.",
    "Horsebow": "A short, powerful bow made to be loosed from horseback.",
    "Leather Sling": "A simple leather cradle that whips a stone at deadly speed.",
    "War Sling": "A reinforced sling built to hurl heavier lead shot.",
    "Steel Slingshot": "A forked steel frame with elastic bands for rapid pebble fire.",
    "Wrist Rocket": "A brace-mounted slingshot strapped to the forearm for stability.",
    "Stormstring Longbow": "A storm-charged bow whose arrows rattle a target's aim.",
    "Skypiercer": "A legendary longbow whose shafts ignore cover and never waver.",
    // — Light Weapons —
    "Combat Knife": "A rugged utility blade equally at home fighting or cutting rope.",
    "Switchblade": "A concealable folding knife that snaps open at the press of a button.",
    "Kunai": "A leaf-shaped throwing knife that doubles as a close-quarters stabber.",
    "Stiletto": "A needle-thin dagger made for slipping between armor seams.",
    "Parrying Dagger": "A slim off-hand blade for turning aside an enemy's weapon.",
    "Rondel": "A stiff, round-guarded dagger built to punch through mail.",
    "Nightstick": "A rigid baton for fast, jarring strikes.",
    "Tactical Baton": "A telescoping metal baton that extends with a flick.",
    "Cudgel": "A crude, weighted club of hardwood or bone.",
    "Gladius": "A short double-edged sword built for tight-formation thrusts.",
    "Wakizashi": "A short companion sword, quick to draw in close quarters.",
    "Cutlass": "A short curved saber favored by sailors and raiders.",
    "Falchion": "A single-edged short blade with a heavy, chopping tip.",
    "Venom Fang": "A slender blade grooved to carry a coat of poison.",
    "Mirror Edge": "A gleaming blade that catches foes before they can react.",
    "Shadowsliver": "A blade of living shadow, deadliest when struck from ambush.",
    // — Quick Weapons (melee) —
    "Riot Tonfa": "A side-handled baton spun for rapid blocks and strikes.",
    "Twin Tonfa": "A matched pair of tonfa for a whirling, two-handed style.",
    "Bracer Blades": "Short blades fixed along the forearm guards.",
    "Hidden Blade": "A spring-loaded blade concealed beneath the sleeve.",
    "Retractable Talons": "Mechanical claws that snap out from a wrist mount.",
    "Whirl Tonfa": "Balanced tonfa that flow from a dodge straight into a strike.",
    // — Laser (melee) —
    "Plasma Saber": "A hilt projecting a searing blade of contained plasma.",
    "Photon Blade": "A humming sword of focused light that cuts through nearly anything.",
    "Beam Katana": "A curved energy blade modeled on an old-world sword.",
    "Starlight Saber": "A radiant energy blade that shears through unpowered armor.",
    // — Plasma (melee) —
    "Plasma Sword": "A blade of magnetically bottled plasma, blinding hot.",
    "Ion Axe": "An axe head wreathed in crackling ionized gas.",
    "Fusion Cutter": "A repurposed industrial cutter that slices through hull and foe alike.",
    "Solar Lance": "A two-handed lance that pours sunfire into whatever it strikes.",
    // — Tech Weapons —
    "Chainsword": "A sword edged with a spinning loop of chainsaw teeth.",
    "Buzz-Axe": "A motorized axe whose whirring blade shreds on contact.",
    "Ripsaw Blade": "A powered greatblade lined with tearing saw teeth.",
    "Shock Maul": "A heavy baton that discharges a stunning jolt on impact.",
    "Arc Gauntlet": "A gauntlet that arcs high-voltage current into its target.",
    "Power Fist": "A powered gauntlet that lands blows like a wrecking ball.",
    "Voltaic Hammer": "A two-handed maul that crackles with stored electricity.",
    "Rocket Hammer": "A warhammer with a rocket-boosted head for crushing swings.",
    "Thruster Axe": "A great axe that fires a burst of thrust mid-swing for extra bite.",
    "Titan Chainblade": "A massive chainblade so relentless it grinds past a wielder's bad luck.",
    // — Channel (melee) —
    "Quarterstaff": "A long hardwood staff, versatile for both strikes and blocks.",
    "Bo Staff": "A balanced fighting staff swept in flowing arcs.",
    "Rune Staff": "A staff carved with focusing runes for channeled power.",
    "Iron Cane": "A weighted walking cane that hides a fighter's edge.",
    "Oakheart Staff": "A living-oak staff that widens the wielder's reservoir of ki.",
    "Worldtree Bough": "A branch of the fabled Worldtree that deepens every act of healing.",
    // — Living (melee) —
    "Thornwhip Vine": "A living, barbed vine that lashes at its wielder's command.",
    "Bramble Lash": "A whip of thorned bramble that tears as it strikes.",
    "Barkfist": "A gauntlet of hardened living bark grown over the hand.",
    "Slime Morningstar": "A gelatinous, acidic blob shaped into a spiked flail.",
    "Amorphous Flail": "A tendril of living ooze wielded like a flail.",
    "Ooze Gauntlet": "A symbiotic ooze worn as a corrosive glove.",
    "Venomcoil Lash": "A serpentine living whip that roots its prey in place.",
    // — Ritual —
    "Athame": "A ceremonial dagger used in rites, keen against the unnatural.",
    "Kris Dagger": "A wavy-bladed ritual dagger steeped in old belief.",
    "Rune Sickle": "A curved harvesting blade inscribed for sacred cutting.",
    "Censer Flail": "A swinging incense burner that doubles as a chained weapon.",
    "Smoke Chain": "A weighted chain that trails ritual smoke as it whirls.",
    "Sanctified Mace": "A blessed mace consecrated against dark things.",
    "Wraithedge Athame": "A spectral-edged dagger that bites even the incorporeal.",
    // — Finesse (melee) —
    "Rapier": "A slender thrusting sword built for precise, darting lunges.",
    "Epee": "A stiff dueling blade that rewards a quick, accurate point.",
    "Sabre": "A light curved sword balanced for slashing and thrusting alike.",
    "Estoc": "A rigid, edgeless sword made purely for piercing armor.",
    "Whip": "A long flexible lash that strikes from surprising range.",
    "Meteor Hammer": "A weighted ball on a long rope, spun in dizzying orbits.",
    "Chain Whip": "A segmented metal whip that snaps out and coils back.",
    "Duelist's Needle": "A perfect thrusting blade that flows one strike into the next.",
    "Heartpiercer": "A fabled rapier that finds the killing gap with uncanny ease.",
    // — Art —
    "War Fan": "An iron-ribbed folding fan that conceals a fighter's intent.",
    "Bladed Fan": "A folding fan whose outer ribs are honed to razors.",
    "Twin Fans": "A matched pair of war fans for a graceful, deceptive style.",
    "Wind-and-Fire Wheels": "Ringed steel wheels with flame-shaped blades, wielded in pairs.",
    "Ring Blades": "Bladed hoops spun and thrown in circular attacks.",
    "Nunchaku": "Two hardwood batons joined by a short chain, whirled at speed.",
    "Triple-Section Staff": "Three linked staves that fold and extend through the strike.",
    "Tempest Fans": "Storm-touched fans that buffet foes off balance.",
    // — Noise (melee) —
    "Bladed Guitar": "An amplified guitar with a sharpened body — as loud as it is deadly.",
    "War Drum Hammer": "A massive drumstick-hammer that booms with every hit.",
    "Axe-Bass": "A bass guitar shaped like an axe, and swung like one.",
    "Resonance Maul": "A maul that rings with a bone-rattling tone on impact.",
    "Shockwave Drumstick": "An outsized drumstick that releases a percussive blast.",
    "Seismic Hammer": "A ground-pounding maul tuned to send tremors through its target.",
    "Subwoofer Maul": "A speaker-headed maul whose blast leaves foes deafened.",
    "Anthem Cannon": "A speaker-cannon that blares a rallying anthem, buoying nearby allies with its sound.",
    // — Quick Weapons (ranged) —
    "Pistol Crossbow": "A one-handed crossbow small enough to aim like a pistol.",
    "Repeater Crossbow": "A crossbow with a magazine for rapid successive bolts.",
    "Bracer Bow": "A compact bow built into a forearm brace for quick shots.",
    "Poison Blowpipe": "A slim tube for puffing a poisoned dart at close range.",
    "Reed Blowgun": "A simple hollow reed that launches tiny darts in silence.",
    // — Thrown —
    "Shuriken": "Star-shaped steel plates flung in fast, flat arcs.",
    "Bo-Shuriken": "Straight iron spikes thrown point-first.",
    "Throwing Knives": "Balanced blades weighted for accurate throws.",
    "Flechettes": "Finned steel darts hurled in tight clusters.",
    "Throwing Darts": "Weighted darts made to be cast quickly by hand.",
    "Returning Kunai": "A tethered kunai that snaps back to the thrower's hand.",
    // — Firearms —
    "Bolt-Action Rifle": "A manually cycled long rifle prized for accuracy.",
    "Hunting Rifle": "A scoped rifle built for a clean shot at distance.",
    "Marksman Rifle": "A precision rifle tuned for long-range marksmanship.",
    "Assault Rifle": "A select-fire military rifle for versatile combat.",
    "Semi-Auto Pistol": "A magazine-fed handgun that fires as fast as you pull.",
    "Machine Pistol": "A compact handgun capable of automatic bursts.",
    "Sidearm": "A dependable backup pistol, light and quick to draw.",
    "Six-Shooter": "A classic single-action revolver with a six-round cylinder.",
    "Magnum Revolver": "A heavy revolver chambered for punishing rounds.",
    "Hand Cannon": "An oversized revolver that hits like a small artillery piece.",
    "Pump Shotgun": "A pump-action scattergun devastating at close range.",
    "Executioner's Revolver": "A finely tuned revolver that finds vital spots readily.",
    "Anti-Materiel Rifle": "A massive rifle that punches through armor and cover.",
    // — Explosives —
    "Frag Grenade": "A throwable bomb that bursts into a spray of lethal fragments.",
    "Concussion Grenade": "A blast grenade that stuns with sheer overpressure.",
    "Pipe Bomb": "A crude improvised bomb packed into a length of metal pipe.",
    "Proximity Mine": "A planted charge that detonates when something draws near.",
    "Land Mine": "A buried explosive triggered by a footstep.",
    "Molotov": "A bottle of fuel and a lit rag — cheap, fiery, and effective.",
    "Nail Bomb": "An improvised charge packed with nails for shrapnel.",
    "Cluster Grenade": "A grenade that scatters submunitions across a wide area.",
    // — Volatile —
    "Flamethrower": "A pressurized tank and nozzle that sprays clinging fire.",
    "Napalm Sprayer": "A projector that coats an area in sticky, burning gel.",
    "Rocket Launcher": "A shoulder tube that fires an explosive rocket.",
    "Bazooka": "A heavy anti-armor launcher with a fearsome backblast.",
    "Acid Sprayer": "A tank-fed nozzle that douses targets in corrosive acid.",
    "Gas Canister Gun": "A launcher that lobs canisters of noxious gas.",
    "Inferno Projector": "A heavy flame projector that leaves its victims burning.",
    // — Laser (ranged) —
    "Pulse Rifle": "A rifle that fires rapid bolts of coherent light.",
    "Beam Carbine": "A compact energy carbine with a steady, cutting beam.",
    "Long Blaster": "A long-barreled blaster for ranged energy fire.",
    "Hand Blaster": "A sidearm that spits searing bolts of light.",
    "Prism Pistol": "A refracting energy pistol with a bright, tight beam.",
    "Ion Sidearm": "A compact ion pistol that overloads circuits and flesh alike.",
    "Photon Repeater": "A rapid energy rifle that wears down a target's defenses.",
    // — Plasma (ranged) —
    "Plasma Carbine": "A carbine that hurls bolts of superheated plasma.",
    "Ion Beam Rifle": "A rifle firing a sustained lance of ionized energy.",
    "Fusion Lance": "A long-barreled weapon that fires a fusion-hot spike.",
    "Heavy Plasma Cannon": "A crew-served cannon that spews gouts of plasma.",
    "Ion Mortar": "A shoulder-braced mortar that lobs ion charges.",
    "Singularity Cannon": "A cannon that briefly warps space, dragging foes inward.",
    // — Channel (ranged) —
    "Focus Wand": "A slim wand that channels ki into a bolt of force.",
    "Rune Wand": "A rune-inlaid wand for directing energy at range.",
    "Spirit Rod": "A rod that calls on spirit energy to strike from afar.",
    "Radiant Amulet": "A worn amulet that looses beams of radiant power.",
    "Pulse Charm": "A charm that emits rhythmic pulses of force.",
    "Aura Medallion": "A medallion that projects the bearer's aura outward.",
    "Seraph Focus": "A blessed focus that eases the cost of channeling.",
    // — Living (ranged) —
    "Wasp Bracer": "A bracer housing a hive that looses stinging insects.",
    "Hornet Pauldron": "A living shoulder-nest that spits venomous hornets.",
    "Hivemaw Gauntlet": "A gauntlet-hive whose stings fester after the strike.",
    // — Finesse (thrown) —
    "Throwing Ring": "A bladed steel ring flung with a flick of the wrist.",
    "Bladed Chakram": "A razor-edged throwing hoop that returns to a skilled hand.",
    "Twin Chakrams": "A matched pair of throwing rings for layered attacks.",
    "Razor Halo": "A returning ring blade that ricochets to a second mark.",
    // — Noise (ranged) —
    "Sonic Amp": "A handheld amplifier that blasts targets with focused sound.",
    "Bass Cannon": "A speaker-cannon that hits with a wall of low-frequency force.",
    "Resonator": "A tuned emitter that shakes a target apart with vibration.",
    "Cataclysm Speaker": "A speaker so loud its blast throws back everything nearby.",
    // — Armor —
    "Padded Cloak": "A quilted cloak offering a little protection against blows.",
    "Traveling Robes": "Layered road robes that turn aside a glancing strike.",
    "Fine Clothes": "Well-cut garments with just enough padding to matter.",
    "Fine Robes": "Elegant robes discreetly reinforced against harm.",
    "Monk's Wraps": "Simple cloth wraps favored by martial ascetics.",
    "Combat Fatigues": "Durable military fatigues built for the field.",
    "Reinforced Coat": "A heavy coat lined with light protective plating.",
    "Camo Poncho": "A concealing poncho with padding sewn in.",
    "Leather Armor": "Hardened leather that blunts cuts and blows.",
    "Shadowed Leathers": "Dark, supple leathers made for moving unseen.",
    "Weathered Leathers": "Well-worn leather armor, still tough where it counts.",
    "Reinforced Vest": "A padded vest reinforced with sewn-in plates.",
    "Enchanted Shawl": "A woven shawl warded to soften incoming harm.",
    "Ceremonial Vestments": "Ornate vestments layered for modest protection.",
    "Lab Exosuit": "A sealed lab suit built around a light protective frame.",
    "Riot Shield": "A transparent shield built to weather a beating.",
    "Kevlar Vest": "A modern ballistic vest that stops many rounds.",
    "Heavy Plating": "Bulky armor plates for serious frontline protection.",
    "Riot Gear": "Full riot armor covering the body against blows.",
    "Combat Exosuit": "A powered frame that shrugs off heavy punishment.",
    "Powered Armor": "A full suit of powered plate — a walking fortress.",
    "Nightweave Cloak": "A cloak of shadow-dyed weave that swallows light and muffles every step.",
    "Shadowplate": "Armor spun from captured Veil-shadow — silent, trackless, and barely there.",
    "Mirrormail": "Polished, faceted mail that can catch a shot and fling it back.",
    "Sentinel's Regalia": "Ceremonial guard-plate whose wards keep the wearer ever watchful.",
    "Aegis Plate": "Rune-banded plate hardened against a chosen kind of harm.",
    "Warden's Aegis": "A legendary bulwark harness that makes its warden all but immovable.",
    // — Apparel: Head —
    "Cloth Hood": "A simple cloth hood that keeps off sun and rain.",
    "Padded Cap": "A quilted cap that softens a glancing blow to the head.",
    "Leather Coif": "A close leather hood laced under the chin.",
    "Iron Helm": "A plain iron helmet, dented but dependable.",
    "Combat Helmet": "A modern ballistic helmet with a padded liner.",
    "Great Helm": "A heavy full-face war-helm that turns aside all but the hardest blow.",
    "Straw Hat": "A woven wide-brimmed hat — shade, not protection.",
    "Bascinet": "A pointed steel war-helm, a favorite of heavy foot.",
    // — Apparel: Back —
    "Wool Cloak": "A thick wool cloak against wind and weather.",
    "Traveler's Cloak": "A weatherproofed cloak cut for the long road.",
    "Longcoat": "A rugged long coat with reinforced shoulders.",
    "Trench Coat": "A heavy weatherproof coat lined with light plating.",
    // — Apparel: Arms —
    "Leather Gloves": "Supple leather gloves for grip and a little cover.",
    "Tactical Gloves": "Reinforced modern gloves with knuckle padding.",
    "Padded Bracers": "Quilted forearm guards that blunt a cut.",
    "Chain Sleeves": "Riveted mail sleeves guarding the arms.",
    "Steel Gauntlets": "Articulated plate gauntlets that armor the hands.",
    "Vambraces": "Banded forearm plates strapped over the sleeve.",
    "Mail Mittens": "Heavy mail mittens sewn to the sleeve.",
    // — Apparel: Legs —
    "Cloth Trousers": "Plain woven trousers — comfort, not cover.",
    "Combat Trousers": "Rugged field trousers with reinforced knees.",
    "Leather Leggings": "Hardened leather leggings that turn a glancing cut.",
    "Chain Faulds": "A skirt of mail guarding the hips and thighs.",
    "Steel Greaves": "Plate greaves that armor the shins and knees.",
    "Mail Chausses": "Full mail leggings laced up the leg.",
    // — Apparel: Feet —
    "Sandals": "Simple strapped sandals — barely there.",
    "Leather Boots": "Sturdy leather boots for hard walking.",
    "Traveler's Boots": "Broken-in road boots that never blister.",
    "Combat Boots": "Reinforced tactical boots with ankle support.",
    "Steel Sabatons": "Plated foot-armor, jointed to still let you march.",
    "Riding Boots": "Tall boots cut for the saddle and the trail.",
    // — Consumables —
    "Trail Rations": "Dried, packable food that keeps a traveler going.",
    "Waterskin": "A sealed hide flask for carrying drinking water.",
    "Health Draught": "A ruby tonic that knits minor wounds when drunk.",
    "Greater Health Draught": "A potent healing brew for graver injuries.",
    "Stimpak": "An emergency injector that mends flesh and resets a crippled limb.",
    "KP Elixir": "A shimmering draught that restores spent ki.",
    "Greater KP Elixir": "A concentrated brew that floods you with renewed ki.",
    "Vital Tonic": "A dual-tone tonic that mends body and mind at once.",
    "Panacea": "A legendary cure-all that restores body, mind, chakras, and broken limbs.",
    "Chakra Salve": "A soothing balm that eases strain on the chakras.",
    "Antitoxin": "A bitter cure that purges poison from the blood.",
    "Bandages": "Clean wrappings to stabilize wounds and stop bleeding.",
    "Adrenaline Shot": "A jolt of stimulant granting a brief burst of speed.",
    "Smoke Bomb": "A canister that fills the air with concealing smoke.",
    "Flare": "A bright signal flare that burns for minutes.",
    "Rez Serum": "A miracle serum that hauls the fallen back to life.",
    // — Tools (skill kits + gear) —
    "Toolkit": "An all-purpose set of heavy tools for general repairs and building.",
    "Tinker's Kit": "Fine drivers, cutters, and picks for the most delicate mechanisms.",
    "Lockpicks": "A slim set of picks and tension wrenches for defeating locks.",
    "Climbing Kit": "Ropes, pitons, and a harness for scaling heights.",
    "Survival Kit": "The essentials for making fire, shelter, and finding food.",
    "Medkit": "A field kit of tools and supplies for treating wounds.",
    "Investigator's Kit": "Magnifier, print powder, and pouches for combing a scene for clues.",
    "Engineer's Tools": "A kit for repairing and building machinery.",
    "Linguist's Kit": "Cipher wheels, lexicons, and ink for translating scripts and codes.",
    "Herbalism Kit": "Pouches and tools for gathering and brewing herbs.",
    "Naturalist's Kit": "Primitive gear — fishing line, tanning tools, flint — for the wilds.",
    "Beast-Handler's Kit": "Snares, lures, and muzzles for tracking, calming, and handling animals.",
    "Disguise Kit": "Cosmetics, prosthetics, and wigs for slipping into another identity.",
    "Rope (50 ft)": "A coil of sturdy rope for climbing and hauling.",
    "Grappling Hook": "A hooked anchor for climbing or swinging across gaps.",
    "Old-World Datapad": "A salvaged tablet holding fragments of pre-Veil data.",
    "Comm Device": "A short-range radio for staying in contact.",
    "Lantern": "A shuttered lantern that casts a steady pool of light.",
    "Torch": "A burning brand for light or a quick source of fire.",
    "Binoculars": "Optics for scouting distant terrain and targets.",
    "Musical Instrument": "A portable instrument for performance or ritual.",
    "Incense Kit": "Incense and a censer for rituals and focus.",
    // — Misc —
    "Backpack": "A rugged pack for carrying gear on the road.",
    "Bedroll": "A padded roll for sleeping rough.",
    "Component Pouch": "A pouch of odds and ends for spells and rituals.",
    "Holy Charm": "A small blessed token carried for protection.",
    "Prayer Beads": "A looped strand of beads for counting devotions.",
    "Meditation Stone": "A smooth stone that steadies a troubled mind.",
    "Old-World Relic": "A curious artifact left over from before the Veil.",
    "Scrip / Currency": "The scrip and coin traded across the Post-Veil world.",
    "Journal & Pen": "A bound journal and pen for keeping records.",
    "Sigil Talisman": "A personal warding sigil worn against ill fortune.",
  };
  PC.itemDesc = function (name) { return PC.ITEM_DESCRIPTIONS[name] || ""; };
  // Stamp the description onto each catalog item so copies (inventory, starting gear) carry it.
  PC.ITEMS.forEach(function (it) { if (PC.ITEM_DESCRIPTIONS[it.name]) it.desc = PC.ITEM_DESCRIPTIONS[it.name]; });

  /* name → Skill lookup for tool kits, so the UI can show the tie even for older saved or
     manually-added items that don't carry the field on their inventory copy. */
  PC.ITEM_SKILLS = {};
  PC.ITEMS.forEach(function (it) { if (it.skill) PC.ITEM_SKILLS[it.name] = it.skill; });
  PC.itemSkill = function (name) { return PC.ITEM_SKILLS[name] || null; };

  /* name → consumable effect lookup, so the play sheet can apply an item's effect even for
     older saved or manually-added copies that don't carry the field. */
  PC.ITEM_EFFECTS = {};
  PC.ITEMS.forEach(function (it) { if (it.effect) PC.ITEM_EFFECTS[it.name] = it.effect; });
  PC.itemEffect = function (name) { return PC.ITEM_EFFECTS[name] || null; };

  /* =========================================================================
     CRAFTING — salvage materials & recipes
     Every item outside Legendary rarity can be broken down into / crafted from
     salvage materials. 14 tiered materials: 9 Basic (common teardown) + 5 Exotic
     (only higher-rarity recipes call for them). Recipes are DERIVED from an item's
     own fields (category, weapon type / armor class, weight, rarity) so all ~257
     craftable items — and future custom items — get a consistent breakdown.
     ========================================================================= */
  PC.SALVAGE = [
    // — Basic —
    { name: "Scrap Metal",    tier: "Basic",  weight: 1,   desc: "Salvaged metal — blades, plates, and frames melt down to this." },
    { name: "Hardwood",       tier: "Basic",  weight: 1,   desc: "Seasoned wood for hafts, stocks, staves, and bows." },
    { name: "Leather",        tier: "Basic",  weight: 1,   desc: "Cured hide for grips, straps, and light armor." },
    { name: "Cloth",          tier: "Basic",  weight: 0.5, desc: "Woven fiber for wraps, padding, and robes." },
    { name: "Circuitry",      tier: "Basic",  weight: 0.5, desc: "Salvaged boards and wiring from old-world tech." },
    { name: "Chemicals",      tier: "Basic",  weight: 0.5, desc: "Reagents and propellants for potions and explosives." },
    { name: "Focus Crystal",  tier: "Basic",  weight: 0.5, desc: "A cut crystal that channels psionic energy." },
    { name: "Botanicals",     tier: "Basic",  weight: 0.5, desc: "Dried herbs, roots, and plant matter." },
    { name: "Bone & Sinew",   tier: "Basic",  weight: 0.5, desc: "Bone, gut, and cord from beasts — string and binding." },
    // — Exotic —
    { name: "Pristine Alloy",     tier: "Exotic", weight: 0.5, desc: "A flawless refined alloy, prized for master-forged gear." },
    { name: "Power Cell",         tier: "Exotic", weight: 0.5, desc: "A charged energy core that drives directed-energy weapons." },
    { name: "Resonant Crystal",   tier: "Exotic", weight: 0.5, desc: "A crystal attuned to a psionic frequency." },
    { name: "Volatile Compound",  tier: "Exotic", weight: 0.5, desc: "An unstable, high-yield reagent." },
    { name: "Ki Core",            tier: "Exotic", weight: 0.5, desc: "A rare mote of crystallized life-force." },
  ];
  PC.SALVAGE_TIER = {};
  PC.SALVAGE.forEach(function (s) {
    PC.SALVAGE_TIER[s.name] = s.tier;
    PC.ITEM_DESCRIPTIONS[s.name] = s.desc;
    PC.ITEMS.push({ name: s.name, category: "Salvage", tier: s.tier, weight: s.weight, desc: s.desc });
  });
  PC.isSalvage = function (name) { return !!PC.SALVAGE_TIER[name]; };

  /* =========================================================================
     COMPONENTS — the mid-tier parts (blades, barrels, triggers, plating…) that
     complex gear (weapons & armor) is built from. Each component has a QUALITY
     grade (1–4) set by the materials used to make it. Components can be crafted
     from raw salvage, recovered by salvaging gear, or found as loot.
     ========================================================================= */
  // Quality grades, aligned to item rarity. Legendary stays found-only (uncraftable).
  PC.QUALITY = [
    { q: 1, name: "Crude",      rarity: "Common" },
    { q: 2, name: "Standard",   rarity: "Uncommon" },
    { q: 3, name: "Fine",       rarity: "Rare" },
    { q: 4, name: "Masterwork", rarity: "Very Rare" },
  ];
  PC.qualityName = function (q) { return (PC.QUALITY[(q || 1) - 1] || PC.QUALITY[0]).name; };
  PC.qualityRarity = function (q) { return (PC.QUALITY[(q || 1) - 1] || PC.QUALITY[0]).rarity; };
  PC.rarityQuality = function (r) { return ({ "Common": 1, "Uncommon": 2, "Rare": 3, "Very Rare": 4 })[r] || 1; };

  // Component definitions: part name → role, weight, primary/secondary basic mats, and the exotic
  // used at the top grades. The primary material also decides the crafting Skill (via _craftSkill).
  PC.COMPONENTS = [
    { part: "Blade",            role: "edge",     weight: 1,   mats: ["Scrap Metal"],              exotic: "Pristine Alloy",   desc: "A forged edge — the business end of most melee weapons." },
    { part: "Bludgeon Head",    role: "edge",     weight: 2,   mats: ["Scrap Metal", "Hardwood"],  exotic: "Pristine Alloy",   desc: "A heavy striking head for maces, mauls, and knuckles." },
    { part: "Haft",             role: "frame",    weight: 1,   mats: ["Hardwood", "Leather"],      exotic: "Pristine Alloy",   desc: "A shaft, handle, or grip that a weapon is built around." },
    { part: "Bow Limbs",        role: "edge",     weight: 1,   mats: ["Hardwood", "Bone & Sinew"], exotic: "Pristine Alloy",   desc: "Sprung limbs and string for bows and slings." },
    { part: "Barrel",           role: "edge",     weight: 2,   mats: ["Scrap Metal", "Circuitry"], exotic: "Pristine Alloy",   desc: "A rifled barrel or conduit that directs a shot." },
    { part: "Trigger Assembly", role: "mech",     weight: 0.5, mats: ["Circuitry", "Scrap Metal"], exotic: "Power Cell",       desc: "The firing mechanism — sears, springs, and contacts." },
    { part: "Stock",            role: "frame",    weight: 1,   mats: ["Hardwood", "Scrap Metal"],  exotic: "Pristine Alloy",   desc: "A frame or stock that braces a ranged weapon." },
    { part: "Emitter Lens",     role: "edge",     weight: 1,   mats: ["Circuitry", "Focus Crystal"], exotic: "Power Cell",     desc: "A focusing lens/coil for directed-energy weapons." },
    { part: "Focus Array",      role: "edge",     weight: 1,   mats: ["Focus Crystal"],            exotic: "Resonant Crystal", desc: "A tuned crystal array that shapes psionic force." },
    { part: "Warhead",          role: "edge",     weight: 1,   mats: ["Chemicals", "Scrap Metal"], exotic: "Volatile Compound", desc: "A charged payload for explosives and volatile arms." },
    { part: "Power Core",       role: "core",     weight: 0.5, mats: ["Circuitry"],                exotic: "Power Cell",       desc: "An energy core that powers tech and energy weapons." },
    { part: "Living Node",      role: "core",     weight: 1,   mats: ["Botanicals", "Bone & Sinew"], exotic: "Ki Core",        desc: "A cultivated living heart for symbiotic weapons." },
    { part: "Plating",          role: "armor",    weight: 4,   mats: ["Scrap Metal"],              exotic: "Pristine Alloy",   desc: "Rigid protective plate for medium and heavy armor." },
    { part: "Armor Weave",      role: "armor",    weight: 2,   mats: ["Leather", "Cloth"],         exotic: "Pristine Alloy",   desc: "A layered flexible weave — the body of light armor." },
    { part: "Padding",          role: "lining",   weight: 1,   mats: ["Cloth"],                    exotic: "Pristine Alloy",   desc: "Shock-absorbing lining worn under armor." },
    { part: "Straps & Fittings", role: "fittings", weight: 0.5, mats: ["Leather"],                 exotic: "Pristine Alloy",   desc: "Buckles, straps, and hardware that hold gear together." },
  ];
  PC.componentByPart = {};
  PC.COMPONENTS.forEach(function (c) {
    PC.componentByPart[c.part] = c;
    // Register each grade as a findable/searchable catalog item + description.
    PC.ITEM_DESCRIPTIONS[c.part] = c.desc;
    for (var q = 1; q <= 4; q++) {
      var nm = PC.qualityName(q) + " " + c.part;
      PC.ITEM_DESCRIPTIONS[nm] = c.desc + " (" + PC.qualityName(q) + " grade.)";
      PC.ITEMS.push({ name: nm, category: "Component", part: c.part, quality: q, weight: c.weight, desc: PC.ITEM_DESCRIPTIONS[nm] });
    }
  });
  PC.isComponent = function (name) { var n = String(name || "").replace(/^(Crude|Standard|Fine|Masterwork)\s+/, ""); return !!PC.componentByPart[n]; };
  PC.componentName = function (part, q) { return PC.qualityName(q) + " " + part; };
  // Raw-material recipe to CRAFT a component at grade q. Basic mats at low grades; exotic at Q3–Q4.
  PC.componentRecipe = function (part, q) {
    var d = PC.componentByPart[part]; if (!d) return null;
    q = q || 1;
    var out = [{ mat: d.mats[0], qty: q >= 2 ? 2 : 1 }];
    if (d.mats[1]) out.push({ mat: d.mats[1], qty: 1 });
    if (q >= 3) out.push({ mat: d.exotic, qty: q >= 4 ? 2 : 1 });
    return _merge(out);
  };
  // Raw recovered by breaking a component DOWN (Basic ≈ half min 1, Exotic floor half).
  PC.componentSalvageYield = function (part, q) {
    var r = PC.componentRecipe(part, q); if (!r) return null;
    return _merge(r.map(function (c) {
      var half = PC.SALVAGE_TIER[c.mat] === "Exotic" ? Math.floor(c.qty / 2) : Math.max(1, Math.ceil(c.qty / 2));
      return { mat: c.mat, qty: half };
    }));
  };

  /* Templates — one per weapon subtype & armor class. They encode the RULES: fixed attribute, the
     component slots the item needs, its allowed weight band, and the damage/DS table by quality
     (Q4 = that subtype's real catalog maximum = the hard cap). Custom-item stats come from the
     AVERAGE grade of the components used, read off this table and never exceeding Q4. */
  PC.WEAPON_TEMPLATES = {
    "Heavy Weapons":   { attr: "STR", slots: ["Bludgeon Head", "Haft"],                    hands: 2, weight: [3, 16], dmg: { 1: "1d10", 2: "1d12", 3: "2d8",  4: "3d8" } },
    "Fist Weapons":    { attr: "STR", slots: ["Bludgeon Head", "Straps & Fittings"],       hands: 1, weight: [1, 4],  dmg: { 1: "1d4",  2: "1d6",  3: "1d8",  4: "2d6" } },
    "Archery":         { attr: "STR", slots: ["Bow Limbs", "Straps & Fittings"],           hands: 2, weight: [1, 3],  dmg: { 1: "1d6",  2: "1d8",  3: "2d6",  4: "2d8" } },
    "Light Weapons":   { attr: "AGI", slots: ["Blade", "Haft"],                            hands: 1, weight: [1, 3],  dmg: { 1: "1d4",  2: "1d6",  3: "1d8",  4: "2d6" } },
    "Quick Weapons":   { attr: "AGI", slots: ["Blade", "Haft"],                            hands: 1, weight: [1, 4],  dmg: { 1: "1d4",  2: "1d6",  3: "1d6",  4: "1d8" } },
    "Thrown Weapons":  { attr: "AGI", slots: ["Blade", "Straps & Fittings"],               hands: 1, weight: [1, 1],  dmg: { 1: "1d4",  2: "1d4",  3: "1d6",  4: "1d6" } },
    "Firearms":        { attr: "CON", slots: ["Barrel", "Trigger Assembly", "Stock"],      hands: 2, weight: [2, 12], dmg: { 1: "1d8",  2: "1d10", 3: "1d12", 4: "2d10" } },
    "Explosives":      { attr: "CON", slots: ["Warhead", "Trigger Assembly"],              hands: 1, weight: [1, 3],  dmg: { 1: "2d6",  2: "2d8",  3: "3d6",  4: "3d6" } },
    "Volatile Weapons":{ attr: "CON", slots: ["Warhead", "Barrel", "Trigger Assembly"],    hands: 2, weight: [8, 16], dmg: { 1: "1d8",  2: "2d6",  3: "3d6",  4: "3d6" } },
    "Laser Weapons":   { attr: "INT", slots: ["Emitter Lens", "Power Core", "Stock"],      hands: 1, weight: [3, 9],  dmg: { 1: "1d8",  2: "1d10", 3: "2d8",  4: "2d8" } },
    "Plasma Weapons":  { attr: "INT", slots: ["Emitter Lens", "Power Core", "Barrel"],     hands: 2, weight: [3, 22], dmg: { 1: "1d10", 2: "1d12", 3: "3d6",  4: "4d6" } },
    "Tech Weapons":    { attr: "INT", slots: ["Barrel", "Power Core", "Trigger Assembly"], hands: 2, weight: [4, 12], dmg: { 1: "1d8",  2: "1d10", 3: "1d12", 4: "2d8" } },
    "Channel Weapons": { attr: "WIS", slots: ["Focus Array", "Haft"],                      hands: 1, weight: [1, 4],  dmg: { 1: "1d6",  2: "1d8",  3: "1d8",  4: "2d6" } },
    "Ritual Weapons":  { attr: "WIS", slots: ["Focus Array", "Haft"],                      hands: 1, weight: [1, 5],  dmg: { 1: "1d6",  2: "1d6",  3: "1d8",  4: "1d8" } },
    "Living Weapons":  { attr: "WIS", slots: ["Living Node", "Haft"],                      hands: 1, weight: [2, 4],  dmg: { 1: "1d6",  2: "1d8",  3: "2d6",  4: "2d6" } },
    "Finesse Weapons": { attr: "CHA", slots: ["Blade", "Haft"],                            hands: 1, weight: [1, 4],  dmg: { 1: "1d6",  2: "1d8",  3: "1d10", 4: "2d8" } },
    "Art Weapons":     { attr: "CHA", slots: ["Focus Array", "Haft"],                      hands: 1, weight: [1, 4],  dmg: { 1: "1d6",  2: "1d8",  3: "1d8",  4: "2d6" } },
    "Noise Weapons":   { attr: "CHA", slots: ["Focus Array", "Power Core"],                hands: 2, weight: [5, 10], dmg: { 1: "1d8",  2: "1d10", 3: "2d8",  4: "3d6" } },
  };
  PC.ARMOR_TEMPLATES = {
    "Light":  { slots: ["Armor Weave", "Straps & Fittings"],            weight: [2, 8],   ds: { 1: 1, 2: 2, 3: 2, 4: 2 } },
    "Medium": { slots: ["Armor Weave", "Plating", "Straps & Fittings"], weight: [6, 18],  ds: { 1: 3, 2: 3, 3: 4, 4: 4 } },
    "Heavy":  { slots: ["Plating", "Padding", "Straps & Fittings"],     weight: [20, 40], ds: { 1: 5, 2: 5, 3: 6, 4: 6 } },
  };
  PC.weaponTemplate = function (t) { return PC.WEAPON_TEMPLATES[t] || null; };
  PC.armorTemplate = function (c) { return PC.ARMOR_TEMPLATES[c] || null; };

  /* Weapon SUBTYPES — each weapon type breaks down into named subtypes (from WEAPONS.md), each with a
     base damage die (its Crude/Q1 damage). Higher component grades ladder the die up (see subtypeDamage). */
  PC.WEAPON_SUBTYPES = {
    "Heavy Weapons":    [{ name: "Great Hammers", die: "2d6" }, { name: "Great Swords", die: "2d6" }, { name: "Great Axes", die: "1d12" }, { name: "Maces", die: "1d10" }, { name: "Axes", die: "1d8" }],
    "Fist Weapons":     [{ name: "Knuckles", die: "1d4" }, { name: "Full Fists", die: "1d6" }, { name: "Knuckle Blades", die: "1d6" }],
    "Archery":          [{ name: "Longbows", die: "1d8" }, { name: "Shortbows", die: "1d6" }, { name: "Slings", die: "1d4" }, { name: "Slingshots", die: "1d4" }],
    "Light Weapons":    [{ name: "Knives", die: "1d4" }, { name: "Daggers", die: "1d4" }, { name: "Batons", die: "1d6" }, { name: "Short Swords", die: "1d6" }],
    "Quick Weapons":    [{ name: "Tonfa", die: "1d6" }, { name: "Wrist Blades", die: "1d6" }, { name: "Hand Crossbows", die: "1d6" }, { name: "Blowguns", die: "1d4" }],
    "Thrown Weapons":   [{ name: "Shuriken", die: "1d4" }, { name: "Throwing Knives", die: "1d4" }, { name: "Darts", die: "1d4" }],
    "Firearms":         [{ name: "Rifles", die: "1d10" }, { name: "Handguns", die: "1d8" }, { name: "Revolvers", die: "1d10" }],
    "Explosives":       [{ name: "Grenades", die: "2d6" }, { name: "Mines", die: "2d8" }, { name: "Improvised Explosives", die: "2d6" }],
    "Volatile Weapons": [{ name: "Flamethrowers", die: "2d6" }, { name: "Rocket Launchers", die: "3d6" }, { name: "Chemical Weapons", die: "1d8" }],
    "Laser Weapons":    [{ name: "Laser Swords", die: "1d10" }, { name: "Blaster Rifles", die: "1d10" }, { name: "Blaster Pistols", die: "1d8" }],
    "Plasma Weapons":   [{ name: "Plasma Blades", die: "1d10" }, { name: "Beam Rifles", die: "1d12" }, { name: "Plasma Cannons", die: "3d6" }],
    "Tech Weapons":     [{ name: "Chain Blades", die: "1d10" }, { name: "Power Weapons", die: "1d10" }, { name: "Rocket Weapons", die: "1d12" }],
    "Channel Weapons":  [{ name: "Staffs", die: "1d6" }, { name: "Wands", die: "1d8" }, { name: "Amulets", die: "1d6" }],
    "Living Weapons":   [{ name: "Sentient Plants", die: "1d8" }, { name: "Living Oozes", die: "1d8" }, { name: "Insect Hives", die: "1d6" }],
    "Ritual Weapons":   [{ name: "Ritual Blades", die: "1d6" }, { name: "Incense Flails", die: "1d8" }],
    "Finesse Weapons":  [{ name: "Fencing Swords", die: "1d8" }, { name: "Rope Weapons", die: "1d6" }, { name: "Chakrams", die: "1d6" }],
    "Art Weapons":      [{ name: "Battle Fans", die: "1d6" }, { name: "Hoop Blades", die: "1d6" }, { name: "Nunchucku", die: "1d8" }],
    "Noise Weapons":    [{ name: "Instrument Weapons", die: "1d8" }, { name: "Percussive Weapons", die: "1d10" }, { name: "Amp Weapons", die: "1d10" }],
  };
  // Ascending damage-die ladder — each quality grade steps a subtype's base die one rung up (hard-capped).
  PC.DIE_LADDER = ["1d4", "1d6", "1d8", "1d10", "1d12", "2d6", "2d8", "2d10", "3d6", "3d8", "4d6"];
  PC.weaponSubtypes = function (type) { return PC.WEAPON_SUBTYPES[type] || []; };
  PC.subtypeDie = function (type, name) { var s = (PC.WEAPON_SUBTYPES[type] || []).filter(function (x) { return x.name === name; })[0]; return s ? s.die : null; };
  // A subtype's base die stepped up by quality: Q1 = base, Q2..Q4 = +1/+2/+3 rungs (clamped to the ladder).
  PC.subtypeDamage = function (die, q) {
    var i = PC.DIE_LADDER.indexOf(die);
    if (i < 0) return die;
    return PC.DIE_LADDER[Math.min(i + (Math.max(1, Math.min(4, q)) - 1), PC.DIE_LADDER.length - 1)];
  };
  // The component slots an item is assembled from (null for non-component items).
  PC.itemComponentSlots = function (item) {
    if (!item) return null;
    if (item.category === "Weapon") { var wt = PC.WEAPON_TEMPLATES[item.weaponType]; return wt ? wt.slots.slice() : ["Blade", "Haft"]; }
    if (item.category === "Armor") {
      var cls = item.armorClass || "Light";
      var cov = item.coverage || "full";
      // Accessory pieces (head/back/arms/legs/feet) are smaller than a body suit, so they take a slimmer,
      // class-appropriate set of components instead of the full body-armor template.
      if (cov !== "full" && cov !== "torso") {
        if (cls === "Heavy")  return ["Plating", "Straps & Fittings"];
        if (cls === "Medium") return ["Armor Weave", "Straps & Fittings"];
        return ["Armor Weave"];
      }
      var at = PC.ARMOR_TEMPLATES[cls]; return at ? at.slots.slice() : ["Armor Weave", "Straps & Fittings"];
    }
    if (item.category === "Shield") {
      // A rigid guard: plating + straps, with padding added for the big ones (tower/pavise/ballistic).
      return (Number(item.dsBonus) || 0) >= 4 ? ["Plating", "Padding", "Straps & Fittings"] : ["Plating", "Straps & Fittings"];
    }
    return null;
  };
  // Average grade of a set of component grades → clamped 1–4 (the "average of parts" quality rule).
  PC.qualityFromGrades = function (grades) {
    if (!grades || !grades.length) return 1;
    var sum = grades.reduce(function (s, g) { return s + (Number(g) || 1); }, 0);
    return Math.max(1, Math.min(4, Math.floor(sum / grades.length)));
  };
  // The stat a template yields at a given quality: damage die (weapons) or DS bonus (armor).
  PC.templateDamage = function (weaponType, q) { var t = PC.WEAPON_TEMPLATES[weaponType]; return t ? t.dmg[Math.max(1, Math.min(4, q))] : null; };
  PC.templateDS = function (armorClass, q) { var t = PC.ARMOR_TEMPLATES[armorClass]; return t ? t.ds[Math.max(1, Math.min(4, q))] : null; };

  // Weapon type → [primary basic, secondary basic, exotic] materials.
  var _wmat = {
    "Heavy Weapons":    ["Scrap Metal", "Hardwood",     "Pristine Alloy"],
    "Fist Weapons":     ["Scrap Metal", "Leather",      "Pristine Alloy"],
    "Light Weapons":    ["Scrap Metal", "Leather",      "Pristine Alloy"],
    "Quick Weapons":    ["Scrap Metal", "Hardwood",     "Pristine Alloy"],
    "Finesse Weapons":  ["Scrap Metal", "Leather",      "Pristine Alloy"],
    "Thrown Weapons":   ["Scrap Metal", "Leather",      "Pristine Alloy"],
    "Archery":          ["Hardwood",    "Bone & Sinew", "Pristine Alloy"],
    "Firearms":         ["Scrap Metal", "Circuitry",    "Pristine Alloy"],
    "Explosives":       ["Chemicals",   "Scrap Metal",  "Volatile Compound"],
    "Volatile Weapons": ["Chemicals",   "Scrap Metal",  "Volatile Compound"],
    "Laser Weapons":    ["Circuitry",   "Scrap Metal",  "Power Cell"],
    "Plasma Weapons":   ["Circuitry",   "Scrap Metal",  "Power Cell"],
    "Tech Weapons":     ["Circuitry",   "Scrap Metal",  "Power Cell"],
    "Channel Weapons":  ["Focus Crystal", "Hardwood",     "Resonant Crystal"],
    "Ritual Weapons":   ["Focus Crystal", "Bone & Sinew", "Resonant Crystal"],
    "Art Weapons":      ["Focus Crystal", "Cloth",        "Resonant Crystal"],
    "Noise Weapons":    ["Circuitry",     "Focus Crystal","Resonant Crystal"],
    "Living Weapons":   ["Botanicals",    "Bone & Sinew", "Ki Core"],
  };
  var _amat = {
    "Light":  ["Leather",     "Cloth",   "Pristine Alloy"],
    "Medium": ["Leather",     "Scrap Metal", "Pristine Alloy"],
    "Heavy":  ["Scrap Metal", "Leather", "Pristine Alloy"],
  };
  // Per-name recipes for consumables / tools / misc (materials, 1 each unless the name repeats).
  var _override = {
    // Consumables
    "Bandages": ["Cloth", "Botanicals"], "Health Draught": ["Botanicals", "Chemicals"],
    "Greater Health Draught": ["Botanicals", "Chemicals", "Volatile Compound"],
    "Stimpak": ["Chemicals", "Circuitry", "Volatile Compound"],
    "KP Elixir": ["Botanicals", "Focus Crystal"], "Greater KP Elixir": ["Botanicals", "Focus Crystal", "Resonant Crystal"],
    "Vital Tonic": ["Botanicals", "Chemicals", "Focus Crystal"], "Chakra Salve": ["Botanicals", "Focus Crystal"],
    "Panacea": ["Botanicals", "Ki Core", "Volatile Compound"], "Rez Serum": ["Chemicals", "Ki Core"],
    "Antitoxin": ["Botanicals", "Chemicals"], "Adrenaline Shot": ["Chemicals", "Circuitry"],
    "Trail Rations": ["Botanicals"], "Waterskin": ["Leather"], "Smoke Bomb": ["Chemicals", "Cloth"], "Flare": ["Chemicals"],
    // Tools
    "Toolkit": ["Scrap Metal", "Hardwood"], "Tinker's Kit": ["Scrap Metal", "Leather"], "Lockpicks": ["Scrap Metal"],
    "Climbing Kit": ["Bone & Sinew", "Scrap Metal"], "Survival Kit": ["Leather", "Cloth"], "Medkit": ["Cloth", "Botanicals"],
    "Investigator's Kit": ["Leather", "Circuitry"], "Engineer's Tools": ["Scrap Metal", "Circuitry"], "Linguist's Kit": ["Cloth", "Hardwood"],
    "Herbalism Kit": ["Leather", "Botanicals"], "Naturalist's Kit": ["Leather", "Bone & Sinew"], "Beast-Handler's Kit": ["Leather", "Bone & Sinew"],
    "Incense Kit": ["Botanicals", "Cloth"], "Binoculars": ["Circuitry", "Scrap Metal"], "Disguise Kit": ["Cloth", "Leather"],
    "Musical Instrument": ["Hardwood", "Bone & Sinew"], "Rope (50 ft)": ["Cloth"], "Grappling Hook": ["Scrap Metal"],
    "Old-World Datapad": ["Circuitry"], "Comm Device": ["Circuitry"], "Lantern": ["Scrap Metal", "Cloth"], "Torch": ["Hardwood", "Cloth"],
    // Misc
    "Backpack": ["Leather", "Cloth"], "Bedroll": ["Cloth"], "Component Pouch": ["Cloth", "Botanicals"],
    "Holy Charm": ["Focus Crystal", "Bone & Sinew"], "Prayer Beads": ["Hardwood", "Bone & Sinew"], "Meditation Stone": ["Focus Crystal"],
    "Old-World Relic": ["Circuitry", "Ki Core"], "Journal & Pen": ["Cloth", "Hardwood"], "Sigil Talisman": ["Focus Crystal", "Cloth"],
    // Ammunition
    "Arrows": ["Hardwood"], "Sling Bullets": ["Scrap Metal"], "Crossbow Bolts": ["Hardwood", "Scrap Metal"], "Blowgun Darts": ["Hardwood"],
    "Pistol Rounds": ["Scrap Metal", "Chemicals"], "Rifle Rounds": ["Scrap Metal", "Chemicals"], "Shotgun Shells": ["Scrap Metal", "Chemicals"],
    "Heavy Rounds": ["Scrap Metal", "Volatile Compound"], "Rockets": ["Scrap Metal", "Volatile Compound"], "Fuel Canister": ["Chemicals", "Volatile Compound"],
    "Chemical Canister": ["Chemicals", "Volatile Compound"], "Charge Pack": ["Power Cell", "Circuitry"],
  };
  var _catDefault = { "Consumable": ["Botanicals", "Chemicals"], "Tool": ["Scrap Metal", "Leather"], "Misc": ["Cloth", "Leather"], "Ammo": ["Scrap Metal"] };
  var _nonCraft = { "Scrip / Currency": true };
  // Advisory crafting skill, from the recipe's primary material.
  var _craftSkill = {
    "Scrap Metal": "Laborer's Tools", "Pristine Alloy": "Laborer's Tools",
    "Circuitry": "Technology", "Power Cell": "Technology",
    "Focus Crystal": "Paranormal", "Resonant Crystal": "Paranormal", "Ki Core": "Paranormal",
    "Botanicals": "Herbalism", "Chemicals": "Herbalism", "Volatile Compound": "Herbalism",
    "Hardwood": "Nature Tools", "Bone & Sinew": "Nature Tools", "Leather": "Nature Tools", "Cloth": "Nature Tools",
  };
  function _clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function _bulk(w) { return _clamp(Math.round((Number(w) || 1) / 3), 1, 6); }
  function _tier(r) { return ({ "Common": 0, "Uncommon": 1, "Rare": 2, "Very Rare": 3 })[r] || 0; }
  function _merge(list) { // combine duplicate materials, drop qty<=0
    var m = {}, order = [];
    list.forEach(function (c) { if (c.qty > 0) { if (!(c.mat in m)) order.push(c.mat); m[c.mat] = (m[c.mat] || 0) + c.qty; } });
    return order.map(function (mat) { return { mat: mat, qty: m[mat] }; });
  }

  var _rolePri = { edge: 0, core: 1, armor: 2, frame: 3, mech: 4, lining: 5, fittings: 6 };
  function _partOf(item) {
    return item.part || (PC.isComponent(item.name) ? String(item.name).replace(/^(Crude|Standard|Fine|Masterwork)\s+/, "") : null);
  }
  // The recipe to CRAFT an item, as [{mat, qty}] — where `mat` may be a raw salvage material OR a
  // component name (with component:true, part, quality). null if it can't be crafted (Legendary,
  // raw salvage, or currency). Weapons & armor are assembled from COMPONENTS (at the grade matching
  // their rarity); components themselves, and consumables/tools/misc, are made from raw salvage.
  PC.itemRecipe = function (item) {
    if (!item || item.category === "Salvage") return null;
    if (item.rarity === "Legendary") return null;
    if (_nonCraft[item.name]) return null;
    // A component: raw-material recipe at its grade.
    if (item.category === "Component" || item.part) {
      return PC.componentRecipe(_partOf(item), item.quality || PC.rarityQuality(item.rarity) || 1);
    }
    // A weapon, armor, or shield: one of each template component slot, at the item's rarity grade.
    if (item.category === "Weapon" || item.category === "Armor" || item.category === "Shield") {
      var slots = PC.itemComponentSlots(item);
      var q = PC.rarityQuality(item.rarity);
      return slots.map(function (part) { return { mat: PC.componentName(part, q), qty: 1, component: true, part: part, quality: q }; });
    }
    // Everything else (consumables, tools, misc): raw salvage.
    var out = [];
    var mats = _override[item.name] || _catDefault[item.category] || ["Cloth"];
    mats.forEach(function (mm) { out.push({ mat: mm, qty: 1 }); });
    return _merge(out);
  };
  // What you RECOVER by breaking an item down. Components/consumables/tools/misc give back RAW salvage
  // (Basic ≈ half min 1, Exotic floor½). Weapons & armor give back some of their COMPONENTS — the
  // higher-value ones, ceil(half) of the slots — at the item's grade, so teardown is lossy (no loop).
  PC.itemSalvageYield = function (item) {
    if (!item) return null;
    if ((item.category === "Weapon" || item.category === "Armor" || item.category === "Shield") && PC.itemRecipe(item)) {
      var slots = PC.itemComponentSlots(item);
      var q = PC.rarityQuality(item.rarity);
      var _pri = function (part) { var r = (PC.componentByPart[part] || {}).role; return _rolePri[r] != null ? _rolePri[r] : 9; };
      var keep = slots.slice().sort(function (a, b) { return _pri(a) - _pri(b); }).slice(0, Math.ceil(slots.length / 2));
      return keep.map(function (part) { return { mat: PC.componentName(part, q), qty: 1, component: true, part: part, quality: q }; });
    }
    var r = PC.itemRecipe(item);
    if (!r) return null;
    return _merge(r.map(function (c) {
      var q = PC.SALVAGE_TIER[c.mat] === "Exotic" ? Math.floor(c.qty / 2) : Math.max(1, Math.ceil(c.qty / 2));
      return { mat: c.mat, qty: q };
    }));
  };
  // Advisory crafting skill for an item. Weapons/armor use their primary component's material; a
  // component uses its own primary material; everything else uses its recipe's primary material.
  PC.craftSkillFor = function (item) {
    if (!item) return null;
    var part = _partOf(item);
    if (item.category === "Component" || part) { var d = PC.componentByPart[part]; return d ? (_craftSkill[d.mats[0]] || null) : null; }
    var slots = PC.itemComponentSlots(item);
    if (slots && slots.length) { var d2 = PC.componentByPart[slots[0]]; return d2 ? (_craftSkill[d2.mats[0]] || null) : null; }
    var r = PC.itemRecipe(item);
    return (r && r.length) ? (_craftSkill[r[0].mat] || null) : null;
  };
})();
