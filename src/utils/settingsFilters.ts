import { DisplaySettings } from '@/hooks/useDisplaySettings';

// Define which settings belong to which screen types
export const SMALL_SCREEN_SETTINGS = [
  'customer_cards_columns',
  'customer_card_height', 
  'stats_columns',
  'stats_card_height',
  'customer_cards_gap',
  'minimum_card_width',
  'responsive_breakpoint'
] as const;

export const LARGE_SCREEN_SETTINGS = [
  'screen_size_preset',
  'force_single_screen', 
  'large_screen_optimization',
  'fullscreen_mode',
  'auto_screen_detection'
] as const;

export const SHARED_COMMON_SETTINGS = [
  // Typography
  'font_family',
  'line_height',
  'text_shadow_enabled',
  'text_shadow_color',
  'text_shadow_blur',
  'text_shadow_offset_x',
  'text_shadow_offset_y',
  
  // Animation and interactivity
  'enable_animations',
  'animation_speed',
  'fade_transitions',
  'progress_animation',
  'touch_friendly_sizes',
  'touch_target_size',
  'pause_mode_enabled',
  'show_manual_refresh_button',
  'manual_refresh_button_position',
  
  // Layout basics that apply to all
  'background_type',
  'background_color',
  'background_gradient_start',
  'background_gradient_end',
  'background_image_url',
  'header_font_size',
  'body_font_size',
  'text_color',
  'header_text_color',
  'card_background_color',
  'card_border_color',
  'card_shadow_intensity',
  'border_radius',
  'spacing',
  'display_padding',
  'display_margin',
  
  // Content display
  'main_title',
  'subtitle',
  'show_date_indicator',
  'max_products_per_card',
  'product_list_style',
  'show_line_items_count',
  'customer_sort_order',
  'show_customer_numbers',
  'show_status_badges',
  'hide_empty_customers',
  'show_delivery_date_indicators',
  'auto_hide_completed_customers',
  'auto_hide_completed_timer',
  'customer_priority_mode',
  'show_basket_quantity',
  'basket_display_format',
  
  // Status and progress
  'show_stats_cards',
  'stats_icon_color',
  'show_progress_bar',
  'show_truck_icon',
  'truck_icon_size',
  'show_status_indicator',
  'status_indicator_font_size',
  'status_indicator_padding',
  'packing_status_ongoing_color',
  'packing_status_completed_color',
  'progress_bar_color',
  'progress_background_color',
  'progress_height',
  'show_progress_percentage',
  'auto_refresh_interval',
  
  // Product styling (these are actually shared across all screens)
  'product_card_color',
  'product_text_color',
  'product_accent_color',
  'product_card_size',
  'product_1_bg_color',
  'product_2_bg_color',
  'product_3_bg_color',
  'product_1_text_color',
  'product_2_text_color',
  'product_3_text_color',
  'product_1_accent_color',
  'product_2_accent_color',
  'product_3_accent_color',
  
  // Legacy status colors
  'status_in_progress_color',
  'status_completed_color',
  'status_pending_color',
  'status_delivered_color',
  
  // Customer display options
  'show_customer_info',
  'show_order_numbers',
  'show_delivery_dates',
  'show_product_images',
  'always_show_customer_name'
] as const;

export type SmallScreenSetting = typeof SMALL_SCREEN_SETTINGS[number];
export type LargeScreenSetting = typeof LARGE_SCREEN_SETTINGS[number];
export type SharedCommonSetting = typeof SHARED_COMMON_SETTINGS[number];

// Function to determine if a setting should be applied based on screen size
export const shouldApplySetting = (
  settingKey: keyof DisplaySettings, 
  screenType: 'small' | 'large' | 'shared'
): boolean => {
  switch (screenType) {
    case 'small':
      return SMALL_SCREEN_SETTINGS.includes(settingKey as SmallScreenSetting) || 
             SHARED_COMMON_SETTINGS.includes(settingKey as SharedCommonSetting);
    case 'large':
      return LARGE_SCREEN_SETTINGS.includes(settingKey as LargeScreenSetting) || 
             SHARED_COMMON_SETTINGS.includes(settingKey as SharedCommonSetting);
    case 'shared':
      return SHARED_COMMON_SETTINGS.includes(settingKey as SharedCommonSetting);
    default:
      return true;
  }
};

// Filter settings based on screen type
export const filterSettingsForScreen = (
  settings: DisplaySettings, 
  screenType: 'small' | 'large' | 'shared'
): Partial<DisplaySettings> => {
  const filteredSettings: Partial<DisplaySettings> = {};
  
  for (const [key, value] of Object.entries(settings)) {
    if (shouldApplySetting(key as keyof DisplaySettings, screenType)) {
      (filteredSettings as any)[key] = value;
    }
  }
  
  return filteredSettings;
};