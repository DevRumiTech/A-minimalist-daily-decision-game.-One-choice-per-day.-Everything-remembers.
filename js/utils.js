/*
  utils.js
  --------
  Small helper functions used across the app.
  No game logic lives here — only utilities.
*/

window.Utils = {
    /*
      Returns today's date in YYYY-MM-DD format (local time).
      Used to:
      - enforce one choice per real day
      - label timeline entries
    */
    todayKey() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    },
  
    /*
      Returns a Date object for the next local midnight.
      Used to calculate the daily cooldown countdown.
    */
    nextMidnight() {
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
      );
    },
  
    /*
      Converts milliseconds into HH:MM:SS format.
      Used for the countdown timer display.
    */
    msToClock(ms) {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const s = String(totalSeconds % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    },
  
    /*
      Safe JSON loader for localStorage.
      Prevents crashes if data is missing or corrupted.
    */
    load(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
  
    /*
      Safe JSON saver for localStorage.
    */
    save(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  