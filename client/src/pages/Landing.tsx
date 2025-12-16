import { Link } from "wouter";
import { ArrowRight, Brain, Layout, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col">
      
      {/* SECTION 1: HERO */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary tracking-tight leading-tight">
            AI is not replacing most jobs.<br />
            It is reshaping tasks, skills, and expectations.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            This platform helps you understand how AI is changing work — based on tasks, skills, and real labor-market evidence.
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/40 inline-block">
          Explains structural patterns. Does not predict individual outcomes.
        </div>
      </section>

      {/* SECTION 2: WHAT THIS PLATFORM DOES */}
      <section className="bg-secondary/20 border-y border-border/40 py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border/50">
                <ListChecks className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Task-based analysis</h3>
              <p className="text-sm text-muted-foreground">Focus on activities, not alarming job loss headlines.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border/50">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Research-backed insights</h3>
              <p className="text-sm text-muted-foreground">Built on data from OECD, IAB, and labor economics.</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-border/50">
                <Layout className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Calm explanations</h3>
              <p className="text-sm text-muted-foreground">Clear context without predictions or career advice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE PATHS */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-serif font-medium text-center text-primary mb-12">Choose how you want to explore</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARD 1: EXPLORE ROLES */}
            <Card className="hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30 group h-full flex flex-col">
              <CardHeader>
                <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">Explore roles like mine</CardTitle>
                <CardDescription className="text-base mt-2">
                  See how AI typically affects tasks, skills, and demand across roles and sectors.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">Task transformation</span>
                   <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">Skill change</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Explore roles <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 2: UNDERSTAND TASKS (EMPHASIZED) */}
            <Card className="hover:shadow-xl transition-all duration-300 border-primary/20 bg-primary/5 hover:border-primary/40 group relative h-full flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Start Here
              </div>
              <CardHeader>
                <CardTitle className="font-serif text-xl text-primary">Understand my tasks</CardTitle>
                <CardDescription className="text-base mt-2 text-foreground/80">
                  Select a role or confirm typical tasks. See which parts of the work are supported by AI, automated, or remain human.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs bg-white/50 border border-primary/10 px-2 py-1 rounded text-primary/80">Job-Futuromat-style</span>
                   <span className="text-xs bg-white/50 border border-primary/10 px-2 py-1 rounded text-primary/80">No CV</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/my-role">
                  <Button size="lg" className="w-full shadow-md group-hover:shadow-lg transition-all">
                    Describe my role <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 3: BIG PICTURE */}
            <Card className="hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/30 group h-full flex flex-col">
              <CardHeader>
                <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">Understand the bigger picture</CardTitle>
                <CardDescription className="text-base mt-2">
                  A research-based view of how AI is reshaping skills, hiring, and labor demand overall.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                 <div className="flex gap-2 flex-wrap mt-2">
                   <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">Trends</span>
                   <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">Patterns</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Link href="/big-picture">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
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
