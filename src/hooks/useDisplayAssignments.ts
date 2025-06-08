
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DisplayAssignment } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useDisplayAssignments = () => {
  return useQuery({
    queryKey: ['displayAssignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('display_assignments')
        .select(`
          *,
          customer:customers(*),
          display_station:display_stations(*)
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return data as DisplayAssignment[];
    },
  });
};

export const useCustomerDisplayAssignment = (customerId: string) => {
  return useQuery({
    queryKey: ['displayAssignment', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('display_assignments')
        .select(`
          *,
          display_station:display_stations(*)
        `)
        .eq('customer_id', customerId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as DisplayAssignment | null;
    },
    enabled: !!customerId,
  });
};

export const useCreateDisplayAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignment: Omit<DisplayAssignment, 'id' | 'created_at' | 'updated_at' | 'assigned_at'>) => {
      // Generer unik display URL
      const { data: urlData } = await supabase.rpc('generate_display_url');
      
      const assignmentData = {
        ...assignment,
        display_url: urlData,
      };

      const { data, error } = await supabase
        .from('display_assignments')
        .insert(assignmentData)
        .select()
        .single();

      if (error) throw error;

      // Oppdater customer tabellen med display URL og display station ID
      await supabase
        .from('customers')
        .update({
          display_url: urlData,
          assigned_display_station_id: assignment.display_station_id,
        })
        .eq('id', assignment.customer_id);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Display-tildeling opprettet",
      });
    },
    onError: (error) => {
      console.error('Display assignment creation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke opprette display-tildeling: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDisplayAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DisplayAssignment> & { id: string }) => {
      const { data, error } = await supabase
        .from('display_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayAssignments'] });
      toast({
        title: "Suksess",
        description: "Display-tildeling oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere display-tildeling: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDisplayAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Finn tildelingen først for å få customer_id
      const { data: assignment } = await supabase
        .from('display_assignments')
        .select('customer_id')
        .eq('id', id)
        .single();

      if (assignment) {
        // Nullstill customer felt
        await supabase
          .from('customers')
          .update({
            display_url: null,
            assigned_display_station_id: null,
          })
          .eq('id', assignment.customer_id);
      }

      // Slett tildelingen
      const { error } = await supabase
        .from('display_assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['displayAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Suksess",
        description: "Display-tildeling slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette display-tildeling: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
