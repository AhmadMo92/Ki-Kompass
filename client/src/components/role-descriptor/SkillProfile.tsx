import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getOccupationSkillProfile, CATEGORIES, CATEGORY_ORDER, SKILL_CATEGORY_META,
  CategoryLabel, SkillCategory, SkillInfo
} from "@/lib/data";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";

interface SkillProfileProps {
  occupationKey: string;
  language: "en" | "de";
}

export function SkillProfile({ occupationKey, language }: SkillProfileProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const profile = useMemo(() => getOccupationSkillProfile(occupationKey), [occupationKey]);

  if (profile.length === 0) return null;

  const topSkills = profile.slice(0, 12);
  const maxCount = topSkills[0]?.count || 1;

  const categoryGroups = useMemo(() => {
    const groups: Record<SkillCategory, { count: number; skills: string[] }> = {
      cognitive: { count: 0, skills: [] },
      social: { count: 0, skills: [] },
      digital: { count: 0, skills: [] },
      operational: { count: 0, skills: [] },
      domain: { count: 0, skills: [] },
      technical: { count: 0, skills: [] },
    };
    for (const s of profile) {
      const cat = s.skill.category;
      if (groups[cat]) {
        groups[cat].count += s.count;
        groups[cat].skills.push(s.skillId);
      }
    }
    return Object.entries(groups)
      .filter(([, v]) => v.count > 0)
      .sort((a, b) => b[1].count - a[1].count) as [SkillCategory, { count: number; skills: string[] }][];
  }, [profile]);

  const totalLinks = profile.reduce((sum, s) => sum + s.count, 0);

  return (
    <Card className="border-none shadow-sm bg-white/60" data-testid="skill-profile-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
          <Brain className="w-5 h-5" />
          {language === "de" ? "Kompetenzprofil" : "Skills Profile"}
        </CardTitle>
        <CardDescription>
          {language === "de"
            ? `${profile.length} Kompetenzen aus ${totalLinks} Aufgaben-Zuordnungen identifiziert.`
            : `${profile.length} skills identified from ${totalLinks} task-skill links.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2" data-testid="skill-category-chips">
          {categoryGroups.map(([cat, data]) => {
            const meta = SKILL_CATEGORY_META[cat];
            const pct = Math.round((data.count / totalLinks) * 100);
            return (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: meta.color + '40', color: meta.color, backgroundColor: meta.color + '08' }}
                data-testid={`skill-category-chip-${cat}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                {language === "de" ? meta.label_de : meta.label_en}
                <span className="opacity-60">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-2" data-testid="skill-bars">
          {topSkills.map(s => {
            const meta = SKILL_CATEGORY_META[s.skill.category];
            const barWidth = Math.max(8, (s.count / maxCount) * 100);
            const isExpanded = expandedSkill === s.skillId;

            return (
              <div key={s.skillId}>
                <button
                  className="w-full text-left group"
                  onClick={() => setExpandedSkill(isExpanded ? null : s.skillId)}
                  data-testid={`skill-bar-${s.skillId}`}
                >
                  <div className="flex items-center gap-3 py-1.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                    <span className="text-sm font-medium text-slate-700 min-w-0 truncate flex-1">
                      {language === "de" ? s.skill.name_de : s.skill.name_en}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                      {s.count} {language === "de" ? "Aufg." : "tasks"}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full flex overflow-hidden" style={{ width: `${barWidth}%` }}>
                      {CATEGORY_ORDER.map(cat => {
                        const count = s.byLabel[cat];
                        if (count === 0) return null;
                        const segWidth = (count / s.count) * 100;
                        return (
                          <div
                            key={cat}
                            className="h-full"
                            style={{ width: `${segWidth}%`, backgroundColor: CATEGORIES[cat].color }}
                            title={`${CATEGORIES[cat].label_en}: ${count}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="ml-5 mt-2 mb-3 p-3 rounded-lg bg-slate-50 text-sm animate-in fade-in duration-200">
                    <p className="text-slate-600 mb-2">
                      {language === "de" ? s.skill.definition_de : s.skill.definition_en}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: meta.color + '15', color: meta.color }}>
                        {language === "de" ? meta.label_de : meta.label_en}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {CATEGORY_ORDER.map(cat => {
                        const count = s.byLabel[cat];
                        if (count === 0) return null;
                        return (
                          <span key={cat} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: CATEGORIES[cat].bg, color: CATEGORIES[cat].color }}>
                            {CATEGORIES[cat].emoji} {count} {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {profile.length > 12 && (
          <p className="text-xs text-slate-400 text-center">
            {language === "de"
              ? `+ ${profile.length - 12} weitere Kompetenzen`
              : `+ ${profile.length - 12} more skills`}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
