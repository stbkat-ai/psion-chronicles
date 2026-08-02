# Psion Chronicles — Fusion Kinetics Library

> **GM / design reference — a hidden system.** Fusion Kinetics are **not** in the Player's Guide; players
> discover them in play. Keep this file out of player hands. Source of truth for `app/data.js`
> (`PC.FUSIONS` + `PC.FUSION_TECHNIQUES`). Built from the *Fusion Kinetics Compendium*.

With 18 base Kinetic Types there are **153** possible pairings — this is the **complete** set (every unordered
pair), **153 fusions × 9 techniques = 1,377** loaded. The compendium reuses four names across two pairings each;
to keep every fusion a unique key the app renames one member of each clash: **Hydrokinesis+Cryokinesis →
Rimekinesis** (vs Glaciokinesis), **Terrakinesis+Holykinesis → Templakinesis** (vs Sanctukinesis),
**Holykinesis+Lumokinesis → Empyreakinesis** (vs Seraphkinesis), **Aerokinesis+Naturakinesis → Pollikinesis**
(vs Florakinesis).

## What a Fusion is
A Fusion Kinetic is two standard Kinetics combined. Each **fusion technique is a specific pairing of one
technique from each parent, at the same tier — Adept and above only**: a fusion's **Adept** techniques pair
the parents' **Adept** techniques, **Expert** pairs the parents' **Expert**, **Master** pairs the parents'
**Master**. (Parents' **Beginner** techniques do **not** form fusions.) So fusions have **Adept / Expert /
Master** — "start at tier 2", no Beginner. 3 per tier = **9 each**.

## How they unlock (automatic, hidden until then)
- A character **automatically gains** a fusion technique the instant they know **both** of its parent
  techniques — **no Technique Points spent**. The fusion stays completely hidden until the first pair lands,
  then it reveals on the play sheet's **Kinetics** tab (with a one-time *"✨ Fusion discovered"* toast) and its
  techniques become usable in **Combat**.
- Example: knowing **Kinetic Grip** (Robukinesis, Adept) + **Blazing Speed** (Pyrokinesis, Adept) grants
  **Nuclegrip** (Nuclekinesis, Adept). Because both halves must be **Adept+**, fusions only surface once a
  character has invested past Beginner in both parents.
- Fusion techniques are **powerful and expensive** — their KP cost is the sum of both parent halves.
- A fusion is tied to **both** parents' attributes and chakras. *Planned rule (not yet implemented): if
  either parent chakra is damaged, the fusion's techniques are less effective.*
- **Compendium framing:** the source text says Fusion Kinetics "become available beginning at Level 15" and
  require proficiency investment in both parents. The app's implemented trigger is the pairing rule above
  (know both Adept+ halves); no hard Level-15 floor is enforced in code yet.
- **Established** fusions are the ones the compendium fully specifies (Combat Role + description); **Provisional**
  ones are listed with a domain only and their technique names/effects are concept-pass and may change.
- Technique names, effects, and costs below are a **concept pass** — tune in playtest.

---

## Established Fusions

### Nuclekinesis
**Robukinesis + Pyrokinesis** · Role: Tank + Controller · Attributes: STR / STR

*Nuclear energy, concentrated force, extreme heat, and explosive transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nuclegrip** | 11 (+3/t) | Bonus Action | Kinetic Grip + Blazing Speed | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Nuclebody** | 20 (+3/t) | Action | Iron Body + Fireball | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Nucleflame ×2** | 23 (+12/t) | Bonus Action | Ki Flame ×2 + Conflagration ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nucleblow** | 25 (+7/t) | Action | Titan's Blow + Firestorm Wall | Melee; 3d8 + STR force and push the target 10 ft. |
| **Nucleaura** | 36 (+6/t) | Action | Bastion Aura + Meteor | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Nucleflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Conflagration ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nuclestrike** | 40 (+10/t) | Action | Titan Strike + Phoenix Form | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Nucleunbreakable** | 45 | Action | Unbreakable + Supernova | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Nucleflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Conflagration ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Animakinesis
**Robukinesis + Electrokinesis** · Role: Tank + Healer · Attributes: STR / STR

*Life energy, animation, restoration, and awakened constructs.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animagrip** | 13 | Action | Kinetic Grip + Chain Lightning | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Animabody** | 10 (+3/t) | Action | Iron Body + Cleanse Current | End one condition on an ally and heal 1d6 + STR HP. |
| **Animaflame ×2** | 16 (+5/t) | Action | Ki Flame ×2 + Defibrillate ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animablow** | 29 | Action | Titan's Blow + Lightning Storm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Animaaura** | 23 (+6/t) | Action | Bastion Aura + Mass Mend | Heal all allies within 20 ft 2d8 + STR HP. |
| **Animaflame ×5** | 32 (+9/t) | Action | Ki Flame ×5 + Defibrillate ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animastrike** | 52 | Action | Titan Strike + Thundergod's Wrath | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Animaunbreakable** | 40 (+10/t) | Bonus Action | Unbreakable + Rebirth Aura | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Animaflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Defibrillate ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Plasmakinesis
**Pyrokinesis + Electrokinesis** · Role: Controller + Healer · Attributes: STR / STR

*Plasma, ionized energy, extreme heat, and electrical force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmaspeed** | 14 (+3/t) | Action | Blazing Speed + Chain Lightning | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Plasmafireball** | 18 | Action | Fireball + Cleanse Current | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Plasmaconflagration ×2** | 21 (+7/t) | Action | Conflagration ×2 + Defibrillate ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmawall** | 32 (+7/t) | Action | Firestorm Wall + Lightning Storm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Plasmameteor** | 35 | Action | Meteor + Mass Mend | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Plasmaconflagration ×5** | 32 (+9/t) | Action | Conflagration ×5 + Defibrillate ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmaform** | 52 (+10/t) | Action | Phoenix Form + Thundergod's Wrath | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Plasmasupernova** | 53 (+10/t) | Action | Supernova + Rebirth Aura | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Plasmaconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Defibrillate ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Vapokinesis
**Umbrakinesis + Aerokinesis** · Role: Controller + Tank · Attributes: AGI / AGI

*Gas, vapor, phasing, teleportation, poison, and paralysis.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapostep** | 12 (+4/t) | Bonus Action | Shadow Step + Wind Wall | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Vapodrain** | 12 | Action | Umbral Drain + Air Dash | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Vaponightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Tempest ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapostorm** | 36 | Action | Shadow Storm + Hurricane | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Vapogrip** | 28 (+8/t) | Bonus Action | Void Grip + Tornado | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Vaponightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Tempest ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapoform** | 54 (+10/t) | Action | Umbral Form + Maelstrom | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Vapoassassinate** | 42 (+10/t) | Action | Shadow Assassinate + Sky Sovereign | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Vaponightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Tempest ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Liquikinesis
**Aerokinesis + Hydrokinesis** · Role: Tank + Healer · Attributes: AGI / AGI

*Fluids, fluid movement, adaptability, circulation, and healing.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liquiwall** | 14 (+4/t) | Action | Wind Wall + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Liquidash** | 12 | Action | Air Dash + Riptide | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Liquitempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liquihurricane** | 36 | Action | Hurricane + Tsunami | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Liquitornado** | 27 (+8/t) | Action | Tornado + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Liquitempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liquimaelstrom** | 62 | Action | Maelstrom + Great Deluge | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Liquisovereign** | 44 (+20/t) | Bonus Action | Sky Sovereign + Rejuvenation Font | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Liquitempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Tide ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Deepkinesis
**Umbrakinesis + Hydrokinesis** · Role: Controller + Healer · Attributes: AGI / AGI

*The abyss, deep waters, ancient horrors, and unknown depths Deepkinesis draws upon the terrifying mystery of the world beneath the surface. It can summon abyssal entities, weaken enemies, empower allies, and manipulate the fear and pressure associated with the deepest reaches of the world..*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepastep** | 12 | Action | Shadow Step + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Deepadrain** | 14 | Action | Umbral Drain + Riptide | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Deepanightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepastorm** | 36 | Action | Shadow Storm + Tsunami | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Deepagrip** | 23 | Action | Void Grip + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Deepanightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepaform** | 52 (+10/t) | Action | Umbral Form + Great Deluge | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Deepassassinate** | 42 (+10/t) | Action | Shadow Assassinate + Rejuvenation Font | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Deepanightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Tide ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Crystakinesis
**Terrakinesis + Cryokinesis** · Role: Tank + Controller · Attributes: CON / CON

*Crystal, structured energy, barriers, and resonant formations.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystawall** | 17 (+4/t) | Action | Stone Wall + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Crystaearthquake** | 16 | Action | Earthquake + Rime | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Crystastoneform ×2** | 18 (+5/t) | Bonus Action | Stoneform ×2 + Absolute Zero ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystafissure** | 36 | Action | Fissure + Blizzard | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Crystaaegis** | 26 (+6/t) | Bonus Action | Mountain's Aegis + Flash Freeze | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Crystastoneform ×5** | 36 (+9/t) | Bonus Action | Stoneform ×5 + Absolute Zero ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystacrush** | 64 | Action | Continental Crush + Ice Age | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Crystamountain** | 44 (+10/t) | Bonus Action | Living Mountain + Absolute Stasis | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Crystastoneform ×10** | 52 (+8/t) | Bonus Action | Stoneform ×10 + Absolute Zero ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Construkinesis
**Terrakinesis + Vitakinesis** · Role: Tank + Healer · Attributes: CON / CON

*Animated stone, golems, living constructs, and artificial guardians.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construwall** | 14 (+4/t) | Action | Stone Wall + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Construearthquake** | 18 | Action | Earthquake + Second Life | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Construstoneform ×2** | 18 (+5/t) | Action | Stoneform ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construfissure** | 30 | Action | Fissure + Mass Heal | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Construaegis** | 26 (+13/t) | Bonus Action | Mountain's Aegis + Wellspring of Life | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Construstoneform ×5** | 36 (+9/t) | Action | Stoneform ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construcrush** | 62 | Action | Continental Crush + Mass Resurrection | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Construmountain** | 44 (+20/t) | Bonus Action | Living Mountain + Eternal Vigor | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Construstoneform ×10** | 52 (+8/t) | Bonus Action | Stoneform ×10 + Renewal ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Endurakinesis
**Cryokinesis + Vitakinesis** · Role: Controller + Healer · Attributes: CON / CON

*Resistance, endurance, survival, and defensive enhancement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Enduranova** | 17 | Action | Frost Nova + Greater Heal | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Endurarime** | 14 | Action | Rime + Second Life | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Endurazero ×2** | 18 | Action | Absolute Zero ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Endurablizzard** | 30 | Action | Blizzard + Mass Heal | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Endurafreeze** | 28 (+7/t) | Bonus Action | Flash Freeze + Wellspring of Life | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Endurazero ×5** | 36 | Action | Absolute Zero ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Enduraage** | 62 | Action | Ice Age + Mass Resurrection | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Endurastasis** | 44 (+10/t) | Bonus Action | Absolute Stasis + Eternal Vigor | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Endurazero ×10** | 52 | Action | Absolute Zero ×10 + Renewal ×10 | All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn. |

---

### Eclikinesis
**Robukinesis + Umbrakinesis** · Role: Tank + Controller · Attributes: STR / AGI

*Suppression, oppressive darkness, and battlefield domination.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ecligrip** | 10 | Action | Kinetic Grip + Shadow Step | Range 30 ft; the target is Rooted. |
| **Eclibody** | 13 (+3/t) | Action | Iron Body + Umbral Drain | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Ecliflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Nightfall ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ecliblow** | 29 | Action | Titan's Blow + Shadow Storm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Ecliaura** | 24 (+6/t) | Bonus Action | Bastion Aura + Void Grip | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Ecliflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Nightfall ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eclistrike** | 42 (+10/t) | Action | Titan Strike + Umbral Form | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Ecliunbreakable** | 36 | Action | Unbreakable + Shadow Assassinate | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Ecliflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Nightfall ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Cyclokinesis
**Robukinesis + Aerokinesis** · Role: Tank + Tank · Attributes: STR / AGI

*Rotational Ki, vortex force, spiraling movement, and pressure.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cyclogrip** | 12 (+4/t) | Bonus Action | Kinetic Grip + Wind Wall | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Cyclobody** | 11 (+3/t) | Bonus Action | Iron Body + Air Dash | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Cycloflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Tempest ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cycloblow** | 29 | Action | Titan's Blow + Hurricane | Melee; 3d8 + STR force and push the target 10 ft. |
| **Cycloaura** | 28 (+14/t) | Bonus Action | Bastion Aura + Tornado | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Cycloflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Tempest ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cyclostrike** | 52 | Action | Titan Strike + Maelstrom | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Cyclounbreakable** | 38 (+10/t) | Bonus Action | Unbreakable + Sky Sovereign | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Cycloflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Tempest ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Fluxkinesis
**Robukinesis + Hydrokinesis** · Role: Tank + Healer · Attributes: STR / AGI

*Flowing Ki, redirected force, momentum, and restorative impact.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxagrip** | 12 | Action | Kinetic Grip + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Fluxabody** | 13 (+3/t) | Action | Iron Body + Riptide | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Fluxaflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxablow** | 29 | Action | Titan's Blow + Tsunami | Melee; 3d8 + STR force and push the target 10 ft. |
| **Fluxaura** | 23 (+6/t) | Action | Bastion Aura + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Fluxaflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxastrike** | 50 | Action | Titan Strike + Great Deluge | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Fluxunbreakable** | 38 (+10/t) | Bonus Action | Unbreakable + Rejuvenation Font | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Fluxaflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Tide ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Seismokinesis
**Robukinesis + Terrakinesis** · Role: Tank + Tank · Attributes: STR / CON

*Seismic force, shockwaves, impact, and unstoppable momentum.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismogrip** | 12 (+4/t) | Bonus Action | Kinetic Grip + Stone Wall | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Seismobody** | 16 (+3/t) | Action | Iron Body + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Seismoflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Stoneform ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismoblow** | 29 | Action | Titan's Blow + Fissure | Melee; 3d8 + STR force and push the target 10 ft. |
| **Seismoaura** | 24 (+12/t) | Bonus Action | Bastion Aura + Mountain's Aegis | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Seismoflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Stoneform ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismostrike** | 52 | Action | Titan Strike + Continental Crush | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Seismounbreakable** | 38 (+10/t) | Bonus Action | Unbreakable + Living Mountain | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Seismoflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Stoneform ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Glaciokinesis
**Robukinesis + Cryokinesis** · Role: Tank + Controller · Attributes: STR / CON

*Frozen martial energy, stillness, discipline, and defensive force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glaciogrip** | 15 | Action | Kinetic Grip + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Glaciobody** | 12 (+3/t) | Bonus Action | Iron Body + Rime | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Glacioflame ×2** | 18 (+5/t) | Bonus Action | Ki Flame ×2 + Absolute Zero ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glacioblow** | 29 | Action | Titan's Blow + Blizzard | Melee; 3d8 + STR force and push the target 10 ft. |
| **Glacioaura** | 26 (+6/t) | Bonus Action | Bastion Aura + Flash Freeze | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Glacioflame ×5** | 36 (+9/t) | Bonus Action | Ki Flame ×5 + Absolute Zero ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glaciostrike** | 52 | Action | Titan Strike + Ice Age | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Glaciounbreakable** | 38 | Reaction | Unbreakable + Absolute Stasis | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Glacioflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Absolute Zero ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Aurakinesis
**Robukinesis + Vitakinesis** · Role: Tank + Healer · Attributes: STR / CON

*Living aura, empowerment, Ki sharing, and sustained vitality.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Auragrip** | 12 | Action | Kinetic Grip + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Aurabody** | 14 (+3/t) | Bonus Action | Iron Body + Second Life | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Auraflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aurablow** | 23 | Action | Titan's Blow + Mass Heal | Melee; 3d8 + STR force and push the target 10 ft. |
| **Auraaura** | 26 (+13/t) | Bonus Action | Bastion Aura + Wellspring of Life | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Auraflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aurastrike** | 50 | Action | Titan Strike + Mass Resurrection | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Auraunbreakable** | 38 (+10/t) | Bonus Action | Unbreakable + Eternal Vigor | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Auraflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Renewal ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Kinetokinesis
**Robukinesis + Gravikinesis** · Role: Tank + Tank · Attributes: STR / INT

*Force vectors, momentum, impact, and directional power.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Kinetogrip** | 12 | Action | Kinetic Grip + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Kinetobody** | 13 (+7/t) | Bonus Action | Iron Body + Heavy Field | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Kinetoflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Gravity Well ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Kinetoblow** | 29 | Action | Titan's Blow + Graviton Burst | Melee; 3d8 + STR force and push the target 10 ft. |
| **Kinetoaura** | 26 (+6/t) | Action | Bastion Aura + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Kinetoflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Gravity Well ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Kinetostrike** | 52 | Action | Titan Strike + Singularity | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Kinetounbreakable** | 36 | Reaction | Unbreakable + Gravity Prison | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Kinetoflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Gravity Well ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Impulsekinesis
**Robukinesis + Chronokinesis** · Role: Tank + Controller · Attributes: STR / INT

*Stored force, delayed impact, and temporal bursts.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Impulsegrip** | 13 | Action | Kinetic Grip + Accelerate | Range 30 ft; the target is Rooted. |
| **Impulsebody** | 12 (+3/t) | Bonus Action | Iron Body + Temporal Lock | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Impulseflame ×2** | 18 (+5/t) | Bonus Action | Ki Flame ×2 + Slow Time ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Impulseblow** | 27 | Action | Titan's Blow + Temporal Rift | Melee; 3d8 + STR force and push the target 10 ft. |
| **Impulseaura** | 24 (+12/t) | Bonus Action | Bastion Aura + Haste Field | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Impulseflame ×5** | 36 (+9/t) | Bonus Action | Ki Flame ×5 + Slow Time ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Impulsestrike** | 44 | Action | Titan Strike + Paradox | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Impulseunbreakable** | 40 | Reaction | Unbreakable + Rewind Death | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Impulseflame ×10** | 57 (+1/t) | Bonus Action | Ki Flame ×10 + Slow Time ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Somakinesis
**Robukinesis + Biokinesis** · Role: Tank + Healer · Attributes: STR / INT

*Physical enhancement, adaptive musculature, and perfected form.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Somagrip** | 12 | Action | Kinetic Grip + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Somabody** | 12 (+3/t) | Bonus Action | Iron Body + Mutate | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Somaflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Somablow** | 27 | Action | Titan's Blow + Plague | Melee; 3d8 + STR force and push the target 10 ft. |
| **Somaaura** | 26 (+6/t) | Action | Bastion Aura + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Somaflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Somastrike** | 50 | Action | Titan Strike + Extinction | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Somaunbreakable** | 42 | Reaction | Unbreakable + Apotheosis | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Somaflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Regenesis ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Ferokinesis
**Robukinesis + Naturakinesis** · Role: Tank + Controller · Attributes: STR / WIS

*Primal life force, instinct, bestial strength, and survival.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ferogrip** | 12 | Action | Kinetic Grip + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Ferobody** | 13 (+3/t) | Bonus Action | Iron Body + Grasping Roots | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Feroflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Bloom ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Feroblow** | 29 | Action | Titan's Blow + Thornstorm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Feroaura** | 26 (+13/t) | Bonus Action | Bastion Aura + Wall of Thorns | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Feroflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Bloom ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ferostrike** | 52 | Action | Titan Strike + Primeval Forest | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Ferounbreakable** | 40 (+10/t) | Bonus Action | Unbreakable + World Tree | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Feroflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Bloom ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Aegikinesis
**Robukinesis + Holykinesis** · Role: Tank + Healer · Attributes: STR / WIS

*Sacred Ki, protection, divine force, and guardianship.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aegigrip** | 11 | Action | Kinetic Grip + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Aegibody** | 13 (+7/t) | Bonus Action | Iron Body + Greater Blessing | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Aegiflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Sanctuary ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aegiblow** | 27 | Action | Titan's Blow + Judgment | Melee; 3d8 + STR force and push the target 10 ft. |
| **Aegiaura** | 28 (+6/t) | Bonus Action | Bastion Aura + Resurrection | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Aegiflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Sanctuary ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aegistrike** | 52 | Action | Titan Strike + Divine Judgment | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Aegiunbreakable** | 42 | Reaction | Unbreakable + Miracle | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Aegiflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Sanctuary ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Wrathkinesis
**Robukinesis + Demokinesis** · Role: Tank + Tank · Attributes: STR / WIS

*Infernal strength, rage, intimidation, and destructive force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wrathagrip** | 12 | Action | Kinetic Grip + Terrify | Range 30 ft; the target is Rooted. |
| **Wrathabody** | 13 (+3/t) | Action | Iron Body + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Wrathaflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Demon Form ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wrathablow** | 29 | Action | Titan's Blow + Hellstorm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Wrathaura** | 28 (+6/t) | Action | Bastion Aura + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Wrathaflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Demon Form ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wrathastrike** | 52 | Action | Titan Strike + Apocalypse | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Wrathunbreakable** | 38 | Reaction | Unbreakable + Pact of Ruin | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Wrathaflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Demon Form ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Resonakinesis
**Robukinesis + Sonikinesis** · Role: Tank + Tank · Attributes: STR / CHA

*Ki resonance, vibration, concussive force, and sonic armor.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonagrip** | 13 | Action | Kinetic Grip + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Resonabody** | 13 (+7/t) | Bonus Action | Iron Body + Anthem | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Resonaflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Crescendo ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonablow** | 27 | Action | Titan's Blow + Shatter | Melee; 3d8 + STR force and push the target 10 ft. |
| **Resonaaura** | 24 (+6/t) | Bonus Action | Bastion Aura + Deafening Roar | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Resonaflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Crescendo ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonastrike** | 52 | Action | Titan Strike + Sonic Boom | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Resonaunbreakable** | 38 | Reaction | Unbreakable + Unbreakable Anthem | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Resonaflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Crescendo ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Soulkinesis
**Robukinesis + Spirikinesis** · Role: Tank + Healer · Attributes: STR / CHA

*Spiritual force, soul reinforcement, and spectral strikes.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Soulagrip** | 11 | Action | Kinetic Grip + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Soulabody** | 13 (+3/t) | Action | Iron Body + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Soulaflame ×2** | 18 (+5/t) | Bonus Action | Ki Flame ×2 + Soul Tether ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Soulablow** | 29 | Action | Titan's Blow + Spirit Storm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Soulaura** | 28 (+6/t) | Bonus Action | Bastion Aura + Possession | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Soulaflame ×5** | 36 (+9/t) | Bonus Action | Ki Flame ×5 + Soul Tether ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Soulastrike** | 52 | Action | Titan Strike + Wrath of the Dead | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Soulunbreakable** | 38 (+10/t) | Bonus Action | Unbreakable + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Soulaflame ×10** | 53 (+1/t) | Bonus Action | Ki Flame ×10 + Soul Tether ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Radiantkinesis
**Robukinesis + Lumokinesis** · Role: Tank + Controller · Attributes: STR / CHA

*Condensed light-Ki, brilliant force, and protective radiance.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radiantagrip** | 11 | Action | Kinetic Grip + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Radiantabody** | 12 (+3/t) | Bonus Action | Iron Body + Hologram | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Radiantaflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Radiance ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radiantablow** | 29 | Action | Titan's Blow + Prism Beam | Melee; 3d8 + STR force and push the target 10 ft. |
| **Radiantaura** | 26 (+6/t) | Bonus Action | Bastion Aura + Illusory Army | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Radiantaflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Radiance ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radiantastrike** | 52 | Action | Titan Strike + Second Sun | Melee; 6d6 + STR force, push 20 ft, and the target is Weakened. |
| **Radiantunbreakable** | 40 | Reaction | Unbreakable + Grand Illusion | When you would drop to 0 HP, instead drop to 1 HP and gain 4d6 + STR temp HP. Once per long rest. |
| **Radiantaflame ×10** | 53 (+8/t) | Bonus Action | Ki Flame ×10 + Radiance ×10 | +15 STR, AGI, CON for the fight. Drains HP each turn AND completely blacks out your Core chakra (locked out of STR/Core until you rest). |

---

### Cinderkinesis
**Pyrokinesis + Umbrakinesis** · Role: Controller + Controller · Attributes: STR / AGI

*Black flame, ash, smoke, and hidden destruction.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cinderaspeed** | 11 (+3/t) | Bonus Action | Blazing Speed + Shadow Step | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Cinderafireball** | 21 | Action | Fireball + Umbral Drain | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Cinderaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Nightfall ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cinderawall** | 32 (+7/t) | Action | Firestorm Wall + Shadow Storm | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Cinderameteor** | 36 | Action | Meteor + Void Grip | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Cinderaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Nightfall ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cinderaform** | 42 (+20/t) | Bonus Action | Phoenix Form + Umbral Form | Emit a 10-ft fire aura (2d6/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP. |
| **Cinderasupernova** | 49 | Action | Supernova + Shadow Assassinate | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Cinderaconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Nightfall ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Infernikinesis
**Pyrokinesis + Aerokinesis** · Role: Controller + Tank · Attributes: STR / AGI

*Firestorms, combustion, spreading flame, and destructive wind.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Infernispeed** | 13 (+7/t) | Bonus Action | Blazing Speed + Wind Wall | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Infernifireball** | 19 | Action | Fireball + Air Dash | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Inferniconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Tempest ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Inferniwall** | 32 (+7/t) | Action | Firestorm Wall + Hurricane | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Infernimeteor** | 40 (+8/t) | Action | Meteor + Tornado | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Inferniconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Tempest ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Inferniform** | 52 (+10/t) | Action | Phoenix Form + Maelstrom | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Infernisupernova** | 51 (+10/t) | Action | Supernova + Sky Sovereign | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Inferniconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Tempest ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Thermokinesis
**Pyrokinesis + Hydrokinesis** · Role: Controller + Healer · Attributes: STR / AGI

*Steam, pressure, heat transfer, and thermal transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermospeed** | 13 (+3/t) | Action | Blazing Speed + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Thermofireball** | 21 | Action | Fireball + Riptide | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Thermoconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermowall** | 32 (+7/t) | Action | Firestorm Wall + Tsunami | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Thermometeor** | 35 | Action | Meteor + Mass Renewal | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Thermoconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermoform** | 50 (+10/t) | Action | Phoenix Form + Great Deluge | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Thermosupernova** | 51 (+10/t) | Action | Supernova + Rejuvenation Font | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Thermoconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Tide ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Magmakinesis
**Pyrokinesis + Terrakinesis** · Role: Controller + Tank · Attributes: STR / CON

*Molten stone, volcanic force, and hardened magma Magmakinesis creates molten terrain, volcanic armor, and devastating eruptions..*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmaspeed** | 13 (+7/t) | Bonus Action | Blazing Speed + Stone Wall | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Magmafireball** | 24 | Action | Fireball + Earthquake | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Magmaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Stoneform ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmawall** | 32 (+7/t) | Action | Firestorm Wall + Fissure | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Magmameteor** | 36 (+6/t) | Action | Meteor + Mountain's Aegis | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Magmaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Stoneform ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmaform** | 52 (+10/t) | Action | Phoenix Form + Continental Crush | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Magmasupernova** | 51 (+10/t) | Action | Supernova + Living Mountain | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Magmaconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Stoneform ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Calorikinesis
**Pyrokinesis + Cryokinesis** · Role: Controller + Controller · Attributes: STR / CON

*Temperature, thermal shock, and extreme heat exchange.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Calorispeed** | 16 (+3/t) | Action | Blazing Speed + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Calorifireball** | 20 | Action | Fireball + Rime | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Caloriconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Absolute Zero ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Caloriwall** | 32 (+7/t) | Action | Firestorm Wall + Blizzard | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Calorimeteor** | 38 | Action | Meteor + Flash Freeze | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Caloriconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Absolute Zero ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Caloriform** | 52 (+10/t) | Action | Phoenix Form + Ice Age | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Calorisupernova** | 51 | Action | Supernova + Absolute Stasis | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Caloriconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Absolute Zero ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Phoenixkinesis
**Pyrokinesis + Vitakinesis** · Role: Controller + Healer · Attributes: STR / CON

*Renewal, cleansing flame, rebirth, and restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixaspeed** | 13 (+3/t) | Action | Blazing Speed + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Phoenixafireball** | 22 | Action | Fireball + Second Life | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Phoenixaconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixawall** | 26 (+7/t) | Action | Firestorm Wall + Mass Heal | Heal all allies within 20 ft 2d8 + CON HP. |
| **Phoenixameteor** | 38 (+7/t) | Action | Meteor + Wellspring of Life | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Phoenixaconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixaform** | 50 (+10/t) | Bonus Action | Phoenix Form + Mass Resurrection | Emit a 10-ft fire aura (2d6/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP. |
| **Phoenixasupernova** | 51 (+10/t) | Action | Supernova + Eternal Vigor | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Phoenixaconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Renewal ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Solarikinesis
**Pyrokinesis + Gravikinesis** · Role: Controller + Tank · Attributes: STR / INT

*Stellar fire, solar pressure, and crushing heat.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Solarispeed** | 13 (+3/t) | Action | Blazing Speed + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Solarifireball** | 21 (+4/t) | Action | Fireball + Heavy Field | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Solariconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Gravity Well ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Solariwall** | 32 (+7/t) | Action | Firestorm Wall + Graviton Burst | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Solarimeteor** | 38 | Action | Meteor + Reverse Gravity | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Solariconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Gravity Well ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Solariform** | 52 (+10/t) | Action | Phoenix Form + Singularity | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Solarisupernova** | 49 | Action | Supernova + Gravity Prison | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Solariconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Gravity Well ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Entropykinesis
**Pyrokinesis + Chronokinesis** · Role: Controller + Controller · Attributes: STR / INT

*Entropy, accelerated decay, transformation, and energy dispersal.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Entropyaspeed** | 14 (+3/t) | Bonus Action | Blazing Speed + Accelerate | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Entropyafireball** | 20 | Action | Fireball + Temporal Lock | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Entropyaconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Slow Time ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Entropyawall** | 30 (+7/t) | Action | Firestorm Wall + Temporal Rift | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Entropyameteor** | 36 (+6/t) | Action | Meteor + Haste Field | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Entropyaconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Slow Time ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Entropyaform** | 44 (+10/t) | Bonus Action | Phoenix Form + Paradox | Emit a 10-ft fire aura (2d6/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP. |
| **Entropyasupernova** | 53 | Action | Supernova + Rewind Death | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Entropyaconflagration ×10** | 56 (+8/t) | Action | Conflagration ×10 + Slow Time ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Metabolokinesis
**Pyrokinesis + Biokinesis** · Role: Controller + Healer · Attributes: STR / INT

*Metabolism, cellular heat, biological acceleration, and exhaustion.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Metabolospeed** | 13 (+3/t) | Action | Blazing Speed + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Metabolofireball** | 20 | Action | Fireball + Mutate | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Metaboloconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Metabolowall** | 30 (+7/t) | Action | Firestorm Wall + Plague | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Metabolometeor** | 38 | Action | Meteor + Graft | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Metaboloconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Metaboloform** | 50 (+10/t) | Action | Phoenix Form + Extinction | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Metabolosupernova** | 55 | Action | Supernova + Apotheosis | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Metaboloconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Regenesis ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Pyroflorakinesis
**Pyrokinesis + Naturakinesis** · Role: Controller + Controller · Attributes: STR / WIS

*Wildfire growth, explosive plant life, and burning ecosystems.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Pyrofloraspeed** | 13 (+3/t) | Action | Blazing Speed + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Pyroflorafireball** | 21 | Action | Fireball + Grasping Roots | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Pyrofloraconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Bloom ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Pyroflorawall** | 32 (+7/t) | Action | Firestorm Wall + Thornstorm | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Pyroflorameteor** | 38 (+7/t) | Action | Meteor + Wall of Thorns | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Pyrofloraconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Bloom ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Pyrofloraform** | 52 (+10/t) | Action | Phoenix Form + Primeval Forest | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Pyroflorasupernova** | 53 (+10/t) | Action | Supernova + World Tree | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Pyrofloraconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Bloom ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Seraphkinesis
**Pyrokinesis + Holykinesis** · Role: Controller + Healer · Attributes: STR / WIS

*Sacred flame, purification, and divine judgment.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seraphaspeed** | 12 (+3/t) | Action | Blazing Speed + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Seraphafireball** | 21 (+4/t) | Action | Fireball + Greater Blessing | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Seraphaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Sanctuary ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seraphawall** | 30 (+7/t) | Action | Firestorm Wall + Judgment | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Seraphameteor** | 40 | Action | Meteor + Resurrection | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Seraphaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Sanctuary ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seraphaform** | 52 (+10/t) | Action | Phoenix Form + Divine Judgment | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Seraphasupernova** | 55 | Action | Supernova + Miracle | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Seraphaconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Sanctuary ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Hellkinesis
**Pyrokinesis + Demokinesis** · Role: Controller + Tank · Attributes: STR / WIS

*Infernal fire, curses, and destructive domination.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellaspeed** | 13 (+3/t) | Bonus Action | Blazing Speed + Terrify | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Hellafireball** | 21 | Action | Fireball + Life Leech | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Hellaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Demon Form ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellawall** | 32 (+7/t) | Action | Firestorm Wall + Hellstorm | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Hellameteor** | 40 | Action | Meteor + Devour | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Hellaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Demon Form ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellaform** | 52 (+10/t) | Action | Phoenix Form + Apocalypse | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Hellasupernova** | 51 | Action | Supernova + Pact of Ruin | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Hellaconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Demon Form ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Detonakinesis
**Pyrokinesis + Sonikinesis** · Role: Controller + Tank · Attributes: STR / CHA

*Combustion, pressure waves, explosions, and concussive force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Detonaspeed** | 14 (+3/t) | Action | Blazing Speed + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Detonafireball** | 21 (+4/t) | Action | Fireball + Anthem | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Detonaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Crescendo ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Detonawall** | 30 (+7/t) | Action | Firestorm Wall + Shatter | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Detonameteor** | 36 | Action | Meteor + Deafening Roar | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Detonaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Crescendo ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Detonaform** | 52 (+10/t) | Action | Phoenix Form + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Detonasupernova** | 51 | Action | Supernova + Unbreakable Anthem | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Detonaconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Crescendo ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Wispkinesis
**Pyrokinesis + Spirikinesis** · Role: Controller + Healer · Attributes: STR / CHA

*Soulfire, ghost flames, and spiritual combustion.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wispaspeed** | 12 (+3/t) | Action | Blazing Speed + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Wispafireball** | 21 | Action | Fireball + Mend Soul | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Wispaconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Soul Tether ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wispawall** | 32 (+7/t) | Action | Firestorm Wall + Spirit Storm | 20-ft radius; auto-hits for 3d8 + CHA spectral; Feared. |
| **Wispameteor** | 40 | Action | Meteor + Possession | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Wispaconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Soul Tether ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wispaform** | 52 (+10/t) | Action | Phoenix Form + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CHA spectral; Feared. |
| **Wispasupernova** | 51 (+10/t) | Action | Supernova + Afterlife's Guard | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Wispaconflagration ×10** | 52 (+8/t) | Action | Conflagration ×10 + Soul Tether ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Heliokinesis
**Pyrokinesis + Lumokinesis** · Role: Controller + Controller · Attributes: STR / CHA

*Sunlight, radiant heat, solar energy, and focused beams.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Heliospeed** | 12 (+3/t) | Action | Blazing Speed + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Heliofireball** | 20 | Action | Fireball + Hologram | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Helioconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Radiance ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Heliowall** | 32 (+7/t) | Action | Firestorm Wall + Prism Beam | 20-ft radius; auto-hits for 3d8 + CHA radiant; Blinded. |
| **Heliometeor** | 38 | Action | Meteor + Illusory Army | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Helioconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Radiance ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Helioform** | 52 (+10/t) | Action | Phoenix Form + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded. |
| **Heliosupernova** | 53 | Action | Supernova + Grand Illusion | 40-ft radius; auto-hits all for 6d6 + STR fire; you take 2d6 recoil fire. |
| **Helioconflagration ×10** | 52 (+16/t) | Action | Conflagration ×10 + Radiance ×10 | 40-ft zone: 5d6 fire + Burning each turn; spreads across the battlefield and consumes everything — allies and the caster included. |

---

### Stormbrakinesis
**Electrokinesis + Umbrakinesis** · Role: Healer + Controller · Attributes: STR / AGI

*Dark lightning, hidden charge, and ambush.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormbralightning** | 13 | Action | Chain Lightning + Shadow Step | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Stormbracurrent** | 11 | Action | Cleanse Current + Umbral Drain | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Stormbradefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Nightfall ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormbrastorm** | 36 | Action | Lightning Storm + Shadow Storm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Stormbramend** | 23 | Action | Mass Mend + Void Grip | Heal all allies within 20 ft 2d8 + STR HP. |
| **Stormbradefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Nightfall ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormbrawrath** | 54 (+10/t) | Action | Thundergod's Wrath + Umbral Form | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Stormbraaura** | 44 (+10/t) | Action | Rebirth Aura + Shadow Assassinate | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Stormbradefibrillate ×10** | 52 (+8/t) | Action | Defibrillate ×10 + Nightfall ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Stormkinesis
**Electrokinesis + Aerokinesis** · Role: Healer + Tank · Attributes: STR / AGI

*Lightning storms, mobility, protection, and healing force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormalightning** | 15 (+4/t) | Action | Chain Lightning + Wind Wall | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Stormacurrent** | 9 | Action | Cleanse Current + Air Dash | End one condition on an ally and heal 1d6 + STR HP. |
| **Stormadefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Tempest ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormastorm** | 36 | Action | Lightning Storm + Hurricane | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Stormamend** | 27 (+8/t) | Action | Mass Mend + Tornado | Heal all allies within 20 ft 2d8 + STR HP. |
| **Stormadefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Tempest ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stormawrath** | 64 | Action | Thundergod's Wrath + Maelstrom | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Stormaura** | 46 (+20/t) | Bonus Action | Rebirth Aura + Sky Sovereign | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Stormadefibrillate ×10** | 52 (+8/t) | Bonus Action | Defibrillate ×10 + Tempest ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Conductokinesis
**Electrokinesis + Hydrokinesis** · Role: Healer + Healer · Attributes: STR / AGI

*Electrical currents, fluids, chain effects, and restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Conductolightning** | 15 | Action | Chain Lightning + Healing Surge | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Conductocurrent** | 11 | Action | Cleanse Current + Riptide | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Conductodefibrillate ×2** | 16 | Action | Defibrillate ×2 + Tide ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Conductostorm** | 36 | Action | Lightning Storm + Tsunami | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Conductomend** | 22 | Action | Mass Mend + Mass Renewal | Heal all allies within 20 ft 2d8 + STR HP. |
| **Conductodefibrillate ×5** | 32 | Action | Defibrillate ×5 + Tide ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Conductowrath** | 62 | Action | Thundergod's Wrath + Great Deluge | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Conductoaura** | 46 (+20/t) | Bonus Action | Rebirth Aura + Rejuvenation Font | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Conductodefibrillate ×10** | 52 | Action | Defibrillate ×10 + Tide ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Magnekinesis
**Electrokinesis + Terrakinesis** · Role: Healer + Tank · Attributes: STR / CON

*Magnetism, attraction, repulsion, and metal.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnelightning** | 15 (+4/t) | Action | Chain Lightning + Stone Wall | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Magnecurrent** | 14 | Action | Cleanse Current + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Magnedefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Stoneform ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnestorm** | 36 | Action | Lightning Storm + Fissure | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Magnemend** | 23 (+6/t) | Action | Mass Mend + Mountain's Aegis | Heal all allies within 20 ft 2d8 + STR HP. |
| **Magnedefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Stoneform ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnewrath** | 64 | Action | Thundergod's Wrath + Continental Crush | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Magneaura** | 46 (+20/t) | Bonus Action | Rebirth Aura + Living Mountain | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Magnedefibrillate ×10** | 52 (+8/t) | Bonus Action | Defibrillate ×10 + Stoneform ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Cryoelectrokinesis
**Electrokinesis + Cryokinesis** · Role: Healer + Controller · Attributes: STR / CON

*Frozen charge, paralysis, and electrical stasis.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryoelectrolightning** | 18 | Action | Chain Lightning + Frost Nova | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Cryoelectrocurrent** | 10 | Action | Cleanse Current + Rime | End one condition on an ally and heal 1d6 + STR HP. |
| **Cryoelectrodefibrillate ×2** | 16 | Action | Defibrillate ×2 + Absolute Zero ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryoelectrostorm** | 36 | Action | Lightning Storm + Blizzard | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Cryoelectromend** | 25 | Action | Mass Mend + Flash Freeze | Heal all allies within 20 ft 2d8 + STR HP. |
| **Cryoelectrodefibrillate ×5** | 32 | Action | Defibrillate ×5 + Absolute Zero ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryoelectrowrath** | 64 | Action | Thundergod's Wrath + Ice Age | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Cryoelectroaura** | 46 (+10/t) | Bonus Action | Rebirth Aura + Absolute Stasis | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Cryoelectrodefibrillate ×10** | 52 | Action | Defibrillate ×10 + Absolute Zero ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Neurokinesis
**Electrokinesis + Vitakinesis** · Role: Healer + Healer · Attributes: STR / CON

*Nervous systems, stimulation, restoration, and paralysis Neurokinesis directly influences neural activity to restore movement, remove paralysis, or disrupt enemy control..*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neurolightning** | 15 | Action | Chain Lightning + Greater Heal | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Neurocurrent** | 12 | Action | Cleanse Current + Second Life | End one condition on an ally and heal 1d6 + STR HP. |
| **Neurodefibrillate ×2** | 16 | Action | Defibrillate ×2 + Renewal ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neurostorm** | 30 | Action | Lightning Storm + Mass Heal | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Neuromend** | 25 (+7/t) | Action | Mass Mend + Wellspring of Life | Heal all allies within 20 ft 2d8 + STR HP. |
| **Neurodefibrillate ×5** | 32 | Action | Defibrillate ×5 + Renewal ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neurowrath** | 62 | Action | Thundergod's Wrath + Mass Resurrection | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Neuroaura** | 46 (+20/t) | Bonus Action | Rebirth Aura + Eternal Vigor | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Neurodefibrillate ×10** | 52 | Action | Defibrillate ×10 + Renewal ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Polarikinesis
**Electrokinesis + Gravikinesis** · Role: Healer + Tank · Attributes: STR / INT

*Electromagnetic fields, attraction, repulsion, and force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Polarilightning** | 15 | Action | Chain Lightning + Crush | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Polaricurrent** | 11 (+4/t) | Action | Cleanse Current + Heavy Field | End one condition on an ally and heal 1d6 + STR HP. |
| **Polaridefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Gravity Well ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Polaristorm** | 36 | Action | Lightning Storm + Graviton Burst | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Polarimend** | 25 | Action | Mass Mend + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Polaridefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Gravity Well ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Polariwrath** | 64 | Action | Thundergod's Wrath + Singularity | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Polariaura** | 44 (+10/t) | Bonus Action | Rebirth Aura + Gravity Prison | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Polaridefibrillate ×10** | 52 (+8/t) | Bonus Action | Defibrillate ×10 + Gravity Well ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Synapsikinesis
**Electrokinesis + Chronokinesis** · Role: Healer + Controller · Attributes: STR / INT

*Perception, reaction speed, neural timing, and temporal impulses.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Synapsilightning** | 16 | Action | Chain Lightning + Accelerate | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Synapsicurrent** | 10 | Action | Cleanse Current + Temporal Lock | End one condition on an ally and heal 1d6 + STR HP. |
| **Synapsidefibrillate ×2** | 16 | Action | Defibrillate ×2 + Slow Time ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Synapsistorm** | 34 | Action | Lightning Storm + Temporal Rift | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Synapsimend** | 23 (+6/t) | Action | Mass Mend + Haste Field | Heal all allies within 20 ft 2d8 + STR HP. |
| **Synapsidefibrillate ×5** | 32 | Action | Defibrillate ×5 + Slow Time ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Synapsiwrath** | 56 | Action | Thundergod's Wrath + Paradox | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Synapsiaura** | 48 (+10/t) | Bonus Action | Rebirth Aura + Rewind Death | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Synapsidefibrillate ×10** | 56 | Action | Defibrillate ×10 + Slow Time ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Genekinesis
**Electrokinesis + Biokinesis** · Role: Healer + Healer · Attributes: STR / INT

*Bioelectric evolution, cellular activation, and adaptation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genelightning** | 15 | Action | Chain Lightning + Necrosis | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Genecurrent** | 10 | Action | Cleanse Current + Mutate | End one condition on an ally and heal 1d6 + STR HP. |
| **Genedefibrillate ×2** | 16 | Action | Defibrillate ×2 + Regenesis ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genestorm** | 34 | Action | Lightning Storm + Plague | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Genemend** | 25 | Action | Mass Mend + Graft | Heal all allies within 20 ft 2d8 + STR HP. |
| **Genedefibrillate ×5** | 32 | Action | Defibrillate ×5 + Regenesis ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genewrath** | 62 | Action | Thundergod's Wrath + Extinction | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Geneaura** | 50 (+10/t) | Bonus Action | Rebirth Aura + Apotheosis | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Genedefibrillate ×10** | 52 | Action | Defibrillate ×10 + Regenesis ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Galvanokinesis
**Electrokinesis + Naturakinesis** · Role: Healer + Controller · Attributes: STR / WIS

*Living electrical ecosystems and charged plant life.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Galvanolightning** | 15 | Action | Chain Lightning + Poison Spores | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Galvanocurrent** | 11 | Action | Cleanse Current + Grasping Roots | End one condition on an ally and heal 1d6 + STR HP. |
| **Galvanodefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Bloom ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Galvanostorm** | 36 | Action | Lightning Storm + Thornstorm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Galvanomend** | 25 (+7/t) | Action | Mass Mend + Wall of Thorns | Heal all allies within 20 ft 2d8 + STR HP. |
| **Galvanodefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Bloom ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Galvanowrath** | 64 | Action | Thundergod's Wrath + Primeval Forest | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Galvanoaura** | 48 (+20/t) | Bonus Action | Rebirth Aura + World Tree | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Galvanodefibrillate ×10** | 52 (+8/t) | Action | Defibrillate ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Thundakinesis
**Electrokinesis + Holykinesis** · Role: Healer + Healer · Attributes: STR / WIS

*Divine lightning, purification, restoration, and revival.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thundalightning** | 14 | Action | Chain Lightning + Radiant Beam | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Thundacurrent** | 11 (+4/t) | Action | Cleanse Current + Greater Blessing | End one condition on an ally and heal 1d6 + STR HP. |
| **Thundadefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Sanctuary ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thundastorm** | 34 | Action | Lightning Storm + Judgment | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Thundamend** | 27 | Action | Mass Mend + Resurrection | Heal all allies within 20 ft 2d8 + STR HP. |
| **Thundadefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Sanctuary ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thundawrath** | 64 | Action | Thundergod's Wrath + Divine Judgment | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Thundaaura** | 50 (+10/t) | Bonus Action | Rebirth Aura + Miracle | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Thundadefibrillate ×10** | 52 | Action | Defibrillate ×10 + Sanctuary ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Voltarkinesis
**Electrokinesis + Demokinesis** · Role: Healer + Tank · Attributes: STR / WIS

*Infernal electricity, curses, and overload.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voltaralightning** | 15 | Action | Chain Lightning + Terrify | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Voltaracurrent** | 11 | Action | Cleanse Current + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Voltaradefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Demon Form ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voltarastorm** | 36 | Action | Lightning Storm + Hellstorm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Voltaramend** | 27 | Action | Mass Mend + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Voltaradefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Demon Form ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voltarawrath** | 64 | Action | Thundergod's Wrath + Apocalypse | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Voltaraura** | 46 (+10/t) | Bonus Action | Rebirth Aura + Pact of Ruin | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Voltaradefibrillate ×10** | 52 (+8/t) | Bonus Action | Defibrillate ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Resonancekinesis
**Electrokinesis + Sonikinesis** · Role: Healer + Tank · Attributes: STR / CHA

*Frequency, vibration, electricity, and harmonic energy Resonancekinesis combines electrical current with vibration to disrupt or restore energy systems..*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonancelightning** | 16 | Action | Chain Lightning + Thunderclap | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Resonancecurrent** | 11 (+4/t) | Action | Cleanse Current + Anthem | End one condition on an ally and heal 1d6 + STR HP. |
| **Resonancedefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Crescendo ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonancestorm** | 34 | Action | Lightning Storm + Shatter | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Resonancemend** | 23 | Action | Mass Mend + Deafening Roar | Heal all allies within 20 ft 2d8 + STR HP. |
| **Resonancedefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Crescendo ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Resonancewrath** | 64 | Action | Thundergod's Wrath + Sonic Boom | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Resonanceaura** | 46 (+10/t) | Bonus Action | Rebirth Aura + Unbreakable Anthem | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Resonancedefibrillate ×10** | 52 (+8/t) | Bonus Action | Defibrillate ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Ectrokinesis
**Electrokinesis + Spirikinesis** · Role: Healer + Healer · Attributes: STR / CHA

*Spirit charge, spectral energy, and possession resistance.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ectrolightning** | 14 | Action | Chain Lightning + Vengeful Spirit | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Ectrocurrent** | 11 | Action | Cleanse Current + Mend Soul | End one condition on an ally and heal 1d6 + STR HP. |
| **Ectrodefibrillate ×2** | 16 | Action | Defibrillate ×2 + Soul Tether ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ectrostorm** | 36 | Action | Lightning Storm + Spirit Storm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Ectromend** | 27 | Action | Mass Mend + Possession | Heal all allies within 20 ft 2d8 + STR HP. |
| **Ectrodefibrillate ×5** | 32 | Action | Defibrillate ×5 + Soul Tether ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ectrowrath** | 64 | Action | Thundergod's Wrath + Wrath of the Dead | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Ectroaura** | 46 (+20/t) | Bonus Action | Rebirth Aura + Afterlife's Guard | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Ectrodefibrillate ×10** | 52 | Action | Defibrillate ×10 + Soul Tether ×10 | Fully resurrect a dead or downed ally to full HP and KP. Completely blacks out your own Core chakra (locked out of STR/Core until you rest). |

---

### Photokinesis
**Electrokinesis + Lumokinesis** · Role: Healer + Controller · Attributes: STR / CHA

*Electromagnetic radiation, lasers, and energized light.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photolightning** | 14 | Action | Chain Lightning + Laser | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Photocurrent** | 10 | Action | Cleanse Current + Hologram | End one condition on an ally and heal 1d6 + STR HP. |
| **Photodefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Radiance ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photostorm** | 36 | Action | Lightning Storm + Prism Beam | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Photomend** | 25 | Action | Mass Mend + Illusory Army | Heal all allies within 20 ft 2d8 + STR HP. |
| **Photodefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Radiance ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photowrath** | 64 | Action | Thundergod's Wrath + Second Sun | 40-ft radius; auto-hits all for 6d6 + STR lightning; targets Shocked. |
| **Photoaura** | 48 (+10/t) | Bonus Action | Rebirth Aura + Grand Illusion | While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Photodefibrillate ×10** | 52 (+8/t) | Action | Defibrillate ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Echokinesis
**Sonikinesis + Spirikinesis** · Role: Tank + Healer · Attributes: CHA / CHA

*Spiritual resonance, echoes of the soul, and ancestral sound.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echothunderclap** | 14 | Action | Thunderclap + Vengeful Spirit | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Echoanthem** | 14 (+4/t) | Action | Anthem + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Echocrescendo ×2** | 18 (+5/t) | Bonus Action | Crescendo ×2 + Soul Tether ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echoshatter** | 34 | Action | Shatter + Spirit Storm | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Echoroar** | 28 | Action | Deafening Roar + Possession | 15-ft radius; enemies Stunned 1 turn. |
| **Echocrescendo ×5** | 36 (+9/t) | Bonus Action | Crescendo ×5 + Soul Tether ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echoboom** | 64 | Action | Sonic Boom + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Echoguard** | 44 (+10/t) | Bonus Action | Unbreakable Anthem + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Echocrescendo ×10** | 52 (+8/t) | Bonus Action | Crescendo ×10 + Soul Tether ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Radiokinesis
**Sonikinesis + Lumokinesis** · Role: Tank + Controller · Attributes: CHA / CHA

*Waves, transmission, perception, and radiant frequency Radiokinesis combines sound and light into powerful waves of energy. It specializes in communication, perception, long-range influence, and radiant force..*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radiothunderclap** | 14 | Action | Thunderclap + Laser | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Radioanthem** | 13 (+4/t) | Bonus Action | Anthem + Hologram | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Radiocrescendo ×2** | 18 (+10/t) | Bonus Action | Crescendo ×2 + Radiance ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radioshatter** | 34 | Action | Shatter + Prism Beam | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Radioroar** | 26 | Action | Deafening Roar + Illusory Army | 15-ft radius; enemies Stunned 1 turn. |
| **Radiocrescendo ×5** | 36 (+18/t) | Bonus Action | Crescendo ×5 + Radiance ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radioboom** | 64 | Action | Sonic Boom + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Radioillusion** | 46 | Bonus Action | Unbreakable Anthem + Grand Illusion | Allies within 30 ft can't drop below 1 HP for 2 turns and are immune to conditions. |
| **Radiocrescendo ×10** | 52 (+16/t) | Bonus Action | Crescendo ×10 + Radiance ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Astrakinesis
**Spirikinesis + Lumokinesis** · Role: Healer + Controller · Attributes: CHA / CHA

*Astral light, soul projection, spiritual illumination, and celestial energy.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astraspirit** | 12 | Action | Vengeful Spirit + Laser | Range 40 ft; 2d8 + CHA spectral damage. |
| **Astrasoul** | 13 | Action | Mend Soul + Hologram | Heal an ally 2d8 + CHA and end one condition. |
| **Astratether ×2** | 18 (+5/t) | Action | Soul Tether ×2 + Radiance ×2 | 15-ft light: Blinded + 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astrastorm** | 36 | Action | Spirit Storm + Prism Beam | 20-ft radius; auto-hits for 3d8 + CHA spectral; Feared. |
| **Astrapossession** | 30 | Action | Possession + Illusory Army | Briefly possess an enemy: it is Stunned and you redirect its next action. |
| **Astratether ×5** | 36 (+9/t) | Action | Soul Tether ×5 + Radiance ×5 | 20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astradead** | 64 | Action | Wrath of the Dead + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA spectral; Feared. |
| **Astraguard** | 46 (+10/t) | Bonus Action | Afterlife's Guard + Grand Illusion | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Astratether ×10** | 52 (+8/t) | Action | Soul Tether ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

## Provisional Fusions

### Obsidikinesis
**Umbrakinesis + Terrakinesis** · Role: Controller + Tank · Attributes: AGI / CON

*Black glass, hidden fortifications, traps, and defensive structures.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidistep** | 12 (+4/t) | Bonus Action | Shadow Step + Stone Wall | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Obsididrain** | 17 | Action | Umbral Drain + Earthquake | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Obsidinightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Stoneform ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidistorm** | 36 | Action | Shadow Storm + Fissure | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Obsidigrip** | 24 (+6/t) | Bonus Action | Void Grip + Mountain's Aegis | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Obsidinightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Stoneform ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidiform** | 54 (+10/t) | Action | Umbral Form + Continental Crush | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Obsidiassassinate** | 42 (+10/t) | Action | Shadow Assassinate + Living Mountain | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Obsidinightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Stoneform ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Noctikinesis
**Umbrakinesis + Cryokinesis** · Role: Controller + Controller · Attributes: AGI / CON

*Frozen darkness, silence, fear, and immobilization.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctistep** | 15 | Action | Shadow Step + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Noctidrain** | 13 | Action | Umbral Drain + Rime | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Noctinightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Absolute Zero ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctistorm** | 36 | Action | Shadow Storm + Blizzard | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Noctigrip** | 26 | Action | Void Grip + Flash Freeze | Range 30 ft; the target is Rooted and Silenced. |
| **Noctinightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Absolute Zero ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctiform** | 54 (+10/t) | Action | Umbral Form + Ice Age | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Noctiassassinate** | 42 | Action | Shadow Assassinate + Absolute Stasis | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Noctinightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Absolute Zero ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Morbikinesis
**Umbrakinesis + Vitakinesis** · Role: Controller + Healer · Attributes: AGI / CON

*Life drain, sacrifice, shadow vitality, and dangerous restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbistep** | 12 | Action | Shadow Step + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Morbidrain** | 15 | Action | Umbral Drain + Second Life | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Morbinightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbistorm** | 30 | Action | Shadow Storm + Mass Heal | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Morbigrip** | 26 (+7/t) | Bonus Action | Void Grip + Wellspring of Life | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Morbinightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbiform** | 52 (+10/t) | Bonus Action | Umbral Form + Mass Resurrection | Immune to physical damage, move through walls, attacks against you have disadvantage while active. |
| **Morbiassassinate** | 42 (+10/t) | Action | Shadow Assassinate + Eternal Vigor | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Morbinightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Renewal ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Voidkinesis
**Umbrakinesis + Gravikinesis** · Role: Controller + Tank · Attributes: AGI / INT

*Gravitational collapse, darkness, spatial pressure, and suppression.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voidastep** | 12 | Action | Shadow Step + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Voidadrain** | 14 (+4/t) | Action | Umbral Drain + Heavy Field | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Voidanightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Gravity Well ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voidastorm** | 36 | Action | Shadow Storm + Graviton Burst | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Voidagrip** | 26 | Action | Void Grip + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Voidanightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Gravity Well ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Voidaform** | 54 (+10/t) | Action | Umbral Form + Singularity | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Voidassassinate** | 40 | Action | Shadow Assassinate + Gravity Prison | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Voidanightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Gravity Well ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Afterkinesis
**Umbrakinesis + Chronokinesis** · Role: Controller + Controller · Attributes: AGI / INT

*Temporal shadows, afterimages, erased moments, and delayed movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Afterastep** | 13 | Bonus Action | Shadow Step + Accelerate | Teleport between shadows up to 40 ft; your next attack from concealment has advantage. |
| **Afteradrain** | 13 | Action | Umbral Drain + Temporal Lock | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Afteranightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Slow Time ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Afterastorm** | 34 | Action | Shadow Storm + Temporal Rift | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Afteragrip** | 24 (+6/t) | Bonus Action | Void Grip + Haste Field | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Afteranightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Slow Time ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Afteraform** | 46 (+10/t) | Bonus Action | Umbral Form + Paradox | Immune to physical damage, move through walls, attacks against you have disadvantage while active. |
| **Afterassassinate** | 44 | Action | Shadow Assassinate + Rewind Death | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Afteranightfall ×10** | 56 (+8/t) | Action | Nightfall ×10 + Slow Time ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Chimerakinesis
**Umbrakinesis + Biokinesis** · Role: Controller + Healer · Attributes: AGI / INT

*Shadow biology, adaptive forms, and monstrous transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chimerastep** | 12 | Action | Shadow Step + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Chimeradrain** | 13 | Action | Umbral Drain + Mutate | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Chimeranightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chimerastorm** | 34 | Action | Shadow Storm + Plague | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Chimeragrip** | 26 | Action | Void Grip + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Chimeranightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chimeraform** | 52 (+10/t) | Action | Umbral Form + Extinction | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Chimeraassassinate** | 46 | Action | Shadow Assassinate + Apotheosis | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Chimeranightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Regenesis ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Mycokinesis
**Umbrakinesis + Naturakinesis** · Role: Controller + Controller · Attributes: AGI / WIS

*Fungi, decay, spores, hidden networks, and battlefield control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mycostep** | 12 | Action | Shadow Step + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Mycodrain** | 14 | Action | Umbral Drain + Grasping Roots | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Myconightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Bloom ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mycostorm** | 36 | Action | Shadow Storm + Thornstorm | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Mycogrip** | 26 (+7/t) | Bonus Action | Void Grip + Wall of Thorns | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Myconightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Bloom ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mycoform** | 54 (+10/t) | Action | Umbral Form + Primeval Forest | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Mycoassassinate** | 44 (+10/t) | Action | Shadow Assassinate + World Tree | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Myconightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Bloom ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Penumbrokinesis
**Umbrakinesis + Holykinesis** · Role: Controller + Healer · Attributes: AGI / WIS

*Twilight, concealed protection, and balanced light.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Penumbrostep** | 11 | Action | Shadow Step + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Penumbrodrain** | 14 (+4/t) | Action | Umbral Drain + Greater Blessing | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Penumbronightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Sanctuary ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Penumbrostorm** | 34 | Action | Shadow Storm + Judgment | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Penumbrogrip** | 28 | Action | Void Grip + Resurrection | Range 30 ft; the target is Rooted and Silenced. |
| **Penumbronightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Sanctuary ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Penumbroform** | 54 (+10/t) | Action | Umbral Form + Divine Judgment | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Penumbroassassinate** | 46 | Action | Shadow Assassinate + Miracle | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Penumbronightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Sanctuary ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Abysskinesis
**Umbrakinesis + Demokinesis** · Role: Controller + Tank · Attributes: AGI / WIS

*Demonic darkness, terror, corruption, and abyssal power.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssastep** | 12 | Bonus Action | Shadow Step + Terrify | Teleport between shadows up to 40 ft; your next attack from concealment has advantage. |
| **Abyssadrain** | 14 | Action | Umbral Drain + Life Leech | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Abyssanightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Demon Form ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssastorm** | 36 | Action | Shadow Storm + Hellstorm | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Abyssagrip** | 28 | Action | Void Grip + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Abyssanightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Demon Form ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssaform** | 54 (+10/t) | Action | Umbral Form + Apocalypse | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Abyssassassinate** | 42 | Action | Shadow Assassinate + Pact of Ruin | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Abyssanightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Demon Form ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Silencekinesis
**Umbrakinesis + Sonikinesis** · Role: Controller + Tank · Attributes: AGI / CHA

*Sound suppression, stealth, vibration denial, and sensory control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Silencestep** | 13 | Action | Shadow Step + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Silencedrain** | 14 (+4/t) | Action | Umbral Drain + Anthem | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Silencenightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Crescendo ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Silencestorm** | 34 | Action | Shadow Storm + Shatter | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Silencegrip** | 24 | Action | Void Grip + Deafening Roar | Range 30 ft; the target is Rooted and Silenced. |
| **Silencenightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Crescendo ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Silenceform** | 54 (+10/t) | Action | Umbral Form + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Silenceassassinate** | 42 | Action | Shadow Assassinate + Unbreakable Anthem | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Silencenightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Crescendo ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Phantomkinesis
**Umbrakinesis + Spirikinesis** · Role: Controller + Healer · Attributes: AGI / CHA

*Ghosts, spectral movement, possession, and intangibility.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phantomastep** | 11 | Action | Shadow Step + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Phantomadrain** | 14 | Action | Umbral Drain + Mend Soul | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Phantomanightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Soul Tether ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phantomastorm** | 36 | Action | Shadow Storm + Spirit Storm | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Phantomagrip** | 28 | Action | Void Grip + Possession | Range 30 ft; the target is Rooted and Silenced. |
| **Phantomanightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Soul Tether ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phantomaform** | 54 (+10/t) | Action | Umbral Form + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CHA spectral; Feared. |
| **Phantomassassinate** | 42 (+10/t) | Action | Shadow Assassinate + Afterlife's Guard | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Phantomanightfall ×10** | 52 (+8/t) | Action | Nightfall ×10 + Soul Tether ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Eclipsikinesis
**Umbrakinesis + Lumokinesis** · Role: Controller + Controller · Attributes: AGI / CHA

*Eclipse energy, concealment, blinding contrast, and battlefield deception.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eclipsistep** | 11 | Action | Shadow Step + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Eclipsidrain** | 13 | Action | Umbral Drain + Hologram | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Eclipsinightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Radiance ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eclipsistorm** | 36 | Action | Shadow Storm + Prism Beam | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Eclipsigrip** | 26 | Action | Void Grip + Illusory Army | Range 30 ft; the target is Rooted and Silenced. |
| **Eclipsinightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Radiance ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eclipsiform** | 54 (+10/t) | Action | Umbral Form + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded. |
| **Eclipsiassassinate** | 44 | Action | Shadow Assassinate + Grand Illusion | Melee; 6d6 + AGI shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Eclipsinightfall ×10** | 52 (+16/t) | Action | Nightfall ×10 + Radiance ×10 | The whole battlefield goes dark: everyone but you is Blinded; enemies take 5d6 shadow/turn and are Feared. |

---

### Geokinesis
**Aerokinesis + Terrakinesis** · Role: Tank + Tank · Attributes: AGI / CON

*Sand, dust, erosion, shifting terrain, and mobile defense.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geowall** | 14 (+8/t) | Bonus Action | Wind Wall + Stone Wall | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Geodash** | 15 | Action | Air Dash + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Geotempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Stoneform ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geohurricane** | 36 | Action | Hurricane + Fissure | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Geotornado** | 28 (+14/t) | Bonus Action | Tornado + Mountain's Aegis | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Geotempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Stoneform ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geomaelstrom** | 64 | Action | Maelstrom + Continental Crush | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Geosovereign** | 44 (+20/t) | Bonus Action | Sky Sovereign + Living Mountain | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Geotempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Stoneform ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Boreakinesis
**Aerokinesis + Cryokinesis** · Role: Tank + Controller · Attributes: AGI / CON

*Blizzards, arctic wind, frozen movement, and battlefield control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Boreawall** | 17 (+4/t) | Action | Wind Wall + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Boreadash** | 11 | Bonus Action | Air Dash + Rime | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Boreatempest ×2** | 18 (+5/t) | Bonus Action | Tempest ×2 + Absolute Zero ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Boreahurricane** | 36 | Action | Hurricane + Blizzard | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Boreatornado** | 30 (+8/t) | Bonus Action | Tornado + Flash Freeze | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Boreatempest ×5** | 36 (+9/t) | Bonus Action | Tempest ×5 + Absolute Zero ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Boreamaelstrom** | 64 | Action | Maelstrom + Ice Age | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Boreasovereign** | 44 (+10/t) | Bonus Action | Sky Sovereign + Absolute Stasis | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Boreatempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Absolute Zero ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Zephyrkinesis
**Aerokinesis + Vitakinesis** · Role: Tank + Healer · Attributes: AGI / CON

*Healing wind, breath, cleansing currents, and restorative movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyrawall** | 14 (+4/t) | Action | Wind Wall + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Zephyradash** | 13 | Bonus Action | Air Dash + Second Life | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Zephyratempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyrahurricane** | 30 | Action | Hurricane + Mass Heal | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Zephyratornado** | 30 (+15/t) | Bonus Action | Tornado + Wellspring of Life | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Zephyratempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyramaelstrom** | 62 | Action | Maelstrom + Mass Resurrection | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Zephyrasovereign** | 44 (+20/t) | Bonus Action | Sky Sovereign + Eternal Vigor | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Zephyratempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Renewal ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Orbitokinesis
**Aerokinesis + Gravikinesis** · Role: Tank + Tank · Attributes: AGI / INT

*Flight paths, trajectories, aerial gravity, and controlled movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Orbitowall** | 14 (+4/t) | Action | Wind Wall + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Orbitodash** | 12 (+4/t) | Bonus Action | Air Dash + Heavy Field | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Orbitotempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Gravity Well ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Orbitohurricane** | 36 | Action | Hurricane + Graviton Burst | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Orbitotornado** | 30 (+8/t) | Action | Tornado + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Orbitotempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Gravity Well ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Orbitomaelstrom** | 64 | Action | Maelstrom + Singularity | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Orbitosovereign** | 42 (+10/t) | Bonus Action | Sky Sovereign + Gravity Prison | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Orbitotempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Gravity Well ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Velokinesis
**Aerokinesis + Chronokinesis** · Role: Tank + Controller · Attributes: AGI / INT

*Speed, temporal movement, acceleration, and rapid repositioning.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Velowall** | 15 (+4/t) | Bonus Action | Wind Wall + Accelerate | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Velodash** | 11 | Bonus Action | Air Dash + Temporal Lock | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Velotempest ×2** | 18 (+5/t) | Bonus Action | Tempest ×2 + Slow Time ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Velohurricane** | 34 | Action | Hurricane + Temporal Rift | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Velotornado** | 28 (+14/t) | Bonus Action | Tornado + Haste Field | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Velotempest ×5** | 36 (+9/t) | Bonus Action | Tempest ×5 + Slow Time ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Velomaelstrom** | 56 | Action | Maelstrom + Paradox | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Velosovereign** | 46 (+10/t) | Bonus Action | Sky Sovereign + Rewind Death | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Velotempest ×10** | 56 (+8/t) | Bonus Action | Tempest ×10 + Slow Time ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Avikinesis
**Aerokinesis + Biokinesis** · Role: Tank + Healer · Attributes: AGI / INT

*Biological flight, adaptive movement, and aerial transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aviwall** | 14 (+4/t) | Action | Wind Wall + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Avidash** | 11 | Bonus Action | Air Dash + Mutate | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Avitempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Avihurricane** | 34 | Action | Hurricane + Plague | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Avitornado** | 30 (+8/t) | Action | Tornado + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Avitempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Avimaelstrom** | 62 | Action | Maelstrom + Extinction | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Avisovereign** | 48 (+10/t) | Bonus Action | Sky Sovereign + Apotheosis | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Avitempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Regenesis ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Pollikinesis
**Aerokinesis + Naturakinesis** · Role: Tank + Controller · Attributes: AGI / WIS

*Pollen, seeds, airborne growth, and spreading vegetation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Polliwall** | 14 (+4/t) | Action | Wind Wall + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Pollidash** | 12 | Bonus Action | Air Dash + Grasping Roots | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Pollitempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Bloom ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Pollihurricane** | 36 | Action | Hurricane + Thornstorm | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Pollitornado** | 30 (+15/t) | Bonus Action | Tornado + Wall of Thorns | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Pollitempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Bloom ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Pollimaelstrom** | 64 | Action | Maelstrom + Primeval Forest | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Pollisovereign** | 46 (+20/t) | Bonus Action | Sky Sovereign + World Tree | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Pollitempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Bloom ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Angelokinesis
**Aerokinesis + Holykinesis** · Role: Tank + Healer · Attributes: AGI / WIS

*Divine flight, protective wings, sacred wind, and aerial defense.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Angelowall** | 13 (+4/t) | Action | Wind Wall + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Angelodash** | 12 (+4/t) | Bonus Action | Air Dash + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Angelotempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Sanctuary ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Angelohurricane** | 34 | Action | Hurricane + Judgment | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Angelotornado** | 32 (+8/t) | Bonus Action | Tornado + Resurrection | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Angelotempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Sanctuary ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Angelomaelstrom** | 64 | Action | Maelstrom + Divine Judgment | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Angelosovereign** | 48 (+10/t) | Bonus Action | Sky Sovereign + Miracle | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Angelotempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Sanctuary ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Tempestkinesis
**Aerokinesis + Demokinesis** · Role: Tank + Tank · Attributes: AGI / WIS

*Violent storms, chaotic winds, and destructive movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tempestawall** | 14 (+4/t) | Bonus Action | Wind Wall + Terrify | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Tempestadash** | 12 | Action | Air Dash + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Tempestatempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Demon Form ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tempestahurricane** | 36 | Action | Hurricane + Hellstorm | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Tempestatornado** | 32 (+8/t) | Action | Tornado + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Tempestatempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Demon Form ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tempestamaelstrom** | 64 | Action | Maelstrom + Apocalypse | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Tempestasovereign** | 44 (+10/t) | Bonus Action | Sky Sovereign + Pact of Ruin | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Tempestatempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Demon Form ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Sonokinesis
**Aerokinesis + Sonikinesis** · Role: Tank + Tank · Attributes: AGI / CHA

*Sonic wind, pressure waves, and aerial resonance.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonowall** | 15 (+4/t) | Action | Wind Wall + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Sonodash** | 12 (+4/t) | Bonus Action | Air Dash + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Sonotempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Crescendo ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonohurricane** | 34 | Action | Hurricane + Shatter | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Sonotornado** | 28 (+8/t) | Bonus Action | Tornado + Deafening Roar | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Sonotempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Crescendo ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonomaelstrom** | 64 | Action | Maelstrom + Sonic Boom | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Sonosovereign** | 44 (+10/t) | Bonus Action | Sky Sovereign + Unbreakable Anthem | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Sonotempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Crescendo ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Astralkinesis
**Aerokinesis + Spirikinesis** · Role: Tank + Healer · Attributes: AGI / CHA

*Spirit travel, ethereal movement, and soul flight.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralawall** | 13 (+4/t) | Action | Wind Wall + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Astraladash** | 12 | Action | Air Dash + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Astralatempest ×2** | 18 (+5/t) | Bonus Action | Tempest ×2 + Soul Tether ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralahurricane** | 36 | Action | Hurricane + Spirit Storm | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Astralatornado** | 32 (+8/t) | Bonus Action | Tornado + Possession | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Astralatempest ×5** | 36 (+9/t) | Bonus Action | Tempest ×5 + Soul Tether ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralamaelstrom** | 64 | Action | Maelstrom + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Astralasovereign** | 44 (+20/t) | Bonus Action | Sky Sovereign + Afterlife's Guard | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Astralatempest ×10** | 52 (+8/t) | Bonus Action | Tempest ×10 + Soul Tether ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Miragekinesis
**Aerokinesis + Lumokinesis** · Role: Tank + Controller · Attributes: AGI / CHA

*Refraction, illusion, distorted movement, and visual deception.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Miragewall** | 13 (+4/t) | Action | Wind Wall + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Miragedash** | 11 | Bonus Action | Air Dash + Hologram | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Miragetempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Radiance ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Miragehurricane** | 36 | Action | Hurricane + Prism Beam | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Miragetornado** | 30 (+8/t) | Bonus Action | Tornado + Illusory Army | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Miragetempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Radiance ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Miragemaelstrom** | 64 | Action | Maelstrom + Second Sun | 40-ft radius; auto-hits for 6d6 + AGI wind; all Rooted and pushed. |
| **Miragesovereign** | 46 (+10/t) | Bonus Action | Sky Sovereign + Grand Illusion | You fly; +AGI to DS; attacks against you have disadvantage while active. |
| **Miragetempest ×10** | 52 (+16/t) | Bonus Action | Tempest ×10 + Radiance ×10 | 40-ft whirlwind: 5d6 wind + push everything (allies & enemies); +AGI to DS; you can make no single-target actions while active. |

---

### Mudkinesis
**Hydrokinesis + Terrakinesis** · Role: Healer + Tank · Attributes: AGI / CON

*Clay, sediment, adaptive defense, and terrain control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudasurge** | 14 (+4/t) | Action | Healing Surge + Stone Wall | Heal an ally 2d8 + AGI HP. |
| **Mudariptide** | 17 | Action | Riptide + Earthquake | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Mudatide ×2** | 18 (+5/t) | Action | Tide ×2 + Stoneform ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudatsunami** | 36 | Action | Tsunami + Fissure | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Mudarenewal** | 23 (+6/t) | Action | Mass Renewal + Mountain's Aegis | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Mudatide ×5** | 36 (+9/t) | Action | Tide ×5 + Stoneform ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudadeluge** | 62 | Action | Great Deluge + Continental Crush | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Mudafont** | 44 (+20/t) | Bonus Action | Rejuvenation Font + Living Mountain | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Mudatide ×10** | 52 (+8/t) | Bonus Action | Tide ×10 + Stoneform ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Rimekinesis
**Hydrokinesis + Cryokinesis** · Role: Healer + Controller · Attributes: AGI / CON

*Phase change, preservation, ice, and fluid transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimesurge** | 17 | Action | Healing Surge + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Rimeriptide** | 13 | Action | Riptide + Rime | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Rimetide ×2** | 18 | Action | Tide ×2 + Absolute Zero ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimetsunami** | 36 | Action | Tsunami + Blizzard | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Rimerenewal** | 25 | Action | Mass Renewal + Flash Freeze | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Rimetide ×5** | 36 | Action | Tide ×5 + Absolute Zero ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimedeluge** | 62 | Action | Great Deluge + Ice Age | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Rimefont** | 44 (+10/t) | Bonus Action | Rejuvenation Font + Absolute Stasis | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Rimetide ×10** | 52 | Action | Tide ×10 + Absolute Zero ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Humorkinesis
**Hydrokinesis + Vitakinesis** · Role: Healer + Healer · Attributes: AGI / CON

*Bodily fluids, circulation, detoxification, and healing.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humorasurge** | 14 | Action | Healing Surge + Greater Heal | Heal an ally 2d8 + AGI HP. |
| **Humorariptide** | 15 | Action | Riptide + Second Life | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Humoratide ×2** | 18 | Action | Tide ×2 + Renewal ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humoratsunami** | 30 | Action | Tsunami + Mass Heal | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Humorarenewal** | 25 (+7/t) | Action | Mass Renewal + Wellspring of Life | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Humoratide ×5** | 36 | Action | Tide ×5 + Renewal ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humoradeluge** | 60 | Action | Great Deluge + Mass Resurrection | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Humorafont** | 44 (+20/t) | Bonus Action | Rejuvenation Font + Eternal Vigor | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Humoratide ×10** | 52 | Action | Tide ×10 + Renewal ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Tidekinesis
**Hydrokinesis + Gravikinesis** · Role: Healer + Tank · Attributes: AGI / INT

*Pressure, currents, gravitational flow, and controlled movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tidesurge** | 14 | Action | Healing Surge + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Tideriptide** | 14 (+4/t) | Action | Riptide + Heavy Field | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Tidetide ×2** | 18 (+5/t) | Action | Tide ×2 + Gravity Well ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tidetsunami** | 36 | Action | Tsunami + Graviton Burst | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Tiderenewal** | 25 | Action | Mass Renewal + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Tidetide ×5** | 36 (+9/t) | Action | Tide ×5 + Gravity Well ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tidedeluge** | 62 | Action | Great Deluge + Singularity | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Tidefont** | 42 (+10/t) | Bonus Action | Rejuvenation Font + Gravity Prison | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Tidetide ×10** | 52 (+8/t) | Bonus Action | Tide ×10 + Gravity Well ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Rheokinesis
**Hydrokinesis + Chronokinesis** · Role: Healer + Controller · Attributes: AGI / INT

*Temporal flow, delayed healing, changing states, and progressive effects.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rheosurge** | 15 | Action | Healing Surge + Accelerate | Heal an ally 2d8 + AGI HP. |
| **Rheoriptide** | 13 | Action | Riptide + Temporal Lock | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Rheotide ×2** | 18 | Action | Tide ×2 + Slow Time ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rheotsunami** | 34 | Action | Tsunami + Temporal Rift | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Rheorenewal** | 23 (+6/t) | Action | Mass Renewal + Haste Field | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Rheotide ×5** | 36 | Action | Tide ×5 + Slow Time ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rheodeluge** | 54 | Action | Great Deluge + Paradox | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Rheofont** | 46 (+10/t) | Bonus Action | Rejuvenation Font + Rewind Death | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Rheotide ×10** | 56 | Action | Tide ×10 + Slow Time ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Hemokinesis
**Hydrokinesis + Biokinesis** · Role: Healer + Healer · Attributes: AGI / INT

*Blood, circulation, biological restoration, and internal control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hemosurge** | 14 | Action | Healing Surge + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Hemoriptide** | 13 | Action | Riptide + Mutate | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Hemotide ×2** | 18 | Action | Tide ×2 + Regenesis ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hemotsunami** | 34 | Action | Tsunami + Plague | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Hemorenewal** | 25 | Action | Mass Renewal + Graft | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Hemotide ×5** | 36 | Action | Tide ×5 + Regenesis ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hemodeluge** | 60 | Action | Great Deluge + Extinction | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Hemofont** | 48 (+10/t) | Bonus Action | Rejuvenation Font + Apotheosis | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Hemotide ×10** | 52 | Action | Tide ×10 + Regenesis ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Marinekinesis
**Hydrokinesis + Naturakinesis** · Role: Healer + Controller · Attributes: AGI / WIS

*Aquatic ecosystems, sea life, and oceanic growth.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Marinesurge** | 14 | Action | Healing Surge + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Marineriptide** | 14 | Action | Riptide + Grasping Roots | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Marinetide ×2** | 18 (+5/t) | Action | Tide ×2 + Bloom ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Marinetsunami** | 36 | Action | Tsunami + Thornstorm | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Marinerenewal** | 25 (+7/t) | Action | Mass Renewal + Wall of Thorns | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Marinetide ×5** | 36 (+9/t) | Action | Tide ×5 + Bloom ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Marinedeluge** | 62 | Action | Great Deluge + Primeval Forest | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Marinefont** | 46 (+20/t) | Bonus Action | Rejuvenation Font + World Tree | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Marinetide ×10** | 52 (+8/t) | Action | Tide ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Baptismokinesis
**Hydrokinesis + Holykinesis** · Role: Healer + Healer · Attributes: AGI / WIS

*Sacred water, cleansing, purification, and restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Baptismosurge** | 13 | Action | Healing Surge + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Baptismoriptide** | 14 (+4/t) | Action | Riptide + Greater Blessing | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Baptismotide ×2** | 18 (+5/t) | Action | Tide ×2 + Sanctuary ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Baptismotsunami** | 34 | Action | Tsunami + Judgment | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Baptismorenewal** | 27 | Action | Mass Renewal + Resurrection | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Baptismotide ×5** | 36 (+9/t) | Action | Tide ×5 + Sanctuary ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Baptismodeluge** | 62 | Action | Great Deluge + Divine Judgment | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Baptismofont** | 48 (+10/t) | Bonus Action | Rejuvenation Font + Miracle | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Baptismotide ×10** | 52 | Action | Tide ×10 + Sanctuary ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Leviathankinesis
**Hydrokinesis + Demokinesis** · Role: Healer + Tank · Attributes: AGI / WIS

*Abyssal water, monstrous summons, crushing depths, and terror.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Leviathanasurge** | 14 | Action | Healing Surge + Terrify | Heal an ally 2d8 + AGI HP. |
| **Leviathanariptide** | 14 | Action | Riptide + Life Leech | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Leviathanatide ×2** | 18 (+5/t) | Action | Tide ×2 + Demon Form ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Leviathanatsunami** | 36 | Action | Tsunami + Hellstorm | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Leviathanarenewal** | 27 | Action | Mass Renewal + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Leviathanatide ×5** | 36 (+9/t) | Action | Tide ×5 + Demon Form ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Leviathanadeluge** | 62 | Action | Great Deluge + Apocalypse | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Leviathanafont** | 44 (+10/t) | Bonus Action | Rejuvenation Font + Pact of Ruin | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Leviathanatide ×10** | 52 (+8/t) | Bonus Action | Tide ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Undakinesis
**Hydrokinesis + Sonikinesis** · Role: Healer + Tank · Attributes: AGI / CHA

*Underwater sound, sonar, resonance, and perception.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Undasurge** | 15 | Action | Healing Surge + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Undariptide** | 14 (+4/t) | Action | Riptide + Anthem | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Undatide ×2** | 18 (+5/t) | Action | Tide ×2 + Crescendo ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Undatsunami** | 34 | Action | Tsunami + Shatter | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Undarenewal** | 23 | Action | Mass Renewal + Deafening Roar | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Undatide ×5** | 36 (+9/t) | Action | Tide ×5 + Crescendo ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Undadeluge** | 62 | Action | Great Deluge + Sonic Boom | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Undafont** | 44 (+10/t) | Bonus Action | Rejuvenation Font + Unbreakable Anthem | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Undatide ×10** | 52 (+8/t) | Bonus Action | Tide ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Naiadkinesis
**Hydrokinesis + Spirikinesis** · Role: Healer + Healer · Attributes: AGI / CHA

*Water spirits, restoration, spiritual currents, and protective flow.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Naiadasurge** | 13 | Action | Healing Surge + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Naiadariptide** | 14 | Action | Riptide + Mend Soul | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Naiadatide ×2** | 18 | Action | Tide ×2 + Soul Tether ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Naiadatsunami** | 36 | Action | Tsunami + Spirit Storm | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Naiadarenewal** | 27 | Action | Mass Renewal + Possession | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Naiadatide ×5** | 36 | Action | Tide ×5 + Soul Tether ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Naiadadeluge** | 62 | Action | Great Deluge + Wrath of the Dead | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Naiadafont** | 44 (+20/t) | Bonus Action | Rejuvenation Font + Afterlife's Guard | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Naiadatide ×10** | 52 | Action | Tide ×10 + Soul Tether ×10 | Heal all allies to full and cleanse them; sweep all enemies (5d6, push 30 ft, prone, Slowed). |

---

### Prismakinesis
**Hydrokinesis + Lumokinesis** · Role: Healer + Controller · Attributes: AGI / CHA

*Refraction, healing light, liquid illusions, and radiant water.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Prismasurge** | 13 | Action | Healing Surge + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Prismariptide** | 13 | Action | Riptide + Hologram | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Prismatide ×2** | 18 (+5/t) | Action | Tide ×2 + Radiance ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Prismatsunami** | 36 | Action | Tsunami + Prism Beam | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Prismarenewal** | 25 | Action | Mass Renewal + Illusory Army | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Prismatide ×5** | 36 (+9/t) | Action | Tide ×5 + Radiance ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Prismadeluge** | 62 | Action | Great Deluge + Second Sun | 40-ft flood: heal all allies 4d6 + AGI; enemies take 6d6 + AGI water, Slowed and prone. |
| **Prismafont** | 46 (+10/t) | Bonus Action | Rejuvenation Font + Grand Illusion | 20-ft healing spring; allies inside heal 2d6 + AGI/turn and regenerate KP while active. |
| **Prismatide ×10** | 52 (+8/t) | Action | Tide ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Lithokinesis
**Terrakinesis + Gravikinesis** · Role: Tank + Tank · Attributes: CON / INT

*Dense stone, mass, geological pressure, and immovable defense.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Lithowall** | 14 (+4/t) | Action | Stone Wall + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Lithoearthquake** | 17 (+4/t) | Action | Earthquake + Heavy Field | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Lithostoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Gravity Well ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Lithofissure** | 36 | Action | Fissure + Graviton Burst | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Lithoaegis** | 26 (+6/t) | Action | Mountain's Aegis + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Lithostoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Gravity Well ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Lithocrush** | 64 | Action | Continental Crush + Singularity | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Lithomountain** | 42 (+10/t) | Bonus Action | Living Mountain + Gravity Prison | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Lithostoneform ×10** | 52 (+16/t) | Bonus Action | Stoneform ×10 + Gravity Well ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Fossilkinesis
**Terrakinesis + Chronokinesis** · Role: Tank + Controller · Attributes: CON / INT

*Geological time, preservation, petrification, and ancient memory.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fossilawall** | 15 (+4/t) | Bonus Action | Stone Wall + Accelerate | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Fossilearthquake** | 16 | Action | Earthquake + Temporal Lock | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Fossilastoneform ×2** | 18 (+5/t) | Bonus Action | Stoneform ×2 + Slow Time ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fossilafissure** | 34 | Action | Fissure + Temporal Rift | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Fossilaegis** | 24 (+12/t) | Bonus Action | Mountain's Aegis + Haste Field | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Fossilastoneform ×5** | 36 (+9/t) | Bonus Action | Stoneform ×5 + Slow Time ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fossilacrush** | 56 | Action | Continental Crush + Paradox | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Fossilamountain** | 46 (+10/t) | Bonus Action | Living Mountain + Rewind Death | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Fossilastoneform ×10** | 56 (+8/t) | Bonus Action | Stoneform ×10 + Slow Time ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Osteokinesis
**Terrakinesis + Biokinesis** · Role: Tank + Healer · Attributes: CON / INT

*Bone, skeletal repair, biological structure, and reinforcement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Osteowall** | 14 (+4/t) | Action | Stone Wall + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Osteoearthquake** | 16 | Action | Earthquake + Mutate | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Osteostoneform ×2** | 18 (+5/t) | Action | Stoneform ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Osteofissure** | 34 | Action | Fissure + Plague | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Osteoaegis** | 26 (+6/t) | Action | Mountain's Aegis + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Osteostoneform ×5** | 36 (+9/t) | Action | Stoneform ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Osteocrush** | 62 | Action | Continental Crush + Extinction | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Osteomountain** | 48 (+10/t) | Bonus Action | Living Mountain + Apotheosis | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Osteostoneform ×10** | 52 (+8/t) | Bonus Action | Stoneform ×10 + Regenesis ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Geomancy
**Terrakinesis + Naturakinesis** · Role: Tank + Controller · Attributes: CON / WIS

*Living earth, roots, terrain ecosystems, and environmental control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geospores** | 14 (+4/t) | Action | Stone Wall + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Geoearthquake** | 17 | Action | Earthquake + Grasping Roots | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Geostoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Bloom ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geofissure** | 36 | Action | Fissure + Thornstorm | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Geoaegis** | 26 (+13/t) | Bonus Action | Mountain's Aegis + Wall of Thorns | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Geostoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Bloom ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geocrush** | 64 | Action | Continental Crush + Primeval Forest | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Geomountain** | 46 (+20/t) | Bonus Action | Living Mountain + World Tree | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Geostoneform ×10** | 52 (+16/t) | Bonus Action | Stoneform ×10 + Bloom ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Templakinesis
**Terrakinesis + Holykinesis** · Role: Tank + Healer · Attributes: CON / WIS

*Sacred stone, temples, protective monuments, and sanctuaries.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Templawall** | 13 (+4/t) | Action | Stone Wall + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Templaearthquake** | 17 (+4/t) | Action | Earthquake + Greater Blessing | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Templastoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Sanctuary ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Templafissure** | 34 | Action | Fissure + Judgment | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Templaaegis** | 28 (+6/t) | Bonus Action | Mountain's Aegis + Resurrection | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Templastoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Sanctuary ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Templacrush** | 64 | Action | Continental Crush + Divine Judgment | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Templamountain** | 48 (+10/t) | Bonus Action | Living Mountain + Miracle | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Templastoneform ×10** | 52 (+8/t) | Bonus Action | Stoneform ×10 + Sanctuary ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Hellstonekinesis
**Terrakinesis + Demokinesis** · Role: Tank + Tank · Attributes: CON / WIS

*Cursed earth, infernal stone, corruption, and hostile terrain.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellstonewall** | 14 (+4/t) | Bonus Action | Stone Wall + Terrify | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Hellstoneearthquake** | 17 | Action | Earthquake + Life Leech | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Hellstonestoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Demon Form ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellstonefissure** | 36 | Action | Fissure + Hellstorm | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Hellstoneaegis** | 28 (+6/t) | Action | Mountain's Aegis + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Hellstonestoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Demon Form ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hellstonecrush** | 64 | Action | Continental Crush + Apocalypse | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Hellstonemountain** | 44 (+10/t) | Bonus Action | Living Mountain + Pact of Ruin | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Hellstonestoneform ×10** | 52 (+16/t) | Bonus Action | Stoneform ×10 + Demon Form ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Tectokinesis
**Terrakinesis + Sonikinesis** · Role: Tank + Tank · Attributes: CON / CHA

*Resonance through stone, earthquakes, and seismic vibration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tectowall** | 15 (+4/t) | Action | Stone Wall + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Tectoearthquake** | 17 (+4/t) | Action | Earthquake + Anthem | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Tectostoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Crescendo ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tectofissure** | 34 | Action | Fissure + Shatter | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Tectoaegis** | 24 (+6/t) | Bonus Action | Mountain's Aegis + Deafening Roar | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Tectostoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Crescendo ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Tectocrush** | 64 | Action | Continental Crush + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Tectomountain** | 44 (+10/t) | Bonus Action | Living Mountain + Unbreakable Anthem | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Tectostoneform ×10** | 52 (+16/t) | Bonus Action | Stoneform ×10 + Crescendo ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Ancestorikinesis
**Terrakinesis + Spirikinesis** · Role: Tank + Healer · Attributes: CON / CHA

*Ancient spirits, burial earth, guardian stones, and ancestral protection.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ancestoriwall** | 13 (+4/t) | Action | Stone Wall + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Ancestoriearthquake** | 17 | Action | Earthquake + Mend Soul | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Ancestoristoneform ×2** | 18 (+5/t) | Bonus Action | Stoneform ×2 + Soul Tether ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ancestorifissure** | 36 | Action | Fissure + Spirit Storm | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Ancestoriaegis** | 28 (+6/t) | Bonus Action | Mountain's Aegis + Possession | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Ancestoristoneform ×5** | 36 (+9/t) | Bonus Action | Stoneform ×5 + Soul Tether ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ancestoricrush** | 64 | Action | Continental Crush + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Ancestorimountain** | 44 (+20/t) | Bonus Action | Living Mountain + Afterlife's Guard | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Ancestoristoneform ×10** | 52 (+8/t) | Bonus Action | Stoneform ×10 + Soul Tether ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Gemkinesis
**Terrakinesis + Lumokinesis** · Role: Tank + Controller · Attributes: CON / CHA

*Gemstones, radiant crystals, stored energy, and refraction.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gemawall** | 13 (+4/t) | Action | Stone Wall + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Gemearthquake** | 16 | Action | Earthquake + Hologram | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Gemastoneform ×2** | 18 (+10/t) | Bonus Action | Stoneform ×2 + Radiance ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gemafissure** | 36 | Action | Fissure + Prism Beam | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Gemaegis** | 26 (+6/t) | Bonus Action | Mountain's Aegis + Illusory Army | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Gemastoneform ×5** | 36 (+18/t) | Bonus Action | Stoneform ×5 + Radiance ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gemacrush** | 64 | Action | Continental Crush + Second Sun | 40-ft radius; auto-hits for 6d6 + CON earth; prone and Rooted. |
| **Gemamountain** | 46 (+10/t) | Bonus Action | Living Mountain + Grand Illusion | Your max HP doubles (temp), DR = CON mod, immune to conditions; movement 0 while active. |
| **Gemastoneform ×10** | 52 (+16/t) | Bonus Action | Stoneform ×10 + Radiance ×10 | DR = CON mod ×5, immune to conditions & forced movement, attacks against you have disadvantage — but you are completely immobile and can only strike adjacent foes. |

---

### Singularitykinesis
**Cryokinesis + Gravikinesis** · Role: Controller + Tank · Attributes: CON / INT

*Frozen mass, compression, gravitational stasis, and battlefield suppression.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Singularityanova** | 17 | Action | Frost Nova + Crush | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Singularityarime** | 13 (+4/t) | Bonus Action | Rime + Heavy Field | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Singularityazero ×2** | 18 (+5/t) | Bonus Action | Absolute Zero ×2 + Gravity Well ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Singularityablizzard** | 36 | Action | Blizzard + Graviton Burst | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Singularityafreeze** | 28 | Action | Flash Freeze + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Singularityazero ×5** | 36 (+9/t) | Bonus Action | Absolute Zero ×5 + Gravity Well ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Singularityage** | 64 | Action | Ice Age + Singularity | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Singularityastasis** | 42 | Action | Absolute Stasis + Gravity Prison | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Singularityazero ×10** | 52 (+8/t) | Bonus Action | Absolute Zero ×10 + Gravity Well ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Stasikinesis
**Cryokinesis + Chronokinesis** · Role: Controller + Controller · Attributes: CON / INT

*Suspension, preservation, halted change, and controlled stasis.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stasinova** | 18 | Action | Frost Nova + Accelerate | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Stasirime** | 12 | Action | Rime + Temporal Lock | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Stasizero ×2** | 18 | Action | Absolute Zero ×2 + Slow Time ×2 | Target is Frozen; if already Slowed/Frozen, 2d6 shatter damage. Self-cost: you are Slowed next turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stasiblizzard** | 34 | Action | Blizzard + Temporal Rift | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Stasifreeze** | 26 (+6/t) | Bonus Action | Flash Freeze + Haste Field | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Stasizero ×5** | 36 | Action | Absolute Zero ×5 + Slow Time ×5 | Freeze all enemies in a 15-ft area (Frozen). Self-cost: you are Slowed while any remain frozen. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Stasiage** | 56 | Action | Ice Age + Paradox | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Stasistasis** | 46 | Action | Absolute Stasis + Rewind Death | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Stasizero ×10** | 56 | Action | Absolute Zero ×10 + Slow Time ×10 | All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn. |

---

### Cryobiokinesis
**Cryokinesis + Biokinesis** · Role: Controller + Healer · Attributes: CON / INT

*Biological preservation, regeneration, adaptation, and survival.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryobionova** | 17 | Action | Frost Nova + Necrosis | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Cryobiorime** | 12 | Action | Rime + Mutate | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Cryobiozero ×2** | 18 | Action | Absolute Zero ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryobioblizzard** | 34 | Action | Blizzard + Plague | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Cryobiofreeze** | 28 | Action | Flash Freeze + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Cryobiozero ×5** | 36 | Action | Absolute Zero ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryobioage** | 62 | Action | Ice Age + Extinction | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Cryobiostasis** | 48 | Action | Absolute Stasis + Apotheosis | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Cryobiozero ×10** | 52 | Action | Absolute Zero ×10 + Regenesis ×10 | All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn. |

---

### Hibernakinesis
**Cryokinesis + Naturakinesis** · Role: Controller + Controller · Attributes: CON / WIS

*Dormancy, seasonal survival, restorative sleep, and delayed harm.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hibernanova** | 17 | Action | Frost Nova + Poison Spores | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Hibernarime** | 13 | Action | Rime + Grasping Roots | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Hibernazero ×2** | 18 (+5/t) | Action | Absolute Zero ×2 + Bloom ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hibernablizzard** | 36 | Action | Blizzard + Thornstorm | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Hibernafreeze** | 28 (+7/t) | Bonus Action | Flash Freeze + Wall of Thorns | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Hibernazero ×5** | 36 (+9/t) | Action | Absolute Zero ×5 + Bloom ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hibernaage** | 64 | Action | Ice Age + Primeval Forest | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Hibernastasis** | 46 (+10/t) | Bonus Action | Absolute Stasis + World Tree | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Hibernazero ×10** | 52 (+8/t) | Action | Absolute Zero ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Serenikinesis
**Cryokinesis + Holykinesis** · Role: Controller + Healer · Attributes: CON / WIS

*Sacred stillness, purification, protective calm, and spiritual preservation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sereninova** | 16 | Action | Frost Nova + Radiant Beam | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Serenirime** | 13 (+4/t) | Bonus Action | Rime + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Serenizero ×2** | 18 (+5/t) | Bonus Action | Absolute Zero ×2 + Sanctuary ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sereniblizzard** | 34 | Action | Blizzard + Judgment | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Serenifreeze** | 30 | Action | Flash Freeze + Resurrection | Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6. |
| **Serenizero ×5** | 36 (+9/t) | Bonus Action | Absolute Zero ×5 + Sanctuary ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sereniage** | 64 | Action | Ice Age + Divine Judgment | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Serenistasis** | 48 | Action | Absolute Stasis + Miracle | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Serenizero ×10** | 52 | Action | Absolute Zero ×10 + Sanctuary ×10 | All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn. |

---

### Frostfiendkinesis
**Cryokinesis + Demokinesis** · Role: Controller + Tank · Attributes: CON / WIS

*Cursed cold, fear, infernal winter, and corruption.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Frostfiendanova** | 17 | Action | Frost Nova + Terrify | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Frostfiendarime** | 13 | Action | Rime + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Frostfiendazero ×2** | 18 (+5/t) | Bonus Action | Absolute Zero ×2 + Demon Form ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Frostfiendablizzard** | 36 | Action | Blizzard + Hellstorm | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Frostfiendafreeze** | 30 | Action | Flash Freeze + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Frostfiendazero ×5** | 36 (+9/t) | Bonus Action | Absolute Zero ×5 + Demon Form ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Frostfiendage** | 64 | Action | Ice Age + Apocalypse | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Frostfiendastasis** | 44 | Action | Absolute Stasis + Pact of Ruin | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Frostfiendazero ×10** | 52 (+8/t) | Bonus Action | Absolute Zero ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Harmonikinesis
**Cryokinesis + Sonikinesis** · Role: Controller + Tank · Attributes: CON / CHA

*Crystal resonance, frozen vibration, and harmonic control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmoninova** | 18 | Action | Frost Nova + Thunderclap | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Harmonirime** | 13 (+4/t) | Bonus Action | Rime + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Harmonizero ×2** | 18 (+5/t) | Bonus Action | Absolute Zero ×2 + Crescendo ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmoniblizzard** | 34 | Action | Blizzard + Shatter | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Harmonifreeze** | 26 | Action | Flash Freeze + Deafening Roar | Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6. |
| **Harmonizero ×5** | 36 (+9/t) | Bonus Action | Absolute Zero ×5 + Crescendo ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmoniage** | 64 | Action | Ice Age + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Harmonistasis** | 44 | Action | Absolute Stasis + Unbreakable Anthem | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Harmonizero ×10** | 52 (+8/t) | Bonus Action | Absolute Zero ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Wraithkinesis
**Cryokinesis + Spirikinesis** · Role: Controller + Healer · Attributes: CON / CHA

*Frozen souls, spectral winter, spiritual preservation, and ghostly cold.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wraithanova** | 16 | Action | Frost Nova + Vengeful Spirit | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Wraitharime** | 13 | Action | Rime + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Wraithazero ×2** | 18 | Action | Absolute Zero ×2 + Soul Tether ×2 | Target is Frozen; if already Slowed/Frozen, 2d6 shatter damage. Self-cost: you are Slowed next turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wraithablizzard** | 36 | Action | Blizzard + Spirit Storm | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Wraithafreeze** | 30 | Action | Flash Freeze + Possession | Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6. |
| **Wraithazero ×5** | 36 | Action | Absolute Zero ×5 + Soul Tether ×5 | Freeze all enemies in a 15-ft area (Frozen). Self-cost: you are Slowed while any remain frozen. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Wraithage** | 64 | Action | Ice Age + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Wraithastasis** | 44 (+10/t) | Bonus Action | Absolute Stasis + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Wraithazero ×10** | 52 | Action | Absolute Zero ×10 + Soul Tether ×10 | All enemies Frozen in stasis. Self-cost: the absolute cold takes you too — you are Frozen for your next turn. |

---

### Aurorakinesis
**Cryokinesis + Lumokinesis** · Role: Controller + Controller · Attributes: CON / CHA

*Aurora light, radiant ice, polar energy, and luminous defense.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Auroranova** | 16 | Action | Frost Nova + Laser | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Aurorarime** | 12 | Action | Rime + Hologram | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Aurorazero ×2** | 18 (+5/t) | Action | Absolute Zero ×2 + Radiance ×2 | 15-ft light: Blinded + 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aurorablizzard** | 36 | Action | Blizzard + Prism Beam | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Aurorafreeze** | 28 | Action | Flash Freeze + Illusory Army | Range 30 ft; target is Frozen; attacks against a Frozen target deal +1d6. |
| **Aurorazero ×5** | 36 (+9/t) | Action | Absolute Zero ×5 + Radiance ×5 | 20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Auroraage** | 64 | Action | Ice Age + Second Sun | 40-ft radius; auto-hits for 6d6 + CON cold; targets Frozen. |
| **Aurorastasis** | 46 | Action | Absolute Stasis + Grand Illusion | Put a creature in stasis: Frozen and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Aurorazero ×10** | 52 (+8/t) | Action | Absolute Zero ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Fortikinesis
**Vitakinesis + Gravikinesis** · Role: Healer + Tank · Attributes: CON / INT

*Vital resilience, density, bodily reinforcement, and defensive strength.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fortiheal** | 14 | Action | Greater Heal + Crush | Range 30 ft; 2d8 + INT force damage. |
| **Fortilife** | 15 (+4/t) | Bonus Action | Second Life + Heavy Field | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Fortirenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Gravity Well ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fortiburst** | 30 | Action | Mass Heal + Graviton Burst | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Fortigravity** | 28 (+7/t) | Action | Wellspring of Life + Reverse Gravity | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Fortirenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Gravity Well ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fortiresurrection** | 62 | Action | Mass Resurrection + Singularity | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Fortivigor** | 42 (+10/t) | Bonus Action | Eternal Vigor + Gravity Prison | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Fortirenewal ×10** | 52 (+8/t) | Bonus Action | Renewal ×10 + Gravity Well ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Regenokinesis
**Vitakinesis + Chronokinesis** · Role: Healer + Controller · Attributes: CON / INT

*Regeneration, restored vitality, biological renewal, and accelerated healing.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Regenoheal** | 15 | Action | Greater Heal + Accelerate | Heal an ally 2d8 + CON HP. |
| **Regenolife** | 14 | Action | Second Life + Temporal Lock | Revive a downed ally to half HP. |
| **Regenorenewal ×2** | 18 | Action | Renewal ×2 + Slow Time ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Regenorift** | 28 | Action | Mass Heal + Temporal Rift | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Regenofield** | 26 (+13/t) | Bonus Action | Wellspring of Life + Haste Field | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Regenorenewal ×5** | 36 | Action | Renewal ×5 + Slow Time ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Regenoresurrection** | 54 | Action | Mass Resurrection + Paradox | Revive all downed or dead allies within 30 ft to half HP and cleanse them. |
| **Regenovigor** | 46 (+10/t) | Bonus Action | Eternal Vigor + Rewind Death | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Regenorenewal ×10** | 56 | Action | Renewal ×10 + Slow Time ×10 | Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight. |

---

### Homeokinesis
**Vitakinesis + Biokinesis** · Role: Healer + Healer · Attributes: CON / INT

*Internal balance, healing, physiological stability, and homeostasis.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Homeoheal** | 14 | Action | Greater Heal + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Homeolife** | 14 | Action | Second Life + Mutate | Revive a downed ally to half HP. |
| **Homeorenewal ×2** | 18 | Action | Renewal ×2 + Regenesis ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Homeoplague** | 28 | Action | Mass Heal + Plague | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Homeograft** | 28 (+7/t) | Action | Wellspring of Life + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Homeorenewal ×5** | 36 | Action | Renewal ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Homeoresurrection** | 60 | Action | Mass Resurrection + Extinction | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Homeovigor** | 48 (+10/t) | Bonus Action | Eternal Vigor + Apotheosis | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Homeorenewal ×10** | 52 | Action | Renewal ×10 + Regenesis ×10 | Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight. |

---

### Verdakinesis
**Vitakinesis + Naturakinesis** · Role: Healer + Controller · Attributes: CON / WIS

*Living vitality, growth, regenerative ecosystems, and natural healing.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Verdaheal** | 14 | Action | Greater Heal + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Verdalife** | 15 | Action | Second Life + Grasping Roots | Revive a downed ally to half HP. |
| **Verdarenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Bloom ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Verdathornstorm** | 30 | Action | Mass Heal + Thornstorm | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Verdathorns** | 28 (+14/t) | Bonus Action | Wellspring of Life + Wall of Thorns | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Verdarenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Bloom ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Verdaresurrection** | 62 | Action | Mass Resurrection + Primeval Forest | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Verdavigor** | 46 (+20/t) | Bonus Action | Eternal Vigor + World Tree | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Verdarenewal ×10** | 52 (+8/t) | Action | Renewal ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Mirakinesis
**Vitakinesis + Holykinesis** · Role: Healer + Healer · Attributes: CON / WIS

*Miracles, restoration, protection, and divine healing.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Miraheal** | 13 | Action | Greater Heal + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Miralife** | 15 (+4/t) | Bonus Action | Second Life + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Mirarenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Sanctuary ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mirajudgment** | 28 | Action | Mass Heal + Judgment | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Miraresurrection** | 30 (+7/t) | Bonus Action | Wellspring of Life + Resurrection | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Mirarenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Sanctuary ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mirajudgment (M0)** | 62 | Action | Mass Resurrection + Divine Judgment | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Miravigor** | 48 (+10/t) | Bonus Action | Eternal Vigor + Miracle | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Mirarenewal ×10** | 52 | Action | Renewal ×10 + Sanctuary ×10 | Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight. |

---

### Bloodpactkinesis
**Vitakinesis + Demokinesis** · Role: Healer + Tank · Attributes: CON / WIS

*Sacrifice, exchanged vitality, dangerous healing, and life bargains.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Bloodpactaheal** | 14 | Action | Greater Heal + Terrify | Heal an ally 2d8 + CON HP. |
| **Bloodpactalife** | 15 | Action | Second Life + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Bloodpactarenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Demon Form ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Bloodpactahellstorm** | 30 | Action | Mass Heal + Hellstorm | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Bloodpactadevour** | 30 (+7/t) | Action | Wellspring of Life + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Bloodpactarenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Demon Form ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Bloodpactaresurrection** | 62 | Action | Mass Resurrection + Apocalypse | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Bloodpactavigor** | 44 (+10/t) | Bonus Action | Eternal Vigor + Pact of Ruin | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Bloodpactarenewal ×10** | 52 (+8/t) | Bonus Action | Renewal ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Harmonokinesis
**Vitakinesis + Sonikinesis** · Role: Healer + Tank · Attributes: CON / CHA

*Healing resonance, synchronized life force, and restorative harmony.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmonoheal** | 15 | Action | Greater Heal + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Harmonolife** | 15 (+4/t) | Bonus Action | Second Life + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Harmonorenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Crescendo ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmonoshatter** | 28 | Action | Mass Heal + Shatter | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Harmonoroar** | 26 (+7/t) | Bonus Action | Wellspring of Life + Deafening Roar | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Harmonorenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Crescendo ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Harmonoresurrection** | 62 | Action | Mass Resurrection + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Harmonovigor** | 44 (+10/t) | Bonus Action | Eternal Vigor + Unbreakable Anthem | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Harmonorenewal ×10** | 52 (+8/t) | Bonus Action | Renewal ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Anamkinesis
**Vitakinesis + Spirikinesis** · Role: Healer + Healer · Attributes: CON / CHA

*Soul vitality, spiritual restoration, resurrection, and body-spirit unity.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Anamaheal** | 13 | Action | Greater Heal + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Anamalife** | 15 | Action | Second Life + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Anamarenewal ×2** | 18 | Action | Renewal ×2 + Soul Tether ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Anamastorm** | 30 | Action | Mass Heal + Spirit Storm | 20-ft radius; auto-hits for 3d8 + CHA spectral; Feared. |
| **Anamapossession** | 30 (+7/t) | Bonus Action | Wellspring of Life + Possession | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Anamarenewal ×5** | 36 | Action | Renewal ×5 + Soul Tether ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Anamaresurrection** | 62 | Action | Mass Resurrection + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CHA spectral; Feared. |
| **Anamavigor** | 44 (+20/t) | Bonus Action | Eternal Vigor + Afterlife's Guard | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Anamarenewal ×10** | 52 | Action | Renewal ×10 + Soul Tether ×10 | Fully heal and revive every ally, cleanse all conditions, and grant them regeneration for the rest of the fight. |

---

### Luxvitalis
**Vitakinesis + Lumokinesis** · Role: Healer + Controller · Attributes: CON / CHA

*Radiant life force, healing light, revitalization, and luminous protection.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luxaheal** | 13 | Action | Greater Heal + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Luxalife** | 14 | Action | Second Life + Hologram | Revive a downed ally to half HP. |
| **Luxarenewal ×2** | 18 (+5/t) | Action | Renewal ×2 + Radiance ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luxabeam** | 30 | Action | Mass Heal + Prism Beam | 20-ft radius; auto-hits for 3d8 + CHA radiant; Blinded. |
| **Luxarmy** | 28 (+7/t) | Bonus Action | Wellspring of Life + Illusory Army | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Luxarenewal ×5** | 36 (+9/t) | Action | Renewal ×5 + Radiance ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luxaresurrection** | 62 | Action | Mass Resurrection + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded. |
| **Luxavigor** | 46 (+10/t) | Bonus Action | Eternal Vigor + Grand Illusion | Allies within 20 ft cannot drop below 1 HP and heal 3d6/turn while active. |
| **Luxarenewal ×10** | 52 (+8/t) | Action | Renewal ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Spatiokinesis
**Gravikinesis + Chronokinesis** · Role: Tank + Controller · Attributes: INT / INT

*Spacetime, distance, duration, position, and spatial distortion.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spatiocrush** | 15 | Action | Crush + Accelerate | Range 30 ft; 2d8 + INT force damage. |
| **Spatiofield** | 13 (+4/t) | Bonus Action | Heavy Field + Temporal Lock | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Spatiowell ×2** | 18 (+5/t) | Bonus Action | Gravity Well ×2 + Slow Time ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spatioburst** | 34 | Action | Graviton Burst + Temporal Rift | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Spatiogravity** | 26 (+6/t) | Action | Reverse Gravity + Haste Field | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Spatiowell ×5** | 36 (+9/t) | Bonus Action | Gravity Well ×5 + Slow Time ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spatiosingularity** | 56 | Action | Singularity + Paradox | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Spatioprison** | 44 | Action | Gravity Prison + Rewind Death | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Spatiowell ×10** | 56 (+8/t) | Bonus Action | Gravity Well ×10 + Slow Time ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Morphokinesis
**Gravikinesis + Biokinesis** · Role: Tank + Healer · Attributes: INT / INT

*Adaptive bodies, pressure-driven evolution, and biological transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphocrush** | 14 | Action | Crush + Necrosis | Range 30 ft; 2d8 + INT force damage. |
| **Morphofield** | 13 (+4/t) | Bonus Action | Heavy Field + Mutate | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Morphowell ×2** | 18 (+5/t) | Action | Gravity Well ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphoburst** | 34 | Action | Graviton Burst + Plague | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Morphogravity** | 28 | Action | Reverse Gravity + Graft | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Morphowell ×5** | 36 (+9/t) | Action | Gravity Well ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphosingularity** | 62 | Action | Singularity + Extinction | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Morphoprison** | 46 | Action | Gravity Prison + Apotheosis | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Morphowell ×10** | 52 (+8/t) | Bonus Action | Gravity Well ×10 + Regenesis ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Planetakinesis
**Gravikinesis + Naturakinesis** · Role: Tank + Controller · Attributes: INT / WIS

*Planetary force, ecosystems, environmental gravity, and natural pressure.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Planetacrush** | 14 | Action | Crush + Poison Spores | Range 30 ft; 2d8 + INT force damage. |
| **Planetafield** | 14 (+4/t) | Bonus Action | Heavy Field + Grasping Roots | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Planetawell ×2** | 18 (+10/t) | Bonus Action | Gravity Well ×2 + Bloom ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Planetaburst** | 36 | Action | Graviton Burst + Thornstorm | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Planetagravity** | 28 (+7/t) | Action | Reverse Gravity + Wall of Thorns | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Planetawell ×5** | 36 (+18/t) | Bonus Action | Gravity Well ×5 + Bloom ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Planetasingularity** | 64 | Action | Singularity + Primeval Forest | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Planetaprison** | 44 (+10/t) | Bonus Action | Gravity Prison + World Tree | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Planetawell ×10** | 52 (+16/t) | Bonus Action | Gravity Well ×10 + Bloom ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Celestikinesis
**Gravikinesis + Holykinesis** · Role: Tank + Healer · Attributes: INT / WIS

*Divine weight, celestial protection, sacred gravity, and heavenly force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Celesticrush** | 13 | Action | Crush + Radiant Beam | Range 30 ft; 2d8 + INT force damage. |
| **Celestifield** | 14 (+8/t) | Bonus Action | Heavy Field + Greater Blessing | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Celestiwell ×2** | 18 (+10/t) | Bonus Action | Gravity Well ×2 + Sanctuary ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Celestiburst** | 34 | Action | Graviton Burst + Judgment | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Celestigravity** | 30 | Action | Reverse Gravity + Resurrection | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Celestiwell ×5** | 36 (+18/t) | Bonus Action | Gravity Well ×5 + Sanctuary ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Celestisingularity** | 64 | Action | Singularity + Divine Judgment | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Celestiprison** | 46 | Action | Gravity Prison + Miracle | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Celestiwell ×10** | 52 (+8/t) | Bonus Action | Gravity Well ×10 + Sanctuary ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Abyssokinesis
**Gravikinesis + Demokinesis** · Role: Tank + Tank · Attributes: INT / WIS

*Crushing darkness, demonic gravity, and oppressive force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssocrush** | 14 | Action | Crush + Terrify | Range 30 ft; 2d8 + INT force damage. |
| **Abyssofield** | 14 (+4/t) | Action | Heavy Field + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Abyssowell ×2** | 18 (+10/t) | Bonus Action | Gravity Well ×2 + Demon Form ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssoburst** | 36 | Action | Graviton Burst + Hellstorm | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Abyssogravity** | 30 | Action | Reverse Gravity + Devour | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Abyssowell ×5** | 36 (+18/t) | Bonus Action | Gravity Well ×5 + Demon Form ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Abyssosingularity** | 64 | Action | Singularity + Apocalypse | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Abyssoprison** | 42 | Action | Gravity Prison + Pact of Ruin | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Abyssowell ×10** | 52 (+16/t) | Bonus Action | Gravity Well ×10 + Demon Form ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Gravisonikinesis
**Gravikinesis + Sonikinesis** · Role: Tank + Tank · Attributes: INT / CHA

*Shockwaves, mass resonance, force vibration, and gravitational sound.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gravisonicrush** | 15 | Action | Crush + Thunderclap | Range 30 ft; 2d8 + INT force damage. |
| **Gravisonifield** | 14 (+8/t) | Bonus Action | Heavy Field + Anthem | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Gravisoniwell ×2** | 18 (+10/t) | Bonus Action | Gravity Well ×2 + Crescendo ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gravisoniburst** | 34 | Action | Graviton Burst + Shatter | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Gravisonigravity** | 26 | Action | Reverse Gravity + Deafening Roar | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Gravisoniwell ×5** | 36 (+18/t) | Bonus Action | Gravity Well ×5 + Crescendo ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Gravisonisingularity** | 64 | Action | Singularity + Sonic Boom | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Gravisoniprison** | 42 | Action | Gravity Prison + Unbreakable Anthem | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Gravisoniwell ×10** | 52 (+16/t) | Bonus Action | Gravity Well ×10 + Crescendo ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Astralgravikinesis
**Gravikinesis + Spirikinesis** · Role: Tank + Healer · Attributes: INT / CHA

*Soul weight, spiritual anchors, astral pull, and ethereal gravity.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralgravicrush** | 13 | Action | Crush + Vengeful Spirit | Range 30 ft; 2d8 + INT force damage. |
| **Astralgravifield** | 14 (+4/t) | Action | Heavy Field + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Astralgraviwell ×2** | 18 (+5/t) | Bonus Action | Gravity Well ×2 + Soul Tether ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralgraviburst** | 36 | Action | Graviton Burst + Spirit Storm | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Astralgravigravity** | 30 | Action | Reverse Gravity + Possession | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Astralgraviwell ×5** | 36 (+9/t) | Bonus Action | Gravity Well ×5 + Soul Tether ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralgravisingularity** | 64 | Action | Singularity + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Astralgraviprison** | 42 (+10/t) | Bonus Action | Gravity Prison + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Astralgraviwell ×10** | 52 (+8/t) | Bonus Action | Gravity Well ×10 + Soul Tether ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Photonkinesis
**Gravikinesis + Lumokinesis** · Role: Tank + Controller · Attributes: INT / CHA

*Light pressure, gravitational lensing, radiant distortion, and focused energy.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photonacrush** | 13 | Action | Crush + Laser | Range 30 ft; 2d8 + INT force damage. |
| **Photonafield** | 13 (+4/t) | Bonus Action | Heavy Field + Hologram | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Photonawell ×2** | 18 (+10/t) | Bonus Action | Gravity Well ×2 + Radiance ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photonaburst** | 36 | Action | Graviton Burst + Prism Beam | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Photonagravity** | 28 | Action | Reverse Gravity + Illusory Army | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Photonawell ×5** | 36 (+18/t) | Bonus Action | Gravity Well ×5 + Radiance ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Photonasingularity** | 64 | Action | Singularity + Second Sun | 40-ft radius; auto-hits for 6d6 + INT force; all pulled to center and Rooted. |
| **Photonaprison** | 44 | Action | Gravity Prison + Grand Illusion | A target is crushed into stasis: Frozen (pinned) + 3d6/turn. |
| **Photonawell ×10** | 52 (+16/t) | Bonus Action | Gravity Well ×10 + Radiance ×10 | 40-ft well pulls in everything each turn, enemies Rooted + 4d6/turn; +INT to DS; you take 2d6/turn and cannot move. |

---

### Genokinesis
**Chronokinesis + Biokinesis** · Role: Controller + Healer · Attributes: INT / INT

*Biological time, growth, cellular restoration, and accelerated evolution.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genoaccelerate** | 15 | Action | Accelerate + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Genolock** | 12 | Action | Temporal Lock + Mutate | Range 30 ft; target Rooted and loses reactions. |
| **Genotime ×2** | 18 | Action | Slow Time ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genorift** | 32 | Action | Temporal Rift + Plague | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Genofield** | 26 (+6/t) | Action | Haste Field + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Genotime ×5** | 36 | Action | Slow Time ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genoparadox** | 54 | Action | Paradox + Extinction | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Genodeath** | 50 | Action | Rewind Death + Apotheosis | Rewind a fallen ally to before they died — revive to full HP. |
| **Genotime ×10** | 56 | Action | Slow Time ×10 + Regenesis ×10 | Take 3 consecutive turns while all else is frozen (damage lands when time resumes). Self-cost: you are Stunned when it ends. |

---

### Seasonkinesis
**Chronokinesis + Naturakinesis** · Role: Controller + Controller · Attributes: INT / WIS

*Seasons, growth cycles, environmental change, and recurring transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seasonaccelerate** | 15 | Action | Accelerate + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Seasonalock** | 13 | Action | Temporal Lock + Grasping Roots | Range 30 ft; target Rooted and loses reactions. |
| **Seasonatime ×2** | 18 (+5/t) | Action | Slow Time ×2 + Bloom ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seasonarift** | 34 | Action | Temporal Rift + Thornstorm | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Seasonafield** | 26 (+13/t) | Bonus Action | Haste Field + Wall of Thorns | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Seasonatime ×5** | 36 (+9/t) | Action | Slow Time ×5 + Bloom ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seasonaparadox** | 56 | Action | Paradox + Primeval Forest | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Seasonadeath** | 48 (+10/t) | Bonus Action | Rewind Death + World Tree | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Seasonatime ×10** | 56 (+8/t) | Action | Slow Time ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Eternakinesis
**Chronokinesis + Holykinesis** · Role: Controller + Healer · Attributes: INT / WIS

*Eternal protection, sacred time, destiny, and divine continuity.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eternaaccelerate** | 14 | Action | Accelerate + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Eternalock** | 13 (+4/t) | Bonus Action | Temporal Lock + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Eternatime ×2** | 18 (+5/t) | Bonus Action | Slow Time ×2 + Sanctuary ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eternarift** | 32 | Action | Temporal Rift + Judgment | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Eternafield** | 28 (+6/t) | Bonus Action | Haste Field + Resurrection | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Eternatime ×5** | 36 (+9/t) | Bonus Action | Slow Time ×5 + Sanctuary ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eternaparadox** | 56 | Action | Paradox + Divine Judgment | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Eternadeath** | 50 | Action | Rewind Death + Miracle | Rewind a fallen ally to before they died — revive to full HP. |
| **Eternatime ×10** | 56 | Action | Slow Time ×10 + Sanctuary ×10 | Take 3 consecutive turns while all else is frozen (damage lands when time resumes). Self-cost: you are Stunned when it ends. |

---

### Paradoxkinesis
**Chronokinesis + Demokinesis** · Role: Controller + Tank · Attributes: INT / WIS

*Temporal corruption, impossible outcomes, and contradictory events.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Paradoxaccelerate** | 15 | Bonus Action | Accelerate + Terrify | An ally takes one extra action this turn. |
| **Paradoxalock** | 13 | Action | Temporal Lock + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Paradoxatime ×2** | 18 (+5/t) | Bonus Action | Slow Time ×2 + Demon Form ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Paradoxarift** | 34 | Action | Temporal Rift + Hellstorm | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Paradoxafield** | 28 (+6/t) | Action | Haste Field + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Paradoxatime ×5** | 36 (+9/t) | Bonus Action | Slow Time ×5 + Demon Form ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Paradoxaparadox** | 56 | Action | Paradox + Apocalypse | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Paradoxadeath** | 46 | Action | Rewind Death + Pact of Ruin | Rewind a fallen ally to before they died — revive to full HP. |
| **Paradoxatime ×10** | 56 (+8/t) | Bonus Action | Slow Time ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Rhythmokinesis
**Chronokinesis + Sonikinesis** · Role: Controller + Tank · Attributes: INT / CHA

*Timing, tempo, synchronized combat, and repeating patterns.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rhythmoaccelerate** | 16 | Action | Accelerate + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Rhythmolock** | 13 (+4/t) | Bonus Action | Temporal Lock + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Rhythmotime ×2** | 18 (+5/t) | Bonus Action | Slow Time ×2 + Crescendo ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rhythmorift** | 32 | Action | Temporal Rift + Shatter | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Rhythmofield** | 24 (+6/t) | Bonus Action | Haste Field + Deafening Roar | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Rhythmotime ×5** | 36 (+9/t) | Bonus Action | Slow Time ×5 + Crescendo ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rhythmoparadox** | 56 | Action | Paradox + Sonic Boom | 40-ft radius; auto-hits for 6d6 + CHA thunder; push + Stunned. |
| **Rhythmodeath** | 46 | Action | Rewind Death + Unbreakable Anthem | Rewind a fallen ally to before they died — revive to full HP. |
| **Rhythmotime ×10** | 56 (+8/t) | Bonus Action | Slow Time ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Aionkinesis
**Chronokinesis + Spirikinesis** · Role: Controller + Healer · Attributes: INT / CHA

*Souls across time, memory, ancestral echoes, and spiritual history.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aionaccelerate** | 14 | Action | Accelerate + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Aionalock** | 13 | Action | Temporal Lock + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Aionatime ×2** | 18 | Action | Slow Time ×2 + Soul Tether ×2 | 15-ft area Slowed + enemies lose reactions. Self-cost: you are Slowed next turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aionarift** | 34 | Action | Temporal Rift + Spirit Storm | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Aionafield** | 28 (+6/t) | Bonus Action | Haste Field + Possession | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Aionatime ×5** | 36 | Action | Slow Time ×5 + Soul Tether ×5 | 20-ft area: enemies Stunned 1 turn. Self-cost: you lose your next turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aionaparadox** | 56 | Action | Paradox + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + CHA spectral; Feared. |
| **Aionadeath** | 46 (+10/t) | Bonus Action | Rewind Death + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Aionatime ×10** | 56 | Action | Slow Time ×10 + Soul Tether ×10 | Take 3 consecutive turns while all else is frozen (damage lands when time resumes). Self-cost: you are Stunned when it ends. |

---

### Chronolumokinesis
**Chronokinesis + Lumokinesis** · Role: Controller + Controller · Attributes: INT / CHA

*Light-speed perception, temporal illumination, and accelerated awareness.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chronolumoaccelerate** | 14 | Action | Accelerate + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Chronolumolock** | 12 | Action | Temporal Lock + Hologram | Range 30 ft; target Rooted and loses reactions. |
| **Chronolumotime ×2** | 18 (+5/t) | Action | Slow Time ×2 + Radiance ×2 | 15-ft light: Blinded + 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chronolumorift** | 34 | Action | Temporal Rift + Prism Beam | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Chronolumofield** | 26 (+6/t) | Bonus Action | Haste Field + Illusory Army | Allies within 15 ft gain +10 ft move and advantage on initiative & reactions while active. |
| **Chronolumotime ×5** | 36 (+9/t) | Action | Slow Time ×5 + Radiance ×5 | 20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chronolumoparadox** | 56 | Action | Paradox + Second Sun | 40-ft radius; auto-hits for 6d6 + CHA radiant; Blinded. |
| **Chronolumodeath** | 48 | Action | Rewind Death + Grand Illusion | Rewind a fallen ally to before they died — revive to full HP. |
| **Chronolumotime ×10** | 56 (+8/t) | Action | Slow Time ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Symbiokinesis
**Biokinesis + Naturakinesis** · Role: Healer + Controller · Attributes: INT / WIS

*Symbiosis, adaptive organisms, living partnerships, and biological cooperation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Symbionecrosis** | 14 | Action | Necrosis + Poison Spores | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Symbiomutate** | 13 | Bonus Action | Mutate + Grasping Roots | Grant an ally a boon for the fight: +2 an attribute, natural weapons (1d8), or +move. |
| **Symbioregenesis ×2** | 18 (+5/t) | Action | Regenesis ×2 + Bloom ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Symbioplague** | 34 | Action | Plague + Thornstorm | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Symbiograft** | 28 (+7/t) | Action | Graft + Wall of Thorns | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Symbioregenesis ×5** | 36 (+9/t) | Action | Regenesis ×5 + Bloom ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Symbioextinction** | 62 | Action | Extinction + Primeval Forest | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Symbioapotheosis** | 50 (+10/t) | Bonus Action | Apotheosis + World Tree | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Symbioregenesis ×10** | 52 (+8/t) | Action | Regenesis ×10 + Bloom ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Cherubikinesis
**Biokinesis + Holykinesis** · Role: Healer + Healer · Attributes: INT / WIS

*Sacred biology, purification, miraculous healing, and divine restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cherubinecrosis** | 13 | Action | Necrosis + Radiant Beam | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Cherubimutate** | 13 (+4/t) | Bonus Action | Mutate + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Cherubiregenesis ×2** | 18 (+5/t) | Action | Regenesis ×2 + Sanctuary ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cherubiplague** | 32 | Action | Plague + Judgment | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Cherubigraft** | 30 | Action | Graft + Resurrection | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Cherubiregenesis ×5** | 36 (+9/t) | Action | Regenesis ×5 + Sanctuary ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cherubiextinction** | 62 | Action | Extinction + Divine Judgment | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Cherubiapotheosis** | 52 | Action | Apotheosis + Miracle | Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions. |
| **Cherubiregenesis ×10** | 52 | Action | Regenesis ×10 + Sanctuary ×10 | Regrow a body from a single cell — fully resurrect a dead ally to full HP/KP, restored perfectly. |

---

### Mutakinesis
**Biokinesis + Demokinesis** · Role: Healer + Tank · Attributes: INT / WIS

*Corruption, mutation, monstrous adaptation, and unstable evolution.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mutanecrosis** | 14 | Action | Necrosis + Terrify | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Mutamutate** | 13 | Action | Mutate + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Mutaregenesis ×2** | 18 (+5/t) | Action | Regenesis ×2 + Demon Form ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mutaplague** | 34 | Action | Plague + Hellstorm | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Mutagraft** | 30 | Action | Graft + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Mutaregenesis ×5** | 36 (+9/t) | Action | Regenesis ×5 + Demon Form ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mutaextinction** | 62 | Action | Extinction + Apocalypse | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Mutaapotheosis** | 48 | Action | Apotheosis + Pact of Ruin | Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions. |
| **Mutaregenesis ×10** | 52 (+8/t) | Bonus Action | Regenesis ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Sonobiokinesis
**Biokinesis + Sonikinesis** · Role: Healer + Tank · Attributes: INT / CHA

*Biological resonance, organs, healing frequencies, and internal vibration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonobionecrosis** | 15 | Action | Necrosis + Thunderclap | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Sonobiomutate** | 13 (+4/t) | Bonus Action | Mutate + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Sonobioregenesis ×2** | 18 (+5/t) | Action | Regenesis ×2 + Crescendo ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonobioplague** | 32 | Action | Plague + Shatter | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Sonobiograft** | 26 | Action | Graft + Deafening Roar | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Sonobioregenesis ×5** | 36 (+9/t) | Action | Regenesis ×5 + Crescendo ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sonobioextinction** | 62 | Action | Extinction + Sonic Boom | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Sonobioapotheosis** | 48 | Action | Apotheosis + Unbreakable Anthem | Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions. |
| **Sonobioregenesis ×10** | 52 (+8/t) | Bonus Action | Regenesis ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Psychokinesis
**Biokinesis + Spirikinesis** · Role: Healer + Healer · Attributes: INT / CHA

*Mind-body-spirit connection, consciousness, and spiritual awareness.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Psychonecrosis** | 13 | Action | Necrosis + Vengeful Spirit | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Psychomutate** | 13 | Action | Mutate + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Psychoregenesis ×2** | 18 | Action | Regenesis ×2 + Soul Tether ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Psychoplague** | 34 | Action | Plague + Spirit Storm | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Psychograft** | 30 | Action | Graft + Possession | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Psychoregenesis ×5** | 36 | Action | Regenesis ×5 + Soul Tether ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Psychoextinction** | 62 | Action | Extinction + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Psychoapotheosis** | 48 (+10/t) | Bonus Action | Apotheosis + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Psychoregenesis ×10** | 52 | Action | Regenesis ×10 + Soul Tether ×10 | Regrow a body from a single cell — fully resurrect a dead ally to full HP/KP, restored perfectly. |

---

### Chromakinesis
**Biokinesis + Lumokinesis** · Role: Healer + Controller · Attributes: INT / CHA

*Bioluminescence, cellular light, radiant adaptation, and living illumination.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chromanecrosis** | 13 | Action | Necrosis + Laser | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Chromamutate** | 12 | Bonus Action | Mutate + Hologram | Grant an ally a boon for the fight: +2 an attribute, natural weapons (1d8), or +move. |
| **Chromaregenesis ×2** | 18 (+5/t) | Action | Regenesis ×2 + Radiance ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chromaplague** | 34 | Action | Plague + Prism Beam | 15-ft radius; auto-hits for 3d8 + INT poison; enemies Weakened and can't heal. |
| **Chromagraft** | 28 | Action | Graft + Illusory Army | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Chromaregenesis ×5** | 36 (+9/t) | Action | Regenesis ×5 + Radiance ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chromaextinction** | 62 | Action | Extinction + Second Sun | 40-ft radius; auto-hits for 6d6 + INT necrotic; enemies Weakened and can't heal. |
| **Chromaapotheosis** | 50 | Action | Apotheosis + Grand Illusion | Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions. |
| **Chromaregenesis ×10** | 52 (+8/t) | Action | Regenesis ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Sanctukinesis
**Naturakinesis + Holykinesis** · Role: Controller + Healer · Attributes: WIS / WIS

*Sacred nature, healing growth, holy ecosystems, and protective life.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctuspores** | 13 | Action | Poison Spores + Radiant Beam | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Sancturoots** | 14 (+4/t) | Bonus Action | Grasping Roots + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Sanctubloom ×2** | 18 (+10/t) | Action | Bloom ×2 + Sanctuary ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctuthornstorm** | 34 | Action | Thornstorm + Judgment | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Sanctuthorns** | 30 (+7/t) | Bonus Action | Wall of Thorns + Resurrection | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Sanctubloom ×5** | 36 (+18/t) | Action | Bloom ×5 + Sanctuary ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctuforest** | 64 | Action | Primeval Forest + Divine Judgment | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Sanctutree** | 50 (+10/t) | Bonus Action | World Tree + Miracle | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Sanctubloom ×10** | 52 (+8/t) | Action | Bloom ×10 + Sanctuary ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Venokinesis
**Naturakinesis + Demokinesis** · Role: Controller + Tank · Attributes: WIS / WIS

*Poison, corrupted growth, aggressive evolution, and toxic life.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venospores** | 14 | Action | Poison Spores + Terrify | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Venoroots** | 14 | Action | Grasping Roots + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Venobloom ×2** | 18 (+10/t) | Action | Bloom ×2 + Demon Form ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venothornstorm** | 36 | Action | Thornstorm + Hellstorm | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Venothorns** | 30 (+7/t) | Action | Wall of Thorns + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Venobloom ×5** | 36 (+18/t) | Action | Bloom ×5 + Demon Form ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venoforest** | 64 | Action | Primeval Forest + Apocalypse | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Venotree** | 46 (+10/t) | Bonus Action | World Tree + Pact of Ruin | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Venobloom ×10** | 52 (+16/t) | Action | Bloom ×10 + Demon Form ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Chlorokinesis
**Naturakinesis + Sonikinesis** · Role: Controller + Tank · Attributes: WIS / CHA

*Plant resonance, growth through vibration, and living harmonics.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chlorospores** | 15 | Action | Poison Spores + Thunderclap | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Chlororoots** | 14 (+4/t) | Bonus Action | Grasping Roots + Anthem | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Chlorobloom ×2** | 18 (+10/t) | Action | Bloom ×2 + Crescendo ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chlorothornstorm** | 34 | Action | Thornstorm + Shatter | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Chlorothorns** | 26 (+7/t) | Bonus Action | Wall of Thorns + Deafening Roar | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Chlorobloom ×5** | 36 (+18/t) | Action | Bloom ×5 + Crescendo ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Chloroforest** | 64 | Action | Primeval Forest + Sonic Boom | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Chlorotree** | 46 (+10/t) | Bonus Action | World Tree + Unbreakable Anthem | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Chlorobloom ×10** | 52 (+16/t) | Action | Bloom ×10 + Crescendo ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Animismkinesis
**Naturakinesis + Spirikinesis** · Role: Controller + Healer · Attributes: WIS / CHA

*Nature spirits, animal allies, living landscapes, and spiritual ecosystems.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animismaspores** | 13 | Action | Poison Spores + Vengeful Spirit | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Animismaroots** | 14 | Action | Grasping Roots + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Animismabloom ×2** | 18 (+5/t) | Action | Bloom ×2 + Soul Tether ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animismathornstorm** | 36 | Action | Thornstorm + Spirit Storm | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Animismathorns** | 30 (+7/t) | Bonus Action | Wall of Thorns + Possession | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Animismabloom ×5** | 36 (+9/t) | Action | Bloom ×5 + Soul Tether ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animismaforest** | 64 | Action | Primeval Forest + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Animismatree** | 46 (+20/t) | Bonus Action | World Tree + Afterlife's Guard | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Animismabloom ×10** | 52 (+8/t) | Action | Bloom ×10 + Soul Tether ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Florakinesis
**Naturakinesis + Lumokinesis** · Role: Controller + Controller · Attributes: WIS / CHA

*Photosynthesis, radiant plants, living light, and solar growth.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Floraspores** | 13 | Action | Poison Spores + Laser | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Floraroots** | 13 | Action | Grasping Roots + Hologram | 15-ft radius; enemies Rooted. |
| **Florabloom ×2** | 18 (+10/t) | Action | Bloom ×2 + Radiance ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Florathornstorm** | 36 | Action | Thornstorm + Prism Beam | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Florathorns** | 28 (+7/t) | Bonus Action | Wall of Thorns + Illusory Army | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Florabloom ×5** | 36 (+18/t) | Action | Bloom ×5 + Radiance ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Floraforest** | 64 | Action | Primeval Forest + Second Sun | 40-ft radius; auto-hits for 6d6 + WIS; all enemies Rooted; terrain becomes dense forest. |
| **Floratree** | 48 (+10/t) | Bonus Action | World Tree + Grand Illusion | Allies within 30 ft heal 3d6/turn and revive at 1 HP; enemies Rooted while active. |
| **Florabloom ×10** | 52 (+16/t) | Action | Bloom ×10 + Radiance ×10 | 40-ft garden: all enemies Rooted + 4d6/turn; all allies heal 4d6/turn and are sheltered. You remain Rooted as its heart. |

---

### Divinikinesis
**Holykinesis + Demokinesis** · Role: Healer + Tank · Attributes: WIS / WIS

*Divine balance, judgment, spiritual equilibrium, and opposing forces.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Divinibeam** | 13 | Action | Radiant Beam + Terrify | Range 50 ft; 2d8 + WIS radiant damage. |
| **Diviniblessing** | 14 (+4/t) | Action | Greater Blessing + Life Leech | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Divinisanctuary ×2** | 18 (+10/t) | Bonus Action | Sanctuary ×2 + Demon Form ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Divinijudgment** | 34 | Action | Judgment + Hellstorm | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Diviniresurrection** | 32 | Action | Resurrection + Devour | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Divinisanctuary ×5** | 36 (+18/t) | Bonus Action | Sanctuary ×5 + Demon Form ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Diviniapocalypse** | 64 | Action | Divine Judgment + Apocalypse | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Divinimiracle** | 48 | Action | Miracle + Pact of Ruin | Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn. |
| **Divinisanctuary ×10** | 52 (+8/t) | Bonus Action | Sanctuary ×10 + Demon Form ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Hymnokinesis
**Holykinesis + Sonikinesis** · Role: Healer + Tank · Attributes: WIS / CHA

*Sacred sound, hymns, protective resonance, and divine harmony.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hymnobeam** | 14 | Action | Radiant Beam + Thunderclap | Range 50 ft; 2d8 + WIS radiant damage. |
| **Hymnoblessing** | 14 (+8/t) | Bonus Action | Greater Blessing + Anthem | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Hymnosanctuary ×2** | 18 (+10/t) | Bonus Action | Sanctuary ×2 + Crescendo ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hymnojudgment** | 32 | Action | Judgment + Shatter | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Hymnoresurrection** | 28 | Action | Resurrection + Deafening Roar | Revive a dead ally to half HP and cleanse. |
| **Hymnosanctuary ×5** | 36 (+18/t) | Bonus Action | Sanctuary ×5 + Crescendo ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Hymnoboom** | 64 | Action | Divine Judgment + Sonic Boom | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Hymnomiracle** | 48 | Action | Miracle + Unbreakable Anthem | Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn. |
| **Hymnosanctuary ×10** | 52 (+8/t) | Bonus Action | Sanctuary ×10 + Crescendo ×10 | 40-ft, +2d6/turn thunder to all enemies (building), +CHA to DS, allies buffed — but the peak Shocks everyone including allies and you can make no single-target actions. |

---

### Theokinesis
**Holykinesis + Spirikinesis** · Role: Healer + Healer · Attributes: WIS / CHA

*Divine spirits, blessings, soul protection, and sacred guardians.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Theobeam** | 12 | Action | Radiant Beam + Vengeful Spirit | Range 50 ft; 2d8 + WIS radiant damage. |
| **Theoblessing** | 14 (+4/t) | Action | Greater Blessing + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Theosanctuary ×2** | 18 (+5/t) | Bonus Action | Sanctuary ×2 + Soul Tether ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Theojudgment** | 34 | Action | Judgment + Spirit Storm | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Theoresurrection** | 32 | Action | Resurrection + Possession | Revive a dead ally to half HP and cleanse. |
| **Theosanctuary ×5** | 36 (+9/t) | Bonus Action | Sanctuary ×5 + Soul Tether ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Theodead** | 64 | Action | Divine Judgment + Wrath of the Dead | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Theomiracle** | 48 (+10/t) | Bonus Action | Miracle + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Theosanctuary ×10** | 52 | Action | Sanctuary ×10 + Soul Tether ×10 | 40-ft domain: allies fully healed each turn, revived if they fall, immune to harm; enemies take 4d6 radiant/turn + Blinded. You cannot move or act while it stands. |

---

### Empyreakinesis
**Holykinesis + Lumokinesis** · Role: Healer + Controller · Attributes: WIS / CHA

*Sacred radiance, angelic power, purification, and heavenly light.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Empyreabeam** | 12 | Action | Radiant Beam + Laser | Range 50 ft; 2d8 + WIS radiant damage. |
| **Empyreablessing** | 13 (+4/t) | Bonus Action | Greater Blessing + Hologram | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Empyreasanctuary ×2** | 18 (+10/t) | Bonus Action | Sanctuary ×2 + Radiance ×2 | 15-ft zone: allies heal 2d6/turn + immune to Fear; enemies 2d6 radiant/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Empyreajudgment** | 34 | Action | Judgment + Prism Beam | 4d8 + WIS radiant to a target (double vs undead/evil). |
| **Empyrearesurrection** | 30 | Action | Resurrection + Illusory Army | Revive a dead ally to half HP and cleanse. |
| **Empyreasanctuary ×5** | 36 (+18/t) | Bonus Action | Sanctuary ×5 + Radiance ×5 | 20-ft zone: allies heal 3d6/turn + DR; enemies 3d6 radiant + Blinded. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Empyreasun** | 64 | Action | Divine Judgment + Second Sun | 40-ft radius; auto-hits enemies for 6d6 + WIS radiant (double vs evil); allies healed 2d6. |
| **Empyreamiracle** | 50 | Action | Miracle + Grand Illusion | Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn. |
| **Empyreasanctuary ×10** | 52 (+8/t) | Action | Sanctuary ×10 + Radiance ×10 | 40-ft: everyone but you is Blinded; enemies take 5d6/turn radiant. Overwhelming light. |

---

### Dissonakinesis
**Demokinesis + Sonikinesis** · Role: Tank + Tank · Attributes: WIS / CHA

*Discord, fear, destructive resonance, and psychological pressure.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Dissonaterrify** | 15 | Action | Terrify + Thunderclap | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Dissonaleech** | 14 (+4/t) | Action | Life Leech + Anthem | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Dissonaform ×2** | 18 (+10/t) | Bonus Action | Demon Form ×2 + Crescendo ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Dissonahellstorm** | 34 | Action | Hellstorm + Shatter | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Dissonadevour** | 28 | Action | Devour + Deafening Roar | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Dissonaform ×5** | 36 (+18/t) | Bonus Action | Demon Form ×5 + Crescendo ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Dissonaapocalypse** | 64 | Action | Apocalypse + Sonic Boom | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Dissonaruin** | 44 | Reaction | Pact of Ruin + Unbreakable Anthem | When you drop to 0 HP, return to half HP and deal 4d6 to all enemies within 20 ft. Once per long rest. |
| **Dissonaform ×10** | 52 (+16/t) | Bonus Action | Demon Form ×10 + Crescendo ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Necrokinesis
**Demokinesis + Spirikinesis** · Role: Tank + Healer · Attributes: WIS / CHA

*Death energy, curses, hostile spirits, and necromantic power.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Necroterrify** | 13 | Action | Terrify + Vengeful Spirit | Range 40 ft; 2d8 + CHA spectral damage. |
| **Necroleech** | 14 | Action | Life Leech + Mend Soul | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Necroform ×2** | 18 (+5/t) | Bonus Action | Demon Form ×2 + Soul Tether ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Necrohellstorm** | 36 | Action | Hellstorm + Spirit Storm | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Necrodevour** | 32 | Action | Devour + Possession | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Necroform ×5** | 36 (+9/t) | Bonus Action | Demon Form ×5 + Soul Tether ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Necroapocalypse** | 64 | Action | Apocalypse + Wrath of the Dead | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Necroruin** | 44 (+10/t) | Bonus Action | Pact of Ruin + Afterlife's Guard | Allies within 20 ft can't die (stay at 1 HP) and heal 3d6/turn while active. |
| **Necroform ×10** | 52 (+8/t) | Bonus Action | Demon Form ×10 + Soul Tether ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

### Luciferkinesis
**Demokinesis + Lumokinesis** · Role: Tank + Controller · Attributes: WIS / CHA

*Corrupted light, infernal radiance, deception, and blinding power.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luciferaterrify** | 13 | Action | Terrify + Laser | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Luciferaleech** | 13 | Action | Life Leech + Hologram | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Luciferaform ×2** | 18 (+10/t) | Bonus Action | Demon Form ×2 + Radiance ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luciferahellstorm** | 36 | Action | Hellstorm + Prism Beam | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Luciferadevour** | 30 | Action | Devour + Illusory Army | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Luciferaform ×5** | 36 (+18/t) | Bonus Action | Demon Form ×5 + Radiance ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Luciferapocalypse** | 64 | Action | Apocalypse + Second Sun | 40-ft radius; auto-hits for 6d6 + WIS necrotic; Feared and Weakened. |
| **Luciferaruin** | 46 | Reaction | Pact of Ruin + Grand Illusion | When you drop to 0 HP, return to half HP and deal 4d6 to all enemies within 20 ft. Once per long rest. |
| **Luciferaform ×10** | 52 (+16/t) | Bonus Action | Demon Form ×10 + Radiance ×10 | +15 STR & WIS, claws 4d6, DR, fear aura, flight. Completely blacks out your Third Eye chakra (you lose yourself to the demon). |

---

> **App status:** ✅ All 153 fusions × 9 techniques = **1377** are loaded (`PC.FUSION_TECHNIQUES`), hidden
> until unlocked and auto-granted by parent-technique pairs. `PC.grantedFusionTechniques(known)` /
> `PC.unlockedFusions(known)` drive the reveal.
