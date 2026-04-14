import { Swords, Star } from "lucide-react";
import { SCHEDULE } from "../data/schedule";

export default function OverallProgress({ progress }) {
  const totalTasks = SCHEDULE.reduce(
    (a, day) => a + day.blocks.reduce((b, bl) => b + bl.tasks.length, 0),
    0
  );
  const doneTasks = Object.values(progress).filter(Boolean).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const rank =
    pct === 100
      ? "LEGENDARY NINJA"
      : pct >= 75
      ? "Shadow Master"
      : pct >= 50
      ? "Blade Runner"
      : pct >= 25
      ? "Apprentice"
      : "Genin";

  return (
    <div
      className="rounded-xl sm:rounded-[14px] p-4 sm:p-5 mb-4 sm:mb-5 border border-ninja-red/20"
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}
    >
      <div className="flex items-center justify-between mb-2.5 sm:mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-ninja-red sm:hidden" />
          <Swords size={18} className="text-ninja-red hidden sm:block" />
          <span className="text-[13px] sm:text-sm font-bold text-ninja-text">Mission Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={13} className="text-ninja-gold sm:hidden" />
          <Star size={14} className="text-ninja-gold hidden sm:block" />
          <span className="text-[11px] sm:text-xs text-ninja-gold font-semibold">Rank: {rank}</span>
        </div>
      </div>
      <div className="bg-ninja-card rounded-lg h-2.5 sm:h-3 overflow-hidden mb-2">
        <div
          className="h-full rounded-lg transition-[width] duration-400 ease-out"
          style={{
            width: `${pct}%`,
            background:
              pct === 100
                ? "linear-gradient(90deg, #4ecdc4, #44a08d)"
                : "linear-gradient(90deg, #e94560, #ff6b6b)",
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] sm:text-[11px] text-ninja-text-dim">
        <span>
          {doneTasks}/{totalTasks} tasks
        </span>
        <span>{pct}% complete</span>
      </div>
    </div>
  );
}
