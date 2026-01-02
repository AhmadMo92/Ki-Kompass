import { competencies, occupations } from "@/lib/occupations";

// Mock Data: Role -> Task Profiles
// This simulates a database of standard role definitions and their typical tasks.

export interface TaskDefinition {
  id: string;
  label: string; // Default label (English preferred)
  labelDe?: string; // German label
  labelEn?: string; // English label
  category: string;
  defaultWeight: number;
}

export interface RoleProfile {
  id: string;
  label: string;
  defaultTasks: TaskDefinition[];
}

export interface AIInteraction {
  type: "Augmented" | "Automated" | "Human-Dominant";
  description: string;
}

// Deterministic random number generator seeded by string
function sfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
}

function getSeededRandom(seed: string) {
  // Simple hash to get seed numbers
  let h = 0xdeadbeef;
  for(let i = 0; i < seed.length; i++)
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  
  const seed1 = (h ^ (h >>> 16)) >>> 0;
  const seed2 = (h ^ (h >>> 12)) >>> 0;
  const seed3 = (h ^ (h >>> 8)) >>> 0;
  const seed4 = (h ^ (h >>> 4)) >>> 0;
  
  return sfc32(seed1, seed2, seed3, seed4);
}

function tokenize(text: string): string[] {
  if (!text) return [];
  
  const rawTokens = text.toLowerCase()
    .replace(/[^\w\säöüß]/g, '') // Keep German chars
    .split(/\s+/)
    .filter(w => w.length > 3); // Skip small words

  // Synonym Expansion
  const expandedTokens: string[] = [];
  
  const SYNONYMS: Record<string, string[]> = {
    // English -> German/Synonyms
    "manager": ["leitung", "führung", "management", "head", "leader", "leiter"],
    "engineer": ["ingenieur", "technik", "engineering", "technical"],
    "developer": ["entwickler", "software", "programmer", "it", "coding", "programmierer"],
    "teacher": ["lehrer", "education", "bildung", "schulung", "tutor", "pädagoge"],
    "nurse": ["pflege", "krankenschwester", "health", "gesundheit", "patient", "medical"],
    "assistant": ["assistenz", "support", "unterstützung", "sekretär", "admin"],
    "consultant": ["berater", "consulting", "beratung"],
    "driver": ["fahrer", "transport", "logistik", "truck"],
    "sales": ["vertrieb", "verkauf", "sales", "kunden"],
    "marketing": ["marketing", "werbung", "pr", "market"],
    // German -> English/Synonyms
    "leitung": ["manager", "management", "head", "leader"],
    "entwickler": ["developer", "software", "it"],
    "lehrer": ["teacher", "education", "school"],
    "pflege": ["nurse", "care", "health"],
    "vertrieb": ["sales", "selling"]
  };

  rawTokens.forEach(t => {
    expandedTokens.push(t);
    if (SYNONYMS[t]) {
      expandedTokens.push(...SYNONYMS[t]);
    }
  });

  return expandedTokens;
}

// Heuristic Rules to inject specific tasks based on role seniority/type
function applyHeuristics(roleName: string, tasks: TaskDefinition[]): TaskDefinition[] {
  const lowerName = roleName.toLowerCase();
  const newTasks = [...tasks];
  
  // Rule 1: Management Roles get Strategy & Leadership
  if (lowerName.includes("manager") || lowerName.includes("leitung") || lowerName.includes("head") || lowerName.includes("chef")) {
    newTasks.unshift({
      id: "h-strat",
      label: "Strategic Planning & Goal Setting",
      labelDe: "Strategische Planung & Zielsetzung",
      labelEn: "Strategic Planning & Goal Setting",
      category: "Planning",
      defaultWeight: 0.3
    });
    newTasks.unshift({
      id: "h-lead",
      label: "Team Leadership & Development",
      labelDe: "Teamführung & Entwicklung",
      labelEn: "Team Leadership & Development",
      category: "Human Interaction",
      defaultWeight: 0.3
    });
  }

  // Rule 2: Senior Roles get Mentoring
  if (lowerName.includes("senior") || lowerName.includes("lead")) {
    newTasks.push({
      id: "h-mentor",
      label: "Mentoring Junior Staff",
      labelDe: "Mentoring von Junior-Mitarbeitern",
      labelEn: "Mentoring Junior Staff",
      category: "Human Interaction",
      defaultWeight: 0.15
    });
  }

  // Rule 3: Assistant/Support Roles get Scheduling
  if (lowerName.includes("assistant") || lowerName.includes("assistenz") || lowerName.includes("support")) {
    newTasks.push({
      id: "h-sched",
      label: "Schedule & Calendar Management",
      labelDe: "Termin- & Kalenderverwaltung",
      labelEn: "Schedule & Calendar Management",
      category: "Coordination",
      defaultWeight: 0.2
    });
  }

  return newTasks;
}

