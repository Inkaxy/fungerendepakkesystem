-- Add auto_fit_min_card_height column to display_settings
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS auto_fit_min_card_height integer DEFAULT 180;