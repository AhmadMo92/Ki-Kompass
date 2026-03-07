import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  AI_TOOLS, AI_TOOL_CATEGORIES, AITool, AIToolCategory,
  getToolsForOccupation
} from "@/lib/data/ai-tools";
import { skills, SKILL_CATEGORY_META, CATEGORIES, CATEGORY_ORDER, CategoryLabel, TaskItem } from "@/lib/data";
import { X, Zap, Layers, Bot } from "lucide-react";

interface AIToolsMapProps {
  tasks: TaskItem[];
  language: "en" | "de";
}

interface MapNode {
  id: string;
  type: "tool" | "skill";
  label: string;
  label_de?: string;
  color: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon?: string;
  category?: string;
  taskCount?: number;
  description_en?: string;
  description_de?: string;
}

interface MapLink {
  source: string;
  target: string;
}

export function AIToolsMap({ tasks, language }: AIToolsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const toolMatches = useMemo(() => getToolsForOccupation(tasks), [tasks]);

  const { nodes, links } = useMemo(() => {
    const n: MapNode[] = [];
    const l: MapLink[] = [];
    const addedSkills = new Set<string>();

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const toolRadius = Math.min(cx, cy) * 0.55;

    toolMatches.forEach((match, i) => {
      const angle = (i / toolMatches.length) * 2 * Math.PI - Math.PI / 2;
      const jitter = (Math.random() - 0.5) * 30;
      n.push({
        id: match.tool.id,
        type: "tool",
        label: match.tool.name,
        label_de: match.tool.name_de,
        color: AI_TOOL_CATEGORIES[match.tool.category].color,
        r: Math.max(18, Math.min(32, 14 + match.taskCount * 1.5)),
        x: cx + (toolRadius + jitter) * Math.cos(angle),
        y: cy + (toolRadius + jitter) * Math.sin(angle),
        vx: 0, vy: 0,
        icon: match.tool.icon,
        category: match.tool.category,
        taskCount: match.taskCount,
        description_en: match.tool.description_en,
        description_de: match.tool.description_de,
      });

      for (const sid of match.matchedSkills) {
        if (!addedSkills.has(sid)) {
          const sk = skills[sid];
          if (!sk) continue;
          const meta = SKILL_CATEGORY_META[sk.category];
          const sAngle = angle + (Math.random() - 0.5) * 0.8;
          const sRadius = toolRadius * 0.5 + Math.random() * toolRadius * 0.3;
          n.push({
            id: sid,
            type: "skill",
            label: sk.name_en,
            label_de: sk.name_de,
            color: meta.color,
            r: 7,
            x: cx + sRadius * Math.cos(sAngle),
            y: cy + sRadius * Math.sin(sAngle),
            vx: 0, vy: 0,
            category: sk.category,
          });
          addedSkills.add(sid);
        }
        l.push({ source: match.tool.id, target: sid });
      }
    });

    return { nodes: n, links: l };
  }, [toolMatches, dimensions]);

  const [simNodes, setSimNodes] = useState<MapNode[]>(nodes);

  useEffect(() => {
    setSimNodes([...nodes]);
    let frame: number;
    let iter = 0;
    const maxIter = 120;

    const simulate = () => {
      if (iter >= maxIter) return;

      setSimNodes(prev => {
        const next = prev.map(n => ({ ...n }));
        const nodeMap = new Map(next.map(n => [n.id, n]));

        for (const link of links) {
          const s = nodeMap.get(link.source);
          const t = nodeMap.get(link.target);
          if (!s || !t) continue;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 80;
          const force = (dist - targetDist) * 0.008;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          s.vx += fx; s.vy += fy;
          t.vx -= fx; t.vy -= fy;
        }

        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i], b = next[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = (a.r + b.r) * 2.5;
            if (dist < minDist) {
              const force = ((minDist - dist) / dist) * 0.15;
              const fx = dx * force;
              const fy = dy * force;
              a.vx -= fx; a.vy -= fy;
              b.vx += fx; b.vy += fy;
            }
          }
        }

        const cx = dimensions.width / 2;
        const cy = dimensions.height / 2;
        for (const n of next) {
          const dx = n.x - cx;
          const dy = n.y - cy;
          n.vx -= dx * 0.001;
          n.vy -= dy * 0.001;
          n.vx *= 0.85;
          n.vy *= 0.85;
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(n.r + 10, Math.min(dimensions.width - n.r - 10, n.x));
          n.y = Math.max(n.r + 10, Math.min(dimensions.height - n.r - 10, n.y));
        }

        return next;
      });

      iter++;
      frame = requestAnimationFrame(simulate);
    };

    frame = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(frame);
  }, [nodes, links, dimensions]);

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        setDimensions({ width: e.contentRect.width, height: Math.max(450, e.contentRect.height) });
      }
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  const highlightId = activeNode || hoveredNode;
  const connectedIds = useMemo(() => {
    if (!highlightId) return null;
    const set = new Set<string>([highlightId]);
    for (const l of links) {
      if (l.source === highlightId) set.add(l.target);
      if (l.target === highlightId) set.add(l.source);
    }
    return set;
  }, [highlightId, links]);

  const activeNodeData = activeNode ? simNodes.find(n => n.id === activeNode) : null;

  const aiExposedCount = tasks.filter(t => t.label !== "human_led" && t.label !== "sensitive").length;
  const toolCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of toolMatches) {
      counts[m.tool.category] = (counts[m.tool.category] || 0) + 1;
    }
    return counts;
  }, [toolMatches]);

  return (
    <div className="rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="ai-tools-map">
      <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-violet-50 to-cyan-50 flex items-center gap-3">
        <Bot className="w-5 h-5 text-violet-600" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-700">
            {language === "de" ? "KI-Werkzeuge Karte" : "AI Tools Map"}
          </h3>
          <p className="text-[10px] text-slate-400">
            {language === "de"
              ? `${toolMatches.length} Tools für ${aiExposedCount} KI-exponierte Aufgaben`
              : `${toolMatches.length} tools for ${aiExposedCount} AI-exposed tasks`}
          </p>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {Object.entries(toolCategoryCounts).map(([cat, count]) => {
            const meta = AI_TOOL_CATEGORIES[cat as AIToolCategory];
            return (
              <span key={cat} className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: meta.bg, color: meta.color }}>
                {count}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 relative" style={{ minHeight: 450 }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="w-full h-full"
            style={{ minHeight: 450 }}
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {links.map((l, i) => {
              const s = simNodes.find(n => n.id === l.source);
              const t = simNodes.find(n => n.id === l.target);
              if (!s || !t) return null;
              const isHighlighted = connectedIds && (connectedIds.has(l.source) && connectedIds.has(l.target));
              const isDimmed = connectedIds && !isHighlighted;
              return (
                <line key={i}
                  x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke={isHighlighted ? s.color : "#e2e8f0"}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  opacity={isDimmed ? 0.08 : isHighlighted ? 0.6 : 0.2}
                />
              );
            })}

            {simNodes.map(node => {
              const isHighlighted = connectedIds?.has(node.id);
              const isDimmed = connectedIds && !isHighlighted;

              if (node.type === "skill") {
                return (
                  <g key={node.id}
                    onClick={() => setActiveNode(prev => prev === node.id ? null : node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: "pointer" }}
                    opacity={isDimmed ? 0.12 : 1}
                  >
                    <circle cx={node.x} cy={node.y} r={isHighlighted ? node.r + 2 : node.r}
                      fill={node.color} stroke="white" strokeWidth={1.5}
                      filter={isHighlighted ? "url(#glow)" : undefined} />
                    {isHighlighted && (
                      <text x={node.x} y={node.y + node.r + 10} textAnchor="middle"
                        fill={node.color} fontSize={7} fontWeight={500}>
                        {language === "de" ? (node.label_de || node.label) : node.label}
                      </text>
                    )}
                  </g>
                );
              }

              return (
                <g key={node.id}
                  onClick={() => setActiveNode(prev => prev === node.id ? null : node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer" }}
                  opacity={isDimmed ? 0.12 : 1}
                >
                  <circle cx={node.x} cy={node.y} r={isHighlighted ? node.r + 4 : node.r}
                    fill={node.color} stroke="white" strokeWidth={2}
                    filter={isHighlighted ? "url(#glow)" : undefined}
                    opacity={0.9} />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize={node.r * 0.7} fill="white">
                    {node.icon}
                  </text>
                  <text x={node.x} y={node.y + node.r + 11} textAnchor="middle"
                    fill={node.color} fontSize={8} fontWeight={600}
                    opacity={isDimmed ? 0.3 : 0.9}>
                    {language === "de" ? (node.label_de || node.label) : node.label}
                  </text>
                  {node.taskCount && (
                    <text x={node.x} y={node.y + node.r + 20} textAnchor="middle"
                      fill="#94a3b8" fontSize={7}>
                      {node.taskCount} {language === "de" ? "Aufg." : "tasks"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {activeNodeData && (
          <div className="w-64 border-l border-border/30 p-3 bg-slate-50/50 animate-in slide-in-from-right-4 duration-200"
            data-testid="map-detail-panel">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {activeNodeData.icon && <span className="text-lg">{activeNodeData.icon}</span>}
                <span className="font-semibold text-sm" style={{ color: activeNodeData.color }}>
                  {language === "de" ? (activeNodeData.label_de || activeNodeData.label) : activeNodeData.label}
                </span>
              </div>
              <button onClick={() => setActiveNode(null)} className="p-1 rounded-full hover:bg-black/5">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {activeNodeData.type === "tool" && (
              <>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                  {language === "de" ? activeNodeData.description_de : activeNodeData.description_en}
                </p>
                {activeNodeData.category && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium inline-block mb-2"
                    style={{
                      backgroundColor: AI_TOOL_CATEGORIES[activeNodeData.category as AIToolCategory].bg,
                      color: AI_TOOL_CATEGORIES[activeNodeData.category as AIToolCategory].color,
                    }}>
                    {language === "de"
                      ? AI_TOOL_CATEGORIES[activeNodeData.category as AIToolCategory].label_de
                      : AI_TOOL_CATEGORIES[activeNodeData.category as AIToolCategory].label_en}
                  </span>
                )}
                <div className="text-[10px] text-slate-500 mb-1 font-medium">
                  {language === "de" ? "Verknüpfte Kompetenzen:" : "Connected skills:"}
                </div>
                <div className="flex flex-wrap gap-1">
                  {links.filter(l => l.source === activeNodeData.id).map(l => {
                    const sk = skills[l.target];
                    if (!sk) return null;
                    const meta = SKILL_CATEGORY_META[sk.category];
                    return (
                      <span key={l.target} className="text-[8px] px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5"
                        style={{ borderColor: meta.color + '30', color: meta.color }}>
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: meta.color }} />
                        {language === "de" ? sk.name_de : sk.name_en}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-2 text-[10px] text-slate-500">
                  <Zap className="w-3 h-3 inline mr-0.5" style={{ color: activeNodeData.color }} />
                  {activeNodeData.taskCount} {language === "de" ? "betroffene Aufgaben" : "affected tasks"}
                </div>
              </>
            )}

            {activeNodeData.type === "skill" && (
              <>
                <div className="text-[10px] text-slate-500 mb-1 font-medium">
                  {language === "de" ? "KI-Tools für diese Kompetenz:" : "AI tools for this skill:"}
                </div>
                <div className="space-y-1">
                  {links.filter(l => l.target === activeNodeData.id).map(l => {
                    const toolNode = simNodes.find(n => n.id === l.source);
                    if (!toolNode) return null;
                    return (
                      <div key={l.source} className="flex items-center gap-1.5 text-[10px] p-1.5 rounded-lg"
                        style={{ backgroundColor: toolNode.color + '08' }}>
                        <span>{toolNode.icon}</span>
                        <span className="font-medium" style={{ color: toolNode.color }}>
                          {language === "de" ? (toolNode.label_de || toolNode.label) : toolNode.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border/30 bg-slate-50/30 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
          <Layers className="w-3 h-3" />
          {language === "de" ? "Legende:" : "Legend:"}
        </div>
        {(Object.entries(AI_TOOL_CATEGORIES) as [AIToolCategory, typeof AI_TOOL_CATEGORIES[AIToolCategory]][]).map(([cat, meta]) => {
          if (!toolCategoryCounts[cat]) return null;
          return (
            <div key={cat} className="flex items-center gap-1 text-[9px]">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
              <span style={{ color: meta.color }}>{language === "de" ? meta.label_de : meta.label_en}</span>
            </div>
          );
        })}
        <div className="ml-2 flex items-center gap-1 text-[9px] text-slate-400">|</div>
        {(["cognitive", "social", "digital", "operational", "domain", "technical"] as const).map(cat => (
          <div key={cat} className="flex items-center gap-1 text-[9px]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SKILL_CATEGORY_META[cat].color }} />
            <span className="text-slate-500">{language === "de" ? SKILL_CATEGORY_META[cat].label_de : SKILL_CATEGORY_META[cat].label_en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
