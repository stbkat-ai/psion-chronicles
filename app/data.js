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
/* color = the chakra's signature hue (traditional chakra palette); order = top-to-bottom
   position on the seated body figure (0 = crown, 5 = root) used by the Chakras tab. */
PC.CHAKRAS = {
  STR: { name: "Core",      full: "Solar Plexus", theme: "Raw power & willpower",             color: "#ffcf3f", order: 3 },
  AGI: { name: "Sacral",    full: "Sacral",       theme: "Movement, flow, reflexes",          color: "#ff8c1a", order: 4 },
  CON: { name: "Root",      full: "Root",         theme: "Survival, endurance, grounding",    color: "#e64553", order: 5 },
  CHA: { name: "Throat",    full: "Throat",       theme: "Voice & expression",                color: "#28a7e6", order: 2 },
  WIS: { name: "Third Eye", full: "Third Eye",    theme: "Insight, awareness, intuition",     color: "#5a63d8", order: 1 },
  INT: { name: "Crown",     full: "Crown",        theme: "Knowledge, logic, higher mind",     color: "#a855f7", order: 0 },
};

/* The hidden 7th chakra. It stays fully concealed until Soul Level 15, then awakens at the
   center of the chart (between Throat and Core) — the seat of the Otherkin "Soul Creature".
   It is NOT bound to an attribute, so it has no 4-hit track yet; its mechanics arrive with the
   Otherkin system. Green, its traditional color. */
