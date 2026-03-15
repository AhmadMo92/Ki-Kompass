import { useState } from "react";
import { getPeerUsage, GLOBAL_TIERS, EvidenceLevel } from "@/lib/data/peer-usage";
import { Users, TrendingUp, ChevronDown, ChevronUp, ExternalLink, Globe, MapPin, Cpu, Lightbulb } from "lucide-react";

interface PeerUsageProps {
  sector: string;
  language: "en" | "de";
}

const EVIDENCE_CONFIG: Record<EvidenceLevel, { label_en: string; label_de: string; color: string; bg: string }> = {
  strong: { label_en: "Strong", label_de: "Stark", color: "text-emerald-700", bg: "bg-emerald-100" },
  moderate: { label_en: "Moderate", label_de: "Moderat", color: "text-amber-700", bg: "bg-amber-100" },
  limited: { label_en: "Limited", label_de: "Begrenzt", color: "text-slate-500", bg: "bg-slate-100" },
};

export function PeerUsage({ sector, language }: PeerUsageProps) {
  const [expanded, setExpanded] = useState(false);
  const data = getPeerUsage(sector);

  if (!data) return null;

  const de = language === "de";

  const tierSections = [
    {
      key: "market",
      icon: <Globe className="w-3.5 h-3.5 text-blue-500" />,
      title_en: "Global Market",
      title_de: "Globaler Markt",
      subtitle_en: "All workers",
      subtitle_de: "Alle Beschäftigten",
      stats: GLOBAL_TIERS.tier1_market,
      accent: "border-l-blue-400",
    },
    {
      key: "germany",
      icon: <MapPin className="w-3.5 h-3.5 text-amber-500" />,
      title_en: "Germany",
      title_de: "Deutschland",
      subtitle_en: "German workforce",
      subtitle_de: "Deutsche Arbeitnehmer",
      stats: GLOBAL_TIERS.tier2_germany,
      accent: "border-l-amber-400",
    },
    {
      key: "profession",
      icon: <Users className="w-3.5 h-3.5 text-indigo-500" />,
      title_en: de ? data.label_de : data.label_en,
      title_de: data.label_de,
      subtitle_en: "Your field specifically",
      subtitle_de: "Speziell dein Bereich",
      stats: data.tier3,
      accent: "border-l-indigo-400",
    },
    {
      key: "firstparty",
      icon: <Cpu className="w-3.5 h-3.5 text-violet-500" />,
      title_en: "First-Party AI Data",
      title_de: "KI-Herstellerdaten",
      subtitle_en: "Anthropic & OpenAI usage analysis",
      subtitle_de: "Nutzungsanalyse von Anthropic & OpenAI",
      stats: GLOBAL_TIERS.tier_firstparty,
      accent: "border-l-violet-400",
    },
  ];

  return (
    <div className="rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 overflow-hidden" data-testid="peer-usage-section">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-blue-50/50 transition-colors"
        data-testid="peer-usage-toggle"
      >
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4.5 h-4.5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800">
            {de ? "KI-Nutzung in deinem Berufsfeld" : "AI usage in your field"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {de ? `${data.label_de} — ${data.adoption_pct}% Adoption · 4-stufige Evidenz` : `${data.label_en} — ${data.adoption_pct}% adoption · 4-tier evidence`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-[10px] font-semibold">
            <TrendingUp className="w-3 h-3" />
            {data.adoption_pct}%
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300" data-testid="peer-usage-content">
          {tierSections.map((tier) => (
            <div key={tier.key} className={`border-l-[3px] ${tier.accent} pl-4`} data-testid={`tier-${tier.key}`}>
              <div className="flex items-center gap-2 mb-2">
                {tier.icon}
                <div>
                  <h4 className="text-xs font-semibold text-slate-700">
                    {de ? tier.title_de : tier.title_en}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {de ? tier.subtitle_de : tier.subtitle_en}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {tier.stats.map((stat, i) => {
                  const ev = EVIDENCE_CONFIG[stat.evidence];
                  return (
                    <div key={i} className="flex gap-2 items-start text-xs group">
                      <span className="text-slate-300 mt-0.5 shrink-0">•</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-600 leading-relaxed">{de ? stat.stat_de : stat.stat_en}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{stat.source}</span>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${ev.bg} ${ev.color}`}>
                            {de ? ev.label_de : ev.label_en}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t border-blue-200/40">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              {de ? "Populäre Tools in diesem Feld" : "Popular tools in this field"}
            </h4>
            <div className="grid gap-2">
              {data.topTools.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-white/70 border border-slate-200/60"
                  data-testid={`peer-tool-${i}`}
                >
                  <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{t.tool}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {de ? t.tasks_de : t.tasks_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-1 leading-relaxed">
            {de
              ? "Quellen: EY 2025, McKinsey 2025, Stanford 2025, Bitkom 2025, AOK 2025, ifo 2025, DORA 2025, Anthropic Economic Index 2025–26, OpenAI/NBER 2025, LinkedIn 2025, Deloitte 2025, Capterra 2025"
              : "Sources: EY 2025, McKinsey 2025, Stanford 2025, Bitkom 2025, AOK 2025, ifo 2025, DORA 2025, Anthropic Economic Index 2025–26, OpenAI/NBER 2025, LinkedIn 2025, Deloitte 2025, Capterra 2025"}
          </p>
        </div>
      )}
    </div>
  );
}
