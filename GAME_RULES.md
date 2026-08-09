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
  Current **scales with the max**, keeping the same fraction: a **full** bar stays full, a bar at **half** stays
  half (e.g. 28/55 → 31/61). When the buff ends the max drops and current scales back down by the same ratio, so
  toggling it round-trips cleanly and never nets free HP/KP. (Damage, healing and rests don't change the max, so
  they never rescale current.)
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
- Attributes **soft-capped at 30**; modifiers keep scaling past it. **Permanent** additions count toward the
  cap and can't exceed it — a background/Otherkin **boost is part of your real score**, so base + boost is
  capped at 30 (see leveling). Only **temporary** effects (technique/transform buffs) **break** the soft cap
  and rise above 30.
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
  (see **Armor** below): **DS = 10 + (AGI mod, gated by class) + CON mod + armor bonus + shield bonus.** CON always applies.

### Equipment & slots (CONFIRMED Luke)
Gear you carry lives in your **Inventory** (the bag); gear you're actually wearing/wielding goes in **equipment
slots**, shown on the **Equipment tab** as a paper-doll of the body (the same body-figure style as the Limbs tab).
There are **eight slots**:
- **Left Hand & Right Hand** — a **one-handed** weapon or a **shield** takes one hand; a **two-handed** weapon
  fills **both**; dual-wielding = a one-hander in each.
- **Six apparel slots** — **Head** (hats & helmets), **Torso** (shirts & body armor), **Back** (capes & coats),
  **Arms** (gloves & gauntlets), **Legs** (pants, skirts & greaves), and **Feet** (shoes & boots). Each worn piece
  names the slot it fills via its **coverage**; whole-body armor (the entire current catalog) counts as **Torso**
  body armor. Per-slot apparel (helmets, cloaks, gauntlets, greaves, boots…) is content to be authored later; each
  piece's Defense sums.
- **Rules are hard-enforced.** You can't hold a shield and a two-handed weapon, wear two things in one slot, etc. —
  equipping something **displaces** whatever shared its slot (logged). Equip/unequip from the Equipment tab
  (tap a slot on the figure → pick from the list) or from the Inventory tab's Equip button (routes to a sensible
  default slot).
- **The catalog spans every slot.** Torso holds the body armor (Light/Medium/Heavy, +1 to +6 Defense); the other
  apparel slots hold lighter pieces — helmets, cloaks/coats, gloves & gauntlets, leggings & greaves, boots — that
  carry the same class (so a heavy helm gates AGI like heavy armor) and add a **modest Defense** (mostly +0 to +2).
  **Accessory Defense is capped:** Torso body armor and a held shield add their full bonus, but the five accessory
  slots (Head/Back/Arms/Legs/Feet) **sum to at most +3 Defense together** — so a fully-matched set is a real perk
  without letting Defense run away. Every piece is also **craftable** (accessories take a slimmer component recipe
  than a full body suit). **Shields** are a one-hand ladder — Buckler/Targe (+1) → Round/Heater/Spiked (+2) →
  Kite (+3) → Tower/Riot/Pavise (+4) → warded bulwarks (+5) — each adding its Defense while held and enabling the
  **Block** reaction.

### Shields (CONFIRMED Luke)
A **shield** is its own item category, **held in one hand**. It adds its **Defense bonus** while equipped (no
proficiency gate — anyone can raise a shield), and enables the **Block** reaction: spend your **Reaction** to add
the shield's Defense **again** against one incoming hit, until your next turn. Ladder by Defense/weight:
**Buckler (+1) · Round/Heater (+2) · Kite (+3) · Tower / Riot (+4)** (plus rarer wards).

### Armor — classes, proficiency & rarity (CONFIRMED Luke)
Armor comes in **three classes**, a clear tradeoff between mobility and protection:

| Class | Defense bonus | AGI → Defense | Movement | Stealth |
|---|---|---|---|---|
| **Light** | +1 to +2 | **full** AGI mod | normal | **advantage** |
| **Medium** | +3 to +4 | capped at **+2** | normal | normal |
| **Heavy** | +5 to +6 | **none** | **−5 ft** | **disadvantage** |

- **Armor proficiency.** Everyone is proficient with **Light**. **Medium** and **Heavy** proficiency come from
  your **Regional Heritage** only (heavy-armor cultures grant Medium/Heavy; agile/mobile peoples grant Light
  only — e.g. North America's Native nations are Light-only). Wearing a class you're **not** proficient with: you gain
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

### Conditions (status effects)
Many techniques, weapons and hazards inflict a **named condition** — a temporary state that changes what a
character can do. These used to live only as prose inside a technique's effect text; the app now tracks them
so a player can see at a glance what's affecting them. Conditions are grouped by severity for readability:
- **Crippling (red):** Burning · Bleeding · Poisoned · Frozen · Shocked · Blinded · Stunned
- **Hindering (gold):** Rooted · Slowed · Weakened · Frightened · Charmed · Confused · Silenced · Dazzled · Prone · Grappled
- **Other (cyan):** Marked
- **Beneficial (green):** Invisible

Each condition lasts **until it's cleared** (∞) or for a **set number of turns**; a timed condition counts
down at End Turn and clears itself when it runs out. Effects (placeholder wording pending Luke & Brittany's
official rulebook, matched to how the technique library already uses each word):

| Condition | Effect |
|---|---|
| Burning | Takes fire damage at the start of each turn until put out. |
| Bleeding | Loses HP at the start of each turn until bound or healed. |
| Poisoned | Disadvantage on attack rolls and ability checks; may take poison damage over time. |
| Frozen | Encased in ice — can't act until it shatters; incoming hits often crack it free. |
| Shocked | Disadvantage on attacks and can't take reactions. |
| Blinded | Can't see — disadvantage on attacks; attacks against you have advantage. |
| Stunned | Can't take actions or reactions; attacks against you have advantage. |
| Rooted | Movement 0, but can still act. |
| Slowed | Movement halved and can't take reactions. |
| Weakened | Deals reduced damage; disadvantage on Strength-based rolls. |
| Frightened | Disadvantage while the source is in sight; can't willingly move closer to it. |
| Charmed | Can't target the charmer; they have advantage on social checks against you. |
| Confused | Acts erratically — may lose its turn or strike a random target. |
| Silenced | Can't use techniques/abilities with a vocal component. |
| Dazzled | Disadvantage on attack rolls and sight-based checks. |
| Prone | Disadvantage on attacks; melee attackers have advantage; half movement to stand. |
| Grappled | Movement 0; ends if the grappler is incapacitated or you break free. |
| Marked | Attackers gain a bonus against you per the marking effect. |
| Invisible | Advantage on attacks; attacks against you have disadvantage. |

- *App:* the **Combat tab** has a **Conditions** tracker — tap **＋ Condition** to apply one, use the chip's
  ∞/turn stepper to set a duration, and **✕** to clear it. Timed conditions tick down automatically at End
  Turn. Active conditions also show as a read-only strip on the **Sheet** tab.

### Chakra Chart (CONFIRMED Luke) — a separate health system
A **second health track**, independent of HP. There are **6 chakra points**, one tied to each attribute.
**Each chakra can take up to 4 hits**, with escalating penalties to *everything that uses that attribute*
(attacks, skills, and techniques):

### The 6 Chakras (CONFIRMED Luke)
Listed crown→root (top of the body to the base), with each chakra's signature color (as shown on the app's
**Chakras** tab):

