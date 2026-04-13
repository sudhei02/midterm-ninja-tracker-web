import emailjs from "@emailjs/browser";

const NOTIF_KEY = "muso-ninja-last-notif";
const EMAIL_KEY = "muso-ninja-last-email";

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

  const rank = getRank(pct);

  new Notification(`Muso hit ${pct}%!`, {
    body: `${doneTasks}/${totalTasks} tasks done. Rank: ${rank}`,
    icon: "./ninja-favicon.png",
  });
}

export function sendEmailUpdate(doneTasks, totalTasks) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const toEmail = import.meta.env.VITE_NOTIFY_EMAIL;

  if (!serviceId || !templateId || !publicKey || !toEmail) return;

  const pct = Math.round((doneTasks / totalTasks) * 100);
  const milestone = Math.floor(pct / 10) * 10;
  const lastEmailMilestone = parseInt(localStorage.getItem(EMAIL_KEY) || "0", 10);

  // Only email every 10% milestone to avoid spam
  if (milestone <= lastEmailMilestone || milestone === 0) return;
  localStorage.setItem(EMAIL_KEY, String(milestone));

  const rank = getRank(pct);

  emailjs.send(serviceId, templateId, {
    to_email: toEmail,
    subject: `Muso Progress: ${pct}% complete!`,
    message: `Muso has completed ${doneTasks}/${totalTasks} tasks (${pct}%). Current rank: ${rank}.`,
    progress: `${pct}%`,
    rank,
  }, publicKey).catch(() => {
    // Silently fail - don't break the app if email fails
  });
}

function getRank(pct) {
  return pct >= 100 ? "LEGENDARY NINJA"
    : pct >= 75 ? "Shadow Master"
    : pct >= 50 ? "Blade Runner"
    : pct >= 25 ? "Apprentice"
    : "Genin";
}
