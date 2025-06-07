import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter } from 'lucide-react';
import { SearchInput } from '@/components/todo-list/search-input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import TodoItem from './TodoItem';
import { useQuery } from '@tanstack/react-query';
import { getTodos } from '@/api/todo';

// Define the Todo interface
interface Todo {
  completedAt: number | null;
  createdAt: number;
  description: string;
  dueAt: number;
  id: number;
  priorityCode: number;
  priorityValue: string;
  statusCode: number;
  categoryId: number;
  statusValue: string;
  title: string;
  updatedAt: number;
}

// Define the API response interface
interface TodosResponse {
  data: Todo[];
}

// Skeleton component for todo items
const TodoSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg mb-2">
    <Skeleton className="h-4 w-4 rounded" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  </div>
);

const TodoListContainer = () => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter states - dynamically populated
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>(
    {}
  );

  // Priority filter states - dynamically populated
  const [priorityFilters, setPriorityFilters] = useState<
    Record<string, boolean>
  >({});

  const { data: todos, isLoading } = useQuery<TodosResponse>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const todoData: Todo[] = todos?.data || [];

  // Initialize filters when data is loaded
  useEffect(() => {
    if (todoData.length > 0) {
      // Get unique status values and set all to true
      const uniqueStatuses = [
        ...new Set(todoData.map((todo) => todo.statusValue)),
      ];
      const statusFilterObj = uniqueStatuses.reduce((acc, status) => {
        acc[status] = true;
        return acc;
      }, {} as Record<string, boolean>);

      // Get unique priority values and set all to true
      const uniquePriorities = [
        ...new Set(todoData.map((todo) => todo.priorityValue)),
      ];
      const priorityFilterObj = uniquePriorities.reduce((acc, priority) => {
        acc[priority] = true;
        return acc;
      }, {} as Record<string, boolean>);

      // Only update if filters are empty (initial load)
      if (Object.keys(statusFilters).length === 0) {
        setStatusFilters(statusFilterObj);
      }
      if (Object.keys(priorityFilters).length === 0) {
        setPriorityFilters(priorityFilterObj);
      }
    }
  }, [todoData, statusFilters, priorityFilters]);

  // Filter and search logic
  const filteredTodos = useMemo(() => {
    if (todoData.length === 0) return [];

    return todoData.filter((todo) => {
      // Search filter - check title and description
      const matchesSearch =
        searchQuery === '' ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter - check if the todo's status is enabled (default to true if not set)
      const matchesStatus =
        Object.keys(statusFilters).length === 0 ||
        statusFilters[todo.statusValue] !== false;

      // Priority filter - check if the todo's priority is enabled (default to true if not set)
      const matchesPriority =
        Object.keys(priorityFilters).length === 0 ||
        priorityFilters[todo.priorityValue] !== false;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [todoData, searchQuery, statusFilters, priorityFilters]);

  // Handler functions for filters
  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked,
    }));
  };

  const handlePriorityFilterChange = (priority: string, checked: boolean) => {
    setPriorityFilters((prev) => ({
      ...prev,
      [priority]: checked,
    }));
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <Card className="w-full gap-0">
      <CardHeader className="gap-4 flex flex-col md:flex-row justify-between mb-6">
        <CardTitle className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-left">
          Your Tasks
        </CardTitle>
        <div className="flex gap-2">
          <SearchInput
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(statusFilters).map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={statusFilters[status]}
                  onCheckedChange={(checked) =>
                    handleStatusFilterChange(status, checked)
                  }
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuLabel className="mt-4">
                Filter By Priority
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(priorityFilters).map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={priorityFilters[priority]}
                  onCheckedChange={(checked) =>
                    handlePriorityFilterChange(priority, checked)
                  }
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <TodoSkeleton key={index} />
            ))}
          </div>
        )}
        {!isLoading && filteredTodos.length === 0 && (
          <div className="text-center text-gray-500">
            {todoData.length === 0
              ? 'No tasks available. Please add a new task.'
              : 'No tasks match your current search or filters.'}
          </div>
        )}
        {!isLoading && filteredTodos.length > 0 && (
          <div className="">
            {filteredTodos.map((todo: Todo) => (
              <TodoItem key={todo.id} todoData={todo} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoListContainer;
