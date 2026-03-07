import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES, CATEGORY_ORDER, SKILL_CATEGORY_META,
  CategoryLabel, skills, getOccupationSkillProfile,
  calculatePercentages, calculateFromTasks, Occupation,
  SECTOR_AVERAGES, SkillCategory
} from "@/lib/data";
import {
  Brain, X, Zap, Building2, RotateCcw,
  Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { AIToolsMap } from "./AIToolsMap";

interface OccupationDashboardProps {
  occupationKey: string;
  occupation: Occupation;
  language: "en" | "de";
  onReset?: () => void;
}

function RadarChart({ profile, language, size = 200 }: {
  profile: { category: SkillCategory; count: number; pct: number; rawPct: number }[];
  language: "en" | "de";
  size?: number;
}) {
  const cx = size / 2, cy = size / 2, r = size * 0.34;
  const n = profile.length;
  const angleStep = (2 * Math.PI) / n;

  const getPoint = (i: number, scale: number) => ({
    x: cx + r * scale * Math.sin(i * angleStep),
    y: cy - r * scale * Math.cos(i * angleStep),
  });

  const rings = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = profile.map((p, i) => getPoint(i, p.pct));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" data-testid="radar-chart">
      {rings.map(s => (
        <polygon key={s} fill={s === 0.25 ? "#f8fafc" : "none"} stroke="#e2e8f0" strokeWidth={s === 1 ? 1 : 0.5}
          points={Array.from({ length: n }, (_, i) => {
            const p = getPoint(i, s);
            return `${p.x},${p.y}`;
          }).join(' ')} />
      ))}
      {profile.map((p, i) => {
        const end = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e2e8f0" strokeWidth={0.5} />;
      })}
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(210, 70%, 50%)" stopOpacity={0.25} />
          <stop offset="100%" stopColor="hsl(210, 70%, 50%)" stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <polygon fill="url(#radarFill)" stroke="hsl(210, 70%, 50%)" strokeWidth={1.5}
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')} />
      {profile.map((p, i) => {
        const pt = getPoint(i, p.pct);
        const meta = SKILL_CATEGORY_META[p.category];
        return <circle key={i} cx={pt.x} cy={pt.y} r={4} fill={meta.color} stroke="white" strokeWidth={2} />;
      })}
      {profile.map((p, i) => {
        const labelR = r * 1.25;
        const lx = cx + labelR * Math.sin(i * angleStep);
        const ly = cy - labelR * Math.cos(i * angleStep);
        const meta = SKILL_CATEGORY_META[p.category];
        return (
          <g key={`label-${i}`}>
            <text x={lx} y={ly - 4} textAnchor="middle" dominantBaseline="middle"
              fill={meta.color} fontSize={7.5} fontWeight={600}>
              {language === "de" ? meta.label_de : meta.label_en}
            </text>
            <text x={lx} y={ly + 5} textAnchor="middle" dominantBaseline="middle"
              fill={meta.color} fontSize={7} fontWeight={400} opacity={0.7}>
              {p.rawPct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function OccupationDashboard({ occupationKey, occupation, language, onReset }: OccupationDashboardProps) {
  const [deselectedTasks, setDeselectedTasks] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryLabel | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<CategoryLabel>>(new Set(CATEGORY_ORDER));
  const skillBarRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const profile = useMemo(() => getOccupationSkillProfile(occupationKey), [occupationKey]);
  const typicalPercentages = useMemo(() => calculatePercentages(occupation.summary), [occupation.summary]);

  const activeTasks = useMemo(() =>
    occupation.tasks.filter(t => !deselectedTasks.has(t.id)),
    [occupation.tasks, deselectedTasks]
  );
  const personalPercentages = useMemo(() => calculateFromTasks(activeTasks), [activeTasks]);
  const displayPercentages = showPersonalized ? personalPercentages : typicalPercentages;

  const skillCategoryProfile = useMemo(() => {
    const cats: Record<SkillCategory, number> = { cognitive: 0, social: 0, digital: 0, operational: 0, domain: 0, technical: 0 };
    for (const s of profile) {
      cats[s.skill.category] += s.count;
    }
    const total = Math.max(Object.values(cats).reduce((a, b) => a + b, 0), 1);
    const evenShare = 100 / 6;
    return (Object.entries(cats) as [SkillCategory, number][]).map(([category, count]) => {
      const pctOfTotal = (count / total) * 100;
      const ratio = pctOfTotal / evenShare;
      return {
        category,
        count,
        pct: Math.min(ratio / 3, 1),
        rawPct: Math.round(pctOfTotal),
      };
    });
  }, [profile]);

  const skillTaskMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const t of occupation.tasks) {
      for (const sid of (t.skills || [])) {
        if (!map[sid]) map[sid] = new Set();
        map[sid].add(t.id);
      }
    }
    return map;
  }, [occupation.tasks]);

  const highlightSkill = activeSkill || hoveredSkill;
  const matchedTaskIds = useMemo(() => {
    if (!highlightSkill) return null;
    return skillTaskMap[highlightSkill] || new Set();
  }, [highlightSkill, skillTaskMap]);

  const handleSkillClick = useCallback((skillId: string) => {
    setActiveSkill(prev => prev === skillId ? null : skillId);
    setActiveCategory(null);
  }, []);

  const handleCategoryClick = useCallback((cat: CategoryLabel) => {
    setActiveCategory(prev => prev === cat ? null : cat);
    setActiveSkill(null);
  }, []);

  const handleToggleTask = useCallback((taskId: string) => {
    setDeselectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  }, []);

  const handleTaskSkillClick = useCallback((skillId: string) => {
    handleSkillClick(skillId);
    setTimeout(() => {
      const el = skillBarRefs.current[skillId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, [handleSkillClick]);

  const toggleCatExpand = useCallback((cat: CategoryLabel) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }, []);

  const visibleSkills = showAllSkills ? profile : profile.slice(0, 15);
  const maxCount = profile[0]?.count || 1;

  const activeSkillInfo = activeSkill ? skills[activeSkill] : null;
  const activeSkillMeta = activeSkillInfo ? SKILL_CATEGORY_META[activeSkillInfo.category] : null;

  const sectorAvg = SECTOR_AVERAGES[occupation.sector];
  const sectorPcts: Record<CategoryLabel, number> | null = sectorAvg ? {
    automatable: sectorAvg.automatable * 100,
    high_ai_potential: sectorAvg.high_ai_potential * 100,
    sensitive: sectorAvg.sensitive * 100,
    ai_assisted: sectorAvg.ai_assisted * 100,
    human_led: sectorAvg.human_led * 100,
  } : null;

  const humanLedPct = (displayPercentages.human_led || 0) + (displayPercentages.ai_assisted || 0);

  return (
    <div className="space-y-4" data-testid="occupation-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-primary">
            {language === "de" ? occupation.occupation_de : occupationKey}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-0.5 text-sm">
            <Building2 className="w-3.5 h-3.5" />
            {occupation.sector}
            <span className="text-xs">• {occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}</span>
            <span className="text-xs">• {profile.length} {language === "de" ? "Kompetenzen" : "skills"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {deselectedTasks.size > 0 && !showPersonalized && (
            <Button size="sm" variant="default" className="gap-1 text-xs" onClick={() => setShowPersonalized(true)}
              data-testid="calculate-personal-btn">
              <Sparkles className="w-3 h-3" />
              {language === "de" ? "Mein Profil" : "My Profile"}
            </Button>
          )}
          {showPersonalized && (
            <Button size="sm" variant="outline" className="gap-1 text-xs"
              onClick={() => { setShowPersonalized(false); setDeselectedTasks(new Set()); }}>
              <RotateCcw className="w-3 h-3" />
              {language === "de" ? "Zurücksetzen" : "Reset"}
            </Button>
          )}
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5" data-testid="reset-button">
              <RotateCcw className="w-3.5 h-3.5" />
              {language === "de" ? "Neue Suche" : "New Search"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="overview-row">
        <div className="rounded-2xl bg-white/80 border border-border/40 p-4 flex items-center gap-4">
          <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
            <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
              <circle cx="130" cy="130" r="100" fill="none" stroke="#f1f5f9" strokeWidth="30" />
              {(() => {
                const circumference = 2 * Math.PI * 100;
                let offset = -circumference / 4;
                return CATEGORY_ORDER.map(cat => {
                  const pct = displayPercentages[cat] || 0;
                  if (pct <= 0) return null;
                  const dashLength = (pct / 100) * circumference;
                  const seg = { dashArray: `${dashLength} ${circumference - dashLength}`, dashOffset: -offset };
                  offset += dashLength;
                  return (
                    <circle key={cat} cx="130" cy="130" r="100" fill="none"
                      stroke={CATEGORIES[cat].color} strokeWidth="30"
                      strokeDasharray={seg.dashArray} strokeDashoffset={seg.dashOffset}
                      strokeLinecap="butt" className="transition-all duration-500"
                      role="button" tabIndex={0}
                      aria-label={`${language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}: ${pct.toFixed(0)}%`}
                      onClick={() => handleCategoryClick(cat)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategoryClick(cat); } }}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-lg font-bold text-slate-900">{Math.round(humanLedPct)}%</div>
              <div className="text-[8px] text-slate-400 leading-tight">
                {language === "de" ? "Mensch" : "Human"}
              </div>
            </div>
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            {CATEGORY_ORDER.map(cat => {
              const pct = displayPercentages[cat];
              if (pct <= 0) return null;
              return (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-1.5 w-full text-left transition-opacity ${activeCategory && activeCategory !== cat ? 'opacity-30' : ''}`}
                  data-testid={`category-filter-${cat}`}>
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: CATEGORIES[cat].color }} />
                  <span className="text-[10px] text-slate-600 truncate flex-1">
                    {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                  </span>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: CATEGORIES[cat].color }}>
                    {pct.toFixed(0)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-border/40 p-4" data-testid="category-bars">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-semibold">
            {language === "de" ? "Aufgabenverteilung" : "Task Distribution"}
          </div>
          <div className="space-y-2">
            {CATEGORY_ORDER.map(cat => {
              const pct = displayPercentages[cat];
              const count = showPersonalized
                ? activeTasks.filter(t => t.label === cat).length
                : occupation.summary[cat];
              if (count === 0) return null;
              const isActive = activeCategory === cat;
              const isDimmed = activeCategory && !isActive;
              return (
                <button key={cat} onClick={() => handleCategoryClick(cat)}
                  className={`w-full text-left transition-opacity ${isDimmed ? 'opacity-25' : ''}`}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium" style={{ color: CATEGORIES[cat].color }}>
                      {CATEGORIES[cat].emoji} {count}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums" style={{ color: CATEGORIES[cat].color }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-border/40 p-4 flex flex-col" data-testid="sector-comparison-panel">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-semibold">
            {language === "de" ? "vs. Sektor" : "vs. Sector Avg."}
          </div>
          {sectorPcts ? (
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <div>
                <div className="text-[9px] text-slate-400 mb-0.5">{language === "de" ? "Diese Rolle" : "This role"}</div>
                <div className="flex h-5 rounded-lg overflow-hidden">
                  {CATEGORY_ORDER.map(cat => {
                    const pct = displayPercentages[cat];
                    if (pct <= 0) return null;
                    return (
                      <div key={cat} className="h-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: pct > 5 ? undefined : 0 }}>
                        {pct >= 10 ? `${Math.round(pct)}%` : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 mb-0.5">
                  {language === "de" ? `Ø ${occupation.sector}` : `Avg. ${occupation.sector}`}
                </div>
                <div className="flex h-5 rounded-lg overflow-hidden opacity-60">
                  {CATEGORY_ORDER.map(cat => {
                    const pct = sectorPcts[cat];
                    if (pct <= 0) return null;
                    return (
                      <div key={cat} className="h-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: pct > 5 ? undefined : 0 }}>
                        {pct >= 10 ? `${Math.round(pct)}%` : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1">
                {CATEGORY_ORDER.map(cat => {
                  const diff = displayPercentages[cat] - sectorPcts[cat];
                  if (Math.abs(diff) < 1) return null;
                  return (
                    <div key={cat} className="flex items-center gap-1 text-[9px]">
                      <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
                      {diff > 0
                        ? <span className="text-emerald-600 font-medium">+{diff.toFixed(0)}%</span>
                        : <span className="text-red-400 font-medium">{diff.toFixed(0)}%</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              {language === "de" ? "Kein Sektorvergleich" : "No sector data"}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/80 border border-border/40 p-3 flex items-center justify-center" data-testid="radar-panel">
          <div style={{ width: 180, height: 180 }}>
            <RadarChart profile={skillCategoryProfile} language={language} size={180} />
          </div>
        </div>
      </div>

      {showPersonalized && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-2 flex items-center gap-4 text-xs animate-in fade-in duration-300">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span className="text-primary font-medium">
            {activeTasks.length}/{occupation.tasks.length} {language === "de" ? "Aufgaben aktiv" : "tasks active"}
          </span>
          <div className="flex items-center gap-3 ml-auto">
            {CATEGORY_ORDER.map(cat => {
              const diff = personalPercentages[cat] - typicalPercentages[cat];
              if (Math.abs(diff) < 1) return null;
              return (
                <span key={cat} className="flex items-center gap-0.5 text-[10px]">
                  <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
                  {diff > 0
                    ? <span className="text-emerald-600 font-medium">+{diff.toFixed(0)}%</span>
                    : <span className="text-red-400 font-medium">{diff.toFixed(0)}%</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="task-panel">
          <div className="px-4 py-2.5 border-b border-border/30 bg-slate-50/50 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-700 flex-1">
              {language === "de" ? "Aufgaben" : "Tasks"}
              {activeSkill && activeSkillInfo && (
                <span className="font-normal text-slate-400 ml-1.5 text-xs">
                  → {language === "de" ? activeSkillInfo.name_de : activeSkillInfo.name_en}
                </span>
              )}
              {activeCategory && (
                <span className="font-normal ml-1.5 text-xs" style={{ color: CATEGORIES[activeCategory].color }}>
                  → {language === "de" ? CATEGORIES[activeCategory].label_de : CATEGORIES[activeCategory].label_en}
                </span>
              )}
            </h3>
            {(activeSkill || activeCategory) && (
              <button onClick={() => { setActiveSkill(null); setActiveCategory(null); }}
                className="text-[10px] text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-full bg-slate-100">
                {language === "de" ? "Filter löschen" : "Clear filter"}
              </button>
            )}
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)', minHeight: 350 }}>
            {CATEGORY_ORDER.map(cat => {
              const catTasks = occupation.tasks.filter(t => t.label === cat);
              if (catTasks.length === 0) return null;
              const catConfig = CATEGORIES[cat];
              const isCatDimmed = activeCategory && activeCategory !== cat;
              const isExpanded = expandedCats.has(cat);

              return (
                <div key={cat} className={`transition-opacity duration-200 ${isCatDimmed ? 'opacity-20' : ''}`}>
                  <button
                    onClick={() => toggleCatExpand(cat)}
                    className="sticky top-0 z-10 w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b border-slate-100 text-left"
                    style={{ backgroundColor: catConfig.bg, color: catConfig.color }}
                    data-testid={`task-category-header-${cat}`}
                  >
                    <span>{catConfig.emoji}</span>
                    <span className="flex-1">{language === "de" ? catConfig.label_de : catConfig.label_en}</span>
                    <span className="opacity-60 font-normal tabular-nums">
                      {catTasks.filter(t => !deselectedTasks.has(t.id)).length}/{catTasks.length}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3 h-3 opacity-40" /> : <ChevronDown className="w-3 h-3 opacity-40" />}
                  </button>
                  {isExpanded && catTasks.map(task => {
                    const active = !deselectedTasks.has(task.id);
                    const isMatched = matchedTaskIds ? matchedTaskIds.has(task.id) : false;
                    const isDimmedBySkill = matchedTaskIds && !isMatched;
                    const taskSkills = task.skills || [];

                    return (
                      <div
                        key={task.id}
                        className={`px-4 py-2 border-b border-slate-50 transition-all duration-200 ${
                          !active ? 'opacity-20' :
                          isMatched ? 'bg-primary/[0.04]' :
                          isDimmedBySkill ? 'opacity-20' : ''
                        }`}
                        data-testid={`task-item-${task.id}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: catConfig.color }} />
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs leading-relaxed ${
                              active ? 'text-slate-700' : 'text-slate-400 line-through'
                            } ${isMatched ? 'font-medium text-slate-900' : ''}`}>
                              {language === "de" ? task.text_de : task.text_en}
                            </span>
                            {taskSkills.length > 0 && (
                              <div className="flex flex-wrap gap-0.5 mt-1">
                                {taskSkills.map(sid => {
                                  const sk = skills[sid];
                                  if (!sk) return null;
                                  const meta = SKILL_CATEGORY_META[sk.category];
                                  const isActive = activeSkill === sid;
                                  const isHov = hoveredSkill === sid;
                                  return (
                                    <button
                                      key={sid}
                                      onClick={(e) => { e.stopPropagation(); handleTaskSkillClick(sid); }}
                                      onMouseEnter={() => setHoveredSkill(sid)}
                                      onMouseLeave={() => setHoveredSkill(null)}
                                      className={`inline-flex items-center gap-0.5 text-[8px] leading-tight px-1 py-0.5 rounded border transition-all duration-150 ${
                                        isActive ? 'shadow-sm scale-105' : isHov ? 'scale-105' : 'hover:scale-105'
                                      }`}
                                      style={{
                                        borderColor: isActive || isHov ? meta.color : meta.color + '20',
                                        backgroundColor: isActive ? meta.color + '15' : 'transparent',
                                        color: meta.color,
                                        boxShadow: isActive ? `0 0 0 1px ${meta.color}` : undefined,
                                      }}
                                      data-testid={`task-skill-tag-${task.id}-${sid}`}
                                    >
                                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: meta.color }} />
                                      {language === "de" ? sk.name_de : sk.name_en}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                          <Switch
                            checked={active}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="shrink-0 scale-[0.65]"
                            data-testid={`task-toggle-${task.id}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {activeSkill && activeSkillInfo && activeSkillMeta && (
            <div
              className="rounded-2xl border-2 p-3 animate-in fade-in slide-in-from-right-4 duration-300"
              style={{ borderColor: activeSkillMeta.color + '50', backgroundColor: activeSkillMeta.color + '06' }}
              data-testid="active-skill-detail"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 shrink-0" style={{ color: activeSkillMeta.color }} />
                  <span className="font-semibold text-sm" style={{ color: activeSkillMeta.color }}>
                    {language === "de" ? activeSkillInfo.name_de : activeSkillInfo.name_en}
                  </span>
                </div>
                <button onClick={() => setActiveSkill(null)}
                  className="p-1 rounded-full hover:bg-black/5" data-testid="clear-skill-filter">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-1.5">
                {language === "de" ? activeSkillInfo.definition_de : activeSkillInfo.definition_en}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: activeSkillMeta.color + '18', color: activeSkillMeta.color }}>
                  {language === "de" ? activeSkillMeta.label_de : activeSkillMeta.label_en}
                </span>
                <span className="text-[9px] text-slate-400">
                  {matchedTaskIds?.size || 0} {language === "de" ? "Aufgaben" : "tasks"}
                </span>
                {matchedTaskIds && matchedTaskIds.size > 0 && CATEGORY_ORDER.map(cat => {
                  const count = occupation.tasks.filter(t => matchedTaskIds.has(t.id) && t.label === cat).length;
                  if (count === 0) return null;
                  return (
                    <span key={cat} className="inline-flex items-center gap-0.5 text-[8px] px-1 py-0.5 rounded-full"
                      style={{ backgroundColor: CATEGORIES[cat].bg, color: CATEGORIES[cat].color }}>
                      {CATEGORIES[cat].emoji} {count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="skill-panel">
            <div className="px-4 py-2.5 border-b border-border/30 bg-slate-50/50 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-slate-700">
                {language === "de" ? "Kompetenzen" : "Skills"}
              </h3>
              <span className="text-[10px] text-slate-400 ml-auto">{profile.length}</span>
            </div>
            <div className="overflow-y-auto p-2 space-y-0.5"
              style={{ maxHeight: activeSkill ? 'calc(100vh - 560px)' : 'calc(100vh - 420px)', minHeight: 250 }}>
              {visibleSkills.map(s => {
                const meta = SKILL_CATEGORY_META[s.skill.category];
                const barWidth = Math.max(8, (s.count / maxCount) * 100);
                const isActive = activeSkill === s.skillId;
                const isHovered = hoveredSkill === s.skillId;
                const dimmed = activeSkill && !isActive;

                return (
                  <button
                    key={s.skillId}
                    ref={el => { skillBarRefs.current[s.skillId] = el; }}
                    className={`w-full text-left rounded-lg px-2 py-1.5 transition-all duration-200 group ${
                      isActive ? 'bg-white' : isHovered ? 'bg-slate-50' : ''
                    } ${dimmed ? 'opacity-25' : ''}`}
                    style={isActive ? { boxShadow: `0 0 0 2px ${meta.color}` } : undefined}
                    onClick={() => handleSkillClick(s.skillId)}
                    onMouseEnter={() => setHoveredSkill(s.skillId)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    data-testid={`skill-bar-${s.skillId}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: meta.color,
                          transform: isActive || isHovered ? 'scale(1.8)' : 'scale(1)'
                        }} />
                      <span className="text-[10px] font-medium text-slate-700 min-w-0 truncate flex-1">
                        {language === "de" ? s.skill.name_de : s.skill.name_en}
                      </span>
                      <span className="text-[9px] text-slate-400 shrink-0 tabular-nums">{s.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-0.5 ml-[12px]">
                      <div className="h-full rounded-full flex overflow-hidden transition-all duration-500"
                        style={{ width: `${barWidth}%` }}>
                        {CATEGORY_ORDER.map(cat => {
                          const count = s.byLabel[cat];
                          if (count === 0) return null;
                          return (
                            <div key={cat} className="h-full"
                              style={{ width: `${(count / s.count) * 100}%`, backgroundColor: CATEGORIES[cat].color }} />
                          );
                        })}
                      </div>
                    </div>
                  </button>
                );
              })}
              {profile.length > 15 && (
                <button
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="w-full text-center text-[10px] text-primary hover:text-primary/80 font-medium py-1.5 transition-colors"
                  data-testid="toggle-all-skills"
                >
                  {showAllSkills
                    ? (language === "de" ? "Weniger anzeigen" : "Show less")
                    : `+ ${profile.length - 15} ${language === "de" ? "weitere" : "more"}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AIToolsMap tasks={occupation.tasks} language={language} />
    </div>
  );
}
