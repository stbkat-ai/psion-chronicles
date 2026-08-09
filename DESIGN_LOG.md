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

### 41. Heritages grant a fixed signature weapon-subtype proficiency
**Decision.** Each of the 8 Regional Heritages now grants proficiency with **one specific weapon subtype** — its
**signature weapon** — on top of its Fighting Style, Combat Skills, armor proficiency, traits, and flaw. The user
chose **fixed per heritage** (thematically assigned, like every other heritage grant) over a player-chosen pick.
Assignments: North America → **Revolvers**, South America → **Blowguns**, Europe → **Great Swords**, United
Kingdom → **Fencing Swords**, Africa → **Maces**, Middle East → **Short Swords**, East Asia → **Full Fists**,
Oceania → **Daggers** — each matching its Fighting Style flavor (Fencing→Fencing Swords, Twin Fang→Daggers,
Frontier Gunslinging→Revolvers, etc.).
**Subtype vs. type — why it matters.** Backgrounds grant whole-**type** proficiency (all of "Heavy Weapons").
This grant is finer: it's one **subtype** (e.g. *Great Swords*), so a Europe character is proficient with Great
Swords but **not** the rest of Heavy Weapons. Items already carried `it.subtype` (from the crafting/catalog
system), so the mechanic keys straight off it. If a character is already proficient with the whole parent type,
the subtype grant simply adds nothing — no double-dip, no conflict.
**How (code).** `data.js` — added `weaponSubtype: "…"` to all 8 heritages. `rules.js` — new
`PC.heritageWeaponSubtype(name)` and `PC.weaponTypeOfSubtype(subtypeName)` (maps a subtype back to its parent
weapon type via `PC.WEAPON_TYPES[].subtypes`). `play.js` — `proficientWithType(it)` gains a first check:
`it.subtype === PC.heritageWeaponSubtype(rec.heritage)` → proficient. The whole attack/damage/called-shot chain
already routes through `proficientWithType`, so the proficiency bonus, the ✓prof tag, and the inventory
"(not proficient)" line all update for free. Also surfaced the grant in three places: the creator **Heritage
step** ("Weapon Proficiency" section), the **Review** summary (a ⚔ prof pill), and the play sheet's **Traits**
tab (a "Weapon Proficiency" panel).
**Verified** (Node + Playwright). Node: all 8 heritage→subtype→parent-type mappings resolve and are valid catalog
subtypes; a replicated `proficientWithType` returns **true** for the granted subtype, **false** for a
different subtype of the *same* parent type (Europe: Great Swords ✓, Axes ✗), false for unrelated weapons, true
for an item flagged `proficient`. Playwright (real UI, Europe + Assassin background which lacks Heavy Weapons):
the Traits tab shows the panel; an equipped **Zweihander (Great Swords)** reads *"Attack adds STR +1 + prof +3"*
while a **War Axe (Axes, same Heavy Weapons type)** reads *"(not proficient)"*; the creator Heritage step shows
the *"Trained in Great Swords"* hint. No console errors. Docs updated (`GAME_RULES.md` §3b + a heritage→subtype
table, `README.md`, this log). Cache-buster **v=63**.

---

