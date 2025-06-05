import { useState } from 'react';
import TotalBalance from './components/TotalBalance';
import SetMonthlyBudget from './components/MonthlyBudget';
import CategoryProgressTracker from './components/CategoryProgressTracker';
import { Transactions } from './components/Transactions';
//import { ExpensePieChart } from './components/ExpenseChart';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  patchBudget,
  fetchTotalTransactionAmount,
} from './components/setBudgetApi';

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mutation to update budget amount
  const mutation = useMutation({
    mutationFn: patchBudget,
    onSuccess: (updated) => {
      //setTotalBudget(updated.amount);
      //currently constant amount will change later
      setTotalBudget(10);
      setDialogOpen(false);
      console.log('Budget updated:', updated);
    },
  });

  const handleSave = (addedAmount: number) => {
    mutation.mutate(totalBudget + addedAmount);
  };

  // For fetching transaction data
  const { data: totalSpent, isError: isTotalError } = useQuery({
    queryKey: ['totalTransactionAmount'],
    queryFn: fetchTotalTransactionAmount,
    refetchInterval: 15000, // poll every 15 seconds
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const safeTotalSpent = totalSpent ?? 0;

  return (
    <>
      {mutation.isError && (
        <p className="text-red-600">Error updating budget</p>
      )}
      {isTotalError && (
        <p className="text-red-600">Error loading total spent</p>
      )}

      <div className="border border-gray-300 rounded-xl shadow-lg p-6">
        <div className="mb-5">
          <TotalBalance
            totalBudget={totalBudget}
            safeTotalSpent={safeTotalSpent}
            onEdit={() => setDialogOpen(true)}
          />

          <SetMonthlyBudget
            initialBudget={totalBudget}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSave}
          />
        </div>
        <div className="border border-gray-300 rounded-xl shadow-lg p-6 mb-5 bg-white">
          <CategoryProgressTracker />
        </div>

        <div>
          {/* <ExpensePieChart /> */}
          <Transactions />
        </div>
      </div>
    </>
  );
};

export default BudgetTracker;
