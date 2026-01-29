import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { CreateTabletInput, UpdateTabletInput } from '@/types/tablet';
import { toast } from 'sonner';

export const useTabletActions = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();

  const createTablet = useMutation({
    mutationFn: async (input: CreateTabletInput) => {
      if (!profile?.bakery_id) throw new Error('No bakery ID');

      const { data, error } = await supabase
        .from('tablets')
        .insert({
          bakery_id: profile.bakery_id,
          name: input.name,
          device_id: input.device_id || null,
          ip_address: input.ip_address || null,
          customer_id: input.customer_id || null,
          kiosk_mode: input.kiosk_mode ?? true,
          display_url: input.display_url || null,
          model: input.model || null,
          android_version: input.android_version || null,
          notes: input.notes || null,
          status: 'offline'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      toast.success('Nettbrett opprettet');
    },
    onError: (error) => {
      console.error('Error creating tablet:', error);
      toast.error('Kunne ikke opprette nettbrett');
    }
  });

  const updateTablet = useMutation({
    mutationFn: async (input: UpdateTabletInput) => {
      const { id, ...updates } = input;

      const { data, error } = await supabase
        .from('tablets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      toast.success('Nettbrett oppdatert');
    },
    onError: (error) => {
      console.error('Error updating tablet:', error);
      toast.error('Kunne ikke oppdatere nettbrett');
    }
  });

  const deleteTablet = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tablets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      toast.success('Nettbrett slettet');
    },
    onError: (error) => {
      console.error('Error deleting tablet:', error);
      toast.error('Kunne ikke slette nettbrett');
    }
  });

  const linkToCustomer = useMutation({
    mutationFn: async ({ tabletId, customerId }: { tabletId: string; customerId: string | null }) => {
      const { data, error } = await supabase
        .from('tablets')
        .update({ customer_id: customerId })
        .eq('id', tabletId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablets'] });
      toast.success('Nettbrett tilknytning oppdatert');
    },
    onError: (error) => {
      console.error('Error linking tablet:', error);
      toast.error('Kunne ikke oppdatere tilknytning');
    }
  });

  return { createTablet, updateTablet, deleteTablet, linkToCustomer };
};
