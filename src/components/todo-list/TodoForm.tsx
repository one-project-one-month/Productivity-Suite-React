import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import {
  createTodoSchema,
  type CreateTodoInput,
} from '@/lib/validations/todo.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTodo, getCategories } from '@/api/todo';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
  typeCode: number;
  typeValue: string;
  createdAt: number;
  updatedAt: number;
}

interface CategoryResponse {
  success: number;
  code: number;
  meta: {
    endpoint: string;
    method: string;
  };
  data: Category[];
  message: string;
  duration: number;
}

const TodoForm = () => {
  const [date, setDate] = useState<Date | undefined>(undefined); // Start with no date selected
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  // Calculate tomorrow's date (minimum selectable date)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0); // Reset time to start of day

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useQuery<CategoryResponse>({
      queryKey: ['categories'],
      queryFn: () => getCategories(),
    });

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 1,
    },
  });

  const watchedPriority = watch('priority');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      toast.success('Task created successfully!');
      setValue('title', '');
      setValue('description', '');
      setValue('priority', 1);
      setDate(undefined);
      setSelectedCategory(undefined);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (err) => {
      console.error('❌ Mutation error:', err);
    },
  });

  const onSubmit = (data: CreateTodoInput) => {
    // console.log('✅ Form submitted', data);
    const dueAt = date ? date.getTime() : undefined;

    const transformedData = {
      ...data,
      status: 1,
      dueAt,
      completedAt: 1,
      categoryId: selectedCategory,
    };

    // console.log('📤 Sending:', transformedData);
    mutation.mutate(transformedData);
  };

  return (
    <Card className="w-full gap-0 pb-24">
      <CardHeader className="gap-0">
        <CardTitle className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-left">
          Create New Task
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                className="mt-2"
                placeholder="Task title"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Describe your task..."
                className="mt-2"
                {...register('description')}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <div className="mt-2">
                <Select
                  value={String(watchedPriority)}
                  onValueChange={(value) => {
                    setValue('priority', Number(value));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Selection with Combobox */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <div className="mt-2">
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="w-full justify-between"
                      disabled={categoriesLoading}
                    >
                      {selectedCategory
                        ? categories.find(
                            (category) => category.id === selectedCategory
                          )?.name
                        : categoriesLoading
                        ? 'Loading categories...'
                        : 'Select category...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.name}
                              onSelect={() => {
                                setSelectedCategory(
                                  category.id === selectedCategory
                                    ? undefined
                                    : category.id
                                );
                                setCategoryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedCategory === category.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{category.name}</span>
                                {category.description && (
                                  <span className="text-sm text-muted-foreground">
                                    {category.description}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="due-date">Due Date</Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal w-full',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => setDate(selected)}
                      disabled={(date) => {
                        // Disable today and all past dates
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <Button type="submit" className="w-full">
            {mutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TodoForm;
