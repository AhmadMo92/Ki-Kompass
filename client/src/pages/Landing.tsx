import { Link } from "wouter";
import {
  ArrowRight, Compass, BarChart3, Bot, Sparkles,
  Map, Layers, Zap, Shield, Users, BookOpen,
  SlidersHorizontal, GitCompareArrows, Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, CATEGORY_ORDER } from "@/lib/data";

const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Discover",
    subtitle: "Understand your AI exposure",
    description: "Select your occupation from 522 German roles. See how AI touches each task across a 5-category spectrum.",
    color: "#6366F1",
    bg: "#EEF2FF",
    icon: Compass,
    keywords: ["522 roles", "5 categories", "Task-level"],
  },
  {
    num: "02",
    title: "Analyze",
    subtitle: "Map your skills & tools",
    description: "Dive into your 118-competency skill profile. See which skills connect to AI tools and where human judgment stays essential.",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: Layers,
    keywords: ["118 skills", "6 domains", "Radar chart"],
  },
  {
    num: "03",
    title: "Customize",
    subtitle: "Make it yours",
    description: "Borrow tasks from other roles, toggle what applies to you, compare across occupations, and build your personal AI profile.",
    color: "#D946EF",
    bg: "#FDF4FF",
    icon: SlidersHorizontal,
    keywords: ["Borrow tasks", "Compare roles", "Personal profile"],
  },
  {
    num: "04",
    title: "Navigate",
    subtitle: "Plan your path forward",
    description: "Match AI tools to your work, identify growth areas, and build your readiness roadmap with your AI companion.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: Map,
    keywords: ["AI tools map", "Skill gaps", "Roadmap"],
  },
];

const FEATURES = [
  { icon: BarChart3, label: "5,885 Tasks", color: "#6366F1" },
  { icon: Zap, label: "5-Category Spectrum", color: "#F59E0B" },
  { icon: Shield, label: "Regulation Built In", color: "#10B981" },
  { icon: Users, label: "522 Occupations", color: "#0891B2" },
  { icon: Bot, label: "AI Tools Layer", color: "#7C3AED" },
  { icon: BookOpen, label: "118 Competencies", color: "#EC4899" },
];

