import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TrackerBar from './TrackerBar';
import { fetchCategory } from './setBudgetApi';

type Category = {
  categoryId: number;
  name: string;
};

type CategoryBudget = {
  id: number;
  category: string;
  budget: number;
};

type Transaction = {
  category: string;
  amount: number;
};

const CategoryProgressTracker = () => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');

  const { data, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategory,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const categories = data ?? [];

  const transactions: Transaction[] = [
    { category: 'Food', amount: 100 },
    { category: 'Transport', amount: 100 },
    { category: 'Food', amount: 300 },
    { category: 'Utilities', amount: 150 },
    { category: 'Entertainment', amount: 150 },
  ];

 



  const addCategoryBudget = () => {
    if (!category || !budget) return;

    const alreadyExists = categoryBudgets.some(
      (item) => item.category === category
    );
    if (alreadyExists) return;

    const newEntry: CategoryBudget = {
      id: Date.now(),
      category,
      budget: Number(budget),
    };

    setCategoryBudgets((prev) => [...prev, newEntry]);

    setCategory('');
    setBudget('');
  };

  const getSpentAmount = (category: string) => {
    return transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleDelete = (id: number) => {
    setCategoryBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: number) => {
    const toEdit = categoryBudgets.find((item) => item.id === id);
    if (!toEdit) return;

    setCategory(toEdit.category);
    setBudget(toEdit.budget.toString());
    setCategoryBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* LEFT: Input Form */}
      <div className="md:w-1/2 space-y-4">
        <h1 className="font-bold text-xl">Set Budget</h1>

        {isLoading ? (
          <p>Loading categories...</p>
        ) : isError ? (
          <p className="text-red-600">Failed to load categories.</p>
        ) : (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-left border p-2 rounded-lg bg-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.name}>
                {cat.name || 'Unnamed'}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          placeholder="Enter budget amount"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        />

        <div className="flex justify-end gap-4 p-4">
          <button
            onClick={addCategoryBudget}
           
            className="w-28 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            OK
          </button>

          <button
            onClick={() => {
              setCategory('');
              setBudget('');
            }}
            className="w-28 px-4 py-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* RIGHT: Tracker Bars */}
      <div className="md:w-1/2 space-y-4">
        {categoryBudgets.map((item) => (
          <TrackerBar
            key={item.id}
            id={item.id}
            category={item.category}
            budget={item.budget}
            spent={getSpentAmount(item.category)}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryProgressTracker;
