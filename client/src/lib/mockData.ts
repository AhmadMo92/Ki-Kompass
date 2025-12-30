// Data types
export interface ContextData {
  languageSensitivity: "Low" | "Medium" | "High";
  credentialDependency: "Low" | "Medium" | "High";
  description: string;
  augmentationBalance?: string;
  laborDemand?: string;
  laborDemandDescription?: string;
}

export interface RoleData {
  augmented: number;
  automated: number;
  stable: number;
  augmentationBalance: "Mostly Augmenting" | "Mixed" | "Mostly Automating";
  skillIntensity: { year: string; intensity: number }[];
  demandSignal: "Growing" | "Stable" | "Declining";
  demandDescription: string;
  opportunityAlignment: number; // 0-100
  opportunityDescription: string;
  languageSensitivity: "Low" | "Medium" | "High";
  credentialDependency: "Low" | "Medium" | "High";
  contextDescription: string;
  // Derived metrics
  changePressure: "Low" | "Medium" | "High";
  opportunitySurface: "Low" | "Medium" | "High";
}

// Map key: "Sector-RoleGroup"
// Sectors: ["Health", "IT", "Logistics", "Administration"]
// Role Groups: ["Program Project Manager", "Talent Acquisition", "Software Developer", "Data Analyst"]

export const mockRoleData: Record<string, RoleData> = {
  // --- HEALTH ---
  "Health-Program Project Manager": {
    augmented: 55, automated: 15, stable: 30,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:35}, {year:'Q3', intensity:40}, {year:'Q4', intensity:45}, {year:'Q5', intensity:50}, {year:'Q6', intensity:55}],
    demandSignal: "Growing",
    demandDescription: "Healthcare operations are expanding with patient volume.",
    opportunityAlignment: 75,
    opportunityDescription: "High overlap with management skills.",
    languageSensitivity: "High", credentialDependency: "High",
    contextDescription: "Requires local fluency and regulatory knowledge.",
    changePressure: "Medium", opportunitySurface: "High"
  },
  "Health-Talent Acquisition": {
    augmented: 40, automated: 10, stable: 50,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:20}, {year:'Q2', intensity:25}, {year:'Q3', intensity:30}, {year:'Q4', intensity:35}, {year:'Q5', intensity:40}, {year:'Q6', intensity:45}],
    demandSignal: "Growing",
    demandDescription: "Patient care remains highly human-centric.",
    opportunityAlignment: 90,
    opportunityDescription: "Direct care roles are automation-resistant.",
    languageSensitivity: "High", credentialDependency: "Medium",
    contextDescription: "Communication is paramount.",
    changePressure: "Low", opportunitySurface: "High"
  },
  "Health-Software Developer": {
    augmented: 60, automated: 20, stable: 20,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:50}, {year:'Q2', intensity:60}, {year:'Q3', intensity:70}, {year:'Q4', intensity:75}, {year:'Q5', intensity:80}, {year:'Q6', intensity:85}],
    demandSignal: "Growing",
    demandDescription: "Med-tech integration is a key driver.",
    opportunityAlignment: 80,
    opportunityDescription: "Specialized equipment operation in demand.",
    languageSensitivity: "Medium", credentialDependency: "High",
    contextDescription: "Certifications are mandatory.",
    changePressure: "High", opportunitySurface: "High"
  },
  "Health-Data Analyst": {
    augmented: 70, automated: 20, stable: 10,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:40}, {year:'Q2', intensity:50}, {year:'Q3', intensity:60}, {year:'Q4', intensity:70}, {year:'Q5', intensity:75}, {year:'Q6', intensity:80}],
    demandSignal: "Growing",
    demandDescription: "Data-driven diagnostics are booming.",
    opportunityAlignment: 85,
    opportunityDescription: "Critical need for health informatics.",
    languageSensitivity: "Medium", credentialDependency: "High",
    contextDescription: "Technical skills transferable, but credentials key.",
    changePressure: "High", opportunitySurface: "High"
  },

  // --- IT ---
  "IT-Program Project Manager": {
    augmented: 65, automated: 25, stable: 10,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:40}, {year:'Q2', intensity:50}, {year:'Q3', intensity:55}, {year:'Q4', intensity:60}, {year:'Q5', intensity:65}, {year:'Q6', intensity:70}],
    demandSignal: "Stable",
    demandDescription: "Agile management remains relevant.",
    opportunityAlignment: 65,
    opportunityDescription: "Shift towards product-led growth.",
    languageSensitivity: "Medium", credentialDependency: "Medium",
    contextDescription: "Experience often outweighs degrees.",
    changePressure: "Medium", opportunitySurface: "Medium"
  },
  "IT-Talent Acquisition": {
    augmented: 30, automated: 60, stable: 10,
    augmentationBalance: "Mostly Automating",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:40}, {year:'Q3', intensity:50}, {year:'Q4', intensity:60}, {year:'Q5', intensity:70}, {year:'Q6', intensity:80}],
    demandSignal: "Declining",
    demandDescription: "L1 support is being heavily automated.",
    opportunityAlignment: 30,
    opportunityDescription: "Shift required to L2/L3 or specialized support.",
    languageSensitivity: "Medium", credentialDependency: "Low",
    contextDescription: "Remote support requires clear communication.",
    changePressure: "High", opportunitySurface: "Low"
  },
  "IT-Software Developer": {
    augmented: 80, automated: 10, stable: 10,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:50}, {year:'Q2', intensity:60}, {year:'Q3', intensity:70}, {year:'Q4', intensity:80}, {year:'Q5', intensity:85}, {year:'Q6', intensity:90}],
    demandSignal: "Growing",
    demandDescription: "Core engineering remains critical.",
    opportunityAlignment: 85,
    opportunityDescription: "AI-assisted coding increases output.",
    languageSensitivity: "Low", credentialDependency: "Medium",
    contextDescription: "Code is the universal language.",
    changePressure: "High", opportunitySurface: "High"
  },
  "IT-Data Analyst": {
    augmented: 60, automated: 30, stable: 10,
    augmentationBalance: "Mixed",
    skillIntensity: [{year:'Q1', intensity:60}, {year:'Q2', intensity:70}, {year:'Q3', intensity:80}, {year:'Q4', intensity:85}, {year:'Q5', intensity:90}, {year:'Q6', intensity:95}],
    demandSignal: "Growing",
    demandDescription: "AI & Data roles are exploding.",
    opportunityAlignment: 95,
    opportunityDescription: "Highest growth sector for data skills.",
    languageSensitivity: "Low", credentialDependency: "Medium",
    contextDescription: "Technical English is the global standard.",
    changePressure: "High", opportunitySurface: "High"
  },

  // --- LOGISTICS ---
  "Logistics-Program Project Manager": {
    augmented: 50, automated: 30, stable: 20,
    augmentationBalance: "Mixed",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:35}, {year:'Q3', intensity:45}, {year:'Q4', intensity:50}, {year:'Q5', intensity:55}, {year:'Q6', intensity:60}],
    demandSignal: "Stable",
    demandDescription: "Supply chain complexity requires human oversight.",
    opportunityAlignment: 60,
    opportunityDescription: "Digital supply chain skills in demand.",
    languageSensitivity: "Medium", credentialDependency: "Low",
    contextDescription: "Operational experience is highly valued.",
    changePressure: "Medium", opportunitySurface: "Medium"
  },
  "Logistics-Talent Acquisition": {
    augmented: 20, automated: 50, stable: 30,
    augmentationBalance: "Mostly Automating",
    skillIntensity: [{year:'Q1', intensity:20}, {year:'Q2', intensity:25}, {year:'Q3', intensity:30}, {year:'Q4', intensity:40}, {year:'Q5', intensity:50}, {year:'Q6', intensity:60}],
    demandSignal: "Declining",
    demandDescription: "Tracking inquiries are automated.",
    opportunityAlignment: 40,
    opportunityDescription: "Shift to exception handling.",
    languageSensitivity: "Medium", credentialDependency: "Low",
    contextDescription: "Customer interaction is reducing.",
    changePressure: "High", opportunitySurface: "Low"
  },
  "Logistics-Software Developer": {
    augmented: 40, automated: 40, stable: 20,
    augmentationBalance: "Mixed",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:40}, {year:'Q3', intensity:50}, {year:'Q4', intensity:55}, {year:'Q5', intensity:60}, {year:'Q6', intensity:65}],
    demandSignal: "Stable",
    demandDescription: "Warehouse automation maintenance.",
    opportunityAlignment: 65,
    opportunityDescription: "Robotics maintenance skills needed.",
    languageSensitivity: "Low", credentialDependency: "Medium",
    contextDescription: "Technical manuals are standard.",
    changePressure: "Medium", opportunitySurface: "Medium"
  },
  "Logistics-Data Analyst": {
    augmented: 60, automated: 30, stable: 10,
    augmentationBalance: "Mixed",
    skillIntensity: [{year:'Q1', intensity:40}, {year:'Q2', intensity:50}, {year:'Q3', intensity:55}, {year:'Q4', intensity:60}, {year:'Q5', intensity:65}, {year:'Q6', intensity:70}],
    demandSignal: "Growing",
    demandDescription: "Route optimization needs data analysts.",
    opportunityAlignment: 70,
    opportunityDescription: "Growing need for predictive logistics.",
    languageSensitivity: "Medium", credentialDependency: "Medium",
    contextDescription: "Analytical tools require training.",
    changePressure: "Medium", opportunitySurface: "High"
  },

  // --- ADMINISTRATION ---
  "Administration-Program Project Manager": {
    augmented: 50, automated: 40, stable: 10,
    augmentationBalance: "Mostly Automating",
    skillIntensity: [{year:'Q1', intensity:20}, {year:'Q2', intensity:30}, {year:'Q3', intensity:40}, {year:'Q4', intensity:50}, {year:'Q5', intensity:60}, {year:'Q6', intensity:70}],
    demandSignal: "Declining",
    demandDescription: "Scheduling and coordination are automated.",
    opportunityAlignment: 45,
    opportunityDescription: "Move to strategic support.",
    languageSensitivity: "High", credentialDependency: "Medium",
    contextDescription: "Cultural nuance is key for high-level support.",
    changePressure: "High", opportunitySurface: "Low"
  },
  "Administration-Talent Acquisition": {
    augmented: 30, automated: 60, stable: 10,
    augmentationBalance: "Mostly Automating",
    skillIntensity: [{year:'Q1', intensity:20}, {year:'Q2', intensity:30}, {year:'Q3', intensity:40}, {year:'Q4', intensity:50}, {year:'Q5', intensity:60}, {year:'Q6', intensity:70}],
    demandSignal: "Declining",
    demandDescription: "Front-desk and entry roles declining.",
    opportunityAlignment: 35,
    opportunityDescription: "Need to upskill to specialized admin.",
    languageSensitivity: "High", credentialDependency: "Low",
    contextDescription: "Face-to-face roles diminishing.",
    changePressure: "High", opportunitySurface: "Low"
  },
  "Administration-Software Developer": {
    augmented: 50, automated: 20, stable: 30,
    augmentationBalance: "Mixed",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:35}, {year:'Q3', intensity:40}, {year:'Q4', intensity:45}, {year:'Q5', intensity:50}, {year:'Q6', intensity:55}],
    demandSignal: "Stable",
    demandDescription: "Office IT and system management.",
    opportunityAlignment: 60,
    opportunityDescription: "SaaS management skills needed.",
    languageSensitivity: "Medium", credentialDependency: "Medium",
    contextDescription: "System admin certifications help.",
    changePressure: "Medium", opportunitySurface: "Medium"
  },
  "Administration-Data Analyst": {
    augmented: 70, automated: 20, stable: 10,
    augmentationBalance: "Mostly Augmenting",
    skillIntensity: [{year:'Q1', intensity:30}, {year:'Q2', intensity:40}, {year:'Q3', intensity:50}, {year:'Q4', intensity:60}, {year:'Q5', intensity:65}, {year:'Q6', intensity:70}],
    demandSignal: "Stable",
    demandDescription: "Business intelligence is standard.",
    opportunityAlignment: 75,
    opportunityDescription: "Data literacy is now baseline.",
    languageSensitivity: "Medium", credentialDependency: "High",
    contextDescription: "Reporting requires precision.",
    changePressure: "Medium", opportunitySurface: "Medium"
  }
};

