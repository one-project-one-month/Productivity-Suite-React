import { useState } from 'react';
import TotalBalance from './components/TotalBalance';
import SetMonthlyBudget from './components/MonthlyBudget';
import { Transactions } from './components/Transactions';
//import { ExpensePieChart } from './components/ExpenseChart';
import { useMutation } from '@tanstack/react-query';
import { patchBudget } from './components/setBudgetApi';

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);

  const [dialogOpen, setDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: patchBudget,
    onSuccess: (updated) => {
      setTotalBudget(10);
      //setTotalBudget(updated.amount);
      setDialogOpen(false);
      console.log(updated);
    },
  });

  const handleSave = (addedAmount: number) => {
    mutation.mutate(totalBudget + addedAmount);
  };

  return (
    <>
      {mutation.isError && <p>Error updating budget</p>}
      <div className="bg-white rounded-xl shadow-lg p-6">//</div>
      <div className="border border-gray-300 rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <TotalBalance
            totalBudget={totalBudget}
            onEdit={() => setDialogOpen(true)}
          />

          <SetMonthlyBudget
            initialBudget={totalBudget}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSave}
          />
        </div>

        <div>
          {/* <div className="w-full md:w-2/3 p-4"></div>
          <div className="w-full md:w-1/3 p-4"> */}
          {/* <ExpensePieChart /> */}
          <Transactions />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default BudgetTracker;
