import { useState } from 'react';
import TotalBalance from './components/TotalBalance';
import SetMonthlyBudget from './components/MonthlyBudget';
// import { ExpensePieChart } from './components/ExpenseChart';
import { Transactions } from './components/Transactions';

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
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
            onSave={(newBudget) => setTotalBudget(newBudget)}
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