### 42. XP thresholds + a Soul-Pool progress bar (the deferred "XP-to-next-level" work)
**Decision.** Gave the app a real XP→level link. The **Soul Pool IS cumulative XP**; a placeholder threshold
curve now drives an **XP-to-next-level bar** and a "ready to level" signal. The user asked to lock in numbers now
("if Luke wants to change them later he can").
**The curve (placeholder).** Advancing from level *L* to *L+1* costs **100 × L² XP**; totals are the running sum
— L2 = 100, L5 = 3,000, L10 = 28,500, L15 = 101,500, L20 = 247,000, L30 = **855,500**. Chosen for a clean,
one-line rule (self-documenting, trivially rescalable) that makes early levels quick and high levels a grind, with
milestone levels landing on round totals. Lives in `data.js` as `PC.XP_STEP(level)` + a derived
`PC.XP_THRESHOLDS[]` — swap either for the official numbers later; everything downstream derives from it.
**Behavior — GM-driven, not auto-level (option B).** Reaching a threshold does **not** auto-level; it fills the bar
and makes the **Level Up** button pulse gold "ready." A player/GM still taps to confirm. This matches the existing
"tap Level Up when your GM says so" framing, keeps the GM in control of pacing, and is safe against placeholder
numbers (a wrong threshold only changes when the button lights up — it never jumps someone's level). Level Up stays
tappable at any XP (GM discretion). XP is cumulative and never resets on level-up.
**How (code).** `data.js` — `PC.XP_STEP` / `PC.XP_THRESHOLDS`. `rules.js` — `PC.xpForLevel(level)`,
`PC.levelForXP(xp)`, and `PC.xpBar(xp, level)` → `{ maxed, curFloor, nextAt, into, span, remaining, pct, ready }`
for the bar. `play.js` — the **Soul Pool editor** now shows the bar + "N XP to Level L+1" (or "ready"), and the
Level Up button gets a gold pulse when ready; added an `elFill()` bar helper. `app.js` — the **Level Up screen**
gains a Soul-Pool panel with the same bar and its own XP adjusters (−100/−10/+10/+100/Add), and its Level Up button
pulses when ready. `styles.css` — `.xp-wrap/.xp-head/.xp-sub/.xp-ready` + an `xp-pulse` keyframe on `.xp-ready-btn`.
**Verified** (Node + Playwright). Node: the 30-row table matches the formula exactly; `levelForXP` maps boundary
values correctly (99→L1, 100→L2, 28,500→L10, 855,500→L30); `xpBar` returns the right pct/remaining/ready/maxed.
Playwright (real UI): L7 with 12,000 XP shows "2,900 / 4,900 · 2,000 XP to Level 8" (not ready); at exactly
14,000 XP it flips to "Ready to level up →" with the pulsing button in both the Soul editor and Level Up screen;
L30 shows "Maximum Soul Level reached." No console errors. Docs: `GAME_RULES.md` (curve + full threshold table),
`README.md` (player-facing bar description), this log. Cache-buster **v=64**.

**Follow-up fix (v=65) — XP kept consistent with level.** First playtest surfaced a bug: adding XP didn't move the
bar for an existing character. Cause — leveling is button-driven, so level and XP had **decoupled** (a character
leveled to 10 with the button still had 0 XP). The bar measures from the *current level's* floor upward, so any XP
below that floor (28,500 at L10) showed 0% and small awards did nothing visible. Fix: enforce the game's own rule
that the **Soul Pool is cumulative XP** — a level-L character always has at least `PC.xpForLevel(L)`. Normalized on
load (`ensurePlay` in play.js, and the Level Up screen in app.js) so existing characters backfill to their level's
floor, and the Level Up button now bumps `rec.xp` to the new level's floor (preserving any overflow). Verified:
a seeded L10/0-XP character backfills to 28,500 on open, and +50 XP then moves the bar to 0.5% ("50 / 10,000") and
persists 28,550. No console errors.

---

### 43. Otherkin system — the Soul Creature (built with the Kitsune as the worked example)
**Decision (with Luke, the system's designer).** Built the whole Otherkin framework and shipped the **Kitsune** as
the first of a planned **9** (one themed per background; the rest added one at a time). Locked rules:
- **Chosen once at Soul Level 15, permanent, and a FREE choice** (not background-locked) — deliberately, so the
  **fixed** boost is a real trade-off (a maxed-AGI character won't want +3 AGI).
- Grants **four** things: (1) a background-style **attribute + pool boost** (fixed, no scaling, stacks on the
  background boost); (2) **one unique Kinetic** named to embody the creature (never "-kinesis"), whose **6
  techniques auto-grant free** (no TP) on the every-3-levels beat **15/18/21/24/27/30**, cost KP, and are governed
  by the **Heart chakra**; (3) **one signature ability**, rest-gated like a **Barbarian's Rage** — a use count that
  refreshes on rest and scales **both power and number of uses** across **6 tiers** (same beat); (4) all of it
  answers to the **Heart chakra**.
- **Heart chakra now acts like the other six** (Luke's call): a real **4-hit track** (disadvantage → halve →
  remove → **dormant at 4**), healing on rest, but instead of an attribute it weakens **all** Otherkin powers.
**The Kitsune** (schema-defining example): Kinetic **Fox Mischief** (AGI), boost **+3 AGI / +10 Body Pool**,
signature **Kitsune Disguise** (short-rest refresh, 1 use → 6 across tiers). Six "tails": Foxstep (15) · Foxfire
Feint (18) · Mistveil (21) · Bewitching Flame (24) · Shadow Clone (27) · Foxfire Rush (30). Luke gave the boost,
signature, and three technique concepts (shadow clone, non-combat distraction, terrain-ignore mobility); the other
three + the KP/action/ordering were drafted to spec and approved.
**How (code).** `data.js` — `PC.OTHERKIN` (+ flattened `PC.OTHERKIN_TECHNIQUES`). `rules.js` — `otherkin()`,
`otherkinTechniquesAt()`, `otherkinSignatureTier()`, and shared `charAttrBoosts()/charPoolBoost()` (background +
awakened Otherkin) now used by BOTH play.js and the roster so HP/scores match everywhere; `technique()` resolves
Otherkin techniques. `play.js` — boosts flow through the shared helpers into `liveScores`/`maxHP`; Otherkin techs
fold into Combat and answer to the **Heart** chakra via the existing `techChakraAttrs` path (Heart lockout
suppresses them and the signature; a hurt Heart shows the "⚠ Heart chakra damaged" note); the **Heart chakra** got
a real pip track on the Chakras tab + rest healing; the **♥ Otherkin tab** became a permanent-choice **picker** →
Soul-Creature **sheet** (boost, six tails unlocked/upcoming, signature card with a rest-gated **use counter**, tier
ladder, Heart status). Signature uses tracked on `play.sigUses`, refreshed by `refreshSignature()` on short/long
rest. `styles.css` — Otherkin picker/sheet/signature + Heart-pip styling.
**Verified** (Node + Playwright). Node: level-gated unlocks (1 tech + tier I at 15 → 6 + tier VI at 30), boost merge
(Body Builder + Kitsune → STR3/AGI3, Body 20), `technique()` resolution. Playwright (real UI): picker shows Kitsune
with "+3 AGI · +10 Body (HP)"; choosing sets it and boosts **maxHP 65→78, AGI 16→19**; sheet shows Tier I 1/1 use +
Foxstep unlocked with the other five locked at their levels; **Heart set to 4** disables Foxstep and the signature
Use button ("dormant until you rest"); **Heart at 2** shows "⚠ Heart chakra damaged — modifier halved" on the tail
and the hurt status line; signature **Use → 0/1**, **Short Rest → 1/1**; the Heart legend row has a real 4-pip
track; L30 shows all six tails + Tier VI 6/6 and the tails appear in Combat (Action-tail visible, Bonus-tails under
the pull-down). No console errors. Docs: `GAME_RULES.md` (Otherkin section + Heart chakra now a hit-track + resolved
open-question), `README.md`. Cache-buster **v=66**.

---

### 44. Otherkin #2 — the Siren (Seductive Voice)
**Decision (with Luke).** Second Otherkin added; the framework held, so this was purely a new `PC.OTHERKIN` data
entry. **Siren** · Kinetic **Seductive Voice** (CHA) · Boost **+3 CHA / +10 Mind Pool** (a caster-controller whose
own boost feeds its songs) · Signature **Siren's Song** (enchant + command NPCs; short-rest refresh; 1→6 uses,
scaling from one thrall to a mass enthrall). Six mermaid/siren "verses": Tidecaller's Grace (15, swim speed +
underwater breathing — Luke's must-have) · Luring Melody (18, non-combat charm) · Enthralling Note (21,
single-target charm) · Undertow (24, 15-ft line AoE, 3d6 cold + prone) · Siren's Lament (27, disadvantage aura) ·
Charybdis (30, 20-ft whirlpool, 5d6 cold + drag). Luke gave the boost, signature, kinetic, and the swim theme;
the rest was drafted to spec and approved as-is.
**Two fixes surfaced by the second creature.** (1) The Otherkin card **hardcoded the fox emoji** — added an
`emoji` field per Otherkin (🦊 / 🧜‍♀️) and the picker/sheet now read it. (2) The capstone's original name
**"Maelstrom" collided** with an existing base technique (an AGI/wind one), so `PC.technique("Maelstrom")` resolved
to the wrong power — renamed it **Charybdis** (the mythological whirlpool; more evocative anyway). Added a
cross-pool name-collision check to the verification step so future Otherkin get caught early.
**Verified** (Node + Playwright): 2 Otherkin / 12 techniques, all names unique across the base + fusion + Otherkin
pools, Charybdis resolves to the Siren; picker shows both with correct boosts and emoji; choosing Siren applies
**CHA +3 (16→22 with the Musician background) and +10 max KP**, renders all six verses at L30 with Signature Tier
VI 6/6, and Charybdis is playable in Combat. No console errors. Docs (`GAME_RULES.md`, `README.md`) updated to 2 of
9. Cache-buster **v=67**.

---

### 45. Otherkin #3 — the Gryphon (Sovereign Wing), + a rest-type bug the long-rest signature exposed
**Decision (with Luke).** Third Otherkin. **Gryphon** · Kinetic **Sovereign Wing** (hybrid INT/STR) · Boost
**+2 INT / +1 STR / +5 Body / +5 Mind** (a split boost for its split eagle-lion nature) · Signature **Sovereign's
Presence** — a regal fear/rally aura. Luke gave the boost + the two anchors ("regal presence" and "grant flight
somehow"); the rest was drafted to spec and approved. Six "ascensions": Take Wing (15, **flying speed** — the
flight ask) · Eagle's Eye (18, keen-sight scouting) · Buffeting Gale (21, cone AoE + prone) · Rending Talons (24,
STR dive strike, advantage if you flew) · Guardian's Aegis (27, +2-Defense ally aura — griffins as guardians) ·
Sovereign's Descent (30, radius AoE + prone). Mixes STR (talons/wings) and INT (sight/command) per-technique.
**First LONG-rest signature — and the bug it caught.** Sovereign's Presence refreshes on a **long** rest (a
battle-shaping aura should be rationed), unlike the Kitsune/Siren short-rest signatures. That exposed a latent bug:
`refreshSignature()` refilled the signature on **any** rest, ignoring `signature.rest` — so a long-rest signature
would have wrongly recharged on a short rest. Fixed: `refreshSignature(kind)` now refills only when
`kind === "long"` (a full recovery refills everything) **or** `signature.rest === kind`; the short/long rest paths
and the awaken-on-pick init pass the right kind. This was invisible with two short-rest creatures — the third
creature's variety surfaced it.
**Verified** (Node + Playwright): 3 Otherkin / 18 techniques, 0 name collisions across all pools (the safety check
from #44); picker shows all three with emoji; choosing Gryphon applies **INT 16→21, STR 16→17, +5 HP / +5 KP**;
the long-rest signature **does not** refresh on a short rest (5/6 → 5/6) but does on a long rest (→ 6/6), while the
Siren's short-rest signature still refreshes on a short rest (regression check passed). No console errors. Docs
(`GAME_RULES.md`, `README.md`) updated to 3 of 9. Cache-buster **v=68**.

---

### 46. Otherkin #4 — the Lycan (Lycanthropy), and a new signature archetype: TRANSFORMATIONS
**Decision (with Luke).** Fourth Otherkin, and the first whose signature isn't a simple activation — it's a
**transformation**. **Lycan** (emphatically **not** a Werewolf — a distinct being in Luke's setting) · Kinetic
**Lycanthropy** (CON) · Boost **+3 CON / +10 Body Pool**. Signature **Lycan Shift**: toggle into a man-wolf hybrid
(long rest, 1 → 6 uses). While shifted you gain **+3 × tier to STR/AGI/CON breaking the soft cap of 30**, **natural
claws** (unarmed strikes become 2d6), and **+2 Defense** from thick fur; **revert at will** (free), and **at 0 HP
you revert to human form at half HP** instead of dropping. Six techniques (theme: body enhancement, ≥1 self-heal):
*Lunar Leap* (15, mobility) · *Regeneration* (18, self-heal) · *Thick Hide* (21, damage reduction) · *Savage
Pounce* (24, leap-strike) · *Rampage* (27, AoE) · *Bloodrage* (30, sustained body buff). **Mid-build tweaks from
Luke:** cut the original "Apex Predator" (redundant with the Shift's own buff, too strong) for **Lunar Leap**, and
moved Lunar Leap to the level-15 opener slot.
**New engine capability — `signature.transform`.** A signature can now carry a `transform: { attrs, perTier,
dsBonus, clawDie }` block. play.js gained: `transformActive()`/`transformAttrBuff()` (folded into `liveScores` via
a new `allAttrBuffs()`, so the buff flows through every derived stat and can exceed 30 since the mod table already
extends past it); `useSignature()` now **toggles** the shift (activate spends a use, `revertTransform()` is free);
`defenseScore()` adds the fur bonus; `unarmedProfile()` swaps in the claw die (both the Unarmed card and the
opportunity-attack card show "🐺 Claws"); the **0-HP revert** is enforced in `ensurePlay` (catches every damage
path) and **persists**; long rest ends the shift; a locked **Heart** chakra suppresses the whole transformation
(the signature card shows a "suppressed" banner). The Otherkin signature card renders **Transform/Revert** with a
live "🐺 SHIFTED — +N STR/AGI/CON · +2 Defense · claws (2d6)" banner.
**Verified** (Node + Playwright): 4 Otherkin / 24 techniques, 0 name collisions; choosing Lycan applies the boost;
transforming at Tier VI gives **+18 to each body attribute** (maxHP 82 → 136 as the body pool absorbs it, past the
cap), **+2 Defense**, **claws 2d6**; **revert** and the **0-HP → human at half HP** (41/82) both work and persist;
the long-rest signature refills only on a long rest (which also ends the shift), not a short one. No console errors.
Docs updated to 4 of 9 (incl. a note that some signatures are transformations). Cache-buster **v=69**.

---

### 47. Otherkin #5 — the Troll (Troll's Fury), completing the body-attribute Otherkin
**Decision (with Luke).** Fifth Otherkin, the second **transformation** — so it reused the `signature.transform`
machinery from the Lycan with **no new engine code**. **Troll** · Kinetic **Troll's Fury** (STR) · Boost
**+3 STR / +10 Body Pool** · Signature **Giant Form** — grow to giant size (long rest; 1 → 6 uses), granting
**+2 × tier to STR/CON** (1.5× size + Tier I, up to ~2.5× and +12 at Tier VI, breaking the cap); revert at will,
0-HP reverts you at half HP (inherited from the transform system). Six techniques — heavy single-target melee plus
the one mobility Luke specified: *Smash Through* (15, barrels through terrain/cover in the path — auto-hits the
obstacle; **destroyed → keep moving, else halt**), *Crushing Blow* (18), *Bonebreaker* (21, +Weakened), *Pulverize*
(24, ignores cover/armor Defense), *Grapple Slam* (27, +prone), *Cataclysm* (30, +Stunned). Damage climbs on the
heavy dice (d10 → d12, up to 6d12). This **completes the body-attribute Otherkin**: Kitsune (AGI), Lycan (CON),
Troll (STR).
**One generalization the second transform forced.** The "SHIFTED" banner (and its wording) had **hardcoded the
Lycan's 🐺 emoji**; generalized it to the Otherkin's own `emoji` (now "🧌 TRANSFORMED — …" for the Troll) and
reworded to "Transformed" so it isn't wolf-specific. Giant Form declares no `clawDie`/`dsBonus`, so the banner
cleanly shows just the attribute line and unarmed strikes stay 👊 (no claws) — confirming the transform pieces are
properly optional.
**Verified** (Node + Playwright): 5 Otherkin / 30 techniques, 0 collisions; choosing Troll applies +3 STR;
Smash Through renders as an auto-hit Bonus action; the "🧌 TRANSFORMED" banner uses the Troll emoji and unarmed
stays 👊. No console errors. Docs updated to 5 of 9. Cache-buster **v=70**.

**Follow-up (v=71) — Giant Form re-scaled + a generalized transform formula.** Luke caught that my first pass read
"scale up with tiers" as **+2 per tier** (climbing to +12 at Tier VI) when he wanted a **gentle** climb. Re-scaled to
**+2 at Tier I, +1 each tier → +7 at Tier VI**; size and uses still scale faster than the stat bonus. The old
`transform.perTier` (a flat `tier × perTier`) couldn't express a base-plus-increment curve, so the transform config
now uses **`base` + `step`** (bonus = `base + (tier−1)·step`), via a new `transformAmount(tier)` helper used by the
buff, the activation log, and the banner. This is strictly more general: the Lycan's curve is unchanged (`base 3,
step 3` = the old `×3`: 3/6/9/12/15/18), and the Troll is `base 2, step 1`. Also confirmed (Luke's follow-up) the
buff **breaks the soft cap of 30** — it flows through `liveScores` uncapped and the mod table extends past 30:
verified a Troll going STR **30 → 37** shifted (mod +7), and the Lycan STR **27 → 45**. No console errors.

---

### 48. Otherkin #6 — the Unicorn (Mystic Grace); all six attributes now covered
**Decision (with Luke).** Sixth Otherkin, a WIS/mind creature and the third **transformation**. **Unicorn** ·
Kinetic **Mystic Grace** (WIS) · Boost **+3 WIS / +10 Mind Pool**. Signature **Mystic Steed** — become a radiant
steed (long rest; 1 → 6 uses): a gentle **WIS/CHA climb (+2 at Tier I, +1/tier → +7, breaking the cap)** **plus
double movement speed**. Per Luke, the movement multiplier is **flat** (always ×2) and does **not** scale with tier.
Six "graces" leaning into the unicorn legend (elusive, beautiful, enchanting, healing): *Healing Horn* (15, heal) ·
*Elusive Grace* (18, evade/hide) · *Enchanting Gaze* (21, charm) · *Radiant Beauty* (24, radiant AoE + dazzle) ·
*Purifying Light* (27, cleanse + heal) · *Aurora Blessing* (30, mass heal + advantage). Two real self-heals plus a
cleanse make it the healer of the roster.
**New transform capability — `moveMult`.** The transform block now supports an optional `moveMult`, wired into
`effectiveMovement()` (applied after armor/leg penalties, so a shifted Unicorn moves ×2) and surfaced on the shift
banner ("×2 movement"). It is intentionally NOT run through `transformAmount`, so it stays flat while the attribute
bonus scales — matching Luke's "don't scale the movement." Only walking movement is doubled; climb/jump/swim are
separate speeds and untouched.
**Milestone:** with the Unicorn (WIS) and the earlier Siren (CHA), **all six attributes now have an Otherkin** —
STR (Troll), AGI (Kitsune), CON (Lycan), INT (Gryphon), WIS (Unicorn), CHA (Siren).

**Follow-up (v=74) — invocation vs. physical transformation, + Gryphon shown as a hybrid.** Luke clarified the
Mystic Steed is **not** a physical transformation — the character doesn't become a unicorn, they **channel its
abilities**. Added a `transform.physical` flag: the Lycan and Troll are `physical: true` (they change shape → read
as "Transform/Revert", banner "TRANSFORMED", and **revert at 0 HP** to normal at half HP), while the Unicorn omits
it → reads as "Invoke/Dismiss", banner "INVOKED", and has **no 0-HP revert** (there's no form to collapse). Wording
is driven by a `transformLabels()` helper; the 0-HP revert in `ensurePlay` now gates on `physical`. Verified: the
Unicorn shows Invoke/INVOKED and stays active at 0 HP; the Lycan still shows Transform and reverts at 0 HP to half.
Also, per Luke, the **Gryphon is an INT/STR hybrid** — its boosts were already `{INT:2, STR:1}`; surfaced the
governing attribute on the Otherkin picker/sheet (now "Sovereign Wing · INT/STR", single-attr for the others).
**Verified** (Node + Playwright): 6 Otherkin / 36 techniques, 0 collisions; choosing Unicorn applies +3 WIS;
transforming at Tier VI gives **+7 WIS/CHA** (WIS 39, CHA 31 — past the cap) and **doubles movement (35 → 70 ft)**
with a "🦄 TRANSFORMED — +7 WIS/CHA · ×2 movement" banner; climb/jump/swim stay un-doubled. No console errors. Docs
updated to 6 of 9. Cache-buster **v=73**.

---

### 49. Otherkin reveal moved to the Level Up screen
**Decision (with Luke).** The Otherkin is no longer chosen from the play sheet — the reveal and one-time selection
now happen on the **Level Up screen**, which is the natural home for a level-15 milestone. When a character reaches
Soul Level 15, leveling toasts "♥ Your Heart chakra opens — your Otherkin awakens," and the Level Up screen shows an
awakening banner followed by **each Otherkin as a full breakdown card** — boost, signature (kind + rest + tier-I
effect + "grows every 3rd level"), and **all six techniques with their unlock levels and effects** — each with a
permanent Choose button. Once chosen, the Level Up screen shows a compact summary and the play sheet's **♥ Otherkin**
tab becomes the Soul-Creature sheet as before.
**How (code).** `app.js` — new `otherkinLevelUpSection()` / `otherkinChooseCard()` (renders the breakdown from
`PC.OTHERKIN`; choosing sets `rec.otherkin` + persists — signature uses default to full via play.js's lazy
`sigUsesLeft`), inserted into `renderLevelUp` when `level ≥ 15`; the level-up button toasts the awakening on
crossing to 15; removed the old "mechanics coming soon" hint. `play.js` — the play-sheet Otherkin tab's not-chosen
state (`buildOtherkinPicker`) no longer shows a picker; it announces the awakening and links to Level Up via
`App.openLevelUp`. `styles.css` — Level Up breakdown card styles.
**Verified** (Playwright): a level-15 character with no Otherkin sees the awakening banner + 6 breakdown cards (each
listing all six techniques + the signature) on Level Up; choosing Unicorn sets it and the play sheet then shows the
Soul-Creature sheet (no picker); the not-chosen play tab shows "♥ The Otherkin Awaits" with an "Open Level Up"
button. No console errors. Docs (`GAME_RULES.md`, `README.md`) updated. Cache-buster **v=75**.

---

### 50. Otherkin #7 — the Sphynx (Sphynx Riddles); INT gets a standalone, only hybrids remain
**Decision (with Luke).** Seventh Otherkin, the last pure-mind creature (INT). **Sphynx** · Kinetic **Sphynx
Riddles** (INT) · Boost **+3 INT / +10 Mind Pool**. Signature **Cosmic Knowledge** — a plain **activated** signature
(no transform, so it reused the existing use-counter path with no new engine work): once per long rest (1 → 6 uses,
+1/tier) gain **advantage on any INT skill check** or **cast any INT kinetic technique regardless of level,
knowledge, or KP cost** — a GM-adjudicated genius-insight the app just meters. Six riddles themed on riddles / time
/ otherworldly knowledge: *Vexing Riddle* (15, Confuse) · *Ancient Lore* (18, knowledge utility) · *Temporal Slip*
(21, Slow) · *Psychic Lance* (24, INT psychic attack) · *Foresight* (27, sustained — uses the existing
`buff.dsFromMod` to add INT to Defense + advantage on saves) · *Temporal Collapse* (30, INT-psychic AoE + lose next
turn).
**Verified** (Node + Playwright): 7 Otherkin / 42 techniques, 0 collisions; the signature shows a plain "Use Cosmic
Knowledge" button (no shift banner) and meters 6 → 5 uses; **Foresight** raised Defense by the INT modifier
(9 → 14) when activated. No console errors. Docs updated to 7 of 9. Cache-buster **v=76**.
**Roster status:** all six attributes now have a standalone Otherkin (STR Troll, AGI Kitsune, CON Lycan, INT
Sphynx, WIS Unicorn, CHA Siren), plus the Gryphon (INT/STR hybrid). **Two hybrids remain.**

---

### 51. Otherkin #8 — the Wyvern (Draconic Fire), first hybrid; scaling flight + tier-gated traits
**Decision (with Luke).** Eighth Otherkin, the first of the two hybrids. **Wyvern** (WIS/AGI) · Kinetic **Draconic
Fire** · Boost **+2 WIS / +1 AGI / +5 Body / +5 Mind**. Signature **Wyvern's Wings** — a physical transformation
(short rest) with the most elaborate signature yet, per Luke's spec and approved trait ladder: a **scaling flight
speed** (1.5× movement at Tier I, +0.5×/tier → 4×) shown as a **separate Fly speed**, plus **tier-gated traits** —
a **tail** (Tail Whip, a Bonus-Action unarmed strike using AGI) at Tier II, **+2 Defense scaled hide** at III,
**d8 fangs & claws** (upgrading unarmed *and* Tail Whip) at IV, fire resistance (flavor) at V, and +1 damage die
(flavor) at VI. Six fire techniques (Ember Bolt, Draconic Roar, Fire Breath cone, Scorching Talons, Molten Scales
sustained, Inferno). No attribute buff — the signature is all mobility + traits.
**New engine capabilities.** The transform block grew several optional, backward-compatible fields: `moveMult` now
accepts **`{base, step, fly}`** (a scaling multiplier; `fly` renders it as a distinct **Fly speed** via new
`flySpeed()` instead of multiplying walking) alongside the old flat number (Unicorn); **`dsFromTier`** and
**`clawFromTier`** gate the existing `dsBonus`/`clawDie` to a tier; and a **`tailWhip: {fromTier, attr}`** grants a
new Bonus-Action combat card (`tailWhipCard`, using AGI + the claw die when grown). Added `it.attr` override to
`damageWith` so the tail strikes with AGI. The shift banner now guards the (absent) attr bit and lists whatever the
current tier grants (flight/Defense/claws/tail). Speeds row shows **Fly** while winged.
**Verified** (Node + Playwright): 8 Otherkin / 48 techniques, 0 collisions; across tiers the flight scaled
1.5×→4× (Fly 53→140 ft, walking unchanged at 35), the **tail** appeared at II (AGI · 1d4), **+2 Defense** at III,
and **claws upgraded the tail to d8** at IV+ — banner and Combat card all correct. No console errors. Docs updated
to 8 of 9. Cache-buster **v=77**.

---

### 52. Otherkin #9 — the Strigoi (Blood Rites): the roster is COMPLETE (9 of 9)
**Decision (with Luke).** The ninth and final Otherkin — a **Crusnik-inspired** apex vampire, renamed and reworked
to avoid IP and to root it in real folklore (the Romanian **strigoi**, reinterpreted as a benevolent apex that
preys on predators). **No appearance is written into the mechanics** — per Luke, each Strigoi's wings and weapons
are the player's to describe. **Strigoi** (CON/CHA) · Kinetic **Blood Rites** · Boost **+2 CHA / +1 CON / +5 Body
/ +5 Mind**. Six vampiric techniques (Hemal Bolt, Mesmerize, Sanguine Drain self-heal, Mist Form, Nightswarm,
Blood Moon).
**Signature — Vampiric Form: the most elaborate build, a STAGED additive transformation.** Every tier adds a trait,
none replace: **Tier I** a scaling **Defense MULTIPLIER** (×1.5 → ×4); **II** **+1 to all attributes** (→ +5,
breaking the cap); **III** **Scratch & Bite** bonus attacks (Bite lifesteals); **IV** a **Blood Weapon** — a
dual-modifier (CON + CHA), die-scaling (d6→d8→d10) melee Action; **V** an on-activation **"elemental current"**
burst (heal 50% max HP + clear all damaged limbs and chakras); **VI** a **flight speed = movement**.
**New engine capabilities (all optional/backward-compatible on the transform block):** `dsMult` (scaling Defense
multiplier), a full-attribute buff via `base:0/step:1` (naturally +0 at Tier I, +1/tier after), `moveMult.fromTier`
(tier-gated flight), `onActivate {fromTier, healPct, recoverLimbs, recoverChakras}`, and — the big one — a general
**`naturalAttacks`** array that replaced the Wyvern's one-off `tailWhip`: each entry is a to-hit strike with its own
attribute(s), action slot, and die (fixed / `dieLadder` / `useClaw`), rendered as its own combat card. `damageWith`
gained **`attr2`** (a second modifier) and **`lifesteal`** (heal half the strike). The shift banner lists whatever
the current tier grants and collapses six attrs to "all attributes."
**Verified** (Node + Playwright): **9 Otherkin / 54 techniques, 0 collisions**; at Tier VI the Strigoi shows
"+5 all attributes · ×4 Defense · ×1 flight · scratch / bite / blood weapon", attributes hit 28 (past cap),
**Defense = 64 (×4)**, Blood Weapon reads "Action · CON + CHA · 1d10", Fly = movement (40 ft); the **elemental
current** healed 5 → 43 HP (~50%) and cleared damaged limbs + chakras; the **Wyvern's Tail Whip still works**
(regression) via the shared natural-attack system. No console errors. Docs updated to **9 of 9 — complete**.
Cache-buster **v=78**.
**The Otherkin system is finished** — 9 Soul Creatures (all six attributes + three hybrids), a signature toolkit
spanning plain activated abilities, physical transformations, invocations, and staged transforms, with stat buffs
past the cap, natural weapons/armor, scaling movement & flight, DS multipliers, lifesteal, on-activation heals, and
tier-gated traits. All chosen at the level-15 Heart-chakra reveal, governed by the Heart chakra, playable in Combat.

---

### 53. Export / Import characters to JSON — built, then removed
**Decision.** Briefly shipped a client-side Export/Import (JSON backup + transfer) as a stopgap, then **removed it**
the same session: the end vision for the app is **fully networked play** (players and GMs sharing characters,
running campaigns, and communicating — text/voice, private + group — all in-app), so a manual file bridge isn't
wanted. Recorded here so it isn't rebuilt on a vague prompt. Reverted cleanly (roster header/cards back to their
prior buttons; helpers removed). Cache-buster **v=80**.

---

### 54. Conditions / status-effects tracker
**Decision.** Techniques, weapons and hazards throughout the game inflict named conditions — Burning, Rooted,
Stunned, Weakened, Frozen, Blinded, and so on — but until now these lived **only as prose** inside a technique's
effect text, with nothing to track them at the table. Built a proper tracker so a player can flag what's
currently affecting their character.

**How it works.**
- **Catalog** (`PC.CONDITIONS`, 19 entries) — every condition the technique/weapon libraries actually inflict
  (surveyed straight from `data.js`: Rooted, Slowed, Frozen, Prone, Poisoned, Blinded, Burning, Frightened,
  Weakened, Shocked, Stunned, Silenced, Charmed, Confused, Dazzled, Grappled, Bleeding, Marked) **plus** three
  universal tabletop staples a GM reaches for constantly (Prone, Grappled, Invisible). Each entry carries an
  emoji, a **severity band** (`bad`/`warn`/`good`/`neutral`) that colors the chip, and a plain-English effect.
  The effect wording is **placeholder** pending Luke & Brittany's official rulebook, but kept consistent with
  how each word is already used across the techniques.
- **Per-session state** — `play.conditions = [{ key, turns }]`, where `turns` is `null` (lasts until cleared,
  shown as ∞) or a countdown. It **ticks down at End Turn** and auto-clears at 0 (logged to the roll log).
- **UI** — a **Conditions** panel on the Combat tab: **＋ Condition** opens a severity-colored catalog picker
  (tap to apply/clear); each active chip has a **−/∞/+ turn stepper** and an **✕**. The Sheet tab shows a
  **read-only** at-a-glance strip when anything is active. Applying/clearing/expiring all write to the log.

**Why this shape.** Mirrors the existing Limb and Chakra tracking systems (their own panels, auto-applied at
the table) and reuses the app's chip/section-label idiom, so it feels native. Kept purely as a manual tracker —
it does **not** auto-apply mechanical penalties to rolls yet (unlike crippled limbs/chakra hits), because the
official numbers aren't finalized; the descriptions are the reference and the GM adjudicates. Wiring conditions
into the roll math can come once the rulebook locks the values. Cache-buster **v=81**.

---

### 55. App shell — Home screen + the three-section architecture
**Decision.** A deliberate departure from the player-only focus. Luke's vision for the app has **three main
sections**: the **Player** side (built), a **GM** side (build & run whole campaigns), and a **Codex** (look up
everything — items, monsters, Kinetics, etc.). This change introduces the **shell** those sections live in,
starting with the **Home screen** the app now opens on.

**Home screen (per Luke's spec).**
- A **full-screen portrait backdrop** — placeholder gradient for now; Brittany & Luke will drop real artwork in
  later by setting `background-image` on `.home-portrait` (no code change needed).
- **Three section buttons across the bottom, in this exact order: `[GM] [Codex] [Player]`.**
- A **centered sign-in card** that **fades away after "logging in"** (CSS opacity transition). It's UI
  scaffolding only — there's no backend yet — so "Log In" and "Continue as Guest" both just dismiss it. The
  choice is saved locally (`psion_chronicles_session`) so it doesn't reappear every open; "Log out" in the
  Account menu brings it back.
- **Top-right ⚙ Account** menu (display name, status, log out; sync noted as coming) and **top-left 👥 Social**
  menu (friends online, private/group messages — all placeholder). Both slide in over a dismiss-backdrop.

**Architecture.** Added a top-level `screen` router (`"home" | "player" | "gm" | "codex"`) above the existing
player-only state (`playId`/`levelUpId`/`state`), which now only matters inside `"player"`. `applyChrome()`
hides the static header on Home (it's full-bleed with its own corner icons) and hides the player-only
Characters/＋New actions outside the player section. The header **wordmark is now a "back to Home" button**
everywhere. **GM** and **Codex** render styled **"under construction"** placeholders that spell out what each
will hold (seeded from Luke's vision), so the three-section structure is real and navigable even though only
Player is built. Nothing about the player section changed — it's the same roster/creator/play sheet, now reached
via **Home → Player**.

**Why now / why this shape.** Locks in the app's information architecture before the GM and Codex sections get
built, so they have a home to slot into. Kept the login/social/account pieces as clearly-labeled scaffolding
(each notes "coming with the online service") — matching Luke's "focus on the journey, not the destination"
steer: the networked-play plumbing isn't built, but the shell that will host it is. Cache-buster **v=82**.

---

### 56. Fix — Level Up attribute boxes now show background/Otherkin boosts
**Bug.** The Level Up screen's attribute cards showed only the raw `baseScores[a]`, so a character's
**background** and (at 15+) **Otherkin** attribute grants were invisible there — the big number and its modifier
were wrong versus the play sheet and the creator's Review, which both already display the effective score.

**Fix.** The card now shows the **effective** score (`base + PC.charAttrBoosts(rec)[a]`) as the big number with
a green **+N** badge for the boost (the same `.buffup` convention the play Sheet uses), and the modifier is
computed off the effective score. The **±** controls still edit the **base**, and the leveling cap stays on the
base (30) — boosts stack above it, consistent with how boosts break the soft cap elsewhere. Cache-buster **v=83**.

---

### 57. Pool buffs now scale current HP/KP proportionally (full stays full, half stays half)
**Change (Luke's call).** When a technique or ability raises a character's **body pool** (max HP), the current
HP should move with it — a character at full stays full, one at half stays half. This **reverses the earlier
"gain headroom, not HP" design** (#—, the old clamp), where a buff raised only the ceiling and left current HP
where it was.

**How.** `ensurePlay()` now remembers the last max it saw per pool (`play.lastMaxHP` / `play.lastMaxKP`); when
the live max changes — a sustained buff toggling on/off, an attribute edit, a transform — current is rescaled by
the same ratio (`current × newMax ÷ oldMax`, rounded, clamped to the new max). Damage/heal/rest never change the
max, so they never trigger a rescale. On first sight (no stored max yet) it only records the max, so **loading a
character never jumps their HP**. The 0-HP transform-revert still sets HP to half explicitly and syncs the stored
max so the scaler leaves that deliberate value alone. Applied to **both pools** for symmetry — a mind-attribute
buff scales KP the same way a body-attribute buff scales HP.

**Verified** end-to-end (Ki Flame, +2 STR/AGI/CON): full 55/55 → activate → **61/61** (full stays full) →
end → 55/55 (round-trips); at half, 28/55 → activate → **31/61** (ratio preserved). Cache-buster **v=84**.

---

### 58. Level-up 30 cap counts the permanent background/Otherkin boost
**Clarification (Luke).** A background/Otherkin attribute **boost is a permanent** part of your real score, not a
temporary bonus — so it **counts toward the soft cap** and can't break it. When leveling, **base + boost can't
exceed 30**. (Only temporary technique/transform buffs rise above 30.)

**Fix.** #56 made the Level-Up boxes show the effective score (base + boost) but still gated the **＋** button on
`base >= 30`, which let a boosted attribute be leveled to an effective 33 (e.g. base 30 + a +3 background boost).
The gate now checks the **effective** score: **＋** disables at `base + boost >= 30`. So a Body Builder (STR +3)
can level STR only up to base 27 → effective 30, then it stops. The engine sums scores without clamping
(`effectiveScores`), so enforcing it at the leveling gate is what keeps permanent totals ≤ 30 while temporary
buffs still add on top. Docs: GAME_RULES soft-cap + leveling lines. Cache-buster **v=85**.

---

### 59. Codex — the searchable in-game reference (second of the three sections)
**Built.** The **Codex** section (placeholder since #55) is now real: a searchable, browsable reference over the
game data already on `window.PC`. New self-contained module **`app/codex.js`** (`window.PsionCodex`), wired into
the app shell — `screen === "codex"` renders it, and entering from Home resets it to its landing.

**What it covers (14 categories).** Kinetics (18), Techniques (216), Otherkin (9), Backgrounds (9), Heritages
(8), Skills (36), Combat Skills (48), Conditions (19), Weapons (194), Armor (27), Gear (48), Crafting (14
salvage + 16 component parts), a **Reference** tile (chakra chart + limb table), and a **Bestiary** placeholder
(no monster data yet). Every count is read live from the data, so it stays correct as the game grows.

**UX.** A landing grid of category tiles (each with its live count) + a global search box. Search matches
name/subtitle/keywords across every category and groups results by section. Category views list entries
(grouped where it helps — techniques by Kinetic, weapons by type, skills by attribute) and open a detail panel.
Details **cross-link**: a background's free technique → that technique; a heritage's Fighting Style → its skills;
a Kinetic → each of its techniques. Data-driven `SECTIONS` array so adding a category later is a few lines.

**Deliberate exclusion.** **Fusion Kinetics are left out** of the Codex — the standing rule is that fusions are a
hidden system players discover in play (kept out of the README too). They can surface later in the **GM** section
if we want a GM-only reference. Flagging this as a decision point in case Luke wants them in the public Codex.

**Verified** end-to-end (Playwright): 14 tiles, all sections list/detail/cross-link/search correctly, 0 console
errors. Cache-buster **v=86** (added the 7th asset tag — `codex.js`). Bestiary + a narrative "full rulebook"
view remain as follow-ups.

---

### 60. Fusion Kinetics added to the Codex — reverses the "hidden system" stance
**Decision (Luke).** "I want everything we've built to be available in the Codex." That directly answers the
decision I flagged in #59: **Fusion Kinetics are now IN the Codex**, reversing the earlier design where fusions
were GM-only and kept out of player-facing surfaces (a "hidden system players discover in play"). The rest of
the built content was already in the Codex — an audit confirmed fusions were the only real gap.

**Build.** New **Fusion Kinetics** section (15th category, 153 entries) listing every pairing of the 18 Kinetics,
grouped by first parent. Each detail shows the two **parent Kinetics** (cross-linked), the fused attrs/role/domain,
and the fusion's **9 fusion techniques** (grouped by tier, with the parent-technique pair each one fuses and the
free-when-both-parents-known note). The 1377 fusion techniques are keyed to their fusion once at module load
(`FUSION_TECHS`/`FUSION_KW`) so search stays fast; a fusion-technique name searches straight to its fusion
(verified: "Nuclegrip" → Nuclekinesis).

**Doc impact.** The README Codex bullet now lists Fusion Kinetics (previously it noted them as deliberately
excluded). **Note:** `CLAUDE.md` still describes fusions as "GM-only … keep it out of the README" — that standing
rule is now superseded for the Codex by Luke's call; left CLAUDE.md for Luke to amend rather than editing his
instruction file unprompted. Cache-buster **v=87**.

---

### 61. Codex-sync standing rule + made the Codex more self-maintaining
**Concern (Luke).** "Every time we edit items or rules elsewhere, the Codex needs to be updated." Made this a
first-class rule and cut the manual surface so it mostly takes care of itself.

**Reality.** The Codex holds **no content of its own** — it reads live from `window.PC` at render time, the same
data the player app and rules engine use. So editing an existing item, technique, background, condition, rule
value, etc. in `data.js`/`items.js` **already flows through automatically**, counts included. Manual Codex work
is only needed for: (a) a **new kind of content** (new `PC.*` collection / uncovered category) → add a
`SECTIONS` entry; (b) a **renamed/restructured field** a `detail()` reads → update that renderer; (c) a value a
Reference card hardcodes.

**Tightened the drift risks I'd introduced.** (1) Nine category blurbs hardcoded counts ("All 216 base
techniques", "153 Fusion Kinetics", …) — stripped the numbers; the tile's live count **badge** already shows
them, so nothing to keep in sync. (2) The Reference **chakra penalty ladder** was hand-typed — now generated
from `PC.chakraEffect()` and `PC.RULES.CHAKRA_MAX_HITS`, so it can't drift from the engine. Limb effects were
already pulled from `PC.LIMBS`.

**Codified.** Added a **Codex-sync** clause to the `CLAUDE.md` STANDING RULE (spelling out the auto-flow + the
three cases that need a `codex.js` touch), updated the stale "6 tags → 7 tags" references, listed `codex.js` in
the Files section, and revised the FUSIONS.md note to reflect fusions now living in the Codex. Verified: blurbs
count-free, badges live, ladder engine-derived, 0 console errors. Cache-buster **v=88**.

---

### 62. Heritage overhaul begins — fresh roster of 9, one at a time; #1 = North America
**Direction (Luke).** The heritage system is getting a "slight overhaul" toward what he & Brittany want for the
final book. Two calls: **(a)** a **fresh roster of 9** (the magic number for first edition), **built one at a
time** like the Otherkin — cleared the old 8; **(b)** keep the same **anatomy** (Fighting Style + 2 Combat
Skills + weapon subtype + armor + 2 Traits + 1 Flaw). Crucial reframe: **a heritage is the historical /
ancestral people of a region, not the modern nation** — North America = the **Native nations of the continental
US**, *not* modern American culture (the old "Frontier Gunslinging / Revolvers" was exactly the colonial-modern
read this fixes). Regions are defined as we go; North America **excludes Canada and Mexico** (each their own
heritage later, since those peoples are genuinely distinct). Handled with care since this is a published product
built on real cultures — grounded in authentic tradition, steering clear of stereotype (e.g. no "noble-savage"
flaw); all placeholder for Brittany to finalize.

**Heritage #1 — North America** (pan-Native blend, Luke's pick — honors the breadth, no Plains-warrior monolith):
- **Fighting Style "Way of the Hunt"** — skirmisher/hunter. Skills: ★Hunter's Aim (called-shot bow), ★Fade Away
  (hit-and-hide → Hidden), Volley (area disadvantage), Ambush (bonus die from Hidden/first-strike), Harrier's
  Shot (reaction shot on movement), and the **Pathfinder** passive (ignore natural terrain, track/forage
  advantage, leave no trail). startWeaponTypes: Archery/Light/Thrown.
- **Signature weapon:** **Shortbows** (Archery/STR) — the bow is near-universal across the nations; short
  self-bows over the English longbow. **Armor:** Light only. **Traits:** One with the Land (provision + resist
  the elements), Keen Senses (Awareness). **Flaw:** Etiquette (unversed in old-world court customs).

**Also (Luke's ask):** the creator's heritage **cards** now show the **full package** — the signature weapon
proficiency (+ parent type), armor tier, and the flaw — right on each card, so a player sees every detail while
comparing, not only after selecting. (The detail panel already listed them; the gap was the grid.)

**Data note.** Cleared `PC.HERITAGES`/`PC.FIGHTING_STYLES` down to North America / Way of the Hunt (COMBAT_SKILLS
auto-derives → 6). No hardcoded old-heritage refs in code. The **Codex auto-updated** (reads live). Docs rewritten:
GAME_RULES 3b + Fighting-Styles table + scattered examples de-referenced from the retired roster; README creator
step. Verified end-to-end (card details, granted skills, passive, detail panel, 0 console errors). Roster is
**1 of 9**; the app shows a single heritage until we build the rest. Cache-buster **v=89**.

**Framing follow-up (Luke, v=90).** Clarified that PCs are **descendants** — present-day people of the Post-Veil
world who were *raised in and carry* their ancestral people's traditions, **not** the historical figures
themselves. Reworded North America's blurb + flaw, the creator's Heritage-step intro, and the GAME_RULES 3b /
README framing to say this explicitly. Applies to every heritage going forward.

---

### 63. Heritage #2 — The Great North (Way of the Long Winter)
**Built (Luke approved).** Second of the fresh 9. **The Great North** = descendants of the First Nations & Inuit
peoples north of the US border (Canada + the Arctic). Designed as the **opposite pole** from North America: NA is
the mobile ranged skirmisher; the Great North is the **enduring big-game hunter** — reach, control, resilience.
Pan-North blend.
- **Way of the Long Winter:** ★Harpoon Throw (Slow/pull), ★Brace (reduce damage by CON mod, can't be moved),
  Take Down (prone/grapple), Second Wind (shed a condition / heal), Killing Blow (extra die vs. Slowed/prone/
  grappled/bloodied), and the **Winterhardened** passive (cold & ice immunity, resist exhaustion, ignore
  prone/forced-move once per combat). startWeaponTypes: Thrown/Light/Heavy.
- **Signature weapon Knives** (Light/AGI — the ulu/hunting knife). *No Spear/Harpoon subtype exists, so the
  harpoon lives in the skill; flagged a real subtype as a possible WEAPONS.md addition.* **Armor Light + Medium**
  (bone-plate & layered hide — the roster's first heavier-armor people). **Traits:** People of the Ice,
  Iron Constitution. **Flaw:** Etiquette (same skill as NA — Luke okayed; both are peoples apart from old-world
  courts).

Verified: 12 combat skills, **no name collisions** (combat-skill or technique), wiring resolves, both heritage
cards show the full package, Codex auto-updated (Heritages 2 / Combat Skills 12), 0 console errors. Roster now
**2 of 9**. Cache-buster **v=91**.

---

### 64. Heritage #3 — Mexico (Way of the Obsidian Blade)
**Built (Luke approved — "I love it").** Descendants of the Mesoamerican civilizations (Mexica/Aztec, Maya, and
kin). Designed as the **third distinct combat pole**: the **aggressive melee striker** (obsidian blade + warrior
orders), vs. NA's ranged skirmisher and the Great North's defensive hunter. Pan-Mesoamerican blend.
- **Way of the Obsidian Blade:** ★Obsidian Strike (Bleed), ★Warrior's Fury (bonus attack on a kill/bloody),
  Atlatl Dart (ranged), Take Captive (prone/grapple — the flower-war tradition), Sever (armor-ignoring), and the
  **Obsidian Edge** passive (crit 19–20 + Bleed on crit). startWeaponTypes: Heavy/Thrown/Light.
- **Signature weapon Great Swords** (Heavy/STR) standing in for the **macuahuitl** (no exact subtype — flagged as
  a possible WEAPONS.md addition, like the harpoon). **Armor Light + Medium** (ichcahuipilli quilted cotton).
  **Traits:** Keepers of the Count (astronomy/calendar), Warrior's Discipline (resist Fear). **Flaw:** Survival
  (City-Raised — first non-Etiquette flaw, and it differentiates the two wilderness heritages before it).
- **Handled with care:** deliberately excluded the human-sacrifice stereotype; leaned on real achievements
  (astronomy, mathematics, obsidian craft, the atlatl, the warrior orders).

Verified: 18 combat skills, no name collisions, wiring resolves, card shows full package, Codex auto-updated
(Heritages 3 / Combat Skills 18), 0 console errors. Roster **3 of 9**. Cache-buster **v=92**.

---

### 65. Heritage #4 — The Caribbean (Way of the Tides); the "9" cap is dropped
**Built (Luke: "just keep building").** Descendants of the island & coastal seafaring peoples of the Caribbean and
the Central American coast (Taíno, Kalinago, Arawak, isthmus coastal nations). The **fourth distinct combat pole:
the amphibious hit-and-run raider/controller.** Two roster decisions from Luke: **(1) drop the hard cap of 9** —
keep building region by region; **(2) Hawaii/Polynesia is NOT here** — reserved for a **Pacific / Oceania**
heritage that's being **built next**.
- **Way of the Tides:** ★Net Cast (Root), ★Javelin (ranged), Slip the Current (water mobility → Hidden), Rip Tide
  (prone/push), Sling Stone (Dazzle), and the **Sea-Born** passive (swim full speed, hold breath, ignore
  water/sand/reef terrain, no disadvantage in/under water). startWeaponTypes: Thrown/Light/Archery.
- **Signature Slings** (Archery/STR) — but the ideal weapon is a **javelin/spear**; this is the **3rd** heritage
  (harpoon → atlatl → javelin) to want one, so a **Spears/Javelins** subtype is now a standing recommendation for
  WEAPONS.md. **Armor Light only** (heat/water/mobility). **Traits:** Wayfinder (navigate/pilot, never lost at
  sea), Storm-Wise (predict/endure storms, sea-legs). **Flaw:** History ("Songs, Not Scrolls" — framed around
  oral tradition; 4th distinct flaw skill).

Verified: 24 combat skills, no name collisions, wiring resolves, card + Codex updated (Heritages 4 / Combat
Skills 24), 0 console errors. Cache-buster **v=93**. Four combat identities now: ranged skirmisher (NA),
defensive hunter (Great North), aggressive striker (Mexico), amphibious raider (Caribbean).

---

### 66. Heritage #5 — Pacific Islander (Way of the War Club)
**Built (Luke picked the name: "Pacific islander works here").** Descendants of the Polynesian, Melanesian, and
Micronesian peoples (Hawaiʻi to Aotearoa). The name choice also settled scope — **"Pacific Islander" = the island
peoples**, so **Aboriginal Australia is reserved** as its own future heritage (culturally distinct). The **fifth
distinct pole: the ferocious close-combat warrior** — made deliberately unlike the Caribbean (also an ocean
people) by leaning on club/grapple/fear/berserk instead of amphibious skirmishing.
- **Way of the War Club:** ★War Club (rattle → disadv. on next attack), ★Haka (Frighten + Intimidation),
  Grapple & Wrench (grapple + limb), **Felling Blow** (prone), Spear Thrust (reach push/prone), and the
  **Unflinching** passive (immune to Frightened; extra die while bloodied). startWeaponTypes: Heavy/Light/Thrown.
- **Signature Maces** (Heavy/STR) = the pan-Pacific **war club** (Fijian/Samoan/Tongan clubs, Māori mere, Hawaiian
  leiomano). **Armor Light only.** **Traits:** Feared Warrior (Intimidation-as-command), Deep-Water Voyager
  (open-ocean navigation). **Flaw:** Persuasion ("Sooner Cow Than Coax" — pairs with Feared Warrior; 5th distinct
  flaw skill).
- **Collision caught:** the initial "Crushing Blow" clashed with an existing technique name → renamed **Felling
  Blow** (combat-skill/technique lookups are separate, but renamed to keep the Codex unambiguous).

Verified: 30 combat skills, no name collisions, wiring resolves, card + Codex updated (Heritages 5 / Combat
Skills 30), 0 console errors. Cache-buster **v=94**. Flaw spread now Etiquette×2, Survival, History, Persuasion.

---

### 67. Weapon convention — existing subtypes only (no new spear/javelin subtype)
**Decision (Luke).** Rather than add a **Spears/Javelins** subtype to WEAPONS.md (which I'd flagged 4×), **use
only existing weapon subtypes** — now and going forward. Signatures were already real subtypes (Knives, Great
Swords, Slings, Maces); the fix was skill flavor that named weapons with no subtype. Renamed/reworded so nothing
implies an unavailable weapon:
- Great North **Harpoon Throw → Tethered Throw** (a thrown weapon on a line; kept the Slow/pull).
- The Caribbean **Javelin → Hurl** (a strong thrown-weapon attack).
- Pacific Islander **Spear Thrust → Lunge** (a lunging reach strike).
- Mexico **Atlatl Dart** kept (Darts is a real Thrown subtype) — reworded "spear-thrower" → "atlatl."
- Great North style blurb de-speared. Removed all "add a subtype to WEAPONS.md" flags from GAME_RULES.

Recorded the rule in GAME_RULES 3b ("every heritage uses only existing weapon subtypes; where an iconic weapon
has none, map to the nearest real subtype and keep the skill flavor weapon-agnostic"). Verified: 30 combat skills,
granted-skill references updated (Great North, Caribbean), no name collisions, no remaining spear/javelin/harpoon
in skill effects, 0 console errors. Cache-buster **v=95**.

---

### 68. Heritages #6 & #7 — The Andes & The Amazon (South America split in two); + no-currency economy noted
**Built (Luke approved).** Luke split "South America" into **two heritages** — the Andes and the Amazon are two
civilizations, not one.
- **The Andes** (#6, *Way of the Vanguard*) — descendants of the Andean peoples (Quechua, Aymara). The roster's
  **first support/protector pole**: Star-Mace (push + no reactions), Bulwark (interpose for an ally), Rally
  (buff/cleanse ally), Hold the Line (formation anti-move), Sling Barrage (Slow) + **Highland-Bred** passive
  (altitude/mountain immunity, resist exhaustion). Signature **Great Hammers** (star-mace/champi); Light+Medium.
  Traits **Master Builders** (engineering) + **Keeper of the Quipu** (records/logistics). Flaw **Stealth**.
- **The Amazon** (#7, *Way of the Silent Dart*) — descendants of the rainforest nations. A **genuinely new
  mechanical pole: poison** (nobody else used the Poisoned condition). Poison Dart, Silent Shot, Curare
  (Poison+Slow→Stun), Weakening Toxin, Vanish + **Venom-Wise** passive (poison-immune; toxins resisted at
  disadvantage). Signature **Blowguns** (real subtype); Light. Traits **Green Apothecary** + **Unconquered**.
  Flaw **Laborer's Tools**.

**No-currency economy (Luke, system-wide note).** There is **no universal currency** — the economy is **barter &
trade**; some settlements use local scrip (e.g. ration tickets) which are just **inventory items**. Not building
it yet, but recorded in GAME_RULES (new *Economy* note) so no content assumes currency. This **changed the Andes
flaw**: I'd proposed *Barter* ("not coin"), but barter is the *universal* exchange (too central to flaw, and
"coin" doesn't exist) → switched to **Stealth**. Confirmed the 5 already-built heritages reference no currency.

Verified: 42 combat skills, no name collisions (combat-skill or technique), both wired, cards + Codex updated
(Heritages 7 / Combat Skills 42), 0 console errors. Roster **7**. Seven distinct combat poles. Flaw spread:
Etiquette×2, Survival, History, Persuasion, Stealth, Laborer's Tools. Cache-buster **v=96**.

---

### 69. Europe begins — Heritage #8: The Franks (Way of the Oath), first Heavy-armor heritage
**Direction (Luke).** Moving to Europe, and it's **not one heritage** — Europe is vast, so it yields many
(no limit). Two framing calls: **(a)** European heritages may use a **wider weapon palette** — beyond the melee/
archery of the Indigenous heritages, Luke opened up **Firearms, Explosives, Channel, and Ritual** subtypes (but
**not** Tech/Laser/Plasma/Living). So Europe reads as the Old World's "advanced" continent — steel plate,
gunpowder, and the occult. **(b)** Heritage names must reflect a **specific region** (historical people, not a
modern nation or an archetype) — so the medieval-knight heritage is named **The Franks** (Francia — cradle of
chivalry), not "Feudal Europe" or "The Knight." Planned European set (build order TBD): Franks (done), Norse,
Celts (Channel/druids), Hellenes & Romans, a Gunpowder tradition (Firearms+Explosives), an Occult tradition
(Ritual), Slavs, + Iberia/Baltic/steppe optional.

**Heritage #8 — The Franks** (*Way of the Oath*) — the **armored champion/duelist**, and the roster's **first
Heavy-armor** heritage. ★Challenge (mark → duel: it's disadv. vs others, you're adv. vs it), ★Cleaving Blow
(carry a kill to the next foe), Riposte (punish a miss), Lance Charge (charge + prone), Shield the Fallen (take
an ally's hit), and the **Plate-Steel** passive (−2 all damage, can't be proned). Signature **Great Swords**
(the longsword — shares the subtype with Mexico's macuahuitl, different weapon in flavor); **Armor Light +
Medium + Heavy** (first full plate). Traits **Steel Resolve** (resist Fear/Concentration) and **Noble Bearing**
(Etiquette/heraldry — the Knight *owns* the courtesy other heritages stumble on). Flaw **Acrobatics** (no
tumbling in plate). Distinct from the Andes (protect/formation) — the Franks compel single combat and outlast in
plate.

Verified: 48 combat skills, no name collisions, wired, Heavy armor recognized, card shows Light+Medium+Heavy,
Codex updated (Heritages 8 / Combat Skills 48), 0 console errors. Roster **8**. Flaw spread now adds Acrobatics.
Cache-buster **v=97**.

---

### 70. Equipment & armor overhaul — real slots, shields, and an Equipment paper-doll
**Direction (Luke, mid-heritage sidestep).** The old equip system was **just an on/off flag** — no hands, no
slots, no limits (you could equip unlimited weapons/armor; armor DS stacked; a 2H weapon didn't block anything),
and **shields didn't exist** (the lone "Riot Shield" was mis-filed as Medium body armor). Luke's three calls:
**limb-mapped armor slots**, **shields with a Block reaction**, **hard-enforce** the rules — plus a new
**Equipment tab** (a body paper-doll showing what's in which hand).

**Built.**
- **8 equipment slots:** Main Hand, Off Hand, + one per limb (Head/Torso/each Arm/each Leg, matching `PC.LIMBS`).
  Occupancy is derived from item properties (2H weapon = both hands; shield = one hand; a **full-suit** armor =
  all six limb slots; a future per-limb piece = its one limb). **Hard-enforced via auto-displace** — equipping
  something unequips whatever shared a needed slot (logged). Items now carry `it.slot`; a one-time
  `migrateEquipment()` slots existing characters' equipped gear and drops illegal extras.
- **Armor coverage model:** each armor has `coverage` — `full` (the whole existing 27-item catalog; fills the
  body) or a single limb (later content). Honors "limb-mapped" structurally without inventing a fake per-limb
  catalog (that's Brittany's to write).
- **Shields:** new `Shield` category (`items.js`), one hand, +DS while held (no proficiency gate) and a **Block**
  reaction (Combat tab): spend your Reaction to add the shield's DS again vs one hit until your next turn
  (`play.blockDS`, cleared at End Turn). Ladder: Buckler(+1) · Round/Heater(+2) · Kite(+3) · Tower/Riot(+4) +
  Aegis Bulwark(+5, Rare). Re-filed the Riot Shield from Armor → Shield.
- **Equipment tab:** a CSS paper-doll (Head / Arms+Torso / Legs / — hands —) + a summary strip (hands used,
  shield, live Defense). Tap a slot → per-slot picker of eligible inventory items → equip (auto-displace) or
  unequip. Inventory Equip button routes through the same slot system.
- **Codex:** new **Shields** section (data-driven); `defenseScore` now adds shield + block DS.

**Verified** (Playwright): 8 slots; 2H weapon displaces both an off-hand shield and a main-hand weapon; a suit
fills all 6 limbs; Block 10→12 Defense and clears to 10 on End Turn; Codex Shields tile = 7; **0 console errors**.
Docs: GAME_RULES (Equipment & slots + Shields + Defense formula), README (Equipment tab), DESIGN_LOG #70.
Cache-buster **v=98**. *(Heritage builds paused mid-Norse — the Norse proposal is on the table awaiting a build.)*

---

### 71. Equipment refine — Limbs-style paper-doll + a real apparel-slot taxonomy
**Deploy footnote first:** #70 (v=98) merged to `main` but its GitHub Pages build **failed to publish** (one run
cancelled, one stuck queued), so the live site sat on v=97 for days with no Equipment tab — looked like the feature
was missing. Re-triggered with a cache-buster bump (**v=99**) and confirmed the Pages build went green. Lesson:
**verify the Pages deployment actually succeeded**, don't assume a push == live.

**What Luke asked for.** Two refinements to the shipped Equipment tab: (a) draw it as a **paper-doll like the Limbs
tab** — i.e. the same SVG body-figure with tappable regions, not the flat labelled boxes; and (b) replace the
limb-mapped armor slots with a proper **apparel taxonomy**. New **8 slots**: **Head** (hats/helmets), **Torso**
(shirts/body armor), **Back** (capes/coats), **Arms** (gloves/gauntlets), **Legs** (pants/skirts/greaves), **Feet**
(shoes/boots), and **Left Hand / Right Hand** (weapons & held gear). A **two-handed weapon auto-fills both hands**.

**How it maps.** Hands went from Main/Off-Hand → **Left/Right Hand** (no dominant-hand distinction; a 1-hander
defaults to the right, a shield to the left, either can be reassigned). Armor's `coverage` now names an apparel
slot; the whole existing catalog (all whole-body suits) resolves to **Torso** body armor — so a suit no longer
"covers every limb," it sits in the torso and leaves Head/Back/Arms/Legs/Feet free for future per-slot apparel
(helmets, cloaks, gauntlets, greaves, boots — the `A()` factory now takes a coverage arg to author them). Legacy
limb keys (larm/rarm→Arms, lleg/rleg→Legs) fold in defensively. `migrateEquipment()` now also **remaps old saved
slot names** (mainHand→rhand, offHand→lhand, limb→apparel) so live characters carry over cleanly.

**The figure.** New `equipFigureSVG()` mirrors `limbFigureSVG()`: an SVG humanoid where each of the eight slots is a
tappable region (Arms/Legs/Feet each draw a left+right shape as one slot; Back is a cape drawn behind the torso;
hands are circles at the ends of the arms). Filled slots glow in the psi accent and show the item name; tapping a
slot opens the item-picker below the figure — the same "tap → editor below" pattern as Limbs. Rules stay
hard-enforced (equipping displaces whatever shared the slot). Verified (Playwright): all 8 regions individually
tappable incl. Back behind the torso, 2H fills both hands and is displaced by a shield, armor lands in Torso, DS
correct, 0 console errors. Docs: GAME_RULES + README updated. Cache-buster **v=100**.

---

### 72. Apparel content pass — gear for every slot + a fuller shield ladder
With the 8-slot doll (#71) in place, five of the six apparel slots had **no items** to put in them — only Torso
(the whole old body-armor catalog) was populated. This pass fills them out so the paper-doll is actually usable.

- **`AP(name, slot, …)`** apparel factory added (delegates to `A()` with `coverage = slot`). Body armor still uses
  `A()` (→ Torso).
- **Reclassified** the catalog's cloaks/ponchos/shawls/coats out of body armor into **Back** (Padded Cloak, Camo
  Poncho, Enchanted Shawl, Nightweave Cloak, Reinforced Coat) — they were never really torso armor.
- **Added ~31 apparel pieces**: Head (hoods, caps, coifs, iron/combat/great helms, a rare circlet), Back (wool/
  traveler's cloaks, longcoat, trench coat, duelist's cape), Arms (leather/tactical gloves, bracers, chain sleeves,
  steel/vanguard gauntlets), Legs (cloth/combat trousers, leather leggings, chain faulds, steel greaves, padded
  kilt), Feet (sandals, leather/traveler's/combat boots, steel sabatons, silent soles). Each spans Light/Medium/
  Heavy so class-gating still means something, plus a rarity or two per slot.
- **Shields** grew from 7 → 11: added Targe, Spiked Shield, Pavise, and a Legendary Aegis of the Vault.
- Catalog now: **57 armor** (torso 21, head 8, back 10, arms/legs/feet 6 each) + **11 shields**. Every slot's
  picker offers only its fitting items (verified in-browser; a fully-kitted heavy build filled all 8 slots, 0
  console errors).

**Balance flag (for Luke):** accessory Defense **stacks** — a fully-matched heavy set (body +6, helm +2, cloak +1,
gauntlets +1, greaves +2, boots +1, shield +5) can push DS into the low 20s. Kept accessory bonuses deliberately
modest (mostly +0/+1, a few +2) so body armor + shield stay dominant, but if the ceiling is too high the easy
levers are: cap total armor DS, zero-out accessory DS (flavor only), or only count the highest-DS piece per region.
Awaiting Luke's call. Docs: CLAUDE.md, GAME_RULES, README. Cache-buster **v=101**.

---

### 73. Heritage #9 — The Norse (Way of the Raider); Europe's second, the berserk seafarer
Resumed the heritage roster (paused since the Franks for the equipment work). Europe's second entry, and a
deliberately **new pole**: where the Franks are the disciplined armored duelist, the Norse are the **berserk
seafaring raider** — escalating all-out aggression that trades safety for reach and refuses to fall. (The prior
Norse proposal predated a context compaction, so this was rebuilt fresh to the established heritage pattern.)

**Way of the Raider** — signature **Berserkergang** (Bonus: the bear-shirt frenzy — advantage + extra melee
damage, but foes get advantage against you too) and **Reaver's Swing** (Action: one axe blow hits two adjacent
foes). Rounded out by **Shield-Breaker** (ignore a target's armor/shield Defense), **Skald's Cry** (Bonus:
war-cry granting allies advantage on their next attack), **Answer in Kind** (Reaction: take a melee hit, strike
back), and the passive **Valhalla-Bound** (once per battle, the blow that would drop you leaves you at 1 HP,
fighting on until end of your next turn). Signature weapon **Great Axes** (the Dane axe — an existing Heavy
subtype, per the no-new-subtypes rule); armor **Light + Medium** (mail, not full plate — that stays the Franks'
distinction). Traits **Keeper of the Sagas** (History + Mythology; oral law & lineage) and **Longship Raider**
(pilot/row coastal craft; Athletics to board, climb, haul, force entry). Flaw **A Straight Word** — disadvantage
on **Deception** (a plain, oath-bound people; the sly lie doesn't come easily — a disadvSkill no other heritage
used).

Verified: 9 heritages / 9 styles / **54 combat skills**, **no name collisions**, Great Axes subtype valid,
Deception flaw valid, signature skills resolve; Traits tab and creator render The Norse, Codex shows 9 / 54,
0 console errors (favicon 404 only). Distinct from Mexico's rage (Norse escalates + won't die), the Andes'
shield-wall (Norse is offense, not the protector pole), and the Franks (mail raider vs plate duelist).
Docs: CLAUDE.md, GAME_RULES (roster table), README. Cache-buster **v=102**.

---

### 74. Armor polish — accessory-DS cap, apparel crafting recipes, descriptions & more variety
A four-part follow-up to the apparel pass (#72), all in one go at Luke's "all of the above":

1. **Balance — accessory-DS cap.** The flagged stacking is resolved: Torso body armor and a held shield add their
   full Defense, but the five accessory slots (Head/Back/Arms/Legs/Feet) now **sum to at most +3** together
   (`ACCESSORY_DS_CAP` in play.js; `accessoryDS()` computes raw vs applied). `defenseScore()` adds torso in full +
   the capped accessory total; the Equipment summary shows "🧥 Apparel: +N DS" with a **capped** tag when the raw
   sum exceeds the cap. Verified: a raw +7 set applies exactly +3 (delta test).
2. **Crafting integration.** Apparel already flowed through the class-based armor templates, but a hood shared a
   full body-suit's recipe. `itemComponentSlots()` now gives non-torso apparel a **slimmer, class-appropriate**
   component set (Light accessory = 1 part; Medium = 2; Heavy = Plating + Straps) so accessories craft and salvage
   cheaper than body armor.
3. **Descriptions.** Added in-world descriptions for ~30 previously stats-only apparel pieces (helmets, cloaks,
   gloves, greaves, boots) so they read well in the Codex and inventory.
4. **More variety.** Added gap-fillers (Straw Hat, Bascinet, Bearskin Mantle, Vambraces, Mail Mittens, Mail
   Chausses, Riding Boots) plus a **themed matched set** — the **Wolfhide kit** (Hood/Cloak/Bracers/Leggings/Boots,
   Light/Uncommon, +1 each), a northern-raider set that pairs naturally with the new Norse heritage.

Catalog now: **69 armor** (torso 21, head 11, back 12, arms 9, legs 8, feet 8) + **11 shields**. No duplicate
names, syntax clean, 0 console errors. Docs: CLAUDE.md, GAME_RULES. Cache-buster **v=103**.

---

### 75. Item Catalog — armor grouped and filterable by equipment slot
Small browse-UX follow-up (Luke): in the Inventory's **Item Catalog**, separate the armor by equipment slot
instead of one undivided "Armor" blob. Results now render under **group headers** (armor splits into Head /
Torso / Back / Arms / Legs / Feet; weapons, shields, consumables, etc. get their own headers too), and the
category filter gained six **per-slot options** (Armor → · Head / · Torso / …) plus the missing **Shield** filter.
Each armor row also now shows its slot in the meta line. Pure presentation over `PC.ITEMS` — no data changes.
Verified in-browser: Armor filter shows all six slot groups (Head 11 / Torso 21 / Back 12 / Arms 9 / Legs 8 /
Feet 8), the Feet filter narrows to the 8 boots, 0 console errors. Cache-buster **v=104**.

---

### 76. Ammunition family + thrown weapons as self-ammo
Ran an item-type audit (weapons/armor/shields/crafting/skill-kits/consumables all deep; the real gap was
**ammunition** — the catalog abstracted it away). Luke: add ammo for all ranged weapons, and make thrown weapons
behave as their own ammo.

- **New `category: "Ammo"`** (factory `AM(name, feeds, weight, note)`), **12 stacks** mapped by firing mechanism,
  not by weapon: **Arrows** (bows), **Sling Bullets**, **Crossbow Bolts**, **Blowgun Darts**, **Pistol / Rifle /
  Shotgun / Heavy Rounds**, **Rockets**, **Fuel Canister**, **Chemical Canister**, and a **Charge Pack** for
  energy arms (laser/plasma/tech/amp). Each carries a `feeds` label (what it supplies) and a sensible **craft
  recipe** (arrows← Hardwood, bullets← Scrap Metal + Chemicals, charge pack← Power Cell + Circuitry, …).
  Consumption is tracked by hand for now (a quiver/box you draw from) — no per-shot rules hook.
- **Thrown weapons = self-ammo.** `W()` now auto-flags any *Thrown Weapons* item with `thrown: true`; their weight
  dropped from 1 → **0.5 lb** so players carry several, and the UI (inventory detail + catalog meta) shows
  "🎯 Thrown — expended when thrown; recover it afterward." (Returning Kunai's note says it comes back, no recovery
  needed.) Ki-powered arms burn KP; grenades/mines are one-use — neither needs an ammo stack (documented).
- **Integration:** the Item Catalog gained an **Ammunition** group + an **Ammo** filter (and the missing Shield
  filter/quick-add option); a new **Codex → Ammunition** section lists all 12. Docs: CLAUDE.md, GAME_RULES, README.

Catalog now ~342 gear items. Verified in-browser: Ammo filter shows the 12-item Ammunition group, Shuriken reads
"🎯 thrown (recover after)", Codex Ammunition = 12, 0 console errors. Cache-buster **v=105**.

---

### 77. Per-shot ammo consumption wired into attacks
Made the ammo family (#76) live: ranged attacks now **spend a round automatically** and can't fire empty.

- **Model:** an Ammo stack's `qty` is now its **rounds**; `AM()` gained a `count` (rounds per pickup) and its
  `weight` is **per-round**, so a stack's weight = weight × rounds. `addCatalogItem()` adds `count` rounds and
  **merges** into an existing stack of the same name. Thrown weapons start at **qty 5** when added.
- **Mapping:** `weaponAmmo(it)` maps a weapon to its ammo — an Ammo name, `"__self__"` (thrown/explosive spends
  the weapon itself), or `null` (melee / Ki-powered). Inferred from weapon type + name (items carry no subtype),
  validated across all 194 weapons — every bow/sling/crossbow/blowgun/firearm/launcher/energy arm maps right
  (fixed one miss: the wrist-mounted **Bracer Bow** → Arrows).
- **Attacks:** `attackWith()` now checks ammo **before** spending your action (blocks with a toast if empty),
  then `spendAmmo()` decrements the round (or the thrown weapon) and the roll log notes `· −1 Arrows (19 left)` /
  `· thrown (2 left)` / `(empty!)`. The **⚔ Attack** button (inventory + Combat tab) is **disabled** when out,
  titled "Out of {ammo}". Weapon/ammo detail lines show rounds remaining.

Verified in-browser: adding an Arrows box → qty 20, a second merges → 40; firing steps 2→1→empty with correct
log; a bow at 0 arrows shows the Attack button DISABLED ("Out of Arrows"); a Shuriken throw steps 2→1
("thrown (1 left)"); 0 console errors. Docs: GAME_RULES, README. Cache-buster **v=106**.

---

## Deferred / future ideas
- **Networked play (the destination)** — shared characters, GM/player campaigns, and in-app chat (text + voice,
  private + group). A big backend effort (accounts, storage, real-time). Not being built yet — the current focus is
  the **system and mechanics**. When we get here, plan the architecture first (it changes how characters are stored).
  The **app shell now exists** (#55): Home screen with the Sign-in card and the Social / Account menus are in place
  as scaffolding, ready to wire to a real service.
- **GM section** — build & run campaigns (encounters, NPCs/monsters, initiative & table tracking, XP/loot, live
  play). Placeholder in place (#55).
- **Codex section** — ✅ **built** (#59): searchable reference across 14 categories (Kinetics, Techniques,
  Otherkin, Backgrounds, Heritages, Skills, Combat Skills, Conditions, Weapons, Armor, Gear, Crafting, Reference).
  Remaining: the **Bestiary** (needs monster data) and a narrative "full rulebook" view. Fusions deliberately
  excluded (hidden system) — could live in the GM section instead.
- Heritage-opened starting weapons granting **actual proficiency** (currently start-only).
- A real **XP-to-next-level** bar once Luke sets the thresholds. — ✅ done (#42, placeholder curve; retune anytime).
- Off-PC backup of the **source** — ✅ done (public GitHub repo `stbkat-ai/psion-chronicles`).

---

*Standing rule (recorded in `CLAUDE.md`): this log is updated as part of every feature change — a new
entry or revision here, the matching `GAME_RULES.md`/`README.md` sections, and a `git push` (which
auto-deploys GitHub Pages) — automatically, without needing to be asked.*
