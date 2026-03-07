import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import { findOccupationBySlug, calculatePercentages, calculateFromTasks, CATEGORIES, CATEGORY_ORDER, CategoryLabel, SECTOR_AVERAGES, searchTasks, TaskItem } from "@/lib/data";
import { DonutChart } from "@/components/role-descriptor/DonutChart";
import { SkillTaskExplorer } from "@/components/role-descriptor/SkillTaskExplorer";
import { SectorComparison } from "@/components/role-descriptor/SectorComparison";
import { InsightCards } from "@/components/role-descriptor/InsightCards";
import { PersonalizedResults } from "@/components/role-descriptor/PersonalizedResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Compass, Languages, Building2, Target, Info, ArrowRight, Search } from "lucide-react";

export default function Beruf() {
  const params = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<"en" | "de">("en");
  const [deselectedTasks, setDeselectedTasks] = useState<Set<string>>(new Set());
  const [showPersonalized, setShowPersonalized] = useState(false);

  const result = useMemo(() => findOccupationBySlug(params.slug || ""), [params.slug]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-serif text-primary">Beruf nicht gefunden</h1>
          <Link href="/my-role">
            <Button>Alle Berufe durchsuchen</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { key, occupation } = result;
  const typicalPercentages = calculatePercentages(occupation.summary);
  const activeTasks = occupation.tasks.filter(t => !deselectedTasks.has(t.id));
  const personalPercentages = calculateFromTasks(activeTasks);
  const displayPercentages = showPersonalized ? personalPercentages : typicalPercentages;
  const handleToggleTask = (taskId: string) => {
    setDeselectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-serif font-medium text-primary">KI Kompass</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm ${language === 'de' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DE</span>
            <Switch checked={language === 'en'} onCheckedChange={c => setLanguage(c ? 'en' : 'de')} />
            <span className={`text-sm ${language === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>EN</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <div>
          <h2 className="text-3xl font-serif text-primary">
            {language === "de" ? occupation.occupation_de : key}
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4" />
            {occupation.sector}
            
            <span className="text-xs">• {occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          <Card className="md:col-span-5 border-none shadow-sm bg-white/60 flex items-center justify-center py-6">
            <DonutChart percentages={displayPercentages} language={language} />
          </Card>

          <Card className="md:col-span-7 border-none shadow-sm bg-white/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
                <Info className="w-5 h-5" />
                {language === "de" ? "5-Kategorien Analyse" : "5-Category Analysis"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CATEGORY_ORDER.map(cat => {
                const pct = typicalPercentages[cat];
                const count = occupation.summary[cat];
                if (count === 0) return null;
                return (
                  <div key={cat} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{CATEGORIES[cat].emoji}</span>
                      <div>
                        <div className="font-medium text-sm" style={{ color: CATEGORIES[cat].color }}>
                          {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                        </div>
                        <div className="text-xs text-slate-500">
                          {language === "de" ? CATEGORIES[cat].message_de : CATEGORIES[cat].message_en}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold" style={{ color: CATEGORIES[cat].color }}>{pct.toFixed(0)}%</div>
                      <div className="text-xs text-slate-400">{count} {language === "de" ? "Aufg." : "tasks"}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <InsightCards percentages={typicalPercentages} sensitiveCount={occupation.summary.sensitive} language={language} />

        {deselectedTasks.size > 0 && !showPersonalized && (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowPersonalized(true)}>
              {language === "de" ? "Mein Profil berechnen" : "Calculate My Profile"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        <SkillTaskExplorer
          tasks={occupation.tasks}
          occupationKey={key}
          deselectedTasks={deselectedTasks}
          onToggleTask={handleToggleTask}
          language={language}
        />

        {showPersonalized && (
          <PersonalizedResults
            personal={personalPercentages}
            typical={typicalPercentages}
            taskCount={{ selected: activeTasks.length, total: occupation.tasks.length }}
            language={language}
            onReset={() => setShowPersonalized(false)}
          />
        )}

        <SectorComparison
          occupationPercentages={displayPercentages}
          sector={occupation.sector}
          occupationName={language === "de" ? occupation.occupation_de : key}
          language={language}
        />
      </main>
    </div>
  );
}
