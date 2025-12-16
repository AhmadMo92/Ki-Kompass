import { MyRoleTasks } from "@/components/role-descriptor/MyRoleTasks";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyRole() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-6 py-4 max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-serif font-medium text-primary">
              My Role & Tasks
            </h1>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              Skip to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <MyRoleTasks />
      </main>
    </div>
  );
}
