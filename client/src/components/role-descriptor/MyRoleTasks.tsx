import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TaskBreakdownChart } from "./TaskBreakdownChart"; // Reusing existing chart
import { 
  ROLE_PROFILES, 
  AVAILABLE_ROLES, 
  analyzeTaskProfile, 
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
  Search,
  RotateCcw
} from "lucide-react";

export function MyRoleTasks() {
  // Step State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Data State
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedSector, setSelectedSector] = useState<string>("");
  const [roleContext, setRoleContext] = useState<string>("Current role");
  
  const [activeTasks, setActiveTasks] = useState<TaskDefinition[]>([]);
  const [customTask, setCustomTask] = useState<string>("");

  const [result, setResult] = useState<ImpactResult | null>(null);

  // Handlers
  const handleRoleSelect = () => {
    if (selectedRoleId && ROLE_PROFILES[selectedRoleId]) {
      setActiveTasks([...ROLE_PROFILES[selectedRoleId].defaultTasks]);
      setStep(2);
    }
  };

  const toggleTask = (taskId: string) => {
    // Only toggle if it's already in the list (don't remove, just filter for analysis later? 
    // Actually, UI shows checkboxes. If unchecked, we remove from "activeTasks" logic, 
    // but we need to keep the original list to show them as unchecked.
    // Let's simplify: activeTasks IS the list of checked tasks.
    // Wait, better to keep all tasks and have a "checked" state.
    // For simplicity in this mock, let's just use a list of IDs for checked items.
  };
  
  // Better approach for Step 2: Keep all potential tasks and a set of checked IDs
  const [checkedTaskIds, setCheckedTaskIds] = useState<Set<string>>(new Set());

  // When entering Step 2, initialize checked IDs
  const initializeStep2 = () => {
    if (selectedRoleId && ROLE_PROFILES[selectedRoleId]) {
      const tasks = ROLE_PROFILES[selectedRoleId].defaultTasks;
      setActiveTasks(tasks);
      setCheckedTaskIds(new Set(tasks.map(t => t.id)));
      setStep(2);
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
    
    // Add custom task if present (mock category)
    if (customTask.trim()) {
      tasksToAnalyze.push({
        id: "custom",
        label: customTask,
        category: "Planning", // Default mock category for custom input
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
    setSelectedSector("");
    setRoleContext("Current role");
    setResult(null);
    setCustomTask("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Augmented": return <Bot className="w-4 h-4 text-blue-500" />;
      case "Automated": return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
      case "Human-Dominant": return <Users className="w-4 h-4 text-teal-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            New Feature
          </div>
          <h2 className="text-3xl font-serif text-primary mb-3">My Role & Tasks</h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            Understand how AI typically interacts with the tasks you do.
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>1</div>
              Role
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>2</div>
              Tasks
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>3</div>
              Results
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="font-serif">Select a role similar to yours</CardTitle>
                <CardDescription>Start by choosing a standard role profile. We'll customize it in the next step.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Role Title</Label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Search or select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_ROLES.map(role => (
                          <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select sector..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["Health", "IT", "Administration", "Logistics", "Education"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Context</Label>
                  <RadioGroup value={roleContext} onValueChange={setRoleContext} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Current role" id="ctx1" />
                      <Label htmlFor="ctx1" className="font-normal cursor-pointer">Current role</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Previous role" id="ctx2" />
                      <Label htmlFor="ctx2" className="font-normal cursor-pointer">Previous role</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    size="lg" 
                    onClick={initializeStep2}
                    disabled={!selectedRoleId || !selectedSector}
                    className="w-full md:w-auto px-8"
                  >
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: TASK CONFIRMATION */}
          {step === 2 && (
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader>
                <CardTitle className="font-serif">Confirm your typical tasks</CardTitle>
                <CardDescription>
                  People in the <strong>{ROLE_PROFILES[selectedRoleId]?.label}</strong> role typically do these tasks. 
                  Uncheck any that don't apply to you.
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

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Add a custom task (Optional)</Label>
                  <Input 
                    placeholder="e.g. Managing crisis communications..." 
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button 
                    size="lg" 
                    onClick={handleAnalyze}
                    disabled={checkedTaskIds.size === 0}
                    className="px-8"
                  >
                    Analyze Tasks <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-center text-xs text-muted-foreground italic">
                  "You don’t need to be exact. This is about patterns, not precision."
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
                    <CardTitle className="text-lg font-serif text-primary">Task Category Breakdown</CardTitle>
                    <CardDescription>Typical AI interaction for your confirmed tasks.</CardDescription>
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
                  <CardTitle className="text-lg font-serif text-primary">What this means — and what it doesn’t</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">The Pattern</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>AI supports <strong>{result.breakdown.augmented}%</strong> of these tasks, likely increasing speed and quality.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span><strong>{result.breakdown.automated}%</strong> of routine coordination could be automated, freeing up focus time.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-primary mt-1">•</span>
                        <span>Human responsibility remains dominant in <strong>{result.breakdown.human}%</strong> of the work, especially in judgment and empathy.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">The Reality</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2 items-start">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>This is <strong>not</strong> a job loss prediction or employability score.</span>
                      </li>
                      <li className="flex gap-2 items-start">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>Augmentation usually changes <strong>HOW</strong> work is done, not <strong>WHETHER</strong> the role exists.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={handleReset} className="text-muted-foreground">
                  <RotateCcw className="mr-2 w-4 h-4" /> Start Over
                </Button>
                <Button variant="link" className="text-primary gap-2">
                  Compare with typical roles in dashboard above <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