PC.HEART_CHAKRA = { name: "Heart", full: "Heart", theme: "The Soul Creature within", color: "#46c46e", unlockLevel: 15, system: "Otherkin" };

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
    flaw: { name: "All Brawn", desc: "Never had the patience for books or gadgets. Disadvantage on Intelligence-based skills and Kinetic techniques.", disadvAttr: "INT" },
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
    flaw: { name: "Cold Read", desc: "Warmth never came naturally to a killer. Disadvantage on Charisma-based skills and Kinetic techniques.", disadvAttr: "CHA" },
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
    flaw: { name: "Self-Taught", desc: "The wild was your only teacher — not the classroom. Disadvantage on Intelligence-based skills and Kinetic techniques.", disadvAttr: "INT" },
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
    flaw: { name: "Ivory Tower", desc: "A lifetime spent reading, not lifting. Disadvantage on Strength-based skills and Kinetic techniques.", disadvAttr: "STR" },
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
    flaw: { name: "Frail Vessel", desc: "The body was always a poor match for the spirit. Disadvantage on Strength-based skills and Kinetic techniques.", disadvAttr: "STR" },
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
    flaw: { name: "Delicate Constitution", desc: "An artist's body, not a laborer's. Disadvantage on Constitution-based skills and Kinetic techniques.", disadvAttr: "CON" },
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
    flaw: { name: "Blunt Instrument", desc: "Trained to command, never to charm. Disadvantage on Charisma-based skills and Kinetic techniques.", disadvAttr: "CHA" },
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
    flaw: { name: "Ascetic", desc: "Withdrawn from the world's social games. Disadvantage on Charisma-based skills and Kinetic techniques.", disadvAttr: "CHA" },
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
    flaw: { name: "Faith Over Fact", desc: "You trust the spirit, never the schematic. Disadvantage on Intelligence-based skills and Kinetic techniques.", disadvAttr: "INT" },
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
  { name: "Ki Shield", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 2, upkeep: 1, action: "Bonus Action", desc: "A shield of kinetic energy.", effect: "Add your STR mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "STR" } },
  { name: "Ki Flame", kinetic: "Robukinesis", attr: "STR", tier: "Beginner", kp: 6, upkeep: 3, action: "Bonus Action", desc: "A flaming aura enhancing the body (overdrive base).", effect: "+2 STR, AGI, CON while active (may exceed 30).", sustained: true, buff: { attrFlat: { STR: 2, AGI: 2, CON: 2 } } },
  // Pyrokinesis (Controller)
  { name: "Fire Bolt", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of fire.", effect: "Range 30 ft; 1d6 + STR fire damage.", damage: { dice: "1d6", mod: "STR", type: "fire", range: "30 ft" } },
  { name: "Scorch", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 5, action: "Action", desc: "Sear a foe, spoiling its aim.", effect: "Range 40 ft; 1d6 + STR fire; on a hit the target's next attack has disadvantage.", damage: { dice: "1d6", mod: "STR", type: "fire", range: "40 ft" } },
  { name: "Conflagration", kinetic: "Pyrokinesis", attr: "STR", tier: "Beginner", kp: 8, upkeep: 4, action: "Action", desc: "A spreading fire zone (signature base).", effect: "10-ft fire zone within 30 ft; creatures inside take 1d6 fire and gain Burning each turn.", sustained: true },
  // Electrokinesis (Healer)
  { name: "Spark", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A jolt of lightning.", effect: "Range 30 ft; 1d6 + STR lightning damage.", damage: { dice: "1d6", mod: "STR", type: "lightning", range: "30 ft" } },
  { name: "Mend Current", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 3, action: "Action", desc: "A restorative current.", effect: "Heal an ally 1d6 + STR HP.", heal: { dice: "1d6", mod: "STR" } },
  { name: "Defibrillate", kinetic: "Electrokinesis", attr: "STR", tier: "Beginner", kp: 5, action: "Action", desc: "Jump-start the heart (signature base).", effect: "Heal an ally 1d8 + STR; if they are at 0 HP, they revive at that much HP.", heal: { dice: "1d8", mod: "STR" } },

  // ===== AGI · Sacral =====
  // Aerokinesis (Tank)
  { name: "Gust", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A blast of wind.", effect: "Range 30 ft; 1d6 + AGI wind; push the target 5 ft.", damage: { dice: "1d6", mod: "AGI", type: "wind", range: "30 ft" } },
  { name: "Zephyr Step", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 2, action: "Bonus Action", desc: "Ride the wind.", effect: "+15 ft movement this turn; you don't provoke opportunity attacks." },
  { name: "Tempest", kinetic: "Aerokinesis", attr: "AGI", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A whirlwind shroud (signature base).", effect: "5-ft whirlwind: enemies starting adjacent take 1d6 wind and are pushed 5 ft; +AGI to Defense Score.", sustained: true, buff: { dsFromMod: "AGI" } },
  // Umbrakinesis (Controller)
  { name: "Shroud of Shadows", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Wrap yourself in shadow.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Umbral Dagger", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A blade of shadow.", effect: "Melee; 1d8 + AGI shadow; +1d6 if the target can't see you.", damage: { dice: "1d8", mod: "AGI", type: "shadow" } },
  { name: "Nightfall", kinetic: "Umbrakinesis", attr: "AGI", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "Spreading darkness (signature base).", effect: "10-ft zone of darkness within 30 ft; enemies inside are Blinded; allies see through it.", sustained: true },
  // Hydrokinesis (Healer)
  { name: "Water Jet", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 4, action: "Action", desc: "A pressurized jet of water.", effect: "Range 30 ft; 1d6 + AGI water; push the target 5 ft.", damage: { dice: "1d6", mod: "AGI", type: "water", range: "30 ft" } },
  { name: "Soothing Flow", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 3, action: "Action", desc: "A gentle healing current.", effect: "Heal an ally 1d6 + AGI HP.", heal: { dice: "1d6", mod: "AGI" } },
  { name: "Tide", kinetic: "Hydrokinesis", attr: "AGI", tier: "Beginner", kp: 5, action: "Action", desc: "A wave that heals and pushes (signature base).", effect: "15-ft line wave: heal allies it crosses 1d6 + AGI; push enemies 10 ft.", heal: { dice: "1d6", mod: "AGI" } },

  // ===== CON · Root =====
  // Terrakinesis (Tank)
  { name: "Rock Throw", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "Hurl a stone.", effect: "Range 30 ft; 1d6 + CON earth damage.", damage: { dice: "1d6", mod: "CON", type: "earth", range: "30 ft" } },
  { name: "Mud Skin", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Hardened, earthen skin.", effect: "Add your CON mod to your Defense Score while active.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Stoneform", kinetic: "Terrakinesis", attr: "CON", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Encase yourself in stone (signature base).", effect: "Reduce incoming damage by CON mod and +CON to Defense Score; movement −10 ft.", sustained: true, buff: { dsFromMod: "CON" } },
  // Cryokinesis (Controller)
  { name: "Frost Bolt", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of cold.", effect: "Range 30 ft; 1d6 + CON cold damage.", damage: { dice: "1d6", mod: "CON", type: "cold", range: "30 ft" } },
  { name: "Ice Armor", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Armor of ice.", effect: "+CON to Defense Score; melee attackers take 1d4 cold.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Absolute Zero", kinetic: "Cryokinesis", attr: "CON", tier: "Beginner", kp: 5, action: "Action", desc: "Freeze a target solid (signature base).", effect: "The target is Frozen until the end of its next turn." },
  // Vitakinesis (Healer)
  { name: "Life Touch", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "A touch of vitality.", effect: "Heal an ally 1d6 + CON HP.", heal: { dice: "1d6", mod: "CON" } },
  { name: "Purge Toxin", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 3, action: "Action", desc: "Cleanse the body.", effect: "End one condition (poison, disease, etc.) on an ally." },
  { name: "Renewal", kinetic: "Vitakinesis", attr: "CON", tier: "Beginner", kp: 5, action: "Action", desc: "Overflowing life (signature base).", effect: "Heal an ally 1d8 + CON and grant regeneration 1d4/turn for 2 turns.", heal: { dice: "1d8", mod: "CON" } },

  // ===== INT · Crown =====
  // Gravikinesis (Tank)
  { name: "Gravity Bolt", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of crushing force.", effect: "Range 30 ft; 1d6 + INT force damage.", damage: { dice: "1d6", mod: "INT", type: "force", range: "30 ft" } },
  { name: "Pull", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Action", desc: "A gravitational tug.", effect: "Pull a creature 15 ft toward you." },
  { name: "Gravity Well", kinetic: "Gravikinesis", attr: "INT", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A field of attraction (signature base).", effect: "10-ft well: enemies entering are pulled to you and Slowed; +INT to Defense Score; your movement −10 ft.", sustained: true, buff: { dsFromMod: "INT" } },
  // Chronokinesis (Controller)
  { name: "Time Bolt", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "An accelerated particle.", effect: "Range 30 ft; 1d6 + INT temporal damage.", damage: { dice: "1d6", mod: "INT", type: "temporal", range: "30 ft" } },
  { name: "Haste", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "Speed an ally.", effect: "An ally gains +10 ft movement and one extra Bonus Action this turn." },
  { name: "Slow Time", kinetic: "Chronokinesis", attr: "INT", tier: "Beginner", kp: 5, action: "Action", desc: "Bend time against a foe (signature base).", effect: "A target (or 10-ft area) is Slowed." },
  // Biokinesis (Healer)
  { name: "Mend Tissue", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 3, action: "Action", desc: "Knit flesh together.", effect: "Heal an ally 1d6 + INT HP.", heal: { dice: "1d6", mod: "INT" } },
  { name: "Toxin", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 4, action: "Action", desc: "Inject a biological toxin.", effect: "Range 30 ft; 1d4 + INT poison; the target is Weakened.", damage: { dice: "1d4", mod: "INT", type: "poison", range: "30 ft" } },
  { name: "Regenesis", kinetic: "Biokinesis", attr: "INT", tier: "Beginner", kp: 5, action: "Action", desc: "Rewrite biology to heal (signature base).", effect: "Heal an ally 1d8 + INT and end one condition.", heal: { dice: "1d8", mod: "INT" } },

  // ===== WIS · Third Eye =====
  // Demokinesis (Tank)
  { name: "Dark Claw", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Rend with demonic claws.", effect: "Melee; 1d8 + WIS necrotic damage.", damage: { dice: "1d8", mod: "WIS", type: "necrotic" } },
  { name: "Dread", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Project demonic dread.", effect: "Range 30 ft; the target is Feared." },
  { name: "Demon Form", kinetic: "Demokinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Partial demonic transformation (signature base).", effect: "+2 STR & WIS, +WIS to Defense Score, claws (1d8) while active.", sustained: true, buff: { attrFlat: { STR: 2, WIS: 2 }, dsFromMod: "WIS" } },
  // Naturakinesis (Controller)
  { name: "Thorn Bolt", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Action", desc: "Fire a thorn.", effect: "Range 30 ft; 1d6 + WIS piercing damage.", damage: { dice: "1d6", mod: "WIS", type: "piercing", range: "30 ft" } },
  { name: "Thistle Bush", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Grow a thornbush.", effect: "5-ft thornbush: difficult terrain; creatures moving through take 1d6." },
  { name: "Bloom", kinetic: "Naturakinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "A growing garden (signature base).", effect: "10-ft garden within 30 ft: enemies Rooted + 1d6/turn thorns; allies heal 1d4/turn.", sustained: true },
  // Holykinesis (Healer)
  { name: "Smite", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 4, action: "Action", desc: "Call down radiant judgment.", effect: "Range 30 ft; 1d8 + WIS radiant (double vs. undead/evil).", damage: { dice: "1d8", mod: "WIS", type: "radiant", range: "30 ft" } },
  { name: "Bless", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 3, action: "Action", desc: "Bestow a blessing.", effect: "An ally gains +1d4 to attacks and checks for 3 turns." },
  { name: "Sanctuary", kinetic: "Holykinesis", attr: "WIS", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "Consecrated ground (signature base).", effect: "10-ft zone: allies heal 1d4 + WIS/turn; enemies take 1d6 radiant/turn.", sustained: true },

  // ===== CHA · Throat =====
  // Sonikinesis (Tank)
  { name: "Resonant Pulse", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Action", desc: "A disorienting pulse.", effect: "10-ft area; enemies are Shocked (disoriented)." },
  { name: "War Cry", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Bonus Action", desc: "A rallying shout.", effect: "Allies within 15 ft gain +1d4 to their attacks this turn." },
  { name: "Crescendo", kinetic: "Sonikinesis", attr: "CHA", tier: "Beginner", kp: 5, upkeep: 2, action: "Bonus Action", desc: "A building resonance (signature base).", effect: "10-ft resonance: +1d4 more thunder each turn to adjacent enemies (starts 1d4); +CHA to Defense Score.", sustained: true, buff: { dsFromMod: "CHA" } },
  // Lumokinesis (Controller)
  { name: "Light Bolt", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "A bolt of light.", effect: "Range 30 ft; 1d6 + CHA radiant damage.", damage: { dice: "1d6", mod: "CHA", type: "radiant", range: "30 ft" } },
  { name: "Flash", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 4, action: "Action", desc: "A blinding flash.", effect: "10-ft area; enemies are Blinded." },
  { name: "Radiance", kinetic: "Lumokinesis", attr: "CHA", tier: "Beginner", kp: 5, upkeep: 2, action: "Action", desc: "Blinding light zone (signature base).", effect: "10-ft zone of light within 30 ft: enemies Blinded + 1d6/turn radiant.", sustained: true },
  // Spirikinesis (Healer)
  { name: "Spirit Bolt", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 3, action: "Action", desc: "A spectral bolt.", effect: "Range 30 ft; 1d6 + CHA spectral damage.", damage: { dice: "1d6", mod: "CHA", type: "spectral", range: "30 ft" } },
  { name: "Phantom Presence", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 3, upkeep: 1, action: "Bonus Action", desc: "Shrouding spirits.", effect: "Attacks against you have disadvantage while active.", sustained: true },
  { name: "Soul Tether", kinetic: "Spirikinesis", attr: "CHA", tier: "Beginner", kp: 5, action: "Action", desc: "Anchor an ally's soul (signature base).", effect: "The next time the ally would drop to 0 HP, they instead stay at 1 HP." },

  /* ===================== HIGHER TIERS (Adept / Expert / Master) ===================== */
  // ---- STR · Core ----
  // Robukinesis (Tank)
  { name: "Kinetic Grip", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 5, action: "Action", desc: "Kinetic force pins a foe.", effect: "Range 30 ft; the target is Rooted." },
  { name: "Iron Body", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Harden your body with Ki.", effect: "Reduce all incoming damage by your STR mod (min 1) while active.", sustained: true },
  { name: "Ki Flame ×2", kinetic: "Robukinesis", attr: "STR", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Overdrive ×2 — the aura burns hotter.", effect: "+4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost).", sustained: true, buff: { attrFlat: { STR: 4, AGI: 4, CON: 4 } } },
  { name: "Titan's Blow", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 11, action: "Action", desc: "A devastating kinetic strike.", effect: "Melee; 3d6 + STR force and push the target 10 ft.", damage: { dice: "3d6", mod: "STR", type: "force" } },
  { name: "Bastion Aura", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A protective kinetic field.", effect: "You and allies within 15 ft gain +STR mod to Defense Score while active.", sustained: true },
  { name: "Ki Flame ×5", kinetic: "Robukinesis", attr: "STR", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Overdrive ×5 — dangerous power.", effect: "+8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation.", sustained: true, buff: { attrFlat: { STR: 8, AGI: 8, CON: 8 } } },
  { name: "Titan Strike", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 20, action: "Action", desc: "An earth-shaking blow.", effect: "Melee; 5d6 + STR force, push 20 ft, and the target is Weakened.", damage: { dice: "5d6", mod: "STR", type: "force" } },
  { name: "Unbreakable", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 16, action: "Reaction", desc: "Refuse to fall.", effect: "When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest." },
  { name: "Ki Flame ×10", kinetic: "Robukinesis", attr: "STR", tier: "Master", kp: 27, action: "Bonus Action", desc: "Overdrive ×10 — the burnout.", effect: "+15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest).", sustained: true, buff: { attrFlat: { STR: 15, AGI: 15, CON: 15 } } },
  // Pyrokinesis (Controller)
  { name: "Blazing Speed", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 6, upkeep: 3, action: "Bonus Action", desc: "Move on trails of fire.", effect: "Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active.", sustained: true },
  { name: "Fireball", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 14, action: "Action", desc: "The classic burst of flame.", effect: "15-ft radius within 60 ft; auto-hits for 2d6 + STR fire; targets gain Burning.", aoe: true, damage: { dice: "2d6", mod: "STR", type: "fire", area: "15-ft radius" } },
  { name: "Conflagration ×2", kinetic: "Pyrokinesis", attr: "STR", tier: "Adept", kp: 14, upkeep: 7, action: "Action", desc: "Signature — the fire grows.", effect: "15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn.", sustained: true },
  { name: "Firestorm Wall", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wall of flame.", effect: "30-ft line of fire; crossing it deals 2d6 fire + Burning; blocks line of sight while active.", sustained: true },
  { name: "Meteor", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 24, action: "Action", desc: "Call down a meteor.", effect: "20-ft radius within 90 ft; auto-hits for 4d6 + STR fire; leaves burning ground (1d6/turn) for 3 turns.", aoe: true, damage: { dice: "4d6", mod: "STR", type: "fire", area: "20-ft radius" } },
  { name: "Conflagration ×5", kinetic: "Pyrokinesis", attr: "STR", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — uncontrolled fire.", effect: "20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside.", sustained: true },
  { name: "Phoenix Form", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 20, upkeep: 10, action: "Bonus Action", desc: "Become living flame.", effect: "Emit a 10-ft fire aura (2d6/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP.", sustained: true },
  { name: "Supernova", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 29, action: "Action", desc: "A cataclysmic blast.", effect: "40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire.", aoe: true, damage: { dice: "6d6", mod: "STR", type: "fire", area: "40-ft radius" } },
  { name: "Conflagration ×10", kinetic: "Pyrokinesis", attr: "STR", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — fire unleashed.", effect: "40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included.", sustained: true },
  // Electrokinesis (Healer)
  { name: "Chain Lightning", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 8, action: "Action", desc: "Lightning that leaps between foes.", effect: "Range 40 ft; 1d8 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft.", damage: { dice: "1d8", mod: "STR", type: "lightning", range: "40 ft" } },
  { name: "Cleanse Current", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 4, action: "Action", desc: "Purifying current.", effect: "End one condition on an ally and heal 1d4 + STR HP.", heal: { dice: "1d4", mod: "STR" } },
  { name: "Defibrillate ×2", kinetic: "Electrokinesis", attr: "STR", tier: "Adept", kp: 7, action: "Action", desc: "Signature — surge of life.", effect: "Heal 2d8 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost).", heal: { dice: "2d8", mod: "STR" } },
  { name: "Lightning Storm", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 18, action: "Action", desc: "A storm of lightning.", effect: "20-ft radius within 60 ft; auto-hits for 3d6 + STR lightning; targets Shocked.", aoe: true, damage: { dice: "3d6", mod: "STR", type: "lightning", area: "20-ft radius" } },
  { name: "Mass Mend", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 11, action: "Action", desc: "Heal your allies at once.", effect: "Heal all allies within 20 ft 2d6 + STR HP.", heal: { dice: "2d6", mod: "STR" } },
  { name: "Defibrillate ×5", kinetic: "Electrokinesis", attr: "STR", tier: "Expert", kp: 14, action: "Action", desc: "Signature — mass revival.", effect: "Revive up to 2 downed allies to half HP (or heal one 3d8 + STR). Drains your HP and deals 2 hits to your Core chakra.", heal: { dice: "3d8", mod: "STR" } },
  { name: "Thundergod's Wrath", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 32, action: "Action", desc: "Unleash the storm.", effect: "40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked.", aoe: true, damage: { dice: "6d6", mod: "STR", type: "lightning", area: "40-ft radius" } },
  { name: "Rebirth Aura", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 24, upkeep: 10, action: "Bonus Action", desc: "A field that denies death.", effect: "While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn.", sustained: true },
  { name: "Defibrillate ×10", kinetic: "Electrokinesis", attr: "STR", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — the ultimate sacrifice.", effect: "Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest)." },

  // ---- AGI · Sacral ----
  // Aerokinesis (Tank)
  { name: "Wind Wall", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A wall of wind.", effect: "20-ft wall of wind blocks ranged attacks and deflects projectiles while active.", sustained: true },
  { name: "Air Dash", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 5, action: "Bonus Action", desc: "Dash on the wind.", effect: "Dash 30 ft in any direction; your next attack this turn has advantage." },
  { name: "Tempest ×2", kinetic: "Aerokinesis", attr: "AGI", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — the whirlwind grows.", effect: "10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft.", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Hurricane", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A localized hurricane.", effect: "20-ft radius; auto-hits for 3d6 + AGI wind; all pushed 15 ft and knocked prone.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "wind", area: "20-ft radius" } },
  { name: "Tornado", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 16, upkeep: 8, action: "Bonus Action", desc: "A mobile tornado.", effect: "A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active.", sustained: true },
  { name: "Tempest ×5", kinetic: "Aerokinesis", attr: "AGI", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — a raging storm.", effect: "20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push).", sustained: true, buff: { dsFromMod: "AGI" } },
  { name: "Maelstrom", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 32, action: "Action", desc: "A colossal storm.", effect: "40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed.", aoe: true, damage: { dice: "6d6", mod: "AGI", type: "wind", area: "40-ft radius" } },
  { name: "Sky Sovereign", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Rule the skies.", effect: "You fly; +AGI to DS; attacks against you have disadvantage while active.", sustained: true },
  { name: "Tempest ×10", kinetic: "Aerokinesis", attr: "AGI", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — living cyclone.", effect: "40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active.", sustained: true, buff: { dsFromMod: "AGI" } },
  // Umbrakinesis (Controller)
  { name: "Shadow Step", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 5, action: "Bonus Action", desc: "Step between shadows.", effect: "Teleport between shadows up to 40 ft; your next attack from concealment has advantage." },
  { name: "Umbral Drain", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "Drain vitality through shadow.", effect: "Range 30 ft; 2d6 + AGI shadow; you gain temp HP equal to half the damage.", damage: { dice: "2d6", mod: "AGI", type: "shadow", range: "30 ft" } },
  { name: "Nightfall ×2", kinetic: "Umbrakinesis", attr: "AGI", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — spreading dark.", effect: "15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn.", sustained: true },
  { name: "Shadow Storm", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A storm of darkness.", effect: "20-ft radius; auto-hits for 3d6 + AGI shadow; targets Blinded.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "shadow", area: "20-ft radius" } },
  { name: "Void Grip", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 12, action: "Action", desc: "Bind a foe in void.", effect: "Range 30 ft; the target is Rooted and Silenced." },
  { name: "Nightfall ×5", kinetic: "Umbrakinesis", attr: "AGI", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — consuming dark.", effect: "20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded.", sustained: true },
  { name: "Umbral Form", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become living shadow.", effect: "Immune to physical damage, move through walls, attacks against you have disadvantage while active.", sustained: true },
  { name: "Shadow Assassinate", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 20, action: "Action", desc: "A killing strike from the dark.", effect: "Melee; 5d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice).", damage: { dice: "5d6", mod: "AGI", type: "shadow" } },
  { name: "Nightfall ×10", kinetic: "Umbrakinesis", attr: "AGI", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — absolute dark.", effect: "The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared.", sustained: true },
  // Hydrokinesis (Healer)
  { name: "Healing Surge", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "A surge of restorative water.", effect: "Heal an ally 2d6 + AGI HP.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Riptide", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 7, action: "Action", desc: "A dragging current.", effect: "Range 30 ft; 1d10 + AGI water; pull 10 ft and Slowed.", damage: { dice: "1d10", mod: "AGI", type: "water", range: "30 ft" } },
  { name: "Tide ×2", kinetic: "Hydrokinesis", attr: "AGI", tier: "Adept", kp: 9, action: "Action", desc: "Signature — a greater wave.", effect: "20-ft wave: heal allies 2d6 + AGI; enemies pushed 15 ft and Slowed.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Tsunami", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "A crashing wave.", effect: "30-ft; enemies take 3d6 + AGI water (push 20 ft, prone); allies caught heal 2d6.", aoe: true, damage: { dice: "3d6", mod: "AGI", type: "water", area: "30 ft" } },
  { name: "Mass Renewal", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 11, action: "Action", desc: "Heal your allies together.", effect: "Heal all allies within 20 ft 2d6 + AGI HP.", heal: { dice: "2d6", mod: "AGI" } },
  { name: "Tide ×5", kinetic: "Hydrokinesis", attr: "AGI", tier: "Expert", kp: 18, action: "Action", desc: "Signature — a towering wave.", effect: "30-ft wave: heal allies 3d6 + AGI; enemies 2d6 + pushed + Slowed.", heal: { dice: "3d6", mod: "AGI" } },
  { name: "Great Deluge", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 30, action: "Action", desc: "A drowning flood.", effect: "40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone.", aoe: true, damage: { dice: "6d6", mod: "AGI", type: "water", area: "40-ft radius" } },
  { name: "Rejuvenation Font", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "A spring of life.", effect: "20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active.", sustained: true },
  { name: "Tide ×10", kinetic: "Hydrokinesis", attr: "AGI", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — a world-wave.", effect: "Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed)." },

  // ---- CON · Root ----
  // Terrakinesis (Tank)
  { name: "Stone Wall", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Raise a wall of stone.", effect: "20-ft stone wall (full cover; blocks movement & line of sight) while active.", sustained: true },
  { name: "Earthquake", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 10, action: "Action", desc: "Shake the earth.", effect: "15-ft radius; auto-hits for 2d6 + CON earth; prone + difficult terrain.", aoe: true, damage: { dice: "2d6", mod: "CON", type: "earth", area: "15-ft radius" } },
  { name: "Stoneform ×2", kinetic: "Terrakinesis", attr: "CON", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — harder stone.", effect: "Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Fissure", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Split the ground open.", effect: "30-ft line; auto-hits for 3d6 + CON earth; enemies fall prone and are Rooted.", aoe: true, damage: { dice: "3d6", mod: "CON", type: "earth", area: "30-ft line" } },
  { name: "Mountain's Aegis", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "Shield the line.", effect: "You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active.", sustained: true },
  { name: "Stoneform ×5", kinetic: "Terrakinesis", attr: "CON", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — stone titan.", effect: "DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move.", sustained: true, buff: { dsFromMod: "CON" } },
  { name: "Continental Crush", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 32, action: "Action", desc: "Crush a wide area.", effect: "40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted.", aoe: true, damage: { dice: "6d6", mod: "CON", type: "earth", area: "40-ft radius" } },
  { name: "Living Mountain", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Become a mountain.", effect: "Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active.", sustained: true },
  { name: "Stoneform ×10", kinetic: "Terrakinesis", attr: "CON", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — the unmovable.", effect: "DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes.", sustained: true, buff: { dsFromMod: "CON" } },
  // Cryokinesis (Controller)
  { name: "Frost Nova", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 10, action: "Action", desc: "A burst of cold.", effect: "10-ft radius; auto-hits for 2d6 + CON cold.", aoe: true, damage: { dice: "2d6", mod: "CON", type: "cold", area: "10-ft radius" } },
  { name: "Rime", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 6, action: "Action", desc: "Coat the ground in ice.", effect: "A 15-ft area becomes ice — difficult terrain; creatures there are Slowed." },
  { name: "Absolute Zero ×2", kinetic: "Cryokinesis", attr: "CON", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper freeze.", effect: "Target is Frozen; if already Slowed/Frozen, 2d6 shatter damage. Self-cost: you are Slowed next turn." },
  { name: "Blizzard", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "A raging blizzard.", effect: "20-ft radius; auto-hits for 3d6 + CON cold; targets Slowed.", aoe: true, damage: { dice: "3d6", mod: "CON", type: "cold", area: "20-ft radius" } },
  { name: "Flash Freeze", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 14, action: "Action", desc: "Freeze a foe instantly.", effect: "Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6." },
  { name: "Absolute Zero ×5", kinetic: "Cryokinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Signature — mass freeze.", effect: "Freeze all enemies in a 15-ft area (Frozen). Self-cost: you are Slowed while any remain frozen." },
  { name: "Ice Age", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 32, action: "Action", desc: "Bring an age of ice.", effect: "40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen.", aoe: true, damage: { dice: "6d6", mod: "CON", type: "cold", area: "40-ft radius" } },
  { name: "Absolute Stasis", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 22, action: "Action", desc: "Perfect preservation.", effect: "Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe)." },
  { name: "Absolute Zero ×10", kinetic: "Cryokinesis", attr: "CON", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — flash-freeze the field.", effect: "All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn." },
  // Vitakinesis (Healer)
  { name: "Greater Heal", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 7, action: "Action", desc: "A strong heal.", effect: "Heal an ally 2d6 + CON HP.", heal: { dice: "2d6", mod: "CON" } },
  { name: "Second Life", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 8, action: "Action", desc: "Pull an ally back.", effect: "Revive a downed ally to half HP." },
  { name: "Renewal ×2", kinetic: "Vitakinesis", attr: "CON", tier: "Adept", kp: 9, action: "Action", desc: "Signature — greater renewal.", effect: "Heal 2d8 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed.", heal: { dice: "2d8", mod: "CON" } },
  { name: "Mass Heal", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 12, action: "Action", desc: "Heal your allies together.", effect: "Heal all allies within 20 ft 2d6 + CON HP.", heal: { dice: "2d6", mod: "CON" } },
  { name: "Wellspring of Life", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wellspring.", effect: "20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside.", sustained: true },
  { name: "Renewal ×5", kinetic: "Vitakinesis", attr: "CON", tier: "Expert", kp: 18, action: "Action", desc: "Signature — renewal for all.", effect: "Heal all allies within 20 ft 3d6 + CON + regeneration; revive any downed among them.", heal: { dice: "3d6", mod: "CON" } },
  { name: "Mass Resurrection", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 30, action: "Action", desc: "Raise the fallen en masse.", effect: "Revive all downed or dead allies within 30 ft to half HP and cleanse them." },
  { name: "Eternal Vigor", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "Undying vigor.", effect: "Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active.", sustained: true },
  { name: "Renewal ×10", kinetic: "Vitakinesis", attr: "CON", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — life renewed.", effect: "Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight." },

  // ---- INT · Crown ----
  // Gravikinesis (Tank)
  { name: "Crush", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Increase a target's gravity.", effect: "Range 30 ft; 2d6 + INT force damage.", damage: { dice: "2d6", mod: "INT", type: "force", range: "30 ft" } },
  { name: "Heavy Field", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A field of heavy gravity.", effect: "15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active.", sustained: true },
  { name: "Gravity Well ×2", kinetic: "Gravikinesis", attr: "INT", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — a deeper well.", effect: "15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Graviton Burst", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "A burst of crushing force.", effect: "20-ft radius; auto-hits for 3d6 + INT force; pull to center + prone.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "force", area: "20-ft radius" } },
  { name: "Reverse Gravity", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Flip gravity upward.", effect: "20-ft area; enemies fall upward then crash down — prone + 2d6 + INT.", aoe: true, damage: { dice: "2d6", mod: "INT", type: "force", area: "20-ft radius" } },
  { name: "Gravity Well ×5", kinetic: "Gravikinesis", attr: "INT", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — a straining well.", effect: "20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn.", sustained: true, buff: { dsFromMod: "INT" } },
  { name: "Singularity", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 32, action: "Action", desc: "Collapse space to a point.", effect: "40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted.", aoe: true, damage: { dice: "6d6", mod: "INT", type: "force", area: "40-ft radius" } },
  { name: "Gravity Prison", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 20, action: "Action", desc: "Pin a foe in crushing gravity.", effect: "A target is crushed into stasis: Frozen (pinned) + 3d6/turn." },
  { name: "Gravity Well ×10", kinetic: "Gravikinesis", attr: "INT", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — a black hole.", effect: "40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move.", sustained: true, buff: { dsFromMod: "INT" } },
  // Chronokinesis (Controller)
  { name: "Accelerate", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 8, action: "Bonus Action", desc: "Speed an ally through time.", effect: "An ally takes one extra action this turn." },
  { name: "Temporal Lock", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 6, action: "Action", desc: "Lock a foe in a time-loop.", effect: "Range 30 ft; target Rooted and loses reactions." },
  { name: "Slow Time ×2", kinetic: "Chronokinesis", attr: "INT", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper slow.", effect: "15-ft area Slowed + enemies lose reactions. Self-cost: you are Slowed next turn." },
  { name: "Temporal Rift", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 16, action: "Action", desc: "Tear open time.", effect: "20-ft radius; auto-hits for 3d6 + INT temporal; Slowed.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "temporal", area: "20-ft radius" } },
  { name: "Haste Field", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 12, upkeep: 6, action: "Bonus Action", desc: "A field of accelerated time.", effect: "Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active.", sustained: true },
  { name: "Slow Time ×5", kinetic: "Chronokinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "Signature — near-stop.", effect: "20-ft area: enemies Stunned 1 turn. Self-cost: you lose your next turn." },
  { name: "Paradox", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 24, action: "Action", desc: "Create a paradox.", effect: "Negate a target's last action entirely + 3d6 + INT." },
  { name: "Rewind Death", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 24, action: "Action", desc: "Rewind a death.", effect: "Rewind a fallen ally to before they died — revive to full HP." },
  { name: "Slow Time ×10", kinetic: "Chronokinesis", attr: "INT", tier: "Master", kp: 30, action: "Action", desc: "Signature capstone — stop time.", effect: "Take 3 consecutive turns while all else is frozen (damage lands when time resumes). Self-cost: you are Stunned when it ends." },
  // Biokinesis (Healer)
  { name: "Necrosis", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 7, action: "Action", desc: "Rot living tissue.", effect: "Range 30 ft; 2d6 + INT necrotic; the target can't heal for 1 turn.", damage: { dice: "2d6", mod: "INT", type: "necrotic", range: "30 ft" } },
  { name: "Mutate", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 6, action: "Bonus Action", desc: "Grant a mutation.", effect: "Grant an ally a boon for the fight: +2 an attribute, natural weapons (1d8), or +move." },
  { name: "Regenesis ×2", kinetic: "Biokinesis", attr: "INT", tier: "Adept", kp: 9, action: "Action", desc: "Signature — deeper regrowth.", effect: "Heal 2d8 + INT, end 2 conditions, and revive a downed ally to half HP.", heal: { dice: "2d8", mod: "INT" } },
  { name: "Plague", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 16, action: "Action", desc: "Spread a virulent plague.", effect: "15-ft radius; auto-hits for 3d6 + INT poison; enemies Weakened and can't heal.", aoe: true, damage: { dice: "3d6", mod: "INT", type: "poison", area: "15-ft radius" } },
  { name: "Graft", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 14, action: "Action", desc: "Regrow and cure.", effect: "Regrow a lost limb / cure any disease or condition permanently, and heal 3d6 + INT.", heal: { dice: "3d6", mod: "INT" } },
  { name: "Regenesis ×5", kinetic: "Biokinesis", attr: "INT", tier: "Expert", kp: 18, action: "Action", desc: "Signature — regrowth for all.", effect: "Heal all allies within 20 ft 3d6 + INT + regeneration; revive any downed among them.", heal: { dice: "3d6", mod: "INT" } },
  { name: "Extinction", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 30, action: "Action", desc: "Unleash cellular death.", effect: "40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal.", aoe: true, damage: { dice: "6d6", mod: "INT", type: "necrotic", area: "40-ft radius" } },
  { name: "Apotheosis", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 26, action: "Action", desc: "Perfect an ally.", effect: "Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions." },
  { name: "Regenesis ×10", kinetic: "Biokinesis", attr: "INT", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — life from a cell.", effect: "Regrow a body from a single cell — fully resurrect a dead ally to full HP/KP, restored perfectly." },

  // ---- WIS · Third Eye ----
  // Demokinesis (Tank)
  { name: "Terrify", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Project overwhelming dread.", effect: "15-ft radius; enemies Feared." },
  { name: "Life Leech", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Drain life.", effect: "Range 30 ft; 2d6 + WIS necrotic; heal yourself half.", damage: { dice: "2d6", mod: "WIS", type: "necrotic", range: "30 ft" } },
  { name: "Demon Form ×2", kinetic: "Demokinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — greater demon.", effect: "+4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn.", sustained: true, buff: { attrFlat: { STR: 4, WIS: 4 }, dsFromMod: "WIS" } },
  { name: "Hellstorm", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 18, action: "Action", desc: "A storm of hellfire.", effect: "20-ft radius; auto-hits for 3d6 + WIS necrotic; Feared.", aoe: true, damage: { dice: "3d6", mod: "WIS", type: "necrotic", area: "20-ft radius" } },
  { name: "Devour", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Devour a foe's essence.", effect: "Melee; 4d6 + WIS; heal equal to the damage dealt.", damage: { dice: "4d6", mod: "WIS", type: "necrotic" } },
  { name: "Demon Form ×5", kinetic: "Demokinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — monstrous power.", effect: "+8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption).", sustained: true, buff: { attrFlat: { STR: 8, WIS: 8 }, dsFromMod: "WIS" } },
  { name: "Apocalypse", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Herald the end.", effect: "40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "necrotic", area: "40-ft radius" } },
  { name: "Pact of Ruin", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 22, action: "Reaction", desc: "Unleash the demon on death.", effect: "When you drop to 0 HP, return to half HP and deal 4d6 to all enemies within 20 ft. Once per long rest." },
  { name: "Demon Form ×10", kinetic: "Demokinesis", attr: "WIS", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — full demon.", effect: "+15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon).", sustained: true, buff: { attrFlat: { STR: 15, WIS: 15 }, dsFromMod: "WIS" } },
  // Naturakinesis (Controller)
  { name: "Poison Spores", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Release toxic spores.", effect: "15-ft radius; auto-hits for 2d6 + WIS poison; enemies Weakened.", aoe: true, damage: { dice: "2d6", mod: "WIS", type: "poison", area: "15-ft radius" } },
  { name: "Grasping Roots", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 7, action: "Action", desc: "Roots erupt from the ground.", effect: "15-ft radius; enemies Rooted." },
  { name: "Bloom ×2", kinetic: "Naturakinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — a growing garden.", effect: "15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft.", sustained: true },
  { name: "Thornstorm", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 18, action: "Action", desc: "A storm of thorns.", effect: "20-ft radius; auto-hits for 3d6 + WIS piercing; Rooted.", aoe: true, damage: { dice: "3d6", mod: "WIS", type: "piercing", area: "20-ft radius" } },
  { name: "Wall of Thorns", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 14, upkeep: 7, action: "Bonus Action", desc: "A wall of thorns.", effect: "30-ft thorn wall; crossing deals 3d6 and Roots while active.", sustained: true },
  { name: "Bloom ×5", kinetic: "Naturakinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — a flourishing grove.", effect: "20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft.", sustained: true },
  { name: "Primeval Forest", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Summon a primeval forest.", effect: "40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "piercing", area: "40-ft radius" } },
  { name: "World Tree", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 24, upkeep: 10, action: "Bonus Action", desc: "Grow a world tree.", effect: "Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active.", sustained: true },
  { name: "Bloom ×10", kinetic: "Naturakinesis", attr: "WIS", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — nature reclaims all.", effect: "40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart.", sustained: true },
  // Holykinesis (Healer)
  { name: "Radiant Beam", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 6, action: "Action", desc: "A beam of holy light.", effect: "Range 50 ft; 2d6 + WIS radiant damage.", damage: { dice: "2d6", mod: "WIS", type: "radiant", range: "50 ft" } },
  { name: "Greater Blessing", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "Bless your allies.", effect: "Allies within 15 ft gain +1d4 to attacks and saves while active.", sustained: true },
  { name: "Sanctuary ×2", kinetic: "Holykinesis", attr: "WIS", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — greater sanctuary.", effect: "15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn.", sustained: true },
  { name: "Judgment", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Pass divine judgment.", effect: "4d6 + WIS radiant to a target (double vs undead/evil).", damage: { dice: "4d6", mod: "WIS", type: "radiant" } },
  { name: "Resurrection", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 16, action: "Action", desc: "Restore the fallen.", effect: "Revive a dead ally to half HP and cleanse." },
  { name: "Sanctuary ×5", kinetic: "Holykinesis", attr: "WIS", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — hallowed ground.", effect: "20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded.", sustained: true },
  { name: "Divine Judgment", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 32, action: "Action", desc: "Call down judgment on all.", effect: "40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6.", aoe: true, damage: { dice: "6d6", mod: "WIS", type: "radiant", area: "40-ft radius" } },
  { name: "Miracle", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 26, action: "Action", desc: "Work a miracle.", effect: "Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn." },
  { name: "Sanctuary ×10", kinetic: "Holykinesis", attr: "WIS", tier: "Master", kp: 26, action: "Action", desc: "Signature capstone — divine domain.", effect: "40-ft domain: allies fully healed each turn, revived if they fall, immune to harm; enemies take 4d6 radiant/turn + Blinded. You cannot move or act while it stands." },

  // ---- CHA · Throat ----
  // Sonikinesis (Tank)
  { name: "Thunderclap", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 8, action: "Action", desc: "A concussive clap.", effect: "15-ft radius; auto-hits for 2d6 + CHA thunder; push 10 ft + Shocked.", aoe: true, damage: { dice: "2d6", mod: "CHA", type: "thunder", area: "15-ft radius" } },
  { name: "Anthem", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 7, upkeep: 4, action: "Bonus Action", desc: "A rallying anthem.", effect: "Allies within 15 ft gain +CHA to DS and +1d4 attacks while active.", sustained: true },
  { name: "Crescendo ×2", kinetic: "Sonikinesis", attr: "CHA", tier: "Adept", kp: 9, upkeep: 5, action: "Bonus Action", desc: "Signature — rising resonance.", effect: "Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes.", sustained: true, buff: { dsFromMod: "CHA" } },
  { name: "Shatter", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 16, action: "Action", desc: "Hit the resonant frequency.", effect: "4d6 + CHA thunder to a target; ignores DR and armor.", damage: { dice: "4d6", mod: "CHA", type: "thunder" } },
  { name: "Deafening Roar", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 12, action: "Action", desc: "A deafening roar.", effect: "15-ft radius; enemies Stunned 1 turn." },
  { name: "Crescendo ×5", kinetic: "Sonikinesis", attr: "CHA", tier: "Expert", kp: 18, upkeep: 9, action: "Bonus Action", desc: "Signature — overwhelming sound.", effect: "Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too.", sustained: true, buff: { dsFromMod: "CHA" } },
  { name: "Sonic Boom", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "A devastating boom.", effect: "40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "thunder", area: "40-ft radius" } },
  { name: "Unbreakable Anthem", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 22, action: "Bonus Action", desc: "A song that sustains.", effect: "Allies within 30 ft can't drop below 1 HP for 2 turns and are immune to conditions." },
  { name: "Crescendo ×10", kinetic: "Sonikinesis", attr: "CHA", tier: "Master", kp: 26, upkeep: 8, action: "Bonus Action", desc: "Signature capstone — world-shaking climax.", effect: "40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions.", sustained: true, buff: { dsFromMod: "CHA" } },
  // Lumokinesis (Controller)
  { name: "Laser", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "A focused beam.", effect: "Range 60 ft line; 2d6 + CHA radiant; ignores partial cover.", damage: { dice: "2d6", mod: "CHA", type: "radiant", range: "60 ft" } },
  { name: "Hologram", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "A decoy of light.", effect: "Create a decoy that draws an attack — an enemy wastes its next attack on the illusion." },
  { name: "Radiance ×2", kinetic: "Lumokinesis", attr: "CHA", tier: "Adept", kp: 9, upkeep: 5, action: "Action", desc: "Signature — spreading light.", effect: "15-ft light: Blinded + 2d6/turn; spreads 5 ft.", sustained: true },
  { name: "Prism Beam", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "A splitting prism beam.", effect: "20-ft radius; auto-hits for 3d6 + CHA radiant; Blinded.", aoe: true, damage: { dice: "3d6", mod: "CHA", type: "radiant", area: "20-ft radius" } },
  { name: "Illusory Army", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 14, action: "Action", desc: "Conjure an army of light.", effect: "15-ft radius; illusory duplicates confuse enemies — Feared (disadvantage) 1 turn." },
  { name: "Radiance ×5", kinetic: "Lumokinesis", attr: "CHA", tier: "Expert", kp: 18, upkeep: 9, action: "Action", desc: "Signature — overwhelming light.", effect: "20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded.", sustained: true },
  { name: "Second Sun", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "Ignite a second sun.", effect: "40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "radiant", area: "40-ft radius" } },
  { name: "Grand Illusion", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 24, action: "Action", desc: "Reshape perception.", effect: "30-ft radius; enemies Feared and strike wrong targets (confusion) 1 turn." },
  { name: "Radiance ×10", kinetic: "Lumokinesis", attr: "CHA", tier: "Master", kp: 26, upkeep: 8, action: "Action", desc: "Signature capstone — a blinding sun.", effect: "40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light.", sustained: true },
  // Spirikinesis (Healer)
  { name: "Vengeful Spirit", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 6, action: "Action", desc: "Send a vengeful spirit.", effect: "Range 40 ft; 2d6 + CHA spectral damage.", damage: { dice: "2d6", mod: "CHA", type: "spectral", range: "40 ft" } },
  { name: "Mend Soul", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 7, action: "Action", desc: "Mend a wounded soul.", effect: "Heal an ally 2d6 + CHA and end one condition.", heal: { dice: "2d6", mod: "CHA" } },
  { name: "Soul Tether ×2", kinetic: "Spirikinesis", attr: "CHA", tier: "Adept", kp: 9, action: "Action", desc: "Signature — anchor more souls.", effect: "Tether up to 2 allies (stay at 1 HP once), or revive one downed to half HP. Self-cost: take 1d6 spectral." },
  { name: "Spirit Storm", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "A storm of spirits.", effect: "20-ft radius; auto-hits for 3d6 + CHA spectral; Feared.", aoe: true, damage: { dice: "3d6", mod: "CHA", type: "spectral", area: "20-ft radius" } },
  { name: "Possession", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 16, action: "Action", desc: "Possess a foe.", effect: "Briefly possess an enemy: it is Stunned and you redirect its next action." },
  { name: "Soul Tether ×5", kinetic: "Spirikinesis", attr: "CHA", tier: "Expert", kp: 18, action: "Action", desc: "Signature — tether the party.", effect: "Tether all allies within 20 ft (stay at 1 HP once) or revive downed among them. Self-cost: 1d6 spectral + Throat chakra takes 1 hit." },
  { name: "Wrath of the Dead", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 32, action: "Action", desc: "Unleash the vengeful dead.", effect: "40-ft radius; auto-hits for 6d6 + CHA spectral; Feared.", aoe: true, damage: { dice: "6d6", mod: "CHA", type: "spectral", area: "40-ft radius" } },
  { name: "Afterlife's Guard", kinetic: "Spirikinesis", attr: "CHA", tier: "Master", kp: 22, upkeep: 10, action: "Bonus Action", desc: "The dead guard the living.", effect: "Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active.", sustained: true },
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
    startWeaponTypes: ["Archery", "Firearms", "Explosives", "Volatile Weapons"], // ranged-focused
    skills: [
      { name: "Marksmanship", action: "Bonus Action", calledShot: true, effect: "After you make a ranged attack (weapon or technique), but before rolling its damage, spend your Bonus Action to aim a called shot at one of the target's limbs. Roll a skill check using that attack's attribute (+ proficiency); the GM sets the DC by the target's size and difficulty. On a success the shot strikes the chosen limb — apply the attack's damage there." },
      { name: "Suppressing Fire", action: "Action", effect: "Rake a 15-ft area with fire; enemies there have disadvantage on attacks until your next turn." },
      { name: "Quick Draw", action: "Bonus Action", effect: "Draw or holster a weapon for free, then make a ranged attack with it." },
      { name: "Counter-Fire", action: "Reaction", effect: "When a creature you can see makes a ranged attack, make a ranged attack against it." },
      { name: "Trick Shot", action: "Action", effect: "A ranged attack that, on a hit, also disarms the target or knocks it prone." },
      { name: "Deadeye", action: "Passive", effect: "Once per turn you may reroll one ranged damage die showing 1 or 2, and your ranged attacks ignore half cover." },
    ] },
  { name: "Flowing Movement", heritage: "South America",
    blurb: "Jungle-forged agility — never where the blow lands, always moving.",
    startWeaponTypes: ["Light Weapons", "Quick Weapons", "Thrown Weapons"], // agile
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
    startWeaponTypes: ["Heavy Weapons", "Light Weapons"], // knightly melee
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
    startWeaponTypes: ["Finesse Weapons", "Light Weapons"], // finesse blades
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
    startWeaponTypes: ["Heavy Weapons", "Fist Weapons"], // bulwark
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
    startWeaponTypes: ["Light Weapons", "Finesse Weapons"], // curved blades
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
    startWeaponTypes: ["Fist Weapons"], // unarmed
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
    startWeaponTypes: ["Light Weapons", "Quick Weapons", "Finesse Weapons"], // one-handed friendly
    twoWeapon: true, // starting gear: one two-handed weapon OR two one-handed weapons
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
    // Carry every field on the skill (name/action/effect + flags like calledShot), tagging its style.
    return Object.assign({}, sk, { style: st.name });
  }));
}, []);

/* --- Regional Heritages (old-world ancestry; replaces a race system) ---- */
/* Grants ONE Fighting Style, 2 active combat skills from it, that style's Passive,
   and 2 roleplay traits. No attribute changes. Chosen before Attributes. */
PC.HERITAGES = [
  { name: "North America", blurb: "Rugged frontier stock — self-reliant survivors of the wild expanse.",
    fightingStyle: "Frontier Gunslinging", combatSkills: ["Marksmanship", "Suppressing Fire"], armorProf: ["Medium"],  // classes beyond the universal Light
    traits: [ { name: "Frontier Grit", desc: "Advantage on Survival checks in the wilderness." },
              { name: "Scavenger", desc: "Advantage on checks to jury-rig or repair with salvaged parts." } ],
    flaw: { name: "Rough Around the Edges", desc: "Frontier manners grate on polished company. Disadvantage on Etiquette.", disadvSkill: "Etiquette" } },
  { name: "South America", blurb: "Jungle-forged and resourceful, at home in dense, untamed country.",
    fightingStyle: "Flowing Movement", combatSkills: ["Combat Roll", "Dodge Roll"], armorProf: [],  // classes beyond the universal Light
    traits: [ { name: "Jungle-Born", desc: "Advantage on Acrobatics and moving through natural difficult terrain." },
              { name: "Herbal Lore", desc: "Advantage on Herbalism; identify plants and toxins at a glance." } ],
    flaw: { name: "Untamed", desc: "Old-world machinery is alien to you. Disadvantage on Technology.", disadvSkill: "Technology" } },
  { name: "Europe", blurb: "Heirs to a long, disciplined martial tradition.",
    fightingStyle: "Chivalric Swordplay", combatSkills: ["Riposte", "Power Attack"], armorProf: ["Medium", "Heavy"],  // classes beyond the universal Light
    traits: [ { name: "Martial Heritage", desc: "You gain one additional weapon-type proficiency.", grant: { kind: "weapon" } },
              { name: "Old-World Scholar", desc: "You speak an extra old-world language; advantage on Etiquette." } ],
    flaw: { name: "Rigid Form", desc: "Disciplined stances resist improvisation. Disadvantage on Acrobatics.", disadvSkill: "Acrobatics" } },
  { name: "United Kingdom", blurb: "Stoic and tactical, unshaken under pressure.",
    fightingStyle: "Fencing", combatSkills: ["Parry", "Feint"], armorProf: ["Medium"],  // classes beyond the universal Light
    traits: [ { name: "Stiff Upper Lip", desc: "Advantage on checks and saves to resist Fear." },
              { name: "Composed", desc: "Advantage on Insight to read a tense situation." } ],
    flaw: { name: "Too Polite", desc: "You'd sooner reason than menace. Disadvantage on Intimidation.", disadvSkill: "Intimidation" } },
  { name: "Africa", blurb: "Enduring and community-strong, forged by hardship and kinship.",
    fightingStyle: "Warden's Bulwark", combatSkills: ["Guardian", "Bracing Stance"], armorProf: ["Medium", "Heavy"],  // classes beyond the universal Light
    traits: [ { name: "Enduring", desc: "Advantage on Hardiness and checks to resist exhaustion." },
              { name: "Kinship", desc: "Advantage on Persuasion within a community; rally to stabilize a downed ally." } ],
    flaw: { name: "Immovable", desc: "Built to hold ground, not to slink past it. Disadvantage on Stealth.", disadvSkill: "Stealth" } },
  { name: "Middle East", blurb: "Resilient warrior-traders, sharp of eye and tongue.",
    fightingStyle: "Desert Whirlwind", combatSkills: ["Spinning Cut", "Deflecting Slash"], armorProf: ["Medium"],  // classes beyond the universal Light
    traits: [ { name: "Shrewd Trader", desc: "Advantage on Barter." },
              { name: "Desert-Hardened", desc: "Resist extreme heat and thirst; advantage on Tolerance vs. environment." } ],
    flaw: { name: "Eye for the Deal", desc: "You weigh profit before portents. Disadvantage on Paranormal.", disadvSkill: "Paranormal" } },
  { name: "East Asia", blurb: "Honed by generations of martial discipline and focus.",
    fightingStyle: "Way of the Open Hand", combatSkills: ["Palm Strike", "Deflect"], armorProf: [],  // classes beyond the universal Light
    traits: [ { name: "Inner Focus", desc: "Advantage on Concentration checks." },
              { name: "Disciplined", desc: "You speak an extra language; advantage on precise, patient tasks." } ],
    flaw: { name: "Reserved", desc: "Discipline over showmanship. Disadvantage on Performance.", disadvSkill: "Performance" } },
  { name: "Oceania", blurb: "Seafaring and adaptable, thriving between island and open water.",
    fightingStyle: "Twin Fang", combatSkills: ["Twin Strike", "Rapid Slash"], armorProf: [],  // classes beyond the universal Light
    traits: [ { name: "Seafarer", desc: "Advantage to swim, sail, or navigate water; hold your breath long." },
              { name: "Adaptable", desc: "You gain one extra skill proficiency of your choice.", grant: { kind: "skill" } } ],
    flaw: { name: "Far From the Archives", desc: "Island life kept the old-world academies at arm's length. Disadvantage on History.", disadvSkill: "History" } },
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
