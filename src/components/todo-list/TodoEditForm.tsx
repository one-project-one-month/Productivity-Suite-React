import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

// Shared types and utilities
import type { TodoData, TodoUpdateData } from '@/types/todoTypes';
import { PRIORITY_OPTIONS, getPriorityCode } from '@/types/todoTypes';
import type { StatusOption } from '@/types/todoTypes';

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
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

interface TodoEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: TodoData;
  onSave: (updatedData: TodoUpdateData) => void;
  isUpdating: boolean;
  statusOptions: StatusOption[];
}

export const TodoEditForm = ({
  open,
  onOpenChange,
  todo,
  onSave,
  isUpdating,
  statusOptions,
}: TodoEditFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    categoryId: '',
    dueDate: undefined as Date | undefined,
  });

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useQuery<CategoryResponse>({
      queryKey: ['categories'],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || ''}v1/categories?type=2`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        return response.json();
      },
    });

  const categories = categoriesData?.data || [];

  console.log(todo);

  // Reset form when todo changes or dialog opens
  useEffect(() => {
    if (open && todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priorityValue || '',
        status: todo.statusCode ? todo.statusCode.toString() : '',
        categoryId: todo.categoryId ? String(todo.categoryId) : '',
        dueDate: todo.dueAt ? new Date(todo.dueAt) : undefined,
      });

      // Set the selected category based on todo data
      setSelectedCategory(todo.categoryId || undefined);
    }
  }, [open, todo]);

  const handleSave = () => {
    const updatedData: TodoUpdateData = {
      //   id: todo.id,
      title: formData.title,
      description: formData.description,
      priority: getPriorityCode(formData.priority),
      status: formData.status,
      dueAt: formData.dueDate?.getTime() ?? null,
      categoryId: selectedCategory, // Include category ID in update data
    };

    onSave(updatedData);
    toast.success('Task updated successfully!');
  };

  const updateFormData = (
    field: keyof typeof formData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Your Task</DialogTitle>
          <DialogDescription>
            Modify the fields and click save.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => updateFormData('priority', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateFormData('status', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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

          <div className="space-y-2">
            <Label htmlFor="edit-due-date">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal w-full',
                    !formData.dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(formData.dueDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => updateFormData('dueDate', date)}
                  initialFocus
                  disabled={(date) => {
                    // Disable today and all past dates
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date <= today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={isUpdating || !formData.title.trim()}
            onClick={handleSave}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
