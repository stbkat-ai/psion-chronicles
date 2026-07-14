# Psion Chronicles — Game Rules

> Living rules document for the Psion Chronicles TTRPG companion app.
> Source of truth = **The Psion Chronicles Players Guide** (Luke's PDF, 31 pages, Chapter One).
> Built collaboratively with Luke. Anything marked **[TBD]** or **[NOT IN GUIDE YET]** needs Luke's input.

---

## Setting (flavor)
Post-apocalyptic "Post-Veil" world. Characters awaken psionic/kinetic powers. Their
"Psionic Background" = who they were in the **old world** before the Veil fell.

---

## Chapter One — Character Creation

### The Character Sheet (what the app must hold)
- **Page 1 (front):** name, Psionic Background, **Soul Level**, experience, **Body / Mind / Soul pools**, attribute scores + modifiers, quick-reference combat actions, **chakra chart**, attribute save modifiers, **Defense Score**.
- **Page 2:** Skills list — proficiency checkbox per skill, which attribute modifies it, the tracked modifier.
- **Core pages:** **Kinetic Techniques (KT)** the character knows — name, which Kinetic it belongs to, effects & rules.
- **Inventory:** carry weight + equipped/carried items.
- **Notes:** appearance, backstory, campaign journal.

---

## Section 2 — Attributes

Six attributes, split Body / Mind:

| Group | Attribute | Governs |
|---|---|---|
| **Body** | **STR** (Strength) | unarmed damage, climbing speed, jump distance |
| **Body** | **AGI** (Agility) | movement speed, initiative, unarmored Defense Score (with CON) |
| **Body** | **CON** (Constitution) | swimming speed, carry weight, Defense Score (with AGI) |
| **Mind** | **INT** (Intelligence) | crafting & repair time |
| **Mind** | **WIS** (Wisdom) | understanding of the world *(mechanics TBD)* |
| **Mind** | **CHA** (Charisma) | charming others *(mechanics TBD)* |

### Pools (layered model)
Every pool = **base + permanent boosts + temporary modifiers**:
- **Base** = the raw stat sum (Body Pool base = STR+AGI+CON; Mind Pool base = INT+WIS+CHA)
- **+ Permanent boosts** = Psionic Background bonus (e.g. Body Builder Body +10) **and choices made as you level up**
- **+ Temporary modifiers** = granted by certain skills, spells (Kinetic Techniques), and objects; these come and go
- *App must track: computed base, a list of permanent boosts (source-labeled), a list of active temporary modifiers (toggleable), and the current/spent value separately from max.*

- **Body Pool = STR + AGI + CON** (+ boosts/mods) = **HP**
- **Mind Pool = INT + WIS + CHA** (+ boosts/mods) = **KP (Ki Points / Mana)**
- **Soul Pool = experience points / character level** (CONFIRMED Luke) — this is the XP + **Soul Level** track, *not* a spendable combat resource like HP/KP.
- *Example: STR15/AGI12/CON13 → Body Pool base 40. INT22/WIS18/CHA16 → Mind Pool base 56.*

### Recovery (CONFIRMED Luke)
Both **HP (Body Pool)** and **KP (Mind Pool)** recover the same ways:
- **Items**, **skill checks**, **Kinetic Techniques (spells)**, **short rest**, and **long rest**.
- *(Exact amounts per method — e.g. how much a short vs. long rest restores — TBD.)*
> **CONFIRMED (Luke):** **Body Pool = HP** and **Mind Pool = KP (Ki Points / "Mana")**.
> The pool total (base + permanent boosts + temporary mods) = your **max**. Track **current / max**
> — current HP depletes when damaged; current KP depletes when spending on Kinetic Techniques.
> Recovery rules still TBD. Soul Pool still TBD.

### Generating attribute scores
1. Roll **8d12**.
2. Remove the **two lowest** values (keep 6).
3. **Add 10** to each of the 6 remaining values.
4. Assign each result to an attribute.
- *Example: rolls 12,8,10,11,5,2,7,1 → drop 2 & 1 → 12,11,10,8,7,5 → +10 → 22,21,20,18,17,15.*

### Attribute modifiers
- Attributes **soft-capped at 30** (items/techniques can exceed it; modifiers keep scaling).
- 3-to-1 scale: 30 = +5, 15 = 0, 1 = −5.

| Score | Mod |
|---|---|
| 30 | +5 |
| 27–29 | +4 |
| 24–26 | +3 |
| 21–23 | +2 |
| 18–20 | +1 |
| 15–16 | 0 |
| 12–14 | −1 |
| 9–11 | −2 |
| 6–8 | −3 |
| 3–5 | −4 |
| 1–2 | −5 |

### Per-attribute derived stats
- **STR** — Unarmed damage *(value TBD)*; Climbing speed = **15 ft ± 5 ft per STR mod**; Jump distance = **15 ft ± 5 ft per STR mod**.
- **AGI** — Movement speed = **30 ft ± 5 ft per AGI mod**; Initiative = d?? **+ AGI mod**; Unarmored **Defense Score = 10 + AGI mod + CON mod**.
- **CON** — Swimming speed = **15 ft ± 5 ft per CON mod**; Carry weight = **100 lb ± 10 lb per CON mod**; contributes to Defense Score.
- **INT** — Crafting & repair time *(scaling TBD)*.
- **WIS / CHA** — narrative for now; check mechanics TBD.

### Defense Score (DS)
- Unarmored **DS = 10 + AGI mod + CON mod** (armor rules TBD).

### Limb Damage (CONFIRMED Luke) — called-shot / crippling system
A third tracking system (Fallout-style). Every character/monster has **6 limbs**, each with its own limb-HP.
- **Limb HP** = a fraction of max HP: **Head ¼ · Torso ½ · each Arm ¼ · each Leg ¼** (rounded up; scales with max HP).
- **Called shots** (e.g. **Marksmanship**, or special attacks) target a specific limb. The damage is applied
  to **both the limb AND main HP, capped at the limb's current HP** — any **excess is lost** (you can't
  overkill a small limb to bypass HP). Untargeted attacks hit HP normally and don't touch limbs.
