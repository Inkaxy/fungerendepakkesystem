
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
  // Shared display settings
  show_stats_cards: boolean;
  stats_columns: number;
  stats_icon_color: string;
  stats_card_height: 'compact' | 'normal' | 'extended';
  customer_cards_columns: number;
  customer_card_height: 'compact' | 'normal' | 'extended';
  show_customer_numbers: boolean;
  show_status_badges: boolean;
  customer_cards_gap: number;
  main_title: string;
  subtitle: string;
  show_date_indicator: boolean;
  max_products_per_card: number;
  product_list_style: 'compact' | 'normal';
  show_line_items_count: boolean;
  customer_sort_order: 'alphabetical' | 'status' | 'progress';
  // Screen size and layout optimization
  screen_size_preset: 'standard' | '10inch' | '13inch' | 'laptop' | 'monitor' | '32inch' | '43inch' | '55inch' | '65inch';
  force_single_screen: boolean;
  large_screen_optimization: boolean;
  // Basket quantity display settings
  show_basket_quantity: boolean;
  basket_display_format: 'total_first' | 'basket_first';
  // Enhanced shared display settings
  hide_empty_customers: boolean;
  show_delivery_date_indicators: boolean;
  auto_hide_completed_customers: boolean;
  auto_hide_completed_timer: number;
  customer_priority_mode: 'none' | 'delivery_date' | 'progress' | 'custom';
  // Typography settings
  font_family: string;
  line_height: number;
  text_shadow_enabled: boolean;
  text_shadow_color: string;
  text_shadow_blur: number;
  text_shadow_offset_x: number;
  text_shadow_offset_y: number;
  // Layout and responsiveness settings
  auto_screen_detection: boolean;
  fullscreen_mode: boolean;
  minimum_card_width: number;
  display_padding: number;
  display_margin: number;
  responsive_breakpoint: 'small' | 'medium' | 'large';
  // Interactivity settings
  touch_friendly_sizes: boolean;
  touch_target_size: number;
  pause_mode_enabled: boolean;
  show_manual_refresh_button: boolean;
  manual_refresh_button_position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
