import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface LaborDemandPanelProps {
  status: "Growing" | "Stable" | "Declining";
  description: string;
}

export function LaborDemandPanel({ status, description }: LaborDemandPanelProps) {
  const getColor = (status: string) => {
    switch (status) {
      case "Growing": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Stable": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Declining": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary font-serif flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Labor Demand Signal
        </CardTitle>
        <CardDescription>
          Demand reflects current labor market conditions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-start space-y-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getColor(status)}`}>
            {status} Demand
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
