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
    
    // Take top 5 relevant matches
    const topMatches = scored.filter(s => s.score > 0).slice(0, 5).map(s => s.comp);
    selectedCompetencies = [...topMatches];
  }
  
  // Safe Fallback Keywords: These indicate general professional tasks applicable to many roles
  const safeKeywords = ["dokumentation", "planung", "organisation", "verwaltung", "bericht", "analyse", "beratung", "koordination", "überwachung", "daten", "documentation", "planning", "organization", "administration", "report", "analysis", "consulting", "coordination", "monitoring", "data"];

  // Filter competencies to create a "Safe Pool"
  const safePool = competencies.filter(c => {
     const name = (c.nameDe + " " + c.nameEn).toLowerCase();
     return safeKeywords.some(k => name.includes(k));
  });

  // Fill the rest with SAFE competencies (not completely random) to reach 6-9 tasks
  // We use the seeded random so it's consistent for the same role
  const targetCount = Math.floor(rand() * 4) + 6;
  const usedIds = new Set(selectedCompetencies.map(c => c.id));
  
  // Try to fill from Safe Pool first
  let attempts = 0;
  while (selectedCompetencies.length < targetCount && attempts < 50) {
    attempts++;
    const index = Math.floor(rand() * safePool.length);
    const candidate = safePool[index];
    if (candidate && !usedIds.has(candidate.id)) {
      selectedCompetencies.push(candidate);
      usedIds.add(candidate.id);
    }
  }
  
  // If still need more (unlikely), fill from full pool
  while (selectedCompetencies.length < targetCount) {
    const index = Math.floor(rand() * competencies.length);
    const candidate = competencies[index];
    if (!usedIds.has(candidate.id)) {
      selectedCompetencies.push(candidate);
      usedIds.add(candidate.id);
    }
  }

  // Map to TaskDefinition
  return selectedCompetencies.map(comp => {
    // Deterministically assign a category
    const catIndex = Math.floor(rand() * categories.length);
    const category = categories[catIndex];
    
    return {
      id: comp.id,
      label: comp.nameEn || comp.nameDe, 
      labelEn: comp.nameEn,
      labelDe: comp.nameDe,
      category: category,
      defaultWeight: 0.2
    };
  });
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

