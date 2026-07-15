/* ============================================================
   Psion Chronicles — Game Data
   Source of truth: GAME_RULES.md + TECHNIQUES.md
   Loaded as a global `PC` object (no modules, works on file://).
   ============================================================ */
window.PC = window.PC || {};

/* --- Attributes ---------------------------------------------------------- */
PC.ATTRS = ["STR", "AGI", "CON", "INT", "WIS", "CHA"];
PC.ATTR_NAMES = {
  STR: "Strength", AGI: "Agility", CON: "Constitution",
  INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};
PC.BODY_ATTRS = ["STR", "AGI", "CON"]; // Body Pool = HP
PC.MIND_ATTRS = ["INT", "WIS", "CHA"]; // Mind Pool = KP (Ki Points)

/* --- Chakras (one per attribute) ---------------------------------------- */
PC.CHAKRAS = {
  STR: { name: "Core",      full: "Solar Plexus", theme: "Raw power & willpower" },
  AGI: { name: "Sacral",    full: "Sacral",       theme: "Movement, flow, reflexes" },
  CON: { name: "Root",      full: "Root",         theme: "Survival, endurance, grounding" },
  CHA: { name: "Throat",    full: "Throat",       theme: "Voice & expression" },
  WIS: { name: "Third Eye", full: "Third Eye",    theme: "Insight, awareness, intuition" },
  INT: { name: "Crown",     full: "Crown",        theme: "Knowledge, logic, higher mind" },
};

/* --- The 18 Kinetics (3 per attribute: Tank / Controller / Healer) ------- */
PC.KINETICS = [
  { name: "Robukinesis",   attr: "STR", role: "Tank",       domain: "Raw Ki, life force, martial power" },
  { name: "Pyrokinesis",   attr: "STR", role: "Controller", domain: "Fire, heat, combustion" },
  { name: "Electrokinesis",attr: "STR", role: "Healer",     domain: "Bioelectricity, lightning, restoring life" },
  { name: "Aerokinesis",   attr: "AGI", role: "Tank",       domain: "Wind and air" },
  { name: "Umbrakinesis",  attr: "AGI", role: "Controller", domain: "Shadows and darkness" },
  { name: "Hydrokinesis",  attr: "AGI", role: "Healer",     domain: "Water and restorative flow" },
  { name: "Terrakinesis",  attr: "CON", role: "Tank",       domain: "Earth and stone" },
  { name: "Cryokinesis",   attr: "CON", role: "Controller", domain: "Ice, cold, preservation" },
  { name: "Vitakinesis",   attr: "CON", role: "Healer",     domain: "Vitality, life force, renewal" },
  { name: "Gravikinesis",  attr: "INT", role: "Tank",       domain: "Gravity" },
  { name: "Chronokinesis", attr: "INT", role: "Controller", domain: "Time" },
  { name: "Biokinesis",    attr: "INT", role: "Healer",     domain: "Biology, living tissue" },
  { name: "Demokinesis",   attr: "WIS", role: "Tank",       domain: "Demonic power" },
  { name: "Naturakinesis", attr: "WIS", role: "Controller", domain: "Plants and nature" },
  { name: "Holykinesis",   attr: "WIS", role: "Healer",     domain: "Holy and angelic power" },
  { name: "Sonikinesis",   attr: "CHA", role: "Tank",       domain: "Sound and resonance" },
  { name: "Lumokinesis",   attr: "CHA", role: "Controller", domain: "Light" },
  { name: "Spirikinesis",  attr: "CHA", role: "Healer",     domain: "Spirits and the afterlife" },
];

/* --- Skills (36; grouped by governing attribute) ------------------------- */
PC.SKILLS = [
  // STR
  { name: "Muscle",         attr: "STR", desc: "Raw physical power to lift, break, or shove heavy objects." },
  { name: "Laborer's Tools",attr: "STR", desc: "Using heavy equipment like hammers, saws, and masonry tools." },
  { name: "Intimidation",   attr: "STR", desc: "Using physical presence or brute force to coerce or scare." },
  { name: "Athletics",      attr: "STR", desc: "Climbing, sprinting, swimming, and jumping." },
  { name: "Grapple",        attr: "STR", desc: "Pinning, restraining, or wrestling opponents in close combat." },
  { name: "Force",          attr: "STR", desc: "Concentrated power to break through barriers or obstacles." },
  // AGI
  { name: "Acrobatics",     attr: "AGI", desc: "Fluid movement for balancing, tumbling, and landing safely." },
  { name: "Stealth",        attr: "AGI", desc: "Moving silently and staying hidden from sight." },
  { name: "Sleight of Hand",attr: "AGI", desc: "Manual dexterity for picking pockets or palming items." },
  { name: "Deft Tools",     attr: "AGI", desc: "Precise control for lockpicks, glass cutters, clockwork kits." },
  { name: "Reflex",         attr: "AGI", desc: "Quickness dodging projectiles or sudden hazards." },
  { name: "Escape Artist",  attr: "AGI", desc: "Slipping restraints, grapples, and squeezing through tight spaces." },
  // CON
  { name: "Survival",       attr: "CON", desc: "Staying alive in harsh environments through grit and endurance." },
  { name: "Adrenaline",     attr: "CON", desc: "Pushing past limits to ignore pain or temporary fatigue." },
  { name: "Concentration",  attr: "CON", desc: "Keeping focus despite physical trauma or distraction." },
  { name: "Tolerance",      attr: "CON", desc: "Resisting toxins, diseases, or extreme temperatures." },
  { name: "Fortitude",      attr: "CON", desc: "Toughness to reduce the severity of incoming physical blows." },
  { name: "Hardiness",      attr: "CON", desc: "Recovering more effectively from exhaustion or rest." },
  // INT
  { name: "Investigation",  attr: "INT", desc: "Piecing together clues and deducing information from a scene." },
  { name: "Medicine",       attr: "INT", desc: "Anatomy, surgery, and treatment of physical injuries." },
  { name: "History",        attr: "INT", desc: "Recalling past events, ancient cultures, genealogies." },
  { name: "Mythology",      attr: "INT", desc: "Legends, deities, and folklore of the world." },
  { name: "Technology",     attr: "INT", desc: "Operating, repairing, or analyzing complex machinery." },
  { name: "Language",       attr: "INT", desc: "Linguistics, cyphers, and ancient scripts." },
  // WIS
  { name: "Paranormal",     attr: "WIS", desc: "Sensing spirits, detecting curses, understanding the occult." },
  { name: "Herbalism",      attr: "WIS", desc: "Identifying plants and using them for remedies." },
  { name: "Zoology",        attr: "WIS", desc: "Animal behavior, tracking, and taming beasts." },
  { name: "Awareness",      attr: "WIS", desc: "Noticing subtle changes through sight and sound." },
  { name: "Insight",        attr: "WIS", desc: "Reading body language to tell if someone is lying." },
  { name: "Nature Tools",   attr: "WIS", desc: "Using primitive gear: fishing kits, tanning tools, flint-knapping." },
  // CHA
  { name: "Music",          attr: "CHA", desc: "Playing instruments or singing to evoke emotions." },
  { name: "Persuasion",     attr: "CHA", desc: "Influencing others through logic, charm, or diplomacy." },
  { name: "Deception",      attr: "CHA", desc: "Spinning lies or maintaining a false identity." },
  { name: "Performance",    attr: "CHA", desc: "Entertaining a crowd through acting, storytelling, or dance." },
  { name: "Etiquette",      attr: "CHA", desc: "Navigating social hierarchies and high-society protocols." },
  { name: "Barter",         attr: "CHA", desc: "Negotiating lower prices and better deals in trade." },
];

/* --- Weapon types (18; governing attribute + subtypes) ------------------- */
PC.WEAPON_TYPES = [
  { name: "Heavy Weapons",  attr: "STR", subtypes: ["Great Hammers","Great Swords","Great Axes","Maces","Axes"] },
  { name: "Archery",        attr: "STR", melee: false, subtypes: ["Longbows","Shortbows","Slings","Slingshots"] },
  { name: "Fist Weapons",   attr: "STR", subtypes: ["Knuckles","Full Fists","Knuckle Blades"] },
  { name: "Light Weapons",  attr: "AGI", subtypes: ["Knives","Daggers","Batons","Short Swords"] },
  { name: "Quick Weapons",  attr: "AGI", subtypes: ["Tonfa","Wrist Blades","Hand Crossbows","Blowguns"] },
  { name: "Thrown Weapons", attr: "AGI", subtypes: ["Shuriken","Throwing Knives","Darts"] },
  { name: "Firearms",       attr: "CON", melee: false, subtypes: ["Rifles","Handguns","Revolvers"] },
  { name: "Explosives",     attr: "CON", melee: false, subtypes: ["Grenades","Mines","Improvised Explosives"] },
  { name: "Volatile Weapons",attr:"CON", melee: false, subtypes: ["Flamethrowers","Rocket Launchers","Chemical Weapons"] },
  { name: "Laser Weapons",  attr: "INT", subtypes: ["Blaster Rifles","Blaster Pistols","Laser Swords"] },
  { name: "Plasma Weapons", attr: "INT", subtypes: ["Beam Rifles","Plasma Cannons","Plasma Blades"] },
  { name: "Tech Weapons",   attr: "INT", subtypes: ["Chain Blades","Power Weapons","Rocket Weapons"] },
  { name: "Channel Weapons",attr: "WIS", subtypes: ["Staffs","Wands","Amulets"] },
  { name: "Living Weapons", attr: "WIS", subtypes: ["Insect Hives","Sentient Plants","Living Oozes"] },
  { name: "Ritual Weapons", attr: "WIS", subtypes: ["Ritual Blades","Incense Flails"] },
  { name: "Finesse Weapons",attr: "CHA", subtypes: ["Fencing Swords","Rope Weapons","Chakrams"] },
  { name: "Art Weapons",    attr: "CHA", subtypes: ["Battle Fans","Hoop Blades","Nunchucku"] },
  { name: "Noise Weapons",  attr: "CHA", subtypes: ["Instrument Weapons","Amp Weapons","Percussive Weapons"] },
];

