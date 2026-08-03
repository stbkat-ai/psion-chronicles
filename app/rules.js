/* ============================================================
   Psion Chronicles — Rules Engine (pure calculation functions)
   Depends on: data.js (window.PC)
   ============================================================ */
window.PC = window.PC || {};

/* Attribute modifier from a score.
   Table (1-30) per GAME_RULES; extends past 30 on the same 3-to-1 scale. */
PC.abilityMod = function (score) {
  if (score >= 30) return 5 + Math.floor((score - 30) / 3);
  if (score >= 27) return 4;
  if (score >= 24) return 3;
  if (score >= 21) return 2;
  if (score >= 18) return 1;
  if (score >= 15) return 0;
  if (score >= 12) return -1;
  if (score >= 9)  return -2;
  if (score >= 6)  return -3;
  if (score >= 3)  return -4;
  return -5; // 1-2
};

PC.fmtMod = function (m) { return (m >= 0 ? "+" : "") + m; };

/* Proficiency bonus by Soul Level: +3 (1-14), +4 (15-29), +5 (30). */
PC.profBonus = function (level) {
  if (level >= 30) return 5;
  if (level >= 15) return 4;
  return 3;
};

/* ---- XP / Soul Pool ----------------------------------------------------------
   Cumulative XP needed to be AT a given Soul Level (from PC.XP_THRESHOLDS). */
PC.xpForLevel = function (level) {
  const t = PC.XP_THRESHOLDS || [0, 0];
  const cap = PC.RULES.LEVEL_CAP;
  if (level <= 1) return 0;
  if (level >= cap) return t[cap];
  return t[level] || 0;
};
/* The Soul Level a given XP total has earned (highest level whose threshold ≤ xp). */
PC.levelForXP = function (xp) {
  const cap = PC.RULES.LEVEL_CAP;
  let lvl = 1;
  for (let L = 2; L <= cap; L++) { if ((xp || 0) >= PC.xpForLevel(L)) lvl = L; else break; }
  return lvl;
};
/* Progress toward the next level, for the play sheet's XP bar. `level` is the character's CURRENT
   (GM-driven) Soul Level; the bar measures xp from this level's floor to the next level's threshold.
   Returns { maxed, curFloor, nextAt, into, span, remaining, pct, ready }. */
PC.xpBar = function (xp, level) {
  xp = Math.max(0, xp || 0);
  if (level >= PC.RULES.LEVEL_CAP) {
    const floor = PC.xpForLevel(PC.RULES.LEVEL_CAP);
    return { maxed: true, curFloor: floor, nextAt: floor, into: 0, span: 0, remaining: 0, pct: 100, ready: false };
  }
  const curFloor = PC.xpForLevel(level);
  const nextAt = PC.xpForLevel(level + 1);
  const span = Math.max(1, nextAt - curFloor);
  const into = Math.max(0, xp - curFloor);
  const pct = Math.max(0, Math.min(100, (into / span) * 100));
  return { maxed: false, curFloor, nextAt, into: Math.min(into, span), span, remaining: Math.max(0, nextAt - xp), pct, ready: xp >= nextAt };
};

/* Roll a die (used by the stat generator + dice roller). */
PC.rollDie = function (sides) { return 1 + Math.floor(Math.random() * sides); };

/* Generate attribute-score candidates: roll 8d12, drop 2 lowest, +10 to each.
   Returns { rolls:[8], kept:[6 raw], values:[6 final] } sorted high→low. */
PC.rollAttributeSet = function () {
  const rolls = [];
  for (let i = 0; i < 8; i++) rolls.push(PC.rollDie(12));
  const sorted = rolls.slice().sort((a, b) => b - a); // high→low
  const kept = sorted.slice(0, 6);                     // drop the 2 lowest
  const values = kept.map((v) => v + 10);
  return { rolls, kept, values };
};

/* Given base scores {STR,..}, background boosts {STR:3,..}, and any temp attr
   modifiers, return the effective score per attribute. */
PC.effectiveScores = function (base, boosts, tempAttr) {
  const out = {};
  PC.ATTRS.forEach((a) => {
    out[a] = (base[a] || 0) + ((boosts && boosts[a]) || 0) + ((tempAttr && tempAttr[a]) || 0);
  });
  return out;
};

/* Pools. Body Pool = STR+AGI+CON (+ boosts); Mind Pool = INT+WIS+CHA (+ boosts).
   `poolBoost` = {body,mind} permanent boosts (e.g. from background). */
