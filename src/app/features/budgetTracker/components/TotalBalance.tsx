import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Props {
  totalBudget: number;
  safeTotalSpent: number;
  onEdit: () => void;
}
//onEdit
const TotalBalance: React.FC<Props> = ({ totalBudget, safeTotalSpent }) => {
  //const totalBalance = 0;
  const spent = safeTotalSpent;
  const remaining = totalBudget - spent;
  const progress = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-green-500">
            {totalBudget - safeTotalSpent} MMK
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
           Total Monthly Budget
          </CardTitle>
          <div className="flex justify-between items-center w-full">
            <CardDescription>
              Budget: {totalBudget.toLocaleString()} MMK
            </CardDescription>
            {/* <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Edit
            </button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-500 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-lg text-green-500">
                {remaining.toLocaleString()} MMK remaining
              </p>
              <p className="text-sm text-gray-600">
                {progress.toFixed(0)}% used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalBalance;
