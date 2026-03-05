# SIR Scoring & Classification Rubric Issues Report
## KI Kompass — Task Classification Audit (March 2026)

**Dataset:** `scored_tasks_v1_3` — 522 German occupations, 5,885 tasks  
**Categories:** automatable | high_ai_potential | sensitive | ai_assisted | stays_with_you

---

## Executive Summary

We discovered that **465 tasks** in the v1.3 scored dataset are classified as `ai_assisted` despite containing clear interpersonal interaction signals (leading, advising, teaching, coordinating, collaborating, etc.). The root cause is the **SIR (Social Interaction Required) dimension being systematically under-scored** by the LLM scorer. This affects 30% of all `ai_assisted` tasks spread across 291 of 522 occupations.

Additionally, a **MinFloor rule** forces 80 tasks into `stays_with_you` regardless of their actual nature, producing anomalies like "Process business transactions according to guidelines" being classified as human-essential.

---

## Issue 1: SIR Dimension Systematically Under-Scored

### The Evidence

SIR is scored as a binary (0 or 1) indicating whether a task requires social interaction. The distribution reveals a critical problem:

| Category | Total Tasks | SIR=0 | SIR=1 |
|---|---|---|---|
| automatable | 309 | 309 (100%) | 0 (0%) |
| high_ai_potential | 829 | 829 (100%) | 0 (0%) |
| sensitive | 16 | 16 (100%) | 0 (0%) |
| **ai_assisted** | **3,105** | **3,105 (100%)** | **0 (0%)** |
| stays_with_you | 1,626 | 959 (59%) | **667 (41%)** |

**SIR=1 appears ONLY in `stays_with_you`.** The LLM scorer never assigned SIR=1 to any task that wasn't already being routed to `stays_with_you` through other means. This means SIR is not functioning as an independent signal — it's merely confirming decisions already made by other dimensions.

### Examples of SIR=0 Misscoring

These `ai_assisted` tasks all have SIR=0 despite clearly requiring interpersonal interaction:

| Task | Occupation | Score Sum | SIR |
|---|---|---|---|
| "Lead employees in the department" | Department Manager | 1 | 0 |
| "Work with designers on new websites" | Web Developer | 0 | 0 |
| "Advise unemployed people and job seekers" | Advisor for Employment | 3 | 0 |
| "Teach practical knowledge in sales psychology" | Trainer | 5 | 0 |
| "Negotiate contracts with suppliers" | Account Manager | 3 | 0 |
| "Coordinate different company departments" | Head of Marketing | 3 | 0 |
| "Discuss concepts and adjust them" | Business Economist | 3 | 0 |
| "Select and train employees" | Head of Marketing | 1 | 0 |
| "Recruit, support, and train volunteers" | Volunteer Coordinator | 3 | 0 |

### Root Cause: SIR Prompt Too Narrow

The current SIR scoring prompt appears to require the task to be **primarily** about social interaction (e.g., "Comfort grieving families", "Counsel patients"). It fails to flag tasks where interpersonal interaction is a **necessary component** even though the task also involves other elements (planning, domain knowledge, decision-making).

### Why Fixing SIR Alone Won't Reclassify These Tasks

The classification rule for `stays_with_you` is: `score_sum >= 6` OR a gate rule (PHYS=1, TPS=1, or SIR=1).

Most of these misclassified tasks have score_sum between 0-3. Adding SIR=1 would increase their sum by 1, but:
- sum=0 → sum=1 (still ai_assisted)
- sum=3 → sum=4 (still ai_assisted)
- sum=5 → sum=6 (crosses to stays_with_you — only 15-35 tasks)

**However**, SIR=1 is also a **gate rule** (`Gate: SIR=1` routes directly to `stays_with_you` regardless of score_sum). So if the LLM correctly assigns SIR=1, the gate rule will handle the reclassification — the threshold math becomes irrelevant.

---

## Issue 2: V1.3 SoftSkill Keywords — Incomplete Coverage

The v1.3 pipeline introduced a keyword-based override to catch interpersonal tasks that SIR missed. This system reclassified **172 tasks** using patterns like:

| Keyword | Tasks Reclassified |
|---|---|
| "Collaborate with" | 30 |
| "Supervise" / "supervise" | 21 |
| "Train employees" / "train employees" | 20 |
| "motivat" | 10 |
| "counsel" | 7 |
| "Advise customers/clients/employees/management" | 20 |
| "conduct training/seminar/workshop" | 12 |
| "coach" | 5 |
| "mediat" | 3 |
| Others (represent, brief, facilitate, etc.) | 44 |

