# Midterm Ninja Planner

A focused React + Tailwind study planner built with heart.

## Why I Built This

I started this project because I care deeply about my brother.

I wanted him to stay focused, study with a clear plan, and walk into midterms with confidence instead of stress. This app is my way of saying:

"I believe in you. I want you to succeed. I am with you, one study session at a time."

## What This Website Includes

- Password-protected access
- A day-by-day midterm training schedule (April 5-20, 2026)
- Session blocks with exact focus topics and tasks
- Live countdown to the next exam
- Progress check system saved in your browser
- Ninja rank system (Genin to Legendary Ninja)
- Push notifications to sister via ntfy.sh on progress milestones
- Browser notifications on every 5% milestone
- Pomodoro timer (25 min focus / 5 min break)
- ADHD-friendly study tips
- Motivational study reminders

## Courses Covered

- **MATH103** — Math for Business & Econ I (Ch1-3)
- **MGMT211** — Business Communication (Ch1-3)
- **ECON102** — Intro to Economics II (Ch16-21)
- **MGMT202** — Organizational Behavior (Ch1-2, 4-6)

## Run Locally

1. Install dependencies:

       npm install

2. Copy the example env file and set your password:

       cp .env.example .env

3. Start the dev server:

       npm run dev

4. Open the local URL shown in terminal (usually http://localhost:5173).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_APP_PASSWORD` | Yes | Password for the login screen |
| `VITE_NTFY_TOPIC` | No | ntfy.sh topic for push notifications |

## Push Notifications Setup (ntfy.sh)

1. Pick a secret topic name (e.g. `muso-ninja-secret-abc123`)
2. Set `VITE_NTFY_TOPIC` in your `.env` to that topic name
3. Subscribe on your phone: install the [ntfy app](https://ntfy.sh) and subscribe to the same topic
4. You'll get a push notification every 10% progress milestone

No account needed. No API keys. Just a topic name.

## Build for Production

    npm run build

The production files are generated in the `dist` folder.

## Deploy on Netlify

This project is deployed at `midterm-ninja-tracker-web.netlify.app`.

1. Connect your repo to Netlify
2. Set build command to `npm run build` and publish directory to `dist`
3. Add your environment variables in Site Settings > Environment Variables
4. Deploy

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Lucide React icons
- ntfy.sh (push notifications)

Stay calm. Stay sharp. One mission at a time.
