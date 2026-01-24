
export interface DisplaySettings {
  id: string;
  bakery_id: string;
  screen_type: string;
  
  // Background settings
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_image_url?: string;
  
  // Typography settings
  header_font_size: number;
  body_font_size: number;
  text_color: string;
  header_text_color: string;
  
  // Card styling
  card_background_color: string;
  card_border_color: string;
  card_shadow_intensity: number;
  border_radius: number;
  spacing: number;
  
  // Product card styling
  product_card_color: string;
  product_text_color: string;
  product_accent_color: string;
  product_card_size: number;
  product_name_font_size: number;
  product_unit_font_size: number;
  line_items_count_font_size: number;
  status_badge_font_size: number;
  product_spacing: number;
  product_card_padding: number;
  product_name_font_weight: number;
  product_quantity_font_weight: number;
  show_product_unit: boolean;
  product_quantity_font_size: number;
  
  // Individual product colors (product 1, 2, 3)
  product_1_bg_color: string;
  product_2_bg_color: string;
  product_3_bg_color: string;
  product_1_text_color: string;
  product_2_text_color: string;
  product_3_text_color: string;
  product_1_accent_color: string;
  product_2_accent_color: string;
  product_3_accent_color: string;
  
  // Status colors
  packing_status_ongoing_color: string;
  packing_status_completed_color: string;
  status_in_progress_color?: string;
  status_completed_color?: string;
  status_pending_color?: string;
  status_delivered_color?: string;
  
  // Progress bar settings
  progress_bar_color: string;
  progress_background_color: string;
  progress_height: number;
  show_progress_percentage: boolean;
  show_progress_bar: boolean;
  
  // Truck icon settings
  show_truck_icon: boolean;
  truck_icon_size: number;
  
  // Status indicator settings
  show_status_indicator: boolean;
  status_indicator_font_size: number;
  status_indicator_padding: number;
  
  // Animation settings
  enable_animations: boolean;
  animation_speed: 'slow' | 'normal' | 'fast';
  fade_transitions: boolean;
  progress_animation: boolean;
  
  // Compact layout toggle
  compact_status_progress: boolean;
  
  // === SHARED DISPLAY SETTINGS ===
  main_title: string;
  subtitle: string;
  show_date_indicator: boolean;
  
  // Stats cards (shared display)
  show_stats_cards: boolean;
  stats_columns: number;
  stats_icon_color: string;
  stats_card_height: 'compact' | 'normal' | 'extended';
  
  // Customer cards layout (shared display)
  customer_cards_columns: number;
  customer_card_height: 'compact' | 'normal' | 'extended';
  show_customer_numbers: boolean;
  customer_cards_gap: number;
  
  // Product list in shared display
  max_products_per_card: number;
  product_list_style: 'compact' | 'normal';
  show_line_items_count: boolean;
  customer_sort_order: 'alphabetical' | 'status' | 'progress';
  
  // === CUSTOMER DISPLAY SETTINGS ===
  always_show_customer_name: boolean;
  show_customer_info: boolean;
  show_order_numbers: boolean;
  show_status_badges: boolean;
  strikethrough_completed_products: boolean;
  
  // New: Customer display specific
  customer_display_show_date: boolean;
  customer_display_header_size: number;
  hide_completed_products: boolean;
  high_contrast_mode: boolean;
  
  // Legacy (for backwards compatibility)
  show_delivery_dates?: boolean;
  show_product_images?: boolean;
  auto_refresh_interval?: number;
}
