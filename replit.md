# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 522 German occupations (5,885 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: `occupations.json` generated from `scored_tasks_v1_4_FINAL.csv` via `scripts/build-occupations.cjs`

## Data Version: v1.4 FINAL
Source CSV: `attached_assets/scored_tasks_v1_4_FINAL_1772777536096.csv`
- SIR (Social Interaction Required) dimension re-scored with regex-based text-evidence filter
- Regulation/sensitive category expanded via EU AI Act Annex III keyword matching
- Gold-validated against 300 expert-labeled tasks (precision 86.7%, recall 46.1%)

### Distribution (v1.4)
| Category | Tasks | % |
|---|---|---|
| ai_assisted | 2,714 | 46.1% |
| stays_with_you | 2,035 | 34.6% |
| high_ai_potential | 617 | 10.5% |
| sensitive | 298 | 5.1% |
| automatable | 221 | 3.8% |

### Classification Logic
1. Regulation check → `sensitive` (is_regulated + score_sum ≥ 6)
2. Gate rules: PHYS=1 (711), TPS=1 (622), SIR=1 (702) → `stays_with_you`
3. score_sum ≥ 8 → `automatable`, score_sum 6-7 → `high_ai_potential`, < 6 → `ai_assisted`

## 5-Category System
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
- `scripts/build-occupations.cjs` — Build script: CSV → occupations.json

## Important Rules
- **Percentages come from task counts** in occupations.json `summary` field
- **5 categories only** — old 3-category system is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`
- **v1.4 CSV is the source of truth** — build script reads labels directly, no downstream regex overrides

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
