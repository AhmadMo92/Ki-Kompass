import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { taskTransformationData } from "@/lib/mockData";

export function TaskTransformationChart() {
  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary font-serif">Task Transformation</CardTitle>
        <CardDescription>
          AI affects tasks within jobs, not entire jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={taskTransformationData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="augmented" stackId="a" name="Augmented" fill="hsl(var(--chart-1))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="stable" stackId="a" name="Stable Human" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="automated" stackId="a" name="Automated" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
