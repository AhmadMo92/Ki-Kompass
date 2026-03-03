import { useMemo } from "react";
import { CATEGORIES, CATEGORY_ORDER, CategoryLabel } from "@/lib/data";

interface DonutChartProps {
  percentages: Record<CategoryLabel, number>;
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  language: "en" | "de";
}

export function DonutChart({ percentages, centerLabel, centerValue, size = 280, language }: DonutChartProps) {
  const segments = useMemo(() => {
    const radius = 100;
    const strokeWidth = 32;
    const circumference = 2 * Math.PI * radius;
    let offset = -circumference / 4;

    return CATEGORY_ORDER.map(cat => {
      const pct = percentages[cat] || 0;
      if (pct <= 0) return null;
      const dashLength = (pct / 100) * circumference;
      const segment = {
        category: cat,
        color: CATEGORIES[cat].color,
        dashArray: `${dashLength} ${circumference - dashLength}`,
        dashOffset: -offset,
        pct,
      };
      offset += dashLength;
      return segment;
    }).filter(Boolean);
  }, [percentages]);

  const transformPct = (percentages.automatable || 0) + (percentages.high_ai_potential || 0);

  return (
    <div className="flex flex-col items-center gap-4" data-testid="donut-chart">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
          <circle cx="130" cy="130" r="100" fill="none" stroke="#f1f5f9" strokeWidth="32" />
          {segments.map((seg: any) => (
            <circle
              key={seg.category}
              cx="130"
              cy="130"
              r="100"
              fill="none"
              stroke={seg.color}
              strokeWidth="32"
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-slate-900" data-testid="donut-center-value">
            {centerValue || `${Math.round(transformPct)}%`}
          </div>
          <div className="text-xs text-slate-500 max-w-[120px] leading-tight mt-1">
            {centerLabel || (language === "de" ? "KI-Transformation" : "AI Transformation")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm w-full max-w-xs">
        {CATEGORY_ORDER.map(cat => {
          const pct = percentages[cat];
          if (pct <= 0) return null;
          return (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: CATEGORIES[cat].color }} />
              <span className="text-slate-600 truncate">
                {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
              </span>
              <span className="font-semibold text-slate-800 ml-auto">{pct.toFixed(0)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
