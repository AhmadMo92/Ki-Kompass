import { SkillCategory } from "./index";

export interface AITool {
  id: string;
  name: string;
  name_de: string;
  category: AIToolCategory;
  description_en: string;
  description_de: string;
  icon: string;
  relevantSkills: string[];
  relevantLabels: ("automatable" | "high_ai_potential" | "ai_assisted")[];
}

export type AIToolCategory = "generation" | "analysis" | "automation" | "research" | "communication" | "design" | "domain_specific" | "coding";

export const AI_TOOL_CATEGORIES: Record<AIToolCategory, { label_en: string; label_de: string; color: string; bg: string }> = {
  generation:      { label_en: "Content Generation",   label_de: "Inhaltsgenerierung",   color: "#7C3AED", bg: "#F5F3FF" },
  analysis:        { label_en: "Data & Analysis",      label_de: "Daten & Analyse",       color: "#0891B2", bg: "#ECFEFF" },
  automation:      { label_en: "Workflow Automation",   label_de: "Workflow-Automatisierung", color: "#EA580C", bg: "#FFF7ED" },
  research:        { label_en: "Research & Search",     label_de: "Recherche & Suche",     color: "#2563EB", bg: "#EFF6FF" },
  communication:   { label_en: "Communication",         label_de: "Kommunikation",         color: "#16A34A", bg: "#F0FDF4" },
  design:          { label_en: "Design & Media",        label_de: "Design & Medien",       color: "#DB2777", bg: "#FDF2F8" },
  domain_specific: { label_en: "Domain-Specific AI",    label_de: "Fachspezifische KI",    color: "#854D0E", bg: "#FEFCE8" },
  coding:          { label_en: "Code & Engineering",     label_de: "Code & Engineering",    color: "#374151", bg: "#F3F4F6" },
};

