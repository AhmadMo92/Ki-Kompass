import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";

interface AugmentationBalancePanelProps {
  status: "Mostly Augmenting" | "Mixed" | "Mostly Automating";
}

export function AugmentationBalancePanel({ status }: AugmentationBalancePanelProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case "Mostly Augmenting": return "default"; // Primary blue
      case "Mixed": return "secondary"; // Neutral
      case "Mostly Automating": return "outline"; // Alert/Warning implied by content, but kept neutral style
      default: return "secondary";
    }
  };

  const getDescription = (status: string) => {
    switch (status) {
      case "Mostly Augmenting": return "AI complements human skills, increasing productivity without replacing the core role.";
      case "Mixed": return "A balance of task automation and human augmentation is occurring simultaneously.";
      case "Mostly Automating": return "Routine and repetitive tasks are being significantly offloaded to AI systems.";
      default: return "AI impact varies significantly across tasks.";
    }
  };

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary font-serif flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Augmentation vs Automation
        </CardTitle>
        <CardDescription>
          This reflects how AI is typically used in this context.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Badge variant={getVariant(status)} className="text-sm px-4 py-1.5 h-auto">
            {status}
          </Badge>
          <p className="text-sm text-center text-muted-foreground leading-relaxed">
            {getDescription(status)}
          </p>
          
          {/* Visual Indicator Bar */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden flex mt-2">
            <div 
              className={`h-full transition-all duration-500 ${status === "Mostly Augmenting" ? "bg-primary w-3/4" : "bg-primary/30 w-1/4"}`} 
            />
            <div 
              className={`h-full transition-all duration-500 ${status === "Mixed" ? "bg-amber-500 w-1/2" : "bg-amber-500/30 w-[10%]"}`} 
            />
            <div 
              className={`h-full transition-all duration-500 ${status === "Mostly Automating" ? "bg-slate-600 w-3/4" : "bg-slate-600/30 w-1/4"}`} 
            />
          </div>
          <div className="flex justify-between w-full text-[10px] text-muted-foreground uppercase tracking-wider">
            <span>Augment</span>
            <span>Mixed</span>
            <span>Automate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