| Attribute | Chakra | Location | Color | Theme |
|---|---|---|---|---|
| **INT** | **Crown** | top of head | Violet | Knowledge, logic, higher mind |
| **WIS** | **Third Eye** | brow | Indigo | Insight, awareness, intuition |
| **CHA** | **Throat** | throat | Blue | Voice & expression |
| **STR** | **Core** (Solar Plexus) | upper abdomen | Yellow | Raw power & willpower |
| **AGI** | **Sacral** | lower belly | Orange | Movement, flow, reflexes |
| **CON** | **Root** | base of spine | Red | Survival, endurance, grounding |

Each Kinetic inherits its chakra from its governing attribute (e.g. all STR Kinetics — Robukinesis,
Pyrokinesis, Electrokinesis — are tied to the **Core** chakra). Hitting a chakra therefore weakens both
that attribute's rolls **and** all its Kinetics.

**The hidden 7th — Heart chakra (Otherkin).** A **seventh** chakra, **Heart** (green), stays fully concealed
until **Soul Level 15**, when it **awakens** at the *center* of the chart (between Throat and Core). It is
**not** bound to an attribute, but it **does** carry the same **4-hit track** as the other six — it is the seat
of the **Otherkin / Soul Creature** (below), so **its hits weaken the Otherkin's powers** instead of an
attribute's: 1 = disadvantage, 2 = modifier halved, 3 = removed, **4 = the Soul Creature falls dormant** (no
Otherkin techniques or signature until you rest). It heals on rest like the others (short +1, long +2). In the
app it is invisible before 15 and, once awakened, appears with a full pip track on the **Chakras** tab.


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
- **How you level:** XP **threshold** system — the **Soul Pool IS your cumulative XP**. When your total reaches the
  next level's threshold, you may level up. Leveling stays **GM-driven** in the app: the XP bar fills and the
  **Level Up** button lights up "ready," but a player/GM still taps to confirm (so the GM controls pacing and can
  level a character at their discretion). XP is **cumulative** — it never resets on level-up, and is kept
  consistent with level: a level-*L* character always holds at least level *L*'s XP total (leveling up tops the
  Soul Pool up to the new level's floor if it was behind), so the progress bar always reflects real progress.
- **XP curve (PLACEHOLDER — Luke can retune).** Advancing from level *L* to *L+1* costs **100 × L² XP**; totals are
  the running sum. This is a starting curve, defined in `app/data.js` (`PC.XP_STEP` / `PC.XP_THRESHOLDS`) and
  swappable in one line without touching the engine.

  | Level | Total XP | Level | Total XP | Level | Total XP |
  |---|---|---|---|---|---|
  | 1 | 0 | 11 | 38,500 | 21 | 287,000 |
  | 2 | 100 | 12 | 50,600 | 22 | 331,100 |
  | 3 | 500 | 13 | 65,000 | 23 | 379,500 |
  | 4 | 1,400 | 14 | 81,900 | 24 | 432,400 |
  | 5 | 3,000 | **15** | **101,500** | 25 | 490,000 |
  | 6 | 5,500 | 16 | 124,000 | 26 | 552,500 |
  | 7 | 9,100 | 17 | 149,600 | 27 | 620,100 |
  | 8 | 14,000 | 18 | 178,500 | 28 | 693,000 |
  | 9 | 20,400 | 19 | 210,900 | 29 | 771,400 |
  | 10 | 28,500 | 20 | 247,000 | **30** | **855,500** |

- **Level cap: 30.**
- **Every level:** gain **1 Technique Point (TP)** — spent to learn Kinetic Techniques. **Every technique costs exactly 1 TP** (no tiered costs).
- **Every ODD level** (3, 5, 7 … up the ladder): gain **1 attribute point** — place in any attribute. Leveling **cannot** raise an attribute above **30**, and because a background/Otherkin **boost is permanent** it counts toward that cap — i.e. **base + boost can't exceed 30** (only temporary technique/transform buffs push past 30).
- **Milestone levels** grant special new systems. Known: **Level 15 unlocks the Otherkin system** (see below).

### At character creation (level 1)
- **1 free beginner technique** from your Psionic Background, **plus 2 additional Kinetic Techniques of the player's choice from ANY type.** (So a new character starts knowing **3 techniques**.)
- **No Technique Point at level 1** (CONFIRMED Luke) — the 2 chosen techniques ARE your level-1 grant.
  You earn **+1 TP every level from level 2 onward** (so by level 30 you've gained 29 TP total).

### Technique tiers (CONFIRMED Luke)
- Techniques come in **4 tiers** — **Beginner · Adept · Expert · Master** — with **3 techniques per tier per
  Kinetic** (18 Kinetics × 4 × 3 = **216 total**). One of each tier's three is the **signature** (its scaling
  line — e.g. *Conflagration → ×2 → ×5 → ×10*); the other two are a role-spread pick.
- A character's **Soul Level gates which tier they may learn/buy** (Adept @8, Expert @15, Master @22), **and**
  a tier only opens once you already know **≥3 techniques from that Kinetic's previous tier** — which, at 3 per
  tier, means you must **complete the whole previous tier** to advance it.
- **Why only 3 per tier?** The TP budget is fixed: **29 TP by level 30 + 3 starting techniques = 32 acquisitions**.
  At 12 techniques per Kinetic, that budget **masters ~2 full Kinetics (24) and dips into a 3rd (8)** — the
  intended breadth. (At the old 20/Kinetic it only reached one master plus half of a second.)

### Kinetic proficiency by tier completion (CONFIRMED Luke)
- Completing **every technique in a Kinetic's Adept tier** (all 3) **auto-grants proficiency** in that Kinetic
  — relevant for Kinetics outside your background focus (the focus Kinetic is already proficient).
- Completing **every technique in its Expert tier** (all 3) **auto-grants expertise** — you add **double your
  proficiency bonus** to that Kinetic's technique attack rolls.
- This is **derived automatically** from the techniques a character knows (no separate bookkeeping); the app
  shows current status on the play sheet's **Kinetics** tab and toasts the moment a threshold is crossed.

