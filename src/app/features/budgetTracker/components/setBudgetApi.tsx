import api from '@/api';

export interface BudgetData {
  amount: number;
}

export interface Transaction {
  amount: number;
  description: string;
  transactionDate: number;
  categoryId: number;
}

export const patchBudget = async (amount: number): Promise<BudgetData> => {
  const response = await api.patch('/v1/auth/set-amount', { amount });
  return response.data;
};

// fetchTransactions returns Transaction[] or empty array if no transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/v1/transactions');
  return response.data?.data ?? [];
};

// calculate total spent, fallback to 0 if no transactions
export const fetchTotalTransactionAmount = async (): Promise<number> => {
  const transactions = await fetchTransactions();
  if (!transactions.length) {
    return 0; // no transactions, total spent = 0
  }
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
};

//Category API

export interface Category {
  categoryId: number;
  name: string;
}

// Fetch Category
export const fetchCategory = async (): Promise<Category[]> => {
  const response = await api.get('/v1/categories?type=3');
  return response.data?.data ?? [];
};

// Post Income Data
export interface IncomePayload {
  category: string;
  amount: number;
}
export const postIncome = async ({ category, amount }: IncomePayload) => {
  const response = await api.post('/v1/incomes', {
    category,
    amount,
  });

  return response.data;
};


