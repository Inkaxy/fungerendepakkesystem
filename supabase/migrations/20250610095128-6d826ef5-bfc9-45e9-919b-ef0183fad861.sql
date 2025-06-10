
-- Add new columns for individual product background colors
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS product_1_bg_color varchar DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS product_2_bg_color varchar DEFAULT '#f9fafb',
ADD COLUMN IF NOT EXISTS product_3_bg_color varchar DEFAULT '#f3f4f6';

-- Add columns for progress bar toggle and truck icon settings
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS show_progress_bar boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_truck_icon boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS truck_icon_size integer DEFAULT 24;
