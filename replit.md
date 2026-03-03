# Replit Agent Guide

## Overview

This is **"The Vanishing Student of Hogwarts"** — a Harry Potter-themed interactive mystery game built as a full-stack web application. Players take on the role of Junior Investigators solving logic puzzles across 4 mini-games, earning points, and making a final story choice. The app features a dark magical UI theme with gold accents, floating animations, and immersive page transitions.

The game flow is: Entry (loading screen) → Login (username) → Hub (investigation map) → 4 Mini-Games (sequential unlock) → Verdict (final choice) → Leaderboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — routes defined in `client/src/App.tsx`
- **State Management**: Zustand with `persist` middleware (localStorage) in `client/src/lib/store.ts` — stores the current user session so progress survives page reloads
- **Data Fetching**: TanStack React Query with custom hooks in `client/src/hooks/use-game.ts`
- **Styling**: Tailwind CSS with a custom dark magical theme (deep purples, golds, glowing effects) defined via CSS variables in `client/src/index.css`. Uses shadcn/ui component library (new-york style) with Radix UI primitives.
- **Animations**: Framer Motion for page transitions, floating orbs background effect, and interactive game elements
- **Fonts**: Cinzel Decorative (headings), Lora (serif body), Inter (UI text)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 running on Node.js with TypeScript (via tsx)
- **Server entry**: `server/index.ts` creates an HTTP server, registers API routes, and serves static files or Vite dev middleware
- **API design**: RESTful JSON API. Route contracts are defined in `shared/routes.ts` using Zod schemas — shared between client and server for type safety
- **Key API endpoints**:
  - `POST /api/users` — Create or get user by username
  - `POST /api/users/:id/progress` — Update score and completed game count
  - `POST /api/users/:id/choice` — Make final story choice (seal/expose/erase)
  - `GET /api/leaderboard` — Get ranked list of players
- **Storage layer**: `server/storage.ts` implements `IStorage` interface using `DatabaseStorage` class — abstracts all DB operations

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema**: Single `users` table defined in `shared/schema.ts` with fields: `id`, `username` (unique), `score`, `completedGames`, `finalChoice`, `createdAt`
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database — no migration files needed for development
- **Connection**: Node-postgres Pool in `server/db.ts`

### Build System
- **Development**: `npm run dev` — runs tsx with Vite dev server (HMR enabled)
- **Production build**: `npm run build` — runs `script/build.ts` which builds the client with Vite and bundles the server with esbuild into `dist/index.cjs`
- **Production start**: `npm start` — runs the built `dist/index.cjs`

### Game Logic
- 4 sequential mini-games, each unlocked after completing the previous one
- Game 1: Alchemical Mixing (Logic puzzle)
- Game 2: The Sealed Evidence (3-digit code breaker → receipt assembly animation → receipt math verification)
- Game 3: The Pensieve Paradox (Visual memory slider)
- Game 4: The Ministry Register (Wizard's Chess "Mate in One" → Ministry Register identity cross-reference)
- Games are purely client-side logic puzzles; scores are submitted to the server on completion
- Score values: Game 1 = 100, Game 2 = 100, Game 3 = 150, Game 4 = 200
- Idempotent progress tracking: completing a game multiple times doesn't add extra score
- After all 4 games, the Verdict page lets the player make one of 3 final choices
- Once a final choice is made, the username is locked out from replaying

### Shared Code
- `shared/schema.ts` — Database schema and TypeScript types (used by both client and server)
- `shared/routes.ts` — API contract definitions with Zod schemas, path constants, and a `buildUrl` helper for parameterized routes

## External Dependencies

- **PostgreSQL**: Required. Must be provisioned and `DATABASE_URL` environment variable set
- **Google Fonts**: Cinzel Decorative, Lora, Inter, DM Sans, Fira Code, Geist Mono loaded via CDN
- **Transparent Textures**: Used for parchment texture in Game 2 receipt UI (external URL)
- **Replit plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` — development-only Replit integrations
- **No external auth service**: Simple username-based identification (no passwords)
- **No external AI/payment services**: Despite build script allowlisting packages like openai, stripe, etc., they are not currently used in the application