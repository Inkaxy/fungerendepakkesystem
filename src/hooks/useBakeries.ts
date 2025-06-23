import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

interface Bakery {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export const useBakeries = () => {
  return useQuery({
    queryKey: ['bakeries'],
    queryFn: async () => {
      console.log('🔍 Fetching bakeries...');
      
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session?.user?.email || 'No session');
      
      if (!session?.user) {
        console.error('❌ No authenticated user found');
        throw new Error('Du må være logget inn for å se bakerier');
      }

      // Check user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', session.user.id)
        .maybeSingle();

      console.log('User profile:', profile);
      
      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        throw new Error('Kunne ikke hente brukerprofil');
      }

      if (!profile || profile.role !== 'super_admin') {
        console.error('❌ User is not super admin:', profile?.role);
        throw new Error('Du må være super admin for å se bakerier');
      }

      const { data, error } = await supabase
        .from('bakeries')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching bakeries:', error);
        throw error;
      }
      
      console.log('✅ Bakeries fetched successfully:', data?.length);
      return data as Bakery[];
    },
  });
};

export const useCreateBakery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, profile } = useAuthStore();

  return useMutation({
    mutationFn: async (bakery: Omit<Bakery, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('🏗️ Creating bakery:', bakery.name);
      
      // Check authentication
      if (!user) {
        console.error('❌ No authenticated user');
        throw new Error('Du må være logget inn for å opprette bakeri');
      }

      // Check user role
      if (!profile || profile.role !== 'super_admin') {
        console.error('❌ User is not super admin:', profile?.role);
        throw new Error('Du må være super admin for å opprette bakeri');
      }

      console.log('✅ User authenticated:', user.email, 'Role:', profile.role);

      const { data, error } = await supabase
        .from('bakeries')
        .insert(bakery)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating bakery:', error);
        throw error;
      }
      
      console.log('✅ Bakery created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakeries'] });
      toast({
        title: "Suksess",
        description: "Bakeri opprettet",
      });
    },
    onError: (error) => {
      console.error('Create bakery mutation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke opprette bakeri: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBakery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Bakery> & { id: string }) => {
      const { data, error } = await supabase
        .from('bakeries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakeries'] });
      toast({
        title: "Suksess",
        description: "Bakeri oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere bakeri: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBakery = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to delete bakery with ID:', id);
      
      const { error } = await supabase
        .from('bakeries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Bakery deletion error:', error);
        throw error;
      }
      
      console.log('Bakery deleted successfully');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bakeries'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bakeri slettet",
      });
    },
    onError: (error) => {
      console.error('Delete bakery mutation error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke slette bakeri: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