export const sectorExposureData = [
  { sector: "Health", exposure: 40 },
  { sector: "IT", exposure: 85 },
  { sector: "Logistics", exposure: 55 },
  { sector: "Administration", exposure: 70 },
];

export const sectors = ["Health", "IT", "Logistics", "Administration"];
export const roleGroups = ["Program Project Manager", "Talent Acquisition", "Software Developer", "Data Analyst"];
export const roleContexts = ["Current role", "Previous role", "Target role"];
export const regions = ["Global", "North America", "Europe", "Asia Pacific"];

// Helper to determine status colors
export const getStatusColor = (status: string) => {
  switch (status) {
    case "Growing": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "Stable": return "text-blue-600 bg-blue-50 border-blue-200";
    case "Declining": return "text-amber-600 bg-amber-50 border-amber-200";
    case "High": return "text-orange-600 bg-orange-50 border-orange-200";
    case "Medium": return "text-blue-600 bg-blue-50 border-blue-200";
    case "Low": return "text-slate-600 bg-slate-50 border-slate-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export const getImpactColor = (balance: string) => {
  if (balance === "Mostly Augmenting") return "text-indigo-600 bg-indigo-50 border-indigo-200";
  if (balance === "Mostly Automating") return "text-rose-600 bg-rose-50 border-rose-200";
  return "text-purple-600 bg-purple-50 border-purple-200";
};

// Deterministic Pseudo-Random Generator based on string seed
function seededRandom(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  }
}

