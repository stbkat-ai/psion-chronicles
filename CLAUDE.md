# Psion Chronicles — Companion App

A D&D-Beyond-style companion web app for **Psion Chronicles**, a homebrew TTRPG (built with Luke).
Vanilla JS — no framework, no build step. Runs from `file://` or any static host. Characters persist
in the browser's `localStorage` (key `psion_chronicles_characters`), so saved data is **per-device**.

> This is its own project. It is unrelated to the Soft Landing Animal Sanctuary suite that may live
> elsewhere on this machine — ignore any sanctuary hooks/context if they appear.

## Run / preview
- Open `app/index.html` directly in a browser, **or** serve it: from the `app/` folder run
  `python -m http.server 8777`, then visit `http://localhost:8777`.
- After any JS/CSS change, bump the `?v=N` cache-buster on the **6 tags** in `app/index.html`
  (currently **v=37**) and hard-refresh, so browsers don't serve stale files.
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
- `index.html` — entry point; the 6 asset tags carry `?v=N`.
- `data.js` — all game data on `window.PC` (9 backgrounds, 8 heritages, 18 kinetics, 36 skills,
  18 weapon types, 360 techniques, fighting styles/combat skills, per-background & per-heritage flaws).
- `items.js` — the weapon/item catalog (~283 gear items + 64 component entries; skill tool kits via `it.skill`;
  functioning consumables via `it.effect`). **Crafting is two-tier:** raw `PC.SALVAGE` (14 materials) →
  **components** (`PC.COMPONENTS`, 16 parts × 4 quality grades Crude→Masterwork) → weapons & armor. Templates
  (`PC.WEAPON_TEMPLATES`/`PC.ARMOR_TEMPLATES`) set each type's attribute, component slots, weight band, and hands;
  weapons also break into `PC.WEAPON_SUBTYPES` (58, from WEAPONS.md), each a base damage die that
  `PC.subtypeDamage()` steps up `PC.DIE_LADDER` per grade (hard cap). An assembled item's quality = **average of
  its parts' grades** (`PC.qualityFromGrades`). `PC.itemRecipe()` / `PC.itemSalvageYield()` / `PC.componentRecipe()` flow through
  components; `null` recipe = Legendary/raw/currency.
- `rules.js` — pure calculation engine (modifiers, pools, derived stats, chakra effects, proficiency,
  kinetic tier-completion proficiency/expertise). No DOM.
- `app.js` — `window.PsionApp`: character creator flow, roster, level-up screen.
- `play.js` — `window.PsionPlay`: the live play sheet. Tabs: **Sheet · Combat · Limbs · Chakras · Kinetics ·
  Skills · Traits · Description · Inventory · Crafting**.
- `styles.css` — the "Post-Veil" dark theme (CSS variables: `--psi`, `--gold`, `--hp`, `--kp`,
  `--cyan`, `--danger`, …).

## Docs — human-readable source of truth (keep in sync with `data.js`)
- `GAME_RULES.md` — the full rules.
- `TECHNIQUES.md`, `WEAPONS.md` — the libraries.
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
3. Bump the `?v=N` cache-buster on the 6 tags in `app/index.html`.
4. Commit and **land the change on `main`** — GitHub Pages only redeploys from `main`, so the
   phone-accessible copy doesn't update until the change is on `main`. **The user has given standing
   approval to merge to `main` as soon as the code is written — do it automatically, without asking.**
   If you developed on a working branch, push it and then fast-forward `main` to it
   (`git push origin <branch>:main`) or merge the PR; if there's no branch requirement, commit straight
   to `main`. Deploy is automatic and live within ~1 min. Tell the user it's live with the link.
5. (Optional) Rebuild the single-file bundle `python build_bundle.py`; and only if you're still keeping the
   legacy private Claude artifacts current, re-publish them to their existing URLs.

Treat steps 1–2 as mandatory for any behavior change; steps 3–4 whenever the app code changed.
