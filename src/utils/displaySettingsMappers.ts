
import { DisplaySettings } from '@/types/displaySettings';

export const mapDatabaseToDisplaySettings = (data: any): DisplaySettings => {
  return {
    ...data,
    screen_type: data.screen_type || 'shared',
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
    // Shared display settings with proper defaults
    show_stats_cards: data.show_stats_cards ?? true,
    stats_columns: data.stats_columns ?? 3,
    stats_icon_color: data.stats_icon_color || '#3b82f6',
    stats_card_height: data.stats_card_height || 'normal',
    customer_cards_columns: data.customer_cards_columns ?? 3,
    customer_card_height: data.customer_card_height || 'normal',
    show_customer_numbers: data.show_customer_numbers ?? true,
    show_status_badges: data.show_status_badges ?? true,
    customer_cards_gap: data.customer_cards_gap ?? 24,
    main_title: data.main_title || 'Felles Display',
    subtitle: data.subtitle || 'Pakkestatus for kunder',
    show_date_indicator: data.show_date_indicator ?? true,
    max_products_per_card: data.max_products_per_card ?? 10,
    product_list_style: data.product_list_style || 'normal',
    show_line_items_count: data.show_line_items_count ?? true,
    customer_sort_order: data.customer_sort_order || 'alphabetical',
  } as DisplaySettings;
};

export const mapDisplaySettingsToDatabase = (settings: Partial<DisplaySettings>) => {
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

  return dbSettings;
};