export const AI_TOOLS: AITool[] = [
  {
    id: "AT-GEN-001", name: "LLM Text Generation", name_de: "LLM Textgenerierung",
    category: "generation",
    description_en: "Large language models for drafting, summarizing, and rewriting text content",
    description_de: "Große Sprachmodelle zum Erstellen, Zusammenfassen und Umschreiben von Texten",
    icon: "✍️",
    relevantSkills: ["SK-SOC-002", "SK-SOC-019", "SK-DIG-008", "SK-COG-005", "SK-OPS-010"],
    relevantLabels: ["automatable", "high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-GEN-002", name: "Translation AI", name_de: "Übersetzungs-KI",
    category: "generation",
    description_en: "Neural machine translation for multilingual content and interpreting support",
    description_de: "Neuronale maschinelle Übersetzung für mehrsprachige Inhalte und Dolmetschunterstützung",
    icon: "🌐",
    relevantSkills: ["SK-TEC-009", "SK-SOC-015", "SK-SOC-001"],
    relevantLabels: ["automatable", "high_ai_potential"],
  },
  {
    id: "AT-GEN-003", name: "Presentation AI", name_de: "Präsentations-KI",
    category: "generation",
    description_en: "AI-powered slide generation and presentation design from content",
    description_de: "KI-gestützte Folienerstellung und Präsentationsdesign aus Inhalten",
    icon: "📊",
    relevantSkills: ["SK-SOC-012", "SK-DIG-003", "SK-DIG-008"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-ANA-001", name: "Data Analytics AI", name_de: "Datenanalyse-KI",
    category: "analysis",
    description_en: "AI-powered data analysis, pattern recognition, and statistical insights",
    description_de: "KI-gestützte Datenanalyse, Mustererkennung und statistische Erkenntnisse",
    icon: "📈",
    relevantSkills: ["SK-COG-006", "SK-COG-007", "SK-COG-016", "SK-DIG-003", "SK-COG-011"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-ANA-002", name: "Risk & Compliance AI", name_de: "Risiko- & Compliance-KI",
    category: "analysis",
    description_en: "Automated risk assessment, compliance checking, and regulatory monitoring",
    description_de: "Automatisierte Risikobewertung, Compliance-Prüfung und regulatorische Überwachung",
    icon: "🛡️",
    relevantSkills: ["SK-COG-010", "SK-DOM-002", "SK-DOM-001", "SK-COG-013"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-ANA-003", name: "Financial Modeling AI", name_de: "Finanzmodellierung-KI",
    category: "analysis",
    description_en: "AI for financial forecasting, budgeting, and investment analysis",
    description_de: "KI für Finanzprognosen, Budgetierung und Investitionsanalyse",
    icon: "💰",
    relevantSkills: ["SK-COG-007", "SK-COG-017", "SK-DOM-005", "SK-OPS-023"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-AUT-001", name: "Document Processing", name_de: "Dokumentenverarbeitung",
    category: "automation",
    description_en: "Automated document extraction, classification, and processing",
    description_de: "Automatisierte Dokumentenextraktion, -klassifizierung und -verarbeitung",
    icon: "📄",
    relevantSkills: ["SK-OPS-008", "SK-OPS-010", "SK-DIG-017", "SK-COG-014"],
    relevantLabels: ["automatable", "high_ai_potential"],
  },
  {
    id: "AT-AUT-002", name: "Workflow Orchestration", name_de: "Workflow-Orchestrierung",
    category: "automation",
    description_en: "Automated task routing, scheduling, and process orchestration",
    description_de: "Automatisierte Aufgabenverteilung, Terminplanung und Prozessorchestrierung",
    icon: "⚙️",
    relevantSkills: ["SK-COG-003", "SK-DIG-015", "SK-OPS-002", "SK-COG-022", "SK-OPS-016"],
    relevantLabels: ["automatable", "high_ai_potential"],
  },
  {
    id: "AT-AUT-003", name: "Quality Inspection AI", name_de: "Qualitätsprüfung-KI",
    category: "automation",
    description_en: "Computer vision and sensor-based automated quality inspection",
    description_de: "Computergestützte und sensorbasierte automatisierte Qualitätsprüfung",
    icon: "🔍",
    relevantSkills: ["SK-OPS-001", "SK-TEC-007", "SK-OPS-020"],
    relevantLabels: ["automatable", "high_ai_potential"],
  },
  {
    id: "AT-AUT-004", name: "Supply Chain AI", name_de: "Lieferketten-KI",
    category: "automation",
    description_en: "AI-optimized logistics, inventory management, and demand forecasting",
    description_de: "KI-optimierte Logistik, Bestandsmanagement und Nachfrageprognose",
    icon: "🚛",
    relevantSkills: ["SK-OPS-003", "SK-OPS-004", "SK-OPS-021", "SK-COG-012"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-RES-001", name: "Research Assistant AI", name_de: "Forschungsassistent-KI",
    category: "research",
    description_en: "AI-powered literature review, citation finding, and research synthesis",
    description_de: "KI-gestützte Literaturrecherche, Zitatfindung und Forschungssynthese",
    icon: "🔬",
    relevantSkills: ["SK-COG-008", "SK-COG-001", "SK-TEC-004", "SK-COG-015"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-RES-002", name: "Legal Research AI", name_de: "Juristische Recherche-KI",
    category: "research",
    description_en: "AI for case law search, legal document analysis, and precedent finding",
    description_de: "KI für Rechtsprechungssuche, juristische Dokumentenanalyse und Präzedenzfallsuche",
    icon: "⚖️",
    relevantSkills: ["SK-DOM-001", "SK-DOM-006", "SK-SOC-020"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-COM-001", name: "Meeting & Transcription AI", name_de: "Meeting- & Transkriptions-KI",
    category: "communication",
    description_en: "Real-time transcription, meeting summaries, and action item extraction",
    description_de: "Echtzeit-Transkription, Meeting-Zusammenfassungen und Aktionspunkt-Extraktion",
    icon: "🎙️",
    relevantSkills: ["SK-SOC-001", "SK-SOC-014", "SK-DIG-006", "SK-OPS-010"],
    relevantLabels: ["automatable", "high_ai_potential"],
  },
  {
    id: "AT-COM-002", name: "Customer Service AI", name_de: "Kundenservice-KI",
    category: "communication",
    description_en: "AI chatbots, sentiment analysis, and automated customer response",
    description_de: "KI-Chatbots, Stimmungsanalyse und automatisierte Kundenantworten",
    icon: "💬",
    relevantSkills: ["SK-SOC-009", "SK-OPS-022", "SK-SOC-016"],
    relevantLabels: ["automatable", "high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-COM-003", name: "HR & Recruitment AI", name_de: "HR- & Recruiting-KI",
    category: "communication",
    description_en: "AI-assisted candidate screening, interview scheduling, and talent matching",
    description_de: "KI-gestütztes Kandidaten-Screening, Interview-Planung und Talent-Matching",
    icon: "👥",
    relevantSkills: ["SK-SOC-017", "SK-SOC-013", "SK-COG-004"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-DES-001", name: "Image Generation AI", name_de: "Bildgenerierungs-KI",
    category: "design",
    description_en: "AI image creation, editing, and visual content generation",
    description_de: "KI-Bilderstellung, -bearbeitung und visuelle Inhaltsgenerierung",
    icon: "🎨",
    relevantSkills: ["SK-TEC-015", "SK-DIG-008", "SK-DIG-007"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-DES-002", name: "Video & Audio AI", name_de: "Video- & Audio-KI",
    category: "design",
    description_en: "AI video editing, voice synthesis, and multimedia production",
    description_de: "KI-Videobearbeitung, Sprachsynthese und Multimedia-Produktion",
    icon: "🎬",
    relevantSkills: ["SK-DIG-016", "SK-DIG-008", "SK-TEC-015"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-DOM-001", name: "Clinical Decision Support", name_de: "Klinische Entscheidungshilfe",
    category: "domain_specific",
    description_en: "AI-assisted diagnosis, treatment recommendations, and medical imaging analysis",
    description_de: "KI-gestützte Diagnose, Behandlungsempfehlungen und medizinische Bildanalyse",
    icon: "🏥",
    relevantSkills: ["SK-DOM-003", "SK-DOM-004", "SK-DOM-011", "SK-TEC-016"],
    relevantLabels: ["ai_assisted"],
  },
  {
    id: "AT-DOM-002", name: "Safety & Monitoring AI", name_de: "Sicherheits- & Überwachungs-KI",
    category: "domain_specific",
    description_en: "AI-powered safety monitoring, hazard detection, and incident prediction",
    description_de: "KI-gestützte Sicherheitsüberwachung, Gefahrenerkennung und Vorfallprognose",
    icon: "🚨",
    relevantSkills: ["SK-TEC-008", "SK-OPS-020", "SK-DOM-007", "SK-DOM-009", "SK-OPS-019"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-DOM-003", name: "Education & Training AI", name_de: "Bildungs- & Trainings-KI",
    category: "domain_specific",
    description_en: "Adaptive learning platforms, automated grading, and personalized curricula",
    description_de: "Adaptive Lernplattformen, automatisierte Bewertung und personalisierte Lehrpläne",
    icon: "📚",
    relevantSkills: ["SK-SOC-008", "SK-SOC-007", "SK-DOM-008", "SK-SOC-019"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-DOM-004", name: "Environmental & Agri AI", name_de: "Umwelt- & Agrar-KI",
    category: "domain_specific",
    description_en: "AI for environmental monitoring, precision agriculture, and sustainability analysis",
    description_de: "KI für Umweltüberwachung, Präzisionslandwirtschaft und Nachhaltigkeitsanalyse",
    icon: "🌱",
    relevantSkills: ["SK-DOM-015", "SK-OPS-011", "SK-DOM-017"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-COD-001", name: "Code Generation AI", name_de: "Code-Generierungs-KI",
    category: "coding",
    description_en: "AI pair programming, code completion, and automated testing",
    description_de: "KI-Paarprogrammierung, Code-Vervollständigung und automatisiertes Testen",
    icon: "💻",
    relevantSkills: ["SK-DIG-001", "SK-DIG-004", "SK-DIG-011"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-COD-002", name: "Cybersecurity AI", name_de: "Cybersicherheits-KI",
    category: "coding",
    description_en: "AI threat detection, vulnerability scanning, and security automation",
    description_de: "KI-Bedrohungserkennung, Schwachstellenprüfung und Sicherheitsautomatisierung",
    icon: "🔒",
    relevantSkills: ["SK-DIG-005", "SK-DIG-014", "SK-DIG-004"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-AUT-005", name: "E-Commerce & Marketing AI", name_de: "E-Commerce- & Marketing-KI",
    category: "automation",
    description_en: "Automated marketing campaigns, product recommendations, and sales optimization",
    description_de: "Automatisierte Marketingkampagnen, Produktempfehlungen und Vertriebsoptimierung",
    icon: "🛒",
    relevantSkills: ["SK-DIG-018", "SK-OPS-006", "SK-OPS-005"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
  {
    id: "AT-ANA-004", name: "Process Mining AI", name_de: "Process-Mining-KI",
    category: "analysis",
    description_en: "AI-powered process discovery, bottleneck analysis, and optimization",
    description_de: "KI-gestützte Prozesserkennung, Engpassanalyse und Optimierung",
    icon: "🔄",
    relevantSkills: ["SK-COG-013", "SK-OPS-002", "SK-COG-009", "SK-OPS-007"],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
  },
];

export function getToolsForOccupation(occupationTasks: { label: string; skills: string[] }[]): {
  tool: AITool;
  matchedSkills: string[];
  taskCount: number;
  exposure: "high" | "medium" | "low";
}[] {
  const aiExposedTasks = occupationTasks.filter(t =>
    t.label === "automatable" || t.label === "high_ai_potential" || t.label === "ai_assisted"
  );

  const skillSet = new Set<string>();
  for (const t of aiExposedTasks) {
    for (const s of (t.skills || [])) skillSet.add(s);
  }

  return AI_TOOLS.map(tool => {
    const matchedSkills = tool.relevantSkills.filter(s => skillSet.has(s));
    if (matchedSkills.length === 0) return null;

    const taskCount = aiExposedTasks.filter(t =>
      (t.skills || []).some(s => matchedSkills.includes(s))
    ).length;

    const exposure: "high" | "medium" | "low" =
      taskCount >= 5 ? "high" : taskCount >= 2 ? "medium" : "low";

    return { tool, matchedSkills, taskCount, exposure };
  }).filter(Boolean) as any[];
}

