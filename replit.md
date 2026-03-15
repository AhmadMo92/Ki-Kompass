# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 540 German occupations (6,079 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL. Includes a skills layer mapping 119 competencies across 6 categories. Features 18 modern occupations (CEO, CTO, CFO, CMO, DevOps Engineer, Prompt Engineer, etc.).

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` + `skills.json` generated from source CSVs via `scripts/build-occupations.cjs`

## Data Pipeline
Source CSVs (in `attached_assets/`):
1. `tasks_for_replit_v3.csv` — 6,079 tasks with labels + scoring dimensions (PHYS,TPS,SIR,SPEC,VERIF,STD). Includes modern occupation tasks (MOD_ prefix, overlaps pre-filtered).
2. `occupations_summary_v3.csv` — pre-computed occupation-level counts (540 rows)
3. `skills_vocabulary_v0_(2)_1772872655371.csv` — 118 base skills across 6 categories
4. `task_skill_links_v3_(1)_1772969326595.csv` — 16,655 task→skill links (avg ~2.7 per task)

Build: `node scripts/build-occupations.cjs` → generates `occupations.json` + `skills.json`

Labels in CSVs are final — NO downstream regex applied. The build script reads labels directly.

### Modern Occupations (18 new, 6 overlaps kept as original)
New: CEO, CMO, CTO, CFO, UI/UX Designer, ML Engineer, Frontend/Backend/Full Stack/Mobile/DevOps Developer, SRE, AI/ML Researcher, Prompt Engineer, Customer Success Manager, People Ops Manager, Solutions Architect, Cybersecurity Analyst.
Overlaps (original kept): Community Manager, Growth Manager, Influencer Marketing Manager, Product Manager, Product Owner, Sustainability Manager.
Build script skips MOD_ tasks for occupations that already have BN_ tasks.

### Distribution
| Category | Tasks | % |
|---|---|---|
| ai_assisted | 2,631 | 43.3% |
| human_led | 2,248 | 37.0% |
| high_ai_potential | 776 | 12.8% |
| automatable | 310 | 5.1% |
| sensitive | 114 | 1.9% |

## 5-Category System
| Category | Label EN | Label DE | Color | Micro-label |
|---|---|---|---|---|
| `automatable` | Automatable | Automatisierbar | #E53935 (red) | AI or software can handle much of this workflow |
| `high_ai_potential` | AI and a bit of you | KI und etwas von dir | #F57C00 (orange) | AI does the first pass — you review and refine |
| `sensitive` | Context-dependent | Kontextabhängig | #8E24AA (purple) | AI exposure depends on regulatory context |
| `ai_assisted` | You and a bit of AI | Du und etwas KI | #F9A825 (yellow) | You decide — AI helps speed things up |
| `human_led` | Human-driven | Menschlich geführt | #43A047 (green) | You lead — AI supports in the background |

Task explanations (154 tasks across 10 test occupations) have 3-part structure: `what_it_means`, `why_it_fits`, `what_stays_human`. These render as expandable 3-column cards in the task list.

Global directional note appears above task list: "These labels are directional, not absolute..."

## Skills Layer (6 Categories, 119 total)
| Category | Count | Color |
|---|---|---|
| cognitive | 23 | #1E88E5 |
| social | 23 | #43A047 |
| operational | 23 | #F57C00 |
| digital | 18 | #7B1FA2 |
| domain | 17 | #00897B |
| technical | 16 | #546E7A |

Each task links to 2-3 skills with relevance scores. Skills profile shows which competencies dominate an occupation and how they map to AI exposure categories.

## Key Data Files
- `client/src/lib/data/occupations.json` — 540 occupations, 6,079 tasks with skill IDs
- `client/src/lib/data/skills.json` — 119 skills with bilingual names/definitions
- `client/src/lib/data/index.ts` — Data layer, types, search, categories, sector averages, skill helpers
- `scripts/build-occupations.cjs` — Build script: CSVs → occupations.json + skills.json (handles overlap filtering)

## Important Rules
- **Labels are final in CSV** — no downstream regex or label manipulation
- **Percentages come from task counts** in occupations.json `summary` field
- **5 categories only** — old 3-category system is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`, skills have `name_de`/`name_en`
- **Label key**: `human_led` (was `stays_with_you`) → "Human Led" / "Menschlich geführt" in UI
- **Task schema**: id, text_de, text_en, label, score, skills[] (array of skill_id strings)
- **Scoring dimensions**: PHYS, TPS, SIR, SPEC, VERIF, STD available in source CSVs
- **Modern tasks use MOD_ prefix**, original tasks use BN_ prefix

## Routes
- `/` — Landing page: journey (4-step path), dashboard preview, companion concept
- `/my-role` — Main analysis page (search → OccupationDashboard with AI Tools Map)
- `/beruf/:slug` — Shareable occupation profile page

## Key Components
- `Landing` — Journey-oriented landing page with four pillars: Discover→Analyze→Customize→Navigate journey steps, Dashboard preview section, Companion/roadmap section
- `OccupationDashboard` — **Tabbed layout** (Overview, Tasks, Skills, Tools). Overview shows donut + distribution bars + sector comparison. Tasks shows collapsible category groups with toggles and expandable 3-column explanations. Skills shows competency bars. Tools shows curated AI toolkit. Supports custom tasks. Used by both `/my-role` and `/beruf/:slug`.
- `AIToolsMap` — Curated AI toolkit: 8 category nodes (writing, analysis, productivity, design, coding, communication, marketing, HR), each with top 3 real-world tools with logos. Click node to expand tool details with descriptions and external links. Relevance-ranked per occupation.
- `ai-tools.ts` — Curated tools layer: 8 nodes with top 3 real tools each (ChatGPT, Claude, Gemini, Canva, Midjourney, Cursor, GitHub Copilot, Notion, Asana, Otter.ai, Grammarly, HubSpot, Jasper, Personio). Tool logos in `client/public/tool-logos/`. Benchmarks placeholder for future.
- `DonutChart` — SVG donut with 5 category segments (standalone, also inlined in OccupationDashboard)
- `OccupationSearch` — Type-ahead search across 540 occupations

## Sector Averages (pre-computed from occupations_summary)
tech, health, finance, law, marketing, management, other — stored in `SECTOR_AVERAGES` in data/index.ts
