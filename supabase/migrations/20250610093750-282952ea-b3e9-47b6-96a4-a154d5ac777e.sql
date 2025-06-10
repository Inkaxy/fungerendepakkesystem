
-- Add new columns for STATUS indicator settings to display_settings table
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS show_status_indicator boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS status_indicator_font_size integer DEFAULT 32,
ADD COLUMN IF NOT EXISTS status_indicator_padding integer DEFAULT 24;