// Generate deterministic data for any occupation ID
export const generateRoleData = (id: string, name: string, group: string): RoleData => {
  const rng = seededRandom(id + name); // Consistent seed
  
  const isTech = group.includes("IT") || group.includes("Mechatronics") || group.includes("Technical");
  const isCare = group.includes("Health") || group.includes("Care") || group.includes("Education");
  const isManual = group.includes("Agriculture") || group.includes("Sales");

  // Bias data based on group "archetypes"
  let augmentationBase = 0.5;
  if (isTech) augmentationBase = 0.7; // Tech is highly augmented
  if (isCare) augmentationBase = 0.3; // Care is less automated/augmented, more human
  if (isManual) augmentationBase = 0.4;

  const augmented = Math.floor(rng() * 40) + (augmentationBase * 50); 
  const automated = Math.floor(rng() * 30) + (isManual ? 20 : 5);
  const stable = 100 - augmented - automated;

  const demandSignals = ["Growing", "Stable", "Declining"];
  const demandSignal = demandSignals[Math.floor(rng() * demandSignals.length)] as "Growing" | "Stable" | "Declining";

  const balances = ["Mostly Augmenting", "Mixed", "Mostly Automating"];
  let balance = balances[1];
  if (augmented > 55) balance = balances[0];
  if (automated > 40) balance = balances[2];

  return {
    augmented: Math.round(augmented),
    automated: Math.round(automated),
    stable: Math.round(stable),
    augmentationBalance: balance as any,
    skillIntensity: [
      {year: 'Q1', intensity: 20 + rng() * 10},
      {year: 'Q2', intensity: 25 + rng() * 10},
      {year: 'Q3', intensity: 30 + rng() * 15},
      {year: 'Q4', intensity: 35 + rng() * 20},
      {year: 'Q5', intensity: 40 + rng() * 20},
      {year: 'Q6', intensity: 45 + rng() * 25},
    ],
    demandSignal: demandSignal,
    demandDescription: isTech ? "High demand for specialized technical skills." : 
                       isCare ? "Demographic shifts driving long-term growth." :
                       "Market shifting towards higher efficiency.",
    opportunityAlignment: Math.floor(rng() * 40) + 50,
    opportunityDescription: isTech ? "New tools enabling higher complexity work." :
                            isCare ? "Human-centric tasks gaining premium value." :
                            "Efficiency gains opening new service models.",
    languageSensitivity: isCare || group.includes("Sales") ? "High" : "Medium",
    credentialDependency: isTech || isCare ? "High" : "Medium",
    contextDescription: isCare ? "Regulatory requirements are increasing." : "Rapid tool evolution requires constant learning.",
    changePressure: (rng() > 0.5 ? "High" : "Medium") as any,
    opportunitySurface: (rng() > 0.4 ? "High" : "Medium") as any
  };
};

export interface SkillCluster {
  name: string;
  interaction: "Supportive" | "Complementary" | "Minimal";
  description?: string;
}

export const getSkillClustersForRole = (roleName: string, group: string): SkillCluster[] => {
   const rng = seededRandom(roleName);
   const clusters: SkillCluster[] = [
     { name: "Digital Literacy", interaction: "Supportive" },
     { name: "Process Management", interaction: "Complementary" },
     { name: "Problem Solving", interaction: "Minimal" },
     { name: group.split(" ")[0] + " Domain Knowledge", interaction: "Complementary" }
   ];
   
   // Randomly shuffle interaction types
   const types = ["Supportive", "Complementary", "Minimal"];
   return clusters.map(c => ({
     ...c,
     interaction: types[Math.floor(rng() * types.length)] as any
   }));
};
