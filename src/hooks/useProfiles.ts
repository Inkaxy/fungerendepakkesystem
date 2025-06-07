
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

      console.log('User created, checking if profile exists for ID:', authData.user.id);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      let profileData;

      if (existingProfile) {
        console.log('Profile exists, updating it');
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            role: profile.role,
            bakery_id: profile.bakery_id,
            email_confirmed: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authData.user.id)
          .select()
          .maybeSingle();

        if (error) {
          console.error('Profile update error:', error);
          throw error;
        }
        profileData = data;
      } else {
        console.log('Profile does not exist, creating it manually');
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: normalizedEmail,
            name: profile.name,
            role: profile.role,
            bakery_id: profile.bakery_id,
            email_confirmed: true,
            provider: 'email',
            is_active: true,
          })
          .select()
          .single();

        if (error) {
          console.error('Profile creation error:', error);
          throw error;
        }
        profileData = data;
      }
      
      console.log('Profile operation successful:', profileData);
      return profileData;
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
        .maybeSingle();

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
      console.log('Attempting to deactivate user with ID:', id);
      
      // Instead of deleting, we'll deactivate the user
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('User deactivation error:', error);
        throw error;
      }
      
      console.log('User deactivated successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker deaktivert",
      });
    },
    onError: (error) => {
      console.error('Deactivate user error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke deaktivere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

// NEW: Permanent delete function
export const usePermanentDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to permanently delete user with ID:', id);
      
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('User permanent deletion error:', error);
        throw error;
      }
      
      console.log('User permanently deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker permanent slettet",
      });
    },
    onError: (error) => {
      console.error('Permanent delete user error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke slette bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useReactivateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Attempting to reactivate user with ID:', id);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('User reactivation error:', error);
        throw error;
      }
      
      console.log('User reactivated successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({
        title: "Suksess",
        description: "Bruker reaktivert",
      });
    },
    onError: (error) => {
      console.error('Reactivate user error:', error);
      toast({
        title: "Feil",
        description: `Kunne ikke reaktivere bruker: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
