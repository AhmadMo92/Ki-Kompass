import { useState, useMemo } from "react";
import {
  AI_TOOL_CATEGORIES, AIToolCategory,
  getToolsForOccupation
} from "@/lib/data/ai-tools";
import { skills, SKILL_CATEGORY_META, TaskItem } from "@/lib/data";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";

interface AIToolsMapProps {
  tasks: TaskItem[];
  language: "en" | "de";
}

export function AIToolsMap({ tasks, language }: AIToolsMapProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const toolMatches = useMemo(() => getToolsForOccupation(tasks), [tasks]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof toolMatches> = {};
    for (const m of toolMatches) {
      if (!map[m.tool.category]) map[m.tool.category] = [];
      map[m.tool.category].push(m);
    }
    return map;
  }, [toolMatches]);

  const aiExposedCount = tasks.filter(t => t.label !== "human_led" && t.label !== "sensitive").length;

  if (toolMatches.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="ai-tools-map">
      <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-violet-50 to-cyan-50 flex items-center gap-3">
        <Bot className="w-5 h-5 text-violet-600" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "de" ? "KI-Werkzeuge" : "AI Tools"}
          </h3>
          <p className="text-[10px] text-slate-400">
            {language === "de"
              ? `${toolMatches.length} Tools für ${aiExposedCount} KI-exponierte Aufgaben`
              : `${toolMatches.length} tools for ${aiExposedCount} AI-exposed tasks`}
          </p>
        </div>
      </div>

      <div className="p-3 space-y-3 max-h-[420px] overflow-y-auto">
        {(Object.entries(grouped) as [string, typeof toolMatches][]).map(([cat, matches]) => {
          const meta = AI_TOOL_CATEGORIES[cat as AIToolCategory];
          return (
            <div key={cat}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="text-[10px] font-semibold" style={{ color: meta.color }}>
                  {language === "de" ? meta.label_de : meta.label_en}
                </span>
                <span className="text-[9px] text-slate-400">({matches.length})</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {matches.map(m => {
                  const isExpanded = expandedTool === m.tool.id;
                  return (
                    <div key={m.tool.id}
                      className={`rounded-lg border transition-all duration-150 ${isExpanded ? 'col-span-2' : ''}`}
                      style={{ borderColor: meta.color + '25', backgroundColor: meta.bg + '60' }}
                    >
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : m.tool.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left"
                        data-testid={`tool-card-${m.tool.id}`}
                      >
                        <span className="text-sm">{m.tool.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium text-slate-700 truncate">
                            {language === "de" ? (m.tool.name_de || m.tool.name) : m.tool.name}
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 tabular-nums shrink-0">
                          {m.taskCount} {language === "de" ? "Aufg." : "tasks"}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-slate-300 shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="px-2.5 pb-2 border-t border-slate-100/60 pt-1.5 animate-in fade-in duration-150">
                          <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">
                            {language === "de" ? m.tool.description_de : m.tool.description_en}
                          </p>
                          {m.matchedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {m.matchedSkills.map(sid => {
                                const sk = skills[sid];
                                if (!sk) return null;
                                const skMeta = SKILL_CATEGORY_META[sk.category];
                                return (
                                  <span key={sid} className="text-[8px] px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5"
                                    style={{ borderColor: skMeta.color + '30', color: skMeta.color }}>
                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: skMeta.color }} />
                                    {language === "de" ? sk.name_de : sk.name_en}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
