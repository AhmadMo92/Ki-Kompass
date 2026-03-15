export type AIToolCategory = "writing" | "analysis" | "productivity" | "design" | "coding" | "communication" | "marketing" | "hr";

export interface RealTool {
  name: string;
  logo: string;
  url: string;
  description_en: string;
  description_de: string;
}

export interface AIToolNode {
  id: string;
  category: AIToolCategory;
  label_en: string;
  label_de: string;
  description_en: string;
  description_de: string;
  color: string;
  bg: string;
  icon: string;
  topTools: RealTool[];
  relevantLabels: ("automatable" | "high_ai_potential" | "ai_assisted")[];
  relevantSkills: string[];
}

export const AI_TOOL_CATEGORIES: Record<AIToolCategory, { label_en: string; label_de: string; color: string; bg: string }> = {
  writing:        { label_en: "Writing & Content",      label_de: "Schreiben & Inhalte",         color: "#7C3AED", bg: "#F5F3FF" },
  analysis:       { label_en: "Data & Analysis",        label_de: "Daten & Analyse",             color: "#0891B2", bg: "#ECFEFF" },
  productivity:   { label_en: "Productivity",            label_de: "Produktivität",               color: "#EA580C", bg: "#FFF7ED" },
  design:         { label_en: "Design & Media",          label_de: "Design & Medien",             color: "#DB2777", bg: "#FDF2F8" },
  coding:         { label_en: "Code & Engineering",      label_de: "Code & Engineering",          color: "#374151", bg: "#F3F4F6" },
  communication:  { label_en: "Communication",           label_de: "Kommunikation",               color: "#16A34A", bg: "#F0FDF4" },
  marketing:      { label_en: "Marketing & CRM",         label_de: "Marketing & CRM",             color: "#2563EB", bg: "#EFF6FF" },
  hr:             { label_en: "HR & People",             label_de: "HR & Personal",               color: "#854D0E", bg: "#FEFCE8" },
};

