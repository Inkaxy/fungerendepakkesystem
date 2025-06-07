import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email?: string;
  name?: string;
  role: 'super_admin' | 'bakery_admin' | 'bakery_user';
  bakery_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          bakery:bakeries(name)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: {
      email: string;
      name: string;
      password: string;
      role: Profile['role'];
      bakery_id?: string;
    }) => {
      // Create user with regular signUp (this will create both auth.users and profiles entry)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profile.email,
        password: profile.password,
        options: {
          data: {
            name: profile.name,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Bruker ble ikke opprettet');

      // Update the profile that was automatically created with the correct role and bakery
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          role: profile.role,
          bakery_id: profile.bakery_id,
          email_confirmed: true, // Since admin is creating this user
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker opprettet med passord. Brukeren kan nå logge inn.",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke opprette bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker oppdatert",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke oppdatere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from auth.users (this will cascade to profiles due to the foreign key)
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker slettet",
      });
    },
    onError: (error) => {
      toast({
        title: "Feil",
        description: `Kunne ikke slette bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
