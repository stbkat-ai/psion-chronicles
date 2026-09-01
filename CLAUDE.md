# Psion Chronicles — Companion App

A D&D-Beyond-style companion web app for **Psion Chronicles**, a homebrew TTRPG (built with Luke).
Vanilla JS — no framework, no build step. Runs from `file://` or any static host. Characters persist
in the browser's `localStorage` (key `psion_chronicles_characters`), so saved data is **per-device**.

> This is its own project. It is unrelated to the Soft Landing Animal Sanctuary suite that may live
> elsewhere on this machine — ignore any sanctuary hooks/context if they appear.

## Run / preview
- Open `app/index.html` directly in a browser, **or** serve it: from the `app/` folder run
  `python -m http.server 8777`, then visit `http://localhost:8777`.
- After any JS/CSS change, bump the `?v=N` cache-buster on the **8 tags** in `app/index.html`
  (styles.css + data/items/rules/codex/gm/app/play.js) and hard-refresh, so browsers don't serve stale files.
- Verify changes in the real app (http.server + the browser tools) before committing.

## Hosting & access
- **Live app (public, no login):** https://stbkat-ai.github.io/psion-chronicles/ (redirects to `app/`).
- **GitHub repo (source + off-machine backup):** https://github.com/stbkat-ai/psion-chronicles — branch
  `main`, public, MIT-licensed. **A `git push` auto-deploys GitHub Pages** (live within ~1 min).
- **Local working copy:** `C:\Claude\PsionChronicles` — its `origin` remote has the push token embedded,
  so `git push` needs no prompt. (The older `C:\Claude\Luke` copy is a pre-migration backup; work here now.)
- Characters save to each device's `localStorage` (per-device; no cross-device sync yet — see
  `DESIGN_LOG.md` → "Deferred / future ideas").
- Legacy: two private Claude artifacts (App / Design Log) also exist but are locked to one Claude account
  and proved hard to open across devices — GitHub Pages is now the canonical, login-free access path.

## Files (all under `app/`)
- `index.html` — entry point; the 7 asset tags carry `?v=N`.
- `data.js` — all game data on `window.PC` (9 backgrounds, 16 heritages, 18 kinetics, 36 skills,
  18 weapon types, 216 techniques (18 Kinetics × 4 tiers × 3), fighting styles/combat skills, per-background & per-heritage flaws).
  Also `PC.FUSIONS` (153 **Fusion Kinetics** — every pair of the 18 base Kinetics; hidden until unlocked) + `PC.FUSION_TECHNIQUES` (1377 = 153 × 3 tiers × 3);
  a fusion technique is a **pair of parent techniques** (offset a tier up), auto-granted free when both halves are known.
- `items.js` — the weapon/item catalog (~394 gear items + 64 component entries; skill tool kits via `it.skill`;
  functioning consumables via `it.effect`). **Junk** is `category: "Junk"` (via `J(name, weight, note, salvage[],
  currency?)`, 18 salvage-only oddments; a few flagged `currency` as barter scrip) — not craftable, salvages into
  its listed materials; ingredient-style adds (salvage/components/junk) merge into one stack so a GM can hand out
  loot cleanly. **Armor is slot-based:** each piece carries a `coverage` (`"full"` =
  whole-body → the **Torso** paper-doll slot, or a single apparel slot `head`/`back`/`arms`/`legs`/`feet`); the
  `A()` factory makes body armor, `AP(name, slot, …)` makes per-slot apparel (hats, cloaks, gloves, greaves,
  boots). **Shields** are their own `category: "Shield"` (23 of them via `S(name, subtype, …)`; held one-handed, +DS + Block reaction; craftable like armor — Plating + Straps, +Padding for big ones). **Ammunition**
  is `category: "Ammo"` (via `AM(name, feeds, …)`, 12 stacks covering every ranged mechanism); **thrown** weapons
  carry a `thrown` flag (their own ammo — light, recovered after a throw). **Crafting is two-tier:** raw
  `PC.SALVAGE` (14 materials) →
  **components** (`PC.COMPONENTS`, 16 parts × 4 quality grades Crude→Masterwork) → weapons & armor. Templates
  (`PC.WEAPON_TEMPLATES`/`PC.ARMOR_TEMPLATES`) set each type's attribute, component slots, weight band, and hands;
  weapons also break into `PC.WEAPON_SUBTYPES` (58, from WEAPONS.md), each a base damage die that
  `PC.subtypeDamage()` steps up `PC.DIE_LADDER` per grade (hard cap). An assembled item's quality = **average of
  its parts' grades** (`PC.qualityFromGrades`). `PC.itemRecipe()` / `PC.itemSalvageYield()` / `PC.componentRecipe()` flow through
  components; `null` recipe = Legendary/raw/currency.
- `rules.js` — pure calculation engine (modifiers, pools, derived stats, chakra effects, proficiency,
  kinetic tier-completion proficiency/expertise). No DOM. **All rolls funnel through `PC.rollCheck` /
  `PC.rollDiceExpr`**, which honor a **manual-dice** hook (`PC.manualDice` + `PC.manualProvider`, set by app.js) —
  one switch makes every roll in the app hand-entered, for physical-dice tables.
- `app.js` — `window.PsionApp`: the app shell (Home screen + three-section router: Player / GM / Codex),
  character creator flow, roster, level-up screen.
- `codex.js` — `window.PsionCodex`: the **Codex** section (searchable reference). **Pure UI over `window.PC`** —
  it stores no content of its own, so item/technique/rule edits in data.js/items.js appear here automatically
  (counts included). A data-driven `SECTIONS` array; adding a NEW kind of content = one new SECTIONS entry.
