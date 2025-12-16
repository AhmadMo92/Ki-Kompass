import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { skillDynamicsData } from "@/lib/mockData";

export function SkillDynamicsChart() {
  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-primary font-serif">Skill Change Dynamics</CardTitle>
        <CardDescription>
          This shows how quickly skill requirements evolve, not job loss.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={skillDynamicsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="year" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 100]}
              />
              <Tooltip 
                 contentStyle={{ 
                  backgroundColor: 'var(--color-popover)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="intensity" 
                stroke="var(--color-chart-1)" 
                fillOpacity={1} 
                fill="url(#colorIntensity)" 
                strokeWidth={3}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
