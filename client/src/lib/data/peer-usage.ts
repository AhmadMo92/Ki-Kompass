export interface PeerToolUsage {
  tool: string;
  tasks_en: string;
  tasks_de: string;
}

export interface PeerInsight {
  stat_en: string;
  stat_de: string;
  source?: string;
}

export interface SectorPeerData {
  label_en: string;
  label_de: string;
  adoption_pct: number;
  frequency_en: string;
  frequency_de: string;
  insights: PeerInsight[];
  topTools: PeerToolUsage[];
}

export const PEER_USAGE: Record<string, SectorPeerData> = {
  it_informatik: {
    label_en: "Tech & IT",
    label_de: "IT & Informatik",
    adoption_pct: 76,
    frequency_en: "62% use AI tools weekly; many use them daily",
    frequency_de: "62% nutzen KI-Tools wöchentlich; viele täglich",
    insights: [
      { stat_en: "76% of developers use or plan to use AI in development", stat_de: "76% der Entwickler nutzen KI oder planen dies", source: "Stack Overflow 2024" },
      { stat_en: "81% expect AI to help with code documentation", stat_de: "81% erwarten KI-Hilfe bei Code-Dokumentation", source: "Stack Overflow 2024" },
      { stat_en: "Developers still carefully verify AI-generated code", stat_de: "Entwickler überprüfen KI-generierten Code weiterhin sorgfältig", source: "Industry research" },
    ],
    topTools: [
      { tool: "GitHub Copilot", tasks_en: "Writing and testing code, code completion", tasks_de: "Code schreiben und testen, Code-Vervollständigung" },
      { tool: "ChatGPT", tasks_en: "Debugging, documentation, architecture decisions", tasks_de: "Debugging, Dokumentation, Architekturentscheidungen" },
      { tool: "Cursor", tasks_en: "AI-first coding, refactoring, code review", tasks_de: "KI-gestütztes Programmieren, Refactoring, Code-Review" },
    ],
  },
  medien_marketing: {
    label_en: "Media & Marketing",
    label_de: "Medien & Marketing",
    adoption_pct: 90,
    frequency_en: "71% use AI weekly or more; 90% have tried generative AI",
    frequency_de: "71% nutzen KI wöchentlich oder öfter; 90% haben generative KI ausprobiert",
    insights: [
      { stat_en: "76% use AI for writing content, 71% for creative brainstorming", stat_de: "76% nutzen KI zum Schreiben, 71% zum kreativen Brainstorming", source: "AMA/Lightricks 2024" },
      { stat_en: "85% of marketers report productivity improvements from AI", stat_de: "85% der Marketer berichten von Produktivitätssteigerungen durch KI", source: "AMA Survey" },
      { stat_en: "Most use AI for drafts, but edit heavily for brand consistency", stat_de: "KI wird meist für Entwürfe genutzt, stark überarbeitet für Markenkonsistenz", source: "Industry research" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Blog posts, ad copy, social media content, campaign ideas", tasks_de: "Blogbeiträge, Anzeigentexte, Social-Media-Inhalte, Kampagnenideen" },
      { tool: "Canva AI", tasks_en: "Visual content, presentations, social media graphics", tasks_de: "Visuelle Inhalte, Präsentationen, Social-Media-Grafiken" },
      { tool: "HubSpot AI", tasks_en: "SEO optimization, customer segmentation, email campaigns", tasks_de: "SEO-Optimierung, Kundensegmentierung, E-Mail-Kampagnen" },
    ],
  },
  finanzen_recht: {
    label_en: "Finance & Law",
    label_de: "Finanzen & Recht",
    adoption_pct: 69,
    frequency_en: "28% of lawyers use AI daily; 31% multiple times per week",
    frequency_de: "28% der Anwälte nutzen KI täglich; 31% mehrmals pro Woche",
    insights: [
      { stat_en: "69% of lawyers now use AI tools — up from 27% in 2024", stat_de: "69% der Anwälte nutzen jetzt KI — von 27% in 2024 gestiegen", source: "Legal industry report 2026" },
      { stat_en: "58% use AI for drafting correspondence and legal research", stat_de: "58% nutzen KI für Korrespondenz und Rechtsrecherche", source: "Legal industry report 2026" },
      { stat_en: "81% of finance pros expect AI to be mainstream within 5 years", stat_de: "81% der Finanzexperten erwarten KI-Mainstream innerhalb von 5 Jahren", source: "Deloitte 2025" },
    ],
    topTools: [
      { tool: "ChatGPT / Claude", tasks_en: "Drafting correspondence, brainstorming, case summaries", tasks_de: "Korrespondenz entwerfen, Brainstorming, Fallzusammenfassungen" },
      { tool: "Harvey AI", tasks_en: "Legal research, contract analysis, compliance checks", tasks_de: "Rechtsrecherche, Vertragsanalyse, Compliance-Prüfung" },
      { tool: "Excel Copilot", tasks_en: "Financial modeling, report drafting, anomaly detection", tasks_de: "Finanzmodellierung, Berichterstellung, Anomalieerkennung" },
    ],
  },
  gesundheit: {
    label_en: "Healthcare",
    label_de: "Gesundheit",
    adoption_pct: 38,
    frequency_en: "Growing use in documentation and diagnostics support",
    frequency_de: "Wachsende Nutzung bei Dokumentation und Diagnostik-Unterstützung",
    insights: [
      { stat_en: "AI is increasingly used for clinical documentation and patient records", stat_de: "KI wird zunehmend für klinische Dokumentation und Patientenakten eingesetzt" },
      { stat_en: "Trust-sensitive tasks remain firmly human-led", stat_de: "Vertrauenssensible Aufgaben bleiben klar menschlich geführt" },
      { stat_en: "AI supports diagnostics, but final decisions stay with clinicians", stat_de: "KI unterstützt Diagnostik, finale Entscheidungen bleiben bei Ärzten" },
    ],
    topTools: [
      { tool: "Nuance DAX", tasks_en: "Clinical documentation, ambient listening, note generation", tasks_de: "Klinische Dokumentation, Umgebungsaufnahme, Notizenerstellung" },
      { tool: "ChatGPT", tasks_en: "Research summaries, patient communication drafts", tasks_de: "Forschungszusammenfassungen, Entwürfe für Patientenkommunikation" },
      { tool: "Ada Health", tasks_en: "Symptom assessment, triage support", tasks_de: "Symptombewertung, Triage-Unterstützung" },
    ],
  },
  unternehmensfuehrung: {
    label_en: "Business & Management",
    label_de: "Unternehmensführung",
    adoption_pct: 79,
    frequency_en: "79% of consultants use AI at least sometimes",
    frequency_de: "79% der Berater nutzen KI zumindest gelegentlich",
    insights: [
      { stat_en: "76% use AI for brainstorming ideas, but only 10% use it consistently", stat_de: "76% nutzen KI zum Brainstorming, aber nur 10% nutzen es konsistent", source: "EU consultant study" },
      { stat_en: "Workers estimate ~27% of tasks could be delegated to AI agents now", stat_de: "Mitarbeiter schätzen, dass ~27% der Aufgaben an KI-Agenten delegiert werden könnten", source: "McKinsey" },
      { stat_en: "ChatGPT is near-universal; Copilot and Gemini are also widely used", stat_de: "ChatGPT ist fast universell; Copilot und Gemini werden ebenfalls breit genutzt" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Meeting summaries, strategy brainstorming, report drafting", tasks_de: "Meeting-Zusammenfassungen, Strategisches Brainstorming, Berichtsentwürfe" },
      { tool: "Microsoft Copilot", tasks_en: "Presentations, email drafting, data analysis in Office", tasks_de: "Präsentationen, E-Mail-Entwürfe, Datenanalyse in Office" },
      { tool: "Notion AI", tasks_en: "Project planning, knowledge management, documentation", tasks_de: "Projektplanung, Wissensmanagement, Dokumentation" },
    ],
  },
  soziales_erziehung: {
    label_en: "Education & Social",
    label_de: "Soziales & Erziehung",
    adoption_pct: 60,
    frequency_en: "60% of teachers use AI for classroom tasks; ~30% weekly",
    frequency_de: "60% der Lehrkräfte nutzen KI für Unterricht; ~30% wöchentlich",
    insights: [
      { stat_en: "60% of K-12 teachers used AI tools in 2024-25", stat_de: "60% der Lehrkräfte nutzten KI-Tools in 2024-25", source: "Education research 2025" },
      { stat_en: "Main uses: lesson plans, worksheets, personalized learning materials", stat_de: "Hauptnutzung: Unterrichtspläne, Arbeitsblätter, personalisierte Lernmaterialien" },
      { stat_en: "80% of HR leaders integrate AI in learning & development", stat_de: "80% der HR-Verantwortlichen integrieren KI in Aus- und Weiterbildung", source: "HR industry data" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Lesson plans, worksheets, quiz generation, differentiation", tasks_de: "Unterrichtspläne, Arbeitsblätter, Quiz-Erstellung, Differenzierung" },
      { tool: "Canva AI", tasks_en: "Educational materials, classroom presentations", tasks_de: "Lehrmaterialien, Unterrichtspräsentationen" },
      { tool: "Grammarly", tasks_en: "Writing feedback, text improvement for students", tasks_de: "Schreibfeedback, Textverbesserung für Schüler" },
    ],
  },
  vertrieb_handel: {
    label_en: "Sales & Retail",
    label_de: "Vertrieb & Handel",
    adoption_pct: 33,
    frequency_en: "33% of sales reps use or plan to use AI; growing fast",
    frequency_de: "33% der Vertriebsmitarbeiter nutzen KI oder planen dies",
    insights: [
      { stat_en: "61% say AI helps them understand customers and sell more efficiently", stat_de: "61% sagen, KI hilft ihnen Kunden zu verstehen und effizienter zu verkaufen", source: "Salesforce 2024" },
      { stat_en: "Only 39% of sellers know how to extract full value from AI", stat_de: "Nur 39% der Verkäufer wissen, wie sie KI voll nutzen können", source: "Salesforce 2024" },
      { stat_en: "AI mainly used for email drafts, lead scoring, meeting summaries", stat_de: "KI wird hauptsächlich für E-Mail-Entwürfe, Lead-Scoring, Meeting-Zusammenfassungen genutzt" },
    ],
    topTools: [
      { tool: "Salesforce Einstein", tasks_en: "Lead scoring, customer insights, pipeline forecasting", tasks_de: "Lead-Bewertung, Kundeneinblicke, Pipeline-Prognosen" },
      { tool: "ChatGPT", tasks_en: "Email drafts, proposal personalization, meeting prep", tasks_de: "E-Mail-Entwürfe, Angebots-Personalisierung, Meeting-Vorbereitung" },
      { tool: "HubSpot AI", tasks_en: "CRM automation, sequence generation, analytics", tasks_de: "CRM-Automatisierung, Sequenz-Erstellung, Analysen" },
    ],
  },
  kreativ_gestaltung: {
    label_en: "Creative & Design",
    label_de: "Kreativ & Gestaltung",
    adoption_pct: 55,
    frequency_en: "Many designers use AI daily for idea generation and variations",
    frequency_de: "Viele Designer nutzen KI täglich für Ideenfindung und Varianten",
    insights: [
      { stat_en: "Designers pilot AI for mockups, asset variations, and microcopy", stat_de: "Designer testen KI für Mockups, Asset-Varianten und Mikrotexte" },
      { stat_en: "Figma now offers built-in AI for repetitive design tasks", stat_de: "Figma bietet jetzt eingebaute KI für repetitive Design-Aufgaben" },
      { stat_en: "AI outputs still require curation for aesthetics and brand fit", stat_de: "KI-Ergebnisse erfordern weiterhin Kuration für Ästhetik und Markenpassung" },
    ],
    topTools: [
      { tool: "Midjourney", tasks_en: "Concept art, visual exploration, mood boards", tasks_de: "Konzeptkunst, visuelle Exploration, Moodboards" },
      { tool: "Figma AI", tasks_en: "Layout suggestions, auto-populate content, prototyping", tasks_de: "Layout-Vorschläge, Auto-Befüllung, Prototyping" },
      { tool: "Canva AI", tasks_en: "Quick graphics, social media assets, brand templates", tasks_de: "Schnelle Grafiken, Social-Media-Assets, Markenvorlagen" },
    ],
  },
  wissenschaft_forschung: {
    label_en: "Science & Research",
    label_de: "Wissenschaft & Forschung",
    adoption_pct: 52,
    frequency_en: "Growing use for literature review and data analysis",
    frequency_de: "Wachsende Nutzung für Literaturrecherche und Datenanalyse",
    insights: [
      { stat_en: "AI accelerates literature reviews and meta-analysis significantly", stat_de: "KI beschleunigt Literaturrecherchen und Meta-Analysen erheblich" },
      { stat_en: "Researchers use AI for data visualization and pattern detection", stat_de: "Forscher nutzen KI für Datenvisualisierung und Mustererkennung" },
      { stat_en: "Scientific writing remains heavily human-edited for accuracy", stat_de: "Wissenschaftliches Schreiben wird für Genauigkeit weiterhin stark manuell überarbeitet" },
    ],
    topTools: [
      { tool: "Elicit / Consensus", tasks_en: "Literature search, paper summarization, evidence synthesis", tasks_de: "Literatursuche, Paper-Zusammenfassung, Evidenzsynthese" },
      { tool: "ChatGPT / Claude", tasks_en: "Writing assistance, methodology brainstorming, code analysis", tasks_de: "Schreibunterstützung, Methodik-Brainstorming, Code-Analyse" },
      { tool: "Julius AI", tasks_en: "Data analysis, chart generation, statistical modeling", tasks_de: "Datenanalyse, Diagrammerstellung, statistische Modellierung" },
    ],
  },
  naturwissenschaft: {
    label_en: "Natural Sciences",
    label_de: "Naturwissenschaft",
    adoption_pct: 45,
    frequency_en: "AI supports lab documentation and data processing",
    frequency_de: "KI unterstützt Labordokumentation und Datenverarbeitung",
    insights: [
      { stat_en: "AI tools are used for experiment planning and literature search", stat_de: "KI-Tools werden für Versuchsplanung und Literatursuche genutzt" },
      { stat_en: "Lab work and physical measurements remain fully human", stat_de: "Laborarbeit und physische Messungen bleiben vollständig menschlich" },
      { stat_en: "Growing use of AI for simulation and molecular modeling", stat_de: "Zunehmende Nutzung von KI für Simulation und Molekülmodellierung" },
    ],
    topTools: [
      { tool: "ChatGPT / Claude", tasks_en: "Protocol drafting, report writing, research planning", tasks_de: "Protokollerstellung, Berichterstellung, Forschungsplanung" },
      { tool: "Perplexity", tasks_en: "Quick research, fact checking, reference finding", tasks_de: "Schnelle Recherche, Faktenprüfung, Referenzsuche" },
      { tool: "Python + AI libs", tasks_en: "Data processing, visualization, statistical analysis", tasks_de: "Datenverarbeitung, Visualisierung, statistische Analyse" },
    ],
  },
  produktion_handwerk: {
    label_en: "Production & Trades",
    label_de: "Produktion & Handwerk",
    adoption_pct: 18,
    frequency_en: "Early adoption; mainly in planning and documentation",
    frequency_de: "Frühe Adoptionsphase; hauptsächlich bei Planung und Dokumentation",
    insights: [
      { stat_en: "Physical and hands-on tasks remain almost entirely human-led", stat_de: "Physische und praktische Aufgaben bleiben fast vollständig menschlich geführt" },
      { stat_en: "AI supports inventory management and supply chain optimization", stat_de: "KI unterstützt Bestandsmanagement und Lieferkettenoptimierung" },
      { stat_en: "Documentation and compliance reporting increasingly AI-assisted", stat_de: "Dokumentation und Compliance-Berichte zunehmend KI-unterstützt" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Documentation, safety reports, procedure drafts", tasks_de: "Dokumentation, Sicherheitsberichte, Verfahrensentwürfe" },
      { tool: "Blue Yonder", tasks_en: "Supply chain optimization, demand forecasting", tasks_de: "Lieferkettenoptimierung, Bedarfsprognosen" },
      { tool: "Excel Copilot", tasks_en: "Inventory tracking, production planning spreadsheets", tasks_de: "Bestandsverfolgung, Produktionsplanungs-Tabellen" },
    ],
  },
};

export function getPeerUsage(sector: string): SectorPeerData | undefined {
  return PEER_USAGE[sector];
}
