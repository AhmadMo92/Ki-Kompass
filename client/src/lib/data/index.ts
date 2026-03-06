import occupationsData from "./occupations.json";

export type CategoryLabel = "automatable" | "high_ai_potential" | "sensitive" | "ai_assisted" | "stays_with_you";

export interface TaskItem {
  id: string;
  text_de: string;
  text_en: string;
  label: CategoryLabel;
  score: number;
  is_regulated: boolean;
}

export interface OccupationSummary {
  total: number;
  automatable: number;
  high_ai_potential: number;
  sensitive: number;
  ai_assisted: number;
  stays_with_you: number;
}

export interface Occupation {
  occupation_de: string;
  sector: string;
  kldb2010: string;
  tasks: TaskItem[];
  summary: OccupationSummary;
}

export const occupations: Record<string, Occupation> = occupationsData as Record<string, Occupation>;

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
    message_de: "KI erledigt das heute schon",
    message_en: "AI can already do this today",
    order: 1
  },
  high_ai_potential: {
    label_de: "Hohes KI-Potenzial",
    label_en: "High AI Potential",
    color: "#F57C00",
    bg: "#FFF3E0",
    emoji: "🟠",
    message_de: "KI macht das meiste, du steuerst",
    message_en: "AI does most of it, you steer",
    order: 2
  },
  sensitive: {
    label_de: "Reguliert / Sensibel",
    label_en: "Regulated / Sensitive",
    color: "#8E24AA",
    bg: "#F3E5F5",
    emoji: "🟣",
    message_de: "KI könnte, aber Regulierung sagt Nein",
    message_en: "AI could, but regulation says no",
    order: 3
  },
  ai_assisted: {
    label_de: "KI-unterstützt",
    label_en: "AI-Assisted",
    color: "#F9A825",
    bg: "#FFFDE7",
    emoji: "🟡",
    message_de: "KI hilft dir, du führst",
    message_en: "AI helps you, you lead",
    order: 4
  },
  stays_with_you: {
    label_de: "Menschlich geführt",
    label_en: "Human Led",
    color: "#43A047",
    bg: "#E8F5E9",
    emoji: "🟢",
    message_de: "Das bleibt Menschenarbeit",
    message_en: "This stays human work",
    order: 5
  }
};

export const CATEGORY_ORDER: CategoryLabel[] = [
  "automatable", "high_ai_potential", "sensitive", "ai_assisted", "stays_with_you"
];

export const SECTOR_AVERAGES: Record<string, Record<CategoryLabel, number>> = {
  tech:       { automatable: 0.11, high_ai_potential: 0.28, sensitive: 0.00, ai_assisted: 0.41, stays_with_you: 0.20 },
  health:     { automatable: 0.00, high_ai_potential: 0.00, sensitive: 0.19, ai_assisted: 0.28, stays_with_you: 0.53 },
  finance:    { automatable: 0.00, high_ai_potential: 0.00, sensitive: 0.36, ai_assisted: 0.39, stays_with_you: 0.25 },
  law:        { automatable: 0.00, high_ai_potential: 0.00, sensitive: 0.28, ai_assisted: 0.37, stays_with_you: 0.35 },
  marketing:  { automatable: 0.05, high_ai_potential: 0.23, sensitive: 0.00, ai_assisted: 0.50, stays_with_you: 0.22 },
  management: { automatable: 0.03, high_ai_potential: 0.10, sensitive: 0.01, ai_assisted: 0.50, stays_with_you: 0.36 },
  other:      { automatable: 0.04, high_ai_potential: 0.11, sensitive: 0.01, ai_assisted: 0.43, stays_with_you: 0.41 },
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
  if (total === 0) return { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, stays_with_you: 0 };
  return {
    automatable: (summary.automatable / total) * 100,
    high_ai_potential: (summary.high_ai_potential / total) * 100,
    sensitive: (summary.sensitive / total) * 100,
    ai_assisted: (summary.ai_assisted / total) * 100,
    stays_with_you: (summary.stays_with_you / total) * 100,
  };
}

export function calculateFromTasks(tasks: TaskItem[]): Record<CategoryLabel, number> {
  const total = tasks.length;
  if (total === 0) return { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, stays_with_you: 0 };

  const counts: Record<CategoryLabel, number> = { automatable: 0, high_ai_potential: 0, sensitive: 0, ai_assisted: 0, stays_with_you: 0 };
  for (const t of tasks) {
    if (counts[t.label] !== undefined) counts[t.label]++;
  }

  return {
    automatable: (counts.automatable / total) * 100,
    high_ai_potential: (counts.high_ai_potential / total) * 100,
    sensitive: (counts.sensitive / total) * 100,
    ai_assisted: (counts.ai_assisted / total) * 100,
    stays_with_you: (counts.stays_with_you / total) * 100,
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

console.log(`[KI Kompass] Loaded ${Object.keys(occupations).length} occupations with 5-category AI exposure scores`);
