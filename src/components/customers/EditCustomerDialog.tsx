
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateCustomer } from '@/hooks/useCustomers';
import { Customer } from '@/types/database';

const customerSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  customer_number: z.string().optional(),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Ugyldig e-postadresse').optional().or(z.literal('')),
  address: z.string().optional(),
  status: z.enum(['active', 'inactive', 'blocked']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface EditCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditCustomerDialog = ({ customer, open, onOpenChange }: EditCustomerDialogProps) => {
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

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rediger kunde</DialogTitle>
          <DialogDescription>
            Oppdater kundeinformasjon
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn *</FormLabel>
                  <FormControl>
                    <Input placeholder="Kundenavn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kundenummer</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. K001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontaktperson</FormLabel>
                  <FormControl>
                    <Input placeholder="Navn på kontaktperson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. +47 123 45 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder="kunde@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Gateadresse, postnummer sted" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Aktiv</SelectItem>
                      <SelectItem value="inactive">Inaktiv</SelectItem>
                      <SelectItem value="blocked">Blokkert</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={updateCustomer.isPending}>
                {updateCustomer.isPending ? 'Oppdaterer...' : 'Oppdater kunde'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCustomerDialog;
