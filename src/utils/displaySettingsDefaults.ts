
import { DisplaySettings } from '@/types/displaySettings';

export const getDefaultSettings = (bakery_id: string): Omit<DisplaySettings, 'id'> => ({
  bakery_id,
  screen_type: 'shared' as const,
  
  // Background settings
  background_type: 'gradient' as const,
  background_color: '#ffffff',
  background_gradient_start: '#f3f4f6',
  background_gradient_end: '#e5e7eb',
  background_image_url: undefined,
  
  // Typography settings
  header_font_size: 32,
  body_font_size: 16,
  text_color: '#111827',
  header_text_color: '#111827',
  
  // Card styling
  card_background_color: '#ffffff',
  card_border_color: '#e5e7eb',
  card_shadow_intensity: 3,
  border_radius: 8,
  spacing: 16,
  
  // Product card styling
  product_card_color: '#ffffff',
  product_text_color: '#374151',
  product_accent_color: '#3b82f6',
  product_card_size: 100,
  product_name_font_size: 24,
  product_unit_font_size: 24,
  line_items_count_font_size: 18,
  status_badge_font_size: 14,
  product_spacing: 16,
  product_card_padding: 16,
  product_name_font_weight: 600,
  product_quantity_font_weight: 700,
  show_product_unit: true,
  product_quantity_font_size: 48,
  
  // Individual product colors
  product_1_bg_color: '#ffffff',
  product_2_bg_color: '#f9fafb',
  product_3_bg_color: '#f3f4f6',
  product_1_text_color: '#1f2937',
  product_2_text_color: '#1f2937',
  product_3_text_color: '#1f2937',
  product_1_accent_color: '#3b82f6',
  product_2_accent_color: '#10b981',
  product_3_accent_color: '#f59e0b',
  
  // Status colors
  packing_status_ongoing_color: '#3b82f6',
  packing_status_completed_color: '#10b981',
  status_in_progress_color: '#3b82f6',
  status_completed_color: '#10b981',
  status_pending_color: '#f59e0b',
  status_delivered_color: '#059669',
  
  // Progress bar settings
  progress_bar_color: '#3b82f6',
  progress_background_color: '#e5e7eb',
  progress_height: 8,
  show_progress_percentage: true,
  show_progress_bar: true,
  
  // Truck icon settings
  show_truck_icon: false,
  truck_icon_size: 48,
  
  // Status indicator settings
  show_status_indicator: true,
  status_indicator_font_size: 32,
  status_indicator_padding: 24,
  
  // Animation settings
  enable_animations: true,
  animation_speed: 'normal' as const,
  fade_transitions: true,
  progress_animation: true,
  
  // Compact layout toggle
  compact_status_progress: true,
  
  // === SHARED DISPLAY SETTINGS ===
  main_title: 'Felles Display',
  subtitle: 'Pakkestatus for kunder',
  show_date_indicator: true,
  
  // Stats cards
  show_stats_cards: true,
  stats_columns: 3,
  stats_icon_color: '#3b82f6',
  stats_card_height: 'normal' as const,
  
  // Customer cards layout
  customer_cards_columns: 3,
  customer_card_height: 'normal' as const,
  show_customer_numbers: true,
  customer_cards_gap: 24,
  
  // Product list in shared display
  max_products_per_card: 10,
  product_list_style: 'normal' as const,
  show_line_items_count: true,
  customer_sort_order: 'alphabetical' as const,
  
  // === CUSTOMER DISPLAY SETTINGS ===
  always_show_customer_name: true,
  show_customer_info: true,
  show_order_numbers: true,
  show_status_badges: true,
  strikethrough_completed_products: true,
  
  // New: Customer display specific
  customer_display_show_date: true,
  customer_display_header_size: 32,
  hide_completed_products: false,
  high_contrast_mode: false,
});
