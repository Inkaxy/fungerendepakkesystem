import type { DisplaySettings } from '@/types/displaySettings';

export const getDefaultSettings = (bakery_id: string): Omit<DisplaySettings, 'id'> => ({
  bakery_id,
  screen_type: 'shared',
  
  // === SHARED SETTINGS ===
  
  // Background
  background_type: 'gradient',
  background_color: '#f8fafc',
  background_gradient_start: '#f1f5f9',
  background_gradient_end: '#e2e8f0',
  background_gradient_direction: 'to-bottom',
  background_image_url: '',
  background_overlay_opacity: 50,
  
  // Typography
  header_font_size: 32,
  body_font_size: 16,
  text_color: '#1e293b',
  header_text_color: '#0f172a',
  
  // Card Styling
  card_background_color: '#ffffff',
  card_border_color: '#e2e8f0',
  card_shadow_intensity: 2,
  border_radius: 12,
  card_border_width: 1,
  spacing: 16,
  card_hover_effect: false,
  
  // Product Card Styling
  product_card_size: 100,
  product_card_color: '#ffffff',
  product_text_color: '#334155',
  product_accent_color: '#3b82f6',
  product_name_font_size: 18,
  product_quantity_font_size: 48,
  product_unit_font_size: 14,
  product_name_font_weight: 600,
  product_quantity_font_weight: 700,
  product_spacing: 12,
  product_card_padding: 16,
  show_product_unit: true,
  line_items_count_font_size: 14,
  
  // Individual Product Colors
  product_1_bg_color: '#ffffff',
  product_2_bg_color: '#f8fafc',
  product_3_bg_color: '#f1f5f9',
  product_1_text_color: '#1e293b',
  product_2_text_color: '#1e293b',
  product_3_text_color: '#1e293b',
  product_1_accent_color: '#3b82f6',
  product_2_accent_color: '#10b981',
  product_3_accent_color: '#f59e0b',
  
  // Status Colors
  status_pending_color: '#f59e0b',
  status_in_progress_color: '#3b82f6',
  status_completed_color: '#10b981',
  status_delivered_color: '#059669',
  packing_status_ongoing_color: '#3b82f6',
  packing_status_completed_color: '#10b981',
  
  // Progress Bar
  show_progress_bar: true,
  progress_bar_color: '#3b82f6',
  progress_background_color: '#e2e8f0',
  progress_height: 8,
  show_progress_percentage: true,
  progress_animation: true,
  
  // Truck Icon
  show_truck_icon: false,
  truck_icon_size: 24,
  
  // Status Indicator
  show_status_indicator: true,
  status_indicator_font_size: 32,
  status_indicator_padding: 24,
  status_badge_font_size: 14,
  
  // Animation Settings
  enable_animations: true,
  animation_speed: 'normal',
  fade_transitions: true,
  pulse_on_update: false,
  
  // === SHARED DISPLAY SPECIFIC ===
  
  // Header
  main_title: 'Felles Display',
  subtitle: 'Pakkestatus for kunder',
  show_main_title: true,
  show_subtitle: true,
  show_date_indicator: true,
  shared_show_clock: false,
  shared_show_logo: false,
  shared_logo_url: '',
  shared_logo_size: 48,
  shared_header_alignment: 'center',
  
  // Stats Cards
  show_stats_cards: true,
  stats_columns: 3,
  stats_card_height: 'normal',
  stats_card_style: 'filled',
  stats_show_percentage: true,
  stats_show_icons: true,
  stats_icon_color: '#3b82f6',
  
  // Customer Cards
  customer_cards_columns: 3,
  customer_card_height: 'normal',
  customer_card_style: 'card',
  customer_cards_gap: 24,
  customer_name_font_size: 18,
  show_customer_numbers: true,
  show_customer_progress_bar: true,
  customer_sort_order: 'alphabetical',
  
  // Product List
  max_products_per_card: 10,
  product_list_style: 'normal',
  shared_product_font_size: 14,
  show_line_items_count: true,
  shared_show_product_quantity: true,
  shared_hide_completed_customers: false,
  shared_completed_customer_opacity: 50,
  
  // Layout
  shared_fullscreen_mode: false,
  shared_auto_scroll: false,
  shared_scroll_speed: 30,
  shared_content_padding: 24,
  auto_fit_screen: false,
  auto_fit_min_card_height: 180,
  auto_fit_min_card_width: 280,
  shared_compact_table_mode: false,
  grid_layout_mode: 'auto',
  grid_fixed_rows: 3,
  grid_fixed_columns: 4,
  
  // === CUSTOMER DISPLAY SPECIFIC ===
  
  // Customer Header
  always_show_customer_name: true,
  customer_display_show_date: true,
  customer_show_bakery_name: false,
  customer_show_delivery_info: false,
  customer_display_header_size: 32,
  customer_header_alignment: 'center',
  
  // Product Display
  show_status_badges: true,
  strikethrough_completed_products: true,
  hide_completed_products: false,
  product_card_layout: 'horizontal',
  product_columns: 2,
  product_show_category: false,
  product_group_by_status: false,
  
  // Status & Progress
  compact_status_progress: true,
  progress_bar_style: 'bar',
  progress_show_fraction: false,
  truck_animation_style: 'bounce',
  
  // Completion
  customer_completion_message: 'Alt er pakket og klart! 🎉',
  customer_show_completion_animation: false,
  customer_completion_sound: false,
  
  // Accessibility
  high_contrast_mode: false,
  large_touch_targets: false,
  reduce_motion: false,
  
  // Layout
  customer_fullscreen_mode: false,
  customer_content_padding: 24,
  customer_max_content_width: 1200,
  
  // Product Colors
  use_consistent_product_colors: true, // ✅ Alltid konsistent produktfarge basert på produkt-ID
  
  // Basket Quantity
  show_basket_quantity: false,
});