- `gm.js` — `window.PsionGM`: the **GM** section (Campaign & Session Manager). Local-first (own localStorage key
  `psion_chronicles_campaigns`); each campaign has a **party** of player characters (referenced by id from the
  `PsionApp` roster; a card shows Soul Level + HP/KP + XP progress and opens the live sheet via `PsionApp.openPlay`;
  the GM can **award XP** to one character or the whole party — writing `rec.xp` back through `PsionApp.saveRoster`
  — and hand out **loot** from a menu: a **Loot** tab browses the `PC.ITEMS` catalog and drops a chosen item into a
  recipient's `rec.inventory` (merging like stacks, exactly as the play sheet does), plus custom note-only loot),
  a premise + GM notes, a dated **session log**, an **NPC roster** (with optional Bestiary stat-block links via
  `PC.bestiary`), an **Encounters** tab (`campaign.encounters[]`) that builds fights from `PC.BESTIARY` with a
  live, tunable **difficulty** readout weighed against the party's Soul Levels, and a **Combat** tracker
  (`campaign.combat`, one active per campaign) that runs a fight — party + encounter monsters/NPCs/custom
  combatants, **rolled initiative** order, round/turn advance, per-combatant **HP** and **conditions**
  (`PC.CONDITIONS`, as `{key,turns}` with end-of-turn ticking), tap-to-roll monster/NPC **attacks**, and a combat
  log. **PC combatants are live proxies over their `rec.play`** — HP and conditions read/write straight through to
  the character (via `PsionApp.saveRoster`), so combat changes show on the player's own sheet; monsters keep
  tracker-local HP/conditions. gm.js also exposes `campaignsForCharacter(id)` (so the play sheet can show an
  "in campaign" badge) and `postRoll(id, text, total)` (the play sheet mirrors every roll into each of the
  character's campaigns' `rollFeed`, shown on the GM Combat screen — a **Player rolls** panel). Note: gm.js loads
  **before** app.js, so it resolves `window.PsionApp` lazily, never at load.
  Networked/shared player-join (online play) is the next phase — it's what makes the player↔GM feed live across
  devices; on one device it works today.
- `play.js` — `window.PsionPlay`: the live play sheet. Tabs: **Sheet · Combat · Limbs · Chakras · Kinetics ·
  Skills · Traits · Description · Inventory · Crafting · Pets · Otherkin**.
- `styles.css` — the "Post-Veil" dark theme (CSS variables: `--psi`, `--gold`, `--hp`, `--kp`,
  `--cyan`, `--danger`, …).

## Docs — human-readable source of truth (keep in sync with `data.js`)
- `GAME_RULES.md` — the full rules.
- `TECHNIQUES.md`, `WEAPONS.md` — the libraries.
- `FUSIONS.md` — the **Fusion Kinetics** library. (Originally a GM-only "discover in play" system; as of the
  Codex build Luke chose to surface fusions in the public **Codex**, so they're no longer hidden there. Still
  not taught as a mechanic in the README player-guide beyond listing them as a Codex category.)
- `README.md` — the player-facing guide.

## Conventions
- DOM helper: `el(tag, cls, html)` (creates element; `cls`→className, `html`→innerHTML when non-null).
- Git branch is `main`; end commit messages with the `Co-Authored-By: Claude …` trailer.
- **Never** `git add -A`: the untracked `Jobs/` folder is unrelated personal files and must stay out of
  commits. Stage `app/…` and the docs explicitly.

## STANDING RULE — keep docs & artifacts in sync (do this WITHOUT being asked)
The user has instructed that whenever a feature is added or its behavior changes, the record must be
updated as part of the **same** change — never left for later. On every such change:
1. **`DESIGN_LOG.md`** — add or revise the decision entry: what changed, **why**, and any choices the
   user made. This is the plain-English "why" record.
2. **`GAME_RULES.md`** (and **`README.md`** if it's player-facing) — update the matching section so the
   rules stay accurate.
3. Bump the `?v=N` cache-buster on the 8 tags in `app/index.html`.
   **Codex sync (`app/codex.js`).** The Codex reads live from `window.PC`, so editing an existing
   item/technique/rule in `data.js`/`items.js` needs **no** Codex change — it shows up automatically, counts
   included. You MUST touch `codex.js` only when: (a) you add a **new kind of content** (a new `PC.*` collection
   or a category the Codex doesn't list yet) → add a `SECTIONS` entry; (b) you **rename/restructure a field** a
   `detail()` renderer reads (e.g. change how a technique stores damage) → update that renderer; or (c) you
   change a value that a Codex **Reference** card states (most are engine-derived now, but double-check). When in
   doubt, open the Codex and confirm the changed content shows correctly before committing.
4. Commit and **land the change on `main`** — GitHub Pages only redeploys from `main`, so the
   phone-accessible copy doesn't update until the change is on `main`. **The user has given standing
   approval to merge to `main` as soon as the code is written — do it automatically, without asking.**
   If you developed on a working branch, push it and then fast-forward `main` to it
   (`git push origin <branch>:main`) or merge the PR; if there's no branch requirement, commit straight
   to `main`. Deploy is automatic and live within ~1 min. Tell the user it's live with the link.
5. (Optional) Rebuild the single-file bundle `python build_bundle.py`; and only if you're still keeping the
   legacy private Claude artifacts current, re-publish them to their existing URLs.

Treat steps 1–2 as mandatory for any behavior change; steps 3–4 whenever the app code changed.