PC.bodyPool = function (scores, poolBoost) {
  return PC.BODY_ATTRS.reduce((s, a) => s + (scores[a] || 0), 0) + ((poolBoost && poolBoost.body) || 0);
};
PC.mindPool = function (scores, poolBoost) {
  return PC.MIND_ATTRS.reduce((s, a) => s + (scores[a] || 0), 0) + ((poolBoost && poolBoost.mind) || 0);
};

/* Full derived-stat block from effective scores. */
PC.derive = function (scores, level) {
  const mod = {};
  PC.ATTRS.forEach((a) => (mod[a] = PC.abilityMod(scores[a] || 0)));
  const R = PC.RULES;
  return {
    mods: mod,
    defenseScore: R.BASE_DS + mod.AGI + mod.CON,
    movement:     R.BASE_MOVE  + R.SPEED_PER_MOD * mod.AGI,
    climb:        R.BASE_CLIMB + R.SPEED_PER_MOD * mod.STR,
    jump:         R.BASE_JUMP  + R.SPEED_PER_MOD * mod.STR,
    swim:         R.BASE_SWIM  + R.SPEED_PER_MOD * mod.CON,
    carry:        R.BASE_CARRY + R.CARRY_PER_MOD * mod.CON,
    initiativeMod: mod.AGI,
    profBonus:    PC.profBonus(level || 1),
  };
};

/* Chakra effect for a given number of hits (0-4) on an attribute's chakra.
   Returns { disadvantage, modMultiplier|null, lockedOut, label }.
   modMultiplier applies to the attribute's modifier (2nd hit = half rounded up). */
PC.chakraEffect = function (hits) {
  switch (hits) {
    case 0: return { disadvantage: false, effMod: (m) => m,                         lockedOut: false, label: "Healthy" };
    case 1: return { disadvantage: true,  effMod: (m) => m,                         lockedOut: false, label: "Disadvantage" };
    case 2: return { disadvantage: true,  effMod: (m) => Math.ceil(m / 2),          lockedOut: false, label: "Modifier halved" };
    case 3: return { disadvantage: true,  effMod: () => 0,                          lockedOut: false, label: "Modifier removed" };
    default:return { disadvantage: true,  effMod: () => 0,                          lockedOut: true,  label: "Locked out" };
  }
};

/* Roll a dice expression like "2d6" → {rolls:[..], total, n, sides}. */
PC.rollDiceExpr = function (expr) {
  const m = /^\s*(\d+)\s*d\s*(\d+)\s*$/i.exec(expr || "");
  if (!m) return null;
  const n = +m[1], sides = +m[2], rolls = [];
  let total = 0;
  for (let i = 0; i < n; i++) { const r = PC.rollDie(sides); rolls.push(r); total += r; }
  return { rolls, total, n, sides };
};

/* Roll a d20 check with a modifier and optional advantage/disadvantage.
   mode: "normal" | "adv" | "dis". Returns {d20s:[..], picked, mod, total, mode}. */
PC.rollCheck = function (mod, mode) {
  const a = PC.rollDie(20), b = PC.rollDie(20);
  let picked, d20s;
  if (mode === "adv") { picked = Math.max(a, b); d20s = [a, b]; }
  else if (mode === "dis") { picked = Math.min(a, b); d20s = [a, b]; }
  else { picked = a; d20s = [a]; }
  return { d20s, picked, mod: mod || 0, total: picked + (mod || 0), mode: mode || "normal" };
};

/* Lookups */
PC.background = function (name) { return PC.BACKGROUNDS.find((b) => b.name === name) || null; };
PC.skill = function (name) { return PC.SKILLS.find((s) => s.name === name) || null; };
PC.kinetic = function (name) { return PC.KINETICS.find((k) => k.name === name) || null; };
// technique() resolves base techniques first, then fusion techniques — so the play sheet can render/roll a
// granted fusion technique by name. Fusions are excluded from the creator/level-up because those iterate
// PC.TECHNIQUES directly (which never contains fusion techniques).
PC.technique = function (name) {
  return PC.TECHNIQUES.find((t) => t.name === name) || (PC.FUSION_TECHNIQUES || []).find((t) => t.name === name) || null;
};

/* ---- Fusion Kinetics ---------------------------------------------------------
   A fusion is two parent kinetics combined. Each fusion technique is a PAIR of one technique from each
   parent at the SAME tier, Adept and above only (parent Adept→fusion Adept, Expert→Expert, Master→Master;
   parents' Beginner techniques never form fusions). A character automatically KNOWS a fusion technique once
   they know BOTH halves of its pair — no TP, auto-granted. A fusion is "unlocked" (revealed) as soon as the
   character knows at least one of its techniques.                                                          */
