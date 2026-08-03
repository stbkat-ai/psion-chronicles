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

  /* ---------- description schema ----------
     Character appearance / basic info. Pure flavor — no rules effect. Defined once here so the
     creator step (app.js) and the play sheet's Description tab (play.js) stay in perfect sync. */
  const DESCRIPTION_GROUPS = [
    { label: "Basics", fields: [
      { key: "age", label: "Age", ph: "e.g. 27" },
      { key: "gender", label: "Gender", ph: "e.g. Woman" },
      { key: "pronouns", label: "Pronouns", ph: "e.g. she/her" },
    ] },
    { label: "Physical appearance", fields: [
      { key: "height", label: "Height", ph: 'e.g. 5\'9"' },
      { key: "weight", label: "Weight", ph: "e.g. 160 lb" },
      { key: "skinTone", label: "Skin tone", ph: "e.g. Olive" },
      { key: "hairColor", label: "Hair color", ph: "e.g. Black" },
      { key: "hairStyle", label: "Hair style", ph: "e.g. Shoulder-length, braided" },
      { key: "eyeColor", label: "Eye color", ph: "e.g. Amber" },
    ] },
  ];
  const DESCRIPTION_MISC = { key: "marks", label: "Distinguishing features", ph: "Tattoos, piercings, scars, cybernetics, other notable details…" };
  // A blank description object with every schema key present.
  function defaultDescription() {
    const d = {};
    DESCRIPTION_GROUPS.forEach((g) => g.fields.forEach((f) => { d[f.key] = ""; }));
    d[DESCRIPTION_MISC.key] = "";
    return d;
  }
  // Escape user-entered text before inserting it via innerHTML (Review summary).
  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ---------- persistence ---------- */
  function loadRoster() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveRoster(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; }
    catch (e) {
      toast(/quota/i.test(String(e && e.name)) ? "⚠ Couldn't save — device storage is full (large artwork?)." : "⚠ Couldn't save — this browser is blocking local storage.");
      return false;
    }
  }

  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = el("div", "toast"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- creator state ---------- */
  const STEPS = ["Identity", "Heritage", "Attributes", "Skills", "Techniques", "Equipment", "Description", "Review"];
  let state, step, rolled;
  let playId = null; // when set, we're in the live play sheet for this character id
  let levelUpId = null; // when set, we're in the level-up screen for this character id
  let creatorKinTab = null; // active Kinetic tab on the creator's Techniques step (persists across re-renders)
  let levelUpKinTab = null; // active Kinetic tab on the level-up screen's learn-techniques area

  function newState() {
    return {
      id: "pc_" + Date.now().toString(36),
      name: "",
      player: "",
      level: 1,
      background: null,
      heritage: null,           // regional heritage (grants combat skills + traits)
      learnedCombatSkills: [],  // combat skills bought later with Combat Skill Points
      baseScores: { STR: null, AGI: null, CON: null, INT: null, WIS: null, CHA: null },
      chosenSkills: [],       // player-chosen (2), beyond background's 3
      chosenTechniques: [],   // player-chosen (2), beyond background's free technique
      equipmentChoices: [],   // selected option index per background equipment choice group
      startWeapon: null,      // chosen starting weapon name (primary)
      startWeapon2: null,     // off-hand weapon name (two-weapon-fighting heritages only)
      startWeaponMode: null,  // "single" | "dual" for two-weapon-fighting heritages
      bonusWeaponProfs: [],   // extra weapon-type proficiencies chosen from grants (e.g. Martial Heritage)
      chakraHits: { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 },
      description: defaultDescription(), // appearance / basic info (flavor only)
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
  // Heritage traits that grant a choosable proficiency, by kind.
  function heritageWeaponGrants() {
    const h = state.heritage ? PC.heritage(state.heritage) : null;
    return h ? (h.traits || []).filter((t) => t.grant && t.grant.kind === "weapon") : [];
  }
  function skillGrantCount() {
    const h = state.heritage ? PC.heritage(state.heritage) : null;
    return h ? (h.traits || []).filter((t) => t.grant && t.grant.kind === "skill").length : 0;
  }
  // All weapon TYPES the character is proficient with: background's + any chosen bonus profs.
  function proficientWeaponTypes() {
    const types = [];
    const bgt = weaponTypeFor(bg());
    if (bgt) types.push(bgt);
    (state.bonusWeaponProfs || []).forEach((t) => { if (t && types.indexOf(t) < 0) types.push(t); });
    return types;
  }
  // The Fighting Style (from Heritage). Its startWeaponTypes widen your STARTING-GEAR options only
  // (you may begin with one of these weapons, but you are NOT proficient with it unless a
  // background/grant also covers it). twoWeapon marks styles that pick 1×two-handed or 2×one-handed.
  function heritageStyle() { return state.heritage ? PC.styleForHeritage(state.heritage) : null; }
  function heritageTwoWeapon() { const st = heritageStyle(); return !!(st && st.twoWeapon); }
  // Weapon types the Heritage's style opens for starting gear, minus those already granted as proficient.
  function startOnlyWeaponTypes() {
    const st = heritageStyle();
    const focus = st && Array.isArray(st.startWeaponTypes) ? st.startWeaponTypes : [];
    const prof = proficientWeaponTypes();
    return focus.filter((t) => prof.indexOf(t) < 0);
  }
  // Every weapon TYPE offered in the starting-gear picker: proficient types first, then heritage start-only.
  function allStartWeaponTypes() { return proficientWeaponTypes().concat(startOnlyWeaponTypes()); }
  function isProficientType(wt) { return proficientWeaponTypes().indexOf(wt) > -1; }
  // Total skills the player chooses at creation: 2 base + 1 per skill-proficiency grant.
  function skillsToChoose() { return 2 + skillGrantCount(); }
  // The *beginner* weapons of any offered type (proficient + heritage start-only). Starting gear is
  // limited to the curated beginner list (PC.STARTER_WEAPONS — up to 2 per subtype), not every Common
  // weapon; higher-rarity weapons are never offered at creation. Falls back to all-Common if the
  // beginner list is somehow unavailable, so the picker never ends up empty.
  function eligibleStartWeapons() {
    const types = allStartWeaponTypes();
    const hasStarterList = !!(window.PC && Array.isArray(window.PC.STARTER_WEAPONS));
    return (window.PC.ITEMS || []).filter((it) =>
      it.category === "Weapon" &&
      types.indexOf(it.weaponType) > -1 &&
      (it.rarity || "Common") === "Common" &&
      (!hasStarterList || window.PC.isStarterWeapon(it.name)));
  }
  // Build an equipped inventory item from a chosen weapon name; proficient only if its type is proficient.
  function startWeaponItem(name) {
    const it = eligibleStartWeapons().find((w) => w.name === name);
    if (!it) return null;
    return Object.assign({}, it, { qty: 1, equipped: true, proficient: isProficientType(it.weaponType) });
  }
  // The chosen starting weapon(s) — an array (two entries for a two-weapon-fighting dual pick).
  function chosenStartWeaponItems() {
    const list = eligibleStartWeapons();
    if (!list.length) return [];
    if (heritageTwoWeapon() && state.startWeaponMode === "dual") {
      const a = startWeaponItem(state.startWeapon), b = startWeaponItem(state.startWeapon2);
      return [a, b].filter(Boolean);
    }
    const one = startWeaponItem(state.startWeapon) || Object.assign({}, list[0], { qty: 1, equipped: true, proficient: isProficientType(list[0].weaponType) });
    return one ? [one] : [];
  }
  // Resolve the final item list: fixed gear + chosen starting weapon + selected option per non-weapon group.
  function resolveEquipment() {
    const out = bgFixedEquip().slice();
    chosenStartWeaponItems().forEach((sw) => { if (sw) out.push(sw); });
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
    // Header: optional character thumbnail (uploaded on the Description tab) next to the name.
    const rhead = el("div", "rhead");
    if (c.thumb) { const th = el("img", "roster-thumb"); th.src = c.thumb; th.alt = c.name || "portrait"; rhead.appendChild(th); }
    const rtitle = el("div");
    rtitle.appendChild(el("h3", null, c.name || "Unnamed"));
    rtitle.appendChild(el("div", "rmeta", `${c.background || "—"} · Soul Level ${c.level}`));
    rhead.appendChild(rtitle);
    card.appendChild(rhead);
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
    lvl.onclick = () => { levelUpId = c.id; state = null; playId = null; levelUpKinTab = null; render(); };
    const play = el("button", "btn primary small", "▶ Play");
    play.onclick = () => { playId = c.id; state = null; render(); };
    row.appendChild(del);
    row.appendChild(edit);
    row.appendChild(lvl);
    row.appendChild(play);
    card.appendChild(row);
    return card;
  }

  function startCreator() { state = newState(); step = 0; rolled = null; creatorKinTab = null; render(); }

  function editCharacter(id) {
    const c = loadRoster().find((x) => x.id === id);
    if (!c) return;
    state = JSON.parse(JSON.stringify(c)); // work on a copy; Save writes back by id
    if (!Array.isArray(state.chosenSkills)) state.chosenSkills = [];
    if (!Array.isArray(state.chosenTechniques)) state.chosenTechniques = [];
    if (!Array.isArray(state.equipmentChoices)) state.equipmentChoices = [];
    if (!Array.isArray(state.learnedCombatSkills)) state.learnedCombatSkills = [];
    if (!Array.isArray(state.bonusWeaponProfs)) state.bonusWeaponProfs = [];
    if (!state.chakraHits) state.chakraHits = { STR: 0, AGI: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    state.description = Object.assign(defaultDescription(), state.description || {}); // backfill for pre-Description characters
    state._editing = true;
    playId = null; step = 0; rolled = null; creatorKinTab = null;
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
    if (i <= 1) return true; // Identity, Heritage
    if (!(state.background && state.heritage)) return false;
    if (i >= 3 && !allScoresAssigned()) return false;
    return true;
  }

  /* ---------- step router ---------- */
  function renderStep() {
    switch (step) {
      case 0: return stepIdentity();
      case 1: return stepHeritage();
      case 2: return stepAttributes();
      case 3: return stepSkills();
      case 4: return stepTechniques();
      case 5: return stepEquipment();
      case 6: return stepDescription();
      case 7: return stepReview();
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
        lines.push(`<div><b>Weapon:</b> a beginner ${weaponTypeFor(b)} weapon</div>`);
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
      if (b.flaw) detail.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠ Flaw</span> <b>${b.flaw.name}</b> — ${b.flaw.desc}`));
      detail.appendChild(el("p", "hint", "You'll choose your <b>starting gear last</b> — after Heritage, so any weapon proficiency your Heritage grants is included in the options."));
      p.appendChild(detail);
    }

    p.appendChild(navRow(() => { state = null; render(); }, () => { step = 1; render(); }, "Next →", !!(state.name.trim() && state.background)));
    // Repurpose the hidden back as "cancel to roster"
    const back = $(".btn.ghost", p);
    back.style.visibility = "visible"; back.textContent = "✕ Cancel";
    return p;
  }

  /* ---------- STEP: Heritage ---------- */
  function stepHeritage() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Regional Heritage <span class="sub">— where your family hails from</span>'));
    p.appendChild(el("p", "hint", "Your old-world ancestry (the Post-Veil equivalent of a race). It grants a <b>Fighting Style</b> — <b>2 combat skills</b> from that style plus the style's signature <b>passive</b> — and <b>2 traits</b>. No attribute changes. You'll learn more combat skills (from any style) as you level."));
    const grid = el("div", "bg-grid");
    PC.HERITAGES.forEach((h) => {
      const card = el("div", "bg-card" + (state.heritage === h.name ? " selected" : ""));
      card.appendChild(el("h3", null, h.name));
      card.appendChild(el("div", "blurb", h.blurb));
      const passive = PC.stylePassive(h.fightingStyle);
      const meta = el("div", "meta");
      meta.appendChild(el("span", "badge", "⚔ " + h.fightingStyle));
      h.combatSkills.forEach((cs) => meta.appendChild(el("span", "badge psi", cs)));
      if (passive) meta.appendChild(el("span", "badge gold", "★ " + passive.name));
      card.appendChild(meta);
      const tr = el("div", "bg-equip");
      tr.innerHTML = h.traits.map((t) => `<div><b>${t.name}:</b> ${t.desc}</div>`).join("");
      card.appendChild(tr);
      card.onclick = () => {
        state.heritage = h.name;
        // Reset bonus weapon-prof slots to match this heritage's weapon grants (fresh, unchosen).
        const wg = (h.traits || []).filter((t) => t.grant && t.grant.kind === "weapon").length;
        state.bonusWeaponProfs = new Array(wg).fill("");
        // Heritage changes what weapons are on offer — clear the starting-weapon picks so they re-resolve.
        state.startWeapon = null; state.startWeapon2 = null;
        const st = PC.styleForHeritage(h.name);
        state.startWeaponMode = st && st.twoWeapon ? "dual" : "single";
        // Trim chosen skills if the new heritage grants fewer skill picks.
        const max = 2 + (h.traits || []).filter((t) => t.grant && t.grant.kind === "skill").length;
        if (state.chosenSkills && state.chosenSkills.length > max) state.chosenSkills = state.chosenSkills.slice(0, max);
        render();
      };
      grid.appendChild(card);
    });
    p.appendChild(grid);
    if (state.heritage) {
      const h = PC.heritage(state.heritage);
      const style = PC.fightingStyle(h.fightingStyle);
      const passive = PC.stylePassive(h.fightingStyle);
      const d = el("div"); d.style.marginTop = "16px";
      d.appendChild(el("div", "section-label", `Fighting Style: ${h.fightingStyle}`));
      if (style) d.appendChild(el("p", "hint", style.blurb));
      d.appendChild(el("div", "eq-choice-label", "Starting combat skills"));
      h.combatSkills.forEach((cs) => {
        const c = PC.combatSkill(cs);
        if (c) d.appendChild(el("div", "inv-note", `<b>${cs}</b> <span class="tag">${c.action}</span> — ${c.effect}`));
      });
      if (passive) {
        d.appendChild(el("div", "eq-choice-label", "Signature passive"));
        d.appendChild(el("div", "inv-note", `<b>★ ${passive.name}</b> <span class="tag">Passive</span> — ${passive.effect}`));
      }
      d.appendChild(el("div", "section-label", "Traits"));
      const tl = el("div", "pill-list");
      h.traits.forEach((t) => {
        const pill = el("span", "pill" + (t.grant ? " prof" : ""), t.name + (t.grant ? " ＋" : ""));
        pill.title = t.desc;
        tl.appendChild(pill);
      });
      d.appendChild(tl);
      if (h.flaw) d.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠ Flaw</span> <b>${h.flaw.name}</b> — ${h.flaw.desc}`));
      const wg = h.traits.filter((t) => t.grant && t.grant.kind === "weapon").length;
      const sg = h.traits.filter((t) => t.grant && t.grant.kind === "skill").length;
      if (wg || sg) {
        const notes = [];
        if (wg) notes.push(`<b>+${wg} weapon proficiency</b> — pick it on the <b>Equipment</b> step (it widens your starting-gear choices)`);
        if (sg) notes.push(`<b>+${sg} skill proficiency</b> — choose ${2 + sg} skills on the <b>Skills</b> step`);
        d.appendChild(el("p", "hint", "This heritage grants " + notes.join("; ") + "."));
      }
      // Weapon proficiency: this heritage grants one specific weapon SUBTYPE (its signature weapon).
      if (h.weaponSubtype) {
        const wt = PC.weaponTypeOfSubtype(h.weaponSubtype);
        d.appendChild(el("div", "section-label", "Weapon Proficiency"));
        const wl = el("div", "pill-list");
        wl.appendChild(el("span", "pill prof", "⚔ " + h.weaponSubtype));
        d.appendChild(wl);
        d.appendChild(el("p", "hint", `Trained in <b>${h.weaponSubtype}</b>${wt ? ` (a ${wt} subtype)` : ""} — you add your proficiency bonus to attacks with any ${h.weaponSubtype} weapon, even without the full weapon-type proficiency.`));
      }
      // Armor proficiency (everyone gets Light; this heritage may add Medium/Heavy).
      const ap = (h.armorProf || []).filter((c) => c !== "Light");
      d.appendChild(el("div", "section-label", "Armor Proficiency"));
      const apl = el("div", "pill-list");
      ["Light"].concat(ap).forEach((c) => apl.appendChild(el("span", "pill prof", c + " armor")));
      d.appendChild(apl);
      d.appendChild(el("p", "hint", ap.length
        ? `Proficient with <b>Light, ${ap.join(", ")}</b> armor. Light gives full mobility (AGI to Defense + Stealth); heavier classes trade mobility for more Defense.`
        : "Proficient with <b>Light</b> armor only — nimble and stealthy. Wearing heavier armor you're not trained in gives no Defense bonus and disadvantage on AGI checks & attacks."));
      p.appendChild(d);
    }
    p.appendChild(navRow(() => { step = 0; render(); }, () => { step = 2; render(); }, "Next →", !!state.heritage));
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

    p.appendChild(navRow(() => { step = 1; render(); }, () => { step = 3; render(); }, "Next →", allScoresAssigned()));
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
    const need = skillsToChoose();
    // Safety: if heritage changed and reduced the allowance, trim extras.
    if (state.chosenSkills.length > need) state.chosenSkills = state.chosenSkills.slice(0, need);
    const p = el("div", "panel");
    p.appendChild(el("h2", null, `Skill Proficiencies <span class="sub">— choose ${need} more</span>`));
    const extra = skillGrantCount();
    p.appendChild(el("p", "hint", `Your Background granted 3 skill proficiencies. Choose <b>${need}</b> additional skills` + (extra ? ` (2 base + ${extra} from your Heritage's proficiency grant)` : "") + ". Proficient skills add your proficiency bonus to their checks."));

    const granted = bgSkills();
    const counter = el("div", "counter");
    const updateCounter = () => counter.innerHTML = `Chosen: <b>${state.chosenSkills.length}</b> / ${need}`;

    p.appendChild(el("div", "section-label", "From your Background (locked in)"));
    const glist = el("div", "pill-list");
    granted.forEach((s) => glist.appendChild(el("span", "pill prof", s + " ✓")));
    p.appendChild(glist);

    p.appendChild(el("div", "section-label", `Choose ${need} more`));
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
            else if (state.chosenSkills.length < need) state.chosenSkills.push(s.name);
            else { toast(`You can only choose ${need} extra skills. Deselect one first.`); return; }
            render();
          };
        }
        chips.appendChild(chip);
      });
      p.appendChild(chips);
    });

    updateCounter();
    p.appendChild(counter);
    p.appendChild(navRow(() => { step = 2; render(); }, () => { step = 4; render(); }, "Next →", state.chosenSkills.length === need));
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

    // Tabs: proficient Kinetic first, then any you've picked into, then the rest by attribute.
    const profKin = b ? b.combat[1] : null;
    const freeKin = b && b.freeTech && PC.technique(b.freeTech) ? PC.technique(b.freeTech).kinetic : null;
    const pursued = (kin) => (byKin[kin] || []).some((t) => state.chosenTechniques.includes(t.name)) || kin === freeKin;
    const order = orderKineticNames(Object.keys(byKin), profKin, pursued);
    if (order.indexOf(creatorKinTab) < 0) creatorKinTab = order[0];

    p.appendChild(el("p", "hint", "Each Kinetic is a tab — your background's focus is first (★), Kinetics you've picked into are marked ✦. Tap a tab to browse its Beginner techniques."));
    p.appendChild(kineticPicker({
      order: order,
      active: creatorKinTab,
      proficient: profKin,
      pursued: pursued,
      badge: (kin) => { const n = (byKin[kin] || []).filter((t) => state.chosenTechniques.includes(t.name)).length; return n ? n : null; },
      onSelect: (kin) => { creatorKinTab = kin; render(); },
      renderPane: (kin) => {
        const pane = el("div");
        const k = PC.kinetic(kin);
        pane.appendChild(el("div", "kin-pane-head", `<b>${kin}</b> — ${k.attr} · ${k.role} · ${PC.CHAKRAS[k.attr].name} chakra · <span class="muted">${k.domain}</span>`));
        (byKin[kin] || []).forEach((t) => {
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
          pane.appendChild(card);
        });
        return pane;
      },
    }));

    p.appendChild(navRow(() => { step = 3; render(); }, () => { step = 5; render(); }, "Next →", state.chosenTechniques.length === 2));
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

  /* ---------- shared Kinetic tab picker (creator + level-up) ----------
     Ordering: your proficient Kinetic first, then any Kinetic you already
     have techniques in, then the rest in attribute order (STR→AGI→CON→INT→WIS→CHA). */
  function orderKineticNames(names, proficient, pursued) {
    const base = PC.KINETICS.map((k) => k.name).filter((n) => names.indexOf(n) >= 0);
    const rank = (n) => (n === proficient ? 0 : pursued(n) ? 1 : 2);
    return base.slice().sort((a, b) => (rank(a) - rank(b)) || (base.indexOf(a) - base.indexOf(b)));
  }
  // opts: {order, active, proficient, pursued(kin), badge(kin)|null, onSelect(kin), renderPane(kin)}
  function kineticPicker(opts) {
    const wrap = el("div", "kin-picker");
    const bar = el("div", "kin-tabbar");
    opts.order.forEach((kin) => {
      const k = PC.kinetic(kin);
      const prof = opts.proficient === kin;
      const pursued = !prof && opts.pursued(kin);
      const t = el("button", "kin-tab" + (opts.active === kin ? " active" : "") + (prof ? " prof" : pursued ? " pursued" : ""));
      const mark = prof ? "★" : pursued ? "✦" : "";
      const badge = opts.badge ? opts.badge(kin) : null;
      t.type = "button";
      t.innerHTML =
        `<span class="kin-tab-top"><span class="kin-tab-name">${kin}</span>${mark ? `<span class="kin-tab-mark">${mark}</span>` : ""}</span>` +
        `<span class="kin-tab-sub">${k.attr}${badge != null ? ` · <b>${badge}</b>` : ""}</span>`;
      t.title = `${k.attr} · ${k.role} · ${PC.CHAKRAS[k.attr].name} chakra — ${k.domain}` + (prof ? " (your focus)" : pursued ? " (in progress)" : "");
      t.onclick = () => opts.onSelect(kin);
      bar.appendChild(t);
    });
    wrap.appendChild(bar);
    const pane = el("div", "kin-tab-content");
    pane.appendChild(opts.renderPane(opts.active));
    wrap.appendChild(pane);
    return wrap;
  }

  /* ---------- STEP 5: Equipment (last selection — reflects background + heritage profs) ---------- */
  function stepEquipment() {
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Starting Equipment <span class="sub">— your loadout</span>'));

    // Editing keeps the character's existing inventory; nothing to pick here.
    if (state._editing) {
      p.appendChild(el("p", "hint", "Editing an existing character keeps its current inventory. Manage items on the Play sheet's Inventory tab."));
      p.appendChild(navRow(() => { step = 4; render(); }, () => { step = 6; render(); }, "Next →", true));
      return p;
    }

    p.appendChild(el("p", "hint", "Chosen last so your Heritage's proficiencies count: pick a bonus weapon proficiency (if your Heritage grants one), then a <b>beginner weapon</b> from any type you're proficient with (a curated shortlist — the fuller catalog is found in play), plus armor / other options."));

    const b = bg();

    // Bonus weapon proficiencies (from grants like Europe's Martial Heritage).
    const wGrants = heritageWeaponGrants();
    if (wGrants.length) {
      p.appendChild(el("div", "section-label", "Bonus weapon proficiency"));
      const bgType = weaponTypeFor(b);
      wGrants.forEach((t, gi) => {
        p.appendChild(el("div", "eq-choice-label", `${t.name} — choose an extra weapon type`));
        const sel = el("select"); sel.className = "inv-cat"; sel.style.maxWidth = "340px";
        const cur = state.bonusWeaponProfs[gi] || "";
        // Options: any weapon type except the background's own and other bonus picks.
        const taken = state.bonusWeaponProfs.filter((x, i) => x && i !== gi);
        let opts = `<option value="">— choose a weapon type —</option>`;
        PC.WEAPON_TYPES.forEach((w) => {
          if (w.name === bgType || taken.indexOf(w.name) > -1) return;
          opts += `<option value="${w.name}" ${w.name === cur ? "selected" : ""}>${w.name} (${w.attr})</option>`;
        });
        sel.innerHTML = opts;
        sel.onchange = () => {
          state.bonusWeaponProfs[gi] = sel.value;
          // If the current starting weapon is no longer eligible, reset it.
          if (state.startWeapon && !eligibleStartWeapons().some((w) => w.name === state.startWeapon)) state.startWeapon = null;
          render();
        };
        p.appendChild(sel);
      });
    }

    // Fixed gear.
    if (bgFixedEquip().length) {
      p.appendChild(el("div", "section-label", "Fixed gear"));
      const fx = el("div", "pill-list");
      bgFixedEquip().forEach((it) => fx.appendChild(el("span", "pill", it.name + (it.qty > 1 ? " ×" + it.qty : ""))));
      p.appendChild(fx);
    }

    // Starting weapon — Common weapons of any offered type (proficient + heritage start-only).
    const eligible = eligibleStartWeapons();
    const profTypes = proficientWeaponTypes();
    const startOnly = startOnlyWeaponTypes();
    const offeredTypes = allStartWeaponTypes();
    p.appendChild(el("div", "section-label", "Starting weapon"));

    // Subtype of a weapon (from the beginner map in items.js), falling back to its parent type name.
    const subtypeOf = (w) => (PC.starterSubtype && PC.starterSubtype(w.name)) || w.weaponType;
    // The subtypes of a type, in the beginner map's order (so groups read in a stable, curated order).
    const subtypeOrderFor = (wt) => (PC.STARTER_WEAPONS_BY_SUBTYPE && PC.STARTER_WEAPONS_BY_SUBTYPE[wt]) ? Object.keys(PC.STARTER_WEAPONS_BY_SUBTYPE[wt]) : [];

    // Build a <select> of eligible weapons matching `filter`, grouped by type → subtype (proficient
    // types first), one <optgroup> per subtype labelled "Type · Subtype" (native selects can't nest
    // groups). Heritage start-only types are tagged "not proficient". Defaults to a proficient weapon.
    const buildWeaponSelect = (filter, current, onPick) => {
      const list = eligible.filter(filter);
      const sel = el("select"); sel.className = "inv-cat"; sel.style.maxWidth = "360px";
      const profFirst = list.filter((w) => isProficientType(w.weaponType));
      const pool = profFirst.length ? profFirst : list;
      const chosen = current && list.some((w) => w.name === current) ? current : (pool[0] && pool[0].name) || null;
      let html = "";
      offeredTypes.forEach((wt) => {
        const inType = list.filter((w) => w.weaponType === wt);
        if (!inType.length) return;
        const tag = isProficientType(wt) ? "" : " — not proficient";
        // Group this type's weapons by subtype; list subtypes in the map's order, then any extras.
        const bySub = {};
        inType.forEach((w) => { const s = subtypeOf(w); (bySub[s] = bySub[s] || []).push(w); });
        const order = subtypeOrderFor(wt).filter((s) => bySub[s]);
        Object.keys(bySub).forEach((s) => { if (order.indexOf(s) < 0) order.push(s); });
        order.forEach((s) => {
          html += `<optgroup label="${wt} · ${s}${tag}">`;
          bySub[s].forEach((w) => { html += `<option value="${w.name}" ${w.name === chosen ? "selected" : ""}>${w.name} (${w.damage}, ${w.hands === 2 ? "2H" : "1H"})</option>`; });
          html += `</optgroup>`;
        });
      });
      sel.innerHTML = html;
      sel.onchange = () => { onPick(sel.value); render(); };
      return { sel, chosen };
    };

    if (!eligible.length) {
      p.appendChild(el("div", "muted", "No eligible weapons found."));
    } else if (heritageTwoWeapon()) {
      // Two-weapon fighting (e.g. Twin Fang): one two-handed weapon OR two one-handed weapons.
      const twoH = eligible.filter((w) => w.hands === 2);
      const oneH = eligible.filter((w) => w.hands !== 2);
      const mode = state.startWeaponMode === "single" ? "single" : "dual";
      p.appendChild(el("div", "eq-choice-label", `${heritageStyle().name} — one two-handed weapon, or two one-handed weapons`));
      const modes = el("div", "chips");
      [["dual", "Two one-handed"], ["single", "One two-handed"]].forEach((m) => {
        const chip = el("div", "chip" + (mode === m[0] ? " selected" : ""), m[1]);
        chip.onclick = () => { state.startWeaponMode = m[0]; render(); };
        modes.appendChild(chip);
      });
      p.appendChild(modes);
      const profTxt = profTypes.length ? profTypes.join(", ") : "none";
      p.appendChild(el("div", "hint", `Proficient: ${profTxt}${startOnly.length ? `; Heritage also opens ${startOnly.join(", ")} (not proficient)` : ""}.`));
      if (mode === "single") {
        state.startWeapon2 = null;
        if (!twoH.length) p.appendChild(el("div", "muted", "No two-handed weapon available — switch to two one-handed."));
        else { const w = buildWeaponSelect((x) => x.hands === 2, state.startWeapon, (v) => { state.startWeapon = v; }); state.startWeapon = w.chosen; p.appendChild(w.sel); }
      } else {
        if (!oneH.length) p.appendChild(el("div", "muted", "No one-handed weapons available."));
        else {
          p.appendChild(el("div", "eq-choice-label", "Main hand"));
          const w1 = buildWeaponSelect((x) => x.hands !== 2, state.startWeapon, (v) => { state.startWeapon = v; }); state.startWeapon = w1.chosen; p.appendChild(w1.sel);
          p.appendChild(el("div", "eq-choice-label", "Off hand"));
          const w2 = buildWeaponSelect((x) => x.hands !== 2, state.startWeapon2, (v) => { state.startWeapon2 = v; }); state.startWeapon2 = w2.chosen; p.appendChild(w2.sel);
        }
      }
    } else {
      state.startWeapon2 = null;
      const profTxt = profTypes.length ? profTypes.join(" or ") : "none";
      const extra = startOnly.length ? ` — your Heritage also lets you start with ${startOnly.join(", ")} (not proficient)` : "";
      p.appendChild(el("div", "eq-choice-label", `Beginner weapon you're proficient with — ${profTxt}${extra}`));
      const w = buildWeaponSelect(() => true, state.startWeapon, (v) => { state.startWeapon = v; }); state.startWeapon = w.chosen; p.appendChild(w.sel);
    }

    // Non-weapon choice groups (armor, instrument, focus…).
    bgChoices().forEach((grp, gi) => {
      if (isWeaponGroup(grp)) return; // weapons handled by the dropdown above
      p.appendChild(el("div", "eq-choice-label", grp.label));
      const chips = el("div", "chips");
      grp.options.forEach((opt, oi) => {
        const sel = (state.equipmentChoices[gi] != null ? state.equipmentChoices[gi] : 0) === oi;
        const chip = el("div", "chip" + (sel ? " selected" : ""), opt.label);
        chip.onclick = () => { state.equipmentChoices[gi] = oi; render(); };
        chips.appendChild(chip);
      });
      p.appendChild(chips);
    });

    // Loadout preview.
    const resolved = resolveEquipment();
    if (resolved.length) {
      p.appendChild(el("div", "section-label", "Your loadout"));
      const eq = el("div", "pill-list");
      resolved.forEach((it) => {
        const qty = it.qty > 1 ? ` ×${it.qty}` : "";
        eq.appendChild(el("span", "pill", `${it.name}${qty}${it.equipped ? " ✓" : ""}`));
      });
      p.appendChild(eq);
    }

    // Require any weapon-grant slots to be filled before proceeding.
    const grantsFilled = !wGrants.length || state.bonusWeaponProfs.slice(0, wGrants.length).every((x) => !!x);
    p.appendChild(navRow(() => { step = 4; render(); }, () => { step = 6; render(); }, "Next →", grantsFilled));
    if (!grantsFilled) p.appendChild(el("p", "hint", "Choose your bonus weapon proficiency to continue."));
    return p;
  }

  /* ---------- STEP: Description (appearance / basic info — flavor only) ---------- */
  function descField(f) {
    const l = el("label", "field");
    l.appendChild(el("span", null, f.label));
    const i = el("input"); i.type = "text"; i.placeholder = f.ph || "";
    i.value = state.description[f.key] || "";
    i.oninput = () => (state.description[f.key] = i.value); // no re-render, so focus is kept while typing
    l.appendChild(i);
    return l;
  }
  function stepDescription() {
    if (!state.description) state.description = defaultDescription();
    const p = el("div", "panel");
    p.appendChild(el("h2", null, 'Description <span class="sub">— what your character looks like</span>'));
    p.appendChild(el("p", "hint", "Optional flavor: describe your character's appearance and basic details. None of this affects the rules — it shows up on the <b>Description</b> tab of your play sheet so you and your table can picture them. Leave any field blank if you'd rather not say."));

    DESCRIPTION_GROUPS.forEach((g) => {
      p.appendChild(el("div", "section-label", g.label));
      const grid = el("div", "desc-grid");
      g.fields.forEach((f) => grid.appendChild(descField(f)));
      p.appendChild(grid);
    });

    p.appendChild(el("div", "section-label", DESCRIPTION_MISC.label));
    const misc = el("textarea"); misc.rows = 3; misc.placeholder = DESCRIPTION_MISC.ph;
    misc.value = state.description[DESCRIPTION_MISC.key] || "";
    misc.oninput = () => (state.description[DESCRIPTION_MISC.key] = misc.value);
    p.appendChild(misc);

    p.appendChild(navRow(() => { step = 5; render(); }, () => { step = 7; render(); }, "Review →", true));
    return p;
  }

  /* ---------- STEP: Review ---------- */
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
      <div style="color:var(--text-dim)">${state.background}${state.heritage ? " · " + state.heritage : ""} · Soul Level ${state.level}${state.player ? " · Player: " + state.player : ""}</div>`;
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

    // combat profs (background's + any bonus weapon proficiency from a heritage grant)
    p.appendChild(el("div", "section-label", "Combat Proficiencies"));
    const cp = el("div", "pill-list");
    b.combat.forEach((c) => cp.appendChild(el("span", "pill psi", c)));
    (state.bonusWeaponProfs || []).forEach((wt) => { if (wt) cp.appendChild(el("span", "pill psi", wt + " ＋")); });
    // Heritage's granted weapon subtype (a specific-weapon proficiency, narrower than a whole type).
    const hSub = state.heritage && PC.heritageWeaponSubtype(state.heritage);
    if (hSub) cp.appendChild(el("span", "pill prof", "⚔ " + hSub));
    // Armor proficiency: Light for everyone, plus the Heritage's grants.
    const armorClasses = ["Light"].concat((((state.heritage && PC.heritage(state.heritage)) || {}).armorProf || []).filter((c) => c !== "Light"));
    armorClasses.forEach((c) => cp.appendChild(el("span", "pill prof", c + " armor")));
    p.appendChild(cp);

    // background flaw (negative trait)
    if (b.flaw) {
      p.appendChild(el("div", "section-label", "Flaw"));
      p.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠</span> <b>${b.flaw.name}</b> — ${b.flaw.desc}`));
    }

    // heritage — fighting style, combat skills + passive + traits
    const h = state.heritage ? PC.heritage(state.heritage) : null;
    if (h) {
      const passive = PC.stylePassive(h.fightingStyle);
      p.appendChild(el("div", "section-label", `Heritage: ${h.name} — ${h.fightingStyle}`));
      h.combatSkills.forEach((cs) => {
        const c = PC.combatSkill(cs);
        if (c) p.appendChild(el("div", "inv-note", `<b>${cs}</b> <span class="tag">${c.action}</span> — ${c.effect}`));
      });
      if (passive) p.appendChild(el("div", "inv-note", `<b>★ ${passive.name}</b> <span class="tag">Passive</span> — ${passive.effect}`));
      p.appendChild(el("div", "section-label", "Traits"));
      const tl = el("div", "pill-list");
      h.traits.forEach((t) => { const pill = el("span", "pill", t.name); pill.title = t.desc; tl.appendChild(pill); });
      p.appendChild(tl);
      if (h.flaw) p.appendChild(el("div", "flaw-note", `<span class="flaw-tag">⚠ Flaw</span> <b>${h.flaw.name}</b> — ${h.flaw.desc}`));
    }

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

    // description (appearance) — only show sections that were filled in
    const desc = state.description || {};
    const descRows = [];
    DESCRIPTION_GROUPS.forEach((g) => g.fields.forEach((f) => { if ((desc[f.key] || "").trim()) descRows.push([f.label, desc[f.key]]); }));
    const miscVal = (desc[DESCRIPTION_MISC.key] || "").trim();
    if (descRows.length || miscVal) {
      p.appendChild(el("div", "section-label", "Description"));
      if (descRows.length) {
        const dg = el("div", "sheet-grid");
        const dL = el("div"), dR = el("div");
        descRows.forEach((row, i) => (i % 2 === 0 ? dL : dR).appendChild(statLine(row[0], escapeHtml(row[1]))));
        dg.appendChild(dL); dg.appendChild(dR);
        p.appendChild(dg);
      }
      if (miscVal) p.appendChild(el("div", "inv-note", `<b>${DESCRIPTION_MISC.label}:</b> ${escapeHtml(miscVal)}`));
    }

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
    back.onclick = () => { step = 6; render(); };
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
    if (!Array.isArray(rec.learnedCombatSkills)) rec.learnedCombatSkills = [];
    const earnedCSP = Math.floor(level / 5); // +1 Combat Skill Point every 5th level
    const availCSP = earnedCSP - rec.learnedCombatSkills.length;
    const heritageSkills = PC.heritageGrantedSkills(rec.heritage); // 2 active starters + style passive (all free/locked)
    const knownCS = heritageSkills.concat(rec.learnedCombatSkills);
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
    const lvlReady = level < 30 && PC.xpBar(rec.xp || 0, level).ready;
    const lvlBtn = el("button", "btn primary small" + (lvlReady ? " xp-ready-btn" : ""), level >= 30 ? "Max Level (30)" : `⭐ Level Up → ${level + 1}`);
    lvlBtn.disabled = level >= 30;
    lvlBtn.onclick = () => { if (rec.level < 30) { rec.level++; rec.xp = Math.max(rec.xp || 0, PC.xpForLevel(rec.level)); toast(`Leveled up to Soul Level ${rec.level}!`); persist(); } };
    head.appendChild(back); head.appendChild(title); head.appendChild(lvlBtn);
    wrap.appendChild(head);

    // XP / Soul Pool panel — progress bar toward the next Soul Level.
    // Keep XP consistent with level (see play.js): a level-L character has at least level L's XP floor,
    // so the bar reflects real within-level progress rather than sitting empty below the floor.
    if (typeof rec.xp !== "number") rec.xp = 0;
    if (rec.xp < PC.xpForLevel(level)) rec.xp = PC.xpForLevel(level);
    const bar = PC.xpBar(rec.xp, level);
    const xp = el("div", "panel");
    xp.appendChild(el("div", "section-label", "Soul Pool (XP)"));
    const xpWrap = el("div", "xp-wrap");
    if (bar.maxed) {
      xpWrap.appendChild(el("div", "xp-head", `<span>Maximum Soul Level (30) reached</span><span class="xp-num">${rec.xp.toLocaleString()} XP</span>`));
      const track = el("div", "bar-track"); const f = el("div", "bar-fill"); f.style.width = "100%"; f.style.background = "var(--gold)"; track.appendChild(f); xpWrap.appendChild(track);
    } else {
      xpWrap.appendChild(el("div", "xp-head", `<span>${bar.ready ? '<b class="xp-ready">Ready to level up →</b>' : "Progress to Level " + (level + 1)}</span><span class="xp-num">${bar.into.toLocaleString()} / ${bar.span.toLocaleString()}</span>`));
      const track = el("div", "bar-track"); const f = el("div", "bar-fill"); f.style.width = bar.pct + "%"; f.style.background = bar.ready ? "var(--gold)" : "var(--cyan)"; track.appendChild(f); xpWrap.appendChild(track);
      xpWrap.appendChild(el("div", "xp-sub", `Total Soul Pool: <b>${rec.xp.toLocaleString()}</b> XP · ${bar.ready ? `enough for Level ${level + 1}` : `${bar.remaining.toLocaleString()} XP to Level ${level + 1}`}`));
    }
    xp.appendChild(xpWrap);
    // XP adjusters (GM awards / corrects XP).
    const xrow = el("div", "adjust-row");
    [[-100, "−100"], [-10, "−10"], [10, "+10"], [100, "+100"]].forEach(([n, t]) => {
      const b = el("button", "btn small ghost", t); b.onclick = () => { rec.xp = Math.max(0, (rec.xp || 0) + n); persist(); }; xrow.appendChild(b);
    });
    const xinp = el("input"); xinp.type = "number"; xinp.placeholder = "#"; xinp.className = "adjust-input";
    const xadd = el("button", "btn small", "Add XP"); xadd.onclick = () => { const v = parseInt(xinp.value, 10); if (v) { rec.xp = Math.max(0, (rec.xp || 0) + Math.abs(v)); persist(); } };
    xrow.appendChild(xinp); xrow.appendChild(xadd);
    xp.appendChild(xrow);
    xp.appendChild(el("p", "hint", "Leveling is GM-driven: award XP as your table earns it, and tap <b>Level Up</b> when the bar is full (or whenever your GM calls it). Each level grants +1 Technique Point; odd levels also grant +1 attribute point; every 5th level grants +1 Combat Skill Point. <i>(Thresholds are a starting curve — your GM may retune them.)</i>"));
    wrap.appendChild(xp);

    // points summary + milestones
    const pts = el("div", "panel");
    pts.appendChild(el("div", "section-label", "Points to Spend"));
    const tr = el("div", "tile-row");
    tr.appendChild(tileEl("Technique Points", availTP + " / " + earnedTP));
    tr.appendChild(tileEl("Attribute Points", availAttr + " / " + earnedAttr));
    tr.appendChild(tileEl("Combat Skill Points", availCSP + " / " + earnedCSP));
    pts.appendChild(tr);
    if (level >= 15) pts.appendChild(el("p", "hint", "★ <b>Otherkin unlocked</b> — your Soul Creature awakens at the <b>Heart chakra</b> (see the Chakras tab; mechanics coming soon)."));
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

    tp.appendChild(el("p", "hint", "Each Kinetic is a tab — your focus first (★), Kinetics you already know techniques in are marked ✦. To unlock a Kinetic's next tier you must reach its level gate <b>and</b> already know at least <b>3 techniques from its previous tier</b>."));
    // Learn buttons are disabled (not hidden) when you have no TP, so a met requirement never *looks* unmet.
    const noTP = availTP <= 0;
    if (noTP) tp.appendChild(el("div", "muted", "No Technique Points to spend right now — browse what each Kinetic offers; the Learn buttons enable once you level up."));

    const learnable = PC.TECHNIQUES.filter((t) => tierUnlocked(t.tier) && tierPrereqMet(t) && knownNames.indexOf(t.name) < 0);
    const byKin = {};
    learnable.forEach((t) => { (byKin[t.kinetic] = byKin[t.kinetic] || []).push(t); });

    const luProf = b ? b.combat[1] : null;
    const luPursued = (kin) => known().some((n) => { const k = PC.technique(n); return k && k.kinetic === kin; });
    // Kinetic proficiency/expertise earned by completing Adept/Expert tiers (see rules.js).
    const luIsFocus = (kin) => !!b && b.combat.indexOf(kin) > -1;
    const luProfLevel = (kin) => PC.kineticProfLevel(kin, known(), luIsFocus(kin));
    const learnTech = (t) => {
      const before = luProfLevel(t.kinetic);
      rec.learnedTechniques.push(t.name);
      const after = luProfLevel(t.kinetic); // known() now includes the freshly-learned technique
      if (before !== "expertise" && after === "expertise") toast(`✦ Expertise gained in ${t.kinetic}! Double proficiency bonus on its technique attacks.`);
      else if (before === "none" && after === "proficient") toast(`✓ Proficiency gained in ${t.kinetic}! (completed its Adept tier)`);
      persist();
    };
    // Per-Kinetic locked-tier explanation (only for tiers this character is pursuing).
    const lockedFor = (kin) => {
      if (!luPursued(kin)) return [];
      const notes = [];
      ["Adept", "Expert", "Master"].forEach((tier) => {
        const needLevel = !tierUnlocked(tier);
        const needPrereq = countKnownIn(kin, prevTier[tier]) < 3;
        if (needLevel || needPrereq) {
          const why = [];
          if (needLevel) why.push("Soul Level " + tierGate[tier]);
          if (needPrereq) why.push((3 - countKnownIn(kin, prevTier[tier])) + " more " + prevTier[tier]);
          notes.push(`${tier}: needs ${why.join(" + ")}`);
        }
      });
      return notes;
    };

    const luOrder = orderKineticNames(PC.KINETICS.map((k) => k.name), luProf, luPursued);
    if (luOrder.indexOf(levelUpKinTab) < 0) levelUpKinTab = luOrder[0];

    tp.appendChild(kineticPicker({
      order: luOrder,
      active: levelUpKinTab,
      proficient: luProf,
      pursued: luPursued,
      badge: (kin) => { const n = (byKin[kin] || []).length; return n ? n : null; },
      onSelect: (kin) => { levelUpKinTab = kin; render(); },
      renderPane: (kin) => {
        const pane = el("div");
        const k = PC.kinetic(kin);
        const lvl = luProfLevel(kin);
        const statusTag = lvl === "expertise" ? ' <span class="kin-prof-badge exp">✦ Expertise</span>' : lvl === "proficient" ? ' <span class="kin-prof-badge pro">✓ Proficient</span>' : "";
        pane.appendChild(el("div", "kin-pane-head", `<b>${kin}</b> — ${k.attr} · ${k.role} · ${PC.CHAKRAS[k.attr].name} chakra · <span class="muted">${k.domain}</span>${statusTag}`));
        // Progress toward the next proficiency milestone (all of a tier — 3 per tier).
        const adeptAll = PC.kineticTierTechniques(kin, "Adept"), expertAll = PC.kineticTierTechniques(kin, "Expert");
        const adeptDone = adeptAll.filter((t) => known().indexOf(t.name) > -1).length;
        const expertDone = expertAll.filter((t) => known().indexOf(t.name) > -1).length;
        if (lvl === "expertise") pane.appendChild(el("div", "hint", "✦ Expertise — double proficiency bonus on this Kinetic's technique attacks."));
        else if (lvl === "proficient") pane.appendChild(el("div", "hint", `Proficient. Learn all Expert-tier techniques (<b>${expertDone}/${expertAll.length}</b>) to gain <b>expertise</b> (double prof).`));
        else pane.appendChild(el("div", "hint", `Learn all Adept-tier techniques (<b>${adeptDone}/${adeptAll.length}</b>) to gain <b>proficiency</b> in this Kinetic.`));
        const list = byKin[kin] || [];
        if (list.length) list.forEach((t) => pane.appendChild(techLearnCard(t, () => { learnTech(t); }, noTP)));
        else pane.appendChild(el("div", "muted", "Nothing learnable in this Kinetic right now."));
        const locks = lockedFor(kin);
        if (locks.length) { const ln = el("div", "hint kin-lock"); ln.innerHTML = "🔒 " + locks.join(" · "); pane.appendChild(ln); }
        return pane;
      },
    }));
    wrap.appendChild(tp);

    // learn combat skills (from Regional Heritage system)
    const cp = el("div", "panel");
    const ownStyle = PC.styleForHeritage(rec.heritage);
    cp.appendChild(el("div", "section-label", `Combat Skills — ${availCSP} CSP available (1 each)`));
    cp.appendChild(el("p", "hint", `You earn <b>+1 Combat Skill Point every 5th Soul Level</b> (5, 10, 15, 20, 25, 30). Your Heritage's <b>Fighting Style</b>${ownStyle ? " (" + ownStyle.name + ")" : ""} grants 2 skills + its passive free and always known. Combat skills are organized into Fighting Styles like techniques into Kinetics — spend CSP to learn any skill from <b>any</b> style, including its passive buff.`));

    cp.appendChild(el("div", "eq-choice-label", "Known combat skills"));
    const csKnownList = el("div", "pill-list");
    knownCS.forEach((n) => {
      const fromHeritage = heritageSkills.indexOf(n) >= 0;
      const pill = el("span", "pill" + (fromHeritage ? "" : " psi"), n + (fromHeritage ? " ★" : " ✕"));
      if (fromHeritage) { pill.title = "Granted by your " + rec.heritage + " Fighting Style"; }
      else { pill.style.cursor = "pointer"; pill.title = "Unlearn (refund 1 CSP)"; pill.onclick = () => { rec.learnedCombatSkills = rec.learnedCombatSkills.filter((x) => x !== n); persist(); }; }
      csKnownList.appendChild(pill);
    });
    cp.appendChild(csKnownList);

    cp.appendChild(el("div", "eq-choice-label", "Learnable — by Fighting Style"));
    if (availCSP <= 0) cp.appendChild(el("div", "muted", "No Combat Skill Points available — reach the next 5th level to earn one."));
    else {
      // Group learnable skills by Fighting Style; list the character's own style first.
      const styles = (PC.FIGHTING_STYLES || []).slice().sort((a, b) => {
        if (ownStyle && a.name === ownStyle.name) return -1;
        if (ownStyle && b.name === ownStyle.name) return 1;
        return 0;
      });
      let anyLearnable = false;
      styles.forEach((st) => {
        const learnable = st.skills.filter((s) => knownCS.indexOf(s.name) < 0);
        if (!learnable.length) return;
        anyLearnable = true;
        const isOwn = ownStyle && st.name === ownStyle.name;
        cp.appendChild(el("div", "skill-attr-label", "⚔ " + st.name + (isOwn ? " (your style)" : "")));
        learnable.forEach((s) => {
          const card = el("div", "tech-card");
          const head = el("div", "thead");
          head.innerHTML = `<span class="tname">${s.action === "Passive" ? "★ " : ""}${s.name}</span><span class="tmeta">${s.action}</span>`;
          card.appendChild(head);
          card.appendChild(el("div", "teff", "▸ " + s.effect));
          const btn = el("button", "btn small primary", "Learn (1 CSP)");
          btn.style.marginTop = "8px";
          btn.onclick = () => { rec.learnedCombatSkills.push(s.name); persist(); };
          card.appendChild(btn);
          cp.appendChild(card);
        });
      });
      if (!anyLearnable) cp.appendChild(el("div", "muted", "You already know every combat skill."));
    }
    wrap.appendChild(cp);
    return wrap;
  }

  /* ---------- shared API for play.js ---------- */
  window.PsionApp = {
    loadRoster: loadRoster,
    saveRoster: saveRoster,
    toast: toast,
    goHome: function () { playId = null; levelUpId = null; state = null; render(); },
    openLevelUp: function (id) { playId = null; state = null; levelUpId = id; levelUpKinTab = null; render(); },
    render: render,
    el: el,
    // Description schema (shared with play.js so the creator + play tab stay in sync).
    descriptionGroups: DESCRIPTION_GROUPS,
    descriptionMisc: DESCRIPTION_MISC,
    defaultDescription: defaultDescription,
  };

  /* ---------- boot ---------- */
  function boot() {
    $("#new-btn").onclick = () => { playId = null; levelUpId = null; startCreator(); };
    $("#home-btn").onclick = () => { playId = null; levelUpId = null; state = null; render(); };
    render();
  }
  // Boot as soon as the DOM is ready. Guard on readyState so bundling contexts that run scripts
  // after the document has already parsed (e.g. a single-file Artifact build) still start up.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
