import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TaskBreakdownChart } from "./TaskBreakdownChart";
import { Combobox } from "@/components/ui/combobox";
import { occupations, competencies } from "@/lib/occupations";
import { 
  analyzeTaskProfile, 
  getTasksForRole,
  TaskDefinition, 
  ImpactResult 
} from "@/utils/taskImpactLogic";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Brain, 
  Users, 
  ArrowUpRight, 
  RotateCcw,
  Languages
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function MyRoleTasks() {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Data State
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [roleContext, setRoleContext] = useState<string>("Current role");
  
  const [activeTasks, setActiveTasks] = useState<TaskDefinition[]>([]);
  const [customTask, setCustomTask] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [result, setResult] = useState<ImpactResult | null>(null);

  // Language State
  const [language, setLanguage] = useState<"en" | "de">("en");

  // Suggestion Logic
  const taskSuggestions = useMemo(() => {
    if (!customTask || customTask.length < 2) return [];
    const lower = customTask.toLowerCase();
    // Filter top 10 matches from competencies
    return competencies
      .filter(c => (language === 'en' ? c.nameEn : c.nameDe).toLowerCase().includes(lower))
      .slice(0, 8)
      .map(c => ({
        id: c.id,
        label: language === 'en' ? c.nameEn : c.nameDe
      }));
  }, [customTask, language]);

  // Derived Data
  const groups = useMemo(() => Array.from(new Set(occupations.map(o => o.group))), []);
  
  const filteredRoles = useMemo(() => {
    return occupations.filter(o => !selectedGroup || o.group === selectedGroup);
  }, [selectedGroup]);

  // Handlers
  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    setSelectedRoleId(""); // Reset role when group changes
  };

  // Better approach for Step 2: Keep all potential tasks and a set of checked IDs
  const [checkedTaskIds, setCheckedTaskIds] = useState<Set<string>>(new Set());

  // When entering Step 2, initialize checked IDs
  const initializeStep2 = () => {
    if (selectedRoleId) {
      const role = occupations.find(o => o.id === selectedRoleId);
      if (role) {
        // Use new dynamic task generation logic
        const tasks = getTasksForRole(role.id, role.group);
        
        // Localize tasks based on current language selection
        const localizedTasks = tasks.map(t => ({
           ...t,
           label: language === 'en' ? (t.labelEn || t.label) : (t.labelDe || t.label)
        }));
        
        setActiveTasks(localizedTasks);
        setCheckedTaskIds(new Set(localizedTasks.map(t => t.id)));
        setStep(2);
      }
    }
  };

  const handleToggleTask = (taskId: string) => {
    const newChecked = new Set(checkedTaskIds);
    if (newChecked.has(taskId)) {
      newChecked.delete(taskId);
    } else {
      newChecked.add(taskId);
    }
    setCheckedTaskIds(newChecked);
  };

  const handleAnalyze = () => {
    // Filter active tasks based on checked IDs
    const tasksToAnalyze = activeTasks.filter(t => checkedTaskIds.has(t.id));
    
    // Add custom task if present
    if (customTask.trim()) {
      tasksToAnalyze.push({
        id: "custom",
        label: customTask,
        category: "Specific", 
        defaultWeight: 0.2
      });
    }

    const analysis = analyzeTaskProfile(tasksToAnalyze);
    setResult(analysis);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedRoleId("");
    setSelectedGroup("");
    setRoleContext("Current role");
    setResult(null);
    setCustomTask("");
  };

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              New Feature
            </div>
            
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${language === 'de' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DE</span>
                <Switch 
                  checked={language === 'en'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'de')}
                />
                <span className={`text-sm ${language === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>EN</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif text-primary mb-3">
            {language === 'en' ? "My Role & Tasks" : "Meine Rolle & Aufgaben"}
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            {language === 'en' 
              ? "Understand how AI typically interacts with the tasks you do." 
              : "Verstehen Sie, wie KI typischerweise mit Ihren Aufgaben interagiert."}
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>1</div>
              {language === 'en' ? "Role" : "Rolle"}
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>2</div>
              {language === 'en' ? "Tasks" : "Aufgaben"}
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>3</div>
              {language === 'en' ? "Results" : "Ergebnisse"}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === 'en' ? "Select your role" : "Wählen Sie Ihre Rolle"}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? "Start by choosing a profession group, then find your specific role." 
                    : "Wählen Sie zunächst eine Berufsgruppe und dann Ihre spezifische Rolle."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* 1. Group Selection */}
                  <div className="space-y-2">
                    <Label>{language === 'en' ? "Profession Group" : "Berufsgruppe"}</Label>
                    <Select value={selectedGroup} onValueChange={handleGroupChange}>
                      <SelectTrigger className="h-11 bg-white">
                        <SelectValue placeholder={language === 'en' ? "Select a group..." : "Gruppe wählen..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map(g => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Role Selection (Filtered) */}
                  <div className="space-y-2">
                    <Label>{language === 'en' ? "Specific Role" : "Spezifische Rolle"}</Label>
                    <Combobox 
                      items={filteredRoles.map(r => ({ 
                        value: r.id, 
                        label: language === 'en' ? r.nameEn : r.nameDe 
                      }))}
                      value={selectedRoleId}
                      onValueChange={setSelectedRoleId}
                      placeholder={selectedGroup ? (language === 'en' ? "Search role..." : "Rolle suchen...") : (language === 'en' ? "Select a group first" : "Erst Gruppe wählen")}
                      searchPlaceholder={language === 'en' ? "Type to search..." : "Suchen..."}
                      emptyText={language === 'en' ? "No roles found" : "Keine Rollen gefunden"}
                      width="w-full"
                      className="h-11 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'en' ? "Context" : "Kontext"}</Label>
                  <RadioGroup value={roleContext} onValueChange={setRoleContext} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Current role" id="ctx1" />
                      <Label htmlFor="ctx1" className="font-normal cursor-pointer">
                        {language === 'en' ? "Current role" : "Aktuelle Rolle"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Previous role" id="ctx2" />
                      <Label htmlFor="ctx2" className="font-normal cursor-pointer">
                        {language === 'en' ? "Previous role" : "Frühere Rolle"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={initializeStep2}
                    disabled={!selectedRoleId}
                    className="w-full md:w-auto px-8"
                  >
                    {language === 'en' ? "Continue" : "Weiter"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: TASK CONFIRMATION */}
          {step === 2 && (
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === 'en' ? "Confirm your typical tasks" : "Bestätigen Sie Ihre typischen Aufgaben"}
                </CardTitle>
                <CardDescription>
                  {language === 'en' 
                    ? "Based on the role profile, select the tasks that match your actual daily work." 
                    : "Wählen Sie basierend auf dem Rollenprofil die Aufgaben aus, die Ihrer täglichen Arbeit entsprechen."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary/20 rounded-lg p-1 border border-border/40">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-1 p-2">
                      {activeTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`flex items-start space-x-3 p-3 rounded-md transition-colors ${checkedTaskIds.has(task.id) ? "bg-white shadow-sm" : "opacity-60 hover:opacity-80"}`}
                        >
                          <Checkbox 
                            id={task.id} 
                            checked={checkedTaskIds.has(task.id)}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label 
                              htmlFor={task.id} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {task.label}
                            </Label>
                            <span className="text-xs text-muted-foreground">{task.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-2 relative">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {language === 'en' ? "Add a custom task (Optional)" : "Eigene Aufgabe hinzufügen (Optional)"}
                  </Label>
                  <Input 
                    placeholder={language === 'en' ? "Type to search tasks..." : "Tippen Sie, um Aufgaben zu suchen..."}
                    value={customTask}
                    onChange={(e) => {
                      setCustomTask(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="bg-white"
                  />
                  {/* Smart Suggestions Dropdown */}
                  {showSuggestions && taskSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-popover text-popover-foreground border rounded-md shadow-md mt-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1">
                        {taskSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              setCustomTask(suggestion.label);
                              setShowSuggestions(false);
                            }}
                          >
                            <Sparkles className="w-3 h-3 mr-2 text-primary/50" />
                            {suggestion.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Backdrop to close suggestions */}
                  {showSuggestions && (
                    <div className="fixed inset-0 z-0" onClick={() => setShowSuggestions(false)} style={{ display: taskSuggestions.length > 0 ? 'block' : 'none', pointerEvents: taskSuggestions.length > 0 ? 'auto' : 'none', background: 'transparent' }} />
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    {language === 'en' ? "Back" : "Zurück"}
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={handleAnalyze}
                    disabled={checkedTaskIds.size === 0}
                    className="px-8"
                  >
                    {language === 'en' ? "Analyze Tasks" : "Aufgaben analysieren"} <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-center text-xs text-muted-foreground italic">
                  {language === 'en' 
                    ? "\"You don’t need to be exact. This is about patterns, not precision.\"" 
                    : "\"Es muss nicht exakt sein. Es geht um Muster, nicht um Präzision.\""}
                </p>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: RESULTS */}
          {step === 3 && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="grid md:grid-cols-12 gap-6">
                {/* Panel 1: Chart */}
                <div className="md:col-span-5">
                   <TaskBreakdownChart data={result.breakdown} />
                </div>

                {/* Panel 2: List */}
                <Card className="md:col-span-7 h-full border-none shadow-sm bg-white/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif text-primary">
                      {language === 'en' ? "Task Category Breakdown" : "Aufgabenverteilung nach Kategorie"}
                    </CardTitle>
                    <CardDescription>
                      {language === 'en' 
                        ? "Typical AI interaction for your confirmed tasks." 
                        : "Typische KI-Interaktion für Ihre bestätigten Aufgaben."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-3">
                        {result.taskDetails.map((detail, idx) => (
                          <div key={idx} className="flex items-start justify-between text-sm p-2 rounded hover:bg-secondary/30 transition-colors">
                            <div className="space-y-0.5">
                              <span className="font-medium block">{detail.category}</span>
                              <span className="text-xs text-muted-foreground block max-w-[200px] truncate" title={detail.taskLabel}>
                                Ex: {detail.taskLabel}
                              </span>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1 bg-white">
                                {detail.interactionType}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Panel 3: Interpretation */}
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-primary">
                    {language === 'en' ? "What this means — and what it doesn’t" : "Was das bedeutet – und was nicht"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {language === 'en' ? "The Pattern" : "Das Muster"}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          {language === 'en' ? "AI supports " : "KI unterstützt "}
                          <strong>{result.breakdown.augmented}%</strong>
                          {language === 'en' ? " of these tasks, likely increasing speed and quality." : " dieser Aufgaben, was wahrscheinlich Geschwindigkeit und Qualität erhöht."}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          <strong>{result.breakdown.automated}%</strong>
                          {language === 'en' 
                            ? " of routine coordination could be automated, freeing up focus time." 
                            : " der Routinekoordination könnten automatisiert werden, was Fokuszeit freisetzt."}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>
                          {language === 'en' ? "Human responsibility remains dominant in " : "Menschliche Verantwortung bleibt dominant in "}
                          <strong>{result.breakdown.human}%</strong>
                          {language === 'en' ? " of the work, especially in judgment and empathy." : " der Arbeit, besonders bei Urteilsvermögen und Empathie."}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {language === 'en' ? "The Reality" : "Die Realität"}
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2 items-start">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>
                          {language === 'en' 
                            ? "This is not a job loss prediction or employability score." 
                            : "Dies ist keine Vorhersage über Jobverlust oder Beschäftigungsfähigkeit."}
                        </span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>
                          {language === 'en' 
                            ? "Augmentation usually changes HOW work is done, not WHETHER the role exists." 
                            : "Augmentierung verändert meist, WIE Arbeit erledigt wird, nicht OB die Rolle existiert."}
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={handleReset} className="text-muted-foreground">
                  <RotateCcw className="mr-2 w-4 h-4" /> 
                  {language === 'en' ? "Start Over" : "Neu starten"}
                </Button>
                <Button variant="link" className="text-primary gap-2">
                  {language === 'en' ? "Compare with typical roles in dashboard above" : "Mit typischen Rollen im Dashboard vergleichen"} <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
