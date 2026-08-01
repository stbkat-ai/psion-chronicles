# Psion Chronicles — Fusion Kinetics Library

> **GM / design reference — a hidden system.** Fusion Kinetics are **not** in the Player's Guide; players
> discover them in play. Keep this file out of player hands. Source of truth for `app/data.js`
> (`PC.FUSIONS` + `PC.FUSION_TECHNIQUES`). Built from the *Fusion Kinetics Compendium*.

## What a Fusion is
A Fusion Kinetic is two standard Kinetics combined. Each **fusion technique is a specific pairing of one
technique from each parent**, offset one tier up: a fusion's **Adept** techniques pair the parents'
**Beginner** techniques, **Expert** pairs the parents' **Adept**, **Master** pairs the parents' **Expert**.
(So fusions "start at tier 2" — they have Adept / Expert / Master, no Beginner. 3 per tier = **9 each**.)

## How they unlock (automatic, hidden until then)
- A character **automatically gains** a fusion technique the instant they know **both** of its parent
  techniques — **no Technique Points spent**. The fusion stays completely hidden until the first pair lands,
  then it reveals on the play sheet's **Kinetics** tab (with a one-time *"✨ Fusion discovered"* toast) and its
  techniques become usable in **Combat**.
- Example: knowing **Ki Strike** (Robukinesis) + **Fire Bolt** (Pyrokinesis) grants **Nucastrike**
  (Nuclekinesis, Adept).
- Fusion techniques are **powerful and expensive** — their KP cost is the sum of both parent halves.
- A fusion is tied to **both** parents' attributes and chakras. *Planned rule (not yet implemented): if
  either parent chakra is damaged, the fusion's techniques are less effective.*
- **Established** fusions are locked canon; **Provisional** ones are concept-pass and may change.
- Technique names, effects, and costs below are a **concept pass** — tune in playtest.

---

## Established Fusions

### Nuclekinesis
**Robukinesis + Pyrokinesis** · Role: Tank + Controller · Attributes: STR / STR

*Nuclear energy and concentrated destructive force.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nucastrike** | 5 | Action | Ki Strike + Fire Bolt | Range 30 ft; 1d8 + STR fire damage. |
| **Nucashield** | 7 (+1/t) | Action | Ki Shield + Scorch | Range 40 ft; 1d8 + STR fire; on a hit the target's next attack has disadvantage. |
| **Nucaflame** | 14 (+7/t) | Action | Ki Flame + Conflagration | +2 STR, AGI, CON while active (may exceed 30). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nucagrip** | 11 (+3/t) | Action | Kinetic Grip + Blazing Speed | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Nucabody** | 20 (+3/t) | Action | Iron Body + Fireball | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Nucaflame ×2** | 23 (+12/t) | Action | Ki Flame ×2 + Conflagration ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Nucablow** | 25 (+7/t) | Action | Titan's Blow + Firestorm Wall | Melee; 3d8 + STR force and push the target 10 ft. |
| **Nucaura** | 36 (+6/t) | Action | Bastion Aura + Meteor | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Nucaflame ×5** | 36 (+18/t) | Action | Ki Flame ×5 + Conflagration ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

---

### Animakinesis
**Robukinesis + Electrokinesis** · Role: Tank + Healer · Attributes: STR / STR

*Animation, life-energy, restoration, and awakened constructs.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animastrike** | 5 | Action | Ki Strike + Spark | Range 30 ft; 1d8 + STR lightning damage. |
| **Animashield** | 5 (+1/t) | Action | Ki Shield + Mend Current | Heal an ally 1d8 + STR HP. |
| **Animaflame** | 11 (+3/t) | Action | Ki Flame + Defibrillate | Heal an ally 1d10 + STR; if they are at 0 HP, they revive at that much HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animagrip** | 13 | Action | Kinetic Grip + Chain Lightning | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Animabody** | 10 (+3/t) | Action | Iron Body + Cleanse Current | End one condition on an ally and heal 1d6 + STR HP. |
| **Animaflame ×2** | 16 (+5/t) | Action | Ki Flame ×2 + Defibrillate ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Animablow** | 29 | Action | Titan's Blow + Lightning Storm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Animaura** | 23 (+6/t) | Action | Bastion Aura + Mass Mend | Heal all allies within 20 ft 2d8 + STR HP. |
| **Animaflame ×5** | 32 (+9/t) | Action | Ki Flame ×5 + Defibrillate ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

---

### Plasmakinesis
**Pyrokinesis + Electrokinesis** · Role: Controller + Healer · Attributes: STR / STR

*Plasma, ionized matter, extreme heat, and electrical energy.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmabolt** | 6 | Action | Fire Bolt + Spark | Range 30 ft; 1d8 + STR fire damage. |
| **Plasmascorch** | 8 | Action | Scorch + Mend Current | Range 40 ft; 1d8 + STR fire; on a hit the target's next attack has disadvantage. |
| **Plasmaconflagration** | 13 (+4/t) | Action | Conflagration + Defibrillate | Heal an ally 1d10 + STR; if they are at 0 HP, they revive at that much HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmaspeed** | 14 (+3/t) | Action | Blazing Speed + Chain Lightning | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Plasmafireball** | 18 | Action | Fireball + Cleanse Current | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Plasmaconflagration ×2** | 21 (+7/t) | Action | Conflagration ×2 + Defibrillate ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Plasmawall** | 32 (+7/t) | Action | Firestorm Wall + Lightning Storm | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Plasmameteor** | 35 | Action | Meteor + Mass Mend | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Plasmaconflagration ×5** | 32 (+9/t) | Action | Conflagration ×5 + Defibrillate ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

---

### Vapokinesis
**Aerokinesis + Umbrakinesis** · Role: Tank + Controller · Attributes: AGI / AGI

*Gas, vapor, phasing, teleportation, poison, and paralysis.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapagust** | 7 (+1/t) | Action | Gust + Shroud of Shadows | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Vapastep** | 6 | Action | Zephyr Step + Umbral Dagger | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Vapatempest** | 10 (+4/t) | Action | Tempest + Nightfall | 5-ft whirlwind: enemies starting adjacent take 1d6 wind and are pushed 5 ft; +AGI to Defense Score. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapawall** | 12 (+4/t) | Bonus Action | Wind Wall + Shadow Step | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Vapadash** | 12 | Action | Air Dash + Umbral Drain | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Vapatempest ×2** | 18 (+10/t) | Action | Tempest ×2 + Nightfall ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Vapahurricane** | 36 | Action | Hurricane + Shadow Storm | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Vapatornado** | 28 (+8/t) | Action | Tornado + Void Grip | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Vapatempest ×5** | 36 (+18/t) | Action | Tempest ×5 + Nightfall ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

