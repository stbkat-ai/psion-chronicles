# Psion Chronicles — Companion App

A digital companion for the **Psion Chronicles** TTRPG (like D&D Beyond, but for your game).
Built with Luke. Everything you'd track on paper — character sheet, HP, KP, chakras, skills,
techniques — lives in the app.

### ▶ Play it (any device, no login)
**https://stbkat-ai.github.io/psion-chronicles/**

Open it in any browser on a phone or computer and bookmark it. Your characters save in that browser
(per-device for now — a character made on one device won't appear on another yet).

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
  1. Identity + Psionic Background (all 9). Each background also carries **one flaw** — a whole-attribute
     disadvantage on a stat the archetype doesn't lean on (e.g. Body Builder → *All Brawn*: disadvantage on
     Intelligence-based skills & Kinetic techniques). Flaws are flavor with a light bite, never build-breaking.
  2. **Regional Heritage** — pick 1 of **8 old-world regions** (replaces a race system). Each grants a
     region-tied **Fighting Style** — and from it **2 Combat Skills + the style's signature Passive** — plus
     **2 Traits** and **one flaw** (a narrow, situational disadvantage on a single skill — e.g. North America →
     *Rough Around the Edges*: disadvantage on Etiquette). *No* attribute changes. Combat Skills are organized
     into Fighting Styles the way techniques are organized into Kinetics (48 skills across 8 styles); they cost
     no KP and only use action economy (Action / Bonus Action / Reaction / Passive). Each Heritage also grants a
     **signature weapon-subtype proficiency** — one specific weapon that fits its style (e.g. Europe →
     **Great Swords**, Oceania → **Daggers**, North America → **Revolvers**). You add your proficiency bonus to
     attacks with that subtype even without the whole weapon-type proficiency. Your Heritage also sets your
     **armor proficiency** — everyone can wear **Light**, and martial regions add **Medium/Heavy** (see the
     armor system on the Inventory tab).
  3. Attributes — roll 8d12 (drop 2 lowest, +10) or enter manually, then assign
  4. Skills — background gives 3, choose 2 more (**+1 per skill-proficiency grant** from your Heritage —
     e.g. Oceania's *Adaptable* makes it 3)
  5. Techniques — background's free one + choose 2 from any school. The 18 Kinetics are shown as **tabs**
     (tap one to browse just its Beginner techniques — no more scrolling a 90-card wall). Tabs are ordered
     **your focus first** (★, from your background), then any Kinetic you've already picked into (✦), then
     the rest in attribute order; each tab badges how many you've chosen from it. All 18 Kinetics' **Beginner**
     techniques are in the app — 90 total; higher tiers arrive with the level-up system.
  6. **Equipment** (chosen **last**, so Heritage counts) — you pick from a curated **beginner-weapon**
     shortlist (up to **two per weapon subtype** — the simplest of each — so the picker stays short instead of
     listing every Common weapon). The dropdown groups weapons by **subtype**, each labelled *Type · Subtype*
     (e.g. *Heavy Weapons · Great Swords*), so it's easy to scan. Which *types* are on offer comes from **three** sources: (a) your background's
     weapon proficiency; (b) any **bonus proficiency** a Heritage grants — e.g. Europe's *Martial Heritage* adds a
     **bonus weapon-type** selector here, and both count as proficient; and (c) your Heritage's **Fighting Style
     weapon focus**, which lets you **start with** weapons of its flavor even though you're **not proficient** with
     them (tagged *"not proficient"* in the picker) — so a melee-background gunslinger (North America) can still
     begin with a rifle. Two-weapon-fighting Heritages (Oceania's *Twin Fang*) instead offer a choice: **one
     two-handed weapon _or_ two one-handed weapons**. (The full weapon catalog stays available in play — only
     creation is limited to beginner weapons.) Your picks auto-populate the new character's inventory,
     pre-equipped and ready to roll
  7. **Description** — optional flavor: your character's **Basics** (age, gender, pronouns), **Physical
     appearance** (height, weight, skin tone, hair colour/style, eye colour), and a free-text
     **Distinguishing features** box (tattoos, piercings, scars, etc.). Purely descriptive — **no rules
     effect** — and every field is optional, so it never blocks the build. It shows up on the play sheet's
     new **Description** tab, where you can also edit it at the table
  8. Review & Save — full computed sheet + your **Heritage** (Fighting Style, Combat Skills, passive, Traits),
     combat proficiencies (incl. any bonus), starting loadout, and your description
- Auto-calculates HP, KP, all 6 chakras, Defense Score, speeds, carry weight, modifiers, proficiency
- **Roster** — saved characters on the home screen; **Edit**, Play, and delete
  - **Edit** reopens a character in the creator with everything prefilled; change anything (name, stats,
    background, skills, techniques) and Update saves it in place — your live play session (current HP/KP,
    chakra hits) is kept and auto-adjusted if the maximums changed
  - **⭐ Level Up** opens a dedicated screen with your **Soul Pool (XP) bar** — your GM awards XP with the
    +/− controls, and when the bar fills to the next level's threshold the **Level Up** button lights up
    "ready." Tap **Level Up** (GM-driven; cap 30) to earn **+1 Technique Point** each level, **+1 attribute
    point** on odd levels, and **+1 Combat Skill Point every 5th level** (5/10/15/20/25/30). XP is cumulative
    and the thresholds are a starting curve (100 × L² per level; your GM can retune them). Spend attribute points (cap 30) and Technique Points to learn new techniques. All
    **216 techniques** (18 Kinetics × 4 tiers × 3) are in the app, gated two ways: by **Soul Level** (Adept @8,
    Expert @15, Master @22) **and** by requiring **≥3 techniques from that Kinetic's previous tier** to
    unlock its next tier (at 3 per tier, that means completing the whole previous tier). Your Technique-Point
    budget is tuned so a level-30 character can **master ~2 Kinetics and dip into a 3rd**. Spend **Combat Skill Points** to learn more **Combat Skills** from **any Fighting
    Style** (grouped by style, your own first; a style's signature Passive is learnable too). Your Heritage's
    2 starters + its style Passive are free and permanent. **Completing a Kinetic's Adept tier auto-grants
    proficiency in it; completing its Expert tier auto-grants expertise (double prof)** — the level-up screen
    toasts the moment you cross either threshold. Proficiency and pools update automatically;
    Otherkin unlocks at 15. Techniques to learn use the same **Kinetic tabs** as creation (focus ★ first,
    Kinetics you know techniques in ✦ next, then the rest by attribute) — each tab lists what's learnable now
    and, for Kinetics you're pursuing, spells out what's still needed to unlock its next tier.

- **Live Play Sheet** (▶ Play on a character) — the at-the-table screen, organized into tabs so there's
  little scrolling: **Sheet · ⚔ Combat · Limbs · Chakras · Kinetics · Skills · Traits · Description · Inventory · 🔨 Crafting · 🐾 Pets**.
  - **♥ Otherkin tab** (appears at **Soul Level 15**) — choose your **Soul Creature** (a permanent, free pick). It
    grants a fixed **attribute + pool boost**, a **unique Kinetic** whose **6 techniques auto-unlock** as you level
    (15/18/21/24/27/30, no Technique Points), and a **signature ability** that refreshes on rest and grows every
    3rd level. The tab shows your unlocked and upcoming powers plus the signature's rest-gated uses; the techniques
    are also playable from Combat. *(In the app so far: the **Kitsune** — Fox Mischief, and the **Siren** — Seductive Voice. More on the way.)*
  - **Limbs tab** — Fallout-style called-shot damage shown on a **body figure**: a silhouette of head,
    torso, two arms and two legs, with each limb's **HP written over it** in the bold colored pool-number
    style (green/gold when healthy → orange when hurt → red when crippled). **Tap a limb** to open its
    damage/heal controls (**⊕ Called Shot** / Heal / Full). 6 limbs each have their own HP (Head ¼, Torso ½,
    Arms/Legs ¼ of max HP); a called shot damages the limb *and* your HP, capped at the limb's HP (excess
    lost); at 0 the limb is crippled. Crippled effects auto-apply — legs cut movement, a crippled arm gives
    weapon-attack disadvantage (both block attacks), a crippled head gives disadvantage on technique attacks
    & Mind checks — and are listed below the figure. Long rest fully heals limbs; short rest restores half.
  - **Chakras tab** — the chakra health track, shown on a **seated body figure**: a glowing **chakra disc over
    each spinal point**, drawn crown→root in the traditional colors (Crown/INT **violet**, Third Eye/WIS
    **indigo**, Throat/CHA **blue**, Core/STR **yellow**, Sacral/AGI **orange**, Root/CON **red**). Below it,
    one color-coded **row per chakra** (name, attribute, current effect, and 4 hit-pips). **Tap** a disc or a
    row to set its hits: 1 = disadvantage, 2 = modifier halved, 3 = modifier removed, 4 = **locked out** (no
    rolls with that attribute until you rest). Short rest heals 1 hit on each hurt chakra; long rest heals 2.
    A hidden **7th chakra — Heart** (green) stays concealed until **Soul Level 15**, then **awakens** at the
    center of the chart with its own 4-hit track. It's the seat of your **Otherkin** — its hits weaken every
    Soul-Creature power, and a locked Heart (4) leaves the Otherkin dormant until you rest.
  - **⚔ Combat tab** — everything you can do this turn, grouped by action economy into **collapsible pull-down
    menus** (each header shows a count badge; tap to expand/collapse — **Actions** opens by default, the rest
    start collapsed so you're not scrolling to find things, and your choices stick between rolls. A group also
    **auto-collapses the moment you spend its slot** — take your Action and the Actions menu folds away — and a
    new turn (End Turn) reopens Actions; you can always reopen a spent group by tapping it):
    **Actions** (equipped-weapon attack/damage/augments, a universal **👊 Unarmed Strike** — d20+STR+prof to hit,
    1d4+STR damage — and Action techniques), **Bonus Actions**, **Reactions** (a universal **↩ Opportunity
    Attack** — one melee attack with any melee weapon or unarmed when an enemy enters/leaves your reach, once
    between turns — plus Reaction techniques), and **Full-Turn & Other**. Your **🎖 Combat Skills** (granted + learned) are folded
    right into those same groups as **clickable 🎖 cards** — using one spends its action-economy slot and logs
    the effect, exactly like a weapon or technique; each is tagged with its origin Fighting Style. Your style's
    always-on **Passive** stays in a separate reference panel below (nothing to click). Topped by a compact
    **HP / KP / Defense / Prof / Turn** strip, **Roll Initiative**, **End Turn**, a **Speeds** row
    (Movement · Climb · Jump · Swim), the This-Turn tracker, active effects, and the log — all your combat
    stats and controls live here on the Combat tab.
  - **Action economy enforced** — one Move / Action / Bonus Action per turn (Reaction once between turns). Spending
    a slot disables all other options of that type until **End Turn**; a "This Turn" tracker shows what's used
    (tap to toggle manually for feats/abilities that grant extras).
  - **Kinetics tab** — all known techniques with their Use/Attack/Activate buttons, topped by a **Kinetic
    Proficiencies** summary: completing a Kinetic's **Adept** tier (all 3 techniques) grants **proficiency**
    in it, and completing its **Expert** tier grants **expertise** (double proficiency bonus on that Kinetic's
    technique attacks). Your background focus Kinetic is proficient from the start.
  - **Skills tab** — all 36 skills, tap to roll. Skills under a **flaw** are tagged ⚠ and roll with disadvantage.
  - **Traits tab** — your Heritage's positive **traits**, plus your two **flaws** (negative traits): the
    **background** flaw (disadvantage on a whole attribute's skills & Kinetic technique attacks) and the
    **heritage** flaw (disadvantage on one specific skill). Both apply automatically at the table.
  - **Description tab** — your character's appearance & basic info (Basics, Physical appearance, and
    distinguishing features) as filled in at creation. Fully editable here too — each field saves as you
    go — so you can flesh out or change a look mid-campaign. Flavor only; nothing here touches the rules.
    - **Character Artwork (optional):** upload your own art for the character, then **drag a square over the
      face and crop it** into a round **thumbnail**. The thumbnail then shows **next to your name at the top of
      the sheet** and **on the character-select screen**. Images are automatically downscaled/compressed and
      saved **on this device only** (per-device, like everything else). Replace or remove the art anytime.
  - **Inventory tab** — carry weight, carried items (equip, actions, config), a custom-item form, and a
    **🔍 Browse Item Catalog** button that opens a dedicated **catalog screen**: search/filter the item
    catalog (weapons + armor, consumables, tools, gear) and Add any of them (weapons arrive attack-ready
    with type + damage die). **Every item carries a short flavor description** of what it is — shown when you
    expand a carried item and on each catalog row (and the search matches description text too). Each weapon
    also shows whether it's **one- or two-handed** (matters for dual-wielding) and its **rarity** — Common ·
    Uncommon · Rare · Very Rare · Legendary. Only **Common** weapons are offered as starting gear;
    higher-rarity weapons (bigger dice + special properties) are found in play. **Tool kits are tied to
    skills** — every gear-using skill has a matching kit (e.g. Lockpicks → Sleight of Hand, Medkit →
    Medicine, Disguise Kit → Deception), and the kit shows the skill it aids (🛠 *Aids &lt;Skill&gt;*).
    **Consumables actually work** — Use a Health Draught, KP Elixir, Stimpak, Vital Tonic, Chakra Salve,
    or Panacea and it rolls the effect and updates your HP/KP, chakras, and limbs on the spot (capped at
    your max), then logs it. A **← Inventory** button returns.
  - **🔨 Crafting tab** (after Inventory; a **downtime** activity — no combat action) — the whole crafting
    workshop: your **Salvage Materials** and **Components** on hand, a **⚙ Craft Components** workbench, your
    **Known Recipes**, a **📖 Learn a Recipe** browser, and a **✎ Create Custom Item** builder.
    - **Two-tier crafting.** Raw **salvage** (14 tiered mats) → **components** (blades, barrels, plating…) →
      **weapons & armor**. Weapons and armor are built from components, not raw materials directly.
    - **Components have a grade** — **Crude · Standard · Fine · Masterwork** — set by the materials you use
      (Basic mats = low grades, Exotic mats = high). You get them by crafting on the **Craft Components**
      workbench, by **♻ Salvaging** gear (returns its higher-value parts), or by finding them as loot. Grades
      are color-coded on the component chips.
    - **You can only craft recipes you know.** A character **starts** knowing the **Common** gear of the craft
      skills they're **proficient** in; you **learn** more by **♻ Salvaging** an example (from an item's detail
      on the Inventory tab), or via a GM/discovery grant in the **Learn a Recipe** browser. Known Recipes are
      **grouped by type** (collapsible, with a "known · craftable now" count), with a **"Only show what I can
      craft now"** switch and a cross-type search.
    - **Crafting** rolls a **skill check** — `d20 + craft-skill modifier` vs a **DC by rarity/grade** (Common 10
      · Uncommon 13 · Rare 16 · Very Rare 20). **Anyone can attempt**; proficiency and a good attribute improve
      the odds (skill by material: metal → Laborer's Tools, tech → Technology, crystal → Paranormal, chem/plant →
      Herbalism, wood/hide/cloth → Nature Tools). **Success** spends the ingredients; **failure wastes half**
      (rounded up). Legendary items can't be crafted; salvaging is deliberately lossy.
    - **Custom items — within the balance rules.** The **Create Custom Item** builder designs a fully playable
      item. **Weapons** cascade **Item Category → Weapon Type → Subtype** (Heavy Weapons → Great Hammers / Axes /
      …); the subtype sets a **base damage die** that each quality grade steps up a hard-capped die ladder.
      **Armor** cascades **Item Category → Armor Type** (Light/Medium/Heavy). You then pick a **grade for each
      component slot**; the item's **quality is the average of those grades**, which sets its rarity and stats.
      Its recipe is the exact components you chose, and it becomes a **known custom recipe** you can craft and
      equip. Consumables/tools/misc stay simple (heal/effect or aided skill). A live preview shows the result,
      recipe, and craft check before you save.
  - **🐾 Pets tab** — **simple NPC companions you control** (animals, robots, small monsters, demons, …). Add
    them by hand for now — a bestiary of pre-statted creatures is planned. Each companion gets a mini **stat
    block**: HP (with damage/heal), Defense Score, Speed, an Initiative modifier, a list of **attacks**
    (name · to-hit · damage die · note) and **traits/abilities**, plus free-form notes. Tap-to-roll buttons for
    **initiative**, each attack's **to-hit** and **damage** post straight to your roll log, so you can run a
    companion in combat right beside your character.
  - **Sheet tab** — the core overview:
  - **Body · Mind · Soul pools** — shown side by side as bold colored **current/max** numbers
    (Body/HP in **red**, Mind/KP in **blue**, Soul in **cyan**), pen-and-paper style. Soul shows your
    **Soul Level / 30**. **Tap a pool** to open its inline editor: Body/Mind get damage/heal (or
    spend/restore) controls (quick ±1/±5 or type an amount); Soul reveals its **XP** tracker + adjusters
    and the **⭐ Level Up** button (opens the Level Up screen; flags any unspent Technique / Attribute /
    Combat-Skill points). Leveling is GM-driven; XP thresholds are still being tuned
  - **Speeds** — a quick reference of your **Movement · Climb · Jump · Swim** (walk speed reflects Heavy-armor
    and crippled-leg penalties). Movement shows here *and* on the Combat tab; the rest of the combat stats
    and controls live on the **Combat tab**
  - **Interactive Chakra Chart** — click pips to add hits; penalties auto-apply to that attribute's
    modifier (disadvantage → half → zero → locked out) and everything that uses it
  - **Attributes** show live, chakra-adjusted modifiers, with active buffs highlighted
  - **Techniques** — behave by type:
    - **Ranged single-target** (Ki Bolt, Ki Blast) → **⚔ Attack** rolls d20 + attribute mod + proficiency
      to hit (spends KP), then **🎲 Damage** rolls damage on a hit (no extra KP)
    - **AoE** (Ki Volley) → auto-hits everything in the area; one button rolls damage per target
    - **Sustained** (Ki Shield → +DS, Ki Flame → attribute buff) → Activate/End; **End Turn** pays upkeep.
      A buff that raises attributes also raises the matching **pool** while active — a body-attribute buff
      (STR/AGI/CON) adds to **max HP**, a mind-attribute buff (INT/WIS/CHA) to **max KP** (e.g. Ki Flame = +6 max HP);
      a **full** bar stays full (current rises to the new max), a **partial** bar keeps its value as headroom to
      heal into, and the max drops back (clamping current) when the buff ends
    - **Heal / grant** (Focus Ki, Share Ki) → Use
  - **Skills** — tap any skill to roll a d20 check (adds mod + proficiency, rolls disadvantage if the
    chakra is hit, disabled if locked out)
  - **Short / Long Rest** — heals chakras per the rules (long rest also restores HP/KP fully)
  - **Inventory & Carry Weight** — add items (name, category, weight, quantity); tracks total weight vs.
    your capacity (100 lb + 10 × CON mod) with an over-encumbered warning; quantity steppers & delete
  - **Equip / Unequip + item actions** — tap an item to expand it:
    - **Weapons** — set a weapon type (sets the governing attribute) + damage die, then **⚔ Attack**
      (d20 + attr mod + proficiency, disadvantage/lockout from chakra applies) and **🎲 Damage** (die + attr mod)
    - **Armor** — three **classes** with a mobility-vs-protection tradeoff: **Light** (full AGI to Defense +
      Stealth advantage, least armor), **Medium** (AGI to Defense capped at +2, the balanced middle),
      **Heavy** (most armor, but no AGI to Defense, −5 ft move, Stealth disadvantage). Everyone is proficient
      with **Light**; **Medium/Heavy** come from your **Heritage** — wear a class you're not trained in and you
      get **no Defense bonus** from it plus **disadvantage on AGI checks & attacks**. Armor has **rarity** too
      (Common→Legendary): rarer pieces grant special protections, and **Legendary** armor can auto-apply perks
      like **advantage on a skill** (e.g. Shadowplate → Stealth). Equipping/unequipping updates your Defense,
      movement, and Stealth live; the expanded item shows its class, rarity, proficiency, and effects
    - **Consumables** — **Use** decrements the quantity (auto-removes at 0)
    - **Melee augments** (e.g. Ki Strike) — on a melee weapon, a **+Ki Strike (3 KP)** button rolls the
      weapon's damage *and* the augment's dice together as one total and spends the KP. Augment techniques
      aren't used standalone; they only appear on equipped melee weapons.
  - **Dice roller** + rolling **log** of every action, saved with the character
  - **Roll result popup** — any roll (attack, skill check, technique damage, initiative, raw dice) flashes a
    big result banner on screen so you never have to scroll to the log; tap or wait to dismiss

## What's next (ideas)
- **Level up** — spend Technique Points, add attribute points on odd levels, Otherkin (Heart chakra) awakens at 15
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
