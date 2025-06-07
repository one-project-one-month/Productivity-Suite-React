import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { Button } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensePieChart } from './ExpenseChart';
import { AddTransactionModal } from './AddTransactionModal';
import * as z from 'zod';
import api from '@/api';
import { buildURL } from '@/lib/stringUtils';
import transactionRoutes from '@/api/budgetTracker/route';
import { toast } from 'sonner';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
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
  transactionDate: string | null;
  categoryId: number;
  category?: Category;
}

interface PaginatedResponse<T> {
  data?: T[];
  content?: T[];
  total?: number;
  totalElements?: number;
  page: number;
  size: number;
}

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Omit<TransactionForm, 'transactionDate'> & { transactionDate: string; id?: number }>({
    description: '',
    amount: 0,
    transactionDate: '',
    categoryId: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const descriptionFilter = searchParams.get('description') || (location.state?.filters?.description || '');
  const categoryFilter = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId') as string) : (location.state?.filters?.categoryId || '');
  const fromAmountFilter = searchParams.get('fromAmount') ? parseFloat(searchParams.get('fromAmount') as string) : (location.state?.filters?.fromAmount || '');
  const toAmountFilter = searchParams.get('toAmount') ? parseFloat(searchParams.get('toAmount') as string) : (location.state?.filters?.toAmount || '');

  const [localDescriptionFilter, setLocalDescriptionFilter] = useState(descriptionFilter);
  const [localCategoryFilter, setLocalCategoryFilter] = useState<number | ''>(categoryFilter);
  const [localFromAmountFilter, setLocalFromAmountFilter] = useState<number | ''>(fromAmountFilter);
  const [localToAmountFilter, setLocalToAmountFilter] = useState<number | ''>(toAmountFilter);

  const handleSearch = () => {
    const urlParams = new URLSearchParams();
    if (localDescriptionFilter) urlParams.set('description', localDescriptionFilter);
    if (localCategoryFilter) urlParams.set('categoryId', localCategoryFilter.toString());
  
    if (localFromAmountFilter !== '' && !isNaN(Number(localFromAmountFilter))) {
      urlParams.set('fromAmount', localFromAmountFilter.toString());
    }
  
    if (localToAmountFilter !== '' && !isNaN(Number(localToAmountFilter))) {
      urlParams.set('toAmount', localToAmountFilter.toString());
    }

    const newState = {
      filters: {
        description: localDescriptionFilter,
        categoryId: localCategoryFilter,
        fromAmount: localFromAmountFilter,
        toAmount: localToAmountFilter,
      },
    };

    navigate({
      pathname: location.pathname,
      search: urlParams.toString(),
    }, { state: newState });
  };

  const handleResetFilters = () => {
    setLocalDescriptionFilter('');
    setLocalCategoryFilter('');
    setLocalFromAmountFilter('');
    setLocalToAmountFilter('');
    setSearchParams({});
    navigate(location.pathname, { state: null });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await api.get("https://productivity-suite-java.onrender.com/productivity-suite/api/v1/categories?type=3");
        const fetchedCategories: Category[] = catRes.data.data || [];
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setNewTransaction(prev => ({
            ...prev,
            categoryId: fetchedCategories[0].id,
            transactionDate: new Date().toISOString().split('T')[0],
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      if (sorting.length > 0) {
        params.append('sort', sorting.map(s => `${s.id},${s.desc ? 'desc' : 'asc'}`).join(';'));
      }

      const urlDescription = searchParams.get('description');
      const urlCategoryId = searchParams.get('categoryId');
      const urlFromAmount = searchParams.get('fromAmount');
      const urlToAmount = searchParams.get('toAmount');

      if (urlDescription) params.append('description', urlDescription);
      if (urlCategoryId) params.append('categoryId', urlCategoryId);
      if (urlFromAmount) params.append('fromAmount', urlFromAmount);
      if (urlToAmount) params.append('toAmount', urlToAmount);

      const txRes = await api.get(`${transactionRoutes.transaction}/search?${params.toString()}`);
      const responsePayload = txRes.data as PaginatedResponse<Transaction>;
      const transactionList = responsePayload?.data || responsePayload?.content || [];

      const categoriesMap = new Map(categories.map(cat => [cat.id, cat]));
      const mergedTransactions = transactionList.map(tx => ({
          ...tx,
          category: categoriesMap.get(tx.categoryId),
          transactionDate: tx.transactionDate || null
      }));

      setTransactions(mergedTransactions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch transactions');
      setTransactions([]);
    }
  }, [sorting, categories, searchParams]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchData();
    }
  }, [fetchData, categories]);

  useEffect(() => {
    setLocalDescriptionFilter(searchParams.get('description') || (location.state?.filters?.description || ''));
    setLocalCategoryFilter(searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId') as string) : (location.state?.filters?.categoryId || ''));
    setLocalFromAmountFilter(searchParams.get('fromAmount') ? parseFloat(searchParams.get('fromAmount') as string) : (location.state?.filters?.fromAmount || ''));
    setLocalToAmountFilter(searchParams.get('toAmount') ? parseFloat(searchParams.get('toAmount') as string) : (location.state?.filters?.toAmount || ''));
  }, [searchParams, location.state]);

  const handleAddTransaction = async () => {
    try {
      const validatedData = formSchema.parse({
        ...newTransaction,
        transactionDate: new Date(newTransaction.transactionDate),
      });

      const payload = {
        ...validatedData,
        transactionDate: Math.floor(validatedData.transactionDate.getTime() / 1000)
      };

      await api.post(transactionRoutes.transaction, payload);
      toast.success('Transaction added successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        const errorMap: Record<string, string> = {};
        Object.entries(errors).forEach(([key, value]) => {
          errorMap[key] = value ? value[0] : '';
        });
        setFormErrors(errorMap);
      } else {
        console.error('Error adding transaction:', error);
        toast.error('Failed to add transaction');
      }
    }
  };

  const handleEditTransaction = async () => {
    if (!editingTransaction?.id) return;

    try {
      const validatedData = formSchema.parse({
        ...newTransaction,
        transactionDate: new Date(newTransaction.transactionDate),
      });
      
      const payload = {
          ...validatedData,
          transactionDate: Math.floor(validatedData.transactionDate.getTime() / 1000)
      };

      await api.put(buildURL(transactionRoutes.transaction_id, { id: editingTransaction.id }), payload);
      toast.success('Transaction updated successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        const errorMap: Record<string, string> = {};
        Object.entries(errors).forEach(([key, value]) => {
          errorMap[key] = value ? value[0] : '';
        });
        setFormErrors(errorMap);
      } else {
        console.error('Error updating transaction:', error);
        toast.error('Failed to update transaction');
      }
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transactionDate
        ? new Date(parseInt(transaction.transactionDate) * 1000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      categoryId: transaction.categoryId,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setEditingTransaction(null);
      setNewTransaction({
        description: '',
        amount: 0,
        transactionDate: new Date().toISOString().split('T')[0],
        categoryId: categories[0]?.id || 0,
      });
      setFormErrors({});
    }
  }, [isModalOpen, categories]);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
        { accessorKey: 'description', header: 'Description' },
        {
            accessorKey: 'categoryId',
            header: 'Category',
            cell: ({ row }) => (
                <span className="inline-flex items-center">
                    {row.original.category ? (
                        <>
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: row.original.category.description }}></span>
                            {row.original.category.name}
                        </>
                    ) : ( 'N/A' )}
                </span>
            ),
        },
        {
            accessorKey: 'transactionDate',
            header: 'Date',
            cell: ({ row }) => {
                if (!row.original.transactionDate) return 'No date';
                const timestamp = parseInt(row.original.transactionDate);
                if (isNaN(timestamp)) return 'Invalid Date';
                return new Date(timestamp * 1000).toLocaleDateString();
            },
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => ( <span className="text-red-500"> {row.original.amount.toLocaleString()}</span> ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEditClick(row.original)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Edit transaction"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                await api.delete(buildURL(transactionRoutes.transaction_id, { id: row.original.id }));
                                toast.success('Transaction deleted successfully');
                                fetchData();
                            } catch (error) {
                                console.error('Delete failed', error);
                                toast.error('Failed to delete transaction');
                            }
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete transaction"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" > <path d="M3 6h18"></path> <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path> <line x1="10" y1="11" x2="10" y2="17"></line> <line x1="14" y1="11" x2="14" y2="17"></line> </svg>
                    </button>
                </div>
            ),
        },
    ],
    []
  );

  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          + Add Transaction
        </Button>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        handleEditTransaction={handleEditTransaction}
        categories={categories}
        formErrors={formErrors}
      />

      {transactions.length === 0 && !descriptionFilter && !categoryFilter && !fromAmountFilter && !toAmountFilter ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 rounded-lg">
            <div className="text-4xl mb-4">$</div>
            <p className="text-gray-500 mb-6">No transactions yet</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md" >+ Add Your First Transaction</Button>
          </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <Card>
              <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 items-end">
                  <div className="flex flex-col gap-1">
                      <label htmlFor="descriptionFilter" className="text-sm font-medium">Description</label>
                      <Input
                        id="descriptionFilter"
                        placeholder="Search..."
                        value={localDescriptionFilter}
                        onChange={(e) => setLocalDescriptionFilter(e.target.value)}
                      />
                  </div>
                  <div className="flex flex-col gap-1">
                      <label htmlFor="categoryFilter" className="text-sm font-medium">Category</label>
                      <select
                        id="categoryFilter"
                        value={localCategoryFilter}
                        onChange={(e) => setLocalCategoryFilter(e.target.value ? parseInt(e.target.value) : '')}
                        className="w-full p-2 border rounded-md bg-background focus:ring-ring focus:ring-offset-background"
                      >
                          <option value="">All Categories</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fromAmountFilter" className="text-sm font-medium">Min Amount</label>
                        <Input
                          id="fromAmountFilter"
                          type="number"
                          placeholder="Min"
                          value={localFromAmountFilter}
                          onChange={(e) => setLocalFromAmountFilter(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="toAmountFilter" className="text-sm font-medium">Max Amount</label>
                        <Input
                          id="toAmountFilter"
                          type="number"
                          placeholder="Max"
                          value={localToAmountFilter}
                          onChange={(e) => setLocalToAmountFilter(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSearch}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className={`relative ${transactions.length > 10 ? 'overflow-y-auto max-h-[500px]' : ''}`}>
                    <Table className="w-full">
                      <TableHeader className="sticky top-0 bg-background z-10">
                        {table.getHeaderGroups().map(hg => (
                          <TableRow key={hg.id}>
                            {hg.headers.map(h => (
                              <TableHead key={h.id} className="bg-white">
                                {flexRender(h.column.columnDef.header, h.getContext())}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                              {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/3">
              <ExpensePieChart transactions={transactions.map((tx) => ({
                category: tx.category ? tx.category.name : 'Uncategorized',
                amount: tx.amount.toString(),
                color: tx.category ? tx.category.description : '#cccccc',
              }))} />
          </div>
        </div>
      )}
    </>
  );
}