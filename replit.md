# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 522 German occupations (5,885 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` generated from `scored_tasks_v1_3_DE_COMPLETE.csv` via `scripts/build-occupations.cjs`

## 5-Category System (v1.3)
| Category | Color | Description |
|---|---|---|
| `automatable` | #E53935 (red) | AI can already do this |
| `high_ai_potential` | #F57C00 (orange) | AI does most, you steer |
| `sensitive` | #8E24AA (purple) | AI could, but regulation says no |
| `ai_assisted` | #F9A825 (yellow) | AI helps, you lead |
| `stays_with_you` | #43A047 (green) | Stays human work |

## Key Data Files
- `client/src/lib/data/occupations.json` — 522 occupations, 5,885 tasks (generated from CSV)
- `client/src/lib/data/index.ts` — Data layer, types, search, categories, sector averages
- Source CSV: `attached_assets/scored_tasks_v1_3_DE_COMPLETE_*.csv`

## Important Rules
- **Percentages come from task counts** in occupations.json `summary` field
- **5 categories only** — old 3-category system (human/ai_assisted/automation) is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`

## Routes
- `/` — Landing page with hero occupations
- `/my-role` — Main analysis page (search, donut chart, task list, personalization)
- `/beruf/:slug` — Shareable occupation profile page

## Key Components
- `DonutChart` — SVG donut with 5 category segments
- `TaskList` — Grouped tasks with toggle switches for personalization
- `SectorComparison` — Stacked bar comparing occupation vs sector average
- `InsightCards` — Dynamic recommendation cards based on profile
- `PersonalizedResults` — Side-by-side typical vs personal profile
- `OccupationSearch` — Type-ahead search across 522 occupations

## Sector Averages (pre-computed constants)
tech, health, finance, law, marketing, management, other — stored in `SECTOR_AVERAGES` in data/index.ts