// 5. GENERIC "SAFE" TASKS
// Used as a fallback instead of random selection to prevent "odd" matches.
const GENERIC_TASKS: TaskDefinition[] = [
  { id: "gen-1", label: "Project Coordination", labelDe: "Projektkoordination", labelEn: "Project Coordination", category: "Coordination", defaultWeight: 0.2 },
  { id: "gen-2", label: "Team Communication", labelDe: "Teamkommunikation", labelEn: "Team Communication", category: "Human Interaction", defaultWeight: 0.2 },
  { id: "gen-3", label: "Documentation & Reporting", labelDe: "Dokumentation & Berichtswesen", labelEn: "Documentation & Reporting", category: "Documentation", defaultWeight: 0.2 },
  { id: "gen-4", label: "Quality Assurance", labelDe: "Qualitätssicherung", labelEn: "Quality Assurance", category: "Monitoring", defaultWeight: 0.2 },
  { id: "gen-5", label: "Problem Solving", labelDe: "Problemlösung", labelEn: "Problem Solving", category: "Problem Solving", defaultWeight: 0.2 },
  { id: "gen-6", label: "Workflow Planning", labelDe: "Arbeitsablaufplanung", labelEn: "Workflow Planning", category: "Planning", defaultWeight: 0.2 },
  { id: "gen-7", label: "Data Management", labelDe: "Datenverwaltung", labelEn: "Data Management", category: "Analysis", defaultWeight: 0.2 },
  { id: "gen-8", label: "Client/Stakeholder Support", labelDe: "Kunden-/Stakeholder-Betreuung", labelEn: "Client/Stakeholder Support", category: "Human Interaction", defaultWeight: 0.2 },
  { id: "gen-9", label: "Compliance Monitoring", labelDe: "Einhaltung von Richtlinien", labelEn: "Compliance Monitoring", category: "Monitoring", defaultWeight: 0.2 },
  { id: "gen-10", label: "Strategic Alignment", labelDe: "Strategische Ausrichtung", labelEn: "Strategic Alignment", category: "Planning", defaultWeight: 0.2 }
];

// Generate tasks from competencies based on role ID
function generateTasksFromCompetencies(roleId: string): TaskDefinition[] {
  const role = occupations.find(o => o.id === roleId);
  const rand = getSeededRandom(roleId);
  const categories = ["Analysis", "Coordination", "Documentation", "Problem Solving", "Planning", "Monitoring"];
  
  // Strategy: Semantic Matching
  // Since we don't have a direct mapping file, we match words in the Role Name 
  // with words in the Competency Name.
  
  let selectedCompetencies: any[] = [];
  
  if (role) {
    const roleTokens = new Set([
      ...tokenize(role.nameDe),
      ...tokenize(role.nameEn)
    ]);

    // Simple Scoring: +1 for each matching token
    // We only scan a random subset to improve performance if list is huge, 
    // but 9k is fast enough for modern JS engines (approx 2-5ms).
    const scored = competencies.map(comp => {
      let score = 0;
      const compTokens = tokenize(comp.nameDe + " " + comp.nameEn);
      
      for(const t of compTokens) {
        if(roleTokens.has(t)) score += 10; // Strong match
        // Partial match check (slower but better)
        else {
           // Iterate manually to avoid downlevelIteration issues with Set
           roleTokens.forEach(rt => {
             if(t.includes(rt) || rt.includes(t)) score += 2;
           });
        }
      }
      return { comp, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);
    
    // Take top 5 relevant matches (only if they have a decent score)
    const topMatches = scored.filter(s => s.score >= 10).slice(0, 5).map(s => s.comp);
    selectedCompetencies = [...topMatches];
  }
  
  // Fill the rest with GENERIC SAFE TASKS
  // We prioritize high-quality general tasks over random database hits
  const targetCount = Math.floor(rand() * 3) + 6; // 6 to 8 tasks total
  
  // Create a pool of generic tasks
  const genericPool = [...GENERIC_TASKS];
  
  // Shuffle generic pool deterministically
  for (let i = genericPool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [genericPool[i], genericPool[j]] = [genericPool[j], genericPool[i]];
  }

  // Map generic tasks to match TaskDefinition structure (just in case)
  // But GENERIC_TASKS is already TaskDefinition, so we need to be careful mixing types
  // Actually, selectedCompetencies are "Competency" type, we map them later.
  // Let's map everything to TaskDefinition at the end.
  
  // We need to keep track of what we have. 
  // selectedCompetencies contains "Competency" objects.
  
  const finalTasks: TaskDefinition[] = selectedCompetencies.map(comp => {
    const catIndex = Math.floor(rand() * categories.length);
    return {
      id: comp.id,
      label: comp.nameEn || comp.nameDe,
      labelEn: comp.nameEn,
      labelDe: comp.nameDe,
      category: categories[catIndex],
      defaultWeight: 0.2
    };
  });

  // Now fill with Generic Tasks until we reach target
  let genIndex = 0;
  while (finalTasks.length < targetCount && genIndex < genericPool.length) {
    // Avoid duplicates by label check (simple)
    const candidate = genericPool[genIndex];
    if (!finalTasks.some(t => t.label === candidate.label)) {
      finalTasks.push(candidate);
    }
    genIndex++;
  }

  // Apply Heuristic Rules (these add very specific high-value tasks)
  let tasksWithHeuristics = finalTasks;
  if (role) {
    tasksWithHeuristics = applyHeuristics(role.nameEn + " " + role.nameDe, finalTasks);
  }

  return tasksWithHeuristics;
}

// 4. API Integration for Real AI Generation
export async function generateTasksWithAI(roleName: string, language: "en" | "de"): Promise<TaskDefinition[]> {
  try {
    const response = await fetch("/api/generate-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleName, language })
    });

    if (!response.ok) {
       // If 503, it means no API key, so we fall back to local generation silently or throw specific error
       if (response.status === 503) {
         console.warn("AI Generation unavailable (no key), falling back to rule-based.");
         return [];
       }
       throw new Error("Failed to fetch tasks");
    }

    const data = await response.json();
    return data.tasks.map((t: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      label: t.label,
      category: t.category,
      defaultWeight: 0.2
    }));

  } catch (error) {
    console.error("AI Task Generation failed:", error);
    return [];
  }
}

