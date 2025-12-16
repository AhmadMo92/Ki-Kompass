import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCategory } from "@/utils/taskMapping";
import { Check, Bot, Brain, Users } from "lucide-react";

interface TaskCategoryListProps {
  categories: TaskCategory[];
}

export function TaskCategoryList({ categories }: TaskCategoryListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Augmented": return <Bot className="w-4 h-4 text-blue-500" />;
      case "Automated": return <Check className="w-4 h-4 text-purple-500" />;
      case "Human-Dominant": return <Users className="w-4 h-4 text-teal-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case "Augmented": return "default";
      case "Automated": return "secondary";
      case "Human-Dominant": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-serif font-medium text-primary mb-2">Detected Task Categories</h3>
      <p className="text-sm text-muted-foreground mb-4">Patterns identified in your description.</p>
      
      {categories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border/50 rounded-lg p-8">
          Enter a description to detect task categories.
        </div>
      ) : (
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-white/50 border border-border/40 hover:border-border/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-secondary/50 p-1.5 rounded-md">
                    {getIcon(cat.type)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{cat.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Keywords: {cat.keywords.join(", ")}
                    </div>
                  </div>
                </div>
                <Badge variant={getVariant(cat.type)} className="text-[10px] ml-2 shrink-0">
                  {cat.type}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
