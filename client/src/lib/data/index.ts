import jobsData from "./jobs.json";
import sectorsData from "./sectors.json";

export interface Job {
  id: string;
  de: string;
  en: string;
  sector: string;
  human: number;
  ai: number;
  auto: number;
  dominant: "Human-Centric" | "AI-Augmentable" | "High Automation Exposure" | "Mixed";
  aliases: string[];
}

export interface Sector {
  sector_name: string;
  avg_human: number;
  avg_ai: number;
  job_count: number;
}

export interface SearchResult extends Job {
  matchType: "alias_exact" | "alias_partial" | "title";
  matchedAlias?: string;
}

export const jobs: Job[] = jobsData as Job[];
export const sectors: Sector[] = sectorsData as Sector[];

console.log(`[Research Data] Loaded ${jobs.length} jobs with AI exposure scores and aliases`);

export function searchJobs(query: string, language: "en" | "de" = "en", limit = 50): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];
  
  const results: SearchResult[] = [];
  const addedIds = new Set<string>();

  for (const job of jobs) {
    if (addedIds.has(job.id)) continue;
    const aliases = job.aliases || [];
    const exactMatch = aliases.find(a => a.toLowerCase() === q);
    if (exactMatch) {
      results.push({ ...job, matchType: "alias_exact", matchedAlias: exactMatch });
      addedIds.add(job.id);
    }
  }

  for (const job of jobs) {
    if (addedIds.has(job.id)) continue;
    const aliases = job.aliases || [];
    const partialMatch = aliases.find(a => a.toLowerCase().includes(q));
    if (partialMatch) {
      results.push({ ...job, matchType: "alias_partial", matchedAlias: partialMatch });
      addedIds.add(job.id);
    }
  }

  for (const job of jobs) {
    if (addedIds.has(job.id)) continue;
    const title = language === "de" ? job.de : job.en;
    if (title.toLowerCase().includes(q) || job.en.toLowerCase().includes(q) || job.de.toLowerCase().includes(q)) {
      results.push({ ...job, matchType: "title" });
      addedIds.add(job.id);
    }
  }

  return results.slice(0, limit);
}

export function getJobById(jobId: string): Job | undefined {
  return jobs.find(job => job.id === jobId);
}

export function getJobsBySector(sectorName: string): Job[] {
  return jobs.filter(job => job.sector === sectorName);
}

export function getSectorStats(): Sector[] {
  return sectors;
}

export const CATEGORIES = {
  "Human-Centric": {
    color: "#22c55e",
    bgColor: "bg-green-500",
    description: "Tasks requiring human presence, judgment, or interpersonal skills",
  },
  "AI-Augmentable": {
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    description: "Tasks where AI tools can assist and enhance productivity",
  },
  "High Automation Exposure": {
    color: "#f59e0b",
    bgColor: "bg-amber-500",
    description: "Routine tasks with high potential for automation",
  },
  "Mixed": {
    color: "#8b5cf6",
    bgColor: "bg-purple-500",
    description: "Varied task profile across categories",
  },
};
