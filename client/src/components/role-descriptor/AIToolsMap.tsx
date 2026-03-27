import { useState, useMemo } from "react";
import {
  TaskItem, toolTypes, ToolType, getOccupationToolRecommendations,
  getSectorForOccupation, sectorTools
} from "@/lib/data";
import { Bot, ExternalLink, ChevronDown, Sparkles, TrendingUp, Building2 } from "lucide-react";

const TOOL_LOGO_DOMAINS: Record<string, string> = {
  "ChatGPT":                  "openai.com",
  "Claude":                   "anthropic.com",
  "Claude Code":              "anthropic.com",
  "Gemini":                   "google.com",
  "GitHub Copilot":           "github.com",
  "GitHub Actions":           "github.com",
  "Cursor":                   "cursor.sh",
  "Perplexity":               "perplexity.ai",
  "Phind":                    "phind.com",
  "Stack Overflow AI":        "stackoverflow.com",
  "Notion AI":                "notion.so",
  "Asana":                    "asana.com",
  "Asana Intelligence":       "asana.com",
  "Monday AI":                "monday.com",
  "Jira AI":                  "atlassian.com",
  "Trello AI":                "trello.com",
  "Linear":                   "linear.app",
  "MS Project Copilot":       "microsoft.com",
  "Meisterplan":              "meisterplan.com",
  "Planday AI":               "planday.com",
  "Microsoft Copilot":        "microsoft.com",
  "Microsoft Teams Copilot":  "microsoft.com",
  "Excel Copilot":            "microsoft.com",
  "Power BI Copilot":         "microsoft.com",
  "Canva AI":                 "canva.com",
  "Canva":                    "canva.com",
  "Midjourney":               "midjourney.com",
  "Adobe Firefly":            "adobe.com",
  "Runway ML":                "runwayml.com",
  "Synthesia":                "synthesia.io",
  "Descript":                 "descript.com",
  "Frame.io":                 "frame.io",
  "Beautiful.ai":             "beautiful.ai",
  "Gamma":                    "gamma.app",
  "Genially":                 "genial.ly",
  "Grammarly":                "grammarly.com",
  "DeepL":                    "deepl.com",
  "DeepL Write":              "deepl.com",
  "Google Translate":         "google.com",
  "Lokalise":                 "lokalise.com",
  "Phrase AI":                "phrase.com",
  "Otter.ai":                 "otter.ai",
  "Fireflies":                "fireflies.ai",
  "Loom AI":                  "loom.com",
  "Zoom AI":                  "zoom.us",
  "Riverside AI":             "riverside.fm",
  "HubSpot AI":               "hubspot.com",
  "HubSpot Content AI":       "hubspot.com",
  "Jasper AI":                "jasper.ai",
  "Surfer SEO":               "surferseo.com",
  "Salesforce Einstein":      "salesforce.com",
  "Intercom Fin":             "intercom.com",
  "Pipedrive AI":             "pipedrive.com",
  "Gong AI":                  "gong.io",
  "Tableau AI":               "tableau.com",
  "Julius AI":                "julius.ai",
  "Rows AI":                  "rows.com",
  "Amplitude":                "amplitude.com",
  "Mixpanel":                 "mixpanel.com",
  "Google Analytics AI":      "google.com",
  "ThoughtSpot":              "thoughtspot.com",
  "Causal":                   "causal.app",
  "Databricks AI":            "databricks.com",
  "Grafana AI":               "grafana.com",
  "Minitab":                  "minitab.com",
  "MATLAB AI":                "mathworks.com",
  "SPSS AI":                  "ibm.com",
  "NVivo AI":                 "lumivero.com",
  "NotebookLM":               "google.com",
  "Elicit":                   "elicit.org",
  "Consensus":                "consensus.app",
  "Semantic Scholar":         "semanticscholar.org",
  "Citavi AI":                "citavi.com",
  "Zotero AI":                "zotero.org",
  "JSTOR AI":                 "jstor.org",
  "AlphaSense":               "alpha-sense.com",
  "Feedly AI":                "feedly.com",
  "PubMed AI":                "ncbi.nlm.nih.gov",
  "Harvey AI":                "harvey.ai",
  "Luminance":                "luminance.com",
  "Kira Systems":             "kirasystems.com",
  "Westlaw Edge AI":          "thomsonreuters.com",
  "Ironclad":                 "ironcladapp.com",
  "DocuSign":                 "docusign.com",
  "DocuSign IAM":             "docusign.com",
  "HireVue":                  "hirevue.com",
  "Eightfold AI":             "eightfold.ai",
  "Textio":                   "textio.com",
  "Personio":                 "personio.de",
  "Zapier AI":                "zapier.com",
  "UiPath":                   "uipath.com",
  "Automation Anywhere":      "automationanywhere.com",
  "n8n AI":                   "n8n.io",
  "SAP AI":                   "sap.com",
  "Autodesk AI":              "autodesk.com",
  "Siemens NX AI":            "siemens.com",
  "Siemens Opcenter":         "siemens.com",
  "Ansys AI":                 "ansys.com",
  "CrowdStrike Charlotte":    "crowdstrike.com",
  "Darktrace":                "darktrace.com",
  "Snyk AI":                  "snyk.io",
  "Nuance DAX":               "nuance.com",
  "Ada Health":               "ada.com",
  "PathAI":                   "pathai.com",
  "Blue Yonder":              "blueyonder.com",
  "Coupa AI":                 "coupa.com",
  "FourKites":                "fourkites.com",
  "Google Classroom":         "google.com",
  "Sudowrite":                "sudowrite.com",
  "Writefull":                "writefull.com",
  "Jupyter AI":               "jupyter.org",
};

