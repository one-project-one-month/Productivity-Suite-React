import { useOptimistic, useState } from 'react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { deleteTodo, getTodo, updateTodo } from '@/api/todo';

// Shared types and utilities
import type {
  TodoData,
  TodoItemProps,
  TodoUpdateData,
} from '@/types/todoTypes';
import {
  STATUS_OPTIONS,
  getPriorityCode,
  isCompleted,
} from '@/types/todoTypes';

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  EllipsisVertical,
  CircleAlert,
  SquarePen,
  Trash2,
  CircleCheckBig,
} from 'lucide-react';

// Sub-components
import { TodoEditForm } from './TodoEditForm';
import { toast } from 'sonner';

// Utility functions
const formatDueDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'MMMM d, yyyy');
};

const isOverdue = (dueTimestamp: number): boolean => {
  const now = new Date();
  const dueDate = new Date(dueTimestamp);
  now.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < now;
};

// Custom hooks
const useTodoMutations = (todoId: number) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedData: TodoUpdateData) =>
      updateTodo(todoId, updatedData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['todo', todoId] });

      const previous = queryClient.getQueryData(['todo', todoId]);

      queryClient.setQueryData(['todo', todoId], (old: { data: TodoData }) => ({
        ...old,
        data: {
          ...old.data,
          completedAt: newData.completedAt,
          statusCode: newData.status,
        },
      }));

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['todo', todoId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodo(todoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error('Failed to delete todo:', error);
    },
  });

  return { updateMutation, deleteMutation };
};

// Sub-components
const TodoBadges = ({
  priority,
  status,
  isOverdue,
  dueDate,
}: {
  priority: string;
  status: string;
  isOverdue: boolean;
  dueDate: string | null;
}) => (
  <div className="flex flex-wrap gap-2 mt-2">
    <Badge
      className={cn(
        priority === 'High'
          ? 'bg-red-100 text-red-800'
          : priority === 'Medium'
          ? 'bg-yellow-100 text-yellow-800'
          : priority === 'Low'
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      )}
    >
      {priority}
    </Badge>
    <Badge
      className={cn(
        status === 'To-do' && 'bg-blue-100 text-blue-800',
        status === 'In-progress' && 'bg-yellow-100 text-yellow-800',
        status === 'Done' && 'bg-green-100 text-green-800',
        status === 'Archived' && 'bg-gray-100 text-gray-800'
      )}
    >
      {status}
    </Badge>
    {isOverdue && (
      <Badge className="bg-[#FEE2E2] text-[#991B1B]">Overdue</Badge>
    )}
    <Badge className="bg-[#f3f4f6] text-[#1f293f]">
      Due: {dueDate || 'No due date'}
    </Badge>
  </div>
);

const TodoContent = ({
  todo,
  isCompleted,
  onToggleComplete,
}: {
  todo: TodoData;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) => {
  const formattedDueDate = todo.dueAt ? formatDueDate(todo.dueAt) : null;
  const taskIsOverdue = todo.dueAt ? isOverdue(todo.dueAt) : false;
  console.log(todo.statusCode === 4);

  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onToggleComplete}
        className="text-gray-400 mt-1 cursor-pointer hover:text-gray-600 transition-colors"
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted ? (
          <CircleCheckBig className="h-5 w-5 text-green-500" />
        ) : (
          <CircleAlert className="h-5 w-5" />
        )}
      </button>
      <div>
        <h3
          className={cn(
            'font-medium text-gray-900 dark:text-white',
            isCompleted && 'line-through text-gray-500'
          )}
        >
          {todo.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {todo.description}
        </p>
        <TodoBadges
          priority={todo.priorityValue}
          isOverdue={taskIsOverdue}
          status={todo.statusValue}
          dueDate={formattedDueDate}
        />
      </div>
    </div>
  );
};

