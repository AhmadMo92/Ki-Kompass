import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { analyzeRoleDescription, AnalysisResult } from "@/utils/taskMapping";
import { TaskBreakdownChart } from "./TaskBreakdownChart";
import { TaskCategoryList } from "./TaskCategoryList";
import { Sparkles, ArrowUpRight, HelpCircle } from "lucide-react";

export function RoleDescriptor() {
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [context, setContext] = useState("Current role");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!description || !sector) return;
    
    setIsAnalyzing(true);
    // Simulate network delay for "processing" feel
    setTimeout(() => {
      const analysis = analyzeRoleDescription(description, sector);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 800);
  };

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium mb-4">
            <Sparkles className="w-3 h-3" />
            New Feature (Beta)
          </div>
          <h2 className="text-3xl font-serif text-primary mb-3">Describe Your Role</h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            Describe what you do. We analyze task patterns, not people.
          </p>
          <div className="text-xs text-muted-foreground bg-white/50 inline-block px-3 py-1.5 rounded-md border border-border/40">
            This is an interpretive tool based on research patterns. It does not predict individual outcomes.
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* INPUT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-md bg-white">
              <CardContent className="pt-6 space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="role-desc" className="text-sm font-semibold text-foreground">Role Description</Label>
                  <Textarea 
                    id="role-desc"
                    placeholder="Describe your role and main tasks. Example: managing programs, coordinating stakeholders, writing reports, tracking budgets, planning timelines..."
                    className="min-h-[150px] resize-none focus-visible:ring-primary/20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Sector</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {["Health", "IT", "Logistics", "Administration", "Education", "Other"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Context</Label>
                    <RadioGroup value={context} onValueChange={setContext} className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Current role" id="r1" />
                        <Label htmlFor="r1" className="font-normal text-xs">Current</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Previous role" id="r2" />
                        <Label htmlFor="r2" className="font-normal text-xs">Previous</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Label className="text-sm font-semibold flex justify-between">
                    <span>Task Emphasis (Optional)</span>
                    <span className="text-xs font-normal text-muted-foreground">Adjusts weighting</span>
                  </Label>
                  <Slider defaultValue={[50]} max={100} step={10} className="w-full" />
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                    <span>More Coordination</span>
                    <span>More Technical</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-2" 
                  size="lg"
                  onClick={handleAnalyze} 
                  disabled={!description || !sector || isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Role"}
                </Button>

              </CardContent>
            </Card>
          </div>

          {/* OUTPUT COLUMN */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* RESULTS GRID */}
                <div className="grid md:grid-cols-2 gap-6 h-[320px]">
                  <TaskBreakdownChart data={result.breakdown} />
                  <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="pt-6 h-full">
                       <TaskCategoryList categories={result.detectedCategories} />
                    </CardContent>
                  </Card>
                </div>

                {/* INTERPRETATION */}
                <Card className="bg-primary/5 border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      What this means — and what it doesn’t
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interpretation</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2 items-start">
                          <span className="text-primary">•</span>
                          <span>{result.mainInsight}</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <span className="text-primary">•</span>
                          <span>Augmentation usually changes <strong>how</strong> work is done, not whether the role exists.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Limitations</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2 items-start">
                          <span className="text-amber-600">•</span>
                          <span>This does not account for soft skills or organizational culture.</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <span className="text-amber-600">•</span>
                          <span>It assumes typical task definitions for the extracted keywords.</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center pt-4">
                  <Button variant="link" className="text-muted-foreground gap-2">
                    Compare with typical roles in dashboard above <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/40 rounded-xl bg-white/30">
                <div className="bg-secondary p-4 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your role description on the left to see a breakdown of potential AI interaction patterns.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
