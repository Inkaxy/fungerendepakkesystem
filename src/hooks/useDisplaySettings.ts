import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DisplaySettings } from '@/types/displaySettings';
import { getDefaultSettings } from '@/utils/displaySettingsDefaults';
import { mapDatabaseToDisplaySettings, mapDisplaySettingsToDatabase } from '@/utils/displaySettingsMappers';

export type { DisplaySettings } from '@/types/displaySettings';

export const useDisplaySettings = () => {
  return useQuery({
    queryKey: ['display-settings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      console.log('Fetching display settings for user:', user.user.id);

      // First get user's profile to get bakery_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profile?.bakery_id) {
        throw new Error('No bakery found for user');
      }

      console.log('Using bakery_id:', profile.bakery_id);

      // Try to get existing settings using bakery_id
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('bakery_id', profile.bakery_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching display settings:', error);
        throw error;
      }
      
      // If no settings exist, create default ones
      if (!data) {
        console.log('No existing settings found, creating defaults');
        const defaultSettings = getDefaultSettings(profile.bakery_id);
        
        const { data: newSettings, error: createError } = await supabase
          .from('display_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (createError) {
          console.error('Error creating default settings:', createError);
          throw createError;
        }
        
        console.log('Created new settings:', newSettings);
        
        // Map the new settings to interface properties
        const mappedData = {
          ...newSettings,
          packing_status_ongoing_color: newSettings.status_in_progress_color || '#3b82f6',
          packing_status_completed_color: newSettings.status_completed_color || '#10b981',
          // Add cat animation defaults for new settings - these don't exist in DB yet
          enable_cat_animations: false,
          cat_animation_speed: 'normal' as const,
          show_bouncing_cats: true,
          show_falling_cats: true,
          show_running_cats: true,
        };
        
        return mappedData as DisplaySettings;
      }
      
      console.log('Found existing settings:', data);
      
      // Map database fields to interface properties
      return mapDatabaseToDisplaySettings(data);
    },
  });
};

export const useUpdateDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<DisplaySettings>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      console.log('Updating display settings:', settings);

      // First get user's profile to get bakery_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profile?.bakery_id) {
        throw new Error('No bakery found for user');
      }

      console.log('Using bakery_id for update:', profile.bakery_id);

      // Map interface properties back to database column names
      const dbSettings = mapDisplaySettingsToDatabase(settings);

      console.log('Cleaned settings for database:', dbSettings);

      // Try to update existing settings first
      const { data: updateData, error: updateError } = await supabase
        .from('display_settings')
        .update(dbSettings)
        .eq('bakery_id', profile.bakery_id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // If no rows were affected (no existing settings), create new ones
      if (!updateData) {
        console.log('No existing settings to update, creating new ones');
        const defaultSettings = getDefaultSettings(profile.bakery_id);
        const newSettings = { ...defaultSettings, ...dbSettings };
        
        const { data: insertData, error: insertError } = await supabase
          .from('display_settings')
          .insert(newSettings)
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        
        console.log('Created new settings:', insertData);
        return insertData;
      }

      console.log('Updated settings:', updateData);
      return updateData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['display-settings'] });
      toast({
        title: "Innstillinger lagret",
        description: "Display-innstillingene er oppdatert",
      });
    },
    onError: (error) => {
      console.error('Display settings update error:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre innstillinger",
        variant: "destructive",
      });
    },
  });
};
