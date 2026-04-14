import { useState, useEffect, useRef } from "react";
import { Coffee, Flame } from "lucide-react";
import {
  notifyTimerStarted,
  notifyTimerPaused,
  notifyTimerReset,
  notifyTimerCompleted,
} from "../utils/notifications";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  // Track live values for notifications without triggering re-renders
  const secondsRef = useRef(seconds);
  const isBreakRef = useRef(isBreak);
  useEffect(() => { secondsRef.current = seconds; }, [seconds]);
  useEffect(() => { isBreakRef.current = isBreak; }, [isBreak]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          try {
            const finishedMode = isBreakRef.current ? "break" : "focus";
            const minutes = finishedMode === "focus" ? 25 : 5;
            notifyTimerCompleted(finishedMode, minutes);
          } catch (err) {
            console.warn("[ninja] notifyTimerCompleted failed", err);
          }
          setIsBreak((b) => !b);
          return isBreakRef.current ? FOCUS_SECONDS : BREAK_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleStartPause = () => {
    try {
      const mode = isBreak ? "break" : "focus";
      if (running) {
        notifyTimerPaused(mode, secondsRef.current);
      } else {
        notifyTimerStarted(mode);
      }
    } catch (err) {
      console.warn("[ninja] handleStartPause notify failed", err);
    }
    setRunning(!running);
  };

  const handleReset = () => {
    try {
      const mode = isBreak ? "break" : "focus";
      notifyTimerReset(mode);
    } catch (err) {
      console.warn("[ninja] handleReset notify failed", err);
    }
    setRunning(false);
    setSeconds(isBreak ? BREAK_SECONDS : FOCUS_SECONDS);
  };

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
          onClick={handleStartPause}
          className={`border border-ninja-red rounded-lg px-3 sm:px-4 py-1.5 cursor-pointer font-semibold text-[12px] sm:text-[13px] font-[inherit] ${
            running
              ? "bg-ninja-red/20 text-ninja-red"
              : "bg-ninja-red text-ninja-bg"
          }`}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="bg-transparent text-ninja-text-muted border border-[#333] rounded-lg px-2.5 sm:px-3 py-1.5 cursor-pointer text-[12px] sm:text-[13px] font-[inherit]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
