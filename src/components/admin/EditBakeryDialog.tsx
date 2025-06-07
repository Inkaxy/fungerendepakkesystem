
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateBakery } from '@/hooks/useBakeries';

const editBakerySchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  email: z.string().email('Ugyldig e-postadresse').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type EditBakeryForm = z.infer<typeof editBakerySchema>;

interface Bakery {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EditBakeryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bakery: Bakery | null;
}

const EditBakeryDialog = ({ open, onOpenChange, bakery }: EditBakeryDialogProps) => {
  const updateBakery = useUpdateBakery();

  const form = useForm<EditBakeryForm>({
    resolver: zodResolver(editBakerySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  React.useEffect(() => {
    if (bakery) {
      form.reset({
        name: bakery.name,
        email: bakery.email || '',
        phone: bakery.phone || '',
        address: bakery.address || '',
      });
    }
  }, [bakery, form]);

  const onSubmit = async (data: EditBakeryForm) => {
    if (!bakery) return;
    
    try {
      await updateBakery.mutateAsync({
        id: bakery.id,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rediger bakeri</DialogTitle>
          <DialogDescription>
            Oppdater informasjonen for bakeriet.
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
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={updateBakery.isPending}>
                {updateBakery.isPending ? 'Oppdaterer...' : 'Oppdater bakeri'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBakeryDialog;
