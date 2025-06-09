
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateCustomer } from '@/hooks/useCustomers';
import { Customer } from '@/types/database';
import { customerSchema, CustomerFormData } from '../schemas/customerFormSchema';

interface UseEditCustomerProps {
  customer: Customer | null;
  onSuccess: () => void;
}

export const useEditCustomer = ({ customer, onSuccess }: UseEditCustomerProps) => {
  const updateCustomer = useUpdateCustomer();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      customer_number: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        customer_number: customer.customer_number || '',
        contact_person: customer.contact_person || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        status: customer.status,
      });
    }
  }, [customer, form]);

  const onSubmit = async (data: CustomerFormData) => {
    if (!customer) return;

    try {
      await updateCustomer.mutateAsync({
        id: customer.id,
        ...data,
        email: data.email || undefined,
        customer_number: data.customer_number || undefined,
        contact_person: data.contact_person || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting: updateCustomer.isPending,
  };
};