---

### Liquikinesis
**Aerokinesis + Hydrokinesis** · Role: Tank + Healer · Attributes: AGI / AGI

*Fluidity, liquid manipulation, adaptive movement, and restorative flow.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liqugust** | 8 | Action | Gust + Water Jet | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Liqustep** | 5 | Action | Zephyr Step + Soothing Flow | Heal an ally 1d8 + AGI HP. |
| **Liqutempest** | 10 (+2/t) | Action | Tempest + Tide | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liquwall** | 14 (+4/t) | Action | Wind Wall + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Liqudash** | 12 | Action | Air Dash + Riptide | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Liqutempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Liquhurricane** | 36 | Action | Hurricane + Tsunami | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Liqutornado** | 27 (+8/t) | Action | Tornado + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Liqutempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Deepkinesis
**Umbrakinesis + Hydrokinesis** · Role: Controller + Healer · Attributes: AGI / AGI

*The abyss, eldritch depths, horrors, summons, buffs, and debuffs.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepashadows** | 7 (+1/t) | Action | Shroud of Shadows + Water Jet | Range 30 ft; 1d8 + AGI water; push the target 5 ft. |
| **Deepadagger** | 7 | Action | Umbral Dagger + Soothing Flow | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Deepanightfall** | 10 (+2/t) | Action | Nightfall + Tide | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepastep** | 12 | Action | Shadow Step + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Deepadrain** | 14 | Action | Umbral Drain + Riptide | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Deepanightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Deepastorm** | 36 | Action | Shadow Storm + Tsunami | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Deepagrip** | 23 | Action | Void Grip + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Deepanightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Crystakinesis
**Terrakinesis + Cryokinesis** · Role: Tank + Controller · Attributes: CON / CON

*Crystal structures, barriers, resonant energy, buffs, and debuffs.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystathrow** | 6 | Action | Rock Throw + Frost Bolt | Range 30 ft; 1d8 + CON earth damage. |
| **Crystaskin** | 6 (+2/t) | Bonus Action | Mud Skin + Ice Armor | Add your CON mod to your Defense Score while active. |
| **Crystastoneform** | 10 (+2/t) | Action | Stoneform + Absolute Zero | Reduce incoming damage by CON mod and +CON to Defense Score; movement −10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystawall** | 17 (+4/t) | Action | Stone Wall + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Crystearthquake** | 16 | Action | Earthquake + Rime | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Crystastoneform ×2** | 18 (+5/t) | Action | Stoneform ×2 + Absolute Zero ×2 | Damage reduction = CON mod ×2, +CON to DS, can't be moved; movement halved. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Crystafissure** | 36 | Action | Fissure + Blizzard | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Crystaegis** | 26 (+6/t) | Action | Mountain's Aegis + Flash Freeze | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Crystastoneform ×5** | 36 (+9/t) | Action | Stoneform ×5 + Absolute Zero ×5 | DR = CON mod ×3, large temp HP each turn, enemies must target you (taunt); you cannot move. |

---

### Construkinesis
**Terrakinesis + Vitakinesis** · Role: Tank + Healer · Attributes: CON / CON

*Golems, animated stone, constructs, and guardians.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construthrow** | 6 | Action | Rock Throw + Life Touch | Range 30 ft; 1d8 + CON earth damage. |
| **Construskin** | 6 (+1/t) | Action | Mud Skin + Purge Toxin | Add your CON mod to your Defense Score while active. |
| **Construstoneform** | 10 (+2/t) | Action | Stoneform + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construwall** | 14 (+4/t) | Action | Stone Wall + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Construearthquake** | 18 | Action | Earthquake + Second Life | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Construstoneform ×2** | 18 (+5/t) | Action | Stoneform ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Construfissure** | 30 | Action | Fissure + Mass Heal | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Construaegis** | 26 (+13/t) | Bonus Action | Mountain's Aegis + Wellspring of Life | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Construstoneform ×5** | 36 (+9/t) | Action | Stoneform ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Endurakinesis
**Cryokinesis + Vitakinesis** · Role: Controller + Healer · Attributes: CON / CON

*Resistance, adaptation, fortification, and defensive enhancement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Endurabolt** | 6 | Action | Frost Bolt + Life Touch | Range 30 ft; 1d8 + CON cold damage. |
| **Endurarmor** | 6 (+1/t) | Action | Ice Armor + Purge Toxin | +CON to Defense Score; melee attackers take 1d4 cold. |
| **Endurazero** | 10 | Action | Absolute Zero + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Enduranova** | 17 | Action | Frost Nova + Greater Heal | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Endurarime** | 14 | Action | Rime + Second Life | A 15-ft area becomes ice — difficult terrain; creatures there are Slowed. |
| **Endurazero ×2** | 18 | Action | Absolute Zero ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Endurablizzard** | 30 | Action | Blizzard + Mass Heal | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Endurafreeze** | 28 (+7/t) | Action | Flash Freeze + Wellspring of Life | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Endurazero ×5** | 36 | Action | Absolute Zero ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Cyclokinesis
**Robukinesis + Aerokinesis** · Role: Tank + Tank · Attributes: STR / AGI

*Rotational Ki, vortex combat, spiraling force, and spinning defenses.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cyclostrike** | 6 | Action | Ki Strike + Gust | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Cycloshield** | 4 (+1/t) | Bonus Action | Ki Shield + Zephyr Step | Add your STR mod to your Defense Score while active. |
| **Cycloflame** | 11 (+5/t) | Bonus Action | Ki Flame + Tempest | +2 STR, AGI, CON while active (may exceed 30). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cyclogrip** | 12 (+4/t) | Action | Kinetic Grip + Wind Wall | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Cyclobody** | 11 (+3/t) | Bonus Action | Iron Body + Air Dash | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Cycloflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Tempest ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cycloblow** | 29 | Action | Titan's Blow + Hurricane | Melee; 3d8 + STR force and push the target 10 ft. |
| **Cycloaura** | 28 (+14/t) | Bonus Action | Bastion Aura + Tornado | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Cycloflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Tempest ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

---

### Eclikinesis
**Robukinesis + Umbrakinesis** · Role: Tank + Controller · Attributes: STR / AGI

