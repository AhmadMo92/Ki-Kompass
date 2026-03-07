# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 522 German occupations (5,885 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL. Includes a skills layer mapping 118 competencies across 6 categories.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` + `skills.json` generated from 4 source CSVs via `scripts/build-occupations.cjs`

## Data Pipeline
Source CSVs (in `attached_assets/`):
1. `tasks_for_replit.csv` — 5,885 tasks with labels + scoring dimensions (PHYS,TPS,SIR,SPEC,VERIF,STD)
2. `occupations_summary.csv` — pre-computed occupation-level counts (522 rows)
3. `skills_vocabulary_v0_(2)_1772872655371.csv` — 118 skills across 6 categories
4. `task_skill_links_production_(1)_1772872650835.csv` — 16,082 task→skill links (avg 2.7 per task)

Build: `node scripts/build-occupations.cjs` → generates `occupations.json` + `skills.json`

Labels in CSVs are final — NO downstream regex applied. The build script reads labels directly.

### Distribution
| Category | Tasks | % |
|---|---|---|
| ai_assisted | 2,574 | 43.7% |
| human_led | 2,196 | 37.3% |
| high_ai_potential | 729 | 12.4% |
| automatable | 272 | 4.6% |
| sensitive | 114 | 1.9% |

## 5-Category System
| Category | Color | Description |
|---|---|---|
| `automatable` | #E53935 (red) | AI can already do this |
| `high_ai_potential` | #F57C00 (orange) | AI does most, you steer |
| `sensitive` | #8E24AA (purple) | AI could, but regulation says no |
| `ai_assisted` | #F9A825 (yellow) | AI helps, you lead |
| `human_led` | #43A047 (green) | Human Led |

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
- **Label key**: `human_led` (was `stays_with_you`) → "Human Led" / "Menschlich geführt" in UI
- **Task schema**: id, text_de, text_en, label, score, skills[] (array of skill_id strings)
- **Scoring dimensions**: PHYS, TPS, SIR, SPEC, VERIF, STD available in source CSVs

## Routes
- `/` — Landing page: journey (3-step path), dashboard preview, companion concept
- `/my-role` — Main analysis page (search → OccupationDashboard with AI Tools Map)
- `/beruf/:slug` — Shareable occupation profile page

## Key Components
- `Landing` — Journey-oriented landing page with three pillars: Discover→Analyze→Navigate journey steps, Dashboard preview section, Companion/roadmap section
- `OccupationDashboard` — **Main holistic view**: 4-panel top row (donut+legend, category bars, sector comparison, skill radar) + task/skill panels + AI Tools Map. Used by both `/my-role` and `/beruf/:slug`.
- `AIToolsMap` — Force-directed SVG graph connecting 25 virtual AI tools to skills for AI-exposed tasks. Click nodes for detail panel. Tool sizes scale by task coverage.
- `ai-tools.ts` — Virtual AI tools layer: 25 tools across 8 categories (generation, analysis, automation, research, communication, design, domain_specific, coding). Maps tool→skill relationships for occupation-specific tool matching.
- `DonutChart` — SVG donut with 5 category segments (standalone, also inlined in OccupationDashboard)
- `SkillTaskExplorer` — Unified skill-task linking (superseded by OccupationDashboard but kept)
- `OccupationSearch` — Type-ahead search across 522 occupations

## Sector Averages (pre-computed from occupations_summary)
tech, health, finance, law, marketing, management, other — stored in `SECTOR_AVERAGES` in data/index.ts
