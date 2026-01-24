// Display Settings Type Definition
// Comprehensive settings for both Shared Display and Customer Display

export interface DisplaySettings {
  // === Core Fields ===
  id: string;
  bakery_id: string;
  screen_type: string;

  // === SHARED SETTINGS (Used by both display types) ===
  
  // Background
  background_type: 'solid' | 'gradient' | 'image';
  background_color: string;
  background_gradient_start: string;
  background_gradient_end: string;
  background_gradient_direction: string;
  background_image_url?: string;
  background_overlay_opacity: number;
  
  // Typography
  header_font_size: number;
  body_font_size: number;
  text_color: string;
  header_text_color: string;
  
  // Card Styling
  card_background_color: string;
  card_border_color: string;
  card_shadow_intensity: number;
  border_radius: number;
  card_border_width: number;
  spacing: number;
  card_hover_effect: boolean;
  
  // Product Card Styling
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
  
  // Individual Product Colors (3 alternating)
  product_1_bg_color: string;
  product_2_bg_color: string;
  product_3_bg_color: string;
  product_1_text_color: string;
  product_2_text_color: string;
  product_3_text_color: string;
  product_1_accent_color: string;
  product_2_accent_color: string;
  product_3_accent_color: string;
  
  // Status Colors
  status_pending_color: string;
  status_in_progress_color: string;
  status_completed_color: string;
  status_delivered_color: string;
  packing_status_ongoing_color: string;
  packing_status_completed_color: string;
  
  // Progress Bar (shared styling)
  show_progress_bar: boolean;
  progress_bar_color: string;
  progress_background_color: string;
  progress_height: number;
  show_progress_percentage: boolean;
  progress_animation: boolean;
  
  // Truck Icon
  show_truck_icon: boolean;
  truck_icon_size: number;
  
  // Status Indicator
  show_status_indicator: boolean;
  status_indicator_font_size: number;
  status_indicator_padding: number;
  status_badge_font_size: number;
  
  // Animation Settings
  enable_animations: boolean;
  animation_speed: 'slow' | 'normal' | 'fast';
  fade_transitions: boolean;
  pulse_on_update: boolean;
  
  // === SHARED DISPLAY SPECIFIC (Felles Skjerm) ===
  
  // Header
  main_title: string;
  subtitle: string;
  show_date_indicator: boolean;
  shared_show_clock: boolean;
  shared_show_logo: boolean;
  shared_logo_url: string;
  shared_logo_size: number;
  shared_header_alignment: 'left' | 'center' | 'right';
  
  // Stats Cards
  show_stats_cards: boolean;
  stats_columns: number;
  stats_card_height: 'compact' | 'normal' | 'large';
  stats_card_style: 'filled' | 'outlined' | 'minimal';
  stats_show_percentage: boolean;
  stats_show_icons: boolean;
  stats_icon_color: string;
  
  // Customer Cards
  customer_cards_columns: number;
  customer_card_height: 'compact' | 'normal' | 'large';
  customer_card_style: 'card' | 'minimal' | 'bordered';
  customer_cards_gap: number;
  customer_name_font_size: number;
  show_customer_numbers: boolean;
  show_customer_progress_bar: boolean;
  customer_sort_order: 'alphabetical' | 'priority' | 'progress' | 'status';
  
  // Product List (in customer cards)
  max_products_per_card: number;
  product_list_style: 'normal' | 'compact' | 'detailed';
  shared_product_font_size: number;
  show_line_items_count: boolean;
  shared_show_product_quantity: boolean;
  shared_hide_completed_customers: boolean;
  shared_completed_customer_opacity: number;
  
  // Layout
  shared_fullscreen_mode: boolean;
  shared_auto_scroll: boolean;
  shared_scroll_speed: number;
  shared_content_padding: number;
  
  // === CUSTOMER DISPLAY SPECIFIC (Kundeskjerm) ===
  
  // Customer Header
  always_show_customer_name: boolean;
  customer_display_show_date: boolean;
  customer_show_bakery_name: boolean;
  customer_show_delivery_info: boolean;
  customer_display_header_size: number;
  customer_header_alignment: 'left' | 'center' | 'right';
  
  // Product Display
  show_status_badges: boolean;
  strikethrough_completed_products: boolean;
  hide_completed_products: boolean;
  product_card_layout: 'horizontal' | 'vertical' | 'grid';
  product_columns: number;
  product_show_category: boolean;
  product_group_by_status: boolean;
  
  // Status & Progress
  compact_status_progress: boolean;
  progress_bar_style: 'bar' | 'circular' | 'steps';
  progress_show_fraction: boolean;
  truck_animation_style: 'bounce' | 'slide' | 'pulse' | 'none';
  
  // Completion
  customer_completion_message: string;
  customer_show_completion_animation: boolean;
  customer_completion_sound: boolean;
  
  // Accessibility
  high_contrast_mode: boolean;
  large_touch_targets: boolean;
  reduce_motion: boolean;
  
  // Layout
  customer_fullscreen_mode: boolean;
  customer_content_padding: number;
  customer_max_content_width: number;
  
  // === LEGACY/OPTIONAL FIELDS ===
  show_customer_info?: boolean;
  show_order_numbers?: boolean;
  show_delivery_dates?: boolean;
  show_product_images?: boolean;
  auto_refresh_interval?: number;
}
