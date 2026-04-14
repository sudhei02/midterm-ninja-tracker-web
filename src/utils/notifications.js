const NOTIF_KEY = "muso-ninja-last-notif";
const NTFY_KEY = "muso-ninja-last-ntfy";

export function requestNotifPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function sendProgressNotif(doneTasks, totalTasks) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const pct = Math.round((doneTasks / totalTasks) * 100);
  const milestone = Math.floor(pct / 5) * 5;
  const lastMilestone = parseInt(localStorage.getItem(NOTIF_KEY) || "0", 10);

  if (milestone <= lastMilestone || milestone === 0) return;
  localStorage.setItem(NOTIF_KEY, String(milestone));

  new Notification(`Muso hit ${pct}%!`, {
    body: `${doneTasks}/${totalTasks} tasks done. Rank: ${getRank(pct)}`,
    icon: "./ninja-favicon.png",
  });
}

export function sendNtfyUpdate(doneTasks, totalTasks) {
  const topic = import.meta.env.VITE_NTFY_TOPIC;
  if (!topic) return;

  const pct = Math.round((doneTasks / totalTasks) * 100);
  const milestone = Math.floor(pct / 10) * 10;
  const lastMilestone = parseInt(localStorage.getItem(NTFY_KEY) || "0", 10);

  if (milestone <= lastMilestone || milestone === 0) return;
  localStorage.setItem(NTFY_KEY, String(milestone));

  const rank = getRank(pct);

  fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: { Title: `Muso Progress: ${pct}%`, Tags: "ninja,chart_with_upwards_trend" },
    body: `${doneTasks}/${totalTasks} tasks done. Rank: ${rank}`,
  }).catch(() => {});
}

function getRank(pct) {
  return pct >= 100 ? "LEGENDARY NINJA"
    : pct >= 75 ? "Shadow Master"
    : pct >= 50 ? "Blade Runner"
    : pct >= 25 ? "Apprentice"
    : "Genin";
}
