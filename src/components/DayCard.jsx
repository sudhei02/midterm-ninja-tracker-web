import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StudyBlock from "./StudyBlock";
import { getDynamicDaysUntil, getTodayDayNum } from "../utils/dates";

export default function DayCard({ day, progress, setProgress }) {
  const todayNum = getTodayDayNum();
  const isToday = day.dayNum === todayNum;
  const isPast = day.dayNum < todayNum;
  const dynamicDaysUntil = getDynamicDaysUntil(day.dayNum);
  const [open, setOpen] = useState(isToday);

  const totalTasks = day.blocks.reduce((a, b) => a + b.tasks.length, 0);
  const doneTasks = day.blocks.reduce(
    (a, block, bi) =>
      a + block.tasks.filter((_, ti) => progress[`${day.dayNum}-${bi}-${ti}`]).length,
    0
  );
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalMinutes = day.blocks.reduce((a, b) => a + b.minutes, 0);
  const IconComp = day.icon;

  return (
    <div
      className={`rounded-xl overflow-hidden mb-2 transition-all ${
        isToday ? "border-2 border-ninja-gold ring-1 ring-ninja-gold/20"
        : day.isExamDay ? "border border-ninja-red"
        : "border border-ninja-border"
      } ${isPast && pct < 100 ? "opacity-50" : ""}`}
      style={{
        background: day.isExamDay
          ? "linear-gradient(135deg, #e9456015, #0f0f1a)"
          : "#0f0f1a",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full px-3 py-2.5 sm:py-3 flex items-center gap-2.5 select-none text-left bg-transparent border-none"
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            day.isExamDay ? "bg-ninja-red" : isToday ? "bg-ninja-gold" : "bg-ninja-card-alt"
          }`}
        >
          <IconComp size={16} className={day.isExamDay || isToday ? "text-ninja-bg" : "text-ninja-red"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-bold text-ninja-text truncate">
              Day {day.dayNum}
            </span>
            <span className="text-[11px] text-ninja-text-dim">{day.day}</span>
            {isToday && (
              <span className="bg-ninja-gold text-ninja-bg text-[8px] font-extrabold px-1.5 py-px rounded tracking-wider">
                TODAY
              </span>
            )}
            {day.isExamDay && (
              <span className="bg-ninja-red text-white text-[8px] font-extrabold px-1.5 py-px rounded tracking-wider">
                EXAM
              </span>
            )}
          </div>
          <div className="text-[10px] text-ninja-text-dim mt-px">
            {!isToday && <span className={isPast ? "text-ninja-text-muted" : "text-ninja-red"}>{dynamicDaysUntil}</span>}
            {!isToday && " · "}
            {totalMinutes} min · {doneTasks}/{totalTasks} done
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Compact progress indicator */}
          <span className={`text-[11px] font-bold ${pct === 100 ? "text-ninja-teal" : "text-ninja-text-muted"}`}>
            {pct}%
          </span>
          {open ? <ChevronUp size={14} className="text-ninja-text-muted" /> : <ChevronDown size={14} className="text-ninja-text-muted" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-ninja-border/50 pt-2">
          {day.blocks.map((block, bi) => (
            <StudyBlock
              key={bi}
              block={block}
              dayNum={day.dayNum}
              blockIdx={bi}
              progress={progress}
              setProgress={setProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
