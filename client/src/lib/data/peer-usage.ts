export type EvidenceLevel = "strong" | "moderate" | "limited";

export interface TieredStat {
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
  tier3: TieredStat[];
  topTools: PeerToolUsage[];
}

export const GLOBAL_TIERS: {
  tier1_market: TieredStat[];
  tier2_germany: TieredStat[];
  tier_firstparty: TieredStat[];
} = {
  tier1_market: [
    { stat_en: "88% of employees use AI at work — but only 5% use it in advanced ways", stat_de: "88% der Beschäftigten nutzen KI — aber nur 5% auf fortgeschrittenem Niveau", source: "EY Work Reimagined 2025 (n=15,000)", evidence: "strong" },
    { stat_en: "27% of white-collar workers use AI daily — managers 33% vs. individual contributors 16%", stat_de: "27% der Wissensarbeiter nutzen KI täglich — Führungskräfte 33% vs. Fachkräfte 16%", source: "McKinsey State of AI 2025 (n=1,993)", evidence: "strong" },
    { stat_en: "In 1 of 3 occupations, AI already handles more than 25% of tasks", stat_de: "In 1 von 3 Berufen erledigt KI bereits mehr als 25% der Aufgaben", source: "Stanford Digital Economy Lab 2025", evidence: "strong" },
    { stat_en: "11.5% average net productivity increase in the 5 most AI-exposed sectors", stat_de: "11,5% durchschnittlicher Produktivitätszuwachs in den 5 am stärksten KI-exponierten Sektoren", source: "Morgan Stanley 2025 (n=935, incl. Germany)", evidence: "strong" },
  ],
  tier2_germany: [
    { stat_en: "67% of Germans 16+ use GenAI at least occasionally — up from 40% six months earlier", stat_de: "67% der Deutschen ab 16 nutzen GenAI zumindest gelegentlich — von 40% sechs Monate zuvor", source: "Bitkom Mai 2025 (n=1,005)", evidence: "strong" },
    { stat_en: "36% of German companies (20+ employees) now use AI — almost double the 20% from 2024", stat_de: "36% der deutschen Unternehmen (20+ Beschäftigte) nutzen KI — fast doppelt so viele wie 2024", source: "Bitkom Sept 2025 (n=604)", evidence: "strong" },
    { stat_en: "42% of German employees say AI is already used in their workplace. Only 5% fear job loss.", stat_de: "42% der deutschen Beschäftigten sagen, KI werde am Arbeitsplatz genutzt. Nur 5% fürchten Jobverlust.", source: "AOK Wissenschaftsinstitut April 2025 (n=2,490)", evidence: "strong" },
    { stat_en: "~84% AI adoption in advertising/market research, ~74% IT services, ~70% automotive, ~31% construction", stat_de: "~84% KI-Adoption in Werbung/Marktforschung, ~74% IT-Dienstleistungen, ~70% Automobil, ~31% Bau", source: "ifo Konjunkturumfrage Juni 2025", evidence: "strong" },
  ],
  tier_firstparty: [
    { stat_en: "36% of occupations: AI handles 25%+ of tasks. 4% of occupations: AI handles 75%+. Zero occupations fully automated.", stat_de: "36% der Berufe: KI erledigt 25%+ der Aufgaben. 4% der Berufe: KI erledigt 75%+. Kein Beruf vollständig automatisiert.", source: "Anthropic Economic Index Jan 2026 (~1M conversations)", evidence: "strong" },
    { stat_en: "52% of AI use is augmentation (human + AI together), 45% is automation. Humans stay in the loop.", stat_de: "52% der KI-Nutzung ist Augmentation (Mensch + KI), 45% Automation. Menschen bleiben eingebunden.", source: "Anthropic Economic Index Jan 2026", evidence: "strong" },
    { stat_en: "57% of computer-related work tasks involve ChatGPT. Writing is #1 work task (42% of work messages).", stat_de: "57% der IT-bezogenen Arbeitsaufgaben nutzen ChatGPT. Schreiben ist #1 Arbeitsaufgabe (42% der Arbeitsnachrichten).", source: "OpenAI/NBER Sep 2025 (n=1.5M)", evidence: "strong" },
    { stat_en: "73% of ChatGPT usage is non-work — it's becoming a life companion, not just a work tool.", stat_de: "73% der ChatGPT-Nutzung ist nicht beruflich — es wird zum Lebensbegleiter, nicht nur Arbeitstool.", source: "OpenAI/NBER Sep 2025", evidence: "strong" },
  ],
};

