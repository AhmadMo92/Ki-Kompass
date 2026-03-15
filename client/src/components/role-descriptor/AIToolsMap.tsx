import { useState, useMemo } from "react";
import { getRelevantNodes } from "@/lib/data/ai-tools";
import { TaskItem } from "@/lib/data";
import { Bot, ExternalLink } from "lucide-react";

interface AIToolsMapProps {
  tasks: TaskItem[];
  language: "en" | "de";
}

export function AIToolsMap({ tasks, language }: AIToolsMapProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const relevantNodes = useMemo(() => getRelevantNodes(tasks), [tasks]);

  if (relevantNodes.length === 0) return null;

  const activeNode = activeNodeId ? relevantNodes.find(r => r.node.id === activeNodeId)?.node : null;

  return (
    <div className="space-y-4" data-testid="ai-tools-map">
      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-5 h-5 text-violet-600" />
        <div>
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "de" ? "Dein KI-Werkzeugkasten" : "Your AI Toolkit"}
          </h3>
          <p className="text-[10px] text-slate-400">
            {language === "de"
              ? "Vertrauenswürdige Tools, kuratiert für dein Profil"
              : "Trusted tools, curated for your profile"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {relevantNodes.map(({ node, relevance }) => {
          const isActive = activeNodeId === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNodeId(isActive ? null : node.id)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md group ${
                isActive ? 'shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
              style={{
                borderColor: isActive ? node.color : node.color + '30',
                backgroundColor: isActive ? node.bg : 'white',
              }}
              data-testid={`tool-node-${node.category}`}
            >
              <div className="text-2xl mb-2">{node.icon}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: node.color }}>
                {language === "de" ? node.label_de : node.label_en}
              </div>
              <div className="text-[10px] text-slate-400 leading-relaxed">
                {language === "de" ? node.description_de : node.description_en}
              </div>
              <div className="flex -space-x-2 mt-3">
                {node.topTools.map((tool, i) => (
                  <div key={i}
                    className="w-7 h-7 rounded-full border-2 border-white bg-white shadow-sm overflow-hidden"
                    title={tool.name}>
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              {relevance >= 6 && (
                <div className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: node.color + '15', color: node.color }}>
                  {language === "de" ? "Hohe Relevanz" : "High relevance"}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {activeNode && (
        <div className="rounded-2xl border bg-white overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ borderColor: activeNode.color + '40' }}
          data-testid="tool-detail-panel">
          <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: activeNode.bg }}>
            <span className="text-lg">{activeNode.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: activeNode.color }}>
                {language === "de" ? activeNode.label_de : activeNode.label_en}
              </div>
              <div className="text-[10px] text-slate-500">
                {language === "de" ? "Top 3 empfohlene Tools" : "Top 3 recommended tools"}
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {activeNode.topTools.map((tool, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors"
                data-testid={`tool-detail-${i}`}>
                <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden shrink-0 p-1">
                  <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{tool.name}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    {language === "de" ? tool.description_de : tool.description_en}
                  </div>
                </div>
                <a href={tool.url} target="_blank" rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-400 transition-colors"
                  data-testid={`tool-link-${tool.name.toLowerCase().replace(/[^a-z]/g, '')}`}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100">
            <div className="text-[9px] text-slate-400 italic">
              {language === "de"
                ? "Benchmarks und Vergleiche werden bald hinzugefügt"
                : "Benchmarks and comparisons coming soon"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
