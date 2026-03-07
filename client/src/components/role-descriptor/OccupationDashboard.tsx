import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES, CATEGORY_ORDER, SKILL_CATEGORY_META,
  CategoryLabel, skills, getOccupationSkillProfile,
  calculatePercentages, calculateFromTasks, Occupation,
  SECTOR_AVERAGES
} from "@/lib/data";
import {
  Brain, X, Zap, Building2,
  RotateCcw, ArrowRight, Sparkles, TrendingUp, TrendingDown
} from "lucide-react";

interface OccupationDashboardProps {
  occupationKey: string;
  occupation: Occupation;
  language: "en" | "de";
  onReset?: () => void;
}

export function OccupationDashboard({ occupationKey, occupation, language, onReset }: OccupationDashboardProps) {
  const [deselectedTasks, setDeselectedTasks] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryLabel | null>(null);
  const skillBarRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const profile = useMemo(() => getOccupationSkillProfile(occupationKey), [occupationKey]);
  const typicalPercentages = useMemo(() => calculatePercentages(occupation.summary), [occupation.summary]);

  const activeTasks = useMemo(() =>
    occupation.tasks.filter(t => !deselectedTasks.has(t.id)),
    [occupation.tasks, deselectedTasks]
  );
  const personalPercentages = useMemo(() => calculateFromTasks(activeTasks), [activeTasks]);
  const displayPercentages = showPersonalized ? personalPercentages : typicalPercentages;

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

  const visibleSkills = showAllSkills ? profile : profile.slice(0, 12);
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
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5" data-testid="reset-button">
            <RotateCcw className="w-3.5 h-3.5" />
            {language === "de" ? "Neue Suche" : "New Search"}
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bg-white/80 border border-border/40 p-4" data-testid="donut-panel">
            <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
              <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
                <circle cx="130" cy="130" r="100" fill="none" stroke="#f1f5f9" strokeWidth="28" />
                {(() => {
                  const radius = 100;
                  const circumference = 2 * Math.PI * radius;
                  let offset = -circumference / 4;
                  return CATEGORY_ORDER.map(cat => {
                    const pct = displayPercentages[cat] || 0;
                    if (pct <= 0) return null;
                    const dashLength = (pct / 100) * circumference;
                    const seg = { dashArray: `${dashLength} ${circumference - dashLength}`, dashOffset: -offset };
                    offset += dashLength;
                    const isHighlighted = activeCategory === cat;
                    const isDimmed = activeCategory && !isHighlighted;
                    return (
                      <circle
                        key={cat}
                        cx="130" cy="130" r="100" fill="none"
                        stroke={CATEGORIES[cat].color}
                        strokeWidth={isHighlighted ? 34 : 28}
                        strokeDasharray={seg.dashArray}
                        strokeDashoffset={seg.dashOffset}
                        strokeLinecap="butt"
                        opacity={isDimmed ? 0.25 : 1}
                        className="transition-all duration-300 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`${language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}: ${pct.toFixed(0)}%`}
                        onClick={() => handleCategoryClick(cat)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategoryClick(cat); } }}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-3xl font-bold text-slate-900">{Math.round(humanLedPct)}%</div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  {language === "de" ? "Menschlich\ngeführt" : "Human\nLed"}
                </div>
              </div>
            </div>

            <div className="space-y-1 mt-3">
              {CATEGORY_ORDER.map(cat => {
                const pct = displayPercentages[cat];
                const count = showPersonalized
                  ? activeTasks.filter(t => t.label === cat).length
                  : occupation.summary[cat];
                if (count === 0 && pct <= 0) return null;
                const isHighlighted = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left transition-all duration-200 ${
                      isHighlighted ? 'scale-[1.02]' : activeCategory ? 'opacity-50' : 'hover:bg-slate-50'
                    }`}
                    style={isHighlighted ? { backgroundColor: CATEGORIES[cat].bg } : undefined}
                    data-testid={`category-filter-${cat}`}
                  >
                    <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CATEGORIES[cat].color }} />
                    <span className="text-xs text-slate-600 flex-1 truncate">
                      {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                    </span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: CATEGORIES[cat].color }}>
                      {pct > 0 ? `${pct.toFixed(0)}%` : '—'}
                    </span>
                  </button>
                );
              })}
            </div>

            {sectorPcts && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                  {language === "de" ? "vs. Sektor" : "vs. Sector"}
                </div>
                <div className="flex h-4 rounded overflow-hidden">
                  {CATEGORY_ORDER.map(cat => {
                    const pct = sectorPcts[cat];
                    if (pct <= 0) return null;
                    return (
                      <div key={cat} style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color }}
                        className="h-full opacity-50" />
                    );
                  })}
                </div>
                <div className="flex h-4 rounded overflow-hidden mt-1">
                  {CATEGORY_ORDER.map(cat => {
                    const pct = displayPercentages[cat];
                    if (pct <= 0) return null;
                    return (
                      <div key={cat} style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color }}
                        className="h-full" />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                  <span>{language === "de" ? "Sektor" : "Sector"}</span>
                  <span>{language === "de" ? "Diese Rolle" : "This role"}</span>
                </div>
              </div>
            )}
          </div>

          {deselectedTasks.size > 0 && (
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  {language === "de" ? "Personalisierung" : "Personalization"}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">
                {activeTasks.length}/{occupation.tasks.length} {language === "de" ? "Aufgaben ausgewählt" : "tasks selected"}
              </p>
              {!showPersonalized ? (
                <Button size="sm" className="w-full text-xs h-7" onClick={() => setShowPersonalized(true)}
                  data-testid="calculate-personal-btn">
                  {language === "de" ? "Mein Profil" : "My Profile"} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              ) : (
                <div className="space-y-1">
                  {CATEGORY_ORDER.map(cat => {
                    const diff = personalPercentages[cat] - typicalPercentages[cat];
                    if (Math.abs(diff) < 0.5) return null;
                    return (
                      <div key={cat} className="flex items-center gap-1.5 text-[10px]">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
                        <span className="flex-1 truncate text-slate-600">
                          {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                        </span>
                        {diff > 0
                          ? <span className="text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />+{diff.toFixed(0)}%</span>
                          : <span className="text-red-500 flex items-center gap-0.5"><TrendingDown className="w-2.5 h-2.5" />{diff.toFixed(0)}%</span>}
                      </div>
                    );
                  })}
                  <Button variant="ghost" size="sm" className="w-full text-[10px] h-6 mt-1"
                    onClick={() => { setShowPersonalized(false); setDeselectedTasks(new Set()); }}>
                    <RotateCcw className="w-2.5 h-2.5 mr-1" /> {language === "de" ? "Zurücksetzen" : "Reset"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="task-panel">
          <div className="px-4 py-3 border-b border-border/30 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-700">
              {language === "de" ? "Aufgaben" : "Tasks"}
              {activeSkill && activeSkillInfo && (
                <span className="font-normal text-slate-400 ml-1.5">
                  — {language === "de" ? activeSkillInfo.name_de : activeSkillInfo.name_en}
                </span>
              )}
              {activeCategory && (
                <span className="font-normal ml-1.5" style={{ color: CATEGORIES[activeCategory].color }}>
                  — {language === "de" ? CATEGORIES[activeCategory].label_de : CATEGORIES[activeCategory].label_en}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {language === "de"
                ? "Aufgaben aus/einschalten • Kompetenz-Tags klicken"
                : "Toggle tasks on/off • Click skill tags"}
            </p>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)', minHeight: 400 }}>
            {CATEGORY_ORDER.map(cat => {
              const catTasks = occupation.tasks.filter(t => t.label === cat);
              if (catTasks.length === 0) return null;
              const catConfig = CATEGORIES[cat];

              const isCatDimmed = activeCategory && activeCategory !== cat;

              return (
                <div key={cat} className={`transition-opacity duration-200 ${isCatDimmed ? 'opacity-25' : ''}`}>
                  <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b border-t border-slate-100"
                    style={{ backgroundColor: catConfig.bg, color: catConfig.color }}>
                    <span>{catConfig.emoji}</span>
                    <span>{language === "de" ? catConfig.label_de : catConfig.label_en}</span>
                    <span className="opacity-60 font-normal">
                      {catTasks.filter(t => !deselectedTasks.has(t.id)).length}/{catTasks.length}
                    </span>
                  </div>
                  {catTasks.map(task => {
                    const active = !deselectedTasks.has(task.id);
                    const isMatched = matchedTaskIds ? matchedTaskIds.has(task.id) : false;
                    const isDimmedBySkill = matchedTaskIds && !isMatched;
                    const taskSkills = task.skills || [];

                    return (
                      <div
                        key={task.id}
                        className={`px-4 py-2.5 border-b border-slate-50 transition-all duration-200 ${
                          !active ? 'opacity-25' :
                          isMatched ? 'bg-primary/[0.04]' :
                          isDimmedBySkill ? 'opacity-25' : ''
                        }`}
                        data-testid={`task-item-${task.id}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: catConfig.color }} />
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs leading-relaxed ${
                              active ? 'text-slate-700' : 'text-slate-400 line-through'
                            } ${isMatched ? 'font-medium text-slate-900' : ''}`}>
                              {language === "de" ? task.text_de : task.text_en}
                            </span>
                            {taskSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
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
                                      className={`inline-flex items-center gap-0.5 text-[9px] leading-tight px-1.5 py-0.5 rounded border transition-all duration-150 ${
                                        isActive ? 'shadow-sm scale-105' : isHov ? 'scale-105' : 'hover:scale-105'
                                      }`}
                                      style={{
                                        borderColor: isActive || isHov ? meta.color : meta.color + '25',
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
                            className="shrink-0 scale-75"
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

        <div className="lg:col-span-4 space-y-4">
          {activeSkill && activeSkillInfo && activeSkillMeta && (
            <div
              className="rounded-2xl border-2 p-4 animate-in fade-in slide-in-from-right-4 duration-300"
              style={{ borderColor: activeSkillMeta.color + '50', backgroundColor: activeSkillMeta.color + '06' }}
              data-testid="active-skill-detail"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
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
              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                {language === "de" ? activeSkillInfo.definition_de : activeSkillInfo.definition_en}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: activeSkillMeta.color + '18', color: activeSkillMeta.color }}>
                  {language === "de" ? activeSkillMeta.label_de : activeSkillMeta.label_en}
                </span>
                <span className="text-[10px] text-slate-400">
                  {matchedTaskIds?.size || 0} {language === "de" ? "Aufgaben" : "tasks"}
                </span>
              </div>
              {matchedTaskIds && matchedTaskIds.size > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {CATEGORY_ORDER.map(cat => {
                    const count = occupation.tasks.filter(t => matchedTaskIds.has(t.id) && t.label === cat).length;
                    if (count === 0) return null;
                    return (
                      <span key={cat} className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: CATEGORIES[cat].bg, color: CATEGORIES[cat].color }}>
                        {CATEGORIES[cat].emoji} {count}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl bg-white/80 border border-border/40 overflow-hidden" data-testid="skill-panel">
            <div className="px-4 py-3 border-b border-border/30 bg-slate-50/50 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-slate-700">
                {language === "de" ? "Kompetenzen" : "Skills"}
              </h3>
              <span className="text-[10px] text-slate-400 ml-auto">{profile.length}</span>
            </div>
            <div className="overflow-y-auto p-3 space-y-1" style={{ maxHeight: activeSkill ? 'calc(100vh - 520px)' : 'calc(100vh - 320px)', minHeight: 300 }}>
              {visibleSkills.map(s => {
                const meta = SKILL_CATEGORY_META[s.skill.category];
                const barWidth = Math.max(10, (s.count / maxCount) * 100);
                const isActive = activeSkill === s.skillId;
                const isHovered = hoveredSkill === s.skillId;
                const dimmed = activeSkill && !isActive;

                return (
                  <button
                    key={s.skillId}
                    ref={el => { skillBarRefs.current[s.skillId] = el; }}
                    className={`w-full text-left rounded-lg px-2.5 py-1.5 transition-all duration-200 group ${
                      isActive ? 'bg-white' : isHovered ? 'bg-slate-50' : ''
                    } ${dimmed ? 'opacity-30' : ''}`}
                    style={isActive ? { boxShadow: `0 0 0 2px ${meta.color}` } : undefined}
                    onClick={() => handleSkillClick(s.skillId)}
                    onMouseEnter={() => setHoveredSkill(s.skillId)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    data-testid={`skill-bar-${s.skillId}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: meta.color,
                          transform: isActive || isHovered ? 'scale(1.8)' : 'scale(1)'
                        }} />
                      <span className="text-[11px] font-medium text-slate-700 min-w-0 truncate flex-1">
                        {language === "de" ? s.skill.name_de : s.skill.name_en}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">{s.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden mt-1 ml-[14px]">
                      <div className="h-full rounded-full flex overflow-hidden transition-all duration-300"
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
              {profile.length > 12 && (
                <button
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="w-full text-center text-[10px] text-primary hover:text-primary/80 font-medium py-1 transition-colors"
                  data-testid="toggle-all-skills"
                >
                  {showAllSkills
                    ? (language === "de" ? "Weniger" : "Less")
                    : `+ ${profile.length - 12}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
