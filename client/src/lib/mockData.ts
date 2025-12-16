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

// New Context Data
export const contextAccessData: Record<string, ContextData> = {
  default: {
    languageSensitivity: "Medium",
    credentialDependency: "Medium",
    description: "Access to opportunities depends on language, credential recognition, and institutional context."
  },
  healthcare: {
    languageSensitivity: "High",
    credentialDependency: "High",
    description: "Healthcare roles often require specific certifications and high language proficiency for patient communication."
  },
  tech: {
    languageSensitivity: "Medium",
    credentialDependency: "Low",
    description: "Tech roles often prioritize demonstrated skills over formal credentials, but technical English is essential."
  },
  retail: {
    languageSensitivity: "Medium",
    credentialDependency: "Low",
    description: "Retail roles generally have lower credential barriers but require local language fluency."
  }
};

// Filter Options
export const sectors = ["All Sectors", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Tech"];
export const roles = ["All Roles", "Administrative", "Technical", "Creative", "Service", "Manual"];
export const regions = ["Global", "North America", "Europe", "Asia Pacific"];
