const NOTIF_KEY = "muso-ninja-last-notif";

function log(...args) {
  try {
    console.log("[ninja-notif]", ...args);
  } catch {
    // Ignore logging failures.
  }
}

function warn(...args) {
  try {
    console.warn("[ninja-notif]", ...args);
  } catch {
    // Ignore logging failures.
  }
}

export function requestNotifPermission() {
  try {
    if (!("Notification" in window)) {
      log("Browser Notification API not available");
      return;
    }
    if (Notification.permission === "default") {
      log("Requesting Notification permission");
      Notification.requestPermission()
        .then((perm) => log("Notification permission:", perm))
        .catch((err) => warn("Permission request failed", err));
    } else {
      log("Notification permission already:", Notification.permission);
    }
  } catch (err) {
    warn("requestNotifPermission failed", err);
  }
}

export function sendProgressNotif(doneTasks, totalTasks) {
  try {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const pct = Math.round((doneTasks / totalTasks) * 100);
    const milestone = Math.floor(pct / 5) * 5;
    let lastMilestone;

    try {
      lastMilestone = parseInt(localStorage.getItem(NOTIF_KEY) || "0", 10);
    } catch (err) {
      warn("sendProgressNotif: read localStorage failed", err);
      return;
    }

    if (milestone <= lastMilestone || milestone === 0) return;

    try {
      localStorage.setItem(NOTIF_KEY, String(milestone));
    } catch (err) {
      warn("sendProgressNotif: write localStorage failed", err);
      return;
    }

    log("Browser notif milestone", milestone, `(${doneTasks}/${totalTasks})`);
    new Notification(`Muso hit ${pct}%!`, {
      body: `${doneTasks}/${totalTasks} tasks done. Rank: ${getRank(pct)}`,
      icon: "./ninja-favicon.png",
    });
  } catch (err) {
    warn("sendProgressNotif failed", err);
  }
}

/**
 * Fire-and-forget ntfy push. Safe to call on every event.
 * Silently skips if topic isn't configured.
 */
export function sendNtfyEvent({ title, message, tags = "ninja" }) {
  try {
    const topic = import.meta.env.VITE_NTFY_TOPIC;
    if (!topic) {
      log("ntfy skipped (no VITE_NTFY_TOPIC)", { title });
      return;
    }

    log("ntfy →", { title, message, tags });

    const tagArray = typeof tags === "string" ? tags.split(",").map((t) => t.trim()).filter(Boolean) : tags;

    fetch("https://ntfy.sh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        title,
        message,
        tags: tagArray,
      }),
    })
      .then((res) => {
        if (!res.ok) warn("ntfy response not ok", res.status, title);
        else log("ntfy ✓", title);
      })
      .catch((err) => warn("ntfy fetch failed", title, err));
  } catch (err) {
    warn("sendNtfyEvent failed", err);
  }
}

// ---- High-level event helpers (each is wrapped for safety) ----

export function notifyTaskChecked(task, course, pct, doneTasks, totalTasks) {
  try {
    log("EVENT: task checked", { task, course, pct, doneTasks, totalTasks });
    sendNtfyEvent({
      title: `✅ ${course}: task done (${pct}%)`,
      message: `"${task}"\nProgress: ${doneTasks}/${totalTasks} · Rank: ${getRank(pct)}`,
      tags: "white_check_mark,ninja",
    });
  } catch (err) {
    warn("notifyTaskChecked failed", err);
  }
}

export function notifyTaskUnchecked(task, course, pct, doneTasks, totalTasks) {
  try {
    log("EVENT: task unchecked", { task, course, pct, doneTasks, totalTasks });
    sendNtfyEvent({
      title: `↩️ ${course}: task unchecked (${pct}%)`,
      message: `"${task}"\nProgress: ${doneTasks}/${totalTasks}`,
      tags: "leftwards_arrow_with_hook",
    });
  } catch (err) {
    warn("notifyTaskUnchecked failed", err);
  }
}

export function notifyTimerStarted(mode) {
  try {
    log("EVENT: timer started", { mode });
    sendNtfyEvent({
      title: mode === "focus" ? "⏱️ Focus started" : "☕ Break started",
      message: mode === "focus" ? "Muso started a 25-min focus session." : "Muso started a 5-min break.",
      tags: mode === "focus" ? "fire,hourglass_flowing_sand" : "coffee",
    });
  } catch (err) {
    warn("notifyTimerStarted failed", err);
  }
}

export function notifyTimerPaused(mode, secondsLeft) {
  try {
    log("EVENT: timer paused", { mode, secondsLeft });
    const min = Math.floor(secondsLeft / 60);
    const sec = secondsLeft % 60;
    sendNtfyEvent({
      title: "⏸️ Timer paused",
      message: `Paused ${mode} mode at ${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")} remaining.`,
      tags: "pause_button",
    });
  } catch (err) {
    warn("notifyTimerPaused failed", err);
  }
}

export function notifyTimerReset(mode) {
  try {
    log("EVENT: timer reset", { mode });
    sendNtfyEvent({
      title: "🔄 Timer reset",
      message: `Muso reset the ${mode} timer.`,
      tags: "arrows_counterclockwise",
    });
  } catch (err) {
    warn("notifyTimerReset failed", err);
  }
}

export function notifyTimerCompleted(mode, minutes) {
  try {
    log("EVENT: timer completed", { mode, minutes });
    sendNtfyEvent({
      title: mode === "focus" ? "🔥 Focus session complete" : "☕ Break complete",
      message: mode === "focus"
        ? `Muso focused for ${minutes} minutes. Time for a break.`
        : `Break over. Time to get back to it.`,
      tags: mode === "focus" ? "fire,tada" : "coffee,bell",
    });
  } catch (err) {
    warn("notifyTimerCompleted failed", err);
  }
}

export function notifyLogin() {
  try {
    log("EVENT: login");
    sendNtfyEvent({
      title: "🥷 Muso logged in",
      message: `Session started at ${new Date().toLocaleTimeString()}.`,
      tags: "unlock,ninja",
    });
  } catch (err) {
    warn("notifyLogin failed", err);
  }
}

export function notifyAllProgressReset() {
  try {
    log("EVENT: progress reset");
    sendNtfyEvent({
      title: "⚠️ All progress reset",
      message: "Muso reset all task progress.",
      tags: "warning",
    });
  } catch (err) {
    warn("notifyAllProgressReset failed", err);
  }
}

function getRank(pct) {
  try {
    return pct >= 100 ? "LEGENDARY NINJA"
      : pct >= 75 ? "Shadow Master"
      : pct >= 50 ? "Blade Runner"
      : pct >= 25 ? "Apprentice"
      : "Genin";
  } catch {
    return "Ninja";
  }
}
