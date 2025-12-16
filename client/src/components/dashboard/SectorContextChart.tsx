import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sectorContextData } from "@/lib/mockData";

export function SectorContextChart() {
  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary font-serif">Sector Context</CardTitle>
        <CardDescription>
          AI exposure levels by major industry sectors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sectorContextData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="sector" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Bar 
                dataKey="exposure" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
                opacity={0.8}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
