# KI Kompass — AI Workforce Intelligence Dashboard

## Overview
KI Kompass analyzes AI exposure for 540 German occupations (6,079 tasks) using a 5-category spectrum. Built with React + Express + PostgreSQL. Includes a skills layer mapping 118 competencies across 6 categories, 18 AI tool types with sector-specific recommendations, and occupation-level tool relevance computed from skill-tool links.

## Architecture
- **Frontend**: React + Vite + Tailwind + shadcn/ui + wouter routing
- **Backend**: Express server (minimal — most data is client-side JSON)
- **Data**: Single-source bundle (`bundle_v3_final_*.js`) converted to JSON files at build time

## Data Pipeline
Source: `attached_assets/bundle_v3_final_1773563342709.js` — single JSON bundle containing all data.

Bundle structure:
- `occs[]` — 540 occupation summaries (id, de, n, hl, aa, hp, se, au, kldb, bn)
- `tasks{}` — keyed by occupation name → array of task tuples [id, text_de, text_en, label, [PHYS,TPS,SIR,SPEC,VERIF,STD], score, rule, confidence, explanation_obj]
- `links{}` — keyed by task ID → array of [skillId, relevance] tuples (6,071 entries)
- `skills{}` — keyed by skill ID → {de, en, cat, def} (118 skills)
- `skillTools{}` — keyed by skill ID → array of [toolTypeId, relevance] tuples (109 entries)
- `toolTypes{}` — 18 tool types with {de, en, icon, desc, ex[]}
- `occSectors{}` — keyed by occupation name → sector string
- `sectorTools{}` — 11 sectors with {label_de, label_en, kldb_groups, n_occupations, tier1, tier2}

Conversion: `node` script in conversation history → generates:
- `client/src/lib/data/occupations.json` — 540 occupations with tasks + skill links
- `client/src/lib/data/skills.json` — 118 skills
- `client/src/lib/data/tool-types.json` — 18 AI tool types
- `client/src/lib/data/skill-tools.json` — skill → tool type mappings
- `client/src/lib/data/sector-tools.json` — sector-level tool recommendations

### 11 Sectors
it_informatik, finanzen_recht, gesundheit, unternehmensfuehrung, soziales_erziehung, vertrieb_handel, medien_marketing, kreativ_gestaltung, naturwissenschaft, wissenschaft_forschung, produktion_handwerk

### 18 AI Tool Types
TT-01 Writing, TT-02 Data/BI, TT-03 Code, TT-04 Research, TT-05 Presentation/Design, TT-06 Project Mgmt, TT-07 Communication, TT-08 Spreadsheet/Finance, TT-09 Sales/CRM, TT-10 Legal/Compliance, TT-11 Marketing/Content, TT-12 HR/Talent, TT-13 Document/Workflow Automation, TT-14 CAD/Engineering, TT-15 Cybersecurity, TT-16 Translation, TT-17 Medical/Health, TT-18 Supply Chain/Operations

### Distribution
| Category | Tasks | % |
|---|---|---|
| ai_assisted | ~2,510 | 41.3% |
| human_led | ~2,364 | 38.9% |
| high_ai_potential | ~766 | 12.6% |
| automatable | ~316 | 5.2% |
| sensitive | ~115 | 1.9% |

## 5-Category System
| Category | Label EN | Label DE | Color | Micro-label |
|---|---|---|---|---|
| `automatable` | Automatable | Automatisierbar | #E53935 (red) | AI or software can handle much of this workflow |
| `high_ai_potential` | AI and a bit of you | KI und etwas von dir | #F57C00 (orange) | AI does the first pass — you review and refine |
| `sensitive` | Context-dependent | Kontextabhängig | #8E24AA (purple) | AI exposure depends on regulatory context |
| `ai_assisted` | You and a bit of AI | Du und etwas KI | #F9A825 (yellow) | You decide — AI helps speed things up |
| `human_led` | Human-driven | Menschlich geführt | #43A047 (green) | You lead — AI supports in the background |

Task explanations (154 tasks across 10 test occupations) have 3-part structure: `what_it_means`, `why_it_fits`, `what_stays_human`. These render as expandable 3-column cards in the task list.

## Skills Layer (6 Categories, 118 total)
| Category | Color |
|---|---|
| cognitive | #1E88E5 |
| social | #43A047 |
| operational | #F57C00 |
| digital | #7B1FA2 |
| domain | #00897B |
| technical | #546E7A |

Each task links to 2-3 skills with relevance scores. Skills profile shows which competencies dominate an occupation and how they map to AI exposure categories. Skill-tool links (109 skills → 18 tool types) enable occupation-specific tool recommendations.

## Key Data Files
- `client/src/lib/data/occupations.json` — 540 occupations, 6,079 tasks with skill IDs
- `client/src/lib/data/skills.json` — 118 skills with bilingual names/definitions
- `client/src/lib/data/tool-types.json` — 18 AI tool types with icons, descriptions, examples
- `client/src/lib/data/skill-tools.json` — skill → tool type relevance mappings
- `client/src/lib/data/sector-tools.json` — 11 sectors with tier1/tier2 tool recommendations
- `client/src/lib/data/index.ts` — Data layer, types, search, categories, sector averages (computed dynamically), skill/tool helpers
- `client/src/lib/data/ai-tools.ts` — Curated 8-node tool map with real logos (legacy, being superseded by toolTypes)

## Important Rules
- **Labels are final in bundle** — no downstream regex or label manipulation
- **Percentages come from task counts** in occupations.json `summary` field
- **Sector averages computed dynamically** from all occupation data via `computeSectorAverages()`
- **5 categories only** — old 3-category system is deprecated
- **English first** — UI defaults to English, user can toggle to German
- **Bilingual**: All tasks have `text_de` and `text_en`, skills have `name_de`/`name_en`
- **Task schema**: id, text_de, text_en, label, score, skills[] (array of skill_id strings)
- **Tool recommendations**: `getOccupationToolRecommendations()` aggregates skill→tool weights for all AI-exposed tasks

## Routes
- `/` — Landing page: journey (4-step path), dashboard preview, companion concept
- `/my-role` — Main analysis page (3-step flow: search → task selection → dashboard)
- `/beruf/:slug` — Shareable occupation profile page

## Key Components
- `Landing` — Journey-oriented landing page with four pillars
- `MyRoleTasks` — 3-step flow: Step 1 (select occupation) → Step 2 (review/customize tasks with checkboxes, select/deselect all per category, smart typeahead from 6,079 task pool) → Step 3 (OccupationDashboard with initialDeselected + initialCustomTasks)
- `OccupationDashboard` — **Tabbed layout** (Overview, Tasks, Skills, Tools). Accepts `initialDeselected`, `initialCustomTasks`, `onBackToTasks` props. Overview shows donut + distribution bars + sector comparison. Tasks shows collapsible category groups with toggles and expandable 3-column explanations. Skills shows competency bars. Tools shows curated AI toolkit.
- `AIToolsMap` — Curated AI toolkit: 8 category nodes with top 3 real-world tools each. Tool logos in `client/public/tool-logos/`.
- `SectorComparison` — Stacked bar comparison: occupation vs sector average. Uses dynamic sector labels from sectorTools data.
- `DonutChart` — SVG donut with 5 category segments
- `OccupationSearch` — Type-ahead search across 540 occupations