### Three point currencies — keep separate!
- **KP = Ki Points** — the **Mana** bar (= Mind Pool). Spent to *use* techniques in play; recovers via rest/items/etc.
- **TP = Technique Points** — earned **+1 per level**. Spent to *permanently learn* techniques (1 TP each). Not a combat resource.
- **CSP = Combat Skill Points** — earned **+1 every 5th level** (5/10/15/20/25/30). Spent to *permanently learn* Combat Skills (1 CSP each) from any **Fighting Style**. See Section 3b.

### Otherkin System (unlocks at Soul Level 15)
- Your **Soul Creature** — a being that has lived in your soul since creation, awakening at the **Heart chakra**.
- **Chosen once at Soul Level 15, permanent — and a FREE choice** (not tied to your background). First edition
  ships **9 Otherkin** (one themed to each background; expansions later), but any character may pick any of them.
  Because each grants a **fixed** boost, the choice has teeth — no sense taking +3 to an attribute you've maxed.
- **Every Otherkin grants four things:**
  1. **An attribute + pool boost** — background-style (e.g. **+3 AGI, +10 Body Pool**), fixed, applied once at 15,
     **no scaling**. It **stacks** on top of your background's boost (a real level-15 power spike).
  2. **One unique Kinetic** — named to *embody the creature* (never "-kinesis"). Its **6 techniques** are
     **auto-granted free** (no Technique Points) on the every-3-levels beat **15 / 18 / 21 / 24 / 27 / 30**, one at
     a time. They **cost KP** like any technique and are **governed by the Heart chakra** (not their roll attribute).
  3. **One signature ability** — **rest-gated like a Barbarian's Rage**: a set number of activations that refresh on
     rest. It **upgrades every 3rd level** (6 tiers on the same beat), growing **both** in power **and** in number of
     uses. Each Otherkin declares whether it refreshes on a **short** or **long** rest. Some signatures are
     **toggled states** — activate spends a use, turning it off is free — that grant a scaling stat buff (which may
     **break the soft cap of 30**) and other perks. These come in two flavors: a **physical transformation** (you
     change shape — e.g. the Lycan and Troll; dropping to 0 HP reverts you to normal at half HP instead of dropping
     you) and an **invocation** (you don't change shape, you just gain a creature's abilities — e.g. the Unicorn's
     Mystic Steed; no 0-HP revert).
  4. All of the above answer to the **Heart chakra** — hits weaken every Otherkin power; a locked Heart (4) shuts
     the Soul Creature off until you rest.
- **In the app:** the reveal and one-time choice happen on the **Level Up screen** — when a character reaches
  Soul Level 15 the Heart chakra opens, an awakening message appears, and each Otherkin is shown with a full
  breakdown (boost, signature, all six techniques) to choose from (permanent). The **♥ Otherkin** tab (which
  appears at 15) then becomes the Soul-Creature sheet — boost, the six techniques (unlocked + upcoming), and the
  signature card with a rest-gated **use counter** and its tier ladder; before a choice is made it simply points
  the player to the Level Up screen. Otherkin techniques are also playable from the **Combat** tab.

**First-edition roster (all 9 built — complete):**
- **Kitsune** · Kinetic **Fox Mischief** (AGI) · Boost **+3 AGI / +10 Body Pool** · Signature **Kitsune Disguise**
  (take another humanoid's form; **short-rest** refresh; 1 use at Tier I scaling to 6 at Tier VI). Its six tails:
  *Foxstep* (15, ignore difficult terrain) · *Foxfire Feint* (18, non-combat misdirection) · *Mistveil* (21,
  invisibility) · *Bewitching Flame* (24, ranged foxfire + dazzle) · *Shadow Clone* (27, ¼-HP decoy that draws
  attacks) · *Foxfire Rush* (30, teleport + vanish, advantage on the next attack).
- **Siren** · Kinetic **Seductive Voice** (CHA) · Boost **+3 CHA / +10 Mind Pool** · Signature **Siren's Song**
  (enchant NPCs and command them; **short-rest** refresh; 1 → 6 uses, growing in reach — one thrall up to a mass
  enthrall). Its six "verses": *Tidecaller's Grace* (15, swim speed + underwater breathing) · *Luring Melody* (18,
  non-combat charm) · *Enthralling Note* (21, single-target charm) · *Undertow* (24, 15-ft line, 3d6 cold + prone)
  · *Siren's Lament* (27, disadvantage aura that draws enemies in) · *Charybdis* (30, 20-ft whirlpool, 5d6 cold +
  drag to center).
- **Gryphon** · Kinetic **Sovereign Wing** (hybrid INT/STR) · Boost **+2 INT / +1 STR / +5 Body / +5 Mind** ·
  Signature **Sovereign's Presence** — a regal fear/rally aura on a **LONG rest** (the first signature that isn't
  short-rest; 1 → 6 uses, growing from a brief fright to a battlefield-wide command). Its six "ascensions":
  *Take Wing* (15, **flying speed**) · *Eagle's Eye* (18, keen-sight scouting) · *Buffeting Gale* (21, 15-ft cone,
  2d6 + STR + prone) · *Rending Talons* (24, 3d8 + STR dive strike) · *Guardian's Aegis* (27, +2 Defense ally aura)
  · *Sovereign's Descent* (30, 15-ft radius, 5d8 + STR + prone).
- **Lycan** (a distinct being — **not** a Werewolf) · Kinetic **Lycanthropy** (CON) · Boost **+3 CON / +10 Body
  Pool** · Signature **Lycan Shift** — a **transformation** into a man-wolf hybrid (**long** rest; 1 → 6 uses).
  While shifted you gain **+3 × tier to STR/AGI/CON** (breaking the cap of 30), **natural claws** (unarmed → 2d6),
  and **+2 Defense** from thick fur; revert at will, and at 0 HP you revert to human at half HP. Its six techniques:
  *Lunar Leap* (15, jump twice your normal height/distance) · *Regeneration* (18, **self-heal** 2d8 + CON) ·
  *Thick Hide* (21, −3 incoming damage) · *Savage Pounce* (24, 3d8 + STR leap-strike + prone) · *Rampage* (27,
  10-ft radius, 3d8 + STR) · *Bloodrage* (30, sustained +4 STR / +4 CON).
- **Troll** · Kinetic **Troll's Fury** (STR) · Boost **+3 STR / +10 Body Pool** · Signature **Giant Form** — a
  **transformation** (grow to giant size; **long** rest; 1 → 6 uses) granting a gentle **STR/CON climb (+2 at Tier I,
  +1 each tier → +7 at Tier VI, breaking the cap of 30)** while size scales faster — **1.5× at Tier I, +0.5× per tier
  → 4× at Tier VI** — as do uses; revert at will, 0-HP reverts you at half HP. Its six
  techniques are heavy single-target melee plus one mobility: *Smash Through* (15, **break through terrain/cover**
  in your path — destroyed → keep moving, else halt) · *Crushing Blow* (18, 3d10 + STR) · *Bonebreaker* (21,
  3d12 + STR + Weakened) · *Pulverize* (24, 4d10 + STR, ignores cover/armor) · *Grapple Slam* (27, 4d12 + STR +
  prone) · *Cataclysm* (30, 6d12 + STR + Stunned). *(The Kitsune/AGI, Lycan/CON and Troll/STR complete the
  body-attribute Otherkin.)*
