# Psion Chronicles — Companion App

A digital companion for the **Psion Chronicles** TTRPG (like D&D Beyond, but for your game).
Built with Luke. Everything you'd track on paper — character sheet, HP, KP, chakras, skills,
techniques — lives in the app.

## Saving & versions (Git)
This project is a **Git repository** — every revision is tracked so you can roll back or compare.
- **After making changes**, save a version by committing (ask Claude, or run in the `Luke` folder):
  `git add -A && git commit -m "describe what changed"`
- **See history:** `git log --oneline` · **Compare current changes:** `git diff` · **Roll back a file:**
  `git checkout -- path/to/file`
- Want cloud backup / to share the source? We can push to GitHub later.
- To share a *playable* copy (not for editing), we can also export a single-file build / publish an Artifact.

## How to open it
**Just double-click `app/index.html`** — it opens in your web browser (Chrome, Edge, etc.).
No install, no internet needed. Works on computer and phone.

> **After an update, hard-refresh** (`Ctrl`+`Shift`+`R`) so the browser loads the new code instead of a
> cached copy. The app's scripts are versioned (`?v=…` in index.html) to reduce stale-cache issues — bump
> that number when JS/CSS changes if a hard refresh isn't enough.

> If you ever want to test it on your phone on the same Wi-Fi, run a local server from the `app`
> folder: `python -m http.server 8777` then visit `http://<your-computer-ip>:8777` on your phone.

Your characters are saved **in the browser** (localStorage). They stay on that device.

## What works today
- **Character Creator** — full step-by-step flow:
  1. Identity + Psionic Background (all 9)
  2. **Regional Heritage** — pick 1 of **8 old-world regions** (replaces a race system). Each grants a
     region-tied **Fighting Style** — and from it **2 Combat Skills + the style's signature Passive** — plus
     **2 Traits**. *No* attribute changes. Combat Skills are organized into Fighting Styles the way
     techniques are organized into Kinetics (48 skills across 8 styles); they cost no KP and only use action
     economy (Action / Bonus Action / Reaction / Passive).
  3. Attributes — roll 8d12 (drop 2 lowest, +10) or enter manually, then assign
  4. Skills — background gives 3, choose 2 more
  5. Techniques — background's free one + choose 2 from any school (all 18 Kinetics' **Beginner** techniques
     are in the app — 90 total; higher tiers arrive with the level-up system)
  6. Review & Save — full computed sheet + your **Heritage** (Combat Skills w/ action tags + Traits) +
     **starting equipment**: each background lists its gear right on its selection card, and you **choose
     your loadout** (a proficient weapon + armor/other options) which auto-populates the new character's
     inventory, pre-equipped and ready to roll
