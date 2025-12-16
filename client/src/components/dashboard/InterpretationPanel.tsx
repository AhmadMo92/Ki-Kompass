import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

export function InterpretationPanel() {
  return (
    <Card className="bg-secondary/30 border-none">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary/80" />
          What this means — and what it doesn’t
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">The Data Suggests</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-emerald-600/70 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed">Most roles will see task augmentation rather than full replacement.</span>
            </li>
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-emerald-600/70 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed">Skill adaptability is becoming a core currency in the labor market.</span>
            </li>
            <li className="flex gap-3 items-start">
              <CheckCircle2 className="h-5 w-5 text-emerald-600/70 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed">Demand is shifting towards roles requiring high social and creative intelligence.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">What it Does NOT Mean</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-amber-600/70 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed">It does not predict immediate mass unemployment in these sectors.</span>
            </li>
            <li className="flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-amber-600/70 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed">It does not account for new roles that haven't been invented yet.</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-background rounded-lg border border-border/50 text-xs text-muted-foreground italic">
            Note: All projections are subject to high uncertainty and context dependence. Regional and policy factors will play a significant role.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