*Suppression, oppressive force, darkness, and battlefield domination.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Eclistrike** | 5 (+1/t) | Action | Ki Strike + Shroud of Shadows | On a successful melee attack, add 1d6 + STR force damage to that hit. |
| **Eclishield** | 6 (+1/t) | Action | Ki Shield + Umbral Dagger | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Ecliflame** | 11 (+5/t) | Action | Ki Flame + Nightfall | +2 STR, AGI, CON while active (may exceed 30). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ecligrip** | 10 | Action | Kinetic Grip + Shadow Step | Range 30 ft; the target is Rooted. |
| **Eclibody** | 13 (+3/t) | Action | Iron Body + Umbral Drain | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Ecliflame ×2** | 18 (+10/t) | Action | Ki Flame ×2 + Nightfall ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Ecliblow** | 29 | Action | Titan's Blow + Shadow Storm | Melee; 3d8 + STR force and push the target 10 ft. |
| **Ecliaura** | 24 (+6/t) | Action | Bastion Aura + Void Grip | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Ecliflame ×5** | 36 (+18/t) | Action | Ki Flame ×5 + Nightfall ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

---

## Provisional Fusions

### Fluxkinesis
**Robukinesis + Hydrokinesis** · Role: Tank + Healer · Attributes: STR / AGI

*Flowing Ki, momentum redirection, restorative force, and adaptive defense.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxastrike** | 6 | Action | Ki Strike + Water Jet | Range 30 ft; 1d8 + AGI water; push the target 5 ft. |
| **Fluxashield** | 5 (+1/t) | Action | Ki Shield + Soothing Flow | Heal an ally 1d8 + AGI HP. |
| **Fluxaflame** | 11 (+3/t) | Action | Ki Flame + Tide | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxagrip** | 12 | Action | Kinetic Grip + Healing Surge | Heal an ally 2d8 + AGI HP. |
| **Fluxabody** | 13 (+3/t) | Action | Iron Body + Riptide | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Fluxaflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Tide ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Fluxablow** | 29 | Action | Titan's Blow + Tsunami | Melee; 3d8 + STR force and push the target 10 ft. |
| **Fluxaura** | 23 (+6/t) | Action | Bastion Aura + Mass Renewal | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Fluxaflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Tide ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Seismokinesis
**Robukinesis + Terrakinesis** · Role: Tank + Tank · Attributes: STR / CON

*Seismic force, impact, shockwaves, and unstoppable momentum.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismastrike** | 5 | Action | Ki Strike + Rock Throw | Range 30 ft; 1d8 + CON earth damage. |
| **Seismashield** | 5 (+2/t) | Bonus Action | Ki Shield + Mud Skin | Add your STR mod to your Defense Score while active. |
| **Seismaflame** | 11 (+5/t) | Bonus Action | Ki Flame + Stoneform | +2 STR, AGI, CON while active (may exceed 30). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismagrip** | 12 (+4/t) | Action | Kinetic Grip + Stone Wall | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Seismabody** | 16 (+3/t) | Action | Iron Body + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Seismaflame ×2** | 18 (+10/t) | Bonus Action | Ki Flame ×2 + Stoneform ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Seismablow** | 29 | Action | Titan's Blow + Fissure | Melee; 3d8 + STR force and push the target 10 ft. |
| **Seismaura** | 24 (+12/t) | Bonus Action | Bastion Aura + Mountain's Aegis | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Seismaflame ×5** | 36 (+18/t) | Bonus Action | Ki Flame ×5 + Stoneform ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

---

### Glaciokinesis
**Robukinesis + Cryokinesis** · Role: Tank + Controller · Attributes: STR / CON

