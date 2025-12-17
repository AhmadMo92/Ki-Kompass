import { useState, useMemo } from "react";
import { 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  Info, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Zap, 
  ShieldAlert,
  Search,
  CheckCircle2,
  Brain
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  mockRoleData, 
  sectors, 
  roleGroups, 
  regions, 
  roleSkillClusters,
  RoleData 
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

// Types for the component
interface RoleCardProps {
  roleName: string;
  sector: string;
  data: RoleData;
  onClick: () => void;
  viewMode: "grid" | "list";
}

// Helper to determine status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Growing": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "Stable": return "text-blue-600 bg-blue-50 border-blue-200";
    case "Declining": return "text-amber-600 bg-amber-50 border-amber-200";
    case "High": return "text-orange-600 bg-orange-50 border-orange-200";
    case "Medium": return "text-blue-600 bg-blue-50 border-blue-200";
    case "Low": return "text-slate-600 bg-slate-50 border-slate-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

const getImpactColor = (balance: string) => {
  if (balance === "Mostly Augmenting") return "text-indigo-600 bg-indigo-50 border-indigo-200";
  if (balance === "Mostly Automating") return "text-rose-600 bg-rose-50 border-rose-200";
  return "text-purple-600 bg-purple-50 border-purple-200";
};

// Section 3: Role Card Component
const RoleCard = ({ roleName, sector, data, onClick, viewMode }: RoleCardProps) => {
  if (viewMode === "list") {
    return (
      <div 
        onClick={onClick}
        className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{roleName}</h3>
            <p className="text-sm text-slate-500">{sector}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Task Impact</span>
            <Badge variant="outline" className={cn("mt-1", getImpactColor(data.augmentationBalance))}>
              {data.augmentationBalance}
            </Badge>
          </div>
          
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Demand</span>
            <div className="flex items-center mt-1 font-medium text-slate-700">
              {data.demandSignal === "Growing" && <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />}
              {data.demandSignal === "Stable" && <Minus className="h-3 w-3 mr-1 text-blue-500" />}
              {data.demandSignal === "Declining" && <TrendingDown className="h-3 w-3 mr-1 text-amber-500" />}
              {data.demandSignal}
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    );
  }

  return (
    <Card 
      onClick={onClick}
      className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-indigo-500 transition-colors" />
      <CardHeader className="pb-3 pl-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{sector}</p>
            <CardTitle className="text-xl font-serif text-slate-900 group-hover:text-indigo-700 transition-colors">
              {roleName}
            </CardTitle>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <ArrowRight className="h-4 w-4 group-hover:-rotate-45 transition-transform duration-300" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pl-6">
        <div className="space-y-3">
          {/* Signal 1: Task Impact */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Task Impact</span>
            </div>
            <Badge variant="secondary" className={cn("w-full justify-center py-1 font-normal", getImpactColor(data.augmentationBalance))}>
              {data.augmentationBalance}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Signal 2: Skill Change */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Skill Change</span>
              <div className={cn("text-xs font-medium px-2 py-1 rounded-md border text-center", getStatusColor(data.changePressure))}>
                {data.changePressure} Intensity
              </div>
            </div>

            {/* Signal 3: Demand */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Demand Signal</span>
              <div className={cn("text-xs font-medium px-2 py-1 rounded-md border text-center flex items-center justify-center", getStatusColor(data.demandSignal))}>
                {data.demandSignal === "Growing" && <TrendingUp className="h-3 w-3 mr-1" />}
                {data.demandSignal === "Stable" && <Minus className="h-3 w-3 mr-1" />}
                {data.demandSignal === "Declining" && <TrendingDown className="h-3 w-3 mr-1" />}
                {data.demandSignal}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ExploreRoles() {
  const [selectedSector, setSelectedSector] = useState<string>("All Sectors");
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("All Roles");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);

  // Filter Logic
  const filteredRoles = useMemo(() => {
    return Object.entries(mockRoleData).filter(([key, data]) => {
      const [sector, role] = key.split("-");
      if (selectedSector !== "All Sectors" && sector !== selectedSector) return false;
      if (selectedRoleGroup !== "All Roles" && role !== selectedRoleGroup) return false;
      return true;
    }).map(([key, data]) => {
      const [sector, role] = key.split("-");
      return { key, sector, role, data };
    });
  }, [selectedSector, selectedRoleGroup]);

  const selectedRoleData = selectedRoleKey ? mockRoleData[selectedRoleKey] : null;
  const selectedRoleName = selectedRoleKey ? selectedRoleKey.split("-")[1] : "";
  const selectedRoleSector = selectedRoleKey ? selectedRoleKey.split("-")[0] : "";
  const skillClusters = selectedRoleKey ? roleSkillClusters[selectedRoleKey] || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* SECTION 1: ORIENTATION */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">
            <Zap className="mr-1.5 h-3 w-3" />
            Structural Exploration Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
            How AI is reshaping roles and opportunities
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            This view shows how roles and skill profiles are shifting based on task transformation, 
            skill demand, and labor-market signals. It highlights patterns — not individual outcomes.
          </p>
          <div className="mt-6 flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
            <Info className="h-4 w-4 mt-0.5 text-slate-400" />
            <p>These are structural trends based on aggregated data, not hiring predictions for specific individuals.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* SECTION 2: FILTER & EXPLORE */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 sticky top-0 bg-slate-50/95 backdrop-blur z-10 py-4 border-b border-slate-200/50">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Sectors">All Sectors</SelectItem>
                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedRoleGroup} onValueChange={setSelectedRoleGroup}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select Role Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                {roleGroups.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select defaultValue="Global">
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 border bg-white rounded-lg p-1">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("grid")}
              className="px-3"
            >
              <LayoutGrid className="h-4 w-4 mr-2" /> Grid
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("list")}
              className="px-3"
            >
              <List className="h-4 w-4 mr-2" /> List
            </Button>
          </div>
        </div>

        {/* SECTION 3: ROLE LANDSCAPE OVERVIEW */}
        <div className={cn(
          "grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredRoles.map(({ key, role, sector, data }) => (
            <RoleCard 
              key={key}
              roleName={role}
              sector={sector}
              data={data}
              onClick={() => setSelectedRoleKey(key)}
              viewMode={viewMode}
            />
          ))}
          
          {filteredRoles.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No roles found matching your filters.</p>
              <Button variant="link" onClick={() => { setSelectedSector("All Sectors"); setSelectedRoleGroup("All Roles"); }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* SECTION 7: INTERPRETATION */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center">
            <Brain className="h-6 w-6 mr-3 text-indigo-600" />
            How to read these signals
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Understanding Opportunity Signals</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                  <span>"Mostly Augmenting" roles often see increased productivity and value, as AI handles routine tasks.</span>
                </li>
                <li className="flex items-start text-slate-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                  <span>High "Skill Change" intensity suggests a rapid evolution of the role, offering early-adopter advantages.</span>
                </li>
                <li className="flex items-start text-slate-600 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Growing demand signals indicate sector-wide expansion despite automation of specific tasks.</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Limits & Context</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-slate-600 text-sm">
                  <ShieldAlert className="h-4 w-4 mr-2 text-amber-500 mt-0.5 shrink-0" />
                  <span>Data is aggregated at a role/sector level; individual company contexts will vary significantly.</span>
                </li>
                <li className="flex items-start text-slate-600 text-sm">
                  <ShieldAlert className="h-4 w-4 mr-2 text-amber-500 mt-0.5 shrink-0" />
                  <span>"Declining" demand often implies a shift in required skills rather than role disappearance.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-sm font-medium text-slate-500">
               This view supports orientation and exploration, not career or hiring decisions.
             </p>
          </div>
        </div>

      </div>

      {/* SECTION 4: DETAIL PANEL */}
      <Sheet open={!!selectedRoleKey} onOpenChange={(open) => !open && setSelectedRoleKey(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto sm:w-[600px]">
          {selectedRoleData && (
            <>
              <SheetHeader className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-slate-500 border-slate-200">
                    {selectedRoleSector}
                  </Badge>
                  {selectedRoleData.augmentationBalance && (
                    <Badge className={cn("border-0", getImpactColor(selectedRoleData.augmentationBalance))}>
                      {selectedRoleData.augmentationBalance}
                    </Badge>
                  )}
                </div>
                <SheetTitle className="text-3xl font-serif text-slate-900">
                  {selectedRoleName}
                </SheetTitle>
                <SheetDescription className="text-base text-slate-600">
                  Structural context and transformation signals
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-8">
                {/* Opportunity & Change Pressure Blocks */}
                <div className="grid gap-4">
                  <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <h3 className="font-semibold text-emerald-900 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" /> Opportunity Surfaces
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-emerald-800 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        {selectedRoleData.opportunityDescription}
                      </li>
                      <li className="text-sm text-emerald-800 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        {selectedRoleData.demandDescription}
                      </li>
                      <li className="text-sm text-emerald-800 flex gap-2">
                         <span className="text-emerald-500">•</span>
                         High opportunity surface ({selectedRoleData.opportunitySurface}) suggests potential for value creation.
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-100">
                    <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-2" /> Change Pressure
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-amber-800 flex gap-2">
                        <span className="text-amber-500">•</span>
                        {selectedRoleData.contextDescription}
                      </li>
                      <li className="text-sm text-amber-800 flex gap-2">
                        <span className="text-amber-500">•</span>
                        Change pressure is {selectedRoleData.changePressure}, indicating {selectedRoleData.changePressure === "High" ? "rapid evolution" : "steady adaptation"}.
                      </li>
                      <li className="text-sm text-amber-800 flex gap-2">
                        <span className="text-amber-500">•</span>
                        Adaptability required due to {selectedRoleData.augmentationBalance.toLowerCase()} nature of tasks.
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs text-center text-slate-400 font-medium italic mt-1">
                    "Opportunity and change pressure often coexist."
                  </p>
                </div>

                <Separator />

                {/* SECTION 5: SKILL CLUSTERS */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Inferred Skill Clusters</h3>
                  <div className="space-y-3">
                    {skillClusters.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                        <span className="font-medium text-slate-700">{skill.name}</span>
                        <Badge variant="secondary" className={cn(
                          "font-normal",
                          skill.interaction === "Supportive" && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                          skill.interaction === "Complementary" && "bg-purple-50 text-purple-700 hover:bg-purple-100",
                          skill.interaction === "Minimal" && "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}>
                          {skill.interaction}
                        </Badge>
                      </div>
                    ))}
                    {skillClusters.length === 0 && (
                      <p className="text-sm text-slate-500 italic">No specific skill cluster data available.</p>
                    )}
                  </div>
                </div>

                {/* SECTION 6: CONTEXTUAL COMPARISON (Mini) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <h4 className="text-sm font-semibold text-slate-900 mb-3">Sector Context</h4>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Avg. Sector Automation</span>
                      <span className="font-medium text-slate-900">
                        {mockRoleData[selectedRoleKey!]?.automated > 40 ? "High" : "Moderate"}
                      </span>
                   </div>
                   <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                     <div 
                       className="bg-slate-400 h-full rounded-full" 
                       style={{ width: `${mockRoleData[selectedRoleKey!]?.automated}%` }} 
                     />
                   </div>
                </div>
              </div>

              <SheetFooter className="mt-8">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">Close Context View</Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
