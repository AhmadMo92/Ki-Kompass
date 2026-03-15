export type EvidenceLevel = "strong" | "moderate" | "limited";

export interface PeerStat {
  stat_en: string;
  stat_de: string;
  source: string;
  evidence: EvidenceLevel;
}

export interface PeerToolUsage {
  tool: string;
  tasks_en: string;
  tasks_de: string;
}

export interface SectorPeerData {
  label_en: string;
  label_de: string;
  adoption_pct: number;
  stats: PeerStat[];
  topTools: PeerToolUsage[];
}

export const SECTOR_PEER_DATA: Record<string, SectorPeerData> = {
  it_informatik: {
    label_en: "Tech & IT",
    label_de: "IT & Informatik",
    adoption_pct: 90,
    stats: [
      { stat_en: "90% of developers use AI tools. Median 2 hours daily. But 46% distrust accuracy.", stat_de: "90% der Entwickler nutzen KI-Tools. Median 2 Std. täglich. Aber 46% misstrauen der Genauigkeit.", source: "DORA 2025", evidence: "strong" },
      { stat_en: "The #1 Claude task globally: modifying software to correct errors — 6% of all usage.", stat_de: "Häufigste Claude-Aufgabe weltweit: Software-Fehler beheben — 6% der gesamten Nutzung.", source: "Anthropic 2025", evidence: "strong" },
      { stat_en: "IT leads enterprise ChatGPT adoption at 27% of all business users.", stat_de: "IT führt die ChatGPT-Unternehmensadoption mit 27% aller Business-Nutzer.", source: "OpenAI 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "GitHub Copilot", tasks_en: "Code completion, test generation, documentation", tasks_de: "Code-Vervollständigung, Test-Generierung, Dokumentation" },
      { tool: "ChatGPT / Claude", tasks_en: "Debugging, architecture decisions, code review", tasks_de: "Debugging, Architekturentscheidungen, Code-Review" },
      { tool: "Cursor", tasks_en: "AI-native coding, refactoring, codebase Q&A", tasks_de: "KI-natives Programmieren, Refactoring, Codebase-Fragen" },
    ],
  },
  medien_marketing: {
    label_en: "Media & Marketing",
    label_de: "Medien & Marketing",
    adoption_pct: 84,
    stats: [
      { stat_en: "~84% AI adoption in German advertising & market research — highest of any sector.", stat_de: "~84% KI-Adoption in deutscher Werbung & Marktforschung — höchste aller Sektoren.", source: "ifo 2025", evidence: "strong" },
      { stat_en: "90% of marketers tried GenAI. 76% use it for writing, 71% for brainstorming.", stat_de: "90% der Marketer haben GenAI ausprobiert. 76% zum Schreiben, 71% zum Brainstorming.", source: "AMA 2024", evidence: "strong" },
      { stat_en: "Arts, design & writing = ~10% of all Claude usage. Growing steadily.", stat_de: "Kunst, Design & Schreiben = ~10% aller Claude-Nutzung. Stetig wachsend.", source: "Anthropic 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Blog posts, ad copy, social media, campaign ideation", tasks_de: "Blogbeiträge, Anzeigentexte, Social-Media, Kampagnenideen" },
      { tool: "Canva AI / Adobe Firefly", tasks_en: "Visual content, graphics, video editing", tasks_de: "Visuelle Inhalte, Grafiken, Videobearbeitung" },
      { tool: "HubSpot / Jasper", tasks_en: "SEO, segmentation, automated campaigns", tasks_de: "SEO, Segmentierung, automatisierte Kampagnen" },
    ],
  },
  finanzen_recht: {
    label_en: "Finance & Law",
    label_de: "Finanzen & Recht",
    adoption_pct: 69,
    stats: [
      { stat_en: "69% of lawyers now use AI — up from 27% in 2024. 28% use it daily.", stat_de: "69% der Anwälte nutzen jetzt KI — von 27% in 2024. 28% nutzen es täglich.", source: "Legal Report 2026", evidence: "strong" },
      { stat_en: "Finance & insurance = fastest-growing ChatGPT enterprise segment.", stat_de: "Finanzen & Versicherungen = am schnellsten wachsendes ChatGPT-Unternehmenssegment.", source: "OpenAI 2025", evidence: "strong" },
      { stat_en: "81% of finance pros expect AI agents to become standard within 5 years.", stat_de: "81% der Finanzexperten erwarten KI-Agenten als Standard innerhalb von 5 Jahren.", source: "Deloitte 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT / Claude", tasks_en: "Drafting, research, case summaries", tasks_de: "Entwürfe, Recherche, Fallzusammenfassungen" },
      { tool: "Harvey AI", tasks_en: "Legal research, contract analysis, compliance", tasks_de: "Rechtsrecherche, Vertragsanalyse, Compliance" },
      { tool: "Excel / Copilot", tasks_en: "Financial modeling, anomaly detection, reports", tasks_de: "Finanzmodellierung, Anomalieerkennung, Berichte" },
    ],
  },
  gesundheit: {
    label_en: "Healthcare",
    label_de: "Gesundheit",
    adoption_pct: 40,
    stats: [
      { stat_en: "80% of hospitals use AI for admin. Only 40% of physicians ready for GenAI at point-of-care.", stat_de: "80% der Krankenhäuser nutzen KI für Verwaltung. Nur 40% der Ärzte bereit für GenAI in der Versorgung.", source: "Deloitte 2024", evidence: "moderate" },
      { stat_en: "Healthcare shows lowest AI usage across both Anthropic and OpenAI data.", stat_de: "Gesundheitswesen zeigt niedrigste KI-Nutzung in Anthropic- und OpenAI-Daten.", source: "Anthropic + OpenAI 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "Nuance DAX", tasks_en: "Clinical documentation, ambient listening", tasks_de: "Klinische Dokumentation, Umgebungsaufnahme" },
      { tool: "ChatGPT", tasks_en: "Research summaries, admin correspondence", tasks_de: "Forschungszusammenfassungen, Verwaltungskorrespondenz" },
    ],
  },
  unternehmensfuehrung: {
    label_en: "Business & Management",
    label_de: "Unternehmensführung",
    adoption_pct: 54,
    stats: [
      { stat_en: "54% of project managers use AI for risk management. 63% report productivity gains.", stat_de: "54% der Projektmanager nutzen KI fürs Risikomanagement. 63% berichten von Produktivitätsgewinn.", source: "Capterra 2025", evidence: "moderate" },
      { stat_en: "Management: 50% of ChatGPT work tasks. Writing (memos, reports) is #1 use.", stat_de: "Management: 50% der ChatGPT-Arbeitsaufgaben. Schreiben (Memos, Berichte) ist #1.", source: "OpenAI/NBER 2025", evidence: "strong" },
      { stat_en: "79% of consultants use AI sometimes, but only 10% always.", stat_de: "79% der Berater nutzen KI gelegentlich, aber nur 10% immer.", source: "EU Survey (n=500)", evidence: "moderate" },
    ],
    topTools: [
      { tool: "ChatGPT / Copilot", tasks_en: "Meeting notes, strategy, report drafts", tasks_de: "Meeting-Notizen, Strategie, Berichtsentwürfe" },
      { tool: "Notion AI", tasks_en: "Project planning, knowledge base", tasks_de: "Projektplanung, Wissensdatenbank" },
    ],
  },
  soziales_erziehung: {
    label_en: "Education & Social",
    label_de: "Soziales & Erziehung",
    adoption_pct: 60,
    stats: [
      { stat_en: "60% of teachers use AI for classroom tasks. ~30% weekly.", stat_de: "60% der Lehrkräfte nutzen KI für den Unterricht. ~30% wöchentlich.", source: "Education Research 2025", evidence: "moderate" },
      { stat_en: "Education = 15% of Claude usage — fastest growing category (up from 9%).", stat_de: "Bildung = 15% der Claude-Nutzung — am schnellsten wachsend (von 9%).", source: "Anthropic 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Lesson plans, worksheets, quiz generation", tasks_de: "Unterrichtspläne, Arbeitsblätter, Quiz-Erstellung" },
      { tool: "Canva AI", tasks_en: "Educational materials, presentations", tasks_de: "Lehrmaterialien, Präsentationen" },
    ],
  },
  vertrieb_handel: {
    label_en: "Sales & Retail",
    label_de: "Vertrieb & Handel",
    adoption_pct: 50,
    stats: [
      { stat_en: "65% of talent acquisition teams use AI. Only 34% are power users.", stat_de: "65% der TA-Teams nutzen KI. Nur 34% sind Power-User.", source: "LinkedIn 2025", evidence: "strong" },
      { stat_en: "~50% AI adoption in German retail.", stat_de: "~50% KI-Adoption im deutschen Einzelhandel.", source: "ifo 2025", evidence: "strong" },
      { stat_en: "61% of reps say AI helps understand customers. Only 39% extract full value.", stat_de: "61% sagen, KI hilft Kunden zu verstehen. Nur 39% nutzen es voll.", source: "Salesforce 2024", evidence: "moderate" },
    ],
    topTools: [
      { tool: "Salesforce Einstein", tasks_en: "Lead scoring, insights, forecasting", tasks_de: "Lead-Bewertung, Einblicke, Prognosen" },
      { tool: "ChatGPT", tasks_en: "Email drafts, proposals, meeting prep", tasks_de: "E-Mail-Entwürfe, Angebote, Meeting-Vorbereitung" },
    ],
  },
  kreativ_gestaltung: {
    label_en: "Creative & Design",
    label_de: "Kreativ & Gestaltung",
    adoption_pct: 55,
    stats: [
      { stat_en: "Arts, design & writing = ~10% of Claude usage, growing from 8% in 2025.", stat_de: "Kunst, Design & Schreiben = ~10% der Claude-Nutzung, gewachsen von 8% in 2025.", source: "Anthropic 2025", evidence: "strong" },
      { stat_en: "No role-specific survey for designers exists. Best baseline: 27% white-collar daily AI use.", stat_de: "Keine rollenspezifische Studie für Designer. Richtwert: 27% Wissensarbeiter täglich.", source: "McKinsey 2025", evidence: "limited" },
    ],
    topTools: [
      { tool: "Midjourney / DALL-E", tasks_en: "Concept art, mood boards, visual exploration", tasks_de: "Konzeptkunst, Moodboards, visuelle Exploration" },
      { tool: "Figma AI", tasks_en: "Layout suggestions, content generation, prototyping", tasks_de: "Layout-Vorschläge, Inhaltsgenerierung, Prototyping" },
    ],
  },
  wissenschaft_forschung: {
    label_en: "Science & Research",
    label_de: "Wissenschaft & Forschung",
    adoption_pct: 52,
    stats: [
      { stat_en: "Science & research = ~7% of Claude usage, growing steadily in 2025.", stat_de: "Wissenschaft & Forschung = ~7% der Claude-Nutzung, stetig wachsend in 2025.", source: "Anthropic 2025", evidence: "strong" },
      { stat_en: "Professional & scientific services = 17% of ChatGPT enterprise users.", stat_de: "Professionelle & wissenschaftliche Dienste = 17% der ChatGPT-Unternehmensnutzer.", source: "OpenAI 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "Elicit / Consensus", tasks_en: "Literature search, paper summaries, evidence synthesis", tasks_de: "Literatursuche, Paper-Zusammenfassung, Evidenzsynthese" },
      { tool: "ChatGPT / Claude", tasks_en: "Writing assistance, methodology, analysis", tasks_de: "Schreibunterstützung, Methodik, Analyse" },
    ],
  },
  naturwissenschaft: {
    label_en: "Natural Sciences",
    label_de: "Naturwissenschaft",
    adoption_pct: 45,
    stats: [
      { stat_en: "Science = ~7% of Claude usage. Lab work and physical tasks remain fully human.", stat_de: "Wissenschaft = ~7% der Claude-Nutzung. Laborarbeit und physische Aufgaben bleiben menschlich.", source: "Anthropic 2025", evidence: "strong" },
      { stat_en: "No role-specific survey for natural scientists. Baseline: 27% white-collar daily AI use.", stat_de: "Keine rollenspezifische Studie. Richtwert: 27% Wissensarbeiter täglich.", source: "McKinsey 2025", evidence: "limited" },
    ],
    topTools: [
      { tool: "ChatGPT / Claude", tasks_en: "Protocol drafting, report writing, research planning", tasks_de: "Protokollerstellung, Berichterstellung, Forschungsplanung" },
      { tool: "Python + AI libs", tasks_en: "Data processing, visualization, statistics", tasks_de: "Datenverarbeitung, Visualisierung, Statistik" },
    ],
  },
  produktion_handwerk: {
    label_en: "Production & Trades",
    label_de: "Produktion & Handwerk",
    adoption_pct: 31,
    stats: [
      { stat_en: "~31% AI adoption in German construction — lowest of all sectors surveyed.", stat_de: "~31% KI-Adoption im deutschen Bauwesen — niedrigste aller Sektoren.", source: "ifo 2025", evidence: "strong" },
      { stat_en: "Physical and manual tasks remain almost entirely human-led across all AI studies.", stat_de: "Physische und manuelle Aufgaben bleiben in allen KI-Studien fast vollständig menschlich.", source: "Anthropic + OpenAI 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Documentation, safety reports, procedure drafts", tasks_de: "Dokumentation, Sicherheitsberichte, Verfahrensentwürfe" },
      { tool: "Excel / Copilot", tasks_en: "Inventory tracking, production planning", tasks_de: "Bestandsverfolgung, Produktionsplanung" },
    ],
  },
};

export function getPeerUsage(sector: string): SectorPeerData | undefined {
  return SECTOR_PEER_DATA[sector];
}
