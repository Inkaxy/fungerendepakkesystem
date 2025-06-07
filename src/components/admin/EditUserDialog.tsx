
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateProfile } from '@/hooks/useProfiles';
import { useBakeries } from '@/hooks/useBakeries';

const editUserSchema = z.object({
  name: z.string().min(1, 'Navn er påkrevd'),
  role: z.enum(['super_admin', 'bakery_admin', 'bakery_user']),
  bakery_id: z.string().optional(),
  is_active: z.boolean(),
});

type EditUserForm = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    name?: string;
    email?: string;
    role: string;
    bakery_id?: string;
    is_active: boolean;
  } | null;
}

const EditUserDialog = ({ open, onOpenChange, user }: EditUserDialogProps) => {
  const updateProfile = useUpdateProfile();
  const { data: bakeries } = useBakeries();

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name || '',
      role: (user?.role as any) || 'bakery_user',
      bakery_id: user?.bakery_id || '',
      is_active: user?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name || '',
        role: user.role as any,
        bakery_id: user.bakery_id || '',
        is_active: user.is_active,
      });
    }
  }, [user, open, form]);

  const selectedRole = form.watch('role');
  const needsBakery = selectedRole === 'bakery_admin' || selectedRole === 'bakery_user';

  const onSubmit = async (data: EditUserForm) => {
    if (!user) return;
    
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        name: data.name,
        role: data.role,
        bakery_id: needsBakery ? data.bakery_id : null,
        is_active: data.is_active,
      });
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rediger bruker</DialogTitle>
          <DialogDescription>
            Oppdater brukerinformasjon for {user.email}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg rolle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="bakery_admin">Bakeri Admin</SelectItem>
                      <SelectItem value="bakery_user">Bakeri Bruker</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {needsBakery && (
              <FormField
                control={form.control}
                name="bakery_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bakeri *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Velg bakeri" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bakeries?.map((bakery) => (
                          <SelectItem key={bakery.id} value={bakery.id}>
                            {bakery.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Aktiv bruker</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Deaktiver for å hindre innlogging
                    </div>
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
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? 'Oppdaterer...' : 'Oppdater'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
