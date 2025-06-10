
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DisplaySettings {
  id: string;
  bakery_id: string;
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_image_url?: string;
  header_font_size: number;
  body_font_size: number;
  text_color: string;
  header_text_color: string;
  card_background_color: string;
  card_border_color: string;
  card_shadow_intensity: number;
  border_radius: number;
  spacing: number;
  product_card_color: string;
  product_text_color: string;
  product_accent_color: string;
  product_card_size: number;
  // Individual product background colors
  product_1_bg_color: string;
  product_2_bg_color: string;
  product_3_bg_color: string;
  // Individual product text colors
  product_1_text_color: string;
  product_2_text_color: string;
  product_3_text_color: string;
  // Individual product accent colors
  product_1_accent_color: string;
  product_2_accent_color: string;
  product_3_accent_color: string;
  // Packing-specific settings
  packing_status_ongoing_color: string;
  packing_status_completed_color: string;
  progress_bar_color: string;
  progress_background_color: string;
  progress_height: number;
  show_progress_percentage: boolean;
  show_progress_bar: boolean;
  auto_refresh_interval: number;
  // Truck icon settings
  show_truck_icon: boolean;
  truck_icon_size: number;
  // Status indicator settings
  show_status_indicator: boolean;
  status_indicator_font_size: number;
  status_indicator_padding: number;
  // Legacy status colors for backward compatibility
  status_in_progress_color?: string;
  status_completed_color?: string;
  status_pending_color?: string;
  status_delivered_color?: string;
  // Additional display options
  show_customer_info?: boolean;
  show_order_numbers?: boolean;
  show_delivery_dates?: boolean;
  show_product_images?: boolean;
  // Animation settings
  enable_animations: boolean;
  animation_speed: 'slow' | 'normal' | 'fast';
  fade_transitions: boolean;
  progress_animation: boolean;
  // Customer name display setting
  always_show_customer_name: boolean;
}

const getDefaultSettings = (bakery_id: string) => ({
  bakery_id,
  background_type: 'gradient' as const,
  background_color: '#ffffff',
  background_gradient_start: '#f3f4f6',
  background_gradient_end: '#e5e7eb',
  background_image_url: null,
  header_font_size: 32,
  body_font_size: 16,
  text_color: '#111827',
  header_text_color: '#111827',
  card_background_color: '#ffffff',
  card_border_color: '#e5e7eb',
  card_shadow_intensity: 3,
  border_radius: 8,
  spacing: 16,
  product_card_color: '#ffffff',
  product_text_color: '#374151',
  product_accent_color: '#3b82f6',
  product_card_size: 100,
  product_1_bg_color: '#ffffff',
  product_2_bg_color: '#f9fafb',
  product_3_bg_color: '#f3f4f6',
  product_1_text_color: '#1f2937',
  product_2_text_color: '#1f2937',
  product_3_text_color: '#1f2937',
  product_1_accent_color: '#3b82f6',
  product_2_accent_color: '#10b981',
  product_3_accent_color: '#f59e0b',
  progress_bar_color: '#3b82f6',
  progress_background_color: '#e5e7eb',
  progress_height: 8,
  show_progress_percentage: true,
  show_progress_bar: true,
  auto_refresh_interval: 30,
  show_truck_icon: false,
  truck_icon_size: 24,
  show_status_indicator: true,
  status_indicator_font_size: 32,
  status_indicator_padding: 24,
  status_in_progress_color: '#3b82f6',
  status_completed_color: '#10b981',
  status_pending_color: '#f59e0b',
  status_delivered_color: '#059669',
  show_customer_info: true,
  show_order_numbers: true,
  show_delivery_dates: true,
  show_product_images: false,
  enable_animations: true,
  animation_speed: 'normal' as const,
  fade_transitions: true,
  progress_animation: true,
  always_show_customer_name: true,
});

export const useDisplaySettings = () => {
  return useQuery({
    queryKey: ['display-settings'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      console.log('Fetching display settings for user:', user.user.id);

      // Try to get existing settings
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('bakery_id', user.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching display settings:', error);
        throw error;
      }
      
      // If no settings exist, create default ones
      if (!data) {
        console.log('No existing settings found, creating defaults');
        const defaultSettings = getDefaultSettings(user.user.id);
        
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
        };
        
        return mappedData as DisplaySettings;
      }
      
      console.log('Found existing settings:', data);
      
      // Map database fields to interface properties
      const mappedData = {
        ...data,
        packing_status_ongoing_color: data.status_in_progress_color || '#3b82f6',
        packing_status_completed_color: data.status_completed_color || '#10b981',
        // Set defaults for missing properties
        show_status_indicator: data.show_status_indicator ?? true,
        status_indicator_font_size: data.status_indicator_font_size ?? 32,
        status_indicator_padding: data.status_indicator_padding ?? 24,
        product_1_bg_color: data.product_1_bg_color || '#ffffff',
        product_2_bg_color: data.product_2_bg_color || '#f9fafb',
        product_3_bg_color: data.product_3_bg_color || '#f3f4f6',
        product_1_text_color: data.product_1_text_color || '#1f2937',
        product_2_text_color: data.product_2_text_color || '#1f2937',
        product_3_text_color: data.product_3_text_color || '#1f2937',
        product_1_accent_color: data.product_1_accent_color || '#3b82f6',
        product_2_accent_color: data.product_2_accent_color || '#10b981',
        product_3_accent_color: data.product_3_accent_color || '#f59e0b',
        show_progress_bar: data.show_progress_bar ?? true,
        show_truck_icon: data.show_truck_icon ?? false,
        truck_icon_size: data.truck_icon_size ?? 24,
        show_customer_info: data.show_customer_info ?? true,
        show_order_numbers: data.show_order_numbers ?? true,
        show_delivery_dates: data.show_delivery_dates ?? true,
        show_product_images: data.show_product_images ?? false,
        status_pending_color: data.status_pending_color || '#f59e0b',
        enable_animations: data.enable_animations ?? true,
        animation_speed: data.animation_speed || 'normal',
        fade_transitions: data.fade_transitions ?? true,
        progress_animation: data.progress_animation ?? true,
        always_show_customer_name: data.always_show_customer_name ?? true,
      };
      
      return mappedData as DisplaySettings;
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

      // Map interface properties back to database column names
      const dbSettings = { ...settings };
      
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
      
      // Clean up any undefined values
      Object.keys(dbSettings).forEach(key => {
        if (dbSettings[key] === undefined) {
          delete dbSettings[key];
        }
      });

      console.log('Cleaned settings for database:', dbSettings);

      // Try to update existing settings first
      const { data: updateData, error: updateError } = await supabase
        .from('display_settings')
        .update(dbSettings)
        .eq('bakery_id', user.user.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // If no rows were affected (no existing settings), create new ones
      if (!updateData) {
        console.log('No existing settings to update, creating new ones');
        const defaultSettings = getDefaultSettings(user.user.id);
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
