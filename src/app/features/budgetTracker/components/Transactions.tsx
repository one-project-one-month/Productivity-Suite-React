import { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { AddTransactionModal } from './AddTransactionModal';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpensePieChart } from './ExpenseChart';

interface Transaction {
  id: string;
  description: string;
  category: string;
  transaction_date: string;
  amount: string;
}

const categoryColors: Record<string, string> = {
  Housing: '#4682B4', // SteelBlue
  Food: '#FF6347',    // Tomato
  Transportation: '#FFD700', // Gold
  Entertainment: '#FF69B4',  // HotPink
  Utilities: '#32CD32'       // LimeGreen
};

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    description: '',
    category: 'Housing',
    transaction_date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    amount: '',
  });

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    
    setTransactions([
      {
        id: Date.now().toString(),
        ...newTransaction,
      },
      ...transactions,
    ]);
    
    setNewTransaction({
      description: '',
      category: 'Housing',
      transaction_date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      amount: '',
    });
    setIsModalOpen(false);
  };

  const categories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities'];

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
      />

      {transactions.length === 0 ? (
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
                <div className="overflow-x-auto">
                  <div className="max-h-[calc(7*3.5rem)] overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-left py-3 px-4">Category</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Amount</th>
                          <th className="text-right py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{tx.description}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center">
                                <span 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: categoryColors[tx.category] }}
                                ></span>
                                {tx.category}
                              </span>
                            </td>
                            <td className="py-3 px-4">{tx.transaction_date}</td>
                            <td className="py-3 px-4 text-red-500">-MMK {tx.amount}</td>
                            <td className="py-3 px-4 text-right">
                              <button 
                                onClick={() => {
                                  setTransactions(transactions.filter(transaction => transaction.id !== tx.id));
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-1/3">
            <ExpensePieChart transactions={transactions} />
          </div>
        </div>
      )}
    </>
  );
}