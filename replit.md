# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 522 German occupations (5,885 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` generated from `scored_tasks_v1_4_FINAL.csv` via `scripts/build-occupations.cjs`

## Data Version: v1.4 FINAL (rev 3)
Source CSV: `attached_assets/scored_tasks_v1_4_FINAL_(3)_1772803864419.csv`
- SIR (Social Interaction Required) dimension re-scored with regex-based text-evidence filter
- Task-level regulation (`is_task_regulated`) replaces occupation-level regulation
- Gold-validated against 300 expert-labeled tasks (precision 88.3%)
- Upstream SIR_regex expanded with work-with, customer-needs, sell/offer patterns
- Downstream regex in build-occupations.cjs adds further interpersonal patterns beyond upstream

### Distribution (v1.4 rev 3 + downstream regex)
| Category | Tasks | % |
|---|---|---|
| ai_assisted | 2,503 | 42.5% |
| stays_with_you | 2,248 | 38.2% |
| high_ai_potential | 740 | 12.6% |
| automatable | 279 | 4.7% |
| sensitive | 115 | 2.0% |

### Classification Logic
1. Task-level regulation check → `sensitive` (is_task_regulated + score_sum ≥ 6)
2. Gate rules: PHYS=1, TPS=1, SIR=1 → `stays_with_you`
3. Downstream SIR regex: additional interpersonal patterns flip ai_assisted → stays_with_you
4. score_sum ≥ 8 → `automatable`, score_sum 6-7 → `high_ai_potential`, < 6 → `ai_assisted`

## 5-Category System
| Category | Color | Description |
|---|---|---|
| `automatable` | #E53935 (red) | AI can already do this |
| `high_ai_potential` | #F57C00 (orange) | AI does most, you steer |
| `sensitive` | #8E24AA (purple) | AI could, but regulation says no |
| `ai_assisted` | #F9A825 (yellow) | AI helps, you lead |
| `stays_with_you` | #43A047 (green) | Human Led |

## Key Data Files
- `client/src/lib/data/occupations.json` — 522 occupations, 5,885 tasks (generated from CSV)
- `client/src/lib/data/index.ts` — Data layer, types, search, categories, sector averages
- `scripts/build-occupations.cjs` — Build script: CSV → occupations.json

## Important Rules
- **Percentages come from task counts** in occupations.json `summary` field
- **5 categories only** — old 3-category system is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`
- **v1.4 CSV is the source of truth** — build script reads labels directly, downstream SIR regex adds interpersonal catches
- **Display label**: `stays_with_you` → "Human Led" / "Menschlich geführt" in UI

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
