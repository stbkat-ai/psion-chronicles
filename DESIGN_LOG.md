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
  Skills · Traits · Description · Inventory.
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

### 8. Saving & access — GitHub Pages (public), with git as the backup
**Decision.** The project lives in a public GitHub repo — **`stbkat-ai/psion-chronicles`** — and is served
live via **GitHub Pages** at **https://stbkat-ai.github.io/psion-chronicles/**. A `git push` auto-deploys.
**Why we moved here.** We first published the app + this log as **private Claude Artifacts**. They worked,
but a private artifact is locked to the exact Claude account that created it (here the sanctuary's
`tracy@` Teams account). On other devices the browser/app defaulted to a *different* account, so the links
404'd and the phone couldn't open them — and the Claude phone *app* has no artifact gallery at all. A plain
**public URL needs no login and works in any browser on any device**, which is what "open it on my phone"
actually requires. The homebrew game content isn't sensitive, so public is an easy trade. The private
artifacts still exist as a legacy copy; GitHub Pages is the canonical front door.
**Backup.** The full source **and 26+ commits of history** now live on GitHub (off-machine), not just on
the one PC. `build_bundle.py` still produces a single-file build for anyone who wants to drop it on another
host.
**Known limitation — data doesn't sync.** Characters live in each device's own browser storage, so a
character made on the PC won't appear on the phone (and vice-versa). Real cross-device sync (a small
backend + login) is a **deferred, future feature** — noted, not yet built.

### 9. Character Description — appearance / basic info (flavor)
**Decision.** Added a **Description** step to the character creator (placed right before Review) and a
matching **Description** tab on the play sheet (between Traits and Inventory). It captures purely
descriptive details — **Basics** (age, gender, pronouns), **Physical appearance** (height, weight, skin
tone, hair colour, hair style, eye colour), and a free-text **Distinguishing features** box (tattoos,
piercings, scars, etc.). Everything the player enters at creation shows up on the play sheet's Description
tab, where it's also editable at the table (fields save on blur, like Inventory item fields).
**Why.** Players wanted a home for who their character *is* beyond the numbers, so the table can picture
them. It's flavor only — **no rules effect** — so it never gates the mechanical creation flow: the step
sits at the end and every field is optional (Next is always enabled). We put it before Review so the
finished sheet summarises it, and gave it its own play tab (rather than burying it in Notes) so it reads
like a reference card.
**How it's wired.** The field schema is defined **once** in `app.js` (`DESCRIPTION_GROUPS` +
`DESCRIPTION_MISC`) and exposed on `window.PsionApp` so `play.js` renders the exact same fields — one
source of truth, no drift. `defaultDescription()` seeds new characters; existing characters are backfilled
with blank fields on edit (`app.js`) and on open (`ensurePlay` in `play.js`), so nothing breaks for
characters made before this existed. User-entered text is HTML-escaped in the Review summary.

### 10. Beginner weapons — trim the starting-gear picker
**Decision.** Starting gear no longer offers **every** Common weapon of an offered type. Instead there's a
curated **beginner** shortlist — **up to two weapons per weapon _subtype_** (the simplest/most iconic of each) —
and only those are selectable at character creation. The list lives in `app/items.js` as `PC.STARTER_WEAPONS`
(a plain, commented array of names — the single source of truth), and `eligibleStartWeapons()` in `app.js`
filters against it.
**Why.** The Common list had grown large (e.g. 15 Heavy Weapons), so the creator's starting-weapon dropdown was
a wall of near-identical options. Two per subtype keeps it short while still representing every subtype, so no
playstyle loses its flavor. We kept it a **separate list** (the user's call) so the whole starting roster can be
seen and tuned in one place, and picked **two** per subtype (not one) so there's still a little choice.
**What did NOT change.** This is one new filter layered on top — **every other starting-gear rule is intact**:
you still may only start with a weapon whose **type you're proficient with** (or one your Heritage's Fighting
Style opens as *start-only*, tagged "not proficient"), bonus weapon-proficiency grants still widen the options,
and two-weapon Heritages still choose one 2H or two 1H weapons. The full catalog is still available in play; only
*creation* is restricted. A safety fallback keeps the old all-Common behavior if the list is ever missing, so the
picker can't end up empty.

### 11. Starting-weapon picker groups by subtype (as well as type)
**Decision.** The creator's starting-weapon dropdown now shows a separate group **per weapon _subtype_**, each
labelled **"Type · Subtype"** (e.g. *Heavy Weapons · Great Swords*, *Heavy Weapons · Great Axes*), instead of one
group per type. To make this possible, the beginner list in `items.js` changed shape: `PC.STARTER_WEAPONS` became
a nested map **`PC.STARTER_WEAPONS_BY_SUBTYPE`** (type → subtype → names); the flat list and a new
`PC.starterSubtype(name)` lookup are **derived** from it, so there's still one source of truth.
**Why.** With beginner weapons trimmed to ~2 per subtype, players couldn't tell *which* subtype each option was —
grouping by subtype makes the shortlist self-documenting and easier to scan.
**Why "Type · Subtype" labels (not nested groups).** A native HTML `<select>` can't nest `<optgroup>`s, so a true
type→subtype tree isn't possible in the dropdown. Combining both into each group's label is the standard way to
show the hierarchy while keeping the plain, reliable native control. Group order follows the map (proficient types
first, then Heritage start-only types, tagged "not proficient").

### 12. Attribute-buff techniques now raise the matching pool (bug fix)
**Decision.** A sustained technique that raises attributes now also raises the matching **pool** (max HP/KP) for as
long as it's active — body-attribute buffs (STR/AGI/CON) grow **max HP**, mind-attribute buffs (INT/WIS/CHA) grow
**max KP**, by exactly the buff. (Reported via *Ki Flame*: it buffed the three body attributes but max HP wasn't
moving; now its +2/+2/+2 adds +6 max HP while active.)
**Why it was broken.** Each pool is the *sum of its attribute scores*, but `maxHP()`/`maxKP()` in `play.js` computed
that sum from **buff-free** scores (they passed `null` for temp modifiers), while everything else — modifiers,
Defense, movement — used the buffed `liveScores()`. So the pools were the one derived value ignoring active buffs.
**The fix.** `maxHP()`/`maxKP()` now use `liveScores()` (buff-aware); a separate `permMaxHP()`/`permMaxKP()` keeps the
buff-free value used only to seed a fresh play session. `ensurePlay` clamps current HP/KP to the buff-aware max.
**Design choice — a full bar stays full; a partial bar gains headroom.** Activating an attribute buff raises the
*max*. If the bar was **full** at that moment, current rises with it (stays full); if it was **partial**, current
stays put and you gain headroom to heal into. When the buff ends the max drops and current clamps back down — so
toggling on/off can never net free HP/KP (you can only ever *stay* full, never gain above your unbuffed full).
*(This first shipped as headroom-only even when full; per the user, a full bar should top up to the new max — done
in `toggleSustained`, which captures the pre-activation maxes and, if a bar was still full after paying costs,
raises it to the new max.)* Limb HP (a fraction of max HP) scales with the buffed max as a consequence, consistent.

