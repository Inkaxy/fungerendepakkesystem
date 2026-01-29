import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTabletActions } from '@/hooks/useTabletActions';
import { useCustomers } from '@/hooks/useCustomers';
import { Tablet } from '@/types/tablet';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  device_id: z.string().optional(),
  ip_address: z.string().optional(),
  customer_id: z.string().optional(),
  kiosk_mode: z.boolean().default(true),
  model: z.string().optional(),
  android_version: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTabletDialogProps {
  tablet: Tablet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTabletDialog: React.FC<EditTabletDialogProps> = ({
  tablet,
  open,
  onOpenChange,
}) => {
  const { updateTablet } = useTabletActions();
  const { data: customers = [] } = useCustomers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      device_id: '',
      ip_address: '',
      customer_id: '',
      kiosk_mode: true,
      model: '',
      android_version: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (tablet) {
      form.reset({
        name: tablet.name,
        device_id: tablet.device_id || '',
        ip_address: tablet.ip_address || '',
        customer_id: tablet.customer_id || '',
        kiosk_mode: tablet.kiosk_mode,
        model: tablet.model || '',
        android_version: tablet.android_version || '',
        notes: tablet.notes || '',
      });
    }
  }, [tablet, form]);

  const onSubmit = async (values: FormValues) => {
    if (!tablet) return;

    await updateTablet.mutateAsync({
      id: tablet.id,
      ...values,
      customer_id: values.customer_id || null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rediger nettbrett</DialogTitle>
          <DialogDescription>
            Oppdater informasjon om nettbrettet
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
                    <Input placeholder="F.eks. Butikk 1 - Kasse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="device_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enhets-ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Android Device ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ip_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP-adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tilknyttet butikk</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg butikk (valgfritt)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen tilknytning</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                          {customer.customer_number && ` (${customer.customer_number})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modell</FormLabel>
                    <FormControl>
                      <Input placeholder="Samsung Galaxy Tab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="android_version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Android-versjon</FormLabel>
                    <FormControl>
                      <Input placeholder="13" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="kiosk_mode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Kiosk-modus</FormLabel>
                    <FormDescription>
                      Lås nettbrettet til kun visning av display
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notater</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Eventuelle notater..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={updateTablet.isPending}>
                {updateTablet.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lagre
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTabletDialog;
