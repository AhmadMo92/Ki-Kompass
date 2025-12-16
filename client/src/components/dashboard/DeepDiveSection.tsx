import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import { SectorContextChart } from "./SectorContextChart";
import { AugmentationBalancePanel } from "./AugmentationBalancePanel";
import { ContextAccessPanel } from "./ContextAccessPanel";

interface DeepDiveSectionProps {
  balance: string; // Type broadening to accept string from legacy components
  contextData: any;
}

export function DeepDiveSection({ balance, contextData }: DeepDiveSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-border/60 pt-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-medium text-primary">Detailed Analysis</h3>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {isOpen ? "Hide details" : "Explore details"}
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
           <div className="grid md:grid-cols-3 gap-6">
              <div className="h-[300px]">
                <SectorContextChart />
              </div>
              <div>
                <AugmentationBalancePanel status={balance as any} /> 
              </div>
              <div>
                <ContextAccessPanel data={contextData} />
              </div>
           </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
