import { Link } from "wouter";
import { ArrowRight, Brain, Layout, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50/50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-fuchsia-400/20 opacity-30 blur-[100px] animate-blob"></div>
        <div className="absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-400/20 opacity-30 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute left-10 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-400/20 opacity-30 blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* SECTION 1: HERO */}
      <section className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary tracking-tight leading-tight drop-shadow-sm">
            AI is not replacing most jobs.<br />
            It is <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 font-extrabold animate-in fade-in duration-1000 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] filter brightness-110 pb-2">reshaping</span> tasks.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            This platform helps you understand how AI is changing work — based on tasks, skills, and real labor-market evidence.
          </p>
        </div>
        
        <div className="text-sm font-medium text-primary/80 bg-white/50 backdrop-blur-md border border-primary/10 px-6 py-3 rounded-full shadow-sm inline-block">
          Explains structural patterns. Does not predict individual outcomes.
        </div>
      </section>

      {/* SECTION 2: EXPLORE PATHS */}
      <section className="py-32 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
             <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Choose your perspective</h2>
             <p className="text-lg text-slate-500 max-w-xl mx-auto">Whether you're an individual worker or a strategic planner, we have the right lens for you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-start">
            
            {/* CARD 1: EXPLORE ROLES */}
            <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200 hover:border-blue-300 group h-full flex flex-col bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden mt-8">
              <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pt-8 pb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Layout className="w-7 h-7" />
                </div>
                <CardTitle className="font-serif text-2xl text-slate-800">Explore roles</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed text-slate-600">
                  Compare different job profiles. See how AI typically affects tasks, skills, and demand across sectors.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex flex-wrap gap-2 mt-2">
                   <span className="text-[11px] font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Comparisons</span>
                   <span className="text-[11px] font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Analysis</span>
                 </div>
              </CardContent>
              <CardFooter className="pb-8">
                <Link href="/dashboard">
                  <Button variant="ghost" className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:pr-2 transition-all font-medium text-base">
                    Browse Catalog <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 2: UNDERSTAND TASKS (EMPHASIZED) */}
            <Card className="hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.3)] hover:-translate-y-2 transition-all duration-500 border-indigo-100 bg-white/90 backdrop-blur-xl group relative h-full flex flex-col rounded-3xl overflow-hidden shadow-xl ring-1 ring-indigo-50 z-10">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-200">
                Recommended
              </div>
              
              <CardHeader className="pt-10 pb-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:rotate-6 transition-transform duration-500 shadow-indigo-100 shadow-lg border border-indigo-100">
                  <ListChecks className="w-8 h-8" />
                </div>
                <CardTitle className="font-serif text-3xl text-slate-900">My Task Analysis</CardTitle>
                <CardDescription className="text-lg mt-4 text-slate-600 leading-relaxed font-medium">
                  Deep dive into your specific daily tasks. Identify exactly which parts of your work are ripe for AI augmentation vs. automation.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="space-y-3 mt-2">
                   <div className="flex items-center text-sm text-slate-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
                     Personalized breakdown
                   </div>
                   <div className="flex items-center text-sm text-slate-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
                     Actionable insights
                   </div>
                   <div className="flex items-center text-sm text-slate-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
                     Skill gap identification
                   </div>
                 </div>
              </CardContent>
              <CardFooter className="pb-10 pt-4">
                <Link href="/my-role">
                  <Button size="lg" className="w-full h-14 text-lg shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 transition-all text-white border-0 rounded-2xl group-hover:shadow-indigo-300">
                    Start Your Analysis
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 3: BIG PICTURE */}
            <Card className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200 hover:border-teal-300 group h-full flex flex-col bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden mt-8">
              <div className="h-2 w-full bg-gradient-to-r from-teal-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pt-8 pb-4">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 text-teal-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Brain className="w-7 h-7" />
                </div>
                <CardTitle className="font-serif text-2xl text-slate-800">Macro Trends</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed text-slate-600">
                  Zoom out to see the labor market as a whole. Understand how entire industries are shifting.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex flex-wrap gap-2 mt-2">
                   <span className="text-[11px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Research</span>
                   <span className="text-[11px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Data</span>
                 </div>
              </CardContent>
              <CardFooter className="pb-8">
                <Link href="/big-picture">
                  <Button variant="ghost" className="w-full justify-between text-teal-600 hover:text-teal-700 hover:bg-teal-50 group-hover:pr-2 transition-all font-medium text-base">
                    View Data <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

          </div>
        </div>
      </section>

      {/* SECTION 4: TRUST & FOOTER */}
      <footer className="bg-white border-t border-border/60 py-12 mt-auto">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground font-medium">
            <span>Built on labor-market research, not hype</span>
            <span className="hidden md:inline">•</span>
            <span>Task- and skill-based, not job predictions</span>
            <span className="hidden md:inline">•</span>
            <span>Designed for workers, educators, and policymakers</span>
          </div>
          
          <Separator className="w-24 mx-auto bg-border/60" />
          
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Methodology</a>
            <a href="#" className="hover:text-primary transition-colors">Sources</a>
            <a href="#" className="hover:text-primary transition-colors">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
