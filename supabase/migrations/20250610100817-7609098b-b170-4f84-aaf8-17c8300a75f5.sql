
-- Add individual product text and accent colors
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS product_1_text_color varchar DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS product_2_text_color varchar DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS product_3_text_color varchar DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS product_1_accent_color varchar DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS product_2_accent_color varchar DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS product_3_accent_color varchar DEFAULT '#f59e0b';

-- Add animation settings
ALTER TABLE public.display_settings 
ADD COLUMN IF NOT EXISTS enable_animations boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS animation_speed varchar DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS fade_transitions boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS progress_animation boolean DEFAULT true;
