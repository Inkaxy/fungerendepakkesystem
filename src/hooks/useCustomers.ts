
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

export const useCustomers = () => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['customers', profile?.bakery_id],
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
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['customers', profile?.bakery_id] });
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
  const { profile } = useAuthStore();

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
    // Optimistic update - oppdater UI før API-kallet er ferdig
    onMutate: async ({ id, ...updates }) => {
      const queryKey = ['customers', profile?.bakery_id];
      
      // Cancel pågående refetch for å unngå race conditions
      await queryClient.cancelQueries({ queryKey });

      // Snapshot av nåværende data (for rollback)
      const previousCustomers = queryClient.getQueryData<Customer[]>(queryKey);

      // Optimistically oppdater cachen
      queryClient.setQueryData<Customer[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map(customer =>
          customer.id === id
            ? { ...customer, ...updates, updated_at: new Date().toISOString() }
            : customer
        );
      });

      // Returner context med snapshot for rollback
      return { previousCustomers };
    },
    // Hvis mutation feiler, bruk context til å rulle tilbake
    onError: (error, variables, context) => {
      if (context?.previousCustomers) {
        queryClient.setQueryData(
          ['customers', profile?.bakery_id],
          context.previousCustomers
        );
      }
      
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere kunde: ${error.message}`,
        variant: "destructive",
      });
    },
    // Alltid refetch etter mutation for å sikre data-synk
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['customers', profile?.bakery_id] 
      });
    },
    onSuccess: () => {
      toast({
        title: "Suksess",
        description: "Kunde oppdatert",
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
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['customers', profile?.bakery_id] });
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
      const { profile } = useAuthStore.getState();
      queryClient.invalidateQueries({ queryKey: ['customers', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['order-counts', profile?.bakery_id] });
      toast({
        title: "Suksess",
        description: "Alle kunder og tilknyttede ordrer er slettet",
      });
    },
    onError: (error) => {
      console.error('Delete all customers error:', error);
      const errorMessage = error.message.includes('foreign key')
        ? 'Kunne ikke slette kunder på grunn av tilknyttede data. Kontakt support.'
        : `Kunne ikke slette alle kunder: ${error.message}`;
      
      toast({
        title: "Feil",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
