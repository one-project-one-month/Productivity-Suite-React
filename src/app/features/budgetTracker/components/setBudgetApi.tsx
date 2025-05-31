import api from '@/api';

export interface BudgetData {
  amount: number;
}

export const patchBudget = async (amount: number): Promise<BudgetData> => {
  const response = await api.patch('/v1/auth/set-amount', { amount });
  return response.data;
};

export const fetchBudget = async (): Promise<BudgetData> => {
  const response = await api.get('/v1/auth/setting');
  return response.data;
};
