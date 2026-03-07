import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { OccupationSearch } from "./OccupationSearch";
import { OccupationDashboard } from "./OccupationDashboard";
import {
  occupations, getOccupation,
  CATEGORIES, CATEGORY_ORDER
} from "@/lib/data";
import {
  Sparkles, ArrowRight, Languages, Building2
} from "lucide-react";

export function MyRoleTasks() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState<"en" | "de">("en");

  const occupation = useMemo(() => selectedKey ? getOccupation(selectedKey) : undefined, [selectedKey]);

  const handleAnalyze = () => {
    if (occupation) {
      setStep(2);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedKey("");
  };

  const occCount = Object.keys(occupations).length;

  return (
    <section className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/60 py-16" data-testid="my-role-tasks-section">
      <div className="container mx-auto px-6 max-w-[1400px]">

        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {language === "de" ? "Forschungsdaten" : "Research Data"}
            </div>

            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${language === 'de' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>DE</span>
                <Switch
                  checked={language === 'en'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'de')}
                  data-testid="language-toggle"
                />
                <span className={`text-sm ${language === 'en' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>EN</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif text-primary mb-3">
            {language === "de" ? "Meine Rolle analysieren" : "Analyze My Role"}
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-4">
            {language === "de"
              ? `${occCount} deutsche Berufe, 5.885 Aufgaben — auf Aufgabenebene analysiert.`
              : `${occCount} German occupations, 5,885 tasks — analyzed at task level.`}
          </p>

          {step === 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-6 h-6 rounded-full flex items-center justify-center border bg-primary text-primary-foreground border-primary">1</div>
                {language === "de" ? "Beruf wählen" : "Select Role"}
              </div>
              <div className="w-8 h-px bg-border"></div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 rounded-full flex items-center justify-center border border-border">2</div>
                {language === "de" ? "Analyse ansehen" : "View Analysis"}
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500" data-testid="step-1-card">
              <CardHeader>
                <CardTitle className="font-serif">
                  {language === "de" ? "Finden Sie Ihren Beruf" : "Find your occupation"}
                </CardTitle>
                <CardDescription>
                  {language === "de"
                    ? `Suchen Sie aus ${occCount} deutschen Berufen mit 5-Kategorien KI-Analyse.`
                    : `Search from ${occCount} German occupations with 5-category AI analysis.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <OccupationSearch
                  value={selectedKey}
                  onSelect={setSelectedKey}
                  language={language}
                />

                {occupation && (
                  <div className="p-5 rounded-xl bg-secondary/30 border border-border/40 animate-in fade-in duration-300" data-testid="selected-job-preview">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-primary">
                          {language === "de" ? occupation.occupation_de : selectedKey}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3" /> {occupation.sector}
                        </p>
                      </div>
                      <Badge className="text-xs bg-slate-100 text-slate-600">
                        {occupation.summary.total} {language === "de" ? "Aufgaben" : "tasks"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center">
                      {CATEGORY_ORDER.map(cat => {
                        const count = occupation.summary[cat];
                        const pct = occupation.summary.total > 0 ? Math.round((count / occupation.summary.total) * 100) : 0;
                        if (pct === 0) return (
                          <div key={cat} className="p-2 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg + '80' }}>
                            <div className="text-lg font-bold" style={{ color: CATEGORIES[cat].color }}>—</div>
                            <div className="text-[10px]" style={{ color: CATEGORIES[cat].color }}>
                              {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                            </div>
                          </div>
                        );
                        return (
                          <div key={cat} className="p-2 rounded-lg" style={{ backgroundColor: CATEGORIES[cat].bg }}>
                            <div className="text-lg font-bold" style={{ color: CATEGORIES[cat].color }}>{pct}%</div>
                            <div className="text-[10px]" style={{ color: CATEGORIES[cat].color }}>
                              {language === "de" ? CATEGORIES[cat].label_de : CATEGORIES[cat].label_en}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={!selectedKey}
                    className="w-full md:w-auto px-8"
                    data-testid="analyze-button"
                  >
                    {language === "de" ? "Analyse starten" : "Start Analysis"} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && occupation && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700" data-testid="step-2-analysis">
            <OccupationDashboard
              occupationKey={selectedKey}
              occupation={occupation}
              language={language}
              onReset={handleReset}
            />
            <p className="text-center text-xs text-muted-foreground mt-6">
              {language === "de"
                ? "Daten basierend auf BERUFENET der Bundesagentur für Arbeit. 5-Kategorien Scoring v1.3."
                : "Data based on BERUFENET from German Federal Employment Agency. 5-category scoring v1.3."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
