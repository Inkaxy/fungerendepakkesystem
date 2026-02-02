import type { DisplaySettings } from '@/types/displaySettings';

export const mapDatabaseToDisplaySettings = (data: Record<string, any>): DisplaySettings => {
  return {
    // Core
    id: data.id,
    bakery_id: data.bakery_id,
    screen_type: data.screen_type || 'shared',
    
    // Background
    background_type: data.background_type || 'gradient',
    background_color: data.background_color || '#f8fafc',
    background_gradient_start: data.background_gradient_start || '#f1f5f9',
    background_gradient_end: data.background_gradient_end || '#e2e8f0',
    background_gradient_direction: data.background_gradient_direction || 'to-bottom',
    background_image_url: data.background_image_url || '',
    background_overlay_opacity: data.background_overlay_opacity ?? 50,
    
    // Typography
    header_font_size: data.header_font_size ?? 32,
    body_font_size: data.body_font_size ?? 16,
    text_color: data.text_color || '#1e293b',
    header_text_color: data.header_text_color || '#0f172a',
    
    // Card Styling
    card_background_color: data.card_background_color || '#ffffff',
    card_border_color: data.card_border_color || '#e2e8f0',
    card_shadow_intensity: data.card_shadow_intensity ?? 2,
    border_radius: data.border_radius ?? 12,
    card_border_width: data.card_border_width ?? 1,
    spacing: data.spacing ?? 16,
    card_hover_effect: data.card_hover_effect ?? false,
    
    // Product Card Styling
    product_card_size: data.product_card_size ?? 100,
    product_card_color: data.product_card_color || '#ffffff',
    product_text_color: data.product_text_color || '#334155',
    product_accent_color: data.product_accent_color || '#3b82f6',
    product_name_font_size: data.product_name_font_size ?? 18,
    product_quantity_font_size: data.product_quantity_font_size ?? 48,
    product_unit_font_size: data.product_unit_font_size ?? 14,
    product_name_font_weight: data.product_name_font_weight ?? 600,
    product_quantity_font_weight: data.product_quantity_font_weight ?? 700,
    product_spacing: data.product_spacing ?? 12,
    product_card_padding: data.product_card_padding ?? 16,
    show_product_unit: data.show_product_unit ?? true,
    
    // Individual Product Colors
    product_1_bg_color: data.product_1_bg_color || '#ffffff',
    product_2_bg_color: data.product_2_bg_color || '#f8fafc',
    product_3_bg_color: data.product_3_bg_color || '#f1f5f9',
    product_1_text_color: data.product_1_text_color || '#1e293b',
    product_2_text_color: data.product_2_text_color || '#1e293b',
    product_3_text_color: data.product_3_text_color || '#1e293b',
    product_1_accent_color: data.product_1_accent_color || '#3b82f6',
    product_2_accent_color: data.product_2_accent_color || '#10b981',
    product_3_accent_color: data.product_3_accent_color || '#f59e0b',
    
    // Status Colors (map from legacy columns)
    status_pending_color: data.status_pending_color || '#f59e0b',
    status_in_progress_color: data.status_in_progress_color || '#3b82f6',
    status_completed_color: data.status_completed_color || '#10b981',
    status_delivered_color: data.status_delivered_color || '#059669',
    packing_status_ongoing_color: data.status_in_progress_color || '#3b82f6',
    packing_status_completed_color: data.status_completed_color || '#10b981',
    
    // Progress Bar
    show_progress_bar: data.show_progress_bar ?? true,
    progress_bar_color: data.progress_bar_color || '#3b82f6',
    progress_background_color: data.progress_background_color || '#e2e8f0',
    progress_height: data.progress_height ?? 8,
    show_progress_percentage: data.show_progress_percentage ?? true,
    progress_animation: data.progress_animation ?? true,
    
    // Truck Icon
    show_truck_icon: data.show_truck_icon ?? false,
    truck_icon_size: data.truck_icon_size ?? 24,
    
    // Status Indicator
    show_status_indicator: data.show_status_indicator ?? true,
    status_indicator_font_size: data.status_indicator_font_size ?? 32,
    status_indicator_padding: data.status_indicator_padding ?? 24,
    status_badge_font_size: data.status_badge_font_size ?? 14,
    
    // Animation Settings
    enable_animations: data.enable_animations ?? true,
    animation_speed: data.animation_speed || 'normal',
    fade_transitions: data.fade_transitions ?? true,
    pulse_on_update: data.pulse_on_update ?? false,
    
    // === SHARED DISPLAY SPECIFIC ===
    
    // Header
    main_title: data.main_title || 'Felles Display',
    subtitle: data.subtitle || 'Pakkestatus for kunder',
    show_main_title: data.show_main_title ?? true,
    show_subtitle: data.show_subtitle ?? true,
    show_date_indicator: data.show_date_indicator ?? true,
    shared_show_clock: data.shared_show_clock ?? false,
    shared_show_logo: data.shared_show_logo ?? false,
    shared_logo_url: data.shared_logo_url || '',
    shared_logo_size: data.shared_logo_size ?? 48,
    shared_header_alignment: data.shared_header_alignment || 'center',
    
    // Stats Cards
    show_stats_cards: data.show_stats_cards ?? true,
    stats_columns: data.stats_columns ?? 3,
    stats_card_height: data.stats_card_height || 'normal',
    stats_card_style: data.stats_card_style || 'filled',
    stats_show_percentage: data.stats_show_percentage ?? true,
    stats_show_icons: data.stats_show_icons ?? true,
    stats_icon_color: data.stats_icon_color || '#3b82f6',
    
    // Customer Cards
    customer_cards_columns: data.customer_cards_columns ?? 3,
    customer_card_height: data.customer_card_height || 'normal',
    customer_card_style: data.customer_card_style || 'card',
    customer_cards_gap: data.customer_cards_gap ?? 24,
    customer_name_font_size: data.customer_name_font_size ?? 18,
    show_customer_numbers: data.show_customer_numbers ?? true,
    show_customer_progress_bar: data.show_customer_progress_bar ?? true,
    customer_sort_order: data.customer_sort_order || 'alphabetical',
    
    // Product List
    max_products_per_card: data.max_products_per_card ?? 10,
    product_list_style: data.product_list_style || 'normal',
    shared_product_font_size: data.shared_product_font_size ?? 14,
    show_line_items_count: data.show_line_items_count ?? true,
    shared_show_product_quantity: data.shared_show_product_quantity ?? true,
    shared_hide_completed_customers: data.shared_hide_completed_customers ?? false,
    shared_completed_customer_opacity: data.shared_completed_customer_opacity ?? 50,
    
    // Layout
    shared_fullscreen_mode: data.shared_fullscreen_mode ?? false,
    shared_auto_scroll: data.shared_auto_scroll ?? false,
    shared_scroll_speed: data.shared_scroll_speed ?? 30,
    shared_content_padding: data.shared_content_padding ?? 24,
    shared_show_completion_icon: data.shared_show_completion_icon ?? true,
    auto_fit_screen: data.auto_fit_screen ?? false,
    
    // === CUSTOMER DISPLAY SPECIFIC ===
    
    // Customer Header
    always_show_customer_name: data.always_show_customer_name ?? true,
    customer_display_show_date: data.customer_display_show_date ?? true,
    customer_show_bakery_name: data.customer_show_bakery_name ?? false,
    customer_show_delivery_info: data.customer_show_delivery_info ?? false,
    customer_display_header_size: data.customer_display_header_size ?? 32,
    customer_header_alignment: data.customer_header_alignment || 'center',
    
    // Product Display
    show_status_badges: data.show_status_badges ?? true,
    strikethrough_completed_products: data.strikethrough_completed_products ?? true,
    hide_completed_products: data.hide_completed_products ?? false,
    product_card_layout: data.product_card_layout || 'horizontal',
    product_columns: data.product_columns ?? 2,
    product_show_category: data.product_show_category ?? false,
    product_group_by_status: data.product_group_by_status ?? false,
    
    // Status & Progress
    compact_status_progress: data.compact_status_progress ?? true,
    progress_bar_style: data.progress_bar_style || 'bar',
    progress_show_fraction: data.progress_show_fraction ?? false,
    truck_animation_style: data.truck_animation_style || 'bounce',
    
    // Completion
    customer_completion_message: data.customer_completion_message || 'Alt er pakket og klart! 🎉',
    customer_show_completion_animation: data.customer_show_completion_animation ?? false,
    customer_completion_sound: data.customer_completion_sound ?? false,
    
    // Accessibility
    high_contrast_mode: data.high_contrast_mode ?? false,
    large_touch_targets: data.large_touch_targets ?? false,
    reduce_motion: data.reduce_motion ?? false,
    
    // Layout
    customer_fullscreen_mode: data.customer_fullscreen_mode ?? false,
    customer_content_padding: data.customer_content_padding ?? 24,
    customer_max_content_width: data.customer_max_content_width ?? 1200,
    
    // Product Colors
    use_consistent_product_colors: data.use_consistent_product_colors ?? false,
    
    // Smart-TV Polling
    force_polling: data.force_polling ?? false,
  } as DisplaySettings;
};

export const mapDisplaySettingsToDatabase = (settings: Partial<DisplaySettings>) => {
  const dbSettings: Record<string, any> = { ...settings };
  
  // Map packing status colors to legacy database column names
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
