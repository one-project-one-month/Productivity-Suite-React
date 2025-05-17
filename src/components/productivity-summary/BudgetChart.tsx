import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
const chartData = [
  { browser: "spent", balance: 40, fill: "var(--color-spent)" },
  { browser: "remaining", balance: 60, fill: "var(--color-remaining)" },
];

const ChartConfig = {
  balance: {
    label: "balance",
    color: "hsl(var(--chart-1))",
  },
  spent: {
    label: "spent",
    color: "#117864",
  },
  remaining: {
    label: "remaining",
    color: "#45b39d",
  },
} satisfies ChartConfig;

export default function BudgetChart() {
    return (
      <Card className="flex flex-col w-full border-0 shadow-xl">
        <CardHeader className="items-center pb-0 mb-6">
          <CardTitle>Budget Spent</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-2 mt-2">
          <ChartContainer
            config={ChartConfig}
            className="mx-auto max-h-[250px]"
          >
            <PieChart >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="balance" nameKey="browser" 
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
                      {payload.balance}%
                    </text>
                  );
                }}/>
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

