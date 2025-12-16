import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface QuadrantChartProps {
  primaryRole: {
    changePressure: number; // 0-100 mapped from Low/Med/High
    opportunityAlignment: number; // 0-100
    label: string;
  };
  secondaryRole?: {
    changePressure: number;
    opportunityAlignment: number;
    label: string;
  } | null;
}

export function QuadrantChart({ primaryRole, secondaryRole }: QuadrantChartProps) {
  const data = [
    { x: primaryRole.changePressure, y: primaryRole.opportunityAlignment, name: primaryRole.label, type: "primary" },
    ...(secondaryRole ? [{ x: secondaryRole.changePressure, y: secondaryRole.opportunityAlignment, name: secondaryRole.label, type: "secondary" }] : [])
  ];

  return (
    <Card className="h-full border-none shadow-sm bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-primary font-serif">Strategic Positioning</CardTitle>
        <CardDescription>
          Change Pressure vs. Opportunity Alignment
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Change Pressure" 
                domain={[0, 100]} 
                tick={false}
                label={{ value: 'Change Pressure →', position: 'bottom', offset: 0, fontSize: 12, fill: 'var(--color-muted-foreground)' }} 
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Opportunity" 
                domain={[0, 100]} 
                tick={false}
                label={{ value: 'Opportunity ↑', angle: -90, position: 'left', offset: 0, fontSize: 12, fill: 'var(--color-muted-foreground)' }} 
              />
              <ZAxis range={[100, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Quadrant Backgrounds (Conceptual) */}
              <ReferenceLine x={50} stroke="var(--color-border)" />
              <ReferenceLine y={50} stroke="var(--color-border)" />

              <Scatter name="Roles" data={data}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === "primary" ? "var(--color-primary)" : "var(--color-chart-4)"} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[10px] text-muted-foreground flex justify-between mt-2 px-4">
          <span>High Change / Low Opportunity</span>
          <span>High Change / High Opportunity</span>
        </div>
      </CardContent>
    </Card>
  );
}
