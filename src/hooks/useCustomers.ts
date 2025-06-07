
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Customer[];
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Kunde opprettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke opprette kunde: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Kunde oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere kunde: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Kunde slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette kunde: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAllCustomers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Alle kunder slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette alle kunder: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
