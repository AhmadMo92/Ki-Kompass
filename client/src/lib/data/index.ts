import occupationsData from "./occupations.json";
import skillsData from "./skills.json";

export type CategoryLabel = "automatable" | "high_ai_potential" | "sensitive" | "ai_assisted" | "human_led";

export type SkillCategory = "cognitive" | "social" | "digital" | "operational" | "domain" | "technical";

export interface TaskExplanation {
  what_it_means: string;
  why_it_fits: string;
  what_stays_human: string;
}

export interface TaskItem {
  id: string;
  text_de: string;
  text_en: string;
  label: CategoryLabel;
  score: number;
  skills: string[];
  explanation?: TaskExplanation;
}

export interface SkillInfo {
  name_en: string;
  name_de: string;
  definition_en: string;
  definition_de: string;
  category: SkillCategory;
}

export interface OccupationSummary {
  total: number;
  automatable: number;
  high_ai_potential: number;
  sensitive: number;
  ai_assisted: number;
  human_led: number;
}

export interface Occupation {
  occupation_de: string;
  sector: string;
  tasks: TaskItem[];
  summary: OccupationSummary;
}

export const occupations: Record<string, Occupation> = occupationsData as Record<string, Occupation>;
export const skills: Record<string, SkillInfo> = skillsData as Record<string, SkillInfo>;

export const CATEGORIES: Record<CategoryLabel, {
  label_de: string;
  label_en: string;
  color: string;
  bg: string;
  emoji: string;
  message_de: string;
  message_en: string;
  order: number;
}> = {
  automatable: {
    label_de: "Automatisierbar",
    label_en: "Automatable",
    color: "#E53935",
    bg: "#FFEBEE",
    emoji: "🔴",
    message_de: "KI oder Software kann einen Großteil dieses Workflows übernehmen",
    message_en: "AI or software can handle much of this workflow",
    order: 1
  },
  high_ai_potential: {
    label_de: "KI und etwas von dir",
    label_en: "AI and a bit of you",
    color: "#F57C00",
    bg: "#FFF3E0",
    emoji: "🟠",
    message_de: "KI macht den ersten Entwurf — du prüfst und verfeinerst",
    message_en: "AI does the first pass — you review and refine",
    order: 2
  },
  sensitive: {
    label_de: "Kontextabhängig",
    label_en: "Context-dependent",
    color: "#8E24AA",
    bg: "#F3E5F5",
    emoji: "🟣",
    message_de: "KI-Einsatz hängt vom regulatorischen Kontext ab",
    message_en: "AI exposure depends on regulatory context",
    order: 3
  },
  ai_assisted: {
    label_de: "Du und etwas KI",
    label_en: "You and a bit of AI",
    color: "#F9A825",
    bg: "#FFFDE7",
    emoji: "🟡",
    message_de: "Du entscheidest — KI hilft dir schneller zu werden",
    message_en: "You decide — AI helps speed things up",
    order: 4
  },
  human_led: {
    label_de: "Menschlich geführt",
    label_en: "Human-driven",
    color: "#43A047",
    bg: "#E8F5E9",
    emoji: "🟢",
    message_de: "Du führst — KI unterstützt im Hintergrund",
    message_en: "You lead — AI supports in the background",
    order: 5
  }
};

export const SKILL_CATEGORY_META: Record<SkillCategory, { label_en: string; label_de: string; color: string }> = {
  cognitive: { label_en: "Cognitive", label_de: "Kognitiv", color: "#1E88E5" },
  social: { label_en: "Social", label_de: "Sozial", color: "#43A047" },
  digital: { label_en: "Digital", label_de: "Digital", color: "#7B1FA2" },
  operational: { label_en: "Operational", label_de: "Operativ", color: "#F57C00" },
  domain: { label_en: "Domain", label_de: "Fachlich", color: "#00897B" },
  technical: { label_en: "Technical", label_de: "Technisch", color: "#546E7A" },
};

export const CATEGORY_ORDER: CategoryLabel[] = [
  "automatable", "high_ai_potential", "sensitive", "ai_assisted", "human_led"
];

export const SECTOR_AVERAGES: Record<string, Record<CategoryLabel, number>> = {
  tech:       { automatable: 0.11, high_ai_potential: 0.28, sensitive: 0.00, ai_assisted: 0.42, human_led: 0.19 },
  health:     { automatable: 0.05, high_ai_potential: 0.09, sensitive: 0.05, ai_assisted: 0.31, human_led: 0.51 },
  finance:    { automatable: 0.09, high_ai_potential: 0.20, sensitive: 0.07, ai_assisted: 0.39, human_led: 0.25 },
  law:        { automatable: 0.05, high_ai_potential: 0.13, sensitive: 0.10, ai_assisted: 0.36, human_led: 0.36 },
  marketing:  { automatable: 0.05, high_ai_potential: 0.22, sensitive: 0.00, ai_assisted: 0.51, human_led: 0.22 },
  management: { automatable: 0.02, high_ai_potential: 0.10, sensitive: 0.01, ai_assisted: 0.52, human_led: 0.35 },
  other:      { automatable: 0.04, high_ai_potential: 0.10, sensitive: 0.01, ai_assisted: 0.44, human_led: 0.40 },
};

