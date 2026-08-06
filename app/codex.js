/* ============================================================
   Psion Chronicles — Codex (searchable in-game reference)
   The "look up everything" section: Kinetics, Techniques, Fusion Kinetics,
   Otherkin, Backgrounds, Heritages, Skills, Combat Skills, Conditions, Weapons,
   Armor, Gear, Crafting, and core Reference tables.
   Pure UI over the game data already on window.PC (data.js + items.js) — it
   holds NO content of its own, so editing an item/technique/rule in data.js or
   items.js flows through here automatically (counts included). Adding a whole
   NEW kind of content, or renaming a field a detail() reads, still needs a
   matching touch here — see the Codex-sync standing rule in CLAUDE.md.
   Depends on data.js, items.js, rules.js. Exposes window.PsionCodex.
   ============================================================ */
(function () {
  "use strict";
  const PC = window.PC;
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const an = (a) => (PC.ATTR_NAMES && PC.ATTR_NAMES[a]) ? `${a} (${PC.ATTR_NAMES[a]})` : a;
  const sevLabel = (s) => ({ bad: "Crippling", warn: "Hindering", good: "Beneficial", neutral: "Other" }[s] || "Other");

  // Codex sub-navigation state (kept across the section's own re-renders).
  let mount = null, sectionKey = null, entryId = null, query = "";

  /* ---------------- navigation ---------------- */
  function render(host) { if (host) mount = host; draw(); }
  function goSection(k) { sectionKey = k; entryId = null; query = ""; draw(); }
  function goEntry(k, id) { sectionKey = k; entryId = id; query = ""; draw(); window.scrollTo(0, 0); }
  function goLanding() { sectionKey = null; entryId = null; query = ""; draw(); }
  function back() { if (entryId) entryId = null; else sectionKey = null; draw(); }
  function sectionOf(k) { return SECTIONS.find((s) => s.key === k); }

  /* ---------------- shared detail helpers ---------------- */
  function label(t) { return el("div", "section-label", t); }
  function kv(k, v) { const r = el("div", "codex-kv"); r.innerHTML = `<span class="ck-k">${esc(k)}</span><span class="ck-v">${v}</span>`; return r; }
  function chips(arr, cls) {
    const w = el("div", "pill-list");
    (arr || []).forEach((x) => w.appendChild(el("span", "pill " + (cls || ""), esc(x))));
    return w;
  }
  // A clickable pill that jumps to another Codex entry.
  function linkChip(sectionK, id, text) {
    const p = el("span", "pill link", esc(text));
    p.onclick = () => goEntry(sectionK, id);
    return p;
  }
  // Compact clickable row used inside detail panels (e.g. a Kinetic's technique list).
  function miniRow(text, sub, onClick) {
    const r = el("div", "codex-mini" + (onClick ? " link" : ""));
    r.innerHTML = `<span class="cm-name">${text}</span>${sub ? `<span class="cm-sub">${sub}</span>` : ""}`;
    if (onClick) r.onclick = onClick;
    return r;
  }
  // A technique detail body (shared by base techniques and Otherkin tails).
  function techBody(t) {
    const box = el("div");
    const bits = [t.kinetic, t.tier, t.action, t.attr ? an(t.attr) : null].filter(Boolean).join(" · ");
    box.appendChild(el("div", "codex-sub", bits));
    const rows = el("div", "codex-kvs");
    if (t.kp != null) rows.appendChild(kv("Cost", `${t.kp} KP${t.upkeep ? ` · +${t.upkeep}/turn upkeep` : ""}`));
    if (t.damage) rows.appendChild(kv("Damage", `${esc(t.damage.dice || "")}${t.damage.mod ? " + " + t.damage.mod : ""}${t.damage.type ? " " + esc(t.damage.type) : ""}`));
    if (t.aoe) rows.appendChild(kv("Area", "AoE — affects all valid targets in the area"));
    if (t.sustained) rows.appendChild(kv("Type", "Sustained — pay upkeep each turn to keep it up"));
    if (t.augment) rows.appendChild(kv("Type", "Augment — riders onto a weapon strike"));
    box.appendChild(rows);
    if (t.desc) box.appendChild(el("p", "codex-desc", esc(t.desc)));
    if (t.effect) box.appendChild(el("div", "codex-effect", "▸ " + esc(t.effect)));
    return box;
  }

  /* Precompute fusion-technique lookups once (1377 techniques → keyed by their fusion name), so the Fusions
     section's list()/detail() don't re-scan the whole array on every search keystroke. */
  const FUSION_TECHS = {};
  (PC.FUSION_TECHNIQUES || []).forEach((t) => { (FUSION_TECHS[t.kinetic] = FUSION_TECHS[t.kinetic] || []).push(t); });
  const FUSION_KW = {};
  Object.keys(FUSION_TECHS).forEach((k) => { FUSION_KW[k] = FUSION_TECHS[k].map((t) => `${t.name} ${t.effect || ""}`).join(" "); });

  /* ---------------- section definitions ----------------
     Each: { key, icon, title, blurb, list() -> [{id,name,sub,group,keywords}], detail(id) -> node }.
     `group` (optional) buckets the list under headers; `keywords` feed global search. */
  const SECTIONS = [];
  const addSection = (s) => SECTIONS.push(s);

  /* Kinetics */
  addSection({
    key: "kinetics", icon: "🌀", title: "Kinetics", blurb: "The elemental technique schools.",
    list: () => (PC.KINETICS || []).map((k) => ({ id: k.name, name: k.name, sub: `${k.attr} · ${k.role}`, group: an(k.attr), keywords: `${k.attr} ${k.role} ${k.domain}` })),
    detail: (id) => {
      const k = (PC.KINETICS || []).find((x) => x.name === id); if (!k) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("div", "codex-sub", `${an(k.attr)} · ${k.role}`));
      box.appendChild(el("p", "codex-desc", esc(k.domain)));
      const techs = (PC.TECHNIQUES || []).filter((t) => t.kinetic === k.name);
      box.appendChild(label(`Techniques (${techs.length})`));
      const tiers = ["Beginner", "Adept", "Expert", "Master"];
      tiers.forEach((tier) => {
        const inTier = techs.filter((t) => t.tier === tier);
        if (!inTier.length) return;
        box.appendChild(el("div", "codex-group-label", tier));
        inTier.forEach((t) => box.appendChild(miniRow(esc(t.name), `${t.kp} KP · ${t.action}`, () => goEntry("techniques", t.name))));
      });
      return box;
    },
  });

  /* Techniques */
  addSection({
    key: "techniques", icon: "✦", title: "Techniques", blurb: "Every base technique, across every Kinetic.",
    list: () => (PC.TECHNIQUES || []).map((t) => ({ id: t.name, name: t.name, sub: `${t.kinetic} · ${t.tier} · ${t.action}`, group: t.kinetic, keywords: `${t.kinetic} ${t.tier} ${t.attr} ${t.action} ${t.effect || ""}` })),
    detail: (id) => { const t = PC.technique ? PC.technique(id) : (PC.TECHNIQUES || []).find((x) => x.name === id); return t ? techBody(t) : el("div", "muted", "Not found."); },
  });

  /* Fusion Kinetics */
  addSection({
    key: "fusions", icon: "✨", title: "Fusion Kinetics", blurb: "Every pairing of the Kinetics into a fused school.",
    list: () => (PC.FUSIONS || []).map((f) => ({
      id: f.name, name: f.name,
      sub: `${(f.parents || []).join(" + ")}`,
      group: (f.parents && f.parents[0]) || "Fusions",
      keywords: `${(f.parents || []).join(" ")} ${f.role || ""} ${f.domain || ""} ${FUSION_KW[f.name] || ""}`,
    })),
    detail: (id) => {
      const f = (PC.FUSIONS || []).find((x) => x.name === id); if (!f) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("div", "codex-sub", `${(f.attrs || []).map(an).join(" / ")}${f.role ? " · " + f.role : ""}`));
      if (f.domain) box.appendChild(el("p", "codex-desc", esc(f.domain)));
      box.appendChild(label("Parent Kinetics"));
      const w = el("div", "pill-list");
      (f.parents || []).forEach((pn) => w.appendChild(linkChip("kinetics", pn, pn)));
      box.appendChild(w);
      const techs = FUSION_TECHS[f.name] || [];
      box.appendChild(label(`Fusion Techniques (${techs.length})`));
      box.appendChild(el("p", "hint", "Each fusion technique is granted <b>free</b> once you know both of its parent techniques."));
      const tiers = []; techs.forEach((t) => { if (tiers.indexOf(t.tier) < 0) tiers.push(t.tier); });
      tiers.forEach((tier) => {
        box.appendChild(el("div", "codex-group-label", tier));
        techs.filter((t) => t.tier === tier).forEach((t) => {
          const r = el("div", "codex-mini");
          r.innerHTML = `<span class="cm-name">${esc(t.name)}</span><span class="cm-sub">${t.kp != null ? t.kp + " KP · " : ""}${esc(t.action || "")}${t.pair ? " · fuses " + esc((t.pair || []).join(" + ")) : ""}</span>`;
          if (t.effect) r.appendChild(el("div", "codex-effect", "▸ " + esc(t.effect)));
          box.appendChild(r);
        });
      });
      return box;
    },
  });

  /* Otherkin */
  addSection({
    key: "otherkin", icon: "♥", title: "Otherkin", blurb: "The Soul Creatures chosen at Soul Level 15.",
    list: () => (PC.OTHERKIN || []).map((o) => ({ id: o.name, name: `${o.emoji} ${o.name}`, sub: `${o.attr} · ${o.kinetic}`, keywords: `${o.attr} ${o.kinetic} ${o.theme} ${o.pairing || ""}` })),
    detail: (id) => {
      const o = (PC.OTHERKIN || []).find((x) => x.name === id); if (!o) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("div", "codex-sub", `${o.emoji} ${o.attr ? an(o.attr) : ""}${o.kinetic ? " · " + o.kinetic : ""}${o.pairing ? " · pairs with " + o.pairing : ""}`));
      if (o.theme) box.appendChild(el("p", "codex-desc", esc(o.theme)));
      const rows = el("div", "codex-kvs");
      if (o.boosts) rows.appendChild(kv("Attribute boost", Object.keys(o.boosts).map((a) => `+${o.boosts[a]} ${a}`).join(", ")));
      if (o.pool) { const parts = []; if (o.pool.body) parts.push(`+${o.pool.body} Body (HP)`); if (o.pool.mind) parts.push(`+${o.pool.mind} Mind (KP)`); if (parts.length) rows.appendChild(kv("Pool boost", parts.join(", "))); }
      box.appendChild(rows);
      if (o.signature) {
        box.appendChild(label("Signature — " + o.signature.name));
        box.appendChild(el("p", "codex-desc", `${esc(o.signature.blurb || "")}${o.signature.rest ? ` <span class="muted">(refreshes on a ${esc(o.signature.rest)} rest)</span>` : ""}`));
        (o.signature.tiers || []).forEach((tr) => {
          const r = el("div", "codex-mini");
          r.innerHTML = `<span class="cm-name">Tier ${tr.tier} <span class="muted">· Lvl ${tr.level}${tr.uses != null ? " · " + tr.uses + " use" + (tr.uses === 1 ? "" : "s") : ""}</span></span>`;
          if (tr.effect) r.appendChild(el("div", "codex-effect", "▸ " + esc(tr.effect)));
          box.appendChild(r);
        });
      }
      const techs = o.techniques || [];
      if (techs.length) {
        box.appendChild(label(`${o.kinetic || "Kinetic"} — Techniques (${techs.length})`));
        techs.forEach((t) => { const c = el("div", "codex-mini"); c.innerHTML = `<span class="cm-name">${esc(t.name)}</span><span class="cm-sub">${t.tier ? esc(String(t.tier)) + " · " : ""}${t.kp != null ? t.kp + " KP · " : ""}${esc(t.action || "")}</span>`; if (t.effect) c.appendChild(el("div", "codex-effect", "▸ " + esc(t.effect))); box.appendChild(c); });
      }
      return box;
    },
  });

  /* Backgrounds */
  addSection({
    key: "backgrounds", icon: "🎭", title: "Backgrounds", blurb: "The Psionic Backgrounds — your character's origin.",
    list: () => (PC.BACKGROUNDS || []).map((b) => ({ id: b.name, name: b.name, sub: b.blurb, keywords: `${b.blurb} ${(b.skills || []).join(" ")} ${(b.combat || []).join(" ")} ${b.freeTech || ""}` })),
    detail: (id) => {
      const b = (PC.BACKGROUNDS || []).find((x) => x.name === id); if (!b) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("p", "codex-desc", esc(b.blurb)));
      const rows = el("div", "codex-kvs");
      if (b.boosts) rows.appendChild(kv("Attribute boost", Object.keys(b.boosts).map((a) => `+${b.boosts[a]} ${a}`).join(", ")));
      if (b.pool) { const parts = []; if (b.pool.body) parts.push(`+${b.pool.body} Body (HP)`); if (b.pool.mind) parts.push(`+${b.pool.mind} Mind (KP)`); if (parts.length) rows.appendChild(kv("Pool boost", parts.join(", "))); }
      box.appendChild(rows);
      if (b.skills && b.skills.length) { box.appendChild(label("Skill proficiencies")); const w = el("div", "pill-list"); b.skills.forEach((s) => w.appendChild(linkChip("skills", s, s))); box.appendChild(w); }
      if (b.combat && b.combat.length) { box.appendChild(label("Combat focus")); box.appendChild(chips(b.combat)); }
      if (b.freeTech) { box.appendChild(label("Free technique")); const w = el("div", "pill-list"); w.appendChild(linkChip("techniques", b.freeTech, b.freeTech)); box.appendChild(w); }
      if (b.flaw) { box.appendChild(label("Flaw")); box.appendChild(el("div", "flaw-note", `<b>${esc(b.flaw.name)}</b> — ${esc(b.flaw.desc)}`)); }
      return box;
    },
  });

  /* Heritages */
  addSection({
    key: "heritages", icon: "🗺️", title: "Heritages", blurb: "The Regional Heritages — Fighting Styles, traits & gear.",
    list: () => (PC.HERITAGES || []).map((h) => ({ id: h.name, name: h.name, sub: h.blurb, keywords: `${h.blurb} ${h.fightingStyle || ""} ${h.weaponSubtype || ""} ${(h.combatSkills || []).join(" ")}` })),
    detail: (id) => {
      const h = (PC.HERITAGES || []).find((x) => x.name === id); if (!h) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("p", "codex-desc", esc(h.blurb)));
      const rows = el("div", "codex-kvs");
      if (h.weaponSubtype) rows.appendChild(kv("Signature weapon", esc(h.weaponSubtype)));
      if (h.armorProf) rows.appendChild(kv("Armor proficiency", ["Light"].concat(h.armorProf).join(", ")));
      box.appendChild(rows);
      if (h.fightingStyle) { box.appendChild(label("Fighting Style")); const w = el("div", "pill-list"); w.appendChild(linkChip("combatskills", "style:" + h.fightingStyle, h.fightingStyle)); box.appendChild(w); }
      if (h.combatSkills && h.combatSkills.length) { box.appendChild(label("Granted Combat Skills")); const w = el("div", "pill-list"); h.combatSkills.forEach((s) => w.appendChild(linkChip("combatskills", s, s))); box.appendChild(w); }
      if (h.traits && h.traits.length) { box.appendChild(label("Traits")); h.traits.forEach((t) => box.appendChild(el("div", "inv-note", `<b>${esc(t.name)}</b> — ${esc(t.desc)}`))); }
      if (h.flaw) { box.appendChild(label("Flaw")); box.appendChild(el("div", "flaw-note", `<b>${esc(h.flaw.name)}</b> — ${esc(h.flaw.desc)}`)); }
      return box;
    },
  });

  /* Skills */
  addSection({
    key: "skills", icon: "🎯", title: "Skills", blurb: "Every skill, grouped by attribute.",
    list: () => (PC.SKILLS || []).map((s) => ({ id: s.name, name: s.name, sub: an(s.attr), group: an(s.attr), keywords: `${s.attr} ${s.desc || ""}` })),
    detail: (id) => { const s = (PC.SKILLS || []).find((x) => x.name === id); if (!s) return el("div", "muted", "Not found."); const box = el("div"); box.appendChild(el("div", "codex-sub", an(s.attr))); box.appendChild(el("p", "codex-desc", esc(s.desc || ""))); return box; },
  });

  /* Combat Skills & Fighting Styles */
  addSection({
    key: "combatskills", icon: "🥋", title: "Combat Skills", blurb: "Combat Skills across the Fighting Styles.",
    list: () => (PC.COMBAT_SKILLS || []).map((c) => ({ id: c.name, name: c.name, sub: `${c.style} · ${c.action}`, group: c.style, keywords: `${c.style} ${c.action} ${c.effect || ""}` })),
    detail: (id) => {
      // Support "style:<name>" to show a Fighting Style overview.
      if (id && id.indexOf("style:") === 0) {
        const st = (PC.FIGHTING_STYLES || []).find((s) => s.name === id.slice(6)); if (!st) return el("div", "muted", "Not found.");
        const box = el("div");
        box.appendChild(el("div", "codex-sub", `Fighting Style${st.heritage ? " · " + st.heritage : ""}`));
        if (st.blurb) box.appendChild(el("p", "codex-desc", esc(st.blurb)));
        const skills = (PC.COMBAT_SKILLS || []).filter((c) => c.style === st.name);
        box.appendChild(label(`Skills (${skills.length})`));
        skills.forEach((c) => box.appendChild(miniRow(esc(c.name), esc(c.action), () => goEntry("combatskills", c.name))));
        return box;
      }
      const c = (PC.COMBAT_SKILLS || []).find((x) => x.name === id); if (!c) return el("div", "muted", "Not found.");
      const box = el("div");
      box.appendChild(el("div", "codex-sub", `${c.action}${c.style ? " · " + c.style : ""}${c.calledShot ? " · called shot" : ""}`));
      box.appendChild(el("div", "codex-effect", "▸ " + esc(c.effect || "")));
      if (c.style) { box.appendChild(label("Fighting Style")); const w = el("div", "pill-list"); w.appendChild(linkChip("combatskills", "style:" + c.style, c.style)); box.appendChild(w); }
      return box;
    },
  });

  /* Conditions */
  addSection({
    key: "conditions", icon: "🩸", title: "Conditions", blurb: "The status effects techniques & hazards inflict.",
    list: () => (PC.CONDITIONS || []).map((c) => ({ id: c.key, name: `${c.emoji} ${c.name}`, sub: sevLabel(c.sev), group: sevLabel(c.sev), keywords: `${c.name} ${c.sev} ${c.desc}` })),
    detail: (id) => { const c = (PC.CONDITIONS || []).find((x) => x.key === id); if (!c) return el("div", "muted", "Not found."); const box = el("div"); box.appendChild(el("div", "codex-sub", `${c.emoji} ${sevLabel(c.sev)}`)); box.appendChild(el("p", "codex-desc", esc(c.desc))); return box; },
  });

  /* Weapons */
  const rarityNote = (r) => (r && r !== "Common") ? " · " + r : "";
  addSection({
    key: "weapons", icon: "⚔️", title: "Weapons", blurb: "The full weapon catalog, grouped by type.",
    list: () => (PC.ITEMS || []).filter((i) => i.category === "Weapon").map((w) => ({ id: w.name, name: w.name, sub: `${w.damage} · ${w.hands === 2 ? "2H" : "1H"}${rarityNote(w.rarity)}`, group: w.weaponType, keywords: `${w.weaponType} ${w.damage} ${w.rarity} ${w.desc || ""}` })),
    detail: (id) => {
      const w = (PC.ITEMS || []).find((i) => i.category === "Weapon" && i.name === id); if (!w) return el("div", "muted", "Not found.");
      const box = el("div"); const rows = el("div", "codex-kvs");
      rows.appendChild(kv("Type", esc(w.weaponType)));
      rows.appendChild(kv("Damage", esc(w.damage)));
      rows.appendChild(kv("Hands", w.hands === 2 ? "Two-handed" : "One-handed"));
      rows.appendChild(kv("Weight", `${w.weight}`));
      rows.appendChild(kv("Rarity", esc(w.rarity || "Common")));
      box.appendChild(rows);
      if (w.desc) box.appendChild(el("p", "codex-desc", esc(w.desc)));
      if (w.note) box.appendChild(el("div", "codex-effect", "▸ " + esc(w.note)));
      return box;
    },
  });

  /* Armor */
  addSection({
    key: "armor", icon: "🛡️", title: "Armor", blurb: "Every armor piece across Light, Medium & Heavy.",
    list: () => (PC.ITEMS || []).filter((i) => i.category === "Armor").map((a) => ({ id: a.name, name: a.name, sub: `${a.armorClass} · +${a.dsBonus} DS${rarityNote(a.rarity)}`, group: a.armorClass, keywords: `${a.armorClass} ${a.rarity} ${a.desc || ""}` })),
    detail: (id) => {
      const a = (PC.ITEMS || []).find((i) => i.category === "Armor" && i.name === id); if (!a) return el("div", "muted", "Not found.");
      const box = el("div"); const rows = el("div", "codex-kvs");
      rows.appendChild(kv("Class", esc(a.armorClass)));
      rows.appendChild(kv("Defense bonus", `+${a.dsBonus} DS`));
      rows.appendChild(kv("Weight", `${a.weight}`));
      rows.appendChild(kv("Rarity", esc(a.rarity || "Common")));
      box.appendChild(rows);
      if (a.desc) box.appendChild(el("p", "codex-desc", esc(a.desc)));
      if (a.note) box.appendChild(el("div", "codex-effect", "▸ " + esc(a.note)));
      return box;
    },
  });

  /* Shields */
  addSection({
    key: "shields", icon: "🛡", title: "Shields", blurb: "Held one-handed; grant Defense and enable the Block reaction.",
    list: () => (PC.ITEMS || []).filter((i) => i.category === "Shield").map((s) => ({ id: s.name, name: s.name, sub: `+${s.dsBonus} DS · one hand${rarityNote(s.rarity)}`, group: s.subtype || "Shield", keywords: `shield ${s.subtype || ""} ${s.rarity} ${s.note || s.desc || ""}` })),
    detail: (id) => {
      const s = (PC.ITEMS || []).find((i) => i.category === "Shield" && i.name === id); if (!s) return el("div", "muted", "Not found.");
      const box = el("div"); const rows = el("div", "codex-kvs");
      if (s.subtype) rows.appendChild(kv("Type", esc(s.subtype)));
      rows.appendChild(kv("Defense bonus", `+${s.dsBonus} DS`));
      rows.appendChild(kv("Hands", "One hand"));
      rows.appendChild(kv("Weight", `${s.weight}`));
      rows.appendChild(kv("Rarity", esc(s.rarity || "Common")));
      box.appendChild(rows);
      if (s.note || s.desc) box.appendChild(el("p", "codex-desc", esc(s.note || s.desc)));
      box.appendChild(el("div", "codex-effect", "▸ Held in one hand (blocks a second weapon or a two-handed weapon). Adds its Defense while equipped, and enables the Block reaction — spend your reaction to add its Defense again against one hit."));
      return box;
    },
  });

  /* Gear (consumables, tools, misc) */
  addSection({
    key: "gear", icon: "🎒", title: "Gear", blurb: "Consumables, tool kits, and miscellaneous equipment.",
    list: () => (PC.ITEMS || []).filter((i) => ["Consumable", "Tool", "Misc"].indexOf(i.category) > -1).map((g) => ({ id: g.name, name: g.name, sub: g.category, group: g.category === "Consumable" ? "Consumables" : g.category === "Tool" ? "Tools" : "Miscellaneous", keywords: `${g.category} ${g.note || ""} ${g.skill || ""}` })),
    detail: (id) => {
      const g = (PC.ITEMS || []).find((i) => ["Consumable", "Tool", "Misc"].indexOf(i.category) > -1 && i.name === id); if (!g) return el("div", "muted", "Not found.");
      const box = el("div"); const rows = el("div", "codex-kvs");
      rows.appendChild(kv("Category", esc(g.category)));
      rows.appendChild(kv("Weight", `${g.weight}`));
      if (g.skill) rows.appendChild(kv("Skill kit", esc(g.skill)));
      box.appendChild(rows);
      if (g.desc) box.appendChild(el("p", "codex-desc", esc(g.desc)));
      if (g.note) box.appendChild(el("div", "codex-effect", "▸ " + esc(g.note)));
      return box;
    },
  });

  /* Crafting (salvage + component parts) */
  addSection({
    key: "crafting", icon: "🔨", title: "Crafting", blurb: "Raw salvage and the component parts they build into.",
    list: () => {
      const sal = (PC.SALVAGE || []).map((s) => ({ id: "salvage:" + s.name, name: s.name, sub: `Salvage · ${s.tier}`, group: "Salvage", keywords: `salvage ${s.tier} ${s.desc || ""}` }));
      const comp = (PC.COMPONENTS || []).map((c) => ({ id: "comp:" + c.part, name: c.part, sub: `Component · ${c.role}`, group: "Components", keywords: `component ${c.role} ${(c.mats || []).join(" ")} ${c.desc || ""}` }));
      return sal.concat(comp);
    },
    detail: (id) => {
      if (id.indexOf("salvage:") === 0) {
        const s = (PC.SALVAGE || []).find((x) => x.name === id.slice(8)); if (!s) return el("div", "muted", "Not found.");
        const box = el("div"); const rows = el("div", "codex-kvs");
        rows.appendChild(kv("Kind", "Raw salvage")); rows.appendChild(kv("Tier", esc(s.tier))); rows.appendChild(kv("Weight", `${s.weight}`));
        box.appendChild(rows); if (s.desc) box.appendChild(el("p", "codex-desc", esc(s.desc))); return box;
      }
      const c = (PC.COMPONENTS || []).find((x) => x.part === id.slice(5)); if (!c) return el("div", "muted", "Not found.");
      const box = el("div"); const rows = el("div", "codex-kvs");
      rows.appendChild(kv("Kind", "Component part")); rows.appendChild(kv("Role", esc(c.role))); rows.appendChild(kv("Weight", `${c.weight}`));
      if (c.mats) rows.appendChild(kv("Built from", (c.mats || []).join(", ")));
      if (c.exotic) rows.appendChild(kv("Exotic upgrade", esc(c.exotic) + " (higher grades)"));
      box.appendChild(rows);
      if (c.desc) box.appendChild(el("p", "codex-desc", esc(c.desc)));
      box.appendChild(el("div", "codex-effect", "▸ Comes in four grades (Crude · Standard · Fine · Masterwork). An assembled item's quality is the average of its parts' grades."));
      return box;
    },
  });

  /* Reference — a few core rules tables (Chakras, Limbs). */
  addSection({
    key: "reference", icon: "📐", title: "Reference", blurb: "Core rules tables — chakras and limb damage.",
    list: () => ([
      { id: "chakras", name: "Chakras", sub: "The chakra health track", group: "Combat systems", keywords: "chakra hits penalty attribute" },
      { id: "limbs", name: "Limb Damage", sub: "Called-shot / crippling", group: "Combat systems", keywords: "limb called shot crippled head torso arm leg" },
    ]),
    detail: (id) => {
      const box = el("div");
      if (id === "chakras") {
        const maxHits = (PC.RULES && PC.RULES.CHAKRA_MAX_HITS) || 4;
        box.appendChild(el("p", "codex-desc", `A second health track, separate from HP. Each of the six attribute chakras can take up to ${maxHits} hits, with escalating penalties to everything that uses that attribute; a hidden Heart chakra awakens with the Otherkin at Soul Level 15.`));
        box.appendChild(label("The six chakras"));
        PC.ATTRS.forEach((a) => { const c = (PC.CHAKRAS || {})[a]; if (!c) return; const r = el("div", "codex-mini"); r.innerHTML = `<span class="cm-name">${esc(c.name)} <span class="muted">· ${a} (${esc(PC.ATTR_NAMES[a] || a)})</span></span><span class="cm-sub">${esc(c.theme)}</span>`; box.appendChild(r); });
        if (PC.HEART_CHAKRA) { const r = el("div", "codex-mini"); r.innerHTML = `<span class="cm-name">${esc(PC.HEART_CHAKRA.name)} <span class="muted">· Heart (Otherkin)</span></span><span class="cm-sub">${esc(PC.HEART_CHAKRA.theme || "")}</span>`; box.appendChild(r); }
        // Derive the penalty ladder from the rules engine (PC.chakraEffect) so it can't drift from play.
        box.appendChild(label("Hit penalties"));
        for (let h = 1; h <= maxHits; h++) {
          const e = PC.chakraEffect ? PC.chakraEffect(h) : null;
          const txt = e ? (e.label + (e.lockedOut ? " — can't use that attribute's Kinetics" : "")) : "";
          box.appendChild(kv(h + (h === 1 ? " hit" : " hits"), esc(txt)));
        }
        return box;
      }
      // limbs
      box.appendChild(el("p", "codex-desc", "A third tracking system. Every character has six limbs, each with its own limb-HP (a fraction of max HP). Called shots target a limb; at 0 limb-HP it's crippled."));
      box.appendChild(label("The six limbs"));
      (PC.LIMBS || []).forEach((L) => { const r = el("div", "codex-mini"); r.innerHTML = `<span class="cm-name">${esc(L.name)} <span class="muted">· ${Math.round((L.frac || 0) * 100)}% of max HP</span></span>`; r.appendChild(el("div", "codex-effect", "▸ " + esc(L.crippled))); box.appendChild(r); });
      return box;
    },
  });

  /* Bestiary — placeholder (no monster data yet). */
  addSection({
    key: "bestiary", icon: "🐉", title: "Bestiary", blurb: "Monsters & NPCs — coming soon.", comingSoon: true,
    list: () => [],
    detail: () => el("div", "muted", "The bestiary is under construction."),
  });

  /* ---------------- rendering ---------------- */
  function draw() {
    if (!mount) return;
    mount.innerHTML = "";
    const wrap = el("div", "codex");
    wrap.appendChild(topBar());
    if (query.trim()) wrap.appendChild(searchView());
    else if (!sectionKey) wrap.appendChild(landingView());
    else if (!entryId) wrap.appendChild(sectionListView());
    else wrap.appendChild(entryView());
    mount.appendChild(wrap);
  }

  function topBar() {
    const bar = el("div", "codex-topbar");
    if (sectionKey || entryId) {
      const b = el("button", "btn ghost small", "← Back");
      b.onclick = back;
      bar.appendChild(b);
    }
    const search = el("input", "codex-search");
    search.type = "search";
    search.placeholder = "Search the Codex…";
    search.value = query;
    search.oninput = () => { query = search.value; draw(); refocus(); };
    bar.appendChild(search);
    return bar;
  }
  // Keep focus + caret in the search box across the re-render that typing triggers.
  function refocus() {
    const s = mount && mount.querySelector(".codex-search");
    if (s) { s.focus(); const v = s.value.length; try { s.setSelectionRange(v, v); } catch (e) {} }
  }

  function landingView() {
    const root = el("div");
    const head = el("div", "codex-head");
    head.appendChild(el("h2", null, "📖 Codex"));
    head.appendChild(el("p", "hint", "A searchable reference for everything in Psion Chronicles. Pick a category or search above."));
    root.appendChild(head);
    const grid = el("div", "codex-grid");
    SECTIONS.forEach((s) => {
      const n = s.comingSoon ? null : s.list().length;
      const tile = el("button", "codex-tile" + (s.comingSoon ? " soon" : ""));
      tile.innerHTML = `<span class="ct-ico">${s.icon}</span><span class="ct-title">${s.title}</span><span class="ct-sub">${esc(s.blurb)}</span>${n != null ? `<span class="ct-count">${n}</span>` : `<span class="ct-count soon">soon</span>`}`;
      tile.onclick = () => goSection(s.key);
      grid.appendChild(tile);
    });
    root.appendChild(grid);
    return root;
  }

  function sectionListView() {
    const s = sectionOf(sectionKey); if (!s) return el("div", "muted", "Unknown section.");
    const root = el("div");
    root.appendChild(el("div", "codex-crumbs", `${s.icon} ${esc(s.title)}`));
    if (s.comingSoon) { const p = el("div", "panel"); p.appendChild(el("div", "cs-badge", "🚧 Under construction")); p.appendChild(el("p", "hint", esc(s.blurb))); root.appendChild(p); return root; }
    const items = s.list();
    // group buckets (preserve first-seen order)
    const groups = []; const byGroup = {};
    items.forEach((it) => { const g = it.group || ""; if (!(g in byGroup)) { byGroup[g] = []; groups.push(g); } byGroup[g].push(it); });
    const panel = el("div", "panel");
    groups.forEach((g) => {
      if (g) panel.appendChild(el("div", "codex-group-label", g));
      const list = el("div", "codex-list");
      byGroup[g].forEach((it) => {
        const row = el("div", "codex-row");
        row.innerHTML = `<span class="cr-name">${it.name}</span>${it.sub ? `<span class="cr-sub">${esc(it.sub)}</span>` : ""}`;
        row.onclick = () => goEntry(s.key, it.id);
        list.appendChild(row);
      });
      panel.appendChild(list);
    });
    root.appendChild(panel);
    return root;
  }

  function entryView() {
    const s = sectionOf(sectionKey); if (!s) return el("div", "muted", "Unknown section.");
    const item = s.list().find((x) => x.id === entryId);
    // Some detail views use a synthetic id (e.g. "style:Frontier Gunslinging") with no list entry — show the
    // readable half after the prefix rather than the raw id.
    const titleHtml = item ? item.name : esc(prettyId(entryId));
    const root = el("div");
    const crumb = el("div", "codex-crumbs");
    const secLink = el("span", "link", `${s.icon} ${esc(s.title)}`); secLink.onclick = () => goSection(s.key);
    crumb.appendChild(secLink); crumb.appendChild(document.createTextNode("  ›  " + (item ? stripTags(item.name) : prettyId(entryId))));
    root.appendChild(crumb);
    const panel = el("div", "panel codex-detail");
    panel.appendChild(el("h2", "codex-title", titleHtml));
    panel.appendChild(s.detail(entryId));
    root.appendChild(panel);
    return root;
  }
  function stripTags(s) { return String(s).replace(/<[^>]*>/g, ""); }
  function prettyId(id) { const i = String(id).indexOf(":"); return i > -1 ? String(id).slice(i + 1) : String(id); }

  function searchView() {
    const root = el("div");
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const results = [];
    SECTIONS.forEach((s) => {
      if (s.comingSoon) return;
      s.list().forEach((it) => {
        const hay = `${stripTags(it.name)} ${it.sub || ""} ${it.keywords || ""}`.toLowerCase();
        if (terms.every((t) => hay.indexOf(t) > -1)) results.push({ s: s, it: it });
      });
    });
    root.appendChild(el("div", "codex-crumbs", `Search — ${results.length} result${results.length === 1 ? "" : "s"} for “${esc(query.trim())}”`));
    if (!results.length) { root.appendChild(el("div", "panel muted", "No matches. Try a shorter or different term.")); return root; }
    // group results by section
    const bySec = []; const map = {};
    results.forEach((r) => { if (!(r.s.key in map)) { map[r.s.key] = []; bySec.push(r.s); } map[r.s.key].push(r.it); });
    const panel = el("div", "panel");
    bySec.forEach((s) => {
      panel.appendChild(el("div", "codex-group-label", `${s.icon} ${s.title}`));
      const list = el("div", "codex-list");
      map[s.key].slice(0, 50).forEach((it) => {
        const row = el("div", "codex-row");
        row.innerHTML = `<span class="cr-name">${it.name}</span>${it.sub ? `<span class="cr-sub">${esc(it.sub)}</span>` : ""}`;
        row.onclick = () => goEntry(s.key, it.id);
        list.appendChild(row);
      });
      if (map[s.key].length > 50) list.appendChild(el("div", "muted", `+${map[s.key].length - 50} more — refine your search`));
      panel.appendChild(list);
    });
    root.appendChild(panel);
    return root;
  }

  // Reset to the landing view each time the Codex screen is (re)entered from elsewhere.
  function reset() { sectionKey = null; entryId = null; query = ""; }

  window.PsionCodex = { render: render, reset: reset };
})();
