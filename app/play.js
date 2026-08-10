/* ============================================================
   Psion Chronicles — Live Play Sheet
   The at-the-table screen: HP/KP tracking, interactive chakra
   chart with auto-penalties, KP-spending techniques + upkeep,
   rests, skill checks, and a dice roller. Depends on data.js,
   rules.js, app.js (window.PsionApp).
   ============================================================ */
(function () {
  "use strict";
  const App = window.PsionApp;
  const el = App.el;
  const $ = (s, e) => (e || document).querySelector(s);

  let rec;   // current character record
  let play;  // shorthand for rec.play
  let expandedItem = null; // inventory item id whose detail/actions are open
  let equipPickSlot = null; // Equipment tab: which slot's item-picker is open (null = none)
  let expandedPet = null;  // pet id whose detail/stat block is open on the Pets tab
  let activeTab = "sheet"; // "sheet" | "combat"
  let curId = null;        // track which character is open (reset tab on switch)
  let invSearchQ = "";     // inventory catalog search query
  let invSearchCat = "All"; // inventory catalog category filter
  let catalogOpen = false; // whether the item-catalog sub-screen is open (from the Inventory tab)
  let poolEdit = null;     // which pool's inline editor is open on the Sheet tab: "body"|"mind"|"soul"|null
  let limbSel = null;      // which limb's editor is open on the Limbs tab (limb key) | null
  let chakraSel = null;    // which chakra's editor is open on the Chakras tab (attr key) | null
  let craftSearchQ = "";   // Known-Recipes search on the Crafting tab
  let craftCatOpen = {};   // which Known-Recipes type groups are expanded (by category name)
  let craftOnlyCraftable = false; // Known-Recipes filter: only show recipes you can craft right now
  let learnOpen = false;   // whether the "Learn a Recipe" (discovery) browser is expanded
  let learnSearchQ = "";   // discovery-browser search query
  let customOpen = false;  // whether the "Create Custom Item" builder is expanded
  let compOpen = false;    // whether the "Craft Components" panel is expanded
  // Combat tab: which action-economy groups are expanded (pull-down menus). Actions open by default so the
  // most-used group is visible; Bonus/Reactions/Other start collapsed to cut scrolling. Persisted across the
  // Combat tab's frequent re-renders (each roll refreshes the sheet).
  let combatGroupOpen = { actions: true, bonus: false, reaction: false, other: false };
  // Conditions tracker (Combat tab): whether the "add a condition" catalog picker is expanded.
  let conditionsPickerOpen = false;
  // Live state of the custom-item builder form (survives re-renders so type changes don't lose input).
  // slotGrade maps a component part → the grade (1–4) chosen for that slot on a weapon/armor build.
  let craftForm = { name: "", type: "Weapon", rarity: "Common", weight: "", desc: "", weaponType: "", subtype: "", hands: "1", armorClass: "Light", hp: "", kp: "", skill: "", slotGrade: {} };
  const refresh = () => App.render();

  const bg = () => PC.background(rec.background);
  // A colored progress-bar fill for a .bar-track (width clamped 0–100%).
  function elFill(color, pct) { const f = el("div", "bar-fill"); f.style.width = Math.max(0, Math.min(100, pct)) + "%"; f.style.background = color; return f; }

  /* ---------- init / persistence ---------- */
  function ensurePlay() {
    if (!rec.play) {
      // Seed a fresh play session at the permanent (buff-free) pool maxes.
      rec.play = {
        hp: permMaxHP(), kp: permMaxKP(),
        chakraHits: rec.chakraHits || { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
        active: [], turn: 1, log: [],
      };
    }
    play = rec.play;
    if (!play.chakraHits) play.chakraHits = { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    // The Heart chakra (Otherkin) tracks hits just like the other six once it awakens at Soul Level 15.
    if (play.chakraHits.HEART == null) play.chakraHits.HEART = 0;
    if (!Array.isArray(play.active)) play.active = [];
    // Active status conditions: [{ key, turns }] where turns = null (until removed) or a countdown
    // that ticks down at End Turn and auto-clears at 0. Backfilled for pre-tracker characters.
    if (!Array.isArray(play.conditions)) play.conditions = [];
    if (!Array.isArray(play.log)) play.log = [];
    if (typeof play.turn !== "number") play.turn = 1;
    // Action economy for the current turn (true = already used this turn).
    if (!play.econ) play.econ = { action: false, bonus: false, reaction: false, move: false };
    // Shield Block: transient Defense bonus from a raised shield, cleared at the start of your next turn (End Turn).
    if (typeof play.blockDS !== "number") play.blockDS = 0;
    // Equipment slots: migrate any old flag-only equipped items onto the 2-hands + 6-limb slot model.
    migrateEquipment();
    // A transformation (the Lycan's Shift) that drops to 0 HP reverts you to human form at half HP instead of
    // going down. Enforced here so it catches every damage path. Reverting first drops the CON buff, so the
    // "half" is of your human max HP.
    // Only a PHYSICAL transformation (Lycan, Troll) reverts at 0 HP — an ability-grant invocation (Unicorn's
    // Mystic Steed) has no form to collapse, so it doesn't trigger the half-HP revert.
    if (play.transformed && play.hp <= 0 && (sigTransform() || {}).physical) {
      play.transformed = false;
      play.hp = Math.max(1, Math.floor(maxHP() / 2));
      play.lastMaxHP = maxHP(); // explicit set (not a proportional rescale) — sync so scalePoolToMax leaves HP alone
      logLine("Struck down while transformed — you revert to your normal form at half HP.");
      save(); // persist the revert so it survives a reload, not just the current render
    }
    // Proportional pool scaling: when a technique/ability raises (or lowers) the max pool, current scales
    // with it — a character who's full stays full, one at half stays half. We remember the last max we saw;
    // if it changed, rescale current by the same ratio. Damage/heal/rest never touch the max, so they never
    // trigger a rescale. (Replaces the older "gain headroom, not HP" clamp.) Applies to both pools so a
    // mind-attribute buff scales KP the same way a body-attribute buff scales HP.
    let poolRescaled = false;
    poolRescaled = scalePoolToMax("hp", "lastMaxHP", maxHP()) || poolRescaled;
    poolRescaled = scalePoolToMax("kp", "lastMaxKP", maxKP()) || poolRescaled;
    if (poolRescaled) save(); // persist the rescale so it survives a reload, not just this render
    // Limb HP (called-shot / crippling system). Current per limb; max is a fraction of current max HP.
    if (!play.limbs) {
      play.limbs = {};
      PC.LIMBS.forEach((L) => { play.limbs[L.key] = limbMaxFor(L.key); });
    }
    PC.LIMBS.forEach((L) => {
      const m = limbMaxFor(L.key);
      if (typeof play.limbs[L.key] !== "number") play.limbs[L.key] = m;
      play.limbs[L.key] = Math.min(play.limbs[L.key], m); // clamp to max if maxHP dropped
    });
    // Character appearance / basic info (flavor only). Backfill for characters made before Description existed.
    if (!rec.description) rec.description = App.defaultDescription ? App.defaultDescription() : {};
    // Inventory lives on the character record (persistent gear, not session state).
    if (!Array.isArray(rec.inventory)) rec.inventory = [];
    // Soul Pool = accumulated XP (persistent). Leveling is GM-driven, so level and XP can drift apart
    // (e.g. a character leveled with the button before XP was tracked). Keep them consistent: a character
    // at level L must have at least the XP their level requires, so the "XP to next level" bar always
    // measures real progress within the current level instead of sitting empty below the level's floor.
    if (typeof rec.xp !== "number") rec.xp = 0;
    const xpFloor = PC.xpForLevel(rec.level || 1);
    if (rec.xp < xpFloor) rec.xp = xpFloor;
  }
  function save() {
    const list = App.loadRoster();
    const i = list.findIndex((c) => c.id === rec.id);
    if (i > -1) { list[i] = rec; return App.saveRoster(list); }
    return false;
  }
  // Keep a current pool (hp/kp) at the same fraction of its max when the max changes (buff on/off, attribute
  // edit, transform). `lastKey` stores the max we last saw; a change rescales current by the same ratio.
  // On the very first sight (last unset) we only record the max — no rescale — so loading a character never
  // jumps their HP. Returns true if it actually rescaled (so the caller can persist).
  function scalePoolToMax(cur, lastKey, max) {
    const last = play[lastKey];
    let changed = false;
    if (typeof last === "number" && last > 0 && max !== last && play[cur] != null) {
      play[cur] = Math.round(play[cur] * max / last);
      changed = true;
    }
    if (typeof play[cur] === "number") play[cur] = Math.max(0, Math.min(play[cur], max)); // guard rounding overshoot
    play[lastKey] = max;
    return changed;
  }

  /* ---------- computations ---------- */
  // Max pools use LIVE (buff-aware) scores: a sustained technique that raises attributes raises the
  // matching pool for as long as it's active — body-attribute buffs grow max HP, mind-attribute buffs
  // grow max KP (bodyPool/mindPool sum the attribute scores, so the increase is exactly the buff).
  // The buff-free "permanent" pools are computed separately in ensurePlay to seed a new play session.
  // Boosts/pools include the Otherkin's grant once the Soul Creature is awakened (level 15 + chosen).
  function charBoosts() { return PC.charAttrBoosts(rec); }
  function charPool() { return PC.charPoolBoost(rec); }
  function maxHP() { return PC.bodyPool(liveScores(), charPool()); }
  function maxKP() { return PC.mindPool(liveScores(), charPool()); }
  function permMaxHP() { return PC.bodyPool(PC.effectiveScores(rec.baseScores, charBoosts(), null), charPool()); }
  function permMaxKP() { return PC.mindPool(PC.effectiveScores(rec.baseScores, charBoosts(), null), charPool()); }

  function activeAttrBuffs() {
    const buff = {};
    play.active.forEach((n) => {
      const t = PC.technique(n);
      if (t && t.buff && t.buff.attrFlat) {
        Object.keys(t.buff.attrFlat).forEach((k) => { buff[k] = (buff[k] || 0) + t.buff.attrFlat[k]; });
      }
    });
    return buff;
  }
  // All live attribute buffs = sustained-technique buffs + an active transformation's body buff.
  function allAttrBuffs() {
    const b = activeAttrBuffs();
    const tb = transformAttrBuff();
    Object.keys(tb).forEach((k) => { b[k] = (b[k] || 0) + tb[k]; });
    return b;
  }
  function liveScores() { return PC.effectiveScores(rec.baseScores, charBoosts(), allAttrBuffs()); }
  // The character's awakened Otherkin (Soul Creature), or null before level 15 / if none chosen.
  function myOtherkin() { return (rec.level >= PC.otherkinUnlockLevel() && rec.otherkin) ? PC.otherkin(rec.otherkin) : null; }
  // The Otherkin techniques unlocked so far (auto-granted by Soul Level; cost KP; Heart-chakra governed).
  function knownOtherkinTechs() { const o = myOtherkin(); return o ? PC.otherkinTechniquesAt(o.name, rec.level) : []; }
  // --- Signature ability (rest-gated, like a Barbarian's Rage). Current tier + a remaining-uses counter that
  // refreshes on rest and scales with the tier. Heart lockout suppresses it, same as the Otherkin techniques.
  function sigTier() { const o = myOtherkin(); return o ? PC.otherkinSignatureTier(o.name, rec.level) : null; }
  function sigMaxUses() { const t = sigTier(); return t ? t.uses : 0; }
  function sigUsesLeft() { const m = sigMaxUses(); if (typeof play.sigUses !== "number") return m; return Math.min(play.sigUses, m); }
  // Recharge the signature on rest. A short rest only refills a short-rest signature; a long rest (a full
  // recovery) refills any signature. `kind` is "short" | "long".
  function refreshSignature(kind) {
    const o = myOtherkin(); if (!o || !sigTier()) return;
    if (kind === "long" || o.signature.rest === kind) play.sigUses = sigMaxUses();
  }
  // --- Transformation signatures (the Lycan's Shift): a toggled state that buffs body attributes past the
  // 30 cap, grants natural claws + thick fur, reverts at will or at 0 HP, and is suppressed by a locked Heart.
  function sigTransform() { const o = myOtherkin(); return (o && o.signature && o.signature.transform) ? o.signature.transform : null; }
  // True while the character is actually benefiting from the shift (not suppressed by a locked Heart chakra).
  function transformActive() { return !!(play.transformed && sigTransform() && chakraOf("HEART") < 4); }
  // A `physical: true` transform is a real body change (Lycan, Troll): it reverts at 0 HP and reads as "Transform".
  // Without it (Unicorn's Mystic Steed) the signature merely GRANTS abilities — no form change, no 0-HP revert —
  // so it reads as "Invoke". Verbs/labels drive the button, banner, and log wording.
  function transformPhysical() { return !!((sigTransform() || {}).physical); }
  function transformLabels() {
    return transformPhysical()
      ? { on: "⭐ Transform", off: "Revert (free)", state: "TRANSFORMED", onMsg: "transformed", offMsg: "revert to their normal form", suppressed: "Transformed, but the Heart chakra is locked — the change is suppressed until you rest." }
      : { on: "⭐ Invoke", off: "Dismiss (free)", state: "INVOKED", onMsg: "invoked", offMsg: "let the invocation fade", suppressed: "Invoked, but the Heart chakra is locked — the power is suppressed until you rest." };
  }
  // The per-tier attribute bonus a transformation grants: base at Tier I, then +step each tier after
  // (e.g. Lycan base 3/step 3 → +3/+6/…/+18; Troll base 2/step 1 → +2/+3/…/+7).
  function transformAmount(tierNum) {
    const tr = sigTransform(); if (!tr) return 0;
    return (tr.base || 0) + Math.max(0, (tierNum || 1) - 1) * (tr.step || 0);
  }
  // A transformation's movement multiplier at a tier. `moveMult` is either a flat number (Unicorn's ×2 walking)
  // or {base, step, fly, fromTier} that scales (Wyvern's flight 1.5× → 4×) and may be tier-gated (Strigoi wings
  // at Tier VI). Returns { mult, fly } or null.
  function transformMoveMult(tierNum) {
    const tr = sigTransform(); if (!tr || tr.moveMult == null) return null;
    const mm = tr.moveMult;
    if (typeof mm === "object" && mm.fromTier && (tierNum || 1) < mm.fromTier) return null;
    const mult = (typeof mm === "number") ? mm : ((mm.base || 0) + Math.max(0, (tierNum || 1) - 1) * (mm.step || 0));
    return { mult: mult, fly: !!(typeof mm === "object" && mm.fly) };
  }
  // A scaling Defense-Score MULTIPLIER (Strigoi's pale skin: ×1.5 at Tier I → ×4 at VI). Returns 1 if none.
  function transformDsMult(tierNum) {
    const tr = sigTransform(); if (!tr || !tr.dsMult) return 1;
    const dm = tr.dsMult;
    return (typeof dm === "number") ? dm : ((dm.base || 0) + Math.max(0, (tierNum || 1) - 1) * (dm.step || 0));
  }
  // Tier-gated natural-armor bonus (Wyvern's scaled hide appears at Tier III; Lycan's fur has no gate → always).
  function transformDsBonus(tierNum) {
    const tr = sigTransform(); if (!tr || !tr.dsBonus) return 0;
    return (tierNum || 1) >= (tr.dsFromTier || 1) ? tr.dsBonus : 0;
  }
  // Tier-gated claw/fang die for unarmed strikes (Wyvern's at Tier IV; Lycan's from Tier I).
  function transformClawDie(tierNum) {
    const tr = sigTransform(); if (!tr || !tr.clawDie) return null;
    return (tierNum || 1) >= (tr.clawFromTier || 1) ? tr.clawDie : null;
  }
  // The active flight speed (a transformation whose moveMult is a flight multiplier), or null. Flight does NOT
  // replace walking — it's shown as its own Fly speed = mult × your ground movement.
  function flySpeed() {
    if (!transformActive()) return null;
    const t = sigTier(); if (!t) return null;
    const mm = transformMoveMult(t.tier);
    if (!mm || !mm.fly) return null;
    return Math.round(effectiveMovement() * mm.mult);
  }
  // The flat attribute buff from an active transformation, applied to each listed body attribute.
  function transformAttrBuff() {
    if (!transformActive()) return {};
    const t = sigTier(); if (!t) return {};
    const amt = transformAmount(t.tier), buff = {};
    (sigTransform().attrs || []).forEach((a) => { buff[a] = (buff[a] || 0) + amt; });
    return buff;
  }
  function revertTransform() {
    if (!play.transformed) return;
    const lab = transformLabels();
    play.transformed = false;
    const o = myOtherkin();
    logLine(`${o ? o.name : "You"} ${lab.offMsg}.`);
    App.toast(transformPhysical() ? "Reverted to normal form." : "Invocation ended.");
    save(); refresh();
  }
  function useSignature() {
    const o = myOtherkin(), t = sigTier(); if (!o || !t) return;
    if (chakraOf("HEART") >= 4 && !play.transformed) { App.toast(`${PC.HEART_CHAKRA.name} chakra locked — ${o.signature.name} is dormant until you rest.`); return; }
    if (sigTransform()) {
      // Toggle: activating spends a use and shifts you; reverting is free.
      if (play.transformed) { revertTransform(); return; }
      if (sigUsesLeft() <= 0) { App.toast(`No ${o.signature.name} uses left — take a ${o.signature.rest} rest.`); return; }
      play.sigUses = sigUsesLeft() - 1;
      play.transformed = true;
      const lab = transformLabels(), attrs = sigTransform().attrs;
      const gain = (attrs && attrs.length && transformAmount(t.tier)) ? `+${transformAmount(t.tier)} to ${attrs.length >= 6 ? "all attributes" : attrs.join("/")}` : `Tier ${t.tier}`;
      logLine(`${o.signature.name} — ${lab.onMsg} (${gain}). ${sigUsesLeft()}/${sigMaxUses()} uses left.`);
      App.toast(transformPhysical() ? `Transformed — ${o.name} unleashed!` : `${o.signature.name} invoked!`);
      // An on-activation burst (the Strigoi's "elemental current" at Tier V+): heal a % of max HP and clear
      // any damaged limbs and chakras.
      const oa = sigTransform().onActivate;
      if (oa && t.tier >= (oa.fromTier || 1)) {
        if (oa.healPct) play.hp = clamp(play.hp + Math.floor(maxHP() * oa.healPct / 100), 0, maxHP());
        if (oa.recoverLimbs) PC.LIMBS.forEach((L) => { play.limbs[L.key] = limbMaxFor(L.key); });
        if (oa.recoverChakras) { PC.ATTRS.forEach((a) => { play.chakraHits[a] = 0; }); if (play.chakraHits.HEART != null) play.chakraHits.HEART = 0; }
        logLine(`Elemental current — regained ${oa.healPct || 0}% HP${oa.recoverLimbs || oa.recoverChakras ? " and cleared damaged limbs & chakras" : ""}.`);
      }
      save(); refresh();
      return;
    }
    if (sigUsesLeft() <= 0) { App.toast(`No ${o.signature.name} uses left — take a ${o.signature.rest} rest.`); return; }
    play.sigUses = sigUsesLeft() - 1;
    logLine(`${o.signature.name} activated (Tier ${t.tier}) — ${sigUsesLeft()}/${sigMaxUses()} uses left.`);
    App.toast(`${o.signature.name} activated!`);
    save(); refresh();
  }
  function baseMod(attr) { return PC.abilityMod(liveScores()[attr]); }       // before chakra
  function chakraOf(attr) { return play.chakraHits[attr] || 0; }
  function adjMod(attr) { return PC.chakraEffect(chakraOf(attr)).effMod(baseMod(attr)); } // after chakra
  function isDisadv(attr) { return chakraOf(attr) >= 1; }
  function isLocked(attr) { return chakraOf(attr) >= 4; }
  // Negative traits: a background flaw = disadvantage on a whole attribute's skills & techniques;
  // a heritage flaw = disadvantage on one specific skill.
  function bgFlaw() { const b = bg(); return b && b.flaw ? b.flaw : null; }
  function heritageFlaw() { const h = PC.heritage(rec.heritage); return h && h.flaw ? h.flaw : null; }
  function flawDisadvAttr(attr) { const f = bgFlaw(); return !!(f && f.disadvAttr === attr); }
  function flawDisadvSkill(name) { const f = heritageFlaw(); return !!(f && f.disadvSkill === name); }
  // Display name for a chakra key — the six attribute chakras plus the Heart (Otherkin) chakra.
  function chakraName(key) { return key === "HEART" ? PC.HEART_CHAKRA.name : (PC.CHAKRAS[key] ? PC.CHAKRAS[key].name : key); }
  // If the chakra is locked out (4 hits), a reason string for disabling its rolls; else null.
  function lockReason(attr) {
    if (!attr || !isLocked(attr)) return null;
    return attr === "HEART"
      ? `${PC.HEART_CHAKRA.name} chakra locked out — your Otherkin is dormant until you rest`
      : `${PC.CHAKRAS[attr].name} chakra locked out — no ${attr} rolls`;
  }

  // --- Fusion chakra penalty (FUSIONS.md: a fusion is tied to BOTH parents' chakras — "if either
  // parent chakra is damaged, the fusion's techniques are less effective"). A fusion technique answers
  // to the MORE-DAMAGED of its two parent chakras: it rolls at disadvantage if either is hit, its
  // modifier suffers the worse chakra's penalty, and it locks out if either parent chakra is locked.
  // A base technique answers only to its own attribute's chakra, so these collapse to the single case.
  function techChakraAttrs(t) {
    // Otherkin techniques answer to the HEART chakra — the seat of the Soul Creature — not their roll attribute.
    if (t && t.otherkin) return ["HEART"];
    if (t && t.fusion && Array.isArray(t.parents)) {
      const attrs = t.parents.map((p) => (PC.kinetic(p) || {}).attr).filter(Boolean);
      if (attrs.length) return Array.from(new Set(attrs));
    }
    return t && t.attr ? [t.attr] : [];
  }
  // The governing (most-damaged) chakra attribute for this technique.
  function techChakraAttr(t) {
    const attrs = techChakraAttrs(t);
    if (!attrs.length) return t && t.attr;
    return attrs.reduce((worst, a) => (chakraOf(a) > chakraOf(worst) ? a : worst), attrs[0]);
  }
  function techIsDisadv(t) { return isDisadv(techChakraAttr(t)); }
  function techIsLocked(t) { return isLocked(techChakraAttr(t)); }
  function techLockReason(t) { return techLockName(t) ? lockReason(techChakraAttr(t)) : null; }
  function techLockName(t) { const a = techChakraAttr(t); return a && isLocked(a) ? chakraName(a) : null; }
  // Chakra-adjusted modifier for a technique roll: the worse parent chakra's penalty (for a fusion)
  // applied to the base modifier of whichever attribute the roll actually scales on (modAttr).
  function techAdjMod(t, modAttr) { return PC.chakraEffect(chakraOf(techChakraAttr(t))).effMod(baseMod(modAttr)); }
  // Card note for the damaged-but-not-locked governing chakra, or null when healthy/locked (a lock is shown
  // via the disabled button + title). Shown for FUSION cards (penalty can come from a parent chakra that
  // isn't the listed attribute) and OTHERKIN cards (governed by the Heart chakra, not their roll attribute).
  // Base techniques skip it — their chakra hit is self-evident from their own attribute.
  function techChakraPenaltyNote(t) {
    if (!t || (!t.fusion && !t.otherkin)) return null;
    const a = techChakraAttr(t); if (!a) return null;
    const h = chakraOf(a); if (h < 1 || h >= 4) return null; // 0 = healthy, 4 = shown via lock instead
    const parent = t.fusion && techChakraAttrs(t).length > 1 ? " (parent)" : "";
    return `⚠ ${chakraName(a)} chakra${parent} damaged — ${PC.chakraEffect(h).label.toLowerCase()}`;
  }

  /* ---------- limbs ---------- */
  function limbDef(key) { return PC.LIMBS.find((L) => L.key === key); }
  function limbMaxFor(key) { return Math.ceil(maxHP() * limbDef(key).frac); }
  function limbCurrent(key) { return play.limbs[key] != null ? play.limbs[key] : limbMaxFor(key); }
  function limbCrippled(key) { return limbCurrent(key) <= 0; }
  function anyArmCrippled() { return limbCrippled("larm") || limbCrippled("rarm"); }
  function bothArmsCrippled() { return limbCrippled("larm") && limbCrippled("rarm"); }
  function crippledLegs() { return (limbCrippled("lleg") ? 1 : 0) + (limbCrippled("rleg") ? 1 : 0); }
  function headCrippled() { return limbCrippled("head"); }
  const MIND = ["INT", "WIS", "CHA"];
  function effectiveMovement() {
    let m = PC.derive(liveScores(), rec.level).movement;
    // Heavy armor slows you by 5 ft (unless the armor's servos negate it).
    if (wornArmorClass() === "Heavy" && !armorNegatesMovePenalty()) m = Math.max(0, m - 5);
    const legs = crippledLegs();
    if (legs >= 2) m = 0;
    else if (legs === 1) m = Math.floor(m / 2);
    // A transformation may multiply GROUND movement (e.g. the Unicorn's Mystic Steed doubles it). A flight
    // multiplier (the Wyvern's wings) does not touch walking — it surfaces as a separate Fly speed instead.
    if (transformActive()) {
      const t = sigTier();
      const mm = t ? transformMoveMult(t.tier) : null;
      if (mm && !mm.fly) m = Math.round(m * mm.mult);
    }
    return m;
  }
  // A called shot: damage the limb AND main HP, capped at the limb's current HP (excess is lost).
  function calledShot(key, amount) {
    const cur = limbCurrent(key);
    const applied = Math.min(Math.max(0, amount), cur);
    play.limbs[key] = cur - applied;
    play.hp = clamp(play.hp - applied, 0, maxHP());
    const nowCrippled = play.limbs[key] <= 0 && cur > 0;
    const excess = Math.max(0, amount - cur);
    let msg = `Called shot — ${limbDef(key).name}: ${amount} dmg → ${applied} to HP & limb`;
    if (excess > 0) msg += ` (${excess} excess lost)`;
    if (nowCrippled) msg += ` · ${limbDef(key).name} CRIPPLED!`;
    logLine(msg);
    if (nowCrippled) App.toast(`${limbDef(key).name} crippled!`);
    save(); refresh();
  }
  function healLimb(key, amount) {
    play.limbs[key] = clamp(limbCurrent(key) + amount, 0, limbMaxFor(key));
    save(); refresh();
  }

  /* ---------- armor ---------- */
  // Armor classes the character is proficient with: Light is universal, plus any their Heritage grants.
  function armorProfClasses() {
    const h = PC.heritage(rec.heritage);
    const extra = (h && Array.isArray(h.armorProf)) ? h.armorProf : [];
    return ["Light"].concat(extra.filter((c) => c !== "Light"));
  }
  function proficientWithArmorClass(cls) { return !cls || armorProfClasses().indexOf(cls) > -1; }
  function equippedArmor() { return (rec.inventory || []).filter((it) => it.equipped && it.category === "Armor"); }
  // Worn class = the heaviest equipped armor class (drives AGI-to-Defense gating, movement, stealth).
  function wornArmorClass() {
    const order = { Light: 1, Medium: 2, Heavy: 3 };
    let worst = null, rank = 0;
    equippedArmor().forEach((it) => { const c = it.armorClass; if (c && (order[c] || 0) > rank) { rank = order[c]; worst = c; } });
    return worst;
  }
  // Wearing any armor whose class you're NOT proficient with? (voids its Defense; disadvantage on AGI.)
  function wearingUnproficientArmor() { return equippedArmor().some((it) => it.armorClass && !proficientWithArmorClass(it.armorClass)); }
  // AGI's contribution to Defense, gated by the worn class: Light/none full, Medium capped +2, Heavy none.
  function agiToDefense() {
    const cls = wornArmorClass();
    const agi = adjMod("AGI");
    if (cls === "Heavy") return 0;
    if (cls === "Medium") return Math.min(agi, 2);
    return agi;
  }
  // Skills that equipped, proficient armor grants advantage on (rarity/legendary advSkill grants).
  function armorAdvSkills() {
    const out = [];
    equippedArmor().forEach((it) => {
      if (it.grants && it.grants.advSkill && proficientWithArmorClass(it.armorClass)) {
        [].concat(it.grants.advSkill).forEach((s) => { if (out.indexOf(s) < 0) out.push(s); });
      }
    });
    return out;
  }
  function armorNegatesMovePenalty() { return equippedArmor().some((it) => it.grants && it.grants.noMovePenalty && proficientWithArmorClass(it.armorClass)); }

  function defenseScore() {
    let ds = PC.RULES.BASE_DS + agiToDefense() + adjMod("CON");
    play.active.forEach((n) => {
      const t = PC.technique(n);
      if (t && t.buff && t.buff.dsFromMod) ds += adjMod(t.buff.dsFromMod);
    });
    // Armor's Defense bonus applies only if you're proficient with its class; otherwise it grants nothing.
    // Torso body armor counts in full; the five accessory slots (head/back/arms/legs/feet) sum but are
    // capped (accessoryDS), so a fully-matched set can't run the score away — body armor + shield stay king.
    equippedArmor().forEach((it) => {
      if (it.dsBonus && proficientWithArmorClass(it.armorClass) && armorApparelSlot(it) === "torso") ds += Number(it.dsBonus) || 0;
    });
    ds += accessoryDS().applied;
    // A held shield adds its Defense while equipped (no proficiency gate — anyone can raise a shield).
    const sh = equippedShield();
    if (sh) ds += Number(sh.dsBonus) || 0;
    // Block reaction: a raised shield adds its Defense again against one hit, until your next turn.
    if (play.blockDS) ds += play.blockDS;
    // A transformation's natural armor (Lycan's fur, Wyvern's scaled hide) adds to Defense while shifted; a
    // Defense MULTIPLIER (the Strigoi's pale skin) then scales the whole score.
    if (transformActive()) { const t = sigTier(); if (t) { ds += transformDsBonus(t.tier); ds = Math.round(ds * transformDsMult(t.tier)); } }
    return ds;
  }
  function activeUpkeep() {
    return play.active.reduce((s, n) => { const t = PC.technique(n); return s + ((t && t.upkeep) || 0); }, 0);
  }
  /* ---------- action economy ---------- */
  // Which econ slot an action-type consumes. "Full Turn" spends both Action and Bonus.
  function econBlocked(actionType) {
    if (actionType === "Bonus Action") return play.econ.bonus;
    if (actionType === "Reaction") return play.econ.reaction;
    if (actionType === "Full Turn") return play.econ.action || play.econ.bonus;
    return play.econ.action; // "Action" (default)
  }
  function consumeEcon(actionType) {
    // Spending a slot also auto-collapses that action-economy group on the Combat tab (its pull-down menu),
    // since you can't use it again this turn — one less thing to scroll past. You can still reopen it manually.
    if (actionType === "Bonus Action") { play.econ.bonus = true; combatGroupOpen.bonus = false; }
    else if (actionType === "Reaction") { play.econ.reaction = true; combatGroupOpen.reaction = false; }
    else if (actionType === "Full Turn") { play.econ.action = true; play.econ.bonus = true; combatGroupOpen.actions = false; combatGroupOpen.bonus = false; combatGroupOpen.other = false; }
    else { play.econ.action = true; combatGroupOpen.actions = false; } // "Action"
  }
  function econName(actionType) {
    if (actionType === "Bonus Action") return "Bonus Action";
    if (actionType === "Reaction") return "Reaction";
    if (actionType === "Full Turn") return "turn (Action + Bonus)";
    return "Action";
  }
  function toggleEconSlot(slot) {
    play.econ[slot] = !play.econ[slot];
    // Keep the matching Combat pull-down in step with a manual slot toggle: spending it collapses the menu,
    // freeing it again reopens it.
    const key = slot === "action" ? "actions" : slot === "bonus" ? "bonus" : slot === "reaction" ? "reaction" : null;
    if (key) combatGroupOpen[key] = !play.econ[slot];
    save(); refresh();
  }

  function knownCombatSkills() {
    const names = PC.heritageGrantedSkills(rec.heritage); // 2 active starters + the style's Passive
    (rec.learnedCombatSkills || []).forEach((n) => { if (names.indexOf(n) < 0) names.push(n); });
    return names;
  }
  function knownTechniques() {
    const names = [];
    if (bg().freeTech) names.push(bg().freeTech);
    (rec.chosenTechniques || []).forEach((n) => { if (!names.includes(n)) names.push(n); });
    (rec.learnedTechniques || []).forEach((n) => { if (!names.includes(n)) names.push(n); }); // bought with TP as you level
    return names;
  }
  // Fusion techniques the character has EARNED — auto-granted the moment they know both halves of a pair.
  // Hidden entirely until then, so a character sees no fusion content until they discover it.
  function knownFusionTechs() { return PC.grantedFusionTechniques(knownTechniques()); }
  function unlockedFusionNames() { return PC.unlockedFusions(knownTechniques()); }
  // Toast a discovery the first time each fusion unlocks (persisted on the record so it fires once).
  function checkFusionDiscoveries() {
    const now = unlockedFusionNames();
    if (!Array.isArray(rec.seenFusions)) rec.seenFusions = [];
    const fresh = now.filter((n) => rec.seenFusions.indexOf(n) < 0);
    if (fresh.length) {
      fresh.forEach((n) => { rec.seenFusions.push(n); App.toast("✨ Fusion Kinetic discovered: " + n + "!"); });
      save();
    }
  }

  /* ---------- mutations ---------- */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function adjustHP(delta) { play.hp = clamp(play.hp + delta, 0, maxHP()); save(); refresh(); }
  function adjustKP(delta) { play.kp = clamp(play.kp + delta, 0, maxKP()); save(); refresh(); }
  function adjustXP(delta) { rec.xp = Math.max(0, (rec.xp || 0) + delta); save(); refresh(); }
  // Unspent level-up points (mirrors app.js renderLevelUp): flags when there's something to spend.
  function unspentPoints() {
    const lvl = rec.level || 1;
    const availTP = Math.max(0, lvl - 1) - (rec.learnedTechniques || []).length;
    const spentAttr = PC.ATTRS.reduce((s, a) => s + ((rec.levelAttr && rec.levelAttr[a]) || 0), 0);
    const availAttr = Math.floor((lvl - 1) / 2) - spentAttr;
    const availCSP = Math.floor(lvl / 5) - (rec.learnedCombatSkills || []).length;
    return { availTP, availAttr, availCSP, any: availTP > 0 || availAttr > 0 || availCSP > 0 };
  }
  function setChakra(attr, hits) { play.chakraHits[attr] = clamp(hits, 0, PC.RULES.CHAKRA_MAX_HITS); save(); refresh(); }

  function logLine(text) { play.log.unshift({ t: text, turn: play.turn }); play.log = play.log.slice(0, 40); }

  // Log a roll AND flash a prominent on-screen result banner so users don't hunt in the log.
  function announce(total, text) { logLine(text); flashRoll(total, text); }
  function flashRoll(total, text) {
    let pop = document.querySelector(".roll-popup");
    if (!pop) {
      pop = document.createElement("div");
      pop.className = "roll-popup";
      pop.onclick = () => pop.classList.remove("show");
      document.body.appendChild(pop);
    }
    pop.innerHTML = `<div class="rp-total">${total != null ? total : ""}</div><div class="rp-text">${text}</div><div class="rp-hint">tap to dismiss</div>`;
    // restart the entrance animation
    pop.classList.remove("show");
    void pop.offsetWidth;
    pop.classList.add("show");
    clearTimeout(pop._t);
    pop._t = setTimeout(() => pop.classList.remove("show"), 5000);
  }

  function shortRest() {
    let healed = 0;
    PC.ATTRS.forEach((a) => { if (play.chakraHits[a] > 0) { play.chakraHits[a] = Math.max(0, play.chakraHits[a] - 1); healed++; } });
    if (heartUnlocked() && play.chakraHits.HEART > 0) { play.chakraHits.HEART = Math.max(0, play.chakraHits.HEART - 1); healed++; }
    refreshSignature("short"); // recharges a short-rest signature
    // Short rest restores half of each limb's max.
    PC.LIMBS.forEach((L) => { play.limbs[L.key] = Math.min(limbMaxFor(L.key), limbCurrent(L.key) + Math.ceil(limbMaxFor(L.key) / 2)); });
    logLine(`Short rest — healed 1 hit on ${healed} chakra${healed === 1 ? "" : "s"}; limbs +½ each.`);
    App.toast("Short rest taken.");
    save(); refresh();
  }
  function longRest() {
    PC.ATTRS.forEach((a) => { if (play.chakraHits[a] > 0) play.chakraHits[a] = Math.max(0, play.chakraHits[a] - 2); });
    if (heartUnlocked() && play.chakraHits.HEART > 0) play.chakraHits.HEART = Math.max(0, play.chakraHits.HEART - 2);
    refreshSignature("long"); // a long rest recharges any signature
    // End sustained techniques and any transformation first, so "fully restored" fills the permanent pools.
    play.active = []; play.transformed = false; play.turn = 1;
    play.hp = maxHP(); play.kp = maxKP();
    play.econ = { action: false, bonus: false, reaction: false, move: false };
    combatGroupOpen = { actions: true, bonus: false, reaction: false, other: false }; // fresh menus
    PC.LIMBS.forEach((L) => { play.limbs[L.key] = limbMaxFor(L.key); }); // limbs fully restored
    logLine("Long rest — HP & KP fully restored, chakras +2, limbs fully healed, sustained techniques ended.");
    App.toast("Long rest — fully restored.");
    save(); refresh();
  }
  function endTurn() {
    const up = activeUpkeep();
    if (up > 0) {
      if (play.kp >= up) { play.kp -= up; logLine(`End of turn — paid ${up} KP upkeep for ${play.active.length} technique(s).`); }
      else {
        logLine(`End of turn — not enough KP for ${up} upkeep; sustained techniques ended.`);
        play.active = [];
        App.toast("Ran out of KP — sustained techniques ended.");
      }
    }
    tickConditions(); // count down any timed status effects and clear the expired ones
    if (play.blockDS) { play.blockDS = 0; } // a raised shield's Block lasts only until your next turn
    play.turn += 1;
    play.econ = { action: false, bonus: false, reaction: false, move: false }; // refresh for the new turn
    combatGroupOpen = { actions: true, bonus: false, reaction: false, other: false }; // reopen Actions for the new turn
    save(); refresh();
  }

  /* ---------- conditions / status effects ---------- */
  function hasCondition(key) { return (play.conditions || []).some((c) => c.key === key); }
  function addCondition(key) {
    if (hasCondition(key)) return; // already tracked — leave its duration alone
    const cat = PC.condition(key); if (!cat) return;
    play.conditions.push({ key: key, turns: null }); // starts open-ended (∞) until a duration is set
    logLine(`${cat.emoji} ${cat.name} — condition applied.`);
    save(); refresh();
  }
  function removeCondition(key) {
    const cat = PC.condition(key);
    play.conditions = (play.conditions || []).filter((c) => c.key !== key);
    if (cat) logLine(`${cat.emoji} ${cat.name} — condition cleared.`);
    save(); refresh();
  }
  // Nudge a condition's duration: null (∞) → 1 → 2 …, and back down to null. Never below ∞.
  function adjustConditionTurns(key, delta) {
    const c = (play.conditions || []).find((x) => x.key === key); if (!c) return;
    const cur = typeof c.turns === "number" ? c.turns : 0;
    const next = cur + delta;
    c.turns = next <= 0 ? null : next; // 0 or less loops back to the open-ended ∞ state
    save(); refresh();
  }
  // At End Turn: decrement every timed condition; anything that hits 0 expires and is removed.
  function tickConditions() {
    let expired = [];
    (play.conditions || []).forEach((c) => {
      if (typeof c.turns === "number") { c.turns -= 1; if (c.turns <= 0) expired.push(c.key); }
    });
    if (expired.length) {
      play.conditions = play.conditions.filter((c) => expired.indexOf(c.key) < 0);
      expired.forEach((k) => { const cat = PC.condition(k); if (cat) logLine(`${cat.emoji} ${cat.name} — wore off.`); });
    }
  }

  // Kinetic proficiency. The background focus Kinetic is proficient from the start; a Kinetic also
  // becomes proficient once every Adept-tier technique is known, and gains expertise (double prof
  // bonus) once every Expert-tier technique is known.
  function isFocusKinetic(kinetic) { return bg().combat.indexOf(kinetic) > -1; }
  function kineticProfLevel(kinetic) { return PC.kineticProfLevel(kinetic, knownTechniques(), isFocusKinetic(kinetic)); }
  function kineticProfBonusFor(kinetic) { return PC.kineticProfBonus(rec.level, kineticProfLevel(kinetic)); }
  function proficientWithKinetic(t) { return kineticProfLevel(t.kinetic) !== "none"; }
  // Which damaging techniques need a to-hit roll: single-target (non-AoE, non-augment) damage.
  function techniqueNeedsToHit(t) { return !!t.damage && !t.aoe && !(t.augment); }
  function techniqueIsAoE(t) { return !!t.damage && !!t.aoe; }

  // Single-target ranged technique: spend KP, roll d20 + attr mod + prof (if Kinetic-proficient) to hit.
  function attackTechnique(t) {
    if (techIsLocked(t)) { App.toast(`${techLockName(t)} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    const profLvl = kineticProfLevel(t.kinetic);
    const mod = techAdjMod(t, t.attr) + PC.kineticProfBonus(rec.level, profLvl);
    const profTag = profLvl === "expertise" ? " ✦expertise (2× prof)" : profLvl === "proficient" ? " ✓prof" : "";
    // Disadvantage: chakra hit (either parent chakra for a fusion), head crippled, a background flaw on
    // this attribute, or non-proficient armor on an AGI-based technique attack.
    const r = PC.rollCheck(mod, (techIsDisadv(t) || headCrippled() || flawDisadvAttr(t.attr) || (t.attr === "AGI" && wearingUnproficientArmor())) ? "dis" : "normal");
    const dis = r.mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${t.name} attack: d20${dis}${PC.fmtMod(mod)} = ${r.total} to hit${profTag} (−${t.kp} KP; roll Damage if it hits)`);
    save(); refresh();
  }
  // Roll a technique's damage (no KP — the KP was spent on the attack/cast).
  function damageTechnique(t) {
    const r = PC.rollDiceExpr(t.damage.dice);
    const m = techAdjMod(t, t.damage.mod);
    let loc = t.damage.range ? ` (${t.damage.range})` : "";
    announce(r.total + m, `${t.name} damage: ${t.damage.dice}${PC.fmtMod(m)} = [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${r.total + m} ${t.damage.type}${loc}`);
    save(); refresh();
  }
  // AoE technique: spend KP, auto-hit, roll damage applied to each target in the area.
  function castAoE(t) {
    if (techIsLocked(t)) { App.toast(`${techLockName(t)} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    const r = PC.rollDiceExpr(t.damage.dice);
    const m = techAdjMod(t, t.damage.mod);
    announce(r.total + m, `${t.name}: auto-hits ${t.damage.area || "the area"} — ${t.damage.dice}${PC.fmtMod(m)} = [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${r.total + m} ${t.damage.type} to each target (−${t.kp} KP)`);
    save(); refresh();
  }

  // Non-attack techniques (heal, grant, buffs, sustained). Damaging ones use attack/damage/AoE above.
  function useTechnique(t) {
    if (t.augment && t.augment.kind === "melee-damage") {
      App.toast(`${t.name} augments a melee attack — use it from a weapon's damage roll.`); return;
    }
    if (t.sustained) { toggleSustained(t); return; }
    if (techniqueIsAoE(t)) { castAoE(t); return; }
    if (techniqueNeedsToHit(t)) { attackTechnique(t); return; }
    if (techIsLocked(t)) { App.toast(`${techLockName(t)} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    let msg = `${t.name} (−${t.kp} KP)`;
    let flashTotal = null;
    if (t.heal) {
      const r = PC.rollDiceExpr(t.heal.dice);
      const m = techAdjMod(t, t.heal.mod);
      const amt = r.total + m; flashTotal = amt;
      if (t.heal.target === "self") {
        play.hp = clamp(play.hp + amt, 0, maxHP());
        msg += ` → healed yourself [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${amt} HP`;
      } else {
        msg += ` → heal an ally [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${amt} HP`;
      }
    } else if (t.grantKP) {
      const r = PC.rollDiceExpr(t.grantKP.dice);
      const m = techAdjMod(t, t.grantKP.mod);
      const amt = r.total + m; flashTotal = amt;
      msg += ` → grant ${amt} KP to an ally ([${r.rolls.join(",")}]${PC.fmtMod(m)})`;
    }
    if (flashTotal != null) announce(flashTotal, msg); else logLine(msg);
    save(); refresh();
  }
  function toggleSustained(t) {
    const i = play.active.indexOf(t.name);
    if (i > -1) { play.active.splice(i, 1); logLine(`${t.name} ended.`); } // ending is free
    else {
      if (techIsLocked(t)) { App.toast(`${techLockName(t)} chakra locked — can't use ${t.kinetic}.`); return; }
      if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
      if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
      // Capture the pre-activation maxes so a *full* bar can stay full when this buff raises the pool.
      const oldMaxHP = maxHP(), oldMaxKP = maxKP();
      play.kp -= t.kp; play.active.push(t.name); consumeEcon(t.action);
      // If a bar was full (current still at the old max after paying costs) and the buff raised that
      // pool, top it up to the new max — a full bar stays full. A partial bar keeps its value (headroom),
      // so toggling can never net free HP/KP. (KP here is already reduced by this technique's cost.)
      if (play.hp >= oldMaxHP) play.hp = maxHP();
      if (play.kp >= oldMaxKP) play.kp = maxKP();
      logLine(`${t.name} activated (−${t.kp} KP; ${t.upkeep || 0} KP/turn upkeep).`);
    }
    save(); refresh();
  }

  // 🎖 Combat skill — costs no KP, only an action-economy slot (Action / Bonus / Reaction). Spending
  // the slot logs the effect; the roll/adjudication itself is up to the table, like a non-damage technique.
  function useCombatSkill(c) {
    if (econBlocked(c.action)) { App.toast(`You've already used your ${econName(c.action)} this turn.`); return; }
    consumeEcon(c.action);
    logLine(`🎖 ${c.name} (${econName(c.action)})${c.style ? " · " + c.style : ""} — ${c.effect}`);
    App.toast(`${c.name} used — spent your ${econName(c.action)}.`);
    save(); refresh();
  }

  // Attack sources for a Marksmanship-style called shot: equipped weapons + single-target attack
  // techniques. Each carries the governing attribute and whether the character is proficient, so the
  // called-shot check rolls with "the attack's attribute + proficiency".
  function calledShotSources() {
    const src = [];
    (rec.inventory || []).filter((it) => it.equipped && it.category === "Weapon" && it.weaponType && it.damage)
      .forEach((it) => { const a = weaponAttr(it); const prof = proficientWithType(it); src.push({ label: `${it.name} (${a})`, attr: a, profBonus: prof ? PC.profBonus(rec.level) : 0, profTag: prof ? " ✓prof" : "" }); });
    knownTechniques().map((n) => PC.technique(n)).filter(Boolean).filter(techniqueNeedsToHit)
      .forEach((t) => { const lvl = kineticProfLevel(t.kinetic); src.push({ label: `${t.name} (${t.attr})`, attr: t.attr, profBonus: PC.kineticProfBonus(rec.level, lvl), profTag: lvl === "expertise" ? " ✦expertise" : lvl === "proficient" ? " ✓prof" : "" }); });
    return src;
  }
  // Roll the called-shot skill check for a Marksmanship-style combat skill, using the chosen attack's
  // attribute (+ proficiency). Spends the skill's action slot; the GM adjudicates the result vs the DC.
  function rollCalledShot(c, source) {
    if (!source) { App.toast("Pick the ranged attack you made first."); return; }
    if (isLocked(source.attr)) { App.toast(`${PC.CHAKRAS[source.attr].name} chakra locked — can't aim with ${source.attr}.`); return; }
    if (econBlocked(c.action)) { App.toast(`You've already used your ${econName(c.action)} this turn.`); return; }
    consumeEcon(c.action);
    const mod = adjMod(source.attr) + (source.profBonus || 0);
    const mode = isDisadv(source.attr) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `🎖 ${c.name} called shot: d20${dis}${PC.fmtMod(mod)} = ${r.total}${source.profTag || ""} — vs the GM's DC (target size/difficulty). On a success, apply your ${source.label} damage to the called limb.`);
    save(); refresh();
  }

  function rollSkill(skill) {
    if (isLocked(skill.attr)) { App.toast(`${PC.CHAKRAS[skill.attr].name} chakra locked — can't use ${skill.attr} skills.`); return; }
    const proficient = bg().skills.includes(skill.name) || (rec.chosenSkills || []).includes(skill.name);
    const mod = adjMod(skill.attr) + (proficient ? PC.profBonus(rec.level) : 0);
    const worn = wornArmorClass();
    // Disadvantage sources: chakra hit; head crippled on a Mind (INT/WIS/CHA) check; a background flaw
    // on this attribute; a heritage flaw naming this skill; non-proficient armor on any AGI check; and
    // Heavy armor on Stealth.
    let dis = isDisadv(skill.attr) || (headCrippled() && MIND.indexOf(skill.attr) > -1) || flawDisadvAttr(skill.attr) || flawDisadvSkill(skill.name);
    if (skill.attr === "AGI" && wearingUnproficientArmor()) dis = true;
    if (skill.name === "Stealth" && worn === "Heavy") dis = true;
    // Advantage sources: Light armor on Stealth; a skill named by equipped armor's advSkill grant.
    const adv = (skill.name === "Stealth" && worn === "Light") || armorAdvSkills().indexOf(skill.name) > -1;
    // Advantage and disadvantage cancel to a normal roll.
    const mode = (adv && !dis) ? "adv" : (dis && !adv) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const tag = mode === "dis" ? ` (disadvantage: [${r.d20s.join(",")}]→${r.picked})`
      : mode === "adv" ? ` (advantage: [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${skill.name} check: d20${tag}${PC.fmtMod(mod)} = ${r.total}`);
    save(); refresh();
  }

  /* ---------- inventory ---------- */
  function carryUsed() {
    return (rec.inventory || []).reduce((s, it) => s + (Number(it.weight) || 0) * (Number(it.qty) || 1), 0);
  }
  function carryCapacity() { return PC.derive(liveScores(), rec.level).carry; }
  function addItem(name, weight, qty, category) {
    if (!name) return;
    rec.inventory.push({
      id: "it_" + (rec.inventory.length + 1) + "_" + name.replace(/\s+/g, "").slice(0, 6),
      name: name, weight: Number(weight) || 0, qty: Math.max(1, parseInt(qty, 10) || 1),
      category: category || "Misc",
    });
    logLine(`Picked up ${qty > 1 ? qty + "× " : ""}${name}.`);
    save(); refresh();
  }
  // Add a catalog item (from the browse/search list) to the character's inventory.
  function addCatalogItem(item) {
    // Stackable rewards (raw salvage, components, junk) merge into an existing same-name stack instead of
    // littering the bag with qty-1 duplicates — handy when a GM hands out a pile of loot.
    if (item.category === "Salvage" || item.category === "Component" || item.category === "Junk") {
      const ex = (rec.inventory || []).find((it) => it.category === item.category && it.name === item.name);
      if (ex) ex.qty = (Number(ex.qty) || 0) + 1;
      else rec.inventory.push(Object.assign({}, item, { qty: 1, id: "it_" + Date.now().toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6) }));
      logLine(`Added ${item.name}.`); App.toast(`Added ${item.name}.`); save(); refresh(); return;
    }
    // Ammo is tracked in rounds: a pickup adds `count` rounds, merging into an existing stack of the same name.
    if (item.category === "Ammo") {
      const rounds = Number(item.count) || 1;
      const ex = (rec.inventory || []).find((it) => it.category === "Ammo" && it.name === item.name);
      if (ex) ex.qty = (Number(ex.qty) || 0) + rounds;
      else rec.inventory.push(Object.assign({}, item, { qty: rounds, id: "it_" + Date.now().toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6) }));
      logLine(`Added ${rounds} ${item.name}.`); App.toast(`Added ${rounds} ${item.name}.`); save(); refresh(); return;
    }
    // Thrown weapons are their own ammo — start with a handful so you can actually throw a few.
    const startQty = item.thrown ? 5 : 1;
    const copy = Object.assign({}, item, {
      qty: startQty,
      id: "it_" + Date.now().toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6),
    });
    rec.inventory.push(copy);
    logLine(`Added ${item.name} to inventory.${startQty > 1 ? ` (×${startQty})` : ""}`);
    App.toast(`Added ${item.name}.`);
    save(); refresh();
  }

  /* ---------- crafting / salvage ---------- */
  // "Ingredients" = raw salvage OR mid-tier components; both are held in inventory and consumed by
  // crafting. These helpers treat either kind uniformly, matched by their (grade-qualified) name.
  const isIngredient = (it) => it && (it.category === "Salvage" || it.category === "Component");
  // How much of an ingredient (by name) the character holds (summed across stacks).
  function ownedMaterial(name) {
    return (rec.inventory || []).reduce((s, it) => s + (isIngredient(it) && it.name === name ? (Number(it.qty) || 0) : 0), 0);
  }
  // Raw salvage the character holds, as [{name, tier, qty}] in canonical order.
  function ownedMaterials() {
    return (PC.SALVAGE || []).map((s) => ({ name: s.name, tier: s.tier, qty: ownedMaterial(s.name) })).filter((m) => m.qty > 0);
  }
  // Components the character holds, as [{name, part, quality, qty}] (highest grade first per part).
  function ownedComponents() {
    return (rec.inventory || []).filter((it) => it.category === "Component" && (Number(it.qty) || 0) > 0)
      .map((it) => ({ name: it.name, part: it.part || String(it.name).replace(/^(Crude|Standard|Fine|Masterwork)\s+/, ""), quality: it.quality || 1, qty: Number(it.qty) || 0 }))
      .sort((a, b) => a.part.localeCompare(b.part) || b.quality - a.quality);
  }
  // Parse a component's grade + part from a "Standard Blade"-style name.
  function parseComponent(name) {
    const m = String(name).match(/^(Crude|Standard|Fine|Masterwork)\s+(.+)$/);
    if (!m) return null;
    return { quality: { Crude: 1, Standard: 2, Fine: 3, Masterwork: 4 }[m[1]], part: m[2] };
  }
  // Add an ingredient stack (raw salvage or a graded component) to inventory, merging with a like stack.
  function addMaterial(name, qty) {
    if (qty <= 0) return;
    const ex = (rec.inventory || []).find((it) => isIngredient(it) && it.name === name);
    if (ex) { ex.qty = (Number(ex.qty) || 0) + qty; return; }
    const comp = window.PC.isComponent && PC.isComponent(name) ? parseComponent(name) : null;
    if (comp) {
      const def = PC.componentByPart[comp.part];
      rec.inventory.push({
        id: "cmp_" + Date.now().toString(36) + "_" + name.replace(/\W+/g, "").slice(0, 6),
        name: name, category: "Component", part: comp.part, quality: comp.quality,
        weight: def ? def.weight : 1, qty: qty, desc: PC.itemDesc(name),
      });
    } else rec.inventory.push({
      id: "mat_" + Date.now().toString(36) + "_" + name.replace(/\W+/g, "").slice(0, 6),
      name: name, category: "Salvage", tier: PC.SALVAGE_TIER[name] || "Basic",
      weight: PC.SALVAGE_TIER[name] === "Exotic" ? 0.5 : 1, qty: qty, desc: PC.itemDesc(name),
    });
  }
  function spendMaterial(name, qty) {
    let left = qty;
    for (let i = rec.inventory.length - 1; i >= 0 && left > 0; i--) {
      const it = rec.inventory[i];
      if (isIngredient(it) && it.name === name) {
        const take = Math.min(left, Number(it.qty) || 0);
        it.qty -= take; left -= take;
        if (it.qty <= 0) rec.inventory.splice(i, 1);
      }
    }
  }
  // An item's recipe: a custom design may carry its own stored `recipe` (the exact graded components
  // the player chose); otherwise it's derived from the item's stats by the engine.
  function recipeOf(item) { if (item && item.recipe) return item.recipe; return window.PC.itemRecipe ? PC.itemRecipe(item) : null; }
  // Regular skill proficiency (background-granted or chosen at creation), mirroring rollSkill().
  function isSkillProficient(name) { return bg().skills.includes(name) || (rec.chosenSkills || []).includes(name); }
  // The Skill used to craft an item (from its recipe's primary material), or null.
  function craftSkillOf(item) { return window.PC.craftSkillFor ? PC.craftSkillFor(item) : null; }
  // Crafting DC scales with rarity (unrated items = Common tier).
  function craftDC(item) { return ({ "Common": 10, "Uncommon": 13, "Rare": 16, "Very Rare": 20 })[item && item.rarity] || 10; }
  // Everything the craft check needs: the skill, its attribute, your modifier (chakra-adjusted +
  // proficiency if you have it), whether you're proficient, and the DC. Anyone may attempt — the
  // skill just improves the roll; it is NOT a lock.
  function craftCheckInfo(item) {
    const name = craftSkillOf(item);
    const sk = name ? (PC.SKILLS || []).find((s) => s.name === name) : null;
    const attr = sk ? sk.attr : null;
    const prof = name ? isSkillProficient(name) : false;
    const mod = (attr ? adjMod(attr) : 0) + (prof ? PC.profBonus(rec.level) : 0);
    return { name: name, attr: attr, prof: prof, mod: mod, dc: craftDC(item) };
  }
  // Materials the character still lacks to craft `item`, as ["2× Scrap Metal", …] (empty = can craft).
  function missingComponents(item) {
    const r = recipeOf(item); if (!r) return null;
    return r.filter((c) => ownedMaterial(c.mat) < c.qty).map((c) => `${c.qty - ownedMaterial(c.mat)}× ${c.mat}`);
  }
  function fmtMats(list) { return list.map((c) => `${c.qty}× ${c.mat}`).join(" · "); }

  /* ---------- known recipes (what this character can craft) ---------- */
  // A brand-new character starts knowing every Common (or unrated) recipe whose craft skill they're
  // proficient in — a Technologist knows tech gear, a Herbalist knows salves, etc. Rarer recipes and
  // out-of-domain gear are learned later (salvage one, or a GM/discovery grant).
  function startingRecipes() {
    return (PC.ITEMS || []).filter((it) => {
      if (it.category === "Component") return false; // components are crafted from their own panel, not "known recipes"
      const r = recipeOf(it); if (!r) return false;
      const sk = craftSkillOf(it);
      return sk && isSkillProficient(sk) && (!it.rarity || it.rarity === "Common");
    }).map((it) => it.name);
  }
  // The character's known catalog recipes (names), initialized lazily from the craft-skill start.
  function knownRecipeNames() {
    if (!Array.isArray(rec.knownRecipes)) rec.knownRecipes = startingRecipes();
    return rec.knownRecipes;
  }
  // Custom item-templates the player has designed (each is a full item object with `custom:true`).
  function customItems() { if (!Array.isArray(rec.customItems)) rec.customItems = []; return rec.customItems; }
  // Does the character know how to craft this item? Custom designs are always known.
  function knowsRecipe(item) {
    if (!item) return false;
    if (item.custom) return true;
    return knownRecipeNames().indexOf(item.name) > -1;
  }
  // Learn a catalog recipe (from salvaging an example or a GM/discovery grant). Returns true if new.
  function learnRecipe(name) {
    const known = knownRecipeNames();
    if (known.indexOf(name) > -1) return false;
    known.push(name); return true;
  }
  // Per-component ownership status for a recipe, as HTML (owned = ok, short = flagged).
  function fmtRecipeNeed(recipe) {
    return recipe.map((c) => {
      const have = ownedMaterial(c.mat), ok = have >= c.qty;
      return `<span class="${ok ? "rc-ok" : "rc-no"}">${c.qty}× ${c.mat}${ok ? "" : ` (have ${have})`}</span>`;
    }).join(" · ");
  }

  function craftItem(item) {
    const r = recipeOf(item);
    if (!r) { App.toast("This can't be crafted."); return; }
    if (!knowsRecipe(item)) { App.toast("You don't know this recipe yet — salvage one or learn it first."); return; }
    const miss = missingComponents(item);
    if (miss.length) { App.toast(`Missing: ${miss.join(", ")}.`); return; }
    // Downtime skill CHECK (not a proficiency lock): d20 + craft-skill modifier vs a rarity DC.
    const ci = craftCheckInfo(item);
    const mode = ci.attr && (isDisadv(ci.attr) || flawDisadvAttr(ci.attr)) ? "dis" : "normal";
    const roll = PC.rollCheck(ci.mod, mode);
    const tag = `${ci.name || "Craft"} check d20${PC.fmtMod(ci.mod)} = ${roll.total} vs DC ${ci.dc}`;
    if (roll.total >= ci.dc) {
      r.forEach((c) => spendMaterial(c.mat, c.qty));
      rec.inventory.push(Object.assign({}, item, { qty: 1, id: "it_" + Date.now().toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6) }));
      announce(roll.total, `Crafted ${item.name} — ${tag} ✓ (used ${fmtMats(r)}).`);
      App.toast(`Crafted ${item.name}! (${roll.total} vs DC ${ci.dc})`);
    } else {
      // A botched craft wastes half of each component (rounded up), so failure carries a real cost.
      const lost = r.map((c) => ({ mat: c.mat, qty: Math.ceil(c.qty / 2) })).filter((c) => c.qty > 0);
      lost.forEach((c) => spendMaterial(c.mat, c.qty));
      announce(roll.total, `Craft failed: ${item.name} — ${tag} ✗. Lost ${lost.length ? fmtMats(lost) : "nothing"} (half, rounded up).`);
      App.toast(`Craft failed: ${roll.total} vs DC ${ci.dc}. Lost ${fmtMats(lost)}.`);
    }
    save(); refresh();
  }
  function salvageItem(idx) {
    const it = rec.inventory[idx]; if (!it) return;
    const y = window.PC.itemSalvageYield ? PC.itemSalvageYield(it) : null;
    if (!y) { App.toast(`${it.name} can't be salvaged.`); return; }
    y.forEach((c) => addMaterial(c.mat, c.qty));
    it.qty = (Number(it.qty) || 1) - 1;
    if (it.qty <= 0) { expandedItem = null; rec.inventory.splice(idx, 1); }
    // Breaking an item down teaches its recipe (if craftable and not already known).
    const learned = !it.custom && recipeOf(it) && learnRecipe(it.name);
    logLine(`Salvaged ${it.name} → ${y.length ? fmtMats(y) : "nothing usable"}.${learned ? ` 📖 Learned to craft ${it.name}.` : ""}`);
    App.toast(`Salvaged ${it.name}.${learned ? ` Recipe learned!` : ""}`);
    save(); refresh();
  }

  function removeItem(idx) {
    const it = rec.inventory[idx];
    rec.inventory.splice(idx, 1);
    if (it) logLine(`Dropped ${it.name}.`);
    save(); refresh();
  }
  function changeQty(idx, delta) {
    const it = rec.inventory[idx];
    if (!it) return;
    it.qty = Math.max(1, (Number(it.qty) || 1) + delta);
    save(); refresh();
  }
  /* ---------- equipment slots (8-slot paper-doll: 6 apparel + 2 hands) ---------- */
  // Apparel slots hold worn gear; hand slots hold weapons/shields. A two-handed weapon fills BOTH hands.
  const APPAREL_SLOTS = ["head", "torso", "back", "arms", "legs", "feet"];
  const HAND_SLOTS = ["lhand", "rhand"];
  const ACCESSORY_DS_CAP = 3; // most Defense the five non-torso apparel slots can add, summed (keeps stacking in check)
  const ALL_SLOTS = APPAREL_SLOTS.concat(HAND_SLOTS);
  const SLOT_LABEL = { head: "Head", torso: "Torso", back: "Back", arms: "Arms", legs: "Legs", feet: "Feet", lhand: "Left Hand", rhand: "Right Hand" };
  function slotLabel(s) { return SLOT_LABEL[s] || s; }
  function isEquippable(it) { return !!it && (it.category === "Weapon" || it.category === "Shield" || it.category === "Armor"); }
  // The apparel slot a worn piece belongs to. `coverage` is the intrinsic field: "full" = whole-body armor →
  // Torso; a per-slot piece names its slot directly. Legacy limb-keyed values fold onto the six apparel slots.
  const COVERAGE_TO_SLOT = { full: "torso", torso: "torso", head: "head", back: "back", arms: "arms", legs: "legs", feet: "feet", larm: "arms", rarm: "arms", lleg: "legs", rleg: "legs" };
  function armorApparelSlot(it) { return COVERAGE_TO_SLOT[(it && it.coverage) || "full"] || "torso"; }
  // Summed Defense from the five accessory slots (everything but Torso), and the capped amount that applies.
  function accessoryDS() {
    let raw = 0;
    equippedArmor().forEach((it) => {
      if (it.dsBonus && proficientWithArmorClass(it.armorClass) && armorApparelSlot(it) !== "torso") raw += Number(it.dsBonus) || 0;
    });
    return { raw: raw, applied: Math.min(raw, ACCESSORY_DS_CAP), capped: raw > ACCESSORY_DS_CAP };
  }
  // Which slot(s) an item OCCUPIES once equipped. it.slot records which hand a 1-hander/shield chose.
  function equipSlotsFor(it) {
    if (!it) return [];
    if (it.category === "Weapon") return Number(it.hands) === 2 ? HAND_SLOTS.slice() : [it.slot === "lhand" ? "lhand" : "rhand"];
    if (it.category === "Shield") return [it.slot === "rhand" ? "rhand" : "lhand"];
    if (it.category === "Armor") return [armorApparelSlot(it)];
    return [];
  }
  // Can this item be equipped INTO this slot? (drives the per-slot picker.)
  function itemFitsSlot(it, slot) {
    if (it.category === "Weapon" || it.category === "Shield") return HAND_SLOTS.indexOf(slot) > -1;
    if (it.category === "Armor") return slot === armorApparelSlot(it);
    return false;
  }
  function currentlyEquipped() { return (rec.inventory || []).filter((it) => it.equipped && isEquippable(it)); }
  function equippedShield() { return currentlyEquipped().find((it) => it.category === "Shield") || null; }
  // slot -> item map (first item wins a shared slot; used by the paper-doll).
  function equipMap() { const m = {}; currentlyEquipped().forEach((it) => { equipSlotsFor(it).forEach((s) => { if (!m[s]) m[s] = it; }); }); return m; }
  function defaultSlotFor(it) { return it.category === "Armor" ? armorApparelSlot(it) : it.category === "Shield" ? "lhand" : "rhand"; }

  // Hard-enforced equip: place the item in `slot`, auto-unequipping anything that occupied a slot it now needs.
  function equipToSlot(it, slot) {
    it.slot = slot;
    const need = equipSlotsFor(it);
    currentlyEquipped().forEach((other) => {
      if (other === it) return;
      if (equipSlotsFor(other).some((s) => need.indexOf(s) > -1)) { other.equipped = false; other.slot = null; logLine(`Unequipped ${other.name} — its slot was needed.`); }
    });
    it.equipped = true; it.slot = slot;
    logLine(`Equipped ${it.name} — ${need.map(slotLabel).join(" + ")}.`);
    save(); refresh();
  }
  function unequipItem(it) { it.equipped = false; it.slot = null; logLine(`Unequipped ${it.name}.`); save(); refresh(); }
  // Inventory-tab Equip/Unequip button routes through the slot system with a sensible default slot.
  function toggleEquip(it) {
    if (it.equipped) unequipItem(it);
    else equipToSlot(it, defaultSlotFor(it));
  }
  // Migration: (a) default armor coverage; (b) remap legacy slot names (old Main/Off-Hand + limb-armor model)
  // onto the new 8-slot taxonomy; (c) assign slots to already-equipped items that never had one. Idempotent.
  function migrateEquipment() {
    const inv = rec.inventory || [];
    inv.forEach((it) => { if (it.category === "Armor" && !it.coverage) it.coverage = "full"; });
    const REMAP = { mainHand: "rhand", offHand: "lhand", larm: "arms", rarm: "arms", lleg: "legs", rleg: "legs" };
    inv.forEach((it) => { if (it.slot && REMAP[it.slot]) it.slot = REMAP[it.slot]; });
    const eq = inv.filter((it) => it.equipped && isEquippable(it));
    if (!eq.length || eq.some((it) => it.slot)) return; // fresh char, or already slotted/migrated
    const used = {};
    eq.filter((it) => it.category === "Weapon" || it.category === "Shield").forEach((it) => {
      if (it.category === "Weapon" && Number(it.hands) === 2) {
        if (!used.rhand && !used.lhand) { used.rhand = used.lhand = true; it.slot = "rhand"; }
        else { it.equipped = false; it.slot = null; }
      } else if (!used.rhand) { used.rhand = true; it.slot = "rhand"; }
      else if (!used.lhand) { used.lhand = true; it.slot = "lhand"; }
      else { it.equipped = false; it.slot = null; }
    });
    const bodyUsed = {};
    eq.filter((it) => it.category === "Armor").forEach((it) => {
      const s = armorApparelSlot(it);
      if (!bodyUsed[s]) { bodyUsed[s] = true; it.slot = s; }
      else { it.equipped = false; it.slot = null; }
    });
  }
  function setItemField(it, field, value) {
    it[field] = value;
    save(); refresh();
  }
  // Roll a consumable amount spec: a flat number, or a dice string like "2d6".
  function consumableAmount(spec) {
    if (typeof spec === "number") return { total: spec, detail: "" };
    const r = PC.rollDiceExpr(spec);
    if (!r) return { total: 0, detail: "" };
    return { total: r.total, detail: ` [${r.rolls.join(",")}]` };
  }
  function useConsumable(idx) {
    const it = rec.inventory[idx];
    if (!it) return;
    const eff = it.effect || (window.PC.itemEffect ? PC.itemEffect(it.name) : null);
    const parts = [];
    let flashTotal = null, throwTotal = null;
    if (eff) {
      // Self-revive first, so any HP heal in the same item lands above 0.
      if (eff.reviveSelf && play.hp <= 0) { play.hp = 1; parts.push("revived to 1 HP"); }
      if (eff.hpFull) { play.hp = maxHP(); parts.push(`HP → full (${play.hp})`); }
      else if (eff.hp != null) {
        const a = consumableAmount(eff.hp);
        const before = play.hp; play.hp = clamp(play.hp + a.total, 0, maxHP());
        flashTotal = play.hp - before;
        parts.push(`+${play.hp - before} HP${a.detail}`);
      }
      if (eff.kpFull) { play.kp = maxKP(); parts.push(`KP → full (${play.kp})`); }
      else if (eff.kp != null) {
        const a = consumableAmount(eff.kp);
        const before = play.kp; play.kp = clamp(play.kp + a.total, 0, maxKP());
        if (flashTotal == null) flashTotal = play.kp - before;
        parts.push(`+${play.kp - before} KP${a.detail}`);
      }
      if (eff.chakraHeal) {
        let n = 0;
        PC.ATTRS.forEach((a) => { if (chakraOf(a) > 0) { play.chakraHits[a] = Math.max(0, chakraOf(a) - eff.chakraHeal); n++; } });
        if (n) parts.push(`healed ${eff.chakraHeal} hit${eff.chakraHeal > 1 ? "s" : ""} on ${n} chakra${n > 1 ? "s" : ""}`);
      }
      if (eff.uncrippleAll || eff.uncripple) {
        let left = eff.uncrippleAll ? Infinity : eff.uncripple, n = 0;
        PC.LIMBS.forEach((L) => { if (left > 0 && limbCurrent(L.key) <= 0) { play.limbs[L.key] = limbMaxFor(L.key); left--; n++; } });
        if (n) parts.push(`restored ${n} crippled limb${n > 1 ? "s" : ""}`);
      }
      // Cure tracked ailments (Antitoxin, Panacea). "allBad" clears every active bad/warn condition;
      // an explicit list clears just those keys. Neutral/good conditions (Marked, Invisible) are left alone.
      if (eff.clearConditions) {
        const isBad = (k) => { const cat = PC.condition(k); return cat && (cat.sev === "bad" || cat.sev === "warn"); };
        const targets = eff.clearConditions === "allBad"
          ? (play.conditions || []).filter((c) => isBad(c.key)).map((c) => c.key)
          : eff.clearConditions;
        const cleared = [];
        targets.forEach((k) => {
          if (hasCondition(k)) { play.conditions = (play.conditions || []).filter((c) => c.key !== k); const cat = PC.condition(k); cleared.push(cat ? cat.name : k); }
        });
        if (cleared.length) parts.push(`cured ${cleared.join(", ")}`);
        else if (eff.clearConditions !== "allBad") parts.push("no matching ailment to cure");
      }
      // Applied poison / weapon coat: arm the NEXT weapon hit to apply a condition to the target.
      if (eff.coat) {
        const cat = PC.condition(eff.coat.condition);
        play.weaponCoat = { condition: eff.coat.condition, label: eff.coat.label || (cat ? cat.name : eff.coat.condition) };
        parts.push(`coated your weapon — its next hit applies ${cat ? cat.emoji + " " + cat.name : eff.coat.condition} to the target (GM)`);
      }
      // Thrown alchemical: roll any splash damage and flag the target condition for the GM.
      if (eff.throwHit) {
        const th = eff.throwHit;
        if (th.damage) {
          const dr = PC.rollDiceExpr(th.damage);
          if (dr) { throwTotal = dr.total; parts.push(`thrown — ${th.damage}${th.dtype ? " " + th.dtype : ""} = [${dr.rolls.join(",")}] → ${dr.total}`); }
        } else { parts.push("thrown"); }
        if (th.targetCondition) { const cat = PC.condition(th.targetCondition); parts.push(`target ${cat ? cat.emoji + " " + cat.name : th.targetCondition} (GM)`); }
        if (th.note) parts.push(th.note + " (GM)");
      }
      if (eff.cure) parts.push(`cures ${eff.cure}`);
      if (eff.note) parts.push(eff.note);
    }
    const msg = `Used ${it.name}${parts.length ? " — " + parts.join(", ") : ""}.`;
    if (flashTotal != null && flashTotal > 0) announce(flashTotal, msg);
    else if (throwTotal != null) announce(throwTotal, msg);
    else logLine(msg);
    it.qty = (Number(it.qty) || 1) - 1;
    if (it.qty <= 0) { expandedItem = null; rec.inventory.splice(idx, 1); }
    save(); refresh();
  }
  // A weapon coated with applied poison (from a Poison Vial) tags its NEXT weapon attack: on a hit,
  // the target takes the coat's condition (the GM tracks the enemy). One-shot — attacking spends the
  // coat whether the swing lands or not, so returns the log tag and clears the coat.
  function consumeCoat() {
    const c = play.weaponCoat;
    if (!c) return "";
    play.weaponCoat = null;
    const cat = PC.condition(c.condition);
    return ` · ☠ coated: on a hit, target is ${cat ? cat.emoji + " " + cat.name : c.condition} (GM)`;
  }
  // weapon helpers
  function weaponAttr(it) { const w = PC.WEAPON_TYPES.find((x) => x.name === it.weaponType); return w ? w.attr : null; }
  function proficientWithType(it) {
    if (it.proficient) return true;
    // A heritage grants proficiency with one specific weapon SUBTYPE (e.g. Europe → Great Swords) — it
    // applies to any weapon of that subtype even when the character isn't proficient with the whole type.
    if (it.subtype && it.subtype === PC.heritageWeaponSubtype(rec.heritage)) return true;
    if (!it.weaponType) return false;
    if (bg().combat.indexOf(it.weaponType) > -1) return true;
    return (rec.bonusWeaponProfs || []).indexOf(it.weaponType) > -1; // extra weapon-type proficiency (chosen grant)
  }
  // econType: which action-economy slot the swing spends — "Action" for a normal attack,
  // "Reaction" for an Opportunity Attack. Defaults to "Action".
  function attackWith(it, econType) {
    econType = econType || "Action";
    const attr = weaponAttr(it);
    if (!attr) { App.toast("Set this weapon's type first."); return; }
    if (isLocked(attr)) { App.toast(`${PC.CHAKRAS[attr].name} chakra locked — can't attack with ${attr}.`); return; }
    if (bothArmsCrippled()) { App.toast("Both arms are crippled — you can't make weapon attacks."); return; }
    // Ammunition gate — a ranged/thrown weapon can't fire with an empty stack (checked before spending your action).
    const ammoStop = ammoBlocked(it);
    if (ammoStop) { App.toast(`${ammoStop} — add ammo on the Inventory tab.`); return; }
    if (econBlocked(econType)) { App.toast(`You've already used your ${econName(econType)} this turn.`); return; }
    consumeEcon(econType);
    const prof = proficientWithType(it);
    const mod = adjMod(attr) + (prof ? PC.profBonus(rec.level) : 0);
    // Disadvantage: crippled arm, or wearing non-proficient armor on an AGI-based attack.
    const mode = (isDisadv(attr) || anyArmCrippled() || (attr === "AGI" && wearingUnproficientArmor())) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    const oa = econType === "Reaction" ? " (Opportunity)" : "";
    const ammoTag = spendAmmo(it); // fire the shot — spend a round (or the thrown weapon itself)
    const coatTag = consumeCoat(); // applied poison, if the weapon was coated — one-shot
    announce(r.total, `${it.name} attack${oa}: d20${dis}${PC.fmtMod(mod)} = ${r.total}${prof ? " ✓prof" : ""} (vs Defense Score)${ammoTag}${coatTag}`);
    save(); refresh();
  }

  // Unarmed Strike — a punch or kick anyone can throw. STR-based melee, 1d4 + STR mod,
  // proficient by default (it's your own body). econType lets it double as an Opportunity Attack.
  const UNARMED = { name: "Unarmed Strike", damage: "1d4" }; // no weaponType → damageWith uses STR
  // While a transformation grants natural claws (e.g. the Lycan's Shift), unarmed strikes use the bigger claw
  // die instead of 1d4. Everything else about the unarmed strike is unchanged.
  function unarmedProfile() {
    if (transformActive()) { const t = sigTier(); const claw = t ? transformClawDie(t.tier) : null; if (claw) return { name: "Claws", damage: claw, claws: true }; }
    return UNARMED;
  }
  function unarmedAttack(econType) {
    econType = econType || "Action";
    const attr = "STR";
    if (isLocked(attr)) { App.toast(`${PC.CHAKRAS[attr].name} chakra locked — can't strike.`); return; }
    if (econBlocked(econType)) { App.toast(`You've already used your ${econName(econType)} this turn.`); return; }
    consumeEcon(econType);
    const mod = adjMod(attr) + PC.profBonus(rec.level);
    const mode = isDisadv(attr) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    const oa = econType === "Reaction" ? " (Opportunity)" : "";
    announce(r.total, `Unarmed Strike attack${oa}: d20${dis}${PC.fmtMod(mod)} = ${r.total} ✓prof (vs Defense Score)`);
    save(); refresh();
  }
  function damageWith(it, augmentName) {
    const attr = it.attr || weaponAttr(it) || "STR";
    if (!it.damage) { App.toast('Set a damage die (e.g. "1d10").'); return; }
    const dr = PC.rollDiceExpr(it.damage);
    if (!dr) { App.toast('Damage die format: like "1d10" or "2d6".'); return; }
    // A natural weapon may add a SECOND attribute modifier (the Strigoi's Blood Weapon = CON + CHA).
    const m = adjMod(attr) + (it.attr2 ? adjMod(it.attr2) : 0);
    let total = dr.total + m;
    const baseHit = total; // for lifesteal, before any augment dice
    const modLabel = PC.fmtMod(m) + (it.attr2 ? ` (${attr}+${it.attr2})` : "");
    const parts = [`${it.damage}${modLabel} = [${dr.rolls.join(",")}]${PC.fmtMod(m)}`];
    let kpNote = "";
    if (augmentName) {
      const t = PC.technique(augmentName);
      if (!t) { App.toast("Unknown augment."); return; }
      if (play.kp < t.kp) { App.toast(`Not enough KP for ${t.name} (need ${t.kp}).`); return; }
      play.kp -= t.kp;
      const ar = PC.rollDiceExpr(t.damage.dice);
      const am = techAdjMod(t, t.damage.mod);
      total += ar.total + am;
      parts.push(`${t.name} ${t.damage.dice}${PC.fmtMod(am)} = [${ar.rolls.join(",")}]${PC.fmtMod(am)}`);
      kpNote = ` (−${t.kp} KP)`;
    }
    // Lifesteal (the Strigoi's Bite / Blood Moon): heal for half the strike's damage.
    let steal = "";
    if (it.lifesteal) { const h = Math.max(0, Math.floor(baseHit / 2)); play.hp = clamp(play.hp + h, 0, maxHP()); steal = ` · lifesteal +${h} HP`; }
    announce(total, `${it.name} damage${augmentName ? " + " + augmentName : ""}: ${parts.join(" + ")} → ${total} total${kpNote}${steal}`);
    save(); refresh();
  }

  // Techniques the character knows that augment a melee attack's damage.
  function knownMeleeAugments() {
    return knownTechniques()
      .map((n) => PC.technique(n))
      .filter((t) => t && t.augment && t.augment.kind === "melee-damage" && t.damage);
  }
  // Is this equipped weapon usable in melee? (weaponType set and its type isn't flagged ranged-only)
  function weaponIsMelee(it) {
    if (!it.weaponType) return false;
    const w = PC.WEAPON_TYPES.find((x) => x.name === it.weaponType);
    return !!w && w.melee !== false;
  }

  /* ---------- ammunition ---------- */
  // What a weapon draws per shot: an Ammo item name, "__self__" (thrown/explosive — spends the weapon itself),
  // or null (melee / Ki-powered — no ammo). Inferred from type + name, since items don't carry a subtype.
  function weaponAmmo(it) {
    if (!it || it.category !== "Weapon" || !it.weaponType) return null;
    if (it.thrown || it.weaponType === "Explosives") return "__self__";
    const t = it.weaponType, n = (it.name || "").toLowerCase();
    if (/crossbow/.test(n)) return "Crossbow Bolts";
    if (/blowgun|blowpipe/.test(n)) return "Blowgun Darts";
    if (t === "Archery") return /sling|slingshot|wrist rocket/.test(n) ? "Sling Bullets" : "Arrows";
    if (/\bbow\b/.test(n)) return "Arrows"; // a bow filed under another type (e.g. the wrist-mounted Bracer Bow)
    if (t === "Firearms") {
      if (/shotgun/.test(n)) return "Shotgun Shells";
      if (/magnum|hand cannon|anti-materiel|revolver|six-shooter|executioner/.test(n)) return "Heavy Rounds";
      if (/rifle|carbine/.test(n)) return "Rifle Rounds";
      return "Pistol Rounds";
    }
    if (t === "Volatile Weapons") {
      if (/flame|napalm|inferno/.test(n)) return "Fuel Canister";
      if (/rocket|bazooka|launcher/.test(n)) return "Rockets";
      return "Chemical Canister";
    }
    if (t === "Laser Weapons" || t === "Plasma Weapons" || t === "Tech Weapons" || t === "Noise Weapons") {
      // Only the energy-projecting arms draw a charge; melee energy weapons (blades, fists, hammers…) don't.
      if (/blade|sword|saber|katana|fist|gauntlet|maul|hammer|axe|chainsword|buzz|ripsaw|drumstick|whip|lash/.test(n)) return null;
      return "Charge Pack";
    }
    return null;
  }
  function ammoStack(name) { return (rec.inventory || []).find((it) => it.category === "Ammo" && it.name === name) || null; }
  // Rounds available to a weapon (null = it needs no ammo).
  function ammoLeft(it) {
    const a = weaponAmmo(it); if (!a) return null;
    if (a === "__self__") return Number(it.qty) || 0;
    const s = ammoStack(a); return s ? (Number(s.qty) || 0) : 0;
  }
  // Reason a shot is blocked for lack of ammo, or "" if fine / not applicable.
  function ammoBlocked(it) {
    const a = weaponAmmo(it); if (!a) return "";
    if ((ammoLeft(it) || 0) >= 1) return "";
    return a === "__self__" ? `No ${it.name} left to throw` : `Out of ${a}`;
  }
  // Spend one shot. Returns a log tag like " · −1 Arrows (19 left)", or "" if none needed. Removes an emptied stack.
  function spendAmmo(it) {
    const a = weaponAmmo(it); if (!a) return "";
    if (a === "__self__") {
      it.qty = (Number(it.qty) || 1) - 1;
      const last = it.qty <= 0;
      if (last) { const idx = rec.inventory.indexOf(it); if (idx > -1) rec.inventory.splice(idx, 1); }
      return last ? ` · thrown your last ${it.name} (recover it after)` : ` · thrown (${it.qty} left)`;
    }
    const s = ammoStack(a); if (!s) return "";
    s.qty = (Number(s.qty) || 1) - 1;
    const empty = s.qty <= 0;
    if (empty) { const idx = rec.inventory.indexOf(s); if (idx > -1) rec.inventory.splice(idx, 1); }
    return ` · −1 ${a} (${empty ? "empty!" : s.qty + " left"})`;
  }

  function rollRaw(sides, count) {
    const n = count || 1; const rolls = []; let total = 0;
    for (let i = 0; i < n; i++) { const x = PC.rollDie(sides); rolls.push(x); total += x; }
    announce(total, `Roll ${n}d${sides} = [${rolls.join(",")}]${n > 1 ? " = " + total : ""}`);
    save(); refresh();
  }

  /* ---------- render ---------- */
  function render(container, id) {
    if (id !== curId) { activeTab = "sheet"; expandedItem = null; expandedPet = null; catalogOpen = false; poolEdit = null; limbSel = null; chakraSel = null; equipPickSlot = null; curId = id; }
    rec = App.loadRoster().find((c) => c.id === id);
    if (!rec) { App.goHome(); return; }
    ensurePlay();
    checkFusionDiscoveries();
    container.appendChild(build());
  }

  function build() {
    const root = el("div");
    root.appendChild(buildHeader());
    root.appendChild(buildTabBar());
    // If the Otherkin tab was open but the Soul Creature is no longer awakened (e.g. a level-down),
    // fall back to the Sheet so the view never strands on a hidden tab.
    if (activeTab === "otherkin" && !heartUnlocked()) activeTab = "sheet";
    let body;
    switch (activeTab) {
      case "otherkin": body = buildOtherkinTab(); break;
      case "combat": body = buildCombat(); break;
      case "limbs": body = buildLimbsTab(); break;
      case "chakras": body = buildChakraTab(); break;
      case "kinetics": body = buildKineticsTab(); break;
      case "skills": body = buildSkillsTab(); break;
      case "traits": body = buildTraitsTab(); break;
      case "description": body = buildDescriptionTab(); break;
      case "equipment": body = buildEquipmentTab(); break;
      case "inventory": body = catalogOpen ? buildCatalogScreen() : buildInventoryTab(); break;
      case "crafting": body = buildCraftingTab(); break;
      case "pets": body = buildPetsTab(); break;
      default: body = buildSheetTab();
    }
    root.appendChild(body);
    return root;
  }

  function buildHeader() {
    const head = el("div", "play-head");
    const back = el("button", "btn ghost small", "← Characters");
    back.onclick = () => App.goHome();
    head.appendChild(back);
    // Character thumbnail (uploaded on the Description tab), if set — sits next to the name.
    if (rec.thumb) {
      const th = el("img", "head-thumb"); th.src = rec.thumb; th.alt = rec.name || "portrait";
      th.title = "Character artwork — edit on the Description tab";
      th.onclick = () => { activeTab = "description"; refresh(); };
      head.appendChild(th);
    }
    const title = el("div", "phead-title");
    title.innerHTML = `<h2 style="margin:0">${rec.name || "Unnamed"}</h2>
      <div style="color:var(--text-dim);font-size:.86rem">${rec.background} · Soul Level ${rec.level} · Turn ${play.turn}</div>`;
    const endTurnBtn = el("button", "btn small", `⏭ End Turn${activeUpkeep() ? " (−" + activeUpkeep() + " KP)" : ""}`);
    endTurnBtn.onclick = endTurn;
    head.appendChild(title); head.appendChild(endTurnBtn);
    return head;
  }

  function buildTabBar() {
    const bar = el("div", "play-tabs");
    const tabs = [["sheet", "Sheet"], ["combat", "⚔ Combat"], ["limbs", "Limbs"], ["chakras", "Chakras"]];
    // The Otherkin tab stays hidden until the Soul Creature awakens (Soul Level 15+), mirroring the
    // Heart chakra reveal — it sits right after Chakras, since the Otherkin lives at their center.
    if (heartUnlocked()) tabs.push(["otherkin", "♥ Otherkin"]);
    tabs.push(["kinetics", "Kinetics"], ["skills", "Skills"], ["traits", "Traits"], ["description", "Description"], ["equipment", "🧍 Equipment"], ["inventory", "Inventory"], ["crafting", "🔨 Crafting"], ["pets", "🐾 Pets"]);
    tabs.forEach((pair) => {
      const b = el("button", "play-tab" + (pair[0] === "otherkin" ? " otherkin" : "") + (activeTab === pair[0] ? " active" : ""), pair[1]);
      b.onclick = () => { activeTab = pair[0]; catalogOpen = false; equipPickSlot = null; refresh(); };
      bar.appendChild(b);
    });
    return bar;
  }

  // Traits & Flaws tab — heritage positive traits, plus the background & heritage flaws (negative traits).
  function buildTraitsTab() {
    const root = el("div");
    const h = PC.heritage(rec.heritage);
    const b = bg();
    const bf = bgFlaw(), hf = heritageFlaw();
    const traits = h && h.traits ? h.traits : [];

    // Positive traits (from Heritage)
    const pos = el("div", "panel");
    pos.appendChild(el("div", "section-label", "Traits" + (h ? " — " + h.name : "")));
    if (traits.length) {
      traits.forEach((t) => pos.appendChild(el("div", "inv-note", `<b>${t.name}</b> — ${t.desc}`)));
    } else {
      pos.appendChild(el("div", "muted", "No heritage traits on this character."));
    }
    root.appendChild(pos);

    // Weapon proficiency granted by the heritage (one specific subtype — its signature weapon).
    const hSub = PC.heritageWeaponSubtype(rec.heritage);
    if (hSub) {
      const wp = el("div", "panel");
      wp.appendChild(el("div", "section-label", "Weapon Proficiency — " + (h ? h.name : "")));
      const wt = PC.weaponTypeOfSubtype(hSub);
      wp.appendChild(el("div", "inv-note", `<b>⚔ ${hSub}</b>${wt ? ` <span class="tag">${wt}</span>` : ""} — you add your proficiency bonus (${PC.fmtMod(PC.profBonus(rec.level))}) to attacks with any <b>${hSub}</b> weapon, even without the full ${wt || "weapon-type"} proficiency.`));
      root.appendChild(wp);
    }

    // Negative traits (Flaws)
    const neg = el("div", "panel");
    neg.appendChild(el("div", "section-label", "Flaws"));
    if (!bf && !hf) {
      neg.appendChild(el("div", "muted", "No flaws on this character."));
    } else {
      if (bf) neg.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠ Background</span> <b>${bf.name}</b> — ${bf.desc}`));
      if (hf) neg.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠ Heritage</span> <b>${hf.name}</b> — ${hf.desc}`));
      neg.appendChild(el("p", "hint", "Flaws apply automatically: a <b>background</b> flaw rolls disadvantage on that attribute's skill checks and Kinetic technique attacks; a <b>heritage</b> flaw rolls disadvantage on the one named skill. Flawed skills are tagged ⚠ on the Skills tab."));
    }
    root.appendChild(neg);
    return root;
  }

  // Description tab — the character's appearance / basic info. Editable at the table; each field
  // saves on blur (onchange) like the Inventory item fields. Flavor only, no rules effect.
  function buildDescriptionTab() {
    const root = el("div");
    if (!rec.description) rec.description = App.defaultDescription ? App.defaultDescription() : {};
    const groups = App.descriptionGroups || [];
    const misc = App.descriptionMisc;

    const descPlayField = (f) => {
      const l = el("label", "field");
      l.appendChild(el("span", null, f.label));
      const i = el("input"); i.type = "text"; i.placeholder = f.ph || "";
      i.value = rec.description[f.key] || "";
      i.oninput = () => { rec.description[f.key] = i.value; };  // live in-memory update
      i.onchange = () => { save(); };                          // persist on blur
      l.appendChild(i);
      return l;
    };

    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Description"));
    p.appendChild(el("p", "hint", "Your character's appearance and basic details. Edit any field — changes save automatically. Flavor only; nothing here affects the rules."));
    groups.forEach((g) => {
      p.appendChild(el("div", "section-label", g.label));
      const grid = el("div", "desc-grid");
      g.fields.forEach((f) => grid.appendChild(descPlayField(f)));
      p.appendChild(grid);
    });
    if (misc) {
      p.appendChild(el("div", "section-label", misc.label));
      const ta = el("textarea"); ta.rows = 3; ta.placeholder = misc.ph || "";
      ta.value = rec.description[misc.key] || "";
      ta.oninput = () => { rec.description[misc.key] = ta.value; };
      ta.onchange = () => { save(); };
      p.appendChild(ta);
    }
    root.appendChild(p);
    root.appendChild(buildArtworkPanel());
    return root;
  }

  /* ---------- character artwork (optional) ---------- */
  // A file-input styled as a button (label wraps a hidden input, so the click opens the picker).
  function fileButton(label, onFile) {
    const wrap = el("label", "btn small primary file-btn", label);
    const inp = el("input"); inp.type = "file"; inp.accept = "image/*"; inp.style.display = "none";
    inp.onchange = () => { if (inp.files && inp.files[0]) onFile(inp.files[0]); inp.value = ""; };
    wrap.appendChild(inp);
    return wrap;
  }
  // Read an uploaded image, downscale to a sane size (≤1000px long edge) and store a compressed JPEG
  // data URL as the character's portrait — keeps localStorage small. Rolls back if the save won't fit.
  function handlePortraitFile(file) {
    if (!file || !/^image\//.test(file.type)) { App.toast("Please pick an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000, scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale)), h = Math.max(1, Math.round(img.height * scale));
        const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        let url; try { url = cv.toDataURL("image/jpeg", 0.82); } catch (e) { App.toast("Couldn't process that image."); return; }
        const prev = { p: rec.portrait, c: rec.crop, t: rec.thumb };
        rec.portrait = url; rec.crop = null; // new image → reset the crop selection (keep any old thumb until re-cropped)
        if (!save()) { rec.portrait = prev.p; rec.crop = prev.c; rec.thumb = prev.t; }
        else App.toast("Artwork uploaded — now crop a face for the thumbnail.");
        refresh();
      };
      img.onerror = () => App.toast("Couldn't read that image.");
      img.src = reader.result;
    };
    reader.onerror = () => App.toast("Couldn't read that file.");
    reader.readAsDataURL(file);
  }
  // Render the current square selection to a small round-ready thumbnail and store it.
  function makeThumbFrom(img, box) {
    const sc = img.naturalWidth / img.clientWidth; // uniform (height is auto → same scale)
    const out = 240, cv = document.createElement("canvas"); cv.width = out; cv.height = out;
    cv.getContext("2d").drawImage(img, box.left * sc, box.top * sc, box.side * sc, box.side * sc, 0, 0, out, out);
    let url; try { url = cv.toDataURL("image/jpeg", 0.85); } catch (e) { App.toast("Couldn't make the thumbnail."); return; }
    const prev = { t: rec.thumb, c: rec.crop };
    rec.thumb = url;
    rec.crop = { xf: box.left / img.clientWidth, yf: box.top / img.clientHeight, sf: box.side / img.clientWidth };
    if (!save()) { rec.thumb = prev.t; rec.crop = prev.c; } else App.toast("Thumbnail set! It shows by your name and on the roster.");
    refresh();
  }
  function removeArtwork() {
    if (!confirm("Remove this character's artwork and thumbnail?")) return;
    delete rec.portrait; delete rec.thumb; delete rec.crop;
    save(); refresh();
  }

  function buildArtworkPanel() {
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Character Artwork (optional)"));
    if (!rec.portrait) {
      p.appendChild(el("p", "hint", "Upload your own artwork for this character, then crop a face for the <b>thumbnail</b> that appears next to your name at the top of the sheet and on the character-select screen. Images are downscaled and stored <b>on this device only</b> (per-device, like your characters)."));
      p.appendChild(fileButton("＋ Upload artwork", handlePortraitFile));
      return p;
    }
    p.appendChild(el("p", "hint", "Drag the square over the face, size it with the slider, then <b>Set as thumbnail</b>. Stored on this device only."));

    // Cropper: the image with a draggable square selection overlaid.
    const wrap = el("div", "art-crop-wrap");
    const img = el("img", "art-img"); img.src = rec.portrait; img.draggable = false; img.alt = rec.name || "portrait";
    const sel = el("div", "art-sel");
    wrap.appendChild(img); wrap.appendChild(sel);
    p.appendChild(wrap);

    const ctl = el("div", "art-ctl");
    const slider = el("input"); slider.type = "range"; slider.className = "art-size";
    const setBtn = el("button", "btn small primary", "✂ Set as thumbnail");
    ctl.appendChild(el("span", "art-size-label", "Size")); ctl.appendChild(slider); ctl.appendChild(setBtn);
    p.appendChild(ctl);

    // Live thumbnail preview + manage buttons.
    const manage = el("div", "art-manage");
    if (rec.thumb) { const tp = el("img", "art-thumb-preview"); tp.src = rec.thumb; tp.alt = "thumbnail"; manage.appendChild(tp); }
    manage.appendChild(fileButton("⟳ Replace artwork", handlePortraitFile));
    const rm = el("button", "btn small ghost", "✕ Remove artwork"); rm.onclick = removeArtwork;
    manage.appendChild(rm);
    p.appendChild(manage);

    // Wire the cropper once the image has real display dimensions.
    let box = null;
    const initCropper = () => {
      const W = img.clientWidth, H = img.clientHeight;
      if (!W || !H) return;
      let side, left, top;
      if (rec.crop) { side = rec.crop.sf * W; left = rec.crop.xf * W; top = rec.crop.yf * H; }
      else { side = Math.min(W, H) * 0.5; left = (W - side) / 2; top = (H - side) / 2; }
      slider.min = 40; slider.max = Math.round(Math.min(W, H)); slider.step = 1;
      const clampPlace = () => {
        side = Math.max(30, Math.min(Math.min(W, H), side));
        left = Math.max(0, Math.min(W - side, left));
        top = Math.max(0, Math.min(H - side, top));
        sel.style.width = sel.style.height = side + "px"; sel.style.left = left + "px"; sel.style.top = top + "px";
        slider.value = Math.round(side);
      };
      box = { get: () => ({ left: left, top: top, side: side }) };
      clampPlace();
      slider.oninput = () => { const cx = left + side / 2, cy = top + side / 2; side = Number(slider.value); left = cx - side / 2; top = cy - side / 2; clampPlace(); };
      let drag = false, sx = 0, sy = 0, ol = 0, ot = 0;
      sel.onpointerdown = (e) => { drag = true; try { sel.setPointerCapture(e.pointerId); } catch (x) {} sx = e.clientX; sy = e.clientY; ol = left; ot = top; e.preventDefault(); };
      sel.onpointermove = (e) => { if (!drag) return; left = ol + (e.clientX - sx); top = ot + (e.clientY - sy); clampPlace(); };
      sel.onpointerup = sel.onpointercancel = () => { drag = false; };
    };
    if (img.complete && img.naturalWidth) initCropper(); else img.onload = initCropper;
    setBtn.onclick = () => { if (box) makeThumbFrom(img, box.get()); else App.toast("Give the image a moment to load."); };
    return p;
  }

  // Movement speeds (walk / climb / jump / swim) — shown on both the Sheet and Combat tabs. Walk uses
  // effectiveMovement() so it reflects crippled legs and Heavy-armor penalty; the rest come from derive().
  function speedsRow() {
    const d = PC.derive(liveScores(), rec.level);
    const row = el("div", "tile-row");
    row.appendChild(tile("Movement", effectiveMovement() + " ft" + (crippledLegs() ? " ⚠" : "")));
    const fly = flySpeed();
    if (fly != null) row.appendChild(tile("Fly", fly + " ft"));
    row.appendChild(tile("Climb", d.climb + " ft"));
    row.appendChild(tile("Jump", d.jump + " ft"));
    row.appendChild(tile("Swim", d.swim + " ft"));
    return row;
  }

  function buildSheetTab() {
    const root = el("div");

    /* Pools — Body / Mind / Soul as colored current/max numbers, side by side (tap one to adjust it) */
    const pools = el("div", "panel");
    const prow = el("div", "pool-row");
    prow.appendChild(poolStat("body", "Body", play.hp, maxHP(), "hp"));
    prow.appendChild(poolStat("mind", "Mind", play.kp, maxKP(), "kp"));
    prow.appendChild(poolStat("soul", "Soul", rec.level, 30, "soul"));
    pools.appendChild(prow);
    if (poolEdit) {
      const ed = el("div", "pool-editor");
      if (poolEdit === "body") ed.appendChild(poolAdjustControls("HP", adjustHP));
      else if (poolEdit === "mind") ed.appendChild(poolAdjustControls("KP", adjustKP));
      else if (poolEdit === "soul") ed.appendChild(soulEditor());
      pools.appendChild(ed);
    } else {
      pools.appendChild(el("div", "pool-hint", "Tap a pool to adjust it"));
    }
    const rests = el("div", "rest-row");
    const sr = el("button", "btn small", "☾ Short Rest");
    sr.onclick = shortRest;
    const lr = el("button", "btn small", "☀ Long Rest");
    lr.onclick = longRest;
    rests.appendChild(sr); rests.appendChild(lr);
    rests.appendChild(el("span", "rest-note", "Short: +1 hit on each hurt chakra · Long: +2 & full HP/KP"));
    pools.appendChild(rests);
    root.appendChild(pools);

    /* active conditions — read-only at-a-glance strip (manage them on the Combat tab) */
    if (play.conditions && play.conditions.length) {
      const cp = el("div", "panel");
      cp.appendChild(el("div", "section-label", "Conditions"));
      const chips = el("div", "cond-chips");
      play.conditions.forEach((c) => {
        const cat = PC.condition(c.key); if (!cat) return;
        const chip = el("div", "cond-chip readonly sev-" + (cat.sev || "neutral"));
        chip.title = cat.desc;
        chip.innerHTML = `<span class="cond-label">${cat.emoji} ${cat.name}</span>` +
          `<span class="cond-turns"><span class="cond-count">${typeof c.turns === "number" ? c.turns + "t" : "∞"}</span></span>`;
        chips.appendChild(chip);
      });
      cp.appendChild(chips);
      root.appendChild(cp);
    }

    /* movement speeds (combat actions live on the Combat tab) */
    const speeds = el("div", "panel");
    speeds.appendChild(el("div", "section-label", "Speeds"));
    speeds.appendChild(speedsRow());
    root.appendChild(speeds);

    /* attributes (live mods, chakra-aware) */
    const attrs = el("div", "panel");
    attrs.appendChild(el("div", "section-label", "Attributes (live modifiers)"));
    const ag = el("div", "attr-grid");
    PC.ATTRS.forEach((a) => {
      const isBody = PC.BODY_ATTRS.includes(a);
      const hits = chakraOf(a);
      const card = el("div", "attr-card " + (isBody ? "body" : "mind"));
      const buff = allAttrBuffs()[a];
      let statusHtml = "";
      if (isLocked(a)) statusHtml = '<div class="attr-status locked">LOCKED</div>';
      else if (hits === 2) statusHtml = '<div class="attr-status warn">mod halved</div>';
      else if (hits === 3) statusHtml = '<div class="attr-status warn">mod 0</div>';
      else if (hits === 1) statusHtml = '<div class="attr-status warn">disadv.</div>';
      card.innerHTML =
        `<div class="code">${a}</div><div class="name">${PC.ATTR_NAMES[a]}</div>
         <div class="score">${liveScores()[a]}${buff ? '<span class="buffup">+' + buff + "</span>" : ""}</div>
         <div class="modpill">${PC.fmtMod(adjMod(a))}</div>${statusHtml}`;
      ag.appendChild(card);
    });
    attrs.appendChild(ag);
    root.appendChild(attrs);

    /* dice roller + log */
    const dice = el("div", "panel");
    dice.appendChild(el("div", "section-label", "Dice Roller"));
    const drow = el("div", "dice-btns");
    [4, 6, 8, 10, 12, 20, 100].forEach((s) => {
      const b = el("button", "btn small ghost", "d" + s);
      b.onclick = () => rollRaw(s, 1);
      drow.appendChild(b);
    });
    dice.appendChild(drow);
    dice.appendChild(el("div", "section-label", "Log"));
    dice.appendChild(logElement());
    const clear = el("button", "btn ghost small", "Clear log");
    clear.style.marginTop = "10px";
    clear.onclick = () => { play.log = []; save(); refresh(); };
    dice.appendChild(clear);
    root.appendChild(dice);

    return root;
  }

  /* ---------- small builders ---------- */
  // A pool as a colored current/max number (pen-and-paper style). Tapping toggles its inline editor.
  // key = "body"|"mind"|"soul"; cls = "hp"|"kp"|"soul" (colors the number).
  function poolStat(key, label, cur, max, cls) {
    const cell = el("div", "pool-stat " + cls + (poolEdit === key ? " open" : ""));
    cell.innerHTML =
      `<div class="pool-label">${label}</div>` +
      `<div class="pool-val">${cur}<span class="pool-slash">/</span>${max}</div>`;
    cell.title = "Tap to adjust";
    cell.onclick = () => { poolEdit = poolEdit === key ? null : key; refresh(); };
    return cell;
  }
  // The ±/type-a-number adjust controls for a Body/Mind pool (letter "HP" or "KP").
  function poolAdjustControls(letter, adjust) {
    const ctr = el("div", "adjust-row");
    [[-5, "−5"], [-1, "−1"], [1, "+1"], [5, "+5"]].forEach(([n, t]) => {
      const b = el("button", "btn small ghost", t);
      b.onclick = () => adjust(n);
      ctr.appendChild(b);
    });
    const inp = el("input"); inp.type = "number"; inp.placeholder = "#"; inp.className = "adjust-input";
    const dmg = el("button", "btn small", letter === "HP" ? "Damage" : "Spend");
    dmg.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjust(-Math.abs(v)); };
    const heal = el("button", "btn small", letter === "HP" ? "Heal" : "Restore");
    heal.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjust(Math.abs(v)); };
    ctr.appendChild(inp); ctr.appendChild(dmg); ctr.appendChild(heal);
    return ctr;
  }
  function tile(label, val) {
    const t = el("div", "tile");
    t.innerHTML = `<div class="tile-val">${val}</div><div class="tile-label">${label}</div>`;
    return t;
  }
  // Soul Pool editor — shown when the Soul number is tapped. XP tracker (leveling is GM-driven;
  // thresholds TBD) with adjusters and the Level Up button. Opens the dedicated Level Up screen (app.js).
  function soulEditor() {
    const box = el("div");
    const bar = PC.xpBar(rec.xp || 0, rec.level);
    // Header line: level + total XP.
    box.appendChild(el("div", "soul-xp", `Soul Level <b>${rec.level}</b>${rec.level >= 30 ? " · MAX" : ""} · Soul Pool: <b>${(rec.xp || 0).toLocaleString()}</b> XP`));
    // XP-to-next-level progress bar.
    const xpWrap = el("div", "xp-wrap");
    if (bar.maxed) {
      xpWrap.appendChild(el("div", "xp-head", `<span>Maximum Soul Level reached</span><span class="xp-num">${PC.xpForLevel(30).toLocaleString()} XP</span>`));
      const track = el("div", "bar-track"); track.appendChild(elFill("var(--gold)", 100)); xpWrap.appendChild(track);
    } else {
      xpWrap.appendChild(el("div", "xp-head", `<span>${bar.ready ? '<b class="xp-ready">Ready to level up →</b>' : "Progress to Level " + (rec.level + 1)}</span><span class="xp-num">${bar.into.toLocaleString()} / ${bar.span.toLocaleString()}</span>`));
      const track = el("div", "bar-track"); track.appendChild(elFill(bar.ready ? "var(--gold)" : "var(--cyan)", bar.pct)); xpWrap.appendChild(track);
      xpWrap.appendChild(el("div", "xp-sub", bar.ready ? `You have enough XP for Level ${rec.level + 1} — tap Level Up when your GM confirms.` : `${bar.remaining.toLocaleString()} XP to Level ${rec.level + 1} (needs ${bar.nextAt.toLocaleString()} total).`));
    }
    box.appendChild(xpWrap);
    // XP adjusters (GM awards / corrects XP).
    const ctr = el("div", "adjust-row");
    [[-10, "−10"], [-1, "−1"], [1, "+1"], [10, "+10"]].forEach(([n, t]) => {
      const b = el("button", "btn small ghost", t); b.onclick = () => adjustXP(n); ctr.appendChild(b);
    });
    const inp = el("input"); inp.type = "number"; inp.placeholder = "#"; inp.className = "adjust-input";
    const add = el("button", "btn small", "Add XP"); add.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjustXP(Math.abs(v)); };
    const rem = el("button", "btn small ghost", "Remove"); rem.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjustXP(-Math.abs(v)); };
    ctr.appendChild(inp); ctr.appendChild(add); ctr.appendChild(rem);
    box.appendChild(ctr);
    // Level Up button, right under the Soul Pool. Pulses gold when XP has reached the next threshold.
    const luRow = el("div", "soul-lvlrow");
    const lu = el("button", "btn primary small" + (bar.ready ? " xp-ready-btn" : ""), rec.level >= 30 ? "Max Level (30)" : (bar.ready ? "⭐ Level Up — ready!" : "⭐ Level Up"));
    lu.disabled = rec.level >= 30;
    lu.onclick = () => App.openLevelUp(rec.id);
    luRow.appendChild(lu);
    const up = unspentPoints();
    if (up.any) {
      const bits = [];
      if (up.availTP > 0) bits.push(`${up.availTP} TP`);
      if (up.availAttr > 0) bits.push(`${up.availAttr} attribute`);
      if (up.availCSP > 0) bits.push(`${up.availCSP} CSP`);
      luRow.appendChild(el("span", "lu-note", `★ ${bits.join(" · ")} to spend`));
    }
    box.appendChild(luRow);
    return box;
  }

  function inventoryItem(it, idx) {
    if (!it.id) it.id = "it_" + idx;
    const equippable = it.category === "Weapon" || it.category === "Armor" || it.category === "Shield";
    const open = expandedItem === it.id;
    const wrap = el("div", "inv-item" + (it.equipped ? " equipped" : ""));

    const row = el("div", "inv-row");
    const lineWt = (Number(it.weight) || 0) * (Number(it.qty) || 1);
    const head = el("div", "inv-row-head");
    head.innerHTML =
      `<span class="inv-cat-tag">${it.category || "Misc"}</span>
       <span class="inv-item-name">${it.name}${it.equipped ? ' <span class="equip-badge">equipped</span>' : ""}</span>
       <span class="inv-item-wt">${lineWt} lb${it.qty > 1 ? ` (${it.weight}×${it.qty})` : ""}</span>`;
    head.style.cursor = "pointer";
    head.onclick = () => { expandedItem = open ? null : it.id; refresh(); };
    row.appendChild(head);

    const qtyCtl = el("div", "inv-qty-ctl");
    const minus = el("button", "btn small ghost", "−"); minus.onclick = () => changeQty(idx, -1);
    const qn = el("span", "inv-qn", String(it.qty));
    const plus = el("button", "btn small ghost", "+"); plus.onclick = () => changeQty(idx, 1);
    const caret = el("button", "btn small ghost", open ? "▲" : "▼"); caret.onclick = () => { expandedItem = open ? null : it.id; refresh(); };
    qtyCtl.appendChild(minus); qtyCtl.appendChild(qn); qtyCtl.appendChild(plus); qtyCtl.appendChild(caret);
    row.appendChild(qtyCtl);
    wrap.appendChild(row);

    if (open) {
      const detail = el("div", "inv-detail");

      // Flavor description — what the item is (falls back to the catalog for older saved items).
      const desc = it.desc || (window.PC.itemDesc ? PC.itemDesc(it.name) : "");
      if (desc) detail.appendChild(el("div", "inv-desc", desc));

      // Tool kits show the Skill they support (fall back to the catalog for older saved items).
      const itemSkill = it.skill || (window.PC.itemSkill ? PC.itemSkill(it.name) : null);
      if (itemSkill) detail.appendChild(el("div", "inv-skill", `🛠 Aids <b>${itemSkill}</b> checks`));

      // Consumables show what Use does (the mechanical note), so the effect is clear up front.
      if (it.category === "Consumable" && it.note) detail.appendChild(el("div", "inv-skill", `⚕ <b>Use:</b> ${it.note}`));

      // Thrown weapons are their own ammo — expended on the throw, recovered after; carry several.
      if (it.thrown) detail.appendChild(el("div", "inv-skill", `🎯 <b>Thrown</b> — expended on a throw, recovered afterward; carry several. You have <b>${Number(it.qty) || 0}</b> to throw.`));
      // A projectile weapon shows which ammo it draws and how many rounds you have.
      else if (it.category === "Weapon") { const a = weaponAmmo(it); if (a && a !== "__self__") { const left = ammoLeft(it) || 0; detail.appendChild(el("div", "inv-skill", `🎯 <b>Ammo:</b> ${a} — <b>${left}</b> round${left === 1 ? "" : "s"} left${left < 1 ? ' <span class="craft-dt">· out, add some</span>' : ""}`)); } }
      // Ammunition shows what family of ranged weapons it feeds, and the rounds in the stack.
      if (it.category === "Ammo") detail.appendChild(el("div", "inv-skill", `🎯 <b>Ammunition</b> — feeds ${it.feeds || "ranged weapons"} · <b>${Number(it.qty) || 0}</b> rounds`));

      // Crafting: what it's made of, the required skill, and what salvaging returns (downtime activity).
      const recipe = it.category !== "Salvage" ? recipeOf(it) : null;
      if (recipe) {
        detail.appendChild(el("div", "inv-skill", `🔨 <b>Made of:</b> ${fmtMats(recipe)}`));
        const ci = craftCheckInfo(it);
        if (ci.name) detail.appendChild(el("div", "inv-skill",
          `🔧 <b>Craft check:</b> ${ci.name} (d20${PC.fmtMod(ci.mod)}) vs DC ${ci.dc}` + (ci.prof ? ' <span class="craft-ok">✓ proficient</span>' : ' <span class="craft-dt">untrained</span>')));
        const yld = PC.itemSalvageYield(it);
        if (yld && yld.length) detail.appendChild(el("div", "inv-skill", `♻ <b>Salvage yields:</b> ${fmtMats(yld)} <span class="craft-dt">· downtime</span>`));
      } else if (it.category !== "Salvage" && it.rarity === "Legendary") {
        detail.appendChild(el("div", "inv-skill", "🔨 <b>Legendary</b> — too intricate to craft or salvage."));
      }
      // Junk: no use but salvage (and a few trade as scrip).
      if (it.category === "Junk") {
        const jy = PC.itemSalvageYield ? PC.itemSalvageYield(it) : null;
        detail.appendChild(el("div", "inv-skill", `🗑 <b>Junk</b> — no real use.${it.currency ? " Traded as scrip in some settlements." : ""}`));
        detail.appendChild(el("div", "inv-skill", jy && jy.length ? `♻ <b>Salvage yields:</b> ${fmtMats(jy)} <span class="craft-dt">· downtime</span>` : "♻ <b>Salvage:</b> nothing usable."));
      }

      // Actions
      const actions = el("div", "inv-actions");
      actions.appendChild(el("span", "inv-actions-label", "Actions:"));
      if (equippable) {
        const eq = el("button", "btn small " + (it.equipped ? "" : "primary"), it.equipped ? "Unequip" : "Equip");
        eq.onclick = () => toggleEquip(it);
        actions.appendChild(eq);
      }
      if (it.category === "Weapon") {
        const lk = lockReason(weaponAttr(it));
        const atk = el("button", "btn small", "⚔ Attack");
        const ammoStop = ammoBlocked(it);
        atk.disabled = !!lk || econBlocked("Action") || !!ammoStop;
        atk.title = lk || ammoStop || (econBlocked("Action") ? "Action already used this turn" : "");
        atk.onclick = () => attackWith(it);
        const dmg = el("button", "btn small", "🎲 Damage");
        dmg.disabled = !!lk; if (lk) dmg.title = lk;
        dmg.onclick = () => damageWith(it);
        actions.appendChild(atk); actions.appendChild(dmg);
        // On-hit melee augments (e.g. Ki Strike): roll weapon damage + augment together, spend its KP.
        if (weaponIsMelee(it)) {
          knownMeleeAugments().forEach((t) => {
            const b = el("button", "btn small", `+${t.name} (${t.kp} KP)`);
            b.title = lk || `On a hit: roll ${it.name} damage + ${t.name} (${t.effect})`;
            b.disabled = !!lk || play.kp < t.kp;
            b.onclick = () => damageWith(it, t.name);
            actions.appendChild(b);
          });
        }
      }
      if (it.category === "Consumable") {
        const use = el("button", "btn small primary", "Use (−1)");
        use.onclick = () => useConsumable(idx);
        actions.appendChild(use);
      }
      // Salvage: break one unit down into its materials (craftable items, plus junk that yields something).
      if (it.category !== "Salvage" && (recipeOf(it) || (it.category === "Junk" && PC.itemSalvageYield && PC.itemSalvageYield(it)))) {
        const salv = el("button", "btn small ghost", "♻ Salvage");
        salv.title = "Downtime: break one down into salvage materials";
        salv.onclick = () => salvageItem(idx);
        actions.appendChild(salv);
      }
      const del = el("button", "btn small ghost", "✕ Delete");
      del.onclick = () => { expandedItem = null; removeItem(idx); };
      actions.appendChild(del);
      detail.appendChild(actions);

      // Config
      if (it.category === "Weapon") {
        const cfg = el("div", "inv-cfg");
        const wtSel = el("select");
        wtSel.innerHTML = '<option value="">— weapon type —</option>' +
          PC.WEAPON_TYPES.map((w) => `<option value="${w.name}" ${it.weaponType === w.name ? "selected" : ""}>${w.name} (${w.attr})</option>`).join("");
        wtSel.onchange = () => setItemField(it, "weaponType", wtSel.value);
        const dieInp = el("input"); dieInp.type = "text"; dieInp.placeholder = "damage die e.g. 1d10"; dieInp.value = it.damage || "";
        dieInp.onchange = () => setItemField(it, "damage", dieInp.value.trim());
        cfg.appendChild(labeled("Weapon type", wtSel));
        cfg.appendChild(labeled("Damage die", dieInp));
        detail.appendChild(cfg);
        const attr = weaponAttr(it);
        const note = el("div", "inv-note");
        note.innerHTML = attr
          ? `Attack adds <b>${attr} ${PC.fmtMod(adjMod(attr))}</b>${proficientWithType(it) ? " + prof " + PC.fmtMod(PC.profBonus(rec.level)) : " (not proficient)"}; damage adds ${attr} ${PC.fmtMod(adjMod(attr))}.`
          : "Pick a weapon type to enable attack/damage rolls (sets the governing attribute).";
        detail.appendChild(note);
      }
      if (it.category === "Armor") {
        const cls = it.armorClass || "Light"; // custom/legacy armor defaults to Light
        const prof = proficientWithArmorClass(cls);
        // Class · rarity · proficiency line.
        const tags = el("div", "inv-note");
        tags.innerHTML = `<b>${cls} armor</b>${it.rarity && it.rarity !== "Common" ? ` · ${it.rarity}` : ""} · ${prof ? "proficient ✓" : "not proficient ⚠"}`;
        detail.appendChild(tags);
        // Config: class selector (for custom/legacy armor) + Defense bonus.
        const cfg = el("div", "inv-cfg");
        const clsSel = el("select");
        clsSel.innerHTML = ["Light", "Medium", "Heavy"].map((c) => `<option value="${c}" ${c === cls ? "selected" : ""}>${c}</option>`).join("");
        clsSel.onchange = () => setItemField(it, "armorClass", clsSel.value);
        const dsInp = el("input"); dsInp.type = "number"; dsInp.placeholder = "DS bonus"; dsInp.value = (it.dsBonus != null ? it.dsBonus : "");
        dsInp.onchange = () => setItemField(it, "dsBonus", parseInt(dsInp.value, 10) || 0);
        cfg.appendChild(labeled("Armor class", clsSel));
        cfg.appendChild(labeled("Defense Score bonus", dsInp));
        detail.appendChild(cfg);
        // Class benefits/drawbacks + proficiency effect.
        const traits = cls === "Light" ? "Full AGI to Defense · Stealth advantage"
          : cls === "Medium" ? "AGI to Defense capped at +2"
          : "No AGI to Defense · −5 ft movement · Stealth disadvantage";
        const eff = el("div", "inv-note");
        if (it.equipped && !prof) {
          eff.innerHTML = `⚠ Not proficient with <b>${cls}</b> armor — while worn you gain <b>no Defense bonus</b> and roll AGI checks & attacks at <b>disadvantage</b>. (${traits}.)`;
        } else if (it.equipped) {
          eff.innerHTML = `Equipped: <b>+${Number(it.dsBonus) || 0} Defense</b>. ${traits}.`;
        } else {
          eff.innerHTML = `${traits}. Equip to apply${prof ? "" : ` — note you're <b>not proficient</b> with ${cls} armor`}.`;
        }
        detail.appendChild(eff);
        // Auto-applied perks (grants) + GM-applied special note.
        if (it.grants && it.grants.advSkill) detail.appendChild(el("div", "inv-note", `✦ Advantage on <b>${[].concat(it.grants.advSkill).join(", ")}</b> checks while equipped${prof ? "" : " (needs proficiency)"}.`));
        if (it.grants && it.grants.noMovePenalty) detail.appendChild(el("div", "inv-note", "✦ Negates Heavy armor's −5 ft movement penalty."));
        if (it.note) detail.appendChild(el("div", "inv-note", `★ ${it.note}`));
      }

      wrap.appendChild(detail);
    }
    return wrap;
  }
  function labeled(label, node) {
    const l = el("label", "inv-field");
    l.appendChild(el("span", null, label));
    l.appendChild(node);
    return l;
  }

  // Reusable technique card (used by the Sheet's Techniques panel and the Combat tab).
  function makeTechCard(t) {
    const active = play.active.indexOf(t.name) > -1;
    const afford = play.kp >= t.kp;
    const c = el("div", "tech-card" + (active ? " selected" : "") + (t.fusion ? " fusion-tech" : ""));
    const costParts = [t.kp + " KP"];
    if (t.upkeep) costParts.push("+" + t.upkeep + "/turn");
    const fuseTag = t.fusion ? ' <span class="fusion-flag">✨ Fusion</span>' : "";
    const meta = t.fusion
      ? `<span class="fusion-meta">${t.kinetic}</span> · ${t.tier} · ${t.action}`
      : `${t.kinetic} · ${t.tier} · ${t.action}`;
    c.innerHTML =
      `<div class="thead"><span class="tname">${t.name}${fuseTag}${active ? ' <span class="freeflag" style="color:var(--good)">active</span>' : ""}</span><span class="cost">${costParts.join(" ")}</span></div>
       <div class="tmeta">${meta}</div>
       <div class="teff">▸ ${t.effect}</div>`;
    // Fusion chakra penalty: a damaged parent chakra makes the fusion "less effective" — surface it.
    const penNote = techChakraPenaltyNote(t);
    if (penNote) c.appendChild(el("div", "inv-note fusion-penalty", penNote));
    if (t.augment && t.augment.kind === "melee-damage") {
      c.appendChild(el("div", "inv-note", "⚔ Melee augment — use it from an equipped melee weapon's damage roll."));
    } else if (techniqueNeedsToHit(t)) {
      // single-target ranged: roll to-hit (spends KP + Action), then damage if it hits
      const row = el("div", "combat-actions");
      const blocked = econBlocked(t.action);
      const lk = techLockReason(t);
      const atk = el("button", "btn small primary", `⚔ Attack (−${t.kp} KP)`);
      atk.disabled = !!lk || !afford || blocked;
      atk.title = lk || (blocked ? `${econName(t.action)} already used this turn` : "d20 + attr mod + proficiency to hit");
      atk.onclick = () => attackTechnique(t);
      const dmg = el("button", "btn small", "🎲 Damage");
      dmg.disabled = !!lk;
      dmg.title = lk || "Roll damage if the attack hits";
      dmg.onclick = () => damageTechnique(t);
      row.appendChild(atk); row.appendChild(dmg);
      c.appendChild(row);
    } else {
      const btnLabel = t.sustained ? (active ? "End" : "Activate") : (techniqueIsAoE(t) ? "Use — auto-hit AoE" : "Use");
      const btn = el("button", "btn small " + (active ? "" : "primary"), btnLabel);
      // Ending a sustained technique is always allowed (even when locked); everything else is
      // gated by KP + action economy, and by the governing chakra's lockout.
      const blocked = econBlocked(t.action);
      const lk = active ? null : techLockReason(t);
      btn.disabled = active ? false : (!!lk || !afford || blocked);
      if (!active) btn.title = lk || (blocked ? `${econName(t.action)} already used this turn` : "");
      btn.style.marginTop = "8px";
      btn.onclick = () => useTechnique(t);
      c.appendChild(btn);
    }
    return c;
  }
  function makeUnknownTechCard(n) {
    const c = el("div", "tech-card");
    c.innerHTML = `<div class="thead"><span class="tname">${n}</span><span class="cost">—</span></div><div class="tdesc">Details not in the library yet.</div>`;
    return c;
  }
  // Clickable combat-skill card for the Combat tab's action groups (Action / Bonus / Reaction).
  function makeCombatSkillCard(c) {
    const card = el("div", "tech-card");
    card.innerHTML =
      `<div class="thead"><span class="tname">🎖 ${c.name}</span><span class="tmeta">${c.action}${c.style ? " · " + c.style : ""}</span></div>` +
      `<div class="teff">▸ ${c.effect}</div>`;
    const blocked = econBlocked(c.action);
    // Called-shot skills (Marksmanship): pick the ranged attack you made, then roll the check with its attribute.
    if (c.calledShot) {
      const sources = calledShotSources();
      const row = el("div", "combat-actions"); row.style.marginTop = "8px";
      if (!sources.length) {
        row.appendChild(el("span", "muted", "Equip a weapon or learn an attack technique to aim a called shot."));
      } else {
        const sel = el("select", "adjust-input"); sel.title = "The ranged attack you just made";
        sources.forEach((s, i) => { const o = el("option", null, s.label); o.value = String(i); sel.appendChild(o); });
        const btn = el("button", "btn small primary", "🎯 Called Shot");
        btn.disabled = blocked;
        btn.title = blocked ? `${econName(c.action)} already used this turn` : "Roll the called-shot check (spends your Bonus Action)";
        btn.onclick = () => rollCalledShot(c, calledShotSources()[parseInt(sel.value, 10) || 0]);
        row.appendChild(sel); row.appendChild(btn);
      }
      card.appendChild(row);
      return card;
    }
    const btn = el("button", "btn small primary", "Use");
    btn.disabled = blocked;
    btn.title = blocked ? `${econName(c.action)} already used this turn` : `Spends your ${econName(c.action)}`;
    btn.style.marginTop = "8px";
    btn.onclick = () => useCombatSkill(c);
    card.appendChild(btn);
    return card;
  }
  function tileRoll(label, val, onclick) {
    const t = tile(label, val);
    t.classList.add("clickable");
    t.title = "Click to roll";
    t.onclick = onclick;
    return t;
  }

  /* ---------- Limbs tab ---------- */
  // Health state of a limb → class for coloring (ok / hurt ≤50% / ko crippled).
  function limbState(key) {
    const cur = limbCurrent(key), max = limbMaxFor(key);
    const ratio = max > 0 ? cur / max : 0;
    return { cur, max, cls: cur <= 0 ? "ko" : ratio <= 0.5 ? "hurt" : "ok" };
  }
  // Fallout-style body figure: each limb is a clickable SVG group with its cur/max written over it.
  // Layout positions (viewBox 0 0 320 380): head, torso, arms outstretched, legs apart.
  function limbFigureSVG() {
    const parts = [
      { key: "head",  shape: '<ellipse cx="160" cy="46" rx="30" ry="34"/>', tx: 160, ty: 47, fs: 16 },
      { key: "torso", shape: '<rect x="120" y="84" width="80" height="128" rx="18"/>', tx: 160, ty: 148, fs: 20 },
      { key: "larm",  shape: '<rect x="24" y="110" width="96" height="30" rx="15"/>', tx: 71, ty: 125, fs: 15 },
      { key: "rarm",  shape: '<rect x="200" y="110" width="96" height="30" rx="15"/>', tx: 249, ty: 125, fs: 15 },
      { key: "lleg",  shape: '<rect x="116" y="214" width="32" height="152" rx="16"/>', tx: 132, ty: 292, fs: 13 },
      { key: "rleg",  shape: '<rect x="172" y="214" width="32" height="152" rx="16"/>', tx: 188, ty: 292, fs: 13 },
    ];
    let g = "";
    parts.forEach((pt) => {
      const st = limbState(pt.key);
      const sel = limbSel === pt.key ? " sel" : "";
      g += `<g class="limb ${st.cls}${sel}" data-key="${pt.key}">${pt.shape}` +
        `<text class="limb-num" x="${pt.tx}" y="${pt.ty}" font-size="${pt.fs}" text-anchor="middle" dominant-baseline="central">${st.cur}/${st.max}</text>` +
        `</g>`;
    });
    return `<svg class="limb-figure" viewBox="0 0 320 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Body — tap a limb">${g}</svg>`;
  }

  function buildLimbsTab() {
    const root = el("div");
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Limb Damage — called shots"));
    p.appendChild(el("p", "hint", "A <b>called shot</b> (e.g. Marksmanship) damages a limb <b>and</b> your HP, capped at the limb's current HP — excess is lost. At 0 HP a limb is <b>crippled</b>. Long rest fully heals limbs; short rest restores half. <b>Tap a limb</b> on the figure to damage or heal it."));

    // The body figure — each limb shows its HP in the pool-number style (colored by health).
    const figWrap = el("div", "limb-figure-wrap");
    figWrap.innerHTML = limbFigureSVG();
    figWrap.querySelectorAll(".limb[data-key]").forEach((gEl) => {
      gEl.addEventListener("click", () => { const k = gEl.getAttribute("data-key"); limbSel = limbSel === k ? null : k; refresh(); });
    });
    p.appendChild(figWrap);

    // Editor for the tapped limb (or a hint if none selected).
    if (limbSel) {
      const L = PC.LIMBS.find((x) => x.key === limbSel);
      const cur = limbCurrent(limbSel), max = limbMaxFor(limbSel), crippled = cur <= 0;
      const ed = el("div", "limb-editor");
      ed.appendChild(el("div", "limb-ed-head",
        `<b>${L.name}</b> <span class="limb-ed-num">${cur} / ${max}</span>` + (crippled ? ' <span class="limb-crippled-tag">⚠ CRIPPLED</span>' : "")));
      if (crippled) ed.appendChild(el("div", "limb-effect", L.crippled));
      const ctl = el("div", "adjust-row");
      const inp = el("input"); inp.type = "number"; inp.placeholder = "#"; inp.className = "adjust-input";
      const hit = el("button", "btn small", "⊕ Called Shot");
      hit.title = "Apply damage to this limb and HP (capped at limb HP)";
      hit.onclick = () => { const v = parseInt(inp.value, 10); if (v) calledShot(limbSel, Math.abs(v)); };
      const heal = el("button", "btn small ghost", "Heal");
      heal.onclick = () => { const v = parseInt(inp.value, 10); if (v) healLimb(limbSel, Math.abs(v)); };
      const full = el("button", "btn small ghost", "Full");
      full.onclick = () => healLimb(limbSel, max);
      ctl.appendChild(inp); ctl.appendChild(hit); ctl.appendChild(heal); ctl.appendChild(full);
      ed.appendChild(ctl);
      p.appendChild(ed);
    } else {
      p.appendChild(el("div", "pool-hint", "Tap a limb to damage or heal it"));
    }

    // Any crippled limbs: list their (auto-applied) effects so nothing is hidden.
    const crippledLimbs = PC.LIMBS.filter((L) => limbCurrent(L.key) <= 0);
    if (crippledLimbs.length) {
      const sum = el("div"); sum.style.marginTop = "14px";
      sum.appendChild(el("div", "section-label", "Crippled — effects in play"));
      crippledLimbs.forEach((L) => sum.appendChild(el("div", "limb-effect", `⚠ <b>${L.name}</b> — ${L.crippled}`)));
      p.appendChild(sum);
    }

    root.appendChild(p);
    return root;
  }

  /* ---------- Chakras tab ---------- */
  // Chakras run down the body's centerline (crown → root). Each is one attribute's chakra,
  // drawn in its own signature color; hits dim it and, at 4, lock it out.
  function chakraOrder() { return PC.ATTRS.slice().sort((a, b) => PC.CHAKRAS[a].order - PC.CHAKRAS[b].order); }
  // The hidden Heart chakra reveals itself only once the Soul Creature awakens (Soul Level 15+).
  function heartUnlocked() { return (rec.level || 0) >= PC.HEART_CHAKRA.unlockLevel; }

  // Seated (lotus) silhouette with a colored chakra disc glowing over each spinal point.
  function chakraFigureSVG() {
    const ys = [22, 44, 70, 128, 162, 196]; // by order: crown, third-eye, throat, solar-plexus, sacral, root
    const body =
      '<path class="ch-body" d="M150 176 C96 176 54 200 54 226 C54 244 96 252 150 252 C204 252 246 244 246 226 C246 200 204 176 150 176 Z"/>' +
      '<path class="ch-body" d="M120 92 C86 104 66 150 70 206 C74 220 98 222 114 210 C122 172 128 130 132 104 Z"/>' +
      '<path class="ch-body" d="M180 92 C214 104 234 150 230 206 C226 220 202 222 186 210 C178 172 172 130 168 104 Z"/>' +
      '<path class="ch-body" d="M150 62 C126 62 114 76 117 96 L127 198 C131 216 169 216 173 198 L183 96 C186 76 174 62 150 62 Z"/>' +
      '<rect class="ch-body" x="140" y="50" width="20" height="16" rx="6"/>' +
      '<circle class="ch-body" cx="150" cy="34" r="23"/>';
    let dots = "";
    chakraOrder().forEach((a) => {
      const ch = PC.CHAKRAS[a];
      const hits = chakraOf(a);
      const st = hits >= 4 ? "locked" : hits > 0 ? "hurt" : "ok";
      const sel = chakraSel === a ? " sel" : "";
      const cy = ys[ch.order];
      dots +=
        `<g class="chakra ${st}${sel}" data-attr="${a}" style="--cc:${ch.color}">` +
        `<circle class="ch-halo" cx="150" cy="${cy}" r="17"/>` +
        `<circle class="ch-disc" cx="150" cy="${cy}" r="12"/>` +
        `<circle class="ch-core" cx="150" cy="${cy}" r="5"/>` +
        (hits >= 4 ? `<text class="ch-x" x="150" y="${cy}" text-anchor="middle" dominant-baseline="central">✕</text>` : "") +
        `</g>`;
    });
    // The awakened Heart chakra sits at the chart's center (mid-chest), between Throat and Core.
    if (heartUnlocked()) {
      const h = PC.HEART_CHAKRA;
      const hits = chakraOf("HEART");
      const st = hits >= 4 ? "locked" : hits > 0 ? "hurt" : "ok";
      const sel = chakraSel === "HEART" ? " sel" : "";
      dots +=
        `<g class="chakra heart awakened ${st}${sel}" data-attr="HEART" style="--cc:${h.color}">` +
        `<circle class="ch-halo" cx="150" cy="99" r="20"/>` +
        `<circle class="ch-disc" cx="150" cy="99" r="13"/>` +
        `<circle class="ch-core" cx="150" cy="99" r="5"/>` +
        (hits >= 4 ? `<text class="ch-x" x="150" y="99" text-anchor="middle" dominant-baseline="central">✕</text>` : "") +
        `</g>`;
    }
    return `<svg class="chakra-figure" viewBox="0 0 300 268" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chakras — tap one">${body}${dots}</svg>`;
  }

  function buildChakraTab() {
    const root = el("div");
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Chakras — one per attribute" + (heartUnlocked() ? " (+ the Heart)" : "")));
    p.appendChild(el("p", "hint", "Each chakra governs an attribute. Taking <b>hits</b> weakens it: 1 = disadvantage, 2 = modifier halved, 3 = modifier removed, 4 = <b>locked out</b> (no rolls with that attribute until you rest). <b>Tap a chakra</b> on the figure — or a row below — to set its hits. Short rest heals 1 hit each; long rest heals 2." + (heartUnlocked() ? " The <b class=\"heart-hl\">Heart</b> chakra works the same, but governs your <b>Otherkin</b> — its hits weaken every Soul-Creature technique and the signature ability, and lock the Otherkin out entirely at 4." : "")));

    const figWrap = el("div", "chakra-figure-wrap");
    figWrap.innerHTML = chakraFigureSVG();
    figWrap.querySelectorAll(".chakra[data-attr]").forEach((gEl) => {
      gEl.addEventListener("click", () => { const a = gEl.getAttribute("data-attr"); chakraSel = chakraSel === a ? null : a; refresh(); });
    });
    p.appendChild(figWrap);

    // Labeled control rows (crown → root), each in its chakra's color, with pips to set hits.
    const list = el("div", "chakra-legend");
    chakraOrder().forEach((a) => {
      const ch = PC.CHAKRAS[a];
      const hits = chakraOf(a);
      const eff = PC.chakraEffect(hits);
      const row = el("div", "chakra-leg" + (hits >= 4 ? " locked" : hits > 0 ? " hurt" : "") + (chakraSel === a ? " sel" : ""));
      row.style.setProperty("--cc", ch.color);
      const info = el("div", "chakra-leg-info");
      info.innerHTML =
        `<span class="chakra-swatch"></span>` +
        `<span class="chakra-nm">${ch.name}</span>` +
        `<span class="chakra-at">${a} · ${PC.ATTR_NAMES[a]}</span>` +
        `<span class="chakra-eff">${eff.label}</span>`;
      info.onclick = () => { chakraSel = chakraSel === a ? null : a; refresh(); };
      const pips = el("div", "pips");
      for (let i = 0; i < 4; i++) {
        const pip = el("span", "pip" + (i < hits ? " filled" : ""));
        pip.onclick = () => setChakra(a, hits === i + 1 ? i : i + 1);
        pips.appendChild(pip);
      }
      row.appendChild(info); row.appendChild(pips);
      list.appendChild(row);
    });
    // The Heart chakra joins the list only once it has awakened (Soul Level 15+).
    if (heartUnlocked()) {
      const h = PC.HEART_CHAKRA;
      const hits = chakraOf("HEART");
      const eff = PC.chakraEffect(hits);
      const row = el("div", "chakra-leg heart" + (hits >= 4 ? " locked" : hits > 0 ? " hurt" : "") + (chakraSel === "HEART" ? " sel" : ""));
      row.style.setProperty("--cc", h.color);
      const info = el("div", "chakra-leg-info");
      info.innerHTML =
        `<span class="chakra-swatch"></span>` +
        `<span class="chakra-nm">${h.name}</span>` +
        `<span class="chakra-at">Otherkin · Soul Creature</span>` +
        `<span class="chakra-eff">${eff.label}</span>`;
      info.onclick = () => { chakraSel = chakraSel === "HEART" ? null : "HEART"; refresh(); };
      const pips = el("div", "pips");
      for (let i = 0; i < 4; i++) {
        const pip = el("span", "pip" + (i < hits ? " filled" : ""));
        pip.onclick = () => setChakra("HEART", hits === i + 1 ? i : i + 1);
        pips.appendChild(pip);
      }
      row.appendChild(info); row.appendChild(pips);
      list.appendChild(row);
    }
    p.appendChild(list);
    // Reveal note — explains the newly awakened Heart chakra and that its powers are still to come.
    if (heartUnlocked()) {
      p.appendChild(el("div", "chakra-heart-note",
        `<b class="heart-hl">♥ The Heart chakra is awake.</b> It is the seat of your <b>Otherkin</b> — the Soul Creature at the center of your chakras. A hit here weakens <b>all</b> of its powers (techniques and signature); at 4 hits the Soul Creature falls <b>dormant</b> until you rest. Shape and use your Otherkin on the <b>♥ Otherkin</b> tab.`));
    }
    root.appendChild(p);
    return root;
  }

  /* ---------- Kinetics tab ---------- */
  // Summary of which Kinetics have earned proficiency / expertise, and progress toward the next milestone.
  function kineticProfPanel() {
    const known = knownTechniques();
    const kinSet = {};
    known.forEach((n) => { const t = PC.technique(n); if (t) kinSet[t.kinetic] = true; });
    bg().combat.forEach((c) => { if (PC.kinetic(c)) kinSet[c] = true; });
    const kins = PC.KINETICS.map((k) => k.name).filter((n) => kinSet[n]);
    if (!kins.length) return null;
    const panel = el("div", "panel");
    panel.appendChild(el("div", "section-label", "Kinetic Proficiencies"));
    panel.appendChild(el("p", "hint", "Complete a Kinetic's <b>Adept</b> tier (all 3 techniques) to gain <b>proficiency</b> in it; complete its <b>Expert</b> tier (all 3) for <b>expertise</b> — double proficiency bonus on that Kinetic's technique attacks. Your background focus Kinetic is proficient from the start."));
    kins.forEach((kin) => {
      const lvl = kineticProfLevel(kin);
      const adeptAll = PC.kineticTierTechniques(kin, "Adept"), expertAll = PC.kineticTierTechniques(kin, "Expert");
      const adeptDone = adeptAll.filter((t) => known.indexOf(t.name) > -1).length;
      const expertDone = expertAll.filter((t) => known.indexOf(t.name) > -1).length;
      const focus = isFocusKinetic(kin);
      const badge = lvl === "expertise" ? '<span class="kin-prof-badge exp">✦ Expertise</span>'
        : lvl === "proficient" ? '<span class="kin-prof-badge pro">✓ Proficient</span>'
        : '<span class="kin-prof-badge none">—</span>';
      let note;
      if (lvl === "expertise") note = `+${PC.kineticProfBonus(rec.level, lvl)} to hit (2× prof)`;
      else if (lvl === "proficient") note = `Expert ${expertDone}/${expertAll.length} → expertise`;
      else note = `Adept ${adeptDone}/${adeptAll.length} → proficiency`;
      const row = el("div", "kin-prof-row");
      row.innerHTML = `<span class="kin-prof-name">${kin}${focus ? ' <span class="tag">focus</span>' : ""}</span>${badge}<span class="kin-prof-note">${note}</span>`;
      panel.appendChild(row);
    });
    return panel;
  }

  function buildKineticsTab() {
    const root = el("div");
    const profPanel = kineticProfPanel();
    if (profPanel) root.appendChild(profPanel);
    const tech = el("div", "panel");
    tech.appendChild(el("div", "section-label", "Techniques — spend KP to use"));
    const known = knownTechniques();
    let anyMech = false;
    known.forEach((n) => {
      const t = PC.technique(n);
      if (!t) { tech.appendChild(makeUnknownTechCard(n)); return; }
      anyMech = true;
      tech.appendChild(makeTechCard(t));
    });
    if (!anyMech) tech.appendChild(el("div", "muted", "No playable techniques yet."));
    root.appendChild(tech);
    const fusePanel = buildFusionPanel();
    if (fusePanel) root.appendChild(fusePanel);
    return root;
  }

  // ✨ Fusion Kinetics — only appears once the character has DISCOVERED at least one fusion (knows both
  // halves of a pair). Each unlocked fusion shows its parents, combined role, and the fusion techniques
  // earned so far; more appear automatically as the character learns more paired parent techniques.
  function buildFusionPanel() {
    const fus = knownFusionTechs();
    if (!fus.length) return null; // hidden until unlocked — nothing leaks before discovery
    const panel = el("div", "panel fusion-panel");
    panel.appendChild(el("div", "section-label", "✨ Fusion Kinetics — discovered"));
    panel.appendChild(el("p", "hint", "Advanced kinetics you've unlocked by combining techniques from two Kinetic types. A fusion technique is granted automatically the moment you know <b>both</b> of its parent techniques — no Technique Points spent. More unlock as you learn more paired techniques."));
    const byFusion = {};
    fus.forEach((t) => { (byFusion[t.kinetic] = byFusion[t.kinetic] || []).push(t); });
    const tierRank = { Adept: 0, Expert: 1, Master: 2 };
    PC.FUSIONS.forEach((f) => {
      const techs = byFusion[f.name];
      if (!techs) return;
      const head = el("div", "fusion-head");
      head.innerHTML = `<span class="fusion-name">✨ ${f.name}</span>` +
        `<span class="fusion-parents">${f.parents.join(" + ")}</span>` +
        `<span class="fusion-role">${f.role}${f.established ? "" : " · provisional"}</span>`;
      panel.appendChild(head);
      panel.appendChild(el("div", "fusion-domain", f.domain));
      const grid = el("div", "combat-grid");
      techs.sort((a, b) => (tierRank[a.tier] - tierRank[b.tier]));
      techs.forEach((t) => grid.appendChild(makeTechCard(t)));
      panel.appendChild(grid);
    });
    return panel;
  }

  /* ---------- Skills tab ---------- */
  function buildSkillsTab() {
    const root = el("div");
    const skills = el("div", "panel");
    skills.appendChild(el("div", "section-label", "Skills — tap to roll a check"));
    PC.ATTRS.forEach((a) => {
      const grp = PC.skillsByAttr(a);
      const lbl = el("div", "skill-attr-label");
      lbl.textContent = `${a} ${PC.fmtMod(adjMod(a))}${isDisadv(a) ? " · disadv" : ""}${flawDisadvAttr(a) ? " · flaw" : ""}${isLocked(a) ? " · LOCKED" : ""}`;
      skills.appendChild(lbl);
      const list = el("div", "skill-list");
      grp.forEach((s) => {
        const proficient = bg().skills.includes(s.name) || (rec.chosenSkills || []).includes(s.name);
        const mod = adjMod(a) + (proficient ? PC.profBonus(rec.level) : 0);
        const flawed = !isLocked(a) && (flawDisadvAttr(a) || flawDisadvSkill(s.name));
        const row = el("button", "skill-row" + (proficient ? " prof" : "") + (isLocked(a) ? " locked" : "") + (flawed ? " flawed" : ""));
        row.innerHTML = `<span>${proficient ? "● " : "○ "}${s.name}${s.combat ? ' <span class="tag">⚔</span>' : ""}${flawed ? ' <span class="tag flaw">⚠ flaw</span>' : ""}</span><span class="skmod">${PC.fmtMod(mod)}</span>`;
        row.disabled = isLocked(a);
        if (flawed) row.title = flawDisadvSkill(s.name) && heritageFlaw() ? heritageFlaw().name + " — " + heritageFlaw().desc : (bgFlaw() ? bgFlaw().name + " — " + bgFlaw().desc : "");
        row.onclick = () => rollSkill(s);
        list.appendChild(row);
      });
      skills.appendChild(list);
    });
    root.appendChild(skills);
    return root;
  }

  /* ---------- Inventory tab ---------- */
  /* ---------- Item Catalog (sub-screen of the Inventory tab) ---------- */
  function buildCatalogScreen() {
    const root = el("div");
    const panel = el("div", "panel");

    const headRow = el("div", "catalog-head");
    const back = el("button", "btn small ghost", "← Inventory");
    back.onclick = () => { catalogOpen = false; refresh(); };
    headRow.appendChild(back);
    headRow.appendChild(el("div", "section-label", "Item Catalog"));
    const cw = el("span", "muted"); cw.style.marginLeft = "auto";
    cw.textContent = `Carry ${carryUsed()} / ${carryCapacity()} lb`;
    headRow.appendChild(cw);
    panel.appendChild(headRow);

    panel.appendChild(el("p", "hint", "Search the full game catalog. <b>Add</b> drops an item straight in (GM/free). The 🔨 line shows an item's recipe and whether you already know it — actual <b>crafting</b> happens on the <b>🔨 Crafting</b> tab (from recipes you know). Weapons arrive attack-ready (type + damage set)."));

    const searchRow = el("div", "inv-form");
    const search = el("input"); search.type = "text"; search.placeholder = "Search items (e.g. rifle, staff, stimpak)…"; search.value = invSearchQ; search.className = "inv-name";
    const catFilter = el("select"); catFilter.className = "inv-cat";
    // Category filter — armor breaks out into its six equipment slots so you can browse one slot at a time.
    [["All", "All"], ["Weapon", "Weapon"], ["Armor", "Armor (all)"],
     ["head", "  · Head"], ["torso", "  · Torso"], ["back", "  · Back"], ["arms", "  · Arms"], ["legs", "  · Legs"], ["feet", "  · Feet"],
     ["Shield", "Shield"], ["Ammo", "Ammo"], ["Consumable", "Consumable"], ["Tool", "Tool"], ["Misc", "Misc"], ["Junk", "Junk"], ["Component", "Component"], ["Salvage", "Salvage"]
    ].forEach(([v, l]) => { const o = el("option", null, l); o.value = v; catFilter.appendChild(o); });
    catFilter.value = invSearchCat;
    searchRow.appendChild(search); searchRow.appendChild(catFilter);
    panel.appendChild(searchRow);

    const results = el("div", "catalog-results catalog-full");
    panel.appendChild(results);
    // Catalog grouping: armor splits into its six equipment slots; everything else buckets by kind.
    const APSLOTS = ["head", "torso", "back", "arms", "legs", "feet"];
    const GROUP_ORDER = ["Weapons", "Ammunition", "Shields", "Head", "Torso", "Back", "Arms", "Legs", "Feet", "Consumables", "Tools", "Miscellaneous", "Junk", "Components", "Salvage", "Other"];
    const groupOf = (it) => {
      if (it.category === "Armor") return slotLabel(armorApparelSlot(it));
      if (it.category === "Weapon") return "Weapons";
      if (it.category === "Ammo") return "Ammunition";
      if (it.category === "Shield") return "Shields";
      if (it.category === "Consumable") return "Consumables";
      if (it.category === "Tool") return "Tools";
      if (it.category === "Junk") return "Junk";
      if (it.category === "Component") return "Components";
      if (it.category === "Salvage") return "Salvage";
      if (it.category === "Misc") return "Miscellaneous";
      return "Other";
    };
    function catalogRow(it) {
      const row = el("div", "catalog-row");
      let meta = it.category;
      if (it.category === "Weapon") { meta += ` · ${it.weaponType} · ${it.damage} · ${it.hands === 2 ? "two-handed" : "one-handed"}`; if (it.thrown) meta += " · 🎯 thrown (recover after)"; if (it.note) meta += ` · ${it.note}`; }
      else if (it.category === "Armor") { meta += ` · ${slotLabel(armorApparelSlot(it))} · ${it.armorClass || "Light"} · +${it.dsBonus} DS`; if (it.note) meta += ` · ${it.note}`; }
      else if (it.category === "Shield") { meta += ` · +${it.dsBonus} DS · one hand`; if (it.note) meta += ` · ${it.note}`; }
      else if (it.category === "Ammo") { meta += ` · feeds ${it.feeds || "ranged weapons"} · +${it.count || 1} rounds`; if (it.note) meta += ` · ${it.note}`; }
      else if (it.category === "Junk") { meta += (it.salvage && it.salvage.length ? ` · salvages to ${it.salvage.join(", ")}` : " · no salvage") + (it.currency ? " · 💰 barter scrip" : ""); if (it.note) meta += ` · ${it.note}`; }
      else { if (it.skill) meta += ` · 🛠 ${it.skill}`; if (it.note) meta += ` · ${it.note}`; }
      const rarityTag = (it.category === "Weapon" || it.category === "Armor" || it.category === "Shield") && it.rarity
        ? `<span class="rarity-tag rarity-${it.rarity.toLowerCase().replace(/\s+/g, "-")}">${it.rarity}</span>` : "";
      const descLine = it.desc ? `<span class="cat-desc">${it.desc}</span>` : "";
      const recipe = it.category !== "Salvage" ? recipeOf(it) : null;
      let craftLine = "";
      if (recipe) {
        const ci = craftCheckInfo(it);
        const skillTag = ci.name ? ` · <span class="cat-craft-skill">🎲 ${ci.name} DC ${ci.dc}${ci.prof ? " ✓" : ""}</span>` : "";
        const knownTag = knowsRecipe(it) ? ' · <span class="rc-ok">📖 recipe known</span>' : "";
        craftLine = `<span class="cat-craft">🔨 ${fmtMats(recipe)}${skillTag}${knownTag}</span>`;
      } else if (it.category !== "Salvage" && it.rarity === "Legendary") craftLine = `<span class="cat-craft leg">🔨 Legendary — cannot be crafted</span>`;
      row.innerHTML = `<div class="cat-info"><span class="cat-name">${it.name}${rarityTag}</span><span class="cat-meta">${meta}</span>${descLine}${craftLine}</div><span class="cat-wt">${it.weight} lb</span>`;
      const btns = el("div", "cat-btns");
      const add = el("button", "btn small primary", "＋ Add");
      add.onclick = () => addCatalogItem(it);
      btns.appendChild(add);
      row.appendChild(btns);
      return row;
    }
    function renderResults() {
      const q = invSearchQ.trim().toLowerCase();
      const cat = invSearchCat;
      const catMatch = (it) => cat === "All" || it.category === cat || (APSLOTS.indexOf(cat) > -1 && it.category === "Armor" && armorApparelSlot(it) === cat);
      let matches = (PC.ITEMS || []).filter((it) => catMatch(it) &&
        (!q || it.name.toLowerCase().indexOf(q) > -1 || (it.weaponType && it.weaponType.toLowerCase().indexOf(q) > -1) || (it.rarity && it.rarity.toLowerCase().indexOf(q) > -1) || (it.note && it.note.toLowerCase().indexOf(q) > -1) || (it.desc && it.desc.toLowerCase().indexOf(q) > -1)));
      results.innerHTML = "";
      if (!matches.length) { results.appendChild(el("div", "muted", "No items match. Try another search.")); return; }
      const total = matches.length;
      matches = matches.slice(0, 80);
      // Bucket into groups, then render each non-empty group in order under its own header.
      const buckets = {};
      matches.forEach((it) => { const g = groupOf(it); (buckets[g] = buckets[g] || []).push(it); });
      GROUP_ORDER.forEach((g) => {
        const list = buckets[g]; if (!list || !list.length) return;
        results.appendChild(el("div", "catalog-group", `${g} <span class="cg-n">${list.length}</span>`));
        list.forEach((it) => results.appendChild(catalogRow(it)));
      });
      if (total > 80) results.appendChild(el("div", "muted", `Showing 80 of ${total} — refine your search.`));
    }
    search.oninput = () => { invSearchQ = search.value; renderResults(); };
    catFilter.onchange = () => { invSearchCat = catFilter.value; renderResults(); };
    renderResults();

    root.appendChild(panel);
    return root;
  }

  /* ---------- Equipment tab — a paper-doll of the 8 slots ---------- */
  function buildEquipmentTab() {
    const root = el("div");
    const map = equipMap();

    // Summary strip: hands used, armor DS, shield.
    const vit = el("div", "panel");
    vit.appendChild(el("div", "section-label", "Equipped"));
    const handsUsed = HAND_SLOTS.filter((s) => map[s]).length;
    const sh = equippedShield();
    const acc = accessoryDS();
    const summary = el("div", "equip-summary");
    summary.innerHTML =
      `<span>✋ Hands: <b>${handsUsed}/2</b></span>` +
      `<span>🛡 Shield: <b>${sh ? sh.name + " (+" + (sh.dsBonus || 0) + " DS)" : "—"}</b></span>` +
      `<span>🧥 Apparel: <b>+${acc.applied} DS</b>${acc.capped ? ' <span class="tag" title="Accessory Defense is capped at +' + ACCESSORY_DS_CAP + ' (raw +' + acc.raw + ')">capped</span>' : ""}</span>` +
      `<span>🎯 Defense: <b>${defenseScore()}</b>${play.blockDS ? ' <span class="tag">blocking</span>' : ""}</span>`;
    vit.appendChild(summary);
    root.appendChild(vit);

    // The paper-doll — an SVG body figure with tappable slots, matching the Limbs tab.
    const panel = el("div", "panel");
    panel.appendChild(el("div", "section-label", "Equipment"));
    const figWrap = el("div", "equip-figure-wrap");
    figWrap.innerHTML = equipFigureSVG();
    figWrap.querySelectorAll(".eqslot[data-key]").forEach((gEl) => {
      gEl.addEventListener("click", () => { const k = gEl.getAttribute("data-key"); equipPickSlot = equipPickSlot === k ? null : k; refresh(); });
    });
    panel.appendChild(figWrap);

    // Picker for the tapped slot (opens below the figure, like the Limbs editor).
    if (equipPickSlot) {
      const cur = map[equipPickSlot];
      const pk = el("div", "equip-picker");
      pk.appendChild(el("div", "equip-pick-head",
        `<b>${slotLabel(equipPickSlot)}</b>` + (cur ? ` — <span class="ep-cur">${cur.name}</span>` : ' <span class="muted">— empty —</span>')));
      if (cur) {
        const unbtn = el("button", "btn small", `Unequip ${cur.name}`);
        unbtn.onclick = () => { unequipItem(cur); equipPickSlot = null; };
        pk.appendChild(unbtn);
      }
      const eligible = (rec.inventory || []).filter((it) => isEquippable(it) && itemFitsSlot(it, equipPickSlot));
      if (!eligible.length) pk.appendChild(el("div", "muted", "Nothing in your inventory fits this slot — add gear on the Inventory tab."));
      const list = el("div", "equip-picklist");
      eligible.forEach((it) => {
        const here = it.equipped && equipSlotsFor(it).indexOf(equipPickSlot) > -1;
        const twoH = it.category === "Weapon" && Number(it.hands) === 2;
        const b = el("div", "equip-pick" + (here ? " current" : ""));
        b.innerHTML = `<span class="ep-name">${it.name}${here ? ' <span class="tag">equipped</span>' : ""}</span><span class="ep-meta">${equipItemMeta(it)}${twoH ? " · fills both hands" : ""}</span>`;
        b.onclick = () => { if (here) { unequipItem(it); } else { equipToSlot(it, equipPickSlot); } equipPickSlot = null; };
        list.appendChild(b);
      });
      pk.appendChild(list);
      const cancel = el("button", "btn small ghost", "Close");
      cancel.onclick = () => { equipPickSlot = null; refresh(); };
      pk.appendChild(cancel);
      panel.appendChild(pk);
    } else {
      panel.appendChild(el("div", "pool-hint", "Tap a slot to equip or change what's there"));
    }
    root.appendChild(panel);

    // Legend / rules note.
    root.appendChild(el("p", "hint", "Eight slots: <b>Head</b> (hats & helmets), <b>Torso</b> (shirts & body armor), <b>Back</b> (capes & coats), <b>Arms</b> (gloves & gauntlets), <b>Legs</b> (pants, skirts & greaves), <b>Feet</b> (shoes & boots), and <b>Left/Right Hand</b> (weapons & held gear). A <b>two-handed weapon fills both hands</b>; a shield takes one. Rules are enforced — equipping something displaces whatever shared its slot."));
    return root;
  }
  // The equipment paper-doll: an SVG humanoid whose regions are the eight slots (same visual language as the
  // Limbs figure). Grouped slots (Arms/Legs/Feet) draw a left+right shape; Back is a cape behind the torso.
  function equipFigureSVG() {
    const map = equipMap();
    const trunc = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
    const regions = [
      { key: "head",  shapes: ['<ellipse cx="170" cy="46" rx="30" ry="34"/>'], labels: [{ x: 170, y: 47, fs: 12 }], n: 8 },
      { key: "back",  shapes: ['<rect x="116" y="90" width="108" height="150" rx="18"/>'], labels: [{ x: 170, y: 228, fs: 12 }], n: 10 },
      { key: "torso", shapes: ['<rect x="128" y="98" width="84" height="118" rx="16"/>'], labels: [{ x: 170, y: 152, fs: 13 }], n: 11 },
      { key: "arms",  shapes: ['<rect x="58" y="114" width="70" height="26" rx="13"/>', '<rect x="212" y="114" width="70" height="26" rx="13"/>'], labels: [{ x: 93, y: 127, fs: 11 }, { x: 247, y: 127, fs: 11 }], n: 7 },
      { key: "lhand", shapes: ['<circle cx="34" cy="127" r="22"/>'], labels: [{ x: 34, y: 127, fs: 9 }], n: 6, empty: "L Hand" },
      { key: "rhand", shapes: ['<circle cx="306" cy="127" r="22"/>'], labels: [{ x: 306, y: 127, fs: 9 }], n: 6, empty: "R Hand" },
      { key: "legs",  shapes: ['<rect x="130" y="240" width="36" height="140" rx="17"/>', '<rect x="174" y="240" width="36" height="140" rx="17"/>'], labels: [{ x: 148, y: 306, fs: 10 }, { x: 192, y: 306, fs: 10 }], n: 6 },
      { key: "feet",  shapes: ['<ellipse cx="148" cy="400" rx="24" ry="14"/>', '<ellipse cx="192" cy="400" rx="24" ry="14"/>'], labels: [{ x: 148, y: 400, fs: 9 }, { x: 192, y: 400, fs: 9 }], n: 6 },
    ];
    let g = "";
    regions.forEach((r) => {
      const it = map[r.key];
      const sel = equipPickSlot === r.key ? " sel" : "";
      const txt = it ? trunc(it.name, r.n) : (r.empty || slotLabel(r.key));
      const labels = r.labels.map((L) => `<text class="eqslot-tx" x="${L.x}" y="${L.y}" font-size="${L.fs}" text-anchor="middle" dominant-baseline="central">${txt}</text>`).join("");
      g += `<g class="eqslot ${it ? "filled" : "empty"}${sel}" data-key="${r.key}">${r.shapes.join("")}${labels}</g>`;
    });
    return `<svg class="equip-figure" viewBox="0 0 340 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Equipment — tap a slot">${g}</svg>`;
  }
  // Compact one-line meta for an equippable item (used on the paper-doll + picker).
  function equipItemMeta(it) {
    if (it.category === "Weapon") return `${it.weaponType || "weapon"}${it.damage ? " · " + it.damage : ""}${Number(it.hands) === 2 ? " · 2H" : " · 1H"}`;
    if (it.category === "Shield") return `shield · +${it.dsBonus || 0} DS`;
    if (it.category === "Armor") return `${it.armorClass || "Light"} · +${it.dsBonus || 0} DS · ${slotLabel(armorApparelSlot(it))}`;
    return it.category || "";
  }

  function buildInventoryTab() {
    const root = el("div");
    const inv = el("div", "panel");
    const used = carryUsed(), cap = carryCapacity();
    const over = used > cap;
    inv.appendChild(el("div", "section-label", "Inventory & Carry Weight"));
    const cw = el("div", "carry-box" + (over ? " over" : ""));
    const cwHead = el("div", "poolbar-head");
    cwHead.innerHTML = `<span>Carry Weight</span><span class="poolbar-num">${used} / ${cap} lb${over ? " ⚠ over!" : ""}</span>`;
    cw.appendChild(cwHead);
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill carry"); fill.style.width = Math.min(100, cap > 0 ? (used / cap) * 100 : 0) + "%";
    track.appendChild(fill);
    cw.appendChild(track);
    if (over) cw.appendChild(el("div", "rest-note", "Over capacity — encumbrance rules TBD; flagged for the GM."));
    inv.appendChild(cw);

    // ---- open the item catalog (separate screen) ----
    const browseBtn = el("button", "btn small primary", "🔍 Browse & Search Item Catalog");
    browseBtn.style.margin = "4px 0 8px";
    browseBtn.onclick = () => { catalogOpen = true; refresh(); };
    inv.appendChild(browseBtn);

    // ---- quick-add a found / GM item (mechanical custom crafting lives on the Crafting tab) ----
    inv.appendChild(el("div", "section-label", "Quick-Add an Item (found / GM)"));
    const form = el("div", "inv-form");
    const nameI = el("input"); nameI.type = "text"; nameI.placeholder = "Item name"; nameI.className = "inv-name";
    const wtI = el("input"); wtI.type = "number"; wtI.placeholder = "lb"; wtI.min = 0; wtI.step = "0.1"; wtI.className = "inv-wt";
    const qtyI = el("input"); qtyI.type = "number"; qtyI.placeholder = "qty"; qtyI.min = 1; qtyI.value = 1; qtyI.className = "inv-qty";
    const catS = el("select"); catS.className = "inv-cat";
    ["Weapon", "Armor", "Shield", "Ammo", "Consumable", "Tool", "Misc"].forEach((c) => { const o = el("option", null, c); o.value = c; catS.appendChild(o); });
    catS.value = "Misc";
    const addBtn = el("button", "btn small primary", "+ Add");
    addBtn.onclick = () => {
      if (!nameI.value.trim()) { App.toast("Enter an item name."); return; }
      addItem(nameI.value.trim(), wtI.value, qtyI.value, catS.value);
    };
    form.appendChild(nameI); form.appendChild(catS); form.appendChild(wtI); form.appendChild(qtyI); form.appendChild(addBtn);
    inv.appendChild(form);

    // item list (salvage & components are shown on the Crafting tab, not in the carried-gear list)
    inv.appendChild(el("div", "section-label", "Carried Items"));
    const gearIdx = rec.inventory.map((it, idx) => idx).filter((idx) => !isIngredient(rec.inventory[idx]));
    if (!gearIdx.length) inv.appendChild(el("div", "muted", "No items yet. Search the catalog, craft, or add a custom item above."));
    else {
      const list = el("div", "inv-list");
      gearIdx.forEach((idx) => { list.appendChild(inventoryItem(rec.inventory[idx], idx)); });
      inv.appendChild(list);
    }
    // Pointer to the crafting tab (materials & crafting moved there).
    inv.appendChild(el("p", "hint", "♻ <b>Salvage</b> gear from an item's detail to earn materials — then head to the <b>🔨 Crafting</b> tab to spend them on known recipes or design your own item."));
    root.appendChild(inv);
    return root;
  }

  /* ---------- Crafting tab ---------- */
  // Turn a salvage-material name into a chip element (with tier styling + description tooltip).
  function materialChip(name, qty, tier) {
    const chip = el("div", "salvage-chip" + (tier === "Exotic" ? " exotic" : ""));
    chip.title = PC.itemDesc(name);
    chip.innerHTML = `<span class="sv-name">${name}</span><span class="sv-qty">×${qty}</span>`;
    return chip;
  }
  // One craftable recipe row (used for known catalog recipes and custom designs).
  function recipeCard(item, opts) {
    opts = opts || {};
    const r = recipeOf(item); if (!r) return null;
    const ci = craftCheckInfo(item);
    const miss = missingComponents(item);
    const card = el("div", "recipe-card");
    let meta = item.category + (item.rarity && item.rarity !== "Common" ? ` · ${item.rarity}` : "");
    if (item.category === "Weapon" && item.weaponType) meta += ` · ${item.weaponType}${item.subtype ? " · " + item.subtype : ""}${item.damage ? " · " + item.damage : ""}`;
    else if (item.category === "Armor") meta += ` · ${item.armorClass || "Light"}${item.dsBonus != null ? " · +" + item.dsBonus + " DS" : ""}`;
    const head = el("div", "recipe-head");
    head.innerHTML = `<span class="recipe-name">${item.name}${item.custom ? ' <span class="recipe-custom">custom</span>' : ""}</span><span class="recipe-meta">${meta}</span>`;
    card.appendChild(head);
    card.appendChild(el("div", "recipe-mats", `🔩 ${fmtRecipeNeed(r)}`));
    card.appendChild(el("div", "recipe-check", `🎲 ${ci.name || "Craft"} check d20${PC.fmtMod(ci.mod)} vs DC ${ci.dc}` + (ci.prof ? ' <span class="rc-ok">✓ proficient</span>' : ' <span class="craft-dt">untrained</span>')));
    const btns = el("div", "recipe-btns");
    const craft = el("button", "btn small primary", "🔨 Craft");
    craft.disabled = miss.length > 0;
    craft.title = miss.length ? `Need ${miss.join(", ")}` : `Roll ${ci.name || "craft"} (d20${PC.fmtMod(ci.mod)}) vs DC ${ci.dc}`;
    craft.onclick = () => craftItem(item);
    btns.appendChild(craft);
    if (opts.onForget) {
      const forget = el("button", "btn small ghost", "✕ Forget");
      forget.title = "Delete this custom recipe";
      forget.onclick = opts.onForget;
      btns.appendChild(forget);
    }
    card.appendChild(btns);
    return card;
  }

  function buildCraftingTab() {
    const root = el("div");

    // ---- intro ----
    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "🔨 Crafting Workshop"));
    intro.appendChild(el("p", "hint", "A <b>downtime</b> activity (never a combat action). <b>Weapons &amp; armor are built from components</b> (blades, barrels, plating…), which you craft from raw <b>salvage</b> — the materials set each component's <b>grade</b> (Crude → Masterwork). Better components make better gear. Crafting rolls a <b>skill check</b> — d20 + the craft skill's modifier vs a <b>DC by rarity</b> (Common 10 · Uncommon 13 · Rare 16 · Very Rare 20); <b>success</b> spends the ingredients, <b>failure wastes half</b> (rounded up)."));
    root.appendChild(intro);

    // ---- salvage materials + components stock ----
    const mats = ownedMaterials();
    const comps = ownedComponents();
    const mp = el("div", "panel");
    mp.appendChild(el("div", "section-label", "Salvage Materials"));
    if (!mats.length) mp.appendChild(el("div", "muted", "No raw materials yet. Salvage an item on the Inventory tab, or add some from the catalog (Salvage category)."));
    else {
      const grid = el("div", "salvage-grid");
      mats.forEach((m) => grid.appendChild(materialChip(m.name, m.qty, m.tier)));
      mp.appendChild(grid);
    }
    mp.appendChild(el("div", "section-label", "Components on hand"));
    if (!comps.length) mp.appendChild(el("div", "muted", "No components yet. Craft parts below, salvage gear, or find them as loot."));
    else {
      const grid = el("div", "salvage-grid");
      comps.forEach((c) => grid.appendChild(componentChip(c.part, c.quality, c.qty)));
      mp.appendChild(grid);
    }
    root.appendChild(mp);

    // ---- craft components (raw → parts) ----
    root.appendChild(buildComponentsPanel());

    // ---- known recipes, grouped by item type (collapsed until a type is opened) ----
    root.appendChild(buildKnownRecipes());

    // ---- learn a recipe (discovery / GM grant) ----
    root.appendChild(buildLearnPanel());

    // ---- create custom item ----
    root.appendChild(buildCustomBuilder());
    return root;
  }

  // A component chip (grade-colored) for the on-hand stock display.
  function componentChip(part, q, qty) {
    const chip = el("div", "salvage-chip comp-chip q" + q);
    chip.title = PC.itemDesc(PC.componentName(part, q));
    chip.innerHTML = `<span class="sv-grade">${PC.qualityName(q)}</span><span class="sv-name">${part}</span><span class="sv-qty">×${qty}</span>`;
    return chip;
  }

  // Craft a single component (raw salvage → a graded part). A downtime skill check like any craft.
  function craftComponent(part, q) {
    const recipe = PC.componentRecipe(part, q);
    if (!recipe) { App.toast("Unknown component."); return; }
    const name = PC.componentName(part, q);
    const miss = recipe.filter((c) => ownedMaterial(c.mat) < c.qty).map((c) => `${c.qty - ownedMaterial(c.mat)}× ${c.mat}`);
    if (miss.length) { App.toast(`Missing: ${miss.join(", ")}.`); return; }
    const compItem = { name: name, category: "Component", part: part, quality: q, rarity: PC.qualityRarity(q) };
    const ci = craftCheckInfo(compItem);
    const mode = ci.attr && (isDisadv(ci.attr) || flawDisadvAttr(ci.attr)) ? "dis" : "normal";
    const roll = PC.rollCheck(ci.mod, mode);
    const tag = `${ci.name || "Craft"} check d20${PC.fmtMod(ci.mod)} = ${roll.total} vs DC ${ci.dc}`;
    if (roll.total >= ci.dc) {
      recipe.forEach((c) => spendMaterial(c.mat, c.qty));
      addMaterial(name, 1);
      announce(roll.total, `Crafted ${name} — ${tag} ✓ (used ${fmtMats(recipe)}).`);
      App.toast(`Crafted ${name}!`);
    } else {
      const lost = recipe.map((c) => ({ mat: c.mat, qty: Math.ceil(c.qty / 2) })).filter((c) => c.qty > 0);
      lost.forEach((c) => spendMaterial(c.mat, c.qty));
      announce(roll.total, `Craft failed: ${name} — ${tag} ✗. Lost ${fmtMats(lost)} (half).`);
      App.toast(`Craft failed: ${roll.total} vs DC ${ci.dc}.`);
    }
    save(); refresh();
  }

  // "Craft Components" — a collapsible workbench: for each part, craft it at any grade you can afford.
  function buildComponentsPanel() {
    const panel = el("div", "panel");
    const head = el("div", "section-label collapse-head", `⚙ Craft Components ${compOpen ? "▲" : "▼"}`);
    head.style.cursor = "pointer";
    head.onclick = () => { compOpen = !compOpen; refresh(); };
    panel.appendChild(head);
    if (!compOpen) { panel.appendChild(el("p", "hint", "Turn raw salvage into parts. Higher grades cost exotic materials — and make better weapons & armor.")); return panel; }

    panel.appendChild(el("p", "hint", "Each grade is a downtime skill check (DC by grade: Crude 10 · Standard 13 · Fine 16 · Masterwork 20). The materials you spend set the grade."));
    const grid = el("div", "comp-build-grid");
    PC.COMPONENTS.forEach((def) => {
      const card = el("div", "comp-card");
      card.appendChild(el("div", "comp-card-name", `${def.part} <span class="comp-role">${def.role}</span>`));
      const btns = el("div", "comp-grade-btns");
      for (let q = 1; q <= 4; q++) {
        const recipe = PC.componentRecipe(def.part, q);
        const miss = recipe.filter((c) => ownedMaterial(c.mat) < c.qty);
        const b = el("button", "btn small comp-grade q" + q, PC.qualityName(q));
        b.disabled = miss.length > 0;
        b.title = `${PC.qualityName(q)} ${def.part} — needs ${fmtMats(recipe)} (DC ${craftDC({ rarity: PC.qualityRarity(q) })})`;
        b.onclick = () => craftComponent(def.part, q);
        btns.appendChild(b);
      }
      card.appendChild(btns);
      grid.appendChild(card);
    });
    panel.appendChild(grid);
    return panel;
  }

  // Known Recipes — a list of item TYPES; open a type to reveal the recipes you know in it. A switch
  // filters every group down to what you can craft right now, and a search does a flat cross-type find.
  function buildKnownRecipes() {
    const CATS = ["Weapon", "Armor", "Consumable", "Tool", "Misc"];
    // All known recipe entries (custom designs + known catalog items), each with its category.
    // Components are excluded — they're crafted from the Craft Components panel, not "known recipes".
    const entries = customItems().slice()
      .concat(knownRecipeNames().map((n) => (PC.ITEMS || []).find((it) => it.name === n)).filter(Boolean))
      .filter((it) => it.category !== "Component");
    const canCraft = (it) => { const m = missingComponents(it); return m && m.length === 0; };
    const q = craftSearchQ.trim().toLowerCase();
    const matchQ = (it) => !q || it.name.toLowerCase().indexOf(q) > -1 || (it.category && it.category.toLowerCase().indexOf(q) > -1) || (it.weaponType && it.weaponType.toLowerCase().indexOf(q) > -1);
    const passFilters = (it) => matchQ(it) && (!craftOnlyCraftable || canCraft(it));

    const kp = el("div", "panel");
    kp.appendChild(el("div", "section-label", "Known Recipes"));

    // Top controls: craftable-only switch + a cross-type search.
    const controls = el("div", "craft-controls");
    const sw = el("label", "switch");
    const cb = el("input"); cb.type = "checkbox"; cb.checked = craftOnlyCraftable;
    cb.onchange = () => { craftOnlyCraftable = cb.checked; refresh(); };
    sw.appendChild(cb); sw.appendChild(el("span", "switch-track")); sw.appendChild(el("span", "switch-label", "Only show what I can craft now"));
    controls.appendChild(sw);
    const search = el("input"); search.type = "text"; search.placeholder = "Search all types…"; search.value = craftSearchQ; search.className = "inv-name craft-search";
    search.oninput = () => { craftSearchQ = search.value; refresh(); };
    controls.appendChild(search);
    kp.appendChild(controls);

    if (!entries.length) { kp.appendChild(el("div", "muted", "You don't know any recipes yet — salvage an item, learn one below, or design a custom item.")); return kp; }

    // When searching, skip the accordion and show a flat filtered grid across every type.
    if (q) {
      const hits = entries.filter(passFilters).sort((a, b) => a.name.localeCompare(b.name));
      if (!hits.length) { kp.appendChild(el("div", "muted", "No known recipes match — try another search or clear the filter.")); return kp; }
      const grid = el("div", "recipe-grid");
      hits.slice(0, 120).forEach((it) => { const card = recipeCard(it, it.custom ? { onForget: () => forgetCustom(it) } : null); if (card) grid.appendChild(card); });
      kp.appendChild(grid);
      if (hits.length > 120) kp.appendChild(el("div", "muted", `Showing 120 of ${hits.length} — narrow your search.`));
      return kp;
    }

    // Otherwise: one collapsible row per item type, showing counts; open a type to see its recipes.
    const otherCats = Array.from(new Set(entries.map((it) => it.category))).filter((c) => CATS.indexOf(c) === -1);
    let anyShown = false;
    CATS.concat(otherCats).forEach((cat) => {
      const inCat = entries.filter((it) => it.category === cat);
      if (!inCat.length) return;
      const visible = inCat.filter(passFilters);
      anyShown = anyShown || visible.length > 0;
      const craftableCount = inCat.filter(canCraft).length;
      const open = !!craftCatOpen[cat];
      const row = el("div", "type-group");
      const head = el("div", "type-head");
      head.innerHTML = `<span class="type-caret">${open ? "▾" : "▸"}</span><span class="type-name">${cat}s</span>` +
        `<span class="type-count">${craftOnlyCraftable ? `${visible.length} craftable` : `${inCat.length} known · ${craftableCount} craftable now`}</span>`;
      head.onclick = () => { craftCatOpen[cat] = !open; refresh(); };
      row.appendChild(head);
      if (open) {
        if (!visible.length) row.appendChild(el("div", "muted type-empty", craftOnlyCraftable ? "Nothing here is craftable right now — salvage or gather materials." : "No recipes match."));
        else {
          const grid = el("div", "recipe-grid");
          visible.sort((a, b) => a.name.localeCompare(b.name)).forEach((it) => {
            const card = recipeCard(it, it.custom ? { onForget: () => forgetCustom(it) } : null);
            if (card) grid.appendChild(card);
          });
          row.appendChild(grid);
        }
      }
      kp.appendChild(row);
    });
    if (craftOnlyCraftable && !anyShown) kp.appendChild(el("div", "muted", "No known recipe is craftable right now — gather more materials, or turn off the switch to see everything you know."));
    return kp;
  }

  // "Learn a Recipe" — a collapsible browser of craftable catalog items you don't yet know.
  function buildLearnPanel() {
    const panel = el("div", "panel");
    const head = el("div", "section-label collapse-head", `📖 Learn a Recipe (discovery / GM) ${learnOpen ? "▲" : "▼"}`);
    head.style.cursor = "pointer";
    head.onclick = () => { learnOpen = !learnOpen; refresh(); };
    panel.appendChild(head);
    if (!learnOpen) { panel.appendChild(el("p", "hint", "Salvaging an item teaches its recipe automatically. Expand to grant a recipe directly (a found schematic, a mentor, a GM ruling).")); return panel; }

    panel.appendChild(el("p", "hint", "Add a recipe to your known list without salvaging — for schematics you find or recipes the GM grants."));
    const searchRow = el("div", "inv-form");
    const search = el("input"); search.type = "text"; search.placeholder = "Search craftable items to learn…"; search.value = learnSearchQ; search.className = "inv-name";
    searchRow.appendChild(search);
    panel.appendChild(searchRow);
    const results = el("div", "catalog-results");
    panel.appendChild(results);
    function render() {
      const q = learnSearchQ.trim().toLowerCase();
      results.innerHTML = "";
      if (!q) { results.appendChild(el("div", "muted", "Type to search.")); return; }
      let matches = (PC.ITEMS || []).filter((it) => it.category !== "Component" && recipeOf(it) && knownRecipeNames().indexOf(it.name) === -1 &&
        (it.name.toLowerCase().indexOf(q) > -1 || (it.weaponType && it.weaponType.toLowerCase().indexOf(q) > -1)));
      if (!matches.length) { results.appendChild(el("div", "muted", "No unknown craftable items match.")); return; }
      matches.slice(0, 40).forEach((it) => {
        const row = el("div", "catalog-row");
        const ci = craftCheckInfo(it);
        row.innerHTML = `<div class="cat-info"><span class="cat-name">${it.name}</span><span class="cat-meta">${it.category}${it.rarity && it.rarity !== "Common" ? " · " + it.rarity : ""} · 🎲 ${ci.name || "?"} DC ${ci.dc}</span></div>`;
        const learn = el("button", "btn small primary", "📖 Learn");
        learn.onclick = () => { if (learnRecipe(it.name)) { logLine(`📖 Learned to craft ${it.name}.`); App.toast(`Learned: ${it.name}.`); save(); refresh(); } };
        row.appendChild(learn);
        results.appendChild(row);
      });
      if (matches.length > 40) results.appendChild(el("div", "muted", `Showing 40 of ${matches.length} — refine.`));
    }
    search.oninput = () => { learnSearchQ = search.value; render(); };
    render();
    return panel;
  }

  // The component slots for the current weapon/armor build (from its template), or [] .
  function formSlots(f) {
    if (f.type === "Weapon") { const t = PC.weaponTemplate(f.weaponType); return t ? t.slots : []; }
    if (f.type === "Armor") { const t = PC.armorTemplate(f.armorClass); return t ? t.slots : []; }
    return [];
  }
  // Build a full custom-item object from the live builder form. Weapons & armor are assembled from the
  // per-slot component GRADES you pick: the item's quality is the AVERAGE of those grades, which sets its
  // rarity and its (hard-capped) damage/DS off the template. Consumables/tools/misc use raw materials.
  function customItemFromForm() {
    const f = craftForm;
    const base = { name: (f.name || "").trim(), category: f.type, weight: Number(f.weight) || 1, custom: true };
    if ((f.desc || "").trim()) base.desc = f.desc.trim();
    if (f.type === "Weapon" || f.type === "Armor") {
      const slots = formSlots(f);
      if (!slots.length) return base; // no subtype chosen yet
      const grades = slots.map((p) => Number((f.slotGrade || {})[p]) || 1);
      const q = PC.qualityFromGrades(grades);
      base._quality = q;
      base.rarity = PC.qualityRarity(q);
      base.recipe = slots.map((p, i) => ({ mat: PC.componentName(p, grades[i]), qty: 1, component: true, part: p, quality: grades[i] }));
      const tmpl = f.type === "Weapon" ? PC.weaponTemplate(f.weaponType) : PC.armorTemplate(f.armorClass);
      if (f.type === "Weapon") {
        base.weaponType = f.weaponType; base.hands = tmpl.hands || 1;
        if (f.subtype) { base.subtype = f.subtype; base.damage = PC.subtypeDamage(PC.subtypeDie(f.weaponType, f.subtype), q); }
        else base.damage = PC.templateDamage(f.weaponType, q);
      } else { base.armorClass = f.armorClass; base.dsBonus = PC.templateDS(f.armorClass, q); }
      if (tmpl.weight) base.weight = Math.max(tmpl.weight[0], Math.min(tmpl.weight[1], base.weight || tmpl.weight[0]));
    } else if (f.type === "Consumable") {
      base.rarity = f.rarity;
      const eff = {};
      if ((f.hp || "").trim()) eff.hp = /d/i.test(f.hp) ? f.hp.trim() : (Number(f.hp) || 0);
      if ((f.kp || "").trim()) eff.kp = /d/i.test(f.kp) ? f.kp.trim() : (Number(f.kp) || 0);
      if (Object.keys(eff).length) {
        base.effect = eff;
        const bits = [];
        if (eff.hp != null) bits.push(`heal ${eff.hp} HP`);
        if (eff.kp != null) bits.push(`restore ${eff.kp} KP`);
        base.note = bits.join(", ");
      }
    } else { base.rarity = f.rarity; if (f.type === "Tool" && f.skill) base.skill = f.skill; }
    return base;
  }
  function saveCustomItem() {
    const f = craftForm;
    if (!(f.name || "").trim()) { App.toast("Name your custom item."); return; }
    if ((f.type === "Weapon" || f.type === "Armor") && !formSlots(f).length) { App.toast(`Pick a ${f.type === "Weapon" ? "weapon type" : "armor class"} first.`); return; }
    if (f.type === "Weapon" && !f.subtype) { App.toast("Pick a subtype first."); return; }
    const item = customItemFromForm();
    if (!recipeOf(item)) { App.toast("This can't be made a recipe (check the type)."); return; }
    customItems().push(item);
    const statBit = item.category === "Weapon" ? ` (${item.damage})` : item.category === "Armor" ? ` (+${item.dsBonus} DS)` : "";
    logLine(`✎ Designed custom ${item.rarity} ${item.category.toLowerCase()}: ${item.name}${statBit} — needs ${fmtMats(recipeOf(item))}.`);
    App.toast(`Custom recipe saved: ${item.name}. Craft it under Known Recipes.`);
    craftForm = { name: "", type: f.type, rarity: "Common", weight: "", desc: "", weaponType: "", subtype: "", hands: "1", armorClass: "Light", hp: "", kp: "", skill: "", slotGrade: {} };
    save(); refresh();
  }
  function forgetCustom(item) {
    const list = customItems();
    const i = list.indexOf(item);
    if (i < 0) return;
    list.splice(i, 1);
    logLine(`Forgot custom recipe: ${item.name}.`);
    save(); refresh();
  }

  // "Create Custom Item" — a collapsible template-driven designer. Weapons & armor pick a subtype
  // template (fixed attribute, allowed weight band, damage/DS capped by grade) and a grade per
  // component slot; the item's quality is the average of those grades. Consumables/tools/misc are simple.
  function buildCustomBuilder() {
    const panel = el("div", "panel");
    const head = el("div", "section-label collapse-head", `✎ Create Custom Item ${customOpen ? "▲" : "▼"}`);
    head.style.cursor = "pointer";
    head.onclick = () => { customOpen = !customOpen; refresh(); };
    panel.appendChild(head);
    if (!customOpen) { panel.appendChild(el("p", "hint", "Design your own weapon, armor, consumable, tool, or gear within the balance rules. Weapons & armor are built from component slots — the parts' grades set the item's power, hard-capped by its template.")); return panel; }

    const f = craftForm;
    const bind = (input, key) => { input.oninput = () => { f[key] = input.value; updatePreview(); }; };
    const form = el("div", "custom-form");

    // Step 1: Type. (First type, then subtype below.)
    const nameI = el("input"); nameI.type = "text"; nameI.placeholder = "Item name"; nameI.value = f.name; bind(nameI, "name");
    const typeS = el("select");
    ["Weapon", "Armor", "Consumable", "Tool", "Misc"].forEach((c) => { const o = el("option", null, c); o.value = c; if (c === f.type) o.selected = true; typeS.appendChild(o); });
    typeS.onchange = () => { f.type = typeS.value; refresh(); };
    form.appendChild(labeled("Name", nameI));
    form.appendChild(labeled("Item Category", typeS));

    const isComplex = f.type === "Weapon" || f.type === "Armor";
    // After a Weapon/Armor category, choose the specific kind: the weapon type, or the armor class.
    if (f.type === "Weapon") {
      const wtypeS = el("select");
      wtypeS.innerHTML = '<option value="">— choose weapon type —</option>' +
        Object.keys(PC.WEAPON_TEMPLATES).map((n) => `<option value="${n}" ${f.weaponType === n ? "selected" : ""}>${n} (${PC.WEAPON_TEMPLATES[n].attr})</option>`).join("");
      wtypeS.onchange = () => { f.weaponType = wtypeS.value; f.subtype = ""; f.slotGrade = {}; refresh(); };
      form.appendChild(labeled("Weapon Type", wtypeS));
      // Third level: the subtype (only after a weapon type is chosen).
      if (f.weaponType) {
        const subS = el("select");
        subS.innerHTML = '<option value="">— choose subtype —</option>' +
          PC.weaponSubtypes(f.weaponType).map((s) => `<option value="${s.name}" ${f.subtype === s.name ? "selected" : ""}>${s.name} (base ${s.die})</option>`).join("");
        subS.onchange = () => { f.subtype = subS.value; refresh(); };
        form.appendChild(labeled("Subtype", subS));
      }
    } else if (f.type === "Armor") {
      const clsS = el("select");
      clsS.innerHTML = '<option value="">— choose armor type —</option>' + ["Light", "Medium", "Heavy"].map((c) => `<option value="${c}" ${f.armorClass === c ? "selected" : ""}>${c} armor</option>`).join("");
      clsS.onchange = () => { f.armorClass = clsS.value; f.slotGrade = {}; refresh(); };
      form.appendChild(labeled("Armor Type", clsS));
    }

    // Rarity is player-set only for simple items; weapons/armor derive it from component grades.
    if (!isComplex) {
      const rarS = el("select");
      ["Common", "Uncommon", "Rare", "Very Rare"].forEach((c) => { const o = el("option", null, c); o.value = c; if (c === f.rarity) o.selected = true; rarS.appendChild(o); });
      rarS.onchange = () => { f.rarity = rarS.value; updatePreview(); };
      form.appendChild(labeled("Rarity", rarS));
    }
    const wtI = el("input"); wtI.type = "number"; wtI.min = 0; wtI.step = "0.5"; wtI.placeholder = "lb"; wtI.value = f.weight; bind(wtI, "weight");
    form.appendChild(labeled("Weight (lb)", wtI));

    // Remaining type-specific fields (weapon/armor subtype is handled above).
    if (f.type === "Consumable") {
      const hpI = el("input"); hpI.type = "text"; hpI.placeholder = "HP (e.g. 2d6 or 10)"; hpI.value = f.hp; bind(hpI, "hp");
      const kpI = el("input"); kpI.type = "text"; kpI.placeholder = "KP (e.g. 1d6 or 5)"; kpI.value = f.kp; bind(kpI, "kp");
      form.appendChild(labeled("Heals HP", hpI));
      form.appendChild(labeled("Restores KP", kpI));
    } else if (f.type === "Tool") {
      const skS = el("select");
      skS.innerHTML = '<option value="">— aids no skill —</option>' + (PC.SKILLS || []).map((s) => `<option value="${s.name}" ${f.skill === s.name ? "selected" : ""}>${s.name}</option>`).join("");
      skS.onchange = () => { f.skill = skS.value; };
      form.appendChild(labeled("Aids skill", skS));
    }

    // Description (full width)
    const descI = el("input"); descI.type = "text"; descI.placeholder = "Flavor description (optional)"; descI.value = f.desc; bind(descI, "desc");
    const descL = labeled("Description", descI); descL.classList.add("custom-full");
    form.appendChild(descL);
    panel.appendChild(form);

    // Component-slot grade pickers (weapons & armor only) + template rule readout.
    const slots = formSlots(f);
    if (isComplex && slots.length) {
      const tmpl = f.type === "Weapon" ? PC.weaponTemplate(f.weaponType) : PC.armorTemplate(f.armorClass);
      const rules = el("div", "tmpl-rules");
      const subDie = f.type === "Weapon" && f.subtype ? PC.subtypeDie(f.weaponType, f.subtype) : null;
      const capBits = [1, 2, 3, 4].map((q) => `${PC.qualityName(q)} ${f.type === "Weapon" ? (subDie ? PC.subtypeDamage(subDie, q) : PC.templateDamage(f.weaponType, q)) : "+" + PC.templateDS(f.armorClass, q) + " DS"}`).join(" · ");
      const head = f.type === "Weapon"
        ? `${f.weaponType}${f.subtype ? " · " + f.subtype : ""} · ${tmpl.attr} · ${tmpl.hands === 2 ? "two-handed" : "one-handed"}`
        : `${f.armorClass} armor`;
      rules.innerHTML = `<b>Template:</b> ${head} · weight ${tmpl.weight[0]}–${tmpl.weight[1]} lb<br><b>By grade:</b> ${capBits}${f.type === "Weapon" && !f.subtype ? ' <span class="craft-dt">— pick a subtype above for its damage</span>' : ""}`;
      panel.appendChild(rules);
      const slotWrap = el("div", "slot-grid");
      slots.forEach((part) => {
        const cur = Number((f.slotGrade || {})[part]) || 1;
        const sel = el("select");
        sel.innerHTML = [1, 2, 3, 4].map((q) => {
          const have = ownedMaterial(PC.componentName(part, q));
          return `<option value="${q}" ${q === cur ? "selected" : ""}>${PC.qualityName(q)}${have ? ` (have ${have})` : ""}</option>`;
        }).join("");
        sel.onchange = () => { f.slotGrade[part] = sel.value; updatePreview(); };
        slotWrap.appendChild(labeled(part, sel));
      });
      panel.appendChild(slotWrap);
    } else if (isComplex) {
      panel.appendChild(el("p", "hint", `Pick a ${f.type === "Weapon" ? "weapon type" : "armor class"} to see its component slots and balance limits.`));
    }

    // Live preview + save
    const preview = el("div", "custom-preview");
    panel.appendChild(preview);
    function updatePreview() {
      const item = customItemFromForm();
      const r = recipeOf(item);
      if (!r || !r.length) { preview.innerHTML = '<span class="craft-dt">Choose a type (and subtype) to see the recipe.</span>'; return; }
      const ci = craftCheckInfo(item);
      let statLine = "";
      if (item.category === "Weapon") statLine = `<b>${PC.qualityName(item._quality)} ${item.rarity}</b> · ${item.subtype ? item.subtype + " · " : ""}${item.damage || "?"} · ${item.hands === 2 ? "two-handed" : "one-handed"} · `;
      else if (item.category === "Armor") statLine = `<b>${PC.qualityName(item._quality)} ${item.rarity}</b> · +${item.dsBonus} Defense · `;
      preview.innerHTML = `${statLine}<b>Recipe:</b> ${fmtMats(r)} &nbsp;·&nbsp; 🎲 ${ci.name || "?"} d20${PC.fmtMod(ci.mod)} vs DC ${ci.dc}`;
    }
    updatePreview();
    const saveBtn = el("button", "btn small primary", "✎ Save as Custom Recipe");
    saveBtn.style.marginTop = "8px";
    saveBtn.onclick = saveCustomItem;
    panel.appendChild(saveBtn);
    return panel;
  }

  /* ---------- Pets tab ---------- */
  // Simple NPC companions the player controls (animals, robots, monsters, demons…). Hand-authored for
  // now; the data model is ready for a future bestiary to drop pre-statted creatures straight in.
  const PET_KINDS = ["Animal", "Robot", "Monster", "Demon", "Construct", "Spirit", "Undead", "Other"];
  const PET_EMOJI = { Animal: "🐾", Robot: "🤖", Monster: "👾", Demon: "😈", Construct: "🗿", Spirit: "👻", Undead: "💀", Other: "⭐" };

  function petList() { if (!Array.isArray(rec.pets)) rec.pets = []; return rec.pets; }
  function addPet(name, kind) {
    const k = kind || "Animal";
    petList().push({
      id: "pet_" + Date.now().toString(36) + "_" + (name || "pet").replace(/\W+/g, "").slice(0, 6),
      name: name || "New Companion", kind: k, emoji: PET_EMOJI[k] || "🐾", species: "",
      hp: 10, hpMax: 10, defense: 12, speed: "30 ft", initMod: 0,
      attacks: [], traits: [], notes: "", active: true,
    });
    logLine(`🐾 Gained a companion: ${name || "New Companion"}.`);
    App.toast(`Added ${name || "companion"}.`);
    save(); refresh();
  }
  function removePet(id) {
    const i = petList().findIndex((p) => p.id === id);
    if (i < 0) return;
    const p = petList()[i];
    petList().splice(i, 1);
    if (expandedPet === id) expandedPet = null;
    logLine(`Dismissed companion: ${p.name}.`);
    save(); refresh();
  }
  function setPetField(p, field, value) { p[field] = value; save(); refresh(); }
  function petHP(p, delta) {
    const max = Number(p.hpMax) || 0;
    const before = Number(p.hp) || 0;
    p.hp = Math.max(0, Math.min(max, before + delta));
    const d = p.hp - before;
    logLine(`${p.emoji || "🐾"} ${p.name}: ${d >= 0 ? "+" : ""}${d} HP → ${p.hp}/${max}${p.hp <= 0 ? " (down!)" : ""}.`);
    save(); refresh();
  }
  function petInitiative(p) {
    const mod = Number(p.initMod) || 0;
    const r = PC.rollCheck(mod, "normal");
    announce(r.total, `${p.emoji || "🐾"} ${p.name} initiative: d20${PC.fmtMod(mod)} = ${r.total}`);
    save(); refresh();
  }
  function petAttackRoll(p, atk) {
    const mod = Number(atk.toHit) || 0;
    const r = PC.rollCheck(mod, "normal");
    announce(r.total, `${p.emoji || "🐾"} ${p.name} — ${atk.name || "attack"}: d20${PC.fmtMod(mod)} = ${r.total} (vs Defense Score)`);
    save(); refresh();
  }
  function petDamageRoll(p, atk) {
    if (!atk.damage) { App.toast('Set a damage die (e.g. "1d6").'); return; }
    const dr = PC.rollDiceExpr(atk.damage);
    if (!dr) { App.toast('Damage die format like "1d6" or "2d6".'); return; }
    announce(dr.total, `${p.emoji || "🐾"} ${p.name} — ${atk.name || "attack"} damage: ${atk.damage} = [${dr.rolls.join(",")}] → ${dr.total}`);
    save(); refresh();
  }
  function addPetAttack(p) { (p.attacks = p.attacks || []).push({ name: "Bite", toHit: 0, damage: "1d6", note: "" }); save(); refresh(); }
  function removePetAttack(p, i) { p.attacks.splice(i, 1); save(); refresh(); }
  function addPetTrait(p) { (p.traits = p.traits || []).push(""); save(); refresh(); }
  function removePetTrait(p, i) { p.traits.splice(i, 1); save(); refresh(); }

  // ── Otherkin tab ─────────────────────────────────────────────────────────
  // Revealed only at Soul Level 15+ (same gate as the Heart chakra). The Otherkin — the Soul Creature
  // that has lived within since creation — awakens here. The mechanical system is still to be written;
  // this tab is the placeholder that will host it, kept in step with the Heart chakra reveal note.
  // Boost summary line for an Otherkin (attribute + pool), e.g. "+3 AGI · +10 Body (HP)".
  function otherkinBoostText(o) {
    const parts = [];
    Object.keys(o.boosts || {}).forEach((k) => parts.push(`+${o.boosts[k]} ${k}`));
    if (o.pool && o.pool.body) parts.push(`+${o.pool.body} Body (HP)`);
    if (o.pool && o.pool.mind) parts.push(`+${o.pool.mind} Mind (KP)`);
    return parts.join(" · ");
  }

  function buildOtherkinTab() {
    const root = el("div");
    const chosen = myOtherkin();
    return chosen ? buildOtherkinSheet(root, chosen) : buildOtherkinPicker(root);
  }

  // The one-time chooser, shown once the Heart awakens (level 15) until an Otherkin is selected.
  // Not-yet-chosen state. Selection now lives on the LEVEL UP screen (the Heart-chakra reveal), so this tab
  // just announces the awakening and sends the player there to choose.
  function buildOtherkinPicker(root) {
    const intro = el("div", "panel otherkin-panel");
    intro.appendChild(el("div", "section-label", "♥ The Otherkin Awaits"));
    intro.appendChild(el("div", "otherkin-note ok-awaken",
      `<b class="ok-hl">Your Heart chakra has opened.</b> The creature that has lived in your soul since creation is ready to awaken — but you haven't <b>chosen your Otherkin</b> yet. Open the <b>Level Up</b> screen to see each Soul Creature's full breakdown and make your <b>permanent</b> choice.`));
    const btn = el("button", "btn primary small", "⭐ Open Level Up to choose");
    btn.onclick = () => App.openLevelUp(rec.id);
    intro.appendChild(btn);
    root.appendChild(intro);
    return root;
  }

  // The chosen-Otherkin sheet: identity + boost, Heart status, signature, and the six tails.
  function buildOtherkinSheet(root, o) {
    const head = el("div", "panel otherkin-panel");
    head.appendChild(el("div", "section-label", "♥ Your Otherkin"));
    const idl = el("div", "ok-identity");
    idl.innerHTML =
      `<div class="ok-heart" style="--cc:${PC.HEART_CHAKRA.color}">♥</div>` +
      `<div class="ok-id-txt"><div class="ok-name">${o.emoji || "♥"} ${o.name}</div><div class="ok-kin">${o.kinetic}${o.attr ? " · " + o.attr : ""}</div><div class="ok-theme-line">${o.theme}</div></div>`;
    head.appendChild(idl);
    head.appendChild(el("div", "ok-grants", `<span class="ok-pill boost">${otherkinBoostText(o)} — applied</span>`));
    const hh = chakraOf("HEART"), heff = PC.chakraEffect(hh);
    head.appendChild(el("div", "ok-heart-status" + (hh >= 4 ? " locked" : hh > 0 ? " hurt" : ""),
      hh >= 4 ? "♥ Heart chakra LOCKED — your Otherkin is dormant until you rest."
      : hh > 0 ? `♥ Heart chakra hurt (${heff.label}) — your Otherkin powers are weakened.`
      : "♥ Heart chakra healthy — your Soul Creature is at full power."));
    root.appendChild(head);

    root.appendChild(otherkinSignatureCard(o));

    const tp = el("div", "panel");
    tp.appendChild(el("div", "section-label", `${o.kinetic} — the tails`));
    tp.appendChild(el("p", "hint", "Auto-granted free as you level (no Technique Points), one every third level. They cost KP and are governed by the Heart chakra. Play them here or from the Combat tab."));
    const grid = el("div", "combat-grid");
    o.techniques.forEach((t) => grid.appendChild((rec.level || 0) >= t.level ? makeTechCard(t) : otherkinLockedCard(t)));
    tp.appendChild(grid);
    root.appendChild(tp);
    return root;
  }

  // A greyed placeholder card for a tail the character hasn't reached yet.
  function otherkinLockedCard(t) {
    const c = el("div", "tech-card otherkin-locked");
    c.innerHTML =
      `<div class="thead"><span class="tname">🔒 ${t.name}</span><span class="cost">${t.kp} KP</span></div>` +
      `<div class="tmeta">${t.kinetic} · ${t.tier} · <b>unlocks at Level ${t.level}</b></div>` +
      `<div class="teff">▸ ${t.effect}</div>`;
    return c;
  }

  // The signature ability card — current tier + effect, rest-gated uses (pips + Use button), and the tier ladder.
  function otherkinSignatureCard(o) {
    const sig = o.signature, tier = sigTier();
    const panel = el("div", "panel otherkin-sig");
    panel.appendChild(el("div", "section-label", `★ Signature — ${sig.name}`));
    panel.appendChild(el("p", "hint", sig.blurb));
    if (!tier) { panel.appendChild(el("div", "muted", "Not yet awakened.")); return panel; }
    const uses = sigUsesLeft(), max = sigMaxUses(), heartLocked = chakraOf("HEART") >= 4;
    const tr = sigTransform(), shifted = !!play.transformed;
    const cur = el("div", "ok-sig-current");
    cur.innerHTML = `<div class="ok-sig-tier">Tier ${tier.tier} of 6</div><div class="ok-sig-eff">${tier.effect}</div>`;
    panel.appendChild(cur);
    // Transform signatures show a live "active" banner with the current bonuses; a locked Heart suppresses them.
    const lab = tr ? transformLabels() : null;
    if (tr && shifted) {
      const bits = [];
      const amt = transformAmount(tier.tier);
      if (tr.attrs && tr.attrs.length && amt) bits.push(`+${amt} ${tr.attrs.length >= 6 ? "all attributes" : tr.attrs.join("/")}`);
      const dm = transformDsMult(tier.tier);
      if (dm !== 1) bits.push(`×${dm} Defense`);
      const ds = transformDsBonus(tier.tier);
      if (ds) bits.push(`+${ds} Defense`);
      const mm = transformMoveMult(tier.tier);
      if (mm) bits.push(`×${mm.mult} ${mm.fly ? "flight" : "movement"}`);
      const claw = transformClawDie(tier.tier);
      if (claw) bits.push(`claws (${claw})`);
      const nats = activeNaturalAttacks();
      if (nats.length) bits.push(nats.map((n) => n.name.toLowerCase()).join(" / "));
      const em = o.emoji || "⭐";
      panel.appendChild(el("div", "ok-shift-banner" + (heartLocked ? " suppressed" : ""),
        heartLocked ? `${em} ${lab.suppressed}` : `${em} ${lab.state} — ${bits.join(" · ")}.`));
    }
    const row = el("div", "ok-sig-uses");
    row.appendChild(el("span", "ok-sig-usenum", `${uses} / ${max} uses`));
    const pips = el("div", "pips");
    for (let i = 0; i < max; i++) pips.appendChild(el("span", "pip lg" + (i < uses ? " filled" : "")));
    row.appendChild(pips);
    panel.appendChild(row);
    // Transform: toggle on/off (turning it off is free); otherwise a plain "Use".
    const btn = el("button", "btn primary small", tr ? (shifted ? lab.off : lab.on) : `Use ${sig.name}`);
    btn.disabled = shifted ? false : (heartLocked || uses <= 0);
    btn.title = shifted ? "End it" : heartLocked ? "Heart chakra locked — Otherkin dormant" : uses <= 0 ? `No uses left — take a ${sig.rest} rest` : "";
    btn.onclick = () => useSignature();
    const brow = el("div", "ok-sig-btnrow");
    brow.appendChild(btn);
    brow.appendChild(el("div", "ok-sig-rest", `Refreshes on a <b>${sig.rest} rest</b> · uses scale with tier`));
    panel.appendChild(brow);
    const ladder = el("div", "ok-sig-ladder");
    sig.tiers.forEach((tt) => {
      const on = (rec.level || 0) >= tt.level;
      const li = el("div", "ok-sig-step" + (on ? " on" : "") + (tier && tt.tier === tier.tier ? " cur" : ""));
      li.innerHTML = `<span class="ok-sig-lvl">${on ? "✓" : "L" + tt.level}</span><span class="ok-sig-t">Tier ${tt.tier} · ${tt.uses} use${tt.uses > 1 ? "s" : ""}</span><span class="ok-sig-d">${tt.effect}</span>`;
      ladder.appendChild(li);
    });
    panel.appendChild(ladder);
    return panel;
  }

  function buildPetsTab() {
    const root = el("div");
    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "🐾 Pets & Companions"));
    intro.appendChild(el("p", "hint", "Simple NPC companions you control — animals, robots, small monsters, demons, and more. Add them by hand for now (the <b>bestiary is coming</b>); each gets a mini stat block — HP, Defense, Speed, attacks & traits — with tap-to-roll <b>initiative</b>, <b>attacks</b>, and <b>damage</b> that post to your roll log."));
    const form = el("div", "inv-form");
    const nameI = el("input"); nameI.type = "text"; nameI.placeholder = "Companion name"; nameI.className = "inv-name";
    const kindS = el("select"); kindS.className = "inv-cat";
    PET_KINDS.forEach((k) => { const o = el("option", null, `${PET_EMOJI[k]} ${k}`); o.value = k; kindS.appendChild(o); });
    const addBtn = el("button", "btn small primary", "+ Add Pet");
    addBtn.onclick = () => { if (!nameI.value.trim()) { App.toast("Name your companion."); return; } addPet(nameI.value.trim(), kindS.value); };
    form.appendChild(nameI); form.appendChild(kindS); form.appendChild(addBtn);
    intro.appendChild(form);
    root.appendChild(intro);

    const pets = petList();
    if (!pets.length) root.appendChild(el("div", "muted", "No companions yet. Add one above — or wait for the bestiary to arrive."));
    else pets.forEach((p) => root.appendChild(petCard(p)));
    return root;
  }

  function petCard(p) {
    const open = expandedPet === p.id;
    const max = Number(p.hpMax) || 0, hp = Number(p.hp) || 0;
    const wrap = el("div", "panel pet-card" + (hp <= 0 ? " pet-down" : ""));

    // Header — emoji · name · kind/species (tap to expand the editor)
    const head = el("div", "pet-head");
    head.innerHTML = `<span class="pet-emoji">${p.emoji || "🐾"}</span><span class="pet-name">${p.name}${hp <= 0 ? ' <span class="pet-badge">down</span>' : ""}</span><span class="pet-kind">${p.kind}${p.species ? " · " + p.species : ""}</span><span class="pet-caret">${open ? "▲" : "▼"}</span>`;
    head.style.cursor = "pointer";
    head.onclick = () => { expandedPet = open ? null : p.id; refresh(); };
    wrap.appendChild(head);

    // HP bar + damage/heal
    const track = el("div", "bar-track"); const fill = el("div", "bar-fill hp"); fill.style.width = (max > 0 ? Math.min(100, hp / max * 100) : 0) + "%"; track.appendChild(fill);
    const hpHead = el("div", "poolbar-head"); hpHead.innerHTML = `<span>HP</span><span class="poolbar-num">${hp} / ${max}</span>`;
    wrap.appendChild(hpHead); wrap.appendChild(track);
    const hpCtl = el("div", "pet-hp-ctl");
    const amt = el("input"); amt.type = "number"; amt.min = "1"; amt.value = "1"; amt.className = "pet-amt"; amt.title = "amount";
    const dmg = el("button", "btn small", "− Damage"); dmg.onclick = () => petHP(p, -Math.abs(parseInt(amt.value, 10) || 1));
    const heal = el("button", "btn small", "+ Heal"); heal.onclick = () => petHP(p, Math.abs(parseInt(amt.value, 10) || 1));
    hpCtl.appendChild(amt); hpCtl.appendChild(dmg); hpCtl.appendChild(heal);
    wrap.appendChild(hpCtl);

    // Stat strip — Defense · Speed · Initiative roll
    const strip = el("div", "pet-stat-strip");
    strip.appendChild(petStat("Defense", p.defense));
    strip.appendChild(petStat("Speed", p.speed));
    const initBtn = el("button", "btn small", `🎯 Init ${PC.fmtMod(Number(p.initMod) || 0)}`);
    initBtn.onclick = () => petInitiative(p);
    strip.appendChild(initBtn);
    wrap.appendChild(strip);

    // Attacks — quick roll buttons
    const atks = p.attacks || [];
    if (atks.length) {
      const ag = el("div", "pet-atk-group");
      atks.forEach((atk) => {
        const row = el("div", "pet-atk");
        row.appendChild(el("span", "pet-atk-name", `${atk.name || "Attack"}${atk.note ? ` <span class="pet-atk-note">${atk.note}</span>` : ""}`));
        const ab = el("button", "btn small", `⚔ Hit ${PC.fmtMod(Number(atk.toHit) || 0)}`); ab.onclick = () => petAttackRoll(p, atk);
        const db = el("button", "btn small", `🎲 ${atk.damage || "dmg"}`); db.onclick = () => petDamageRoll(p, atk);
        row.appendChild(ab); row.appendChild(db);
        ag.appendChild(row);
      });
      wrap.appendChild(ag);
    }

    // Traits — read-only chips when collapsed
    if ((p.traits || []).filter((t) => t.trim()).length) {
      const tw = el("div", "pet-traits");
      p.traits.filter((t) => t.trim()).forEach((t) => tw.appendChild(el("span", "pet-trait", t)));
      wrap.appendChild(tw);
    }
    if (p.notes && !open) wrap.appendChild(el("div", "pet-notes", p.notes));

    // Editor (expanded)
    if (open) wrap.appendChild(petEditor(p));
    return wrap;
  }
  function petStat(label, val) {
    const s = el("div", "pet-stat");
    s.innerHTML = `<span class="pet-stat-label">${label}</span><span class="pet-stat-val">${val != null && val !== "" ? val : "—"}</span>`;
    return s;
  }

  function petEditor(p) {
    const ed = el("div", "pet-editor");
    ed.appendChild(el("div", "section-label", "Edit Companion"));

    // Meta + core stats
    const grid = el("div", "custom-form");
    const nameI = el("input"); nameI.type = "text"; nameI.value = p.name || ""; nameI.oninput = () => { p.name = nameI.value; save(); };
    grid.appendChild(labeled("Name", nameI));
    const kindS = el("select");
    kindS.innerHTML = PET_KINDS.map((k) => `<option value="${k}" ${p.kind === k ? "selected" : ""}>${k}</option>`).join("");
    kindS.onchange = () => { p.kind = kindS.value; if (!p._emojiSet) p.emoji = PET_EMOJI[kindS.value] || "🐾"; save(); refresh(); };
    grid.appendChild(labeled("Kind", kindS));
    const emojiI = el("input"); emojiI.type = "text"; emojiI.value = p.emoji || ""; emojiI.maxLength = 4; emojiI.oninput = () => { p.emoji = emojiI.value; p._emojiSet = true; save(); };
    grid.appendChild(labeled("Icon", emojiI));
    const specI = el("input"); specI.type = "text"; specI.placeholder = "e.g. Hawk, Guard Bot"; specI.value = p.species || ""; specI.oninput = () => { p.species = specI.value; save(); };
    grid.appendChild(labeled("Species / model", specI));
    const hpMaxI = el("input"); hpMaxI.type = "number"; hpMaxI.min = "1"; hpMaxI.value = p.hpMax || 0; hpMaxI.onchange = () => { p.hpMax = Math.max(1, parseInt(hpMaxI.value, 10) || 1); p.hp = Math.min(Number(p.hp) || 0, p.hpMax); save(); refresh(); };
    grid.appendChild(labeled("Max HP", hpMaxI));
    const defI = el("input"); defI.type = "number"; defI.value = p.defense != null ? p.defense : 12; defI.onchange = () => { p.defense = parseInt(defI.value, 10) || 0; save(); refresh(); };
    grid.appendChild(labeled("Defense Score", defI));
    const spdI = el("input"); spdI.type = "text"; spdI.placeholder = "30 ft"; spdI.value = p.speed || ""; spdI.oninput = () => { p.speed = spdI.value; save(); };
    grid.appendChild(labeled("Speed", spdI));
    const initI = el("input"); initI.type = "number"; initI.value = p.initMod || 0; initI.onchange = () => { p.initMod = parseInt(initI.value, 10) || 0; save(); refresh(); };
    grid.appendChild(labeled("Initiative mod", initI));
    ed.appendChild(grid);

    // Attacks editor
    ed.appendChild(el("div", "section-label", "Attacks"));
    (p.attacks || []).forEach((atk, i) => {
      const r = el("div", "pet-atk-edit");
      const n = el("input"); n.type = "text"; n.placeholder = "name"; n.value = atk.name || ""; n.className = "pet-atk-n"; n.oninput = () => { atk.name = n.value; save(); };
      const th = el("input"); th.type = "number"; th.placeholder = "+hit"; th.value = atk.toHit != null ? atk.toHit : 0; th.className = "pet-atk-th"; th.onchange = () => { atk.toHit = parseInt(th.value, 10) || 0; save(); refresh(); };
      const dm = el("input"); dm.type = "text"; dm.placeholder = "1d6"; dm.value = atk.damage || ""; dm.className = "pet-atk-dm"; dm.oninput = () => { atk.damage = dm.value; save(); };
      const nt = el("input"); nt.type = "text"; nt.placeholder = "note (e.g. reach, poison)"; nt.value = atk.note || ""; nt.className = "pet-atk-nt"; nt.oninput = () => { atk.note = nt.value; save(); };
      const rm = el("button", "btn small ghost", "✕"); rm.title = "Remove attack"; rm.onclick = () => removePetAttack(p, i);
      r.appendChild(n); r.appendChild(th); r.appendChild(dm); r.appendChild(nt); r.appendChild(rm);
      ed.appendChild(r);
    });
    const addA = el("button", "btn small", "+ Add attack"); addA.onclick = () => addPetAttack(p);
    ed.appendChild(addA);

    // Traits editor
    ed.appendChild(el("div", "section-label", "Traits & Abilities"));
    (p.traits || []).forEach((t, i) => {
      const r = el("div", "pet-trait-row");
      const ti = el("input"); ti.type = "text"; ti.placeholder = "e.g. Keen Senses — advantage on Perception"; ti.value = t; ti.oninput = () => { p.traits[i] = ti.value; save(); };
      const rm = el("button", "btn small ghost", "✕"); rm.onclick = () => removePetTrait(p, i);
      r.appendChild(ti); r.appendChild(rm);
      ed.appendChild(r);
    });
    const addT = el("button", "btn small", "+ Add trait"); addT.onclick = () => addPetTrait(p);
    ed.appendChild(addT);

    // Notes + remove
    ed.appendChild(el("div", "section-label", "Notes"));
    const notes = el("textarea", "pet-notes-edit"); notes.placeholder = "Anything else — origin, loyalty, GM notes…"; notes.value = p.notes || ""; notes.oninput = () => { p.notes = notes.value; save(); };
    ed.appendChild(notes);
    const del = el("button", "btn small ghost", "✕ Remove companion"); del.style.marginTop = "10px"; del.onclick = () => { if (confirm(`Remove ${p.name}?`)) removePet(p.id); };
    ed.appendChild(del);
    return ed;
  }

  /* ---------- Combat tab ---------- */
  function buildCombat() {
    const root = el("div");

    // vitals strip + quick buttons
    const vit = el("div", "panel");
    const strip = el("div", "combat-vitals");
    strip.appendChild(miniStat("HP", play.hp + " / " + maxHP(), "hp"));
    strip.appendChild(miniStat("KP", play.kp + " / " + maxKP(), "kp"));
    strip.appendChild(miniStat("Defense", defenseScore(), ""));
    strip.appendChild(miniStat("Prof", PC.fmtMod(PC.profBonus(rec.level)), ""));
    strip.appendChild(miniStat("Turn", play.turn, ""));
    vit.appendChild(strip);
    const quick = el("div", "combat-quick");
    const init = el("button", "btn small", "🎯 Roll Initiative");
    init.onclick = () => {
      const r = PC.rollCheck(adjMod("AGI"), isDisadv("AGI") ? "dis" : "normal");
      announce(r.total, `Initiative: d20${PC.fmtMod(adjMod("AGI"))} = ${r.total}`); save(); refresh();
    };
    const et = el("button", "btn small primary", `⏭ End Turn${activeUpkeep() ? " (−" + activeUpkeep() + " KP)" : ""}`);
    et.onclick = endTurn;
    quick.appendChild(init); quick.appendChild(et);
    vit.appendChild(quick);
    vit.appendChild(el("div", "section-label", "Speeds"));
    vit.appendChild(speedsRow());
    vit.appendChild(el("div", "section-label", "This Turn — tap to toggle"));
    vit.appendChild(econTracker());
    if (play.active.length) {
      const ae = el("div", "chips"); ae.style.marginTop = "12px";
      play.active.forEach((n) => {
        const t = PC.technique(n);
        const chip = el("div", "chip selected");
        chip.innerHTML = `${n} <span class="tag">−${t.upkeep || 0}/turn ✕</span>`;
        chip.title = "Click to end";
        chip.onclick = () => toggleSustained(t);
        ae.appendChild(chip);
      });
      vit.appendChild(ae);
    }
    root.appendChild(vit);

    // Conditions / status-effects tracker
    root.appendChild(conditionsPanel());

    // Applied-poison reminder — a coated weapon is armed until its next hit (or you wipe it off).
    if (play.weaponCoat) {
      const cat = PC.condition(play.weaponCoat.condition);
      const cp = el("div", "panel coat-banner");
      const row = el("div", "coat-row");
      row.appendChild(el("span", "coat-msg", `☠ <b>Weapon coated</b> — its next hit applies ${cat ? cat.emoji + " " + cat.name : play.weaponCoat.condition} to the target (GM).`));
      const x = el("button", "btn small", "Wipe off");
      x.onclick = () => { play.weaponCoat = null; logLine("☠ Wiped the coating off your weapon."); save(); refresh(); };
      row.appendChild(x);
      cp.appendChild(row);
      root.appendChild(cp);
    }

    // gather techniques by action economy (augments excluded — they rider onto weapons).
    // Fusion techniques the character has earned are folded in alongside base techniques.
    const known = knownTechniques().map((n) => PC.technique(n)).filter(Boolean).concat(knownFusionTechs()).concat(knownOtherkinTechs());
    const isAug = (t) => t.augment && t.augment.kind === "melee-damage";
    const byAction = (act) => known.filter((t) => !isAug(t) && t.action === act);
    const equipped = (rec.inventory || []).filter((it) => it.equipped && it.category === "Weapon");

    // Combat skills the character knows, grouped by action type (Passives handled separately below).
    const csAll = knownCombatSkills().map((n) => PC.combatSkill(n)).filter(Boolean);
    const csByAction = (act) => csAll.filter((c) => c.action === act);

    // A transformation's natural attacks (Tail Whip / Scratch / Bite / Blood Weapon), split by action slot.
    const nats = activeNaturalAttacks();
    const natsByAction = (act) => nats.filter((n) => n.action === act);

    // ⚡ Actions — equipped weapons + universal Unarmed Strike + Action natural attacks + Action techniques/skills
    const actionCards = [];
    equipped.forEach((it) => actionCards.push(weaponActionCard(it)));
    actionCards.push(unarmedStrikeCard()); // basic action anyone can take
    natsByAction("Action").forEach((na) => actionCards.push(naturalAttackCard(na)));
    byAction("Action").forEach((t) => actionCards.push(makeTechCard(t)));
    csByAction("Action").forEach((c) => actionCards.push(makeCombatSkillCard(c)));
    root.appendChild(actionGroup("actions", "⚡ Actions", actionCards));

    // ✦ Bonus Actions — Bonus natural attacks (Tail Whip / Scratch / Bite) + Bonus techniques + Bonus combat skills
    const bonusCards = [];
    natsByAction("Bonus Action").forEach((na) => bonusCards.push(naturalAttackCard(na)));
    byAction("Bonus Action").forEach((t) => bonusCards.push(makeTechCard(t)));
    csByAction("Bonus Action").forEach((c) => bonusCards.push(makeCombatSkillCard(c)));
    root.appendChild(actionGroup("bonus", "✦ Bonus Actions", bonusCards));

    // ↩ Reactions — universal Opportunity Attack + Reaction techniques + Reaction combat skills
    const reactionCards = [opportunityAttackCard()];
    if (equippedShield()) reactionCards.push(shieldBlockCard());
    root.appendChild(actionGroup("reaction", "↩ Reactions",
      reactionCards.concat(byAction("Reaction").map(makeTechCard)).concat(csByAction("Reaction").map(makeCombatSkillCard))));

    // ⏳ Full-Turn & Other (any non-standard action type)
    const std = ["Action", "Bonus Action", "Reaction"];
    const other = known.filter((t) => !isAug(t) && std.indexOf(t.action) < 0);
    if (other.length) root.appendChild(actionGroup("other", "⏳ Full-Turn & Other", other.map(makeTechCard)));

    // 🎖 Fighting Style Passives (always-on — reference only; the active skills live in the groups above)
    const passives = csByAction("Passive");
    if (passives.length) {
      const csPanel = el("div", "panel");
      const style = PC.styleForHeritage(rec.heritage);
      csPanel.appendChild(el("div", "section-label", "🎖 Combat Skill Passives" + (style ? " — " + style.name : "")));
      passives.forEach((c) => {
        const card = el("div", "tech-card");
        card.innerHTML = `<div class="thead"><span class="tname">${c.name}</span><span class="tmeta">Passive${c.style ? " · " + c.style : ""}</span></div><div class="teff">▸ ${c.effect}</div>`;
        csPanel.appendChild(card);
      });
      root.appendChild(csPanel);
    }

    // log
    const logPanel = el("div", "panel");
    logPanel.appendChild(el("div", "section-label", "Log"));
    logPanel.appendChild(logElement());
    root.appendChild(logPanel);
    return root;
  }

  function weaponActionCard(it) {
    const attr = weaponAttr(it);
    const card = el("div", "tech-card");
    card.innerHTML =
      `<div class="thead"><span class="tname">⚔ ${it.name}</span><span class="tmeta">${it.weaponType || "no type"}${attr ? " · " + attr : ""}${it.damage ? " · " + it.damage : ""}${it.hands ? " · " + (it.hands === 2 ? "2H" : "1H") : ""}</span></div>`;
    const row = el("div", "combat-actions");
    if (!it.weaponType || !it.damage) {
      row.appendChild(el("span", "muted", "Set weapon type & damage die in Inventory to enable rolls."));
    } else {
      const lk = lockReason(attr);
      const atk = el("button", "btn small primary", "⚔ Attack"); atk.onclick = () => attackWith(it);
      const ammoStop = ammoBlocked(it);
      atk.disabled = !!lk || econBlocked("Action") || !!ammoStop;
      atk.title = lk || ammoStop || (econBlocked("Action") ? "Action already used this turn" : "");
      const dmg = el("button", "btn small", "🎲 Damage"); dmg.onclick = () => damageWith(it);
      dmg.disabled = !!lk; if (lk) dmg.title = lk;
      row.appendChild(atk); row.appendChild(dmg);
      if (weaponIsMelee(it)) {
        knownMeleeAugments().forEach((t) => {
          const b = el("button", "btn small", `+${t.name} (${t.kp} KP)`);
          b.disabled = !!lk || play.kp < t.kp;
          if (lk) b.title = lk;
          b.onclick = () => damageWith(it, t.name);
          row.appendChild(b);
        });
      }
    }
    card.appendChild(row);
    return card;
  }

  // 🩸 Natural attacks a transformation grants once their tier gate is met (Wyvern's Tail Whip, the Strigoi's
  // Scratch / Bite / Blood Weapon). Each is a to-hit strike using its own attribute(s), action slot, and die.
  function naturalAttackDie(na, tierNum) {
    if (na.useClaw) return transformClawDie(tierNum) || na.die || "1d4";
    if (na.dieLadder && na.dieLadder.length) { const i = Math.max(0, Math.min(na.dieLadder.length - 1, (tierNum || 1) - (na.fromTier || 1))); return na.dieLadder[i]; }
    return na.die || "1d4";
  }
  // Resolved natural attacks available right now (tier gate met), with their die and mods filled in.
  function activeNaturalAttacks() {
    if (!transformActive()) return [];
    const tr = sigTransform(), t = sigTier();
    if (!tr || !tr.naturalAttacks || !t) return [];
    return tr.naturalAttacks.filter((na) => t.tier >= (na.fromTier || 1)).map((na) => ({
      name: na.name, attr: na.attr, attr2: na.attr2 || null, action: na.action || "Bonus Action",
      damage: naturalAttackDie(na, t.tier), lifesteal: !!na.lifesteal,
    }));
  }
  function naturalAttackToHit(na) {
    if (isLocked(na.attr)) { App.toast(`${chakraName(na.attr)} chakra locked — can't strike.`); return; }
    if (econBlocked(na.action)) { App.toast(`You've already used your ${econName(na.action)} this turn.`); return; }
    consumeEcon(na.action);
    const mod = adjMod(na.attr) + PC.profBonus(rec.level);
    const r = PC.rollCheck(mod, isDisadv(na.attr) ? "dis" : "normal");
    const dis = r.mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${na.name} attack: d20${dis}${PC.fmtMod(mod)} = ${r.total} ✓prof (vs Defense Score)`);
    save(); refresh();
  }
  function naturalAttackCard(na) {
    const card = el("div", "tech-card");
    const mods = na.attr + (na.attr2 ? " + " + na.attr2 : "");
    const bonus = na.action !== "Action";
    card.innerHTML =
      `<div class="thead"><span class="tname">🩸 ${na.name}</span><span class="tmeta">${bonus ? "Bonus" : "Action"} · ${mods} · ${na.damage}${na.lifesteal ? " · lifesteal" : ""}</span></div>` +
      `<div class="teff">▸ A natural strike — ${na.damage} + ${mods}${na.lifesteal ? "; you heal for half the damage" : ""}.</div>`;
    const row = el("div", "combat-actions");
    const lk = lockReason(na.attr), blocked = econBlocked(na.action);
    const atk = el("button", "btn small primary", "⚔ Attack");
    atk.disabled = !!lk || blocked;
    atk.title = lk || (blocked ? `${econName(na.action)} already used this turn` : "");
    atk.onclick = () => naturalAttackToHit(na);
    const dmg = el("button", "btn small", "🎲 Damage");
    dmg.disabled = !!lk; if (lk) dmg.title = lk;
    dmg.onclick = () => damageWith({ name: na.name, damage: na.damage, attr: na.attr, attr2: na.attr2, lifesteal: na.lifesteal });
    row.appendChild(atk); row.appendChild(dmg);
    card.appendChild(row);
    return card;
  }
  // 👊 Unarmed Strike — a basic Action anyone can take (a punch or kick).
  function unarmedStrikeCard() {
    const card = el("div", "tech-card");
    const m = adjMod("STR");
    const up = unarmedProfile();
    const title = up.claws ? "🐺 Claws" : "👊 Unarmed Strike";
    const flavor = up.claws ? `Natural claws — melee attack for ${up.damage}${PC.fmtMod(m)} slashing.` : `A punch or kick — melee attack for ${up.damage}${PC.fmtMod(m)} damage.`;
    card.innerHTML =
      `<div class="thead"><span class="tname">${title}</span><span class="tmeta">Action · STR · ${up.damage}</span></div>` +
      `<div class="teff">▸ ${flavor}</div>`;
    const row = el("div", "combat-actions");
    const lk = lockReason("STR");
    const atk = el("button", "btn small primary", "⚔ Attack");
    atk.disabled = !!lk || econBlocked("Action");
    atk.title = lk || (atk.disabled ? "Action already used this turn" : "");
    atk.onclick = () => unarmedAttack("Action");
    const dmg = el("button", "btn small", "🎲 Damage");
    dmg.disabled = !!lk; if (lk) dmg.title = lk;
    dmg.onclick = () => damageWith(unarmedProfile());
    row.appendChild(atk); row.appendChild(dmg);
    card.appendChild(row);
    return card;
  }

  // ↩ Opportunity Attack — a basic Reaction: one melee attack (any melee weapon or unarmed)
  // when an enemy enters or leaves your reach. Once before your next turn (spends your Reaction).
  // 🛡 Shield Block — a reaction: raise your shield to add its Defense again against one incoming hit,
  // until your next turn. Spends your Reaction; the bonus shows on your Defense and clears at End Turn.
  function shieldBlockCard() {
    const sh = equippedShield();
    const card = el("div", "tech-card");
    const active = !!play.blockDS;
    card.innerHTML =
      `<div class="thead"><span class="tname">🛡 Block${active ? ' <span class="freeflag" style="color:var(--good)">raised</span>' : ""}</span><span class="tmeta">Reaction · ${sh.name}</span></div>` +
      `<div class="teff">▸ Raise the ${sh.name}: +${sh.dsBonus || 0} Defense against one hit, until your next turn.</div>`;
    const btn = el("button", "btn small " + (active ? "" : "primary"), active ? "Lower" : "Block");
    const blocked = econBlocked("Reaction");
    btn.disabled = !active && blocked;
    btn.title = (!active && blocked) ? "Reaction already used this turn" : "";
    btn.style.marginTop = "8px";
    btn.onclick = () => {
      if (active) { play.blockDS = 0; logLine("Lowered your shield."); save(); refresh(); return; }
      consumeEcon("Reaction");
      play.blockDS = Number(sh.dsBonus) || 0;
      announce(defenseScore(), `🛡 Block with ${sh.name} — +${play.blockDS} Defense vs one hit (now ${defenseScore()}).`);
      save(); refresh();
    };
    card.appendChild(btn);
    return card;
  }
  function opportunityAttackCard() {
    const card = el("div", "tech-card");
    card.innerHTML =
      `<div class="thead"><span class="tname">↩ Opportunity Attack</span><span class="tmeta">Reaction · melee</span></div>` +
      `<div class="teff">▸ When an enemy enters or leaves your reach, make one melee attack. Once before your next turn.</div>`;
    const blocked = econBlocked("Reaction");
    const sources = (rec.inventory || []).filter((it) => it.equipped && it.category === "Weapon" && weaponIsMelee(it) && it.weaponType && it.damage);
    // Each source: an attack button (spends the Reaction) + a damage button.
    sources.forEach((it) => {
      const row = el("div", "combat-actions");
      row.appendChild(el("span", "oa-src", it.name));
      const lk = lockReason(weaponAttr(it));
      const atk = el("button", "btn small primary", "⚔ Attack");
      atk.disabled = !!lk || blocked;
      atk.title = lk || (blocked ? "Reaction already used this turn" : "");
      atk.onclick = () => attackWith(it, "Reaction");
      const dmg = el("button", "btn small", "🎲 Damage");
      dmg.disabled = !!lk; if (lk) dmg.title = lk;
      dmg.onclick = () => damageWith(it);
      row.appendChild(atk); row.appendChild(dmg);
      card.appendChild(row);
    });
    // Unarmed is always a melee option (claws while shifted).
    const uprof = unarmedProfile();
    const urow = el("div", "combat-actions");
    urow.appendChild(el("span", "oa-src", `${uprof.claws ? "🐺 Claws" : "👊 Unarmed"} (${uprof.damage})`));
    const ulk = lockReason("STR");
    const uatk = el("button", "btn small primary", "⚔ Attack");
    uatk.disabled = !!ulk || blocked;
    uatk.title = ulk || (blocked ? "Reaction already used this turn" : "");
    uatk.onclick = () => unarmedAttack("Reaction");
    const udmg = el("button", "btn small", "🎲 Damage");
    udmg.disabled = !!ulk; if (ulk) udmg.title = ulk;
    udmg.onclick = () => damageWith(unarmedProfile());
    urow.appendChild(uatk); urow.appendChild(udmg);
    card.appendChild(urow);
    return card;
  }

  // A collapsible action-economy group (pull-down menu). The header shows the group name, a count badge,
  // and a caret; tapping it toggles the card grid. Open/closed state persists in combatGroupOpen so a roll's
  // refresh doesn't snap the menu shut.
  function actionGroup(key, title, cards, emptyMsg) {
    const p = el("div", "panel combat-group");
    const open = !!combatGroupOpen[key];
    const head = el("div", "section-label collapse-head combat-group-head");
    head.style.cursor = "pointer";
    head.innerHTML = `<span class="cg-title">${title} <span class="cg-count">${cards.length}</span></span><span class="cg-caret">${open ? "▲" : "▼"}</span>`;
    head.onclick = () => { combatGroupOpen[key] = !open; refresh(); };
    p.appendChild(head);
    if (open) {
      if (!cards.length) p.appendChild(el("div", "muted", emptyMsg || "None available."));
      else { const g = el("div", "combat-grid"); cards.forEach((c) => g.appendChild(c)); p.appendChild(g); }
    }
    return p;
  }

  function miniStat(label, val, cls) {
    const d = el("div", "mini-stat " + cls);
    d.innerHTML = `<div class="mini-val">${val}</div><div class="mini-label">${label}</div>`;
    return d;
  }

  /* ---------- conditions tracker UI ---------- */
  // One active-condition chip: emoji + name (hover = effect), a ∞/turn stepper, and ✕ to clear.
  function conditionChip(c) {
    const cat = PC.condition(c.key); if (!cat) return el("span");
    const chip = el("div", "cond-chip sev-" + (cat.sev || "neutral"));
    chip.title = cat.desc;
    const label = el("span", "cond-label", `${cat.emoji} ${cat.name}`);
    chip.appendChild(label);
    const stepper = el("span", "cond-turns");
    const minus = el("button", "cond-step", "−"); minus.title = "Fewer turns";
    minus.onclick = (e) => { e.stopPropagation(); adjustConditionTurns(c.key, -1); };
    const count = el("span", "cond-count", typeof c.turns === "number" ? c.turns + "t" : "∞");
    count.title = typeof c.turns === "number" ? c.turns + " turn(s) left — ticks down at End Turn" : "Lasts until cleared";
    const plus = el("button", "cond-step", "+"); plus.title = "More turns";
    plus.onclick = (e) => { e.stopPropagation(); adjustConditionTurns(c.key, 1); };
    stepper.appendChild(minus); stepper.appendChild(count); stepper.appendChild(plus);
    chip.appendChild(stepper);
    const x = el("button", "cond-x", "✕"); x.title = "Clear this condition";
    x.onclick = (e) => { e.stopPropagation(); removeCondition(c.key); };
    chip.appendChild(x);
    return chip;
  }

  // The Conditions panel on the Combat tab: active chips + an expandable catalog picker.
  function conditionsPanel() {
    const panel = el("div", "panel");
    const head = el("div", "cond-head");
    head.appendChild(el("div", "section-label", "Conditions"));
    const addBtn = el("button", "btn small" + (conditionsPickerOpen ? " primary" : ""), conditionsPickerOpen ? "✕ Close" : "＋ Condition");
    addBtn.onclick = () => { conditionsPickerOpen = !conditionsPickerOpen; refresh(); };
    head.appendChild(addBtn);
    panel.appendChild(head);

    if (play.conditions && play.conditions.length) {
      const chips = el("div", "cond-chips");
      play.conditions.forEach((c) => chips.appendChild(conditionChip(c)));
      panel.appendChild(chips);
    } else if (!conditionsPickerOpen) {
      panel.appendChild(el("div", "muted", "No active conditions. Tap ＋ Condition to add one."));
    }

    if (conditionsPickerOpen) {
      const grid = el("div", "cond-picker");
      PC.CONDITIONS.forEach((cat) => {
        const on = hasCondition(cat.key);
        const opt = el("button", "cond-opt sev-" + (cat.sev || "neutral") + (on ? " active" : ""),
          `${cat.emoji} ${cat.name}`);
        opt.title = cat.desc + (on ? " (active — tap to clear)" : "");
        opt.onclick = () => { on ? removeCondition(cat.key) : addCondition(cat.key); };
        grid.appendChild(opt);
      });
      panel.appendChild(grid);
    }
    return panel;
  }

  // Shared rolling log element (used by Sheet's dice panel and the Combat tab).
  function logElement() {
    const log = el("div", "roll-log");
    if (!play.log.length) log.appendChild(el("div", "muted", "Rolls and actions appear here."));
    play.log.forEach((entry) => {
      const line = el("div", "log-line");
      line.innerHTML = `<span class="log-turn">T${entry.turn}</span> ${entry.t}`;
      log.appendChild(line);
    });
    return log;
  }

  // Action-economy tracker: Action / Bonus / Reaction / Move for the turn. Tap to toggle manually.
  function econTracker() {
    const wrap = el("div", "econ-row");
    [["action", "Action"], ["bonus", "Bonus"], ["reaction", "Reaction"], ["move", "Move"]].forEach((pair) => {
      const used = !!play.econ[pair[0]];
      const chip = el("div", "econ-chip" + (used ? " used" : ""));
      chip.innerHTML = `${used ? "✓" : "○"} ${pair[1]}`;
      chip.title = used ? "Used this turn — tap to restore" : "Available — tap to mark used";
      chip.onclick = () => toggleEconSlot(pair[0]);
      wrap.appendChild(chip);
    });
    return wrap;
  }

  window.PsionPlay = { render: render };
})();
