import { useState, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  CATEGORIES, CATEGORY_ORDER, SKILL_CATEGORY_META,
  CategoryLabel, TaskItem, skills, getOccupationSkillProfile
} from "@/lib/data";
import { Brain, Target, ChevronDown, ChevronUp, X, Zap } from "lucide-react";

interface SkillTaskExplorerProps {
  tasks: TaskItem[];
  occupationKey: string;
  deselectedTasks: Set<string>;
  onToggleTask: (taskId: string) => void;
  language: "en" | "de";
}

export function SkillTaskExplorer({
  tasks, occupationKey, deselectedTasks, onToggleTask, language
}: SkillTaskExplorerProps) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<CategoryLabel>>(new Set());
  const [showAllSkills, setShowAllSkills] = useState(false);
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const skillBarRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const profile = useMemo(() => getOccupationSkillProfile(occupationKey), [occupationKey]);

  const taskSkillMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const t of tasks) {
      map[t.id] = t.skills || [];
    }
    return map;
  }, [tasks]);

  const skillTaskMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const t of tasks) {
      for (const sid of (t.skills || [])) {
        if (!map[sid]) map[sid] = new Set();
        map[sid].add(t.id);
      }
    }
    return map;
  }, [tasks]);

  const highlightSkill = activeSkill || hoveredSkill;
  const matchedTaskIds = useMemo(() => {
    if (!highlightSkill) return null;
    return skillTaskMap[highlightSkill] || new Set();
  }, [highlightSkill, skillTaskMap]);

  const handleSkillClick = useCallback((skillId: string) => {
    if (activeSkill === skillId) {
      setActiveSkill(null);
    } else {
      setActiveSkill(skillId);
      const cats = new Set<CategoryLabel>();
      const taskIds = skillTaskMap[skillId];
      if (taskIds) {
        for (const t of tasks) {
          if (taskIds.has(t.id)) cats.add(t.label);
        }
      }
      setCollapsed(prev => {
        const next = new Set(prev);
        for (const c of cats) next.delete(c);
        return next;
      });
    }
  }, [activeSkill, skillTaskMap, tasks]);

  const handleTaskSkillClick = useCallback((skillId: string) => {
    handleSkillClick(skillId);
    const el = skillBarRefs.current[skillId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [handleSkillClick]);

  const toggleCollapse = (cat: CategoryLabel) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const grouped: Record<CategoryLabel, TaskItem[]> = {
    automatable: [], high_ai_potential: [], sensitive: [], ai_assisted: [], stays_with_you: []
  };
  for (const task of tasks) {
    if (grouped[task.label]) grouped[task.label].push(task);
  }

  const visibleSkills = showAllSkills ? profile : profile.slice(0, 10);
  const maxCount = profile[0]?.count || 1;
  const totalLinks = profile.reduce((sum, s) => sum + s.count, 0);

  const activeSkillInfo = activeSkill ? skills[activeSkill] : null;
  const activeSkillMeta = activeSkillInfo ? SKILL_CATEGORY_META[activeSkillInfo.category] : null;
  const activeMatchCount = activeSkill && matchedTaskIds ? matchedTaskIds.size : 0;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white/60" data-testid="skill-explorer-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {language === "de" ? "Kompetenzprofil" : "Skills Profile"}
          </CardTitle>
          <CardDescription>
            {language === "de"
              ? "Klicke auf eine Kompetenz, um die zugehörigen Aufgaben zu sehen."
              : "Click a skill to see its linked tasks highlighted below."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSkill && activeSkillInfo && activeSkillMeta && (
            <div
              className="p-3 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ borderColor: activeSkillMeta.color + '60', backgroundColor: activeSkillMeta.color + '08' }}
              data-testid="active-skill-banner"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 shrink-0" style={{ color: activeSkillMeta.color }} />
                    <span className="font-semibold text-sm" style={{ color: activeSkillMeta.color }}>
                      {language === "de" ? activeSkillInfo.name_de : activeSkillInfo.name_en}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: activeSkillMeta.color + '20', color: activeSkillMeta.color }}>
                      {language === "de" ? activeSkillMeta.label_de : activeSkillMeta.label_en}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {language === "de" ? activeSkillInfo.definition_de : activeSkillInfo.definition_en}
                  </p>
                  <p className="text-xs font-medium mt-1.5" style={{ color: activeSkillMeta.color }}>
                    {activeMatchCount} {language === "de" ? "verknüpfte Aufgaben" : "linked tasks"}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors shrink-0"
                  data-testid="clear-skill-filter"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5" data-testid="skill-bars">
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
                  className={`w-full text-left group rounded-lg px-3 py-2 transition-all duration-200 ${
                    isActive ? 'bg-white shadow-sm' : isHovered ? 'bg-slate-50' : ''
                  } ${dimmed ? 'opacity-40' : ''}`}
                  style={isActive ? { boxShadow: `0 0 0 2px ${meta.color}` } : undefined}
                  onClick={() => handleSkillClick(s.skillId)}
                  onMouseEnter={() => setHoveredSkill(s.skillId)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  data-testid={`skill-bar-${s.skillId}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
                      style={{
                        backgroundColor: meta.color,
                        transform: isActive || isHovered ? 'scale(1.5)' : 'scale(1)'
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700 min-w-0 truncate flex-1">
                      {language === "de" ? s.skill.name_de : s.skill.name_en}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                      {s.count}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1 ml-[18px]">
                    <div
                      className="h-full rounded-full flex overflow-hidden transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    >
                      {CATEGORY_ORDER.map(cat => {
                        const count = s.byLabel[cat];
                        if (count === 0) return null;
                        const segWidth = (count / s.count) * 100;
                        return (
                          <div
                            key={cat}
                            className="h-full transition-opacity duration-200"
                            style={{
                              width: `${segWidth}%`,
                              backgroundColor: CATEGORIES[cat].color,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {profile.length > 10 && (
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="w-full text-center text-xs text-primary hover:text-primary/80 font-medium py-1.5 transition-colors"
              data-testid="toggle-all-skills"
            >
              {showAllSkills
                ? (language === "de" ? "Weniger anzeigen" : "Show less")
                : (language === "de" ? `+ ${profile.length - 10} weitere Kompetenzen` : `+ ${profile.length - 10} more skills`)}
            </button>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/60" data-testid="task-explorer-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
            <Target className="w-5 h-5" />
            {language === "de" ? "Aufgaben im Detail" : "Tasks in Detail"}
            {activeSkill && (
              <span className="text-xs font-normal text-slate-400 ml-1">
                — {language === "de" ? "gefiltert nach Kompetenz" : "filtered by skill"}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {language === "de"
              ? "Schalte Aufgaben aus, die du nicht machst. Klicke auf Kompetenz-Tags, um Verbindungen zu sehen."
              : "Toggle off tasks you don't do. Click skill tags to explore connections."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" data-testid="task-list">
            {CATEGORY_ORDER.map(cat => {
              const catTasks = grouped[cat];
              if (catTasks.length === 0) return null;
              const catConfig = CATEGORIES[cat];
              const isCollapsed = collapsed.has(cat);
              const selectedCount = catTasks.filter(t => !deselectedTasks.has(t.id)).length;

              const matchedInCat = matchedTaskIds
                ? catTasks.filter(t => matchedTaskIds.has(t.id)).length
                : 0;

              return (
                <div key={cat} className="rounded-xl overflow-hidden border transition-all duration-200"
                  style={{ borderColor: catConfig.color + '30' }}>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:opacity-90"
                    style={{ backgroundColor: catConfig.bg }}
                    onClick={() => toggleCollapse(cat)}
                    data-testid={`task-group-header-${cat}`}
                  >
                    <span className="text-lg">{catConfig.emoji}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-sm" style={{ color: catConfig.color }}>
                        {language === "de" ? catConfig.label_de : catConfig.label_en}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">
                        {selectedCount}/{catTasks.length} {language === "de" ? "aktiv" : "active"}
                      </span>
                      {activeSkill && matchedInCat > 0 && (
                        <span className="text-xs font-medium ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {matchedInCat} {language === "de" ? "verknüpft" : "linked"}
                        </span>
                      )}
                    </div>
                    <span className="text-xs italic text-slate-500 hidden sm:inline max-w-[200px] truncate">
                      {language === "de" ? catConfig.message_de : catConfig.message_en}
                    </span>
                    {isCollapsed
                      ? <ChevronDown className="w-4 h-4 text-slate-400" />
                      : <ChevronUp className="w-4 h-4 text-slate-400" />}
                  </button>

                  {!isCollapsed && (
                    <div className="divide-y divide-slate-100">
                      {catTasks.map(task => {
                        const active = !deselectedTasks.has(task.id);
                        const isMatched = matchedTaskIds ? matchedTaskIds.has(task.id) : false;
                        const isDimmedByFilter = matchedTaskIds && !isMatched;
                        const taskSkills = taskSkillMap[task.id] || [];

                        return (
                          <div
                            key={task.id}
                            ref={el => { taskRefs.current[task.id] = el; }}
                            className={`px-4 py-3 transition-all duration-300 ${
                              !active ? 'opacity-30' :
                              isMatched ? 'bg-primary/[0.03]' :
                              isDimmedByFilter ? 'opacity-30' : ''
                            }`}
                            data-testid={`task-item-${task.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                                style={{ backgroundColor: catConfig.color }} />
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm leading-relaxed ${
                                  active ? 'text-slate-700' : 'text-slate-400 line-through'
                                } ${isMatched ? 'font-medium' : ''}`}>
                                  {language === "de" ? task.text_de : task.text_en}
                                </span>
                                {taskSkills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {taskSkills.map(sid => {
                                      const sk = skills[sid];
                                      if (!sk) return null;
                                      const meta = SKILL_CATEGORY_META[sk.category];
                                      const isSkillActive = activeSkill === sid;
                                      const isSkillHovered = hoveredSkill === sid;
                                      return (
                                        <button
                                          key={sid}
                                          onClick={(e) => { e.stopPropagation(); handleTaskSkillClick(sid); }}
                                          onMouseEnter={() => setHoveredSkill(sid)}
                                          onMouseLeave={() => setHoveredSkill(null)}
                                          className={`inline-flex items-center gap-1 text-[10px] leading-tight px-1.5 py-0.5 rounded-md border transition-all duration-200 cursor-pointer ${
                                            isSkillActive
                                              ? 'shadow-sm scale-105'
                                              : isSkillHovered
                                              ? 'scale-105'
                                              : 'hover:scale-105'
                                          }`}
                                          style={{
                                            borderColor: isSkillActive || isSkillHovered ? meta.color : meta.color + '30',
                                            backgroundColor: isSkillActive ? meta.color + '15' : meta.color + '06',
                                            color: meta.color,
                                            boxShadow: isSkillActive ? `0 0 0 1px ${meta.color}` : undefined,
                                          }}
                                          data-testid={`task-skill-tag-${task.id}-${sid}`}
                                        >
                                          <div className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{ backgroundColor: meta.color }} />
                                          {language === "de" ? sk.name_de : sk.name_en}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                  {active
                                    ? (language === "de" ? "Mache ich" : "I do this")
                                    : (language === "de" ? "Nicht" : "No")}
                                </span>
                                <Switch
                                  checked={active}
                                  onCheckedChange={() => onToggleTask(task.id)}
                                  data-testid={`task-toggle-${task.id}`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
