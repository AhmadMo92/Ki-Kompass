# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
Bilingual (DE/EN) interactive web app analyzing AI exposure for 540 German occupations and 6,079 tasks using a 5-category scoring system. Users select their role, personalize their task list, and receive a detailed AI profile with a downloadable PDF report.

## Architecture
- **Frontend-heavy**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express — static file serving only, no auth, no user data stored
- **Database**: PostgreSQL (Drizzle ORM) — available but unused in current prototype
- **Routing**: Wouter (client-side)
- **Build**: Vite
- **PDF**: jsPDF (client-side generation)

## Routes
- `/` — Landing page
- `/my-role` — 3-step occupation analysis (search → personalize → analyze)
- `/beruf/:slug` — Direct occupation dashboard by URL slug

## Core data files
- `client/src/lib/data/occupations.json` — 540 occupations, 6,079 tasks (1.6MB, single-line JSON)
- `client/src/lib/data/skills.json` — 118 skills with category metadata
- `client/src/lib/data/skill-tools.json` — Skill → AI tool type mappings
- `client/src/lib/data/tool-types.json` — 18 AI tool types
- `client/src/lib/data/sector-tools.json` — Sector-specific tool examples
- `client/src/lib/data/peer-usage.ts` — Research-backed adoption data per sector

## Key components
- `MyRoleTasks.tsx` — 3-step flow: search → task review/personalize → analysis
- `OccupationDashboard.tsx` — 4-tab dashboard: Overview / Tasks / Skills / Tools
- `OccupationSearch.tsx` — Fuzzy search across 540 occupations
- `AIToolsMap.tsx` — Occupation-specific AI tool recommendations
- `PeerUsage.tsx` — Sector adoption stats with evidence badges
- `report-generator.ts` — Client-side PDF report generation

## The 5 categories
| Label | Display |
|---|---|
| `human_led` | Human-driven |
| `ai_assisted` | You and a bit of AI |
| `high_ai_potential` | AI and a bit of you |
| `automatable` | Automatable |
| `sensitive` | Context-dependent |

## Tasks flagged as greyed
Tasks with `confirmed: true` in the occupation data = vague/redundant tasks identified during auditing. Shown at 40% opacity, excluded from percentages. 319 of 6,079 tasks are flagged.

## Running locally
```bash
npm install
npm run dev
```
Runs on port 5000.