- Auto-calculates HP, KP, all 6 chakras, Defense Score, speeds, carry weight, modifiers, proficiency
- **Roster** — saved characters on the home screen; **Edit**, Play, and delete
  - **Edit** reopens a character in the creator with everything prefilled; change anything (name, stats,
    background, skills, techniques) and Update saves it in place — your live play session (current HP/KP,
    chakra hits) is kept and auto-adjusted if the maximums changed
  - **⭐ Level Up** opens a dedicated screen: tap **Level Up** (GM-driven; cap 30) to earn **+1 Technique
    Point** each level, **+1 attribute point** on odd levels, and **+1 Combat Skill Point every 5th level**
    (5/10/15/20/25/30). Spend attribute points (cap 30) and Technique Points to learn new techniques. All
    **360 techniques** (18 Kinetics × 4 tiers) are in the app, gated two ways: by **Soul Level** (Adept @8,
    Expert @15, Master @22) **and** by requiring **≥3 techniques from that Kinetic's previous tier** to
    unlock its next tier. Spend **Combat Skill Points** to learn more **Combat Skills** from **any Fighting
    Style** (grouped by style, your own first; a style's signature Passive is learnable too). Your Heritage's
    2 starters + its style Passive are free and permanent. Proficiency and pools update automatically;
    Otherkin unlocks at 15.

- **Live Play Sheet** (▶ Play on a character) — the at-the-table screen, organized into tabs so there's
  little scrolling: **Sheet · ⚔ Combat · Limbs · Kinetics · Skills · Inventory**.
  - **Limbs tab** — Fallout-style called-shot damage: 6 limbs each with their own HP (Head ¼, Torso ½,
    Arms/Legs ¼ of max HP). A called shot damages the limb and HP, capped at the limb's HP (excess lost);
    at 0 the limb is crippled. Crippled effects auto-apply — legs cut movement, a crippled arm gives
    weapon-attack disadvantage (both block attacks), a crippled head gives disadvantage on technique attacks
    & Mind checks. Long rest fully heals limbs; short rest restores half.
  - **⚔ Combat tab** — everything you can do this turn, grouped by action economy: **Actions** (equipped-weapon
    attack/damage/augments, a universal **👊 Unarmed Strike** — d20+STR+prof to hit, 1d4+STR damage — and
    Action techniques), **Bonus Actions**, **Reactions** (a universal **↩ Opportunity Attack** — one melee
    attack with any melee weapon or unarmed when an enemy enters/leaves your reach, once between turns — plus
    Reaction techniques), and **Full-Turn & Other** — plus a **🎖 Combat Skills** panel (titled with your
    Fighting Style) listing your granted + learned Combat Skills grouped by action type, each tagged with its
    origin style, a compact HP/KP/Defense/Turn strip, Roll Initiative, End Turn, active effects, and the log.
  - **Action economy enforced** — one Move / Action / Bonus Action per turn (Reaction once between turns). Spending
    a slot disables all other options of that type until **End Turn**; a "This Turn" tracker shows what's used
    (tap to toggle manually for feats/abilities that grant extras).
  - **Kinetics tab** — all known techniques with their Use/Attack/Activate buttons.
  - **Skills tab** — all 36 skills, tap to roll.
  - **Inventory tab** — carry weight, carried items (equip, actions, config), a custom-item form, and a
    **🔍 Browse Item Catalog** button that opens a dedicated **catalog screen**: search/filter the 220+
    item catalog (weapons, armor, consumables, tools, gear) and Add any of them (weapons arrive attack-ready
    with type + damage die). A **← Inventory** button returns.
  - **Sheet tab** — the core overview:
  - HP & KP bars with damage/heal/spend controls (quick ±1/±5 or type an amount)
  - **Interactive Chakra Chart** — click pips to add hits; penalties auto-apply to that attribute's
    modifier (disadvantage → half → zero → locked out) and everything that uses it
  - **Attributes** show live, chakra-adjusted modifiers, with active buffs highlighted
  - **Techniques** — behave by type:
    - **Ranged single-target** (Ki Bolt, Ki Blast) → **⚔ Attack** rolls d20 + attribute mod + proficiency
      to hit (spends KP), then **🎲 Damage** rolls damage on a hit (no extra KP)
    - **AoE** (Ki Volley) → auto-hits everything in the area; one button rolls damage per target
    - **Sustained** (Ki Shield → +DS, Ki Flame → attribute buff) → Activate/End; **End Turn** pays upkeep
    - **Heal / grant** (Focus Ki, Share Ki) → Use
  - **Skills** — tap any skill to roll a d20 check (adds mod + proficiency, rolls disadvantage if the
    chakra is hit, disabled if locked out)
  - **Short / Long Rest** — heals chakras per the rules (long rest also restores HP/KP fully)
  - **Inventory & Carry Weight** — add items (name, category, weight, quantity); tracks total weight vs.
    your capacity (100 lb + 10 × CON mod) with an over-encumbered warning; quantity steppers & delete
  - **Equip / Unequip + item actions** — tap an item to expand it:
    - **Weapons** — set a weapon type (sets the governing attribute) + damage die, then **⚔ Attack**
      (d20 + attr mod + proficiency, disadvantage/lockout from chakra applies) and **🎲 Damage** (die + attr mod)
    - **Armor** — set a Defense Score bonus; **equipping** it adds that bonus to your DS live
    - **Consumables** — **Use** decrements the quantity (auto-removes at 0)
    - **Melee augments** (e.g. Ki Strike) — on a melee weapon, a **+Ki Strike (3 KP)** button rolls the
      weapon's damage *and* the augment's dice together as one total and spends the KP. Augment techniques
      aren't used standalone; they only appear on equipped melee weapons.
  - **Dice roller** + rolling **log** of every action, saved with the character
  - **Roll result popup** — any roll (attack, skill check, technique damage, initiative, raw dice) flashes a
    big result banner on screen so you never have to scroll to the log; tap or wait to dismiss

## What's next (ideas)
- **Level up** — spend Technique Points, add attribute points on odd levels, Otherkin at 15
- **Compendium** — browse all backgrounds, kinetics, skills, weapons, techniques
- **Inventory & weapons** — carry weight, equipped weapons with attack + damage rolls
- **Export/import** characters (share with your table), or cloud sync + accounts later
- **Add-a-technique form** so Luke can enter new techniques as they're designed

## Project structure
```
Luke/
├── README.md              ← this file
├── GAME_RULES.md          ← the full rules (source of truth for the app)
├── TECHNIQUES.md          ← the Kinetic Technique library (grows over time)
├── app/
│   ├── index.html         ← open this
│   ├── styles.css         ← Post-Veil dark theme
│   ├── data.js            ← all game data (backgrounds, kinetics, skills, weapons, techniques)
│   ├── rules.js           ← calculation engine (modifiers, pools, derived stats, chakra effects)
│   └── app.js             ← the app (creator flow, roster, storage)
└── _source_*.txt          ← raw text extracted from Luke's original PDFs (reference)
```

## Editing the game
- **Add/change a technique** → edit `app/data.js` (`PC.TECHNIQUES`) and `TECHNIQUES.md`.
- **Change a rule/number** → `app/rules.js` (calculations) or `app/data.js` (`PC.RULES`, backgrounds).
- Keep `GAME_RULES.md` / `TECHNIQUES.md` in sync — they're the human-readable source of truth.
