import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES, CATEGORY_ORDER, SKILL_CATEGORY_META,
  CategoryLabel, skills, getOccupationSkillProfile,
  calculatePercentages, calculateFromTasks, Occupation,
  SECTOR_AVERAGES, SkillCategory, TaskItem
} from "@/lib/data";
import {
  Brain, X, Zap, Building2, RotateCcw,
  Sparkles, ChevronDown, Plus, Wrench, LayoutGrid, ListChecks
} from "lucide-react";
import { AIToolsMap } from "./AIToolsMap";
import { PeerUsage } from "./PeerUsage";

interface OccupationDashboardProps {
  occupationKey: string;
  occupation: Occupation;
  language: "en" | "de";
  onReset?: () => void;
  initialDeselected?: Set<string>;
  initialCustomTasks?: TaskItem[];
  onBackToTasks?: () => void;
}

type TabId = "overview" | "tasks" | "skills" | "tools";

export function OccupationDashboard({ occupationKey, occupation, language, onReset, initialDeselected, initialCustomTasks, onBackToTasks }: OccupationDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [deselectedTasks, setDeselectedTasks] = useState<Set<string>>(initialDeselected || new Set());
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showPersonalized, setShowPersonalized] = useState(!!initialDeselected?.size);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryLabel | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<CategoryLabel>>(new Set());
  const [customTasks, setCustomTasks] = useState<TaskItem[]>(initialCustomTasks || []);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskLabel, setNewTaskLabel] = useState<CategoryLabel>("ai_assisted");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const skillBarRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const allTasks = useMemo(() => [...occupation.tasks, ...customTasks], [occupation.tasks, customTasks]);

  const profile = useMemo(() => getOccupationSkillProfile(occupationKey), [occupationKey]);
  const typicalPercentages = useMemo(() => calculatePercentages(occupation.summary), [occupation.summary]);

  const activeTasks = useMemo(() =>
    allTasks.filter(t => !deselectedTasks.has(t.id)),
    [allTasks, deselectedTasks]
  );

  const personalPercentages = useMemo(() => calculateFromTasks(activeTasks), [activeTasks]);

  const displayPercentages = showPersonalized ? personalPercentages : typicalPercentages;

  const skillCategoryProfile = useMemo(() => {
    const cats: SkillCategory[] = ["cognitive", "social", "digital", "operational", "domain", "technical"];
    const total = profile.reduce((s, p) => s + p.count, 0) || 1;
    return cats.map(c => {
      const count = profile.filter(s => s.skill.category === c).reduce((s, p) => s + p.count, 0);
      return { category: c, count, pct: Math.max(0.08, count / total), rawPct: Math.round((count / total) * 100) };
    });
  }, [profile]);

  const matchedTaskIds = useMemo(() => {
    if (!activeSkill) return null;
    const set = new Set<string>();
    for (const t of allTasks) {
      if (t.skills?.includes(activeSkill)) set.add(t.id);
    }
    return set;
  }, [activeSkill, allTasks]);

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
    setActiveTab("skills");
    setTimeout(() => {
      const el = skillBarRefs.current[skillId];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [handleSkillClick]);

  const addCustomTask = useCallback(() => {
    const text = newTaskText.trim();
    if (!text) return;
    const task: TaskItem = {
      id: `custom-${Date.now()}`,
      text_en: text,
      text_de: text,
      label: newTaskLabel,
      score: 0.5,
      skills: [],
    };
    setCustomTasks(prev => [...prev, task]);
    setNewTaskText("");
    setShowAddTask(false);
    if (!showPersonalized) setShowPersonalized(true);
  }, [newTaskText, newTaskLabel, showPersonalized]);

  const removeCustomTask = useCallback((taskId: string) => {
    setCustomTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

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

  const tabs: { id: TabId; label_en: string; label_de: string; icon: React.ReactNode }[] = [
    { id: "overview", label_en: "Overview", label_de: "Übersicht", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: "tasks", label_en: "Tasks", label_de: "Aufgaben", icon: <ListChecks className="w-3.5 h-3.5" /> },
    { id: "skills", label_en: "Skills", label_de: "Kompetenzen", icon: <Brain className="w-3.5 h-3.5" /> },
    { id: "tools", label_en: "Tools", label_de: "Tools", icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

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
            <span className="text-xs">• {occupation.summary.total + customTasks.length} {language === "de" ? "Aufgaben" : "tasks"}</span>
            <span className="text-xs">• {profile.length} {language === "de" ? "Kompetenzen" : "skills"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showPersonalized && (
            <Button size="sm" variant="outline" className="gap-1 text-xs"
              onClick={() => { setShowPersonalized(false); setDeselectedTasks(new Set()); setCustomTasks([]); }}>
              <RotateCcw className="w-3 h-3" />
              {language === "de" ? "Zurücksetzen" : "Reset"}
            </Button>
          )}
          {onBackToTasks && (
            <Button variant="outline" size="sm" onClick={onBackToTasks} className="gap-1.5" data-testid="edit-tasks-button">
              <ListChecks className="w-3.5 h-3.5" />
              {language === "de" ? "Aufgaben bearbeiten" : "Edit Tasks"}
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

      <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl" data-testid="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
            data-testid={`tab-${tab.id}`}
          >
            {tab.icon}
            {language === "de" ? tab.label_de : tab.label_en}
          </button>
        ))}
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

      {activeTab === "overview" && (
        <div className="space-y-4 animate-in fade-in duration-200" data-testid="tab-overview-content">
          <div className="rounded-2xl bg-white/80 border border-border/40 p-5">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
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
                          style={{ cursor: 'pointer' }}
                          onClick={() => { handleCategoryClick(cat); setActiveTab("tasks"); }}
                        />
                      );
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-bold text-slate-900">{Math.round(humanLedPct)}%</div>
                  <div className="text-[9px] text-slate-400 leading-tight">
                    {language === "de" ? "Mensch" : "Human"}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2 min-w-[200px]">
                {CATEGORY_ORDER.map(cat => {
                  const pct = displayPercentages[cat];
                  const count = showPersonalized
                    ? activeTasks.filter(t => t.label === cat).length
                    : occupation.summary[cat];
                  if (count === 0) return null;
                  return (
                    <button key={cat} onClick={() => { handleCategoryClick(cat); setActiveTab("tasks"); }}
                      className="w-full text-left group hover:bg-slate-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
                      data-testid={`category-filter-${cat}`}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: CATEGORIES[cat].color }}>
                          <span>{CATEGORIES[cat].emoji}</span>
                          {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                        </span>
                        <span className="text-xs font-bold tabular-nums" style={{ color: CATEGORIES[cat].color }}>
                          {count} <span className="font-normal opacity-60">({pct.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color }} />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === "de" ? CATEGORIES[cat].message_de : CATEGORIES[cat].message_en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {sectorPcts && (
            <div className="rounded-2xl bg-white/80 border border-border/40 p-4" data-testid="sector-comparison-panel">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-3 font-semibold">
                {language === "de" ? "Vergleich mit Sektor-Durchschnitt" : "Compared to sector average"}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-500 mb-1 font-medium">{language === "de" ? "Diese Rolle" : "This role"}</div>
                  <div className="flex h-6 rounded-lg overflow-hidden">
                    {CATEGORY_ORDER.map(cat => {
                      const pct = displayPercentages[cat];
                      if (pct <= 0) return null;
                      return (
                        <div key={cat} className="h-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: pct > 5 ? undefined : 0 }}>
                          {pct >= 8 ? `${Math.round(pct)}%` : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1 font-medium">
                    {language === "de" ? `Ø ${occupation.sector}` : `Avg. ${occupation.sector}`}
                  </div>
                  <div className="flex h-6 rounded-lg overflow-hidden opacity-50">
                    {CATEGORY_ORDER.map(cat => {
                      const pct = sectorPcts[cat];
                      if (pct <= 0) return null;
                      return (
                        <div key={cat} className="h-full flex items-center justify-center text-[9px] font-bold text-white"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: pct > 5 ? undefined : 0 }}>
                          {pct >= 8 ? `${Math.round(pct)}%` : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <button onClick={() => setActiveTab("tasks")}
              className="text-xs text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1">
              {language === "de" ? "Alle Aufgaben anzeigen" : "View all tasks"} →
            </button>
          </div>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="animate-in fade-in duration-200" data-testid="tab-tasks-content">
          <div className="rounded-2xl bg-white/80 border border-border/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 bg-slate-50/50 flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-slate-700 mr-auto">
                {language === "de" ? "Aufgaben" : "Tasks"}
              </h3>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-colors"
                data-testid="add-task-btn"
              >
                <Plus className="w-3 h-3" />
                {language === "de" ? "Aufgabe" : "Task"}
              </button>
            </div>

            {showAddTask && (
              <div className="px-4 py-3 border-b border-border/30 bg-indigo-50/30 animate-in fade-in slide-in-from-top-2 duration-200" data-testid="add-task-form">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomTask()}
                    placeholder={language === "de" ? "Neue Aufgabe beschreiben..." : "Describe a new task..."}
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-slate-300"
                    data-testid="add-task-input"
                    autoFocus
                  />
                  <button
                    onClick={addCustomTask}
                    disabled={!newTaskText.trim()}
                    className="px-3 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    data-testid="add-task-submit"
                  >
                    {language === "de" ? "Hinzufügen" : "Add"}
                  </button>
                  <button onClick={() => setShowAddTask(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/60">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {CATEGORY_ORDER.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewTaskLabel(cat)}
                      className={`text-[9px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                        newTaskLabel === cat ? 'ring-1 shadow-sm' : 'opacity-50 hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: CATEGORIES[cat].bg,
                        color: CATEGORIES[cat].color,
                        borderColor: newTaskLabel === cat ? CATEGORIES[cat].color : CATEGORIES[cat].color + '30',
                        ringColor: CATEGORIES[cat].color,
                      }}
                      data-testid={`add-task-label-${cat}`}
                    >
                      {CATEGORIES[cat].emoji} {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 px-4 py-3 flex-wrap" data-testid="task-category-filters">
              {CATEGORY_ORDER.map(cat => {
                const catTasks = allTasks.filter(t => t.label === cat);
                if (catTasks.length === 0) return null;
                const catConfig = CATEGORIES[cat];
                const isActive = activeCategory === cat;
                const activeCount = catTasks.filter(t => !deselectedTasks.has(t.id)).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(isActive ? null : cat);
                      setExpandedTaskId(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                      isActive ? 'shadow-md scale-[1.02]' : 'hover:shadow-sm hover:scale-[1.01] opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? catConfig.bg : 'white',
                      borderColor: isActive ? catConfig.color : catConfig.color + '25',
                      color: catConfig.color,
                    }}
                    data-testid={`task-category-filter-${cat}`}
                  >
                    <span className="text-sm">{catConfig.emoji}</span>
                    <span className="hidden sm:inline">{language === "de" ? catConfig.label_de : catConfig.label_en}</span>
                    <span className="tabular-nums font-bold text-[11px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: catConfig.color + '15' }}>
                      {activeCount}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-4 pb-2">
              <p className="text-[10px] text-slate-400 italic leading-relaxed">
                {language === "de"
                  ? "Klicke auf eine Aufgabe für Details. Labels sind Richtwerte — das Verhältnis kann je nach Kontext variieren."
                  : "Click a task for details. Labels are directional — the balance can vary by context."}
              </p>
            </div>

            <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: 200 }}>
              {(() => {
                const visibleCats = activeCategory ? [activeCategory] : CATEGORY_ORDER;
                return visibleCats.map(cat => {
                  const catTasks = allTasks.filter(t => t.label === cat);
                  if (catTasks.length === 0) return null;
                  const catConfig = CATEGORIES[cat];

                  return (
                    <div key={cat} className="mb-4 last:mb-0">
                      {!activeCategory && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catConfig.color }} />
                          <span className="text-[11px] font-semibold" style={{ color: catConfig.color }}>
                            {language === "de" ? catConfig.label_de : catConfig.label_en}
                          </span>
                          <div className="flex-1 h-px bg-slate-100" />
                        </div>
                      )}
                      {activeCategory && (
                        <div className="mb-3 p-3 rounded-xl" style={{ backgroundColor: catConfig.bg }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{catConfig.emoji}</span>
                            <span className="text-sm font-semibold" style={{ color: catConfig.color }}>
                              {language === "de" ? catConfig.label_de : catConfig.label_en}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: catConfig.color, opacity: 0.7 }}>
                            {language === "de" ? catConfig.message_de : catConfig.message_en}
                          </p>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        {catTasks.map(task => {
                          const active = !deselectedTasks.has(task.id);
                          const isMatched = matchedTaskIds ? matchedTaskIds.has(task.id) : false;
                          const isDimmedBySkill = matchedTaskIds && !isMatched;
                          const hasExp = !!(task.explanation?.what_it_means);
                          const isTaskExpanded = expandedTaskId === task.id;
                          const isGreyed = task.confirmed && !task.id.startsWith('custom-');

                          return (
                            <div
                              key={task.id}
                              className={`rounded-xl border transition-all duration-200 ${
                                !active ? 'opacity-20 border-slate-100' :
                                isDimmedBySkill ? 'opacity-20 border-slate-100' :
                                isTaskExpanded ? 'border-slate-200 shadow-sm bg-white' :
                                isMatched ? 'border-primary/30 bg-primary/[0.03] shadow-sm' :
                                isGreyed ? 'opacity-40 border-slate-100 bg-slate-50/50' :
                                'border-slate-100 bg-white/60 hover:border-slate-200 hover:shadow-sm'
                              }`}
                              data-testid={`task-item-${task.id}`}
                            >
                              <div
                                className={`px-3 py-2.5 flex items-start gap-2.5 ${hasExp || true ? 'cursor-pointer' : ''}`}
                                onClick={() => setExpandedTaskId(isTaskExpanded ? null : task.id)}
                              >
                                <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: catConfig.color }} />
                                <div className="flex-1 min-w-0">
                                  <span className={`text-xs leading-relaxed ${
                                    active ? 'text-slate-700' : 'text-slate-400 line-through'
                                  } ${isMatched ? 'font-medium text-slate-900' : ''}`}>
                                    {language === "de" ? task.text_de : task.text_en}
                                  </span>
                                  {task.id.startsWith('custom-') && (
                                    <span className="inline-flex items-center gap-1 ml-1.5 align-middle">
                                      <span className="text-[8px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                                        {language === "de" ? "Eigene" : "Custom"}
                                      </span>
                                      <button onClick={(e) => { e.stopPropagation(); removeCustomTask(task.id); }}
                                        className="w-4 h-4 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                                        data-testid={`remove-custom-task-${task.id}`}>
                                        <X className="w-2.5 h-2.5 text-red-400" />
                                      </button>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {hasExp && (
                                    <span className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center" title={language === "de" ? "Details verfügbar" : "Details available"}>
                                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                    </span>
                                  )}
                                  <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${isTaskExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </div>

                              {isTaskExpanded && (
                                <div className="px-3 pb-3 border-t border-slate-100/60 animate-in fade-in slide-in-from-top-1 duration-200">
                                  {task.explanation && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5">
                                      {[
                                        { key: 'what_it_means', title: language === 'de' ? 'Was das bedeutet' : 'What this means', icon: '💡' },
                                        { key: 'why_it_fits', title: language === 'de' ? 'Warum diese Kategorie' : 'Why it fits here', icon: '🎯' },
                                        { key: 'what_stays_human', title: language === 'de' ? 'Was menschlich bleibt' : 'What stays human', icon: '🧑' },
                                      ].map(col => (
                                        <div key={col.key} className="bg-slate-50/80 rounded-lg p-2.5">
                                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                                            <span>{col.icon}</span> {col.title}
                                          </div>
                                          <div className="text-[11px] text-slate-600 leading-relaxed">
                                            {(task.explanation as Record<string, string>)[col.key]}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {(task.skills || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100/60">
                                      <span className="text-[9px] text-slate-400 font-medium mr-1 self-center">
                                        {language === "de" ? "Kompetenzen:" : "Skills:"}
                                      </span>
                                      {(task.skills || []).map(sid => {
                                        const sk = skills[sid];
                                        if (!sk) return null;
                                        const meta = SKILL_CATEGORY_META[sk.category];
                                        return (
                                          <button
                                            key={sid}
                                            onClick={(e) => { e.stopPropagation(); handleTaskSkillClick(sid); }}
                                            className="inline-flex items-center gap-0.5 text-[9px] leading-tight px-1.5 py-0.5 rounded-full border transition-all duration-150 hover:scale-105"
                                            style={{
                                              borderColor: meta.color + '30',
                                              backgroundColor: meta.color + '08',
                                              color: meta.color,
                                            }}
                                            data-testid={`task-skill-tag-${task.id}-${sid}`}
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                                            {language === "de" ? sk.name_de : sk.name_en}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100/60">
                                    <span className="text-[10px] text-slate-400">
                                      {language === "de" ? "In deinem Profil:" : "In your profile:"}
                                    </span>
                                    <Switch
                                      checked={active}
                                      onCheckedChange={() => handleToggleTask(task.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="shrink-0 scale-75"
                                      data-testid={`task-toggle-${task.id}`}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {deselectedTasks.size > 0 && !showPersonalized && (
              <div className="px-4 py-2.5 border-t border-border/30 bg-slate-50/50">
                <Button size="sm" variant="default" className="w-full gap-1 text-xs" onClick={() => setShowPersonalized(true)}
                  data-testid="calculate-personal-btn">
                  <Sparkles className="w-3 h-3" />
                  {language === "de" ? "Mein Profil berechnen" : "Calculate my profile"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="animate-in fade-in duration-200" data-testid="tab-skills-content">
          {activeSkill && activeSkillInfo && activeSkillMeta && (
            <div
              className="rounded-2xl border-2 p-3 mb-4 animate-in fade-in slide-in-from-top-4 duration-300"
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
              style={{ maxHeight: 'calc(100vh - 360px)', minHeight: 300 }}>
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
      )}

      {activeTab === "tools" && (
        <div className="animate-in fade-in duration-200 space-y-4" data-testid="tab-tools-content">
          <PeerUsage sector={occupation.sector} language={language} />
          <AIToolsMap tasks={allTasks} language={language} occupationKey={occupationKey} />
        </div>
      )}
    </div>
  );
}
