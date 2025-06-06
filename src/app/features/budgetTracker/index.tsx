import { useState } from 'react';
import TotalBalance from './components/TotalBalance';
import SetMonthlyBudget from './components/MonthlyBudget';
import CategoryProgressTracker from './components/CategoryProgressTracker';
import { Transactions } from './components/Transactions';
//import { ExpensePieChart } from './components/ExpenseChart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  patchBudget,
  fetchTotalTransactionAmount,
  getTotalSpentByCategory,
  postIncome,
  deleteIncome,
  fetchIncomes,
  fetchCurrency,
} from './components/setBudgetApi';
//import type { Income } from './components/setBudgetApi';

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [deleteMessage, setDeleteMessage] = useState('');

  // Mutation to update budget amount
  const mutation = useMutation({
    mutationFn: patchBudget,
    onSuccess: (updated) => {
      setTotalBudget(updated.amount);
      setDialogOpen(false);
      console.log('Budget updated:', updated);
    },
  });
  const handleSave = (addedAmount: number) => {
    mutation.mutate(totalBudget + addedAmount);
  };

  // === GET Transaction===
  const { data: totalSpent, isError: isTotalError } = useQuery({
    queryKey: ['totalTransactionAmount'],
    queryFn: fetchTotalTransactionAmount,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });
  const safeTotalSpent = totalSpent ?? 0;

  // === GET Category ===
  type Category = {
    id: number;
    name: string;
    description?: string;
  };

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const categoryID = selectedCategory?.id;

  const { data: totalSpentCategory } = useQuery({
    queryKey: ['totalTransactionAmount', categoryID],
    queryFn: () => getTotalSpentByCategory(categoryID!),
    enabled: !!categoryID,
  });
  const safetotalSpentCategory = totalSpentCategory ?? 0;
  console.log(safetotalSpentCategory);

  // === POST Income ===
  const incomeMutation = useMutation({
    mutationFn: postIncome,
    onSuccess: (data) => {
      console.log('Income posted successfully:', data);

      queryClient.invalidateQueries({ queryKey: ['incomes'] });
    },
    onError: (error) => {
      console.error('Error posting income:', error);
    },
  });

  const handlePostIncome = (
    categoryId: number,
    amount: number,
    onSuccess?: (incomeId: number) => void
  ) => {
    incomeMutation.mutate(
      { categoryId, amount },
      {
        onSuccess: (data) => {
          console.log('Income posted:', data);

          if (onSuccess && data.id) {
            onSuccess(data.id);
          }
        },
      }
    );
  };

  // === DELETE Income ===
  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] }); // ✅ Trigger refetch
      setDeleteMessage('Budget deleted successfully!');
      setTimeout(() => setDeleteMessage(''), 3000);
      console.log('Budget deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting income:', error);
      setDeleteMessage('Failed to delete income');
      setTimeout(() => setDeleteMessage(''), 3000);
    },
  });

  const handleDeleteIncome = (id: number) => {
    deleteMutation.mutate(id);
  };

  // === GET Income ===
  const { data: incomes } = useQuery({
    queryKey: ['incomes'],
    queryFn: fetchIncomes,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
  });

  const totalIncome = incomes
    ? incomes.reduce((sum, income) => sum + income.amount, 0)
    : 0;

  //====GET Currency ===
  const { data: currencySummary } = useQuery({
    queryKey: ['currency'],
    queryFn: fetchCurrency,
    refetchInterval: 5000,
  });
  const currency = currencySummary?.currencyCode?? 'UUU';




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
            // totalBudget={totalBudget}
            totalBudget={totalIncome}
            safeTotalSpent={safeTotalSpent}
            currencyCode={currency}
            //onEdit={() => setDialogOpen(true)}
          />

          <SetMonthlyBudget
            initialBudget={totalBudget}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSave}
          />
        </div>

        <div className="border border-gray-300 rounded-xl shadow-lg p-6 mb-5 bg-white">
          {deleteMessage && (
            <div
              style={{
                background: '#f87171',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '6px',
                marginBottom: '16px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
              role="alert"
            >
              {deleteMessage}
            </div>
          )}
          <CategoryProgressTracker
            onCategoryChange={(category) => setSelectedCategory(category)}
            onPostIncome={handlePostIncome}
            onDeleteIncome={handleDeleteIncome}
            totalSpentByCategory={safetotalSpentCategory}
            lockedSpentAmount={safetotalSpentCategory}
            incomes={incomes}
          />
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
