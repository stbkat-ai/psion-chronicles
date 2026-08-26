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
  const App = window.PsionApp;
  const PC = window.PC || {};
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const toast = (m) => { if (App && App.toast) App.toast(m); };
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
  let mount = null, campaignId = null, tab = "overview", expanded = null;

  function render(host) { if (host) mount = host; campaigns = load(); draw(); }
  function openCampaign(id) { campaignId = id; tab = "overview"; expanded = null; draw(); window.scrollTo(0, 0); }
  function goHome() { campaignId = null; expanded = null; draw(); }

  /* ---------- shared bits ---------- */
  function labeled(label, node) { const w = el("label", "gm-field"); w.appendChild(el("span", "gm-label", esc(label))); w.appendChild(node); return w; }
  function textInput(val, ph, oninput) { const i = el("input", "gm-input"); i.type = "text"; if (ph) i.placeholder = ph; i.value = val || ""; i.oninput = () => oninput(i.value); return i; }
  function area(val, ph, oninput, rows) { const t = el("textarea", "gm-area"); if (ph) t.placeholder = ph; t.rows = rows || 4; t.value = val || ""; t.oninput = () => oninput(t.value); return t; }

  /* ---------- top bar ---------- */
  function topBar() {
    const bar = el("div", "gm-topbar");
    const home = el("button", "btn ghost small", campaignId ? "← All campaigns" : "← Home");
    home.onclick = () => { if (campaignId) goHome(); else if (App && App.goToHome) App.goToHome(); };
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
    [["overview", "Overview"], ["sessions", `Sessions (${(c.sessions || []).length})`], ["npcs", `NPCs (${(c.npcs || []).length})`]].forEach(([k, lbl]) => {
      const b = el("button", "gm-tab" + (tab === k ? " active" : ""), lbl);
      b.onclick = () => { tab = k; expanded = null; draw(); };
      tabs.appendChild(b);
    });
    root.appendChild(tabs);

    if (tab === "overview") root.appendChild(overviewTab(c));
    else if (tab === "sessions") root.appendChild(sessionsTab(c));
    else root.appendChild(npcsTab(c));
    return root;
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
