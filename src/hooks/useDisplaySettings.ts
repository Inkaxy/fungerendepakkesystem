
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
}

export const useDisplaySettings = () => {
  return useQuery({
    queryKey: ['display-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .single();

      if (error) throw error;
      
      // Map database fields to interface properties, using legacy names as fallbacks
      const mappedData = {
        ...data,
        packing_status_ongoing_color: data.status_in_progress_color || '#3b82f6',
        packing_status_completed_color: data.status_completed_color || '#10b981',
        // Set defaults for status indicator settings
        show_status_indicator: data.show_status_indicator ?? true,
        status_indicator_font_size: data.status_indicator_font_size ?? 32,
        status_indicator_padding: data.status_indicator_padding ?? 24,
        // Set defaults for new individual product colors
        product_1_bg_color: data.product_1_bg_color || '#ffffff',
        product_2_bg_color: data.product_2_bg_color || '#f9fafb',
        product_3_bg_color: data.product_3_bg_color || '#f3f4f6',
        product_1_text_color: data.product_1_text_color || '#1f2937',
        product_2_text_color: data.product_2_text_color || '#1f2937',
        product_3_text_color: data.product_3_text_color || '#1f2937',
        product_1_accent_color: data.product_1_accent_color || '#3b82f6',
        product_2_accent_color: data.product_2_accent_color || '#10b981',
        product_3_accent_color: data.product_3_accent_color || '#f59e0b',
        // Set defaults for progress bar and truck icon
        show_progress_bar: data.show_progress_bar ?? true,
        show_truck_icon: data.show_truck_icon ?? false,
        truck_icon_size: data.truck_icon_size ?? 24,
        // Set defaults for missing properties
        show_customer_info: data.show_customer_info ?? true,
        show_order_numbers: data.show_order_numbers ?? true,
        show_delivery_dates: data.show_delivery_dates ?? true,
        show_product_images: data.show_product_images ?? false,
        status_pending_color: data.status_pending_color || '#f59e0b',
        // Set defaults for animation settings
        enable_animations: data.enable_animations ?? true,
        animation_speed: data.animation_speed || 'normal',
        fade_transitions: data.fade_transitions ?? true,
        progress_animation: data.progress_animation ?? true,
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

      // Remove any properties that don't exist in the database schema
      const allowedProperties = [
        'background_type', 'background_color', 'background_gradient_start', 'background_gradient_end',
        'background_image_url', 'header_font_size', 'body_font_size', 'text_color', 'header_text_color',
        'card_background_color', 'card_border_color', 'card_shadow_intensity', 'border_radius',
        'spacing', 'product_card_color', 'product_text_color', 'product_accent_color', 'product_card_size',
        'product_1_bg_color', 'product_2_bg_color', 'product_3_bg_color',
        'product_1_text_color', 'product_2_text_color', 'product_3_text_color',
        'product_1_accent_color', 'product_2_accent_color', 'product_3_accent_color',
        'progress_bar_color', 'progress_background_color', 'progress_height', 'show_progress_percentage',
        'show_progress_bar', 'show_truck_icon', 'truck_icon_size',
        'auto_refresh_interval', 'show_status_indicator', 'status_indicator_font_size', 'status_indicator_padding',
        'status_in_progress_color', 'status_completed_color', 'status_pending_color', 'status_delivered_color',
        'show_customer_info', 'show_order_numbers', 'show_delivery_dates', 'show_product_images',
        'enable_animations', 'animation_speed', 'fade_transitions', 'progress_animation'
      ];

      // Filter to only include allowed database properties
      const filteredSettings = Object.keys(dbSettings)
        .filter(key => allowedProperties.includes(key))
        .reduce((obj, key) => {
          obj[key] = dbSettings[key];
          return obj;
        }, {} as any);

      const { data, error } = await supabase
        .from('display_settings')
        .update(filteredSettings)
        .eq('bakery_id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