- At **0 limb HP the limb is Crippled**:
  | Limb | Crippled effect |
  |---|---|
  | Head | Concussed — disadvantage on Mind (INT/WIS/CHA) checks & technique attacks |
  | Torso | Grievously wounded — Weakened; bleed 1d4 HP at start of each turn |
  | Arm (one) | Disadvantage on weapon attacks; no two-handed weapons |
  | Both Arms | Cannot make weapon attacks |
  | Leg (one) | Movement halved |
  | Both Legs | Movement 0 (prone/crawl) |
- **Healing:** long rest fully restores all limbs; short rest restores half of each limb's max; Medicine /
  healing techniques can also restore limb HP.
- *App:* the **Limbs tab** tracks all six; leg/arm/head crippled effects auto-apply to movement and to
  attack/skill/technique rolls (disadvantage/blocked); torso bleed/Weakened is shown as a GM note.

### Chakra Chart (CONFIRMED Luke) — a separate health system
A **second health track**, independent of HP. There are **6 chakra points**, one tied to each attribute.
**Each chakra can take up to 4 hits**, with escalating penalties to *everything that uses that attribute*
(attacks, skills, and techniques):

### The 6 Chakras (CONFIRMED Luke)
| Attribute | Chakra | Location | Theme |
|---|---|---|---|
| **STR** | **Core** (Solar Plexus) | upper abdomen | Raw power & willpower |
| **AGI** | **Sacral** | lower belly | Movement, flow, reflexes |
| **CON** | **Root** | base of spine | Survival, endurance, grounding |
| **CHA** | **Throat** | throat | Voice & expression |
| **WIS** | **Third Eye** | brow | Insight, awareness, intuition |
| **INT** | **Crown** | top of head | Knowledge, logic, higher mind |

