import api from '@/api';
import categoryRoutes from '@/api/categories/route.ts';
import type { CategoryForm } from '@/app/features/category';
import { buildURL } from '@/lib/stringUtils.ts';

export const getAllCategories = async (params: string = '') =>
  await api.get(categoryRoutes.category + `?${params}`);

export const createCategory = async (payload: CategoryForm) =>
  await api.post(categoryRoutes.category, payload);

export const showCategory = async (id: number) =>
  await api.get(buildURL(categoryRoutes.category_id, { id }));

export const updateCategory = async (id: number, payload: CategoryForm) =>
  await api.put(buildURL(categoryRoutes.category_id, { id }), payload);

export const deleteCategory = async (id: number) =>
  await api.delete(buildURL(categoryRoutes.category_id, { id }));
