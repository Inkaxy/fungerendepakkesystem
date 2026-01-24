-- Felles skjerm nye felter - Header og layout
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_show_clock BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_show_logo BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_logo_url TEXT;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_logo_size INTEGER DEFAULT 48;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_header_alignment TEXT DEFAULT 'center';

-- Stats kort
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS stats_card_style TEXT DEFAULT 'filled';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS stats_show_percentage BOOLEAN DEFAULT true;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS stats_show_icons BOOLEAN DEFAULT true;

-- Kundekort
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_card_style TEXT DEFAULT 'card';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS show_customer_progress_bar BOOLEAN DEFAULT true;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_name_font_size INTEGER DEFAULT 18;

-- Produktliste
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_product_font_size INTEGER DEFAULT 14;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_show_product_quantity BOOLEAN DEFAULT true;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_hide_completed_customers BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_completed_customer_opacity INTEGER DEFAULT 50;

-- Bakgrunn
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS background_gradient_direction TEXT DEFAULT 'to-bottom';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS background_overlay_opacity INTEGER DEFAULT 50;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS card_border_width INTEGER DEFAULT 1;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS card_hover_effect BOOLEAN DEFAULT false;

-- Layout
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_fullscreen_mode BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_auto_scroll BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_scroll_speed INTEGER DEFAULT 30;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS shared_content_padding INTEGER DEFAULT 24;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS pulse_on_update BOOLEAN DEFAULT false;

-- Kundeskjerm nye felter - Header
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_header_alignment TEXT DEFAULT 'center';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_show_bakery_name BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_show_delivery_info BOOLEAN DEFAULT false;

-- Produktvisning
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS product_card_layout TEXT DEFAULT 'horizontal';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS product_columns INTEGER DEFAULT 2;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS product_show_category BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS product_group_by_status BOOLEAN DEFAULT false;

-- Progress
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS progress_bar_style TEXT DEFAULT 'bar';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS progress_show_fraction BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS truck_animation_style TEXT DEFAULT 'bounce';

-- Fullført
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_completion_message TEXT DEFAULT 'Alt er pakket og klart!';
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_show_completion_animation BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_completion_sound BOOLEAN DEFAULT false;

-- Tilgjengelighet
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS large_touch_targets BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT false;

-- Layout
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_fullscreen_mode BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_content_padding INTEGER DEFAULT 24;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_max_content_width INTEGER DEFAULT 1200;