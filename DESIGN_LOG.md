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