Each Kinetic inherits its chakra from its governing attribute (e.g. all STR Kinetics — Robukinesis,
Pyrokinesis, Electrokinesis — are tied to the **Core** chakra). Hitting a chakra therefore weakens both
that attribute's rolls **and** all its Kinetics.


| Hits on a chakra | Effect on that attribute's attacks / skills / techniques |
|---|---|
| **1st hit** | **Disadvantage** on all of them |
| **2nd hit** | Attribute modifier **halved** (rounded up) |
| **3rd hit** | Attribute modifier **removed entirely** (treated as 0) |
| **4th hit** | **Locked out** — can no longer use any skill/attack/technique tied to that attribute |

- App: show 6 chakras × 4 pips; as pips fill, **automatically apply** disadvantage flags, halved/zeroed
  mods, and lockouts to the affected attribute's rolls and technique availability.
- **How chakras take hits (CONFIRMED Luke):** specialized attacks and techniques that target chakras;
  **some techniques also damage the user's *own* chakra when used** (a self-cost — app must support a
  technique dealing chakra damage to its caster).
- **Chakra recovery (CONFIRMED Luke):** rest heals **every damaged chakra** — **short rest = +1 hit healed
  on each damaged chakra**, **long rest = +2 on each**. (If several chakras are hurt, they all recover together.)
  Some items/techniques may also heal chakra.
- **Kinetics link to chakras (CONFIRMED):** each Kinetic is tied to its attribute's chakra (see the
  6-chakra table above). A chakra hit penalizes that attribute's Kinetics too (they use attribute mods).

### Proficiency bonus (by Soul Level)
- **+3** at level 1 → **+4** at level 15 → **+5** at level 30.

---

## Leveling / Soul Level (CONFIRMED Luke)
- **How you level:** XP **threshold** system (Soul Pool = XP). Exact XP-per-level numbers **TBD** ("threshold, numbers not set yet").
- **Level cap: 30.**
- **Every level:** gain **1 Technique Point (TP)** — spent to learn Kinetic Techniques. **Every technique costs exactly 1 TP** (no tiered costs).
- **Every ODD level** (3, 5, 7 … up the ladder): gain **1 attribute point** — place in any attribute. Leveling **cannot** raise an attribute above **30** (skills, artifacts, etc. *can* push past 30).
- **Milestone levels** grant special new systems. Known: **Level 15 unlocks the Otherkin system** (see below).

