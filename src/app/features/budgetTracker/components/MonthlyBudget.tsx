import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  initialBudget: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newBudget: number) => void;
}

const SetMonthlyBudget: React.FC<Props> = ({
  initialBudget,
  open,
  onOpenChange,
  onSave,
}) => {
  const [budget, setBudget] = useState<number | string>(initialBudget);

  const handleSave = () => {
    if (typeof budget === 'number') {
      onSave(budget);
      onOpenChange(false); // Close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <input
            type="number"
            value={budget}
            onChange={(e) =>
              setBudget(e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="Enter budget amount"
            className="w-full text-center border p-2 rounded-lg mb-4"
          />

          <div className="flex justify-end gap-4">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-white text-black border border-black rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetMonthlyBudget;
