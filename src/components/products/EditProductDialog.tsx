
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
import { Product } from '@/types/database';

const productSchema = z.object({
  name: z.string().min(1, 'Produktnavn er påkrevd'),
  product_number: z.string().optional(),
  category: z.string().min(1, 'Kategori er påkrevd'),
  price: z.number().min(0, 'Pris må være 0 eller høyere').optional(),
  unit: z.string().min(1, 'Enhet er påkrevd'),
  basket_quantity: z.number().min(1, 'Kurvstørrelse må være minst 1').optional(),
  is_active: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Product> & { id: string }) => Promise<void>;
  isLoading?: boolean;
}

const EditProductDialog = ({ product, open, onOpenChange, onSubmit, isLoading }: EditProductDialogProps) => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      product_number: '',
      category: 'Ingen kategori',
      price: 0,
      unit: 'stk',
      basket_quantity: undefined,
      is_active: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        product_number: product.product_number || '',
        category: product.category || 'Ingen kategori',
        price: product.price || 0,
        unit: product.unit || 'stk',
        basket_quantity: product.basket_quantity || undefined,
        is_active: product.is_active,
      });
    }
  }, [product, form]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    try {
      await onSubmit({
        id: product.id,
        ...data,
        product_number: data.product_number || undefined,
        price: data.price || undefined,
        basket_quantity: data.basket_quantity || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rediger produkt</DialogTitle>
          <DialogDescription>
            Oppdater produktinformasjon
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produktnavn *</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. Rundstykker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varenummer</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. P001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori *</FormLabel>
                  <FormControl>
                    <Input placeholder="F.eks. Brød" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pris (kr)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enhet *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg enhet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="stk">Stykk</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="g">Gram</SelectItem>
                      <SelectItem value="l">Liter</SelectItem>
                      <SelectItem value="dl">Desiliter</SelectItem>
                      <SelectItem value="pakke">Pakke</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basket_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antall per kurv</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="F.eks. 10" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Aktiv</SelectItem>
                      <SelectItem value="false">Inaktiv</SelectItem>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Oppdaterer...' : 'Oppdater produkt'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
