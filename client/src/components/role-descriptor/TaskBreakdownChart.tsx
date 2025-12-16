import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskBreakdownChartProps {
  data: {
    augmented: number;
    automated: number;
    human: number;
  };
}

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  const chartData = [
    { name: "Augmented", value: data.augmented, fill: "var(--color-chart-1)" },
    { name: "Automated", value: data.automated, fill: "var(--color-chart-3)" },
    { name: "Stable Human", value: data.human, fill: "var(--color-chart-2)" },
  ];

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg text-primary font-serif">Task Interaction Breakdown</CardTitle>
        <CardDescription>
          Based on the tasks described in your role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              barSize={30}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
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
