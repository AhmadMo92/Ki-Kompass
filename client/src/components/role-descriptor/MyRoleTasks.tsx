import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { OccupationSearch } from "./OccupationSearch";
import { OccupationDashboard } from "./OccupationDashboard";
import {
  occupations, getOccupation,
  CATEGORIES, CATEGORY_ORDER, CategoryLabel, TaskItem, searchTasks
} from "@/lib/data";
import {
  Sparkles, ArrowRight, ArrowLeft, Languages, Building2,
  Check, Plus, X, Search, CheckCircle2
} from "lucide-react";

export function MyRoleTasks() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [deselectedIds, setDeselectedIds] = useState<Set<string>>(new Set());
  const [customTasks, setCustomTasks] = useState<TaskItem[]>([]);
  const [addQuery, setAddQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);

  const occupation = useMemo(() => selectedKey ? getOccupation(selectedKey) : undefined, [selectedKey]);

  const suggestions = useMemo(() => {
    if (addQuery.length < 2) return [];
    return searchTasks(addQuery, 8).filter(t => {
      const isAlreadyIn = occupation?.tasks.some(ot => ot.id === t.id);
      const isCustom = customTasks.some(ct => ct.text_en === t.text_en);
      return !isAlreadyIn && !isCustom;
    });
  }, [addQuery, occupation, customTasks]);

  const handleAnalyze = () => {
    if (occupation) setStep(2);
  };

  const handleContinue = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedKey("");
    setDeselectedIds(new Set());
    setCustomTasks([]);
  };

  const handleBackToTasks = () => {
    setStep(2);
  };

  const toggleTask = useCallback((taskId: string) => {
    setDeselectedIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  }, []);

  const selectAllInCategory = useCallback((cat: CategoryLabel) => {
    if (!occupation) return;
    const catTaskIds = occupation.tasks.filter(t => t.label === cat).map(t => t.id);
    setDeselectedIds(prev => {
      const next = new Set(prev);
      catTaskIds.forEach(id => next.delete(id));
      return next;
    });
  }, [occupation]);

  const deselectAllInCategory = useCallback((cat: CategoryLabel) => {
    if (!occupation) return;
    const catTaskIds = occupation.tasks.filter(t => t.label === cat).map(t => t.id);
    setDeselectedIds(prev => {
      const next = new Set(prev);
      catTaskIds.forEach(id => next.add(id));
      return next;
    });
  }, [occupation]);

  const addSuggestionAsCustom = useCallback((task: TaskItem & { occupationKey: string }) => {
    const custom: TaskItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text_en: task.text_en,
      text_de: task.text_de,
      label: task.label,
      score: task.score,
      skills: task.skills || [],
    };
    setCustomTasks(prev => [...prev, custom]);
    setAddQuery("");
    setShowSuggestions(false);
  }, []);

  const addFreeText = useCallback(() => {
    const text = addQuery.trim();
    if (!text) return;
    const custom: TaskItem = {
      id: `custom-${Date.now()}`,
      text_en: text,
      text_de: text,
      label: "ai_assisted",
      score: 0.5,
      skills: [],
    };
    setCustomTasks(prev => [...prev, custom]);
    setAddQuery("");
    setShowSuggestions(false);
  }, [addQuery]);

  const removeCustomTask = useCallback((taskId: string) => {
    setCustomTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const allTasks = useMemo(() => {
    if (!occupation) return [];
    return [...occupation.tasks, ...customTasks];
  }, [occupation, customTasks]);

  const selectedCount = allTasks.filter(t => !deselectedIds.has(t.id)).length;

  const occCount = Object.keys(occupations).length;

  const stepLabels = language === "de"
    ? ["Beruf wählen", "Aufgaben prüfen", "Analyse ansehen"]
    : ["Select Role", "Review Tasks", "View Analysis"];

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16" data-testid="my-role-tasks-section">
      <div className="container mx-auto px-6 max-w-[1400px]">

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
              ? `${occCount} deutsche Berufe, 6.079 Aufgaben — auf Aufgabenebene analysiert.`
              : `${occCount} German occupations, 6,079 tasks — analyzed at task level.`}
          </p>

          {step < 3 && (
            <div className="flex items-center justify-center gap-3 mt-6 text-sm font-medium">
              {stepLabels.map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isDone = step > stepNum;
                return (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <div className="w-8 h-px bg-border" />}
                    <div className={`flex items-center gap-2 ${isActive ? 'text-primary' : isDone ? 'text-primary/60' : 'text-muted-foreground'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                        isDone ? 'bg-primary text-white border-primary' :
                        isActive ? 'bg-primary text-primary-foreground border-primary' :
                        'border-border'
                      }`}>
                        {isDone ? <Check className="w-3 h-3" /> : stepNum}
                      </div>
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto">
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
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 animate-in fade-in duration-300" data-testid="selected-job-preview">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg text-primary">
                          {language === "de" ? occupation.occupation_de : selectedKey}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" /> {occupation.sector}
                          <span className="ml-2">{occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}</span>
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
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
                    {language === "de" ? "Weiter" : "Continue"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && occupation && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="step-2-tasks">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif flex items-center gap-2">
                      {language === "de" ? occupation.occupation_de : selectedKey}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {language === "de"
                        ? "Welche dieser Aufgaben gehören zu Ihrem Alltag? Entfernen Sie, was nicht passt, und fügen Sie fehlende hinzu."
                        : "Which of these tasks are part of your daily work? Remove what doesn't fit and add what's missing."}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{selectedCount}</span>
                    <span className="text-muted-foreground">/ {allTasks.length}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative" data-testid="add-task-typeahead">
                  <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      ref={addInputRef}
                      type="text"
                      value={addQuery}
                      onChange={(e) => { setAddQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && addQuery.trim()) {
                          if (suggestions.length > 0) addSuggestionAsCustom(suggestions[0]);
                          else addFreeText();
                        }
                        if (e.key === "Escape") { setShowSuggestions(false); setAddQuery(""); }
                      }}
                      placeholder={language === "de"
                        ? "Aufgabe hinzufügen — tippen oder aus Vorschlägen wählen..."
                        : "Add a task — type or choose from suggestions..."}
                      className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400"
                      data-testid="add-task-search-input"
                    />
                    {addQuery && (
                      <button onClick={() => { setAddQuery(""); setShowSuggestions(false); }}
                        className="p-1 rounded-full hover:bg-slate-100">
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    )}
                  </div>

                  {showSuggestions && addQuery.length >= 2 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150"
                      data-testid="task-suggestions-dropdown">
                      {suggestions.length > 0 ? (
                        <>
                          <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-semibold bg-slate-50 border-b">
                            {language === "de" ? "Vorschläge aus anderen Berufen" : "Suggestions from other roles"}
                          </div>
                          {suggestions.map(s => (
                            <button
                              key={s.id + s.occupationKey}
                              onClick={() => addSuggestionAsCustom(s)}
                              className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors flex items-start gap-2"
                              data-testid={`suggestion-${s.id}`}
                            >
                              <Plus className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-700">
                                  {language === "de" ? s.text_de : s.text_en}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORIES[s.label].color }} />
                                  {language === "de" ? s.occupationDe : s.occupationKey}
                                </div>
                              </div>
                            </button>
                          ))}
                        </>
                      ) : null}
                      <button
                        onClick={addFreeText}
                        className="w-full text-left px-3 py-2.5 hover:bg-primary/5 text-primary text-xs font-medium flex items-center gap-2 border-t border-slate-100"
                        data-testid="add-custom-freetext"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {language === "de" ? `"${addQuery}" als eigene Aufgabe hinzufügen` : `Add "${addQuery}" as custom task`}
                      </button>
                    </div>
                  )}
                </div>

                {customTasks.length > 0 && (
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50/30 p-3" data-testid="custom-tasks-section">
                    <div className="text-[10px] text-indigo-500 uppercase tracking-wider font-semibold mb-2">
                      {language === "de" ? "Hinzugefügte Aufgaben" : "Added tasks"}
                    </div>
                    <div className="space-y-1">
                      {customTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORIES[task.label].color }} />
                          <span className="text-xs text-slate-700 flex-1">
                            {language === "de" ? task.text_de : task.text_en}
                          </span>
                          <button onClick={() => removeCustomTask(task.id)}
                            className="p-1 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            data-testid={`remove-custom-${task.id}`}>
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="overflow-y-auto rounded-xl border border-border" style={{ maxHeight: 'calc(100vh - 500px)', minHeight: 300 }}
                  onClick={() => setShowSuggestions(false)}>
                  {CATEGORY_ORDER.map(cat => {
                    const catTasks = occupation.tasks.filter(t => t.label === cat);
                    if (catTasks.length === 0) return null;
                    const catConfig = CATEGORIES[cat];
                    const selectedInCat = catTasks.filter(t => !deselectedIds.has(t.id)).length;
                    const allSelected = selectedInCat === catTasks.length;

                    return (
                      <div key={cat}>
                        <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b border-slate-100"
                          style={{ backgroundColor: catConfig.bg, color: catConfig.color }}>
                          <span>{catConfig.emoji}</span>
                          <span className="flex-1">
                            {language === "de" ? catConfig.label_de : catConfig.label_en}
                          </span>
                          <span className="opacity-60 font-normal tabular-nums text-[11px]">
                            {selectedInCat}/{catTasks.length}
                          </span>
                          <button
                            onClick={() => allSelected ? deselectAllInCategory(cat) : selectAllInCategory(cat)}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors hover:opacity-80"
                            style={{ borderColor: catConfig.color + '40', color: catConfig.color }}
                            data-testid={`toggle-all-${cat}`}
                          >
                            {allSelected
                              ? (language === "de" ? "Keine" : "None")
                              : (language === "de" ? "Alle" : "All")}
                          </button>
                        </div>
                        {catTasks.map(task => {
                          const checked = !deselectedIds.has(task.id);
                          return (
                            <label
                              key={task.id}
                              className={`flex items-start gap-3 px-4 py-2 border-b border-slate-50 cursor-pointer hover:bg-slate-50/50 transition-colors ${
                                !checked ? 'opacity-20' : task.confirmed && !task.id.startsWith('custom-') ? 'opacity-40' : ''
                              }`}
                              data-testid={`task-check-${task.id}`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-0.5 shrink-0"
                              />
                              <span className={`text-xs leading-relaxed flex-1 ${checked ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                                {language === "de" ? task.text_de : task.text_en}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={() => { setStep(1); setDeselectedIds(new Set()); setCustomTasks([]); }}
                    className="gap-1.5" data-testid="back-to-search">
                    <ArrowLeft className="w-4 h-4" />
                    {language === "de" ? "Zurück" : "Back"}
                  </Button>
                  <Button size="lg" onClick={handleContinue} disabled={isAnalyzing} className="px-8 gap-2" data-testid="continue-to-analysis">
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {language === "de" ? "Analysiere..." : "Analyzing..."}
                      </>
                    ) : (
                      <>
                        {language === "de"
                          ? `Mit ${selectedCount} Aufgaben analysieren`
                          : `Analyze ${selectedCount} tasks`}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isAnalyzing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" data-testid="analyzing-overlay">
                <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      {language === "de" ? "Analyse läuft..." : "Analyzing your role..."}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === "de"
                        ? `${selectedCount} Aufgaben werden ausgewertet`
                        : `Processing ${selectedCount} tasks`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && occupation && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700" data-testid="step-3-analysis">
            <OccupationDashboard
              occupationKey={selectedKey}
              occupation={occupation}
              language={language}
              onReset={handleReset}
              initialDeselected={deselectedIds}
              initialCustomTasks={customTasks}
              onBackToTasks={handleBackToTasks}
            />
            <p className="text-center text-xs text-muted-foreground mt-6">
              {language === "de"
                ? "Daten basierend auf BERUFENET der Bundesagentur für Arbeit. 5-Kategorien Scoring v1.3."
                : "Data based on BERUFENET from German Federal Employment Agency. 5-category scoring v1.3."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
