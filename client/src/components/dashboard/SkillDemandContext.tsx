import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";
import { SkillDynamicsChart } from "./SkillDynamicsChart";

interface SkillDemandContextProps {
  skillPressure: string;
  demandSignal: string;
}

export function SkillDemandContext({ skillPressure, demandSignal }: SkillDemandContextProps) {
  
  const synthesis = skillPressure === "High" && demandSignal === "Growing"
    ? "Skills are evolving rapidly while demand grows — suggesting a 'talent crunch' where adaptability is key."
    : skillPressure === "Low" && demandSignal === "Declining"
    ? "Role stability is high, but overall market demand is softening."
    : "Skills are evolving at a moderate pace, while demand remains strong — suggesting adaptation pressure rather than role decline.";

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif text-primary">Skills and labor demand context</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
             <div className="flex items-start gap-3">
                <div className="bg-secondary/30 p-2 rounded-md">
                   <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                   <h4 className="font-medium text-sm">Skill Evolution</h4>
                   <p className="text-sm text-muted-foreground">
                     {skillPressure === "High" ? "Rapid updates required" : "Moderate updates required"}
                   </p>
                </div>
             </div>

             <div className="flex items-start gap-3">
                <div className="bg-secondary/30 p-2 rounded-md">
                   <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                   <h4 className="font-medium text-sm">Labor Demand</h4>
                   <p className="text-sm text-muted-foreground">
                     {demandSignal} market interest
                   </p>
                </div>
             </div>

             <div className="bg-secondary/10 p-3 rounded text-sm text-foreground/80 leading-relaxed border border-border/40">
               {synthesis}
             </div>
          </div>

          <div className="h-[180px] w-full">
            {/* Reusing existing chart but smaller container makes it compact */}
            <SkillDynamicsChart />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
