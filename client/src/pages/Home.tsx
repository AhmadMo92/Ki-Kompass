import { useState } from "react";
import { TaskTransformationChart } from "@/components/dashboard/TaskTransformationChart";
import { SkillDynamicsChart } from "@/components/dashboard/SkillDynamicsChart";
import { SectorContextChart } from "@/components/dashboard/SectorContextChart";
import { InterpretationPanel } from "@/components/dashboard/InterpretationPanel";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ContextAccessPanel } from "@/components/dashboard/ContextAccessPanel";
import { AugmentationBalancePanel } from "@/components/dashboard/AugmentationBalancePanel";
import { LaborDemandPanel } from "@/components/dashboard/LaborDemandPanel";
import { opportunityData, contextAccessData } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [showContext, setShowContext] = useState(false);

  // Helper to determine summary text based on simple logic
  const getSummaryText = () => {
    const context = contextAccessData[selectedSector.toLowerCase()] || contextAccessData.default;
    return {
      impact: context.augmentationBalance.toLowerCase(),
      skill: "moderately",
      demand: context.laborDemand === "Growing" ? "strong" : context.laborDemand === "Declining" ? "softening" : "steady"
    };
  };

  const summary = getSummaryText();
  
  // Get context data based on sector (fallback to default)
  const currentContextData = contextAccessData[selectedSector.toLowerCase()] || contextAccessData.default;


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 pb-20">
      {/* 1. HEADER */}
      <header className="border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 max-w-7xl">
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-primary mb-1">
            AI, Work, and Skill Transformation
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <p className="text-base text-muted-foreground font-light">
              A task-based, research-backed view of how AI reshapes work
            </p>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-medium">
              Research Prototype v1.2
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground bg-secondary/30 inline-block px-2 py-1 rounded border border-border/40">
            This dashboard explains structural patterns and trends. It does not predict individual outcomes.
          </div>
        </div>
      </header>

      {/* 2. FILTER BAR */}
      <FilterBar 
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        showContext={showContext}
        setShowContext={setShowContext}
      />

      <main className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        
        {/* 3. SUMMARY INSIGHT STRIP */}
        <section className="bg-primary/5 border border-primary/10 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 ease-in-out">
           <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
           <div className="grid md:grid-cols-3 gap-6 text-sm md:text-base">
             <div className="space-y-1">
               <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Impact Type</span>
               <p className="font-medium text-foreground">In this context, AI is mainly <span className="text-primary font-semibold border-b border-primary/30">{summary.impact}</span>.</p>
             </div>
             <div className="space-y-1">
               <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Skill Pressure</span>
               <p className="font-medium text-foreground">Skill requirements are changing <span className="text-amber-600/80 font-semibold border-b border-amber-600/20">{summary.skill}</span>.</p>
             </div>
             <div className="space-y-1">
                <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Demand Signal</span>
                <p className="font-medium text-foreground">Labor demand remains <span className="text-emerald-600/80 font-semibold border-b border-emerald-600/20">{summary.demand}</span> in adjacent roles.</p>
             </div>
           </div>
        </section>

        {/* 4. MAIN DASHBOARD PANELS (GRID A-F) */}
        
        {/* ROW 1: Task Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PANEL A — TASK TRANSFORMATION (2 cols) */}
          <div className="md:col-span-2">
             <TaskTransformationChart />
          </div>
          {/* PANEL B — AUGMENTATION VS AUTOMATION (1 col) */}
          <div>
            <AugmentationBalancePanel status={currentContextData.augmentationBalance} />
          </div>
        </div>

        {/* ROW 2: Skill & Sector Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PANEL C — SKILL CHANGE DYNAMICS */}
          <div className="h-[350px]">
             <SkillDynamicsChart />
          </div>
          {/* PANEL D — SECTOR AI EXPOSURE */}
          <div className="h-[350px]">
             <SectorContextChart />
          </div>
        </div>

        {/* ROW 3: Market & Opportunity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* PANEL E — LABOR DEMAND SIGNAL */}
           <div>
             <LaborDemandPanel 
                status={currentContextData.laborDemand} 
                description={currentContextData.laborDemandDescription}
             />
           </div>

            {/* PANEL F — OPPORTUNITY ALIGNMENT (2 cols) */}
            <div className="md:col-span-2">
              <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-primary font-serif flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Opportunity Alignment
                  </CardTitle>
                  <CardDescription>
                    Structural opportunity areas, not guarantees.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {opportunityData.map((item, i) => (
                      <div key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/30 hover:border-border/60">
                        <div>
                          <div className="font-medium text-foreground text-sm">{item.role}</div>
                          <div className="text-xs text-muted-foreground">{item.sector}</div>
                        </div>
                        <Badge variant="outline" className="bg-background/50 font-normal text-xs">
                          {item.growth} Growth
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    Emerging roles often combine technical knowledge with strong interpersonal skills.
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>

        {/* PANEL G — CONTEXT & ACCESS (TOGGLEABLE) */}
        {showContext && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <ContextAccessPanel data={currentContextData} />
          </div>
        )}

        {/* 5. INTERPRETATION PANEL */}
        <InterpretationPanel />

      </main>

      {/* 6. FOOTER */}
      <footer className="bg-white border-t border-border/60 py-12 mt-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="font-serif font-medium text-primary mb-3">Data Sources & Research</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aggregated from public workforce datasets (OECD, IAB, ILO), academic research on automation exposure, and labor market trend analysis. 
              </p>
            </div>
            <div>
              <h5 className="font-serif font-medium text-primary mb-3">Methodology & Limitations</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our model assesses task-level overlap with current AI capabilities. It does not account for regulatory barriers or social adoption rates.
              </p>
            </div>
            <div>
              <h5 className="font-serif font-medium text-primary mb-3">About this platform</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Built to provide a balanced, non-alarmist perspective on the future of work. Designed for policymakers, educators, and the general workforce.
              </p>
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
            <p>&copy; 2024 Workforce Intelligence Initiative. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
