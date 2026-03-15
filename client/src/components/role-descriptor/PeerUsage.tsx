import { useState } from "react";
import { getPeerUsage, EvidenceLevel } from "@/lib/data/peer-usage";
import { Users, TrendingUp, ChevronDown, ChevronUp, ExternalLink, Lightbulb } from "lucide-react";

interface PeerUsageProps {
  sector: string;
  language: "en" | "de";
}

const EVIDENCE_BADGE: Record<EvidenceLevel, { en: string; de: string; cls: string }> = {
  strong: { en: "Strong", de: "Stark", cls: "bg-emerald-100 text-emerald-700" },
  moderate: { en: "Moderate", de: "Moderat", cls: "bg-amber-100 text-amber-700" },
  limited: { en: "Limited", de: "Begrenzt", cls: "bg-slate-100 text-slate-500" },
};

export function PeerUsage({ sector, language }: PeerUsageProps) {
  const [expanded, setExpanded] = useState(false);
  const data = getPeerUsage(sector);
  if (!data) return null;

  const de = language === "de";

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
            {de ? "KI-Nutzung in deinem Berufsfeld" : "AI adoption in your field"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {de ? data.label_de : data.label_en} — {data.adoption_pct}% {de ? "Adoption" : "adoption"}
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
        <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300" data-testid="peer-usage-content">
          <div className="space-y-2">
            {data.stats.map((s, i) => {
              const badge = EVIDENCE_BADGE[s.evidence];
              return (
                <div key={i} className="flex gap-2.5 items-start text-xs">
                  <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-slate-700 leading-relaxed">{de ? s.stat_de : s.stat_en}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400">{s.source}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                        {de ? badge.de : badge.en}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1 border-t border-blue-200/40">
            <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              {de ? "Populäre Tools" : "Popular tools"}
            </h4>
            <div className="grid gap-2">
              {data.topTools.map((t, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg bg-white/70 border border-slate-200/60" data-testid={`peer-tool-${i}`}>
                  <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{t.tool}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{de ? t.tasks_de : t.tasks_en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