function ToolLogo({ name, fallbackIcon }: { name: string; fallbackIcon: string }) {
  const [failed, setFailed] = useState(false);
  const domain = TOOL_LOGO_DOMAINS[name];

  if (!domain || failed) {
    return <span className="text-sm">{fallbackIcon}</span>;
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name}
      className="w-5 h-5 object-contain rounded"
      onError={() => setFailed(true)}
    />
  );
}

interface AIToolsMapProps {
  tasks: TaskItem[];
  language: "en" | "de";
  occupationKey: string;
}

interface ToolRec {
  toolTypeId: string;
  toolType: ToolType;
  relevance: number;
  sectorExamples?: string[];
  sectorUse?: string;
}

export function AIToolsMap({ tasks, language, occupationKey }: AIToolsMapProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const recommendations = useMemo(() => getOccupationToolRecommendations(occupationKey), [occupationKey]);
  const sector = useMemo(() => getSectorForOccupation(occupationKey), [occupationKey]);

  if (recommendations.length === 0) return null;

  const maxRelevance = recommendations[0]?.relevance || 1;
  const topRecs = showAll ? recommendations : recommendations.slice(0, 6);
  const hasMore = recommendations.length > 6;

  return (
    <div className="space-y-4" data-testid="ai-tools-map">
      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-5 h-5 text-violet-600" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "de" ? "Dein KI-Werkzeugkasten" : "Your AI Toolkit"}
          </h3>
          <p className="text-[10px] text-slate-400">
            {language === "de"
              ? "KI-Tools, personalisiert für deine Aufgaben und deinen Sektor"
              : "AI tools, personalized for your tasks and sector"}
          </p>
        </div>
        {sector && (
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            <Building2 className="w-3 h-3" />
            {language === "de" ? sector.label_de : sector.label_en}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {topRecs.map(rec => {
          const isExpanded = expandedId === rec.toolTypeId;
          const pct = Math.round((rec.relevance / maxRelevance) * 100);
          const isHighRelevance = pct >= 70;

          return (
            <div
              key={rec.toolTypeId}
              className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                isExpanded ? 'shadow-md' : 'hover:shadow-sm'
              }`}
              style={{
                borderColor: isExpanded ? '#6366f1' : 'rgba(148,163,184,0.15)',
                backgroundColor: isExpanded ? '#fafafe' : 'white',
              }}
              data-testid={`tool-rec-${rec.toolTypeId}`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : rec.toolTypeId)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left"
              >
                <span className="text-2xl shrink-0">{rec.toolType.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {language === "de" ? rec.toolType.de : rec.toolType.en}
                    </span>
                    {isHighRelevance && (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full shrink-0">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {language === "de" ? "Top-Match" : "Top match"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 70 ? '#6366f1' : pct >= 40 ? '#8b5cf6' : '#a78bfa',
                        }}
                      />
                    </div>
                    <span className="text-[9px] font-medium text-slate-400 tabular-nums shrink-0 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-300 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3 pl-10">
                    {rec.toolType.desc}
                  </p>

                  {rec.sectorUse && (
                    <div className="mb-3 pl-10">
                      <div className="flex items-start gap-2 bg-violet-50/60 rounded-xl p-2.5 border border-violet-100/50">
                        <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-violet-400 mb-0.5">
                            {language === "de" ? "In deinem Sektor" : "In your sector"}
                          </div>
                          <div className="text-[11px] text-violet-700 leading-relaxed">{rec.sectorUse}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pl-10 space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      {language === "de" ? "Empfohlene Tools" : "Recommended tools"}
                    </div>
                    {(rec.sectorExamples || rec.toolType.ex).map((toolName, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
                        data-testid={`tool-example-${rec.toolTypeId}-${i}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <ToolLogo name={toolName} fallbackIcon={rec.toolType.icon} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-slate-700">{toolName}</span>
                        </div>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(toolName + ' AI tool')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:border-slate-400 opacity-0 group-hover:opacity-100 transition-all"
                          title={language === "de" ? "Mehr erfahren" : "Learn more"}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-xs text-violet-600 hover:text-violet-700 font-medium py-2 rounded-xl hover:bg-violet-50/50 transition-colors"
          data-testid="show-more-tools"
        >
          {showAll
            ? (language === "de" ? "Weniger anzeigen" : "Show less")
            : (language === "de" ? `Alle ${recommendations.length} Tool-Kategorien anzeigen` : `Show all ${recommendations.length} tool categories`)}
        </button>
      )}
    </div>
  );
}
