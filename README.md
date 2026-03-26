# KI Kompass — AI Workforce Intelligence

A bilingual (DE/EN) interactive dashboard that maps AI exposure across 540 German occupations and 6,079 tasks using a structured 5-category scoring system.

## What it does

Users select their occupation, review and personalize their task list, then receive a detailed AI exposure profile showing:

- Which tasks are automatable, AI-assisted, human-led, or context-dependent
- How their role compares to their sector average
- Which skills are shifting in value
- Which AI tools their peers are actually using (backed by real research data)
- A downloadable PDF report with personalized strategic recommendations

## Live demo

→ [ki-kompass.replit.app](https://ki-kompass.replit.app)

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript |
| Routing | Wouter |
| Styling | Tailwind CSS + shadcn/ui |
| Build | Vite |
| Backend | Express (static serving only) |
| PDF generation | jsPDF |
| Data | 540 German occupations from BERUFENET (Bundesagentur für Arbeit) |

---

## Project structure

```
client/src/
├── pages/
│   ├── Landing.tsx           # Landing page with category overview
│   ├── MyRole.tsx            # 3-step occupation analysis flow
│   ├── Beruf.tsx             # Direct occupation dashboard by URL slug
│   └── not-found.tsx
│
├── components/
│   ├── role-descriptor/
│   │   ├── MyRoleTasks.tsx       # 3-step flow: search → personalize → analyze
│   │   ├── OccupationDashboard.tsx  # Tabs: Overview / Tasks / Skills / Tools
│   │   ├── OccupationSearch.tsx  # Fuzzy occupation search (540 occupations)
│   │   ├── AIToolsMap.tsx        # AI tool recommendations per occupation
│   │   └── PeerUsage.tsx         # Research-backed adoption stats per sector
│   └── ui/                       # shadcn/ui primitives
│
└── lib/
    ├── data/
    │   ├── index.ts              # Core data functions and types
    │   ├── occupations.json      # 540 occupations, 6,079 tasks (1.6MB)
    │   ├── skills.json           # 118 skills with category metadata
    │   ├── skill-tools.json      # Skill → AI tool type mappings
    │   ├── tool-types.json       # 18 AI tool types with definitions
    │   ├── sector-tools.json     # Sector-specific tool examples
    │   ├── peer-usage.ts         # Research-backed adoption data per sector
    │   └── ai-tools.ts           # Tool recommendation logic
    ├── report-generator.ts       # PDF report generation (jsPDF)
    └── utils.ts
```

---

## The 5-category scoring system

Tasks are scored across 6 dimensions (PHYS, TPS, SIR, SPEC, VERIF, STD) and assigned one of five labels:

| Label | Meaning |
|---|---|
| `human_led` | Human-driven — AI only in the background |
| `ai_assisted` | You decide — AI helps speed things up |
| `high_ai_potential` | AI does the first pass — you review and refine |
| `automatable` | AI or software can handle much of this workflow |
| `sensitive` | Context-dependent — regulation, ethics, or trust determines approach |

---

## Data sources

**Occupation & task data**
- [BERUFENET](https://berufenet.arbeitsagentur.de) — German Federal Employment Agency occupation database
- 540 occupations · 6,079 tasks · 118 skills · 18 AI tool types

**Research & adoption data (peer usage panel)**
- Google DORA 2025, Stack Overflow 2025
- Anthropic Economic Index (Feb / Sep 2025 / Jan 2026) — ~1M real conversations
- OpenAI / Harvard NBER (Sep 2025) — 1.5M conversations
- McKinsey State of AI 2025
- EY Work Reimagined 2025
- Stanford Digital Economy Lab 2025
- Bitkom (May + Sep 2025) — Germany-specific
- AOK Wissenschaftsinstitut (Apr 2025) — Germany-specific
- ifo Konjunkturumfrage (Jun 2025) — Germany-specific
- LinkedIn Talent Trends 2025
- Deloitte, Capterra, Salesforce, AMA/Lightricks (2024–2025)

---

## Getting started

```bash
npm install
npm run dev
```

App runs on `http://localhost:5000`

---

## Key flows

**1. My Role (3-step)**
`/my-role` → search occupation → review & personalize tasks → view analysis + download PDF

**2. Direct occupation link**
`/beruf/:slug` → immediate dashboard for any occupation (shareable URL)

---

## Scoring note

Tasks scored with `confirmed: true` in the dataset are shown at reduced opacity — these are tasks flagged as vague or redundant during data auditing (319 of 6,079 tasks). They are excluded from analysis percentages.

---

## License

MIT — built as an academic prototype. Data from BERUFENET is publicly available from the German Federal Employment Agency.
