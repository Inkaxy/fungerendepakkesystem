
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Customer } from '@/types/database';
import CustomerForm from './forms/CustomerForm';
import { useEditCustomer } from './hooks/useEditCustomer';

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCustomerDialog = ({ customer, open, onOpenChange }: EditCustomerDialogProps) => {
  const { form, onSubmit, isSubmitting } = useEditCustomer({
    customer,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rediger kunde</DialogTitle>
          <DialogDescription>
            Oppdater kundeinformasjon
          </DialogDescription>
        </DialogHeader>
        <CustomerForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Oppdater kunde"
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
