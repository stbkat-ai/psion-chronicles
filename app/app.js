/* ============================================================
   Psion Chronicles — Companion App
   Character Creator + saved roster. Depends on data.js, rules.js.
   Vanilla JS, localStorage persistence. Works on file://.
   ============================================================ */
(function () {
  "use strict";
  const $ = (sel, el) => (el || document).querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const STORE_KEY = "psion_chronicles_characters";

  /* ---------- persistence ---------- */
  function loadRoster() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveRoster(list) { localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = el("div", "toast"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- creator state ---------- */
  const STEPS = ["Identity", "Attributes", "Skills", "Techniques", "Review"];
  let state, step, rolled;
  let playId = null; // when set, we're in the live play sheet for this character id
  let levelUpId = null; // when set, we're in the level-up screen for this character id

  function newState() {
    return {
      id: "pc_" + Date.now().toString(36),
      name: "",
      player: "",
      level: 1,
      background: null,
      baseScores: { STR: null, AGI: null, CON: null, INT: null, WIS: null, CHA: null },
      chosenSkills: [],       // player-chosen (2), beyond background's 3
      chosenTechniques: [],   // player-chosen (2), beyond background's free technique
      equipmentChoices: [],   // selected option index per background equipment choice group
      startWeapon: null,      // chosen starting weapon name (from proficient weapon type)
      chakraHits: { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
      notes: "",
      createdAt: new Date().toISOString(),
    };
  }

  /* ---------- computed helpers ---------- */
  function bg() { return state.background ? PC.background(state.background) : null; }
  function boosts() { return bg() ? bg().boosts : {}; }
  function poolBoost() { return bg() ? bg().pool : { body: 0, mind: 0 }; }
  function bgSkills() { return bg() ? bg().skills : []; }
  function allScoresAssigned() { return PC.ATTRS.every((a) => Number.isFinite(state.baseScores[a])); }
  function effScores() { return PC.effectiveScores(state.baseScores, boosts(), null); }

  // Equipment choice groups for the current background (supports {fixed,choices} shape).
  function bgChoices() { const b = bg(); return b && b.equipment && Array.isArray(b.equipment.choices) ? b.equipment.choices : []; }
  function bgFixedEquip() { const b = bg(); return b && b.equipment && Array.isArray(b.equipment.fixed) ? b.equipment.fixed : []; }
  // A choice group that offers weapons is replaced by the dynamic starting-weapon picker.
  function isWeaponGroup(grp) {
    return grp && grp.options && grp.options[0] && grp.options[0].items && grp.options[0].items[0] && grp.options[0].items[0].category === "Weapon";
  }
  // Resolve a background's proficient weapon *type* (combat[0]; if it's a subtype, map to its parent type).
  function weaponTypeFor(b) {
    if (!b || !b.combat) return null;
    const c = b.combat[0];
    if (PC.WEAPON_TYPES.some((w) => w.name === c)) return c;
    const parent = PC.WEAPON_TYPES.find((w) => (w.subtypes || []).indexOf(c) > -1);
    return parent ? parent.name : c;
  }
  // Every catalog weapon of the current background's proficient weapon type.
  function eligibleStartWeapons() {
    const wt = weaponTypeFor(bg());
    return (window.PC.ITEMS || []).filter((it) => it.category === "Weapon" && it.weaponType === wt);
  }
  // The chosen starting weapon as an equipped, proficient inventory item.
  function chosenStartWeaponItem() {
    const list = eligibleStartWeapons();
    if (!list.length) return null;
    const it = list.find((w) => w.name === state.startWeapon) || list[0];
    return Object.assign({}, it, { qty: 1, equipped: true, proficient: true });
  }
  // Resolve the final item list: fixed gear + chosen starting weapon + selected option per non-weapon group.
  function resolveEquipment() {
    const out = bgFixedEquip().slice();
    const sw = chosenStartWeaponItem();
    if (sw) out.push(sw);
    bgChoices().forEach((grp, gi) => {
      if (isWeaponGroup(grp)) return; // replaced by the dynamic starting-weapon picker
      const idx = (state.equipmentChoices && state.equipmentChoices[gi] != null) ? state.equipmentChoices[gi] : 0;
      const opt = grp.options[idx] || grp.options[0];
      if (opt && Array.isArray(opt.items)) opt.items.forEach((it) => out.push(it));
    });
    return out;
  }

  /* ---------- root render ---------- */
  function render() {
    const app = $("#view");
    app.innerHTML = "";
    if (playId && window.PsionPlay) { window.PsionPlay.render(app, playId); return; }
    if (levelUpId) { app.appendChild(renderLevelUp(levelUpId)); return; }
    if (state) app.appendChild(renderStepper());
    if (!state) app.appendChild(renderRoster());
    else app.appendChild(renderStep());
  }

  /* ---------- roster (home) ---------- */
  function renderRoster() {
    const wrap = el("div");
    const head = el("div", "panel");
    head.appendChild(el("h2", null, "Your Characters"));
    head.appendChild(el("p", "hint", "Create and manage Psion Chronicles characters. Everything is saved right here in this browser."));
    const btn = el("button", "btn primary", "+ Create New Character");
    btn.onclick = startCreator;
    head.appendChild(btn);
    wrap.appendChild(head);

    const list = loadRoster();
    const panel = el("div", "panel");
    if (!list.length) {
      panel.appendChild(el("div", "empty", "No characters yet. Click <b>Create New Character</b> to begin your Post-Veil journey."));
    } else {
      const grid = el("div", "roster");
      list.forEach((c) => grid.appendChild(rosterCard(c)));
      panel.appendChild(grid);
    }
    wrap.appendChild(panel);
    return wrap;
  }

  function rosterCard(c) {
    const card = el("div", "roster-card");
    card.appendChild(el("h3", null, c.name || "Unnamed"));
    card.appendChild(el("div", "rmeta", `${c.background || "—"} · Soul Level ${c.level}`));
    const eff = PC.effectiveScores(c.baseScores, (PC.background(c.background) || {}).boosts || {}, null);
    const pb = (PC.background(c.background) || {}).pool || { body: 0, mind: 0 };
    const hp = PC.bodyPool(eff, pb), kp = PC.mindPool(eff, pb);
    const stats = el("div", "rstats");
    stats.innerHTML = `<div><b class="hpn">${hp}</b><span class="rmeta">HP</span></div>
                       <div><b class="kpn">${kp}</b><span class="rmeta">KP</span></div>`;
    card.appendChild(stats);
    const row = el("div", "nav-row");
    const del = el("button", "btn ghost small", "Delete");
    del.onclick = () => {
      if (confirm(`Delete ${c.name || "this character"}? This can't be undone.`)) {
        saveRoster(loadRoster().filter((x) => x.id !== c.id));
        render(); toast("Character deleted.");
      }
    };
    const edit = el("button", "btn ghost small", "✎ Edit");
    edit.onclick = () => editCharacter(c.id);
    const lvl = el("button", "btn ghost small", "⭐ Level Up");
    lvl.onclick = () => { levelUpId = c.id; state = null; playId = null; render(); };
    const play = el("button", "btn primary small", "▶ Play");
    play.onclick = () => { playId = c.id; state = null; render(); };
    row.appendChild(del);
    row.appendChild(edit);
    row.appendChild(lvl);
    row.appendChild(play);
    card.appendChild(row);
    return card;
  }

  function startCreator() { state = newState(); step = 0; rolled = null; render(); }

  function editCharacter(id) {
    const c = loadRoster().find((x) => x.id === id);
    if (!c) return;
    state = JSON.parse(JSON.stringify(c)); // work on a copy; Save writes back by id
    if (!Array.isArray(state.chosenSkills)) state.chosenSkills = [];
    if (!Array.isArray(state.chosenTechniques)) state.chosenTechniques = [];
    if (!Array.isArray(state.equipmentChoices)) state.equipmentChoices = [];
    if (!state.chakraHits) state.chakraHits = { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    state._editing = true;
    playId = null; step = 0; rolled = null;
    render();
  }

  /* ---------- stepper ---------- */
  function renderStepper() {
    const s = el("div", "stepper");
    STEPS.forEach((label, i) => {
      const pill = el("div", "step-pill" + (i === step ? " active" : "") + (i < step ? " done" : ""));
      pill.appendChild(el("span", "num", i < step ? "✓" : String(i + 1)));
      pill.appendChild(el("span", "lbl", label));
      pill.onclick = () => { if (i <= step || canReach(i)) { step = i; render(); } };
      s.appendChild(pill);
    });
    return s;
  }
  function canReach(i) {
    if (i <= 1) return true;
    if (i >= 2 && !(state.background && allScoresAssigned())) return false;
    return true;
  }

  /* ---------- step router ---------- */
  function renderStep() {
    switch (step) {
      case 0: return stepIdentity();
      case 1: return stepAttributes();
      case 2: return stepSkills();
      case 3: return stepTechniques();
      case 4: return stepReview();
    }
  }

  function navRow(backFn, nextFn, nextLabel, nextEnabled) {
    const row = el("div", "nav-row");
    const back = el("button", "btn ghost", "← Back");
    back.onclick = backFn;
    if (!backFn) back.style.visibility = "hidden";
    const next = el("button", "btn primary", nextLabel || "Next →");
    next.disabled = nextEnabled === false;
    next.onclick = nextFn;
    row.appendChild(back);
    row.appendChild(next);
    return row;
  }

  /* ---------- STEP 1: Identity + Background ---------- */
  function stepIdentity() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Identity <span class="sub">— who were you in the old world?</span>'));
    p.appendChild(el("p", "hint", "Name your character and choose a Psionic Background. Your Background is a starting point, not a class — it grants bonuses but never limits what you can become."));

    const nameL = el("label", "field");
    nameL.appendChild(el("span", null, "Character name"));
    const nameI = el("input"); nameI.type = "text"; nameI.value = state.name;
    nameI.placeholder = "e.g. Kaelen Vth";
    nameI.oninput = () => (state.name = nameI.value);
    nameL.appendChild(nameI);
    p.appendChild(nameL);

    const playerL = el("label", "field");
    playerL.appendChild(el("span", null, "Player name (optional)"));
    const playerI = el("input"); playerI.type = "text"; playerI.value = state.player;
    playerI.oninput = () => (state.player = playerI.value);
    playerL.appendChild(playerI);
    p.appendChild(playerL);

    p.appendChild(el("div", "section-label", "Psionic Background"));
    const grid = el("div", "bg-grid");
    PC.BACKGROUNDS.forEach((b) => {
      const card = el("div", "bg-card" + (state.background === b.name ? " selected" : ""));
      card.appendChild(el("h3", null, b.name));
      card.appendChild(el("div", "blurb", b.blurb));
      const kin = PC.kinetic(b.combat[1]);
      const boostStr = Object.entries(b.boosts).map(([k, v]) => `+${v} ${k}`).join(", ");
      const poolStr = [b.pool.body ? `Body +${b.pool.body}` : "", b.pool.mind ? `Mind +${b.pool.mind}` : ""].filter(Boolean).join(", ");
      const meta = el("div", "meta");
      meta.innerHTML =
        `<span class="badge">${boostStr}</span>` +
        `<span class="badge">${poolStr}</span>` +
        `<span class="badge psi">${b.combat[1]}${kin ? " · " + kin.attr : ""}</span>`;
      card.appendChild(meta);
      if (b.equipment) {
        const eqp = el("div", "bg-equip");
        const lines = [];
        lines.push(`<div><b>Weapon:</b> any ${weaponTypeFor(b)}</div>`);
        (b.equipment.choices || []).forEach((grp) => {
          if (isWeaponGroup(grp)) return; // shown as the dynamic weapon line above
          lines.push(`<div><b>${grp.label}:</b> ${grp.options.map((o) => o.label).join(" / ")}</div>`);
        });
        const fixedNames = (b.equipment.fixed || []).map((i) => i.name + (i.qty > 1 ? " ×" + i.qty : "")).join(", ");
        if (fixedNames) lines.push(`<div><b>Also:</b> ${fixedNames}</div>`);
        eqp.innerHTML = "🎒 " + lines.join("");
        card.appendChild(eqp);
      }
      card.onclick = () => {
        state.background = b.name;
        // Drop any chosen skills now granted by this background, and a chosen
        // technique that equals this background's free one (avoid duplicates).
        state.chosenSkills = (state.chosenSkills || []).filter((s) => !b.skills.includes(s));
        if (b.freeTech) state.chosenTechniques = (state.chosenTechniques || []).filter((t) => t !== b.freeTech);
        // default each equipment choice group to its first option; reset the starting weapon
        state.equipmentChoices = (b.equipment && b.equipment.choices ? b.equipment.choices : []).map(() => 0);
        state.startWeapon = null;
        render();
      };
      grid.appendChild(card);
    });
    p.appendChild(grid);

    if (state.background) {
      const b = bg();
      const detail = el("div");
      detail.style.marginTop = "16px";
      detail.appendChild(el("div", "section-label", `${b.name} grants`));
      const list = el("div", "pill-list");
      b.skills.forEach((s) => list.appendChild(el("span", "pill prof", s)));
      b.combat.forEach((c) => list.appendChild(el("span", "pill psi", c)));
      if (b.freeTech) list.appendChild(el("span", "pill", "Free: " + b.freeTech));
      detail.appendChild(list);
      p.appendChild(detail);

      // Starting equipment chooser (new characters pick their loadout; editing keeps existing inventory)
      if (!state._editing && (bgFixedEquip().length || bgChoices().length)) {
        const eq = el("div"); eq.style.marginTop = "16px";
        eq.appendChild(el("div", "section-label", "Starting Equipment — choose your loadout"));
        if (bgFixedEquip().length) {
          const fx = el("div", "pill-list"); fx.style.marginBottom = "10px";
          bgFixedEquip().forEach((it) => fx.appendChild(el("span", "pill", it.name + (it.qty > 1 ? " ×" + it.qty : ""))));
          eq.appendChild(fx);
        }
        // Starting weapon — any weapon of the background's proficient weapon type.
        const wt = weaponTypeFor(b);
        const eligible = eligibleStartWeapons();
        if (eligible.length) {
          eq.appendChild(el("div", "eq-choice-label", `Starting weapon — any ${wt} (you're proficient)`));
          const wsel = el("select"); wsel.className = "inv-cat"; wsel.style.maxWidth = "340px";
          const chosen = state.startWeapon && eligible.some((w) => w.name === state.startWeapon) ? state.startWeapon : eligible[0].name;
          wsel.innerHTML = eligible.map((w) => `<option value="${w.name}" ${w.name === chosen ? "selected" : ""}>${w.name} (${w.damage})</option>`).join("");
          wsel.onchange = () => { state.startWeapon = wsel.value; render(); };
          eq.appendChild(wsel);
        }
        // Remaining (non-weapon) choice groups.
        bgChoices().forEach((grp, gi) => {
          if (isWeaponGroup(grp)) return; // replaced by the starting-weapon dropdown above
          eq.appendChild(el("div", "eq-choice-label", grp.label));
          const chips = el("div", "chips");
          grp.options.forEach((opt, oi) => {
            const sel = (state.equipmentChoices[gi] != null ? state.equipmentChoices[gi] : 0) === oi;
            const chip = el("div", "chip" + (sel ? " selected" : ""), opt.label);
            chip.onclick = () => { state.equipmentChoices[gi] = oi; render(); };
            chips.appendChild(chip);
          });
          eq.appendChild(chips);
        });
        p.appendChild(eq);
      }
    }

    p.appendChild(navRow(() => { state = null; render(); }, () => { step = 1; render(); }, "Next →", !!(state.name.trim() && state.background)));
    // Repurpose the hidden back as "cancel to roster"
    const back = $(".btn.ghost", p);
    back.style.visibility = "visible"; back.textContent = "✕ Cancel";
    return p;
  }

  /* ---------- STEP 2: Attributes ---------- */
  function stepAttributes() {
    // When editing an existing character (scores already set, no active roll),
    // default to manual mode so the current scores show in editable fields.
    if (!rolled && allScoresAssigned()) rolled = { manual: true };
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Attributes <span class="sub">— roll 8d12, drop the two lowest, add 10</span>'));
    p.appendChild(el("p", "hint", "Roll your six attribute scores, then assign each value to an attribute. Your Background bonus is added on top automatically."));

    // Roller
    const rollBar = el("div");
    const rollBtn = el("button", "btn primary", rolled ? "⟳ Re-roll" : "🎲 Roll Attributes");
    rollBtn.onclick = () => { rolled = PC.rollAttributeSet(); state.baseScores = { STR: null, AGI: null, CON: null, INT: null, WIS: null, CHA: null }; render(); };
    rollBar.appendChild(rollBtn);
    const manualBtn = el("button", "btn ghost small", "Enter manually instead");
    manualBtn.style.marginLeft = "10px";
    manualBtn.onclick = () => { rolled = { manual: true, values: [] }; state.baseScores = { STR: null, AGI: null, CON: null, INT: null, WIS: null, CHA: null }; render(); };
    rollBar.appendChild(manualBtn);
    p.appendChild(rollBar);

    if (rolled && !rolled.manual) {
      const sorted = rolled.rolls.slice().sort((a, b) => b - a);
      const dropCut = sorted.slice(6); // two lowest
      const pool = el("div", "dice-pool");
      // show the 8 raw dice, marking dropped
      const droppedCopy = dropCut.slice();
      rolled.rolls.forEach((r) => {
        let cls = "die";
        const idx = droppedCopy.indexOf(r);
        if (idx > -1) { cls += " dropped"; droppedCopy.splice(idx, 1); }
        pool.appendChild(el("div", cls, String(r)));
      });
      p.appendChild(el("div", "section-label", "Rolled 8d12 (two lowest dropped)"));
      p.appendChild(pool);
      const finals = el("div", "dice-pool");
      rolled.values.forEach((v) => finals.appendChild(el("div", "die value", String(v))));
      p.appendChild(el("div", "section-label", "Your six values (+10 each) — assign below"));
      p.appendChild(finals);
    }

    // Attribute assignment grid
    const grid = el("div", "attr-grid");
    const eff = allScoresAssigned() ? effScores() : null;
    PC.ATTRS.forEach((a) => {
      const isBody = PC.BODY_ATTRS.includes(a);
      const card = el("div", "attr-card " + (isBody ? "body" : "mind"));
      card.appendChild(el("div", "code", a));
      card.appendChild(el("div", "name", PC.ATTR_NAMES[a]));

      if (rolled && !rolled.manual) {
        // dropdown to pick one of the rolled values (each usable once)
        const sel = el("select");
        sel.appendChild(el("option", null, "—")).value = "";
        const usedElsewhere = {};
        PC.ATTRS.forEach((b2) => { if (b2 !== a && Number.isFinite(state.baseScores[b2])) usedElsewhere[b2] = state.baseScores[b2]; });
        // Build available multiset from rolled.values minus those assigned to other attrs
        const avail = rolled.values.slice();
        Object.values(usedElsewhere).forEach((v) => { const i = avail.indexOf(v); if (i > -1) avail.splice(i, 1); });
        const cur = state.baseScores[a];
        const options = avail.slice();
        if (Number.isFinite(cur)) options.push(cur);
        options.sort((x, y) => y - x);
        // unique display but allow duplicates
        sel.innerHTML = '<option value="">—</option>' + options.map((v) => `<option value="${v}" ${v === cur ? "selected" : ""}>${v}</option>`).join("");
        sel.onchange = () => {
          state.baseScores[a] = sel.value === "" ? null : Number(sel.value);
          render();
        };
        card.appendChild(el("div", "score", Number.isFinite(cur) ? String(cur) : "—"));
        card.appendChild(sel);
      } else if (rolled && rolled.manual) {
        const inp = el("input"); inp.type = "number"; inp.min = 1; inp.max = 40;
        inp.value = Number.isFinite(state.baseScores[a]) ? state.baseScores[a] : "";
        inp.placeholder = "score";
        inp.oninput = () => { state.baseScores[a] = inp.value === "" ? null : Number(inp.value); scheduleReflow(); };
        card.appendChild(inp);
      } else {
        card.appendChild(el("div", "score", "—"));
      }

      // boost + modifier preview
      const bst = boosts()[a] || 0;
      card.appendChild(el("div", "boost", bst ? `Background +${bst}` : ""));
      if (eff) {
        card.appendChild(el("div", "modpill", "mod " + PC.fmtMod(PC.abilityMod(eff[a]))));
        if (bst) { const s = $(".score", card); if (s) s.textContent = eff[a] + ""; }
      }
      grid.appendChild(card);
    });
    p.appendChild(el("div", "section-label", "Assign values"));
    p.appendChild(grid);

    // live pools + derived preview
    if (allScoresAssigned()) {
      p.appendChild(livePreview(eff));
    }

    p.appendChild(navRow(() => { step = 0; render(); }, () => { step = 2; render(); }, "Next →", allScoresAssigned()));
    return p;
  }

  let _reflow;
  function scheduleReflow() { clearTimeout(_reflow); _reflow = setTimeout(render, 350); }

  function livePreview(eff) {
    const box = el("div");
    box.style.marginTop = "18px";
    const d = PC.derive(eff, state.level);
    const hp = PC.bodyPool(eff, poolBoost()), kp = PC.mindPool(eff, poolBoost());
    box.appendChild(el("div", "section-label", "Live totals"));
    const pools = el("div", "pools");
    pools.innerHTML =
      `<div class="poolbox hp"><div class="plabel"><span>Body Pool → HP</span></div><div class="pval">${hp}</div></div>
       <div class="poolbox kp"><div class="plabel"><span>Mind Pool → KP</span></div><div class="pval">${kp}</div></div>`;
    box.appendChild(pools);
    const grid = el("div", "sheet-grid");
    grid.style.marginTop = "12px";
    const left = el("div");
    [["Defense Score", d.defenseScore],
     ["Movement", d.movement + " ft"],
     ["Initiative", "d20 " + PC.fmtMod(d.initiativeMod)],
     ["Proficiency Bonus", PC.fmtMod(d.profBonus)]].forEach(([k, v]) => {
      const l = el("div", "stat-line"); l.innerHTML = `<span>${k}</span><span>${v}</span>`; left.appendChild(l);
    });
    const right = el("div");
    [["Climb speed", d.climb + " ft"],
     ["Jump distance", d.jump + " ft"],
     ["Swim speed", d.swim + " ft"],
     ["Carry weight", d.carry + " lb"]].forEach(([k, v]) => {
      const l = el("div", "stat-line"); l.innerHTML = `<span>${k}</span><span>${v}</span>`; right.appendChild(l);
    });
    grid.appendChild(left); grid.appendChild(right);
    box.appendChild(grid);
    return box;
  }

  /* ---------- STEP 3: Skills ---------- */
  function stepSkills() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Skill Proficiencies <span class="sub">— choose 2 more</span>'));
    p.appendChild(el("p", "hint", "Your Background already granted 3 skill proficiencies. Choose 2 additional skills to be proficient in. Proficient skills add your proficiency bonus to their checks."));

    const granted = bgSkills();
    const counter = el("div", "counter");
    const updateCounter = () => counter.innerHTML = `Chosen: <b>${state.chosenSkills.length}</b> / 2`;

    p.appendChild(el("div", "section-label", "From your Background (locked in)"));
    const glist = el("div", "pill-list");
    granted.forEach((s) => glist.appendChild(el("span", "pill prof", s + " ✓")));
    p.appendChild(glist);

    p.appendChild(el("div", "section-label", "Choose 2 more"));
    PC.ATTRS.forEach((attr) => {
      const grp = PC.skillsByAttr(attr);
      const label = el("div"); label.style.margin = "10px 0 6px"; label.style.color = "var(--text-dim)"; label.style.fontSize = ".8rem";
      label.textContent = `${PC.ATTR_NAMES[attr]} (${attr})`;
      p.appendChild(label);
      const chips = el("div", "chips");
      grp.forEach((s) => {
        const isGranted = granted.includes(s.name);
        const isChosen = state.chosenSkills.includes(s.name);
        const chip = el("div", "chip" + (isGranted ? " locked" : "") + (isChosen ? " selected" : ""));
        chip.title = s.desc + (s.combat ? "\n\nCombat use: " + s.combat : "");
        chip.innerHTML = s.name + (isGranted ? '<span class="tag">background</span>' : (s.combat ? '<span class="tag">combat</span>' : ""));
        if (!isGranted) {
          chip.onclick = () => {
            const i = state.chosenSkills.indexOf(s.name);
            if (i > -1) state.chosenSkills.splice(i, 1);
            else if (state.chosenSkills.length < 2) state.chosenSkills.push(s.name);
            else { toast("You can only choose 2 extra skills. Deselect one first."); return; }
            render();
          };
        }
        chips.appendChild(chip);
      });
      p.appendChild(chips);
    });

    updateCounter();
    p.appendChild(counter);
    p.appendChild(navRow(() => { step = 1; render(); }, () => { step = 3; render(); }, "Next →", state.chosenSkills.length === 2));
    return p;
  }

  /* ---------- STEP 4: Techniques ---------- */
  function stepTechniques() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Kinetic Techniques <span class="sub">— choose 2 from any school</span>'));
    p.appendChild(el("p", "hint", "New characters start with their Background's free technique plus 2 techniques of their choice from ANY of the 18 Kinetics. (The technique library is still being written — more schools coming soon.)"));

    const b = bg();
    if (b && b.freeTech) {
      p.appendChild(el("div", "section-label", "Free from your Background"));
      const t = PC.technique(b.freeTech);
      if (t) p.appendChild(techCard(t, "free"));
      else {
        const card = el("div", "tech-card free");
        card.innerHTML = `<div class="thead"><span class="tname">${b.freeTech}</span></div><div class="tdesc">Details coming soon — this technique isn't in the library yet, but your character starts knowing it.</div>`;
        p.appendChild(card);
      }
    } else if (b && !b.freeTech) {
      p.appendChild(el("div", "section-label", "Free from your Background"));
      const card = el("div", "tech-card free");
      card.innerHTML = `<div class="thead"><span class="tname">${b.combat[1]} beginner technique</span><span class="freeflag">TBD</span></div><div class="tdesc">Your ${state.background}'s free ${b.combat[1]} technique is still being designed. You'll add it once it's written.</div>`;
      p.appendChild(card);
    }

    p.appendChild(el("div", "section-label", "Choose 2 techniques (all 18 schools open to everyone)"));
    const counter = el("div", "counter");
    counter.innerHTML = `Chosen: <b>${state.chosenTechniques.length}</b> / 2`;
    p.appendChild(counter);

    // group by kinetic (creation only offers Beginner-tier techniques)
    const byKin = {};
    PC.TECHNIQUES.filter((t) => t.tier === "Beginner").forEach((t) => { (byKin[t.kinetic] = byKin[t.kinetic] || []).push(t); });
    Object.keys(byKin).forEach((kin) => {
      const k = PC.kinetic(kin);
      const label = el("div"); label.style.margin = "12px 0 6px"; label.style.color = "var(--psi-bright)"; label.style.fontSize = ".82rem";
      label.textContent = `${kin} — ${k.attr} · ${k.role} · ${PC.CHAKRAS[k.attr].name} chakra`;
      p.appendChild(label);
      byKin[kin].forEach((t) => {
        const chosen = state.chosenTechniques.includes(t.name);
        const isFree = b && b.freeTech === t.name;
        const card = techCard(t, isFree ? "free" : (chosen ? "selected" : ""));
        if (!isFree) {
          card.onclick = () => {
            const i = state.chosenTechniques.indexOf(t.name);
            if (i > -1) state.chosenTechniques.splice(i, 1);
            else if (state.chosenTechniques.length < 2) state.chosenTechniques.push(t.name);
            else { toast("Choose only 2 techniques. Deselect one first."); return; }
            render();
          };
        }
        p.appendChild(card);
      });
    });

    const note = el("p", "hint");
    note.style.marginTop = "16px";
    note.innerHTML = "All 18 Kinetics' <b>Beginner</b> techniques are available — pick any 2 from any school. (Higher tiers unlock as you level up, once that system is added.)";
    p.appendChild(note);

    p.appendChild(navRow(() => { step = 2; render(); }, () => { step = 4; render(); }, "Review →", state.chosenTechniques.length === 2));
    return p;
  }

  function techCard(t, mode) {
    const card = el("div", "tech-card " + (mode || ""));
    const costParts = ["" + t.kp + " KP"];
    if (t.upkeep) costParts.push("+" + t.upkeep + "/turn");
    card.innerHTML =
      `<div class="thead"><span class="tname">${t.name} ${mode === "free" ? '<span class="freeflag">free</span>' : ""}</span><span class="cost">${costParts.join(" ")}</span></div>
       <div class="tmeta">${t.kinetic} · ${t.tier} · ${t.action}</div>
       <div class="tdesc">${t.desc}</div>
       <div class="teff">▸ ${t.effect}</div>`;
    return card;
  }

  /* ---------- STEP 5: Review ---------- */
  function stepReview() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, state._editing
      ? 'Review & Update <span class="sub">— save your changes</span>'
      : 'Review & Save <span class="sub">— your finished character</span>'));

    const eff = effScores();
    const d = PC.derive(eff, state.level);
    const hp = PC.bodyPool(eff, poolBoost()), kp = PC.mindPool(eff, poolBoost());
    const b = bg();

    const head = el("div");
    head.innerHTML = `<h3 style="margin:0;font-size:1.4rem">${state.name || "Unnamed"}</h3>
      <div style="color:var(--text-dim)">${state.background} · Soul Level ${state.level}${state.player ? " · Player: " + state.player : ""}</div>`;
    p.appendChild(head);

    // pools
    const pools = el("div", "pools"); pools.style.marginTop = "14px";
    pools.innerHTML =
      `<div class="poolbox hp"><div class="plabel"><span>HP (Body Pool)</span><span>current / max</span></div><div class="pval">${hp} / ${hp}</div></div>
       <div class="poolbox kp"><div class="plabel"><span>KP (Mind Pool)</span><span>current / max</span></div><div class="pval">${kp} / ${kp}</div></div>`;
    p.appendChild(pools);

    // attributes
    p.appendChild(el("div", "section-label", "Attributes"));
    const ag = el("div", "attr-grid");
    PC.ATTRS.forEach((a) => {
      const isBody = PC.BODY_ATTRS.includes(a);
      const card = el("div", "attr-card " + (isBody ? "body" : "mind"));
      card.innerHTML = `<div class="code">${a}</div><div class="name">${PC.ATTR_NAMES[a]}</div>
        <div class="score">${eff[a]}</div><div class="modpill">mod ${PC.fmtMod(PC.abilityMod(eff[a]))}</div>`;
      ag.appendChild(card);
    });
    p.appendChild(ag);

    // derived
    p.appendChild(el("div", "section-label", "Derived Stats"));
    const grid = el("div", "sheet-grid");
    const L = el("div"), Rr = el("div");
    [["Defense Score", d.defenseScore], ["Movement", d.movement + " ft"], ["Climb", d.climb + " ft"], ["Jump", d.jump + " ft"], ["Initiative", "d20 " + PC.fmtMod(d.initiativeMod)]]
      .forEach(([k, v]) => L.appendChild(statLine(k, v)));
    [["Swim", d.swim + " ft"], ["Carry weight", d.carry + " lb"], ["Proficiency", PC.fmtMod(d.profBonus)], ["Free technique", b.freeTech || "(TBD)"], ["Kinetic focus", b.combat[1]]]
      .forEach(([k, v]) => Rr.appendChild(statLine(k, v)));
    grid.appendChild(L); grid.appendChild(Rr);
    p.appendChild(grid);

    // chakras
    p.appendChild(el("div", "section-label", "Chakra Chart (all healthy at creation)"));
    const crow = el("div", "chakra-row");
    PC.ATTRS.forEach((a) => {
      const ch = PC.CHAKRAS[a];
      const c = el("div", "chakra");
      c.innerHTML = `<div class="cname">${ch.name}</div><div class="cattr">${a}</div>
        <div class="pips">${[0,1,2,3].map(() => '<span class="pip"></span>').join("")}</div>`;
      crow.appendChild(c);
    });
    p.appendChild(crow);

    // skills
    p.appendChild(el("div", "section-label", "Skill Proficiencies"));
    const sk = el("div", "pill-list");
    bgSkills().forEach((s) => sk.appendChild(el("span", "pill prof", s)));
    state.chosenSkills.forEach((s) => sk.appendChild(el("span", "pill prof", s)));
    p.appendChild(sk);

    // combat profs
    p.appendChild(el("div", "section-label", "Combat Proficiencies"));
    const cp = el("div", "pill-list");
    b.combat.forEach((c) => cp.appendChild(el("span", "pill psi", c)));
    p.appendChild(cp);

    // starting equipment (new characters only; editing keeps the character's own inventory)
    if (!state._editing) {
      const resolved = resolveEquipment();
      if (resolved.length) {
        p.appendChild(el("div", "section-label", "Starting Equipment"));
        const eq = el("div", "pill-list");
        resolved.forEach((it) => {
          const qty = it.qty > 1 ? ` ×${it.qty}` : "";
          const tag = it.equipped ? " ✓" : "";
          eq.appendChild(el("span", "pill", `${it.name}${qty}${tag}`));
        });
        p.appendChild(eq);
      }
    }

    // techniques
    p.appendChild(el("div", "section-label", "Known Techniques"));
    if (b.freeTech && PC.technique(b.freeTech)) p.appendChild(techCard(PC.technique(b.freeTech), "free"));
    else if (b.freeTech) { const c = el("div","tech-card free"); c.innerHTML = `<div class="tname">${b.freeTech}</div><div class="tdesc">(details TBD)</div>`; p.appendChild(c); }
    state.chosenTechniques.forEach((n) => { const t = PC.technique(n); if (t) p.appendChild(techCard(t, "")); });

    // notes
    const nl = el("label", "field"); nl.style.marginTop = "16px";
    nl.appendChild(el("span", null, "Notes / backstory (optional)"));
    const nt = el("textarea"); nt.rows = 3; nt.value = state.notes;
    nt.oninput = () => (state.notes = nt.value);
    nl.appendChild(nt);
    p.appendChild(nl);

    // save
    const row = el("div", "nav-row");
    const back = el("button", "btn ghost", "← Back");
    back.onclick = () => { step = 3; render(); };
    const save = el("button", "btn primary", state._editing ? "✓ Update Character" : "✓ Save Character");
    save.onclick = () => {
      const list = loadRoster();
      const idx = list.findIndex((c) => c.id === state.id);
      const record = JSON.parse(JSON.stringify(state));
      const wasEditing = record._editing;
      delete record._editing;
      // New character: seed inventory with the chosen starting equipment (fixed + selected options).
      if (!wasEditing && !Array.isArray(record.inventory)) {
        record.inventory = resolveEquipment().map((it, i) =>
          Object.assign({}, it, { id: "it_start_" + i + "_" + it.name.replace(/\s+/g, "").slice(0, 6) }));
      }
      // Keep any in-progress play state valid: clamp current HP/KP to new maxes.
      if (record.play) {
        const eff = PC.effectiveScores(record.baseScores, boosts(), null);
        const mHP = PC.bodyPool(eff, poolBoost()), mKP = PC.mindPool(eff, poolBoost());
        if (typeof record.play.hp === "number") record.play.hp = Math.min(record.play.hp, mHP);
        if (typeof record.play.kp === "number") record.play.kp = Math.min(record.play.kp, mKP);
      }
      if (idx > -1) list[idx] = record; else list.push(record);
      saveRoster(list);
      toast(state._editing ? "Character updated!" : "Character saved!");
      state = null; render();
    };
    row.appendChild(back); row.appendChild(save);
    p.appendChild(row);
    return p;
  }

  function statLine(k, v) { const l = el("div", "stat-line"); l.innerHTML = `<span>${k}</span><span>${v}</span>`; return l; }

  /* ---------- Level Up ---------- */
  function tileEl(label, val) {
    const t = el("div", "tile");
    t.innerHTML = `<div class="tile-val">${val}</div><div class="tile-label">${label}</div>`;
    return t;
  }
  function techLearnCard(t, onLearn, disabled) {
    const c = el("div", "tech-card");
    const cost = [t.kp + " KP"]; if (t.upkeep) cost.push("+" + t.upkeep + "/turn");
    c.innerHTML =
      `<div class="thead"><span class="tname">${t.name}</span><span class="cost">${cost.join(" ")}</span></div>
       <div class="tmeta">${t.kinetic} · ${t.tier} · ${t.action}</div>
       <div class="teff">▸ ${t.effect}</div>`;
    const btn = el("button", "btn small primary", "Learn (1 TP)");
    btn.disabled = !!disabled; btn.style.marginTop = "8px";
    btn.onclick = onLearn;
    c.appendChild(btn);
    return c;
  }

  function renderLevelUp(id) {
    const rec = loadRoster().find((c) => c.id === id);
    if (!rec) { levelUpId = null; return renderRoster(); }
    if (typeof rec.level !== "number") rec.level = 1;
    if (!Array.isArray(rec.learnedTechniques)) rec.learnedTechniques = [];
    if (!rec.levelAttr) rec.levelAttr = { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    const b = PC.background(rec.background);

    const persist = () => {
      const l = loadRoster(); const i = l.findIndex((c) => c.id === id);
      if (i > -1) { l[i] = rec; saveRoster(l); }
      render();
    };

    const level = rec.level;
    const earnedTP = Math.max(0, level - 1);
    const availTP = earnedTP - rec.learnedTechniques.length;
    const spentAttr = PC.ATTRS.reduce((s, a) => s + (rec.levelAttr[a] || 0), 0);
    const earnedAttr = Math.floor((level - 1) / 2);
    const availAttr = earnedAttr - spentAttr;
    const tierGate = { Beginner: 1, Adept: 8, Expert: 15, Master: 22 };
    const prevTier = { Adept: "Beginner", Expert: "Adept", Master: "Expert" };
    const tierUnlocked = (tier) => level >= (tierGate[tier] || 99);
    // Count how many known techniques belong to a given Kinetic + tier.
    const countKnownIn = (kin, tier) => known().filter((n) => { const t = PC.technique(n); return t && t.kinetic === kin && t.tier === tier; }).length;
    // A higher tier of a Kinetic also requires ≥3 known techniques from that Kinetic's previous tier.
    const tierPrereqMet = (t) => t.tier === "Beginner" || countKnownIn(t.kinetic, prevTier[t.tier]) >= 3;
    const known = () => {
      const n = [];
      if (b.freeTech) n.push(b.freeTech);
      (rec.chosenTechniques || []).forEach((x) => { if (!n.includes(x)) n.push(x); });
      (rec.learnedTechniques || []).forEach((x) => { if (!n.includes(x)) n.push(x); });
      return n;
    };

    const wrap = el("div");

    // header
    const head = el("div", "play-head");
    const back = el("button", "btn ghost small", "← Characters");
    back.onclick = () => { levelUpId = null; render(); };
    const title = el("div");
    title.innerHTML = `<h2 style="margin:0">${rec.name || "Unnamed"} — Level Up</h2>
      <div style="color:var(--text-dim);font-size:.86rem">${rec.background} · Soul Level ${level} · Prof ${PC.fmtMod(PC.profBonus(level))}</div>`;
    const lvlBtn = el("button", "btn primary small", level >= 30 ? "Max Level (30)" : `⭐ Level Up → ${level + 1}`);
    lvlBtn.disabled = level >= 30;
    lvlBtn.onclick = () => { if (rec.level < 30) { rec.level++; toast(`Leveled up to Soul Level ${rec.level}!`); persist(); } };
    head.appendChild(back); head.appendChild(title); head.appendChild(lvlBtn);
    wrap.appendChild(head);

    // XP note
    const xp = el("div", "panel");
    xp.appendChild(el("p", "hint", "Leveling is GM-driven: when your GM says you've reached the next XP threshold, tap <b>Level Up</b>. Each level grants +1 Technique Point; odd levels also grant +1 attribute point. (Exact XP thresholds are being tuned.)"));
    wrap.appendChild(xp);

    // points summary + milestones
    const pts = el("div", "panel");
    pts.appendChild(el("div", "section-label", "Points to Spend"));
    const tr = el("div", "tile-row");
    tr.appendChild(tileEl("Technique Points", availTP + " / " + earnedTP));
    tr.appendChild(tileEl("Attribute Points", availAttr + " / " + earnedAttr));
    pts.appendChild(tr);
    if (level >= 15) pts.appendChild(el("p", "hint", "★ <b>Otherkin unlocked</b> — your Soul Creature awakens (mechanics coming soon)."));
    wrap.appendChild(pts);

    // attribute allocation
    const ap = el("div", "panel");
    ap.appendChild(el("div", "section-label", `Attributes — ${availAttr} point${availAttr === 1 ? "" : "s"} to allocate (cap 30 via leveling)`));
    const ag = el("div", "attr-grid");
    PC.ATTRS.forEach((a) => {
      const isBody = PC.BODY_ATTRS.includes(a);
      const score = rec.baseScores[a];
      const card = el("div", "attr-card " + (isBody ? "body" : "mind"));
      card.innerHTML = `<div class="code">${a}</div><div class="name">${PC.ATTR_NAMES[a]}</div>
        <div class="score">${score}</div><div class="modpill">mod ${PC.fmtMod(PC.abilityMod(score))}</div>`;
      const ctl = el("div", "inv-qty-ctl"); ctl.style.justifyContent = "center"; ctl.style.marginTop = "8px";
      const minus = el("button", "btn small ghost", "−");
      minus.disabled = (rec.levelAttr[a] || 0) <= 0;
      minus.onclick = () => { rec.baseScores[a]--; rec.levelAttr[a]--; persist(); };
      const plus = el("button", "btn small ghost", "+");
      plus.disabled = availAttr <= 0 || score >= 30;
      plus.onclick = () => { rec.baseScores[a]++; rec.levelAttr[a] = (rec.levelAttr[a] || 0) + 1; persist(); };
      ctl.appendChild(minus); ctl.appendChild(plus);
      card.appendChild(ctl);
      ag.appendChild(card);
    });
    ap.appendChild(ag);
    wrap.appendChild(ap);

    // learn techniques
    const tp = el("div", "panel");
    tp.appendChild(el("div", "section-label", `Learn Techniques — ${availTP} TP available (1 each)`));
    const tiers = ["Beginner", "Adept", "Expert", "Master"];
    tp.appendChild(el("p", "hint", `Unlocked at Soul Level ${level}: <b>${tiers.filter(tierUnlocked).join(", ")}</b>${tiers.some((t) => !tierUnlocked(t)) ? " — higher tiers unlock as you level" : ""}.`));

    const knownNames = known();
    tp.appendChild(el("div", "eq-choice-label", "Known techniques"));
    const kl = el("div", "pill-list");
    knownNames.forEach((n) => {
      const learned = rec.learnedTechniques.includes(n);
      const pill = el("span", "pill" + (learned ? " psi" : ""), n + (learned ? " ✕" : ""));
      if (learned) { pill.style.cursor = "pointer"; pill.title = "Unlearn (refund 1 TP)"; pill.onclick = () => { rec.learnedTechniques = rec.learnedTechniques.filter((x) => x !== n); persist(); }; }
      kl.appendChild(pill);
    });
    tp.appendChild(kl);

    tp.appendChild(el("p", "hint", "To unlock a Kinetic's next tier you must reach its level gate <b>and</b> already know at least <b>3 techniques from that Kinetic's previous tier</b>."));
    tp.appendChild(el("div", "eq-choice-label", "Learnable"));
    if (availTP <= 0) tp.appendChild(el("div", "muted", "No Technique Points available — level up to earn more."));
    else {
      const learnable = PC.TECHNIQUES.filter((t) => tierUnlocked(t.tier) && tierPrereqMet(t) && knownNames.indexOf(t.name) < 0);
      const byKin = {};
      learnable.forEach((t) => { (byKin[t.kinetic] = byKin[t.kinetic] || []).push(t); });
      if (!Object.keys(byKin).length) tp.appendChild(el("div", "muted", "Nothing learnable right now — reach a tier's level gate and know 3 from the prior tier to open the next."));
      Object.keys(byKin).forEach((kin) => {
        tp.appendChild(el("div", "skill-attr-label", kin));
        byKin[kin].forEach((t) => tp.appendChild(techLearnCard(t, () => { rec.learnedTechniques.push(t.name); persist(); }, false)));
      });
      // Show which higher tiers are close but locked, and why.
      const lockNotes = [];
      ["Adept", "Expert", "Master"].forEach((tier) => {
        const kins = {};
        PC.TECHNIQUES.forEach((t) => { if (t.tier === tier) kins[t.kinetic] = true; });
        Object.keys(kins).forEach((kin) => {
          const haveAny = known().some((n) => { const k = PC.technique(n); return k && k.kinetic === kin; });
          if (!haveAny) return; // only nag about kinetics the character is pursuing
          const needLevel = !tierUnlocked(tier);
          const needPrereq = countKnownIn(kin, prevTier[tier]) < 3;
          if (needLevel || needPrereq) {
            const why = [];
            if (needLevel) why.push("Soul Level " + tierGate[tier]);
            if (needPrereq) why.push((3 - countKnownIn(kin, prevTier[tier])) + " more " + prevTier[tier] + " " + kin);
            lockNotes.push(`<b>${kin} ${tier}</b>: needs ${why.join(" + ")}`);
          }
        });
      });
      if (lockNotes.length) {
        tp.appendChild(el("div", "eq-choice-label", "Locked (for Kinetics you're pursuing)"));
        const ln = el("div", "hint"); ln.innerHTML = "🔒 " + lockNotes.join(" · ");
        tp.appendChild(ln);
      }
    }
    wrap.appendChild(tp);
    return wrap;
  }

  /* ---------- shared API for play.js ---------- */
  window.PsionApp = {
    loadRoster: loadRoster,
    saveRoster: saveRoster,
    toast: toast,
    goHome: function () { playId = null; levelUpId = null; state = null; render(); },
    render: render,
    el: el,
  };

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#new-btn").onclick = () => { playId = null; levelUpId = null; startCreator(); };
    $("#home-btn").onclick = () => { playId = null; levelUpId = null; state = null; render(); };
    render();
  });
})();
