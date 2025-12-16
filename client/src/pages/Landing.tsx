import { Link } from "wouter";
import { ArrowRight, Brain, Layout, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/80 via-indigo-50/30 to-background -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-10" />

      {/* SECTION 1: HERO */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-tight drop-shadow-sm">
            AI is not replacing most jobs.<br />
            It is <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 font-extrabold animate-in fade-in duration-1000 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] filter brightness-110">reshaping</span> tasks, skills, and expectations.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            This platform helps you understand how AI is changing work — based on tasks, skills, and real labor-market evidence.
          </p>
        </div>
        
        <div className="text-sm font-medium text-primary/80 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-primary/10 shadow-sm inline-block">
          Explains structural patterns. Does not predict individual outcomes.
        </div>
      </section>

      {/* SECTION 2: WHAT THIS PLATFORM DOES */}
      <section className="bg-white/40 border-y border-border/40 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-blue-100 text-blue-600">
                <ListChecks className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Task-based analysis</h3>
              <p className="text-muted-foreground leading-relaxed">Focus on activities, not alarming job loss headlines.</p>
            </div>
            <div className="space-y-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-indigo-100 text-indigo-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Research-backed insights</h3>
              <p className="text-muted-foreground leading-relaxed">Built on data from OECD, IAB, and labor economics.</p>
            </div>
            <div className="space-y-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-teal-100 text-teal-600">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Calm explanations</h3>
              <p className="text-muted-foreground leading-relaxed">Clear context without predictions or career advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE PATHS */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-16">Choose how you want to explore</h2>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            
            {/* CARD 1: EXPLORE ROLES */}
            <Card className="hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-blue-400 group h-full flex flex-col bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:text-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
                  <Layout className="w-5 h-5" />
                </div>
                <CardTitle className="font-serif text-2xl group-hover:text-blue-700 transition-colors">Explore roles like mine</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed">
                  See how AI typically affects tasks, skills, and demand across roles and sectors.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">Task transformation</span>
                   <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">Skill change</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-all">
                    Explore roles <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 2: UNDERSTAND TASKS (EMPHASIZED) */}
            <Card className="hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.6)] hover:-translate-y-2 transition-all duration-300 border-indigo-300 bg-gradient-to-b from-white to-indigo-50/50 group relative h-full flex flex-col transform md:-translate-y-6 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-white/20">
                Start Here
              </div>
              <CardHeader>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300">
                  <ListChecks className="w-5 h-5" />
                </div>
                <CardTitle className="font-serif text-2xl text-indigo-900">Understand my tasks</CardTitle>
                <CardDescription className="text-base mt-3 text-foreground/80 leading-relaxed">
                  Select a role or confirm typical tasks. See which parts of the work are supported by AI, automated, or remain human.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">Job-Futuromat-style</span>
                   <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">No CV</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/my-role">
                  <Button size="lg" className="w-full shadow-lg shadow-indigo-200/50 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-white border-0">
                    Describe my role <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 3: BIG PICTURE */}
            <Card className="hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.4)] hover:-translate-y-1 transition-all duration-300 border-border/60 hover:border-teal-400 group h-full flex flex-col bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mb-4 text-teal-600 group-hover:text-teal-500 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all">
                  <Brain className="w-5 h-5" />
                </div>
                <CardTitle className="font-serif text-2xl group-hover:text-teal-700 transition-colors">Understand the bigger picture</CardTitle>
                <CardDescription className="text-base mt-3 leading-relaxed">
                  A research-based view of how AI is reshaping skills, hiring, and labor demand overall.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md">Trends</span>
                   <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md">Patterns</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/big-picture">
                  <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 transition-all">
                    See the big picture <ArrowRight className="ml-2 w-4 h-4" />
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
