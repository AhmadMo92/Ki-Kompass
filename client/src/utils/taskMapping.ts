// Mock Task Extraction Logic
// This simulates a sophisticated NLP model with deterministic, explainable rules.

export interface TaskCategory {
  name: string;
  type: "Augmented" | "Automated" | "Human-Dominant";
  confidence: number; // Mock confidence score
  keywords: string[];
}

export interface AnalysisResult {
  breakdown: {
    augmented: number;
    automated: number;
    human: number;
  };
  detectedCategories: TaskCategory[];
  mainInsight: string;
}

const CATEGORY_RULES = [
  {
    id: "documentation",
    name: "Documentation & Reporting",
    keywords: ["report", "write", "document", "summary", "draft", "email", "content", "presentation"],
    defaultType: "Augmented" as const,
    weight: 20
  },
  {
    id: "coordination",
    name: "Routine Coordination",
    keywords: ["schedule", "coordinate", "calendar", "meeting", "organize", "logistics", "admin", "track"],
    defaultType: "Automated" as const,
    weight: 15
  },
  {
    id: "analysis",
    name: "Analysis & Planning",
    keywords: ["analyze", "plan", "strategy", "data", "research", "forecast", "budget", "evaluate"],
    defaultType: "Augmented" as const,
    weight: 25
  },
  {
    id: "management",
    name: "People Management",
    keywords: ["manage", "lead", "mentor", "hire", "team", "feedback", "negotiate", "stakeholder"],
    defaultType: "Human-Dominant" as const,
    weight: 30
  },
  {
    id: "technical",
    name: "Technical Execution",
    keywords: ["code", "debug", "design", "build", "operate", "maintain", "fix", "develop"],
    defaultType: "Augmented" as const,
    weight: 25
  },
  {
    id: "creative",
    name: "Creative & Judgment",
    keywords: ["create", "ideate", "concept", "solve", "decide", "approve", "vision", "innovate"],
    defaultType: "Human-Dominant" as const,
    weight: 20
  }
];

export function analyzeRoleDescription(text: string, sector: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const detectedCategories: TaskCategory[] = [];
  
  let augmentedScore = 0;
  let automatedScore = 0;
  let humanScore = 0;
  let totalWeight = 0;

  // 1. Keyword Matching
  CATEGORY_RULES.forEach(rule => {
    const matches = rule.keywords.filter(k => lowerText.includes(k));
    if (matches.length > 0) {
      detectedCategories.push({
        name: rule.name,
        type: rule.defaultType,
        confidence: 0.7 + (matches.length * 0.05), // Fake confidence based on match count
        keywords: matches
      });

      // Add to weighted scores
      const matchWeight = rule.weight * (1 + (matches.length * 0.2));
      totalWeight += matchWeight;

      if (rule.defaultType === "Augmented") augmentedScore += matchWeight;
      else if (rule.defaultType === "Automated") automatedScore += matchWeight;
      else humanScore += matchWeight;
    }
  });

  // 2. Fallback if no keywords found (mock generic profile)
  if (totalWeight === 0) {
    return {
      breakdown: { augmented: 40, automated: 20, human: 40 },
      detectedCategories: [],
      mainInsight: "Please provide a more detailed description to detect specific task patterns."
    };
  }

  // 3. Sector Adjustments (Mock logic)
  // e.g., Admin sector pushes coordination towards automation
  if (sector === "Administration") {
    automatedScore *= 1.2;
    totalWeight = augmentedScore + automatedScore + humanScore;
  }
  // e.g., Health sector protects human tasks
  if (sector === "Health") {
    humanScore *= 1.2;
    totalWeight = augmentedScore + automatedScore + humanScore;
  }

  // 4. Normalize to Percentages
  const augmentedPct = Math.round((augmentedScore / totalWeight) * 100);
  const automatedPct = Math.round((automatedScore / totalWeight) * 100);
  const humanPct = 100 - augmentedPct - automatedPct; // Ensure sum is 100

  // 5. Generate Insight
  let insight = "Your role involves a balanced mix of tasks.";
  if (augmentedPct > 50) insight = "Your role is highly likely to be augmented by AI tools, enhancing productivity.";
  else if (automatedPct > 30) insight = "Significant portions of routine coordination may be automated, freeing up time.";
  else if (humanPct > 50) insight = "Your role relies heavily on human judgment and interaction, which are harder to automate.";

  return {
    breakdown: {
      augmented: augmentedPct,
      automated: automatedPct,
      human: humanPct
    },
    detectedCategories,
    mainInsight: insight
  };
}
