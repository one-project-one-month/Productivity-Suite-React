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

// Tranaction GET API
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/v1/transactions');
  return response.data?.data ?? [];
};

//  Tranaction GET API for total spent
export const fetchTotalTransactionAmount = async (): Promise<number> => {
  const transactions = await fetchTransactions();
  if (!transactions.length) {
    return 0; // no transactions, total spent = 0
  }
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
};

//Transaction GET API for category
export const getTotalSpentByCategory = async (
  categoryId: number
): Promise<number> => {
  const transactions = await fetchTransactions();

  const total = transactions
    .filter((tx) => tx.categoryId === categoryId)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return total;
};

//Category API

// Fetch Category
// export const fetchCategory = async (): Promise<Category[]> => {
//   const response = await api.get('/v1/categories?type=3');
//   return response.data?.data ?? [];

// };
type RawCategory = {
  id: number;
  name: string;
  description?: string;
};

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// export const fetchCategory = async (): Promise<Category[]> => {
//   const response = await api.get('/v1/categories?type=3');
//   const data: RawCategory[] = response.data?.data ?? [];
//   return data.map((cat: RawCategory) => ({
//     id: cat.categoryId, // <-- FIXED: map categoryId to id
//     name: cat.name,
//     description: cat.description,
//   }));
// };

export async function fetchCategory(): Promise<Category[]> {
  const response = await api.get('/v1/categories?type=3');

  // Axios responses have the data in `response.data`
  // So extract raw data from there
  const data = response.data?.data ?? response.data ?? [];
  // depending on your API response structure

  // Map the fields properly
  return data.map((item: RawCategory) => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }));
}

// export const fetchCategory = async (): Promise<Category[]> => {
//   const response = await api.get('/v1/categories?type=3');
//   return response.data?.data ?? [];

// };

// Post Income Data
export interface IncomePayload {
  categoryId: number;
  amount: number;
}

export interface IncomeResponse {
  id: number;
  category: number;
  amount: number;
}

export const postIncome = async ({ categoryId, amount }: IncomePayload) => {
  const response = await api.post('/v1/incomes', {
    categoryId,
    amount,
  });

  return response.data;
};

export const deleteIncome = async (incomeId: number) => {
  const response = await api.delete(`/v1/incomes/${incomeId}`);
  return response.data;
};

export interface Income {
  id: number;
  categoryId: number;
  amount: number;
  userId: number;
  //createdAt: string;
}

export const fetchIncomes = async (): Promise<Income[]> => {
  const response = await api.get('/v1/incomes');
  return response.data?.data ?? [];
};

//--Curreny API---
export interface CurrencySummary {
  currencyCode: string;
}

export const fetchCurrency = async (): Promise<CurrencySummary> => {
  const response = await api.get('/v1/auth/me');
  console.log('API currency response:', response.data?.data?.user?.currencyCode);
  
  return {
    currencyCode: response.data?.data?.user?.currencyCode ?? 'DD',
  };
};
