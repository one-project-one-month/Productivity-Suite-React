import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
    import {
      Card,
      CardContent,
      CardFooter,
      CardHeader,
      CardTitle,
    } from '@/components/ui/card';
    import {
      type ChartConfig,
      ChartContainer,
      ChartTooltip,
      ChartTooltipContent,
    } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query'; 
import { getSummaryData, getExpenseData , getExpenseDataFilter } from '@/api/summary';


export default function ExpenseDetailChart() {

      const { data } = useQuery({
        queryKey: ['categories&currencies'],
        queryFn: getSummaryData,
      });
      const { data: expenses } = useQuery({
        queryKey: ['expenses'],
        queryFn: getExpenseData,
      });
      const chart: any = [];
      expenses?.map((item) => {
        chart.push(item);
      });

      const chartData = chart.map((entry) => {
        const newEntry = {};
        for (const key in entry) {
          // Keep 'date' as-is, lowercase others
          const newKey = key === 'date' ? key : key.toLowerCase();
          newEntry[newKey] = entry[key];
        }
        return newEntry;
      });

      const categories : any = [];
      data?.categories?.map((item)=>{
        categories.push(item)
      })
      const chartConfig = categories?.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {}) satisfies Record<string, { label: string; color: string }>;

      return (
        <Card className='grid grid-cols-1 items-center'>
          {/* CHART */}
          <div className='col-span-3'>
            <Card className="flex flex-col border-0 shadow-2xl ">
              <CardHeader>
                <CardTitle>Expense Detail Chart by Date</CardTitle>
              </CardHeader>
              <div className="grid lg:grid-cols-3">
                <div className="col-span-2 ">
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <BarChart
                        accessibilityLayer
                        data={chartData}
                        className="w-full "
                      >
                        <CartesianGrid vertical={true} />
                        <YAxis
                          tickLine={false}
                          axisLine={true}
                          tickMargin={20}
                          tickFormatter={(value) => `${value} $`} // Optional: format as
                        />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          tickMargin={5}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 8)}
                        />
                        <ChartTooltip
                          cursor={true}
                          content={<ChartTooltipContent indicator="dashed" />}
                        />
                        {categories.map((item) => (
                          <Bar
                            key={item.key}
                            dataKey={item.key}
                            fill={item.color}
                            barSize={50}
                            maxBarSize={80}
                          />
                        ))}
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      );
    }



