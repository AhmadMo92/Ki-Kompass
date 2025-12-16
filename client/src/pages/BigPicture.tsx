import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BigPicture() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-serif font-medium text-primary">
              The Big Picture
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-secondary/30 rounded-full mb-4">
             <Globe className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
            How AI is Reshaping the Labor Market
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Three key trends emerging from global workforce research.
          </p>
        </div>

        <div className="grid gap-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="bg-blue-100 p-2 rounded h-fit">
                   <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold">1. Task Augmentation, Not Just Automation</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Unlike previous technology waves that primarily automated routine manual work, generative AI augments cognitive tasks. This means many roles will be <em>supported</em> rather than replaced, increasing productivity but also raising performance expectations.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="bg-emerald-100 p-2 rounded h-fit">
                   <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold">2. The "Skill Crunch"</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     As AI handles routine tasks, the value of human work shifts to "soft" skills: complex problem-solving, empathy, strategic oversight, and ethical judgment. The half-life of technical skills is shortening, making adaptability the most valuable trait.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="bg-purple-100 p-2 rounded h-fit">
                   <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-semibold">3. Uneven Sector Impact</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     Impact varies wildly by industry. IT and Administration face high exposure but different outcomes (augmentation vs. automation). Healthcare and Logistics show more resilience in physical and human-centric tasks, though their administrative layers are transforming.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Explore the Data Dashboard <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