- **Unicorn** · Kinetic **Mystic Grace** (WIS) · Boost **+3 WIS / +10 Mind Pool** · Signature **Mystic Steed** — an
  **invocation** (you don't change shape — you channel a steed's grace; **long** rest; 1 → 6 uses) granting a gentle
  **WIS/CHA climb (+2 → +7, breaking the cap)** **and double movement speed** (the movement multiplier does **not**
  scale); dismiss at will. (No 0-HP revert, since there's no form to collapse.) Its six graces lean
  elusive / enchanting / healing: *Healing Horn* (15, **heal**
  2d8 + WIS) · *Elusive Grace* (18, evade/hide) · *Enchanting Gaze* (21, single-target charm) · *Radiant Beauty*
  (24, 15-ft radius, 3d8 + WIS radiant + dazzle) · *Purifying Light* (27, cleanse a condition + heal 2d6 + WIS) ·
  *Aurora Blessing* (30, mass heal 4d8 + WIS + advantage).
- **Sphynx** · Kinetic **Sphynx Riddles** (INT) · Boost **+3 INT / +10 Mind Pool** · Signature **Cosmic Knowledge**
  — once per long rest (1 → 6 uses, +1/tier): gain **advantage on any INT skill check**, OR **cast any Intelligence
  kinetic technique regardless of its level, whether you know it, or its KP cost**. Its six riddles lean into riddles
  / time / otherworldly knowledge: *Vexing Riddle* (15, Confuse) · *Ancient Lore* (18, knowledge/utility) ·
  *Temporal Slip* (21, Slow) · *Psychic Lance* (24, 3d8 + INT psychic) · *Foresight* (27, sustained: +INT to Defense
  + advantage on saves) · *Temporal Collapse* (30, 20-ft radius, 5d8 + INT psychic + lose next turn). *(With the
  Sphynx/INT, all six attributes now have a standalone Otherkin.)*
- **Wyvern** (hybrid **WIS/AGI**) · Kinetic **Draconic Fire** · Boost **+2 WIS / +1 AGI / +5 Body / +5 Mind** ·
  Signature **Wyvern's Wings** — a **physical transformation** (**short** rest; 1 → 6 uses) that grows scaly wings:
  a **flight speed = 1.5× movement at Tier I, +0.5×/tier → 4×** (shown as a separate Fly speed), plus tier-gated
  traits — a **tail** (Tail Whip: a Bonus-Action unarmed strike using **AGI**) at Tier II, **+2 Defense** scaled
  hide at III, **d8 fangs & claws** (unarmed + Tail Whip) at IV, fire resistance at V, and +1 Draconic-Fire damage
  die at VI. Six fire techniques: *Ember Bolt* (15) · *Draconic Roar* (18, Frighten) · *Fire Breath* (21, 15-ft
  cone) · *Scorching Talons* (24, AGI fire) · *Molten Scales* (27, sustained +WIS Defense + retaliation) ·
  *Inferno* (30, 20-ft firestorm).
- **Strigoi** (hybrid **CON/CHA**) · Kinetic **Blood Rites** · Boost **+2 CHA / +1 CON / +5 Body / +5 Mind** ·
  Signature **Vampiric Form** — a **staged physical transformation** (**long** rest; 1 → 6 uses) where every tier
  **adds** a trait: **×1.5 Defense** (→ ×4), **+1 to all attributes** (→ +5, breaking the cap), **Scratch & Bite**
  bonus attacks (Bite lifesteals), a dual-mod **Blood Weapon** (1d6 → 1d10 + CON + CHA), an on-activation **50% HP
  heal + full limb/chakra recovery**, and finally a **flight speed = your movement**. A benevolent apex vampire that
  hunts the predators (real Romanian folklore, reinterpreted). Six vampiric techniques: *Hemal Bolt* (15) ·
  *Mesmerize* (18, Charm) · *Sanguine Drain* (21, self-heal) · *Mist Form* (24, sustained evasion) · *Nightswarm*
  (27, necrotic AoE) · *Blood Moon* (30, necrotic AoE + heal half). *(The roster is complete.)*

### Fusion Kinetics (HIDDEN — GM knowledge; players discover in play)
> **Not in the Player's Guide.** This is a secret system. The GM knows it; players uncover it as they build.
> Full library (153 fusions × 9 techniques = 1,377): **`FUSIONS.md`**.
- A **Fusion Kinetic** is two standard Kinetics combined into a new domain (e.g. **Nuclekinesis** =
  Robukinesis + Pyrokinesis). With 18 base Kinetics there are **153** of them — the complete set of pairings
  (57 Established / fully-specified in the compendium, 96 Provisional / domain-only concept-pass techniques).
- Fusions **start at tier 2** — their tiers are **Adept · Expert · Master** (no Beginner), **3 per tier = 9**.
- Each fusion technique is a **specific pairing of one technique from each parent at the same tier — Adept and
  above only**: a fusion's **Adept** techniques pair the parents' **Adept** techniques, **Expert** pairs the
  parents' **Expert**, **Master** pairs the parents' **Master**. Parents' **Beginner** techniques never form
  fusions. (E.g. *Kinetic Grip + Blazing Speed → Nuclegrip*.) The compendium reuses four names across two
  pairings each; the app renames one member of each clash to keep unique keys (Hydro+Cryo → **Rimekinesis**,
  Terra+Holy → **Templakinesis**, Holy+Lumo → **Empyreakinesis**, Aero+Natura → **Pollikinesis**).
- **Unlock is automatic and hidden:** the moment a character knows **both** halves of a pair, they gain that
  fusion technique **free — no Technique Points**. Until the first pair lands, the fusion is invisible. On the
  play sheet it then reveals on the **Kinetics** tab (one-time *"✨ Fusion discovered"* toast) and is usable in
  **Combat**. Fusion techniques are **powerful and expensive** (KP = sum of both parent halves).
- A fusion is tied to **both** parents' attributes & chakras. **A damaged parent chakra weakens the fusion:**
  a fusion technique answers to whichever of its two parent chakras is the **more damaged** — it rolls at
  **disadvantage** if either is hit, its modifier takes the **worse** chakra's penalty (halved at 2 hits,
  removed at 3), and it **locks out entirely** if *either* parent chakra reaches 4 hits. (A same-attribute
  fusion like Nuclekinesis just answers to that one chakra.) The play sheet flags a damaged parent chakra on
  the fusion's card. *(Implemented Aug 2026.)*
