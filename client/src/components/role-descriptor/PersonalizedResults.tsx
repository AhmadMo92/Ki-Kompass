import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bot, Cog, TrendingUp, TrendingDown, Minus, Sparkles, RotateCcw } from "lucide-react";

interface ExposureData {
  human: number;
  ai_assisted: number;
  automation: number;
}

interface PersonalizedResultsProps {
  personal: ExposureData;
  typical: ExposureData;
  taskCount: { selected: number; total: number };
  language: "en" | "de";
  onReset: () => void;
}

function DiffIndicator({ diff, language }: { diff: number; language: "en" | "de" }) {
  if (Math.abs(diff) < 0.5) {
    return <span className="text-gray-500 text-xs flex items-center gap-1"><Minus className="w-3 h-3" /> {language === "en" ? "Same" : "Gleich"}</span>;
  }
  if (diff > 0) {
    return <span className="text-green-600 text-xs flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +{diff.toFixed(1)}%</span>;
  }
  return <span className="text-red-500 text-xs flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {diff.toFixed(1)}%</span>;
}

function getInsights(personal: ExposureData, typical: ExposureData, language: "en" | "de"): string[] {
  const insights: string[] = [];
  const humanDiff = personal.human - typical.human;
  const autoDiff = personal.automation - typical.automation;
  const aiDiff = personal.ai_assisted - typical.ai_assisted;

  if (humanDiff > 10) {
    insights.push(language === "en" 
      ? `Your role is more human-centric than typical (+${humanDiff.toFixed(0)}%)`
      : `Ihre Rolle ist menschenzentrierter als typisch (+${humanDiff.toFixed(0)}%)`);
  }
  if (humanDiff < -10) {
    insights.push(language === "en"
      ? `Your role has less human interaction than typical (${humanDiff.toFixed(0)}%)`
      : `Ihre Rolle hat weniger menschliche Interaktion als typisch (${humanDiff.toFixed(0)}%)`);
  }
  if (autoDiff < -5 && typical.automation > 5) {
    insights.push(language === "en"
      ? "You've avoided most automation-prone tasks"
      : "Sie haben die meisten automatisierungsanfälligen Aufgaben vermieden");
  }
  if (autoDiff > 10) {
    insights.push(language === "en"
      ? `Your role has higher automation exposure (+${autoDiff.toFixed(0)}%)`
      : `Ihre Rolle hat höhere Automatisierungsexposition (+${autoDiff.toFixed(0)}%)`);
  }
  if (aiDiff > 15) {
    insights.push(language === "en"
      ? "You work heavily with AI-assisted tasks"
      : "Sie arbeiten intensiv mit KI-unterstützten Aufgaben");
  }

  if (insights.length === 0) {
    insights.push(language === "en"
      ? "Your task profile is similar to the typical role"
      : "Ihr Aufgabenprofil entspricht der typischen Rolle");
  }

  return insights;
}

export function PersonalizedResults({ personal, typical, taskCount, language, onReset }: PersonalizedResultsProps) {
  const insights = getInsights(personal, typical, language);

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-white to-primary/5" data-testid="personalized-results">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="font-serif text-lg">
              {language === "en" ? "Your Personalized Analysis" : "Ihre personalisierte Analyse"}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
            <RotateCcw className="w-3 h-3" />
            {language === "en" ? "Edit Tasks" : "Aufgaben bearbeiten"}
          </Button>
        </div>
        <CardDescription>
          {language === "en" 
            ? `Based on ${taskCount.selected} of ${taskCount.total} tasks you selected`
            : `Basierend auf ${taskCount.selected} von ${taskCount.total} ausgewählten Aufgaben`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {language === "en" ? "Your Profile" : "Ihr Profil"}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">{language === "en" ? "Human" : "Mensch"}</span>
                </div>
                <span className="font-bold text-green-700">{personal.human.toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">{language === "en" ? "AI-Assisted" : "KI-Assistiert"}</span>
                </div>
                <span className="font-bold text-blue-700">{personal.ai_assisted.toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-700">{language === "en" ? "Automation" : "Automation"}</span>
                </div>
                <span className="font-bold text-amber-700">{personal.automation.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {language === "en" ? "Typical Role" : "Typische Rolle"}
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                <span className="text-sm text-muted-foreground">{typical.human.toFixed(1)}%</span>
                <DiffIndicator diff={personal.human - typical.human} language={language} />
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                <span className="text-sm text-muted-foreground">{typical.ai_assisted.toFixed(1)}%</span>
                <DiffIndicator diff={personal.ai_assisted - typical.ai_assisted} language={language} />
              </div>
              
              <div className="flex items-center justify-between p-2 rounded bg-secondary/30">
                <span className="text-sm text-muted-foreground">{typical.automation.toFixed(1)}%</span>
                <DiffIndicator diff={personal.automation - typical.automation} language={language} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <h4 className="text-sm font-medium">
            {language === "en" ? "Key Insights" : "Wichtige Erkenntnisse"}
          </h4>
          {insights.map((insight, i) => (
            <Badge key={i} variant="secondary" className="mr-2 mb-1 text-xs font-normal">
              {insight}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
