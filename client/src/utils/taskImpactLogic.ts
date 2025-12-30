import { competencies } from "@/lib/occupations";

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

// Generate tasks from competencies based on role ID
function generateTasksFromCompetencies(roleId: string): TaskDefinition[] {
  const rand = getSeededRandom(roleId);
  
  // Pick 5-8 random competencies
  const numTasks = Math.floor(rand() * 4) + 5;
  const tasks: TaskDefinition[] = [];
  const usedIndices = new Set<number>();
  
  const categories = ["Analysis", "Coordination", "Documentation", "Problem Solving", "Planning", "Monitoring"];

  for (let i = 0; i < numTasks; i++) {
    let index = Math.floor(rand() * competencies.length);
    while (usedIndices.has(index)) {
      index = (index + 1) % competencies.length;
    }
    usedIndices.add(index);
    
    const comp = competencies[index];
    // Assign a random category
    const category = categories[Math.floor(rand() * categories.length)];
    
    tasks.push({
      id: comp.id,
      label: comp.nameEn || comp.nameDe, 
      labelEn: comp.nameEn,
      labelDe: comp.nameDe,
      category: category,
      defaultWeight: 0.2
    });
  }
  
  return tasks;
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

