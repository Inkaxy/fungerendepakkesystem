
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
import { useCreateBakery } from '@/hooks/useBakeries';
import { useAuthStore } from '@/stores/authStore';

const createBakerySchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  email: z.string().email('Ugyldig e-postadresse').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CreateBakeryForm = z.infer<typeof createBakerySchema>;

interface CreateBakeryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateBakeryDialog = ({ open, onOpenChange }: CreateBakeryDialogProps) => {
  const createBakery = useCreateBakery();
  const { user, profile } = useAuthStore();

  const form = useForm<CreateBakeryForm>({
    resolver: zodResolver(createBakerySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: CreateBakeryForm) => {
    console.log('🏗️ Creating bakery form submission:', data);
    console.log('Current user:', user?.email);
    console.log('Current profile:', profile?.role);
    
    try {
      await createBakery.mutateAsync({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Opprett nytt bakeri</DialogTitle>
          <DialogDescription>
            Fyll ut informasjonen for det nye bakeriet.
          </DialogDescription>
        </DialogHeader>
        
        {/* Debug information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Debug: {user?.email} - {profile?.role}
          </div>
        )}
        
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
              <Button type="submit" disabled={createBakery.isPending}>
                {createBakery.isPending ? 'Oppretter...' : 'Opprett bakeri'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBakeryDialog;
