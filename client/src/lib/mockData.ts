// Data types
export interface TaskData {
  name: string;
  augmented: number;
  stable: number;
  automated: number;
}

export interface SkillData {
  year: string;
  intensity: number;
}

export interface SectorData {
  sector: string;
  exposure: number;
}

export interface OpportunityData {
  role: string;
  sector: string;
  growth: string;
}

export interface ContextData {
  languageSensitivity: "Low" | "Medium" | "High";
  credentialDependency: "Low" | "Medium" | "High";
  description: string;
  // Added for detailed panel support
  augmentationBalance: "Mostly Augmenting" | "Mixed" | "Mostly Automating";
  laborDemand: "Growing" | "Stable" | "Declining";
  laborDemandDescription: string;
}

// Mock Data Sets
export const taskTransformationData: TaskData[] = [
  { name: "Admin Support", augmented: 45, stable: 30, automated: 25 },
  { name: "Data Analysis", augmented: 60, stable: 20, automated: 20 },
  { name: "Creative Design", augmented: 55, stable: 35, automated: 10 },
  { name: "Customer Service", augmented: 40, stable: 25, automated: 35 },
  { name: "Software Dev", augmented: 65, stable: 25, automated: 10 },
];

export const skillDynamicsData: SkillData[] = [
  { year: "2020", intensity: 20 },
  { year: "2021", intensity: 25 },
  { year: "2022", intensity: 35 },
  { year: "2023", intensity: 55 },
  { year: "2024", intensity: 70 },
  { year: "2025", intensity: 85 },
];

export const sectorContextData: SectorData[] = [
  { sector: "Healthcare", exposure: 30 },
  { sector: "Finance", exposure: 65 },
  { sector: "Education", exposure: 40 },
  { sector: "Manufacturing", exposure: 45 },
  { sector: "Retail", exposure: 25 },
  { sector: "Tech", exposure: 80 },
];

export const opportunityData: OpportunityData[] = [
  { role: "AI Ethics Specialist", sector: "Tech & Legal", growth: "High" },
  { role: "Human-Centric Care", sector: "Healthcare", growth: "Very High" },
  { role: "Green Energy Tech", sector: "Energy", growth: "High" },
  { role: "Personalized Ed. Guide", sector: "Education", growth: "Medium" },
];

// New Context Data (Enhanced for Mother Dashboard)
export const contextAccessData: Record<string, ContextData> = {
  default: {
    languageSensitivity: "Medium",
    credentialDependency: "Medium",
    description: "Access to opportunities depends on language, credential recognition, and institutional context.",
    augmentationBalance: "Mixed",
    laborDemand: "Stable",
    laborDemandDescription: "Demand reflects current labor market conditions across sectors."
  },
  healthcare: {
    languageSensitivity: "High",
    credentialDependency: "High",
    description: "Healthcare roles often require specific certifications and high language proficiency for patient communication.",
    augmentationBalance: "Mostly Augmenting",
    laborDemand: "Growing",
    laborDemandDescription: "Aging populations and specialized care needs are driving strong demand."
  },
  tech: {
    languageSensitivity: "Medium",
    credentialDependency: "Low",
    description: "Tech roles often prioritize demonstrated skills over formal credentials, but technical English is essential.",
    augmentationBalance: "Mostly Augmenting",
    laborDemand: "Growing",
    laborDemandDescription: "Rapid digitalization continues to create new specialized roles."
  },
  retail: {
    languageSensitivity: "Medium",
    credentialDependency: "Low",
    description: "Retail roles generally have lower credential barriers but require local language fluency.",
    augmentationBalance: "Mixed",
    laborDemand: "Stable",
    laborDemandDescription: "E-commerce shifts are balancing out physical store demand."
  },
  finance: {
    languageSensitivity: "High",
    credentialDependency: "High",
    description: "Finance requires strict regulatory knowledge and professional communication.",
    augmentationBalance: "Mostly Automating",
    laborDemand: "Stable",
    laborDemandDescription: "Efficiency gains are stabilizing headcount despite volume growth."
  },
  education: {
    languageSensitivity: "High",
    credentialDependency: "High",
    description: "Education is highly regulated and communication-centric.",
    augmentationBalance: "Mostly Augmenting",
    laborDemand: "Growing",
    laborDemandDescription: "Personalized learning models are increasing demand for educators."
  },
  manufacturing: {
    languageSensitivity: "Low",
    credentialDependency: "Medium",
    description: "Manufacturing values technical certifications and safety protocols.",
    augmentationBalance: "Mixed",
    laborDemand: "Declining",
    laborDemandDescription: "Automation of routine physical tasks is reshaping workforce needs."
  }
};

// Filter Options
export const sectors = ["All Sectors", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Tech"];
export const roles = ["All Roles", "Administrative", "Technical", "Creative", "Service", "Manual"];
export const regions = ["Global", "North America", "Europe", "Asia Pacific"];
