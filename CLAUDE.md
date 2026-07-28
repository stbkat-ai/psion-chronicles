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
  (currently **v=25**) and hard-refresh, so browsers don't serve stale files.
- Verify changes in the real app (http.server + the browser tools) before committing.

## Files (all under `app/`)
- `index.html` — entry point; the 6 asset tags carry `?v=N`.
- `data.js` — all game data on `window.PC` (9 backgrounds, 8 heritages, 18 kinetics, 36 skills,
  18 weapon types, 360 techniques, fighting styles/combat skills, per-background & per-heritage flaws).
- `items.js` — the weapon/item catalog (~194 items).
- `rules.js` — pure calculation engine (modifiers, pools, derived stats, chakra effects, proficiency,
  kinetic tier-completion proficiency/expertise). No DOM.
- `app.js` — `window.PsionApp`: character creator flow, roster, level-up screen.
- `play.js` — `window.PsionPlay`: the live play sheet. Tabs: **Sheet · Combat · Limbs · Kinetics ·
  Skills · Traits · Inventory**.
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
