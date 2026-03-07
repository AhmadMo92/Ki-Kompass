import { Link } from "wouter";
import { ArrowRight, Compass, BarChart3, Bot, Sparkles, ChevronRight, Map, Layers, Zap, Shield, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const JOURNEY_STEPS = [
  {
    num: "01",
    title: "Discover",
    title_sub: "Understand your AI exposure",
    description: "Select your occupation from 522 German roles. See exactly how AI touches each of your tasks across a 5-category spectrum — from fully automatable to human-led.",
    color: "#6366F1",
    bg: "#EEF2FF",
    icon: Compass,
  },
  {
    num: "02",
    title: "Analyze",
    title_sub: "Map your skills & tools",
    description: "Dive into your 118-competency skill profile. See which skills connect to AI tools, where augmentation helps, and where human judgment stays essential.",
    color: "#0891B2",
    bg: "#ECFEFF",
    icon: Layers,
  },
  {
    num: "03",
    title: "Navigate",
    title_sub: "Plan your path forward",
    description: "Compare against sector averages, identify skill gaps, and discover which AI tools can amplify your strengths. Your personal AI readiness companion.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: Map,
  },
];

const FEATURES = [
  { icon: BarChart3, label: "5,885 Tasks Analyzed", color: "#6366F1" },
  { icon: Zap, label: "5-Category Spectrum", color: "#F59E0B" },
  { icon: Shield, label: "Regulation Built In", color: "#10B981" },
  { icon: Users, label: "522 Occupations", color: "#0891B2" },
  { icon: Bot, label: "AI Tools Layer", color: "#7C3AED" },
  { icon: BookOpen, label: "118 Competencies", color: "#EC4899" },
];

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

      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-3">Your journey in three steps</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">From awareness to action — a guided path through the AI transformation of your work.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={i} className="relative group" data-testid={`journey-step-${i}`}>
                  <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(to right, ${step.color}40, ${step.color})` }} />

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border"
                        style={{ backgroundColor: step.bg, borderColor: step.color + '20' }}>
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>
                          Step {step.num}
                        </div>
                        <div className="text-xl font-bold text-slate-800">{step.title}</div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-slate-700 mb-2">{step.title_sub}</div>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{step.description}</p>

                    {i < 2 && (
                      <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-md flex items-center justify-center">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/my-role">
              <Button size="lg" className="h-12 px-8 text-base rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all" data-testid="cta-start-journey">
                Start with Step 01 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 relative z-10">
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
                  "Donut chart with 5-category task breakdown",
                  "Skill radar across 6 competency domains",
                  "Sector comparison with stacked bars",
                  "Interactive AI Tools Map connecting skills to tools",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>
                    <span className="text-sm text-slate-600">{item}</span>
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

      <section className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-2xl shadow-violet-100/50">
                <div className="space-y-3">
                  {[
                    { icon: "🔍", title: "Task Awareness", desc: "Which of my tasks can AI assist with?", progress: 100 },
                    { icon: "🧠", title: "Skill Mapping", desc: "How do my competencies connect to AI tools?", progress: 75 },
                    { icon: "🛠️", title: "Tool Discovery", desc: "Which AI tools match my work profile?", progress: 40 },
                    { icon: "🎯", title: "Action Plan", desc: "What should I learn or adopt next?", progress: 10 },
                  ].map((phase, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100/60">
                      <span className="text-xl">{phase.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700">{phase.title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{phase.progress}%</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{phase.desc}</div>
                        <div className="h-1 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-all duration-1000"
                            style={{ width: `${phase.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-fuchsia-100 rounded-full blur-2xl opacity-60" />
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
