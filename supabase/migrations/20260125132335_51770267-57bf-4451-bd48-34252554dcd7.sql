-- Add settings to show/hide main title and subtitle
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS show_main_title boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_subtitle boolean DEFAULT true;