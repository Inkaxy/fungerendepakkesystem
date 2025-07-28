
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DisplaySettings } from '@/types/displaySettings';
import { getDefaultSettings } from '@/utils/displaySettingsDefaults';

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

      // Try to get existing settings using bakery_id for shared screen type
      const result = await (supabase as any)
        .from('display_settings')
        .select('*')
        .eq('bakery_id', profile.bakery_id)
        .eq('screen_type', 'shared')
        .limit(1);

      const { data, error } = result;

      if (error) {
        console.error('Error fetching display settings:', error);
        throw error;
      }
      
      // If no settings exist, create default ones
      if (!data || data.length === 0) {
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
        
        const mappedSettings: DisplaySettings = {
          ...newSettings,
          screen_type: (newSettings as any).screen_type || 'shared',
          packing_status_ongoing_color: (newSettings as any).status_in_progress_color || '#3b82f6',
          packing_status_completed_color: (newSettings as any).status_completed_color || '#10b981'
        } as DisplaySettings;
        console.log('Created new settings:', mappedSettings);
        return mappedSettings;
      }
      
      const existingData = data[0] as any;
      const mappedData: DisplaySettings = {
        ...existingData,
        screen_type: existingData.screen_type || 'shared',
        packing_status_ongoing_color: existingData.status_in_progress_color || '#3b82f6',
        packing_status_completed_color: existingData.status_completed_color || '#10b981'
      } as DisplaySettings;
      console.log('Found existing settings:', mappedData);
      return mappedData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - longer stale time since we have real-time updates
    refetchOnWindowFocus: false, // Disable since we have real-time
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

      // Map interface properties back to database column names manually
      const dbSettings: any = { ...settings };
      
      // Map packing status colors back to legacy database column names
      if (settings.packing_status_ongoing_color) {
        dbSettings.status_in_progress_color = settings.packing_status_ongoing_color;
        delete dbSettings.packing_status_ongoing_color;
      }
      
      if (settings.packing_status_completed_color) {
        dbSettings.status_completed_color = settings.packing_status_completed_color;
        delete dbSettings.packing_status_completed_color;
      }

      // Remove id and any undefined values
      delete dbSettings.id;

      console.log('Cleaned settings for database:', dbSettings);

      // Try to update existing settings first for shared screen type
      const updateResult = await (supabase as any)
        .from('display_settings')
        .update(dbSettings)
        .eq('bakery_id', profile.bakery_id)
        .eq('screen_type', 'shared')
        .select();

      const { data: updateData, error: updateError } = updateResult;

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // If no rows were affected (no existing settings), create new ones
      if (!updateData || updateData.length === 0) {
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

      console.log('Updated settings:', updateData[0]);
      return updateData[0];
    },
    onSuccess: () => {
      // Immediately invalidate all relevant queries to trigger updates
      queryClient.invalidateQueries({ queryKey: ['display-settings'] });
      queryClient.invalidateQueries({ queryKey: ['packing-data'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      console.log('Display settings updated - cache invalidated');
      
      toast({
        title: "Innstillinger lagret",
        description: "Alle displayer oppdateres automatisk med nye innstillinger",
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
