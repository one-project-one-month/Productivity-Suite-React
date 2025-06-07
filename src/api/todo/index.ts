import type { CreateTodoInput } from '@/lib/validations/todo.schema';
import api from '@/api';
import type { TodoUpdateData } from '@/types/todoTypes';

export const createTodo = async (data: CreateTodoInput) => {
  const response = await api.post('/v1/todo-lists', data);
  return response.data;
};

export const getTodos = async () => {
    const response = await api.get('/v1/todo-lists');
    return response.data;
}

export const getTodo = async (id: number) => {
    const response = await api.get(`/v1/todo-lists/${id}`);
    return response.data;
}

export const updateTodo = async (id: number, updatedData: Partial<TodoUpdateData>) => {
  const response = await api.put(`/v1/todo-lists/${id}`, updatedData);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await api.delete(`/v1/todo-lists/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/v1/categories?type=2');
  return response.data;
}
