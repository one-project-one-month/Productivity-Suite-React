import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TrackerBar from './TrackerBar';
import { fetchCategory } from './setBudgetApi';
import type { Income } from './setBudgetApi';
import { useQueries } from '@tanstack/react-query';
import { getTotalSpentByCategory } from './setBudgetApi';

type Category = {
  id: number;
  name: string;
  description?: string;
};

type CategoryBudget = {
  id: number;
  category: string;
  budget: number;
  categoryId: number;
  initialSpent: number;
};

type Props = {
  onCategoryChange: (category: Category | null) => void;
  onPostIncome: (categoryId: number, amount: number) => void;
  onDeleteIncome: (incomeId: number) => void;
  totalSpentByCategory: number;
  incomes?: Income[];
  lockedSpentAmount: number;
};

const CategoryProgressTracker: React.FC<Props> = ({
  onCategoryChange,
  onPostIncome,
  onDeleteIncome,
  //totalSpentByCategory,
  //lockedSpentAmount,
  incomes = [],
}) => {
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [budget, setBudget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { data, isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategory,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  const categories = data ?? [];

  const categoriesWithId = categories.filter(
    (cat) => typeof cat.id === 'number' && typeof cat.name === 'string'
  );

  const addCategoryBudget = () => {
    const budgetNum = Number(budget);

    if (
      !selectedCategory ||
      !budget ||
      budget.trim() === '' ||
      isNaN(budgetNum) ||
      budgetNum <= 0
    ) {
      console.warn(
        'Invalid selectedCategory or budget:',
        selectedCategory,
        budget
      );
      return;
    }

    // Prevent duplicate category
    const alreadyExists = incomes.some(
      (income) => income.categoryId === selectedCategory.id
    );
    if (alreadyExists) {
      alert('This category already has an income entry!');
      return;
    }

    onPostIncome(selectedCategory.id, budgetNum);

    setSelectedCategory(null);
    setBudget('');
  };

  const handleDelete = (id: number) => {
    onDeleteIncome(id);
  };

  const handleUpdate = (id: number) => {
    const toEdit = categoryBudgets.find((item) => item.id === id);
    if (!toEdit) return;

    const foundCat = categories.find((cat) => cat.name === toEdit.category);
    if (!foundCat) {
      console.warn(`Category not found: ${toEdit.category}`);
      return;
    }

    onPostIncome(foundCat.id, toEdit.budget);

    setSelectedCategory(foundCat);
    setBudget(toEdit.budget.toString());
    setCategoryBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  const groupedFromIncomes = categories
    .map((cat) => {
      const relatedIncomes =
        incomes?.filter((income) => income.categoryId === cat.id) ?? [];

      if (relatedIncomes.length === 0) return null;

      const totalBudget = relatedIncomes.reduce(
        (sum, inc) => sum + inc.amount,
        0
      );

      return {
        id: cat.id,
        category: cat.name,
        budget: totalBudget,
        categoryId: cat.id,
      };
    })
    .filter(Boolean) as {
    id: number;
    category: string;
    budget: number;
    categoryId: number;
  }[];

  const spentQueries = useQueries({
    queries: groupedFromIncomes.map((item) => ({
      queryKey: ['totalTransactionAmount', item.id],
      queryFn: () => getTotalSpentByCategory(item.id),
      enabled: true,
    })),
  });

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
            value={selectedCategory ? selectedCategory.id.toString() : ''}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const foundCategory = categoriesWithId.find(
                (cat) => cat.id === selectedId
              );

              if (foundCategory) {
                setSelectedCategory(foundCategory);
                onCategoryChange(foundCategory);
              } else {
                setSelectedCategory(null);
                onCategoryChange(null);
              }
            }}
            className="w-full text-left border p-2 rounded-lg bg-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {selectedCategory && (
          <p className="text-sm text-gray-600">
            Selected category: <strong>{selectedCategory.name}</strong>
          </p>
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
            disabled={!selectedCategory || !budget || Number(budget) <= 0}
            className="w-28 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            OK
          </button>

          <button
            onClick={() => {
              setSelectedCategory(null);
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
        {/* {groupedFromIncomes.map((item, index) => {
          const queryResult = spentQueries[index];
          const spent = queryResult?.data ?? 0;

          return (
            <TrackerBar
              key={item.id}
              id={item.id}
              category={item.category}
              categoryId={item.categoryId} // ✅ Now exists
              budget={item.budget}
              spent={spent}
              //handleDelete={handleDelete}
                handleDelete={() => handleDelete(1)} 
              handleUpdate={handleUpdate}
              totalSpentByCategory={spent}
            />
          );
        })} */}

        {categories.map((cat, index) => {
          const relatedIncomes =
            incomes?.filter((income) => income.categoryId === cat.id) ?? [];
          const queryResult = spentQueries[index];
          const spent = queryResult?.data ?? 0;

          return relatedIncomes.map((income) => (
            <TrackerBar
              key={income.id}
              id={income.id}
              category={cat.name}
              categoryId={cat.id}
              budget={income.amount}
              spent={spent}
              handleDelete={() => handleDelete(income.id)}
              handleUpdate={handleUpdate}
              totalSpentByCategory={spent}
            />
          ));
        })}
      </div>
    </div>
  );
};

export default CategoryProgressTracker;
