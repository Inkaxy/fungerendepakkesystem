
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateProfileData } from '@/types/profile';

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: CreateProfileData) => {
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
