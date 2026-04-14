import { Clock, Sparkles } from "lucide-react";
import { priorityStyles, courseColors } from "../data/constants";
import { getCourseGuidance } from "../utils/helpers";
import { saveProgress } from "../utils/progress";
import { notifyTaskChecked, notifyTaskUnchecked } from "../utils/notifications";
import { SCHEDULE } from "../data/schedule";
import TaskItem from "./TaskItem";

const TOTAL_TASKS = SCHEDULE.reduce(
  (a, day) => a + day.blocks.reduce((b, bl) => b + bl.tasks.length, 0),
  0
);

export default function StudyBlock({ block, dayNum, blockIdx, progress, setProgress }) {
  const pStyle = priorityStyles[block.priority];
  const courseColor = courseColors[block.course] || "#888";
  const courseGuide = getCourseGuidance(block.course);

  const toggleTask = (taskIdx) => {
    try {
      const key = `${dayNum}-${blockIdx}-${taskIdx}`;
      const wasChecked = !!progress[key];
      setProgress((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        try { saveProgress(next); } catch (err) { console.warn("[ninja] saveProgress failed", err); }
        try {
          const doneNow = Object.values(next).filter(Boolean).length;
          const pct = Math.round((doneNow / TOTAL_TASKS) * 100);
          const task = block.tasks[taskIdx];
          if (wasChecked) {
            notifyTaskUnchecked(task, block.course, pct, doneNow, TOTAL_TASKS);
          } else {
            notifyTaskChecked(task, block.course, pct, doneNow, TOTAL_TASKS);
          }
        } catch (err) {
          console.warn("[ninja] task notify failed", err);
        }
        return next;
      });
    } catch (err) {
      console.warn("[ninja] toggleTask failed", err);
    }
  };

  const completedCount = block.tasks.filter(
    (_, i) => progress[`${dayNum}-${blockIdx}-${i}`]
  ).length;
  const allDone = completedCount === block.tasks.length && block.tasks.length > 0;

  return (
    <div
      className="rounded-lg p-3 mb-2"
      style={{
        background: pStyle.bg,
        borderLeft: `3px solid ${courseColor}`,
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span
          className="text-ninja-bg text-[9px] font-extrabold px-1.5 py-0.5 rounded"
          style={{ background: courseColor }}
        >
          {block.course}
        </span>
        <span className="text-[13px] font-semibold text-ninja-text">{block.focus}</span>
        <span className="text-[10px] text-ninja-text-muted ml-auto flex items-center gap-0.5">
          <Clock size={10} />
          {block.minutes}m
        </span>
      </div>

      <div className="mb-1">
        {block.tasks.map((task, i) => (
          <TaskItem
            key={i}
            task={task}
            checked={!!progress[`${dayNum}-${blockIdx}-${i}`]}
            onToggle={() => toggleTask(i)}
          />
        ))}
      </div>

      {allDone ? (
        <div className="text-[10px] text-ninja-teal font-semibold flex items-center gap-1 mt-1">
          <Sparkles size={11} /> Done!
        </div>
      ) : (
        <div className="text-[9px] text-ninja-text-muted mt-1">
          {courseGuide.sources} {courseGuide.fallback}
        </div>
      )}
    </div>
  );
}
