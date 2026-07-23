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
  const refresh = () => App.render();

  const bg = () => PC.background(rec.background);

  /* ---------- init / persistence ---------- */
  function ensurePlay() {
    const eff0 = PC.effectiveScores(rec.baseScores, bg().boosts, null);
    const maxHP = PC.bodyPool(eff0, bg().pool);
    const maxKP = PC.mindPool(eff0, bg().pool);
    if (!rec.play) {
      rec.play = {
        hp: maxHP, kp: maxKP,
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
    // If attributes were edited, current HP/KP may exceed new maxes — clamp.
    play.hp = Math.min(play.hp, maxHP);
    play.kp = Math.min(play.kp, maxKP);
    // Limb HP (called-shot / crippling system). Current per limb; max derives from maxHP.
    if (!play.limbs) {
      play.limbs = {};
      PC.LIMBS.forEach((L) => { play.limbs[L.key] = Math.ceil(maxHP * L.frac); });
    }
    PC.LIMBS.forEach((L) => {
      const m = Math.ceil(maxHP * L.frac);
      if (typeof play.limbs[L.key] !== "number") play.limbs[L.key] = m;
      play.limbs[L.key] = Math.min(play.limbs[L.key], m); // clamp to max if maxHP dropped
    });
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
  function maxHP() { return PC.bodyPool(PC.effectiveScores(rec.baseScores, bg().boosts, null), bg().pool); }
  function maxKP() { return PC.mindPool(PC.effectiveScores(rec.baseScores, bg().boosts, null), bg().pool); }

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

  function defenseScore() {
    let ds = PC.RULES.BASE_DS + adjMod("AGI") + adjMod("CON");
    play.active.forEach((n) => {
      const t = PC.technique(n);
      if (t && t.buff && t.buff.dsFromMod) ds += adjMod(t.buff.dsFromMod);
    });
    (rec.inventory || []).forEach((it) => {
      if (it.equipped && it.category === "Armor" && it.dsBonus) ds += Number(it.dsBonus) || 0;
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
    play.hp = maxHP(); play.kp = maxKP(); play.active = []; play.turn = 1;
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

  // Is the character proficient with this technique's Kinetic? (background combat proficiency)
  function proficientWithKinetic(t) { return bg().combat.indexOf(t.kinetic) > -1; }
  // Which damaging techniques need a to-hit roll: single-target (non-AoE, non-augment) damage.
  function techniqueNeedsToHit(t) { return !!t.damage && !t.aoe && !(t.augment); }
  function techniqueIsAoE(t) { return !!t.damage && !!t.aoe; }

  // Single-target ranged technique: spend KP, roll d20 + attr mod + prof (if Kinetic-proficient) to hit.
  function attackTechnique(t) {
    if (isLocked(t.attr)) { App.toast(`${PC.CHAKRAS[t.attr].name} chakra locked — can't use ${t.kinetic}.`); return; }
    if (econBlocked(t.action)) { App.toast(`You've already used your ${econName(t.action)} this turn.`); return; }
    if (play.kp < t.kp) { App.toast(`Not enough KP (need ${t.kp}).`); return; }
    play.kp -= t.kp; consumeEcon(t.action);
    const prof = proficientWithKinetic(t);
    const mod = adjMod(t.attr) + (prof ? PC.profBonus(rec.level) : 0);
    // Head crippled → disadvantage on technique attacks.
    const r = PC.rollCheck(mod, (isDisadv(t.attr) || headCrippled()) ? "dis" : "normal");
    const dis = r.mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${t.name} attack: d20${dis}${PC.fmtMod(mod)} = ${r.total} to hit${prof ? " ✓prof" : ""} (−${t.kp} KP; roll Damage if it hits)`);
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
      play.kp -= t.kp; play.active.push(t.name); consumeEcon(t.action);
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
      .forEach((it) => { const a = weaponAttr(it); src.push({ label: `${it.name} (${a})`, attr: a, prof: proficientWithType(it) }); });
    knownTechniques().map((n) => PC.technique(n)).filter(Boolean).filter(techniqueNeedsToHit)
      .forEach((t) => src.push({ label: `${t.name} (${t.attr})`, attr: t.attr, prof: proficientWithKinetic(t) }));
    return src;
  }
  // Roll the called-shot skill check for a Marksmanship-style combat skill, using the chosen attack's
  // attribute (+ proficiency). Spends the skill's action slot; the GM adjudicates the result vs the DC.
  function rollCalledShot(c, source) {
    if (!source) { App.toast("Pick the ranged attack you made first."); return; }
    if (isLocked(source.attr)) { App.toast(`${PC.CHAKRAS[source.attr].name} chakra locked — can't aim with ${source.attr}.`); return; }
    if (econBlocked(c.action)) { App.toast(`You've already used your ${econName(c.action)} this turn.`); return; }
    consumeEcon(c.action);
    const mod = adjMod(source.attr) + (source.prof ? PC.profBonus(rec.level) : 0);
    const mode = isDisadv(source.attr) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadv [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `🎖 ${c.name} called shot: d20${dis}${PC.fmtMod(mod)} = ${r.total}${source.prof ? " ✓prof" : ""} — vs the GM's DC (target size/difficulty). On a success, apply your ${source.label} damage to the called limb.`);
    save(); refresh();
  }

  function rollSkill(skill) {
    if (isLocked(skill.attr)) { App.toast(`${PC.CHAKRAS[skill.attr].name} chakra locked — can't use ${skill.attr} skills.`); return; }
    const proficient = bg().skills.includes(skill.name) || (rec.chosenSkills || []).includes(skill.name);
    const mod = adjMod(skill.attr) + (proficient ? PC.profBonus(rec.level) : 0);
    // Head crippled → disadvantage on Mind (INT/WIS/CHA) checks.
    const mode = (isDisadv(skill.attr) || (headCrippled() && MIND.indexOf(skill.attr) > -1)) ? "dis" : "normal";
    const r = PC.rollCheck(mod, mode);
    const dis = mode === "dis" ? ` (disadvantage: [${r.d20s.join(",")}]→${r.picked})` : "";
    announce(r.total, `${skill.name} check: d20${dis}${PC.fmtMod(mod)} = ${r.total}`);
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
  function useConsumable(idx) {
    const it = rec.inventory[idx];
    if (!it) return;
    logLine(`Used ${it.name}.`);
    it.qty = (Number(it.qty) || 1) - 1;
    if (it.qty <= 0) rec.inventory.splice(idx, 1);
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
    // Crippled arm → disadvantage on weapon attacks.
    const mode = (isDisadv(attr) || anyArmCrippled()) ? "dis" : "normal";
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
    if (id !== curId) { activeTab = "sheet"; expandedItem = null; catalogOpen = false; curId = id; }
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
      case "kinetics": body = buildKineticsTab(); break;
      case "skills": body = buildSkillsTab(); break;
      case "inventory": body = catalogOpen ? buildCatalogScreen() : buildInventoryTab(); break;
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
    [["sheet", "Sheet"], ["combat", "⚔ Combat"], ["limbs", "Limbs"], ["kinetics", "Kinetics"], ["skills", "Skills"], ["inventory", "Inventory"]].forEach((pair) => {
      const b = el("button", "play-tab" + (activeTab === pair[0] ? " active" : ""), pair[1]);
      b.onclick = () => { activeTab = pair[0]; catalogOpen = false; refresh(); };
      bar.appendChild(b);
    });
    return bar;
  }

  function buildSheetTab() {
    const root = el("div");

    /* HP / KP */
    const pools = el("div", "panel");
    pools.appendChild(bar("HP", play.hp, maxHP(), "hp", adjustHP));
    pools.appendChild(bar("KP", play.kp, maxKP(), "kp", adjustKP));
    pools.appendChild(soulBar());
    const rests = el("div", "rest-row");
    const sr = el("button", "btn small", "☾ Short Rest");
    sr.onclick = shortRest;
    const lr = el("button", "btn small", "☀ Long Rest");
    lr.onclick = longRest;
    rests.appendChild(sr); rests.appendChild(lr);
    rests.appendChild(el("span", "rest-note", "Short: +1 hit on each hurt chakra · Long: +2 & full HP/KP"));
    pools.appendChild(rests);
    root.appendChild(pools);

    /* combat stats + active effects */
    const combat = el("div", "panel");
    combat.appendChild(el("div", "section-label", "Combat"));
    const tiles = el("div", "tile-row");
    const d = PC.derive(liveScores(), rec.level);
    tiles.appendChild(tile("Defense Score", defenseScore()));
    tiles.appendChild(tile("Movement", effectiveMovement() + " ft" + (crippledLegs() ? " ⚠" : "")));
    tiles.appendChild(tileRoll("Initiative", "d20 " + PC.fmtMod(adjMod("AGI")), () => {
      const r = PC.rollCheck(adjMod("AGI"), isDisadv("AGI") ? "dis" : "normal");
      announce(r.total, `Initiative: d20${PC.fmtMod(adjMod("AGI"))} = ${r.total}`); save(); refresh();
    }));
    tiles.appendChild(tile("Prof. Bonus", PC.fmtMod(PC.profBonus(rec.level))));
    combat.appendChild(tiles);

    combat.appendChild(el("div", "section-label", "This Turn — tap to toggle"));
    combat.appendChild(econTracker());

    combat.appendChild(el("div", "section-label", "Active Effects"));
    if (!play.active.length) combat.appendChild(el("div", "muted", "No sustained techniques active."));
    else {
      const ae = el("div", "chips");
      play.active.forEach((n) => {
        const t = PC.technique(n);
        const chip = el("div", "chip selected");
        chip.innerHTML = `${n} <span class="tag">−${t.upkeep || 0}/turn ✕</span>`;
        chip.title = "Click to end";
        chip.onclick = () => toggleSustained(t);
        ae.appendChild(chip);
      });
      combat.appendChild(ae);
    }
    root.appendChild(combat);

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

    /* chakra chart (interactive) */
    const chak = el("div", "panel");
    chak.appendChild(el("div", "section-label", "Chakra Chart — click pips to set hits"));
    const crow = el("div", "chakra-row");
    PC.ATTRS.forEach((a) => {
      const ch = PC.CHAKRAS[a];
      const hits = chakraOf(a);
      const eff = PC.chakraEffect(hits);
      const c = el("div", "chakra" + (hits >= 4 ? " ko" : hits > 0 ? " hurt" : ""));
      c.appendChild(el("div", "cname", ch.name));
      c.appendChild(el("div", "cattr", a + " · " + eff.label));
      const pips = el("div", "pips");
      for (let i = 0; i < 4; i++) {
        const pip = el("span", "pip" + (i < hits ? " filled" : ""));
        pip.onclick = () => setChakra(a, hits === i + 1 ? i : i + 1);
        pips.appendChild(pip);
      }
      c.appendChild(pips);
      crow.appendChild(c);
    });
    chak.appendChild(crow);
    root.appendChild(chak);

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
  function bar(label, cur, max, cls, adjust) {
    const box = el("div", "poolbar " + cls);
    const pct = max > 0 ? Math.round((cur / max) * 100) : 0;
    const head = el("div", "poolbar-head");
    head.innerHTML = `<span>${label}</span><span class="poolbar-num">${cur} / ${max}</span>`;
    box.appendChild(head);
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill"); fill.style.width = pct + "%";
    track.appendChild(fill);
    box.appendChild(track);
    const ctr = el("div", "adjust-row");
    [[-5, "−5"], [-1, "−1"], [1, "+1"], [5, "+5"]].forEach(([n, t]) => {
      const b = el("button", "btn small ghost", t);
      b.onclick = () => adjust(n);
      ctr.appendChild(b);
    });
    const inp = el("input"); inp.type = "number"; inp.placeholder = "#"; inp.className = "adjust-input";
    const dmg = el("button", "btn small", label === "HP" ? "Damage" : "Spend");
    dmg.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjust(-Math.abs(v)); };
    const heal = el("button", "btn small", label === "HP" ? "Heal" : "Restore");
    heal.onclick = () => { const v = parseInt(inp.value, 10); if (v) adjust(Math.abs(v)); };
    ctr.appendChild(inp); ctr.appendChild(dmg); ctr.appendChild(heal);
    box.appendChild(ctr);
    return box;
  }
  function tile(label, val) {
    const t = el("div", "tile");
    t.innerHTML = `<div class="tile-val">${val}</div><div class="tile-label">${label}</div>`;
    return t;
  }
  // Soul Pool — XP + Soul Level tracker (leveling is GM-driven; XP thresholds are TBD), with the
  // Level Up button right beneath it. Opens the dedicated Level Up screen (app.js).
  function soulBar() {
    const box = el("div", "poolbar soul");
    const head = el("div", "poolbar-head");
    head.innerHTML = `<span>Soul Pool</span><span class="poolbar-num">Soul Level ${rec.level}${rec.level >= 30 ? " · MAX" : ""}</span>`;
    box.appendChild(head);
    box.appendChild(el("div", "soul-xp", `Experience: <b>${rec.xp || 0}</b> XP · leveling is GM-driven (thresholds being tuned)`));
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
        const cfg = el("div", "inv-cfg");
        const dsInp = el("input"); dsInp.type = "number"; dsInp.placeholder = "DS bonus"; dsInp.value = (it.dsBonus != null ? it.dsBonus : "");
        dsInp.onchange = () => setItemField(it, "dsBonus", parseInt(dsInp.value, 10) || 0);
        cfg.appendChild(labeled("Defense Score bonus", dsInp));
        detail.appendChild(cfg);
        detail.appendChild(el("div", "inv-note", it.equipped
          ? `Equipped: +${Number(it.dsBonus) || 0} to Defense Score.`
          : "Equip this to add its Defense Score bonus. (Armor rules are placeholder — house-adjustable.)"));
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
  function buildLimbsTab() {
    const root = el("div");
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Limb Damage — called shots"));
    p.appendChild(el("p", "hint", "A <b>called shot</b> (e.g. Marksmanship) damages a limb <b>and</b> your HP, capped at the limb's current HP — excess is lost. At 0 HP a limb is <b>crippled</b>. Long rest fully heals limbs; short rest restores half each."));
    PC.LIMBS.forEach((L) => {
      const cur = limbCurrent(L.key), max = limbMaxFor(L.key);
      const crippled = cur <= 0;
      const box = el("div", "limb-box" + (crippled ? " crippled" : ""));
      const head = el("div", "poolbar-head");
      head.innerHTML = `<span>${L.name}</span><span class="poolbar-num">${cur} / ${max}${crippled ? " · CRIPPLED" : ""}</span>`;
      box.appendChild(head);
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill limb"); fill.style.width = (max > 0 ? (cur / max) * 100 : 0) + "%";
      track.appendChild(fill); box.appendChild(track);
      if (crippled) box.appendChild(el("div", "limb-effect", "⚠ " + L.crippled));
      // controls
      const ctl = el("div", "adjust-row");
      const inp = el("input"); inp.type = "number"; inp.placeholder = "#"; inp.className = "adjust-input";
      const hit = el("button", "btn small", "⊕ Called Shot");
      hit.title = "Apply damage to this limb and HP (capped at limb HP)";
      hit.onclick = () => { const v = parseInt(inp.value, 10); if (v) calledShot(L.key, Math.abs(v)); };
      const heal = el("button", "btn small ghost", "Heal");
      heal.onclick = () => { const v = parseInt(inp.value, 10); if (v) healLimb(L.key, Math.abs(v)); };
      const full = el("button", "btn small ghost", "Full");
      full.onclick = () => healLimb(L.key, max);
      ctl.appendChild(inp); ctl.appendChild(hit); ctl.appendChild(heal); ctl.appendChild(full);
      box.appendChild(ctl);
      p.appendChild(box);
    });
    root.appendChild(p);
    return root;
  }

  /* ---------- Kinetics tab ---------- */
  function buildKineticsTab() {
    const root = el("div");
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
      lbl.textContent = `${a} ${PC.fmtMod(adjMod(a))}${isDisadv(a) ? " · disadv" : ""}${isLocked(a) ? " · LOCKED" : ""}`;
      skills.appendChild(lbl);
      const list = el("div", "skill-list");
      grp.forEach((s) => {
        const proficient = bg().skills.includes(s.name) || (rec.chosenSkills || []).includes(s.name);
        const mod = adjMod(a) + (proficient ? PC.profBonus(rec.level) : 0);
        const row = el("button", "skill-row" + (proficient ? " prof" : "") + (isLocked(a) ? " locked" : ""));
        row.innerHTML = `<span>${proficient ? "● " : "○ "}${s.name}${s.combat ? ' <span class="tag">⚔</span>' : ""}</span><span class="skmod">${PC.fmtMod(mod)}</span>`;
        row.disabled = isLocked(a);
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

    panel.appendChild(el("p", "hint", "Search the full game catalog and tap <b>Add</b> to put an item in your inventory. Weapons arrive attack-ready (type + damage set)."));

    const searchRow = el("div", "inv-form");
    const search = el("input"); search.type = "text"; search.placeholder = "Search items (e.g. rifle, staff, stimpak)…"; search.value = invSearchQ; search.className = "inv-name";
    const catFilter = el("select"); catFilter.className = "inv-cat";
    ["All", "Weapon", "Armor", "Consumable", "Tool", "Misc"].forEach((c) => { const o = el("option", null, c); o.value = c; catFilter.appendChild(o); });
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
        (!q || it.name.toLowerCase().indexOf(q) > -1 || (it.weaponType && it.weaponType.toLowerCase().indexOf(q) > -1) || (it.rarity && it.rarity.toLowerCase().indexOf(q) > -1) || (it.note && it.note.toLowerCase().indexOf(q) > -1)));
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
        else if (it.category === "Armor") meta += ` · +${it.dsBonus} DS`;
        else if (it.note) meta += ` · ${it.note}`;
        // Rarity tag for weapons (Common shown muted; higher rarities colored).
        const rarityTag = it.category === "Weapon" && it.rarity
          ? `<span class="rarity-tag rarity-${it.rarity.toLowerCase().replace(/\s+/g, "-")}">${it.rarity}</span>` : "";
        row.innerHTML = `<div class="cat-info"><span class="cat-name">${it.name}${rarityTag}</span><span class="cat-meta">${meta}</span></div><span class="cat-wt">${it.weight} lb</span>`;
        const add = el("button", "btn small primary", "＋ Add");
        add.onclick = () => addCatalogItem(it);
        row.appendChild(add);
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

    // ---- custom item ----
    inv.appendChild(el("div", "section-label", "Add a Custom Item"));
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

    // item list
    inv.appendChild(el("div", "section-label", "Carried Items"));
    if (!rec.inventory.length) inv.appendChild(el("div", "muted", "No items yet. Search the catalog or add a custom item above."));
    else {
      const list = el("div", "inv-list");
      rec.inventory.forEach((it, idx) => { list.appendChild(inventoryItem(it, idx)); });
      inv.appendChild(list);
    }
    root.appendChild(inv);
    return root;
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
