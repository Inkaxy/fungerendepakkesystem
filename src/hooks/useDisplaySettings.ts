
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getDefaultSettings } from '@/utils/displaySettingsDefaults';
import { useAuthStore } from '@/stores/authStore';
import { QUERY_KEYS } from '@/lib/queryKeys';

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
  auto_fit_min_card_height?: number;
  auto_fit_min_card_width?: number;
  shared_compact_table_mode?: boolean;
  shared_show_completion_icon?: boolean;
  grid_layout_mode?: 'auto' | 'fixed';
  grid_fixed_rows?: number;
  grid_fixed_columns?: number;
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

// Helper to map DB row to DisplaySettings interface
const mapDbRowToSettings = (row: any): DisplaySettings => ({
  ...row,
  screen_type: row.screen_type || 'shared',
  packing_status_ongoing_color: row.status_in_progress_color || '#3b82f6',
  packing_status_completed_color: row.status_completed_color || '#10b981',
  compact_status_progress: row.compact_status_progress ?? true,
  auto_fit_min_card_height: row.auto_fit_min_card_height ?? 180,
  customer_display_show_date: row.customer_display_show_date ?? true,
  customer_display_header_size: row.customer_display_header_size ?? 32,
  hide_completed_products: row.hide_completed_products ?? false,
  high_contrast_mode: row.high_contrast_mode ?? false,
} as DisplaySettings);

/**
 * Henter innstillinger for admin-panelet.
 * Bruker BEGGE screen_type-rader (shared+customer) som én sammenslått konfigurasjon.
 * Fanen "Delt visning" påvirker shared-raden, "Kundevisning" påvirker customer-raden.
 */
