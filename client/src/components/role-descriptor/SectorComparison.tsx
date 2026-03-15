import { CATEGORIES, CATEGORY_ORDER, CategoryLabel, SECTOR_AVERAGES, sectorTools } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface SectorComparisonProps {
  occupationPercentages: Record<CategoryLabel, number>;
  sector: string;
  occupationName: string;
  language: "en" | "de";
}

function getSectorLabel(sector: string): { de: string; en: string } {
  const data = sectorTools[sector];
  if (data) return { de: data.label_de, en: data.label_en };
  return { de: sector, en: sector };
}

function StackedBar({ values, label }: { values: Record<CategoryLabel, number>; label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-slate-600 truncate">{label}</div>
      <div className="flex h-7 rounded-lg overflow-hidden">
        {CATEGORY_ORDER.map(cat => {
          const pct = values[cat];
          if (pct <= 0) return null;
          return (
            <div
              key={cat}
              className="flex items-center justify-center text-[10px] font-bold text-white transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: pct > 3 ? undefined : '0' }}
              title={`${CATEGORIES[cat].label_en}: ${pct.toFixed(1)}%`}
            >
              {pct >= 8 ? `${Math.round(pct)}%` : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SectorComparison({ occupationPercentages, sector, occupationName, language }: SectorComparisonProps) {
  const sectorAvg = SECTOR_AVERAGES[sector];
  if (!sectorAvg) return null;

  const sectorPcts: Record<CategoryLabel, number> = {
    automatable: sectorAvg.automatable * 100,
    high_ai_potential: sectorAvg.high_ai_potential * 100,
    sensitive: sectorAvg.sensitive * 100,
    ai_assisted: sectorAvg.ai_assisted * 100,
    human_led: sectorAvg.human_led * 100,
  };

  const sectorLabel = getSectorLabel(sector);

  return (
    <Card className="border-none shadow-sm bg-white/60" data-testid="sector-comparison">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {language === "de" ? "Sektorvergleich" : "Sector Comparison"}
        </CardTitle>
        <CardDescription>
          {language === "de"
            ? `Deine Rolle vs. Durchschnitt ${sectorLabel.de}`
            : `Your role vs. ${sectorLabel.en} average`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StackedBar values={occupationPercentages} label={occupationName} />
        <StackedBar
          values={sectorPcts}
          label={language === "de" ? `Ø ${sectorLabel.de}` : `Avg. ${sectorLabel.en}`}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          {CATEGORY_ORDER.map(cat => (
            <div key={cat} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
              {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