export const getTasksForRole = (roleId: string, group: string): TaskDefinition[] => {
  // Use the new dynamic generator
  return generateTasksFromCompetencies(roleId);
};

export const AVAILABLE_ROLES = []; // Not used directly anymore as we use the full list

// 2. Task Category -> AI Interaction Mapping
export const CATEGORY_INTERACTIONS: Record<string, AIInteraction> = {
  "Coordination": { type: "Automated", description: "Scheduling & logistics can be heavily automated." },
  "Planning": { type: "Augmented", description: "AI assists with scenarios and data, human decides." },
  "Documentation": { type: "Augmented", description: "Generative AI drafts content, human edits." },
  "Monitoring": { type: "Automated", description: "Continuous tracking is better suited for machines." },
  "Decision Support": { type: "Human-Dominant", description: "Final judgment and accountability remain human." },
  "Communication": { type: "Augmented", description: "AI helps draft and summarize, human connects." },
  "Analysis": { type: "Augmented", description: "AI processes data, human interprets insights." },
  "Human Interaction": { type: "Human-Dominant", description: "Empathy and negotiation are strictly human." },
  "Admin": { type: "Automated", description: "Routine processing is highly automatable." },
  "Problem Solving": { type: "Human-Dominant", description: "Handling novel exceptions requires human adaptability." },
  "Manual Operation": { type: "Augmented", description: "Robotics/AI assist physical tasks but don't fully replace." }
};

// 3. Analysis Logic
export interface ImpactResult {
  breakdown: {
    augmented: number;
    automated: number;
    human: number;
  };
  taskDetails: {
    taskLabel: string;
    category: string;
    interactionType: string;
    description: string;
  }[];
}

export function analyzeTaskProfile(tasks: TaskDefinition[]): ImpactResult {
  let augmentedWeight = 0;
  let automatedWeight = 0;
  let humanWeight = 0;
  let totalWeight = 0;

  const taskDetails = tasks.map(task => {
    const interaction = CATEGORY_INTERACTIONS[task.category] || { type: "Human-Dominant", description: "Complex task requiring human oversight." };
    const weight = task.defaultWeight || 1;
    
    totalWeight += weight;
    if (interaction.type === "Augmented") augmentedWeight += weight;
    else if (interaction.type === "Automated") automatedWeight += weight;
    else humanWeight += weight;

    return {
      taskLabel: task.label,
      category: task.category,
      interactionType: interaction.type,
      description: interaction.description
    };
  });

  // Normalize to 100%
  const augmentedPct = totalWeight ? Math.round((augmentedWeight / totalWeight) * 100) : 0;
  const automatedPct = totalWeight ? Math.round((automatedWeight / totalWeight) * 100) : 0;
  const humanPct = totalWeight ? 100 - augmentedPct - automatedPct : 0;

  return {
    breakdown: {
      augmented: augmentedPct,
      automated: automatedPct,
      human: humanPct
    },
    taskDetails
  };
}

