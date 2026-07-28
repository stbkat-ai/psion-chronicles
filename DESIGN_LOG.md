# Psion Chronicles — Design Log

Plain-English record of the design decisions behind the companion app, and *why* each one was
made. The rules themselves live in `GAME_RULES.md`; the code is under `app/`. This file is the
"why" — the reasoning and the choices made along the way — so the intent isn't lost.

> Companion app for **Psion Chronicles**, a homebrew TTRPG (built with Luke). Vanilla JS, no build
> step; runs from a single HTML file or any static host. Characters save to the browser's
> localStorage (per-device).

---

## How the pieces fit (one look)
- `app/data.js` — all game data on `window.PC` (backgrounds, heritages, kinetics, skills, weapon
  types, 360 techniques, fighting styles/combat skills, flaws).
- `app/items.js` — the ~194-item weapon/gear catalog.
- `app/rules.js` — pure math: modifiers, pools, derived stats, chakra effects, proficiency.
- `app/app.js` — character creator, roster, level-up screen (`window.PsionApp`).
- `app/play.js` — the live play sheet (`window.PsionPlay`): Sheet · Combat · Limbs · Kinetics ·
  Skills · Traits · Inventory.
- `app/styles.css` — the "Post-Veil" dark theme.

---

## Decision log (in the order we built things)

### 1. Chakra lockout now covers techniques and weapon attacks
**Decision.** When an attribute's chakra reaches 4 hits (locked out), it disables not just that
attribute's *skills* but also its *Kinetic techniques* and *weapon attacks*.
**Why.** A full lockout was only greying out skills; techniques and attacks tied to that attribute
were still usable, which contradicted the "locked out" idea.
**How.** The lockout applies immediately, on the next roll, and is scoped to the affected attribute
only (other attributes stay usable). Locked buttons are disabled with a reason tooltip.

### 2. Marksmanship = a called-shot bonus action
**Decision.** After a ranged attack (weapon **or** technique), before rolling damage, you may spend
your **Bonus Action** to aim a called shot at a limb. Roll a skill check; the GM sets the DC by the
target's size/difficulty. On a success, the attack's damage lands on the chosen limb.
**Choice made.** The check modifier = **the attack's attribute + proficiency** (not a fixed stat),
so a rifle shot uses the weapon's attribute and a Kinetic bolt uses the technique's attribute.
**How.** Because the app can't know which attack you just made, the card gives a source picker
(your equipped weapons + your single-target attack techniques); it spends only the Bonus slot.

### 3. Heritage widens your starting-gear options
**Decision.** Your Regional Heritage's Fighting Style flavors what you can **start** with, on top of
your background's weapon proficiency.
**Choices made.**
- Heritage-opened weapons are **start-only, NOT proficient** (you begin with them, but without the
  proficiency bonus — that's a "solve later" gap we accepted for now).
- A **ranged-focused** heritage opens **all** ranged weapon types as starting options (pick one that
  complements your attributes, or not — your call).
- A **two-weapon-fighting** heritage (Oceania's *Twin Fang*) offers a choice: **one two-handed weapon
  OR two one-handed weapons**.
- The weapon-focus map is defined for **all 8** fighting styles.
**Why equipment is the last creation step.** So Heritage (and any bonus proficiency it grants) is
already chosen when the gear options are built.

### 4. Soul Pool on the character sheet
**Decision.** The Sheet tab shows a **Soul Pool** alongside HP (Body) and KP (Mind): your Soul Level
and XP, with a **Level Up** button right beneath it.
**Why it's a tracker, not a progress bar.** Leveling is **GM-driven** and the XP-per-level thresholds
are still being tuned, so we deliberately avoided a fake "progress to next level" bar. It's an
editable XP + level display instead — no invented numbers. (Easy to turn into a real XP-to-next bar
once thresholds are set.)

### 5. Kinetics chosen via tabs, ordered by relevance
**Decision.** On both character creation and level-up, the 18 Kinetics are **tabs** — tap one to see
just that school's techniques, instead of scrolling one long wall.
**Ordering (matches how Combat Skills surface your Fighting Style first):**
1. your **proficient focus** Kinetic first (★),
2. then any Kinetic you already **have techniques in** (✦),
3. then the rest **in attribute order** (STR → AGI → CON → INT → WIS → CHA).

### 6. Negative traits (flaws) — one per background, one per heritage
**Decision.** Every background and every heritage carries a flaw, so no choice is all-upside. Flaws
are "flavor with a light bite," never build-breaking.
**Background flaws = whole-attribute.** Disadvantage on one attribute's skill checks and Kinetic
technique attacks — always a stat the archetype *doesn't* lean on (e.g. Body Builder → INT). Flaws do
**not** touch weapon attacks or initiative.
**Heritage flaws = narrow / situational.** Disadvantage on **one specific skill** (e.g. North America →
Etiquette).
**Why the two are different — the key balance call.** Heritage is chosen independently of background.
If heritage flaws were also whole-attribute, many background+heritage combos would drop the flaw onto
the character's **primary** stat and feel punishing. Keeping heritage flaws to a single narrow skill
guarantees no combination can gut a build. (We considered whole-attribute and purely-roleplay options
and deliberately chose narrow/situational.)
**How.** Skills under a flaw are tagged ⚠ on the Skills tab; both flaws and the heritage's positive
traits are collected on a dedicated **Traits** tab; they apply automatically on the relevant rolls.

### 7. Kinetic proficiency & expertise by completing tiers
**Decision.** Master a Kinetic and it rewards you:
- Learn **every** technique in a Kinetic's **Adept** tier (all 5) → **auto-gain proficiency** in that
  Kinetic (matters for Kinetics outside your background focus, which is proficient from the start).
- Learn **every** technique in its **Expert** tier (all 5) → **auto-gain expertise** = **double** your
  proficiency bonus on that Kinetic's technique attack rolls.
**Choice made.** Expertise applies to **all** of that Kinetic's technique attacks, not just the
higher-tier ones (so a completed lower-tier attack benefits too).
**How.** It's derived automatically from the techniques you know — no separate bookkeeping. Status and
progress show on the play sheet's **Kinetics** tab, and the level-up screen toasts the moment you
cross a threshold.

### 8. Saving & access — private Artifact + local git
**Decision.** The app is packaged into a single self-contained HTML file (`build_bundle.py` →
`dist/psion_chronicles.html`) and published as a **private Claude Artifact**, so it opens on any device
signed into the same Claude account. The full source + history stays in **git on the PC** as the
durable record.
**Known limitation — data doesn't sync.** Characters live in each device's own browser storage, so a
character made on the PC won't appear on the phone (and vice-versa). Real cross-device sync (a small
backend + login) is a **deferred, future feature** — noted, not yet built.

---

## Deferred / future ideas
- **Cross-device character sync** (backend + simple login) — the big one.
- **Export / Import** characters to a JSON file (a simpler manual bridge / backup) if we want it before
  full sync.
- Heritage-opened starting weapons granting **actual proficiency** (currently start-only).
- A real **XP-to-next-level** bar once Luke sets the thresholds.
- Off-PC backup of the **source** (e.g. a private GitHub repo) — belt-and-suspenders for the code.

---

*This log is maintained by hand as decisions are made. When a feature's behavior changes, update the
relevant entry here and the matching section of `GAME_RULES.md`.*
