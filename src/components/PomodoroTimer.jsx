import { useState, useEffect } from "react";
import { Coffee, Flame } from "lucide-react";

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          setIsBreak((b) => !b);
          return isBreak ? 25 * 60 : 5 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, isBreak]);

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return (
    <div
      className={`rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 flex-wrap justify-center border ${
        isBreak
          ? "bg-ninja-teal/15 border-ninja-teal"
          : "bg-ninja-card-alt border-ninja-red"
      }`}
    >
      <div className="flex items-center gap-2">
        {isBreak ? (
          <Coffee size={18} className="text-ninja-teal" />
        ) : (
          <Flame size={18} className="text-ninja-red" />
        )}
        <span
          className={`font-mono text-2xl sm:text-[28px] font-bold tracking-wider ${
            isBreak ? "text-ninja-teal" : "text-ninja-red"
          }`}
        >
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[11px] sm:text-xs text-ninja-text-dim italic">
        {isBreak ? "rest, young ninja" : "focus mode"}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setRunning(!running)}
          className={`border border-ninja-red rounded-lg px-3 sm:px-4 py-1.5 cursor-pointer font-semibold text-[12px] sm:text-[13px] font-[inherit] ${
            running
              ? "bg-ninja-red/20 text-ninja-red"
              : "bg-ninja-red text-ninja-bg"
          }`}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(isBreak ? 5 * 60 : 25 * 60);
          }}
          className="bg-transparent text-ninja-text-muted border border-[#333] rounded-lg px-2.5 sm:px-3 py-1.5 cursor-pointer text-[12px] sm:text-[13px] font-[inherit]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
