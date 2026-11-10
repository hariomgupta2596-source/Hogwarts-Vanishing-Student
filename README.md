# 🪄 The Vanishing Student of Hogwarts

A Harry Potter–inspired **logic mystery game** built as a full-stack TypeScript web application. You play a Junior Investigator working four mini-games to solve a disappearance — and every puzzle is really a **computational thinking and data reasoning** problem in a wizard's robe.

> A student has vanished from Hogwarts. The evidence is scattered. The logic isn't.

## 🎮 How the game works

```
Entry (loading) → Login (pick a name) → Investigation Hub
      → 4 mini-games (sequential unlock) → Verdict (final choice) → Leaderboard
```

- **Investigation hub** — a map of case locations; each mini-game unlocks in order, so progress is gated rather than free-roam.
- **Four logic mini-games** — deduction, pattern and reasoning challenges that layer difficulty as the case deepens.
- **Scoring** — points accumulate as you solve; your run is measured, not just completed.
- **The Verdict** — the case ends on a final narrative choice, so the deduction has a consequence.
- **Leaderboard** — completed runs are ranked.
- **Persistent session** — your progress survives a page reload.

## 🏗️ Architecture

| Layer | Stack |
| --- | --- |
| **Client** | React 18 + TypeScript, bundled with Vite, routed with Wouter |
| **State** | Zustand with `persist` (localStorage) for the player session |
| **Data fetching** | TanStack React Query through typed hooks |
| **UI** | Tailwind CSS, shadcn/ui on Radix primitives, Framer Motion transitions |
| **Theme** | Dark magical palette (deep purples, gold), Cinzel Decorative / Lora / Inter |
| **Server** | Express 5 on Node.js (TypeScript via `tsx`) |
| **Database** | Postgres with Drizzle ORM and migrations via `drizzle-kit` |
| **Contracts** | Zod schemas in `shared/routes.ts`, shared by client and server |

```
Hogwarts-Vanishing-Student/
├── client/           # React app: pages, components, hooks, store
├── server/           # Express API and static serving
├── shared/           # Zod route contracts + shared types
├── api/              # serverless entry for deployment
└── drizzle.config.ts # database schema and migration config
```

Type-safe API contracts shared between client and server were the point of building it this way — if a route changes shape, the compile step complains before the browser does.

## ▶️ Running locally

```bash
git clone https://github.com/hariomgupta2596-source/Hogwarts-Vanishing-Student.git
cd Hogwarts-Vanishing-Student
npm install
npm run dev          # starts the Express server with Vite middleware
```

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the built app |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push the Drizzle schema to the database |

### Environment

The app expects Postgres connection details in a `.env` file at the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

Deployed against Supabase Postgres. A `.env` file is currently committed in the repo — it holds only the Supabase URL and the **publishable** client key (protected by row-level security), not a service-role secret. Still, moving it to `.gitignore` is the right hygiene and is on the cleanup list.

## 🧠 Why I built it

Data reasoning is easier to teach with a story attached. Turning deduction into a puzzle with a score and a consequence kept me honest about difficulty curves, state machines and progressive unlocking — the same mechanics behind any guided onboarding or assessment flow.