### At character creation (level 1)
- **1 free beginner technique** from your Psionic Background, **plus 2 additional Kinetic Techniques of the player's choice from ANY type.** (So a new character starts knowing **3 techniques**.)
- **No Technique Point at level 1** (CONFIRMED Luke) — the 2 chosen techniques ARE your level-1 grant.
  You earn **+1 TP every level from level 2 onward** (so by level 30 you've gained 29 TP total).

### Technique tiers (CONFIRMED Luke)
- Techniques come in tiers, starting at **Beginner** (higher tiers exist — names TBD).
- A character's **Soul Level gates which tier they may learn/buy.** *(Exact tier→level gates TBD.)*

### Two point currencies — keep separate!
- **KP = Ki Points** — the **Mana** bar (= Mind Pool). Spent to *use* techniques in play; recovers via rest/items/etc.
- **TP = Technique Points** — earned **+1 per level**. Spent to *permanently learn* techniques (1 TP each). Not a combat resource.

### Otherkin System (unlocks at Soul Level 15)
- Your **Soul Creature** — a being that has lived in your soul since creation.
- Examples: **dragon, phoenix, werewolf, vampire, sprite, fairy**, etc.
- *[Mechanics TBD: what the Soul Creature grants, how it's chosen, how it's used.]*

---

## Section 3 — Psionic Backgrounds (9)

Each Background grants: **attribute boost** (either +3 to one, or +2/+1 split), a **pool boost**
(Body +10, Mind +10, or +5/+5), **3 skill proficiencies**, **2 combat proficiencies** (weapon
type and/or Kinetic type), and **1 free beginner Kinetic Technique**.

| Background | Old-world identity | Attr boost | Pool boost | Skill profs | Combat profs | Free KT |
|---|---|---|---|---|---|---|
| **Body Builder** | Gym rat | +3 STR | Body +10 | Muscle, Athletics, Force | Heavy Weapons, **Robukinesis** | Ki Strike |
| **Assassin** | Killer for hire | +3 AGI | Body +10 | Stealth, Sleight of Hand, Marksmanship | Thrown Weapons, **Umbrakinesis** | Shroud of Shadows |
| **Survivalist** | Outdoorsman | +3 CON | Body +10 | Survival, Tolerance, Hardiness | Firearms, **Terrakinesis** | Mud Skin |
| **Scholar** | Bookworm | +3 INT | Mind +10 | History, Language, Technology | Tech Weapons, **Chronokinesis** | Slow Time |
| **Witch** | Wiccan/mystic | +3 WIS | Mind +10 | Paranormal, Herbalism, Nature Tools | Channel Weapons, **Naturakinesis** | Thistle Bush |
| **Musician** | Traveling musician | +3 CHA | Mind +10 | Music, Persuasion, Performance | Rapiers*, **Sonikinesis** | *(TBD — Sonikinesis beginner; old "Static Touch" was Electro, retired)* |
| **Soldier** | Military/mercenary | +2 STR, +1 INT | Body +5, Mind +5 | Laborer's Tools, Intimidation, Medicine | Laser Guns, **Pyrokinesis** | Firebolt |
| **Monk** | Loner martial artist | +2 AGI, +1 WIS | Body +5, Mind +5 | Acrobatics, Reflex, Awareness | Staffs, **Aerokinesis** | Gust |
| **Guru** | Spiritual leader | +2 CON, +1 CHA | Body +5, Mind +5 | Concentration, Adrenaline, Etiquette | Handguns, **Spirikinesis** | Phantom Presence |

\* "Rapiers" listed under Musician; note the CHA weapon types in Section 5 are Finesse/Art/Noise — reconcile with Luke.

---

## Section 4 — Skills

Skill check = roll **d20 + governing-attribute mod** (+ proficiency bonus if proficient).
Backgrounds grant 3 skill profs; player picks **2 more** at creation.

**STR:** Muscle, Laborer's Tools, Intimidation, Athletics, Grapple, Force
**AGI:** Acrobatics, Stealth, Sleight of Hand, Deft Tools, Reflex, Marksmanship
**CON:** Survival, Adrenaline, Concentration, Tolerance, Fortitude, Hardiness
**INT:** Investigation, Medicine, History, Mythology, Technology, Language
**WIS:** Paranormal, Herbalism, Zoology, Awareness, Insight, Nature Tools
**CHA:** Music, Persuasion, Deception, Performance, Etiquette, Barter

*(Full descriptions in guide pp.13–15 — preserved for the compendium.)*

### No attribute saves (CONFIRMED Luke)
Psion Chronicles has **no separate "saving throw" system.** Where other games call for a save, Psion
Chronicles uses the **specific skill** that fits the situation (e.g. **Reflex** to dodge, **Fortitude** to
soak a blow, **Tolerance** vs. poison/disease, **Concentration** to keep focus, **Insight** vs. deception).
> The Player's Guide's page-1 "attribute save modifiers" block is **superseded** — the app should show
> skill checks instead of a saves block.

---

## Section 5 — Combat Proficiencies / Weapon Types

A character may be proficient in a **weapon type** (covers all its subtypes) or just a **subtype**.
Each weapon type adds a specific attribute mod to its damage rolls.

| Governing attr | Weapon Type | Subtypes |
|---|---|---|
| **STR** | Heavy Weapons | Great Hammers, Great Swords, Great Axes, Maces, Axes |
| **STR** | Archery | Longbows, Shortbows, Slings, Slingshots |
| **STR** | Fist Weapons | Knuckles, Full Fists, Knuckle Blades |
| **AGI** | Light Weapons | Knives, Daggers, Batons, Short Swords |
| **AGI** | Quick Weapons | Tonfa, Wrist Blades, Hand Crossbows, Blowguns |
| **AGI** | Thrown Weapons | Shuriken, Throwing Knives, Darts |
| **CON** | Firearms | Rifles, Handguns, Revolvers |
| **CON** | Explosives | Grenades, Mines, Improvised Explosives |
| **CON** | Volatile Weapons | Flamethrowers, Rocket Launchers, Chemical Weapons |
| **INT** | Laser Weapons | Blaster Rifles, Blaster Pistols, Laser Swords |
| **INT** | Plasma Weapons | Beam Rifles, Plasma Cannons, Plasma Blades |
| **INT** | Tech Weapons | Chain Blades, Power Weapons, Rocket Weapons |
| **WIS** | Channel Weapons | Staffs, Wands, Amulets |
| **WIS** | Living Weapons | Insect Hives, Sentient Plants, Living Oozes |
| **WIS** | Ritual Weapons | Ritual Blades, Incense Flails |
| **CHA** | Finesse Weapons | Fencing Swords, Rope Weapons, Chakrams |
| **CHA** | Art Weapons | Battle Fans, Hoop Blades, Nunchucku |
| **CHA** | Noise Weapons | Instrument Weapons, Amp Weapons, Percussive Weapons |

- **Channel weapons** let a wielder project Ki into basic attacks **without spending KP**.
- *(Full flavor descriptions in guide pp.15–31 — preserved for the compendium.)*

### Weapon damage (CONFIRMED Luke)
**Identical to D&D:** roll the **weapon's specific damage die + the governing attribute's modifier.**
The governing attribute is set by the weapon type (STR = Heavy/Archery/Fist, AGI = Light/Quick/Thrown,
CON = Firearms/Explosives/Volatile, INT = Laser/Plasma/Tech, WIS = Channel/Living/Ritual, CHA = Finesse/Art/Noise).
- *[TBD: each weapon/subtype's specific damage die — needs a weapon stat table.]*
- **Attack roll (CONFIRMED Luke):** D&D-style — **d20 + governing attribute mod + proficiency (if proficient
  with the weapon) vs. the target's Defense Score.**

### Action Economy (CONFIRMED Luke)
On your turn you may take **one Move, one Action, and one Bonus Action** — each once per turn unless a
feat/ability says otherwise. A **Reaction** is used *outside* your turn and refreshes at the start of your
next turn (once between your turns).
- Attacking with a weapon = an **Action**. Techniques cost the action type listed on them (Action / Bonus
  Action / Reaction / Full Turn). A **Full Turn** technique uses both your Action and Bonus Action.
- *App:* once you spend a slot, all other options of that type disable until **End Turn** refreshes them.
  A "This Turn" tracker (Action · Bonus · Reaction · Move) shows what's used and can be toggled manually.

### Skills can modify attacks (CONFIRMED Luke)
Some skills have **active combat applications** that alter an attack, not just passive checks.
- *Example:* **Marksmanship** — after landing a ranged attack, spend/use the skill to **target the
  original target's limbs for crippling damage.**
- App: skills with a combat use should surface that use (a note/action on the skill), separate from the
  plain d20 skill check. *[Full list of which skills modify attacks, and how — TBD.]*

---

## The Kinetics (technique schools)
> Source: **Psion_Chronicles_Base_Kinetics_Overview.pdf** — this is newer/more complete than the
> Player's Guide and is treated as the authority on the Kinetic roster.

**18 Kinetics — 3 per attribute**, each with a **Role** (Tank / Controller / Healer) and a **Domain**.
Each attribute has a guiding philosophy:

### STR — "Power through raw force and energy"
| Kinetic | Role | Domain |
|---|---|---|
| **Robukinesis** | Tank | Raw Ki, life force, martial power |
| **Pyrokinesis** | Controller | Fire, heat, combustion |
| **Electrokinesis** | Healer | Bioelectricity, lightning, restoring life through electrical energy |

### AGI — "Momentum and Mobility"
| Kinetic | Role | Domain |
|---|---|---|
| **Aerokinesis** | Tank | Wind and air |
| **Umbrakinesis** | Controller | Shadows and darkness |
| **Hydrokinesis** | Healer | Water and restorative flow |

### CON — "Endurance and Survival"
| Kinetic | Role | Domain |
|---|---|---|
| **Terrakinesis** | Tank | Earth and stone |
| **Cryokinesis** | Controller | Ice, cold, preservation |
| **Vitakinesis** | Healer | Vitality, life force, renewal |

### INT — "Knowledge and Understanding"
| Kinetic | Role | Domain |
|---|---|---|
| **Gravikinesis** | Tank | Gravity |
| **Chronokinesis** | Controller | Time |
| **Biokinesis** | Healer | Biology, living tissue |

### WIS — "Harmony and Insight"
| Kinetic | Role | Domain |
|---|---|---|
| **Demokinesis** | Tank | Demonic power |
| **Naturakinesis** | Controller | Plants and nature |
| **Holykinesis** | Healer | Holy and angelic power |

### CHA — "Presence and Influence"
| Kinetic | Role | Domain |
|---|---|---|
| **Sonikinesis** | Tank | Sound and resonance |
| **Lumokinesis** | Controller | Light |
| **Spirikinesis** | Healer | Spirits and the afterlife |

### Starting Equipment by Background (CONFIRMED Luke)
Each background grants **fixed gear**, a **starting weapon of the player's choice from ANY weapon in their
proficient weapon type** (a dropdown of every catalog weapon of that type — e.g. a Body Builder picks any
Heavy Weapon), plus other **choice groups** (armor, instrument, focus…). The chosen weapon is equipped and
proficient; chosen armor is equipped. *(Guru's Handguns-subtype proficiency resolves to the Firearms type
for this picker, so Guru may start with any firearm.)*

| Background | Fixed | Weapon choice | Armor / other choice |
|---|---|---|---|
| **Body Builder** | Trail Rations ×3 | Warhammer 2d6 / Great Axe 1d12 / Battleaxe 1d8 | Reinforced Vest +2 / Heavy Plating +3 |
| **Assassin** | Combat Knife, Lockpicks | Throwing Knives ×6 / Shuriken ×8 / Throwing Darts ×6 (1d4) | Shadowed Leathers +2 / Padded Cloak +1 |
| **Survivalist** | Hatchet, Survival Kit, Rations ×3 | Hunting Rifle 1d10 / Revolver 1d10 / Pump Shotgun 1d12 | Weathered Leathers +2 / Camo Poncho +1 |
| **Scholar** | Datapad, Engineer's Tools | Shock Maul / Chain Blade (1d10) / Power Fist 1d8 | Reinforced Coat +1 / Lab Exosuit +2 |
| **Witch** | Herbalism Kit, Component Pouch | Rune Staff / Spirit Wand / Warding Amulet (1d6) | Traveling Robes +1 / Enchanted Shawl +2 |
| **Musician** | Fine Clothes (+1 DS) | Rapier 1d8 / Whip 1d6 / Chakram 1d6 | Instrument: Lute / Flute / War Drum |
| **Soldier** | Combat Knife, Medkit | Blaster Rifle 1d10 / Blaster Pistol 1d8 / Laser Sword 1d10 | Kevlar Vest +3 / Combat Fatigues +1 |
| **Monk** | Monk's Wraps (+1 DS), Rations ×2 | Bo Staff / Quarterstaff / Warding Wand (1d6) | Focus: Prayer Beads / Incense Kit / Meditation Stone |
| **Guru** | Walking Cane 1d6, Holy Charm | Sidearm 1d8 / Revolver 1d10 / Derringer 1d6 | Fine Robes +1 / Ceremonial Vestments +2 |

*(Weapon dice and armor DS bonuses are placeholders — tunable in playtest.)*

### Background → Kinetic mapping (reconciled with 18-roster, CONFIRMED Luke)
All 9 backgrounds map to a Kinetic within their governing attribute's trio:
- Body Builder → **Robukinesis** (STR/Tank) · Soldier → **Pyrokinesis** (STR/Controller)
- Assassin → **Umbrakinesis** (AGI/Controller) · Monk → **Aerokinesis** (AGI/Tank)
- Survivalist → **Terrakinesis** (CON/Tank)
- Scholar → **Chronokinesis** (INT/Controller)
- Witch → **Naturakinesis** (WIS/Controller)
- Musician → **Sonikinesis** (CHA/Tank) *(corrected from Electrokinesis)*
- Guru → **Spirikinesis** (CHA/Healer)

> **CONFIRMED (Luke): The Background is NOT a class — it's just a starting point.** Any character can
> learn techniques from **any of the 18 Kinetics** by spending Technique Points. Nothing gates school
> access. The 9 backgrounds without a matching Kinetic simply don't grant a *free* starting technique in
> those schools, but those schools are still fully learnable by anyone.

---

## Chapter Two — Kinetic Techniques  **[NOT IN THIS PDF]**
The KT list & rules (the "spells/abilities" — how they cost KP, damage, effects, levels) live in
Chapter Two, which isn't in the file I have. **This is the biggest missing piece for the app.**

---

## Open questions for Luke
**Answered:** Body Pool = HP ✓ · Mind Pool = KP/Mana ✓ · pools are current/max ✓ · recovery (items/skill checks/KT/short+long rest) ✓ · Soul Pool = XP / character level ✓ · leveling: cap 30, +1 TP/level, +1 attr point on odd levels, milestones ✓ · creation techniques: 1 background + 2 chosen ✓ · Otherkin = Soul Creature @ lvl 15 ✓ · 18-Kinetic roster ✓ · Musician → Sonikinesis ✓ · **all schools open to all characters (background ≠ class)** ✓

> ✅ **The character creator AND sheet are fully buildable** from confirmed rules. What remains is mostly
> *content* (more techniques) and a few number-tuning values — none block building.

**Also answered since:** chakras named & mapped ✓ · Kinetic→chakra link ✓ · no attribute saves (use skills) ✓ · skills can modify attacks ✓ · weapon dmg = die + attr mod ✓ · attack = d20 + mod + prof vs DS ✓ · no TP at level 1 (2 techniques instead), +1 TP/level from lvl 2 ✓ · technique tiers exist, Soul-Level-gated ✓ · Ki Flame = AGI ✓

**Still open (content & tuning — non-blocking):**
1. **Kinetic Technique content** — only Robukinesis (8 Beginner) drafted; other 17 schools + higher tiers TBD.
2. **Tier names above Beginner** and their Soul-Level gates.
3. **XP thresholds** per level (being tuned).
4. **Otherkin mechanics** — what the Soul Creature grants / how it's used.
5. **Weapon damage-die table** — each weapon/subtype's die; unarmed (STR) damage die.
6. **Which skills modify attacks**, and how (beyond Marksmanship→limbs).
7. **INT crafting/repair** scaling; **WIS/CHA** any extra mechanics.
8. **Musician's "Rapiers"** vs. CHA weapon types (Finesse/Art/Noise).
9. **Armor** — how worn armor changes Defense Score.
10. **Initiative die** (d20 + AGI mod assumed).
