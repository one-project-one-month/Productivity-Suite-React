// Shared types for Todo components

export interface TodoData {
  completedAt: number | null;
  createdAt: number;
  description: string;
  dueAt: number | null;
  id: number;
  priorityCode: number;
  priorityValue: string;
  statusCode: number;
  statusValue: string;
  categoryId: number;
  title: string;
  updatedAt: number;
}

export interface TodoItemProps {
  todoData: TodoData;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface PriorityOption {
  value: string;
  label: string;
}

export interface TodoUpdateData {
  id?: number;
  title?: string;
  description?: string;
  priority?: number;
  status?: string | number;
  categoryId?: number;
  dueAt?: number | null;
  completedAt?: number | null;
}

// Constants
export const PRIORITY_CODES = {
  High: 3,
  Medium: 2,
  Low: 1,
} as const;

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { value: '1', label: 'To-do' },
  { value: '2', label: 'In-Progress' },
  { value: '3', label: 'Waiting' },
  { value: '4', label: 'Done' },
  { value: '5', label: 'Archived' },
];

// Utility functions
export const getPriorityCode = (priorityValue: string): number => {
  return PRIORITY_CODES[priorityValue as keyof typeof PRIORITY_CODES] || 1;
};

export const isCompleted = (completedAt: number | null): boolean => {
  return completedAt !== null && completedAt > 1;
};
