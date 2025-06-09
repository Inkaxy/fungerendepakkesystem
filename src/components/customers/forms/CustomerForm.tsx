
import React from 'react';
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
import { UseFormReturn } from 'react-hook-form';
import { CustomerFormData } from '../schemas/customerFormSchema';

interface CustomerFormProps {
  form: UseFormReturn<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
  isSubmitting: boolean;
  submitButtonText: string;
  onCancel: () => void;
}

const CustomerForm = ({ form, onSubmit, isSubmitting, submitButtonText, onCancel }: CustomerFormProps) => {
  return (
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Avbryt
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Oppdaterer...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
