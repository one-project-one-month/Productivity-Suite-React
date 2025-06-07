import api from '@/api';
import transactionRoutes from "./route";
import { buildURL } from '@/lib/stringUtils';
import type { TransactionForm } from '@/app/features/budgetTracker/components/Transactions';

export const getAllTransaction = async () =>
  await api.get(transactionRoutes.transaction);

export const createCategory = async (payload: TransactionForm) =>
  await api.post(transactionRoutes.transaction, payload);

export const showCategory = async (id: number) =>
  await api.get(buildURL(transactionRoutes.transaction_id, { id }));

export const updateCategory = async (id: number, payload: TransactionForm) =>
  await api.put(buildURL(transactionRoutes.transaction_id, { id }), payload);

export const deleteCategory = async (id: number) =>
  await api.delete(buildURL(transactionRoutes.transaction_id, { id }));