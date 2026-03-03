import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, CATEGORY_ORDER, CategoryLabel } from "@/lib/data";
import { Sparkles, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DonutChart } from "./DonutChart";

interface PersonalizedResultsProps {
  personal: Record<CategoryLabel, number>;
  typical: Record<CategoryLabel, number>;
  taskCount: { selected: number; total: number };
  language: "en" | "de";
  onReset: () => void;
}

function DiffIndicator({ diff, language }: { diff: number; language: "en" | "de" }) {
  if (Math.abs(diff) < 0.5) {
    return <span className="text-gray-500 text-xs flex items-center gap-1"><Minus className="w-3 h-3" /> {language === "en" ? "Same" : "Gleich"}</span>;
  }
  if (diff > 0) {
    return <span className="text-emerald-600 text-xs flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +{diff.toFixed(1)}%</span>;
  }
  return <span className="text-red-500 text-xs flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {diff.toFixed(1)}%</span>;
}

export function PersonalizedResults({ personal, typical, taskCount, language, onReset }: PersonalizedResultsProps) {
  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-white to-primary/5" data-testid="personalized-results">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="font-serif text-lg">
              {language === "de" ? "Dein Profil" : "Your Profile"}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
            <RotateCcw className="w-3 h-3" />
            {language === "de" ? "Aufgaben bearbeiten" : "Edit Tasks"}
          </Button>
        </div>
        <CardDescription>
          {language === "de"
            ? `Basierend auf ${taskCount.selected} von ${taskCount.total} ausgewählten Aufgaben`
            : `Based on ${taskCount.selected} of ${taskCount.total} tasks you selected`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
              {language === "de" ? "Dein Profil" : "Your Profile"}
            </h4>
            <DonutChart percentages={personal} size={200} language={language} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
              {language === "de" ? "Typisches Profil vs. Deins" : "Typical vs. Yours"}
            </h4>
            <div className="space-y-2">
              {CATEGORY_ORDER.map(cat => {
                const diff = personal[cat] - typical[cat];
                return (
                  <div key={cat} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg }}>
                    <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: CATEGORIES[cat].color }} />
                    <span className="text-sm flex-1" style={{ color: CATEGORIES[cat].color }}>
                      {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{personal[cat].toFixed(0)}%</span>
                    <span className="text-xs text-slate-400 w-12 text-right">({typical[cat].toFixed(0)}%)</span>
                    <DiffIndicator diff={diff} language={language} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