function DashboardSnapshot() {
  const dummyDist = [
    { cat: "automatable", pct: 8 },
    { cat: "high_ai_potential", pct: 18 },
    { cat: "sensitive", pct: 4 },
    { cat: "ai_assisted", pct: 42 },
    { cat: "human_led", pct: 28 },
  ];

  const radarPoints = [
    { label: "Cognitive", pct: 0.6 },
    { label: "Social", pct: 0.35 },
    { label: "Digital", pct: 0.85 },
    { label: "Operational", pct: 0.25 },
    { label: "Domain", pct: 0.45 },
    { label: "Technical", pct: 0.55 },
  ];

  const radarSize = 160;
  const radarCx = radarSize / 2;
  const radarCy = radarSize / 2;
  const radarR = radarSize * 0.34;

  const radarPath = radarPoints.map((p, i) => {
    const angle = (i / radarPoints.length) * Math.PI * 2 - Math.PI / 2;
    const x = radarCx + radarR * p.pct * Math.cos(angle);
    const y = radarCy + radarR * p.pct * Math.sin(angle);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") + " Z";

  const toolNodes = [
    { x: 30, y: 25, r: 10, color: "#7C3AED", icon: "✍️" },
    { x: 80, y: 18, r: 8, color: "#0891B2", icon: "📈" },
    { x: 55, y: 55, r: 12, color: "#EA580C", icon: "⚙️" },
    { x: 20, y: 65, r: 7, color: "#2563EB", icon: "🔬" },
    { x: 90, y: 50, r: 9, color: "#DB2777", icon: "🎨" },
    { x: 65, y: 80, r: 8, color: "#854D0E", icon: "🏥" },
    { x: 40, y: 85, r: 7, color: "#374151", icon: "💻" },
  ];
  const toolLinks = [
    [0, 2], [1, 2], [0, 3], [2, 4], [2, 5], [4, 6], [3, 6], [1, 4], [5, 6],
  ];

  return (
    <div className="relative">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl shadow-violet-100/40 overflow-hidden">
        <div className="grid grid-cols-4 gap-3 p-5 pb-3">
          {[
            { label: "Tasks", value: "5,885", color: "#6366F1" },
            { label: "Skills", value: "118", color: "#0891B2" },
            { label: "AI Tools", value: "25", color: "#7C3AED" },
            { label: "Sectors", value: "7", color: "#10B981" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-3 text-center">
              <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-0 border-t border-slate-100/60">
          <div className="p-5 border-r border-slate-100/80">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Task Breakdown</div>
            <div className="flex items-center justify-center mb-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                {(() => {
                  let cum = 0;
                  return dummyDist.map((d, i) => {
                    const start = cum;
                    cum += d.pct;
                    const startAngle = (start / 100) * Math.PI * 2 - Math.PI / 2;
                    const endAngle = (cum / 100) * Math.PI * 2 - Math.PI / 2;
                    const large = d.pct > 50 ? 1 : 0;
                    const r = 40;
                    const cx = 50, cy = 50;
                    const x1 = cx + r * Math.cos(startAngle);
                    const y1 = cy + r * Math.sin(startAngle);
                    const x2 = cx + r * Math.cos(endAngle);
                    const y2 = cy + r * Math.sin(endAngle);
                    return (
                      <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`}
                        fill={CATEGORIES[d.cat as keyof typeof CATEGORIES].color} opacity={0.85} />
                    );
                  });
                })()}
                <circle cx="50" cy="50" r="18" fill="white" />
              </svg>
            </div>
            <div className="space-y-1">
              {dummyDist.map(d => (
                <div key={d.cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIES[d.cat as keyof typeof CATEGORIES].color }} />
                    <span className="text-[9px] text-slate-500">
                      {CATEGORIES[d.cat as keyof typeof CATEGORIES].label_en}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold tabular-nums" style={{ color: CATEGORIES[d.cat as keyof typeof CATEGORIES].color }}>
                    {d.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 border-r border-slate-100/80 flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3 self-start">Skill Radar</div>
            <svg viewBox={`0 0 ${radarSize} ${radarSize}`} className="w-full max-w-[160px]">
              {[0.33, 0.66, 1].map(s => (
                <polygon key={s} fill="none" stroke="#e2e8f0" strokeWidth={0.5}
                  points={radarPoints.map((_, i) => {
                    const a = (i / radarPoints.length) * Math.PI * 2 - Math.PI / 2;
                    return `${radarCx + radarR * s * Math.cos(a)},${radarCy + radarR * s * Math.sin(a)}`;
                  }).join(" ")} />
              ))}
              <path d={radarPath} fill="rgba(99,102,241,0.15)" stroke="#6366F1" strokeWidth={1.5} />
              {radarPoints.map((p, i) => {
                const a = (i / radarPoints.length) * Math.PI * 2 - Math.PI / 2;
                const px = radarCx + radarR * p.pct * Math.cos(a);
                const py = radarCy + radarR * p.pct * Math.sin(a);
                const lx = radarCx + (radarR + 16) * Math.cos(a);
                const ly = radarCy + (radarR + 16) * Math.sin(a);
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r={2.5} fill="#6366F1" />
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontSize={7} fill="#64748b" fontWeight={500}>
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="p-5 flex flex-col">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">AI Tools Map</div>
            <svg viewBox="0 0 120 110" className="w-full flex-1">
              {toolLinks.map(([a, b], i) => (
                <line key={i}
                  x1={toolNodes[a].x} y1={toolNodes[a].y}
                  x2={toolNodes[b].x} y2={toolNodes[b].y}
                  stroke="#cbd5e1" strokeWidth={1} opacity={0.4} />
              ))}
              {toolNodes.map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={n.r + 1} fill={n.color} opacity={0.85} />
                  <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize={n.r * 0.85}>
                    {n.icon}
                  </text>
                </g>
              ))}
              {[
                { x: 45, y: 38, r: 3, color: "#94a3b8" },
                { x: 70, y: 42, r: 3, color: "#94a3b8" },
                { x: 35, y: 55, r: 2.5, color: "#94a3b8" },
                { x: 75, y: 65, r: 2.5, color: "#94a3b8" },
                { x: 50, y: 70, r: 3, color: "#94a3b8" },
              ].map((sk, i) => (
                <circle key={`sk-${i}`} cx={sk.x} cy={sk.y} r={sk.r} fill={sk.color} opacity={0.4} />
              ))}
            </svg>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-slate-50/60 border-t border-slate-100/60">
          <div className="flex h-3.5 rounded-full overflow-hidden">
            {dummyDist.map(d => (
              <div key={d.cat} className="h-full"
                style={{ width: `${d.pct}%`, backgroundColor: CATEGORIES[d.cat as keyof typeof CATEGORIES].color }} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-100 rounded-full blur-2xl opacity-50" />
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-100 rounded-full blur-2xl opacity-50" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col relative overflow-hidden" data-testid="landing-page">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50/50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 opacity-20 blur-[100px] animate-blob"></div>
        <div className="absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-400/20 opacity-20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute left-10 bottom-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-violet-400/20 opacity-20 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-border/30">
        <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Compass className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">KI Kompass</span>
            <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100 ml-1">BETA</span>
          </div>
          <Link href="/my-role">
            <Button size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md h-9 px-5 text-sm" data-testid="header-cta">
              Start <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center max-w-5xl mx-auto relative z-10 animate-in fade-in duration-700">
        <div className="space-y-8">
          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50/60 px-4 py-1.5 text-sm font-medium text-violet-700 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-violet-500" />
            Your AI Workforce Intelligence Companion
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight leading-[1.08]">
            Navigate the AI shift<br />
            with <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 font-extrabold pb-1">clarity</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            AI isn't replacing your job — it's transforming <em className="text-slate-700 font-normal">how</em> you work.
            KI Kompass maps every task, skill, and tool to help you stay ahead.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
            <Link href="/my-role">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all hover:-translate-y-0.5" data-testid="cta-journey">
                <Compass className="w-5 h-5 mr-2" />
                Begin Your Journey
              </Button>
            </Link>
            <Link href="/my-role">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-slate-200 hover:bg-white hover:border-indigo-200 shadow-sm transition-all" data-testid="cta-explore">
                Explore 522 Roles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 px-6 relative z-10">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-500" data-testid={`feature-badge-${i}`}>
                <f.icon className="w-4 h-4" style={{ color: f.color }} />
                <span className="font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10" data-testid="journey-section">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">Your journey, step by step</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">From awareness to action — a guided path through the AI transformation of your work.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px" style={{
              background: `linear-gradient(to bottom, ${JOURNEY_STEPS[0].color}, ${JOURNEY_STEPS[1].color}, ${JOURNEY_STEPS[2].color}, ${JOURNEY_STEPS[3].color})`
            }} />

            <div className="space-y-0">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={i} className="relative group" data-testid={`journey-step-${i}`}>
                  <div className="hidden md:block absolute left-8 top-8 w-8 h-px" style={{ backgroundColor: step.color + '40' }} />
                  <div className="hidden md:flex absolute left-[18px] top-[18px] w-[22px] h-[22px] rounded-full border-[3px] items-center justify-center z-10 bg-white transition-all duration-300 group-hover:scale-125"
                    style={{ borderColor: step.color }}>
                    <div className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: step.color }} />
                  </div>

                  <div className="md:ml-20 mb-4">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:border-slate-200 transition-all duration-400 group-hover:-translate-x-0.5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full rounded-r opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: step.color }} />

                      <div className="flex items-start gap-5 pl-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: step.bg, borderColor: step.color + '20' }}>
                          <step.icon className="w-5 h-5" style={{ color: step.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums" style={{ color: step.color }}>
                              {step.num}
                            </span>
                            <span className="text-lg font-bold text-slate-800">{step.title}</span>
                            <span className="text-xs text-slate-400 font-medium hidden sm:inline">— {step.subtitle}</span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed mb-3">{step.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {step.keywords.map(k => (
                              <span key={k} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                                style={{ color: step.color, backgroundColor: step.bg, borderColor: step.color + '25' }}>
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/my-role">
              <Button size="lg" className="h-12 px-8 text-base rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all" data-testid="cta-start-journey">
                Start with Step 01 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10" data-testid="dashboard-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight">
                Your personal AI exposure cockpit
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                A holistic view of how AI intersects with your role. Task-level analysis, skill radar, sector benchmarks, and an interactive AI tools map — all in one place.
              </p>
              <div className="space-y-3">
                {[
                  { text: "Donut chart with 5-category task breakdown", icon: BarChart3, color: "#6366F1" },
                  { text: "Skill radar across 6 competency domains", icon: Network, color: "#0891B2" },
                  { text: "Sector comparison with stacked bars", icon: GitCompareArrows, color: "#10B981" },
                  { text: "Interactive AI Tools Map", icon: Bot, color: "#7C3AED" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: item.color + '12' }}>
                      <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-2xl shadow-indigo-100/50">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { label: "Tasks", value: "5,885", color: "#6366F1" },
                    { label: "Skills", value: "118", color: "#0891B2" },
                    { label: "AI Tools", value: "25", color: "#7C3AED" },
                    { label: "Sectors", value: "7", color: "#10B981" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 text-center">
                      <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl flex items-center justify-center border border-indigo-100/50">
                  <div className="flex items-center gap-3 text-slate-400">
                    <BarChart3 className="w-8 h-8 text-indigo-300" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-500">Live Dashboard</div>
                      <div className="text-[11px] text-slate-400">Select a role to see your data</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-violet-100 rounded-full blur-2xl opacity-60" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-100 rounded-full blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10" data-testid="companion-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <DashboardSnapshot />
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
                <Bot className="w-4 h-4" />
                Companion
              </div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 leading-tight">
                Not just a report —<br />a companion for the shift
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                KI Kompass grows with you. Track your AI readiness journey over time, from initial task awareness through skill development to confident tool adoption.
              </p>
              <div className="space-y-3">
                {[
                  "Understand which tasks AI can augment or automate",
                  "Map your skills to emerging AI tool categories",
                  "Identify growth areas and protected capabilities",
                  "Build your personal AI readiness roadmap",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    </div>
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
            Ready to understand your AI future?
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Join the workers, educators, and policymakers already using KI Kompass to navigate the AI transformation.
          </p>
          <Link href="/my-role">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all hover:-translate-y-0.5" data-testid="cta-final">
              <Compass className="w-5 h-5 mr-2" />
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-white/80 backdrop-blur-md border-t border-border/40 py-10 mt-auto">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-5">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-700">KI Kompass</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium">
            <span>Built on labor-market research, not hype</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Task- and skill-based, not job predictions</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Designed for workers, educators, and policymakers</span>
          </div>
          <Separator className="w-24 mx-auto bg-border/40" />
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span>BERUFENET Data | German Federal Employment Agency</span>
            <span className="text-slate-300">|</span>
            <span>v1.4 Dataset | 5-Category Scoring</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