export const AI_TOOL_NODES: AIToolNode[] = [
  {
    id: "node-writing",
    category: "writing",
    label_en: "Writing & Content",
    label_de: "Schreiben & Inhalte",
    description_en: "Draft, summarize, translate, and polish text at speed",
    description_de: "Texte entwerfen, zusammenfassen, übersetzen und optimieren",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: "✍️",
    topTools: [
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "Versatile AI assistant for drafting, editing, and brainstorming", description_de: "Vielseitiger KI-Assistent zum Entwerfen, Bearbeiten und Brainstorming" },
      { name: "Claude", logo: "/tool-logos/claude.png", url: "https://claude.ai", description_en: "Long-context AI for nuanced writing and analysis", description_de: "KI mit langem Kontext für nuanciertes Schreiben und Analysen" },
      { name: "Jasper", logo: "/tool-logos/jasper.png", url: "https://jasper.ai", description_en: "AI content platform for marketing and brand voice", description_de: "KI-Content-Plattform für Marketing und Markensprache" },
    ],
    relevantLabels: ["automatable", "high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-SOC-002", "SK-SOC-019", "SK-DIG-008", "SK-COG-005", "SK-OPS-010", "SK-TEC-009", "SK-SOC-015", "SK-SOC-001"],
  },
  {
    id: "node-analysis",
    category: "analysis",
    label_en: "Data & Analysis",
    label_de: "Daten & Analyse",
    description_en: "Analyze data, find patterns, model scenarios",
    description_de: "Daten analysieren, Muster erkennen, Szenarien modellieren",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: "📊",
    topTools: [
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "Data analysis with Code Interpreter for charts and insights", description_de: "Datenanalyse mit Code-Interpreter für Diagramme und Erkenntnisse" },
      { name: "Gemini", logo: "/tool-logos/gemini.png", url: "https://gemini.google.com", description_en: "Google's AI for data-heavy research and multimodal analysis", description_de: "Googles KI für datenintensive Recherche und multimodale Analyse" },
      { name: "Claude", logo: "/tool-logos/claude.png", url: "https://claude.ai", description_en: "Deep document analysis and structured data extraction", description_de: "Tiefgehende Dokumentenanalyse und strukturierte Datenextraktion" },
    ],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-COG-006", "SK-COG-007", "SK-COG-016", "SK-DIG-003", "SK-COG-011", "SK-COG-010", "SK-DOM-002", "SK-COG-013", "SK-COG-017"],
  },
  {
    id: "node-productivity",
    category: "productivity",
    label_en: "Productivity",
    label_de: "Produktivität",
    description_en: "Organize work, automate tasks, manage projects",
    description_de: "Arbeit organisieren, Aufgaben automatisieren, Projekte verwalten",
    color: "#EA580C",
    bg: "#FFF7ED",
    icon: "⚡",
    topTools: [
      { name: "Notion", logo: "/tool-logos/notion.png", url: "https://notion.so", description_en: "AI-powered workspace for docs, wikis, and project management", description_de: "KI-gestützter Workspace für Docs, Wikis und Projektmanagement" },
      { name: "Asana", logo: "/tool-logos/asana.png", url: "https://asana.com", description_en: "Smart project management with AI task prioritization", description_de: "Smartes Projektmanagement mit KI-Aufgabenpriorisierung" },
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "Automate planning, checklists, and process documentation", description_de: "Planung, Checklisten und Prozessdokumentation automatisieren" },
    ],
    relevantLabels: ["automatable", "high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-COG-003", "SK-DIG-015", "SK-OPS-002", "SK-COG-022", "SK-OPS-016", "SK-OPS-008", "SK-OPS-010"],
  },
  {
    id: "node-design",
    category: "design",
    label_en: "Design & Media",
    label_de: "Design & Medien",
    description_en: "Create visuals, edit images, generate media",
    description_de: "Visuals erstellen, Bilder bearbeiten, Medien generieren",
    color: "#DB2777",
    bg: "#FDF2F8",
    icon: "🎨",
    topTools: [
      { name: "Canva", logo: "/tool-logos/canva.jpeg", url: "https://canva.com", description_en: "AI-powered design for presentations, social media, and branding", description_de: "KI-gestütztes Design für Präsentationen, Social Media und Branding" },
      { name: "Midjourney", logo: "/tool-logos/midjourney.png", url: "https://midjourney.com", description_en: "Leading AI image generation for creative visuals", description_de: "Führende KI-Bildgenerierung für kreative Visuals" },
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "DALL-E integration for quick image generation and editing", description_de: "DALL-E-Integration für schnelle Bildgenerierung und -bearbeitung" },
    ],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-TEC-015", "SK-DIG-008", "SK-DIG-007", "SK-DIG-016", "SK-SOC-012", "SK-DIG-003"],
  },
  {
    id: "node-coding",
    category: "coding",
    label_en: "Code & Engineering",
    label_de: "Code & Engineering",
    description_en: "Write code, review PRs, debug, and ship faster",
    description_de: "Code schreiben, PRs reviewen, debuggen und schneller liefern",
    color: "#374151",
    bg: "#F3F4F6",
    icon: "💻",
    topTools: [
      { name: "Cursor", logo: "/tool-logos/cursor.jpeg", url: "https://cursor.sh", description_en: "AI-first code editor with deep codebase understanding", description_de: "KI-nativer Code-Editor mit tiefem Codebase-Verständnis" },
      { name: "GitHub Copilot", logo: "/tool-logos/github.png", url: "https://github.com/features/copilot", description_en: "AI pair programmer integrated into your IDE", description_de: "KI-Pair-Programmer direkt in deiner IDE" },
      { name: "Claude", logo: "/tool-logos/claude.png", url: "https://claude.ai", description_en: "Advanced reasoning for architecture decisions and code review", description_de: "Fortgeschrittenes Reasoning für Architekturentscheidungen und Code-Review" },
    ],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-DIG-001", "SK-DIG-004", "SK-DIG-011", "SK-DIG-005", "SK-DIG-014"],
  },
  {
    id: "node-communication",
    category: "communication",
    label_en: "Communication",
    label_de: "Kommunikation",
    description_en: "Transcribe meetings, polish emails, improve writing",
    description_de: "Meetings transkribieren, E-Mails optimieren, Schreiben verbessern",
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: "💬",
    topTools: [
      { name: "Otter.ai", logo: "/tool-logos/otter.png", url: "https://otter.ai", description_en: "Real-time meeting transcription and smart summaries", description_de: "Echtzeit-Meeting-Transkription und smarte Zusammenfassungen" },
      { name: "Grammarly", logo: "/tool-logos/grammarly.png", url: "https://grammarly.com", description_en: "AI writing assistant for tone, clarity, and grammar", description_de: "KI-Schreibassistent für Ton, Klarheit und Grammatik" },
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "Draft emails, prepare talking points, summarize threads", description_de: "E-Mails entwerfen, Gesprächspunkte vorbereiten, Threads zusammenfassen" },
    ],
    relevantLabels: ["automatable", "high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-SOC-001", "SK-SOC-014", "SK-DIG-006", "SK-OPS-010", "SK-SOC-009", "SK-SOC-016"],
  },
  {
    id: "node-marketing",
    category: "marketing",
    label_en: "Marketing & CRM",
    label_de: "Marketing & CRM",
    description_en: "Run campaigns, manage leads, optimize funnels",
    description_de: "Kampagnen steuern, Leads verwalten, Funnels optimieren",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: "📣",
    topTools: [
      { name: "HubSpot", logo: "/tool-logos/hubspot.webp", url: "https://hubspot.com", description_en: "All-in-one CRM with AI-powered marketing automation", description_de: "All-in-One CRM mit KI-gestützter Marketingautomatisierung" },
      { name: "Jasper", logo: "/tool-logos/jasper.png", url: "https://jasper.ai", description_en: "AI marketing content at scale with brand voice control", description_de: "KI-Marketinginhalte im großen Stil mit Markenstimme" },
      { name: "Canva", logo: "/tool-logos/canva.jpeg", url: "https://canva.com", description_en: "Quick visual content for social media and campaigns", description_de: "Schnelle visuelle Inhalte für Social Media und Kampagnen" },
    ],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-DIG-018", "SK-OPS-006", "SK-OPS-005", "SK-SOC-009", "SK-OPS-022"],
  },
  {
    id: "node-hr",
    category: "hr",
    label_en: "HR & People",
    label_de: "HR & Personal",
    description_en: "Recruit, onboard, manage talent processes",
    description_de: "Rekrutieren, Onboarding, Talentprozesse verwalten",
    color: "#854D0E",
    bg: "#FEFCE8",
    icon: "👥",
    topTools: [
      { name: "Personio", logo: "/tool-logos/personio.png", url: "https://personio.de", description_en: "All-in-one HR platform with AI-assisted workflows", description_de: "All-in-One HR-Plattform mit KI-gestützten Workflows" },
      { name: "ChatGPT", logo: "/tool-logos/chatgpt.webp", url: "https://chat.openai.com", description_en: "Draft job descriptions, screen CVs, prepare interview guides", description_de: "Stellenausschreibungen erstellen, CVs sichten, Interviewleitfäden vorbereiten" },
      { name: "Notion", logo: "/tool-logos/notion.png", url: "https://notion.so", description_en: "Organize onboarding, policies, and team knowledge bases", description_de: "Onboarding, Richtlinien und Team-Wissensdatenbanken organisieren" },
    ],
    relevantLabels: ["high_ai_potential", "ai_assisted"],
    relevantSkills: ["SK-SOC-017", "SK-SOC-013", "SK-COG-004", "SK-SOC-007", "SK-SOC-008"],
  },
];

export function getRelevantNodes(tasks: { label: string; skills: string[] }[]): {
  node: AIToolNode;
  relevance: number;
}[] {
  const aiExposedTasks = tasks.filter(t =>
    t.label === "automatable" || t.label === "high_ai_potential" || t.label === "ai_assisted"
  );

  const skillSet = new Set<string>();
  for (const t of aiExposedTasks) {
    for (const s of (t.skills || [])) skillSet.add(s);
  }

  const labelSet = new Set(aiExposedTasks.map(t => t.label));

  return AI_TOOL_NODES
    .map(node => {
      const skillMatch = node.relevantSkills.filter(s => skillSet.has(s)).length;
      const labelMatch = node.relevantLabels.filter(l => labelSet.has(l)).length;
      const relevance = skillMatch * 2 + labelMatch;
      return { node, relevance };
    })
    .filter(r => r.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
}
