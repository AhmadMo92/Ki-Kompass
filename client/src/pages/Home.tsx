import { useState, useMemo } from "react";
import { TaskTransformationChart } from "@/components/dashboard/TaskTransformationChart";
import { SkillDynamicsChart } from "@/components/dashboard/SkillDynamicsChart";
import { SectorContextChart } from "@/components/dashboard/SectorContextChart";
import { InterpretationPanel } from "@/components/dashboard/InterpretationPanel";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ContextAccessPanel } from "@/components/dashboard/ContextAccessPanel";
import { AugmentationBalancePanel } from "@/components/dashboard/AugmentationBalancePanel";
import { LaborDemandPanel } from "@/components/dashboard/LaborDemandPanel";
import { QuadrantChart } from "@/components/dashboard/QuadrantChart";
import { mockRoleData, sectorExposureData } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, ArrowRight, ArrowRightLeft } from "lucide-react";

export default function Home() {
  // State
  const [selectedSector, setSelectedSector] = useState("Health");
  const [selectedRole, setSelectedRole] = useState("Program Project Manager");
  const [roleContext, setRoleContext] = useState("Current role");
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [showContext, setShowContext] = useState(false);
  
  // Comparison State
  const [compareMode, setCompareMode] = useState(false);
  const [compareRole, setCompareRole] = useState("Data Analyst");

  // Derived Data Logic
  const primaryDataKey = `${selectedSector}-${selectedRole}`;
  const compareDataKey = `${selectedSector}-${compareRole}`;

  const primaryData = mockRoleData[primaryDataKey] || mockRoleData["Health-Program Project Manager"]; // Fallback
  const compareData = mockRoleData[compareDataKey]; // Can be undefined

  // Summary Text Logic
  const summaryText = useMemo(() => {
    return {
      impact: `is mainly ${primaryData.augmentationBalance.toLowerCase()}`,
      skill: primaryData.skillIntensity[5].intensity > 70 ? "rapidly" : "moderately",
      demand: primaryData.demandSignal.toLowerCase()
    };
  }, [primaryData]);

  // Context Data Construction (Bridging old component prop structure)
  const contextData = {
    languageSensitivity: primaryData.languageSensitivity,
    credentialDependency: primaryData.credentialDependency,
    description: primaryData.contextDescription,
    augmentationBalance: primaryData.augmentationBalance,
    laborDemand: primaryData.demandSignal,
    laborDemandDescription: primaryData.demandDescription
  };

  // Helper to map Low/Med/High to 0-100 for charts
  const mapLevelToNum = (level: string) => {
    if (level === "High") return 85;
    if (level === "Medium") return 50;
    return 15;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 pb-20">
      {/* A) HEADER */}
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
              Research Prototype v2.0
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground bg-secondary/30 inline-block px-2 py-1 rounded border border-border/40">
            Explains structural patterns. Does not predict individual outcomes.
          </div>
        </div>
      </header>

      {/* B) FILTER BAR */}
      <FilterBar 
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        roleContext={roleContext}
        setRoleContext={setRoleContext}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        showContext={showContext}
        setShowContext={setShowContext}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        compareRole={compareRole}
        setCompareRole={setCompareRole}
      />

      <main className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        
        {/* D) TOP SUMMARY STRIP */}
        <section className="bg-primary/5 border border-primary/10 rounded-xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 ease-in-out">
           <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
           <div className="grid md:grid-cols-3 gap-6 text-sm md:text-base">
             <div className="space-y-1">
               <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Impact Type</span>
               <p className="font-medium text-foreground">In this context, AI <span className="text-primary font-semibold border-b border-primary/30">{summaryText.impact}</span>.</p>
             </div>
             <div className="space-y-1">
               <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Skill Pressure</span>
               <p className="font-medium text-foreground">Skill requirements are changing <span className="text-amber-600/80 font-semibold border-b border-amber-600/20">{summaryText.skill}</span>.</p>
             </div>
             <div className="space-y-1">
                <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Demand Signal</span>
                <p className="font-medium text-foreground">Labor demand is <span className="text-emerald-600/80 font-semibold border-b border-emerald-600/20">{summaryText.demand}</span> in this role group.</p>
             </div>
           </div>
        </section>

        {/* COMPARISON BANNER (Optional) */}
        {compareMode && (
          <div className="bg-secondary/30 border border-border/50 rounded-lg p-3 flex items-center justify-center gap-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-medium text-foreground">{selectedRole}</span>
            </div>
            <ArrowRightLeft className="w-4 h-4 opacity-50" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="font-medium text-foreground">{compareRole}</span>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD PANELS (GRID A-G) */}
        
        {/* ROW 1: Task Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* G.1) TASK TRANSFORMATION */}
          <div className="md:col-span-2">
             {/* Note: Passing props to update chart based on selection would go here. For prototype, we use the component which reads mock data. 
                 Ideally, we'd refactor TaskTransformationChart to accept data props. */}
             <TaskTransformationChart />
          </div>
          {/* G.2) AUGMENTATION VS AUTOMATION */}
          <div>
            <AugmentationBalancePanel status={primaryData.augmentationBalance} />
          </div>
        </div>

        {/* ROW 2: Strategic & Skill */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* F) QUADRANT CHART */}
           <div>
             <QuadrantChart 
                primaryRole={{
                  changePressure: mapLevelToNum(primaryData.changePressure),
                  opportunityAlignment: primaryData.opportunityAlignment,
                  label: selectedRole
                }}
                secondaryRole={compareMode && compareData ? {
                  changePressure: mapLevelToNum(compareData.changePressure),
                  opportunityAlignment: compareData.opportunityAlignment,
                  label: compareRole
                } : null}
             />
           </div>

          {/* G.3) SKILL CHANGE DYNAMICS */}
          <div className="md:col-span-2 h-[350px]">
             <SkillDynamicsChart />
          </div>
        </div>

        {/* ROW 3: Market & Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* G.4) SECTOR EXPOSURE */}
           <div className="h-[350px]">
             <SectorContextChart />
           </div>

           {/* G.5 & G.6) DEMAND & OPPORTUNITY */}
           <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
             <LaborDemandPanel 
                status={primaryData.demandSignal} 
                description={primaryData.demandDescription}
             />
             
             <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary font-serif flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Opportunity Alignment
                  </CardTitle>
                  <CardDescription>
                    Degree of overlap with high-growth areas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col items-center justify-center">
                   <div className="text-4xl font-bold text-primary mb-2">
                     {primaryData.opportunityAlignment}<span className="text-lg text-muted-foreground font-normal">/100</span>
                   </div>
                   <p className="text-sm text-center text-muted-foreground px-4">
                     {primaryData.opportunityDescription}
                   </p>
                   {compareMode && compareData && (
                     <div className="mt-4 pt-4 border-t border-border/40 w-full flex justify-between text-xs text-muted-foreground">
                        <span>vs {compareRole}:</span>
                        <span className="font-bold text-orange-600">{compareData.opportunityAlignment}/100</span>
                     </div>
                   )}
                </CardContent>
             </Card>
           </div>
        </div>

        {/* G.7) CONTEXT & ACCESS (TOGGLEABLE) */}
        {showContext && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <ContextAccessPanel data={contextData} />
          </div>
        )}

        {/* H) INTERPRETATION PANEL */}
        <InterpretationPanel />

      </main>

      {/* I) FOOTER */}
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
