import { useState, useEffect } from "react";
import {
  Swords,
  Shield,
  Target,
  Flame,
  BookOpen,
  Scroll,
  Zap,
  Trophy,
  Heart,
  Brain,
  Clock,
  Coffee,
  Moon,
  Sun,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import { MOTIVATIONAL_QUOTES } from "./data/constants";
import { SCHEDULE } from "./data/schedule";
import { EXAM_INFO } from "./data/exams";
import { loadProgress, saveProgress } from "./utils/progress";
import { requestNotifPermission, sendProgressNotif, notifyLogin, notifyAllProgressReset } from "./utils/notifications";
import PasswordGate from "./components/PasswordGate";
import { isAuthenticated } from "./utils/auth";
import { startNinjaTitle, stopNinjaTitle } from "./utils/pageTitle";
import OverallProgress from "./components/OverallProgress";
import ExamCountdown from "./components/ExamCountdown";
import DayCard from "./components/DayCard";
import PomodoroTimer from "./components/PomodoroTimer";

const PHASES = [
  { label: "PHASE 1: MATH103 CONQUEST (Days 1-9)", color: "text-ninja-red", icon: Swords, filter: (d) => d.dayNum <= 9 },
  { label: "PHASE 2: MGMT211 SWIFT STRIKE (Days 10-12)", color: "text-ninja-teal", icon: Shield, filter: (d) => d.dayNum >= 10 && d.dayNum <= 12 },
  { label: "PHASE 3: DOUBLE DRAGON FINALE (Days 13-16)", color: "text-ninja-gold", icon: Flame, filter: (d) => d.dayNum >= 13 },
];

const TABS = [
  { id: "schedule", label: "Battle Plan", icon: Scroll },
  { id: "exams", label: "Exam Intel", icon: Target },
  { id: "tools", label: "Ninja Tools", icon: Zap },
];

const SURVIVAL_RULES = [
  { icon: Clock, color: "text-ninja-red", text: "Use the Pomodoro timer above. 25 min focus, 5 min break. After 4 rounds, take a 15-20 min break." },
  { icon: Target, color: "text-ninja-red-light", text: "Do the hardest block FIRST each day while your brain still has juice. Math first, always." },
  { icon: Coffee, color: "text-ninja-gold", text: "During breaks: stand up, stretch, get water. Don't open social media - your brain won't come back." },
  { icon: Moon, color: "text-ninja-teal", text: "Stop studying by 10-11 PM. Sleep is when your brain actually saves what you learned. Don't skip it." },
  { icon: Sparkles, color: "text-ninja-purple", text: "Reward yourself after each completed day. Snack, game, whatever. You earned it." },
  { icon: Sun, color: "text-ninja-gold", text: "If you miss a day or fall behind, don't spiral. Just pick up from where you are. Progress beats perfection." },
  { icon: Flame, color: "text-ninja-red", text: "If a topic feels impossible, switch to an easier block for 15 min to build momentum, then come back." },
  { icon: Heart, color: "text-ninja-red-light", text: "You're not dumb for retaking Math. You're smart for showing up again. That takes real guts." },
];

export default function NinjaPlanner() {
  const [authed, setAuthed] = useState(isAuthenticated);

  useEffect(() => {
    if (authed) startNinjaTitle();
    else stopNinjaTitle();
    return () => stopNinjaTitle();
  }, [authed]);

  if (!authed) return (
    <PasswordGate
      onSuccess={() => {
        try { notifyLogin(); } catch (err) { console.warn("[ninja] notifyLogin failed", err); }
        setAuthed(true);
      }}
    />
  );

  return <NinjaPlannerInner />;
}

function NinjaPlannerInner() {
  const [progress, setProgress] = useState(loadProgress);
  const [tab, setTab] = useState("schedule");

  const totalTasks = SCHEDULE.reduce(
    (a, day) => a + day.blocks.reduce((b, bl) => b + bl.tasks.length, 0),
    0
  );
  const doneTasks = Object.values(progress).filter(Boolean).length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const motivationalQuote = MOTIVATIONAL_QUOTES[pct % MOTIVATIONAL_QUOTES.length];

  useEffect(() => {
    requestNotifPermission();
  }, []);

  useEffect(() => {
    try {
      if (totalTasks > 0) sendProgressNotif(doneTasks, totalTasks);
    } catch (err) {
      console.warn("[ninja] progress notif effect failed", err);
    }
  }, [doneTasks, totalTasks]);

  return (
    <div className="font-[Segoe_UI,-apple-system,BlinkMacSystemFont,sans-serif] ninja-bg min-h-screen text-ninja-text pb-6 sm:pb-10">
      {/* Header */}
      <div
        className="border-b border-ninja-red/20 px-4 sm:px-5 pt-5 sm:pt-7 pb-4 sm:pb-5 text-center"
        style={{ background: "linear-gradient(180deg, #1a0a14 0%, #0a0a14 100%)" }}
      >
        <img
          src="./ninja-mascot.png"
          alt="Ninja mascot"
          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-2xl"
        />
        <div className="text-[10px] sm:text-[11px] tracking-[3px] sm:tracking-[4px] text-ninja-red font-bold mb-1 sm:mb-1.5">
          MIDTERM BATTLE PLAN
        </div>
        <div className="text-xl sm:text-[26px] font-extrabold text-white leading-tight mb-1">
          Muso the Destroyer
        </div>
        <div className="text-xs sm:text-[13px] text-ninja-text-dim italic max-w-[500px] mx-auto leading-relaxed px-2">
          April 5 - 20, 2026 &middot; 4 Exams &middot; 16 Days &middot; One Ninja
        </div>

        <div className="bg-ninja-red/[0.07] border border-ninja-red/20 rounded-xl px-3 sm:px-[18px] py-3 sm:py-3.5 mt-3 sm:mt-4 max-w-[520px] mx-auto text-left">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Heart size={14} className="text-ninja-red shrink-0" />
            <span className="text-xs font-bold text-ninja-red">Real talk, Muso</span>
          </div>
          <p className="text-[11px] sm:text-xs text-ninja-text-body leading-relaxed m-0">
            Look. Four exams in eight days sounds heavy, but it is still manageable when you break
            it into small pieces. Math gets the biggest share because it needs repetition. The other
            classes are mostly reading, definitions, and practice. Two exams in one day is rough,
            but it is not impossible when you prepare early and rest properly. Just keep moving one
            task at a time.
          </p>
        </div>

        <div className="bg-[#16213e] border border-ninja-teal/20 rounded-xl px-3 sm:px-3.5 py-2.5 sm:py-3 mt-2.5 sm:mt-3 max-w-[520px] mx-auto text-left">
          <div className="text-[10px] sm:text-[11px] font-bold text-ninja-teal">REALISTIC PUSH</div>
          <div className="text-[11px] sm:text-xs text-[#ddd] leading-relaxed mt-1 sm:mt-1.5">
            {motivationalQuote} If something is unclear, ask sister.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-ninja-border px-3 sm:px-5 bg-ninja-card sticky top-0 z-10 overflow-x-auto">
        {TABS.map(({ id, label, icon }) => {
          const Icon = icon;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`bg-transparent border-none px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 font-[inherit] transition-all whitespace-nowrap ${
                tab === id
                  ? "text-ninja-red border-b-2 border-b-ninja-red"
                  : "text-ninja-text-muted border-b-2 border-b-transparent"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="px-3 sm:px-4 pt-3 sm:pt-4 max-w-[640px] mx-auto">
        {tab === "schedule" && <ScheduleTab progress={progress} setProgress={setProgress} />}
        {tab === "exams" && <ExamsTab />}
        {tab === "tools" && <ToolsTab setProgress={setProgress} />}
      </div>
    </div>
  );
}

function ScheduleTab({ progress, setProgress }) {
  return (
    <>
      <ExamCountdown />
      <OverallProgress progress={progress} />

      {PHASES.map((phase, idx) => (
        <div key={phase.label}>
          <div
            className={`text-[10px] sm:text-[11px] font-bold tracking-widest mb-2 flex items-center gap-1.5 ${phase.color} ${idx > 0 ? "mt-4 sm:mt-5" : ""}`}
          >
            <phase.icon size={12} />
            {phase.label}
          </div>
          {SCHEDULE.filter(phase.filter).map((day) => (
            <DayCard key={day.dayNum} day={day} progress={progress} setProgress={setProgress} />
          ))}
        </div>
      ))}

      <div className="text-center px-4 sm:px-5 py-6 sm:py-[30px] border-t border-ninja-border mt-4 sm:mt-5">
        <Trophy size={28} className="text-ninja-gold" />
        <div className="text-sm sm:text-base font-bold text-ninja-gold mt-2">
          You made it through, Muso.
        </div>
        <div className="text-[11px] sm:text-xs text-ninja-text-dim mt-1 italic">
          Every ninja earns their title one battle at a time.
        </div>
      </div>
    </>
  );
}

function ExamsTab() {
  return (
    <div>
      <div className="text-xs text-ninja-text-dim mb-3 sm:mb-4 leading-relaxed">
        Intel on each exam. Know your enemy, Muso.
      </div>
      {EXAM_INFO.map((exam) => {
        const IconComp = exam.icon;
        return (
          <div
            key={exam.code}
            className="rounded-xl sm:rounded-[14px] p-3 sm:p-[18px] mb-3 sm:mb-3.5"
            style={{
              background: exam.bgColor,
              border: `1px solid ${exam.color}33`,
            }}
          >
            <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 sm:gap-2.5 mb-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: exam.color }}
              >
                <IconComp size={16} className="text-ninja-card" />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-[15px] font-bold text-ninja-text">{exam.code}</div>
                <div className="text-[11px] text-ninja-text-dim">{exam.name}</div>
              </div>
              <div className="sm:ml-auto text-left sm:text-right w-full sm:w-auto mt-1 sm:mt-0">
                <div className="text-xs sm:text-[13px] font-bold" style={{ color: exam.color }}>
                  {exam.date}
                </div>
                <div className="text-[11px] text-ninja-text-dim">
                  at {exam.time} | Weight: {exam.weight}
                </div>
              </div>
            </div>
            <div className="mb-2.5">
              <div className="text-[11px] text-ninja-text-muted font-semibold mb-1 tracking-wide">
                CHAPTERS TO COVER:
              </div>
              {exam.chapters.map((ch, i) => (
                <div key={i} className="text-[11px] sm:text-xs text-ninja-text-body py-0.5 flex items-center gap-1.5">
                  <BookOpen size={10} className="shrink-0" style={{ color: exam.color }} />
                  {ch}
                </div>
              ))}
            </div>
            {exam.code === "MGMT202" && (
              <div className="bg-ninja-purple/[0.08] rounded-lg px-2.5 sm:px-3 py-2 mb-2">
                <div className="text-[11px] text-ninja-purple font-semibold mb-1">EXAM FORMAT:</div>
                <div className="text-[11px] sm:text-xs text-ninja-text-body">
                  27 MCQs + 4 Definitions (pick 4 out of 5) + 3 Essays (pick 3 out of 5)
                </div>
              </div>
            )}
            <div
              className="text-[11px] text-ninja-text-dim italic pt-2"
              style={{ borderTop: `1px solid ${exam.color}22` }}
            >
              {exam.note}
            </div>
          </div>
        );
      })}

      <div className="bg-ninja-gold/[0.07] border border-ninja-gold/20 rounded-xl p-3 sm:p-4 mt-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertTriangle size={14} className="text-ninja-gold shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold text-ninja-gold">The Double Exam Day (April 20)</span>
        </div>
        <p className="text-[11px] sm:text-xs text-ninja-text-body leading-relaxed m-0">
          ECON at 8:30, OB at 14:30. That's a 6-hour gap. Eat lunch between them. Don't review
          ECON after you take it - what's done is done. Use that gap for a light OB definition
          review and rest. You've been prepping OB alongside everything else so it won't feel new.
        </p>
      </div>
    </div>
  );
}

function ToolsTab({ setProgress }) {
  return (
    <div>
      <div className="text-xs text-ninja-text-dim mb-3 sm:mb-4 leading-relaxed">
        Weapons in your ninja toolkit. Use them wisely.
      </div>

      <PomodoroTimer />

      <div className="mt-4 sm:mt-5 bg-ninja-card-alt rounded-xl sm:rounded-[14px] p-3 sm:p-[18px] border border-ninja-border">
        <div className="flex items-center gap-2 mb-3">
          <Brain size={16} className="text-ninja-purple shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-ninja-text">ADHD Ninja Survival Rules</span>
        </div>
        {SURVIVAL_RULES.map((rule, i) => {
          const RuleIcon = rule.icon;
          return (
            <div
              key={i}
              className={`flex items-start gap-2 sm:gap-2.5 py-2 ${i > 0 ? "border-t border-white/[0.03]" : ""}`}
            >
              <RuleIcon size={14} className={`${rule.color} mt-0.5 shrink-0`} />
              <span className="text-[11px] sm:text-xs text-ninja-text-body leading-relaxed">{rule.text}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 bg-[#10131f] rounded-xl sm:rounded-[14px] p-3 sm:p-[18px] border border-ninja-border">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-ninja-red-light shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-ninja-text">Need help?</span>
        </div>
        <div className="text-[11px] sm:text-xs text-ninja-text-body leading-relaxed">
          <p className="mb-2">
            If Muso is stuck, tap{" "}
            <strong className="text-ninja-gold">Ask sister!</strong> and send a short note.
          </p>
          <p className="mb-3">
            Example: Day 2, Ch2 system of linear equations, need help with 3 equations and 2 unknowns.
          </p>
          <div className="grid gap-2">
            {MOTIVATIONAL_QUOTES.slice(0, 3).map((quote, index) => (
              <div
                key={index}
                className="bg-ninja-card border border-ninja-border rounded-lg sm:rounded-[10px] px-2.5 sm:px-3 py-2 sm:py-2.5 text-[#ddd]"
              >
                <div className="text-[10px] sm:text-[11px] text-ninja-text-subtle mb-1">Quote {index + 1}</div>
                <div className="text-[11px] sm:text-xs leading-relaxed">{quote}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 bg-ninja-card-alt rounded-xl sm:rounded-[14px] p-3 sm:p-[18px] border border-ninja-border">
        <div className="flex items-center gap-2 mb-2.5">
          <Scroll size={16} className="text-ninja-red shrink-0" />
          <span className="text-[13px] sm:text-sm font-bold text-ninja-text">The Strategy Behind the Plan</span>
        </div>
        <div className="text-[11px] sm:text-xs text-ninja-text-body leading-relaxed">
          <p className="mb-2">
            <strong className="text-ninja-red-light">Days 1-9:</strong> Math gets the lion's share
            because it's math, it's 35% of your grade, and you're retaking it. Every day starts
            with math. Other courses get sprinkled in as "light reads" so they don't pile up later.
          </p>
          <p className="mb-2">
            <strong className="text-ninja-teal">Days 10-12:</strong> MGMT211 is 3 conceptual
            chapters. You've been reading them lightly during Phase 1, so this is mostly review and
            solidification.
          </p>
          <p className="m-0">
            <strong className="text-ninja-gold">Days 13-16:</strong> ECON and OB run in parallel.
            ECON needs calculation practice. OB needs definition memorization and essay prep. They
            use different parts of your brain, so alternating works well.
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          try {
            if (window.confirm("Reset ALL progress? This can't be undone, Muso.")) {
              setProgress({});
              try { saveProgress({}); } catch (err) { console.warn("[ninja] saveProgress reset failed", err); }
              try { notifyAllProgressReset(); } catch (err) { console.warn("[ninja] notifyAllProgressReset failed", err); }
            }
          } catch (err) {
            console.warn("[ninja] reset handler failed", err);
          }
        }}
        className="mt-4 sm:mt-5 w-full bg-transparent border border-[#333] rounded-lg sm:rounded-[10px] py-2.5 text-[#555] cursor-pointer text-[11px] sm:text-xs font-[inherit]"
      >
        Reset all progress
      </button>
    </div>
  );
}