PC.fusion = function (name) { return (PC.FUSIONS || []).find((f) => f.name === name) || null; };
PC.fusionTechniques = function (name) { return (PC.FUSION_TECHNIQUES || []).filter((t) => t.kinetic === name); };
/* Every fusion technique the character has earned, given the set of base technique names they know. */
PC.grantedFusionTechniques = function (knownNames) {
  const set = knownNames instanceof Set ? knownNames : new Set(knownNames || []);
  return (PC.FUSION_TECHNIQUES || []).filter((t) => set.has(t.pair[0]) && set.has(t.pair[1]));
};
/* Distinct fusion names currently unlocked (≥1 granted technique). */
PC.unlockedFusions = function (knownNames) {
  const names = [];
  PC.grantedFusionTechniques(knownNames).forEach((t) => { if (names.indexOf(t.kinetic) < 0) names.push(t.kinetic); });
  return names;
};
PC.skillsByAttr = function (attr) { return PC.SKILLS.filter((s) => s.attr === attr); };
/* Techniques of a Kinetic at a given tier (3 per tier per Kinetic). */
PC.kineticTierTechniques = function (kinetic, tier) { return PC.TECHNIQUES.filter((t) => t.kinetic === kinetic && t.tier === tier); };
/* True if the character knows EVERY technique in a Kinetic's given tier. */
PC.kineticTierComplete = function (kinetic, tier, knownNames) {
  const all = PC.kineticTierTechniques(kinetic, tier);
  return all.length > 0 && all.every((t) => knownNames.indexOf(t.name) > -1);
};
/* Proficiency earned within a Kinetic:
   - completing its Adept tier grants proficiency (the background focus Kinetic is proficient from the start);
   - completing its Expert tier grants expertise (double proficiency bonus).
   Returns "none" | "proficient" | "expertise". */
PC.kineticProfLevel = function (kinetic, knownNames, isFocus) {
  if (PC.kineticTierComplete(kinetic, "Expert", knownNames)) return "expertise";
  if (isFocus || PC.kineticTierComplete(kinetic, "Adept", knownNames)) return "proficient";
  return "none";
};
/* Numeric proficiency bonus for a Kinetic at a Soul Level, given a proficiency level (0 / prof / 2×prof). */
PC.kineticProfBonus = function (level, profLevel) {
  const p = PC.profBonus(level);
  return profLevel === "expertise" ? p * 2 : profLevel === "proficient" ? p : 0;
};
PC.heritage = function (name) { return (PC.HERITAGES || []).find((h) => h.name === name) || null; };
/* The single weapon SUBTYPE (e.g. "Great Swords") a heritage grants proficiency with, or null. */
PC.heritageWeaponSubtype = function (heritageName) { const h = PC.heritage(heritageName); return (h && h.weaponSubtype) || null; };
/* The weapon TYPE that owns a given subtype name (e.g. "Great Swords" → "Heavy Weapons"), or null. */
PC.weaponTypeOfSubtype = function (subtypeName) {
  if (!subtypeName) return null;
  const t = (PC.WEAPON_TYPES || []).find((w) => (w.subtypes || []).indexOf(subtypeName) > -1);
  return t ? t.name : null;
};
PC.combatSkill = function (name) { return (PC.COMBAT_SKILLS || []).find((s) => s.name === name) || null; };
PC.fightingStyle = function (name) { return (PC.FIGHTING_STYLES || []).find((s) => s.name === name) || null; };
/* The Fighting Style granted by a heritage. */
PC.styleForHeritage = function (heritageName) {
  const h = PC.heritage(heritageName);
  return h ? PC.fightingStyle(h.fightingStyle) : null;
};
/* A style's signature Passive skill (the one skill with action "Passive"). */
PC.stylePassive = function (styleName) {
  const s = PC.fightingStyle(styleName);
  return s ? (s.skills.find((k) => k.action === "Passive") || null) : null;
};
/* Every combat skill a heritage grants at creation: its 2 active starters + the style's Passive. */
PC.heritageGrantedSkills = function (heritageName) {
  const h = PC.heritage(heritageName);
  if (!h) return [];
  const names = (h.combatSkills || []).slice();
  const p = PC.stylePassive(h.fightingStyle);
  if (p && names.indexOf(p.name) < 0) names.push(p.name);
  return names;
};