### 13. Pool bars labelled "Body Pool / Mind Pool", code inside the bar
**Decision.** On the play sheet's Sheet tab, the two pool bars now read **"Body Pool"** and **"Mind Pool"**
above the bar (with current/max on the right, as before), and the short code **HP** / **KP** is drawn *inside*
the bar in small black print. Previously the header just said "HP"/"KP".
**Why.** The user wanted the fuller pool names visible and the short codes moved into the bars — a cleaner,
more consistent look that also ties the bars to the game's "Body Pool = HP / Mind Pool = KP" language.
**How.** `bar()` in `play.js` now takes a `name` (shown above) and a `letter` (overlaid inside via a
`.bar-letter` span); the pool-bar track is slightly taller (`.poolbar .bar-track`) to seat the code, which is
centered, bold, black, with a faint light text-shadow so it stays legible whether it sits over the coloured
fill or the darker empty portion. Limb and carry bars are untouched (the rules are scoped to `.poolbar`).
*(Superseded by #14 — the pool bars were replaced entirely by side-by-side numbers.)*

### 14. Pools as side-by-side colored numbers, tap to edit (supersedes #13)
**Decision.** On the Sheet tab, the three pools are no longer bars — they're bold **current/max numbers**
shown **side by side**: **Body** (HP) in red, **Mind** (KP) in blue, **Soul** in cyan. Soul displays
**Soul Level / 30**. Tapping a pool opens an inline editor below the row: Body/Mind show the damage/heal
(spend/restore) controls; Soul shows its XP tracker + adjusters and the Level Up button. Only one editor is
open at a time; a small "Tap a pool to adjust it" hint shows when none is.
**Why.** The stacked bars took a lot of vertical space (scrolling) and read like a video-game HUD; the user
wanted a tighter, tabletop-character-sheet feel. Three colored numbers on one line is compact and instantly
readable, and tucking the controls behind a tap keeps the default view clean without losing any function.
**Choices the user made.** Tap-to-edit (rather than always-visible controls); and Soul shows the **Soul
Level**, with the tap revealing XP editing + Level Up. Soul's "max" is the level cap (30).
**How.** `play.js`: new `poolStat()` (the colored current/max cell), `poolAdjustControls()` (Body/Mind
editor) and `soulEditor()` (XP + Level Up) replace the old `bar()`/`soulBar()`. A module var `poolEdit`
tracks which editor is open (reset on character switch). `styles.css`: `.pool-row` (3-col grid), `.pool-stat`
(the tappable cell, colored via `.hp`/`.kp`/`.soul`). Limb and carry-weight bars still use the old
`.bar-track`/`.poolbar-head` styles, which were kept.

### 15. Every item has a flavor description
**Decision.** Every catalog item — all 254, weapons/armor/consumables/tools/gear — now carries a short
"what it is" description (1–2 sentences). It shows on the **Inventory tab**: in the expanded detail of a
carried item, and on each row of the **Browse & Search catalog** (and the catalog search now matches
description text too). Example — *Cutlass: "A short curved saber favored by sailors and raiders."*
**Why.** Names and stats alone didn't tell players what a weapon actually *is*; a one-line description makes
the catalog readable and helps players picture their gear — a small but big quality-of-life win.
**How.** Descriptions live in one place, `PC.ITEM_DESCRIPTIONS` in `items.js` (a name→text map, the single
source of truth), with a `PC.itemDesc(name)` lookup. They're **stamped onto each catalog item at load**
(`it.desc`) so copies made into a character's inventory or starting gear carry the text; the display also
falls back to `PC.itemDesc(it.name)` so items saved before this change still show a description. This kept the
existing `PC.ITEMS` definitions (and their stats/notes) completely untouched — descriptions are additive.
Flavor only: mechanics still live in each item's stats and its `note` (special property).

### 16. Armor system — Light / Medium / Heavy, proficiency & rarity
**Decision.** Armor is now a real system with **three classes** and a clear mobility-vs-protection tradeoff:
- **Light** — least Defense (+1/+2), keeps **full AGI to Defense**, **advantage on Stealth**. (Nimble.)
- **Medium** — mid Defense (+3/+4), AGI to Defense **capped at +2**, no penalties. (The balanced middle.)
- **Heavy** — most Defense (+5/+6), **no AGI to Defense**, **−5 ft move**, **Stealth disadvantage**. (Tanky.)
CON always contributes to Defense; only AGI (the mobility stat) is gated by class. **Proficiency:** everyone
has **Light**; **Medium/Heavy** come from your **Heritage only**. Wearing a non-proficient class → no Defense
bonus from it + disadvantage on AGI checks/attacks. **Rarity** mirrors weapons (Common→Legendary): rarer armor
gives special protections (GM notes), and Legendary can grant an engine-applied perk (advantage on a named
skill, or negating Heavy's move penalty).
**Why these choices (the user's calls).** *Gated-AGI* scheme so light vs heavy is a genuine build decision, not
just a bigger number. *Proficiency from Heritage only* (not backgrounds) — keeps the martial/agile identity on
the region-of-origin layer, where the Fighting Style already lives. *Hybrid rarity* so the "legendary grants
skill advantage" vision actually works in the app while flavor protections stay flexible GM notes. All existing
~22 armors were **re-tiered** into the three classes with tuned Defense + rarities, and a few new
Uncommon→Legendary pieces were added to show the system off (Shadowplate, Warden's Aegis, etc.).
**How it's wired.** `items.js`: the `A()` helper now takes `(name, class, defense, weight, rarity, note,
grants)`; `grants` holds engine-applied perks (`advSkill`, `noMovePenalty`). `data.js`: each heritage carries
`armorProf` (classes beyond Light). `play.js`: `wornArmorClass()` (heaviest equipped), `armorProfClasses()`,
`agiToDefense()` (the gate), and hooks in `defenseScore()`, `effectiveMovement()`, `rollSkill()` (now supports
advantage, cancelling with disadvantage), `attackWith()` and `attackTechnique()` (AGI attacks). `app.js`
surfaces armor proficiency on the Heritage step and the Review. The Inventory tab shows each armor's class,
rarity, proficiency status, Defense contribution, class effects, and any grant/note.

### 17. Combat stats moved to the Combat tab; Speeds on both
**Decision.** The Sheet tab no longer carries a "Combat" panel (Defense / Movement / Initiative / Prof tiles +
the This-Turn tracker + active effects) — that duplicated what the **Combat tab** already showed, so it now
lives only on the Combat tab. To preserve everything, the Combat tab's vitals strip gained **Prof** (now
HP / KP / Defense / Prof / Turn) and a **Speeds** row. The Sheet tab keeps a **Speeds** panel of its own, so
**movement speeds are visible on both tabs** (the user's ask).
**Why.** The Sheet tab had become a scroll of combat HUD that belonged with the rest of the combat controls;
splitting cleanly — reference/identity on the Sheet, actions/vitals on the Combat tab — is tidier and matches
how the app is used at the table. Movement is wanted in both places (planning on the Sheet, acting on Combat),
hence the shared Speeds row.
**How.** New reusable `speedsRow()` in `play.js` (Movement/Climb/Jump/Swim; walk uses `effectiveMovement()` so
it reflects Heavy-armor and crippled-leg penalties). `buildSheetTab()` swapped its Combat panel for a Speeds
panel; `buildCombat()` added a `Speeds` section and a Prof mini-stat. `.combat-vitals` grid widened to 5
columns. (`tileRoll()` is now unused but harmless.)

### 18. Limbs tab — body figure instead of a list of bars
**Decision.** The Limbs tab is now a **Fallout-style body silhouette** (SVG): head, torso, two outstretched
arms, two legs, with each limb's **cur/max HP written over it** in the same bold, colored pen-and-paper style
as the Body/Mind/Soul pools. The number's color tracks health — **gold** (healthy) → **orange** (≤50%) →
**red** (crippled at 0). **Tapping a limb** selects it (psi outline) and opens an inline editor with the
⊕ Called Shot / Heal / Full controls; crippled limbs' auto-applied effects are listed below the figure.
**Why.** The old stacked list of six bars was functional but plain; the user wanted something more aesthetic,
Fallout-like. A figure with the HP over each limb is instantly readable ("which limb, how hurt") and matches
the pool-number treatment used elsewhere, so the whole play sheet feels of a piece.
**How.** `limbFigureSVG()` in `play.js` builds an inline SVG (viewBox 0 0 320 380) — each limb is a `<g>` with
a shape + a `.limb-num` text, classed `ok`/`hurt`/`ko` (and `sel`). The SVG is injected via innerHTML and each
limb `<g>` gets a click handler that toggles `limbSel` (module var, reset on character switch), mirroring the
pools' tap-to-edit. Colors use `currentColor` driven by the limb's state class, so shapes and numbers share one
color. `calledShot()`/`healLimb()` are unchanged. The old `.limb-box`/`.bar-fill.limb` styles were removed.

---

### 19. Chakras moved to their own tab — a seated figure, each chakra its own color
**Decision.** The interactive chakra chart left the **Sheet** tab and became its own **Chakras** tab, placed
right after **Limbs**. It's styled like the Limbs tab: a **seated (lotus) body silhouette** (SVG) with a
glowing **chakra disc over each spinal point**, drawn crown→root in the traditional chakra palette — **Crown
(INT) violet · Third Eye (WIS) indigo · Throat (CHA) blue · Core/Solar-Plexus (STR) yellow · Sacral (AGI)
orange · Root (CON) red**. Below the figure, one labeled **control row per chakra** (color swatch, name,
attribute, current effect, and 4 hit-pips), each tinted its chakra's color. Tapping a disc on the figure or a
row selects/highlights that chakra; the pips set its hits. Hits dim the disc; the 4th hit greys it with an ✕
and flags the row **Locked out**. Mechanics (hits → disadvantage / halved / removed / locked, rest healing)
are **unchanged** — this is a relocation + visual pass only.
**Why.** The Sheet tab was getting crowded and the flat pip-card row was the last plain-looking piece of the
play sheet. The user asked for a dedicated tab, designed like the Limbs figure, with a distinct color per
chakra (referencing the classic seven-chakra body charts). A colored figure makes "which chakra, how hurt"
readable at a glance and matches the pen-and-paper feel used elsewhere.
**How.** Added `color` + `order` to each entry in `PC.CHAKRAS` (`data.js`) — the single source of truth for
hue and top-to-bottom position. In `play.js`: `chakraFigureSVG()` builds the lotus silhouette + six chakra
`<g>` groups (each `style="--cc:<color>"`, classed `ok`/`hurt`/`locked` + `sel`); `buildChakraTab()` wires
disc/row taps to a new `chakraSel` module var (reset on character switch) and reuses `setChakra()`/the pips.
The old chakra panel was removed from `buildSheetTab()`; the stale `.chakra`/`.chakra-row` card CSS was
replaced with `.chakra-figure`/`.chakra-legend` styles that drive color via the `--cc` custom property.

---

### 20. The hidden 7th chakra — Heart, awakens at Soul Level 15 (Otherkin)
**Decision.** Added a **seventh chakra, Heart** (green), that is **fully hidden until Soul Level 15** and then
**awakens** at the *center* of the chakra chart (between Throat and Core). It is the in-app home of the
**Otherkin / Soul Creature** system (already established as a level-15 unlock, mechanics TBD). Because it is
**not tied to an attribute**, it has **no 4-hit track** yet — it's a status node (Dormant→Awakened), gently
pulsing to mark it special, with a short reveal note explaining the Soul Creature and that its powers are
still to come. The level-up screen's Otherkin hint now points to the Heart chakra on the Chakras tab.
**Why.** The user wanted a "surprise" seventh chakra tied to Otherkin. We chose **fully hidden until 15**
(over a visible sealed/mystery node) so the reveal is a genuine surprise at the milestone — nothing hints at
the center slot beforehand. Keeping it attribute-free and hit-less avoids inventing mechanics before the
Otherkin system is designed, while still letting players *see* the awakening the moment they hit 15.
**How.** New `PC.HEART_CHAKRA` in `data.js` (`color`, `unlockLevel: 15`, `system: "Otherkin"`) — separate
from the six attribute-keyed `PC.CHAKRAS` since it isn't an attribute. In `play.js`, `heartUnlocked()` gates
it on `rec.level >= 15`; when true, `chakraFigureSVG()` appends a green `.chakra.heart` `<g>` at the chart's
center and `buildChakraTab()` appends a green Heart legend row (`Otherkin · Soul Creature · Awakened ★`) plus
a reveal note. Selection reuses the same `chakraSel` var (key `"HEART"`). CSS adds a `heartPulse` halo
animation and green Heart row/note styling. **Verified**: level 1 shows 6 chakras and no Heart anywhere;
level 15 shows 7, with the Heart node, row, and note. **Open for later:** design what the Heart chakra/Soul
Creature actually *does*, then wire its track/controls here.

---

### 21. Skill tool kits — gear that goes with the tool-based skills
**Decision.** Turned the ad-hoc tools list into a **coherent set of skill kits**: one tool kit for every
skill that's about *using gear*, each explicitly **tied to its skill**. The three "*Tools*" skills finally
have gear (Laborer's Tools → **Toolkit**, Deft Tools → **Tinker's Kit**, Nature Tools → **Naturalist's
Kit**), and the set extends to the rest — Sleight of Hand → Lockpicks, Athletics → Climbing Kit, Survival →
Survival Kit, Medicine → Medkit, Investigation → **Investigator's Kit**, Technology → Engineer's Tools,
Language → **Linguist's Kit**, Herbalism → Herbalism Kit, Zoology → **Beast-Handler's Kit**, Paranormal →
Incense Kit, Awareness → Binoculars, Deception → **Disguise Kit**, Music → Musical Instrument. Six kits are
new; the rest were relinked and re-described. Each kit shows its tie on the Inventory tab and catalog
(🛠 *Aids &lt;Skill&gt;*). Kits are currently **reference/flavor** — no mechanical bonus (proficiency still
comes from Background/Heritage).
**Why.** The user pointed out we had tool-based skills but no tools to go with them. A one-kit-per-skill set
makes the gear feel deliberate and gives players a reason to buy/carry kits. We kept them flavor-only for now
to avoid rebalancing before deciding whether a kit should be *required* for the finest work or grant
advantage — left as an open question in GAME_RULES.
**How.** `items.js`: `T()` gained a 4th `skill` arg; the TOOLS block was reorganized into skill-kits (by
attribute) + general gear, six kits added, descriptions added for all new items. Built `PC.ITEM_SKILLS` +
`PC.itemSkill(name)` (name→skill lookup) so the tie shows even on older saved/manually-added copies. `play.js`
renders a `.inv-skill` line in the item detail and a `🛠 <skill>` tag in the catalog meta. All 22 tools have
descriptions; every kit points at a real skill (validated). **Open:** decide the kits' mechanical role.

---

### 22. Functioning consumables — Use actually heals HP/KP (and more)
**Decision.** Consumables now **do something when used** instead of just decrementing quantity. Each carries a
structured `effect` that the play sheet applies on Use, rolling any dice and updating the sheet: **HP** and
**KP** restores (dice or flat, capped at max), **chakra** healing (1 hit on each damaged chakra), **limb**
un-crippling, **self-revive** (downed → 1 HP), and full-restore. Wired the existing items (Health Draught 2d6,
Greater 4d6, Stimpak 3d6 + un-cripple, KP Elixir 2d6, Chakra Salve, Bandages, Rez Serum) and added a few:
**Greater KP Elixir** (4d6 KP), **Vital Tonic** (2d6 HP + 2d6 KP), and **Panacea** (full HP/KP + all chakras +
all limbs). Purely narrative items (food, water, smoke, flare, Antitoxin, Adrenaline) still just log. Using a
consumable **does not spend an action** yet — GM adjudicates timing.
**Why.** The user pointed out consumables (like Trail Rations) didn't actually function — they wanted items
that heal and replenish HP/KP. Making the effect structured data (not hard-coded per item) means new
consumables are one catalog line, and the same engine covers chakras and limbs the sheet already tracks.
**How.** `items.js`: `C()` gained a 4th `effect` arg (schema documented above it); added new items +
descriptions; built `PC.ITEM_EFFECTS` + `PC.itemEffect(name)` (name→effect fallback for older/manually-added
copies). `play.js`: rewrote `useConsumable()` to read `it.effect || PC.itemEffect(it.name)`, apply each key
(reviveSelf → hp/hpFull → kp/kpFull → chakraHeal → uncripple/uncrippleAll → cure/note), `announce()` a flash +
log line summarizing what happened, then decrement/remove. Reused existing `maxHP/maxKP/clamp/limb/chakra`
helpers, plus a `consumableAmount()` dice/number roller. Added a `⚕ Use:` line in the item detail so the
effect is clear before using. **Verified**: from hp5/kp4, STR-chakra 3, head crippled — Health Draught +10 HP,
KP Elixir +9 KP, Chakra Salve 3→2, Stimpak +12 HP & head restored, Panacea full-restored everything; the raw
injected items (no `effect` field) confirmed the name-lookup fallback. **Open:** whether Use should cost an
action, and hooking Antitoxin/Adrenaline into a future condition/econ system.

---

### 23. Crafting & salvage — every non-legendary item breaks down into materials
**Decision.** Added a crafting system. **14 salvage materials** (9 Basic + 5 Exotic) become catalog items in a
new **Salvage** category. **Every item outside Legendary** has a **recipe** (component list) and a **salvage
yield**. On the play sheet: each item's detail shows *Made of* + *Salvage yields*; a **♻ Salvage** button
breaks one unit into materials; the catalog gains a **🔨 Craft** button per craftable row (disabled with a
"need X" tooltip until you hold the components) and a recipe line; materials live in a **Salvage Materials**
panel on the Inventory tab (salvage is filtered out of the normal carried list). Legendary items show
"cannot be crafted." Salvaging is **lossy** (Basic ≈ half, Exotic cores consumed) so there's no
craft↔salvage exploit.
**Why.** The user's crafting system: any non-legendary item craftable with the right components (and skills),
custom items later. Step one was "break every item into component materials called salvage." With 257
craftable items, hand-writing recipes would be inconsistent, so recipes are **derived** from each item's own
fields — which also means future **custom items** get a breakdown for free. Chose a **tiered ~14-material**
set (per the user) so exotics gate higher-rarity crafting, and built the **working Craft + Salvage actions**
(also per the user) rather than data-only.
**How.** `items.js`: `PC.SALVAGE` (materials + descriptions, pushed into `PC.ITEMS`), lookup tables
(`_wmat` by weapon type, `_amat` by armor class, `_override` for the 48 consumable/tool/misc items,
`_craftSkill` by primary material), and `PC.itemRecipe()` / `PC.itemSalvageYield()` / `PC.craftSkillFor()`.
Recipe quantity scales with weight (`_bulk`) and rarity tier (exotic added at Uncommon+, +1 primary at Rare,
+2 & 2 exotic at Very Rare). `play.js`: `ownedMaterial/ownedMaterials/addMaterial/spendMaterial`,
`recipeOf/missingComponents/craftItem/salvageItem`, the detail lines + Salvage button, catalog Craft button +
recipe line + "Salvage" filter, and the Materials panel. CSS for `.cat-craft`, `.cat-btns`, `.salvage-grid`,
`.salvage-chip` (exotic = gold). **Validated**: 256 craftable / 27 excluded (12 Legendary + currency + 14
materials), no bad recipes. **Verified in-browser**: salvaged a Warmaul → 2× Scrap Metal + 1× Hardwood;
crafted a Combat Knife (−1 Scrap Metal, −1 Leather); Worldbreaker shows uncraftable; Plasma Craft disabled
without Circuitry/Power Cell. **Open:** hard skill-gating + rarity DCs, whether Craft/Salvage costs an action,
and custom-item crafting (the promised next step).

---

### 24. Crafting is downtime + skill-gated (follows #23)
**Decision.** Two rulings from the user on the crafting system: (1) crafting and salvaging are **downtime**
activities — they cost **no** Action/Bonus Action and can't be done in combat; (2) the **craft skill is
required**, wired to the **existing skills list** per item. So crafting is now gated on **both components and
proficiency in the item's craft skill**; the per-item skill is derived from the recipe's primary material
(metal → Laborer's Tools, tech → Technology, crystal → Paranormal, chem/plant → Herbalism, wood/hide/cloth →
Nature Tools). Salvaging stays unskilled (anyone can break gear down). No action-economy cost was ever wired
in, so "downtime" needed no mechanical change — just made explicit in the UI copy.
**Why.** The user: crafting/salvage "should not be an action or bonus action… it's for downtime," and the
required skill "would be wired into the existing skills list depending on the item." The material-based skill
map from #23 already provided the per-item skill; this promotes it from advisory to a hard gate.
**How.** `play.js`: added `isSkillProficient(name)` (mirrors `rollSkill`: background-granted or chosen skills),
`craftSkillOf()`/`hasCraftSkill()`; `craftItem()` now blocks if not proficient; the catalog Craft button
disables on missing components **or** missing skill and its recipe line shows `✓/🔒 <skill>`; the item detail
shows a **Craft skill** line with proficient/locked status; hints now say "downtime" and note the skill
requirement; the Salvage button tooltip reads "Downtime." CSS for `.cat-craft-skill.ok/.no`,
`.craft-ok/.craft-no/.craft-dt`. **Verified in-browser**: a Laborer's-Tools-proficient character could craft a
Warmaul & rifles (✓, enabled) but not Plasma (Technology 🔒), potions (Herbalism 🔒), or staves (Paranormal
🔒) — all disabled with the reason; crafting the Warmaul consumed materials and produced the item. **Open:**
rarity-based crafting DCs / an actual check instead of a flat proficiency gate; custom-item crafting.

---

### 25. Crafting is a skill CHECK, not a proficiency lock (supersedes #24's gate)
**Decision.** Per the user — "it should absolutely be a skill check, not locked behind proficiencies" — crafting
no longer requires proficiency. **Anyone may attempt** any non-legendary item they have the components for;
crafting **rolls d20 + the craft-skill modifier** (the skill's attribute mod, chakra-adjusted, **plus**
proficiency if the character has it) vs a **rarity DC: Common 10 · Uncommon 13 · Rare 16 · Very Rare 20**.
**Success** spends the components and makes the item; **failure** logs the roll and **keeps the materials**
(non-destructive default; GM paces attempts). The craft-skill→item mapping from #23/#24 is unchanged — it now
just picks *which* skill you roll, not a lock. Salvaging still needs no check.
**Why.** #24 had made the craft skill a hard proficiency gate; the user wants the uncertainty/roll of a real
check, with proficiency as a bonus rather than a wall. Kept failure non-destructive (don't delete a player's
materials on one unlucky d20) and flagged "waste materials on failure" as an option.
**How.** `play.js`: `craftDC(item)` (rarity→DC) and `craftCheckInfo(item)` (skill, attribute, chakra-adjusted
modifier + proficiency bonus, DC). `craftItem()` now rolls `PC.rollCheck(mod, mode)` (disadvantage only from
chakra/flaw on the attribute), compares to the DC, and branches success/fail — `announce()`ing the roll either
way. The catalog Craft button is enabled **whenever components are present** (no skill lock); its line/tooltip
show `🎲 <skill> DC <n>` and a `✓` if you happen to be proficient; the item detail shows the full
`Craft check: <skill> (d20±m) vs DC n`. Hints reworded to "skill check (DC by rarity)". Removed the
`hasCraftSkill` disable and the `.cat-craft-skill.ok/.no` split. **Verified in-browser**: a non-proficient
character's Plasma weapons (Technology) are now craftable (button enabled, `🎲 Technology DC 10`); crafting a
Combat Knife over 12 attempts gave 11 successes / 1 fail, spending 1× Scrap Metal only on success and keeping
materials on the fail, with each roll announced (e.g. "Laborer's Tools check d20+4 = 24 vs DC 10 ✓").
**Open:** optional material-loss-on-failure; custom-item crafting.

---

### 26. Failed craft wastes half the components
**Decision.** Per the user — "lose half" — a **failed** craft check is no longer non-destructive. On a miss the
character now **loses half of each recipe component, rounded up** (e.g. a 1× Scrap + 1× Leather recipe loses
1× each; a 4× material loses 2×). Success is unchanged (spend full recipe, make item).
**Why.** #25 kept failure non-destructive as a safe default but flagged material-loss as an open option; the
user chose to add real risk so a botched roll stings. Rounded **up** so single-unit components (the common
case) still carry a cost — otherwise `floor(1/2)=0` would make failure toothless for most Common recipes.
**How.** `play.js` `craftItem()` failure branch: `const lost = r.map(c => ({mat:c.mat, qty:Math.ceil(c.qty/2)}))`,
spend each, and report it — the log line reads "Lost 1× Scrap Metal · 1× Leather (half, rounded up)" and the
toast echoes it. Reworded the Materials-panel hint (no longer "a failed check keeps your materials" → "wastes
half your components, rounded up"). Docs (GAME_RULES, README) updated; cache-buster v=45.
**Open:** custom-item crafting.

---

### 27. Crafting gets its own tab — known-recipe gate + custom-item builder
**Decision.** Per the user — "put the crafting system on its own tab after inventory … crafting should be
limited by a known recipe system with an option to create your own item." Two design forks were put to the
user (AskUserQuestion), who chose:
- **How recipes are known → "Craft-skill based start."** A character **starts** knowing every **Common** (or
  unrated) recipe whose **craft skill** they're **proficient** in (a Technologist knows common tech gear, etc.),
  and **learns the rest** by **salvaging** an example or a GM/discovery grant. Crafting is now **gated to known
  recipes** — you can no longer craft an arbitrary catalog item just because you hold the parts.
- **Custom items → "Full mechanical item."** The builder produces a fully playable item (weapon/armor/
  consumable/tool/misc) with real stats, not just flavor.
**Why.** The catalog-wide "craft anything you have parts for" model had no sense of *learning* a craft; a
known-recipe list gives progression and makes salvage double as discovery. Craft-skill start keeps a fresh
character immediately useful in their domain while still walling off rarer/out-of-domain gear. Auto-deriving a
custom item's recipe from its own stats (via the existing `PC.itemRecipe`) means custom gear is balanced
identically to catalog gear with no separate balancing pass.
**How.** `play.js`:
- **Known recipes:** `rec.knownRecipes` (names) initialized lazily from `startingRecipes()` (Common/unrated
  items whose `craftSkillFor` is a proficient skill). `knownRecipeNames()`, `knowsRecipe()`, `learnRecipe()`.
  `craftItem()` gained a **known-recipe guard**. `salvageItem()` now **teaches** the item's recipe (logs
  "📖 Learned to craft X").
- **New `🔨 Crafting` tab** (after Inventory in the tab bar + `activeTab` switch): intro, **Salvage Materials**
  stock (moved off the Inventory tab), searchable **Known Recipes** grid (`recipeCard()` with per-component
  have/need coloring + the craft check + a Craft button), a collapsible **📖 Learn a Recipe** discovery browser,
  and a collapsible **✎ Create Custom Item** builder.
- **Custom builder:** live form state in module-level `craftForm` (survives re-renders); `customItemFromForm()`
  builds the item object (weapon type+damage / armor class+DS / consumable hp·kp effect / tool skill);
  `saveCustomItem()` pushes it to `rec.customItems` (a known custom recipe); a **live preview** shows the
  derived recipe + craft check; `forgetCustom()` deletes one. Custom items craft through the same `craftItem()`
  (their `custom:true` flag satisfies the known gate; recipe auto-derives).
- **Inventory tab:** Materials panel removed (now on Crafting); catalog **Craft buttons removed** (crafting
  lives on its tab) — the catalog now shows a "📖 recipe known" tag instead; quick-add relabeled "found / GM".
- **CSS:** `.recipe-grid/.recipe-card/.recipe-*`, `.rc-ok/.rc-no`, `.custom-form/.custom-preview/.collapse-head`.
**Verified in-browser** (Playwright): the Crafting tab renders immediately **after** Inventory; a Nature-Tools-
proficient character starts with a populated Known Recipes grid; a Plasma weapon (Technology) is **not** known
until **salvaged**, after which it appears in Known Recipes; the custom builder previews the derived recipe,
saves a "custom"-tagged recipe, and crafts it into inventory; no console errors. Cache-buster **v=46**.
**Open:** none outstanding for crafting. (Possible future polish: player-hand-picked components instead of
auto-derived; recipe categories/filters if the known list grows large.)

---

### 28. Known Recipes grouped by item type + "craftable only" switch
**Decision.** Per the user — "instead of showing the full list at all times it shows a list of item types
(weapons, armor, consumables) and then when you click on one … it pulls up the recipes you know. with an option
to only show what can be crafted toggled by a switch at the top." The flat 120-card Known Recipes grid was too
much scrolling. Now Known Recipes is an **accordion of item-type rows** (Weapons / Armor / Consumables / Tools /
Misc), each **collapsed by default** and labelled with its count ("81 known · 5 craftable now"); clicking a type
expands just that group's recipe cards. A **"Only show what I can craft now" switch** at the top filters every
group (and its counts) down to recipes whose components are fully held.
**Why.** The flagged-in-#27 concern — a broad craft skill (Nature Tools) yields 120+ known commons — made the
list unwieldy. Grouping keeps the page short (nothing expanded = five one-line rows) and lets a player jump
straight to the type they want; the switch answers the most common real question at the table ("what can I
actually make right now?").
**How.** `play.js`: new state `craftCatOpen` (per-type open flags) and `craftOnlyCraftable` (switch). Extracted
`buildKnownRecipes()`: builds one `.type-group` per category with a clickable `.type-head` (caret + name +
count), rendering `recipeCard()`s only when open and only for entries passing the filters. A non-empty **search
box** bypasses the accordion and shows a **flat cross-type grid** (so you can find by name without knowing the
type). `canCraft(it)` = `missingComponents(it).length === 0`. `forgetCustom()` changed to delete by object
identity (the grouped/filtered views no longer carry a stable index). **CSS:** `.craft-controls`, a CSS-only
toggle `.switch/.switch-track/.switch-label`, and `.type-group/.type-head/.type-caret/.type-name/.type-count`.
**Verified in-browser** (Playwright): five type rows render **collapsed** (0 cards visible) with correct
counts; opening Weapons reveals its 81 cards and flips the caret; the switch drops Weapons 81→0 (no metal held)
while Armors shows 15→9 with **every** displayed Craft button enabled; a "robe" search returns a flat 2-card
list with the type rows hidden; no console errors. Cache-buster **v=47**.

---

### 29. Components, templates & quality grades — a two-tier crafting economy
**Decision.** Per the user, custom-item crafting (and crafting generally) needed **balance rules**, real
**components** ("triggers, blades, barrels"), and **templates** per item type. Four AskUserQuestion forks
settled it: **(1) Reach** = all weapons & armor (not just custom), conserving raw cost; **(2) Components** are
craftable from raw **and** mid-tier salvage **and** findable loot; **(3) Balance** = hard caps, with the
**materials/components used driving the item's numbers** (better parts → better gear); **(4) Quality rule** =
the **average** of the parts' grades.
**The model.**
- **Quality grades (4):** Crude Q1 · Standard Q2 · Fine Q3 · Masterwork Q4, aligned to Common→Very Rare.
- **16 components** (`PC.COMPONENTS`): Blade, Bludgeon Head, Haft, Bow Limbs, Barrel, Trigger Assembly, Stock,
  Emitter Lens, Focus Array, Warhead, Power Core, Living Node, Plating, Armor Weave, Padding, Straps & Fittings.
  Each is a real catalog item at all 4 grades (64 entries), craftable from raw salvage (the material tier sets
  the grade — Basic→low, Exotic→Q3/Q4), recovered by salvage, or found.
- **Templates** (`PC.WEAPON_TEMPLATES` × 18 subtypes, `PC.ARMOR_TEMPLATES` × 3 classes): fixed attribute,
  component slots, weight band, and a **damage/DS-by-grade table** whose Q4 rung = the subtype's real catalog
  max (grounded in a scan of the 283-item catalog) — the hard cap.
- **Assembly:** an item's quality = **average of its slot grades** (`PC.qualityFromGrades`, floor), which sets
  rarity + damage/DS off the template. Weapons/armor recipes are now **component slots at their rarity grade**;
  components/consumables/tools/misc stay raw. Salvaging weapons/armor returns the **higher-value half** of their
  components (edge/core first) at the item's grade; everything else returns raw. All lossy.
**How.** `items.js`: added the quality/component/template engine and rewrote `itemRecipe`, `itemSalvageYield`,
`craftSkillFor` to flow through components (a `component:true`/`part`/`quality` tag rides on recipe entries).
`play.js`: generalized `ownedMaterial`/`addMaterial`/`spendMaterial` to treat **components and salvage
uniformly** as "ingredients"; added `ownedComponents`, `componentChip`, a **⚙ Craft Components** workbench
(`craftComponent` — a skill check, each grade a button gated by materials), and reworked the **custom builder**
so weapons/armor pick a template + a grade per slot with a live quality/rarity/damage preview (`recipeOf` now
honors a custom item's stored `.recipe`). Components are excluded from the known-recipe list (their own panel)
and shown on the Crafting tab, not the carried-gear list. `styles.css`: grade-colored chips/buttons, the
components workbench grid, and the template-rules / slot-grade pickers. **Verified in-browser** (Playwright):
component craft (raw→part, failure loses half); custom Light Weapon with Fine Blade + Standard Haft →
**averaged to Standard/Uncommon, 1d6**, saved & shown in the Weapons group, then crafted into inventory
consuming those parts; salvaging a rifle returned **Crude Barrel + Crude Stock** (valuable parts kept); no
console errors. Cache-buster **v=48**.
**Open:** per-instance component quality is coarse (grade only, not sub-tiers); custom **consumable/tool**
depth is still simple (no component tree — intentionally). Possible polish: let a built item preserve its exact
mixed-grade parts on rebuild rather than the averaged uniform grade.

---

### 30. Custom builder: Item Category → (Weapon Type / Armor Type) cascade
**Decision.** The builder's subtype selector was easy to miss (buried after Weight). After a first pass that
labelled it "1 · Type / 2 · Subtype", the user corrected the framing to match the game's own vocabulary:
**first pick Item Category** (Weapon / Armor / Consumable / Tool / Misc), **then** — only for a weapon — a
**Weapon Type** select, or — only for armor — an **Armor Type** (Light / Medium / Heavy) select. Consumables/
tools/misc show no such select.
**How.** `play.js buildCustomBuilder()`: the category select is labelled **"Item Category"**; the conditional
second select renders right beneath it as **"Weapon Type"** (flat list of the 18 types, each tagged with its
attribute, e.g. "Heavy Weapons (STR)") or **"Armor Type"** (Light/Medium/Heavy armor), each with a
`— choose … —` placeholder. No engine change. **Verified** (Playwright): weapon flow → labels
`Item Category` → `Weapon Type` (18 flat options, no optgroups); armor → `Item Category` → `Armor Type`
(Light/Medium/Heavy); consumable → no type select (Rarity instead); no console errors. Cache-buster **v=50**.

---

### 31. Weapon subtypes — a third builder level with per-subtype damage ladders
**Decision.** Per the user ("weapons break down into weapon types and each weapon type breaks down into
subtypes"), the custom weapon flow gained a **third cascade**: **Item Category → Weapon Type → Subtype**. The
subtypes are the real taxonomy already documented in `WEAPONS.md` (58 across the 18 types — Heavy Weapons →
Great Hammers / Great Swords / Great Axes / Maces / Axes, Firearms → Rifles / Handguns / Revolvers, etc.), each
with a **base damage die**. Armor stays two-level (Item Category → Armor Type); the user only asked for weapon
subtypes.
**Why.** A single weapon-type template gave one damage table for the whole type, but subtypes have distinct
dice (an Axe ≠ a Great Hammer). The subtype now carries the base die, so a custom weapon's identity survives
grade scaling.
**How.** `items.js`: added `PC.WEAPON_SUBTYPES` (type → [{name, die}], transcribed from WEAPONS.md), a
`PC.DIE_LADDER` (1d4…4d6), and `PC.subtypeDamage(die, q)` — Q1 = base die, Q2–Q4 step +1/+2/+3 rungs up the
ladder (clamped = hard cap). `play.js buildCustomBuilder()`: a **Subtype** select renders after a Weapon Type is
chosen (options tagged with base die); the template rules readout and the item's damage now come from
`subtypeDamage(subtypeDie, quality)` instead of the flat type table; the custom item stores its `subtype`, shown
in the recipe card + preview; save requires a subtype. Component slots/attribute/hands/weight still come from
the weapon-type template. **Verified** (Playwright): Heavy Weapons surfaces the Subtype select with its 5
subtypes; Axes shows the ladder **Crude 1d8 · Standard 1d10 · Fine 1d12 · Masterwork 2d6**; both slots at Fine →
**Fine Rare · Axes · 1d12**; no console errors. Cache-buster **v=51**.

---

### 32. Pets tab — controllable NPC companions (bestiary-ready)
**Decision.** Per the user, players will acquire **pets** — simple NPCs they control (animals, robots, small
monsters, demons…). The bestiary isn't written yet, so the ask was to **build the tab & systems now** so
creatures can drop in later. Added a **🐾 Pets** tab (last in the tab bar) with a hand-authored companion
system.
**Model.** `rec.pets = [{ id, name, kind, emoji, species, hp, hpMax, defense, speed, initMod, attacks:[{name,
toHit, damage, note}], traits:[str], notes, active }]`. `kind` ∈ Animal/Robot/Monster/Demon/Construct/Spirit/
Undead/Other, each with a default emoji (overridable). Deliberately a **lean stat block** ("simple NPCs"), not
a full 6-attribute sheet — flexible enough for any creature.
**How.** `play.js`: new `expandedPet` state, tab-bar + switch wiring, and a Pets section — `petList/addPet/
removePet/setPetField`, `petHP` (damage/heal, clamps, logs, flags "down" at 0), `petInitiative`, `petAttackRoll`
(d20 + to-hit), `petDamageRoll` (`PC.rollDiceExpr`), and attack/trait add-remove. `buildPetsTab()` → add form
(name + kind) + `petCard()` per pet: header, HP bar + damage/heal, a Defense/Speed/Initiative strip, per-attack
**⚔ Hit / 🎲 damage** quick-roll buttons, trait chips, and an expandable **editor** (all fields, attacks &
traits editors, notes, remove). Every roll flows through the existing `announce()`/roll-log/popup, so pets act
alongside the character. `styles.css`: `.pet-*` card/stat-strip/attack/editor styles. **Verified** (Playwright):
Pets tab present & last; empty state; add "Rex" (Animal); damage 10→7; add attack/trait; quick button reads
"⚔ Hit +5"; attack roll posts "Rex — Bite: d20+5 = 6 (vs Defense Score)" to the popup/log; editor renders all
fields; no console errors. Docs (GAME_RULES §Pets, README, CLAUDE) synced. Cache-buster **v=52**.
**Open:** bestiary of pre-statted creatures (drop-in instead of hand-entry); taming/summoning cost,
command action-economy, and loyalty.

---

### 33. Character artwork — upload + face-crop thumbnail
**Decision.** Per the user, an **optional** feature on the Description tab: players upload their own character
artwork, **crop a face into a thumbnail**, and that thumbnail shows **next to the name atop the play sheet**
and **on the character-select roster**.
**How.** `play.js`: Description tab gains a **Character Artwork** panel (`buildArtworkPanel`). Upload
(`fileButton` → hidden `<input type=file>`) runs `handlePortraitFile`, which downscales the image to ≤1000px
long-edge and stores a **compressed JPEG data URL** as `rec.portrait` (keeps localStorage small). A **cropper**
overlays a draggable, slider-sized **square** on the image (pointer events, dim-outside via a big `box-shadow`
clipped by an `overflow:hidden` wrap); **Set as thumbnail** maps the selection from display → natural pixels,
draws a 240px square canvas, and stores `rec.thumb` (data URL) + `rec.crop` (fractional rect, to restore the
selector). The header (`buildHeader`) shows a round `.head-thumb` by the name (click → Description tab); the
roster card (`app.js rosterCard`) shows a `.roster-thumb`. **Storage safety:** `App.saveRoster` now **returns a
boolean** (and gives a clearer *storage-full* message on `QuotaExceededError`); `play.js save()` returns it, so
`handlePortraitFile`/`makeThumbFrom` **roll back** the image and toast if the write won't fit. All per-device,
flavor-only. Fixed the `.play-head > div:nth-child(2)` flex selector (the new `<img>` shifted child order) by
tagging the title `.phead-title`. **Verified** (Playwright, real canvas-generated PNG fed to the input): upload
→ `rec.portrait` set (compressed) → cropper visible → Set thumbnail → `rec.thumb` + `crop` saved → thumbnail
appears in header, preview, and roster; no console errors. Cache-buster **v=53**.
**Open:** EXIF auto-rotation for phone photos isn't handled (desktop art is the common case); no cross-device
sync (per-device, like characters).

---

### 34. Otherkin tab — level-15-gated placeholder (mirrors the Heart chakra)
**Decision.** Per the user, add the **♥ Otherkin** play-sheet tab now, but keep it **hidden until Soul Level
15** — the same reveal moment as the Heart chakra. The Otherkin *system* (Soul Creature bond/forms/powers)
isn't written yet, so for now the tab is a **themed placeholder** that will host it, so the shell is ready
the day Luke hands over the mechanics.
**Why gated at 15.** The Otherkin is the **Soul Creature seated at the Heart chakra**, and the Heart chakra
already stays concealed until Soul Level 15 (`PC.HEART_CHAKRA.unlockLevel: 15`, `system: "Otherkin"`). The
two are one reveal — so the tab uses the **exact same gate** (`heartUnlocked()`) and the same green accent.
**How.** `play.js`: `buildTabBar()` builds the tab array conditionally — `if (heartUnlocked()) tabs.push(["otherkin","♥ Otherkin"])`,
inserted **right after Chakras** (the Otherkin lives at their center). Added `case "otherkin"` → `buildOtherkinTab()`,
plus a defensive guard: if `activeTab === "otherkin"` but the character is no longer awakened (e.g. a level-down),
the view **falls back to Sheet** so it can't strand on a hidden tab. `buildOtherkinTab()` renders a themed
panel (label ♥ The Otherkin), an **awakened note** echoing the Heart chakra reveal wording, and a pulsing green
heart glyph over the chakra theme (`PC.HEART_CHAKRA.theme`) with a "System coming soon" line. `styles.css`:
`.play-tab.otherkin` + `.otherkin-panel/.otherkin-note/.otherkin-glyph/.ok-heart` (`ok-pulse` animation), all
in the Heart green (`#46c46e`). **Verified** (Playwright): at Level 1 the tab is **absent**; bumped to Level 15
it **appears right after Chakras**, opens, and renders panel + note + glyph with the active-tab styling; no
console errors. Cache-buster **v=54**.
**Open:** the Otherkin mechanics themselves (what the Soul Creature is, how it's chosen, bonded, and used, and
how the Heart chakra is tracked/spent) — TBD, to be built into this tab when Luke designs the system.

---

### 35. Technique lists trimmed 5→3 per tier (so a build masters ~2 Kinetics + dips a 3rd)
**Decision.** Per the user, shrink every Kinetic's technique lists from **5 per tier → 3 per tier** (4 tiers kept:
Beginner · Adept · Expert · Master). That takes each Kinetic from **20 → 12** techniques and the library from
**360 → 216** (144 cut). Goal: with a **fixed** Technique-Point budget, let a character **master at least two
Kinetics and dip into a third**, instead of today's "one master + half of a second."
**Why it works (the math).** TP is `level − 1`, cap 30 → **29 TP + 3 starting techniques (1 background + 2
chosen) = 32 acquisitions**. At 20/Kinetic: 32 → one full master (20) + ~⅔ of a second. At **12/Kinetic**: 32 →
**two full masters (24) + 8 into a third** (its Beginner + Adept + into Expert). Exactly the intended breadth.
The user explicitly chose to keep it at **four tiers** (an earlier "five tiers" was a mis-recall).
**How the 144 were chosen.** Each Kinetic has a **signature technique that threads all four tiers** (the scaling
line — *Conflagration → ×2 → ×5 → ×10*, *Ki Flame*, *Sanctuary*, …). Rule: **keep the signature + the 2 that best
preserve a damage / control / support spread; cut the 2 most redundant.** The user approved "trust my picks,
proceed." Applied via a script matching **exact `kinetic`+`name`** (so near-duplicates like *Renew* vs *Renewal*,
*Rewind* vs *Rewind Death* aren't caught wrongly).
**Gotcha handled — background starting techniques.** Four Backgrounds grant a Beginner technique that my first
pass had cut (Survivalist→*Mud Skin*, Witch→*Thistle Bush*, Musician→*Resonant Pulse*, Guru→*Phantom Presence*).
Fix: for those four Beginner tiers, **keep the freeTech and cut a different technique** instead (so no Background
is orphaned). Verified zero orphaned `freeTech` references afterward.
**Rules side-effect (intended).** The tier gate "know ≥3 from the previous tier to unlock the next" now means you
must **complete the whole previous tier** to advance (3 of 3) — and tier-completion proficiency/expertise
(Adept-complete → proficient, Expert-complete → expertise) now triggers on **all 3**. No engine change needed;
`kineticTierComplete` already checks "every technique in the tier," and the app's `X/5` progress readouts were
made **dynamic** (`X/${tier.length}`) so they read `X/3` automatically.
**Docs/app synced.** `data.js` (−144), `TECHNIQUES.md` (−144 rows + count/gate notes), `GAME_RULES.md`
(3/tier + the budget rationale), `README.md`, `rules.js` comment, `CLAUDE.md` (216). **Verified** (Node): 216
total, exactly 3 per Kinetic-tier, all 18 signatures intact across all tiers, no orphaned Background freeTech,
`items.js` still loads. Cache-buster **v=55**.
**Open:** numbers are still playtest-tunable — the user flagged "after play testing we may change some things,"
so specific keep/cut picks and the TP budget can be revisited.

---

### 36. Combat tab: action groups become collapsible pull-down menus
**Decision.** Per the user, make the Combat tab friendlier by turning the **Actions / Bonus Actions / Reactions**
(and Full-Turn & Other) groups into **collapsible pull-down menus** so players scroll less to find the thing
they want.
**How.** `play.js`: `actionGroup(title, cards, emptyMsg)` → `actionGroup(key, title, cards, emptyMsg)` — the
section-label becomes a tappable `.collapse-head` with a **count badge** (`.cg-count`) and a **caret**; the card
grid renders only when open. Open/closed state lives in a new `combatGroupOpen = { actions:true, bonus:false,
reaction:false, other:false }`, so **Actions shows by default** (the most-used group) and the rest start
collapsed. Crucially the state **persists across the Combat tab's frequent re-renders** — every roll calls
`refresh()`, so without persistence the menus would snap shut mid-turn. `styles.css`: `.combat-group` /
`.combat-group-head` / `.cg-count` / `.cg-caret`. The always-visible **This Turn** economy tracker and the
**Combat Skill Passives** reference panel are unchanged (passives aren't actionable, so they're not a pull-down).
**Verified** (Playwright): fresh character → Combat tab shows Actions open (grid, caret ▲) with Bonus/Reactions
collapsed (caret ▼, no grid) and correct count badges; expanding Bonus reveals its cards; **after Roll Initiative
(a refresh) the opened group stays open**; no console errors. Cache-buster **v=56**.

---

### 37. Combat groups auto-collapse when their slot is spent (follows #36)
**Decision.** Per the user, take the pull-downs a step further: when you **spend an action-economy slot**, its
group **auto-collapses** — use your Action and the Actions menu folds away on its own, so what's left to do
this turn is what's still on screen.
**How.** `play.js`: the single spend choke-point `consumeEcon(actionType)` now also sets the matching
`combatGroupOpen[...] = false` (Action→actions, Bonus→bonus, Reaction→reaction, Full Turn→actions+bonus+other).
The manual **This-Turn** tracker (`toggleEconSlot`) stays in step both ways — marking a slot used collapses its
menu, freeing it reopens it. A **new turn** (`endTurn`) and a **long rest** reset the menus to the default
(Actions open, rest collapsed) so the next turn starts fresh. Auto-collapse is a one-time nudge at spend time,
not a forced state — you can always tap a spent group open again to re-read a card.
**Verified** (Playwright): spending the Action collapses Actions (▲→▼, grid gone) and marks the tracker's Action
slot ✓; opening Bonus then marking its slot used collapses it, un-marking reopens it; **End Turn reopens Actions**
for the new turn; no console errors. Cache-buster **v=57**.

---

### 38. Fusion Kinetics — a hidden system unlocked by pairing parent techniques
**Decision.** Per the user (+ the *Fusion Kinetics Compendium* PDF), add **Fusion Kinetics**: 39 advanced kinetics
each combining two parents (e.g. **Nuclekinesis** = Robukinesis + Pyrokinesis). They are a **secret** — not in
the Player's Guide, invisible until discovered in play. The GM knows them (see `FUSIONS.md`).
**The mechanic (from the user's answers).** Fusions **start at tier 2** — tiers **Adept · Expert · Master**, 3
per tier = **9 each** (39 × 9 = **351** techniques). Each fusion technique is a **specific pairing of one
technique from each parent at the same tier — Adept and above only**: fusion Adept pairs parents' **Adept**,
Expert pairs **Expert**, Master pairs **Master**. Parents' **Beginner** techniques never form fusions (the user
corrected an earlier Beginner-fed draft: *"not beginner techniques, only adept and above"*). E.g.
*Kinetic Grip + Blazing Speed → Nucagrip*. A character **automatically gains** a fusion technique — **free, no
TP** — the instant they know **both** halves; the fusion stays fully hidden until then, then reveals with a
one-time *"✨ Fusion discovered"* toast.
**Why this shape.** Both halves must be **Adept+**, so a fusion only surfaces once a character has invested past
Beginner in **both** parents — meaningfully gated, no low-level accidental unlocks. Auto-grant-on-pairing means a
character's fusions **emerge from the two Kinetics they actually invest in** — no separate currency, and it ties
neatly to the "master ~2 + dip a 3rd" TP budget from #35.
**How (build).** Content is **generated** from the parent data by a script (`scratchpad/gen_fusions.js`): it pairs
parent techniques index-wise per tier, names each by portmanteau (fusion prefix + the first parent's technique
word → *Nuc*+*strike* = *Nucastrike*; collisions fall back to the second parent's word), sums KP (fusions are
expensive), bumps the primary half's damage/heal one die-step, and blends the effect. **Action economy follows
the primary half** (Action / Bonus Action / Reaction) so fusion techniques separate into the Combat tab's action
groups like everything else (~242 Action / 107 Bonus / 2 Reaction), not all lumped under Actions. Output → `PC.FUSIONS` (39
registry entries) + `PC.FUSION_TECHNIQUES` (351) appended to `data.js`. `rules.js` gains `PC.grantedFusionTechniques`,
`PC.unlockedFusions`, `PC.fusion*`, and `PC.technique()` now falls back to fusion techniques (so the play sheet
can render/roll them) — while the **creator & level-up stay clean** because they iterate `PC.TECHNIQUES` only.
`play.js`: `knownFusionTechs()` folds earned fusions into the Combat action groups; a new **✨ Fusion Kinetics**
panel on the Kinetics tab lists unlocked fusions (parents, role, domain, granted techniques); `checkFusionDiscoveries()`
fires the discovery toast once per fusion (persisted on `rec.seenFusions`). Distinct violet styling
(`.fusion-*`). **Chakra-damage penalty deferred** (documented as planned). Duplicate compendium name
*Glaciokinesis* resolved: kept for Robu+Cryo, the Hydro+Cryo one renamed **Rimekinesis**.
**Kept the secret:** `README.md` (the player-facing guide) intentionally says **nothing** about fusions; the GM
reference lives in `FUSIONS.md` + this log + a HIDDEN section in `GAME_RULES.md`.
**Verified** (Node + Playwright): 39 fusions / 351 techniques, unique names, all pairs valid, 9 per fusion; a
seeded character knowing *Kinetic Grip + Blazing Speed* (both Adept) auto-gains **Nucagrip**, unlocks
**Nuclekinesis**, fires the discovery toast, shows the fusion in the Kinetics panel and as a usable Combat
action; a Beginner-only pair (*Ki Strike + Fire Bolt*) grants **nothing**, and a character with **no qualifying
pair sees no fusion content** (hidden); no console errors. Cache-buster **v=59**.
**Open:** names/effects/costs are a **concept pass** (the PDF's own framing) — tune in playtest; the chakra-damage
penalty and any Provisional-fusion renames are still to come.

---

### 39. Fusion Kinetics expanded to the full 153 (the earlier PDF was incomplete)
**Decision.** The user supplied the **complete** *Fusion Kinetics Compendium* — the earlier list (#38) was only a
partial **39**. With 18 base Kinetics there are **C(18,2) = 153** unique pairings, so the app now carries **all
153** fusions × 9 techniques = **1,377** (up from 39 / 351). The missing 114 were every pairing that involved an
Intelligence / Wisdom / Charisma kinetic against a Strength / Agility / Constitution one, plus the cross pairings
among the INT·WIS·CHA groups.
**How (build).** Rather than keep hand-curating, the generator now treats the **compendium as the single source of
truth**: `scratchpad/parse_full.js` extracts `{name, parents, domain}` for all 153 from the PDF text (via
`pdftotext`), and `gen_fusions_v2.js` **derives** each fusion's attributes and combat **role from the parent
Kinetics** (e.g. Robukinesis=Tank + Pyrokinesis=Controller → "Tank + Controller"), matching the compendium's own
role lines exactly. Technique generation is unchanged from #38 (same pairing/naming/KP/action-economy rules). Net
churn to the deployed 39: a **single** rename — the compendium uses *Thermokinesis* for Pyro+**Hydro**, so the old
Pyro+**Cryo** "Thermokinesis" takes its canonical name **Calorikinesis**.
**Duplicate names.** The compendium **reuses four names** across two pairings each. To keep every fusion a unique
key, the app renames one member of each clash: **Hydro+Cryo → Rimekinesis** (vs Glaciokinesis), **Terra+Holy →
Templakinesis** (vs Sanctukinesis), **Holy+Lumo → Empyreakinesis** (vs Seraphkinesis), **Aero+Natura →
Pollikinesis** (vs Florakinesis).
**Established vs Provisional** now means: **57** fusions the compendium fully specifies (Combat Role + prose) are
*Established*; the **96** listed with only a domain are *Provisional* (their generated technique names/effects are
concept-pass). No app code needed changing — the Kinetics panel, discovery toast, and Combat integration all
iterate `PC.FUSIONS` / `grantedFusionTechniques` generically, so they scaled to 153 for free.
**Compendium framing noted, not enforced (confirmed).** The full PDF says fusions "become available beginning at
Level 15" and require proficiency investment in both parents. The user **confirmed** the app should keep the #38
trigger instead (know both **Adept+** halves → auto-grant, any level); the "Level 15" line stays **GM
flavor/guidance**, deliberately not a coded floor.
**Verified** (Node): 153 fusions / 1,377 techniques, all fusion names unique, all pairs valid, 9 per fusion, no
base-name collisions; a seeded pair on a **new** fusion (*Blazing Speed + Frost Nova* → **Calorispeed**, Calorikinesis)
auto-grants and unlocks correctly; empty known-set grants nothing. Action spread ~981 Action / 386 Bonus / 10
Reaction. Docs (`FUSIONS.md`, `GAME_RULES.md`, `CLAUDE.md`) updated to 153 / 1,377. Cache-buster **v=61**.

---

### 40. Fusion chakra penalty — a damaged parent chakra weakens the fusion (the deferred rule, now built)
**Decision.** Entry #38 shipped fusions with the chakra-damage penalty **deferred** and `FUSIONS.md` flagged it
"planned, not yet implemented." Now implemented. A fusion is tied to **both** parent Kinetics' chakras, so the
rule the compendium implied — *"if either parent chakra is damaged, the fusion's techniques are less
effective"* — is enforced as: **a fusion answers to whichever of its two parent chakras is the more damaged.**
Concretely it inherits the same 4-step chakra track base techniques already use, but keyed on the **worse** of
the two parents: **disadvantage** if *either* parent chakra has ≥1 hit, modifier **halved** at 2 / **removed**
at 3 (worse chakra's multiplier applied to the technique's own scaling attribute), and **locked out** if
*either* parent chakra hits 4. A fusion whose parents share one attribute (e.g. Nuclekinesis = STR + STR)
collapses to the single-chakra case — identical to a base technique.
**Why "worse of the two" (not average / not primary-only).** The design note already said *"if **either**
parent chakra is damaged."* Worst-of-two is the faithful reading and the punishing-but-clean one: a fusion
demands **both** channels open, so hurting *either* half degrades it. It's also a one-line extension of the
existing single-chakra logic (no new penalty math), and it makes the chakra-targeting game matter more against
fusion-users — you can shut a fusion down by hitting the *undamaged-looking* half.
**How (code).** `app/play.js` gained fusion-aware helpers — `techChakraAttrs(t)` (a fusion's two parent attrs,
from `PC.kinetic(parent).attr`; a base technique's single `t.attr`), `techChakraAttr(t)` (the most-damaged of
them), and `techAdjMod` / `techIsDisadv` / `techIsLocked` / `techLockReason` built on it. Every
technique-use path (`attackTechnique`, `castAoE`, `damageTechnique`, `useTechnique` heal/grant, sustained
`toggleSustained`, melee-augment `damageWith`) and the technique-card renderer now route through these instead
of the raw `t.attr`. Base techniques and same-attr fusions are byte-for-byte unchanged (helpers collapse to the
single attr). Added a red **`.fusion-penalty`** card note (*"⚠ Sacral chakra (parent) damaged — modifier
halved"*) so the "less effective" state is visible, not just felt on the dice.
**Verified** (Node + Playwright). Node: a STR-primary fusion (**Ecligrip** = Robukinesis STR + Umbrakinesis AGI)
resolves its governing chakra to **AGI** when AGI is the hurt half, to **STR** when STR is locked; a base STR
technique stays *Healthy* while AGI is damaged (no regression); a STR+STR fusion answers only to STR. Playwright
(real UI, seeded character knowing *Kinetic Grip* + *Shadow Step* → auto-granted **Ecligrip**): at **AGI 0** no
penalty / usable; at **AGI 2** the STR-primary fusion shows *"⚠ Sacral chakra (parent) damaged — modifier
halved"* though STR is untouched; at **AGI 4** the Use button disables with *"Sacral chakra locked out"*; healing
back to 0 restores it. No console errors. Docs (`FUSIONS.md`, `GAME_RULES.md` HIDDEN section) flipped from
"planned" to implemented; `README.md` untouched (fusions stay secret). Cache-buster **v=62**.

---

## Deferred / future ideas
- **Cross-device character sync** (backend + simple login) — the big one.
- **Export / Import** characters to a JSON file (a simpler manual bridge / backup) if we want it before
  full sync.
- Heritage-opened starting weapons granting **actual proficiency** (currently start-only).
- A real **XP-to-next-level** bar once Luke sets the thresholds.
- Off-PC backup of the **source** — ✅ done (public GitHub repo `stbkat-ai/psion-chronicles`).

---

*Standing rule (recorded in `CLAUDE.md`): this log is updated as part of every feature change — a new
entry or revision here, the matching `GAME_RULES.md`/`README.md` sections, and a `git push` (which
auto-deploys GitHub Pages) — automatically, without needing to be asked.*