*Frozen martial energy, stillness, discipline, and defensive control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glacistrike** | 5 | Action | Ki Strike + Frost Bolt | Range 30 ft; 1d8 + CON cold damage. |
| **Glacishield** | 5 (+2/t) | Bonus Action | Ki Shield + Ice Armor | Add your STR mod to your Defense Score while active. |
| **Glaciflame** | 11 (+3/t) | Action | Ki Flame + Absolute Zero | +2 STR, AGI, CON while active (may exceed 30). |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glacigrip** | 15 | Action | Kinetic Grip + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Glacibody** | 12 (+3/t) | Action | Iron Body + Rime | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Glaciflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Absolute Zero ×2 | +4 STR, AGI, CON while active. Also drains 1d4 HP each turn (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Glaciblow** | 29 | Action | Titan's Blow + Blizzard | Melee; 3d8 + STR force and push the target 10 ft. |
| **Glaciaura** | 26 (+6/t) | Action | Bastion Aura + Flash Freeze | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Glaciflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Absolute Zero ×5 | +8 STR, AGI, CON while active. Drains 1d6 HP/turn AND deals 2 hits to your Core chakra on activation. |

---

### Aurakinesis
**Robukinesis + Vitakinesis** · Role: Tank + Healer · Attributes: STR / CON

*Living aura, empowerment, vitality, Ki sharing, and sustained combat.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aurastrike** | 5 | Action | Ki Strike + Life Touch | On a successful melee attack, add 1d6 + STR force damage to that hit. |
| **Aurashield** | 5 (+1/t) | Action | Ki Shield + Purge Toxin | Add your STR mod to your Defense Score while active. |
| **Auraflame** | 11 (+3/t) | Action | Ki Flame + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Auragrip** | 12 | Action | Kinetic Grip + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Aurabody** | 14 (+3/t) | Action | Iron Body + Second Life | Reduce all incoming damage by your STR mod (min 1) while active. |
| **Auraflame ×2** | 18 (+5/t) | Action | Ki Flame ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Aurablow** | 23 | Action | Titan's Blow + Mass Heal | Melee; 3d8 + STR force and push the target 10 ft. |
| **Auraura** | 26 (+13/t) | Bonus Action | Bastion Aura + Wellspring of Life | You and allies within 15 ft gain +STR mod to Defense Score while active. |
| **Auraflame ×5** | 36 (+9/t) | Action | Ki Flame ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Magmakinesis
**Pyrokinesis + Terrakinesis** · Role: Controller + Tank · Attributes: STR / CON

*Magma, molten stone, volcanic armor, and battlefield transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmabolt** | 6 | Action | Fire Bolt + Rock Throw | Range 30 ft; 1d8 + STR fire damage. |
| **Magmascorch** | 8 (+1/t) | Action | Scorch + Mud Skin | Range 40 ft; 1d8 + STR fire; on a hit the target's next attack has disadvantage. |
| **Magmaconflagration** | 13 (+6/t) | Action | Conflagration + Stoneform | 10-ft fire zone within 30 ft; creatures inside take 1d6 fire and gain Burning each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmaspeed** | 13 (+7/t) | Bonus Action | Blazing Speed + Stone Wall | Movement +15 ft; you leave a 5-ft fire trail (creatures entering take 1d6 fire) while active. |
| **Magmafireball** | 24 | Action | Fireball + Earthquake | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Magmaconflagration ×2** | 23 (+12/t) | Action | Conflagration ×2 + Stoneform ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magmawall** | 32 (+7/t) | Action | Firestorm Wall + Fissure | 30-ft line; auto-hits for 3d8 + CON earth; enemies fall prone and are Rooted. |
| **Magmameteor** | 36 (+6/t) | Action | Meteor + Mountain's Aegis | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Magmaconflagration ×5** | 36 (+18/t) | Action | Conflagration ×5 + Stoneform ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

---

### Thermokinesis
**Pyrokinesis + Cryokinesis** · Role: Controller + Controller · Attributes: STR / CON

*Temperature, thermal shock, rapid heating, and rapid cooling.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermabolt** | 6 | Action | Fire Bolt + Frost Bolt | Range 30 ft; 1d8 + STR fire damage. |
| **Thermascorch** | 8 (+1/t) | Action | Scorch + Ice Armor | Range 40 ft; 1d8 + STR fire; on a hit the target's next attack has disadvantage. |
| **Thermaconflagration** | 13 (+4/t) | Action | Conflagration + Absolute Zero | 10-ft fire zone within 30 ft; creatures inside take 1d6 fire and gain Burning each turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermaspeed** | 16 (+3/t) | Action | Blazing Speed + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Thermafireball** | 20 | Action | Fireball + Rime | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Thermaconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Absolute Zero ×2 | 15-ft zone: 2d6 fire + Burning each turn; the zone spreads 5 ft each turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Thermawall** | 32 (+7/t) | Action | Firestorm Wall + Blizzard | 20-ft radius; auto-hits for 3d8 + CON cold; targets Slowed. |
| **Thermameteor** | 38 | Action | Meteor + Flash Freeze | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Thermaconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Absolute Zero ×5 | 20-ft zone: 3d6 fire + Burning each turn; spreads 10 ft/turn; now also ignites allies caught inside. |

---

### Phoenixkinesis
**Pyrokinesis + Vitakinesis** · Role: Controller + Healer · Attributes: STR / CON

*Renewal through flame, cleansing fire, rebirth, and restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixabolt** | 6 | Action | Fire Bolt + Life Touch | Range 30 ft; 1d8 + STR fire damage. |
| **Phoenixascorch** | 8 | Action | Scorch + Purge Toxin | Range 40 ft; 1d8 + STR fire; on a hit the target's next attack has disadvantage. |
| **Phoenixaconflagration** | 13 (+4/t) | Action | Conflagration + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixaspeed** | 13 (+3/t) | Action | Blazing Speed + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Phoenixafireball** | 22 | Action | Fireball + Second Life | 15-ft radius within 60 ft; auto-hits for 2d8 + STR fire; targets gain Burning. |
| **Phoenixaconflagration ×2** | 23 (+7/t) | Action | Conflagration ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Phoenixawall** | 26 (+7/t) | Action | Firestorm Wall + Mass Heal | Heal all allies within 20 ft 2d8 + CON HP. |
| **Phoenixameteor** | 38 (+7/t) | Action | Meteor + Wellspring of Life | 20-ft radius within 90 ft; auto-hits for 4d8 + STR fire; leaves burning ground (1d6/turn) for 3 turns. |
| **Phoenixaconflagration ×5** | 36 (+9/t) | Action | Conflagration ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Magnekinesis
**Electrokinesis + Terrakinesis** · Role: Healer + Tank · Attributes: STR / CON

*Magnetism, attraction, repulsion, metal control, and magnetic shields.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnaspark** | 6 | Action | Spark + Rock Throw | Range 30 ft; 1d8 + STR lightning damage. |
| **Magnacurrent** | 6 (+1/t) | Action | Mend Current + Mud Skin | Heal an ally 1d8 + STR HP. |
| **Magnadefibrillate** | 10 (+2/t) | Action | Defibrillate + Stoneform | Heal an ally 1d10 + STR; if they are at 0 HP, they revive at that much HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnalightning** | 15 (+4/t) | Action | Chain Lightning + Stone Wall | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Magnearthquake** | 14 | Action | Cleanse Current + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Magnadefibrillate ×2** | 16 (+5/t) | Action | Defibrillate ×2 + Stoneform ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Magnastorm** | 36 | Action | Lightning Storm + Fissure | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Magnamend** | 23 (+6/t) | Action | Mass Mend + Mountain's Aegis | Heal all allies within 20 ft 2d8 + STR HP. |
| **Magnadefibrillate ×5** | 32 (+9/t) | Action | Defibrillate ×5 + Stoneform ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

---

### Cryoelectrokinesis
**Electrokinesis + Cryokinesis** · Role: Healer + Controller · Attributes: STR / CON

*Electrical cold, paralysis, stasis, and preservation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryelaspark** | 6 | Action | Spark + Frost Bolt | Range 30 ft; 1d8 + STR lightning damage. |
| **Cryelacurrent** | 6 (+1/t) | Action | Mend Current + Ice Armor | Heal an ally 1d8 + STR HP. |
| **Cryeladefibrillate** | 10 | Action | Defibrillate + Absolute Zero | Heal an ally 1d10 + STR; if they are at 0 HP, they revive at that much HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryelalightning** | 18 | Action | Chain Lightning + Frost Nova | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Cryelarime** | 10 | Action | Cleanse Current + Rime | End one condition on an ally and heal 1d6 + STR HP. |
| **Cryeladefibrillate ×2** | 16 | Action | Defibrillate ×2 + Absolute Zero ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Cryelastorm** | 36 | Action | Lightning Storm + Blizzard | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Cryelamend** | 25 | Action | Mass Mend + Flash Freeze | Heal all allies within 20 ft 2d8 + STR HP. |
| **Cryeladefibrillate ×5** | 32 | Action | Defibrillate ×5 + Absolute Zero ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

---

### Neurokinesis
**Electrokinesis + Vitakinesis** · Role: Healer + Healer · Attributes: STR / CON

*Nervous systems, stimulation, coordination, and restorative control.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neuraspark** | 6 | Action | Spark + Life Touch | Range 30 ft; 1d8 + STR lightning damage. |
| **Neuracurrent** | 6 | Action | Mend Current + Purge Toxin | Heal an ally 1d8 + STR HP. |
| **Neuradefibrillate** | 10 | Action | Defibrillate + Renewal | Heal an ally 1d10 + STR; if they are at 0 HP, they revive at that much HP. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neuralightning** | 15 | Action | Chain Lightning + Greater Heal | Range 40 ft; 1d10 + STR lightning, then arcs 1d6 to up to 2 more within 15 ft. |
| **Neuralife** | 12 | Action | Cleanse Current + Second Life | End one condition on an ally and heal 1d6 + STR HP. |
| **Neuradefibrillate ×2** | 16 | Action | Defibrillate ×2 + Renewal ×2 | Heal 2d10 + STR; revives a downed ally to half HP. Drains 1d6 of your HP (self-cost). |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Neurastorm** | 30 | Action | Lightning Storm + Mass Heal | 20-ft radius within 60 ft; auto-hits for 3d8 + STR lightning; targets Shocked. |
| **Neuramend** | 25 (+7/t) | Action | Mass Mend + Wellspring of Life | Heal all allies within 20 ft 2d8 + STR HP. |
| **Neuradefibrillate ×5** | 32 | Action | Defibrillate ×5 + Renewal ×5 | Revive up to 2 downed allies to half HP (or heal one 4d6 + STR). Drains your HP and deals 2 hits to your Core chakra. |

---

### Geokinesis
**Aerokinesis + Terrakinesis** · Role: Tank + Tank · Attributes: AGI / CON

*Dust, sand, erosion, moving terrain, and abrasive storms.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geogust** | 7 | Action | Gust + Rock Throw | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Geostep** | 5 (+1/t) | Bonus Action | Zephyr Step + Mud Skin | Add your CON mod to your Defense Score while active. |
| **Geotempest** | 10 (+4/t) | Bonus Action | Tempest + Stoneform | 5-ft whirlwind: enemies starting adjacent take 1d6 wind and are pushed 5 ft; +AGI to Defense Score. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geowall** | 14 (+8/t) | Bonus Action | Wind Wall + Stone Wall | 20-ft wall of wind blocks ranged attacks and deflects projectiles while active. |
| **Geodash** | 15 | Action | Air Dash + Earthquake | 15-ft radius; auto-hits for 2d8 + CON earth; prone + difficult terrain. |
| **Geotempest ×2** | 18 (+10/t) | Bonus Action | Tempest ×2 + Stoneform ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Geohurricane** | 36 | Action | Hurricane + Fissure | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Geotornado** | 28 (+14/t) | Bonus Action | Tornado + Mountain's Aegis | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Geotempest ×5** | 36 (+18/t) | Bonus Action | Tempest ×5 + Stoneform ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

---

### Boreakinesis
**Aerokinesis + Cryokinesis** · Role: Tank + Controller · Attributes: AGI / CON

*Arctic winds, blizzards, frozen movement, and hostile environments.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Boregust** | 7 | Action | Gust + Frost Bolt | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Borestep** | 5 (+1/t) | Bonus Action | Zephyr Step + Ice Armor | +CON to Defense Score; melee attackers take 1d4 cold. |
| **Boretempest** | 10 (+2/t) | Action | Tempest + Absolute Zero | 5-ft whirlwind: enemies starting adjacent take 1d6 wind and are pushed 5 ft; +AGI to Defense Score. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Borewall** | 17 (+4/t) | Action | Wind Wall + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Boredash** | 11 | Action | Air Dash + Rime | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Boretempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Absolute Zero ×2 | 10-ft whirlwind: 2d6 wind + push 10 ft to enemies; +AGI to Defense Score; allies inside are buffeted 5 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Borehurricane** | 36 | Action | Hurricane + Blizzard | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Boretornado** | 30 (+8/t) | Action | Tornado + Flash Freeze | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Boretempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Absolute Zero ×5 | 20-ft whirlwind: 3d6 wind + push; +AGI to DS; now sweeps allies too (1d6 + push). |

---

### Zephyrkinesis
**Aerokinesis + Vitakinesis** · Role: Tank + Healer · Attributes: AGI / CON

*Restorative wind, breath, cleansing currents, and enhanced movement.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyragust** | 7 | Action | Gust + Life Touch | Range 30 ft; 1d8 + AGI wind; push the target 5 ft. |
| **Zephyrastep** | 5 | Action | Zephyr Step + Purge Toxin | +15 ft movement this turn; you don't provoke opportunity attacks. |
| **Zephyratempest** | 10 (+2/t) | Action | Tempest + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyrawall** | 14 (+4/t) | Action | Wind Wall + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Zephyradash** | 13 | Action | Air Dash + Second Life | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Zephyratempest ×2** | 18 (+5/t) | Action | Tempest ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Zephyrahurricane** | 30 | Action | Hurricane + Mass Heal | 20-ft radius; auto-hits for 3d8 + AGI wind; all pushed 15 ft and knocked prone. |
| **Zephyratornado** | 30 (+15/t) | Bonus Action | Tornado + Wellspring of Life | A 10-ft tornado you control; creatures inside take 2d6 wind and are Rooted while active. |
| **Zephyratempest ×5** | 36 (+9/t) | Action | Tempest ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Obsidikinesis
**Umbrakinesis + Terrakinesis** · Role: Controller + Tank · Attributes: AGI / CON

*Obsidian, black glass, hidden fortification, traps, and precision.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidashadows** | 6 (+1/t) | Action | Shroud of Shadows + Rock Throw | Range 30 ft; 1d8 + CON earth damage. |
| **Obsidadagger** | 7 (+1/t) | Action | Umbral Dagger + Mud Skin | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Obsidanightfall** | 10 (+4/t) | Action | Nightfall + Stoneform | 10-ft zone of darkness within 30 ft; enemies inside are Blinded; allies see through it. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidastep** | 12 (+4/t) | Bonus Action | Shadow Step + Stone Wall | 20-ft stone wall (full cover; blocks movement & line of sight) while active. |
| **Obsidadrain** | 17 | Action | Umbral Drain + Earthquake | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Obsidanightfall ×2** | 18 (+10/t) | Action | Nightfall ×2 + Stoneform ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Obsidastorm** | 36 | Action | Shadow Storm + Fissure | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Obsidagrip** | 24 (+6/t) | Action | Void Grip + Mountain's Aegis | You and allies within 15 ft gain +CON to DS and damage reduction 1d4 while active. |
| **Obsidanightfall ×5** | 36 (+18/t) | Action | Nightfall ×5 + Stoneform ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

---

### Noctikinesis
**Umbrakinesis + Cryokinesis** · Role: Controller + Controller · Attributes: AGI / CON

*Frozen darkness, silence, fear, and supernatural cold.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctishadows** | 6 (+1/t) | Action | Shroud of Shadows + Frost Bolt | Range 30 ft; 1d8 + CON cold damage. |
| **Noctidagger** | 7 (+1/t) | Action | Umbral Dagger + Ice Armor | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Noctinightfall** | 10 (+2/t) | Action | Nightfall + Absolute Zero | 10-ft zone of darkness within 30 ft; enemies inside are Blinded; allies see through it. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctistep** | 15 | Action | Shadow Step + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Noctidrain** | 13 | Action | Umbral Drain + Rime | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Noctinightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Absolute Zero ×2 | 15-ft darkness: enemies Blinded and take 2d6 shadow/turn; spreads 5 ft each turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Noctistorm** | 36 | Action | Shadow Storm + Blizzard | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Noctigrip** | 26 | Action | Void Grip + Flash Freeze | Range 30 ft; the target is Rooted and Silenced. |
| **Noctinightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Absolute Zero ×5 | 20-ft darkness: Blinded + 3d6/turn + Feared; now allies inside are also Blinded. |

---

### Morbikinesis
**Umbrakinesis + Vitakinesis** · Role: Controller + Healer · Attributes: AGI / CON

*Life drain, sacrifice, decay, shadowed vitality, and survival.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbashadows** | 6 (+1/t) | Action | Shroud of Shadows + Life Touch | Heal an ally 1d8 + CON HP. |
| **Morbadagger** | 7 | Action | Umbral Dagger + Purge Toxin | Melee; 1d10 + AGI shadow; +1d6 if the target can't see you. |
| **Morbanightfall** | 10 (+2/t) | Action | Nightfall + Renewal | Heal an ally 1d10 + CON and grant regeneration 1d4/turn for 2 turns. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbastep** | 12 | Action | Shadow Step + Greater Heal | Heal an ally 2d8 + CON HP. |
| **Morbadrain** | 15 | Action | Umbral Drain + Second Life | Range 30 ft; 2d8 + AGI shadow; you gain temp HP equal to half the damage. |
| **Morbanightfall ×2** | 18 (+5/t) | Action | Nightfall ×2 + Renewal ×2 | Heal 2d10 + CON + regeneration 1d6/turn for 3 turns; also revives if the ally is downed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morbastorm** | 30 | Action | Shadow Storm + Mass Heal | 20-ft radius; auto-hits for 3d8 + AGI shadow; targets Blinded. |
| **Morbagrip** | 26 (+7/t) | Action | Void Grip + Wellspring of Life | 20-ft zone; allies heal 2d6/turn and can't drop below 1 HP while inside. |
| **Morbanightfall ×5** | 36 (+9/t) | Action | Nightfall ×5 + Renewal ×5 | Heal all allies within 20 ft 3d8 + CON + regeneration; revive any downed among them. |

---

### Mudkinesis
**Hydrokinesis + Terrakinesis** · Role: Healer + Tank · Attributes: AGI / CON

*Mud, clay, sediment, adaptable defense, and battlefield restraint.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudajet** | 7 | Action | Water Jet + Rock Throw | Range 30 ft; 1d8 + AGI water; push the target 5 ft. |
| **Mudaflow** | 6 (+1/t) | Action | Soothing Flow + Mud Skin | Heal an ally 1d8 + AGI HP. |
| **Mudatide** | 10 (+2/t) | Action | Tide + Stoneform | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudasurge** | 14 (+4/t) | Action | Healing Surge + Stone Wall | Heal an ally 2d8 + AGI HP. |
| **Mudariptide** | 17 | Action | Riptide + Earthquake | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Mudatide ×2** | 18 (+5/t) | Action | Tide ×2 + Stoneform ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Mudatsunami** | 36 | Action | Tsunami + Fissure | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Mudarenewal** | 23 (+6/t) | Action | Mass Renewal + Mountain's Aegis | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Mudatide ×5** | 36 (+9/t) | Action | Tide ×5 + Stoneform ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Rimekinesis
**Hydrokinesis + Cryokinesis** · Role: Healer + Controller · Attributes: AGI / CON

*Phase change, freezing, thawing, preservation, and transformation.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimejet** | 7 | Action | Water Jet + Frost Bolt | Range 30 ft; 1d8 + AGI water; push the target 5 ft. |
| **Rimeflow** | 6 (+1/t) | Action | Soothing Flow + Ice Armor | Heal an ally 1d8 + AGI HP. |
| **Rimetide** | 10 | Action | Tide + Absolute Zero | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimesurge** | 17 | Action | Healing Surge + Frost Nova | 10-ft radius; auto-hits for 2d8 + CON cold. |
| **Rimeriptide** | 13 | Action | Riptide + Rime | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Rimetide ×2** | 18 | Action | Tide ×2 + Absolute Zero ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Rimetsunami** | 36 | Action | Tsunami + Blizzard | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Rimerenewal** | 25 | Action | Mass Renewal + Flash Freeze | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Rimetide ×5** | 36 | Action | Tide ×5 + Absolute Zero ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Humorkinesis
**Hydrokinesis + Vitakinesis** · Role: Healer + Healer · Attributes: AGI / CON

*Bodily fluids, circulation, hydration, detoxification, and balance.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humorajet** | 7 | Action | Water Jet + Life Touch | Range 30 ft; 1d8 + AGI water; push the target 5 ft. |
| **Humoraflow** | 6 | Action | Soothing Flow + Purge Toxin | Heal an ally 1d8 + AGI HP. |
| **Humoratide** | 10 | Action | Tide + Renewal | 15-ft line wave: heal allies it crosses 1d8 + AGI; push enemies 10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humorasurge** | 14 | Action | Healing Surge + Greater Heal | Heal an ally 2d8 + AGI HP. |
| **Humorariptide** | 15 | Action | Riptide + Second Life | Range 30 ft; 1d12 + AGI water; pull 10 ft and Slowed. |
| **Humoratide ×2** | 18 | Action | Tide ×2 + Renewal ×2 | 20-ft wave: heal allies 2d8 + AGI; enemies pushed 15 ft and Slowed. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Humoratsunami** | 30 | Action | Tsunami + Mass Heal | 30-ft; enemies take 3d8 + AGI water (push 20 ft, prone); allies caught heal 2d6. |
| **Humorarenewal** | 25 (+7/t) | Action | Mass Renewal + Wellspring of Life | Heal all allies within 20 ft 2d8 + AGI HP. |
| **Humoratide ×5** | 36 | Action | Tide ×5 + Renewal ×5 | 30-ft wave: heal allies 3d8 + AGI; enemies 2d6 + pushed + Slowed. |

---

### Spatiokinesis
**Gravikinesis + Chronokinesis** · Role: Tank + Controller · Attributes: INT / INT

*Spacetime, distance, duration, position, and reality bending.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spatibolt** | 6 | Action | Gravity Bolt + Time Bolt | Range 30 ft; 1d8 + INT force damage. |
| **Spatipull** | 8 | Action | Pull + Haste | Pull a creature 15 ft toward you. |
| **Spatiwell** | 10 (+2/t) | Action | Gravity Well + Slow Time | 10-ft well: enemies entering are pulled to you and Slowed; +INT to Defense Score; your movement −10 ft. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spaticrush** | 15 | Action | Crush + Accelerate | Range 30 ft; 2d8 + INT force damage. |
| **Spatifield** | 13 (+4/t) | Action | Heavy Field + Temporal Lock | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Spatiwell ×2** | 18 (+5/t) | Action | Gravity Well ×2 + Slow Time ×2 | 15-ft well: pull + Slowed + 2d6/turn; +INT to DS; you are Rooted while active. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Spatiburst** | 34 | Action | Graviton Burst + Temporal Rift | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Spatigravity** | 26 (+6/t) | Action | Reverse Gravity + Haste Field | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Spatiwell ×5** | 36 (+9/t) | Action | Gravity Well ×5 + Slow Time ×5 | 20-ft well: pull + Slowed + 3d6/turn; +INT to DS; you are Rooted and take 1d6/turn. |

---

### Morphokinesis
**Gravikinesis + Biokinesis** · Role: Tank + Healer · Attributes: INT / INT

*Adaptive transformation, biological resilience, and evolution under pressure.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphabolt** | 6 | Action | Gravity Bolt + Mend Tissue | Range 30 ft; 1d8 + INT force damage. |
| **Morphapull** | 8 | Action | Pull + Toxin | Range 30 ft; 1d6 + INT poison; the target is Weakened. |
| **Morphawell** | 10 (+2/t) | Action | Gravity Well + Regenesis | Heal an ally 1d10 + INT and end one condition. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphacrush** | 14 | Action | Crush + Necrosis | Range 30 ft; 2d8 + INT force damage. |
| **Morphafield** | 13 (+4/t) | Bonus Action | Heavy Field + Mutate | 15-ft zone of heavy gravity — enemies Slowed; ranged attacks through it fall short while active. |
| **Morphawell ×2** | 18 (+5/t) | Action | Gravity Well ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Morphaburst** | 34 | Action | Graviton Burst + Plague | 20-ft radius; auto-hits for 3d8 + INT force; pull to center + prone. |
| **Morphagravity** | 28 | Action | Reverse Gravity + Graft | 20-ft area; enemies fall upward then crash down — prone + 2d8 + INT. |
| **Morphawell ×5** | 36 (+9/t) | Action | Gravity Well ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

---

### Genokinesis
**Chronokinesis + Biokinesis** · Role: Controller + Healer · Attributes: INT / INT

*Biological time, cellular restoration, growth, and accelerated evolution.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genabolt** | 6 | Action | Time Bolt + Mend Tissue | Range 30 ft; 1d8 + INT temporal damage. |
| **Genahaste** | 8 | Action | Haste + Toxin | Range 30 ft; 1d6 + INT poison; the target is Weakened. |
| **Genatime** | 10 | Action | Slow Time + Regenesis | Heal an ally 1d10 + INT and end one condition. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genaccelerate** | 15 | Action | Accelerate + Necrosis | Range 30 ft; 2d8 + INT necrotic; the target can't heal for 1 turn. |
| **Genalock** | 12 | Action | Temporal Lock + Mutate | Range 30 ft; target Rooted and loses reactions. |
| **Genatime ×2** | 18 | Action | Slow Time ×2 + Regenesis ×2 | Heal 2d10 + INT, end 2 conditions, and revive a downed ally to half HP. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Genarift** | 32 | Action | Temporal Rift + Plague | 20-ft radius; auto-hits for 3d8 + INT temporal; Slowed. |
| **Genafield** | 26 (+6/t) | Action | Haste Field + Graft | Regrow a lost limb / cure any disease or condition permanently, and heal 3d8 + INT. |
| **Genatime ×5** | 36 | Action | Slow Time ×5 + Regenesis ×5 | Heal all allies within 20 ft 3d8 + INT + regeneration; revive any downed among them. |

---

### Venokinesis
**Demokinesis + Naturakinesis** · Role: Tank + Controller · Attributes: WIS / WIS

*Poison, corrupted growth, toxins, and aggressive natural evolution.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venaclaw** | 7 | Action | Dark Claw + Thorn Bolt | Melee; 1d10 + WIS necrotic damage. |
| **Venadread** | 8 | Action | Dread + Thistle Bush | Range 30 ft; the target is Feared. |
| **Venaform** | 10 (+4/t) | Action | Demon Form + Bloom | +2 STR & WIS, +WIS to Defense Score, claws (1d8) while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venaterrify** | 14 | Action | Terrify + Poison Spores | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Venaleech** | 14 | Action | Life Leech + Grasping Roots | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Venaform ×2** | 18 (+10/t) | Action | Demon Form ×2 + Bloom ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Venahellstorm** | 36 | Action | Hellstorm + Thornstorm | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Venadevour** | 30 (+7/t) | Action | Devour + Wall of Thorns | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Venaform ×5** | 36 (+18/t) | Action | Demon Form ×5 + Bloom ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

---

### Divinikinesis
**Demokinesis + Holykinesis** · Role: Tank + Healer · Attributes: WIS / WIS

*Divine balance, judgment, protection, and spiritual equilibrium.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Divinaclaw** | 8 | Action | Dark Claw + Smite | Melee; 1d10 + WIS necrotic damage. |
| **Divinadread** | 7 | Action | Dread + Bless | Range 30 ft; the target is Feared. |
| **Divinaform** | 10 (+4/t) | Bonus Action | Demon Form + Sanctuary | +2 STR & WIS, +WIS to Defense Score, claws (1d8) while active. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Divinaterrify** | 13 | Action | Terrify + Radiant Beam | Range 50 ft; 2d8 + WIS radiant damage. |
| **Divinaleech** | 14 (+4/t) | Action | Life Leech + Greater Blessing | Range 30 ft; 2d8 + WIS necrotic; heal yourself half. |
| **Divinaform ×2** | 18 (+10/t) | Bonus Action | Demon Form ×2 + Sanctuary ×2 | +4 STR & WIS, +WIS to DS, claws (1d10), fear aura. Drains 1d6 HP/turn. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Divinahellstorm** | 34 | Action | Hellstorm + Judgment | 20-ft radius; auto-hits for 3d8 + WIS necrotic; Feared. |
| **Divinadevour** | 32 | Action | Devour + Resurrection | Melee; 4d8 + WIS; heal equal to the damage dealt. |
| **Divinaform ×5** | 36 (+18/t) | Bonus Action | Demon Form ×5 + Sanctuary ×5 | +8 STR & WIS, claws 2d6, fear aura, DR. Drains HP AND deals 2 hits to your Third Eye chakra (corruption). |

---

### Sanctukinesis
**Naturakinesis + Holykinesis** · Role: Controller + Healer · Attributes: WIS / WIS

*Sacred life, sanctified nature, protection, and restorative growth.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctubolt** | 7 | Action | Thorn Bolt + Smite | Range 30 ft; 1d8 + WIS piercing damage. |
| **Sanctubush** | 7 | Action | Thistle Bush + Bless | 5-ft thornbush: difficult terrain; creatures moving through take 1d6. |
| **Sanctubloom** | 10 (+4/t) | Action | Bloom + Sanctuary | 10-ft garden within 30 ft: enemies Rooted + 1d6/turn thorns; allies heal 1d4/turn. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctuspores** | 13 | Action | Poison Spores + Radiant Beam | 15-ft radius; auto-hits for 2d8 + WIS poison; enemies Weakened. |
| **Sancturoots** | 14 (+4/t) | Action | Grasping Roots + Greater Blessing | Allies within 15 ft gain +1d4 to attacks and saves while active. |
| **Sanctubloom ×2** | 18 (+10/t) | Action | Bloom ×2 + Sanctuary ×2 | 15-ft garden: enemies Rooted + 2d6/turn; allies heal 2d6/turn; spreads 5 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Sanctuthornstorm** | 34 | Action | Thornstorm + Judgment | 20-ft radius; auto-hits for 3d8 + WIS piercing; Rooted. |
| **Sanctuthorns** | 30 (+7/t) | Action | Wall of Thorns + Resurrection | 30-ft thorn wall; crossing deals 3d6 and Roots while active. |
| **Sanctubloom ×5** | 36 (+18/t) | Action | Bloom ×5 + Sanctuary ×5 | 20-ft garden: enemies Rooted + 3d6/turn; allies heal 3d6/turn; spreads 10 ft. |

---

### Radiokinesis
**Sonikinesis + Lumokinesis** · Role: Tank + Controller · Attributes: CHA / CHA

*Waves, transmission, resonance, perception, and electromagnetic energy.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radipulse** | 7 | Action | Resonant Pulse + Light Bolt | Range 30 ft; 1d8 + CHA radiant damage. |
| **Radicry** | 8 | Action | War Cry + Flash | Allies within 15 ft gain +1d4 to their attacks this turn. |
| **Radicrescendo** | 10 (+4/t) | Action | Crescendo + Radiance | 10-ft resonance: +1d4 more thunder each turn to adjacent enemies (starts 1d4); +CHA to Defense Score. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radithunderclap** | 14 | Action | Thunderclap + Laser | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Radianthem** | 13 (+4/t) | Action | Anthem + Hologram | Allies within 15 ft gain +CHA to DS and +1d4 attacks while active. |
| **Radicrescendo ×2** | 18 (+10/t) | Action | Crescendo ×2 + Radiance ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Radishatter** | 34 | Action | Shatter + Prism Beam | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Radiroar** | 26 | Action | Deafening Roar + Illusory Army | 15-ft radius; enemies Stunned 1 turn. |
| **Radicrescendo ×5** | 36 (+18/t) | Action | Crescendo ×5 + Radiance ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

---

### Echokinesis
**Sonikinesis + Spirikinesis** · Role: Tank + Healer · Attributes: CHA / CHA

*Spiritual resonance, echoes of the soul, communication, and restoration.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echopulse** | 7 | Action | Resonant Pulse + Spirit Bolt | Range 30 ft; 1d8 + CHA spectral damage. |
| **Echocry** | 7 (+1/t) | Bonus Action | War Cry + Phantom Presence | Attacks against you have disadvantage while active. |
| **Echocrescendo** | 10 (+2/t) | Action | Crescendo + Soul Tether | 10-ft resonance: +1d4 more thunder each turn to adjacent enemies (starts 1d4); +CHA to Defense Score. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echothunderclap** | 14 | Action | Thunderclap + Vengeful Spirit | 15-ft radius; auto-hits for 2d8 + CHA thunder; push 10 ft + Shocked. |
| **Echoanthem** | 14 (+4/t) | Action | Anthem + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Echocrescendo ×2** | 18 (+5/t) | Action | Crescendo ×2 + Soul Tether ×2 | Builds +1d6/turn thunder in 10 ft; +CHA to DS; at peak also pushes. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Echoshatter** | 34 | Action | Shatter + Spirit Storm | 4d8 + CHA thunder to a target; ignores DR and armor. |
| **Echoroar** | 28 | Action | Deafening Roar + Possession | 15-ft radius; enemies Stunned 1 turn. |
| **Echocrescendo ×5** | 36 (+9/t) | Action | Crescendo ×5 + Soul Tether ×5 | Builds +1d8/turn thunder in 20 ft; +CHA to DS; now allies who stay are Shocked too. |

---

### Astrakinesis
**Lumokinesis + Spirikinesis** · Role: Controller + Healer · Attributes: CHA / CHA

*Astral energy, starlight, souls, spiritual projection, and illumination.*

**Adept**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astrabolt** | 6 | Action | Light Bolt + Spirit Bolt | Range 30 ft; 1d8 + CHA radiant damage. |
| **Astraflash** | 7 (+1/t) | Action | Flash + Phantom Presence | Attacks against you have disadvantage while active. |
| **Astraradiance** | 10 (+2/t) | Action | Radiance + Soul Tether | 10-ft zone of light within 30 ft: enemies Blinded + 1d6/turn radiant. |

**Expert**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astralaser** | 12 | Action | Laser + Vengeful Spirit | Range 60 ft line; 2d8 + CHA radiant; ignores partial cover. |
| **Astrahologram** | 13 | Action | Hologram + Mend Soul | Heal an ally 2d8 + CHA and end one condition. |
| **Astraradiance ×2** | 18 (+5/t) | Action | Radiance ×2 + Soul Tether ×2 | 15-ft light: Blinded + 2d6/turn; spreads 5 ft. |

**Master**

| Technique | KP | Action | Pair (parent techniques) | Effect |
|---|---|---|---|---|
| **Astrabeam** | 36 | Action | Prism Beam + Spirit Storm | 20-ft radius; auto-hits for 3d8 + CHA radiant; Blinded. |
| **Astraarmy** | 30 | Action | Illusory Army + Possession | 15-ft radius; illusory duplicates confuse enemies — Feared (disadvantage) 1 turn. |
| **Astraradiance ×5** | 36 (+9/t) | Action | Radiance ×5 + Soul Tether ×5 | 20-ft light: Blinded + 3d6/turn; now allies inside are also Blinded. |

---

> **App status:** ✅ All 39 fusions × 9 techniques = **351** are loaded (`PC.FUSION_TECHNIQUES`), hidden
> until unlocked and auto-granted by parent-technique pairs. `PC.grantedFusionTechniques(known)` /
> `PC.unlockedFusions(known)` drive the reveal.
