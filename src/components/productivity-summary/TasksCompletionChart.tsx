import { Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
const chartData = [
    { browser: "completed", tasks: 75, fill: "var(--color-completed)" },
    { browser: "active", tasks: 25, fill: "var(--color-active)" },
];

const ChartConfig = {
  tasks: {
    label: "Tasks",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "completed",
    color: "#1a5276",
  },
  active: {
    label: "active",
    color: "#2980b9",
  },
} satisfies ChartConfig;

export default function TaskCompletionChart() {
    return (
      <Card className="flex flex-col w-full border-0 shadow-2xl">
        <CardHeader className="items-center ">
          <CardTitle>Task Completion Chart</CardTitle>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={ChartConfig}
            className="aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="tasks"
                nameKey="browser"
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsla(var(--foreground))"
                      className="font-bold"
                    >
                      {payload.tasks}%
                    </text>
                  );
                }}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="browser" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
}
