
-- Add new settings for shared display functionality
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS show_stats_cards boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS stats_columns integer DEFAULT 3 CHECK (stats_columns >= 1 AND stats_columns <= 4),
ADD COLUMN IF NOT EXISTS stats_icon_color varchar DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS stats_card_height varchar DEFAULT 'normal' CHECK (stats_card_height IN ('compact', 'normal', 'extended')),
ADD COLUMN IF NOT EXISTS customer_cards_columns integer DEFAULT 3 CHECK (customer_cards_columns >= 1 AND customer_cards_columns <= 4),
ADD COLUMN IF NOT EXISTS customer_card_height varchar DEFAULT 'normal' CHECK (customer_card_height IN ('compact', 'normal', 'extended')),
ADD COLUMN IF NOT EXISTS show_customer_numbers boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_status_badges boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS customer_cards_gap integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS main_title varchar DEFAULT 'Felles Display',
ADD COLUMN IF NOT EXISTS subtitle varchar DEFAULT 'Pakkestatus for kunder',
ADD COLUMN IF NOT EXISTS show_date_indicator boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS max_products_per_card integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS product_list_style varchar DEFAULT 'normal' CHECK (product_list_style IN ('compact', 'normal')),
ADD COLUMN IF NOT EXISTS show_line_items_count boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS customer_sort_order varchar DEFAULT 'alphabetical' CHECK (customer_sort_order IN ('alphabetical', 'status', 'progress'));