/* --- 9 Psionic Backgrounds ---------------------------------------------- */
/* boosts: {ATTR: n}, pool: {body,mind}, skills:[..], combat:[weaponType, Kinetic], freeTech: name|null */
PC.BACKGROUNDS = [
  { name: "Body Builder", blurb: "A gym rat who reached the peak of human physicality; now survives by raw strength.",
    boosts: { STR: 3 }, pool: { body: 10, mind: 0 },
    skills: ["Muscle","Athletics","Force"], combat: ["Heavy Weapons","Robukinesis"], freeTech: "Ki Strike",
    equipment: {
      fixed: [ { name: "Trail Rations", category: "Consumable", weight: 2, qty: 3 } ],
      choices: [
        { label: "Primary weapon", options: [
          { label: "Warhammer (2d6)", items: [{ name: "Warhammer", category: "Weapon", weight: 12, qty: 1, weaponType: "Heavy Weapons", damage: "2d6", equipped: true, proficient: true }] },
          { label: "Great Axe (1d12)", items: [{ name: "Great Axe", category: "Weapon", weight: 12, qty: 1, weaponType: "Heavy Weapons", damage: "1d12", equipped: true, proficient: true }] },
          { label: "Battleaxe (1d8)", items: [{ name: "Battleaxe", category: "Weapon", weight: 4, qty: 1, weaponType: "Heavy Weapons", damage: "1d8", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Reinforced Vest (+2 DS)", items: [{ name: "Reinforced Vest", category: "Armor", weight: 15, qty: 1, dsBonus: 2, equipped: true }] },
          { label: "Heavy Plating (+3 DS)", items: [{ name: "Heavy Plating", category: "Armor", weight: 25, qty: 1, dsBonus: 3, equipped: true }] },
        ] },
      ],
    } },
  { name: "Assassin", blurb: "A killer for hire who gets the job done quietly. Skill and dexterity handle survival's subtler parts.",
    boosts: { AGI: 3 }, pool: { body: 10, mind: 0 },
    skills: ["Stealth","Sleight of Hand","Escape Artist"], combat: ["Thrown Weapons","Umbrakinesis"], freeTech: "Shroud of Shadows",
    equipment: {
      fixed: [
        { name: "Combat Knife", category: "Weapon", weight: 1, qty: 1, weaponType: "Light Weapons", damage: "1d4" },
        { name: "Lockpicks", category: "Tool", weight: 1, qty: 1 },
      ],
      choices: [
        { label: "Thrown weapon", options: [
          { label: "Throwing Knives ×6 (1d4)", items: [{ name: "Throwing Knives", category: "Weapon", weight: 1, qty: 6, weaponType: "Thrown Weapons", damage: "1d4", equipped: true, proficient: true }] },
          { label: "Shuriken ×8 (1d4)", items: [{ name: "Shuriken", category: "Weapon", weight: 1, qty: 8, weaponType: "Thrown Weapons", damage: "1d4", equipped: true, proficient: true }] },
          { label: "Throwing Darts ×6 (1d4)", items: [{ name: "Throwing Darts", category: "Weapon", weight: 1, qty: 6, weaponType: "Thrown Weapons", damage: "1d4", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Shadowed Leathers (+2 DS)", items: [{ name: "Shadowed Leathers", category: "Armor", weight: 8, qty: 1, dsBonus: 2, equipped: true }] },
          { label: "Padded Cloak (+1 DS, light)", items: [{ name: "Padded Cloak", category: "Armor", weight: 4, qty: 1, dsBonus: 1, equipped: true }] },
        ] },
      ],
    } },
  { name: "Survivalist", blurb: "An outdoorsman whose resilience and heightened constitution are the key to surviving the new world.",
    boosts: { CON: 3 }, pool: { body: 10, mind: 0 },
    skills: ["Survival","Tolerance","Hardiness"], combat: ["Firearms","Terrakinesis"], freeTech: "Mud Skin",
    equipment: {
      fixed: [
        { name: "Hatchet", category: "Weapon", weight: 3, qty: 1, weaponType: "Heavy Weapons", damage: "1d8" },
        { name: "Survival Kit", category: "Tool", weight: 3, qty: 1 },
        { name: "Trail Rations", category: "Consumable", weight: 2, qty: 3 },
      ],
      choices: [
        { label: "Firearm", options: [
          { label: "Hunting Rifle (1d10)", items: [{ name: "Hunting Rifle", category: "Weapon", weight: 8, qty: 1, weaponType: "Firearms", damage: "1d10", equipped: true, proficient: true }] },
          { label: "Revolver (1d10, light)", items: [{ name: "Revolver", category: "Weapon", weight: 3, qty: 1, weaponType: "Firearms", damage: "1d10", equipped: true, proficient: true }] },
          { label: "Pump Shotgun (1d12)", items: [{ name: "Pump Shotgun", category: "Weapon", weight: 7, qty: 1, weaponType: "Firearms", damage: "1d12", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Weathered Leathers (+2 DS)", items: [{ name: "Weathered Leathers", category: "Armor", weight: 8, qty: 1, dsBonus: 2, equipped: true }] },
          { label: "Camo Poncho (+1 DS, light)", items: [{ name: "Camo Poncho", category: "Armor", weight: 4, qty: 1, dsBonus: 1, equipped: true }] },
        ] },
      ],
    } },
  { name: "Scholar", blurb: "A bookworm whose knowledge of old-world history and tech is invaluable in the new era.",
    boosts: { INT: 3 }, pool: { body: 0, mind: 10 },
    skills: ["History","Language","Technology"], combat: ["Plasma Weapons","Chronokinesis"], freeTech: "Slow Time",
    equipment: {
      fixed: [
        { name: "Old-World Datapad", category: "Tool", weight: 1, qty: 1 },
        { name: "Engineer's Tools", category: "Tool", weight: 4, qty: 1 },
      ],
      choices: [
        { label: "Plasma weapon", options: [
          { label: "Plasma Sword (1d10)", items: [{ name: "Plasma Sword", category: "Weapon", weight: 3, qty: 1, weaponType: "Plasma Weapons", damage: "1d10", equipped: true, proficient: true }] },
          { label: "Ion Beam Rifle (1d12)", items: [{ name: "Ion Beam Rifle", category: "Weapon", weight: 11, qty: 1, weaponType: "Plasma Weapons", damage: "1d12", equipped: true, proficient: true }] },
          { label: "Fusion Cutter (1d10)", items: [{ name: "Fusion Cutter", category: "Weapon", weight: 3, qty: 1, weaponType: "Plasma Weapons", damage: "1d10", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Reinforced Coat (+1 DS)", items: [{ name: "Reinforced Coat", category: "Armor", weight: 6, qty: 1, dsBonus: 1, equipped: true }] },
          { label: "Lab Exosuit (+2 DS)", items: [{ name: "Lab Exosuit", category: "Armor", weight: 18, qty: 1, dsBonus: 2, equipped: true }] },
        ] },
      ],
    } },
  { name: "Witch", blurb: "Once dismissed as following a dead religion; now a wise practitioner of the mystical arts.",
    boosts: { WIS: 3 }, pool: { body: 0, mind: 10 },
    skills: ["Paranormal","Herbalism","Nature Tools"], combat: ["Channel Weapons","Naturakinesis"], freeTech: "Thistle Bush",
    equipment: {
      fixed: [
        { name: "Herbalism Kit", category: "Tool", weight: 3, qty: 1 },
        { name: "Component Pouch", category: "Misc", weight: 2, qty: 1 },
      ],
      choices: [
        { label: "Channel weapon", options: [
          { label: "Rune Staff (1d6, melee)", items: [{ name: "Rune Staff", category: "Weapon", weight: 4, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
          { label: "Spirit Wand (1d6, ranged)", items: [{ name: "Spirit Wand", category: "Weapon", weight: 1, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
          { label: "Warding Amulet (1d6, AoE)", items: [{ name: "Warding Amulet", category: "Weapon", weight: 1, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Traveling Robes (+1 DS)", items: [{ name: "Traveling Robes", category: "Armor", weight: 4, qty: 1, dsBonus: 1, equipped: true }] },
          { label: "Enchanted Shawl (+2 DS)", items: [{ name: "Enchanted Shawl", category: "Armor", weight: 5, qty: 1, dsBonus: 2, equipped: true }] },
        ] },
      ],
    } },
  { name: "Musician", blurb: "A traveling musician whose natural charm influences the hearts and minds of others.",
    boosts: { CHA: 3 }, pool: { body: 0, mind: 10 },
    skills: ["Music","Persuasion","Performance"], combat: ["Finesse Weapons","Sonikinesis"], freeTech: "Resonant Pulse",
    equipment: {
      fixed: [ { name: "Fine Clothes", category: "Armor", weight: 3, qty: 1, dsBonus: 1, equipped: true } ],
      choices: [
        { label: "Finesse weapon", options: [
          { label: "Rapier (1d8)", items: [{ name: "Rapier", category: "Weapon", weight: 2, qty: 1, weaponType: "Finesse Weapons", damage: "1d8", equipped: true, proficient: true }] },
          { label: "Whip (1d6, reach)", items: [{ name: "Whip", category: "Weapon", weight: 2, qty: 1, weaponType: "Finesse Weapons", damage: "1d6", equipped: true, proficient: true }] },
          { label: "Chakram (1d6, thrown)", items: [{ name: "Chakram", category: "Weapon", weight: 2, qty: 1, weaponType: "Finesse Weapons", damage: "1d6", equipped: true, proficient: true }] },
        ] },
        { label: "Instrument", options: [
          { label: "Lute", items: [{ name: "Lute", category: "Tool", weight: 4, qty: 1 }] },
          { label: "Flute", items: [{ name: "Flute", category: "Tool", weight: 1, qty: 1 }] },
          { label: "War Drum", items: [{ name: "War Drum", category: "Tool", weight: 5, qty: 1 }] },
        ] },
      ],
    } },
  { name: "Soldier", blurb: "Served in an advanced military or mercenary group; training hardened them for danger.",
    boosts: { STR: 2, INT: 1 }, pool: { body: 5, mind: 5 },
    skills: ["Laborer's Tools","Intimidation","Medicine"], combat: ["Laser Weapons","Pyrokinesis"], freeTech: "Fire Bolt",
    equipment: {
      fixed: [
        { name: "Combat Knife", category: "Weapon", weight: 1, qty: 1, weaponType: "Light Weapons", damage: "1d4" },
        { name: "Medkit", category: "Tool", weight: 3, qty: 1 },
      ],
      choices: [
        { label: "Laser weapon", options: [
          { label: "Blaster Rifle (1d10)", items: [{ name: "Blaster Rifle", category: "Weapon", weight: 8, qty: 1, weaponType: "Laser Weapons", damage: "1d10", equipped: true, proficient: true }] },
          { label: "Blaster Pistol (1d8, light)", items: [{ name: "Blaster Pistol", category: "Weapon", weight: 3, qty: 1, weaponType: "Laser Weapons", damage: "1d8", equipped: true, proficient: true }] },
          { label: "Laser Sword (1d10, melee)", items: [{ name: "Laser Sword", category: "Weapon", weight: 3, qty: 1, weaponType: "Laser Weapons", damage: "1d10", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Kevlar Vest (+3 DS)", items: [{ name: "Kevlar Vest", category: "Armor", weight: 12, qty: 1, dsBonus: 3, equipped: true }] },
          { label: "Combat Fatigues (+1 DS, light)", items: [{ name: "Combat Fatigues", category: "Armor", weight: 4, qty: 1, dsBonus: 1, equipped: true }] },
        ] },
      ],
    } },
  { name: "Monk", blurb: "A loner and martial artist; disciplined body and sharpened senses harness the very air.",
    boosts: { AGI: 2, WIS: 1 }, pool: { body: 5, mind: 5 },
    skills: ["Acrobatics","Reflex","Awareness"], combat: ["Channel Weapons","Aerokinesis"], freeTech: "Gust",
    equipment: {
      fixed: [
        { name: "Monk's Wraps", category: "Armor", weight: 2, qty: 1, dsBonus: 1, equipped: true },
        { name: "Trail Rations", category: "Consumable", weight: 2, qty: 2 },
      ],
      choices: [
        { label: "Channel weapon", options: [
          { label: "Bo Staff (1d6)", items: [{ name: "Bo Staff", category: "Weapon", weight: 4, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
          { label: "Quarterstaff (1d6)", items: [{ name: "Quarterstaff", category: "Weapon", weight: 4, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
          { label: "Warding Wand (1d6, ranged)", items: [{ name: "Warding Wand", category: "Weapon", weight: 1, qty: 1, weaponType: "Channel Weapons", damage: "1d6", equipped: true, proficient: true }] },
        ] },
        { label: "Focus", options: [
          { label: "Prayer Beads", items: [{ name: "Prayer Beads", category: "Misc", weight: 1, qty: 1 }] },
          { label: "Incense Kit", items: [{ name: "Incense Kit", category: "Tool", weight: 2, qty: 1 }] },
          { label: "Meditation Stone", items: [{ name: "Meditation Stone", category: "Misc", weight: 1, qty: 1 }] },
        ] },
      ],
    } },
  { name: "Guru", blurb: "A spiritual leader whose charm, kindness, and vitality drew others to follow.",
    boosts: { CON: 2, CHA: 1 }, pool: { body: 5, mind: 5 },
    skills: ["Concentration","Adrenaline","Etiquette"], combat: ["Volatile Weapons","Spirikinesis"], freeTech: "Phantom Presence",
    equipment: {
      fixed: [
        { name: "Walking Cane", category: "Weapon", weight: 3, qty: 1, weaponType: "Light Weapons", damage: "1d6" },
        { name: "Holy Charm", category: "Misc", weight: 1, qty: 1 },
      ],
      choices: [
        { label: "Volatile weapon", options: [
          { label: "Acid Sprayer (1d8)", items: [{ name: "Acid Sprayer", category: "Weapon", weight: 8, qty: 1, weaponType: "Volatile Weapons", damage: "1d8", equipped: true, proficient: true }] },
          { label: "Flamethrower (2d6)", items: [{ name: "Flamethrower", category: "Weapon", weight: 12, qty: 1, weaponType: "Volatile Weapons", damage: "2d6", equipped: true, proficient: true }] },
          { label: "Rocket Launcher (3d6)", items: [{ name: "Rocket Launcher", category: "Weapon", weight: 15, qty: 1, weaponType: "Volatile Weapons", damage: "3d6", equipped: true, proficient: true }] },
        ] },
        { label: "Armor", options: [
          { label: "Fine Robes (+1 DS)", items: [{ name: "Fine Robes", category: "Armor", weight: 3, qty: 1, dsBonus: 1, equipped: true }] },
          { label: "Ceremonial Vestments (+2 DS)", items: [{ name: "Ceremonial Vestments", category: "Armor", weight: 6, qty: 1, dsBonus: 2, equipped: true }] },
        ] },
      ],
    } },
];

/* --- Kinetic Techniques (partial draft: Robukinesis Beginner) ------------ */
/* Only techniques with defined mechanics are pickable; the library grows over time. */
/* Beginner tier for all 18 Kinetics (5 each). Higher tiers load with the level-up system.
   Structured fields drive the play sheet: damage / heal{target} / grantKP / buff / augment / sustained+upkeep / aoe. */
PC.TECHNIQUES = [
  // ===== STR · Core =====
  // Robukinesis (Tank)
  { name: "Ki Strike", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 2, action: "Action", desc: "Charge a melee strike with kinetic energy.", effect: "On a successful melee attack, add 1d4 + STR force damage to that hit.", augment: { kind: "melee-damage" }, damage: { dice: "1d4", mod: "STR", type: "force" } },
  { name: "Ki Bolt", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "Hurl a bolt of kinetic energy.", effect: "Range 30 ft; 1d6 + STR force damage.", damage: { dice: "1d6", mod: "STR", type: "force", range: "30 ft" } },
  { name: "Ki Shield", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 2, upkeep: 1, action: "Bonus Action", desc: "A shield of kinetic energy.", effect: "Add your STR mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "STR" } },
  { name: "Focus Ki", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 2, action: "Full Turn", desc: "Focus Ki to heal small wounds.", effect: "Heal yourself 1d4 + STR HP.", heal: { dice: "1d4", mod: "STR", target: "self" } },
  { name: "Ki Flame", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 6, upkeep: 3, action: "Bonus Action", desc: "A flaming aura enhancing the body (overdrive base).", effect: "+2 STR, AGI, CON while active (may exceed 30).", sustained: true, buff: { attrFlat: { STR: 2, AGI: 2, CON: 2 } } },
  // Pyrokinesis (Controller)
  { name: "Fire Bolt", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of fire.", effect: "Range 30 ft; 1d6 + STR fire damage.", damage: { dice: "1d6", mod: "STR", type: "fire", range: "30 ft" } },
  { name: "Ember", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 4, action: "Action", desc: "A searing ember that catches fire.", effect: "Range 20 ft; 1d4 + STR fire; on a hit the target gains Burning (1d4/turn).", damage: { dice: "1d4", mod: "STR", type: "fire", range: "20 ft" } },
  { name: "Heat Haze", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 2, upkeep: 1, action: "Bonus Action", desc: "A shimmering aura of heat.", effect: "Creatures starting their turn within 5 ft take 1d4 fire.", sustained: true },
  { name: "Scorch", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 5, action: "Action", desc: "Sear a foe, spoiling its aim.", effect: "Range 40 ft; 1d6 + STR fire; on a hit the target's next attack has disadvantage.", damage: { dice: "1d6", mod: "STR", type: "fire", range: "40 ft" } },
  { name: "Conflagration", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 8, upkeep: 4, action: "Action", desc: "A spreading fire zone (signature base).", effect: "10-ft fire zone within 30 ft; creatures inside take 1d6 fire and gain Burning each turn.", sustained: true },
  // Electrokinesis (Healer)
  { name: "Spark", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A jolt of lightning.", effect: "Range 30 ft; 1d6 + STR lightning damage.", damage: { dice: "1d6", mod: "STR", type: "lightning", range: "30 ft" } },
  { name: "Mend Current", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A restorative current.", effect: "Heal an ally 1d6 + STR HP.", heal: { dice: "1d6", mod: "STR" } },
  { name: "Static Jolt", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 4, action: "Action", desc: "A disorienting shock.", effect: "Range 30 ft; 1d4 + STR lightning; on a hit the target is Shocked.", damage: { dice: "1d4", mod: "STR", type: "lightning", range: "30 ft" } },
  { name: "Charge", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "Transfer kinetic energy to an ally.", effect: "Grant an ally within reach 1d6 + STR KP.", grantKP: { dice: "1d6", mod: "STR" } },
  { name: "Defibrillate", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 5, action: "Action", desc: "Jump-start the heart (signature base).", effect: "Heal an ally 1d8 + STR; if they are at 0 HP, they revive at that much HP.", heal: { dice: "1d8", mod: "STR" } },

  // ===== AGI · Sacral =====
  // Aerokinesis (Tank)
  { name: "Gust", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A blast of wind.", effect: "Range 30 ft; 1d6 + AGI wind; push the target 5 ft.", damage: { dice: "1d6", mod: "AGI", type: "wind", range: "30 ft" } },
  { name: "Windguard", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 2, upkeep: 1, action: "Bonus Action", desc: "Deflecting winds.", effect: "Add your AGI mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Zephyr Step", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 2, action: "Bonus Action", desc: "Ride the wind.", effect: "+15 ft movement this turn; you don't provoke opportunity attacks." },
  { name: "Deflect", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 3, action: "Reaction", desc: "Turn a blow aside with wind.", effect: "Reduce the damage of one hit against you by 1d6 + AGI." },
  { name: "Tempest", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A whirlwind shroud (signature base).", effect: "5-ft whirlwind: enemies starting adjacent take 1d6 wind and are pushed 5 ft; +AGI to Defense Score.", sustained: true, buff: { dsFromMod: "AGI" } },
  // Umbrakinesis (Controller)
  { name: "Shadow Bolt", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of darkness.", effect: "Range 30 ft; 1d6 + AGI shadow damage.", damage: { dice: "1d6", mod: "AGI", type: "shadow", range: "30 ft" } },
  { name: "Shroud of Shadows", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Wrap yourself in shadow.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Dark Bind", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "Shadows grip a foe.", effect: "Range 20 ft; the target is Rooted." },
  { name: "Umbral Dagger", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A blade of shadow.", effect: "Melee; 1d8 + AGI shadow; +1d6 if the target can't see you.", damage: { dice: "1d8", mod: "AGI", type: "shadow" } },
  { name: "Nightfall", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "Spreading darkness (signature base).", effect: "10-ft zone of darkness within 30 ft; enemies inside are Blinded; allies see through it.", sustained: true },
  // Hydrokinesis (Healer)
  { name: "Water Jet", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A pressurized jet of water.", effect: "Range 30 ft; 1d6 + AGI water; push the target 5 ft.", damage: { dice: "1d6", mod: "AGI", type: "water", range: "30 ft" } },
  { name: "Soothing Flow", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 3, action: "Action", desc: "A gentle healing current.", effect: "Heal an ally 1d6 + AGI HP.", heal: { dice: "1d6", mod: "AGI" } },
  { name: "Cleansing Water", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "Purifying waters.", effect: "End one condition on an ally and heal 1d4 + AGI HP.", heal: { dice: "1d4", mod: "AGI" } },
  { name: "Water Veil", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "A flowing water shield.", effect: "Add your AGI mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Tide", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 5, action: "Action", desc: "A wave that heals and pushes (signature base).", effect: "15-ft line wave: heal allies it crosses 1d6 + AGI; push enemies 10 ft.", heal: { dice: "1d6", mod: "AGI" } },

  // ===== CON · Root =====
  // Terrakinesis (Tank)
  { name: "Rock Throw", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "Hurl a stone.", effect: "Range 30 ft; 1d6 + CON earth damage.", damage: { dice: "1d6", mod: "CON", type: "earth", range: "30 ft" } },
  { name: "Mud Skin", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Hardened, earthen skin.", effect: "Add your CON mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Tremor", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 4, action: "Action", desc: "Shake the ground.", effect: "10-ft area; enemies are knocked prone." },
  { name: "Earthen Grip", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 4, action: "Action", desc: "Stone hands grab a foe.", effect: "Range 20 ft; the target is Rooted." },
  { name: "Stoneform", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Encase yourself in stone (signature base).", effect: "Reduce incoming damage by CON mod and +CON to Defense Score; movement −10 ft.", sustained: true, buff: { dsFromMod: "CON" } },
  // Cryokinesis (Controller)
  { name: "Frost Bolt", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of cold.", effect: "Range 30 ft; 1d6 + CON cold damage.", damage: { dice: "1d6", mod: "CON", type: "cold", range: "30 ft" } },
  { name: "Chill", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 4, action: "Action", desc: "Numbing cold.", effect: "Range 30 ft; 1d4 + CON cold; the target is Slowed.", damage: { dice: "1d4", mod: "CON", type: "cold", range: "30 ft" } },
  { name: "Ice Armor", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Armor of ice.", effect: "+CON to Defense Score; melee attackers take 1d4 cold.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Frost Bind", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 4, action: "Action", desc: "Lock a foe in ice.", effect: "Range 20 ft; the target is Rooted." },
  { name: "Absolute Zero", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 5, action: "Action", desc: "Freeze a target solid (signature base).", effect: "The target is Frozen until the end of its next turn." },
  // Vitakinesis (Healer)
  { name: "Life Touch", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "A touch of vitality.", effect: "Heal an ally 1d6 + CON HP.", heal: { dice: "1d6", mod: "CON" } },
  { name: "Regenerate", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 4, action: "Action", desc: "Grant regeneration.", effect: "An ally heals 1d4 + CON at the start of its turn for 3 turns." },
  { name: "Vitality", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "A renewing ward.", effect: "An ally gains +CON temporary HP each turn while active.", sustained: true },
  { name: "Purge Toxin", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "Cleanse the body.", effect: "End one condition (poison, disease, etc.) on an ally." },
  { name: "Renewal", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 5, action: "Action", desc: "Overflowing life (signature base).", effect: "Heal an ally 1d8 + CON and grant regeneration 1d4/turn for 2 turns.", heal: { dice: "1d8", mod: "CON" } },

  // ===== INT · Crown =====
  // Gravikinesis (Tank)
  { name: "Gravity Bolt", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of crushing force.", effect: "Range 30 ft; 1d6 + INT force damage.", damage: { dice: "1d6", mod: "INT", type: "force", range: "30 ft" } },
  { name: "Weigh Down", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Action", desc: "Crushing weight.", effect: "Range 20 ft; the target is Slowed." },
  { name: "Density Shift", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Increase your mass.", effect: "+INT to Defense Score; immune to being pushed while active.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Pull", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Action", desc: "A gravitational tug.", effect: "Pull a creature 15 ft toward you." },
  { name: "Gravity Well", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A field of attraction (signature base).", effect: "10-ft well: enemies entering are pulled to you and Slowed; +INT to Defense Score; your movement −10 ft.", sustained: true, buff: { dsFromMod: "INT" } },
  // Chronokinesis (Controller)
  { name: "Time Bolt", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "An accelerated particle.", effect: "Range 30 ft; 1d6 + INT temporal damage.", damage: { dice: "1d6", mod: "INT", type: "temporal", range: "30 ft" } },
  { name: "Haste", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "Speed an ally.", effect: "An ally gains +10 ft movement and one extra Bonus Action this turn." },
  { name: "Rewind", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Reaction", desc: "Undo a moment of harm.", effect: "When an ally is hit, reduce that damage by 1d8 + INT." },
  { name: "Foresight", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "See moments ahead.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Slow Time", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 5, action: "Action", desc: "Bend time against a foe (signature base).", effect: "A target (or 10-ft area) is Slowed." },
  // Biokinesis (Healer)
  { name: "Mend Tissue", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "Knit flesh together.", effect: "Heal an ally 1d6 + INT HP.", heal: { dice: "1d6", mod: "INT" } },
  { name: "Toxin", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Action", desc: "Inject a biological toxin.", effect: "Range 30 ft; 1d4 + INT poison; the target is Weakened.", damage: { dice: "1d4", mod: "INT", type: "poison", range: "30 ft" } },
  { name: "Adrenal Boost", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "Flood an ally with adrenaline.", effect: "An ally gains +INT to their next attack and +10 ft movement." },
  { name: "Numb", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "Deaden pain.", effect: "An ally ignores the effects of one condition until your next turn and gains 1d4 temp HP." },
  { name: "Regenesis", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 5, action: "Action", desc: "Rewrite biology to heal (signature base).", effect: "Heal an ally 1d8 + INT and end one condition.", heal: { dice: "1d8", mod: "INT" } },

  // ===== WIS · Third Eye =====
  // Demokinesis (Tank)
  { name: "Dark Claw", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Rend with demonic claws.", effect: "Melee; 1d8 + WIS necrotic damage.", damage: { dice: "1d8", mod: "WIS", type: "necrotic" } },
  { name: "Dread", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Project demonic dread.", effect: "Range 30 ft; the target is Feared." },
  { name: "Demon Skin", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "A hellish hide.", effect: "+WIS to Defense Score; melee attackers take 1d4 necrotic.", sustained: true, buff: { dsFromMod: "WIS" } },
  { name: "Blood Pact", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Bonus Action", desc: "Fuel power with blood.", effect: "Spend 1d6 HP to gain that much temporary KP." },
  { name: "Demon Form", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Partial demonic transformation (signature base).", effect: "+2 STR & WIS, +WIS to Defense Score, claws (1d8) while active.", sustained: true, buff: { attrFlat: { STR: 2, WIS: 2 }, dsFromMod: "WIS" } },
  // Naturakinesis (Controller)
  { name: "Thorn Bolt", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Action", desc: "Fire a thorn.", effect: "Range 30 ft; 1d6 + WIS piercing damage.", damage: { dice: "1d6", mod: "WIS", type: "piercing", range: "30 ft" } },
  { name: "Thistle Bush", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Grow a thornbush.", effect: "5-ft thornbush: difficult terrain; creatures moving through take 1d6." },
  { name: "Entangle", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Vines seize a foe.", effect: "Range 20 ft; the target is Rooted." },
  { name: "Barkskin", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Bark-hard skin.", effect: "Add your WIS mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "WIS" } },
  { name: "Bloom", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "A growing garden (signature base).", effect: "10-ft garden within 30 ft: enemies Rooted + 1d6/turn thorns; allies heal 1d4/turn.", sustained: true },
  // Holykinesis (Healer)
  { name: "Smite", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Call down radiant judgment.", effect: "Range 30 ft; 1d8 + WIS radiant (double vs. undead/evil).", damage: { dice: "1d8", mod: "WIS", type: "radiant", range: "30 ft" } },
  { name: "Bless", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Action", desc: "Bestow a blessing.", effect: "An ally gains +1d4 to attacks and checks for 3 turns." },
  { name: "Healing Light", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Action", desc: "Radiant healing.", effect: "Heal an ally 1d6 + WIS HP.", heal: { dice: "1d6", mod: "WIS" } },
  { name: "Sanctify", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Bless with holy protection.", effect: "End one condition on an ally; they gain 1d4 temp HP." },
  { name: "Sanctuary", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Consecrated ground (signature base).", effect: "10-ft zone: allies heal 1d4 + WIS/turn; enemies take 1d6 radiant/turn.", sustained: true },

  // ===== CHA · Throat =====
  // Sonikinesis (Tank)
  { name: "Sound Burst", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "A burst of sound.", effect: "Range 30 ft; 1d6 + CHA thunder damage.", damage: { dice: "1d6", mod: "CHA", type: "thunder", range: "30 ft" } },
  { name: "Resonant Pulse", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Action", desc: "A disorienting pulse.", effect: "10-ft area; enemies are Shocked (disoriented)." },
  { name: "Sound Barrier", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "A vibrational shield.", effect: "Add your CHA mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "CHA" } },
  { name: "War Cry", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "A rallying shout.", effect: "Allies within 15 ft gain +1d4 to their attacks this turn." },
  { name: "Crescendo", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A building resonance (signature base).", effect: "10-ft resonance: +1d4 more thunder each turn to adjacent enemies (starts 1d4); +CHA to Defense Score.", sustained: true, buff: { dsFromMod: "CHA" } },
  // Lumokinesis (Controller)
  { name: "Light Bolt", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of light.", effect: "Range 30 ft; 1d6 + CHA radiant damage.", damage: { dice: "1d6", mod: "CHA", type: "radiant", range: "30 ft" } },
  { name: "Flash", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Action", desc: "A blinding flash.", effect: "10-ft area; enemies are Blinded." },
  { name: "Mirror Image", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Illusory duplicates.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Dazzle", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Action", desc: "Dazzling light.", effect: "Range 30 ft; 1d4 + CHA radiant; the target's next attack has disadvantage.", damage: { dice: "1d4", mod: "CHA", type: "radiant", range: "30 ft" } },
  { name: "Radiance", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "Blinding light zone (signature base).", effect: "10-ft zone of light within 30 ft: enemies Blinded + 1d6/turn radiant.", sustained: true },
  // Spirikinesis (Healer)
  { name: "Spirit Bolt", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "A spectral bolt.", effect: "Range 30 ft; 1d6 + CHA spectral damage.", damage: { dice: "1d6", mod: "CHA", type: "spectral", range: "30 ft" } },
  { name: "Phantom Presence", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Shrouding spirits.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Soothe Spirit", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "Calm a wounded spirit.", effect: "Heal an ally 1d6 + CHA HP.", heal: { dice: "1d6", mod: "CHA" } },
  { name: "Spirit Guard", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "Summon a guardian spirit.", effect: "A spirit takes the next hit meant for an ally." },
  { name: "Soul Tether", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 5, action: "Action", desc: "Anchor an ally's soul (signature base).", effect: "The next time the ally would drop to 0 HP, they instead stay at 1 HP." },

  /* ===================== HIGHER TIERS (Adept / Expert / Master) ===================== */
  // ---- STR · Core ----
  // Robukinesis (Tank)
  { name: "Ki Blast", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 5, action: "Action", desc: "A larger bolt of kinetic force.", effect: "Range 50 ft; 1d8 + STR force damage.", damage: { dice: "1d8", mod: "STR", type: "force", range: "50 ft" } },
  { name: "Kinetic Grip", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 5, action: "Action", desc: "Kinetic force pins a foe.", effect: "Range 30 ft; the target is Rooted." },
  { name: "Iron Body", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Harden your body with Ki.", effect: "Reduce all incoming damage by your STR mod (min 1) while active.", sustained: true },
  { name: "Share Ki", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 3, action: "Reaction", desc: "Gift kinetic energy to an ally.", effect: "Grant an ally within melee range 1d6 + STR KP.", grantKP: { dice: "1d6", mod: "STR" } },
  { name: "Ki Flame ×2", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Overdrive ×2 — the aura burns hotter.", effect: "+4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost).", sustained: true, buff: { attrFlat: { STR: 4, AGI: 4, CON: 4 } } },
  { name: "Ki Volley", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 11, action: "Action", desc: "A volley of kinetic blasts.", effect: "50-ft cone; auto-hits each target for 2d6 + STR force.", aoe: true, damage: { dice: "2d6", mod: "STR", type: "force", area: "50-ft cone" } },
  { name: "Titan's Blow", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 11, action: "Action", desc: "A devastating kinetic strike.", effect: "Melee; 3d6 + STR force and push the target 10 ft.", damage: { dice: "3d6", mod: "STR", type: "force" } },
  { name: "Second Wind", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 9, action: "Full Turn", desc: "Draw on inner reserves.", effect: "Heal yourself 2d6 + STR HP and end one condition on yourself.", heal: { dice: "2d6", mod: "STR", target: "self" } },
  { name: "Bastion Aura", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A protective kinetic field.", effect: "You and allies within 15 ft gain +STR mod to Defense Score while active.", sustained: true },
  { name: "Ki Flame ×5", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Overdrive ×5 — dangerous power.", effect: "+8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation.", sustained: true, buff: { attrFlat: { STR: 8, AGI: 8, CON: 8 } } },
  { name: "Ki Nova", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 21, action: "Action", desc: "A kinetic explosion.", effect: "30-ft radius; auto-hits each target for 4d6 + STR force.", aoe: true, damage: { dice: "4d6", mod: "STR", type: "force", area: "30-ft radius" } },
  { name: "Titan Strike", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 20, action: "Action", desc: "An earth-shaking blow.", effect: "Melee; 5d6 + STR force, push 20 ft, and the target is Weakened.", damage: { dice: "5d6", mod: "STR", type: "force" } },
  { name: "Kinetic Ascension", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 17, action: "Full Turn", desc: "A surge of restorative Ki.", effect: "Heal yourself 4d6 + STR HP and remove all conditions on yourself.", heal: { dice: "4d6", mod: "STR", target: "self" } },
  { name: "Unbreakable", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 16, action: "Reaction", desc: "Refuse to fall.", effect: "When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest." },
  { name: "Ki Flame ×10", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 27, action: "Bonus Action", desc: "Overdrive ×10 — the burnout.", effect: "+15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest).", sustained: true, buff: { attrFlat: { STR: 15, AGI: 15, CON: 15 } } },
  // Pyrokinesis (Controller)
  { name: "Flame Lash", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 6, action: "Action", desc: "A whip of fire.", effect: "Reach 15 ft; 1d10 + STR fire and pull the target 10 ft.", damage: { dice: "1d10", mod: "STR", type: "fire", range: "15 ft" } },
  { name: "Pyre", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 9, action: "Action", desc: "A bursting flame.", effect: "Range 50 ft; 2d6 + STR fire; if this drops the target to 0 HP it explodes for 1d6 fire to creatures within 10 ft.", damage: { dice: "2d6", mod: "STR", type: "fire", range: "50 ft" } },
  { name: "Blazing Speed", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Move on trails of fire.", effect: "Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active.", sustained: true },
  { name: "Fireball", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 14, action: "Action", desc: "The classic burst of flame.", effect: "15-ft radius within 60 ft; auto-hits for 2d6 + STR fire; targets gain Burning.", aoe: true, damage: { dice: "2d6", mod: "STR", type: "fire", area: "15-ft radius" } },
  { name: "Conflagration ×2", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 14, upkeep: 7, action: "Action", desc: "Signature — the fire grows.", effect: "15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn.", sustained: true },
  { name: "Combust", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 14, action: "Action", desc: "Detonate a burning target.", effect: "A target that is Burning takes 4d6 + STR fire immediately; ends its Burning.", aoe: true, damage: { dice: "4d6", mod: "STR", type: "fire" } },
  { name: "Cinder Cloud", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 8, upkeep: 4, action: "Bonus Action", desc: "A choking cloud of embers.", effect: "15-ft smoke cloud: creatures inside are Blinded and take 1d6 fire/turn while active.", sustained: true },
  { name: "Firestorm Wall", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wall of flame.", effect: "30-ft line of fire; crossing it deals 2d6 fire + Burning; blocks line of sight while active.", sustained: true },
  { name: "Meteor", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 24, action: "Action", desc: "Call down a meteor.", effect: "20-ft radius within 90 ft; auto-hits for 4d6 + STR fire; leaves burning ground (1d6/turn) for 3 turns.", aoe: true, damage: { dice: "4d6", mod: "STR", type: "fire", area: "20-ft radius" } },
  { name: "Conflagration ×5", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — uncontrolled fire.", effect: "20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside.", sustained: true },
  { name: "Immolating Curse", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 13, action: "Action", desc: "An unquenchable curse of fire.", effect: "Target gains Burning (2d6/turn) that only rest removes; each tick it spreads to a new creature within 10 ft." },
  { name: "Phoenix Form", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 20, upkeep: 10, action: "Bonus Action", desc: "Become living flame.", effect: "Emit a 10-ft fire aura (2d6/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP.", sustained: true },
  { name: "Supernova", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 29, action: "Action", desc: "A cataclysmic blast.", effect: "40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire.", aoe: true, damage: { dice: "6d6", mod: "STR", type: "fire", area: "40-ft radius" } },
  { name: "Hellfire Rain", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 28, action: "Action", desc: "Rain fire across the field.", effect: "Three 15-ft zones within 120 ft; auto-hits for 3d6 + STR fire each + burning ground.", aoe: true, damage: { dice: "3d6", mod: "STR", type: "fire", area: "three 15-ft zones" } },
  { name: "Conflagration ×10", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — fire unleashed.", effect: "40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included.", sustained: true },
  // Electrokinesis (Healer)
  { name: "Chain Lightning", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 8, action: "Action", desc: "Lightning that leaps between foes.", effect: "Range 40 ft; 1d8 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft.", damage: { dice: "1d8", mod: "STR", type: "lightning", range: "40 ft" } },
  { name: "Renew", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 7, action: "Action", desc: "A strong healing current.", effect: "Heal an ally 2d6 + STR HP.", heal: { dice: "2d6", mod: "STR" } },
  { name: "Cleanse Current", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 4, action: "Action", desc: "Purifying current.", effect: "End one condition on an ally and heal 1d4 + STR HP.", heal: { dice: "1d4", mod: "STR" } },
  { name: "Regen Field", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A field of restorative current.", effect: "Allies within 10 ft heal 1d4 + STR at the start of their turn while active.", sustained: true },
  { name: "Defibrillate ×2", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 7, action: "Action", desc: "Signature — surge of life.", effect: "Heal 2d8 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost).", heal: { dice: "2d8", mod: "STR" } },
  { name: "Lightning Storm", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 18, action: "Action", desc: "A storm of lightning.", effect: "20-ft radius within 60 ft; auto-hits for 3d6 + STR lightning; targets Shocked.", aoe: true, damage: { dice: "3d6", mod: "STR", type: "lightning", area: "20-ft radius" } },
  { name: "Mass Mend", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 11, action: "Action", desc: "Heal your allies at once.", effect: "Heal all allies within 20 ft 2d6 + STR HP.", heal: { dice: "2d6", mod: "STR" } },
  { name: "Purge", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 12, action: "Action", desc: "Cleanse and mend.", effect: "End all conditions on an ally and heal 2d6 + STR HP.", heal: { dice: "2d6", mod: "STR" } },
  { name: "Overcharge", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 10, upkeep: 5, action: "Bonus Action", desc: "Electrify an ally's attacks.", effect: "An ally's attacks deal +1d6 lightning and their movement +10 ft while active.", sustained: true },
  { name: "Defibrillate ×5", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 14, action: "Action", desc: "Signature — mass revival.", effect: "Revive up to 2 downed allies to half HP (or heal one 3d8 + STR). Drains your HP and deals 2 hits to your Core chakra.", heal: { dice: "3d8", mod: "STR" } },
  { name: "Thundergod's Wrath", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 32, action: "Action", desc: "Unleash the storm.", effect: "40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked.", aoe: true, damage: { dice: "6d6", mod: "STR", type: "lightning", area: "40-ft radius" } },
  { name: "Full Restoration", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 24, action: "Action", desc: "Restore an ally fully.", effect: "Heal an ally 6d6 + STR HP, remove all conditions, and restore all their KP.", heal: { dice: "6d6", mod: "STR" } },
  { name: "Rebirth Aura", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 24, upkeep: 10, action: "Bonus Action", desc: "A field that denies death.", effect: "While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn.", sustained: true },
  { name: "Living Current", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 18, upkeep: 8, action: "Bonus Action", desc: "Become living energy.", effect: "Immune to physical damage, move through creatures, and heal adjacent allies 2d6/turn while active.", sustained: true },
  { name: "Defibrillate ×10", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — the ultimate sacrifice.", effect: "Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest)." },

  // ---- AGI · Sacral ----
  // Aerokinesis (Tank)
  { name: "Cyclone Slash", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 6, action: "Action", desc: "A slashing gust.", effect: "Melee; 1d10 + AGI wind and push the target 10 ft.", damage: { dice: "1d10", mod: "AGI", type: "wind" } },
  { name: "Updraft", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 5, action: "Action", desc: "A blast of rising air.", effect: "Launch a creature (or yourself) 15 ft upward; it lands prone unless it can fly." },
  { name: "Wind Wall", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A wall of wind.", effect: "20-ft wall of wind blocks ranged attacks and deflects projectiles while active.", sustained: true },
  { name: "Air Dash", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 5, action: "Bonus Action", desc: "Dash on the wind.", effect: "Dash 30 ft in any direction; your next attack this turn has advantage." },
  { name: "Tempest ×2", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — the whirlwind grows.", effect: "10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft.", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Hurricane", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A localized hurricane.", effect: "20-ft radius; auto-hits for 3d6 + AGI wind; all pushed 15 ft and knocked prone.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "wind", area: "20-ft radius" } },
  { name: "Vacuum Pull", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 12, action: "Action", desc: "Pull foes together.", effect: "Pull all creatures within 30 ft toward a point; auto-hits for 2d6 + AGI wind.", aoe: true, damage: { dice: "2d6", mod: "AGI", type: "wind", area: "30 ft" } },
  { name: "Cushioning Vortex", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A sheltering vortex.", effect: "You and allies within 15 ft gain +AGI to Defense Score and take half fall/impact damage while active.", sustained: true },
  { name: "Tornado", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 16, upkeep: 8, action: "Bonus Action", desc: "A mobile tornado.", effect: "A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active.", sustained: true },
  { name: "Tempest ×5", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — a raging storm.", effect: "20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push).", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Maelstrom", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 32, action: "Action", desc: "A colossal storm.", effect: "40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed.", aoe: true, damage: { dice: "6d6", mod: "AGI", type: "wind", area: "40-ft radius" } },
  { name: "Winds of Freedom", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 20, upkeep: 10, action: "Bonus Action", desc: "Unshackling winds.", effect: "You and allies are immune to forced movement, gain +20 ft move and +AGI to DS while active.", sustained: true },
  { name: "Cyclone Guard", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 18, action: "Reaction", desc: "Deflect a blow with wind.", effect: "When an ally within 30 ft is hit, redirect the attack to miss (once)." },
  { name: "Sky Sovereign", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Rule the skies.", effect: "You fly; +AGI to DS; attacks against you have disadvantage while active.", sustained: true },
  { name: "Tempest ×10", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — living cyclone.", effect: "40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active.", sustained: true, buff: { dsFromMod: "AGI" } },
  // Umbrakinesis (Controller)
  { name: "Shadow Step", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 5, action: "Bonus Action", desc: "Step between shadows.", effect: "Teleport between shadows up to 40 ft; your next attack from concealment has advantage." },
  { name: "Terror", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 6, action: "Action", desc: "Instill dread.", effect: "Range 30 ft; the target is Feared." },
  { name: "Umbral Drain", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "Drain vitality through shadow.", effect: "Range 30 ft; 2d6 + AGI shadow; you gain temp HP equal to half the damage.", damage: { dice: "2d6", mod: "AGI", type: "shadow", range: "30 ft" } },
  { name: "Cloak of Night", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Cloak your allies in shadow.", effect: "You and allies within 10 ft are obscured (advantage on Stealth; attacks against you have disadvantage) while active.", sustained: true },
  { name: "Nightfall ×2", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — spreading dark.", effect: "15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn.", sustained: true },
  { name: "Shadow Storm", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A storm of darkness.", effect: "20-ft radius; auto-hits for 3d6 + AGI shadow; targets Blinded.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "shadow", area: "20-ft radius" } },
  { name: "Night Terrors", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 14, action: "Action", desc: "Conjure waking nightmares.", effect: "15-ft radius; all enemies Feared and Shocked." },
  { name: "Living Shadow", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Your shadow fights beside you.", effect: "Your shadow mimics your attacks, dealing half your damage to a second target each turn while active.", sustained: true },
  { name: "Void Grip", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 12, action: "Action", desc: "Bind a foe in void.", effect: "Range 30 ft; the target is Rooted and Silenced." },
  { name: "Nightfall ×5", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — consuming dark.", effect: "20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded.", sustained: true },
  { name: "Eternal Night", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 32, action: "Action", desc: "Bring the endless dark.", effect: "40-ft radius; auto-hits enemies for 6d6 + AGI shadow; Blinded and Feared.", aoe: true, damage: { dice: "6d6", mod: "AGI", type: "shadow", area: "40-ft radius" } },
  { name: "Umbral Form", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become living shadow.", effect: "Immune to physical damage, move through walls, attacks against you have disadvantage while active.", sustained: true },
  { name: "Shadow Assassinate", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 20, action: "Action", desc: "A killing strike from the dark.", effect: "Melee; 5d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice).", damage: { dice: "5d6", mod: "AGI", type: "shadow" } },
  { name: "Devour Light", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 18, action: "Action", desc: "Swallow the light.", effect: "Extinguish all light within 60 ft; enemies Blinded and take 2d6/turn while dark; you and allies gain advantage on attacks there." },
  { name: "Nightfall ×10", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — absolute dark.", effect: "The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared.", sustained: true },
  // Hydrokinesis (Healer)
  { name: "Healing Surge", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "A surge of restorative water.", effect: "Heal an ally 2d6 + AGI HP.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Riptide", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "A dragging current.", effect: "Range 30 ft; 1d10 + AGI water; pull 10 ft and Slowed.", damage: { dice: "1d10", mod: "AGI", type: "water", range: "30 ft" } },
  { name: "Bubble", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 6, action: "Action", desc: "A protective water bubble.", effect: "An ally gains 2d6 + AGI temp HP and can't be Rooted while it lasts." },
  { name: "Flowing Current", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A current that mends and speeds.", effect: "Allies within 10 ft heal 1d4 + AGI/turn and gain +10 ft movement while active.", sustained: true },
  { name: "Tide ×2", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 9, action: "Action", desc: "Signature — a greater wave.", effect: "20-ft wave: heal allies 2d6 + AGI; enemies pushed 15 ft and Slowed.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Tsunami", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A crashing wave.", effect: "30-ft; enemies take 3d6 + AGI water (push 20 ft, prone); allies caught heal 2d6.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "water", area: "30 ft" } },
  { name: "Mass Renewal", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 11, action: "Action", desc: "Heal your allies together.", effect: "Heal all allies within 20 ft 2d6 + AGI HP.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Purifying Rain", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Cleansing rain.", effect: "Allies within 20 ft heal 1d6/turn and end one condition each turn while active.", sustained: true },
  { name: "Whirlpool", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 12, action: "Action", desc: "A dragging whirlpool.", effect: "15-ft; enemies pulled to center, Rooted, and take 2d6 + AGI water.", aoe: true, damage: { dice: "2d6", mod: "AGI", type: "water", area: "15-ft radius" } },
  { name: "Tide ×5", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "Signature — a towering wave.", effect: "30-ft wave: heal allies 3d6 + AGI; enemies 2d6 + pushed + Slowed.", heal: { dice: "3d6", mod: "AGI" } },
  { name: "Great Deluge", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 30, action: "Action", desc: "A drowning flood.", effect: "40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone.", aoe: true, damage: { dice: "6d6", mod: "AGI", type: "water", area: "40-ft radius" } },
  { name: "Tsunami's Mercy", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 22, action: "Action", desc: "The tide spares one.", effect: "Heal an ally to full HP and grant immunity to conditions until your next turn." },
  { name: "Rejuvenation Font", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A spring of life.", effect: "20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active.", sustained: true },
  { name: "Living Water", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 20, upkeep: 10, action: "Bonus Action", desc: "Become water.", effect: "Immune to physical damage, flow anywhere, and heal adjacent allies 2d6/turn while active.", sustained: true },
  { name: "Tide ×10", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — a world-wave.", effect: "Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed)." },

  // ---- CON · Root ----
  // Terrakinesis (Tank)
  { name: "Boulder", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 6, action: "Action", desc: "Hurl a boulder.", effect: "Range 40 ft; 1d10 + CON earth; knock prone.", damage: { dice: "1d10", mod: "CON", type: "earth", range: "40 ft" } },
  { name: "Stone Wall", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Raise a wall of stone.", effect: "20-ft stone wall (full cover; blocks movement & line of sight) while active.", sustained: true },
  { name: "Earthquake", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 10, action: "Action", desc: "Shake the earth.", effect: "15-ft radius; auto-hits for 2d6 + CON earth; prone + difficult terrain.", aoe: true, damage: { dice: "2d6", mod: "CON", type: "earth", area: "15-ft radius" } },
  { name: "Iron Skin", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Skin like iron.", effect: "Immune to being pushed or knocked prone; +CON to Defense Score while active.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Stoneform ×2", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — harder stone.", effect: "Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Fissure", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Split the ground open.", effect: "30-ft line; auto-hits for 3d6 + CON earth; enemies fall prone and are Rooted.", aoe: true, damage: { dice: "3d6", mod: "CON", type: "earth", area: "30-ft line" } },
  { name: "Seismic Slam", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 16, action: "Action", desc: "A ground-shattering slam.", effect: "Melee; 3d6 + CON earth; 10-ft knockback and prone to creatures nearby.", damage: { dice: "3d6", mod: "CON", type: "earth" } },
  { name: "Petrify Grasp", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 14, action: "Action", desc: "Turn a foe to stone.", effect: "Range 30 ft; encase the target in stone — Frozen (petrified)." },
  { name: "Mountain's Aegis", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Shield the line.", effect: "You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active.", sustained: true },
  { name: "Stoneform ×5", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — stone titan.", effect: "DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Continental Crush", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 32, action: "Action", desc: "Crush a wide area.", effect: "40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted.", aoe: true, damage: { dice: "6d6", mod: "CON", type: "earth", area: "40-ft radius" } },
  { name: "Earthen Renewal", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 20, action: "Action", desc: "Draw strength from the earth.", effect: "Heal yourself 4d6 + CON HP and shed all conditions.", heal: { dice: "4d6", mod: "CON", target: "self" } },
  { name: "Tectonic Shield", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 18, action: "Reaction", desc: "Intercept with stone.", effect: "Negate an attack against you or an ally entirely (once)." },
  { name: "Living Mountain", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become a mountain.", effect: "Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active.", sustained: true },
  { name: "Stoneform ×10", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — the unmovable.", effect: "DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes.", sustained: true, buff: { dsFromMod: "CON" } },
  // Cryokinesis (Controller)
  { name: "Ice Lance", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 5, action: "Action", desc: "A lance of ice.", effect: "Range 50 ft; 1d10 + CON cold damage.", damage: { dice: "1d10", mod: "CON", type: "cold", range: "50 ft" } },
  { name: "Frost Nova", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 10, action: "Action", desc: "A burst of cold.", effect: "10-ft radius; auto-hits for 2d6 + CON cold.", aoe: true, damage: { dice: "2d6", mod: "CON", type: "cold", area: "10-ft radius" } },
  { name: "Ice Wall", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Raise a wall of ice.", effect: "20-ft ice wall (cover; can be shattered) while active.", sustained: true },
  { name: "Rime", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 6, action: "Action", desc: "Coat the ground in ice.", effect: "A 15-ft area becomes ice — difficult terrain; creatures there are Slowed." },
  { name: "Absolute Zero ×2", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper freeze.", effect: "Target is Frozen; if already Slowed/Frozen, 2d6 shatter damage. Self-cost: you are Slowed next turn." },
  { name: "Blizzard", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "A raging blizzard.", effect: "20-ft radius; auto-hits for 3d6 + CON cold; targets Slowed.", aoe: true, damage: { dice: "3d6", mod: "CON", type: "cold", area: "20-ft radius" } },
  { name: "Flash Freeze", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 14, action: "Action", desc: "Freeze a foe instantly.", effect: "Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6." },
  { name: "Cold Snap", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 12, action: "Action", desc: "A numbing snap of cold.", effect: "15-ft radius; all enemies Slowed and Shocked." },
  { name: "Glacier", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 16, upkeep: 8, action: "Bonus Action", desc: "An advancing glacier.", effect: "A mobile glacier; creatures in its path are Slowed and take 2d6 cold while active.", sustained: true },
  { name: "Absolute Zero ×5", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Signature — mass freeze.", effect: "Freeze all enemies in a 15-ft area (Frozen). Self-cost: you are Slowed while any remain frozen." },
  { name: "Ice Age", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 32, action: "Action", desc: "Bring an age of ice.", effect: "40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen.", aoe: true, damage: { dice: "6d6", mod: "CON", type: "cold", area: "40-ft radius" } },
  { name: "Absolute Stasis", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 22, action: "Action", desc: "Perfect preservation.", effect: "Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe)." },
  { name: "Permafrost Field", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A field of eternal cold.", effect: "30-ft zone; enemies Slowed and take 3d6/turn; allies immune to the cold while active.", sustained: true },
  { name: "Frozen Heart", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 18, upkeep: 8, action: "Bonus Action", desc: "A heart of ice.", effect: "Immune to cold, +CON to DS; melee attackers are Frozen on hit while active.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Absolute Zero ×10", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — flash-freeze the field.", effect: "All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn." },
  // Vitakinesis (Healer)
  { name: "Greater Heal", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 7, action: "Action", desc: "A strong heal.", effect: "Heal an ally 2d6 + CON HP.", heal: { dice: "2d6", mod: "CON" } },
  { name: "Second Life", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 8, action: "Action", desc: "Pull an ally back.", effect: "Revive a downed ally to half HP." },
  { name: "Bolster", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 6, action: "Action", desc: "Bolster vitality.", effect: "An ally's max HP increases by 2d6 + CON until their next rest." },
  { name: "Nature's Boon", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A boon of vitality.", effect: "Allies within 10 ft heal 1d4 + CON/turn while active.", sustained: true },
  { name: "Renewal ×2", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 9, action: "Action", desc: "Signature — greater renewal.", effect: "Heal 2d8 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed.", heal: { dice: "2d8", mod: "CON" } },
  { name: "Mass Heal", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 12, action: "Action", desc: "Heal your allies together.", effect: "Heal all allies within 20 ft 2d6 + CON HP.", heal: { dice: "2d6", mod: "CON" } },
  { name: "Rebirth", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 16, action: "Action", desc: "Raise the fallen.", effect: "Revive a dead ally to half HP and remove all conditions." },
  { name: "Overgrowth", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 12, action: "Action", desc: "Burgeoning life.", effect: "All allies within 20 ft gain 2d6 + CON temp HP and regeneration." },
  { name: "Wellspring of Life", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wellspring.", effect: "20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside.", sustained: true },
  { name: "Renewal ×5", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Signature — renewal for all.", effect: "Heal all allies within 20 ft 3d6 + CON + regeneration; revive any downed among them.", heal: { dice: "3d6", mod: "CON" } },
  { name: "Mass Resurrection", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 30, action: "Action", desc: "Raise the fallen en masse.", effect: "Revive all downed or dead allies within 30 ft to half HP and cleanse them." },
  { name: "Genesis", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 26, action: "Action", desc: "Perfect an ally's life.", effect: "Heal an ally to full, double their max HP (temp), and grant regeneration." },
  { name: "Renew the Flesh", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 20, action: "Action", desc: "Regrow instantly.", effect: "Heal 6d6 + CON and remove all conditions on an ally.", heal: { dice: "6d6", mod: "CON" } },
  { name: "Eternal Vigor", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Undying vigor.", effect: "Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active.", sustained: true },
  { name: "Renewal ×10", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — life renewed.", effect: "Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight." },

  // ---- INT · Crown ----
  // Gravikinesis (Tank)
  { name: "Crush", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Increase a target's gravity.", effect: "Range 30 ft; 2d6 + INT force damage.", damage: { dice: "2d6", mod: "INT", type: "force", range: "30 ft" } },
  { name: "Gravity Slam", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 6, action: "Action", desc: "Slam a target down.", effect: "Slam an airborne/pulled target down: 1d10 + INT force and prone.", damage: { dice: "1d10", mod: "INT", type: "force" } },
  { name: "Heavy Field", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A field of heavy gravity.", effect: "15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active.", sustained: true },
  { name: "Anchor", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Anchor yourself and tether foes.", effect: "You can't be moved, +INT to DS; enemies within 10 ft can't move away while active.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Gravity Well ×2", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — a deeper well.", effect: "15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Graviton Burst", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "A burst of crushing force.", effect: "20-ft radius; auto-hits for 3d6 + INT force; pull to center + prone.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "force", area: "20-ft radius" } },
  { name: "Crushing Grasp", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Crush a foe in place.", effect: "Range 30 ft; target Rooted and takes 2d6/turn." },
  { name: "Reverse Gravity", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Flip gravity upward.", effect: "20-ft area; enemies fall upward then crash down — prone + 2d6 + INT.", aoe: true, damage: { dice: "2d6", mod: "INT", type: "force", area: "20-ft radius" } },
  { name: "Event Horizon", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 16, upkeep: 8, action: "Bonus Action", desc: "An inescapable pull.", effect: "20-ft well; enemies pulled to center each turn, Rooted, take 2d6/turn while active.", sustained: true },
  { name: "Gravity Well ×5", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — a straining well.", effect: "20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Singularity", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 32, action: "Action", desc: "Collapse space to a point.", effect: "40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted.", aoe: true, damage: { dice: "6d6", mod: "INT", type: "force", area: "40-ft radius" } },
  { name: "Massive", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become immensely dense.", effect: "DR = INT mod, immune to conditions & forced movement; movement 0 while active.", sustained: true },
  { name: "Gravity Prison", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 20, action: "Action", desc: "Pin a foe in crushing gravity.", effect: "A target is crushed into stasis: Frozen (pinned) + 3d6/turn." },
  { name: "Collapse", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 24, action: "Action", desc: "Collapse gravity at a point.", effect: "30-ft radius; auto-hits for 5d6 + INT force; prone and Slowed.", aoe: true, damage: { dice: "5d6", mod: "INT", type: "force", area: "30-ft radius" } },
  { name: "Gravity Well ×10", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — a black hole.", effect: "40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move.", sustained: true, buff: { dsFromMod: "INT" } },
  // Chronokinesis (Controller)
  { name: "Accelerate", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 8, action: "Bonus Action", desc: "Speed an ally through time.", effect: "An ally takes one extra action this turn." },
  { name: "Temporal Lock", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 6, action: "Action", desc: "Lock a foe in a time-loop.", effect: "Range 30 ft; target Rooted and loses reactions." },
  { name: "Stutter", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Make time stutter.", effect: "15-ft radius; enemies Slowed." },
  { name: "Time Echo", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Echo a moment.", effect: "Repeat your last technique this fight at half effect." },
  { name: "Slow Time ×2", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper slow.", effect: "15-ft area Slowed + enemies lose reactions. Self-cost: you are Slowed next turn." },
  { name: "Time Skip", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Skip a creature through time.", effect: "Remove a creature from time for 1 turn (it vanishes and returns) — effectively Stunned." },
  { name: "Temporal Rift", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 16, action: "Action", desc: "Tear open time.", effect: "20-ft radius; auto-hits for 3d6 + INT temporal; Slowed.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "temporal", area: "20-ft radius" } },
  { name: "Rewind Wounds", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Undo an ally's injuries.", effect: "Heal an ally 3d6 + INT HP.", heal: { dice: "3d6", mod: "INT" } },
  { name: "Haste Field", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A field of accelerated time.", effect: "Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active.", sustained: true },
  { name: "Slow Time ×5", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "Signature — near-stop.", effect: "20-ft area: enemies Stunned 1 turn. Self-cost: you lose your next turn." },
  { name: "Age", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 22, action: "Action", desc: "Rapidly age a foe.", effect: "5d6 + INT temporal and the target is Weakened.", damage: { dice: "5d6", mod: "INT", type: "temporal" } },
  { name: "Paradox", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 24, action: "Action", desc: "Create a paradox.", effect: "Negate a target's last action entirely + 3d6 + INT." },
  { name: "Rewind Death", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 24, action: "Action", desc: "Rewind a death.", effect: "Rewind a fallen ally to before they died — revive to full HP." },
  { name: "Temporal Sanctuary", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A haven outside time.", effect: "20-ft zone; allies can't be Slowed/Stunned and gain +10 move & an extra Bonus Action while active.", sustained: true },
  { name: "Slow Time ×10", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 30, action: "Action", desc: "Signature capstone — stop time.", effect: "Take 3 consecutive turns while all else is frozen (damage lands when time resumes). Self-cost: you are Stunned when it ends." },
  // Biokinesis (Healer)
  { name: "Major Mend", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Knit serious wounds.", effect: "Heal an ally 2d6 + INT HP.", heal: { dice: "2d6", mod: "INT" } },
  { name: "Necrosis", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Rot living tissue.", effect: "Range 30 ft; 2d6 + INT necrotic; the target can't heal for 1 turn.", damage: { dice: "2d6", mod: "INT", type: "necrotic", range: "30 ft" } },
  { name: "Mutate", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 6, action: "Bonus Action", desc: "Grant a mutation.", effect: "Grant an ally a boon for the fight: +2 an attribute, natural weapons (1d8), or +move." },
  { name: "Cellular Shield", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Accelerate an ally's healing.", effect: "An ally regenerates 1d6 + INT/turn while active.", sustained: true },
  { name: "Regenesis ×2", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper regrowth.", effect: "Heal 2d8 + INT, end 2 conditions, and revive a downed ally to half HP.", heal: { dice: "2d8", mod: "INT" } },
  { name: "Mass Regeneration", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 12, action: "Action", desc: "Regenerate your allies.", effect: "Allies within 20 ft heal 2d6 + INT and gain regeneration.", heal: { dice: "2d6", mod: "INT" } },
  { name: "Plague", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 16, action: "Action", desc: "Spread a virulent plague.", effect: "15-ft radius; auto-hits for 3d6 + INT poison; enemies Weakened and can't heal.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "poison", area: "15-ft radius" } },
  { name: "Perfect Body", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Perfect an ally's biology.", effect: "An ally is immune to conditions and heals 2d6/turn while active.", sustained: true },
  { name: "Graft", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Regrow and cure.", effect: "Regrow a lost limb / cure any disease or condition permanently, and heal 3d6 + INT.", heal: { dice: "3d6", mod: "INT" } },
  { name: "Regenesis ×5", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "Signature — regrowth for all.", effect: "Heal all allies within 20 ft 3d6 + INT + regeneration; revive any downed among them.", heal: { dice: "3d6", mod: "INT" } },
  { name: "Extinction", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 30, action: "Action", desc: "Unleash cellular death.", effect: "40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal.", aoe: true, damage: { dice: "6d6", mod: "INT", type: "necrotic", area: "40-ft radius" } },
  { name: "Apotheosis", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 26, action: "Action", desc: "Perfect an ally.", effect: "Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions." },
  { name: "Cellular Recall", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 20, action: "Action", desc: "Rebuild from a healthy blueprint.", effect: "Heal 6d6 + INT and remove all conditions on an ally.", heal: { dice: "6d6", mod: "INT" } },
  { name: "Living Sanctuary", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A sanctuary of life.", effect: "Allies within 20 ft heal 3d6/turn and revive at 1 HP if downed while active.", sustained: true },
  { name: "Regenesis ×10", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — life from a cell.", effect: "Regrow a body from a single cell — fully resurrect a dead ally to full HP/KP, restored perfectly." },

  // ---- WIS · Third Eye ----
  // Demokinesis (Tank)
  { name: "Hellfire Bolt", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 6, action: "Action", desc: "A bolt of hellfire.", effect: "Range 40 ft; 2d6 + WIS necrotic/fire damage.", damage: { dice: "2d6", mod: "WIS", type: "necrotic", range: "40 ft" } },
  { name: "Terrify", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Project overwhelming dread.", effect: "15-ft radius; enemies Feared." },
  { name: "Life Leech", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Drain life.", effect: "Range 30 ft; 2d6 + WIS necrotic; heal yourself half.", damage: { dice: "2d6", mod: "WIS", type: "necrotic", range: "30 ft" } },
  { name: "Cursed Ward", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "A ward of curses.", effect: "Enemies attacking you are cursed — disadvantage and take 1d6 while active.", sustained: true },
  { name: "Demon Form ×2", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — greater demon.", effect: "+4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn.", sustained: true, buff: { attrFlat: { STR: 4, WIS: 4 }, dsFromMod: "WIS" } },
  { name: "Hellstorm", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 18, action: "Action", desc: "A storm of hellfire.", effect: "20-ft radius; auto-hits for 3d6 + WIS necrotic; Feared.", aoe: true, damage: { dice: "3d6", mod: "WIS", type: "necrotic", area: "20-ft radius" } },
  { name: "Devour", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Devour a foe's essence.", effect: "Melee; 4d6 + WIS; heal equal to the damage dealt.", damage: { dice: "4d6", mod: "WIS", type: "necrotic" } },
  { name: "Soul Chain", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 14, action: "Action", desc: "Bind a soul in chains.", effect: "Range 30 ft; target Rooted + 2d6/turn; if it dies you gain temp HP." },
  { name: "Aura of Dread", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Radiate dread.", effect: "Enemies within 15 ft are Feared and Weakened while active.", sustained: true },
  { name: "Demon Form ×5", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — monstrous power.", effect: "+8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption).", sustained: true, buff: { attrFlat: { STR: 8, WIS: 8 }, dsFromMod: "WIS" } },
  { name: "Apocalypse", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Herald the end.", effect: "40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "necrotic", area: "40-ft radius" } },
  { name: "Pact of Ruin", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 22, action: "Reaction", desc: "Unleash the demon on death.", effect: "When you drop to 0 HP, return to half HP and deal 4d6 to all enemies within 20 ft. Once per long rest." },
  { name: "Soul Harvest", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 24, action: "Action", desc: "Reap a soul.", effect: "5d6 + WIS; if the target dies, gain large temp HP and KP.", damage: { dice: "5d6", mod: "WIS", type: "necrotic" } },
  { name: "Overlord's Presence", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Command as an overlord.", effect: "All enemies within 30 ft are Feared; you and allies gain +WIS to attack while active.", sustained: true },
  { name: "Demon Form ×10", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — full demon.", effect: "+15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon).", sustained: true, buff: { attrFlat: { STR: 15, WIS: 15 }, dsFromMod: "WIS" } },
  // Naturakinesis (Controller)
  { name: "Vine Whip", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 6, action: "Action", desc: "A lashing vine.", effect: "Reach 15 ft; 1d10 + WIS piercing; pull the target 10 ft.", damage: { dice: "1d10", mod: "WIS", type: "piercing", range: "15 ft" } },
  { name: "Poison Spores", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Release toxic spores.", effect: "15-ft radius; auto-hits for 2d6 + WIS poison; enemies Weakened.", aoe: true, damage: { dice: "2d6", mod: "WIS", type: "poison", area: "15-ft radius" } },
  { name: "Grasping Roots", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Roots erupt from the ground.", effect: "15-ft radius; enemies Rooted." },
  { name: "Grove Ward", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "A sheltering grove.", effect: "Allies within 10 ft gain +WIS to DS and heal 1d4/turn while active.", sustained: true },
  { name: "Bloom ×2", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — a growing garden.", effect: "15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft.", sustained: true },
  { name: "Thornstorm", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 18, action: "Action", desc: "A storm of thorns.", effect: "20-ft radius; auto-hits for 3d6 + WIS piercing; Rooted.", aoe: true, damage: { dice: "3d6", mod: "WIS", type: "piercing", area: "20-ft radius" } },
  { name: "Strangle", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 14, action: "Action", desc: "Vines around the throat.", effect: "Range 30 ft; target Rooted and Silenced + 2d6/turn." },
  { name: "Wall of Thorns", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wall of thorns.", effect: "30-ft thorn wall; crossing deals 3d6 and Roots while active.", sustained: true },
  { name: "Regrowth Field", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A field of regrowth.", effect: "20-ft; allies heal 2d6/turn; enemies face difficult terrain and are Slowed while active.", sustained: true },
  { name: "Bloom ×5", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — a flourishing grove.", effect: "20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft.", sustained: true },
  { name: "Primeval Forest", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Summon a primeval forest.", effect: "40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "piercing", area: "40-ft radius" } },
  { name: "Nature's Wrath", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 24, action: "Action", desc: "Unleash nature's fury.", effect: "30-ft radius; auto-hits for 5d6 + WIS; Rooted and Weakened.", aoe: true, damage: { dice: "5d6", mod: "WIS", type: "piercing", area: "30-ft radius" } },
  { name: "Symbiosis", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 20, action: "Bonus Action", desc: "Bond an ally with nature.", effect: "An ally heals 3d6/turn and can't be Rooted or Slowed for the fight." },
  { name: "World Tree", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 24, upkeep: 10, action: "Bonus Action", desc: "Grow a world tree.", effect: "Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active.", sustained: true },
  { name: "Bloom ×10", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — nature reclaims all.", effect: "40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart.", sustained: true },
  // Holykinesis (Healer)
  { name: "Radiant Beam", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 6, action: "Action", desc: "A beam of holy light.", effect: "Range 50 ft; 2d6 + WIS radiant damage.", damage: { dice: "2d6", mod: "WIS", type: "radiant", range: "50 ft" } },
  { name: "Cleansing Light", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Light that cleanses.", effect: "Heal an ally 2d6 + WIS and remove all conditions.", heal: { dice: "2d6", mod: "WIS" } },
  { name: "Guardian", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 6, action: "Reaction", desc: "An angelic shield.", effect: "Halve the damage an ally takes." },
  { name: "Greater Blessing", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Bless your allies.", effect: "Allies within 15 ft gain +1d4 to attacks and saves while active.", sustained: true },
  { name: "Sanctuary ×2", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — greater sanctuary.", effect: "15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn.", sustained: true },
  { name: "Judgment", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Pass divine judgment.", effect: "4d6 + WIS radiant to a target (double vs undead/evil).", damage: { dice: "4d6", mod: "WIS", type: "radiant" } },
  { name: "Resurrection", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Restore the fallen.", effect: "Revive a dead ally to half HP and cleanse." },
  { name: "Mass Blessing", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 12, action: "Action", desc: "Bless the party.", effect: "Allies within 20 ft heal 2d6 and gain Bless.", heal: { dice: "2d6", mod: "WIS" } },
  { name: "Divine Shield", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A shield of the divine.", effect: "Allies within 15 ft gain DR and can't be reduced below 1 HP (once each) while active.", sustained: true },
  { name: "Sanctuary ×5", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — hallowed ground.", effect: "20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded.", sustained: true },
  { name: "Divine Judgment", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Call down judgment on all.", effect: "40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "radiant", area: "40-ft radius" } },
  { name: "Heaven's Call", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 30, action: "Action", desc: "Call the fallen home.", effect: "Revive all fallen allies within 30 ft to full HP and cleanse them." },
  { name: "Miracle", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 26, action: "Action", desc: "Work a miracle.", effect: "Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn." },
  { name: "Avatar of Light", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become an avatar of light.", effect: "Allies within 20 ft heal 3d6/turn and can't die; enemies Blinded while active.", sustained: true },
  { name: "Sanctuary ×10", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — divine domain.", effect: "40-ft domain: allies fully healed each turn, revived if they fall, immune to harm; enemies take 4d6 radiant/turn + Blinded. You cannot move or act while it stands." },

  // ---- CHA · Throat ----
  // Sonikinesis (Tank)
  { name: "Thunderclap", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 8, action: "Action", desc: "A concussive clap.", effect: "15-ft radius; auto-hits for 2d6 + CHA thunder; push 10 ft + Shocked.", aoe: true, damage: { dice: "2d6", mod: "CHA", type: "thunder", area: "15-ft radius" } },
  { name: "Discordant Note", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "A jarring note.", effect: "Range 30 ft; 1d6 + CHA thunder; the target is Silenced.", damage: { dice: "1d6", mod: "CHA", type: "thunder", range: "30 ft" } },
  { name: "Anthem", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A rallying anthem.", effect: "Allies within 15 ft gain +CHA to DS and +1d4 attacks while active.", sustained: true },
  { name: "Sonic Wall", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A wall of sound.", effect: "20-ft wall of sound; blocks projectiles; enemies crossing are Shocked while active.", sustained: true },
  { name: "Crescendo ×2", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — rising resonance.", effect: "Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes.", sustained: true, buff: { dsFromMod: "CHA" } },
  { name: "Resonant Blast", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "A blast of resonance.", effect: "20-ft radius; auto-hits for 3d6 + CHA thunder; Shocked + push.", aoe: true, damage: { dice: "3d6", mod: "CHA", type: "thunder", area: "20-ft radius" } },
  { name: "Shatter", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 16, action: "Action", desc: "Hit the resonant frequency.", effect: "4d6 + CHA thunder to a target; ignores DR and armor.", damage: { dice: "4d6", mod: "CHA", type: "thunder" } },
  { name: "Deafening Roar", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 12, action: "Action", desc: "A deafening roar.", effect: "15-ft radius; enemies Stunned 1 turn." },
  { name: "Rallying Symphony", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A symphony of war.", effect: "Allies within 20 ft gain +CHA to DS, +1d6 attacks, immune to Fear while active.", sustained: true },
  { name: "Crescendo ×5", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — overwhelming sound.", effect: "Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too.", sustained: true, buff: { dsFromMod: "CHA" } },
  { name: "Sonic Boom", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "A devastating boom.", effect: "40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "thunder", area: "40-ft radius" } },
  { name: "Frequency Lock", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 20, action: "Action", desc: "Lock a foe in resonance.", effect: "A target is Frozen (locked in resonance) + 3d6/turn." },
  { name: "Unbreakable Anthem", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 22, action: "Bonus Action", desc: "A song that sustains.", effect: "Allies within 30 ft can't drop below 1 HP for 2 turns and are immune to conditions." },
  { name: "Standing Wave", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A destructive standing wave.", effect: "Allies within 20 ft take half damage (destructive interference); enemies 3d6/turn while active.", sustained: true },
  { name: "Crescendo ×10", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — world-shaking climax.", effect: "40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions.", sustained: true, buff: { dsFromMod: "CHA" } },
  // Lumokinesis (Controller)
  { name: "Laser", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "A focused beam.", effect: "Range 60 ft line; 2d6 + CHA radiant; ignores partial cover.", damage: { dice: "2d6", mod: "CHA", type: "radiant", range: "60 ft" } },
  { name: "Hologram", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "A decoy of light.", effect: "Create a decoy that draws an attack — an enemy wastes its next attack on the illusion." },
  { name: "Blinding Burst", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 8, action: "Action", desc: "A burst of blinding light.", effect: "15-ft radius; auto-hits for 2d6 + CHA radiant; Blinded.", aoe: true, damage: { dice: "2d6", mod: "CHA", type: "radiant", area: "15-ft radius" } },
  { name: "Light Veil", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Hide allies in light.", effect: "Allies within 10 ft are hidden in refracted light (attacks against them have disadvantage) while active.", sustained: true },
  { name: "Radiance ×2", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — spreading light.", effect: "15-ft light: Blinded + 2d6/turn; spreads 5 ft.", sustained: true },
  { name: "Prism Beam", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "A splitting prism beam.", effect: "20-ft radius; auto-hits for 3d6 + CHA radiant; Blinded.", aoe: true, damage: { dice: "3d6", mod: "CHA", type: "radiant", area: "20-ft radius" } },
  { name: "Searing Light", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 16, action: "Action", desc: "Searing focused light.", effect: "4d6 + CHA radiant to a target; if it's Blinded, +2d6.", damage: { dice: "4d6", mod: "CHA", type: "radiant" } },
  { name: "Illusory Army", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 14, action: "Action", desc: "Conjure an army of light.", effect: "15-ft radius; illusory duplicates confuse enemies — Feared (disadvantage) 1 turn." },
  { name: "Solar Ward", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A ward of solar light.", effect: "Allies within 15 ft gain +CHA to DS; enemies approaching are Blinded while active.", sustained: true },
  { name: "Radiance ×5", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — overwhelming light.", effect: "20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded.", sustained: true },
  { name: "Second Sun", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "Ignite a second sun.", effect: "40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "radiant", area: "40-ft radius" } },
  { name: "Grand Illusion", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 24, action: "Action", desc: "Reshape perception.", effect: "30-ft radius; enemies Feared and strike wrong targets (confusion) 1 turn." },
  { name: "Light Speed", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 22, action: "Bonus Action", desc: "Move at light-speed.", effect: "You and an ally act at light-speed — an extra action each and can't be hit until your next turn." },
  { name: "Purifying Radiance", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Radiate purifying light.", effect: "Allies within 20 ft are immune to Blind/Fear and heal 2d6/turn; enemies Blinded while active.", sustained: true },
  { name: "Radiance ×10", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — a blinding sun.", effect: "40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light.", sustained: true },
  // Spirikinesis (Healer)
  { name: "Vengeful Spirit", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "Send a vengeful spirit.", effect: "Range 40 ft; 2d6 + CHA spectral damage.", damage: { dice: "2d6", mod: "CHA", type: "spectral", range: "40 ft" } },
  { name: "Mend Soul", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 7, action: "Action", desc: "Mend a wounded soul.", effect: "Heal an ally 2d6 + CHA and end one condition.", heal: { dice: "2d6", mod: "CHA" } },
  { name: "Haunt", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "Haunt a foe with spirits.", effect: "Range 30 ft; target Feared + 1d6/turn." },
  { name: "Ancestral Ward", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Ancestors watch over.", effect: "Allies within 10 ft heal 1d4 + CHA/turn while active.", sustained: true },
  { name: "Soul Tether ×2", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 9, action: "Action", desc: "Signature — anchor more souls.", effect: "Tether up to 2 allies (stay at 1 HP once), or revive one downed to half HP. Self-cost: take 1d6 spectral." },
  { name: "Spirit Storm", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "A storm of spirits.", effect: "20-ft radius; auto-hits for 3d6 + CHA spectral; Feared.", aoe: true, damage: { dice: "3d6", mod: "CHA", type: "spectral", area: "20-ft radius" } },
  { name: "Possession", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 16, action: "Action", desc: "Possess a foe.", effect: "Briefly possess an enemy: it is Stunned and you redirect its next action." },
  { name: "Call Spirits", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 14, action: "Action", desc: "Call ancestral spirits.", effect: "Heal allies within 20 ft 2d6 + CHA (ancestors' blessing).", heal: { dice: "2d6", mod: "CHA" } },
  { name: "Guardian Host", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A host of guardian spirits.", effect: "Spirits guard allies within 15 ft — they take half damage while active.", sustained: true },
  { name: "Soul Tether ×5", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "Signature — tether the party.", effect: "Tether all allies within 20 ft (stay at 1 HP once) or revive downed among them. Self-cost: 1d6 spectral + Throat chakra takes 1 hit." },
  { name: "Wrath of the Dead", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "Unleash the vengeful dead.", effect: "40-ft radius; auto-hits for 6d6 + CHA spectral; Feared.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "spectral", area: "40-ft radius" } },
  { name: "Reap", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 24, action: "Action", desc: "Reap a soul for your party.", effect: "5d6 + CHA to a target; if it dies, its soul heals your party 3d6.", damage: { dice: "5d6", mod: "CHA", type: "spectral" } },
  { name: "Afterlife's Guard", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "The dead guard the living.", effect: "Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active.", sustained: true },
  { name: "Ghost Walk", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 20, upkeep: 8, action: "Bonus Action", desc: "Walk as a ghost.", effect: "You and allies become spectral — immune to physical damage, move through walls while active.", sustained: true },
  { name: "Soul Tether ×10", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — call back a soul.", effect: "Journey to the afterlife and call back a fallen ally — fully resurrect them to full HP/KP. Self-cost: you are Stunned your next turn, and your Throat chakra takes 2 hits." },
];

/* --- Limbs (called-shot / crippling system) ----------------------------- */
/* Each limb has its own HP = ceil(maxHP × frac). A called shot deals damage to the limb AND to main HP,
   capped at the limb's current HP (excess is lost). At 0 the limb is Crippled with the listed effect. */
PC.LIMBS = [
  { key: "head",  name: "Head",      frac: 0.25, crippled: "Concussed — disadvantage on Mind (INT/WIS/CHA) checks and technique attacks." },
  { key: "torso", name: "Torso",     frac: 0.5,  crippled: "Grievously wounded — Weakened, and bleed 1d4 HP at the start of each turn." },
  { key: "larm",  name: "Left Arm",  frac: 0.25, crippled: "Disadvantage on weapon attacks; can't use two-handed weapons." },
  { key: "rarm",  name: "Right Arm", frac: 0.25, crippled: "Disadvantage on weapon attacks; can't use two-handed weapons." },
  { key: "lleg",  name: "Left Leg",  frac: 0.25, crippled: "Movement halved." },
  { key: "rleg",  name: "Right Leg", frac: 0.25, crippled: "Movement halved." },
];

/* --- Fighting Styles (combat-skill "schools", tied to a region) --------- */
/* Combat Skills are organized into Fighting Styles the way Techniques are organized
   into Kinetics. Each style is a category of skills PLUS one signature Passive buff.
   No resource cost — skills only consume the action economy.
   Rule: any skill that rides onto / augments a base attack is a Bonus Action.
   A character's Regional Heritage grants ONE style, 2 active skills from it, and the
   style's Passive. Any skill or passive from ANY style can be learned later with CSP. */
PC.FIGHTING_STYLES = [
  { name: "Frontier Gunslinging", heritage: "North America",
    blurb: "Frontier shooting — patience, cover, and a called shot when it counts.",
    skills: [
      { name: "Marksmanship", action: "Bonus Action", effect: "After a ranged attack hits, make a called shot to a limb for crippling damage." },
      { name: "Suppressing Fire", action: "Action", effect: "Rake a 15-ft area with fire; enemies there have disadvantage on attacks until your next turn." },
      { name: "Quick Draw", action: "Bonus Action", effect: "Draw or holster a weapon for free, then make a ranged attack with it." },
      { name: "Counter-Fire", action: "Reaction", effect: "When a creature you can see makes a ranged attack, make a ranged attack against it." },
      { name: "Trick Shot", action: "Action", effect: "A ranged attack that, on a hit, also disarms the target or knocks it prone." },
      { name: "Deadeye", action: "Passive", effect: "Once per turn you may reroll one ranged damage die showing 1 or 2, and your ranged attacks ignore half cover." },
    ] },
  { name: "Flowing Movement", heritage: "South America",
    blurb: "Jungle-forged agility — never where the blow lands, always moving.",
    skills: [
      { name: "Combat Roll", action: "Bonus Action", effect: "Move up to half your speed without provoking opportunity attacks." },
      { name: "Dodge Roll", action: "Reaction", effect: "Impose disadvantage on one attack against you and shift 5 ft." },
      { name: "Vault Strike", action: "Action", effect: "Leap off terrain or a foe into a melee attack made with advantage." },
      { name: "Tumble", action: "Bonus Action", effect: "Move through an enemy's space; your next attack this turn ignores its shield/cover bonus." },
      { name: "Leg Sweep", action: "Action", effect: "Melee attack that knocks the target prone on a hit." },
      { name: "Momentum", action: "Passive", effect: "If you move at least 15 ft before attacking, that attack deals +2 damage." },
    ] },
  { name: "Chivalric Swordplay", heritage: "Europe",
    blurb: "A long, disciplined melee tradition — pressure, reach, and the counter.",
    skills: [
      { name: "Riposte", action: "Reaction", effect: "When a melee attack misses you, make a melee attack against the attacker." },
      { name: "Power Attack", action: "Bonus Action", effect: "Enhance a weapon attack this turn: +1 damage die at −2 to hit." },
      { name: "Cleave", action: "Action", effect: "Make a melee weapon attack against every enemy within your reach." },
      { name: "Lunge", action: "Bonus Action", effect: "Extend your melee reach by 5 ft for one attack this turn." },
      { name: "Shield Bash", action: "Action", effect: "Melee attack that, on a hit, staggers the target — it loses its next reaction." },
      { name: "Second Strike", action: "Passive", effect: "When you take the Attack action with a melee weapon, make one additional melee attack." },
    ] },
  { name: "Fencing", heritage: "United Kingdom",
    blurb: "Precise, composed bladework — parry, feint, and the perfect thrust.",
    skills: [
      { name: "Parry", action: "Reaction", effect: "When hit by a melee attack, reduce its damage by your weapon die + relevant mod." },
      { name: "Feint", action: "Bonus Action", effect: "Your next weapon attack this turn is made with advantage." },
      { name: "Disarm", action: "Action", effect: "Contested attack to knock a weapon from a target's hand; it drops its weapon." },
      { name: "Bind Blade", action: "Reaction", effect: "When a melee attack misses you, the attacker can't attack with that weapon on its next turn." },
      { name: "Precise Thrust", action: "Bonus Action", effect: "Your next melee attack this turn ignores the target's armor Defense bonus." },
      { name: "En Garde", action: "Passive", effect: "While wielding a one-handed melee weapon and no shield, gain +1 to your Defense Score." },
    ] },
  { name: "Warden's Bulwark", heritage: "Africa",
    blurb: "Community-strong defense — hold the line and shield your kin.",
    skills: [
      { name: "Guardian", action: "Reaction", effect: "When an ally within reach is hit, take the attack's damage in their place (or halve it)." },
      { name: "Bracing Stance", action: "Bonus Action", effect: "Until your next turn, reduce forced movement against you to 0 and gain advantage to resist being knocked prone." },
      { name: "Grapple", action: "Action", effect: "Contested check to restrain a foe within reach — it is Rooted while grappled." },
      { name: "Intercept", action: "Reaction", effect: "When an enemy moves within your reach, move up to 5 ft to block it and make a melee attack." },
      { name: "Rallying Strike", action: "Action", effect: "Melee attack; on a hit, an ally within 15 ft gains temp HP equal to your Soul Level." },
      { name: "Ironhide", action: "Passive", effect: "At the start of each combat gain temp HP equal to your CON mod, and +1 to your Defense Score." },
    ] },
  { name: "Desert Whirlwind", heritage: "Middle East",
    blurb: "Sweeping curved-blade work — one motion, many foes.",
    skills: [
      { name: "Spinning Cut", action: "Action", effect: "One melee attack roll resolved against two enemies within your reach." },
      { name: "Deflecting Slash", action: "Reaction", effect: "When hit by a melee attack, reduce its damage by your weapon die; if reduced to 0, make a free melee attack against the attacker." },
      { name: "Crescent Strike", action: "Bonus Action", effect: "A melee attack that, on a hit, pushes the target 5 ft and lets you move with it." },
      { name: "Sand Veil", action: "Bonus Action", effect: "Kick up dust; the next attack against you this round has disadvantage." },
      { name: "Sweeping Charge", action: "Action", effect: "Move up to your speed in a line and make a melee attack against each enemy you pass." },
      { name: "Whirlwind", action: "Passive", effect: "Once per turn, when you hit with a melee attack, deal your weapon mod as damage to another enemy within reach." },
    ] },
  { name: "Way of the Open Hand", heritage: "East Asia",
    blurb: "Unarmed martial discipline — the body itself is the weapon.",
    skills: [
      { name: "Palm Strike", action: "Action", effect: "Unarmed melee attack that pushes the target 10 ft on a hit." },
      { name: "Deflect", action: "Reaction", effect: "When hit by a ranged weapon attack, reduce the damage by 1d10 + AGI mod; if reduced to 0, catch the projectile." },
      { name: "Stunning Blow", action: "Bonus Action", effect: "After an unarmed hit this turn, the target can't take reactions until your next turn." },
      { name: "Pressure Point", action: "Action", effect: "Unarmed attack; on a hit, the target has disadvantage on its next attack roll." },
      { name: "Step of the Wind", action: "Bonus Action", effect: "Take the Dash or Disengage action; your jump distance is doubled this turn." },
      { name: "Flurry", action: "Passive", effect: "When you take the Attack action with an unarmed strike, make one additional unarmed strike." },
    ] },
  { name: "Twin Fang", heritage: "Oceania",
    blurb: "Island dual-wielding — a weapon in each hand, twice the openings.",
    skills: [
      { name: "Twin Strike", action: "Action", effect: "Attack a single target with both of your equipped one-handed weapons." },
      { name: "Rapid Slash", action: "Bonus Action", effect: "Make one attack with your off-hand one-handed weapon." },
      { name: "Cross Parry", action: "Reaction", effect: "While dual-wielding, when hit by a melee attack reduce its damage by both weapon dice." },
      { name: "Whirl of Steel", action: "Action", effect: "Attack every enemy within your reach with your off-hand weapon." },
      { name: "Flourish", action: "Bonus Action", effect: "Feint with one weapon; your next attack with the other has advantage." },
      { name: "Two-Weapon Fighting", action: "Passive", effect: "While holding a one-handed weapon in each hand, when you take the Attack action you may make one additional attack with your off-hand weapon." },
    ] },
];

/* Flattened master list — every combat skill across all styles, tagged with its style.
   Kept for name lookups (PC.combatSkill) and for the play-sheet / level-up UIs. */
PC.COMBAT_SKILLS = PC.FIGHTING_STYLES.reduce(function (all, st) {
  return all.concat(st.skills.map(function (sk) {
    return { name: sk.name, action: sk.action, effect: sk.effect, style: st.name };
  }));
}, []);

/* --- Regional Heritages (old-world ancestry; replaces a race system) ---- */
/* Grants ONE Fighting Style, 2 active combat skills from it, that style's Passive,
   and 2 roleplay traits. No attribute changes. Chosen before Attributes. */
PC.HERITAGES = [
  { name: "North America", blurb: "Rugged frontier stock — self-reliant survivors of the wild expanse.",
    fightingStyle: "Frontier Gunslinging", combatSkills: ["Marksmanship", "Suppressing Fire"],
    traits: [ { name: "Frontier Grit", desc: "Advantage on Survival checks in the wilderness." },
              { name: "Scavenger", desc: "Advantage on checks to jury-rig or repair with salvaged parts." } ] },
  { name: "South America", blurb: "Jungle-forged and resourceful, at home in dense, untamed country.",
    fightingStyle: "Flowing Movement", combatSkills: ["Combat Roll", "Dodge Roll"],
    traits: [ { name: "Jungle-Born", desc: "Advantage on Acrobatics and moving through natural difficult terrain." },
              { name: "Herbal Lore", desc: "Advantage on Herbalism; identify plants and toxins at a glance." } ] },
  { name: "Europe", blurb: "Heirs to a long, disciplined martial tradition.",
    fightingStyle: "Chivalric Swordplay", combatSkills: ["Riposte", "Power Attack"],
    traits: [ { name: "Martial Heritage", desc: "You gain one additional weapon-type proficiency." },
              { name: "Old-World Scholar", desc: "You speak an extra old-world language; advantage on Etiquette." } ] },
  { name: "United Kingdom", blurb: "Stoic and tactical, unshaken under pressure.",
    fightingStyle: "Fencing", combatSkills: ["Parry", "Feint"],
    traits: [ { name: "Stiff Upper Lip", desc: "Advantage on checks and saves to resist Fear." },
              { name: "Composed", desc: "Advantage on Insight to read a tense situation." } ] },
  { name: "Africa", blurb: "Enduring and community-strong, forged by hardship and kinship.",
    fightingStyle: "Warden's Bulwark", combatSkills: ["Guardian", "Bracing Stance"],
    traits: [ { name: "Enduring", desc: "Advantage on Hardiness and checks to resist exhaustion." },
              { name: "Kinship", desc: "Advantage on Persuasion within a community; rally to stabilize a downed ally." } ] },
  { name: "Middle East", blurb: "Resilient warrior-traders, sharp of eye and tongue.",
    fightingStyle: "Desert Whirlwind", combatSkills: ["Spinning Cut", "Deflecting Slash"],
    traits: [ { name: "Shrewd Trader", desc: "Advantage on Barter." },
              { name: "Desert-Hardened", desc: "Resist extreme heat and thirst; advantage on Tolerance vs. environment." } ] },
  { name: "East Asia", blurb: "Honed by generations of martial discipline and focus.",
    fightingStyle: "Way of the Open Hand", combatSkills: ["Palm Strike", "Deflect"],
    traits: [ { name: "Inner Focus", desc: "Advantage on Concentration checks." },
              { name: "Disciplined", desc: "You speak an extra language; advantage on precise, patient tasks." } ] },
  { name: "Oceania", blurb: "Seafaring and adaptable, thriving between island and open water.",
    fightingStyle: "Twin Fang", combatSkills: ["Twin Strike", "Rapid Slash"],
    traits: [ { name: "Seafarer", desc: "Advantage to swim, sail, or navigate water; hold your breath long." },
              { name: "Adaptable", desc: "You gain one extra skill proficiency of your choice." } ] },
];

/* --- Constants ----------------------------------------------------------- */
PC.RULES = {
  LEVEL_CAP: 30,
  START_CHOSEN_TECHNIQUES: 2,   // at creation, in addition to the background's free technique
  ATTR_SOFT_CAP: 30,
  BASE_DS: 10,
  BASE_MOVE: 30, BASE_CLIMB: 15, BASE_JUMP: 15, BASE_SWIM: 15,
  BASE_CARRY: 100, CARRY_PER_MOD: 10, SPEED_PER_MOD: 5,
  CHAKRA_MAX_HITS: 4,
};
