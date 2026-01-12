import jobsData from "./jobs.json";
import sectorsData from "./sectors.json";
import tasksData from "./tasks_by_job.json";

export interface Task {
  id: string;
  de: string;
  category: "human" | "ai_assisted" | "automation";
}

export interface JobTasks {
  job_de: string;
  job_en: string;
  tasks: Task[];
}

export const tasksByJob: Record<string, JobTasks> = tasksData as Record<string, JobTasks>;

export function getTasksForJob(jobId: string): Task[] {
  const categoryCode = jobId.split('-')[0];
  return tasksByJob[categoryCode]?.tasks || [];
}

export function calculatePersonalExposure(selectedTasks: Task[]): { human: number; ai_assisted: number; automation: number } {
  const total = selectedTasks.length;
  if (total === 0) return { human: 0, ai_assisted: 0, automation: 0 };
  
  return {
    human: (selectedTasks.filter(t => t.category === 'human').length / total) * 100,
    ai_assisted: (selectedTasks.filter(t => t.category === 'ai_assisted').length / total) * 100,
    automation: (selectedTasks.filter(t => t.category === 'automation').length / total) * 100,
  };
}

export interface TaskWithSource extends Task {
  jobCategory: string;
  jobDe: string;
  jobEn: string;
}

let allTasksCache: TaskWithSource[] | null = null;

export function getAllTasks(): TaskWithSource[] {
  if (allTasksCache) return allTasksCache;
  
  const allTasks: TaskWithSource[] = [];
  for (const [categoryCode, jobData] of Object.entries(tasksByJob)) {
    for (const task of jobData.tasks) {
      allTasks.push({
        ...task,
        jobCategory: categoryCode,
        jobDe: jobData.job_de,
        jobEn: jobData.job_en,
      });
    }
  }
  allTasksCache = allTasks;
  return allTasks;
}

export function searchTasks(query: string, limit = 20): TaskWithSource[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];
  
  const allTasks = getAllTasks();
  const results: TaskWithSource[] = [];
  
  for (const task of allTasks) {
    if (task.de.toLowerCase().includes(q)) {
      results.push(task);
      if (results.length >= limit) break;
    }
  }
  
  return results;
}

export interface Job {
  id: string;
  de: string;
  en: string;
  sector: string;
  human: number;
  ai_assisted: number;
  automation: number;
  dominant: "Human-Centric" | "AI-Assisted" | "Automation" | "Mixed";
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

console.log(`[Research Data] Loaded ${jobs.length} jobs with 3-category AI exposure scores`);
console.log(`[Research Data] Loaded ${Object.keys(tasksByJob).length} job categories with task-level data`);

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
    borderColor: "border-green-200",
    bgLight: "bg-green-50",
    textColor: "text-green-600",
    textBold: "text-green-700",
    icon: "👤",
    description: "Tasks requiring human presence, judgment, empathy, or physical interaction",
    examples: "Patient care, negotiations, teaching, creative direction",
  },
  "AI-Assisted": {
    color: "#3b82f6",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-200",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    textBold: "text-blue-700",
    icon: "🤝",
    description: "Complex work where AI tools enhance productivity but humans lead decision-making",
    examples: "Strategic analysis, architecture design, complex problem-solving, research",
  },
  "Automation": {
    color: "#f59e0b",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-200",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    textBold: "text-amber-700",
    icon: "🤖",
    description: "Tasks that AI agents can handle autonomously or routine tasks suitable for full automation",
    examples: "Code generation, data processing, scheduling, report writing, data entry",
  },
  "Mixed": {
    color: "#6b7280",
    bgColor: "bg-gray-500",
    borderColor: "border-gray-200",
    bgLight: "bg-gray-50",
    textColor: "text-gray-600",
    textBold: "text-gray-700",
    icon: "🔀",
    description: "Varied task profile across categories",
    examples: "Various tasks",
  },
};
