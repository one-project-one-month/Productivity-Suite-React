import { Dispatch, SetStateAction } from 'react';
import { Button } from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Transaction {
  id: string;
  description: string;
  category: string;
  transaction_date: string;
  amount: string;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  newTransaction: Omit<Transaction, 'id'>;
  setNewTransaction: Dispatch<SetStateAction<Omit<Transaction, 'id'>>>;
  handleAddTransaction: () => void;
  categories: string[];
}

const categoryColors: Record<string, string> = {
  Housing: '#4682B4', // SteelBlue
  Food: '#FF6347',    // Tomato
  Transportation: '#FFD700', // Gold
  Entertainment: '#FF69B4',  // HotPink
  Utilities: '#32CD32'       // LimeGreen
};

export function AddTransactionModal({
  isOpen,
  setIsOpen,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  categories,
}: AddTransactionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
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
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter description"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount (MMK)
            </label>
            <input
              id="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="transaction_date" className="block text-sm font-medium">
              Transaction Date
            </label>
            <input
              type="date"
              value={newTransaction.transaction_date}
              onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <Select.Root
              value={newTransaction.category}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
            >
              <Select.Trigger className="flex items-center justify-between w-full p-2 border rounded-md bg-white">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: categoryColors[newTransaction.category] }}
                  ></span>
                  <Select.Value />
                </div>
                <Select.Icon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Select.Icon>
              </Select.Trigger>

              <Select.Content className="z-50 w-96 bg-white border rounded-md shadow-lg" position='popper'>
                <Select.Viewport>
                  {categories.map((cat) => (
                    <Select.Item 
                      key={cat} 
                      value={cat}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-50"
                    >
                      <span 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: categoryColors[cat] }}
                      ></span>
                      <Select.ItemText>{cat}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
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
            onClick={handleAddTransaction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}