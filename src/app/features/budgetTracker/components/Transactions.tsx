import { useEffect, useMemo, useState } from 'react';
import { Button } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensePieChart } from './ExpenseChart';
import { AddTransactionModal } from './AddTransactionModal';
import * as z from 'zod';
import api from '@/api';
import { buildURL } from '@/lib/stringUtils';
import transactionRoutes from '@/api/budgetTracker/route';
// import categoryRoutes from '@/api/categories/route';
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  getFilteredRowModel,
  type SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formSchema = z.object({
  amount: z.number({ required_error: 'Amount is required' }).min(1, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  transactionDate: z.preprocess(
    (val) => (typeof val === 'string' ? new Date(val) : val),
    z.date({ required_error: 'Transaction date is required' })
  ),
  categoryId: z.number({ required_error: 'Category is required' }),
});

export type TransactionForm = z.infer<typeof formSchema>;

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  categoryId: number;
  category: Category;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export function Transactions() {
  const [data, setData] = useState<PaginatedResponse<Transaction>>({
    data: [],
    total: 0,
    page: 1,
    size: 10,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<TransactionForm, 'transactionDate'> & { transactionDate: string }>({
    description: '',
    amount: 0,
    transactionDate: '',
    categoryId: categories.length > 0 ? categories[0].id : 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: 'description',
        header: () => (
          <div className="flex flex-col">
            <span>Description</span>
            <Input
              placeholder="Filter description..."
              value={(columnFilters.find(f => f.id === 'description')?.value as string) ?? ''}
              onChange={(e) => {
                const filter = { id: 'description', value: e.target.value };
                if (e.target.value === '') {
                  setColumnFilters(prev => prev.filter(f => f.id !== 'description'));
                } else {
                  setColumnFilters(prev => [
                    ...prev.filter(f => f.id !== 'description'),
                    filter,
                  ]);
                }
              }}
              className="h-8"
            />
          </div>
        ),
      },
      {
        accessorKey: 'categoryId',
        header: () => (
          <div className="flex flex-col">
            <span>Category</span>
            <select
              value={(columnFilters.find(f => f.id === 'categoryId')?.value as string) ?? ''}
              onChange={(e) => {
                const filter = { id: 'categoryId', value: e.target.value };
                if (e.target.value === '') {
                  setColumnFilters(prev => prev.filter(f => f.id !== 'categoryId'));
                } else {
                  setColumnFilters(prev => [
                    ...prev.filter(f => f.id !== 'categoryId'),
                    filter,
                  ]);
                }
              }}
              className="h-8 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        ),
        cell: ({ row }) => (
          <span className="inline-flex items-center">
            {row.original.category ? (
              <>
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: row.original.category.description }}
                ></span>
                {row.original.category.name}
              </>
            ) : (
              'N/A'
            )}
          </span>
        ),
      },
      {
        accessorKey: 'transactionDate',
        header: () => (
          <div className="flex flex-col">
            <span>Date</span>
            <Input
              type="date"
              value={(columnFilters.find(f => f.id === 'transactionDate')?.value as string) ?? ''}
              onChange={(e) => {
                const filter = { id: 'transactionDate', value: e.target.value };
                if (e.target.value === '') {
                  setColumnFilters(prev => prev.filter(f => f.id !== 'transactionDate'));
                } else {
                  setColumnFilters(prev => [
                    ...prev.filter(f => f.id !== 'transactionDate'),
                    filter,
                  ]);
                }
              }}
              className="h-8"
            />
          </div>
        ),
        cell: ({ row }) => (
          new Date(parseInt(row.original.transactionDate) * 1000).toLocaleDateString()
        ),
      },
      {
        accessorKey: 'amount',
        header: () => (
          <div className="flex flex-col">
            <span>Amount</span>
            <div className="flex gap-1">
              <Input
                placeholder="Min"
                type="number"
                value={(columnFilters.find(f => f.id === 'amount_min')?.value as string) ?? ''}
                onChange={(e) => {
                  const filter = { id: 'amount_min', value: e.target.value };
                  if (e.target.value === '') {
                    setColumnFilters(prev => prev.filter(f => f.id !== 'amount_min'));
                  } else {
                    setColumnFilters(prev => [
                      ...prev.filter(f => f.id !== 'amount_min'),
                      filter,
                    ]);
                  }
                }}
                className="h-8"
              />
              <Input
                placeholder="Max"
                type="number"
                value={(columnFilters.find(f => f.id === 'amount_max')?.value as string) ?? ''}
                onChange={(e) => {
                  const filter = { id: 'amount_max', value: e.target.value };
                  if (e.target.value === '') {
                    setColumnFilters(prev => prev.filter(f => f.id !== 'amount_max'));
                  } else {
                    setColumnFilters(prev => [
                      ...prev.filter(f => f.id !== 'amount_max'),
                      filter,
                    ]);
                  }
                }}
                className="h-8"
              />
            </div>
          </div>
        ),
        cell: ({ row }) => (
          <span className="text-red-500"> {row.original.amount.toLocaleString()}</span>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <button
            onClick={async () => {
              try {
                await api.delete(buildURL(transactionRoutes.transaction_id, { id: row.original.id }));
                setData(prev => ({
                  ...prev,
                  data: prev.data.filter((t) => t.id !== row.original.id),
                  total: prev.total - 1,
                }));
                toast.success('Transaction deleted successfully');
              } catch (error) {
                console.error('Delete failed', error);
                toast.error('Failed to delete transaction');
              }
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete transaction"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        ),
      },
    ],
    [categories, columnFilters]
  );

  const table = useReactTable({
    data: data.data,
    columns,
    pageCount: Math.ceil(data.total / data.size),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: data.page - 1,
        pageSize: data.size,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex: data.page - 1,
          pageSize: data.size,
        });
        setData(prev => ({
          ...prev,
          page: newState.pageIndex + 1,
          size: newState.pageSize,
        }));
      }
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        page: data.page.toString(),
        size: data.size.toString(),
      });

      // Add sorting if needed
      if (sorting.length > 0) {
        params.append('sort', sorting.map(sort => `${sort.id},${sort.desc ? 'desc' : 'asc'}`).join(';'));
      }

      // Add column filters
      columnFilters.forEach(filter => {
        if (filter.value) {
          params.append(filter.id, filter.value.toString());
        }
      });

      const [txRes, catRes] = await Promise.all([
        api.get(`${transactionRoutes.transaction}/search?${params.toString()}`),
        api.get("https://productivity-suite-java.onrender.com/productivity-suite/api/v1/categories?type=3"),
      ]);

      const categoriesMap = new Map<number, Category>();
      catRes.data.data.forEach((category: Category) => {
        categoriesMap.set(category.id, category);
      });

      const mergedTransactions = txRes.data.data.map((tx: any) => {
        const category = categoriesMap.get(tx.categoryId) || {
          id: 0,
          name: 'Uncategorized',
          description: '#cccccc'
        };
    
        return {
          ...tx,
          category,
        };
      });

      setData({
        data: mergedTransactions,
        total: txRes.data.total,
        page: txRes.data.page,
        size: txRes.data.size,
      });
    
      setCategories(catRes.data.data);
    
      if (catRes.data.data.length > 0) {
        setNewTransaction(prev => ({
          ...prev,
          categoryId: catRes.data.data[0].id,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    fetchData();
  }, [data.page, data.size, globalFilter, sorting, columnFilters, fetchData]);

  const handleAddTransaction = async () => {
    try {
      const transactionDateEpoch = Math.floor(new Date(newTransaction.transactionDate).getTime() / 1000);
      
      const validated = formSchema.parse({
        ...newTransaction,
        transactionDate: new Date(newTransaction.transactionDate),
      });

      const payload = {
        ...validated,
        transactionDate: transactionDateEpoch
      };

      const response = await api.post(transactionRoutes.transaction, payload);
    
      setData(prev => ({
        ...prev,
        data: [response.data.data, ...prev.data],
        total: prev.total + 1,
      }));
      
      setNewTransaction({
        description: '',
        amount: 0,
        transactionDate: new Date().toISOString().split('T')[0],
        categoryId: categories.length > 0 ? categories[0].id : 0,
      });
      setFormErrors({});
      setIsModalOpen(false);
    
      toast.success('Transaction added successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) errors[err.path[0].toString()] = err.message;
        });
        setFormErrors(errors);
        toast.error('Please fix the form errors');
      } else {
        console.error('Error creating transaction:', error);
        toast.error('Failed to add transaction');
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Add Transaction
        </Button>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        categories={categories}
        formErrors={formErrors}
      />

      {data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 rounded-lg">
          <div className="text-4xl mb-4">$</div>
          <p className="text-gray-500 mb-6">No transactions yet</p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Add Your First Transaction
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Search transactions..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="2"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="2"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-1/3">
            <ExpensePieChart
              transactions={data.data.map((tx) => ({
                category: tx.category.name,
                amount: tx.amount.toString(),
                color: tx.category.description
              }))}
            />
          </div>
        </div>
      )}
    </>
  );
}