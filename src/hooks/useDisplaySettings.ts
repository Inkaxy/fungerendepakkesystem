
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getDefaultSettings } from '@/utils/displaySettingsDefaults';
import { useAuthStore } from '@/stores/authStore';

// DisplaySettings type defined locally to avoid circular imports
export interface DisplaySettings {
  id: string;
  bakery_id: string;
  screen_type: string;
  background_type: string;
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_gradient_direction: string;
  background_image_url?: string;
  background_overlay_opacity: number;
  header_font_size: number;
  body_font_size: number;
  text_color: string;
  header_text_color: string;
  card_background_color: string;
  card_border_color: string;
  card_shadow_intensity: number;
  border_radius: number;
  card_border_width: number;
  spacing: number;
  card_hover_effect: boolean;
  product_card_size: number;
  product_card_color: string;
  product_text_color: string;
  product_accent_color: string;
  product_name_font_size: number;
  product_quantity_font_size: number;
  product_unit_font_size: number;
  product_name_font_weight: number;
  product_quantity_font_weight: number;
  product_spacing: number;
  product_card_padding: number;
  show_product_unit: boolean;
  line_items_count_font_size: number;
  product_1_bg_color: string;
  product_2_bg_color: string;
  product_3_bg_color: string;
  product_1_text_color: string;
  product_2_text_color: string;
  product_3_text_color: string;
  product_1_accent_color: string;
  product_2_accent_color: string;
  product_3_accent_color: string;
  status_pending_color: string;
  status_in_progress_color: string;
  status_completed_color: string;
  status_delivered_color: string;
  packing_status_ongoing_color: string;
  packing_status_completed_color: string;
  show_progress_bar: boolean;
  progress_bar_color: string;
  progress_background_color: string;
  progress_height: number;
  show_progress_percentage: boolean;
  progress_animation: boolean;
  show_truck_icon: boolean;
  truck_icon_size: number;
  show_status_indicator: boolean;
  status_indicator_font_size: number;
  status_indicator_padding: number;
  status_badge_font_size: number;
  enable_animations: boolean;
  animation_speed: string;
  fade_transitions: boolean;
  pulse_on_update: boolean;
  main_title: string;
  subtitle: string;
  show_main_title: boolean;
  show_subtitle: boolean;
  show_date_indicator: boolean;
  shared_show_clock: boolean;
  shared_show_logo: boolean;
  shared_logo_url: string;
  shared_logo_size: number;
  shared_header_alignment: string;
  show_stats_cards: boolean;
  stats_columns: number;
  stats_card_height: string;
  stats_card_style: string;
  stats_show_percentage: boolean;
  stats_show_icons: boolean;
  stats_icon_color: string;
  customer_cards_columns: number;
  customer_card_height: string;
  customer_card_style: string;
  customer_cards_gap: number;
  customer_name_font_size: number;
  show_customer_numbers: boolean;
  show_customer_progress_bar: boolean;
  customer_sort_order: string;
  max_products_per_card: number;
  product_list_style: string;
  shared_product_font_size: number;
  show_line_items_count: boolean;
  shared_show_product_quantity: boolean;
  shared_hide_completed_customers: boolean;
  shared_completed_customer_opacity: number;
  shared_fullscreen_mode: boolean;
  shared_auto_scroll: boolean;
  shared_scroll_speed: number;
  shared_content_padding: number;
  auto_fit_screen: boolean;
  always_show_customer_name: boolean;
  customer_display_show_date: boolean;
  customer_show_bakery_name: boolean;
  customer_show_delivery_info: boolean;
  customer_display_header_size: number;
  customer_header_alignment: string;
  show_status_badges: boolean;
  strikethrough_completed_products: boolean;
  hide_completed_products: boolean;
  product_card_layout: string;
  product_columns: number;
  product_show_category: boolean;
  product_group_by_status: boolean;
  compact_status_progress: boolean;
  progress_bar_style: string;
  progress_show_fraction: boolean;
  truck_animation_style: string;
  customer_completion_message: string;
  customer_show_completion_animation: boolean;
  customer_completion_sound: boolean;
  high_contrast_mode: boolean;
  large_touch_targets: boolean;
  reduce_motion: boolean;
  customer_fullscreen_mode: boolean;
  customer_content_padding: number;
  customer_max_content_width: number;
  use_consistent_product_colors: boolean;
  show_basket_quantity: boolean;
  show_customer_info?: boolean;
  show_order_numbers?: boolean;
  show_delivery_dates?: boolean;
  show_product_images?: boolean;
  auto_refresh_interval?: number;
}

export const useDisplaySettings = () => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['display-settings', profile?.bakery_id],
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
          packing_status_completed_color: (newSettings as any).status_completed_color || '#10b981',
          compact_status_progress: (newSettings as any).compact_status_progress ?? true,
          // New customer display specific fields
          customer_display_show_date: (newSettings as any).customer_display_show_date ?? true,
          customer_display_header_size: (newSettings as any).customer_display_header_size ?? 32,
          hide_completed_products: (newSettings as any).hide_completed_products ?? false,
          high_contrast_mode: (newSettings as any).high_contrast_mode ?? false,
        } as DisplaySettings;
        console.log('Created new settings:', mappedSettings);
        return mappedSettings;
      }
      
      const existingData = data[0] as any;
      const mappedData: DisplaySettings = {
        ...existingData,
        screen_type: existingData.screen_type || 'shared',
        packing_status_ongoing_color: existingData.status_in_progress_color || '#3b82f6',
        packing_status_completed_color: existingData.status_completed_color || '#10b981',
        compact_status_progress: existingData.compact_status_progress ?? true,
        // New customer display specific fields
        customer_display_show_date: existingData.customer_display_show_date ?? true,
        customer_display_header_size: existingData.customer_display_header_size ?? 32,
        hide_completed_products: existingData.hide_completed_products ?? false,
        high_contrast_mode: existingData.high_contrast_mode ?? false,
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
      const { profile } = useAuthStore.getState();
      // Immediately invalidate all relevant queries with bakery_id
      queryClient.invalidateQueries({ queryKey: ['display-settings', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['packing-data', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['customers', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', profile?.bakery_id] });
      
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
