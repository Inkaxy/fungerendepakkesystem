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
      // Normalize email to lowercase to avoid validation issues
      const normalizedEmail = profile.email.toLowerCase().trim();
      
      console.log('Creating user with email:', normalizedEmail);

      // Create user with regular signUp (this will create both auth.users and profiles entry)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: profile.password,
        options: {
          data: {
            name: profile.name,
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Bruker ble ikke opprettet');
      }

      console.log('User created, updating profile for ID:', authData.user.id);

      // Wait a bit to ensure the profile trigger has run
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker opprettet med passord. Brukeren kan nå logge inn.",
      });
    },
    onError: (error: any) => {
      console.error('Create profile error:', error);
      let errorMessage = 'Kunne ikke opprette bruker';
      
      if (error.message?.includes('email_address_invalid')) {
        errorMessage = 'Ugyldig e-postadresse. Vennligst bruk en gyldig e-post.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'En bruker med denne e-postadressen finnes allerede.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Feil",
        description: errorMessage,
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
