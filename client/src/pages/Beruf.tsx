import { useMemo, useState } from "react";
import { useParams, Link } from "wouter";
import { findOccupationBySlug } from "@/lib/data";
import { OccupationDashboard } from "@/components/role-descriptor/OccupationDashboard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Compass, Languages } from "lucide-react";

export default function Beruf() {
  const params = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<"en" | "de">("en");

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

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-6 py-3 max-w-[1400px] flex items-center justify-between">
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

      <main className="container mx-auto px-6 py-6 max-w-[1400px]">
        <OccupationDashboard
          occupationKey={key}
          occupation={occupation}
          language={language}
        />
        <p className="text-center text-xs text-muted-foreground mt-6">
          {language === "de"
            ? "Daten basierend auf BERUFENET der Bundesagentur für Arbeit. 5-Kategorien Scoring v1.3."
            : "Data based on BERUFENET from German Federal Employment Agency. 5-category scoring v1.3."}
        </p>
      </main>
    </div>
  );
}