- Current technique names/effects/costs are a **concept pass** — tune in playtest.

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
**ancestral lineage** — the **historical people your family descends from** (*not* the modern nation-state).
Player characters are **present-day people** of the Post-Veil world; a heritage is the tradition you were
**raised in and carry**, not a claim to *be* those ancestors. (North America means you **descend from the
Native nations of the continental US** — not modern American culture.)

> **Overhaul in progress (Luke & Brittany).** The heritage roster is being rebuilt from scratch toward the
> final design, **built one at a time** (the earlier "9" target is dropped — the roster grows region by region).
> Each region is defined as we go — North
> America excludes Canada and Mexico, which each become their own heritage later. Because a heritage is a
> *people*, its Fighting Style, signature weapon, and traits reflect that people's real historical martial
> tradition. All of it is placeholder for Brittany to finalize.

**Heritage grants — and only grants:**
- **1 Fighting Style** (below), and from it **2 Combat Skills** + the style's **signature Passive**.
- **1 weapon-subtype proficiency** — a **fixed, signature weapon** matching the heritage's flavor (see table
  below). Unlike a background's whole-**type** proficiency, this trains you in **one specific subtype**: you
  add your proficiency bonus to attacks with any weapon of that subtype, even without the parent type's
  proficiency (e.g. North America grants **Shortbows** — you're proficient with Shortbows but not the rest of
  Archery). It also may add nothing new if you're already proficient with the whole parent type.
- **2 Traits** — always-on roleplay/utility perks (advantage on certain checks, an extra language, etc.).
- **1 flaw** — a **narrow, situational** disadvantage on **one specific skill** (never a whole attribute).
  Kept deliberately small so that, whatever Background a player pairs with a Heritage, the flaw can't land on
  the character's primary stat. Backgrounds carry the broad (attribute-wide) flaw; Heritages carry the pinpoint one.

**Choosable proficiency grants.** A trait *may* grant an **extra proficiency the player picks** (the mechanic
is retained for the rebuild even though no current heritage uses one yet):
- **Weapon-proficiency grant** → choose **one extra weapon type**. This is picked on the **Equipment** step,
  and your starting-weapon options then span **every** type you're proficient with (background + bonus).
- **Skill-proficiency grant** → choose **one extra skill** — the Skills step's "choose N" simply increases by 1.
> Because a weapon-proficiency grant changes what gear you can wield, **starting-equipment selection is the
> last step of creation** (after Heritage), so the grant is already chosen when you pick your loadout.

Heritage never touches attribute scores or pools. Two characters of the same Background differ by the
Fighting Style, Combat Skills, and Traits their Heritage opened up.

**The fresh roster (9 built so far; the "9" cap is dropped — the roster grows region by region):**

| Heritage | People / region | Fighting Style | Signature weapon | Armor | Flaw |
|---|---|---|---|---|---|
| **North America** | Descendants of the Native nations of the continental US | Way of the Hunt | **Shortbows** (Archery/STR) | Light only | Etiquette |
| **The Great North** | Descendants of the First Nations & Inuit peoples north of the US border | Way of the Long Winter | **Knives** (Light/AGI) | Light + Medium | Etiquette |
| **Mexico** | Descendants of the Mesoamerican civilizations (Mexica/Aztec, Maya, and kin) | Way of the Obsidian Blade | **Great Swords** (Heavy/STR) — the macuahuitl | Light + Medium | Survival |
| **The Caribbean** | Descendants of the island & coastal seafaring peoples of the Caribbean and Central American coast (Taíno, Kalinago, Arawak, isthmus coastal nations) | Way of the Tides | **Slings** (Archery/STR) | Light only | History |
| **Pacific Islander** | Descendants of the Pacific Islander peoples — Polynesian, Melanesian, Micronesian (Hawaiʻi to Aotearoa) | Way of the War Club | **Maces** (Heavy/STR) — the war club | Light only | Persuasion |
| **The Andes** | Descendants of the Andean peoples (Quechua, Aymara, heirs of the mountain empires) | Way of the Vanguard | **Great Hammers** (Heavy/STR) — the star-mace | Light + Medium | Stealth |
| **The Amazon** | Descendants of the rainforest nations of the Amazon | Way of the Silent Dart | **Blowguns** (Quick/AGI) | Light only | Laborer's Tools |
| **The Franks** | Descendants of the Franks (Francia — cradle of chivalry & the medieval knight) | Way of the Oath | **Great Swords** (Heavy/STR) — the longsword | Light + Medium + **Heavy** | Acrobatics |
| **The Norse** | Descendants of the Norse — the seafaring peoples of the North (longship & saga) | Way of the Raider | **Great Axes** (Heavy/STR) — the Dane axe | Light + Medium | Deception |

*More heritages are in development, built one at a time with Luke.* **Weapon convention (Luke):** every heritage
uses **only existing weapon subtypes** — we do **not** add new ones. Where an iconic weapon has no subtype (the
harpoon, javelin, spear, taiaha), the signature is mapped to the nearest real subtype and the skill flavor is
weapon-agnostic (a "thrown weapon" / "reach strike"). Design intent: five distinct combat poles — mobile ranged
skirmisher (NA), enduring defensive hunter (Great North), aggressive melee striker (Mexico), amphibious raider
(The Caribbean), ferocious brawler (Pacific Islander), disciplined protector/commander (The Andes), lone venom
hunter (The Amazon).
- **Way of the Hunt** (North America) — a pan-Native skirmisher/hunter: Hunter's Aim (called-shot bow), Fade Away
  (hit-and-hide), Volley, Ambush, Harrier's Shot, and the **Pathfinder** passive (ignore natural terrain,
  track/forage advantage, leave no trail). Traits: **One with the Land** and **Keen Senses**. Light armor only.
- **Way of the Long Winter** (The Great North) — the enduring big-game hunter: Tethered Throw (Slow/pull), Brace
  (reduce damage, can't be moved), Take Down (prone/grapple), Second Wind (shake a condition / heal), Killing
  Blow (extra die vs. impaired prey), and the **Winterhardened** passive (cold/ice immunity, resist exhaustion,
  ignore prone/forced-move once per combat). Traits: **People of the Ice** and **Iron Constitution**. Medium
  armor (bone-plate & layered hide). Signature **Knives** (the ulu).
- **Way of the Obsidian Blade** (Mexico) — a pan-Mesoamerican aggressive warrior: Obsidian Strike (Bleed),
  Warrior's Fury (bonus attack on a kill/bloody), Atlatl Dart (ranged), Take Captive (prone/grapple), Sever
  (armor-ignoring), and the **Obsidian Edge** passive (crit on 19–20 + Bleed on crit). Traits: **Keepers of the
  Count** (astronomy/calendar) and **Warrior's Discipline** (resist Fear). Medium armor (ichcahuipilli quilted
  cotton). Signature weapon **Great Swords** (the macuahuitl in flavor). *(Deliberately avoids the human-sacrifice
  stereotype; leans on the real achievements — astronomy, obsidian craft, the atlatl, the warrior orders.)*