export const useDisplaySettings = () => {
  const { profile } = useAuthStore();
  
  return useQuery({
    queryKey: ['display-settings', profile?.bakery_id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      console.log('Fetching display settings for user:', user.user.id);

      // First get user's profile to get bakery_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profileData?.bakery_id) {
        throw new Error('No bakery found for user');
      }

      console.log('Using bakery_id:', profileData.bakery_id);

      // Hent BEGGE screen_type-rader (shared + customer)
      const { data, error } = await supabase
        .from('display_settings')
        .select('*')
        .eq('bakery_id', profileData.bakery_id);

      if (error) {
        console.error('Error fetching display settings:', error);
        throw error;
      }

      // Finn shared og customer rader
      const sharedRow = data?.find((r: any) => r.screen_type === 'shared');
      const customerRow = data?.find((r: any) => r.screen_type === 'customer');

      // Opprett manglende rader hvis de ikke finnes
      const settingsToCreate: any[] = [];
      
      if (!sharedRow) {
        console.log('Creating default shared settings');
        settingsToCreate.push({ ...getDefaultSettings(profileData.bakery_id), screen_type: 'shared' });
      }
      
      if (!customerRow) {
        console.log('Creating default customer settings');
        settingsToCreate.push({ ...getDefaultSettings(profileData.bakery_id), screen_type: 'customer' });
      }

      if (settingsToCreate.length > 0) {
        const { data: newRows, error: createError } = await supabase
          .from('display_settings')
          .insert(settingsToCreate)
          .select();

        if (createError) {
          console.error('Error creating default settings:', createError);
          throw createError;
        }

        // Oppdater shared/customerRow fra nyopprettede rader
        for (const row of newRows || []) {
          if ((row as any).screen_type === 'shared' && !sharedRow) {
            Object.assign(sharedRow || {}, row);
          }
          if ((row as any).screen_type === 'customer' && !customerRow) {
            Object.assign(customerRow || {}, row);
          }
        }

        // Refetch for å være sikker
        const { data: refetchedData } = await supabase
          .from('display_settings')
          .select('*')
          .eq('bakery_id', profileData.bakery_id);
        
        const refetchedShared = refetchedData?.find((r: any) => r.screen_type === 'shared');
        const refetchedCustomer = refetchedData?.find((r: any) => r.screen_type === 'customer');
        
        // Kombiner shared og customer til ett objekt (shared er basis, customer overskriver customer-spesifikke felter)
        const mergedSettings = {
          ...mapDbRowToSettings(refetchedShared || getDefaultSettings(profileData.bakery_id)),
          // Behold customer-spesifikke felter fra customer-raden
          ...(refetchedCustomer ? {
            // Header settings
            customer_name_font_size: refetchedCustomer.customer_name_font_size,
            customer_display_show_date: refetchedCustomer.customer_display_show_date,
            customer_display_header_size: refetchedCustomer.customer_display_header_size,
            customer_show_bakery_name: refetchedCustomer.customer_show_bakery_name,
            customer_show_delivery_info: refetchedCustomer.customer_show_delivery_info,
            customer_header_alignment: refetchedCustomer.customer_header_alignment,
            always_show_customer_name: refetchedCustomer.always_show_customer_name,
            // Layout settings
            customer_fullscreen_mode: refetchedCustomer.customer_fullscreen_mode,
            customer_content_padding: refetchedCustomer.customer_content_padding,
            customer_max_content_width: refetchedCustomer.customer_max_content_width,
            // Progress settings
            compact_status_progress: refetchedCustomer.compact_status_progress,
            show_status_indicator: refetchedCustomer.show_status_indicator,
            status_indicator_font_size: refetchedCustomer.status_indicator_font_size,
            status_indicator_padding: refetchedCustomer.status_indicator_padding,
            progress_bar_style: refetchedCustomer.progress_bar_style,
            progress_show_fraction: refetchedCustomer.progress_show_fraction,
            progress_animation: refetchedCustomer.progress_animation,
            truck_animation_style: refetchedCustomer.truck_animation_style,
            // Product settings
            hide_completed_products: refetchedCustomer.hide_completed_products,
            strikethrough_completed_products: refetchedCustomer.strikethrough_completed_products,
            product_card_layout: refetchedCustomer.product_card_layout,
            product_columns: refetchedCustomer.product_columns,
            product_show_category: refetchedCustomer.product_show_category,
            product_group_by_status: refetchedCustomer.product_group_by_status,
            product_card_size: refetchedCustomer.product_card_size,
            product_unit_font_size: refetchedCustomer.product_unit_font_size,
            product_name_font_weight: refetchedCustomer.product_name_font_weight,
            product_quantity_font_weight: refetchedCustomer.product_quantity_font_weight,
            show_line_items_count: refetchedCustomer.show_line_items_count,
            line_items_count_font_size: refetchedCustomer.line_items_count_font_size,
            show_basket_quantity: refetchedCustomer.show_basket_quantity,
            // Completion settings
            customer_completion_message: refetchedCustomer.customer_completion_message,
            customer_show_completion_animation: refetchedCustomer.customer_show_completion_animation,
            customer_completion_sound: refetchedCustomer.customer_completion_sound,
            // Accessibility settings
            high_contrast_mode: refetchedCustomer.high_contrast_mode,
            large_touch_targets: refetchedCustomer.large_touch_targets,
            reduce_motion: refetchedCustomer.reduce_motion,
          } : {}),
        };
        
        console.log('Merged settings:', mergedSettings);
        return mergedSettings;
      }

      // Kombiner shared og customer til ett objekt
      const mergedSettings = {
        ...mapDbRowToSettings(sharedRow || getDefaultSettings(profileData.bakery_id)),
        // Behold customer-spesifikke felter fra customer-raden
        ...(customerRow ? {
          // Header settings
          customer_name_font_size: customerRow.customer_name_font_size,
          customer_display_show_date: customerRow.customer_display_show_date,
          customer_display_header_size: customerRow.customer_display_header_size,
          customer_show_bakery_name: customerRow.customer_show_bakery_name,
          customer_show_delivery_info: customerRow.customer_show_delivery_info,
          customer_header_alignment: customerRow.customer_header_alignment,
          always_show_customer_name: customerRow.always_show_customer_name,
          // Layout settings
          customer_fullscreen_mode: customerRow.customer_fullscreen_mode,
          customer_content_padding: customerRow.customer_content_padding,
          customer_max_content_width: customerRow.customer_max_content_width,
          // Progress settings
          compact_status_progress: customerRow.compact_status_progress,
          show_status_indicator: customerRow.show_status_indicator,
          status_indicator_font_size: customerRow.status_indicator_font_size,
          status_indicator_padding: customerRow.status_indicator_padding,
          progress_bar_style: customerRow.progress_bar_style,
          progress_show_fraction: customerRow.progress_show_fraction,
          progress_animation: customerRow.progress_animation,
          truck_animation_style: customerRow.truck_animation_style,
          // Product settings
          hide_completed_products: customerRow.hide_completed_products,
          strikethrough_completed_products: customerRow.strikethrough_completed_products,
          product_card_layout: customerRow.product_card_layout,
          product_columns: customerRow.product_columns,
          product_show_category: customerRow.product_show_category,
          product_group_by_status: customerRow.product_group_by_status,
          product_card_size: customerRow.product_card_size,
          product_unit_font_size: customerRow.product_unit_font_size,
          product_name_font_weight: customerRow.product_name_font_weight,
          product_quantity_font_weight: customerRow.product_quantity_font_weight,
          show_line_items_count: customerRow.show_line_items_count,
          line_items_count_font_size: customerRow.line_items_count_font_size,
          show_basket_quantity: customerRow.show_basket_quantity,
          // Completion settings
          customer_completion_message: customerRow.customer_completion_message,
          customer_show_completion_animation: customerRow.customer_show_completion_animation,
          customer_completion_sound: customerRow.customer_completion_sound,
          // Accessibility settings
          high_contrast_mode: customerRow.high_contrast_mode,
          large_touch_targets: customerRow.large_touch_targets,
          reduce_motion: customerRow.reduce_motion,
        } : {}),
      };
      
      console.log('Found existing merged settings:', mergedSettings);
      return mergedSettings;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Felter som skal lagres til customer-raden (ikke shared)
const CUSTOMER_SPECIFIC_FIELDS = [
  // Header settings
  'customer_name_font_size',
  'customer_display_show_date',
  'customer_display_header_size',
  'customer_show_bakery_name',
  'customer_show_delivery_info',
  'customer_header_alignment',
  'always_show_customer_name',
  // Layout settings
  'customer_fullscreen_mode',
  'customer_content_padding',
  'customer_max_content_width',
  // Progress settings
  'compact_status_progress',
  'show_status_indicator',
  'status_indicator_font_size',
  'status_indicator_padding',
  'progress_bar_style',
  'progress_show_fraction',
  'progress_animation',
  'truck_animation_style',
  // Product settings
  'hide_completed_products',
  'strikethrough_completed_products',
  'product_card_layout',
  'product_columns',
  'product_show_category',
  'product_group_by_status',
  'product_card_size',
  'product_unit_font_size',
  'product_name_font_weight',
  'product_quantity_font_weight',
  'show_line_items_count',
  'line_items_count_font_size',
  'show_basket_quantity',
  // Completion settings
  'customer_completion_message',
  'customer_show_completion_animation',
  'customer_completion_sound',
  // Accessibility settings
  'high_contrast_mode',
  'large_touch_targets',
  'reduce_motion',
  // Farger som også gjelder kunde-visning
  'product_1_bg_color',
  'product_2_bg_color',
  'product_3_bg_color',
  'product_1_text_color',
  'product_2_text_color',
  'product_3_text_color',
  'product_1_accent_color',
  'product_2_accent_color',
  'product_3_accent_color',
  'status_pending_color',
  'status_in_progress_color',
  'status_completed_color',
  'status_delivered_color',
  'progress_bar_color',
  'progress_background_color',
  'progress_height',
  'show_progress_bar',
  'show_progress_percentage',
  'show_truck_icon',
  'truck_icon_size',
  'show_status_badges',
  'enable_animations',
  'animation_speed',
  'fade_transitions',
  'pulse_on_update',
  'product_card_color',
  'product_text_color',
  'product_accent_color',
  'product_name_font_size',
  'product_quantity_font_size',
  'product_spacing',
  'product_card_padding',
  'show_product_unit',
  'max_products_per_card',
  'card_background_color',
  'card_border_color',
  'card_shadow_intensity',
  'border_radius',
  'text_color',
  'header_text_color',
  'background_type',
  'background_color',
  'background_gradient_start',
  'background_gradient_end',
];

export const useUpdateDisplaySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (settings: Partial<DisplaySettings>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      console.log('Updating display settings:', settings);

      // First get user's profile to get bakery_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('bakery_id')
        .eq('id', user.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profileData?.bakery_id) {
        throw new Error('No bakery found for user');
      }

      console.log('Using bakery_id for update:', profileData.bakery_id);

      // Splitt innstillinger: noen til shared-rad, noen til customer-rad
      const sharedSettings: any = {};
      const customerSettings: any = {};
      
      for (const [key, value] of Object.entries(settings)) {
        if (key === 'id') continue; // Skip id
        
        // Map packing status colors back to legacy database column names
        if (key === 'packing_status_ongoing_color') {
          sharedSettings.status_in_progress_color = value;
          customerSettings.status_in_progress_color = value;
        } else if (key === 'packing_status_completed_color') {
          sharedSettings.status_completed_color = value;
          customerSettings.status_completed_color = value;
        } else if (CUSTOMER_SPECIFIC_FIELDS.includes(key)) {
          customerSettings[key] = value;
          // Noen felter skal også oppdateres i shared (farger, generelle innstillinger)
          if (!key.startsWith('customer_') && !['always_show_customer_name', 'hide_completed_products', 'strikethrough_completed_products', 'product_card_layout', 'product_columns', 'product_show_category', 'product_group_by_status', 'compact_status_progress', 'progress_bar_style', 'progress_show_fraction', 'truck_animation_style', 'high_contrast_mode', 'large_touch_targets', 'reduce_motion'].includes(key)) {
            sharedSettings[key] = value;
          }
        } else {
          sharedSettings[key] = value;
        }
      }

      console.log('Shared settings to update:', sharedSettings);
      console.log('Customer settings to update:', customerSettings);

      // Oppdater shared-rad
      if (Object.keys(sharedSettings).length > 0) {
        const { error: sharedError } = await supabase
          .from('display_settings')
          .update(sharedSettings)
          .eq('bakery_id', profileData.bakery_id)
          .eq('screen_type', 'shared');

        if (sharedError) {
          console.error('Error updating shared settings:', sharedError);
          throw sharedError;
        }
      }

      // Oppdater customer-rad
      if (Object.keys(customerSettings).length > 0) {
        const { error: customerError } = await supabase
          .from('display_settings')
          .update(customerSettings)
          .eq('bakery_id', profileData.bakery_id)
          .eq('screen_type', 'customer');

        if (customerError) {
          console.error('Error updating customer settings:', customerError);
          throw customerError;
        }
      }

      console.log('Both settings rows updated successfully');
      return settings;
    },
    onSuccess: () => {
      const { profile } = useAuthStore.getState();
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['display-settings', profile?.bakery_id] });
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.PUBLIC_DISPLAY_SETTINGS[0], profile?.bakery_id],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ['packing-data', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['customers', profile?.bakery_id] });
      queryClient.invalidateQueries({ queryKey: ['orders', profile?.bakery_id] });
      
      console.log('Display settings updated - cache invalidated for both shared and customer');
      
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
