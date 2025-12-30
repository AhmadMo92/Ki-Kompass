// Mock Data: Role -> Task Profiles
// This simulates a database of standard role definitions and their typical tasks.

export interface TaskDefinition {
  id: string;
  label: string;
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

// 1. Role Definitions (Legacy specific profiles)
export const ROLE_PROFILES: Record<string, RoleProfile> = {
  "program_manager": {
    id: "program_manager",
    label: "Program Manager",
    defaultTasks: [
      { id: "t1", label: "Coordinating stakeholders and partners", category: "Coordination", defaultWeight: 0.25 },
      { id: "t2", label: "Planning programs and timelines", category: "Planning", defaultWeight: 0.20 },
      { id: "t3", label: "Writing reports and documentation", category: "Documentation", defaultWeight: 0.20 },
      { id: "t4", label: "Monitoring budgets and progress", category: "Monitoring", defaultWeight: 0.15 },
      { id: "t5", label: "Supporting decision-making", category: "Decision Support", defaultWeight: 0.20 }
    ]
  },
  // ... (keeping legacy for compatibility if needed, but we will mostly use dynamic generation below)
};

// Archetype Tasks by Group
export const GROUP_ARCHETYPES: Record<string, TaskDefinition[]> = {
  "Agriculture & Forestry": [
    { id: "ag_1", label: "Monitoring crop/forest health", category: "Monitoring", defaultWeight: 0.3 },
    { id: "ag_2", label: "Operating machinery/tools", category: "Manual Operation", defaultWeight: 0.4 },
    { id: "ag_3", label: "Planning harvest schedules", category: "Planning", defaultWeight: 0.2 },
    { id: "ag_4", label: "Documentation of yields/stock", category: "Documentation", defaultWeight: 0.1 }
  ],
  "IT & Digital": [
    { id: "it_1", label: "Writing and reviewing code", category: "Analysis", defaultWeight: 0.4 },
    { id: "it_2", label: "Debugging and troubleshooting", category: "Problem Solving", defaultWeight: 0.3 },
    { id: "it_3", label: "System documentation", category: "Documentation", defaultWeight: 0.1 },
    { id: "it_4", label: "Team coordination (Agile/Scrum)", category: "Coordination", defaultWeight: 0.2 }
  ],
  "Health & Care": [
    { id: "hc_1", label: "Direct patient care/assistance", category: "Human Interaction", defaultWeight: 0.5 },
    { id: "hc_2", label: "Medical documentation", category: "Documentation", defaultWeight: 0.2 },
    { id: "hc_3", label: "Monitoring patient vitals/status", category: "Monitoring", defaultWeight: 0.2 },
    { id: "hc_4", label: "Coordinating with medical team", category: "Coordination", defaultWeight: 0.1 }
  ],
  "Sales & Marketing": [
    { id: "sm_1", label: "Client communication/sales calls", category: "Human Interaction", defaultWeight: 0.4 },
    { id: "sm_2", label: "Market research & analysis", category: "Analysis", defaultWeight: 0.2 },
    { id: "sm_3", label: "CRM management & data entry", category: "Admin", defaultWeight: 0.2 },
    { id: "sm_4", label: "Creating promotional content", category: "Documentation", defaultWeight: 0.2 }
  ],
  "Engineering & Technical": [
    { id: "eng_1", label: "System design & prototyping", category: "Analysis", defaultWeight: 0.35 },
    { id: "eng_2", label: "Maintenance & repair", category: "Problem Solving", defaultWeight: 0.35 },
    { id: "eng_3", label: "Technical documentation", category: "Documentation", defaultWeight: 0.15 },
    { id: "eng_4", label: "Project planning", category: "Planning", defaultWeight: 0.15 }
  ],
  "Education": [
    { id: "edu_1", label: "Delivering instruction/training", category: "Human Interaction", defaultWeight: 0.4 },
    { id: "edu_2", label: "Curriculum planning", category: "Planning", defaultWeight: 0.2 },
    { id: "edu_3", label: "Grading and assessment", category: "Analysis", defaultWeight: 0.2 },
    { id: "edu_4", label: "Student mentorship", category: "Human Interaction", defaultWeight: 0.2 }
  ]
};

export const getTasksForRole = (roleId: string, group: string): TaskDefinition[] => {
  // 1. Check if specific profile exists
  if (ROLE_PROFILES[roleId]) {
    return ROLE_PROFILES[roleId].defaultTasks;
  }
  
  // 2. Return archetype tasks based on group
  if (GROUP_ARCHETYPES[group]) {
    return GROUP_ARCHETYPES[group];
  }

  // 3. Fallback generic tasks
  return [
    { id: "gen_1", label: "Core role execution", category: "Analysis", defaultWeight: 0.4 },
    { id: "gen_2", label: "Communication & meetings", category: "Communication", defaultWeight: 0.3 },
    { id: "gen_3", label: "Administrative tasks", category: "Admin", defaultWeight: 0.2 },
    { id: "gen_4", label: "Planning & organization", category: "Planning", defaultWeight: 0.1 }
  ];
};

export const AVAILABLE_ROLES = Object.values(ROLE_PROFILES).map(r => ({ id: r.id, label: r.label }));

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
  const augmentedPct = Math.round((augmentedWeight / totalWeight) * 100);
  const automatedPct = Math.round((automatedWeight / totalWeight) * 100);
  const humanPct = 100 - augmentedPct - automatedPct;

  return {
    breakdown: {
      augmented: augmentedPct,
      automated: automatedPct,
      human: humanPct
    },
    taskDetails
  };
}

