# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 522 German occupations (5,885 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL. Includes a skills layer mapping 118 competencies across 6 categories.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` + `skills.json` generated from 4 source CSVs via `scripts/build-occupations.cjs`

## Data Pipeline
Source CSVs (in `attached_assets/`):
1. `tasks_for_replit_1772870922238.csv` — 5,885 tasks with labels (14 clean columns)
2. `occupations_summary_1772870916961.csv` — pre-computed occupation-level counts (522 rows)
3. `skills_vocabulary_v0_(1)_1772870913053.csv` — 118 skills across 6 categories
4. `task_skill_links_production_1772870970135.csv` — 16,082 task→skill links (avg 2.7 per task)

Build: `node scripts/build-occupations.cjs` → generates `occupations.json` + `skills.json`

Labels in CSVs are final — NO downstream regex applied. The build script reads labels directly.

### Distribution
| Category | Tasks | % |
|---|---|---|
| ai_assisted | 2,682 | 45.6% |
| stays_with_you | 2,069 | 35.2% |
| high_ai_potential | 740 | 12.6% |
| automatable | 279 | 4.7% |
| sensitive | 115 | 2.0% |

## 5-Category System
| Category | Color | Description |
|---|---|---|
| `automatable` | #E53935 (red) | AI can already do this |
| `high_ai_potential` | #F57C00 (orange) | AI does most, you steer |
| `sensitive` | #8E24AA (purple) | AI could, but regulation says no |
| `ai_assisted` | #F9A825 (yellow) | AI helps, you lead |
| `stays_with_you` | #43A047 (green) | Human Led |

## Skills Layer (6 Categories)
| Category | Count | Color |
|---|---|---|
| cognitive | 22 | #1E88E5 |
| social | 22 | #43A047 |
| operational | 23 | #F57C00 |
| digital | 18 | #7B1FA2 |
| domain | 17 | #00897B |
| technical | 16 | #546E7A |

Each task links to 2-3 skills with relevance scores. Skills profile shows which competencies dominate an occupation and how they map to AI exposure categories.

## Key Data Files
- `client/src/lib/data/occupations.json` — 522 occupations, 5,885 tasks with skill IDs
- `client/src/lib/data/skills.json` — 118 skills with bilingual names/definitions
- `client/src/lib/data/index.ts` — Data layer, types, search, categories, sector averages, skill helpers
- `scripts/build-occupations.cjs` — Build script: 4 CSVs → occupations.json + skills.json

## Important Rules
- **Labels are final in CSV** — no downstream regex or label manipulation
- **Percentages come from task counts** in occupations.json `summary` field
- **5 categories only** — old 3-category system is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`, skills have `name_de`/`name_en`
- **Display label**: `stays_with_you` → "Human Led" / "Menschlich geführt" in UI
- **Task schema**: id, text_de, text_en, label, score, skills[] (array of skill_id strings)

## Routes
- `/` — Landing page with hero occupations
- `/my-role` — Main analysis page (search, donut chart, task list, personalization)
- `/beruf/:slug` — Shareable occupation profile page

## Key Components
- `OccupationDashboard` — **Main holistic view**: 3-panel cockpit layout (donut+categories | tasks | skills). Integrates donut chart, category filtering, sector comparison, task toggles, skill bars, and personalization into a single interactive dashboard. Used by both `/my-role` (step 2) and `/beruf/:slug`.
- `DonutChart` — SVG donut with 5 category segments (standalone, also inlined in OccupationDashboard)
- `SkillTaskExplorer` — Unified skill-task linking (superseded by OccupationDashboard but kept)
- `SectorComparison` — Stacked bar comparing occupation vs sector average (standalone, also inlined in OccupationDashboard)
- `InsightCards` — Dynamic recommendation cards based on profile (no longer used in dashboard view)
- `PersonalizedResults` — Side-by-side typical vs personal profile (no longer used in dashboard view)
- `OccupationSearch` — Type-ahead search across 522 occupations

## Sector Averages (pre-computed from occupations_summary)
tech, health, finance, law, marketing, management, other — stored in `SECTOR_AVERAGES` in data/index.ts