**The problem:** These keywords are **case-sensitive** and **incomplete**. For example:
- "Collaborate with" catches 24 tasks, "collaborate with" catches 6 — but "Work with" catches 0
- "supervise" is covered, but "lead", "coordinate", "discuss", "advise" (without specific recipient) are not
- Teaching verbs like "teach", "instruct", "educate" are not covered at all
- Coordination without "with" (e.g., "Coordinate different departments") is missed

This left **465 tasks** still misclassified as `ai_assisted` despite having interpersonal signals.

---

## Issue 3: MinFloor Rule Creates Anomalies

The pipeline includes a `min_floor_1_per_occupation` rule that guarantees at least one task per occupation is classified as `stays_with_you`. This affected **80 tasks** across 80 occupations.

### How It Works
When an occupation has zero tasks naturally classified as `stays_with_you`, the rule selects the "most suitable" task (typically highest score_sum) and forces it into `stays_with_you`.

### Problem Cases

| Occupation | Forced Task | Original Label | Why It's Wrong |
|---|---|---|---|
| Document Clerk (Bank) | "Process business transactions according to guidelines" | high_ai_potential (sum=6) | Purely procedural, rule-following work |
| Editor-in-Chief | "Take on editorial tasks" | ai_assisted (sum=0) | Vague, not interpersonal |
| Email Marketing Manager | "Search, select, and prepare topics editorially" | ai_assisted (sum=3) | Content selection, not human interaction |
| Film Managing Director | "Support productions in accounting and business" | ai_assisted (sum=3) | Back-office administrative work |

### Acceptable Cases (MinFloor picked well)
| Occupation | Forced Task | Why It's OK |
|---|---|---|
| Business Economist | "Discuss concepts and adjust them" | Discussion IS interpersonal |
| Web Developer | "Analyze customer needs" | Customer interaction IS interpersonal |
| Data Scientist | "Take technical lead on big data projects" | Leading IS interpersonal |
| Blockchain Developer | "Develop use cases with customers" | Customer interaction IS interpersonal |

**Recommendation:** The MinFloor rule masks reality for highly automatable occupations. Consider either:
1. Removing the MinFloor rule entirely and allowing occupations to show 0% stays_with_you
2. Keeping it but applying it more judiciously (only force tasks that actually have interpersonal signals)

---

## Our Downstream Fix (Applied in KI Kompass Build Pipeline)

Since we can't re-run the LLM scorer, we applied a regex-based reclassification in `scripts/build-occupations.cjs` to correct the most obvious SIR misscores. This mirrors what the SIR gate rule *should* have done.

### Pattern Categories and Task Counts

| Category | Patterns | Tasks Reclassified |
|---|---|---|
| **Leadership** | lead, leading, supervise, manage + people | ~85 |
| **Training/Teaching** | train + people, teach + subject/people, instruct, educate (verb) | ~60 |
| **Advising** | advise, advising, advisory, advice, counsel | ~80 |
| **Collaboration** | work with, collaborate, cooperate, coordinate, consult with, liaise | ~130 |
| **Mentoring** | mentor, coach/coaching, motivate, guide + people | ~30 |
| **Communication** | discuss, communicate (verb), present to, explain to, inform + people | ~50 |
| **Negotiation** | negotiate, mediate, resolve/handle conflict, convince | ~15 |
| **Hiring** | hire/hiring, recruit + people, interview + people, delegate, assign + work | ~10 |
| **Representation** | represent + organization, acquire + customer | ~5 |

**Total reclassified: 465 tasks** (from `ai_assisted` → `stays_with_you`)

### Patterns We Intentionally Excluded

We learned through iteration that some patterns must be restricted to **verb forms only** to avoid false positives with noun forms:

| Pattern | Problem | Fix |
|---|---|---|
| `/\bcommunicat/i` | Matches "communication channels" (a noun) | Changed to `/\bcommunicat(?:e\|ing)\b/i` |
| `/\beducat/i` | Matches "education system", "educational concepts" | Changed to `/\beducat(?:e\|ing)\b/i` |
| `/\bteach/i` | Matches "teaching materials", "teacher" | Restricted to teach + people/subjects |
| `/\bcoordinat.*\bwith\b/i` | Missed "Coordinate departments" (no "with") | Broadened to `/\bcoordinat/i` |
| `/\brecruit/i` | Matches "recruiting strategies" (planning) | Restricted to recruit + people |
| `/\binterview\b/i` | Matches "interview guides" (creating docs) | Restricted to interview + people |

### Impact on Overall Distribution

| Category | Original CSV | After Fix | Change |
|---|---|---|---|
| automatable | 309 (5.3%) | 309 (5.3%) | — |
| high_ai_potential | 829 (14.1%) | 829 (14.1%) | — |
| sensitive | 16 (0.3%) | 16 (0.3%) | — |
| ai_assisted | 3,105 (52.8%) | 2,640 (44.9%) | −465 |
| stays_with_you | 1,626 (27.6%) | 2,091 (35.5%) | +465 |

