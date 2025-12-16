import { useState, useMemo } from "react";
import { TaskTransformationChart } from "@/components/dashboard/TaskTransformationChart";
import { InterpretationPanel } from "@/components/dashboard/InterpretationPanel";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { MyRoleTasks } from "@/components/role-descriptor/MyRoleTasks";
import { mockRoleData } from "@/lib/mockData";
import { Separator } from "@/components/ui/separator";

// New Components
import { InsightHero } from "@/components/dashboard/InsightHero";
import { PracticeExplanation } from "@/components/dashboard/PracticeExplanation";
import { SkillDemandContext } from "@/components/dashboard/SkillDemandContext";
import { DeepDiveSection } from "@/components/dashboard/DeepDiveSection";

export default function Home() {
  // State
  const [selectedSector, setSelectedSector] = useState("Health");
  const [selectedRole, setSelectedRole] = useState("Program Project Manager");
  const [roleContext, setRoleContext] = useState("Current role");
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [showContext, setShowContext] = useState(false); // Kept for prop compatibility, though UI changed
  
  // Comparison State (kept for filter bar compatibility)
  const [compareMode, setCompareMode] = useState(false);
  const [compareRole, setCompareRole] = useState("Data Analyst");

  // Derived Data Logic
  const primaryDataKey = `${selectedSector}-${selectedRole}`;
  const primaryData = mockRoleData[primaryDataKey] || mockRoleData["Health-Program Project Manager"];

  // Context Data Construction
  const contextData = {
    languageSensitivity: primaryData.languageSensitivity,
    credentialDependency: primaryData.credentialDependency,
    description: primaryData.contextDescription,
    augmentationBalance: primaryData.augmentationBalance,
    laborDemand: primaryData.demandSignal,
    laborDemandDescription: primaryData.demandDescription
  };

  // Generate explanatory text for Section 2
  const explanationText = useMemo(() => {
    if (primaryData.augmentationBalance === "Mostly Automating") {
      return `In this ${selectedRole} role, AI is increasingly handling routine coordination and standardized processing. The core value shifts towards managing these systems, handling exceptions, and complex stakeholder engagement.`;
    }
    return `In this ${selectedRole} role, AI is mainly used to support documentation, coordination, and analytical preparation. Core responsibilities such as decision-making, accountability, and stakeholder trust remain human.`;
  }, [selectedRole, primaryData.augmentationBalance]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 pb-20">
      {/* A) HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-xl font-serif font-medium text-primary">
              AI & Workforce Intelligence
            </h1>
            <p className="text-xs text-muted-foreground">Guided Explanation Interface v2.0</p>
          </div>
          
           {/* Compact Filter Bar embedded in header or just below */}
        </div>
      </header>

      {/* B) FILTER BAR (Sticky) */}
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

      {/* SECTION 1: INSIGHT HERO (Above the Fold) */}
      <InsightHero 
        role={selectedRole}
        balance={primaryData.augmentationBalance}
        skillPressure={primaryData.changePressure}
        demandSignal={primaryData.demandSignal}
      />

      <main className="container mx-auto px-6 py-12 max-w-7xl space-y-16">
        
        {/* SECTION 2: WHY THIS IS HAPPENING */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif text-primary">Why this role is changing</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {explanationText}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border/40 shadow-sm">
             <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 text-center">Typical Task Transformation</h4>
             <TaskTransformationChart />
          </div>
        </section>

        {/* SECTION 3 & 4: PRACTICE & CONTEXT */}
        <section className="grid md:grid-cols-2 gap-8">
           <PracticeExplanation balance={primaryData.augmentationBalance} />
           <SkillDemandContext 
              skillPressure={primaryData.changePressure}
              demandSignal={primaryData.demandSignal}
           />
        </section>

        {/* SECTION 5: DEEP DIVE (Progressive) */}
        <DeepDiveSection 
          balance={primaryData.augmentationBalance}
          contextData={contextData}
        />

        {/* SECTION 6: INTERPRETATION */}
        <InterpretationPanel />

        {/* MY ROLE TASKS FEATURE */}
        <div className="pt-8 border-t border-border/60">
           <MyRoleTasks />
        </div>

      </main>

      {/* FOOTER */}
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
