# Psion Chronicles — Kinetic Technique Library

> The spell/ability list for the game and the app. Built with Luke.
> **Robukinesis is fully built as the template** (all 4 tiers). The other 17 Kinetics follow this
> framework. **[?]** marks a value worth a second look; numbers are tunable in playtest.

## Technique data shape (schema every technique follows)
| Field | Meaning |
|---|---|
| **name** | Technique name |
| **kinetic** | Which of the 18 schools |
| **attr** | Governing attribute of that kinetic (STR for Robukinesis, etc.) |
| **chakra** | Chakra of that attribute (Robukinesis → Core) — links to the Chakra Chart |
| **tier** | Beginner / Adept / Expert / Master (gated by Soul Level) |
| **kp** | Ki Points to use. May include **upkeep** (e.g. "2 KP + 1/turn") for sustained techniques |
| **action** | Action / Bonus Action / Reaction / Full Turn |
| **effect** | Mechanical effect — damage dice + mod, range/area, buffs, healing, conditions |
| **augment** | *(optional)* riders onto another action. `melee-damage` = adds dice to a successful melee hit (Ki Strike) |
| **aoe** | *(optional)* area attack — auto-hits everything in the area, no to-hit roll |

---

## Design Framework

### Roles shape the kit (each Kinetic is Tank / Controller / Healer)
- **Tank** — durability, damage mitigation, defense/DS buffs, temp HP, self-sustain, martial enhancement, close-range control, survival.
- **Controller** — damage + battlefield control: AoE, zoning, and **status conditions** (see below).
- **Healer** — healing, cleanses, protective wards, buffs, and HP/KP/chakra restoration.
- **Domain colors the flavor:** the same "Controller: damage + slow" is *Cryokinesis → Frozen* vs *Umbrakinesis → Blinded* — same mechanical role, different element & rider condition.

### Tiers & Soul-Level gates (CONFIRMED Luke)
| Tier | Soul Level | Damage dice feel | Typical KP* |
|---|---|---|---|
| **Beginner** | 1+ | d4–d8 | ~2–8 |
| **Adept** | 8+ | d8–2d6 | ~5–14 |
| **Expert** | 15+ | 2d6–4d6 | ~9–24 |
| **Master** | 22+ | 4d6+ | ~15–30 |

\* Tiers gate **power** (dice & effects). **KP is derived from power via the Costing Rubric below** — so
a loaded AoE can cost more than a plain higher-tier single-target hit. "Typical KP" is just the range that
falls out; it is not a cap.

- **3 techniques per tier** per Kinetic (**12 per Kinetic**) — one of the three is the tier's **signature** (the scaling line), the other two a role-spread pick. *(Was 5/tier ≈ 20/Kinetic; trimmed to 3 so a character's Technique-Point budget can master ~2 Kinetics and dip a 3rd — see the DESIGN_LOG.)*
- A character may learn/buy a technique only when their **Soul Level ≥ the tier's gate** (spend 1 Technique Point each).

### Signature techniques (CONFIRMED Luke)
**Every Kinetic has ONE signature technique** — its iconic, defining power that *embodies the philosophy*
of that Kinetic. It's the mechanical thesis of the school. A signature is often a **scaling line** (below)
but doesn't have to be. Examples:
- **Robukinesis → Ki Flame** — burn your own life force / chakra for raw power (the martial self-forge).
- **Pyrokinesis → Conflagration** — fire that spreads and consumes everything, growing uncontrollable.
- *(each Kinetic below names its signature)*

### Scaling technique lines
Some signature techniques appear as an **escalating line across the tiers** — the same power at ×2, ×5,
×10 intensity, where **each step grants a bigger effect but stacks on a steeper self-cost**. The
archetype is **Ki Flame** (Robukinesis): base burns KP → ×2 also drains HP → ×5 also damages your Core
chakra → ×10 completely blacks out your Core chakra. High risk, high reward — the ultimate versions can
cripple the caster. Each ×N version is its own tier-gated technique (learned separately with a TP).

### KP Costing Rubric (CONFIRMED Luke) — how every technique is priced
Tiers gate a technique's **power** (dice & effects); KP cost is then **derived** from that power:

1. **Damage/heal base** = average of the dice, rounded:
   | 1d4 | 1d6 | 1d8 | 1d10 | 1d12 | 2d6 | 3d6 | 4d6 | 5d6 | 6d6 |
   |---|---|---|---|---|---|---|---|---|---|
   | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 14 | 17 | 21 |
   *(Attribute modifier is free — it's not counted, same for all techniques.)*
2. **Effect adders:** each **condition** applied +2 · **forced movement** (push/pull) +1 · **debuff**
   (disadvantage/Weakened) +2 · **buff** +1 per +1 to a stat × number of stats · **range >30 ft** +1 ·
   **persistent/unremovable/spreading condition** +4–6.
3. **Action floor:** any technique costs a **minimum of ~2 KP** (the cost of acting at all).
4. **× 1.5 for AoE / auto-hit** areas (round up) — you hit everything with no to-hit risk.
5. **Discounts:** deliberate **self-cost** (spends your HP/chakra as fuel) **−25%**; minor **recoil/backlash −10%**.
6. **Sustained:** activation = the full cost; **upkeep/turn = ⌈activation ÷ 2⌉**. (This is why Ki Flame
   base = +2×3 stats = 6 KP, +3/turn.)
7. **Clamp** to something sane for the tier.

> Damage/heal come out formula-clean; **buffs, auras, and complex control take rubric + judgment** — those
> numbers are the most tunable. All costs below are rubric-derived and flagged tunable.

### Ranged attack rule (CONFIRMED Luke)
Ranged single-target technique attacks roll **d20 + attribute mod + proficiency (only if proficient with
that Kinetic)** vs. the target's Defense Score, then damage on a hit. **AoE techniques auto-hit** the area.

### Kinetic→chakra map (CONFIRMED)
STR→**Core**, AGI→**Sacral**, CON→**Root**, CHA→**Throat**, WIS→**Third Eye**, INT→**Crown**.

---

## Status Conditions (shared vocabulary — DRAFT, tune in playtest)
Default duration is **until the end of the target's next turn** unless a technique says otherwise.
A **save to resist/end** is a relevant skill check vs. the caster's technique DC (DC = 8 + attr mod + prof)
— *[condition save rules TBD; placeholder]*.

| Condition | Effect |
|---|---|
| **Burning** | Takes fire damage (a die) at the start of each of its turns until it ends. |
| **Frozen** | Cannot move or take actions (hard control); breaks if it takes damage *[?]*. |
| **Slowed** | Movement halved; cannot take reactions. |
| **Shocked** | Disadvantage on attacks; cannot take reactions. |
| **Blinded** | Its attacks have disadvantage; attacks against it have advantage. |
| **Rooted** | Cannot move, but may still act. |
| **Weakened** | Deals half damage on its attacks. |
| **Marked** | Attacks against it gain advantage (or +damage). |
| **Silenced** | Cannot use Kinetic Techniques. |
| **Stunned** | Loses its next action. |
| **Feared** | Cannot willingly move toward the source; disadvantage on attacks while it can see the source. |

---

## Robukinesis — STR · Tank · Core chakra  ✅ FULL (template)
*Domain: raw Ki, life force, martial power.* Robukinesis is the **self-forged warrior** — it hardens the
body, sharpens strikes, and shares raw kinetic energy. Tank identity: durability, self-buffs, martial
enhancement, sustain, and protecting the line.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Ki Strike** | 2 | Action | *Melee augment.* On a successful melee attack, add **1d4 + STR** force damage to that hit. |
| **Ki Shield** | 2 (+1/turn) | Bonus | *Sustained.* Add your **STR mod to your Defense Score** while active. |
| **Ki Flame** | 6 (+3/turn) | Bonus | *Sustained · overdrive line (base).* **+2 STR, AGI, CON** while active (may exceed 30). Cost: KP only. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Kinetic Grip** | 5 | Action | Ranged, 30 ft. Target is **Rooted** until the end of its next turn. |
| **Iron Body** | 6 (+3/turn) | Bonus | *Sustained.* Reduce all incoming damage by your **STR mod** (min 1). |
| **Ki Flame ×2** | 9 (+5/turn) | Bonus | *Sustained · overdrive ×2.* **+4 STR, AGI, CON** while active. Added cost: also **drains 1d4 HP each turn** (−25% KP for self-cost). |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Titan's Blow** | 11 | Action | Melee attack. **3d6 + STR** force damage and push the target 10 ft. |
| **Bastion Aura** | 12 (+6/turn) | Bonus | *Sustained.* You and allies within 15 ft gain **+STR mod to Defense Score** (party buff — tunable). |
| **Ki Flame ×5** | 18 (+9/turn) | Bonus | *Sustained · overdrive ×5.* **+8 STR, AGI, CON** while active. Added cost: drains **1d6 HP/turn** **and on activation your Core chakra takes 2 hits** (−25% KP). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Titan Strike** | 20 | Action | Melee attack. **5d6 + STR** force damage, push 20 ft, and target is **Weakened**. |
| **Unbreakable** | 16 | Reaction | When you would drop to 0 HP, instead drop to 1 HP and gain **4d6 + STR temp HP**. Once per long rest. |
| **Ki Flame ×10** | 27 | Bonus | *Overdrive ×10 — the burnout.* **+15 STR, AGI, CON** for the fight. Added cost: drains HP each turn **and immediately & completely blacks out your Core chakra** (locked out — no STR/Core actions until you heal it via rest). |

> **Ki Flame overdrive line** (base → ×2 → ×5 → ×10): each version replaces the previous as you climb
> tiers, granting a bigger all-body buff but stacking a harsher self-cost — KP → +HP drain → +Core chakra
> damage → +full Core blackout. The ×10 is a true last-resort: godlike stats for the fight, but you burn
> out your own Core. *(Buff values +2/+4/+8/+15 and costs are tunable in playtest.)*

---

## Pyrokinesis — STR · Controller · Core chakra  ✅ FULL
*Domain: fire, heat, combustion.* Pyrokinesis is the **battlefield burner** — it deals steady damage,
spreads **Burning**, denies ground, and blinds with smoke. Controller identity: AoE, zoning, and DoT.
**Signature: Conflagration** — a spreading fire that grows and consumes everything, including allies and
the caster at its highest intensity (fire doesn't discriminate).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Fire Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + STR** fire damage. |
| **Scorch** | 5 | Action | Ranged attack, 40 ft. **1d6 + STR** fire; on a hit the target's next attack has disadvantage. |
| **Conflagration** | 8 (+4/turn) | Action | *Signature (base).* Create a 10-ft fire zone within 30 ft; each creature in it takes **1d6** fire and gains **Burning** at the start of its turn. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Blazing Speed** | 6 (+3/turn) | Bonus | *Sustained.* Movement +15 ft; you leave a 5-ft fire trail (creatures entering take **1d6** fire). |
| **Fireball** | 14 | Action | *AoE, auto-hit.* 15-ft radius within 60 ft; **2d6 + STR** fire; targets gain **Burning**. |
| **Conflagration ×2** | 14 (+7/turn) | Action | *Signature.* 15-ft zone; **2d6** fire + **Burning** each turn; the zone **spreads 5 ft each turn** it persists. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Firestorm Wall** | 14 (+7/turn) | Bonus | *Sustained.* 30-ft line of flame; crossing it deals **2d6** fire + **Burning**; blocks line of sight. |
| **Meteor** | 24 | Action | *AoE, auto-hit.* 20-ft radius within 90 ft; **4d6 + STR** fire; leaves burning ground (**1d6**/turn) for 3 turns. |
| **Conflagration ×5** | 18 (+9/turn) | Action | *Signature.* 20-ft zone; **3d6** fire + Burning each turn; spreads 10 ft/turn; **now also ignites allies** caught inside (uncontrollable). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Phoenix Form** | 20 (+10/turn) | Bonus | *Sustained.* Emit a 10-ft fire aura (**2d6**/turn), immune to fire; the first time you'd drop to 0 HP while active, reignite to half HP. |
| **Supernova** | 29 | Action | *AoE, auto-hit.* 40-ft radius; **6d6 + STR** fire to all; the caster takes **2d6** recoil fire (−10% KP). |
| **Conflagration ×10** | 26 (+8/turn) | Action | *Signature capstone.* 40-ft zone; **5d6** fire + Burning each turn; spreads across the battlefield and consumes **everything — allies and the caster included**. Fire, unleashed and uncontrollable. |

> **Conflagration line** (base → ×2 → ×5 → ×10): the fire grows in area and damage each tier and spreads
> on its own — the escalating "cost" is **loss of control** (×5 burns allies, ×10 burns everyone including
> you). It embodies Pyrokinesis: fire consumes without discrimination. *(Numbers tunable in playtest.)*

---

## Electrokinesis — STR · Healer · Core chakra  ✅ FULL
*Domain: bioelectricity, lightning, restoring life through electrical energy.* Electrokinesis is the
**life-current medic** — it heals and revives by jump-starting the body, wards allies, restores KP, and
still throws lightning and **Shocks** enemies when needed. Healer identity: healing, cleanses, wards,
resource restoration.
**Signature: Defibrillate** — restore life with a surge of current. It escalates into **self-sacrifice**:
the higher versions spend *your* HP and Core chakra to pull allies back from death — the ×10 fully
resurrects an ally but blacks out your own Core. (The compassionate mirror of Robukinesis's Ki Flame.)

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Spark** | 3 | Action | Ranged attack, 30 ft. **1d6 + STR** lightning damage. |
| **Mend Current** | 3 | Action | Touch/near. Heal an ally **1d6 + STR** HP. |
| **Defibrillate** | 5 | Action | *Signature (base).* Touch. Heal an ally **1d8 + STR** HP; **if they are at 0 HP, they revive** at that much HP (jump-start the heart). |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Chain Lightning** | 8 | Action | Ranged attack, 40 ft. **1d8 + STR** lightning to the target, then arcs **1d6** to up to 2 more within 15 ft. |
| **Cleanse Current** | 4 | Action | End one condition on an ally and heal **1d4 + STR** HP. |
| **Defibrillate ×2** | 7 | Action | *Signature.* Heal **2d8 + STR**; revives a downed ally to half HP. Added cost: **drains 1d6 of your HP** (you channel your life as current; −25% KP). |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Lightning Storm** | 18 | Action | *AoE, auto-hit.* 20-ft radius within 60 ft; **3d6 + STR** lightning; targets are **Shocked**. |
| **Mass Mend** | 11 | Action | *AoE.* Heal all allies within 20 ft **2d6 + STR** HP. |
| **Defibrillate ×5** | 14 | Action | *Signature.* Revive up to **2** downed allies to half HP (or heal one **3d8 + STR**). Added cost: drains your HP **and your Core chakra takes 2 hits** (−25% KP). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Thundergod's Wrath** | 32 | Action | *AoE, auto-hit.* 40-ft radius; **6d6 + STR** lightning to all; targets are **Shocked**. |
| **Rebirth Aura** | 24 (+10/turn) | Bonus | *Sustained.* While active, any ally within 20 ft that drops to 0 HP revives at 1 HP at the start of their next turn. |
| **Defibrillate ×10** | 26 | Action | *Signature capstone.* **Fully resurrect a dead or downed ally to full HP and KP.** Added cost: **completely blacks out your own Core chakra** (locked — no STR/Core actions until you rest). You pour your life-current into them. |

> **Defibrillate line** (base → ×2 → ×5 → ×10): the healer's self-sacrifice. Each version restores more
> life to others at greater cost to the caster — HP → HP + Core damage → Core blackout. The ×10 trades
> your own Core, burnt out, for a life fully returned. *(Numbers tunable in playtest.)*

---

## Aerokinesis — AGI · Tank · Sacral chakra  ✅ FULL
*Domain: wind and air.* Aerokinesis is the **evasive protector** — it deflects attacks, controls
positioning with knockback and pulls, and grants mobility. Tank identity: survive by never being pinned.
**Signature: Tempest** — a whirlwind that grows from a personal shield into an uncontrollable cyclone.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Gust** | 4 | Action | Ranged attack, 30 ft. **1d6 + AGI** wind; push the target 5 ft. |
| **Zephyr Step** | 2 | Bonus | +15 ft movement this turn; you don't provoke opportunity attacks. |
| **Tempest** | 5 (+2/turn) | Bonus | *Signature (base).* A 5-ft whirlwind: enemies starting adjacent take **1d6** wind and are pushed 5 ft; you gain **+AGI to Defense Score**. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Wind Wall** | 7 (+4/turn) | Bonus | *Sustained.* A 20-ft wall of wind blocks ranged attacks and deflects projectiles. |
| **Air Dash** | 5 | Bonus | Dash 30 ft in any direction; your next attack this turn has advantage. |
| **Tempest ×2** | 9 (+5/turn) | Bonus | *Signature.* 10-ft whirlwind: **2d6** wind + push 10 ft to enemies; +AGI to DS; **allies inside are buffeted too** (pushed 5 ft). |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Hurricane** | 18 | Action | *AoE, auto-hit.* 20-ft radius; **3d6 + AGI** wind; all pushed 15 ft and knocked prone. |
| **Tornado** | 16 (+8/turn) | Bonus | *Sustained.* A mobile 10-ft tornado you control; creatures inside take **2d6** wind and are **Rooted**. |
| **Tempest ×5** | 18 (+9/turn) | Bonus | *Signature.* 20-ft whirlwind: **3d6** wind + push; +AGI to DS; now **sweeps allies too** (1d6 + push). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Maelstrom** | 32 | Action | *AoE, auto-hit.* 40-ft radius; **6d6 + AGI** wind; all **Rooted** and pushed. |
| **Sky Sovereign** | 22 (+10/turn) | Bonus | *Sustained.* You fly; +AGI to DS; attacks against you have disadvantage. |
| **Tempest ×10** | 26 (+8/turn) | Bonus | *Signature capstone.* Become a living cyclone: 40-ft whirlwind, **5d6** wind + push **everything** (allies & enemies), +AGI to DS — but you can make **no single-target actions** while the storm rages (loss of control). |

---

## Umbrakinesis — AGI · Controller · Sacral chakra  ✅ FULL
*Domain: shadows and darkness.* Umbrakinesis is the **shadow controller** — it Blinds, instills fear,
strikes from concealment, and denies enemies sight while allies see through the dark. Controller identity:
information denial + fear + shadow damage.
**Signature: Nightfall** — a spreading darkness that grows until it swallows the whole field.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Shroud of Shadows** | 3 (+1/turn) | Bonus | *Sustained.* Wrap yourself in shadow — attacks against you have disadvantage. |
| **Umbral Dagger** | 4 | Action | Melee attack. **1d8 + AGI** shadow; +**1d6** if the target can't see you. |
| **Nightfall** | 5 (+2/turn) | Action | *Signature (base).* 10-ft zone of magical darkness within 30 ft; enemies inside are **Blinded**; allies see through it. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Shadow Step** | 5 | Bonus | Teleport between shadows up to 40 ft; your next attack from concealment has advantage. |
| **Umbral Drain** | 7 | Action | Ranged attack, 30 ft. **2d6 + AGI** shadow; you gain temp HP equal to half the damage. |
| **Nightfall ×2** | 9 (+5/turn) | Action | *Signature.* 15-ft darkness; enemies **Blinded** and take **2d6** shadow/turn; spreads 5 ft each turn. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Shadow Storm** | 18 | Action | *AoE, auto-hit.* 20-ft radius; **3d6 + AGI** shadow; targets **Blinded**. |
| **Void Grip** | 12 | Action | Ranged, 30 ft. Target is **Rooted** and **Silenced**. |
| **Nightfall ×5** | 18 (+9/turn) | Action | *Signature.* 20-ft darkness; **Blinded** + **3d6**/turn + **Feared**; now allies inside are also Blinded (uncontrolled dark). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Umbral Form** | 22 (+10/turn) | Bonus | *Sustained.* Become living shadow — immune to physical damage, move through walls, attacks against you have disadvantage. |
| **Shadow Assassinate** | 20 | Action | Melee attack. **5d6 + AGI** shadow; if the target can't see you, this is an automatic critical (double the dice). |
| **Nightfall ×10** | 26 (+8/turn) | Action | *Signature capstone.* Plunge the whole battlefield into absolute darkness: everyone but you is **Blinded**; enemies take **5d6** shadow/turn and are **Feared**. Total control — but even your allies are blind. |

---

## Hydrokinesis — AGI · Healer · Sacral chakra  ✅ FULL
*Domain: water and restorative flow.* Hydrokinesis is the **flowing medic** — healing currents, cleanses,
water wards, and waves that carry allies to safety while sweeping enemies aside. Healer identity: sustained
healing + flow-based control (Slowed, push).
**Signature: Tide** — a wave that heals what it touches and moves what stands against it, growing into a world-wave.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Water Jet** | 4 | Action | Ranged attack, 30 ft. **1d6 + AGI** water; push the target 5 ft. |
| **Soothing Flow** | 3 | Action | Heal an ally **1d6 + AGI** HP. |
| **Tide** | 5 | Action | *Signature (base).* A 15-ft line wave: heal allies it crosses **1d6 + AGI** and push enemies 10 ft. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Healing Surge** | 7 | Action | Heal an ally **2d6 + AGI** HP. |
| **Riptide** | 7 | Action | Ranged attack, 30 ft. **1d10 + AGI** water; pull 10 ft and **Slowed**. |
| **Tide ×2** | 9 | Action | *Signature.* 20-ft wave: heal allies **2d6 + AGI**; enemies pushed 15 ft and **Slowed**. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Tsunami** | 18 | Action | *AoE, auto-hit.* 30-ft; enemies take **3d6 + AGI** water (push 20 ft, prone); allies caught heal **2d6**. |
| **Mass Renewal** | 11 | Action | *AoE.* Heal all allies within 20 ft **2d6 + AGI** HP. |
| **Tide ×5** | 18 | Action | *Signature.* 30-ft wave: heal allies **3d6 + AGI**; enemies **2d6** + pushed + **Slowed**. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Great Deluge** | 30 | Action | *AoE, auto-hit.* 40-ft flood: heal all allies **4d6 + AGI**; enemies **6d6** water, **Slowed** and prone. |
| **Rejuvenation Font** | 22 (+10/turn) | Bonus | *Sustained.* A 20-ft healing spring; allies inside heal **2d6 + AGI**/turn and regenerate KP. |
| **Tide ×10** | 26 | Action | *Signature capstone.* A world-wave: heal **all** allies to full and cleanse them; sweep all enemies (**5d6**, push 30 ft, prone, **Slowed**). The tide restores and resets everything. |

---

## Terrakinesis — CON · Tank · Root chakra  ✅ FULL
*Domain: earth and stone.* Terrakinesis is the **immovable object** — stone armor, walls, and ground
control. Tank identity: trade mobility for near-invincibility; hold the line.
**Signature: Stoneform** — encase yourself in living stone; each tier hardens you further at the cost of
**mobility**, until the ×10 makes you an unmovable mountain that cannot take a step.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Rock Throw** | 3 | Action | Ranged attack, 30 ft. **1d6 + CON** earth damage. |
| **Mud Skin** | 3 (+1/turn) | Bonus | *Sustained.* Hardened skin grants **+CON to Defense Score**. |
| **Stoneform** | 5 (+2/turn) | Bonus | *Signature (base).* Encase in stone: reduce incoming damage by **CON mod** and **+CON to DS**; movement −10 ft. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Stone Wall** | 7 (+4/turn) | Bonus | *Sustained.* Raise a 20-ft stone wall (full cover; blocks movement & line of sight). |
| **Earthquake** | 10 | Action | *AoE, auto-hit.* 15-ft; **2d6 + CON** earth; prone + difficult terrain. |
| **Stoneform ×2** | 9 (+5/turn) | Bonus | *Signature.* Damage reduction = **CON mod ×2**, +CON to DS, can't be moved; movement halved. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Fissure** | 18 | Action | *AoE, auto-hit.* 30-ft line; **3d6 + CON** earth; enemies fall prone and are **Rooted**. |
| **Mountain's Aegis** | 12 (+6/turn) | Bonus | *Sustained.* You and allies within 15 ft gain **+CON to DS** and damage reduction **1d4**. |
| **Stoneform ×5** | 18 (+9/turn) | Bonus | *Signature.* Stone titan: DR = **CON mod ×3**, large temp HP each turn, enemies must target you (taunt); **you cannot move**. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Continental Crush** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + CON** earth; prone and **Rooted**. |
| **Living Mountain** | 22 (+10/turn) | Bonus | *Sustained.* Your max HP doubles (temp), DR **CON mod**, immune to conditions; movement 0. |
| **Stoneform ×10** | 26 (+8/turn) | Bonus | *Signature capstone.* Become the mountain: DR **CON mod ×5**, immune to conditions & forced movement, attacks against you have disadvantage — but you are **completely immobile** and can only strike adjacent foes. The unmovable object. |

---

## Cryokinesis — CON · Controller · Root chakra  ✅ FULL
*Domain: ice, cold, preservation.* Cryokinesis is the **freeze controller** — it Slows, Freezes, walls off
ground, and preserves things in stasis. Controller identity: shut down enemy motion.
**Signature: Absolute Zero** — freeze a target solid, scaling to flash-freezing the whole battlefield;
the deeper the freeze, the more the cold **claims the caster too** (self-Slow, then self-Freeze backlash).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Frost Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + CON** cold damage. |
| **Ice Armor** | 3 (+1/turn) | Bonus | *Sustained.* **+CON to DS**; melee attackers take **1d4** cold. |
| **Absolute Zero** | 5 | Action | *Signature (base).* Freeze a target — it is **Frozen** until the end of its next turn. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Frost Nova** | 10 | Action | *AoE, auto-hit.* 10-ft; **2d6 + CON** cold. |
| **Rime** | 6 | Action | *AoE.* A 15-ft area becomes ice — difficult terrain; creatures there are **Slowed**. |
| **Absolute Zero ×2** | 9 | Action | *Signature.* Target is **Frozen**; if it was already Slowed/Frozen, **2d6** shatter damage. Self-cost: you are **Slowed** next turn. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Blizzard** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + CON** cold; targets **Slowed**. |
| **Flash Freeze** | 14 | Action | Ranged, 30 ft. Target is **Frozen**; attacks against a Frozen target deal +**1d6**. |
| **Absolute Zero ×5** | 18 | Action | *Signature.* Freeze all enemies in a 15-ft area (**Frozen**). Self-cost: you are **Slowed** while any remain frozen. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Ice Age** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + CON** cold; targets **Frozen**. |
| **Absolute Stasis** | 22 | Action | Put a creature in perfect stasis: **Frozen** and immune to all damage/effects for up to 3 turns (protect an ally or neutralize a foe). |
| **Absolute Zero ×10** | 26 | Action | *Signature capstone.* Flash-freeze the entire battlefield — all enemies **Frozen** in stasis. Self-cost: the absolute cold takes you too — you are **Frozen** for your next turn (backlash). |

---

## Vitakinesis — CON · Healer · Root chakra  ✅ FULL
*Domain: vitality, life force, renewal.* Vitakinesis is the **renewal healer** — regeneration, big heals,
raising the fallen, and boosting raw vitality (max HP). Healer identity: sustainable life-force restoration.
**Signature: Renewal** — overflowing life that heals and regrows over time, scaling to a wave that fully
restores and revives the whole party. (No self-harm — Vitakinesis is the *sustainable* healer; the
compassion of Electrokinesis without the self-sacrifice.)

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Life Touch** | 3 | Action | Heal an ally **1d6 + CON** HP. |
| **Purge Toxin** | 3 | Action | End one condition (poison, disease, etc.) on an ally. |
| **Renewal** | 5 | Action | *Signature (base).* Heal an ally **1d8 + CON** and grant regeneration **1d4**/turn for 2 turns. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Greater Heal** | 7 | Action | Heal an ally **2d6 + CON** HP. |
| **Second Life** | 8 | Action | Revive a downed ally to half HP. |
| **Renewal ×2** | 9 | Action | *Signature.* Heal **2d8 + CON** + regeneration **1d6**/turn for 3 turns; also revives if the ally is downed. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Mass Heal** | 12 | Action | *AoE.* Heal all allies within 20 ft **2d6 + CON** HP. |
| **Wellspring of Life** | 14 (+7/turn) | Bonus | *Sustained.* 20-ft zone; allies heal **2d6**/turn and can't drop below 1 HP while inside. |
| **Renewal ×5** | 18 | Action | *Signature.* Heal all allies in 20 ft **3d6 + CON** + regeneration; revive any downed among them. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Mass Resurrection** | 30 | Action | *AoE.* Revive all downed or dead allies within 30 ft to half HP and cleanse them. |
| **Eternal Vigor** | 22 (+10/turn) | Bonus | *Sustained.* Allies within 20 ft cannot drop below 1 HP and heal **3d6**/turn. |
| **Renewal ×10** | 26 | Action | *Signature capstone.* A wave of pure life: **fully heal and revive every ally**, cleanse all conditions, and grant them regeneration for the rest of the fight. Life renewed. |

---

## Gravikinesis — INT · Tank · Crown chakra  ✅ FULL
*Domain: gravity.* The **inevitable anchor** — pull enemies in, crush them, and become immovably dense.
Tank identity: force engagement, hold ground, mitigate through mass.
**Signature: Gravity Well** — a field of attraction centered on you that scales to a black hole; the
heavier it gets, the more it **pins the caster in place** (and eventually tears at its own center).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Gravity Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + INT** force damage. |
| **Pull** | 4 | Action | Pull a creature 15 ft toward you. |
| **Gravity Well** | 5 (+2/turn) | Bonus | *Signature (base).* 10-ft well: enemies entering are pulled to you and **Slowed**; **+INT to DS**; your movement −10 ft. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Crush** | 7 | Action | Ranged attack, 30 ft. **2d6 + INT** force (increase a target's gravity). |
| **Heavy Field** | 7 (+4/turn) | Bonus | *Sustained.* 15-ft zone of heavy gravity — enemies **Slowed**; ranged attacks through it fall short. |
| **Gravity Well ×2** | 9 (+5/turn) | Bonus | *Signature.* 15-ft well: pull + **Slowed** + **2d6**/turn; +INT to DS; you are **Rooted** while active. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Graviton Burst** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + INT** force; pull to center + prone. |
| **Reverse Gravity** | 14 | Action | *AoE.* 20-ft; enemies fall upward then crash down — prone + **2d6 + INT**. |
| **Gravity Well ×5** | 18 (+9/turn) | Bonus | *Signature.* 20-ft well: pull + **Slowed** + **3d6**/turn; +INT to DS; you are Rooted and take **1d6**/turn (strain). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Singularity** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + INT** force; all pulled to center and **Rooted**. |
| **Gravity Prison** | 20 | Action | Crush a target into stasis: **Frozen** (pinned) + **3d6**/turn. |
| **Gravity Well ×10** | 26 (+8/turn) | Bonus | *Signature capstone.* Become a black hole: 40-ft well pulls in **everything** each turn, enemies **Rooted** + **4d6**/turn; +INT to DS; you take **2d6**/turn and cannot move. |

---

## Chronokinesis — INT · Controller · Crown chakra  ✅ FULL
*Domain: time.* The **tempo controller** — Slow enemies, Haste allies, rewind harm, and ultimately stop
time. Controller identity: dominate the action economy.
**Signature: Slow Time** — bends time against enemies, scaling to a full battlefield time-stop; the deeper
the manipulation, the harsher the **temporal backlash** on the caster (self-Slow → lose your next turn).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Time Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + INT** temporal damage. |
| **Haste** | 4 | Bonus | An ally gains +10 ft movement and one extra Bonus Action this turn. |
| **Slow Time** | 5 | Action | *Signature (base).* A target (or 10-ft area) is **Slowed**. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Accelerate** | 8 | Bonus | An ally takes one **extra action** this turn. |
| **Temporal Lock** | 6 | Action | Ranged, 30 ft. Target **Rooted** in a time-loop and loses reactions. |
| **Slow Time ×2** | 9 | Action | *Signature.* 15-ft area **Slowed** + enemies lose reactions. Self-cost: you are **Slowed** next turn. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Temporal Rift** | 16 | Action | *AoE, auto-hit.* 20-ft; **3d6 + INT** temporal; **Slowed**. |
| **Haste Field** | 12 (+6/turn) | Bonus | *Sustained.* Allies within 15 ft gain +10 ft move and advantage on initiative & reactions. |
| **Slow Time ×5** | 18 | Action | *Signature.* 20-ft area: enemies **Stunned** 1 turn (near-stop). Self-cost: you lose your next turn. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Paradox** | 24 | Action | Negate a target's last action entirely + **3d6 + INT**. |
| **Rewind Death** | 24 | Action | Rewind a fallen ally to before they died — revive to full HP. |
| **Slow Time ×10** | 30 | Action | *Signature capstone.* **Stop time** — take **3 consecutive turns** while all else is frozen (damage lands when time resumes). Self-cost: you are **Stunned** when it ends (the paradox rebounds). |

---

## Biokinesis — INT · Healer · Crown chakra  ✅ FULL
*Domain: biology, living tissue.* The **flesh-shaper** — precise healing, regrowth, disease cures, and body
buffs (plus weaponized necrosis when needed). Healer identity: rebuild the body to perfection.
**Signature: Regenesis** — rewrite biology to heal and regrow, scaling from mending a wound to regrowing an
entire body from a single cell (biological resurrection).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Mend Tissue** | 3 | Action | Heal an ally **1d6 + INT** HP. |
| **Toxin** | 4 | Action | Ranged attack, 30 ft. **1d4 + INT** poison; the target is **Weakened**. |
| **Regenesis** | 5 | Action | *Signature (base).* Heal an ally **1d8 + INT** and regrow wounds — they end one condition. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Necrosis** | 7 | Action | Ranged attack, 30 ft. **2d6 + INT** necrotic; the target can't heal for 1 turn. |
| **Mutate** | 6 | Bonus | Grant an ally a boon for the fight: +2 an attribute, natural weapons (**1d8**), or +move. |
| **Regenesis ×2** | 9 | Action | *Signature.* Heal **2d8 + INT**, end 2 conditions, and revive a downed ally to half HP. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Plague** | 16 | Action | *AoE.* 15-ft; enemies **Weakened**, take **3d6**/turn poison, and can't heal. |
| **Graft** | 14 | Action | Regrow a lost limb / cure any disease or condition permanently, and heal **3d6 + INT**. |
| **Regenesis ×5** | 18 | Action | *Signature.* Heal all allies within 20 ft **3d6 + INT** + regeneration; revive any downed among them. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Extinction** | 30 | Action | *AoE, auto-hit.* 40-ft; **6d6 + INT** necrotic; enemies **Weakened** and can't heal. |
| **Apotheosis** | 26 | Action | Perfect an ally's biology: heal to full, +2 to all attributes (temp), immune to conditions. |
| **Regenesis ×10** | 26 | Action | *Signature capstone.* Regrow a body from a single cell — **fully resurrect a dead ally to full HP/KP**, restored perfectly. |

---

## Demokinesis — WIS · Tank · Third Eye chakra  ✅ FULL
*Domain: demonic power.* The **cursed juggernaut** — forbidden strength, fear, life-leech, and monstrous
transformation. Tank identity: trade your humanity for overwhelming power.
**Signature: Demon Form** — transform into a demon, more monstrous each tier; the ×10 grants godlike power
but **blacks out your Third Eye chakra** — you lose yourself to the demon.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Dark Claw** | 4 | Action | Melee attack. **1d8 + WIS** necrotic damage. |
| **Dread** | 4 | Action | Ranged, 30 ft. The target is **Feared**. |
| **Demon Form** | 5 (+2/turn) | Bonus | *Signature (base).* Partial demon: **+2 STR & WIS**, +WIS to DS, claws (**1d8**). |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Terrify** | 7 | Action | *AoE.* 15-ft; enemies **Feared**. |
| **Life Leech** | 7 | Action | Ranged attack, 30 ft. **2d6 + WIS** necrotic; heal yourself half. |
| **Demon Form ×2** | 9 (+5/turn) | Bonus | *Signature.* **+4 STR & WIS**, +WIS DS, claws **1d10**, fear aura. Cost: **drains 1d6 HP/turn** (the demon feeds). |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Hellstorm** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + WIS** necrotic; **Feared**. |
| **Devour** | 16 | Action | Melee attack. **4d6 + WIS**; heal equal to the damage dealt. |
| **Demon Form ×5** | 18 (+9/turn) | Bonus | *Signature.* **+8 STR & WIS**, claws **2d6**, fear aura, DR. Cost: HP drain **+ Third Eye chakra takes 2 hits** (corruption). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Apocalypse** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + WIS** necrotic; **Feared** and **Weakened**. |
| **Pact of Ruin** | 22 | Reaction | When you drop to 0 HP, return to half HP and deal **4d6** to all enemies within 20 ft. Once per long rest. |
| **Demon Form ×10** | 26 (+8/turn) | Bonus | *Signature capstone.* Full demon: **+15 STR & WIS**, claws **4d6**, DR, fear aura, flight. Cost: **completely blacks out your Third Eye chakra** — you lose yourself to the demon (locked out of WIS/Third Eye actions). |

---

## Naturakinesis — WIS · Controller · Third Eye chakra  ✅ FULL
*Domain: plants and nature.* The **living battlefield** — entangling vines, thorns, poison, and groves that
ensnare foes while sheltering allies. Controller identity: reshape the terrain into your ally.
**Signature: Bloom** — a growing garden that Roots and harms enemies while healing allies; you must remain
**Rooted** as its heart to make it grow.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Thorn Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + WIS** piercing damage. |
| **Thistle Bush** | 4 | Action | Grow a 5-ft thornbush: difficult terrain; creatures moving through take **1d6**. |
| **Bloom** | 5 (+2/turn) | Action | *Signature (base).* 10-ft garden within 30 ft: enemies inside **Rooted** + **1d6**/turn thorns; allies inside heal **1d4**/turn. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Poison Spores** | 7 | Action | *AoE.* 15-ft; enemies **Weakened** and take **2d6**/turn poison. |
| **Grasping Roots** | 7 | Action | *AoE.* 15-ft; enemies **Rooted**. |
| **Bloom ×2** | 9 (+5/turn) | Action | *Signature.* 15-ft garden: enemies **Rooted** + **2d6**/turn; allies heal **2d6**/turn; spreads 5 ft. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Thornstorm** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + WIS** piercing; **Rooted**. |
| **Wall of Thorns** | 14 (+7/turn) | Bonus | *Sustained.* 30-ft thorn wall; crossing deals **3d6** and **Roots**. |
| **Bloom ×5** | 18 (+9/turn) | Action | *Signature.* 20-ft garden: enemies **Rooted** + **3d6**/turn; allies heal **3d6**/turn; spreads 10 ft. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Primeval Forest** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + WIS**; all enemies **Rooted**; terrain becomes dense forest. |
| **World Tree** | 24 (+10/turn) | Bonus | *Sustained.* A great tree; allies within 30 ft heal **3d6**/turn and revive at 1 HP; enemies **Rooted**. |
| **Bloom ×10** | 26 (+8/turn) | Action | *Signature capstone.* The garden reclaims the field: 40-ft — all enemies **Rooted** + **4d6**/turn; all allies heal **4d6**/turn and are sheltered. Cost: you remain **Rooted** as its heart. |

---

## Holykinesis — WIS · Healer · Third Eye chakra  ✅ FULL
*Domain: holy and angelic power.* The **divine protector** — radiant healing, blessings, smites, and wards
that shield allies from death. Healer identity: protection and judgment.
**Signature: Sanctuary** — a consecrated zone that heals allies and burns enemies, scaling to a divine
domain of total protection; at its peak you become the **motionless conduit** channeling it.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Smite** | 4 | Action | Ranged attack, 30 ft. **1d8 + WIS** radiant (double vs. undead/evil). |
| **Bless** | 3 | Action | An ally gains **+1d4** to attacks and checks for 3 turns. |
| **Sanctuary** | 5 (+2/turn) | Bonus | *Signature (base).* Consecrate a 10-ft zone: allies heal **1d4 + WIS**/turn; enemies take **1d6** radiant/turn. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Radiant Beam** | 6 | Action | Ranged attack, 50 ft. **2d6 + WIS** radiant damage. |
| **Greater Blessing** | 7 (+4/turn) | Bonus | *Sustained.* Allies within 15 ft gain **+1d4** to attacks and saves. |
| **Sanctuary ×2** | 9 (+5/turn) | Bonus | *Signature.* 15-ft zone: allies heal **2d6**/turn + immune to Fear; enemies **2d6** radiant/turn. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Judgment** | 16 | Action | **4d6 + WIS** radiant to a target (double vs. undead/evil). |
| **Resurrection** | 16 | Action | Revive a dead ally to half HP and cleanse. |
| **Sanctuary ×5** | 18 (+9/turn) | Bonus | *Signature.* 20-ft zone: allies heal **3d6**/turn + DR; enemies **3d6** radiant + **Blinded**. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Divine Judgment** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + WIS** radiant to enemies (double vs. evil); allies healed **2d6**. |
| **Miracle** | 26 | Action | Heal an ally to full, revive if dead, remove all conditions, grant immunity for a turn. |
| **Sanctuary ×10** | 26 | Action | *Signature capstone.* Manifest a divine domain (40-ft): allies are fully healed each turn, revived if they fall, and immune to harm; enemies take **4d6** radiant/turn + **Blinded**. Cost: you become the conduit — **you cannot move or act** while it stands. |

---

## Sonikinesis — CHA · Tank · Throat chakra  ✅ FULL
*Domain: sound and resonance.* The **resonant bulwark** — vibrational shields, war-anthems that rally
allies, and building sound that disorients foes. Tank identity: protect through overwhelming presence.
**Signature: Crescendo** — a resonance that **builds intensity each turn** (music rising to a climax);
at its peak the deafening sound overwhelms everyone, allies included, and you can only conduct the wave.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Resonant Pulse** | 4 | Action | *AoE.* 10-ft; enemies **Shocked** (disoriented). *(Musician's starting technique.)* |
| **War Cry** | 4 | Bonus | Allies within 15 ft gain **+1d4** to their attacks this turn. |
| **Crescendo** | 5 (+2/turn) | Bonus | *Signature (base).* A building 10-ft resonance: deals **+1d4 more** thunder each turn to adjacent enemies (starts 1d4); **+CHA to DS**. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Thunderclap** | 8 | Action | *AoE, auto-hit.* 15-ft; **2d6 + CHA** thunder; push 10 ft + **Shocked**. |
| **Anthem** | 7 (+4/turn) | Bonus | *Sustained.* Allies within 15 ft gain +CHA to DS and **+1d4** attacks. |
| **Crescendo ×2** | 9 (+5/turn) | Bonus | *Signature.* Builds **+1d6**/turn thunder in 10 ft; +CHA DS; at peak also pushes. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Shatter** | 16 | Action | **4d6 + CHA** thunder to a target; ignores DR and armor (resonant frequency). |
| **Deafening Roar** | 12 | Action | *AoE.* 15-ft; enemies **Stunned** 1 turn (deafened). |
| **Crescendo ×5** | 18 (+9/turn) | Bonus | *Signature.* Builds **+1d8**/turn thunder in 20 ft; +CHA DS; now **allies who stay are Shocked** too (overwhelming). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Sonic Boom** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + CHA** thunder; push + **Stunned**. |
| **Unbreakable Anthem** | 22 | Bonus | Allies within 30 ft can't drop below 1 HP for 2 turns and are immune to conditions. |
| **Crescendo ×10** | 26 (+8/turn) | Bonus | *Signature capstone.* A world-shaking climax: 40-ft, **+2d6**/turn thunder to all enemies (building), +CHA DS, allies buffed — but the peak **Shocks everyone including allies** and you can make no single-target actions (loss of control). |

---

## Lumokinesis — CHA · Controller · Throat chakra  ✅ FULL
*Domain: light.* The **radiance controller** — blinding light, searing lasers, and illusions. Controller
identity: deny sight and burn (the mirror of Umbrakinesis's darkness).
**Signature: Radiance** — an expanding light that Blinds and burns; at ×10 it ignites a second sun that
blinds **everyone but you** — too bright to bear (loss of control).

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Light Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + CHA** radiant damage. |
| **Flash** | 4 | Action | *AoE.* 10-ft; enemies **Blinded**. |
| **Radiance** | 5 (+2/turn) | Action | *Signature (base).* 10-ft zone of blinding light within 30 ft: enemies **Blinded** + **1d6**/turn radiant. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Laser** | 6 | Action | Ranged attack, 60 ft line. **2d6 + CHA** radiant; ignores partial cover. |
| **Hologram** | 6 | Action | Create a decoy that draws an attack — an enemy wastes its next attack on the illusion. |
| **Radiance ×2** | 9 (+5/turn) | Action | *Signature.* 15-ft light: **Blinded** + **2d6**/turn; spreads 5 ft. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Prism Beam** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + CHA** radiant; **Blinded**. |
| **Illusory Army** | 14 | Action | *AoE.* 15-ft; illusory duplicates confuse enemies — **Feared** (disadvantage) 1 turn. |
| **Radiance ×5** | 18 (+9/turn) | Action | *Signature.* 20-ft light: **Blinded** + **3d6**/turn; now allies inside are also Blinded (too bright). |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Second Sun** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + CHA** radiant; **Blinded**. |
| **Grand Illusion** | 24 | Action | *AoE.* 30-ft; enemies **Feared** and strike wrong targets (confusion) 1 turn. |
| **Radiance ×10** | 26 (+8/turn) | Action | *Signature capstone.* Ignite a second sun (40-ft): **everyone but you is Blinded**; enemies take **5d6**/turn radiant. Overwhelming light — even allies can't see. |

---

## Spirikinesis — CHA · Healer · Throat chakra  ✅ FULL
*Domain: spirits and the afterlife.* The **soul-shepherd** — heal by channeling spirits, anchor souls
against death, summon spirit guardians, and call the fallen back. Healer identity: mastery over the soul.
**Signature: Soul Tether** — bind an ally's soul so they cannot truly die, scaling to journeying into the
afterlife to **pull a soul fully back** — at the cost of the caster briefly crossing over.

### Beginner (Soul Level 1+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Spirit Bolt** | 3 | Action | Ranged attack, 30 ft. **1d6 + CHA** spectral damage. |
| **Soothe Spirit** | 3 | Action | Heal an ally **1d6 + CHA** HP. |
| **Soul Tether** | 5 | Action | *Signature (base).* Tether an ally's soul: the next time they'd drop to 0 HP, they instead stay at 1 HP. |

### Adept (Soul Level 8+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Vengeful Spirit** | 6 | Action | Ranged attack, 40 ft. **2d6 + CHA** spectral damage. |
| **Mend Soul** | 7 | Action | Heal an ally **2d6 + CHA** and end one condition. |
| **Soul Tether ×2** | 9 | Action | *Signature.* Tether up to 2 allies (stay at 1 HP once), or revive one downed to half HP. Self-cost: take **1d6** spectral. |

### Expert (Soul Level 15+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Spirit Storm** | 18 | Action | *AoE, auto-hit.* 20-ft; **3d6 + CHA** spectral; **Feared**. |
| **Possession** | 16 | Action | Briefly possess an enemy: it is **Stunned** and you redirect its next action. |
| **Soul Tether ×5** | 18 | Action | *Signature.* Tether all allies within 20 ft (stay at 1 HP once) or revive downed among them. Self-cost: **1d6** spectral + Throat chakra takes 1 hit. |

### Master (Soul Level 22+)
| Technique | KP | Action | Effect |
|---|---|---|---|
| **Wrath of the Dead** | 32 | Action | *AoE, auto-hit.* 40-ft; **6d6 + CHA** spectral; **Feared**. |
| **Afterlife's Guard** | 22 (+10/turn) | Bonus | *Sustained.* Allies within 20 ft can't die (stay at 1 HP) and heal **3d6**/turn. |
| **Soul Tether ×10** | 26 | Action | *Signature capstone.* Journey to the afterlife and call back a fallen ally — **fully resurrect them to full HP/KP**. Self-cost: you cross over — **Stunned** your next turn, and your Throat chakra takes 2 hits. |

---

## 🎉 All 18 Kinetics complete
Every Kinetic has **4 tiers × 5 techniques (≈360 total)**, a philosophy-embodying signature, role-true kits,
and rubric-derived KP.

| Attr | Tank | Controller | Healer |
|---|---|---|---|
| **STR** (Core) | Robukinesis ✅ | Pyrokinesis ✅ | Electrokinesis ✅ |
| **AGI** (Sacral) | Aerokinesis ✅ | Umbrakinesis ✅ | Hydrokinesis ✅ |
| **CON** (Root) | Terrakinesis ✅ | Cryokinesis ✅ | Vitakinesis ✅ |
| **INT** (Crown) | Gravikinesis ✅ | Chronokinesis ✅ | Biokinesis ✅ |
| **WIS** (Third Eye) | Demokinesis ✅ | Naturakinesis ✅ | Holykinesis ✅ |
| **CHA** (Throat) | Sonikinesis ✅ | Lumokinesis ✅ | Spirikinesis ✅ |

**Next steps:** playtest & tune numbers (buffs/auras are the fuzziest), then wire into the app alongside the
**level-up / Technique-Point system** so tiers unlock at the right Soul Levels and the creator only offers
Beginner picks at level 1.

> **App status:** ✅ All 18 Kinetics × 4 tiers × **3 techniques = 216** are loaded into the app (`data.js`).
> The level-up screen gates them by **Soul Level** (Beginner 1 / Adept 8 / Expert 15 / Master 22) **and**
> by requiring **≥3 known techniques from the Kinetic's previous tier** before its next tier unlocks —
> which, at 3 per tier, means you must **complete the whole previous tier** to advance.
