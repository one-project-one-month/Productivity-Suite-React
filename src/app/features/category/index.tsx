import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from '@/api/categories';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formSchema = z.object({
  name: z.string().nonempty('Category Name is required'),
  description: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Invalid color code'),
  type: z.number().optional(),
});

export type CategoryForm = z.infer<typeof formSchema>;

const CategoryManagement = () => {
  const location = useLocation();
  const data = location.state;
  const [isCreate, setIsCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const {
    data: categories,
    refetch,
    isLoading,
  } = useQuery<Category[]>({
    queryKey: ['category', data.categoryTypeId],
    queryFn: async (): Promise<Category[]> =>
      await getAllCategories(`type=${data.categoryTypeId}`).then((response) => {
        if (response.data.code === 200) return response.data.data;
        throw new Error('Failed to fetch categories');
      }),
  });

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '#000000',
      type: data.categoryTypeId ?? 0,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newCategory: CategoryForm) =>
      await createCategory(newCategory).then((response) => {
        if (response.data.code === 200) {
          toast.success('Category created successfully');
          setIsCreate(false);
          setEditId(null);
          refetch();
          form.reset({
            name: '',
            description: '#000000',
            type: data.categoryTypeId ?? 0,
          });
          return response.data.data;
        }
        throw new Error('Failed to create category');
      }),
  });

  const { mutateAsync: updateMutation, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: CategoryForm }) =>
      await updateCategory(id, values).then((response) => {
        if (response.data.code === 200) {
          toast.success('Category updated successfully');
          setEditId(null);
          setIsCreate(false);
          refetch();
          form.reset({
            name: '',
            description: '#000000',
            type: data.categoryTypeId ?? 0,
          });
          return response.data.data;
        }
        throw new Error('Failed to update category');
      }),
  });

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: async (id: number) =>
      await deleteCategory(id).then((response) => {
        if (response.data.code === 200) {
          toast.success('Category deleted successfully');
          refetch();
        } else {
          toast.error('Failed to delete category');
        }
      }),
  });

  const handleEdit = (category: Category) => {
    form.reset({
      name: category.name,
      description: category.description,
      type: category.typeCode,
    });
    setEditId(category.id);
  };

  const handleCancel = () => {
    setIsCreate(false);
    setEditId(null);
    form.reset({
      name: '',
      description: '#000000',
      type: data.categoryTypeId ?? 0,
    });
  };

  const onSubmit = (values: CategoryForm) => {
    if (editId !== null) {
      updateMutation({ id: editId, values });
    } else {
      mutateAsync(values);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-5 items-center">
        <h1 className="text-lg font-bold">{data.name}</h1>
        <Button
          onClick={() => {
            setEditId(null);
            setIsCreate(true);
            form.reset({
              name: '',
              description: '#000000',
              type: data.categoryTypeId ?? 0,
            });
          }}
        >
          Add Category
        </Button>
      </div>

      {isCreate && editId === null && (
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Create New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Category Color</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={field.value}
                              onChange={field.onChange}
                              className="h-10 w-12 rounded border"
                            />
                            <Input
                              placeholder="#000000"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isPending}>
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 mb-3 rounded bg-gray-200" />
          ))
        : categories?.map((category) => (
            <Card
              key={category.id}
              className="mb-3 bg-white/70 backdrop-blur-sm border-gray-200"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {category.id === editId ? 'Edit Category' : category.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(category.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this category?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteId !== null && deleteMutation(deleteId)
                            }
                          >
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {editId === category.id ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3"
                    >
                      <div className="flex flex-row gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Category Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Category Color</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="h-10 w-12 rounded border"
                                  />
                                  <Input
                                    placeholder="#000000"
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isUpdating}>
                          Update
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-6 w-6 rounded-full"
                      style={{ backgroundColor: category.description }}
                    ></span>
                    <span>{category.description}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
    </>
  );
};

export default CategoryManagement;
