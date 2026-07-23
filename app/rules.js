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
PC.technique = function (name) { return PC.TECHNIQUES.find((t) => t.name === name) || null; };
PC.skillsByAttr = function (attr) { return PC.SKILLS.filter((s) => s.attr === attr); };
/* Techniques of a Kinetic at a given tier (5 per tier per Kinetic). */
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
