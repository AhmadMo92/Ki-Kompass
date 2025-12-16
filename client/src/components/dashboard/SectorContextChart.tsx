import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sectorContextData } from "@/lib/mockData";
import { useState } from "react";

export function SectorContextChart() {
  const [focusBar, setFocusBar] = useState<number | null>(null);

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
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
              onMouseMove={(state: any) => {
                if (state.isTooltipActive) {
                  setFocusBar(state.activeTooltipIndex);
                } else {
                  setFocusBar(null);
                }
              }}
              onMouseLeave={() => setFocusBar(null)}
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
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="exposure" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
                animationDuration={1000}
              >
                {sectorContextData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={focusBar === index ? "hsl(var(--chart-4))" : "hsl(var(--primary))"}
                    opacity={focusBar === index ? 1 : 0.7}
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
