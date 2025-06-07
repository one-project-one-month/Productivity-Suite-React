// ExpenseChart.tsx
import { Pie, PieChart, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExpensePieChartProps {
  transactions: {
    category: string;
    amount: string;
    color: string;
  }[];
}

export function ExpensePieChart({ transactions }: ExpensePieChartProps) {
  // Process transactions data for the chart
  const categoryTotals = transactions.reduce((acc, tx) => {
    const amount = parseFloat(tx.amount) || 0;
    acc[tx.category] = {
      amount: (acc[tx.category]?.amount || 0) + amount,
      color: tx.color // Store the color from the transaction
    };
    return acc;
  }, {} as Record<string, { amount: number; color: string }>);

  const chartData = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    amount: data.amount,
    fill: data.color // Use the color from the transaction data
  }));

  const total = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {chartData.length > 0 ? (
          <>
            <div className="mx-auto w-full max-w-md aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} MMK`, 'Amount']}
                    labelFormatter={(label) => `${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {chartData.map((item) => {
                const percentage = ((item.amount / total) * 100).toFixed(0);
                return (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span>{item.category}</span>
                    </div>
                    <span className="font-medium">
                      {item.amount.toFixed(2)} MMK ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No expense data to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}