export const STORAGE_KEY = "muso-ninja-planner-v2";

export const COURSE_GUIDANCE = {
  MATH103: {
    sources: "Check slides, LMS, notes, or Teams.",
    fallback: "If unsure, ask sister.",
  },
  MGMT211: {
    sources: "Check slides, LMS notes, or class chat.",
    fallback: "If unsure, ask sister.",
  },
  ECON102: {
    sources: "Check slides, LMS, and ECON102 Teams.",
    fallback: "If unsure, ask sister.",
  },
  MGMT202: {
    sources: "Check slides, outline, notes, or LMS handouts.",
    fallback: "If unsure, ask sister.",
  },
};

export const MOTIVATIONAL_QUOTES = [
  "You do not need a perfect day. You need a repeatable one.",
  "Small focused sessions beat one heroic cram night.",
  "If today feels messy, keep going anyway. Consistency is what changes the result.",
  "You can be nervous and still be effective. Do the next step, not the whole exam at once.",
  "Ask for help early. That is a smart move, not a weak one.",
];

export const priorityStyles = {
  high: { bg: "#ff6b6b22", border: "#ff6b6b", label: "FOCUS", labelBg: "#ff6b6b" },
  medium: { bg: "#ffd16622", border: "#ffd166", label: "SOLID", labelBg: "#ffd166" },
  low: { bg: "#4ecdc422", border: "#4ecdc4", label: "LIGHT", labelBg: "#4ecdc4" },
};

export const courseColors = {
  MATH103: "#ff6b6b",
  MGMT211: "#4ecdc4",
  ECON102: "#ffd166",
  MGMT202: "#a78bfa",
};
