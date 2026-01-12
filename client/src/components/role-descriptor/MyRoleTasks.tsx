import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TaskBreakdownChart } from "./TaskBreakdownChart";
import { JobCombobox } from "@/components/ui/job-combobox";
import { TaskSelectorModal, TaskPreview } from "./TaskSelectorModal";
import { PersonalizedResults } from "./PersonalizedResults";
import { jobs, sectors, getJobById, CATEGORIES, Job, getTasksForJob, calculatePersonalExposure, Task } from "@/lib/data";
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  Bot,
  Cog,
  RotateCcw,
  Languages,
  TrendingUp,
  Building2,
  Target
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function MyRoleTasks() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [language, setLanguage] = useState<"en" | "de">("en");
  
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [customTasks, setCustomTasks] = useState<Task[]>([]);
  const [personalizedExposure, setPersonalizedExposure] = useState<{ human: number; ai_assisted: number; automation: number } | null>(null);

  const selectedJob = useMemo(() => {
    return selectedJobId ? getJobById(selectedJobId) : undefined;
  }, [selectedJobId]);

  const jobTasks = useMemo(() => {
    return selectedJobId ? getTasksForJob(selectedJobId) : [];
  }, [selectedJobId]);

  const typicalExposure = useMemo(() => {
    if (jobTasks.length === 0) return null;
    return calculatePersonalExposure(jobTasks);
  }, [jobTasks]);

  const sectorData = useMemo(() => {
    if (!selectedJob) return undefined;
    return sectors.find(s => s.sector_name === selectedJob.sector);
  }, [selectedJob]);

  const handleAnalyze = () => {
    if (selectedJob) {
      setStep(2);
      setPersonalizedExposure(null);
      if (jobTasks.length > 0) {
        setSelectedTaskIds(new Set(jobTasks.map(t => t.id)));
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedJobId("");
    setPersonalizedExposure(null);
    setSelectedTaskIds(new Set());
    setCustomTasks([]);
  };

  const handleOpenPersonalize = () => {
    if (jobTasks.length > 0) {
      setSelectedTaskIds(new Set(jobTasks.map(t => t.id)));
    }
    setShowTaskSelector(true);
  };

  const handleConfirmTasks = () => {
    const allTasks = [...jobTasks, ...customTasks];
    const selectedTasks = allTasks.filter(t => selectedTaskIds.has(t.id));
    const exposure = calculatePersonalExposure(selectedTasks);
    setPersonalizedExposure(exposure);
    setShowTaskSelector(false);
  };

  const handleAddCustomTask = (task: Task) => {
    if (customTasks.length >= 12) return;
    if (!customTasks.find(t => t.id === task.id)) {
      setCustomTasks(prev => [...prev, task]);
      setSelectedTaskIds(prev => new Set([...Array.from(prev), task.id]));
    }
  };

  const handleRemoveCustomTask = (taskId: string) => {
    setCustomTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      next.delete(taskId);
      return next;
    });
  };

  const handleResetPersonalization = () => {
    setShowTaskSelector(true);
  };

  const getCategoryStyle = (dominant: string) => {
    const cat = CATEGORIES[dominant as keyof typeof CATEGORIES];
    return cat || CATEGORIES["Mixed"];
  };

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16" data-testid="my-role-tasks-section">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {language === "en" ? "Research Data" : "Forschungsdaten"}
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
            {language === 'en' ? "AI Workforce Intelligence" : "KI-Arbeitskräfte-Intelligenz"}
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            {language === 'en' 
              ? `Research-based AI exposure analysis for ${jobs.length.toLocaleString()} German occupations.` 
              : `Forschungsbasierte KI-Expositionsanalyse für ${jobs.length.toLocaleString()} deutsche Berufe.`}
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-6 text-sm font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>1</div>
              {language === 'en' ? "Select Role" : "Rolle wählen"}
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>2</div>
              {language === 'en' ? "View Analysis" : "Analyse ansehen"}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {step === 1 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="step-1-card">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === 'en' ? "Find your occupation" : "Finden Sie Ihren Beruf"}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? "Search from 2,027 German white-collar occupations with pre-computed AI exposure scores." 
                    : "Suchen Sie aus 2.027 deutschen Berufen mit vorberechneten KI-Expositionswerten."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{language === 'en' ? "Occupation" : "Beruf"}</Label>
                  <JobCombobox 
                    value={selectedJobId}
                    onValueChange={setSelectedJobId}
                    language={language}
                    placeholder={language === 'en' ? "Search occupations..." : "Berufe suchen..."}
                    searchPlaceholder={language === 'en' ? "Type to search (try: UX Designer, CTO, Data Engineer)..." : "Suchen (z.B.: UX Designer, CTO, Data Engineer)..."}
                    emptyText={language === 'en' ? "No occupations found" : "Keine Berufe gefunden"}
                    className="h-11 bg-white"
                  />
                </div>

                {selectedJob && (
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border/40 animate-in fade-in duration-300" data-testid="selected-job-preview">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-primary">
                          {language === 'en' ? selectedJob.en : selectedJob.de}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" />
                          {selectedJob.sector}
                        </p>
                      </div>
                      <Badge 
                        className="text-white"
                        style={{ backgroundColor: getCategoryStyle(selectedJob.dominant).color }}
                      >
                        {selectedJob.dominant}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded bg-green-50 border border-green-200">
                        <Users className="w-4 h-4 mx-auto text-green-600 mb-1" />
                        <div className="text-lg font-bold text-green-700">{selectedJob.human}%</div>
                        <div className="text-xs text-green-600">{language === 'en' ? 'Human' : 'Mensch'}</div>
                      </div>
                      <div className="p-2 rounded bg-blue-50 border border-blue-200">
                        <Bot className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                        <div className="text-lg font-bold text-blue-700">{selectedJob.ai_assisted}%</div>
                        <div className="text-xs text-blue-600">{language === 'en' ? 'AI-Assisted' : 'KI-Assistiert'}</div>
                      </div>
                      <div className="p-2 rounded bg-amber-50 border border-amber-200">
                        <Cog className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                        <div className="text-lg font-bold text-amber-700">{selectedJob.automation}%</div>
                        <div className="text-xs text-amber-600">{language === 'en' ? 'Automation' : 'Automation'}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={handleAnalyze}
                    disabled={!selectedJobId}
                    className="w-full md:w-auto px-8"
                    data-testid="analyze-button"
                  >
                    {language === 'en' ? "View Full Analysis" : "Vollständige Analyse"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && selectedJob && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" data-testid="step-2-analysis">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-primary">
                    {language === 'en' ? selectedJob.en : selectedJob.de}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.sector}
                    <span className="text-border">•</span>
                    <span className="text-xs">ID: {selectedJob.id}</span>
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset} className="gap-2" data-testid="reset-button">
                  <RotateCcw className="w-4 h-4" />
                  {language === 'en' ? "New Search" : "Neue Suche"}
                </Button>
              </div>

              {(() => {
                const displayData = typicalExposure || { human: selectedJob.human, ai_assisted: selectedJob.ai_assisted, automation: selectedJob.automation };
                const getDominant = () => {
                  if (displayData.human >= displayData.ai_assisted && displayData.human >= displayData.automation) return "Human-Centric";
                  if (displayData.ai_assisted >= displayData.human && displayData.ai_assisted >= displayData.automation) return "AI-Assisted";
                  return "Automation";
                };
                return (
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-5">
                      <TaskBreakdownChart data={displayData} />
                    </div>

                    <Card className="md:col-span-7 border-none shadow-sm bg-white/60">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          {language === 'en' ? "AI Exposure Analysis" : "KI-Expositionsanalyse"}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en' 
                            ? `Based on ${jobTasks.length} tasks for this occupation.` 
                            : `Basierend auf ${jobTasks.length} Aufgaben für diesen Beruf.`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="font-medium text-green-800">
                                  {language === 'en' ? 'Human-Centric Tasks' : 'Menschenzentrierte Aufgaben'}
                                </div>
                                <div className="text-xs text-green-600">
                                  {language === 'en' 
                                    ? 'Requiring judgment, empathy, or physical presence' 
                                    : 'Erfordern Urteilsvermögen, Empathie oder physische Präsenz'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-green-700">{displayData.human.toFixed(1)}%</div>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-center gap-3">
                              <Bot className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-medium text-blue-800">
                                  {language === 'en' ? 'AI-Assisted Tasks' : 'KI-Assistierte Aufgaben'}
                                </div>
                                <div className="text-xs text-blue-600">
                                  {language === 'en' 
                                    ? 'Complex work where AI tools enhance productivity' 
                                    : 'Komplexe Arbeit, bei der KI-Tools die Produktivität steigern'}
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-blue-700">{displayData.ai_assisted.toFixed(1)}%</div>
                          </div>

                          {displayData.automation > 0 && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                              <div className="flex items-center gap-3">
                                <Cog className="w-5 h-5 text-amber-600" />
                                <div>
                                  <div className="font-medium text-amber-800">
                                    {language === 'en' ? 'Automation (Agents + Routine)' : 'Automatisierung (Agenten + Routine)'}
                                  </div>
                                  <div className="text-xs text-amber-600">
                                    {language === 'en' 
                                      ? 'Tasks AI agents can handle or routine tasks for automation' 
                                      : 'Aufgaben für KI-Agenten oder Routine-Automatisierung'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-amber-700">{displayData.automation.toFixed(1)}%</div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <Badge 
                            className="text-white text-sm px-3 py-1"
                            style={{ backgroundColor: getCategoryStyle(getDominant()).color }}
                          >
                            {language === 'en' ? 'Primary Category: ' : 'Hauptkategorie: '}{getDominant()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}

              {sectorData && (
                <Card className="border-none shadow-sm bg-white/60" data-testid="sector-comparison">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {language === 'en' ? 'Sector Comparison' : 'Sektorvergleich'}: {selectedJob.sector}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' 
                        ? `How this role compares to ${sectorData.job_count} other occupations in the sector.` 
                        : `Wie diese Rolle im Vergleich zu ${sectorData.job_count} anderen Berufen im Sektor abschneidet.`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">
                          {language === 'en' ? 'Your Role: Human Tasks' : 'Ihre Rolle: Menschliche Aufgaben'}
                        </div>
                        <div className="text-2xl font-bold text-green-600">{selectedJob.human}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {language === 'en' ? 'Sector avg: ' : 'Sektor-Ø: '}{sectorData.avg_human.toFixed(1)}%
                          {selectedJob.human > sectorData.avg_human 
                            ? ` (+${(selectedJob.human - sectorData.avg_human).toFixed(1)}%)` 
                            : ` (${(selectedJob.human - sectorData.avg_human).toFixed(1)}%)`}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/30">
                        <div className="text-sm text-muted-foreground mb-1">
                          {language === 'en' ? 'Your Role: AI-Assisted Tasks' : 'Ihre Rolle: KI-Assistierte Aufgaben'}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{selectedJob.ai_assisted}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {language === 'en' ? 'Sector avg: ' : 'Sektor-Ø: '}{sectorData.avg_ai.toFixed(1)}%
                          {selectedJob.ai_assisted > sectorData.avg_ai 
                            ? ` (+${(selectedJob.ai_assisted - sectorData.avg_ai).toFixed(1)}%)` 
                            : ` (${(selectedJob.ai_assisted - sectorData.avg_ai).toFixed(1)}%)`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {personalizedExposure && typicalExposure ? (
                <PersonalizedResults
                  personal={personalizedExposure}
                  typical={typicalExposure}
                  taskCount={{ selected: selectedTaskIds.size, total: jobTasks.length + customTasks.length }}
                  language={language}
                  onReset={handleResetPersonalization}
                />
              ) : jobTasks.length > 0 ? (
                <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50" data-testid="personalize-section">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-lg">
                          {language === 'en' ? 'Personalize Your Analysis' : 'Personalisieren Sie Ihre Analyse'}
                        </CardTitle>
                        <CardDescription>
                          {language === 'en' 
                            ? 'Uncheck tasks you don\'t do to see YOUR specific AI exposure' 
                            : 'Deaktivieren Sie Aufgaben, die Sie nicht ausführen'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TaskPreview
                      tasks={jobTasks}
                      selectedTaskIds={selectedTaskIds}
                      customTasks={customTasks}
                      onToggleTask={(taskId) => {
                        const newSelection = new Set(selectedTaskIds);
                        if (newSelection.has(taskId)) {
                          newSelection.delete(taskId);
                        } else {
                          newSelection.add(taskId);
                        }
                        setSelectedTaskIds(newSelection);
                      }}
                      onAddCustomTask={handleAddCustomTask}
                      onRemoveCustomTask={handleRemoveCustomTask}
                      onOpenFull={handleOpenPersonalize}
                      language={language}
                    />
                    
                    <div className="flex justify-end pt-2 border-t">
                      <Button onClick={handleConfirmTasks} disabled={selectedTaskIds.size === 0}>
                        {language === 'en' ? 'Calculate My Exposure' : 'Meine Exposition berechnen'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <TaskSelectorModal
                open={showTaskSelector}
                onOpenChange={setShowTaskSelector}
                tasks={jobTasks}
                selectedTaskIds={selectedTaskIds}
                onSelectionChange={setSelectedTaskIds}
                onConfirm={handleConfirmTasks}
                language={language}
              />

              <p className="text-center text-xs text-muted-foreground">
                {language === 'en' 
                  ? "Data based on German Federal Employment Agency (BA) KldB 2010 classification and O*NET skill requirements." 
                  : "Daten basierend auf der KldB 2010 Klassifikation der Bundesagentur für Arbeit und O*NET Kompetenzanforderungen."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
