/*
  engine.js
  ---------
  This is the core of AFTERMATH.

  Responsibilities:
  - Store and load persistent game state
  - Maintain hidden long-term variables
  - Enforce "one choice per real day"
  - Select which decision appears next (weighted)
  - Generate narrative consequences
  - Detect endings (no win condition)

  IMPORTANT:
  - All numbers are hidden from the player
  - Only narrative outcomes are surfaced
*/

const STORE_KEY = "aftermath_state_v1";

/*
  Default starting state.
  These values are intentionally imperfect.
*/
const DEFAULT_STATE = {
  lastChoiceDay: null, // YYYY-MM-DD
  vars: {
    stability: 55,
    pressure: 35,
    trust: 45,
    entropy: 40
  },
  history: [] // timeline entries
};

/*
  Load state from localStorage safely.
*/
function loadState() {
  return Utils.load(STORE_KEY, structuredClone(DEFAULT_STATE));
}

/*
  Save state to localStorage.
*/
function saveState(state) {
  Utils.save(STORE_KEY, state);
}

/*
  Determines whether the player can make a choice today.
*/
function canChooseToday(state) {
  return state.lastChoiceDay !== Utils.todayKey();
}

/*
  Converts hidden variables into a vague narrative hint.
  This is the ONLY way hidden state is exposed.
*/
function memoryHint(vars) {
  if (vars.pressure > 75 && vars.entropy > 65) {
    return "The air feels crowded.";
  }
  if (vars.entropy > 75) {
    return "Patterns are slipping.";
  }
  if (vars.trust < 25) {
    return "You feel alone in this.";
  }
  if (vars.stability < 30) {
    return "Something is coming loose.";
  }
  if (vars.stability > 75 && vars.entropy < 30) {
    return "Everything is too quiet.";
  }
  return "Quiet.";
}

/*
  Weighted decision selection.
  Past behavior and current state influence what appears next.
*/
function chooseDecision(state) {
  const weights = Decisions.map(decision => {
    let w = 10;

    if (decision.tags.includes("pressure")) {
      w += (state.vars.pressure - 50) / 6;
    }
    if (decision.tags.includes("entropy")) {
      w += (state.vars.entropy - 50) / 6;
    }
    if (decision.tags.includes("trust")) {
      w += (state.vars.trust - 50) / 7;
    }
    if (decision.tags.includes("stability")) {
      w += (state.vars.stability - 50) / 7;
    }

    return Math.max(1, w);
  });

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < Decisions.length; i++) {
    r -= weights[i];
    if (r <= 0) return Decisions[i];
  }

  return Decisions[0];
}

/*
  Determines consequence intensity.
  Deeper play increases narrative severity.
*/
function consequenceLevel(state) {
  const score =
    state.vars.pressure * 0.6 +
    state.vars.entropy * 0.4 +
    state.history.length * 2;

  if (score < 70) return "low";
  if (score < 110) return "mid";
  return "high";
}

/*
  Apply hidden variable effects after a choice.
*/
function applyEffects(state, effects) {
  for (const key in effects) {
    state.vars[key] += effects[key];
    state.vars[key] = Math.max(0, Math.min(100, state.vars[key]));
  }
}

/*
  Check for narrative endings.
  Endings are permanent and archived in history.
*/
function checkEnding(state) {
  const v = state.vars;

  if (v.pressure > 90 && v.stability < 25) {
    return "THE COLLAPSE — The structure fails all at once.";
  }

  if (v.entropy > 90 && v.trust < 30) {
    return "THE NOISE — Patterns dissolve beyond recovery.";
  }

  if (v.stability > 85 && v.entropy < 20) {
    return "THE STILLNESS — Everything becomes optimized.";
  }

  return null;
}

/*
  Expose engine API
*/
window.Engine = {
  loadState,
  saveState,
  canChooseToday,
  memoryHint,
  chooseDecision,
  consequenceLevel,
  applyEffects,
  checkEnding
};