- **Way of the Tides** (The Caribbean) — an amphibious hit-and-run raider/controller: Net Cast (Root), Hurl
  (ranged), Slip the Current (water mobility → Hidden), Rip Tide (prone/push), Sling Stone (Dazzle), and the
  **Sea-Born** passive (swim at full speed, hold breath, ignore water/sand/reef terrain, no disadvantage in/under
  water). Traits: **Wayfinder** (navigate/pilot, never lost at sea) and **Storm-Wise** (predict & endure storms,
  sea-legs). Light armor only. Signature **Slings**.
  *Hawaii/Polynesia is intentionally NOT here — it's the Pacific Islander heritage below.*
- **Way of the War Club** (Pacific Islander) — the ferocious close-combat warrior: War Club (rattle), Haka
  (Frighten + Intimidation), Grapple & Wrench (grapple + limb), Felling Blow (prone), Lunge (reach
  push/prone), and the **Unflinching** passive (immune to Frightened; extra die while bloodied). Traits: **Feared
  Warrior** (Intimidation as command) and **Deep-Water Voyager** (open-ocean navigation). Light armor. Signature
  **Maces** = the pan-Pacific **war club** (Fijian/Samoan/Tongan clubs, Māori mere, Hawaiian leiomano). *Aboriginal
  Australia is culturally distinct and reserved as its own future heritage — "Pacific Islander" is the island
  peoples (Polynesia/Melanesia/Micronesia).*
