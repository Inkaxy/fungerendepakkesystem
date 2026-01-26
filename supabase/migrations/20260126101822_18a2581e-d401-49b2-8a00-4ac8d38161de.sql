-- Add auto_fit_min_card_width column for better control over auto-fit layout
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS auto_fit_min_card_width integer DEFAULT 280;