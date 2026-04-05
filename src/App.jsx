import { useState, useEffect } from "react";
import {
  Swords,
  Shield,
  Target,
  Flame,
  Star,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Zap,
  Trophy,
  Heart,
  Scroll,
  Brain,
  Coffee,
  Moon,
  Sun,
  Sparkles,
  AlertTriangle,
  Calculator,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

const STORAGE_KEY = "muso-ninja-planner-v2";

const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveProgress = (p) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // Ignore storage write errors (private mode or storage limits).
  }
};

const EXAM_INFO = [
  {
    code: "MATH103",
    name: "Math for Business & Econ I",
    date: "April 13 (Mon)",
    time: "10:30",
    weight: "35%",
    icon: Calculator,
    color: "#ff6b6b",
    bgColor: "#ff6b6b15",
    chapters: [
      "Ch1: Equations & Inequalities",
      "Ch2: Systems of Linear Equations",
      "Ch3: Linear Functions & Applications",
    ],
    note: "THE BOSS FIGHT. You failed this before. This time, you conquer it.",
  },
  {
    code: "MGMT211",
    name: "Business Communication",
    date: "April 16 (Thu)",
    time: "14:30",
    weight: "35%",
    icon: MessageSquare,
    color: "#4ecdc4",
    bgColor: "#4ecdc415",
    chapters: [
      "Ch1: Communication Framework",
      "Ch2: Interpersonal Communication",
      "Ch3: Group Communication",
    ],
    note: "Conceptual stuff. Read, understand, apply. No memorization nightmare.",
  },
  {
    code: "ECON102",
    name: "Intro to Economics II",
    date: "April 20 (Mon)",
    time: "08:30",
    weight: "30%",
    icon: TrendingUp,
    color: "#ffd166",
    bgColor: "#ffd16615",
    chapters: [
      "Ch16: Nature of Macroeconomics",
      "Ch17-18: GDP, Unemployment, Price Level",
      "Ch19: Growth & Productivity",
      "Ch20: Wages & Labor Market",
      "Ch21: Saving & Investment",
    ],
    note: "Morning exam. Sleep well the night before. 6 chapters, spread them out.",
  },
  {
    code: "MGMT202",
    name: "Organizational Behavior",
    date: "April 20 (Mon)",
    time: "14:30",
    weight: "varies",
    icon: Users,
    color: "#a78bfa",
    bgColor: "#a78bfa15",
    chapters: [
      "Ch1: Intro to OB",
      "Ch6: Diversity",
      "Ch4: Personality",
      "Ch2: Job Attitudes",
      "Ch5: Perception (no Decision Making)",
    ],
    note: "27 MCQs + 4 Definitions (pick 4/5) + 3 Essays (pick 3/5). Same day as ECON. You got this.",
  },
];