- **Way of the Vanguard** (The Andes) — the disciplined protector/commander (the roster's first support fighter):
  Star-Mace (push + no reactions), Bulwark (interpose for an ally), Rally (buff/cleanse an ally), Hold the Line
  (formation — you & adjacent allies can't be moved/proned), Sling Barrage (huaraca, Slow), and the **Highland-Bred**
  passive (altitude/mountain terrain immunity, resist exhaustion). Traits: **Master Builders** (engineering) and
  **Keeper of the Quipu** (flawless records/logistics). Signature **Great Hammers** (the star-mace/champi);
  Light + Medium armor. Flaw **Stealth** (disciplined ranks, not skulkers).
- **Way of the Silent Dart** (The Amazon) — the lone venom hunter: Poison Dart (Poisoned), Silent Shot (attack
  from Hidden), Curare (Poisoned + Slowed → Stunned if already Poisoned), Weakening Toxin (Weakened), Vanish
  (Hidden + move), and the **Venom-Wise** passive (poison/disease immune; your toxins resisted at disadvantage).
  Traits: **Green Apothecary** (Herbalism/Medicine, brew poison & antidote) and **Unconquered** (resist
  charm/coerce/command). Signature **Blowguns**; Light armor. Flaw **Laborer's Tools** (lived with the forest,
  not by hauling stone). *The Andes and the Amazon are split into two heritages, not one "South America" — two
  civilizations, two poles.*
- **Way of the Oath** (The Franks) — the armored champion/duelist, the roster's **first Heavy-armor** heritage:
  Challenge (mark/duel), Cleaving Blow (carry a kill to the next foe), Riposte (strike a miss), Lance Charge
  (charge + prone), Shield the Fallen (take an ally's hit), and the **Plate-Steel** passive (−2 all damage, can't
  be proned). Traits **Steel Resolve** (resist Fear, Concentration) and **Noble Bearing** (Etiquette/heraldry —
  the Knight *owns* the courtesy others stumble on). Signature **Great Swords** (the longsword); Light+Medium+
  **Heavy** armor. Flaw **Acrobatics** (full plate, no tumbling). *Distinct from the Andes: the Andes protect &
  hold formation; the Franks compel single combat and outlast in plate.* **Europe = the Old World's "advanced"
  continent** — steel plate, and (per Luke) firearms, explosives, channel & ritual weapons are on the table for
  its heritages (never tech/laser/plasma/living). This is the first European heritage; more regions to come
  (Norse, Celts, Hellenes/Romans, a gunpowder tradition, an occult tradition, Slavs, Iberia…).

### Fighting Styles & Combat Skills (the mechanic)
Combat Skills work like Kinetic Techniques: there are **many**, organized into categories called
**Fighting Styles** (the combat-skill equivalent of the Kinetics). Each Fighting Style is **tied to a
people/region** and contains a handful of Action / Bonus Action / Reaction skills **plus one signature Passive
buff** unique to that style (e.g. Way of the Hunt's *Pathfinder* — ignore natural difficult terrain, track and
forage with advantage, and leave no trail).

- **Combat Skills cost no resource** (no KP) — they only consume **action economy**.
- Each skill is one of **Action**, **Bonus Action**, **Reaction**, or **Passive**.
- **Design rule (Luke):** any Combat Skill that adds to / rides onto a base attack (Marksmanship, Power
  Attack, Feint, Quick Draw, Rapid Slash, Precise Thrust, Crescent Strike, Lunge, Stunning Blow, Flourish)
  is a **Bonus Action**, so it layers onto a weapon attack the same turn. Skills that *are* the attack
  (Cleave, Twin Strike, Spinning Cut, Palm Strike…) are **Actions**.
- **Passive buffs** (each style's signature) are always-on; a few are econ-boosters (extra-attack or
  two-weapon passives) whose mechanics are described in text and wired into the tracker later.
- A style's Passive **can be learned by any character** with CSP, regardless of Heritage — as can any other
  style's skills.

### Heritages → Fighting Styles (fresh roster — 8 built; growing region by region)
| Heritage | Fighting Style | Starting Combat Skills | Signature Passive | Traits | Flaw (disadvantage) |
|---|---|---|---|---|---|
| **North America** | Way of the Hunt | Hunter's Aim, Fade Away | Pathfinder | One with the Land, Keen Senses | *Unversed in Old-World Customs* — Etiquette |
| **The Great North** | Way of the Long Winter | Tethered Throw, Brace | Winterhardened | People of the Ice, Iron Constitution | *Plain-Spoken* — Etiquette |
| **Mexico** | Way of the Obsidian Blade | Obsidian Strike, Warrior's Fury | Obsidian Edge | Keepers of the Count, Warrior's Discipline | *City-Raised* — Survival |
| **The Caribbean** | Way of the Tides | Net Cast, Hurl | Sea-Born | Wayfinder, Storm-Wise | *Songs, Not Scrolls* — History |
| **Pacific Islander** | Way of the War Club | War Club, Haka | Unflinching | Feared Warrior, Deep-Water Voyager | *Sooner Cow Than Coax* — Persuasion |
| **The Andes** | Way of the Vanguard | Star-Mace, Bulwark | Highland-Bred | Master Builders, Keeper of the Quipu | *Ranks, Not Shadows* — Stealth |
| **The Amazon** | Way of the Silent Dart | Poison Dart, Silent Shot | Venom-Wise | Green Apothecary, Unconquered | *Light on the Land* — Laborer's Tools |
| **The Franks** | Way of the Oath | Challenge, Cleaving Blow | Plate-Steel | Steel Resolve, Noble Bearing | *Clad in Steel* — Acrobatics |

*More heritages are being built one at a time (see 3b). Each style holds **5 active skills + 1 Passive**. Full
skill text lives in `app/data.js` (`PC.FIGHTING_STYLES`); the app is the source of truth.*

**Heritage & starting gear (CONFIRMED Luke).** A Fighting Style also flavors your **starting-weapon
options**. Each style lists `startWeaponTypes` — weapon types you may **begin play with even if you're not
proficient** (they don't grant proficiency; a background/grant does). So a melee-proficient character with a
ranged Heritage (Way of the Hunt → Archery/Light/Thrown) can start with a bow, picking one that suits their
attributes — or stick to their proficient type. This stacks with (a) the background's weapon proficiency and
(b) any Heritage **bonus proficiency** (a trait that grants a chosen extra type, which **is** proficient).
A two-weapon-fighting Heritage (flagged `twoWeapon`), if one exists in the roster, instead picks **one
two-handed weapon _or_ two one-handed weapons** at creation.

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

### Skill tool kits
Every skill that is about *using gear* has a matching **tool kit** item in the catalog, so the kit and the
skill go together. Each kit lists the skill it aids on the Inventory tab (🛠 *Aids &lt;Skill&gt;*):

| Kit | Skill | Kit | Skill |
|---|---|---|---|
| Toolkit | Laborer's Tools | Linguist's Kit | Language |
| Tinker's Kit | Deft Tools | Herbalism Kit | Herbalism |
| Lockpicks | Sleight of Hand | Naturalist's Kit | Nature Tools |
| Climbing Kit | Athletics | Beast-Handler's Kit | Zoology |
| Survival Kit | Survival | Incense Kit | Paranormal |
| Medkit | Medicine | Binoculars | Awareness |
| Investigator's Kit | Investigation | Disguise Kit | Deception |
| Engineer's Tools | Technology | Musical Instrument | Music / Performance |

Currently the kits are **reference/flavor gear** — they name the tie and set the scene, without a mechanical
bonus (skill proficiency still comes from Background/Heritage). *[Open: whether a kit should later be
**required** for the finest work, or grant advantage on its skill.]*

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
- **Hands — one-handed or two-handed.** Matters for dual-wielding: a two-weapon-fighting passive and its
  combat skills require a **one-handed weapon in each hand**. The app tags each weapon 1H/2H on
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
- **Functioning consumables.** Consumables **actually apply their effect on Use** — the app rolls any dice,
  updates the sheet, and logs the result. Restores are **capped at your maximum**. Current set:

  | Item | Effect on Use |
  |---|---|
  | Bandages | +1d4 HP; revives you to 1 HP if downed |
  | Health Draught / Greater | +2d6 / +4d6 HP |
  | Stimpak | +3d6 HP **and** un-cripples one limb |
  | KP Elixir / Greater | +2d6 / +4d6 KP |
  | Vital Tonic | +2d6 HP **and** +2d6 KP |
  | Chakra Salve | heals 1 hit on every damaged chakra |
  | Panacea | full HP & KP, heals all chakras, un-cripples all limbs |
  | Rez Serum | revives you from downed to 1 HP |
  | Antitoxin / Adrenaline Shot | narrative (GM-adjudicated; logged) |

  Effects are structured data on each item (`effect` in `PC.ITEMS`, e.g. `{ hp: "3d6", uncripple: 1 }`), with a
  name→effect fallback so older saved items still work. Using a consumable does **not** yet spend an action —
  the GM adjudicates timing. Food, water, smoke, and flares are narrative-only.
- **Beginner weapons — the starting-gear shortlist (CONFIRMED).** Common rarity isn't enough on its own: only a
  curated **beginner** subset — **up to two weapons per weapon _subtype_**, the simplest/most iconic of each —
  is offered at character creation. This keeps the creation weapon picker short (a handful per type instead of
  the full Common list) while still covering every subtype. The full catalog remains available in play. The
  beginner list lives in `app/items.js` as **`PC.STARTER_WEAPONS`** (the single source of truth), and the
  creator filters against it. All the *other* starting-gear rules stack on top unchanged — you may still only
  start with a weapon whose **type you're proficient with** (or that your Heritage's Fighting Style opens as
  *start-only*), and two-weapon Heritages still choose **one two-handed or two one-handed** weapons.

### Economy — barter & trade, no universal currency (CONFIRMED Luke)
There is **no universal currency** in Psion Chronicles. The economy is **barter and trade** — goods, salvage,
components, and services exchanged directly by relative value. Some **settlements run their own local currency
and economy** (e.g. a military settlement using **ration tickets** as scrip). Those local currencies are just
**in-game items** that occupy inventory space like anything else — there is no global money stat. *(Not built
yet — recorded so no content, especially heritage traits/flaws, ever assumes a universal currency. The **Barter**
skill covers direct-trade negotiation; it is deliberately **not** used as a heritage flaw, since barter is the
universal exchange.)*

### Crafting & Salvage
**Every item outside Legendary rarity can be crafted** by a character who has the **components** (and, in the
fiction, the relevant skill). Legendary items are found/earned, never crafted. Items break down into — and are
built from — **salvage materials**.

- **14 salvage materials, tiered.** Nine **Basic** (Scrap Metal, Hardwood, Leather, Cloth, Circuitry,
  Chemicals, Focus Crystal, Botanicals, Bone & Sinew) and five **Exotic** (Pristine Alloy, Power Cell,
  Resonant Crystal, Volatile Compound, Ki Core). Exotic materials appear only in **higher-grade** components,
  so better gear is meaningfully harder to make.
- **Components — the mid-tier parts (CONFIRMED Luke).** Weapons and armor are **not** built straight from raw
  salvage; they're assembled from **components** — recognizable parts like **Blade, Barrel, Trigger Assembly,
  Bow Limbs, Emitter Lens, Focus Array, Warhead, Plating, Armor Weave, Straps & Fittings** (16 in all). A
  component:
  - has a **quality grade** — **Crude (Q1) · Standard (Q2) · Fine (Q3) · Masterwork (Q4)**, aligned to rarity
    (Common → Very Rare);
  - is obtained three ways: **crafted from raw salvage** (the materials set the grade — Basic mats make low
    grades, Exotic mats make high grades), **recovered by salvaging** gear, or **found** as loot (they're real
    catalog items);
  - is crafted on the Crafting tab's **⚙ Craft Components** workbench with a skill check (DC by grade).
- **Templates & balance rules (CONFIRMED Luke).** Each weapon subtype and armor class has a **template** that
  encodes the rules: its fixed **attribute**, the **component slots** it needs (a sword → Blade + Haft; a
  rifle → Barrel + Trigger + Stock; heavy armor → Plating + Padding + Straps), a **weight band**, and a
  **damage/DS table by grade** whose top rung (Masterwork) is that subtype's real catalog maximum — a **hard
  cap** nothing can exceed.
- **Higher-grade parts → better gear (CONFIRMED Luke).** An assembled item's **quality is the AVERAGE of its
  components' grades** (rounded down); that quality sets its **rarity** and its **damage/DS** off the template,
  never above the cap. So a Fine blade on a Standard haft yields a Standard weapon.
- **Recipes are derived, not hand-listed.** A weapon/armor recipe is its template's **component slots** at the
  grade matching its rarity; a component's recipe is raw salvage; consumables/tools/misc are raw salvage keyed
  by name. (`PC.itemRecipe(item)` in `app/items.js` is the single source; `null` for Legendary, raw salvage,
  and currency.)
- **Salvaging** breaks **one** unit down: weapons/armor return **some of their components** (the higher-value
  half — edge/core parts first — at the item's grade); components and other items return **raw salvage**
  (Basic ≈ half min 1, Exotic floor half). Teardown is always **lossy** — no infinite loop.
- **Downtime only (CONFIRMED Luke).** Crafting and salvaging are **not** combat actions — they cost **no**
  Action / Bonus Action and are done during the party's **downtime**, never mid-fight.
- **You may only craft recipes you KNOW (CONFIRMED Luke).** Crafting is gated to a **known-recipe** list:
  - **Craft-skill start.** A new character starts knowing every **Common** (or unrated) recipe whose **craft
    skill** they're **proficient** in — a Technologist knows common tech gear, an Herbalist knows common
    salves, and so on. (Rarer gear and out-of-domain items are learned later.)
  - **Salvaging teaches.** Breaking an item down (♻ Salvage) permanently **adds its recipe** to your known
    list — take one apart to learn to make it.
  - **Discovery / GM grant.** A recipe can also be granted directly (a found schematic, a mentor, a GM ruling)
    via the Crafting tab's **📖 Learn a Recipe** browser.
- **Crafting** consumes the recipe from your materials and produces the item. It needs:
  1. **A known recipe** (see above) — the crafting UI only surfaces recipes you know.
  2. **Components** — you must hold every material (the Craft button disables and lists what you're missing).
  3. **A craft skill CHECK (CONFIRMED Luke — a check, *not* a proficiency lock).** Crafting rolls
     **d20 + the craft skill's modifier** (its attribute mod, chakra-adjusted, **+ proficiency if you have
     it**) against a **DC set by rarity**: **Common 10 · Uncommon 13 · Rare 16 · Very Rare 20**. **Anyone may
     attempt** — proficiency and a high attribute just improve the odds; you are never locked out.
     - **Craft skill by item** (from its primary material): **metal → Laborer's Tools · tech → Technology ·
       crystal → Paranormal · chem/plant → Herbalism · wood/hide/cloth → Nature Tools**.
     - **On success:** components are spent and the item is made. **On failure:** the check is logged and you
       **lose half of each component** (rounded up) — a botched craft carries a real cost (CONFIRMED Luke).
  - *(Salvaging needs no check — anyone can break gear down.)*
- **Custom items (CONFIRMED Luke — shipped, component-based).** The Crafting tab's **✎ Create Custom Item**
  builder designs a fully mechanical item **within the balance rules**:
  - **Weapons** cascade **Item Category → Weapon Type → Subtype** (the same taxonomy as `WEAPONS.md` — e.g.
    Heavy Weapons → Great Hammers / Great Swords / Great Axes / Maces / Axes), then a **grade for each component
    slot**. The subtype sets the **base damage die** (its Crude damage); each quality grade steps it **one rung
    up the die ladder** (1d4→1d6→1d8→1d10→1d12→2d6→2d8→2d10→3d6→3d8→4d6), hard-capped. **Armor** cascades
    **Item Category → Armor Type** (Light/Medium/Heavy). The item's **quality = the average of the chosen slot
    grades**, which fixes its **rarity** and its damage/DS. Its recipe is the **exact graded components** you
    chose, so building it consumes those parts. The design is saved as a **known custom recipe** you can craft,
    salvage, equip, and attack with like any catalog item.
  - **Consumables / tools / misc** stay simple (name, rarity, weight, and a heal/effect or aided skill), built
    from raw salvage.
- **Where it lives:** crafting has its own **🔨 Crafting tab** (after Inventory) — raw materials **and
  components** on hand, the **⚙ Craft Components** workbench, known recipes, the Learn browser, and the custom
  builder. Salvaging is still triggered from an item on the Inventory tab. **Known Recipes are grouped by item type** (Weapons / Armor / Consumables / Tools / Misc):
  each type is a collapsible row showing how many recipes you know and how many are craftable now — open one
  to see its recipes. A **"Only show what I can craft now"** switch filters every group to recipes you hold all
  components for, and a search box does a flat find across all types.

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

### Pets & Companions (system in place; bestiary pending)
Players may acquire **pets** — simple NPCs they control during play: **animals** (dogs, cats, hawks, bears…),
**robots**, **small monsters**, **demons**, constructs, spirits, undead, and the like. The **app system is
built and ready**; the official **bestiary of pre-statted creatures is still to be written**, so for now pets
are **added and statted by hand** on the play sheet's **🐾 Pets tab**.
- **Each companion is a mini stat block:** **HP** (current/max, with damage/heal), **Defense Score**, **Speed**,
  an **Initiative modifier**, a list of **attacks** (name · to-hit bonus · damage die · optional note), a list
  of **traits/abilities** (free text), and **notes**. A **kind** (Animal/Robot/Monster/Demon/…) sets a default
  icon.
- **You run them from the tab:** tap-to-roll **initiative**, and per attack a **to-hit** roll (d20 + bonus vs a
  target's Defense Score) and a **damage** roll — all posting to the shared roll log, so a companion acts in
  combat alongside its owner.
- **Open / future:** once the bestiary exists, creatures will drop in pre-statted (rather than hand-entered);
  taming/summoning costs, action-economy for commanding pets, and loyalty are still to be designed.

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
4. *(Resolved)* **Otherkin mechanics** — chosen at 15 (free), grant a boost + a unique Kinetic (6 auto-granted
   techniques) + a rest-gated signature that scales every 3rd level, all governed by the Heart chakra. Kitsune is
   the built example; the other 8 creatures are still to be written (one at a time).
5. **Weapon damage-die table** — each weapon/subtype's die; unarmed (STR) damage die.
6. *(Resolved)* Attack-modifying maneuvers are the **Combat Skills** system (Section 3b), not regular skills.
7. **INT crafting/repair** scaling; **WIS/CHA** any extra mechanics.
8. **Musician's "Rapiers"** vs. CHA weapon types (Finesse/Art/Noise).
9. **Armor** — how worn armor changes Defense Score.
10. **Initiative die** (d20 + AGI mod assumed).
