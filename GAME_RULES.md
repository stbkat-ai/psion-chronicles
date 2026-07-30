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
- **Page 1 (front):** name, Psionic Background, **Regional Heritage** (+ its Combat Skills & Traits), **Soul Level**, experience, **Body / Mind / Soul pools**, attribute scores + modifiers, quick-reference combat actions, **chakra chart**, attribute save modifiers, **Defense Score**.
- **Page 2:** Skills list — proficiency checkbox per skill, which attribute modifies it, the tracked modifier.
- **Core pages:** **Kinetic Techniques (KT)** the character knows — name, which Kinetic it belongs to, effects & rules.
- **Inventory:** carry weight + equipped/carried items.
- **Description:** the character's appearance & basic info — Basics (age, gender, pronouns), Physical appearance (height, weight, skin tone, hair colour/style, eye colour), and distinguishing features (tattoos, piercings, scars, etc.). Pure flavor, **no rules effect**; filled in at creation and editable on the play sheet.
- **Notes:** backstory, campaign journal.

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
- **A technique that raises attributes raises the matching pool while it's active (CONFIRMED Luke).**
  Because each pool is the *sum of its attribute scores*, any effect that increases an attribute increases
  that pool for as long as it lasts — a **body**-attribute buff (STR/AGI/CON) raises **max HP**, a **mind**-attribute
  buff (INT/WIS/CHA) raises **max KP**, by exactly the buff. (E.g. *Ki Flame*'s +2 STR/AGI/CON raises max HP by 6.)
  If the bar was **full** when the buff is activated, it **stays full** (current rises with the max); if it was
  **partial**, current stays put and you gain **headroom** to heal into. When the buff ends, the max drops and
  current is clamped back down — so toggling it can never net free HP/KP (you only ever stay full, never exceed
  your unbuffed full).
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
- Unarmored **DS = 10 + AGI mod + CON mod**.
- **With armor**, the AGI contribution is gated by the armor's **class** and the armor adds its Defense bonus
  (see **Armor** below): **DS = 10 + (AGI mod, gated by class) + CON mod + armor bonus.** CON always applies.

### Armor — classes, proficiency & rarity (CONFIRMED Luke)
Armor comes in **three classes**, a clear tradeoff between mobility and protection:

| Class | Defense bonus | AGI → Defense | Movement | Stealth |
|---|---|---|---|---|
| **Light** | +1 to +2 | **full** AGI mod | normal | **advantage** |
| **Medium** | +3 to +4 | capped at **+2** | normal | normal |
| **Heavy** | +5 to +6 | **none** | **−5 ft** | **disadvantage** |

- **Armor proficiency.** Everyone is proficient with **Light**. **Medium** and **Heavy** proficiency come from
  your **Regional Heritage** only (e.g. Europe & Africa grant Medium + Heavy; agile/monastic heritages like
  Oceania, East Asia, South America grant Light only). Wearing a class you're **not** proficient with: you gain
  **no Defense bonus** from it, and roll **AGI-based checks and attacks at disadvantage** while it's worn (the
  class's movement/Stealth effects still apply).
- **Rarity** (as with weapons): **Common · Uncommon · Rare · Very Rare · Legendary.** Higher-rarity armor is
  sturdier and carries a **special property** — Uncommon/Rare tend to give *protection from specific things*
  (resist a damage type, seal against gas, reflect a shot — GM-adjudicated **notes**), while **Legendary** armor
  can grant a mechanical perk the app applies automatically, e.g. **advantage on a named skill** while equipped
  (*Shadowplate* → Stealth; *Sentinel's Regalia* → Awareness), or negating Heavy's move penalty (*Powered Armor*).
- The full armor list (class, Defense, rarity, effects) lives in `app/items.js` (`PC.ITEMS`); heritage armor
  grants are `armorProf` on each heritage in `app/data.js`.

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
- Techniques come in **4 tiers** — **Beginner · Adept · Expert · Master** — with **5 techniques per tier per
  Kinetic** (18 Kinetics × 4 × 5 = 360 total).
- A character's **Soul Level gates which tier they may learn/buy** (Adept @8, Expert @15, Master @22), **and**
  a tier only opens once you already know **≥3 techniques from that Kinetic's previous tier**.

### Kinetic proficiency by tier completion (CONFIRMED Luke)
- Completing **every technique in a Kinetic's Adept tier** (all 5) **auto-grants proficiency** in that Kinetic
  — relevant for Kinetics outside your background focus (the focus Kinetic is already proficient).
- Completing **every technique in its Expert tier** (all 5) **auto-grants expertise** — you add **double your
  proficiency bonus** to that Kinetic's technique attack rolls.
- This is **derived automatically** from the techniques a character knows (no separate bookkeeping); the app
  shows current status on the play sheet's **Kinetics** tab and toasts the moment a threshold is crossed.

### Three point currencies — keep separate!
- **KP = Ki Points** — the **Mana** bar (= Mind Pool). Spent to *use* techniques in play; recovers via rest/items/etc.
- **TP = Technique Points** — earned **+1 per level**. Spent to *permanently learn* techniques (1 TP each). Not a combat resource.
- **CSP = Combat Skill Points** — earned **+1 every 5th level** (5/10/15/20/25/30). Spent to *permanently learn* Combat Skills (1 CSP each) from any **Fighting Style**. See Section 3b.

### Otherkin System (unlocks at Soul Level 15)
- Your **Soul Creature** — a being that has lived in your soul since creation.
- Examples: **dragon, phoenix, werewolf, vampire, sprite, fairy**, etc.
- *[Mechanics TBD: what the Soul Creature grants, how it's chosen, how it's used.]*

---

## Section 3 — Psionic Backgrounds (9)

Each Background grants: **attribute boost** (either +3 to one, or +2/+1 split), a **pool boost**
(Body +10, Mind +10, or +5/+5), **3 skill proficiencies**, **2 combat proficiencies** (weapon
type and/or Kinetic type), **1 free beginner Kinetic Technique**, and **1 flaw** (negative trait).

**Background flaws (CONFIRMED Luke).** Every background carries one flaw: **disadvantage on one whole
attribute's skill checks and Kinetic technique attack rolls**. The attribute is always one the archetype
*doesn't* build around, so a flaw adds flavor and the occasional out-of-lane stumble without punishing the
character's core competence. Flaws do **not** touch weapon attacks or initiative — only skills & techniques.

| Background | Old-world identity | Attr boost | Pool boost | Skill profs | Combat profs | Free KT | Flaw (disadvantage) |
|---|---|---|---|---|---|---|---|
| **Body Builder** | Gym rat | +3 STR | Body +10 | Muscle, Athletics, Force | Heavy Weapons, **Robukinesis** | Ki Strike | *All Brawn* — INT |
| **Assassin** | Killer for hire | +3 AGI | Body +10 | Stealth, Sleight of Hand, Escape Artist | Thrown Weapons, **Umbrakinesis** | Shroud of Shadows | *Cold Read* — CHA |
| **Survivalist** | Outdoorsman | +3 CON | Body +10 | Survival, Tolerance, Hardiness | Firearms, **Terrakinesis** | Mud Skin | *Self-Taught* — INT |
| **Scholar** | Bookworm | +3 INT | Mind +10 | History, Language, Technology | Plasma Weapons, **Chronokinesis** | Slow Time | *Ivory Tower* — STR |
| **Witch** | Wiccan/mystic | +3 WIS | Mind +10 | Paranormal, Herbalism, Nature Tools | Channel Weapons, **Naturakinesis** | Thistle Bush | *Frail Vessel* — STR |
| **Musician** | Traveling musician | +3 CHA | Mind +10 | Music, Persuasion, Performance | Rapiers*, **Sonikinesis** | *(TBD — Sonikinesis beginner; old "Static Touch" was Electro, retired)* | *Delicate Constitution* — CON |
| **Soldier** | Military/mercenary | +2 STR, +1 INT | Body +5, Mind +5 | Laborer's Tools, Intimidation, Medicine | Laser Guns, **Pyrokinesis** | Firebolt | *Blunt Instrument* — CHA |
| **Monk** | Loner martial artist | +2 AGI, +1 WIS | Body +5, Mind +5 | Acrobatics, Reflex, Awareness | Staffs, **Aerokinesis** | Gust | *Ascetic* — CHA |
| **Guru** | Spiritual leader | +2 CON, +1 CHA | Body +5, Mind +5 | Concentration, Adrenaline, Etiquette | Volatile Weapons, **Spirikinesis** | Phantom Presence | *Faith Over Fact* — INT |

\* "Rapiers" listed under Musician; note the CHA weapon types in Section 5 are Finesse/Art/Noise — reconcile with Luke.

---

## Section 3b — Regional Heritage (CONFIRMED Luke)

Where the **Psionic Background** replaces a *class* system, **Regional Heritage** replaces a *race*
system. It is chosen at creation **before Attributes** (creator step 2) and represents your character's
old-world ancestry, grouped into **8 broad regions**.

**Heritage grants — and only grants:**
- **1 Fighting Style** (below), and from it **2 Combat Skills** + the style's **signature Passive**.
- **2 Traits** — always-on roleplay/utility perks (advantage on certain checks, an extra language, etc.).
- **1 flaw** — a **narrow, situational** disadvantage on **one specific skill** (never a whole attribute).
  Kept deliberately small so that, whatever Background a player pairs with a Heritage, the flaw can't land on
  the character's primary stat. Backgrounds carry the broad (attribute-wide) flaw; Heritages carry the pinpoint one.

**Choosable proficiency grants (CONFIRMED Luke).** Some traits grant an *extra proficiency the player picks*:
- **Weapon-proficiency grant** (e.g. Europe's *Martial Heritage*) → choose **one extra weapon type**. This is
  picked on the **Equipment** step, and your starting-weapon options then span **every** type you're proficient
  with (background + bonus).
- **Skill-proficiency grant** (e.g. Oceania's *Adaptable*) → choose **one extra skill** — the Skills step's
  "choose N" simply increases by 1.
> Because a weapon-proficiency grant changes what gear you can wield, **starting-equipment selection is the
> last step of creation** (after Heritage), so the grant is already chosen when you pick your loadout.

Heritage never touches attribute scores or pools. Two characters of the same Background differ by the
Fighting Style, Combat Skills, and Traits their Heritage opened up.

### Fighting Styles & Combat Skills (the mechanic)
Combat Skills work like Kinetic Techniques: there are **many**, organized into categories called
**Fighting Styles** (the combat-skill equivalent of the Kinetics). Each Fighting Style is **tied to a
region** and contains a handful of Action / Bonus Action / Reaction skills **plus one signature Passive
buff** unique to that style (e.g. Twin Fang's *Two-Weapon Fighting* — attack again with an off-hand weapon
while dual-wielding).

- **Combat Skills cost no resource** (no KP) — they only consume **action economy**.
- Each skill is one of **Action**, **Bonus Action**, **Reaction**, or **Passive**.
- **Design rule (Luke):** any Combat Skill that adds to / rides onto a base attack (Marksmanship, Power
  Attack, Feint, Quick Draw, Rapid Slash, Precise Thrust, Crescent Strike, Lunge, Stunning Blow, Flourish)
  is a **Bonus Action**, so it layers onto a weapon attack the same turn. Skills that *are* the attack
  (Cleave, Twin Strike, Spinning Cut, Palm Strike…) are **Actions**.
- **Passive buffs** (each style's signature) are always-on; a few are econ-boosters (Second Strike, Flurry,
  Two-Weapon Fighting) whose extra-attack mechanics are described in text and wired into the tracker later.
- A style's Passive **can be learned by any character** with CSP, regardless of Heritage — as can any other
  style's skills.

### The 8 Heritages → Fighting Styles
| Heritage | Fighting Style | Starting Combat Skills | Signature Passive | Traits | Flaw (disadvantage) |
|---|---|---|---|---|---|
| **North America** | Frontier Gunslinging | Marksmanship, Suppressing Fire | Deadeye | Frontier Grit, Scavenger | *Rough Around the Edges* — Etiquette |
| **South America** | Flowing Movement | Combat Roll, Dodge Roll | Momentum | Jungle-Born, Herbal Lore | *Untamed* — Technology |
| **Europe** | Chivalric Swordplay | Riposte, Power Attack | Second Strike | Martial Heritage, Old-World Scholar | *Rigid Form* — Acrobatics |
| **United Kingdom** | Fencing | Parry, Feint | En Garde | Stiff Upper Lip, Composed | *Too Polite* — Intimidation |
| **Africa** | Warden's Bulwark | Guardian, Bracing Stance | Ironhide | Enduring, Kinship | *Immovable* — Stealth |
| **Middle East** | Desert Whirlwind | Spinning Cut, Deflecting Slash | Whirlwind | Shrewd Trader, Desert-Hardened | *Eye for the Deal* — Paranormal |
| **East Asia** | Way of the Open Hand | Palm Strike, Deflect | Flurry | Inner Focus, Disciplined | *Reserved* — Performance |
| **Oceania** | Twin Fang | Twin Strike, Rapid Slash | Two-Weapon Fighting | Seafarer, Adaptable | *Far From the Archives* — History |

Each style holds **5 active skills + 1 Passive** (48 combat skills total). Full skill text lives in
`app/data.js` (`PC.FIGHTING_STYLES`); the app is the source of truth for exact effects.

**Heritage & starting gear (CONFIRMED Luke).** A Fighting Style also flavors your **starting-weapon
options**. Each style lists `startWeaponTypes` — weapon types you may **begin play with even if you're not
proficient** (they don't grant proficiency; a background/grant does). So a melee-proficient character with a
ranged Heritage (Frontier Gunslinging → Archery/Firearms/Explosives/Volatile) can start with a ranged weapon,
picking one that suits their attributes — or stick to their proficient type. This stacks with (a) the
background's weapon proficiency and (b) any Heritage **bonus proficiency** (Europe's *Martial Heritage* — a
chosen extra type, which **is** proficient). Two-weapon-fighting Heritages (Oceania's *Twin Fang*, flagged
`twoWeapon`) instead pick **one two-handed weapon _or_ two one-handed weapons** at creation.

### Combat Skill Points (CSP) — learning more (CONFIRMED Luke)
Combat Skills use their **own** currency, separate from Technique Points and attribute points:
- You earn **+1 Combat Skill Point every 5th Soul Level** — at levels **5, 10, 15, 20, 25, 30** (6 total by cap).
- Spend **1 CSP** to learn any Combat Skill from **any** Fighting Style you don't already know (its Passive included).
- Your Heritage's 2 starting skills **and its style's Passive** are **free and permanent** (no CSP, can't be unlearned).
- Spent CSP can be refunded by unlearning a learned skill on the Level-Up screen.
- The Level-Up screen groups learnable skills **by Fighting Style**, your own style listed first.

---

## Section 4 — Skills

Skill check = roll **d20 + governing-attribute mod** (+ proficiency bonus if proficient).
Backgrounds grant 3 skill profs; player picks **2 more** at creation.

**STR:** Muscle, Laborer's Tools, Intimidation, Athletics, Grapple, Force
**AGI:** Acrobatics, Stealth, Sleight of Hand, Deft Tools, Reflex, Escape Artist
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

### Weapon properties — hands & rarity (CONFIRMED Luke)
Every catalog weapon records two extra properties:
- **Hands — one-handed or two-handed.** Matters for dual-wielding: the *Two-Weapon Fighting* passive and the
  *Twin Fang* combat skills require a **one-handed weapon in each hand**. The app tags each weapon 1H/2H on
  the catalog and on the equipped-weapon combat card.
- **Rarity — D&D-style tiers:** **Common · Uncommon · Rare · Very Rare · Legendary.** Only **Common** weapons
  are ever eligible as **starting gear**; higher-rarity weapons are found/earned in play (loot,
  rewards, purchases). Higher rarities hit harder (bigger damage dice) and usually carry a **special property**
  (e.g. *Heartpiercer* crits on 19–20; *Worldbreaker* knocks nearby enemies prone on a crit; *Skypiercer*
  ignores cover). The catalog is browsable/searchable on the Inventory tab; `app/items.js`
  (`PC.ITEMS`) is the source of truth for each weapon's die, hands, rarity, and special note.
- **Flavor descriptions.** Every catalog item (weapon, armor, consumable, tool, gear) also carries a short
  one-line description of what it is, shown on the Inventory tab. It's pure flavor — no rules effect — kept in
  `PC.ITEM_DESCRIPTIONS` in `app/items.js`.
- **Beginner weapons — the starting-gear shortlist (CONFIRMED).** Common rarity isn't enough on its own: only a
  curated **beginner** subset — **up to two weapons per weapon _subtype_**, the simplest/most iconic of each —
  is offered at character creation. This keeps the creation weapon picker short (a handful per type instead of
  the full Common list) while still covering every subtype. The full catalog remains available in play. The
  beginner list lives in `app/items.js` as **`PC.STARTER_WEAPONS`** (the single source of truth), and the
  creator filters against it. All the *other* starting-gear rules stack on top unchanged — you may still only
  start with a weapon whose **type you're proficient with** (or that your Heritage's Fighting Style opens as
  *start-only*), and two-weapon Heritages still choose **one two-handed or two one-handed** weapons.

### Action Economy (CONFIRMED Luke)
On your turn you may take **one Move, one Action, and one Bonus Action** — each once per turn unless a
feat/ability says otherwise. A **Reaction** is used *outside* your turn and refreshes at the start of your
next turn (once between your turns).
- Attacking with a weapon = an **Action**. Techniques cost the action type listed on them (Action / Bonus
  Action / Reaction / Full Turn). A **Full Turn** technique uses both your Action and Bonus Action.
- *App:* once you spend a slot, all other options of that type disable until **End Turn** refreshes them.
  A "This Turn" tracker (Action · Bonus · Reaction · Move) shows what's used and can be toggled manually.

#### Basic actions everyone has (CONFIRMED Luke)
Available to any character on the Combat tab regardless of Background, Heritage, or gear:
- **Unarmed Strike** *(Action)* — a punch or kick. Melee attack: **d20 + STR mod + proficiency** to hit;
  **1d4 + STR mod** damage. Everyone is proficient with their own body.
- **Opportunity Attack** *(Reaction)* — when an enemy **enters or leaves your reach**, make **one melee
  attack of any kind** (an equipped melee weapon or Unarmed). **Once before your next turn** — it spends
  your Reaction, so it can't be used again until your Reaction refreshes at the start of your next turn.

### Attack-modifying maneuvers → Combat Skills (CONFIRMED Luke)
Maneuvers that *alter* an attack (rather than just resolve a d20 check) now live in the **Combat Skills**
system (Section 3b), not the regular skills list.
- *Example:* **Marksmanship** is a **Combat Skill** (Bonus Action). After you make a ranged attack (weapon
  **or** technique), but *before* rolling its damage, spend your Bonus Action to aim a called shot at one of
  the target's limbs. Roll a skill check using **that attack's attribute** (+ proficiency); the **GM sets the
  DC** by the target's size and difficulty. On a success the shot strikes the chosen limb — apply the attack's
  damage there (as a called shot, per Section 2 limb rules). It was moved off the AGI skills list and replaced
  there by **Escape Artist**.
- Regular skills (Section 4) are now purely **d20 checks**; anything that layers onto an attack is a
  Combat Skill, gained from your Regional Heritage or learned with Combat Skill Points.

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
Each background grants **fixed gear**, a **starting weapon of the player's choice from the _beginner_ weapons
of their proficient weapon type** (a dropdown of that type's beginner shortlist — up to two per subtype — e.g. a
Body Builder picks a beginner Heavy Weapon), plus other **choice groups** (armor, instrument, focus…). The chosen
weapon is equipped and proficient; chosen armor is equipped. *(If a background's proficiency is a weapon
**subtype**, the picker resolves it to the parent weapon type; all current backgrounds use full weapon types.)*

| Background | Fixed | Weapon choice | Armor / other choice |
|---|---|---|---|
| **Body Builder** | Trail Rations ×3 | Warhammer 2d6 / Great Axe 1d12 / Battleaxe 1d8 | Reinforced Vest +2 / Heavy Plating +3 |
| **Assassin** | Combat Knife, Lockpicks | Throwing Knives ×6 / Shuriken ×8 / Throwing Darts ×6 (1d4) | Shadowed Leathers +2 / Padded Cloak +1 |
| **Survivalist** | Hatchet, Survival Kit, Rations ×3 | Hunting Rifle 1d10 / Revolver 1d10 / Pump Shotgun 1d12 | Weathered Leathers +2 / Camo Poncho +1 |
| **Scholar** | Datapad, Engineer's Tools | any Plasma Weapon — e.g. Plasma Sword 1d10 / Ion Beam Rifle 1d12 / Fusion Cutter 1d10 | Reinforced Coat +1 / Lab Exosuit +2 |
| **Witch** | Herbalism Kit, Component Pouch | Rune Staff / Spirit Wand / Warding Amulet (1d6) | Traveling Robes +1 / Enchanted Shawl +2 |
| **Musician** | Fine Clothes (+1 DS) | Rapier 1d8 / Whip 1d6 / Chakram 1d6 | Instrument: Lute / Flute / War Drum |
| **Soldier** | Combat Knife, Medkit | Blaster Rifle 1d10 / Blaster Pistol 1d8 / Laser Sword 1d10 | Kevlar Vest +3 / Combat Fatigues +1 |
| **Monk** | Monk's Wraps (+1 DS), Rations ×2 | Bo Staff / Quarterstaff / Warding Wand (1d6) | Focus: Prayer Beads / Incense Kit / Meditation Stone |
| **Guru** | Walking Cane 1d6, Holy Charm | any Volatile Weapon — e.g. Acid Sprayer 1d8 / Flamethrower 2d6 / Rocket Launcher 3d6 | Fine Robes +1 / Ceremonial Vestments +2 |

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
6. *(Resolved)* Attack-modifying maneuvers are the **Combat Skills** system (Section 3b), not regular skills.
7. **INT crafting/repair** scaling; **WIS/CHA** any extra mechanics.
8. **Musician's "Rapiers"** vs. CHA weapon types (Finesse/Art/Noise).
9. **Armor** — how worn armor changes Defense Score.
10. **Initiative die** (d20 + AGI mod assumed).
