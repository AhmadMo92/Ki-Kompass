import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskBreakdownChartProps {
  data: {
    human: number;
    ai_assisted: number;
    automation: number;
  };
}

const COLORS = {
  human: "#22c55e",
  ai_assisted: "#3b82f6",
  automation: "#f59e0b",
};

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  const chartData = [
    { name: "Human-Centric", value: data.human, fill: COLORS.human },
    { name: "AI-Assisted", value: data.ai_assisted, fill: COLORS.ai_assisted },
    ...(data.automation > 0 ? [{ name: "Automation", value: data.automation, fill: COLORS.automation }] : []),
  ];

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary font-serif">AI Exposure Breakdown</CardTitle>
        <CardDescription>
          Task distribution across AI interaction categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              barSize={32}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={90} 
                tick={{ fill: 'var(--color-foreground)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'var(--color-accent)', opacity: 0.2 }}
                contentStyle={{ 
                  backgroundColor: 'var(--color-popover)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number) => [`${value}%`, "Share of Tasks"]}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground text-center italic">
          AI affects tasks within roles, not entire jobs.
        </div>
      </CardContent>
    </Card>
  );
}
