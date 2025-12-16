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

// 1. Role Definitions
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
  "project_coordinator": {
    id: "project_coordinator",
    label: "Project Coordinator",
    defaultTasks: [
      { id: "t6", label: "Scheduling meetings and logistics", category: "Coordination", defaultWeight: 0.30 },
      { id: "t7", label: "Tracking project status", category: "Monitoring", defaultWeight: 0.25 },
      { id: "t8", label: "Maintaining project documentation", category: "Documentation", defaultWeight: 0.25 },
      { id: "t9", label: "Communicating updates to team", category: "Communication", defaultWeight: 0.20 }
    ]
  },
  "product_operations": {
    id: "product_operations",
    label: "Product Operations",
    defaultTasks: [
      { id: "t10", label: "Analyzing user feedback data", category: "Analysis", defaultWeight: 0.30 },
      { id: "t11", label: "Managing launch checklists", category: "Coordination", defaultWeight: 0.20 },
      { id: "t12", label: "Creating internal documentation", category: "Documentation", defaultWeight: 0.25 },
      { id: "t13", label: "Facilitating cross-team alignment", category: "Communication", defaultWeight: 0.25 }
    ]
  },
  "hr_generalist": {
    id: "hr_generalist",
    label: "HR Generalist",
    defaultTasks: [
      { id: "t14", label: "Screening candidate resumes", category: "Analysis", defaultWeight: 0.20 },
      { id: "t15", label: "Onboarding new employees", category: "Coordination", defaultWeight: 0.25 },
      { id: "t16", label: "Resolving employee relations issues", category: "Human Interaction", defaultWeight: 0.35 },
      { id: "t17", label: "Managing benefits administration", category: "Admin", defaultWeight: 0.20 }
    ]
  },
  "logistics_coordinator": {
    id: "logistics_coordinator",
    label: "Logistics Coordinator",
    defaultTasks: [
      { id: "t18", label: "Tracking shipments and inventory", category: "Monitoring", defaultWeight: 0.35 },
      { id: "t19", label: "Coordinating with carriers", category: "Coordination", defaultWeight: 0.30 },
      { id: "t20", label: "Resolving delivery exceptions", category: "Problem Solving", defaultWeight: 0.20 },
      { id: "t21", label: "Preparing shipping documentation", category: "Documentation", defaultWeight: 0.15 }
    ]
  },
  "policy_officer": {
    id: "policy_officer",
    label: "Policy Officer",
    defaultTasks: [
      { id: "t22", label: "Researching regulatory changes", category: "Analysis", defaultWeight: 0.30 },
      { id: "t23", label: "Drafting policy documents", category: "Documentation", defaultWeight: 0.30 },
      { id: "t24", label: "Consulting with stakeholders", category: "Human Interaction", defaultWeight: 0.25 },
      { id: "t25", label: "Evaluating policy impact", category: "Analysis", defaultWeight: 0.15 }
    ]
  }
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
  "Problem Solving": { type: "Human-Dominant", description: "Handling novel exceptions requires human adaptability." }
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
