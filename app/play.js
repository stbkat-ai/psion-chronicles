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
  // Live state of the custom-item builder form (survives re-renders so type changes don't lose input).
  // slotGrade maps a component part → the grade (1–4) chosen for that slot on a weapon/armor build.
  let craftForm = { name: "", type: "Weapon", rarity: "Common", weight: "", desc: "", weaponType: "", hands: "1", armorClass: "Light", hp: "", kp: "", skill: "", slotGrade: {} };
  const refresh = () => App.render();

  const bg = () => PC.background(rec.background);

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
    if (!Array.isArray(play.active)) play.active = [];
    if (!Array.isArray(play.log)) play.log = [];
    if (typeof play.turn !== "number") play.turn = 1;
    // Action economy for the current turn (true = already used this turn).
    if (!play.econ) play.econ = { action: false, bonus: false, reaction: false, move: false };
    // Clamp current HP/KP to the CURRENT (buff-aware) max. An active attribute buff raises the max, so
    // current is left as-is (you gain headroom, not free HP); when the buff ends — or an attribute is
    // edited down — the lower max clamps current back down on the next render.
    play.hp = Math.min(play.hp, maxHP());
    play.kp = Math.min(play.kp, maxKP());
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
    // Soul Pool = accumulated XP (persistent). Leveling is GM-driven; thresholds are TBD.
    if (typeof rec.xp !== "number") rec.xp = 0;
  }
  function save() {
    const list = App.loadRoster();
    const i = list.findIndex((c) => c.id === rec.id);
    if (i > -1) { list[i] = rec; App.saveRoster(list); }
  }

  /* ---------- computations ---------- */
  // Max pools use LIVE (buff-aware) scores: a sustained technique that raises attributes raises the
  // matching pool for as long as it's active — body-attribute buffs grow max HP, mind-attribute buffs
  // grow max KP (bodyPool/mindPool sum the attribute scores, so the increase is exactly the buff).
  // The buff-free "permanent" pools are computed separately in ensurePlay to seed a new play session.
  function maxHP() { return PC.bodyPool(liveScores(), bg().pool); }
  function maxKP() { return PC.mindPool(liveScores(), bg().pool); }
  function permMaxHP() { return PC.bodyPool(PC.effectiveScores(rec.baseScores, bg().boosts, null), bg().pool); }
  function permMaxKP() { return PC.mindPool(PC.effectiveScores(rec.baseScores, bg().boosts, null), bg().pool); }

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
  function liveScores() { return PC.effectiveScores(rec.baseScores, bg().boosts, activeAttrBuffs()); }
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
  // If the attribute's chakra is locked out (4 hits), a reason string for disabling its rolls; else null.
  function lockReason(attr) { return attr && isLocked(attr) ? `${PC.CHAKRAS[attr].name} chakra locked out — no ${attr} rolls` : null; }

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
    if (legs >= 2) return 0;
    if (legs === 1) return Math.floor(m / 2);
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
    equippedArmor().forEach((it) => {
      if (it.dsBonus && proficientWithArmorClass(it.armorClass)) ds += Number(it.dsBonus) || 0;
    });
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
    if (actionType === "Bonus Action") play.econ.bonus = true;
    else if (actionType === "Reaction") play.econ.reaction = true;
    else if (actionType === "Full Turn") { play.econ.action = true; play.econ.bonus = true; }
    else play.econ.action = true; // "Action"
  }
  function econName(actionType) {
    if (actionType === "Bonus Action") return "Bonus Action";
    if (actionType === "Reaction") return "Reaction";
    if (actionType === "Full Turn") return "turn (Action + Bonus)";
    return "Action";
  }
  function toggleEconSlot(slot) { play.econ[slot] = !play.econ[slot]; save(); refresh(); }

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
    // Short rest restores half of each limb's max.
    PC.LIMBS.forEach((L) => { play.limbs[L.key] = Math.min(limbMaxFor(L.key), limbCurrent(L.key) + Math.ceil(limbMaxFor(L.key) / 2)); });
    logLine(`Short rest — healed 1 hit on ${healed} chakra${healed === 1 ? "" : "s"}; limbs +½ each.`);
    App.toast("Short rest taken.");
    save(); refresh();
  }
  function longRest() {
    PC.ATTRS.forEach((a) => { if (play.chakraHits[a] > 0) play.chakraHits[a] = Math.max(0, play.chakraHits[a] - 2); });
    // End sustained techniques first, so "fully restored" fills the permanent (unbuffed) pools.
    play.active = []; play.turn = 1;
    play.hp = maxHP(); play.kp = maxKP();
    play.econ = { action: false, bonus: false, reaction: false, move: false };
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
    play.turn += 1;
    play.econ = { action: false, bonus: false, reaction: false, move: false }; // refresh for the new turn
    save(); refresh();
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
    if (isLocked(t.attr)) { App.toast(`${PC.CHAKRAS[t.attr].name} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    const profLvl = kineticProfLevel(t.kinetic);
    const mod = adjMod(t.attr) + PC.kineticProfBonus(rec.level, profLvl);
    const profTag = profLvl === "expertise" ? " ✦expertise (2× prof)" : profLvl === "proficient" ? " ✓prof" : "";
    // Disadvantage: chakra hit, head crippled, a background flaw on this attribute, or non-proficient
    // armor on an AGI-based technique attack.
    const r = PC.rollCheck(mod, (isDisadv(t.attr) || headCrippled() || flawDisadvAttr(t.attr) || (t.attr === "AGI" && wearingUnproficientArmor())) ? "dis" : "normal");
    const dis = r.mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${t.name} attack: d20${dis}${PC.fmtMod(mod)} = ${r.total} to hit${profTag} (−${t.kp} KP; roll Damage if it hits)`);
    save(); refresh();
  }
  // Roll a technique's damage (no KP — the KP was spent on the attack/cast).
  function damageTechnique(t) {
    const r = PC.rollDiceExpr(t.damage.dice);
    const m = adjMod(t.damage.mod);
    let loc = t.damage.range ? ` (${t.damage.range})` : "";
    announce(r.total + m, `${t.name} damage: ${t.damage.dice}${PC.fmtMod(m)} = [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${r.total + m} ${t.damage.type}${loc}`);
    save(); refresh();
  }
  // AoE technique: spend KP, auto-hit, roll damage applied to each target in the area.
  function castAoE(t) {
    if (isLocked(t.attr)) { App.toast(`${PC.CHAKRAS[t.attr].name} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    const r = PC.rollDiceExpr(t.damage.dice);
    const m = adjMod(t.damage.mod);
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
    if (isLocked(t.attr)) { App.toast(`${PC.CHAKRAS[t.attr].name} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    let msg = `${t.name} (−${t.kp} KP)`;
    let flashTotal = null;
    if (t.heal) {
      const r = PC.rollDiceExpr(t.heal.dice);
      const m = adjMod(t.heal.mod);
      const amt = r.total + m; flashTotal = amt;
      if (t.heal.target === "self") {
        play.hp = clamp(play.hp + amt, 0, maxHP());
        msg += ` → healed yourself [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${amt} HP`;
      } else {
        msg += ` → heal an ally [${r.rolls.join(",")}]${PC.fmtMod(m)} = ${amt} HP`;
      }
    } else if (t.grantKP) {
      const r = PC.rollDiceExpr(t.grantKP.dice);
      const m = adjMod(t.grantKP.mod);
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
      if (isLocked(t.attr)) { App.toast(`${PC.CHAKRAS[t.attr].name} chakra locked — can't use ${t.kinetic}.`); return; }
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
    const copy = Object.assign({}, item, {
      qty: 1,
      id: "it_" + Date.now().toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6),
    });
    rec.inventory.push(copy);
    logLine(`Added ${item.name} to inventory.`);
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
  function toggleEquip(it) {
    it.equipped = !it.equipped;
    logLine(`${it.equipped ? "Equipped" : "Unequipped"} ${it.name}.`);
    save(); refresh();
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
    let flashTotal = null;
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
      if (eff.cure) parts.push(`cures ${eff.cure}`);
      if (eff.note) parts.push(eff.note);
    }
    const msg = `Used ${it.name}${parts.length ? " — " + parts.join(", ") : ""}.`;
    if (flashTotal != null && flashTotal > 0) announce(flashTotal, msg); else logLine(msg);
    it.qty = (Number(it.qty) || 1) - 1;
    if (it.qty <= 0) { expandedItem = null; rec.inventory.splice(idx, 1); }
    save(); refresh();
  }
  // weapon helpers
  function weaponAttr(it) { const w = PC.WEAPON_TYPES.find((x) => x.name === it.weaponType); return w ? w.attr : null; }
  function proficientWithType(it) {
    if (it.proficient) return true;
    if (!it.weaponType) return false;
    if (bg().combat.indexOf(it.weaponType) > -1) return true;
    return (rec.bonusWeaponProfs || []).indexOf(it.weaponType) > -1; // extra proficiency from a heritage grant
  }
  // econType: which action-economy slot the swing spends — "Action" for a normal attack,
  // "Reaction" for an Opportunity Attack. Defaults to "Action".
  function attackWith(it, econType) {
    econType = econType || "Action";
    const attr = weaponAttr(it);
    if (!attr) { App.toast("Set this weapon's type first."); return; }
    if (isLocked(attr)) { App.toast(`${PC.CHAKRAS[attr].name} chakra locked — can't attack with ${attr}.`); return; }
    if (bothArmsCrippled()) { App.toast("Both arms are crippled — you can't make weapon attacks."); return; }
    if (econBlocked(econType)) { App.toast(`You've already used your ${econName(econType)} this turn.`); return; }
    consumeEcon(econType);
    const prof = proficientWithType(it);
    const mod = adjMod(attr) + (prof ? PC.profBonus(rec.level) : 0);
    // Disadvantage: crippled arm, or wearing non-proficient armor on an AGI-based attack.
    const mode = (isDisadv(attr) || anyArmCrippled() || (attr === "AGI" && wearingUnproficientArmor())) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    const oa = econType === "Reaction" ? " (Opportunity)" : "";
    announce(r.total, `${it.name} attack${oa}: d20${dis}${PC.fmtMod(mod)} = ${r.total}${prof ? " ✓prof" : ""} (vs Defense Score)`);
    save(); refresh();
  }

  // Unarmed Strike — a punch or kick anyone can throw. STR-based melee, 1d4 + STR mod,
  // proficient by default (it's your own body). econType lets it double as an Opportunity Attack.
  const UNARMED = { name: "Unarmed Strike", damage: "1d4" }; // no weaponType → damageWith uses STR
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
    const attr = weaponAttr(it) || "STR";
    if (!it.damage) { App.toast('Set a damage die (e.g. "1d10").'); return; }
    const dr = PC.rollDiceExpr(it.damage);
    if (!dr) { App.toast('Damage die format: like "1d10" or "2d6".'); return; }
    const m = adjMod(attr);
    let total = dr.total + m;
    const parts = [`${it.damage}${PC.fmtMod(m)} = [${dr.rolls.join(",")}]${PC.fmtMod(m)}`];
    let kpNote = "";
    if (augmentName) {
      const t = PC.technique(augmentName);
      if (!t) { App.toast("Unknown augment."); return; }
      if (play.kp < t.kp) { App.toast(`Not enough KP for ${t.name} (need ${t.kp}).`); return; }
      play.kp -= t.kp;
      const ar = PC.rollDiceExpr(t.damage.dice);
      const am = adjMod(t.damage.mod);
      total += ar.total + am;
      parts.push(`${t.name} ${t.damage.dice}${PC.fmtMod(am)} = [${ar.rolls.join(",")}]${PC.fmtMod(am)}`);
      kpNote = ` (−${t.kp} KP)`;
    }
    announce(total, `${it.name} damage${augmentName ? " + " + augmentName : ""}: ${parts.join(" + ")} → ${total} total${kpNote}`);
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

  function rollRaw(sides, count) {
    const n = count || 1; const rolls = []; let total = 0;
    for (let i = 0; i < n; i++) { const x = PC.rollDie(sides); rolls.push(x); total += x; }
    announce(total, `Roll ${n}d${sides} = [${rolls.join(",")}]${n > 1 ? " = " + total : ""}`);
    save(); refresh();
  }

  /* ---------- render ---------- */
  function render(container, id) {
    if (id !== curId) { activeTab = "sheet"; expandedItem = null; catalogOpen = false; poolEdit = null; limbSel = null; chakraSel = null; curId = id; }
    rec = App.loadRoster().find((c) => c.id === id);
    if (!rec) { App.goHome(); return; }
    ensurePlay();
    container.appendChild(build());
  }

  function build() {
    const root = el("div");
    root.appendChild(buildHeader());
    root.appendChild(buildTabBar());
    let body;
    switch (activeTab) {
      case "combat": body = buildCombat(); break;
      case "limbs": body = buildLimbsTab(); break;
      case "chakras": body = buildChakraTab(); break;
      case "kinetics": body = buildKineticsTab(); break;
      case "skills": body = buildSkillsTab(); break;
      case "traits": body = buildTraitsTab(); break;
      case "description": body = buildDescriptionTab(); break;
      case "inventory": body = catalogOpen ? buildCatalogScreen() : buildInventoryTab(); break;
      case "crafting": body = buildCraftingTab(); break;
      default: body = buildSheetTab();
    }
    root.appendChild(body);
    return root;
  }

  function buildHeader() {
    const head = el("div", "play-head");
    const back = el("button", "btn ghost small", "← Characters");
    back.onclick = () => App.goHome();
    const title = el("div");
    title.innerHTML = `<h2 style="margin:0">${rec.name || "Unnamed"}</h2>
      <div style="color:var(--text-dim);font-size:.86rem">${rec.background} · Soul Level ${rec.level} · Turn ${play.turn}</div>`;
    const endTurnBtn = el("button", "btn small", `⏭ End Turn${activeUpkeep() ? " (−" + activeUpkeep() + " KP)" : ""}`);
    endTurnBtn.onclick = endTurn;
    head.appendChild(back); head.appendChild(title); head.appendChild(endTurnBtn);
    return head;
  }

  function buildTabBar() {
    const bar = el("div", "play-tabs");
    [["sheet", "Sheet"], ["combat", "⚔ Combat"], ["limbs", "Limbs"], ["chakras", "Chakras"], ["kinetics", "Kinetics"], ["skills", "Skills"], ["traits", "Traits"], ["description", "Description"], ["inventory", "Inventory"], ["crafting", "🔨 Crafting"]].forEach((pair) => {
      const b = el("button", "play-tab" + (activeTab === pair[0] ? " active" : ""), pair[1]);
      b.onclick = () => { activeTab = pair[0]; catalogOpen = false; refresh(); };
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
    return root;
  }

  // Movement speeds (walk / climb / jump / swim) — shown on both the Sheet and Combat tabs. Walk uses
  // effectiveMovement() so it reflects crippled legs and Heavy-armor penalty; the rest come from derive().
  function speedsRow() {
    const d = PC.derive(liveScores(), rec.level);
    const row = el("div", "tile-row");
    row.appendChild(tile("Movement", effectiveMovement() + " ft" + (crippledLegs() ? " ⚠" : "")));
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
      const buff = activeAttrBuffs()[a];
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
    box.appendChild(el("div", "soul-xp", `Soul Level <b>${rec.level}</b>${rec.level >= 30 ? " · MAX" : ""} · Experience: <b>${rec.xp || 0}</b> XP · leveling is GM-driven (thresholds being tuned)`));
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
    // Level Up button, right under the Soul Pool.
    const luRow = el("div", "soul-lvlrow");
    const lu = el("button", "btn primary small", rec.level >= 30 ? "Max Level (30)" : "⭐ Level Up");
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
    const equippable = it.category === "Weapon" || it.category === "Armor";
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
        atk.disabled = !!lk || econBlocked("Action");
        atk.title = lk || (atk.disabled ? "Action already used this turn" : "");
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
      // Salvage: break one unit down into its materials (craftable, non-material items).
      if (it.category !== "Salvage" && recipeOf(it)) {
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
    const c = el("div", "tech-card" + (active ? " selected" : ""));
    const costParts = [t.kp + " KP"];
    if (t.upkeep) costParts.push("+" + t.upkeep + "/turn");
    c.innerHTML =
      `<div class="thead"><span class="tname">${t.name}${active ? ' <span class="freeflag" style="color:var(--good)">active</span>' : ""}</span><span class="cost">${costParts.join(" ")}</span></div>
       <div class="tmeta">${t.kinetic} · ${t.tier} · ${t.action}</div>
       <div class="teff">▸ ${t.effect}</div>`;
    if (t.augment && t.augment.kind === "melee-damage") {
      c.appendChild(el("div", "inv-note", "⚔ Melee augment — use it from an equipped melee weapon's damage roll."));
    } else if (techniqueNeedsToHit(t)) {
      // single-target ranged: roll to-hit (spends KP + Action), then damage if it hits
      const row = el("div", "combat-actions");
      const blocked = econBlocked(t.action);
      const lk = lockReason(t.attr);
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
      const lk = active ? null : lockReason(t.attr);
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
      const sel = chakraSel === "HEART" ? " sel" : "";
      dots +=
        `<g class="chakra heart awakened${sel}" data-attr="HEART" style="--cc:${h.color}">` +
        `<circle class="ch-halo" cx="150" cy="99" r="20"/>` +
        `<circle class="ch-disc" cx="150" cy="99" r="13"/>` +
        `<circle class="ch-core" cx="150" cy="99" r="5"/>` +
        `</g>`;
    }
    return `<svg class="chakra-figure" viewBox="0 0 300 268" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chakras — tap one">${body}${dots}</svg>`;
  }

  function buildChakraTab() {
    const root = el("div");
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Chakras — one per attribute"));
    p.appendChild(el("p", "hint", "Each chakra governs an attribute. Taking <b>hits</b> weakens it: 1 = disadvantage, 2 = modifier halved, 3 = modifier removed, 4 = <b>locked out</b> (no rolls with that attribute until you rest). <b>Tap a chakra</b> on the figure — or a row below — to set its hits. Short rest heals 1 hit each; long rest heals 2."));

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
      const row = el("div", "chakra-leg heart" + (chakraSel === "HEART" ? " sel" : ""));
      row.style.setProperty("--cc", h.color);
      const info = el("div", "chakra-leg-info");
      info.innerHTML =
        `<span class="chakra-swatch"></span>` +
        `<span class="chakra-nm">${h.name}</span>` +
        `<span class="chakra-at">Otherkin · Soul Creature</span>` +
        `<span class="chakra-eff">Awakened</span>`;
      info.onclick = () => { chakraSel = chakraSel === "HEART" ? null : "HEART"; refresh(); };
      row.appendChild(info);
      row.appendChild(el("div", "chakra-heart-badge", "★"));
      list.appendChild(row);
    }
    p.appendChild(list);
    // Reveal note — explains the newly awakened Heart chakra and that its powers are still to come.
    if (heartUnlocked()) {
      p.appendChild(el("div", "chakra-heart-note",
        `<b class="heart-hl">♥ The Heart chakra has awakened.</b> At Soul Level 15 your <b>Soul Creature</b> stirs at the center of your chakras — the <b>Otherkin</b> that has lived in your soul since creation. Its powers are still being forged; this node will come alive when the Otherkin system is complete.`));
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
    panel.appendChild(el("p", "hint", "Complete a Kinetic's <b>Adept</b> tier (all 5 techniques) to gain <b>proficiency</b> in it; complete its <b>Expert</b> tier (all 5) for <b>expertise</b> — double proficiency bonus on that Kinetic's technique attacks. Your background focus Kinetic is proficient from the start."));
    kins.forEach((kin) => {
      const lvl = kineticProfLevel(kin);
      const adeptDone = PC.kineticTierTechniques(kin, "Adept").filter((t) => known.indexOf(t.name) > -1).length;
      const expertDone = PC.kineticTierTechniques(kin, "Expert").filter((t) => known.indexOf(t.name) > -1).length;
      const focus = isFocusKinetic(kin);
      const badge = lvl === "expertise" ? '<span class="kin-prof-badge exp">✦ Expertise</span>'
        : lvl === "proficient" ? '<span class="kin-prof-badge pro">✓ Proficient</span>'
        : '<span class="kin-prof-badge none">—</span>';
      let note;
      if (lvl === "expertise") note = `+${PC.kineticProfBonus(rec.level, lvl)} to hit (2× prof)`;
      else if (lvl === "proficient") note = `Expert ${expertDone}/5 → expertise`;
      else note = `Adept ${adeptDone}/5 → proficiency`;
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
    return root;
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
    ["All", "Weapon", "Armor", "Consumable", "Tool", "Misc", "Component", "Salvage"].forEach((c) => { const o = el("option", null, c); o.value = c; catFilter.appendChild(o); });
    catFilter.value = invSearchCat;
    searchRow.appendChild(search); searchRow.appendChild(catFilter);
    panel.appendChild(searchRow);

    const results = el("div", "catalog-results catalog-full");
    panel.appendChild(results);
    function renderResults() {
      const q = invSearchQ.trim().toLowerCase();
      const cat = invSearchCat;
      let matches = (PC.ITEMS || []).filter((it) =>
        (cat === "All" || it.category === cat) &&
        (!q || it.name.toLowerCase().indexOf(q) > -1 || (it.weaponType && it.weaponType.toLowerCase().indexOf(q) > -1) || (it.rarity && it.rarity.toLowerCase().indexOf(q) > -1) || (it.note && it.note.toLowerCase().indexOf(q) > -1) || (it.desc && it.desc.toLowerCase().indexOf(q) > -1)));
      results.innerHTML = "";
      if (!matches.length) { results.appendChild(el("div", "muted", "No items match. Try another search.")); return; }
      const total = matches.length;
      matches = matches.slice(0, 80);
      matches.forEach((it) => {
        const row = el("div", "catalog-row");
        let meta = it.category;
        if (it.category === "Weapon") {
          meta += ` · ${it.weaponType} · ${it.damage} · ${it.hands === 2 ? "two-handed" : "one-handed"}`;
          if (it.note) meta += ` · ${it.note}`;
        }
        else if (it.category === "Armor") { meta += ` · ${it.armorClass || "Light"} · +${it.dsBonus} DS`; if (it.note) meta += ` · ${it.note}`; }
        else { if (it.skill) meta += ` · 🛠 ${it.skill}`; if (it.note) meta += ` · ${it.note}`; }
        // Rarity tag for weapons & armor (Common shown muted; higher rarities colored).
        const rarityTag = (it.category === "Weapon" || it.category === "Armor") && it.rarity
          ? `<span class="rarity-tag rarity-${it.rarity.toLowerCase().replace(/\s+/g, "-")}">${it.rarity}</span>` : "";
        const descLine = it.desc ? `<span class="cat-desc">${it.desc}</span>` : "";
        // Crafting line: recipe + the craft check (skill vs DC). Anyone may attempt.
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
        results.appendChild(row);
      });
      if (total > 80) results.appendChild(el("div", "muted", `Showing 80 of ${total} — refine your search.`));
    }
    search.oninput = () => { invSearchQ = search.value; renderResults(); };
    catFilter.onchange = () => { invSearchCat = catFilter.value; renderResults(); };
    renderResults();

    root.appendChild(panel);
    return root;
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
    ["Weapon", "Armor", "Consumable", "Tool", "Misc"].forEach((c) => { const o = el("option", null, c); o.value = c; catS.appendChild(o); });
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
    if (item.category === "Weapon" && item.weaponType) meta += ` · ${item.weaponType}${item.damage ? " · " + item.damage : ""}`;
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
      if (f.type === "Weapon") { base.weaponType = f.weaponType; base.damage = PC.templateDamage(f.weaponType, q); base.hands = tmpl.hands || 1; }
      else { base.armorClass = f.armorClass; base.dsBonus = PC.templateDS(f.armorClass, q); }
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
    const item = customItemFromForm();
    if (!recipeOf(item)) { App.toast("This can't be made a recipe (check the type)."); return; }
    customItems().push(item);
    const statBit = item.category === "Weapon" ? ` (${item.damage})` : item.category === "Armor" ? ` (+${item.dsBonus} DS)` : "";
    logLine(`✎ Designed custom ${item.rarity} ${item.category.toLowerCase()}: ${item.name}${statBit} — needs ${fmtMats(recipeOf(item))}.`);
    App.toast(`Custom recipe saved: ${item.name}. Craft it under Known Recipes.`);
    craftForm = { name: "", type: f.type, rarity: "Common", weight: "", desc: "", weaponType: "", hands: "1", armorClass: "Light", hp: "", kp: "", skill: "", slotGrade: {} };
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
      wtypeS.onchange = () => { f.weaponType = wtypeS.value; f.slotGrade = {}; refresh(); };
      form.appendChild(labeled("Weapon Type", wtypeS));
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
      const capBits = [1, 2, 3, 4].map((q) => `${PC.qualityName(q)} ${f.type === "Weapon" ? PC.templateDamage(f.weaponType, q) : "+" + PC.templateDS(f.armorClass, q) + " DS"}`).join(" · ");
      rules.innerHTML = `<b>Template:</b> ${f.type === "Weapon" ? f.weaponType + " · " + tmpl.attr + " · " + (tmpl.hands === 2 ? "two-handed" : "one-handed") : f.armorClass + " armor"} · weight ${tmpl.weight[0]}–${tmpl.weight[1]} lb<br><b>By grade:</b> ${capBits}`;
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
      if (item.category === "Weapon") statLine = `<b>${PC.qualityName(item._quality)} ${item.rarity}</b> · ${item.damage} · ${item.hands === 2 ? "two-handed" : "one-handed"} · `;
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

    // gather techniques by action economy (augments excluded — they rider onto weapons)
    const known = knownTechniques().map((n) => PC.technique(n)).filter(Boolean);
    const isAug = (t) => t.augment && t.augment.kind === "melee-damage";
    const byAction = (act) => known.filter((t) => !isAug(t) && t.action === act);
    const equipped = (rec.inventory || []).filter((it) => it.equipped && it.category === "Weapon");

    // Combat skills the character knows, grouped by action type (Passives handled separately below).
    const csAll = knownCombatSkills().map((n) => PC.combatSkill(n)).filter(Boolean);
    const csByAction = (act) => csAll.filter((c) => c.action === act);

    // ⚡ Actions — equipped weapons + universal Unarmed Strike + Action techniques + Action combat skills
    const actionCards = [];
    equipped.forEach((it) => actionCards.push(weaponActionCard(it)));
    actionCards.push(unarmedStrikeCard()); // basic action anyone can take
    byAction("Action").forEach((t) => actionCards.push(makeTechCard(t)));
    csByAction("Action").forEach((c) => actionCards.push(makeCombatSkillCard(c)));
    root.appendChild(actionGroup("⚡ Actions", actionCards));

    // ✦ Bonus Actions — Bonus techniques + Bonus combat skills
    root.appendChild(actionGroup("✦ Bonus Actions",
      byAction("Bonus Action").map(makeTechCard).concat(csByAction("Bonus Action").map(makeCombatSkillCard))));

    // ↩ Reactions — universal Opportunity Attack + Reaction techniques + Reaction combat skills
    root.appendChild(actionGroup("↩ Reactions",
      [opportunityAttackCard()].concat(byAction("Reaction").map(makeTechCard)).concat(csByAction("Reaction").map(makeCombatSkillCard))));

    // ⏳ Full-Turn & Other (any non-standard action type)
    const std = ["Action", "Bonus Action", "Reaction"];
    const other = known.filter((t) => !isAug(t) && std.indexOf(t.action) < 0);
    if (other.length) root.appendChild(actionGroup("⏳ Full-Turn & Other", other.map(makeTechCard)));

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
      atk.disabled = !!lk || econBlocked("Action");
      atk.title = lk || (atk.disabled ? "Action already used this turn" : "");
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

  // 👊 Unarmed Strike — a basic Action anyone can take (a punch or kick).
  function unarmedStrikeCard() {
    const card = el("div", "tech-card");
    const m = adjMod("STR");
    card.innerHTML =
      `<div class="thead"><span class="tname">👊 Unarmed Strike</span><span class="tmeta">Action · STR · 1d4</span></div>` +
      `<div class="teff">▸ A punch or kick — melee attack for 1d4${PC.fmtMod(m)} damage.</div>`;
    const row = el("div", "combat-actions");
    const lk = lockReason("STR");
    const atk = el("button", "btn small primary", "⚔ Attack");
    atk.disabled = !!lk || econBlocked("Action");
    atk.title = lk || (atk.disabled ? "Action already used this turn" : "");
    atk.onclick = () => unarmedAttack("Action");
    const dmg = el("button", "btn small", "🎲 Damage");
    dmg.disabled = !!lk; if (lk) dmg.title = lk;
    dmg.onclick = () => damageWith(UNARMED);
    row.appendChild(atk); row.appendChild(dmg);
    card.appendChild(row);
    return card;
  }

  // ↩ Opportunity Attack — a basic Reaction: one melee attack (any melee weapon or unarmed)
  // when an enemy enters or leaves your reach. Once before your next turn (spends your Reaction).
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
    // Unarmed is always a melee option.
    const urow = el("div", "combat-actions");
    urow.appendChild(el("span", "oa-src", "👊 Unarmed (1d4)"));
    const ulk = lockReason("STR");
    const uatk = el("button", "btn small primary", "⚔ Attack");
    uatk.disabled = !!ulk || blocked;
    uatk.title = ulk || (blocked ? "Reaction already used this turn" : "");
    uatk.onclick = () => unarmedAttack("Reaction");
    const udmg = el("button", "btn small", "🎲 Damage");
    udmg.disabled = !!ulk; if (ulk) udmg.title = ulk;
    udmg.onclick = () => damageWith(UNARMED);
    urow.appendChild(uatk); urow.appendChild(udmg);
    card.appendChild(urow);
    return card;
  }

  function actionGroup(title, cards, emptyMsg) {
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", title));
    if (!cards.length) p.appendChild(el("div", "muted", emptyMsg || "None available."));
    else { const g = el("div", "combat-grid"); cards.forEach((c) => g.appendChild(c)); p.appendChild(g); }
    return p;
  }

  function miniStat(label, val, cls) {
    const d = el("div", "mini-stat " + cls);
    d.innerHTML = `<div class="mini-val">${val}</div><div class="mini-label">${label}</div>`;
    return d;
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
