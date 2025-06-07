import * as Dialog from '@radix-ui/react-dialog';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { SaveSetting } from '@/api/query';
import { queryClient } from '@/lib/queryClient';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type FormValues = {
  dateFormat: string;
  currency: string;
};

const currencyToIdMap: Record<string, number> = {
  USD: 1,
  EUR: 2,
  MMK: 3,
  JPY: 4, // Example additional currency
  GBP: 5, // Example additional currency
};

const SettingsModal = ({
  isOpen,
  onClose,
  currentSettings,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentSettings?: FormValues; // Example: { dateFormat: 'YYYY-MM-DD', currency: 'EUR' }
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }, // errors for validation, isSubmitting for loading
  } = useForm<FormValues>({
    defaultValues: currentSettings || {
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
    },
  });

  // Reset form when modal opens with new/different currentSettings or when it closes
  useEffect(() => {
    if (isOpen) {
      reset(currentSettings || { dateFormat: 'MM/DD/YYYY', currency: 'USD' });
    }
  }, [isOpen, currentSettings, reset]);

  const saveMutation = useMutation({
    mutationFn: (data: { dateFormat: string; currencyId: number }) =>
      SaveSetting(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(data.message || 'Settings saved successfully');
      onClose(); // Close modal on success
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save settings');
      console.error('Save error:', error.message);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const currencyId = currencyToIdMap[data.currency];

    const payload = {
      dateFormat: data.dateFormat,
      currencyId: currencyId,
    };
    saveMutation.mutate(payload);
  };

  // Handle modal close and form reset
  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <form onSubmit={handleSubmit(onSubmit)}>
            {' '}
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-lg font-medium">
                Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleClose}
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="dateFormat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  className="mt-1 w-full border rounded-md p-2"
                  {...register('dateFormat', {
                    required: 'Date format is required',
                  })}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
                {errors.dateFormat && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dateFormat.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency
                </label>
                <select
                  id="currency"
                  className="mt-1 w-full border rounded-md p-2"
                  {...register('currency', {
                    required: 'Currency is required',
                  })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MMK">MMK</option>
                  <option value="JPY">JPY</option>
                  <option value="GBP">GBP</option>
                </select>
                {errors.currency && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose} // Use the new handleClose
                disabled={saveMutation.isPending || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending || isSubmitting}
              >
                {saveMutation.isPending || isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsModal;
