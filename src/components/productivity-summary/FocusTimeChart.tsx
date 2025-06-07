import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';

const chartData = [
  { date: "31.5.2025", totalFocusTime: 600 },
  { date: "1.6.2025", totalFocusTime: 1200 },
  { date: "2.6.2025", totalFocusTime: 3640 },
  { date: "3.6.2025", totalFocusTime: 1805 },
  { date: "4.6.2025", totalFocusTime: 4833 },
  { date: "5.6.2025", totalFocusTime: 2403 },
  { date: "6.6.2025", totalFocusTime: 5000 },
];

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}min ` : ''}
  ${secs > 0 ? `${secs}s ` : ''}`;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0];
    const seconds = data.value;
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <div className="font-medium text-blue-600">{formatTime(seconds)}</div>
      </div>
    );
  }
  return null;
};

const chartConfig = {
  totalFocusTime: {
    label: 'Focus Time ',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function FocusTimeChart() {
  return (
    <Card className="lg:w-full border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Focus Time (Last 7 Days )</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={5}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Line
              dataKey="totalFocusTime"
              type="natural"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
