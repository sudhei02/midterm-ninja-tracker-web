import { CheckCircle2, Circle } from "lucide-react";

export default function TaskItem({ task, checked, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-start gap-2 py-1.5 cursor-pointer transition-opacity ${
        checked ? "opacity-40" : "opacity-100"
      }`}
    >
      {checked ? (
        <CheckCircle2 size={15} className="text-ninja-teal mt-0.5 shrink-0" />
      ) : (
        <Circle size={15} className="text-ninja-text-muted mt-0.5 shrink-0" />
      )}
      <span
        className={`text-[12px] sm:text-[13px] leading-relaxed ${
          checked ? "text-ninja-text-muted line-through" : "text-ninja-text-body"
        }`}
      >
        {task}
      </span>
    </div>
  );
}
