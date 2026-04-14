// All exam dates in 2026
const EXAM_DATES = [
  { code: "MATH103", date: new Date(2026, 3, 13, 10, 30), label: "MATH103 Exam" },
  { code: "MGMT211", date: new Date(2026, 3, 16, 14, 30), label: "MGMT211 Exam" },
  { code: "ECON102", date: new Date(2026, 3, 20, 8, 30), label: "ECON102 Exam" },
  { code: "MGMT202", date: new Date(2026, 3, 20, 14, 30), label: "MGMT202 Exam" },
];

// Schedule starts April 5, each dayNum maps to a date
const SCHEDULE_START = new Date(2026, 3, 5); // April 5, 2026

export function getTodayDayNum() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(SCHEDULE_START);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diff + 1; // dayNum is 1-based
}

export function getNextExam() {
  const now = new Date();
  for (const exam of EXAM_DATES) {
    if (exam.date > now) return exam;
  }
  return null; // all exams are over
}

export function getCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: diff };
}

export function getDynamicDaysUntil(dayNum) {
  const todayNum = getTodayDayNum();

  if (todayNum > 16) return "EXAMS COMPLETE";

  // Find what this day's exam context is
  const nextExam = getNextExam();
  if (!nextExam) return "ALL DONE";

  if (dayNum < todayNum) return "COMPLETED";
  if (dayNum === todayNum) return "TODAY";

  const daysAway = dayNum - todayNum;
  return `in ${daysAway} day${daysAway !== 1 ? "s" : ""}`;
}

export function isExamOver(examCode) {
  const now = new Date();
  const exam = EXAM_DATES.find((e) => e.code === examCode);
  if (!exam) return false;
  // Exam is over 2 hours after start time
  const endTime = new Date(exam.date.getTime() + 2 * 60 * 60 * 1000);
  return now > endTime;
}

export { EXAM_DATES };
