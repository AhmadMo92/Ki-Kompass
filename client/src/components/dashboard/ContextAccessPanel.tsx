import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe2, GraduationCap } from "lucide-react";
import { ContextData } from "@/lib/mockData";

interface ContextAccessPanelProps {
  data: ContextData;
}

export function ContextAccessPanel({ data }: ContextAccessPanelProps) {
  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "High": return "default"; // Primary color
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/30 border-primary/10 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
           <Globe2 className="h-5 w-5 text-primary" />
           <CardTitle className="text-lg text-primary font-serif">Context & Access</CardTitle>
        </div>
        <CardDescription>
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Language Sensitivity</span>
              <Badge variant={getBadgeVariant(data.languageSensitivity)} className="ml-2">
                {data.languageSensitivity}
              </Badge>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/60 rounded-full transition-all duration-500"
                style={{ 
                  width: data.languageSensitivity === "High" ? "90%" : data.languageSensitivity === "Medium" ? "60%" : "30%" 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Degree to which local language fluency impacts job performance and opportunity access.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Credential Dependency</span>
              <Badge variant={getBadgeVariant(data.credentialDependency)} className="ml-2">
                {data.credentialDependency}
              </Badge>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
               <div 
                className="h-full bg-amber-600/60 rounded-full transition-all duration-500"
                style={{ 
                  width: data.credentialDependency === "High" ? "90%" : data.credentialDependency === "Medium" ? "60%" : "30%" 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Extent to which formal degrees and certifications are strict barriers to entry.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
