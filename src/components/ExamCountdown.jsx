import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { getNextExam, getCountdown } from "../utils/dates";

export default function ExamCountdown() {
  const [countdown, setCountdown] = useState(null);
  const [nextExam, setNextExam] = useState(null);

  useEffect(() => {
    const update = () => {
      const exam = getNextExam();
      setNextExam(exam);
      if (exam) setCountdown(getCountdown(exam.date));
      else setCountdown(null);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!nextExam || !countdown) {
    return (
      <div className="bg-ninja-teal/10 border border-ninja-teal/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 text-center">
        <div className="text-ninja-teal font-bold text-sm sm:text-base">All exams complete!</div>
        <div className="text-ninja-text-dim text-[11px] sm:text-xs mt-1">You survived, ninja.</div>
      </div>
    );
  }

  return (
    <div className="bg-ninja-red/10 border border-ninja-red/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
      <div className="flex items-center gap-1.5 justify-center mb-2">
        <Target size={14} className="text-ninja-red" />
        <span className="text-[11px] sm:text-xs font-bold text-ninja-red tracking-wide">
          NEXT EXAM: {nextExam.label}
        </span>
      </div>
      <div className="flex justify-center gap-2 sm:gap-3">
        {[
          { value: countdown.days, label: "DAYS" },
          { value: countdown.hours, label: "HRS" },
          { value: countdown.minutes, label: "MIN" },
          { value: countdown.seconds, label: "SEC" },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-mono text-lg sm:text-2xl font-bold text-ninja-text">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-[8px] sm:text-[9px] text-ninja-text-muted tracking-widest">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
