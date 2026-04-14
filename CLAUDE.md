# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal midterm study planner built for the developer's brother ("Muso"). It presents a 16-day schedule (April 5-20, 2026) covering 4 university exams (MATH103, MGMT211, ECON102, MGMT202) with day-by-day study blocks, task checklists, progress tracking, and email notifications. The tone is motivational and ninja-themed.

## Commands

- `npm run dev` — start Vite dev server (default http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint (flat config, JS/JSX only)
- `npm run preview` — preview production build locally

No test framework is configured.

## Architecture

Single-page React + Tailwind CSS v4 app. The root `NinjaPlanner` component gates behind a password screen, then renders the main planner.

**`src/data/`** — Static data constants:
- `constants.js` — localStorage key, per-course guidance, motivational quotes, priority styles, course color map
- `schedule.js` — 16-day `SCHEDULE` array (day metadata + study blocks with tasks)
- `exams.js` — `EXAM_INFO` array (exam dates, weights, chapters, notes)

**`src/utils/`** — Helpers:
- `progress.js` — `loadProgress` / `saveProgress` (localStorage read/write)
- `helpers.js` — `getCourseGuidance` (per-course resource hints)
- `dates.js` — `getTodayDayNum`, `getNextExam`, `getCountdown`, `getDynamicDaysUntil` (live date calculations)
- `auth.js` — session-based password gate (reads `VITE_APP_PASSWORD` from env)
- `notifications.js` — browser Notification API + ntfy.sh push updates on progress milestones

**`src/components/`** — UI components:
- `PasswordGate.jsx` — login screen, checks password against env var
- `ExamCountdown.jsx` — live countdown timer to next exam (updates every second)
- `DayCard.jsx` — collapsible day card with dynamic date labels, auto-opens today
- `StudyBlock.jsx` — study session with course tag, tasks, and resource hint
- `TaskItem.jsx` — checkbox task
- `OverallProgress.jsx` — progress bar with ninja rank (Genin to Legendary Ninja)
- `PomodoroTimer.jsx` — 25/5 minute focus/break timer

**`src/App.jsx`** — Root `NinjaPlanner` (password gate) + `NinjaPlannerInner` (main app with tabs: Schedule, Exams, Tools).

**State persistence:** Progress is stored in `localStorage` under key `muso-ninja-planner-v2`. The progress object maps composite keys (`{dayNum}-{blockIdx}-{taskIdx}`) to boolean values.

## Environment Variables

Configured via `.env` (see `.env.example`):
- `VITE_APP_PASSWORD` — required, password for the login gate
- `VITE_NTFY_TOPIC` — ntfy.sh topic name for push notifications (optional, silently skips if not set)

## Deployment

Deployed automatically to **Netlify** at `midterm-ninja-tracker-web.netlify.app`. Vite `base` is set to `./` in vite.config.js. Set the env vars in Netlify's site settings.

## Style Approach

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom theme colors defined in `src/index.css` under `@theme` (prefixed `ninja-*`). Background is a pure CSS radial gradient (`.ninja-bg` class). Some dynamic values (conic-gradient progress, per-course colors) remain as inline `style`. Icons from `lucide-react`.

## ESLint

Flat config in eslint.config.js. Uses `react-hooks` and `react-refresh` plugins. The `no-unused-vars` rule ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).
