import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DonutChart } from "./DonutChart";
import { TaskList } from "./TaskList";
import { SectorComparison } from "./SectorComparison";
import { InsightCards } from "./InsightCards";
import { PersonalizedResults } from "./PersonalizedResults";
import { OccupationSearch } from "./OccupationSearch";
import {
  occupations, getOccupation, calculatePercentages, calculateFromTasks,
  CATEGORIES, CATEGORY_ORDER, CategoryLabel, searchTasks, TaskItem
} from "@/lib/data";
import {
  Sparkles, ArrowRight, RotateCcw, Languages, Building2, Target, Info, Search
} from "lucide-react";

export function MyRoleTasks() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [deselectedTasks, setDeselectedTasks] = useState<Set<string>>(new Set());
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [customTasks, setCustomTasks] = useState<TaskItem[]>([]);
  const [customSearchQuery, setCustomSearchQuery] = useState("");
  const [showCustomDropdown, setShowCustomDropdown] = useState(false);

  const occupation = useMemo(() => selectedKey ? getOccupation(selectedKey) : undefined, [selectedKey]);

  const typicalPercentages = useMemo(() => {
    if (!occupation) return null;
    return calculatePercentages(occupation.summary);
  }, [occupation]);

  const allTasks = useMemo(() => {
    if (!occupation) return [];
    return [...occupation.tasks, ...customTasks];
  }, [occupation, customTasks]);

  const personalPercentages = useMemo(() => {
    const activeTasks = allTasks.filter(t => !deselectedTasks.has(t.id));
    return calculateFromTasks(activeTasks);
  }, [allTasks, deselectedTasks]);

  const activeTaskCount = allTasks.filter(t => !deselectedTasks.has(t.id)).length;

  const handleAnalyze = () => {
    if (occupation) {
      setStep(2);
      setDeselectedTasks(new Set());
      setShowPersonalized(false);
      setCustomTasks([]);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedKey("");
    setDeselectedTasks(new Set());
    setShowPersonalized(false);
    setCustomTasks([]);
  };

  const handleToggleTask = (taskId: string) => {
    setDeselectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  };

  const handleCalculatePersonal = () => {
    setShowPersonalized(true);
  };

  const customSearchResults = useMemo(() => {
    if (customSearchQuery.length < 2) return [];
    const existingIds = new Set(allTasks.map(t => t.id));
    return searchTasks(customSearchQuery, 8).filter(t => !existingIds.has(t.id));
  }, [customSearchQuery, allTasks]);

  const handleAddCustomTask = (task: TaskItem & { occupationKey: string; occupationDe: string }) => {
    if (customTasks.length >= 12) return;
    setCustomTasks(prev => [...prev, { id: task.id, text_de: task.text_de, text_en: task.text_en, label: task.label, score: task.score, is_regulated: task.is_regulated }]);
    setCustomSearchQuery("");
    setShowCustomDropdown(false);
  };

  const occCount = Object.keys(occupations).length;

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16" data-testid="my-role-tasks-section">
      <div className="container mx-auto px-6 max-w-7xl">

        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {language === "de" ? "Forschungsdaten" : "Research Data"}
            </div>

            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${language === 'de' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DE</span>
                <Switch
                  checked={language === 'en'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'de')}
                  data-testid="language-toggle"
                />
                <span className={`text-sm ${language === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>EN</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif text-primary mb-3">
            {language === "de" ? "Meine Rolle analysieren" : "Analyze My Role"}
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            {language === "de"
              ? `${occCount} deutsche Berufe, 5.885 Aufgaben — auf Aufgabenebene analysiert.`
              : `${occCount} German occupations, 5,885 tasks — analyzed at task level.`}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>1</div>
              {language === "de" ? "Beruf wählen" : "Select Role"}
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>2</div>
              {language === "de" ? "Analyse ansehen" : "View Analysis"}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">

          {step === 1 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="step-1-card">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === "de" ? "Finden Sie Ihren Beruf" : "Find your occupation"}
                </CardTitle>
                <CardDescription>
                  {language === "de"
                    ? `Suchen Sie aus ${occCount} deutschen Berufen mit 5-Kategorien KI-Analyse.`
                    : `Search from ${occCount} German occupations with 5-category AI analysis.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <OccupationSearch
                  value={selectedKey}
                  onSelect={setSelectedKey}
                  language={language}
                />

                {occupation && (
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/40 animate-in fade-in duration-300" data-testid="selected-job-preview">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-primary">
                          {language === "de" ? occupation.occupation_de : selectedKey}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" /> {occupation.sector}
                          {occupation.kldb2010 && <span className="text-xs ml-2">KldB: {occupation.kldb2010}</span>}
                        </p>
                      </div>
                      <Badge className="text-xs bg-slate-100 text-slate-600">
                        {occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center">
                      {CATEGORY_ORDER.map(cat => {
                        const count = occupation.summary[cat];
                        const pct = occupation.summary.total > 0 ? Math.round((count / occupation.summary.total) * 100) : 0;
                        if (pct === 0) return (
                          <div key={cat} className="p-2 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg + '80' }}>
                            <div className="text-lg font-bold" style={{ color: CATEGORIES[cat].color }}>—</div>
                            <div className="text-[10px]" style={{ color: CATEGORIES[cat].color }}>
                              {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                            </div>
                          </div>
                        );
                        return (
                          <div key={cat} className="p-2 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg }}>
                            <div className="text-lg font-bold" style={{ color: CATEGORIES[cat].color }}>{pct}%</div>
                            <div className="text-[10px]" style={{ color: CATEGORIES[cat].color }}>
                              {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={!selectedKey}
                    className="w-full md:w-auto px-8"
                    data-testid="analyze-button"
                  >
                    {language === "de" ? "Analyse starten" : "Start Analysis"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && occupation && typicalPercentages && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" data-testid="step-2-analysis">

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-primary">
                    {language === "de" ? occupation.occupation_de : selectedKey}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {occupation.sector}
                    {occupation.kldb2010 && <span className="text-xs">• KldB {occupation.kldb2010}</span>}
                    <span className="text-xs">• {occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}</span>
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset} className="gap-2" data-testid="reset-button">
                  <RotateCcw className="w-4 h-4" />
                  {language === "de" ? "Neue Suche" : "New Search"}
                </Button>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                <Card className="md:col-span-5 border-none shadow-sm bg-white/60 flex items-center justify-center py-6">
                  <DonutChart percentages={typicalPercentages} language={language} />
                </Card>

                <Card className="md:col-span-7 border-none shadow-sm bg-white/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      {language === "de" ? "5-Kategorien Analyse" : "5-Category Analysis"}
                    </CardTitle>
                    <CardDescription>
                      {language === "de"
                        ? "Forschungsbasierte Aufgabenverteilung für diesen Beruf."
                        : "Research-based task distribution for this occupation."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {CATEGORY_ORDER.map(cat => {
                      const pct = typicalPercentages[cat];
                      const count = occupation.summary[cat];
                      if (count === 0) return null;
                      return (
                        <div
                          key={cat}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ backgroundColor: CATEGORIES[cat].bg }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{CATEGORIES[cat].emoji}</span>
                            <div>
                              <div className="font-medium text-sm" style={{ color: CATEGORIES[cat].color }}>
                                {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                              </div>
                              <div className="text-xs text-slate-500">
                                {language === "de" ? CATEGORIES[cat].message_de : CATEGORIES[cat].message_en}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold" style={{ color: CATEGORIES[cat].color }}>
                              {pct.toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-400">{count} {language === "de" ? "Aufg." : "tasks"}</div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <InsightCards
                percentages={typicalPercentages}
                sensitiveCount={occupation.summary.sensitive}
                language={language}
              />

              <Card className="border-none shadow-sm bg-white/60" data-testid="task-section">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {language === "de" ? "Aufgaben im Detail" : "Tasks in Detail"}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {deselectedTasks.size > 0 && !showPersonalized && (
                        <Button size="sm" onClick={handleCalculatePersonal} data-testid="calculate-personal-btn">
                          {language === "de" ? "Mein Profil berechnen" : "Calculate My Profile"}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {language === "de"
                      ? "Schalte Aufgaben aus, die du nicht machst, um dein persönliches Profil zu berechnen."
                      : "Toggle off tasks you don't do to calculate your personal profile."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder={language === "de" ? "Aufgaben aus anderen Berufen hinzufügen..." : "Add tasks from other occupations..."}
                        value={customSearchQuery}
                        onChange={e => { setCustomSearchQuery(e.target.value); setShowCustomDropdown(true); }}
                        onFocus={() => setShowCustomDropdown(true)}
                        className="w-full pl-10 pr-4 h-10 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-testid="custom-task-search"
                      />
                    </div>
                    {showCustomDropdown && customSearchResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {customSearchResults.map(task => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 p-2.5 hover:bg-slate-50 cursor-pointer border-b last:border-b-0 text-sm"
                            onClick={() => handleAddCustomTask(task)}
                          >
                            <span className="text-primary font-bold">+</span>
                            <span className="flex-1 truncate">{language === "de" ? task.text_de : task.text_en}</span>
                            <span className="text-xs text-slate-400 truncate max-w-24">{task.occupationDe}</span>
                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CATEGORIES[task.label].color }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {customTasks.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {customTasks.map(task => (
                        <span
                          key={task.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: CATEGORIES[task.label].bg, color: CATEGORIES[task.label].color }}
                        >
                          {language === "de" ? task.text_de : task.text_en}
                          <button
                            onClick={() => setCustomTasks(prev => prev.filter(t => t.id !== task.id))}
                            className="hover:bg-black/10 rounded-full p-0.5 ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <TaskList
                    tasks={allTasks}
                    deselectedTasks={deselectedTasks}
                    onToggleTask={handleToggleTask}
                    language={language}
                  />
                </CardContent>
              </Card>

              {showPersonalized && typicalPercentages && (
                <PersonalizedResults
                  personal={personalPercentages}
                  typical={typicalPercentages}
                  taskCount={{ selected: activeTaskCount, total: allTasks.length }}
                  language={language}
                  onReset={() => setShowPersonalized(false)}
                />
              )}

              <SectorComparison
                occupationPercentages={showPersonalized ? personalPercentages : typicalPercentages}
                sector={occupation.sector}
                occupationName={language === "de" ? occupation.occupation_de : selectedKey}
                language={language}
              />

              <p className="text-center text-xs text-muted-foreground">
                {language === "de"
                  ? "Daten basierend auf BERUFENET der Bundesagentur für Arbeit. 5-Kategorien Scoring v1.3."
                  : "Data based on BERUFENET from German Federal Employment Agency. 5-category scoring v1.3."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
