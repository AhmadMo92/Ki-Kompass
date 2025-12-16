import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface PracticeExplanationProps {
  balance: string;
}

export function PracticeExplanation({ balance }: PracticeExplanationProps) {
  // Content varies slightly by balance, but sticking to the "Augmenting" example for the prototype mostly
  // unless strictly "Automating".
  
  const isAutomating = balance === "Mostly Automating";

  return (
    <Card className="bg-primary/5 border-primary/10 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          What ‘{balance.toLowerCase()}’ means in practice
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          <li className="flex gap-3 items-start text-sm">
            <span className="text-primary font-bold text-lg leading-none">•</span>
            <span className="text-foreground/90">
              {isAutomating 
                ? "Routine tasks are handled by software, requiring humans to manage exceptions."
                : "AI reduces time spent on routine and support tasks like drafting or data prep."}
            </span>
          </li>
          <li className="flex gap-3 items-start text-sm">
            <span className="text-primary font-bold text-lg leading-none">•</span>
            <span className="text-foreground/90">
              {isAutomating
                ? "The remaining work becomes more complex, requiring deeper problem-solving."
                : "Expectations and scope often increase, rather than creating 'free time'."}
            </span>
          </li>
          <li className="flex gap-3 items-start text-sm">
            <span className="text-primary font-bold text-lg leading-none">•</span>
            <span className="text-foreground/90">
              Hiring tends to favor profiles who can {isAutomating ? "oversee these automated systems." : "leverage these tools to move faster."}
            </span>
          </li>
        </ul>
        
        <div className="pt-2 mt-2 border-t border-primary/10">
          <p className="text-sm font-medium text-primary/80 italic">
            "Augmentation rarely means one person replaces two people."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
