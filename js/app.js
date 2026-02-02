/*
  app.js
  ------
  This file connects:
  - the HTML UI
  - the game engine
  - real-time daily lock logic

  It:
  - renders the current decision
  - enforces one choice per day
  - updates the timeline
  - updates countdown + memory hint
*/

// ===== Load persistent game state =====
const state = Engine.loadState();

// ===== Cache DOM references =====
const todayEl = document.getElementById("today");
const countdownEl = document.getElementById("countdown");
const memoryEl = document.getElementById("memory");
const kickerEl = document.getElementById("kicker");
const titleEl = document.getElementById("promptTitle");
const bodyEl = document.getElementById("promptBody");
const choicesEl = document.getElementById("choices");
const lockedEl = document.getElementById("locked");
const timelineEl = document.getElementById("timeline");

// ===== Render today's date =====
todayEl.textContent = Utils.todayKey();

// ===== Countdown timer until next midnight =====
function updateCountdown() {
  const now = new Date();
  const next = Utils.nextMidnight();
  const ms = next - now;
  countdownEl.textContent = Utils.msToClock(ms);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Render memory hint =====
memoryEl.textContent = Engine.memoryHint(state.vars);

// ===== Select today's decision =====
const decision = Engine.chooseDecision(state);

// ===== Render decision content =====
kickerEl.textContent = decision.kicker;
titleEl.textContent = decision.title;
bodyEl.textContent = decision.body;

// ===== Check daily lock =====
const locked = !Engine.canChooseToday(state);
lockedEl.style.display = locked ? "block" : "none";

// ===== Render choices =====
choicesEl.innerHTML = "";

if (!locked) {
  decision.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;

    btn.onclick = () => {
      // Apply hidden effects
      Engine.applyEffects(state, choice.effects);

      // Determine consequence narrative
      const level = Engine.consequenceLevel(state);
      const consequence =
        choice.consequences[level] || "Something changes quietly.";

      // Record history entry
      state.lastChoiceDay = Utils.todayKey();
      state.history.push({
        day: Utils.todayKey(),
        title: decision.title,
        choice: choice.text,
        result: consequence
      });

      // Persist state
      Engine.saveState(state);

      // Reload page to enforce lock
      location.reload();
    };

    choicesEl.appendChild(btn);
  });
}

// ===== Render timeline =====
timelineEl.innerHTML = "";

state.history.slice().reverse().forEach(entry => {
  const div = document.createElement("div");
  div.className = "timeline-entry";

  div.innerHTML = `
    <div class="date">${entry.day}</div>
    <div>${entry.choice}</div>
    <div>${entry.result}</div>
  `;

  timelineEl.appendChild(div);
});

// ===== Check endings =====
const ending = Engine.checkEnding(state);
if (ending) {
  alert(ending);
}
