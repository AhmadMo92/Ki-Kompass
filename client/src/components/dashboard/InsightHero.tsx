import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface InsightHeroProps {
  role: string;
  balance: string;
  skillPressure: string;
  demandSignal: string;
}

export function InsightHero({ role, balance, skillPressure, demandSignal }: InsightHeroProps) {
  // Logic to determine title based on balance
  let title = "AI is mainly supporting this role — not replacing it";
  let subtitle = "Most changes affect how tasks are done, not whether the role exists.";

  if (balance === "Mostly Automating") {
    title = "This role faces significant automation of routine tasks";
    subtitle = "Focus is shifting towards exception handling and complex oversight.";
  } else if (balance === "Mixed") {
    title = "This role is in a hybrid transition phase";
    subtitle = "A mix of task automation and capability augmentation is reshaping the workflow.";
  }

  // Color logic for badges
  const getDemandColor = (s: string) => {
    if (s === "Growing") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s === "Stable") return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="w-full bg-white border-b border-border/60 pb-8 pt-2">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-primary mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-6">
            {subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Impact</span>
              <span className="text-sm font-medium text-primary">{balance}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skill Change</span>
              <span className="text-sm font-medium text-primary">{skillPressure === "High" ? "Rapid" : skillPressure}</span>
            </div>

            <Badge variant="outline" className={`px-3 py-1.5 text-sm font-medium border ${getDemandColor(demandSignal)}`}>
              Demand: {demandSignal}
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground opacity-80">
            <Info className="w-3 h-3" />
            Structural patterns based on task composition, not individual predictions.
          </div>
        </div>
      </div>
    </div>
  );
}
