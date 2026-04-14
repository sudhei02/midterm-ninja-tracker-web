// Sequence of title "scenes" - each runs in order, then the whole cycle repeats.
// Slower pace: 350ms per frame for readability.
const FRAME_MS = 350;
const DEFAULT_TITLE = "Midterm Ninja Planner";

// Scene 1: Ninja slowly pushes the text from right to left across the tab
function buildPushScene() {
  const text = "Midterm Ninja Planner";
  const frames = [];
  // Start: ninja far right, text hidden
  for (let i = 0; i <= text.length; i++) {
    const revealed = text.slice(0, i);
    const spaces = " ".repeat(text.length - i);
    frames.push(`${revealed}${spaces}🥷`);
  }
  return frames;
}

// Scene 2: Ninja dashes left with smoke trail
const DASH_SCENE = [
  "         🥷 Midterm",
  "       💨🥷 Midterm",
  "     💨 🥷 Midterm",
  "   💨   🥷Midterm",
  " 💨     🥷Midterm",
  "💨      🥷Midterm",
];

// Scene 3: Sword slash combo
const SLASH_SCENE = [
  "🥷 Ninja ready...",
  "🥷⚔️ Ninja strikes!",
  "🥷 ⚔️ SLASH!",
  "🥷  ⚔️💥 HIT!",
  "🥷   ✨ CRIT!",
  "🥷✨ Victory!",
];

// Scene 4: Shuriken throw
const SHURIKEN_SCENE = [
  "🥷 throws...",
  "🥷 ✴️",
  "🥷   ✴️",
  "🥷     ✴️",
  "🥷       ✴️💥",
  "🥷 bullseye!",
];

// Scene 5: Zen pause
const ZEN_SCENE = [
  "🧘 breathe...",
  "🧘 focus...",
  "🧘 study hard",
  "🧘 stay sharp",
];

function buildAllFrames() {
  return [
    ...buildPushScene(),
    ...DASH_SCENE,
    ...SLASH_SCENE,
    ...SHURIKEN_SCENE,
    ...ZEN_SCENE,
  ];
}

let intervalId = null;

export function startNinjaTitle() {
  stopNinjaTitle();
  const frames = buildAllFrames();
  let i = 0;
  document.title = frames[0];
  intervalId = setInterval(() => {
    i = (i + 1) % frames.length;
    document.title = frames[i];
  }, FRAME_MS);
}

export function stopNinjaTitle() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  document.title = DEFAULT_TITLE;
}