export const SECTOR_PEER_DATA: Record<string, SectorPeerData> = {
  it_informatik: {
    label_en: "Tech & IT",
    label_de: "IT & Informatik",
    adoption_pct: 90,
    tier3: [
      { stat_en: "90% of developers use AI tools. Median 2 hours daily. But 46% distrust accuracy — the trust paradox.", stat_de: "90% der Entwickler nutzen KI-Tools. Median 2 Stunden täglich. Aber 46% misstrauen der Genauigkeit.", source: "Google DORA 2025 + Stack Overflow 2025", evidence: "strong" },
      { stat_en: "The #1 Claude task globally: modifying software to correct errors — 6% of all usage alone.", stat_de: "Die häufigste Claude-Aufgabe weltweit: Software-Fehler beheben — 6% der gesamten Nutzung.", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
      { stat_en: "IT leads ChatGPT enterprise adoption at 27% of business users.", stat_de: "IT führt die ChatGPT-Unternehmensadoption mit 27% der Business-Nutzer an.", source: "OpenAI Workplace Report 2025", evidence: "strong" },
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
    tier3: [
      { stat_en: "~84% AI adoption in German advertising & market research — highest of any sector.", stat_de: "~84% KI-Adoption in deutscher Werbung & Marktforschung — höchste aller Sektoren.", source: "ifo Konjunkturumfrage Juni 2025", evidence: "strong" },
      { stat_en: "90% of marketers have tried GenAI. 76% use it for writing, 71% for brainstorming.", stat_de: "90% der Marketer haben GenAI ausprobiert. 76% nutzen es zum Schreiben, 71% zum Brainstorming.", source: "AMA/Lightricks 2024", evidence: "strong" },
      { stat_en: "Arts, design & writing = ~10% of all Claude usage. Third largest category, growing steadily.", stat_de: "Kunst, Design & Schreiben = ~10% aller Claude-Nutzung. Drittgrößte Kategorie, stetig wachsend.", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Blog posts, ad copy, social media content, campaign ideation", tasks_de: "Blogbeiträge, Anzeigentexte, Social-Media-Inhalte, Kampagnenideen" },
      { tool: "Canva AI / Adobe Firefly", tasks_en: "Visual content, graphics, video editing", tasks_de: "Visuelle Inhalte, Grafiken, Videobearbeitung" },
      { tool: "HubSpot / Jasper", tasks_en: "SEO, customer segmentation, automated campaigns", tasks_de: "SEO, Kundensegmentierung, automatisierte Kampagnen" },
    ],
  },
  finanzen_recht: {
    label_en: "Finance & Law",
    label_de: "Finanzen & Recht",
    adoption_pct: 69,
    tier3: [
      { stat_en: "69% of lawyers now use AI tools — up from 27% in 2024. 28% use AI daily.", stat_de: "69% der Anwälte nutzen jetzt KI — von 27% in 2024. 28% nutzen KI täglich.", source: "Legal Industry Report 2026", evidence: "strong" },
      { stat_en: "Finance & insurance = 6% of ChatGPT enterprise users. Faster-growing segment.", stat_de: "Finanzen & Versicherungen = 6% der ChatGPT-Unternehmensnutzer. Am schnellsten wachsend.", source: "OpenAI Workplace Report 2025", evidence: "strong" },
      { stat_en: "81% of finance pros expect AI agents to become standard within 5 years.", stat_de: "81% der Finanzexperten erwarten, dass KI-Agenten innerhalb von 5 Jahren Standard werden.", source: "Deloitte Jan 2025 (n=3,300)", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT / Claude", tasks_en: "Drafting, research, case summaries, brainstorming", tasks_de: "Entwürfe, Recherche, Fallzusammenfassungen, Brainstorming" },
      { tool: "Harvey AI", tasks_en: "Legal research, contract analysis, compliance", tasks_de: "Rechtsrecherche, Vertragsanalyse, Compliance" },
      { tool: "Excel / Copilot", tasks_en: "Financial modeling, anomaly detection, reports", tasks_de: "Finanzmodellierung, Anomalieerkennung, Berichte" },
    ],
  },
  gesundheit: {
    label_en: "Healthcare",
    label_de: "Gesundheit",
    adoption_pct: 40,
    tier3: [
      { stat_en: "80% of hospitals use AI for admin & workflow. Only 40% of physicians ready for GenAI at point-of-care.", stat_de: "80% der Krankenhäuser nutzen KI für Verwaltung. Nur 40% der Ärzte bereit für GenAI in der Patientenversorgung.", source: "Deloitte 2024 + Wolters Kluwer 2025", evidence: "moderate" },
      { stat_en: "Healthcare shows lowest AI usage in both Anthropic and OpenAI data. Direct care remains human.", stat_de: "Gesundheitswesen zeigt niedrigste KI-Nutzung in Anthropic- und OpenAI-Daten. Direkte Versorgung bleibt menschlich.", source: "Anthropic + OpenAI 2025", evidence: "strong" },
      { stat_en: "Public administration & healthcare = 5% each of ChatGPT enterprise users.", stat_de: "Öffentliche Verwaltung & Gesundheitswesen = je 5% der ChatGPT-Unternehmensnutzer.", source: "OpenAI Workplace Report 2025", evidence: "strong" },
    ],
    topTools: [
      { tool: "Nuance DAX", tasks_en: "Clinical documentation, ambient listening", tasks_de: "Klinische Dokumentation, Umgebungsaufnahme" },
      { tool: "ChatGPT", tasks_en: "Research summaries, admin correspondence", tasks_de: "Forschungszusammenfassungen, Verwaltungskorrespondenz" },
      { tool: "Ada Health", tasks_en: "Symptom triage support, patient guidance", tasks_de: "Symptom-Triage, Patientenführung" },
    ],
  },
  unternehmensfuehrung: {
    label_en: "Business & Management",
    label_de: "Unternehmensführung",
    adoption_pct: 54,
    tier3: [
      { stat_en: "54% of project managers use AI for risk management. 63% report productivity gains.", stat_de: "54% der Projektmanager nutzen KI fürs Risikomanagement. 63% berichten von Produktivitätsgewinn.", source: "Capterra PM Survey 2025", evidence: "moderate" },
      { stat_en: "Management & business: 50% of ChatGPT work tasks. Writing (memos, reports) is #1 use.", stat_de: "Management & Business: 50% der ChatGPT-Arbeitsaufgaben. Schreiben (Memos, Berichte) ist #1.", source: "OpenAI/NBER Sep 2025", evidence: "strong" },
      { stat_en: "79% of consultants use AI sometimes, but only 10% always. Most are experimenting.", stat_de: "79% der Berater nutzen KI gelegentlich, aber nur 10% immer. Die meisten experimentieren.", source: "European Consultant Survey (n=500)", evidence: "moderate" },
    ],
    topTools: [
      { tool: "ChatGPT / Copilot", tasks_en: "Meeting notes, strategy brainstorming, report drafts", tasks_de: "Meeting-Notizen, Strategisches Brainstorming, Berichtsentwürfe" },
      { tool: "Microsoft Copilot", tasks_en: "Presentations, email drafting, data analysis", tasks_de: "Präsentationen, E-Mail-Entwürfe, Datenanalyse" },
      { tool: "Notion AI", tasks_en: "Project planning, knowledge base, documentation", tasks_de: "Projektplanung, Wissensdatenbank, Dokumentation" },
    ],
  },
  soziales_erziehung: {
    label_en: "Education & Social",
    label_de: "Soziales & Erziehung",
    adoption_pct: 60,
    tier3: [
      { stat_en: "60% of K-12 teachers use AI for classroom tasks. ~30% use it weekly.", stat_de: "60% der Lehrkräfte nutzen KI für den Unterricht. ~30% nutzen es wöchentlich.", source: "Education Research 2025", evidence: "moderate" },
      { stat_en: "Education & library = 15% of Claude usage — fastest growing category (up from 9%).", stat_de: "Bildung & Bibliothek = 15% der Claude-Nutzung — am schnellsten wachsende Kategorie (von 9%).", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
      { stat_en: "80% of HR leaders have integrated AI in learning & development programs.", stat_de: "80% der HR-Verantwortlichen haben KI in Aus- und Weiterbildung integriert.", source: "HR Industry Data 2024", evidence: "moderate" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Lesson plans, worksheets, quiz generation", tasks_de: "Unterrichtspläne, Arbeitsblätter, Quiz-Erstellung" },
      { tool: "Canva AI", tasks_en: "Educational materials, classroom presentations", tasks_de: "Lehrmaterialien, Unterrichtspräsentationen" },
      { tool: "Grammarly", tasks_en: "Writing feedback, text improvement", tasks_de: "Schreibfeedback, Textverbesserung" },
    ],
  },
  vertrieb_handel: {
    label_en: "Sales & Retail",
    label_de: "Vertrieb & Handel",
    adoption_pct: 50,
    tier3: [
      { stat_en: "65% of talent acquisition teams use AI. 93% plan to expand. Only 34% are power users.", stat_de: "65% der TA-Teams nutzen KI. 93% planen Ausbau. Nur 34% sind Power-User.", source: "LinkedIn Talent Trends 2025", evidence: "strong" },
      { stat_en: "~50% AI adoption in German retail sector.", stat_de: "~50% KI-Adoption im deutschen Einzelhandel.", source: "ifo Konjunkturumfrage Juni 2025", evidence: "strong" },
      { stat_en: "61% of sales reps say AI helps understand customers better. 39% know how to extract full value.", stat_de: "61% der Vertriebsmitarbeiter sagen, KI hilft Kunden besser zu verstehen. 39% nutzen es voll.", source: "Salesforce 2024", evidence: "moderate" },
    ],
    topTools: [
      { tool: "Salesforce Einstein", tasks_en: "Lead scoring, customer insights, forecasting", tasks_de: "Lead-Bewertung, Kundeneinblicke, Prognosen" },
      { tool: "ChatGPT", tasks_en: "Email drafts, proposals, meeting prep", tasks_de: "E-Mail-Entwürfe, Angebote, Meeting-Vorbereitung" },
      { tool: "HubSpot AI", tasks_en: "CRM automation, sequences, analytics", tasks_de: "CRM-Automatisierung, Sequenzen, Analysen" },
    ],
  },
  kreativ_gestaltung: {
    label_en: "Creative & Design",
    label_de: "Kreativ & Gestaltung",
    adoption_pct: 55,
    tier3: [
      { stat_en: "Arts, design & writing = ~10% of all Claude usage, growing from 8% to 10% in 2025.", stat_de: "Kunst, Design & Schreiben = ~10% der Claude-Nutzung, gewachsen von 8% auf 10% in 2025.", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
      { stat_en: "No large-scale role-specific survey for UX/UI designers exists. Best baseline: 27% white-collar daily use.", stat_de: "Keine großangelegte rollenspezifische Studie für UX/UI-Designer. Bester Richtwert: 27% Wissensarbeiter täglich.", source: "McKinsey 2025 (baseline)", evidence: "limited" },
      { stat_en: "Figma offers built-in AI features. AI outputs require curation for aesthetics and brand fit.", stat_de: "Figma bietet eingebaute KI-Features. KI-Ergebnisse erfordern Kuration für Ästhetik und Markenpassung.", source: "Industry observation", evidence: "limited" },
    ],
    topTools: [
      { tool: "Midjourney / DALL-E", tasks_en: "Concept art, mood boards, visual exploration", tasks_de: "Konzeptkunst, Moodboards, visuelle Exploration" },
      { tool: "Figma AI", tasks_en: "Layout suggestions, content generation, prototyping", tasks_de: "Layout-Vorschläge, Inhaltsgenerierung, Prototyping" },
      { tool: "Canva AI", tasks_en: "Quick graphics, social assets, brand templates", tasks_de: "Schnelle Grafiken, Social-Assets, Markenvorlagen" },
    ],
  },
  wissenschaft_forschung: {
    label_en: "Science & Research",
    label_de: "Wissenschaft & Forschung",
    adoption_pct: 52,
    tier3: [
      { stat_en: "Science & research = ~7% of Claude usage, growing from 6.3% to 7.2% in late 2025.", stat_de: "Wissenschaft & Forschung = ~7% der Claude-Nutzung, gewachsen von 6,3% auf 7,2% Ende 2025.", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
      { stat_en: "Professional, scientific & technical services = 17% of ChatGPT enterprise users.", stat_de: "Professionelle, wissenschaftliche & technische Dienste = 17% der ChatGPT-Unternehmensnutzer.", source: "OpenAI Workplace Report 2025", evidence: "strong" },
      { stat_en: "79% of researchers use AI at least sometimes. Only 10% always. Data analysis use < 50%.", stat_de: "79% der Forscher nutzen KI zumindest gelegentlich. Nur 10% immer. Datenanalyse-Nutzung < 50%.", source: "European Consultant Survey (n=500)", evidence: "moderate" },
    ],
    topTools: [
      { tool: "Elicit / Consensus", tasks_en: "Literature search, paper summarization, evidence synthesis", tasks_de: "Literatursuche, Paper-Zusammenfassung, Evidenzsynthese" },
      { tool: "ChatGPT / Claude", tasks_en: "Writing assistance, methodology, code analysis", tasks_de: "Schreibunterstützung, Methodik, Code-Analyse" },
      { tool: "Julius AI", tasks_en: "Data analysis, chart generation, statistics", tasks_de: "Datenanalyse, Diagrammerstellung, Statistik" },
    ],
  },
  naturwissenschaft: {
    label_en: "Natural Sciences",
    label_de: "Naturwissenschaft",
    adoption_pct: 45,
    tier3: [
      { stat_en: "Science & research = ~7% of Claude usage. Lab work and physical tasks remain fully human.", stat_de: "Wissenschaft & Forschung = ~7% der Claude-Nutzung. Laborarbeit und physische Aufgaben bleiben menschlich.", source: "Anthropic Economic Index Nov 2025", evidence: "strong" },
      { stat_en: "Professional & scientific services = 17% of ChatGPT enterprise users. Growing segment.", stat_de: "Professionelle & wissenschaftliche Dienste = 17% der ChatGPT-Unternehmensnutzer. Wachsend.", source: "OpenAI Workplace Report 2025", evidence: "strong" },
      { stat_en: "No role-specific survey for natural scientists. Best baseline: 27% white-collar daily AI use.", stat_de: "Keine rollenspezifische Studie für Naturwissenschaftler. Richtwert: 27% Wissensarbeiter täglich.", source: "McKinsey 2025 (baseline)", evidence: "limited" },
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
    adoption_pct: 31,
    tier3: [
      { stat_en: "~31% AI adoption in German construction — lowest of all sectors surveyed.", stat_de: "~31% KI-Adoption im deutschen Bauwesen — niedrigste aller befragten Sektoren.", source: "ifo Konjunkturumfrage Juni 2025", evidence: "strong" },
      { stat_en: "Physical and hands-on tasks remain almost entirely human-led across all studies.", stat_de: "Physische und praktische Aufgaben bleiben in allen Studien fast vollständig menschlich geführt.", source: "Anthropic + OpenAI 2025", evidence: "strong" },
      { stat_en: "Lowest-paid manual roles AND highest-paid specialist roles both show low AI usage.", stat_de: "Gering- und höchstbezahlte manuelle Rollen zeigen beide geringe KI-Nutzung.", source: "Anthropic Economic Index Jan 2026", evidence: "strong" },
    ],
    topTools: [
      { tool: "ChatGPT", tasks_en: "Documentation, safety reports, procedure drafts", tasks_de: "Dokumentation, Sicherheitsberichte, Verfahrensentwürfe" },
      { tool: "Blue Yonder", tasks_en: "Supply chain optimization, demand forecasting", tasks_de: "Lieferkettenoptimierung, Bedarfsprognosen" },
      { tool: "Excel / Copilot", tasks_en: "Inventory tracking, production planning", tasks_de: "Bestandsverfolgung, Produktionsplanung" },
    ],
  },
};

export function getPeerUsage(sector: string): SectorPeerData | undefined {
  return SECTOR_PEER_DATA[sector];
}
