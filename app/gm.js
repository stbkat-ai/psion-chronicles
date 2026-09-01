/* ============================================================
   Psion Chronicles — GM section (Campaign & Session Manager)
   The "run the game" side: local-first campaigns, each with a premise + GM
   notes, a dated session log, and an NPC roster (with an optional link to a
   Bestiary creature for a stat block). Persists to localStorage — per-device,
   like characters. Networked/shared play is a later, backend-dependent phase.
   Depends on window.PsionApp (el/toast) and window.PC (bestiary). Exposes
   window.PsionGM. See the GM-section notes in DESIGN_LOG.md.
   ============================================================ */
(function () {
  "use strict";
  // gm.js loads before app.js, so resolve PsionApp lazily (at call time, never at module load).
  const App = () => window.PsionApp || {};
  const PC = window.PC || {};
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toast = (m) => { if (App().toast) App().toast(m); };
  const uid = (p) => (p || "id") + "_" + Date.now().toString(36) + "_" + Math.floor(Math.random() * 1e6).toString(36);

  const STORE_KEY = "psion_chronicles_campaigns";

  /* ---------- persistence ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(campaigns)); return true; }
    catch (e) { toast("⚠ Couldn't save — this browser is blocking local storage."); return false; }
  }
  let campaigns = load();
  function findCampaign(id) { return campaigns.find((c) => c.id === id); }

  /* ---------- view state (kept across this section's re-renders) ---------- */
  let mount = null, campaignId = null, tab = "party", expanded = null, xpAmount = "";
  let lootSearch = "", lootCat = "All"; // Loot-tab catalog browser state
  let encounterId = null, encSearch = "", encBiome = "All"; // Encounters-tab state

  function render(host) { if (host) mount = host; campaigns = load(); draw(); }
  function openCampaign(id) { campaignId = id; tab = "party"; expanded = null; encounterId = null; draw(); window.scrollTo(0, 0); }
  function goHome() { campaignId = null; expanded = null; encounterId = null; draw(); }

  /* ---------- shared bits ---------- */
  function labeled(label, node) { const w = el("label", "gm-field"); w.appendChild(el("span", "gm-label", esc(label))); w.appendChild(node); return w; }
  function textInput(val, ph, oninput) { const i = el("input", "gm-input"); i.type = "text"; if (ph) i.placeholder = ph; i.value = val || ""; i.oninput = () => oninput(i.value); return i; }
  function area(val, ph, oninput, rows) { const t = el("textarea", "gm-area"); if (ph) t.placeholder = ph; t.rows = rows || 4; t.value = val || ""; t.oninput = () => oninput(t.value); return t; }

  /* ---------- top bar ---------- */
  function topBar() {
    const bar = el("div", "gm-topbar");
    const home = el("button", "btn ghost small", campaignId ? "← All campaigns" : "← Home");
    home.onclick = () => { if (campaignId) goHome(); else if (App().goToHome) App().goToHome(); };
    bar.appendChild(home);
    bar.appendChild(el("div", "gm-brand", "🎲 Game Master"));
    return bar;
  }

  /* ---------- draw ---------- */
  function draw() {
    if (!mount) return;
    mount.innerHTML = "";
    const wrap = el("div", "gm");
    wrap.appendChild(topBar());
    wrap.appendChild(campaignId && findCampaign(campaignId) ? campaignView() : campaignsHome());
    mount.appendChild(wrap);
  }

  /* ---------- campaigns home ---------- */
  function campaignsHome() {
    const root = el("div");
    const head = el("div", "gm-head");
    head.appendChild(el("h2", null, "Campaigns"));
    head.appendChild(el("p", "hint", "Build and run your Psion Chronicles games. Each campaign keeps its premise, your GM notes, a session log, and an NPC roster — all saved right here in this browser."));
    root.appendChild(head);

    // New-campaign form
    const form = el("div", "gm-newform panel");
    const nameI = textInput("", "New campaign name", () => {});
    const addBtn = el("button", "btn small primary", "+ Create Campaign");
    addBtn.onclick = () => { const n = nameI.value.trim(); if (!n) { toast("Name your campaign."); return; } addCampaign(n); };
    nameI.addEventListener("keydown", (e) => { if (e.key === "Enter") addBtn.onclick(); });
    form.appendChild(labeled("New campaign", nameI));
    form.appendChild(addBtn);
    root.appendChild(form);

    if (!campaigns.length) { root.appendChild(el("div", "muted", "No campaigns yet. Create one above to get started.")); return root; }

    const list = el("div", "gm-camp-list");
    campaigns.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).forEach((c) => {
      const card = el("div", "panel gm-camp-card");
      card.appendChild(el("div", "gm-camp-name", esc(c.name)));
      if (c.premise) card.appendChild(el("div", "gm-camp-premise", esc(c.premise)));
      const meta = el("div", "gm-camp-meta");
      meta.innerHTML = `<span>🗓 ${(c.sessions || []).length} session${(c.sessions || []).length === 1 ? "" : "s"}</span><span>🎭 ${(c.npcs || []).length} NPC${(c.npcs || []).length === 1 ? "" : "s"}</span>`;
      card.appendChild(meta);
      card.style.cursor = "pointer";
      card.onclick = () => openCampaign(c.id);
      list.appendChild(card);
    });
    root.appendChild(list);
    return root;
  }

  function addCampaign(name) {
    campaigns.push({ id: uid("cmp"), name: name, premise: "", notes: "", createdAt: Date.now(), sessions: [], npcs: [] });
    save();
    const created = campaigns[campaigns.length - 1];
    toast(`Created “${name}”.`);
    openCampaign(created.id);
  }
  function removeCampaign(id) {
    const i = campaigns.findIndex((c) => c.id === id); if (i < 0) return;
    const nm = campaigns[i].name;
    campaigns.splice(i, 1); save();
    toast(`Deleted “${nm}”.`);
    goHome();
  }

  /* ---------- campaign detail ---------- */
  function campaignView() {
    const c = findCampaign(campaignId);
    const root = el("div");
    root.appendChild(el("div", "gm-crumbs", esc(c.name)));

    // Tab bar
    const tabs = el("div", "gm-tabs");
    [["party", `Party (${(c.party || []).length})`], ["loot", "Loot"], ["encounters", `Encounters (${(c.encounters || []).length})`], ["combat", c.combat ? "Combat ●" : "Combat"], ["overview", "Overview"], ["sessions", `Sessions (${(c.sessions || []).length})`], ["npcs", `NPCs (${(c.npcs || []).length})`]].forEach(([k, lbl]) => {
      const b = el("button", "gm-tab" + (tab === k ? " active" : "") + (k === "combat" && c.combat ? " gm-tab-live" : ""), lbl);
      b.onclick = () => { tab = k; expanded = null; encounterId = null; draw(); };
      tabs.appendChild(b);
    });
    root.appendChild(tabs);

    if (tab === "party") root.appendChild(partyTab(c));
    else if (tab === "loot") root.appendChild(lootTab(c));
    else if (tab === "encounters") root.appendChild(encountersTab(c));
    else if (tab === "combat") root.appendChild(combatTab(c));
    else if (tab === "overview") root.appendChild(overviewTab(c));
    else if (tab === "sessions") root.appendChild(sessionsTab(c));
    else root.appendChild(npcsTab(c));
    return root;
  }

  /* ----- Party (player characters) ----- */
  // Local-first: the party is drawn from characters saved on this device (PsionApp roster), referenced by id.
  // When networked play arrives, this same view becomes the remote roster of players' characters.
  function charVitals(rec) {
    try {
      const eff = PC.effectiveScores(rec.baseScores, PC.charAttrBoosts(rec), null);
      const pb = PC.charPoolBoost(rec);
      return { hp: PC.bodyPool(eff, pb), kp: PC.mindPool(eff, pb) };
    } catch (e) { return { hp: "—", kp: "—" }; }
  }
  function partyTab(c) {
    if (!Array.isArray(c.party)) c.party = [];
    const root = el("div");
    const roster = App().loadRoster ? App().loadRoster() : [];

    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "🛡 The Party"));
    intro.appendChild(el("p", "hint", "The player characters in this campaign. Add characters saved on this device, and open any sheet to run it at the table. <i>(Inviting players to bring their own characters over the network comes with a later online-play phase — for now the party is drawn from this device.)</i>"));

    // Add-character control: roster characters not already in the party.
    const available = roster.filter((r) => c.party.indexOf(r.id) < 0);
    if (roster.length === 0) {
      intro.appendChild(el("div", "muted", "No characters on this device yet. Create one in the Player section first, then add them here."));
    } else if (available.length === 0) {
      intro.appendChild(el("div", "muted", "Every character on this device is already in the party."));
    } else {
      const form = el("div", "gm-newform");
      const sel = el("select", "gm-input");
      sel.innerHTML = `<option value="">— choose a character —</option>` + available.map((r) => `<option value="${esc(r.id)}">${esc(r.name || "Unnamed")} · ${esc(r.background || "—")} · SL ${esc(String(r.level))}</option>`).join("");
      const add = el("button", "btn small primary", "+ Add to Party");
      add.onclick = () => { if (!sel.value) { toast("Choose a character to add."); return; } addToParty(c, sel.value); };
      form.appendChild(labeled("Add character", sel));
      form.appendChild(add);
      intro.appendChild(form);
    }
    root.appendChild(intro);

    if (!c.party.length) { root.appendChild(el("div", "muted", "No characters in the party yet.")); return root; }

    root.appendChild(awardsPanel(c, roster));

    const grid = el("div", "gm-party-grid");
    c.party.forEach((id) => {
      const rec = roster.find((r) => r.id === id);
      const card = el("div", "panel gm-party-card");
      if (!rec) {
        // Referenced character no longer exists on this device.
        card.classList.add("gm-party-missing");
        card.appendChild(el("div", "gm-party-name", "Character not found"));
        card.appendChild(el("div", "muted", "This character was removed from this device."));
        const rm = el("button", "btn ghost small", "Remove from party");
        rm.onclick = () => removeFromParty(c, id);
        card.appendChild(rm);
        grid.appendChild(card);
        return;
      }
      const v = charVitals(rec);
      const head = el("div", "gm-party-head");
      if (rec.thumb) { const th = el("img", "gm-party-thumb"); th.src = rec.thumb; th.alt = rec.name || "portrait"; head.appendChild(th); }
      const title = el("div");
      title.appendChild(el("div", "gm-party-name", esc(rec.name || "Unnamed")));
      title.appendChild(el("div", "gm-party-meta", `${esc(rec.background || "—")}${rec.heritage ? " · " + esc(rec.heritage) : ""} · Soul Level ${esc(String(rec.level))}`));
      head.appendChild(title);
      card.appendChild(head);

      const stats = el("div", "gm-party-stats");
      stats.innerHTML = `<div><b class="hpn">${v.hp}</b><span>HP</span></div><div><b class="kpn">${v.kp}</b><span>KP</span></div><div><b>${esc(String(rec.level))}</b><span>Soul Lv</span></div>`;
      card.appendChild(stats);

      // XP progress toward the next Soul Level (leveling itself is done on the player's own sheet).
      let bar = null; try { bar = PC.xpBar(rec.xp || 0, rec.level || 1); } catch (e) {}
      if (bar) {
        const xpLine = el("div", "gm-party-xp");
        xpLine.innerHTML = bar.maxed
          ? `<span class="muted">Max Soul Level (30) · ${(rec.xp || 0).toLocaleString()} XP</span>`
          : `<span class="muted">${bar.into.toLocaleString()} / ${bar.span.toLocaleString()} XP → Lv ${(rec.level || 1) + 1}</span>${bar.ready ? ` <span class="gm-lvlready">Ready to level up</span>` : ""}`;
        card.appendChild(xpLine);
        const track = el("div", "bar-track"); const fill = el("div", "bar-fill");
        fill.style.width = (bar.maxed ? 100 : bar.pct) + "%";
        fill.style.background = (bar.ready || bar.maxed) ? "var(--gold)" : "var(--cyan)";
        track.appendChild(fill); card.appendChild(track);
      }

      const row = el("div", "nav-row");
      const openBtn = el("button", "btn primary small", "▶ Open Sheet");
      openBtn.onclick = () => { if (App().openPlay) App().openPlay(rec.id); };
      const xpBtn = el("button", "btn small", "＋XP");
      xpBtn.title = "Award the XP amount above to this character";
      xpBtn.onclick = () => { const amt = parseInt(xpAmount, 10); if (!amt || amt <= 0) { toast("Enter an XP amount in the Award box first."); return; } awardXp(c, rec.id, amt); };
      const rm = el("button", "btn ghost small", "Remove");
      rm.onclick = () => removeFromParty(c, id);
      row.appendChild(openBtn); row.appendChild(xpBtn); row.appendChild(rm);
      card.appendChild(row);
      grid.appendChild(card);
    });
    root.appendChild(grid);
    root.appendChild(awardsLog(c, "xp", "Recent XP awards"));
    return root;
  }

  /* ----- Awards (XP & loot) ----- */
  function awardsPanel(c, roster) {
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "🎖 Award XP"));
    const xrow = el("div", "gm-award-row");
    const amt = el("input", "gm-input gm-xp-amt"); amt.type = "number"; amt.min = "0"; amt.placeholder = "XP amount"; amt.value = xpAmount;
    amt.oninput = () => { xpAmount = amt.value; };
    const partyBtn = el("button", "btn small primary", "Award to whole party");
    partyBtn.onclick = () => { const v = parseInt(xpAmount, 10); if (!v || v <= 0) { toast("Enter an XP amount."); return; } awardParty(c, v); };
    xrow.appendChild(labeled("XP", amt)); xrow.appendChild(partyBtn);
    p.appendChild(xrow);
    p.appendChild(el("p", "hint", "Award XP to the whole party, or tap <b>＋XP</b> on a character to give just them the amount above. It flows into their Soul Pool; they level up on their own sheet when the bar is full. <i>(Hand out items on the <b>Loot</b> tab.)</i>"));
    return p;
  }
  function awardsLog(c, kind, title) {
    const awards = (c.awards || []).filter((a) => !kind || a.kind === kind);
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", title || "Recent awards"));
    if (!awards.length) { p.appendChild(el("div", "muted", "Nothing logged yet.")); return p; }
    const list = el("div", "gm-award-log");
    awards.slice().reverse().slice(0, 40).forEach((a) => {
      const row = el("div", "gm-award-entry");
      const when = a.at ? new Date(a.at).toLocaleDateString() : "";
      row.innerHTML = `<span class="gm-award-icon">${a.kind === "xp" ? "✨" : "💰"}</span><span class="gm-award-text">${esc(a.text)}</span><span class="gm-award-when muted">${esc(when)}</span>`;
      const rm = el("button", "btn ghost small", "✕"); rm.title = "Remove entry"; rm.onclick = () => removeAward(c, a.id);
      row.appendChild(rm);
      list.appendChild(row);
    });
    p.appendChild(list);
    return p;
  }
  function pushAward(c, kind, text) { if (!Array.isArray(c.awards)) c.awards = []; c.awards.push({ id: uid("awd"), kind: kind, text: text, at: Date.now() }); }
  function awardXp(c, charId, amount) {
    const list = App().loadRoster ? App().loadRoster() : [];
    const rec = list.find((r) => r.id === charId);
    if (!rec) { toast("That character isn't on this device."); return; }
    rec.xp = Math.max(0, (rec.xp || 0) + amount);
    if (App().saveRoster) App().saveRoster(list);
    pushAward(c, "xp", `${amount.toLocaleString()} XP → ${rec.name || "Unnamed"}`); save();
    toast(`Awarded ${amount.toLocaleString()} XP to ${rec.name || "the character"}.`);
    draw();
  }
  function awardParty(c, amount) {
    const list = App().loadRoster ? App().loadRoster() : [];
    let n = 0;
    c.party.forEach((id) => { const rec = list.find((r) => r.id === id); if (rec) { rec.xp = Math.max(0, (rec.xp || 0) + amount); n++; } });
    if (!n) { toast("No party characters on this device to award."); return; }
    if (App().saveRoster) App().saveRoster(list);
    pushAward(c, "xp", `${amount.toLocaleString()} XP → whole party (${n})`); save();
    toast(`Awarded ${amount.toLocaleString()} XP to the party.`);
    draw();
  }
  function logLoot(c, text, toId) {
    let toName = "the party";
    if (toId && toId !== "party") { const list = App().loadRoster ? App().loadRoster() : []; const rec = list.find((r) => r.id === toId); toName = rec ? (rec.name || "Unnamed") : "someone"; }
    pushAward(c, "loot", `${text} → ${toName}`); save();
    toast("Loot logged.");
  }
  function removeAward(c, id) { if (!Array.isArray(c.awards)) return; const i = c.awards.findIndex((a) => a.id === id); if (i > -1) { c.awards.splice(i, 1); save(); draw(); } }

  /* ----- Loot menu (catalog → inventory) ----- */
  function itemCategories() {
    const set = {}; (PC.ITEMS || []).forEach((it) => { if (it.category) set[it.category] = true; });
    return ["All"].concat(Object.keys(set).sort());
  }
  // Grant a real catalog item into the recipient's inventory (merging like stacks), then log it.
  function giveItem(c, recipientId, item, qty, afterHistory) {
    const list = App().loadRoster ? App().loadRoster() : [];
    const targets = recipientId === "party"
      ? c.party.map((id) => list.find((r) => r.id === id)).filter(Boolean)
      : [list.find((r) => r.id === recipientId)].filter(Boolean);
    if (!targets.length) { toast("No recipient — add a character to the party first."); return; }
    targets.forEach((rec) => {
      if (!Array.isArray(rec.inventory)) rec.inventory = [];
      const ex = rec.inventory.find((it) => it.category === item.category && it.name === item.name);
      if (ex) ex.qty = (Number(ex.qty) || 0) + qty;
      else rec.inventory.push(Object.assign({}, item, { qty: qty, id: "it_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36) + "_" + item.name.replace(/\s+/g, "").slice(0, 6) }));
    });
    if (App().saveRoster) App().saveRoster(list);
    const toName = recipientId === "party" ? `the party (${targets.length})` : (targets[0].name || "Unnamed");
    pushAward(c, "loot", `${qty > 1 ? qty + "× " : ""}${item.name} → ${toName}`); save();
    toast(`Gave ${qty > 1 ? qty + "× " : ""}${item.name} to ${toName}.`);
    if (afterHistory) afterHistory();
  }
  function lootTab(c) {
    if (!Array.isArray(c.party)) c.party = [];
    const root = el("div");
    const roster = App().loadRoster ? App().loadRoster() : [];
    const partyOptions = () => c.party.map((id) => { const r = roster.find((x) => x.id === id); return r ? `<option value="${esc(r.id)}">${esc(r.name || "Unnamed")}</option>` : ""; }).join("");

    const panel = el("div", "panel");
    panel.appendChild(el("div", "section-label", "💰 Loot menu"));
    panel.appendChild(el("p", "hint", "Hand out gear straight from the catalog — it drops into the chosen character's inventory (and shows on their sheet). For coin or anything not in the catalog, use the custom note below."));

    // Recipient + quantity
    const ctl = el("div", "gm-award-row");
    const recip = el("select", "gm-input");
    recip.innerHTML = (c.party.length ? `<option value="party">Whole party</option>` : "") + partyOptions();
    const qty = el("input", "gm-input gm-xp-amt"); qty.type = "number"; qty.min = "1"; qty.value = "1";
    ctl.appendChild(labeled("Give to", recip)); ctl.appendChild(labeled("Qty", qty));
    panel.appendChild(ctl);
    if (!c.party.length) panel.appendChild(el("div", "muted", "Add characters to the party (Party tab) to drop items into an inventory. You can still log custom loot notes below."));

    // Search + category
    const srow = el("div", "gm-award-row");
    const search = el("input", "gm-input"); search.type = "search"; search.placeholder = "Search the item catalog…"; search.value = lootSearch;
    const catSel = el("select", "gm-input");
    catSel.innerHTML = itemCategories().map((k) => `<option value="${esc(k)}" ${lootCat === k ? "selected" : ""}>${esc(k)}</option>`).join("");
    srow.appendChild(labeled("Search", search)); srow.appendChild(labeled("Category", catSel));
    panel.appendChild(srow);

    const results = el("div", "gm-loot-results");
    panel.appendChild(results);
    root.appendChild(panel);

    function renderHistory() { hist.innerHTML = ""; hist.appendChild(awardsLog(c, "loot", "Recent loot")); }
    function renderResults() {
      results.innerHTML = "";
      const q = lootSearch.trim().toLowerCase();
      let items = (PC.ITEMS || []).filter((it) => lootCat === "All" || it.category === lootCat);
      if (q) items = items.filter((it) => (`${it.name} ${it.category} ${it.desc || ""}`).toLowerCase().indexOf(q) > -1);
      items = items.slice().sort((a, b) => a.name.localeCompare(b.name));
      results.appendChild(el("div", "gm-loot-count muted", `${items.length} item${items.length === 1 ? "" : "s"}`));
      const canGive = c.party.length > 0;
      items.slice(0, 80).forEach((it) => {
        const row = el("div", "gm-loot-row");
        row.innerHTML = `<span class="gm-loot-name">${esc(it.name)}</span><span class="gm-loot-cat muted">${esc(it.category || "")}${it.weight != null ? " · " + esc(String(it.weight)) + " wt" : ""}</span>`;
        const give = el("button", "btn small primary", "＋ Give"); give.disabled = !canGive;
        give.onclick = () => { const n = Math.max(1, parseInt(qty.value, 10) || 1); giveItem(c, recip.value, it, n, renderHistory); };
        row.appendChild(give);
        results.appendChild(row);
      });
      if (items.length > 80) results.appendChild(el("div", "muted", "Showing the first 80 — refine your search to narrow it down."));
    }
    search.oninput = () => { lootSearch = search.value; renderResults(); };
    catSel.onchange = () => { lootCat = catSel.value; renderResults(); };

    // Custom (non-catalog) loot note
    const cpanel = el("div", "panel");
    cpanel.appendChild(el("div", "section-label", "Custom loot (note only)"));
    const crow = el("div", "gm-award-row");
    const ctext = el("input", "gm-input"); ctext.type = "text"; ctext.placeholder = "e.g. 200 barter scrip, a sealed letter…";
    const cto = el("select", "gm-input");
    cto.innerHTML = `<option value="party">Whole party</option>` + partyOptions();
    const cbtn = el("button", "btn small", "Log note");
    cbtn.onclick = () => { const t = ctext.value.trim(); if (!t) { toast("Describe the loot."); return; } logLoot(c, t, cto.value); ctext.value = ""; renderHistory(); };
    crow.appendChild(labeled("Loot", ctext)); crow.appendChild(labeled("To", cto)); crow.appendChild(cbtn);
    cpanel.appendChild(crow);
    cpanel.appendChild(el("p", "hint", "A note only — nothing enters an inventory. Use it for coin, story items, or anything not in the catalog."));
    root.appendChild(cpanel);

    const hist = el("div"); root.appendChild(hist);

    renderResults(); renderHistory();
    return root;
  }

  /* ----- Encounter Builder ----- */
  // First-pass, tunable difficulty: adjusted encounter XP (with a crowd multiplier) vs a party budget of
  // 25×(Soul Level²) per character. All numbers are shown so a GM can judge for themselves.
  function encounterDifficulty(c, entries, roster) {
    const party = (c.party || []).map((id) => roster.find((r) => r.id === id)).filter(Boolean);
    const budget = party.reduce((s, r) => s + 25 * Math.pow(Number(r.level) || 1, 2), 0);
    let count = 0, totalXp = 0;
    (entries || []).forEach((e) => { const b = PC.bestiary && PC.bestiary(e.beastId); if (b) { count += e.count; totalXp += (Number(b.xp) || 0) * e.count; } });
    const mult = count <= 1 ? 1 : count === 2 ? 1.5 : count <= 6 ? 2 : count <= 10 ? 2.5 : 3;
    const adj = Math.round(totalXp * mult);
    let band = "—", ratio = 0;
    if (count && budget > 0) { ratio = adj / budget; band = ratio < 0.5 ? "Trivial" : ratio < 1 ? "Easy" : ratio < 1.6 ? "Standard" : ratio < 2.5 ? "Hard" : "Deadly"; }
    return { count: count, totalXp: totalXp, adj: adj, mult: mult, budget: budget, ratio: ratio, band: band, partyN: party.length };
  }
  function addEncounter(c, name) { if (!Array.isArray(c.encounters)) c.encounters = []; const e = { id: uid("enc"), name: name, notes: "", entries: [], createdAt: Date.now() }; c.encounters.push(e); save(); encounterId = e.id; draw(); window.scrollTo(0, 0); }
  function removeEncounter(c, id) { const i = c.encounters.findIndex((e) => e.id === id); if (i > -1) c.encounters.splice(i, 1); encounterId = null; save(); draw(); }
  function addCreatureToEnc(enc, beastId) { if (!Array.isArray(enc.entries)) enc.entries = []; const ex = enc.entries.find((e) => e.beastId === beastId); if (ex) ex.count++; else enc.entries.push({ beastId: beastId, count: 1 }); save(); }

  function encountersTab(c) {
    if (!Array.isArray(c.encounters)) c.encounters = [];
    const roster = App().loadRoster ? App().loadRoster() : [];
    const enc = encounterId ? c.encounters.find((e) => e.id === encounterId) : null;
    if (enc) return encounterEditor(c, enc, roster);

    const root = el("div");
    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "⚔ Encounters"));
    intro.appendChild(el("p", "hint", "Build fights from the Bestiary and see how hard they'll hit this campaign's party. <i>(Difficulty is a first-pass, tunable guide — the bestiary's XP values are still placeholders.)</i>"));
    const form = el("div", "gm-newform");
    const nameI = textInput("", "New encounter name", () => {});
    const add = el("button", "btn small primary", "+ Create Encounter");
    add.onclick = () => { const n = nameI.value.trim(); if (!n) { toast("Name the encounter."); return; } addEncounter(c, n); };
    nameI.addEventListener("keydown", (e) => { if (e.key === "Enter") add.onclick(); });
    form.appendChild(labeled("New encounter", nameI)); form.appendChild(add);
    intro.appendChild(form);
    root.appendChild(intro);

    if (!c.encounters.length) { root.appendChild(el("div", "muted", "No encounters yet.")); return root; }
    const grid = el("div", "gm-camp-list");
    c.encounters.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).forEach((e) => {
      const d = encounterDifficulty(c, e.entries, roster);
      const card = el("div", "panel gm-camp-card");
      card.appendChild(el("div", "gm-camp-name", esc(e.name)));
      const meta = el("div", "gm-camp-meta");
      meta.innerHTML = `<span>👹 ${d.count} creature${d.count === 1 ? "" : "s"}</span><span>✨ ${d.totalXp.toLocaleString()} XP</span>` + (d.band !== "—" ? `<span class="gm-diff gm-diff-${d.band.toLowerCase()}">${d.band}</span>` : "");
      card.appendChild(meta);
      card.style.cursor = "pointer"; card.onclick = () => { encounterId = e.id; draw(); window.scrollTo(0, 0); };
      grid.appendChild(card);
    });
    root.appendChild(grid);
    return root;
  }

  function encounterEditor(c, enc, roster) {
    if (!Array.isArray(enc.entries)) enc.entries = [];
    const root = el("div");
    const bar = el("div", "gm-topbar");
    const back = el("button", "btn ghost small", "← All encounters");
    back.onclick = () => { encounterId = null; draw(); };
    bar.appendChild(back);
    root.appendChild(bar);

    const head = el("div", "panel");
    head.appendChild(labeled("Encounter name", textInput(enc.name, "Encounter name", (v) => { enc.name = v; save(); })));
    head.appendChild(labeled("Notes", area(enc.notes, "Terrain, tactics, triggers…", (v) => { enc.notes = v; save(); }, 3)));
    root.appendChild(head);

    const diffPanel = el("div", "panel"); root.appendChild(diffPanel);
    const entriesPanel = el("div", "panel"); root.appendChild(entriesPanel);

    const browse = el("div", "panel");
    browse.appendChild(el("div", "section-label", "Add creatures"));
    const srow = el("div", "gm-award-row");
    const search = el("input", "gm-input"); search.type = "search"; search.placeholder = "Search the Bestiary…"; search.value = encSearch;
    const biomeSel = el("select", "gm-input");
    const biomes = ["All"].concat((PC.BIOMES || []).map((b) => b.name));
    biomeSel.innerHTML = biomes.map((n) => `<option value="${esc(n)}" ${encBiome === n ? "selected" : ""}>${esc(n)}</option>`).join("");
    srow.appendChild(labeled("Search", search)); srow.appendChild(labeled("Biome", biomeSel));
    browse.appendChild(srow);
    const results = el("div", "gm-loot-results"); browse.appendChild(results);
    root.appendChild(browse);

    function renderDiff() {
      diffPanel.innerHTML = "";
      const d = encounterDifficulty(c, enc.entries, roster);
      diffPanel.appendChild(el("div", "section-label", "Difficulty"));
      if (!d.count) { diffPanel.appendChild(el("div", "muted", "Add creatures below to gauge difficulty.")); return; }
      const verdict = d.band !== "—" ? `<span class="gm-diff gm-diff-${d.band.toLowerCase()}">${d.band}</span>` : `<span class="muted">add a party to gauge</span>`;
      const g = el("div", "gm-diff-grid");
      g.innerHTML = `<div><span class="muted">Verdict</span>${verdict}</div>` +
        `<div><span class="muted">Creatures</span><b>${d.count}</b></div>` +
        `<div><span class="muted">Total XP</span><b>${d.totalXp.toLocaleString()}</b></div>` +
        `<div><span class="muted">Adjusted (×${d.mult})</span><b>${d.adj.toLocaleString()}</b></div>` +
        `<div><span class="muted">Party budget</span><b>${d.budget.toLocaleString()}</b></div>`;
      diffPanel.appendChild(g);
      diffPanel.appendChild(el("p", "hint", `Weighed against ${d.partyN} party character${d.partyN === 1 ? "" : "s"}. Rough guide: adjusted encounter XP vs a party budget of 25×(Soul Level²) per character, with a crowd multiplier for numbers. Tune once you've playtested.`));
    }
    function renderEntries() {
      entriesPanel.innerHTML = "";
      const n = enc.entries.reduce((s, e) => s + e.count, 0);
      entriesPanel.appendChild(el("div", "section-label", `Creatures (${n})`));
      if (!enc.entries.length) { entriesPanel.appendChild(el("div", "muted", "None yet — add from the Bestiary below.")); return; }
      enc.entries.forEach((e, i) => {
        const b = PC.bestiary && PC.bestiary(e.beastId);
        const row = el("div", "gm-enc-row");
        const nm = b ? `${b.emoji || "🐾"} ${esc(b.name)}` : "Unknown creature";
        const sub = b ? `SL ${esc(b.slBand)} · ${esc(b.role)} · ${(Number(b.xp) || 0).toLocaleString()} XP ea` : "";
        row.innerHTML = `<span class="gm-enc-name">${nm}<span class="gm-enc-sub muted">${sub}</span></span>`;
        const ctr = el("div", "gm-enc-ctr");
        const dec = el("button", "btn small ghost", "−"); dec.onclick = () => { e.count--; if (e.count <= 0) enc.entries.splice(i, 1); save(); renderEntries(); renderDiff(); };
        const cnt = el("span", "gm-enc-count", "×" + e.count);
        const inc = el("button", "btn small ghost", "+"); inc.onclick = () => { e.count++; save(); renderEntries(); renderDiff(); };
        ctr.appendChild(dec); ctr.appendChild(cnt); ctr.appendChild(inc);
        row.appendChild(ctr);
        entriesPanel.appendChild(row);
      });
    }
    function renderResults() {
      results.innerHTML = "";
      const q = encSearch.trim().toLowerCase();
      let list = (PC.BESTIARY || []).filter((b) => { if (encBiome === "All") return true; const bi = (PC.BIOMES || []).find((x) => x.id === b.biome); return bi && bi.name === encBiome; });
      if (q) list = list.filter((b) => (`${b.name} ${b.origin} ${b.role} ${b.slBand}`).toLowerCase().indexOf(q) > -1);
      list = list.slice().sort((a, b) => a.name.localeCompare(b.name));
      results.appendChild(el("div", "gm-loot-count muted", `${list.length} creature${list.length === 1 ? "" : "s"}`));
      list.slice(0, 80).forEach((b) => {
        const row = el("div", "gm-loot-row");
        row.innerHTML = `<span class="gm-loot-name">${b.emoji || "🐾"} ${esc(b.name)}</span><span class="gm-loot-cat muted">SL ${esc(b.slBand)} · ${esc(b.role)} · ${(Number(b.xp) || 0).toLocaleString()} XP</span>`;
        const add = el("button", "btn small primary", "＋ Add");
        add.onclick = () => { addCreatureToEnc(enc, b.id); renderEntries(); renderDiff(); };
        row.appendChild(add); results.appendChild(row);
      });
      if (list.length > 80) results.appendChild(el("div", "muted", "Showing the first 80 — refine your search."));
    }
    search.oninput = () => { encSearch = search.value; renderResults(); };
    biomeSel.onchange = () => { encBiome = biomeSel.value; renderResults(); };

    const foot = el("div", "gm-overview-foot");
    const run = el("button", "btn small primary", "▶ Run in Combat");
    run.onclick = () => startCombat(c, enc.id);
    foot.appendChild(run);
    const del = el("button", "btn ghost small danger", "Delete encounter");
    del.onclick = () => { if (confirm(`Delete “${enc.name}”?`)) removeEncounter(c, enc.id); };
    foot.appendChild(del);
    root.appendChild(foot);

    renderDiff(); renderEntries(); renderResults();
    return root;
  }

  /* ----- Combat tracker ----- */
  const COMBAT_LOG_MAX = 60;
  function combatLog(c, text) { if (!c.combat) return; if (!Array.isArray(c.combat.log)) c.combat.log = []; c.combat.log.push({ t: Date.now(), text: text }); if (c.combat.log.length > COMBAT_LOG_MAX) c.combat.log = c.combat.log.slice(-COMBAT_LOG_MAX); }
  function combatRefresh(c) { save(); draw(); }
  function monsterCombatant(b, suffix, kind) {
    return { id: uid("cb"), kind: kind || "monster", name: (b.name || "Creature") + (suffix || ""), emoji: b.emoji || "👹", refId: b.id,
      init: null, initMod: Number(b.initMod) || 0, hp: Number(b.hp) || 10, hpMax: Number(b.hp) || 10, defense: Number(b.defense) || 10,
      conditions: [], attacks: (b.attacks || []).map((a) => ({ name: a.name, toHit: a.toHit, damage: a.damage, note: a.note })), down: false, notes: "" };
  }
  // A PC combatant is a live proxy over the character's own play session (rec.play): its HP and conditions
  // are read from and written back to the character record, so combat changes appear on the player's sheet.
  function pcCombatant(rec) { return { id: uid("cb"), kind: "pc", name: rec.name || "Unnamed", emoji: "🧙", refId: rec.id, init: null, attacks: [] }; }
  function pcDerived(rec) { try { const eff = PC.effectiveScores(rec.baseScores, PC.charAttrBoosts(rec), null); const pb = PC.charPoolBoost(rec); const der = PC.derive(eff, rec.level); return { maxHP: PC.bodyPool(eff, pb), defense: der.defenseScore, initMod: der.initiativeMod }; } catch (e) { return { maxHP: 10, defense: 12, initMod: 0 }; } }
  // Match play.js's rec.play shape enough to read/write HP + conditions without clobbering a real session.
  function ensureRecPlay(rec, maxHP) { if (!rec.play) rec.play = {}; if (typeof rec.play.hp !== "number") rec.play.hp = maxHP; if (!Array.isArray(rec.play.conditions)) rec.play.conditions = []; }
  // Live HP / defense / initiative / conditions for any combatant — PCs read through to their record.
  function combatantView(m, roster) {
    if (m.kind === "pc") {
      const rec = (roster || []).find((r) => r.id === m.refId);
      if (!rec) return { missing: true, hp: 0, max: 0, defense: "—", initMod: 0, conditions: [] };
      const d = pcDerived(rec); ensureRecPlay(rec, d.maxHP);
      return { missing: false, rec: rec, hp: rec.play.hp, max: d.maxHP, defense: d.defense, initMod: d.initMod, conditions: rec.play.conditions };
    }
    if (!Array.isArray(m.conditions)) m.conditions = [];
    return { missing: false, hp: m.hp, max: m.hpMax, defense: m.defense, initMod: Number(m.initMod) || 0, conditions: m.conditions };
  }
  // The live conditions array for a combatant + a commit fn (PCs persist to the roster).
  function condArrayOf(m) {
    if (m.kind === "pc") { const list = App().loadRoster ? App().loadRoster() : []; const rec = list.find((r) => r.id === m.refId); if (!rec) return null; const d = pcDerived(rec); ensureRecPlay(rec, d.maxHP); return { arr: rec.play.conditions, commit: () => { if (App().saveRoster) App().saveRoster(list); } }; }
    if (!Array.isArray(m.conditions)) m.conditions = [];
    return { arr: m.conditions, commit: () => {} };
  }
  function startCombat(c, encId) {
    const roster = App().loadRoster ? App().loadRoster() : [];
    const combatants = [];
    (c.party || []).forEach((id) => { const rec = roster.find((r) => r.id === id); if (rec) combatants.push(pcCombatant(rec)); });
    const enc = encId ? (c.encounters || []).find((e) => e.id === encId) : null;
    if (enc) (enc.entries || []).forEach((e) => { const b = PC.bestiary && PC.bestiary(e.beastId); if (b) for (let i = 1; i <= e.count; i++) combatants.push(monsterCombatant(b, e.count > 1 ? " " + i : "")); });
    c.combat = { encounterId: encId || null, name: enc ? enc.name : "Combat", round: 1, turn: 0, started: false, combatants: combatants, log: [] };
    combatLog(c, enc ? `Combat started — ${enc.name}.` : "Combat started.");
    tab = "combat"; save(); draw(); window.scrollTo(0, 0);
  }
  function endCombat(c) { if (confirm("End this combat? The tracker will be cleared.")) { delete c.combat; save(); draw(); } }
  function sortByInit(cb) { cb.combatants.sort((a, b) => { const av = a.init == null ? -Infinity : a.init, bv = b.init == null ? -Infinity : b.init; return bv - av; }); }
  function rollInitiative(c) {
    const cb = c.combat; const roster = App().loadRoster ? App().loadRoster() : [];
    cb.combatants.forEach((m) => { const v = combatantView(m, roster); const r = PC.rollCheck(Number(v.initMod) || 0, "normal"); m.init = r.total; });
    sortByInit(cb); cb.turn = 0; cb.started = true;
    combatLog(c, "Initiative rolled. Order: " + cb.combatants.map((m) => `${m.name} (${m.init})`).join(", "));
    combatRefresh(c);
  }
  function nextTurn(c) {
    const cb = c.combat; if (!cb.combatants.length) return;
    const ending = cb.combatants[cb.turn]; if (ending) tickCombatantConditions(c, ending); // End-of-turn tick, like the play sheet
    cb.turn = (cb.turn + 1) % cb.combatants.length;
    if (cb.turn === 0) { cb.round++; combatLog(c, `— Round ${cb.round} —`); }
    combatRefresh(c);
  }
  function combatDamage(c, m, delta) {
    if (m.kind === "pc") {
      const list = App().loadRoster ? App().loadRoster() : [];
      const rec = list.find((r) => r.id === m.refId); if (!rec) { toast("That character isn't on this device."); return; }
      const d = pcDerived(rec); ensureRecPlay(rec, d.maxHP);
      const before = Number(rec.play.hp) || 0;
      rec.play.hp = Math.max(0, Math.min(d.maxHP, before + delta));
      if (App().saveRoster) App().saveRoster(list);
      combatLog(c, `${m.emoji} ${m.name}: ${rec.play.hp - before >= 0 ? "+" : ""}${rec.play.hp - before} HP → ${rec.play.hp}/${d.maxHP}${rec.play.hp <= 0 ? " (down!)" : ""}`);
      combatRefresh(c); return;
    }
    const before = Number(m.hp) || 0;
    m.hp = Math.max(0, Math.min(Number(m.hpMax) || 0, before + delta));
    m.down = m.hp <= 0;
    combatLog(c, `${m.emoji} ${m.name}: ${m.hp - before >= 0 ? "+" : ""}${m.hp - before} HP → ${m.hp}/${m.hpMax}${m.down ? " (down!)" : ""}`);
    combatRefresh(c);
  }
  function toggleCond(c, m, key) {
    const ca = condArrayOf(m); if (!ca) return;
    const i = ca.arr.findIndex((x) => x.key === key);
    if (i > -1) ca.arr.splice(i, 1); else { const cat = PC.condition && PC.condition(key); ca.arr.push({ key: key, turns: null }); if (cat) combatLog(c, `${m.emoji} ${m.name}: ${cat.emoji} ${cat.name}.`); }
    ca.commit(); combatRefresh(c);
  }
  function cycleCondTurns(c, m, key, delta) {
    const ca = condArrayOf(m); if (!ca) return;
    const x = ca.arr.find((y) => y.key === key); if (!x) return;
    const cur = typeof x.turns === "number" ? x.turns : 0; const next = cur + delta; x.turns = next <= 0 ? null : next;
    ca.commit(); combatRefresh(c);
  }
  function tickCombatantConditions(c, m) {
    const ca = condArrayOf(m); if (!ca || !ca.arr.length) return;
    const expired = [];
    ca.arr.forEach((x) => { if (typeof x.turns === "number") { x.turns -= 1; if (x.turns <= 0) expired.push(x.key); } });
    if (expired.length) {
      for (let i = ca.arr.length - 1; i >= 0; i--) if (expired.indexOf(ca.arr[i].key) > -1) ca.arr.splice(i, 1);
      expired.forEach((k) => { const cat = PC.condition && PC.condition(k); combatLog(c, `${m.emoji} ${m.name}: ${cat ? cat.emoji + " " + cat.name : k} wore off.`); });
      ca.commit();
    }
  }
  function rollCombatAttack(c, m, atk) {
    const hit = PC.rollCheck(Number(atk.toHit) || 0, "normal");
    let line = `${m.emoji} ${m.name} — ${atk.name || "attack"}: d20${PC.fmtMod(Number(atk.toHit) || 0)} = ${hit.total} to hit`;
    if (atk.damage) { const dr = PC.rollDiceExpr(atk.damage); if (dr) line += ` · ${atk.damage} = ${dr.total} dmg`; }
    if (atk.note) line += ` (${atk.note})`;
    combatLog(c, line); combatRefresh(c);
  }
  function removeCombatant(c, id) { const i = c.combat.combatants.findIndex((x) => x.id === id); if (i < 0) return; if (i < c.combat.turn) c.combat.turn = Math.max(0, c.combat.turn - 1); c.combat.combatants.splice(i, 1); combatRefresh(c); }
  function addCustomCombatant(c, name, hp, def, initMod) {
    c.combat.combatants.push({ id: uid("cb"), kind: "custom", name: name || "Combatant", emoji: "⭐", refId: null, init: null, initMod: Number(initMod) || 0, hp: Number(hp) || 10, hpMax: Number(hp) || 10, defense: Number(def) || 10, conditions: [], attacks: [], down: false, notes: "" });
    combatLog(c, `Added ${name || "a combatant"} to the fight.`); combatRefresh(c);
  }

  function combatTab(c) {
    if (!c.combat) return combatStart(c);
    return combatTracker(c);
  }
  function combatStart(c) {
    const root = el("div");
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "⚔ Combat"));
    p.appendChild(el("p", "hint", "Run a fight — roll initiative and track HP, conditions, and attacks for the whole table. Start from an encounter, or an empty combat with just the party."));
    if ((c.encounters || []).length) {
      const row = el("div", "gm-award-row");
      const sel = el("select", "gm-input");
      sel.innerHTML = c.encounters.map((e) => `<option value="${esc(e.id)}">${esc(e.name)}</option>`).join("");
      const btn = el("button", "btn small primary", "▶ Start from encounter");
      btn.onclick = () => startCombat(c, sel.value);
      row.appendChild(labeled("Encounter", sel)); row.appendChild(btn);
      p.appendChild(row);
    } else {
      p.appendChild(el("div", "muted", "No encounters yet — build one on the Encounters tab, or start an empty combat below."));
    }
    const eb = el("button", "btn small", "Start empty combat (party only)");
    eb.onclick = () => startCombat(c, null);
    p.appendChild(eb);
    root.appendChild(p);
    return root;
  }
  function combatTracker(c) {
    const cb = c.combat;
    const root = el("div");

    // Control bar
    const ctl = el("div", "panel gm-combat-ctl");
    ctl.appendChild(el("div", "gm-combat-title", `⚔ ${esc(cb.name)} · Round ${cb.round}`));
    const btns = el("div", "gm-combat-btns");
    const roll = el("button", "btn small primary", cb.started ? "↻ Re-roll initiative" : "🎲 Roll initiative");
    roll.onclick = () => rollInitiative(c);
    const next = el("button", "btn small", "Next turn →"); next.disabled = !cb.started || !cb.combatants.length; next.onclick = () => nextTurn(c);
    const end = el("button", "btn ghost small danger", "End combat"); end.onclick = () => endCombat(c);
    btns.appendChild(roll); btns.appendChild(next); btns.appendChild(end);
    ctl.appendChild(btns);
    root.appendChild(ctl);

    // Combatant list (PCs read their live HP/conditions from their character record)
    const roster = App().loadRoster ? App().loadRoster() : [];
    if (!cb.combatants.length) root.appendChild(el("div", "muted", "No combatants. Add some below."));
    cb.combatants.forEach((m, idx) => root.appendChild(combatantCard(c, m, idx, roster)));

    // Add combatants
    root.appendChild(addCombatantPanel(c));

    // Log
    const logP = el("div", "panel");
    logP.appendChild(el("div", "section-label", "Combat log"));
    const log = cb.log || [];
    if (!log.length) logP.appendChild(el("div", "muted", "Rolls and HP changes will appear here."));
    else { const list = el("div", "gm-combat-log"); log.slice().reverse().forEach((L) => list.appendChild(el("div", "gm-log-line", esc(L.text)))); logP.appendChild(list); }
    root.appendChild(logP);
    return root;
  }
  function combatantCard(c, m, idx, roster) {
    const cb = c.combat;
    const v = combatantView(m, roster);
    const active = cb.started && idx === cb.turn;
    const down = v.max > 0 && v.hp <= 0;
    const card = el("div", "panel gm-cbt" + (active ? " gm-cbt-active" : "") + (down ? " gm-cbt-down" : ""));
    // Header row
    const head = el("div", "gm-cbt-head");
    const initBox = el("div", "gm-cbt-init");
    initBox.innerHTML = m.init != null ? `<b>${m.init}</b>` : `<span class="muted">—</span>`;
    initBox.title = "Initiative";
    head.appendChild(initBox);
    head.appendChild(el("span", "gm-cbt-name", `${m.emoji} ${esc(m.name)}${active ? ' <span class="gm-cbt-turn">turn</span>' : ""}`));
    head.appendChild(el("span", "gm-cbt-kind muted", m.kind === "pc" ? "PC" : m.kind === "npc" ? "NPC" : m.kind === "custom" ? "" : "Monster"));
    head.appendChild(el("span", "gm-cbt-def", `🎯 ${v.defense}`));
    const rm = el("button", "btn ghost small", "✕"); rm.title = "Remove from combat"; rm.onclick = () => removeCombatant(c, m.id);
    head.appendChild(rm);
    card.appendChild(head);

    if (v.missing) { card.appendChild(el("div", "muted", "This character was removed from this device.")); return card; }

    // HP row (PCs read/write their live sheet HP)
    const max = Number(v.max) || 0, hp = Number(v.hp) || 0;
    const track = el("div", "bar-track"); const fill = el("div", "bar-fill hp"); fill.style.width = (max > 0 ? Math.min(100, hp / max * 100) : 0) + "%"; track.appendChild(fill);
    const hpHead = el("div", "poolbar-head"); hpHead.innerHTML = `<span>HP${m.kind === "pc" ? ' <span class="gm-cbt-sync">live</span>' : ""}</span><span class="poolbar-num">${hp} / ${max}${down ? " · down" : ""}</span>`;
    card.appendChild(hpHead); card.appendChild(track);
    const hpCtl = el("div", "gm-cbt-hpctl");
    const amt = el("input", "pet-amt"); amt.type = "number"; amt.min = "1"; amt.value = "1";
    const dmg = el("button", "btn small", "− Damage"); dmg.onclick = () => combatDamage(c, m, -Math.abs(parseInt(amt.value, 10) || 1));
    const heal = el("button", "btn small", "+ Heal"); heal.onclick = () => combatDamage(c, m, Math.abs(parseInt(amt.value, 10) || 1));
    hpCtl.appendChild(amt); hpCtl.appendChild(dmg); hpCtl.appendChild(heal);
    card.appendChild(hpCtl);

    // Attacks (monsters / statted NPCs)
    if ((m.attacks || []).length) {
      const ag = el("div", "gm-cbt-atks");
      m.attacks.forEach((a) => {
        const b = el("button", "btn small", `⚔ ${esc(a.name || "attack")} ${PC.fmtMod(Number(a.toHit) || 0)}${a.damage ? " · " + esc(a.damage) : ""}`);
        b.onclick = () => rollCombatAttack(c, m, a);
        ag.appendChild(b);
      });
      card.appendChild(ag);
    }

    // Conditions ({key, turns}) — turns badge cycles ∞→1→2… and ticks down at end of turn, like the play sheet.
    const cw = el("div", "gm-cbt-conds");
    (v.conditions || []).forEach((cd) => {
      const cat = PC.condition ? PC.condition(cd.key) : null;
      const chip = el("span", "gm-cond on");
      const lbl = el("span", "gm-cond-lbl", `${cat ? cat.emoji + " " + cat.name : cd.key}`); lbl.title = "Remove"; lbl.onclick = () => toggleCond(c, m, cd.key);
      const t = el("span", "gm-cond-turns", typeof cd.turns === "number" ? cd.turns + "t" : "∞"); t.title = "Duration — click to add a turn"; t.onclick = () => cycleCondTurns(c, m, cd.key, 1);
      chip.appendChild(lbl); chip.appendChild(t);
      cw.appendChild(chip);
    });
    const has = (v.conditions || []).map((x) => x.key);
    const addCond = el("select", "gm-cond-add");
    addCond.innerHTML = `<option value="">＋ condition</option>` + (PC.CONDITIONS || []).filter((cdf) => has.indexOf(cdf.key) < 0).map((cdf) => `<option value="${cdf.key}">${cdf.emoji} ${cdf.name}</option>`).join("");
    addCond.onchange = () => { if (addCond.value) toggleCond(c, m, addCond.value); };
    cw.appendChild(addCond);
    card.appendChild(cw);
    return card;
  }
  function addCombatantPanel(c) {
    const roster = App().loadRoster ? App().loadRoster() : [];
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Add to the fight"));
    // Monster from bestiary
    const mrow = el("div", "gm-award-row");
    const msel = el("select", "gm-input");
    msel.innerHTML = (PC.BESTIARY || []).slice().sort((a, b) => a.name.localeCompare(b.name)).map((b) => `<option value="${esc(b.id)}">${b.emoji || "👹"} ${esc(b.name)} (${esc(b.slBand)})</option>`).join("");
    const mqty = el("input", "gm-input gm-xp-amt"); mqty.type = "number"; mqty.min = "1"; mqty.value = "1";
    const mbtn = el("button", "btn small primary", "＋ Monster");
    mbtn.onclick = () => { const b = PC.bestiary && PC.bestiary(msel.value); if (!b) return; const n = Math.max(1, parseInt(mqty.value, 10) || 1); const start = c.combat.combatants.filter((x) => x.refId === b.id).length; for (let i = 1; i <= n; i++) c.combat.combatants.push(monsterCombatant(b, " " + (start + i))); combatLog(c, `Added ${n}× ${b.name}.`); combatRefresh(c); };
    mrow.appendChild(labeled("Monster", msel)); mrow.appendChild(labeled("Qty", mqty)); mrow.appendChild(mbtn);
    p.appendChild(mrow);
    // NPC from roster
    if ((c.npcs || []).length) {
      const nrow = el("div", "gm-award-row");
      const nsel = el("select", "gm-input");
      nsel.innerHTML = c.npcs.map((n) => `<option value="${esc(n.id)}">${esc(n.name || "Unnamed")}${n.beastId ? " (statted)" : ""}</option>`).join("");
      const nbtn = el("button", "btn small", "＋ NPC");
      nbtn.onclick = () => { const npc = c.npcs.find((x) => x.id === nsel.value); if (!npc) return; let cbt; const b = npc.beastId && PC.bestiary ? PC.bestiary(npc.beastId) : null; if (b) { cbt = monsterCombatant(b, "", "npc"); cbt.name = npc.name || cbt.name; } else { cbt = { id: uid("cb"), kind: "npc", name: npc.name || "NPC", emoji: "🎭", refId: npc.id, init: null, initMod: 0, hp: 10, hpMax: 10, defense: 12, conditions: [], attacks: [], down: false, notes: "" }; } c.combat.combatants.push(cbt); combatLog(c, `Added NPC ${cbt.name}.`); combatRefresh(c); };
      nrow.appendChild(labeled("NPC", nsel)); nrow.appendChild(nbtn);
      p.appendChild(nrow);
    }
    // Custom
    const crow = el("div", "gm-award-row");
    const cname = el("input", "gm-input"); cname.type = "text"; cname.placeholder = "Name";
    const chp = el("input", "gm-input gm-xp-amt"); chp.type = "number"; chp.min = "1"; chp.placeholder = "HP";
    const cdef = el("input", "gm-input gm-xp-amt"); cdef.type = "number"; cdef.placeholder = "Def";
    const cini = el("input", "gm-input gm-xp-amt"); cini.type = "number"; cini.placeholder = "Init";
    const cbtn = el("button", "btn small", "＋ Custom");
    cbtn.onclick = () => { if (!cname.value.trim()) { toast("Name the combatant."); return; } addCustomCombatant(c, cname.value.trim(), chp.value, cdef.value, cini.value); };
    crow.appendChild(labeled("Custom", cname)); crow.appendChild(labeled("HP", chp)); crow.appendChild(labeled("Def", cdef)); crow.appendChild(labeled("Init", cini)); crow.appendChild(cbtn);
    p.appendChild(crow);
    return p;
  }

  function addToParty(c, id) {
    if (!Array.isArray(c.party)) c.party = [];
    if (c.party.indexOf(id) < 0) { c.party.push(id); save(); }
    const rec = App().loadRoster ? App().loadRoster().find((r) => r.id === id) : null;
    toast(rec ? `${rec.name || "Character"} joined the party.` : "Added to party.");
    draw();
  }
  function removeFromParty(c, id) {
    const i = c.party.indexOf(id); if (i > -1) { c.party.splice(i, 1); save(); }
    draw();
  }

  /* ----- Overview ----- */
  function overviewTab(c) {
    const p = el("div", "panel");
    p.appendChild(el("div", "section-label", "Campaign"));
    p.appendChild(labeled("Name", textInput(c.name, "Campaign name", (v) => { c.name = v; save(); })));
    p.appendChild(labeled("Premise", area(c.premise, "A sentence or two on the setting, the hook, the stakes…", (v) => { c.premise = v; save(); }, 3)));
    p.appendChild(labeled("GM notes", area(c.notes, "Plot threads, secrets, the road ahead — anything you want to keep between sessions.", (v) => { c.notes = v; save(); }, 8)));

    const foot = el("div", "gm-overview-foot");
    const created = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "";
    foot.appendChild(el("span", "muted", created ? "Created " + esc(created) : ""));
    const del = el("button", "btn ghost small danger", "Delete campaign");
    del.onclick = () => { if (confirm(`Delete “${c.name}” and all its sessions and NPCs? This can't be undone.`)) removeCampaign(c.id); };
    foot.appendChild(del);
    p.appendChild(foot);
    return p;
  }

  /* ----- Sessions ----- */
  function sessionsTab(c) {
    const root = el("div");
    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "🗓 Session log"));
    intro.appendChild(el("p", "hint", "A running log of your sessions — what happened, so you can pick the thread back up next time."));
    const add = el("button", "btn small primary", "+ New Session");
    add.onclick = () => addSession(c);
    intro.appendChild(add);
    root.appendChild(intro);

    const sessions = (c.sessions || []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!sessions.length) { root.appendChild(el("div", "muted", "No sessions logged yet.")); return root; }
    sessions.forEach((s, idx) => {
      const num = (c.sessions || []).length - idx; // simple ordinal, newest highest
      const card = el("div", "panel gm-session");
      const open = expanded === s.id;
      const head = el("div", "gm-session-head");
      head.innerHTML = `<span class="gm-session-title">${esc(s.title || "Untitled session")}</span><span class="gm-session-date">${esc(s.date || "")}</span><span class="gm-caret">${open ? "▲" : "▼"}</span>`;
      head.style.cursor = "pointer";
      head.onclick = () => { expanded = open ? null : s.id; draw(); };
      card.appendChild(head);
      if (!open && s.recap) card.appendChild(el("div", "gm-session-recap muted", esc(s.recap)));
      if (open) {
        const ed = el("div", "gm-editor");
        ed.appendChild(labeled("Title", textInput(s.title, "e.g. The Bridge at Ashford", (v) => { s.title = v; save(); })));
        ed.appendChild(labeled("Date", textInput(s.date, "e.g. Session 3 · Aug 24", (v) => { s.date = v; save(); })));
        ed.appendChild(labeled("Recap", area(s.recap, "What happened this session…", (v) => { s.recap = v; save(); }, 6)));
        const rm = el("button", "btn ghost small danger", "Remove session");
        rm.onclick = () => { if (confirm("Remove this session?")) removeSession(c, s.id); };
        ed.appendChild(rm);
        card.appendChild(ed);
      }
      root.appendChild(card);
    });
    return root;
  }
  function addSession(c) {
    if (!Array.isArray(c.sessions)) c.sessions = [];
    const s = { id: uid("ses"), title: "", date: "Session " + (c.sessions.length + 1), recap: "", createdAt: Date.now() };
    c.sessions.push(s); save(); expanded = s.id; tab = "sessions"; draw();
  }
  function removeSession(c, id) { const i = c.sessions.findIndex((s) => s.id === id); if (i < 0) return; c.sessions.splice(i, 1); if (expanded === id) expanded = null; save(); draw(); }

  /* ----- NPCs ----- */
  const DISPOSITIONS = ["Friendly", "Neutral", "Wary", "Hostile", "Unknown"];
  function npcsTab(c) {
    const root = el("div");
    const intro = el("div", "panel");
    intro.appendChild(el("div", "section-label", "🎭 NPC roster"));
    intro.appendChild(el("p", "hint", "The people (and creatures) of your campaign — who they are, where to find them, and how they feel about the party. Link a Bestiary creature to hang a stat block off an NPC."));
    const add = el("button", "btn small primary", "+ New NPC");
    add.onclick = () => addNpc(c);
    intro.appendChild(add);
    root.appendChild(intro);

    const npcs = c.npcs || [];
    if (!npcs.length) { root.appendChild(el("div", "muted", "No NPCs yet.")); return root; }
    npcs.forEach((n) => {
      const open = expanded === n.id;
      const card = el("div", "panel gm-npc");
      const head = el("div", "gm-npc-head");
      const disp = n.disposition ? `<span class="gm-npc-disp disp-${esc((n.disposition || "").toLowerCase())}">${esc(n.disposition)}</span>` : "";
      head.innerHTML = `<span class="gm-npc-name">${esc(n.name || "Unnamed")}</span>${n.role ? `<span class="gm-npc-role">${esc(n.role)}</span>` : ""}${disp}<span class="gm-caret">${open ? "▲" : "▼"}</span>`;
      head.style.cursor = "pointer";
      head.onclick = () => { expanded = open ? null : n.id; draw(); };
      card.appendChild(head);
      if (!open) {
        if (n.location) card.appendChild(el("div", "gm-npc-loc muted", "📍 " + esc(n.location)));
        if (n.beastId && PC.bestiary && PC.bestiary(n.beastId)) { const b = PC.bestiary(n.beastId); card.appendChild(el("div", "gm-npc-beast", `${b.emoji || "🐾"} ${esc(b.name)} — Def ${esc(String(b.defense))} · HP ${esc(String(b.hp))}`)); }
        if (n.notes) card.appendChild(el("div", "gm-npc-notes muted", esc(n.notes)));
      }
      if (open) card.appendChild(npcEditor(c, n));
      root.appendChild(card);
    });
    return root;
  }
  function npcEditor(c, n) {
    const ed = el("div", "gm-editor");
    ed.appendChild(labeled("Name", textInput(n.name, "e.g. Marisol Vane", (v) => { n.name = v; save(); })));
    ed.appendChild(labeled("Role", textInput(n.role, "e.g. Harbormaster, cult leader, rival", (v) => { n.role = v; save(); })));
    ed.appendChild(labeled("Location", textInput(n.location, "e.g. The Salt Quarter", (v) => { n.location = v; save(); })));
    const disp = el("select", "gm-input");
    disp.innerHTML = `<option value="">— disposition —</option>` + DISPOSITIONS.map((d) => `<option value="${d}" ${n.disposition === d ? "selected" : ""}>${d}</option>`).join("");
    disp.onchange = () => { n.disposition = disp.value; save(); draw(); };
    ed.appendChild(labeled("Disposition", disp));

    // Optional Bestiary link
    const beast = el("select", "gm-input");
    const beasts = (PC.BESTIARY || []).slice().sort((a, b) => a.name.localeCompare(b.name));
    beast.innerHTML = `<option value="">— none —</option>` + beasts.map((b) => `<option value="${esc(b.id)}" ${n.beastId === b.id ? "selected" : ""}>${esc(b.name)}</option>`).join("");
    beast.onchange = () => { n.beastId = beast.value || null; save(); draw(); };
    ed.appendChild(labeled("Stat block (Bestiary)", beast));

    ed.appendChild(labeled("Notes", area(n.notes, "Secrets, goals, mannerisms, plot hooks…", (v) => { n.notes = v; save(); }, 5)));
    const rm = el("button", "btn ghost small danger", "Remove NPC");
    rm.onclick = () => { if (confirm("Remove this NPC?")) removeNpc(c, n.id); };
    ed.appendChild(rm);
    return ed;
  }
  function addNpc(c) {
    if (!Array.isArray(c.npcs)) c.npcs = [];
    const n = { id: uid("npc"), name: "", role: "", location: "", disposition: "", notes: "", beastId: null };
    c.npcs.push(n); save(); expanded = n.id; tab = "npcs"; draw();
  }
  function removeNpc(c, id) { const i = c.npcs.findIndex((n) => n.id === id); if (i < 0) return; c.npcs.splice(i, 1); if (expanded === id) expanded = null; save(); draw(); }

  window.PsionGM = { render: render };
})();
