import { CategoryLabel } from "@/lib/data";
import { AlertTriangle, Shield, Heart, Lightbulb, Clock } from "lucide-react";

interface InsightCardsProps {
  percentages: Record<CategoryLabel, number>;
  sensitiveCount: number;
  language: "en" | "de";
}

interface InsightCard {
  icon: React.ReactNode;
  emoji: string;
  title_de: string;
  title_en: string;
  message_de: string;
  message_en: string;
  color: string;
  bg: string;
}

export function InsightCards({ percentages, sensitiveCount, language }: InsightCardsProps) {
  const cards: InsightCard[] = [];
  const highExposurePct = (percentages.automatable || 0) + (percentages.high_ai_potential || 0);

  if (highExposurePct > 40) {
    cards.push({
      icon: <AlertTriangle className="w-5 h-5" />,
      emoji: "⚠️",
      title_de: "Hohe KI-Exposition",
      title_en: "High AI Exposure",
      message_de: `${Math.round(highExposurePct)}% deiner Tätigkeiten sind stark KI-exponiert. Fokussiere dich auf die grünen Aufgaben — die bleiben menschlich geführt.`,
      message_en: `${Math.round(highExposurePct)}% of your tasks are highly AI-exposed. Focus on the green tasks — they remain human led.`,
      color: "#E53935",
      bg: "#FFEBEE",
    });
  }

  if (sensitiveCount > 0) {
    cards.push({
      icon: <Shield className="w-5 h-5" />,
      emoji: "🟣",
      title_de: "Regulierter Bereich",
      title_en: "Regulated Domain",
      message_de: `${sensitiveCount} Tätigkeiten sind technisch automatisierbar, aber durch Regulierung geschützt. Verstehe die Compliance-Anforderungen.`,
      message_en: `${sensitiveCount} tasks are technically automatable but protected by regulation. Understand the compliance requirements.`,
      color: "#8E24AA",
      bg: "#F3E5F5",
    });
  }

  if ((percentages.human_led || 0) > 50) {
    cards.push({
      icon: <Heart className="w-5 h-5" />,
      emoji: "🟢",
      title_de: "Starke menschliche Basis",
      title_en: "Strong Human Foundation",
      message_de: "Mehr als die Hälfte deiner Arbeit ist menschlich geführt. Das ist dein Wettbewerbsvorteil.",
      message_en: "More than half of your work is human led. That's your competitive advantage.",
      color: "#43A047",
      bg: "#E8F5E9",
    });
  }

  if ((percentages.ai_assisted || 0) > 60) {
    cards.push({
      icon: <Lightbulb className="w-5 h-5" />,
      emoji: "🟡",
      title_de: "Augmentierungspotenzial",
      title_en: "Augmentation Potential",
      message_de: `${Math.round(percentages.ai_assisted)}% deiner Aufgaben werden durch KI-Tools verbessert. Investiere in KI-Kompetenz.`,
      message_en: `${Math.round(percentages.ai_assisted)}% of your tasks will be enhanced by AI tools. Invest in AI skills.`,
      color: "#F9A825",
      bg: "#FFFDE7",
    });
  }

  cards.push({
    icon: <Clock className="w-5 h-5" />,
    emoji: "⏳",
    title_de: "Zeitlicher Ausblick",
    title_en: "Temporal Outlook",
    message_de: "In 2-3 Jahren werden die orangenen Aufgaben wahrscheinlich voll automatisiert. Die gelben rücken nach.",
    message_en: "In 2-3 years, orange tasks will likely be fully automated. Yellow tasks will follow.",
    color: "#546E7A",
    bg: "#ECEFF1",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="insight-cards">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-xl border p-4 flex gap-3"
          style={{ backgroundColor: card.bg, borderColor: card.color + '30' }}
          data-testid={`insight-card-${i}`}
        >
          <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.color + '20', color: card.color }}>
            {card.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm flex items-center gap-1.5" style={{ color: card.color }}>
              {language === "de" ? card.title_de : card.title_en}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {language === "de" ? card.message_de : card.message_en}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
