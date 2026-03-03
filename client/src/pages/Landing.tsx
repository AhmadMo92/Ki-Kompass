import { Link } from "wouter";
import { ArrowRight, Brain, ListChecks, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, CATEGORY_ORDER, HERO_OCCUPATIONS, getOccupation, calculatePercentages, slugify } from "@/lib/data";

function MiniDonut({ percentages, size = 64 }: { percentages: Record<string, number>; size?: number }) {
  const radius = 24;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  let offset = -circumference / 4;

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="-rotate-90">
      <circle cx="32" cy="32" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
      {CATEGORY_ORDER.map(cat => {
        const pct = percentages[cat] || 0;
        if (pct <= 0) return null;
        const dashLength = (pct / 100) * circumference;
        const seg = (
          <circle
            key={cat}
            cx="32" cy="32" r={radius}
            fill="none"
            stroke={CATEGORIES[cat].color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dashLength;
        return seg;
      })}
    </svg>
  );
}

function HeroOccupationCard({ occupationKey }: { occupationKey: string }) {
  const occ = getOccupation(occupationKey);
  if (!occ) return null;
  const pcts = calculatePercentages(occ.summary);
  const transformPct = Math.round((pcts.automatable || 0) + (pcts.high_ai_potential || 0));

  return (
    <Link href={`/beruf/${slugify(occupationKey)}`}>
      <div className="group p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer bg-white/60 backdrop-blur-sm" data-testid={`hero-card-${occupationKey}`}>
        <div className="flex items-center gap-3 mb-3">
          <MiniDonut percentages={pcts} />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-slate-800 truncate">{occ.occupation_de}</div>
            <div className="text-xs text-slate-400">{occupationKey}</div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-slate-900">{transformPct}%</span>
          <span className="text-xs text-slate-500 ml-1">KI-Transformation</span>
        </div>
        <div className="flex gap-1 mt-2 justify-center">
          {CATEGORY_ORDER.map(cat => {
            const pct = pcts[cat];
            if (pct <= 0) return null;
            return (
              <div
                key={cat}
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: CATEGORIES[cat].color, minWidth: 3 }}
              />
            );
          })}
        </div>
      </div>
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col relative overflow-hidden">

      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50/50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 opacity-30 blur-[100px] animate-blob"></div>
        <div className="absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-400/20 opacity-30 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute left-10 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-400/20 opacity-30 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-800 backdrop-blur-sm mb-2">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
          522 Berufe | 5.885 Aufgaben | 5 Kategorien
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            <span className="flex items-center justify-center gap-3 mb-2">
              <Compass className="w-12 h-12 md:w-16 md:h-16 text-indigo-600" />
              KI Kompass
            </span>
            <span className="text-3xl md:text-4xl font-light text-slate-600">
              Nicht nur automatisierbar oder nicht —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 font-semibold">sondern wie.</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
            Auf Aufgabenebene, nicht Berufsebene. Regulierung eingebaut. 522 deutsche Berufe, 5.885 Aufgaben.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Link href="/my-role">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" data-testid="cta-analyze">
              Analysiere deine Rolle <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/explore-roles">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-200 hover:bg-white hover:text-slate-900 shadow-sm hover:shadow-md transition-all" data-testid="cta-compare">
              Vergleiche Berufe
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-center text-lg font-serif font-medium text-slate-700 mb-8">
            Beispiel-Berufe im 5-Kategorien Spektrum
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HERO_OCCUPATIONS.map(key => (
              <HeroOccupationCard key={key} occupationKey={key} />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {CATEGORY_ORDER.map(cat => (
              <div key={cat} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CATEGORIES[cat].color }} />
                <span className="text-slate-600">{CATEGORIES[cat].label_de}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Was macht KI Kompass anders?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
            <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200 group h-full flex flex-col bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-red-400 via-orange-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pt-8 pb-4">
                <div className="text-3xl mb-4">🎯</div>
                <CardTitle className="font-serif text-2xl text-slate-800">5 Kategorien statt 2</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed text-slate-600">
                  Nicht nur "automatisierbar" oder "nicht" — sondern ein Spektrum von vollautomatisch bis fest menschlich, inklusive regulierter Bereiche.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-indigo-100 bg-white/90 backdrop-blur-xl group relative h-full flex flex-col rounded-3xl overflow-hidden shadow-xl ring-1 ring-indigo-50">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <CardHeader className="pt-10 pb-4">
                <div className="text-3xl mb-4">📋</div>
                <CardTitle className="font-serif text-2xl text-slate-900">Aufgaben, nicht Berufe</CardTitle>
                <CardDescription className="text-lg mt-4 text-slate-600 leading-relaxed">
                  Jede Aufgabe einzeln bewertet. Du siehst genau, welche Teile deiner Arbeit sich ändern und welche bleiben.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200 group h-full flex flex-col bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pt-8 pb-4">
                <div className="text-3xl mb-4">⚖️</div>
                <CardTitle className="font-serif text-2xl text-slate-800">Regulierung eingebaut</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed text-slate-600">
                  Die "Reguliert/Sensibel" Kategorie ist einzigartig. Kein anderes Tool berücksichtigt EU AI Act und DSGVO Einschränkungen.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border/60 py-12 mt-auto">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium">
            <span>Basiert auf Arbeitsmarktforschung, nicht Hype</span>
            <span className="hidden md:inline">|</span>
            <span>Aufgaben- und kompetenzbasiert</span>
            <span className="hidden md:inline">|</span>
            <span>Für Arbeitnehmer, Bildung und Politik</span>
          </div>

          <Separator className="w-24 mx-auto bg-border/60" />

          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span>BERUFENET-Daten der Bundesagentur für Arbeit</span>
            <span>|</span>
            <span>v1.3 Dataset</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