### Impact by Sector

| Sector | ai_assisted (before → after) | stays_with_you (before → after) |
|---|---|---|
| other | 54.0% → 46.0% | 30.2% → 38.0% |
| finance | 47.0% → 39.0% | 17.0% → 25.0% |
| management | 66.0% → 53.0% | 20.0% → 32.0% |
| health | 38.0% → 32.0% | 42.0% → 48.0% |
| marketing | 60.0% → 50.0% | 12.0% → 22.0% |
| tech | 46.0% → 42.0% | 14.0% → 18.0% |
| law | 42.0% → 36.0% | 29.0% → 35.0% |

---
## Recommended Rubric Changes for V2

### Fix 1: Rewrite the SIR Scoring Prompt

**Current behavior:** SIR=1 only when the task is *primarily about* social interaction.

**Proposed prompt:**

> Score SIR=1 if the task inherently requires interpersonal engagement that AI cannot replicate. This includes ANY of the following:
>
> - **Leading/Managing:** Leading, managing, supervising, or delegating to people
> - **Teaching/Training:** Teaching, training, instructing, or educating others (not creating teaching materials)
> - **Advising/Counseling:** Advising, counseling, or consulting with people
> - **Collaborating:** Collaborating, coordinating, or working with others toward a shared goal
> - **Communicating:** Presenting, explaining, or communicating findings/decisions to stakeholders (not writing reports)
> - **Hiring:** Recruiting, interviewing, or making hiring decisions
> - **Negotiating:** Negotiating, mediating, or resolving conflicts between parties
> - **Caring/Supporting:** Caring for, supporting, or guiding clients, patients, or students
> - **Representing:** Representing an organization in external relationships
>
> Score SIR=0 ONLY if the task can be performed entirely without meaningful human-to-human interaction — even if the output eventually reaches people.
>
> **Important distinctions:**
> - "Advise clients on products" → SIR=1 (direct advisory relationship)
> - "Write a product advisory document" → SIR=0 (creating a document)
> - "Coordinate the marketing team" → SIR=1 (interpersonal coordination)
> - "Create a coordination schedule" → SIR=0 (creating a document)
> - "Teach employees new processes" → SIR=1 (direct teaching)
> - "Create teaching materials" → SIR=0 (creating materials)
> - "Communicate findings to leadership" → SIR=1 (presenting to people)
> - "Write a communication strategy" → SIR=0 (planning/writing)

### Fix 2: Keep SIR=1 as a Gate Rule

The current gate rule (`Gate: SIR=1` → direct route to `stays_with_you`) is correct and should be maintained. Combined with a properly scored SIR dimension, this will catch all interpersonal tasks automatically without needing keyword overrides.

### Fix 3: Reconsider the MinFloor Rule

Options:
1. **Remove it:** Let highly automatable occupations show 0% stays_with_you (more honest)
2. **Restrict it:** Only apply MinFloor to tasks that have at least one non-zero interpersonal dimension (SIR > 0 or TPS > 0)
3. **Flag it:** Keep MinFloor but add a `forced_by_minfloor=true` flag so downstream consumers can filter or display it differently

### Fix 4: Address Verb vs. Noun Confusion

The LLM scorer should be instructed to distinguish between:
- **Verb usage** (performing the action): "Advise clients" = interpersonal
- **Noun/domain usage** (the field/topic): "Advise on educational opportunities" = might be interpersonal, might not
- **Material creation** (producing artifacts): "Create teaching materials" = NOT interpersonal

This distinction was the source of many false positives in our downstream fix and likely affects the original LLM scoring as well.

---

## Remaining Known Issues

1. **~5-6 coordinate false positives:** Our broadened `/\bcoordinat/i` pattern catches a few process-coordination tasks like "Coordinate content localization for international target markets" that are more about workflow management than interpersonal interaction. Minor.

2. **MinFloor anomalies (80 tasks):** We did not override these in our downstream fix. They remain as classified in the source CSV. The most visible anomaly is Document Clerk (Bank): "Process business transactions according to guidelines."

3. **Potential remaining misclassifications:** There are approximately 2,640 tasks still in `ai_assisted`. Some may contain interpersonal signals we haven't patterned for. A re-scoring with the fixed SIR prompt would be the comprehensive solution.

---

## Files Modified

| File | Change |
|---|---|
| `scripts/build-occupations.cjs` | Added 30+ interpersonal regex patterns to reclassify ai_assisted → stays_with_you |
| `client/src/lib/data/occupations.json` | Rebuilt with corrected classifications |
| `client/src/lib/data/index.ts` | Updated SECTOR_AVERAGES constants to reflect new distribution |

---

*Report generated March 3, 2026 — KI Kompass data quality audit*
