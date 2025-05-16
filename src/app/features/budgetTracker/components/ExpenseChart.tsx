import { Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const expenseData = [
  { category: 'Food', amount: 1200, fill: '#FF6347' },
  { category: 'Housing', amount: 450, fill: '#4682B4' },
  { category: 'Utilities', amount: 200, fill: '#32CD32' },
  { category: 'Transportation', amount: 150, fill: '#FFD700' },
  { category: 'Entertainment', amount: 100, fill: '#FF69B4' },
  { category: 'Shopping', amount: 100, fill: '#8A2BE2' },
  { category: 'Other', amount: 100, fill: '#00CED1' },
];

const total = expenseData.reduce((sum, item) => sum + item.amount, 0);

export function ExpensePieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl font-bold">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="mx-auto w-full max-w-md aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              />
              <Tooltip
                formatter={(value, name) => [`${value} MMK`, name]}
                labelFormatter={(label) => `${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-1 text-sm text-center">
          {expenseData.map((item) => {
            const percentage = ((item.amount / total) * 100).toFixed(0);
            return (
              <div key={item.category} className="flex justify-start gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full mt-[6px]"
                  style={{ backgroundColor: item.fill }}
                />
                <span>
                  {item.category} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