const ViewDialog = ({
  open,
  onOpenChange,
  todo,
  onMarkComplete,
  isUpdating,
  isCompleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoData;
  onMarkComplete: () => void;
  isUpdating: boolean;
  isCompleted: boolean;
}) => {
  const formattedDueDate = todo.dueAt ? formatDueDate(todo.dueAt) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{todo.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h4>
            <p className="mt-1">{todo.description || 'No description'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h4>
              <p className="mt-1 capitalize">{todo.statusValue}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Priority
              </h4>
              <p className="mt-1 capitalize">{todo.priorityValue}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Due Date
              </h4>
              <p className="mt-1">{formattedDueDate || 'No due date'}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {!isCompleted && (
            <Button
              disabled={isUpdating || isCompleted}
              onClick={onMarkComplete}
            >
              Mark as Completed
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialog = ({
  open,
  onOpenChange,
  todoTitle,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todoTitle: string;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{todoTitle}"? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant="destructive" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Main component
const TodoItem = ({ todoData }: TodoItemProps) => {
  // State
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Query and mutations
  const { data } = useQuery({
    queryKey: ['todo', todoData.id],
    queryFn: () => getTodo(todoData.id),
    initialData: todoData,
  });

  const { updateMutation, deleteMutation } = useTodoMutations(todoData.id);
  const todo = data?.data || todoData;

  // Optimistic update for completion status
  const [optimisticTodo, addOptimisticUpdate] = useOptimistic(
    todo,
    (currentTodo: TodoData, optimisticUpdate: Partial<TodoData>) => ({
      ...currentTodo,
      ...optimisticUpdate,
    })
  );

  // Computed values - Updated with additional condition
  const todoIsCompleted =
    isCompleted(optimisticTodo.completedAt) || optimisticTodo.statusCode === 4;

  // Handlers
  const handleToggleComplete = () => {
    const newCompletedAt = todoIsCompleted ? 1 : Date.now() - 10000;
    const newStatus = todoIsCompleted ? 1 : 4; // Status 1 for incomplete, 4 for complete

    // Optimistically update the UI immediately with both completedAt and statusCode
    addOptimisticUpdate({
      completedAt: newCompletedAt,
      statusCode: newStatus,
    });

    updateMutation.mutate({
      id: todo.id,
      title: todo.title,
      status: newStatus,
      categoryId: todo.categoryId,
      description: todo.description,
      completedAt: newCompletedAt,
      priority: getPriorityCode(todo.priorityValue),
      dueAt: todo.dueAt,
    });
  };

  const handleMarkComplete = () => {
    const newCompletedAt = Date.now() - 10000;
    // Optimistically update the UI immediately
    addOptimisticUpdate({
      completedAt: newCompletedAt,
    });

    // Close the dialog first to avoid seeing the transition
    setOpenViewDialog(false);

    // Small delay to ensure dialog closes before optimistic update
    setTimeout(() => {
      // Optimistically update the UI
      addOptimisticUpdate({
        completedAt: newCompletedAt,
        statusCode: 4,
      });

      updateMutation.mutate({
        id: todo.id,
        title: todo.title,
        status: 4,
        categoryId: todo.categoryId,
        description: todo.description,
        completedAt: newCompletedAt,
        priority: getPriorityCode(todo.priorityValue),
        dueAt: todo.dueAt,
      });
    }, 100);
    toast.success('Task marked as completed!');
  };

  const handleUpdate = (updatedData: TodoUpdateData) => {
    updateMutation.mutate({
      ...updatedData,
      completedAt: todo.completedAt || 1,
    });
    setOpenEditDialog(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setOpenDeleteDialog(false);
    toast.success('Task deleted successfully!');
  };

  return (
    <>
      <div
        className={cn(
          'border mt-3 rounded-lg p-4 transition-all bg-white dark:bg-gray-800',
          todoIsCompleted && 'bg-gray-50 border-green-200'
        )}
      >
        <div className="flex items-start justify-between">
          <TodoContent
            todo={optimisticTodo}
            isCompleted={todoIsCompleted}
            onToggleComplete={handleToggleComplete}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Todo options">
                <EllipsisVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[8rem]">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpenViewDialog(true)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialogs */}
      <ViewDialog
        open={openViewDialog}
        onOpenChange={setOpenViewDialog}
        todo={optimisticTodo}
        onMarkComplete={handleMarkComplete}
        isUpdating={updateMutation.isPending}
        isCompleted={todoIsCompleted}
      />

      <TodoEditForm
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        todo={todo}
        onSave={handleUpdate}
        isUpdating={updateMutation.isPending}
        statusOptions={STATUS_OPTIONS}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        todoTitle={todo.title}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};

export default TodoItem;
