import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.number().optional(),
  priority: z.number().min(1).max(3),
  completedAt: z.number().optional(),
  dueAt: z.number().optional(), // in milliseconds
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
