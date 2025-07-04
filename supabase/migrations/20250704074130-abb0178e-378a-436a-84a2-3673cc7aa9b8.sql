-- Add new display settings for screen size optimization and layout
ALTER TABLE public.display_settings 
ADD COLUMN screen_size_preset VARCHAR DEFAULT 'standard',
ADD COLUMN force_single_screen BOOLEAN DEFAULT false,
ADD COLUMN large_screen_optimization BOOLEAN DEFAULT false;