export function getOccupationList(): { key: string; name_en: string; name_de: string; sector: string }[] {
  return Object.entries(occupations).map(([key, occ]) => ({
    key,
    name_en: key,
    name_de: occ.occupation_de,
    sector: occ.sector,
  }));
}

export function getOccupation(key: string): Occupation | undefined {
  return occupations[key];
}

export function getSkill(skillId: string): SkillInfo | undefined {
  return skills[skillId];
}

export function getOccupationSkillProfile(occupationKey: string): { skill: SkillInfo; skillId: string; count: number; byLabel: Record<CategoryLabel, number> }[] {
  const occ = occupations[occupationKey];
  if (!occ) return [];

  const skillCounts: Record<string, { count: number; byLabel: Record<CategoryLabel, number> }> = {};
  for (const task of occ.tasks) {
    for (const sid of task.skills) {
      if (!skillCounts[sid]) {
        skillCounts[sid] = { count: 0, byLabel: { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, human_led: 0 } };
      }
      skillCounts[sid].count++;
      skillCounts[sid].byLabel[task.label]++;
    }
  }

  return Object.entries(skillCounts)
    .map(([sid, data]) => ({
      skillId: sid,
      skill: skills[sid],
      count: data.count,
      byLabel: data.byLabel,
    }))
    .filter(s => s.skill)
    .sort((a, b) => b.count - a.count);
}

export function searchOccupations(query: string, language: "en" | "de" = "de", limit = 30): { key: string; name_en: string; name_de: string; sector: string }[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  const results: { key: string; name_en: string; name_de: string; sector: string }[] = [];

  for (const [key, occ] of Object.entries(occupations)) {
    const matchDe = occ.occupation_de.toLowerCase().includes(q);
    const matchEn = key.toLowerCase().includes(q);
    if (matchDe || matchEn) {
      results.push({ key, name_en: key, name_de: occ.occupation_de, sector: occ.sector });
      if (results.length >= limit) break;
    }
  }

  return results;
}

export function calculatePercentages(summary: OccupationSummary): Record<CategoryLabel, number> {
  const total = summary.total;
  if (total === 0) return { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, human_led: 0 };
  return {
    automatable: (summary.automatable / total) * 100,
    high_ai_potential: (summary.high_ai_potential / total) * 100,
    sensitive: (summary.sensitive / total) * 100,
    ai_assisted: (summary.ai_assisted / total) * 100,
    human_led: (summary.human_led / total) * 100,
  };
}

export function calculateFromTasks(tasks: TaskItem[]): Record<CategoryLabel, number> {
  const total = tasks.length;
  if (total === 0) return { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, human_led: 0 };

  const counts: Record<CategoryLabel, number> = { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, human_led: 0 };
  for (const t of tasks) {
    if (counts[t.label] !== undefined) counts[t.label]++;
  }

  return {
    automatable: (counts.automatable / total) * 100,
    high_ai_potential: (counts.high_ai_potential / total) * 100,
    sensitive: (counts.sensitive / total) * 100,
    ai_assisted: (counts.ai_assisted / total) * 100,
    human_led: (counts.human_led / total) * 100,
  };
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/(^-|-$)/g, '');
}

export function findOccupationBySlug(slug: string): { key: string; occupation: Occupation } | undefined {
  for (const [key, occ] of Object.entries(occupations)) {
    if (slugify(key) === slug || slugify(occ.occupation_de) === slug) {
      return { key, occupation: occ };
    }
  }
  return undefined;
}

let allTasksCache: (TaskItem & { occupationKey: string; occupationDe: string })[] | null = null;

export function getAllTasks(): (TaskItem & { occupationKey: string; occupationDe: string })[] {
  if (allTasksCache) return allTasksCache;
  const all: (TaskItem & { occupationKey: string; occupationDe: string })[] = [];
  for (const [key, occ] of Object.entries(occupations)) {
    for (const task of occ.tasks) {
      all.push({ ...task, occupationKey: key, occupationDe: occ.occupation_de });
    }
  }
  allTasksCache = all;
  return all;
}

export function searchTasks(query: string, limit = 20): (TaskItem & { occupationKey: string; occupationDe: string })[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];
  const allTasks = getAllTasks();
  const results: (TaskItem & { occupationKey: string; occupationDe: string })[] = [];
  for (const task of allTasks) {
    if (task.text_de.toLowerCase().includes(q) || task.text_en.toLowerCase().includes(q)) {
      results.push(task);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export const HERO_OCCUPATIONS = [
  "Web Developer",
  "Clinical Psychologist",
  "Lawyer",
  "Account Manager",
  "Midwife",
  "Data Scientist",
];

console.log(`[KI Kompass] Loaded ${Object.keys(occupations).length} occupations, ${Object.keys(skills).length} skills`);
