import jobsData from "./jobs.json";
import sectorsData from "./sectors.json";
import searchIndexData from "./search_index.json";

export interface Job {
  id: string;
  de: string;
  en: string;
  sector: string;
  human: number;
  ai: number;
  auto: number;
  dominant: "Human-Centric" | "AI-Augmentable" | "High Automation Exposure" | "Mixed";
}

export interface Sector {
  sector_name: string;
  avg_human: number;
  avg_ai: number;
  job_count: number;
}

export interface SearchEntry {
  id: string;
  de: string;
  en: string;
}

export const jobs: Job[] = jobsData as Job[];
export const sectors: Sector[] = sectorsData as Sector[];
export const searchIndex: SearchEntry[] = searchIndexData as SearchEntry[];

console.log(`[Research Data] Loaded ${jobs.length} jobs with AI exposure scores`);

export function searchJobs(query: string, language: "en" | "de" = "en", limit = 50): Job[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return jobs.filter(job => {
    const title = language === "de" ? job.de : job.en;
    return title.toLowerCase().includes(q);
  }).slice(0, limit);
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