const SCHEDULE = [
  {
    day: "April 5 (Sun)",
    dayNum: 1,
    daysUntil: "8 days to MATH103",
    vibe: "The Journey Begins",
    icon: Scroll,
    blocks: [
      {
        course: "MATH103",
        focus: "Ch1: Linear & Quadratic Equations",
        tasks: [
          "Review how to solve linear equations step-by-step",
          "Practice factoring quadratic equations",
          "Do 10 practice problems from each type",
          "Write down formulas on a cheat sheet",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "MATH103",
        focus: "Ch1: Inequalities",
        tasks: [
          "Linear inequalities & sign changes",
          "Quadratic inequalities & sign table method",
          "5 practice problems",
        ],
        minutes: 60,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "Ch1: Intro to OB (light read)",
        tasks: [
          "Skim chapter, highlight key definitions",
          "Note down: what is OB, why it matters, basic models",
        ],
        minutes: 30,
        priority: "low",
      },
    ],
  },
  {
    day: "April 6 (Mon)",
    dayNum: 2,
    daysUntil: "7 days to MATH103",
    vibe: "Sharpening the Blade",
    icon: Swords,
    blocks: [
      {
        course: "MATH103",
        focus: "Ch2: Systems of Linear Equations",
        tasks: [
          "2x2 systems (substitution & elimination)",
          "3x3 systems (Gaussian elimination)",
          "3 equations, 2 unknowns: identify no-solution cases",
          "8-10 practice problems",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "MATH103",
        focus: "Ch2: More practice + weak spots",
        tasks: [
          "Redo any problems you got wrong",
          "Try a mixed problem set",
        ],
        minutes: 45,
        priority: "high",
      },
      {
        course: "MGMT211",
        focus: "Ch1: Business Communication Framework",
        tasks: [
          "Read chapter or lecture slides",
          "Note: communication process, barriers, org comm",
        ],
        minutes: 30,
        priority: "low",
      },
    ],
  },
  {
    day: "April 7 (Tue)",
    dayNum: 3,
    daysUntil: "6 days to MATH103",
    vibe: "Training Grounds",
    icon: Target,
    blocks: [
      {
        course: "MATH103",
        focus: "Ch3: Linear Functions & Lines",
        tasks: [
          "Domain, range, types of functions",
          "Graphing linear functions",
          "Slope, intercepts, properties of lines",
          "6-8 graphing practice problems",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "ECON102",
        focus: "Ch16: Nature of Macroeconomics",
        tasks: [
          "Read chapter or slides",
          "Key terms: GDP, macro vs micro, circular flow",
        ],
        minutes: 40,
        priority: "medium",
      },
      {
        course: "MGMT202",
        focus: "Ch6: Diversity",
        tasks: [
          "Skim chapter, focus on definitions",
          "Types of diversity, discrimination, biographical characteristics",
        ],
        minutes: 30,
        priority: "low",
      },
    ],
  },
  {
    day: "April 8 (Wed)",
    dayNum: 4,
    daysUntil: "5 days to MATH103",
    vibe: "The Art of Precision",
    icon: Shield,
    blocks: [
      {
        course: "MATH103",
        focus: "Ch3: Applications (supply/demand, break-even, equilibrium)",
        tasks: [
          "Revenue, cost, profit functions",
          "Break-even point problems",
          "Supply & demand equilibrium",
          "8 application word problems",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "MATH103",
        focus: "Full Ch1-3 mixed review",
        tasks: [
          "Do a mixed problem set covering all 3 chapters",
          "Time yourself: simulate exam pressure",
        ],
        minutes: 45,
        priority: "high",
      },
      {
        course: "ECON102",
        focus: "Ch17-18: GDP, Unemployment, Price Level",
        tasks: [
          "Read through slides/textbook",
          "Key formulas: GDP calculation, CPI, unemployment rate",
        ],
        minutes: 40,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 9 (Thu)",
    dayNum: 5,
    daysUntil: "4 days to MATH103",
    vibe: "Shadow Clone Training",
    icon: Zap,
    blocks: [
      {
        course: "MATH103",
        focus: "Weak spots deep-dive",
        tasks: [
          "Go back to any problem types you struggled with",
          "Redo those problems until they feel automatic",
          "Write down your personal mistake patterns",
        ],
        minutes: 75,
        priority: "high",
      },
      {
        course: "MGMT211",
        focus: "Ch2: Interpersonal Communication",
        tasks: [
          "Communication styles, nonverbal cues",
          "Listening skills & barriers",
          "Make flashcard-style notes",
        ],
        minutes: 40,
        priority: "medium",
      },
      {
        course: "ECON102",
        focus: "Ch19: Growth, Productivity, Living Standards",
        tasks: [
          "Read through, focus on key concepts",
          "Note: determinants of productivity, growth models",
        ],
        minutes: 35,
        priority: "low",
      },
    ],
  },
  {
    day: "April 10 (Fri)",
    dayNum: 6,
    daysUntil: "3 days to MATH103",
    vibe: "Forging the Weapon",
    icon: Flame,
    blocks: [
      {
        course: "MATH103",
        focus: "Full mock exam simulation",
        tasks: [
          "Find or create a full practice exam",
          "Do it timed, no notes",
          "Grade yourself honestly",
          "Note every mistake for tomorrow's review",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "Ch4: Personality",
        tasks: [
          "Big Five model, MBTI, self-monitoring",
          "Core self-evaluations, proactive personality",
          "Focus on definitions for exam",
        ],
        minutes: 40,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 11 (Sat)",
    dayNum: 7,
    daysUntil: "2 days to MATH103",
    vibe: "The Final Meditation",
    icon: Moon,
    blocks: [
      {
        course: "MATH103",
        focus: "Review mock exam mistakes + formula sheet",
        tasks: [
          "Fix every mistake from yesterday's mock",
          "Rewrite your cheat sheet from memory",
          "Do 5 'hardest type' problems",
        ],
        minutes: 75,
        priority: "high",
      },
      {
        course: "MATH103",
        focus: "Light review, confidence building",
        tasks: [
          "Do 5-10 easier problems to build confidence",
          "Read through your notes one more time",
        ],
        minutes: 30,
        priority: "medium",
      },
      {
        course: "MGMT211",
        focus: "Ch3: Group Communication",
        tasks: [
          "Teams, group dynamics, conflict resolution",
          "Decision making in groups, meetings",
        ],
        minutes: 35,
        priority: "low",
      },
    ],
  },
  {
    day: "April 12 (Sun)",
    dayNum: 8,
    daysUntil: "MATH103 TOMORROW",
    vibe: "Night Before the Battle",
    icon: Star,
    blocks: [
      {
        course: "MATH103",
        focus: "Final light review only",
        tasks: [
          "Glance through your formula/cheat sheet",
          "Do 3-5 easy confidence problems",
          "DO NOT cram new stuff. Trust your prep.",
          "Sleep early. Rest is a weapon.",
        ],
        minutes: 45,
        priority: "high",
      },
    ],
  },
  {
    day: "April 13 (Mon)",
    dayNum: 9,
    daysUntil: "MATH103 TODAY at 10:30",
    vibe: "BOSS FIGHT: MATH103",
    icon: Trophy,
    isExamDay: true,
    examCourse: "MATH103",
    blocks: [
      {
        course: "MATH103",
        focus: "EXAM at 10:30",
        tasks: [
          "Wake up early, eat breakfast",
          "Quick 15-min glance at formula sheet",
          "GO DESTROY THAT EXAM",
        ],
        minutes: 15,
        priority: "high",
      },
      {
        course: "MGMT211",
        focus: "Post-exam: full Ch1-3 review begins",
        tasks: [
          "After the exam, take a break, then review all 3 chapters",
          "Focus on understanding, not memorizing",
        ],
        minutes: 60,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 14 (Tue)",
    dayNum: 10,
    daysUntil: "2 days to MGMT211",
    vibe: "New Mission Unlocked",
    icon: BookOpen,
    blocks: [
      {
        course: "MGMT211",
        focus: "Deep review: Ch1 + Ch2",
        tasks: [
          "Re-read slides/notes for both chapters",
          "Practice defining key terms in your own words",
          "Think of real-life examples for each concept",
        ],
        minutes: 75,
        priority: "high",
      },
      {
        course: "ECON102",
        focus: "Ch20: Unemployment, Wages, Labor Market",
        tasks: [
          "Read chapter, note key models",
          "Supply/demand of labor, wage determination",
        ],
        minutes: 40,
        priority: "medium",
      },
      {
        course: "MGMT202",
        focus: "Ch2: Job Attitudes + Ch5: Perception",
        tasks: [
          "Job satisfaction, org commitment, engagement",
          "Perception process, attribution theory, shortcuts",
          "Remember: Decision Making is NOT included",
        ],
        minutes: 45,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 15 (Wed)",
    dayNum: 11,
    daysUntil: "MGMT211 TOMORROW",
    vibe: "Silent Strike Prep",
    icon: Shield,
    blocks: [
      {
        course: "MGMT211",
        focus: "Full Ch1-3 final review",
        tasks: [
          "Go through all notes one final time",
          "Quiz yourself on key terms",
          "Review any class-specific materials",
          "Sleep well tonight",
        ],
        minutes: 60,
        priority: "high",
      },
      {
        course: "ECON102",
        focus: "Ch21: Saving & Investment",
        tasks: [
          "National saving, private/public saving",
          "Investment, capital markets, interest rates",
        ],
        minutes: 40,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 16 (Thu)",
    dayNum: 12,
    daysUntil: "MGMT211 TODAY at 14:30",
    vibe: "BOSS FIGHT: MGMT211",
    icon: Trophy,
    isExamDay: true,
    examCourse: "MGMT211",
    blocks: [
      {
        course: "MGMT211",
        focus: "EXAM at 14:30",
        tasks: [
          "Morning: light review of notes",
          "GO CRUSH IT",
        ],
        minutes: 30,
        priority: "high",
      },
      {
        course: "ECON102",
        focus: "Evening: Ch16-18 review",
        tasks: [
          "After the exam, rest, then revisit macro basics",
          "GDP, unemployment calculations, CPI",
        ],
        minutes: 45,
        priority: "medium",
      },
    ],
  },
  {
    day: "April 17 (Fri)",
    dayNum: 13,
    daysUntil: "3 days to DOUBLE EXAM",
    vibe: "Dual Blade Training",
    icon: Swords,
    blocks: [
      {
        course: "ECON102",
        focus: "Deep review: Ch16-19",
        tasks: [
          "Full review of first 4 chapters",
          "Practice calculation problems (GDP, CPI, rates)",
          "Make a summary sheet per chapter",
        ],
        minutes: 90,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "Review all 5 chapters",
        tasks: [
          "Ch1 (OB), Ch6 (Diversity), Ch4 (Personality)",
          "Ch2 (Job Attitudes), Ch5 (Perception only)",
          "Write definitions for all key terms",
          "Practice essay outlines for possible topics",
        ],
        minutes: 75,
        priority: "high",
      },
    ],
  },
  {
    day: "April 18 (Sat)",
    dayNum: 14,
    daysUntil: "2 days to DOUBLE EXAM",
    vibe: "Twin Dragon Mode",
    icon: Flame,
    blocks: [
      {
        course: "ECON102",
        focus: "Ch20-21 deep dive + full review",
        tasks: [
          "Labor market models, saving/investment formulas",
          "Do practice questions from all chapters",
          "Finalize summary sheet",
        ],
        minutes: 75,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "Essay prep + MCQ practice",
        tasks: [
          "Write 3 practice essay answers (timed, 15 min each)",
          "Quiz yourself on MCQ-style questions",
          "Review definitions you wrote yesterday",
        ],
        minutes: 75,
        priority: "high",
      },
    ],
  },
  {
    day: "April 19 (Sun)",
    dayNum: 15,
    daysUntil: "DOUBLE EXAM TOMORROW",
    vibe: "The Final Night",
    icon: Moon,
    blocks: [
      {
        course: "ECON102",
        focus: "Final review - morning",
        tasks: [
          "Go through summary sheet",
          "Do 5-10 quick practice problems",
          "Don't cram new material",
        ],
        minutes: 45,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "Final review - afternoon",
        tasks: [
          "Re-read all definitions one last time",
          "Review essay outlines",
          "Glance through MCQ notes",
          "SLEEP EARLY. Two exams = need energy.",
        ],
        minutes: 45,
        priority: "high",
      },
    ],
  },
  {
    day: "April 20 (Mon)",
    dayNum: 16,
    daysUntil: "THE FINAL BATTLE",
    vibe: "DOUBLE BOSS FIGHT",
    icon: Trophy,
    isExamDay: true,
    examCourse: "BOTH",
    blocks: [
      {
        course: "ECON102",
        focus: "EXAM at 08:30",
        tasks: [
          "Wake up early, light breakfast",
          "10-min glance at summary sheet",
          "DESTROY IT",
        ],
        minutes: 10,
        priority: "high",
      },
      {
        course: "MGMT202",
        focus: "EXAM at 14:30",
        tasks: [
          "After ECON: rest, eat lunch, recharge",
          "30-min light review of definitions + essay outlines",
          "GO FINISH THIS. YOU DID IT.",
        ],
        minutes: 30,
        priority: "high",
      },
    ],
  },
];

const priorityStyles = {
  high: { bg: "#ff6b6b22", border: "#ff6b6b", label: "FOCUS", labelBg: "#ff6b6b" },
  medium: { bg: "#ffd16622", border: "#ffd166", label: "SOLID", labelBg: "#ffd166" },
  low: { bg: "#4ecdc422", border: "#4ecdc4", label: "LIGHT", labelBg: "#4ecdc4" },
};

const courseColors = {
  MATH103: "#ff6b6b",
  MGMT211: "#4ecdc4",
  ECON102: "#ffd166",
  MGMT202: "#a78bfa",
};

function PomodoroTimer() {
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
      style={{
        background: isBreak ? "#4ecdc422" : "#1a1a2e",
        border: `1px solid ${isBreak ? "#4ecdc4" : "#e94560"}`,
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isBreak ? (
          <Coffee size={18} color="#4ecdc4" />
        ) : (
          <Flame size={18} color="#e94560" />
        )}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 28,
            fontWeight: 700,
            color: isBreak ? "#4ecdc4" : "#e94560",
            letterSpacing: 2,
          }}
        >
          {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </span>
      </div>
      <span style={{ fontSize: 12, color: "#888", fontStyle: "italic" }}>
        {isBreak ? "rest, young ninja" : "focus mode"}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setRunning(!running)}
          style={{
            background: running ? "#e9456033" : "#e94560",
            color: running ? "#e94560" : "#0f0f1a",
            border: `1px solid #e94560`,
            borderRadius: 8,
            padding: "6px 16px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(isBreak ? 5 * 60 : 25 * 60);
          }}
          style={{
            background: "transparent",
            color: "#666",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function TaskItem({ task, checked, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        cursor: "pointer",
        padding: "6px 0",
        opacity: checked ? 0.5 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {checked ? (
        <CheckCircle2
          size={16}
          color="#4ecdc4"
          style={{ marginTop: 2, flexShrink: 0 }}
        />
      ) : (
        <Circle
          size={16}
          color="#555"
          style={{ marginTop: 2, flexShrink: 0 }}
        />
      )}
      <span
        style={{
          fontSize: 13,
          color: checked ? "#555" : "#ccc",
          textDecoration: checked ? "line-through" : "none",
          lineHeight: 1.5,
        }}
      >
        {task}
      </span>
    </div>
  );
}

function StudyBlock({ block, dayNum, blockIdx, progress, setProgress }) {
  const style = priorityStyles[block.priority];
  const courseColor = courseColors[block.course] || "#888";

  const toggleTask = (taskIdx) => {
    const key = `${dayNum}-${blockIdx}-${taskIdx}`;
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
  };

  const completedCount = block.tasks.filter(
    (_, i) => progress[`${dayNum}-${blockIdx}-${i}`]
  ).length;

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}33`,
        borderLeft: `3px solid ${courseColor}`,
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: courseColor,
            color: "#0f0f1a",
            fontSize: 10,
            fontWeight: 800,
            padding: "2px 8px",
            borderRadius: 4,
            letterSpacing: 0.5,
          }}
        >
          {block.course}
        </span>
        <span
          style={{
            background: style.labelBg + "33",
            color: style.labelBg,
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            letterSpacing: 1,
          }}
        >
          {style.label}
        </span>
        <span style={{ fontSize: 11, color: "#666", marginLeft: "auto" }}>
          <Clock size={11} style={{ marginRight: 3, verticalAlign: -1 }} />
          {block.minutes} min
        </span>
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#eee",
          marginBottom: 10,
        }}
      >
        {block.focus}
      </div>
      <div>
        {block.tasks.map((task, i) => (
          <TaskItem
            key={i}
            task={task}
            checked={!!progress[`${dayNum}-${blockIdx}-${i}`]}
            onToggle={() => toggleTask(i)}
          />
        ))}
      </div>
      {completedCount === block.tasks.length && block.tasks.length > 0 && (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "#4ecdc4",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Sparkles size={12} /> Block complete! Nice work, ninja.
        </div>
      )}
    </div>
  );
}

function DayCard({ day, progress, setProgress }) {
  const [open, setOpen] = useState(false);

  const totalTasks = day.blocks.reduce((a, b) => a + b.tasks.length, 0);
  const doneTasks = day.blocks.reduce(
    (a, block, bi) =>
      a +
      block.tasks.filter((_, ti) => progress[`${day.dayNum}-${bi}-${ti}`])
        .length,
    0
  );
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalMinutes = day.blocks.reduce((a, b) => a + b.minutes, 0);
  const IconComp = day.icon;

  return (
    <div
      style={{
        background: day.isExamDay
          ? "linear-gradient(135deg, #e9456015, #0f0f1a)"
          : "#0f0f1a",
        border: day.isExamDay ? "1px solid #e94560" : "1px solid #1e1e3a",
        borderRadius: 14,
        overflow: "hidden",
        marginBottom: 12,
        transition: "all 0.2s",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "14px 18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 12,
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: day.isExamDay ? "#e94560" : "#1a1a2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconComp
            size={18}
            color={day.isExamDay ? "#0f0f1a" : "#e94560"}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#eee" }}>
              Day {day.dayNum}: {day.day}
            </span>
            {day.isExamDay && (
              <span
                style={{
                  background: "#e94560",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 4,
                  letterSpacing: 1,
                }}
              >
                EXAM DAY
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#888",
              marginTop: 2,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#e94560", fontWeight: 600 }}>
              {day.daysUntil}
            </span>
            <span style={{ fontStyle: "italic", color: "#666" }}>
              {day.vibe}
            </span>
            <span>{totalMinutes} min total</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `conic-gradient(${
                pct === 100 ? "#4ecdc4" : "#e94560"
              } ${pct}%, #1e1e3a ${pct}%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: day.isExamDay ? "#1a0a10" : "#0f0f1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: pct === 100 ? "#4ecdc4" : "#e94560",
              }}
            >
              {pct}%
            </div>
          </div>
          {open ? (
            <ChevronUp size={16} color="#555" />
          ) : (
            <ChevronDown size={16} color="#555" />
          )}
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 18px 16px" }}>
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

function OverallProgress({ progress }) {
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
      style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        border: "1px solid #e9456033",
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Swords size={18} color="#e94560" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#eee" }}>
            Mission Progress
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Star size={14} color="#ffd166" />
          <span style={{ fontSize: 12, color: "#ffd166", fontWeight: 600 }}>
            Rank: {rank}
          </span>
        </div>
      </div>
      <div
        style={{
          background: "#0f0f1a",
          borderRadius: 8,
          height: 12,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              pct === 100
                ? "linear-gradient(90deg, #4ecdc4, #44a08d)"
                : "linear-gradient(90deg, #e94560, #ff6b6b)",
            borderRadius: 8,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#888",
        }}
      >
        <span>
          {doneTasks}/{totalTasks} tasks
        </span>
        <span>{pct}% complete</span>
      </div>
    </div>
  );
}

export default function NinjaPlanner() {
  const [progress, setProgress] = useState(loadProgress);
  const [tab, setTab] = useState("schedule");

  return (
    <div
      style={{
        fontFamily:
          "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0a0a14",
        minHeight: "100vh",
        color: "#eee",
        padding: "0 0 40px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #1a0a14 0%, #0a0a14 100%)",
          borderBottom: "1px solid #e9456033",
          padding: "28px 20px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 4,
            color: "#e94560",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          MIDTERM BATTLE PLAN
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          Muso the Destroyer
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#888",
            fontStyle: "italic",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          April 5 - 20, 2026 &middot; 4 Exams &middot; 16 Days &middot; One
          Ninja
        </div>

        {/* Motivational block */}
        <div
          style={{
            background: "#e9456011",
            border: "1px solid #e9456033",
            borderRadius: 12,
            padding: "14px 18px",
            marginTop: 16,
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <Heart size={14} color="#e94560" />
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "#e94560" }}
            >
              Real talk, Muso
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "#bbb",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Look. Four exams in eight days sounds scary but it's really not
            if you break it down. That's exactly what this plan does.
            You've already survived worse semesters. Math is the big one
            and you know it - that's why it gets the most days. The others?
            Conceptual stuff you can handle with focused reading. Two exams
            in one day is rough but the afternoon one is all definitions
            and essays, and you'll have prepped for days by then. Show up,
            stay consistent, don't try to be perfect. Just be better than
            yesterday. That's how ninjas actually train.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #1e1e3a",
          padding: "0 20px",
          background: "#0f0f1a",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {[
          { id: "schedule", label: "Battle Plan", icon: Scroll },
          { id: "exams", label: "Exam Intel", icon: Target },
          { id: "tools", label: "Ninja Tools", icon: Zap },
        ].map(({ id, label, icon }) => {
          const Icon = icon;

          return (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom:
                tab === id ? "2px solid #e94560" : "2px solid transparent",
              color: tab === id ? "#e94560" : "#666",
              padding: "12px 16px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
          );
        })}
      </div>

      <div style={{ padding: "16px 16px 0", maxWidth: 640, margin: "0 auto" }}>
        {tab === "schedule" && (
          <>
            <OverallProgress progress={progress} />

            {/* Phase labels */}
            <div
              style={{
                fontSize: 11,
                color: "#e94560",
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Swords size={12} />
              PHASE 1: MATH103 CONQUEST (Days 1-9)
            </div>

            {SCHEDULE.filter((d) => d.dayNum <= 9).map((day) => (
              <DayCard
                key={day.dayNum}
                day={day}
                progress={progress}
                setProgress={setProgress}
              />
            ))}

            <div
              style={{
                fontSize: 11,
                color: "#4ecdc4",
                fontWeight: 700,
                letterSpacing: 2,
                margin: "20px 0 8px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Shield size={12} />
              PHASE 2: MGMT211 SWIFT STRIKE (Days 10-12)
            </div>

            {SCHEDULE.filter((d) => d.dayNum >= 10 && d.dayNum <= 12).map(
              (day) => (
                <DayCard
                  key={day.dayNum}
                  day={day}
                  progress={progress}
                  setProgress={setProgress}
                />
              )
            )}

            <div
              style={{
                fontSize: 11,
                color: "#ffd166",
                fontWeight: 700,
                letterSpacing: 2,
                margin: "20px 0 8px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Flame size={12} />
              PHASE 3: DOUBLE DRAGON FINALE (Days 13-16)
            </div>

            {SCHEDULE.filter((d) => d.dayNum >= 13).map((day) => (
              <DayCard
                key={day.dayNum}
                day={day}
                progress={progress}
                setProgress={setProgress}
              />
            ))}

            <div
              style={{
                textAlign: "center",
                padding: "30px 20px",
                borderTop: "1px solid #1e1e3a",
                marginTop: 20,
              }}
            >
              <Trophy size={28} color="#ffd166" />
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#ffd166",
                  marginTop: 8,
                }}
              >
                You made it through, Muso.
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                Every ninja earns their title one battle at a time.
              </div>
            </div>
          </>
        )}

        {tab === "exams" && (
          <div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Intel on each exam. Know your enemy, Muso.
            </div>
            {EXAM_INFO.map((exam) => {
              const IconComp = exam.icon;
              return (
                <div
                  key={exam.code}
                  style={{
                    background: exam.bgColor,
                    border: `1px solid ${exam.color}33`,
                    borderRadius: 14,
                    padding: 18,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: exam.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp size={16} color="#0f0f1a" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#eee",
                        }}
                      >
                        {exam.code}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {exam.name}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: exam.color,
                        }}
                      >
                        {exam.date}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        at {exam.time} | Weight: {exam.weight}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#666",
                        fontWeight: 600,
                        marginBottom: 4,
                        letterSpacing: 0.5,
                      }}
                    >
                      CHAPTERS TO COVER:
                    </div>
                    {exam.chapters.map((ch, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#bbb",
                          padding: "3px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <BookOpen size={10} color={exam.color} />
                        {ch}
                      </div>
                    ))}
                  </div>
                  {exam.code === "MGMT202" && (
                    <div
                      style={{
                        background: "#a78bfa15",
                        borderRadius: 8,
                        padding: "8px 12px",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#a78bfa",
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        EXAM FORMAT:
                      </div>
                      <div style={{ fontSize: 12, color: "#bbb" }}>
                        27 MCQs + 4 Definitions (pick 4 out of 5) + 3 Essays
                        (pick 3 out of 5)
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      fontStyle: "italic",
                      borderTop: `1px solid ${exam.color}22`,
                      paddingTop: 8,
                    }}
                  >
                    {exam.note}
                  </div>
                </div>
              );
            })}

            <div
              style={{
                background: "#ffd16611",
                border: "1px solid #ffd16633",
                borderRadius: 12,
                padding: 16,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <AlertTriangle size={14} color="#ffd166" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffd166",
                  }}
                >
                  The Double Exam Day (April 20)
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#bbb",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                ECON at 8:30, OB at 14:30. That's a 6-hour gap. Eat lunch
                between them. Don't review ECON after you take it - what's
                done is done. Use that gap for a light OB definition
                review and rest. You've been prepping OB alongside
                everything else so it won't feel new.
              </p>
            </div>
          </div>
        )}

        {tab === "tools" && (
          <div>
            <div
              style={{
                fontSize: 12,
                color: "#888",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Weapons in your ninja toolkit. Use them wisely.
            </div>

            <PomodoroTimer />

            <div
              style={{
                marginTop: 20,
                background: "#1a1a2e",
                borderRadius: 14,
                padding: 18,
                border: "1px solid #1e1e3a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <Brain size={16} color="#a78bfa" />
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#eee" }}
                >
                  ADHD Ninja Survival Rules
                </span>
              </div>
              {[
                {
                  icon: Clock,
                  color: "#e94560",
                  text: "Use the Pomodoro timer above. 25 min focus, 5 min break. After 4 rounds, take a 15-20 min break.",
                },
                {
                  icon: Target,
                  color: "#ff6b6b",
                  text: "Do the hardest block FIRST each day while your brain still has juice. Math first, always.",
                },
                {
                  icon: Coffee,
                  color: "#ffd166",
                  text: "During breaks: stand up, stretch, get water. Don't open social media - your brain won't come back.",
                },
                {
                  icon: Moon,
                  color: "#4ecdc4",
                  text: "Stop studying by 10-11 PM. Sleep is when your brain actually saves what you learned. Don't skip it.",
                },
                {
                  icon: Sparkles,
                  color: "#a78bfa",
                  text: "Reward yourself after each completed day. Snack, game, whatever. You earned it.",
                },
                {
                  icon: Sun,
                  color: "#ffd166",
                  text: "If you miss a day or fall behind, don't spiral. Just pick up from where you are. Progress beats perfection.",
                },
                {
                  icon: Flame,
                  color: "#e94560",
                  text: "If a topic feels impossible, switch to an easier block for 15 min to build momentum, then come back.",
                },
                {
                  icon: Heart,
                  color: "#ff6b6b",
                  text: "You're not dumb for retaking Math. You're smart for showing up again. That takes real guts.",
                },
              ].map((rule, i) => {
                const RuleIcon = rule.icon;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "8px 0",
                      borderTop: i > 0 ? "1px solid #ffffff08" : "none",
                    }}
                  >
                    <RuleIcon
                      size={14}
                      color={rule.color}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span
                      style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6 }}
                    >
                      {rule.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 16,
                background: "#1a1a2e",
                borderRadius: 14,
                padding: 18,
                border: "1px solid #1e1e3a",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <Scroll size={16} color="#e94560" />
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#eee" }}
                >
                  The Strategy Behind the Plan
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#bbb",
                  lineHeight: 1.7,
                }}
              >
                <p style={{ margin: "0 0 8px" }}>
                  <strong style={{ color: "#ff6b6b" }}>Days 1-9:</strong> Math
                  gets the lion's share because it's math, it's 35% of
                  your grade, and you're retaking it. Every day
                  starts with math. Other courses get sprinkled in as
                  "light reads" so they don't pile up later.
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <strong style={{ color: "#4ecdc4" }}>Days 10-12:</strong>{" "}
                  MGMT211 is 3 conceptual chapters. You've been reading
                  them lightly during Phase 1, so this is mostly review
                  and solidification.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#ffd166" }}>Days 13-16:</strong>{" "}
                  ECON and OB run in parallel. ECON needs calculation
                  practice. OB needs definition memorization and essay
                  prep. They use different parts of your brain, so
                  alternating works well.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Reset ALL progress? This can't be undone, Muso."
                  )
                ) {
                  setProgress({});
                  saveProgress({});
                }
              }}
              style={{
                marginTop: 20,
                width: "100%",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: 10,
                padding: "10px",
                color: "#555",
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit",
              }}
            >
              Reset all progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
