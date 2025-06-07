import { Button } from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Dispatch, SetStateAction } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  newTransaction: {
    id?: number;
    description: string;
    amount: number;
    transactionDate: Date | string;
    categoryId: number;
  };
  setNewTransaction: Dispatch<
    SetStateAction<{
      id?: number;
      description: string;
      amount: number;
      transactionDate: Date | string;
      categoryId: number;
    }>
  >;
  handleAddTransaction: () => void;
  handleEditTransaction?: () => void;
  categories: Category[];
  formErrors: {
    description?: string;
    amount?: string;
    [key: string]: string | undefined;
  };
}

export function AddTransactionModal({
  isOpen,
  setIsOpen,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  handleEditTransaction,
  categories,
  formErrors
}: AddTransactionModalProps) {
  const selectedCategory = categories.find(
    (cat) => cat.id === newTransaction.categoryId
  );

  const isEditMode = !!newTransaction.id;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter description"
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm">{formErrors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={newTransaction.amount || ''}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value ? Number(e.target.value) : 0,
                })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm">{formErrors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="transaction_date"
              className="block text-sm font-medium"
            >
              Transaction Date
            </label>
            <input
              type="date"
              value={
                typeof newTransaction.transactionDate === 'string'
                  ? newTransaction.transactionDate
                  : newTransaction.transactionDate.toISOString().split('T')[0]
              }
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  transactionDate: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            {formErrors.transactionDate && (
              <p className="text-red-500 text-sm">{formErrors.transactionDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <Select.Root
              value={newTransaction.categoryId?.toString() || ''}
              onValueChange={(value) => {
                setNewTransaction({
                  ...newTransaction,
                  categoryId: parseInt(value),
                });
              }}
              disabled={categories.length === 0}
            >
              <Select.Trigger className="flex items-center justify-between w-full p-2 border rounded-md bg-white">
                <div className="flex items-center">
                  {selectedCategory && (
                    <>
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: selectedCategory.description,
                        }}
                      />
                      <Select.Value placeholder="Select a category" />
                    </>
                  )}
                </div>
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>

              <Select.Content className="z-50 bg-white border rounded-md shadow-lg">
                <Select.Viewport>
                  {categories.map((cat) => (
                    <Select.Item
                      key={cat.id}
                      value={cat.id.toString()}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-50"
                    >
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: cat.description }}
                      />
                      <Select.ItemText>{cat.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
            {formErrors.categoryId && (
              <p className="text-red-500 text-sm">{formErrors.categoryId}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </Button>
          <Button
            onClick={isEditMode ? handleEditTransaction : handleAddTransaction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isEditMode ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}