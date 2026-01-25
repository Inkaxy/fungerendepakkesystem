-- Add setting for consistent product colors based on product ID
ALTER TABLE display_settings 
ADD COLUMN IF NOT EXISTS use_consistent_product_colors BOOLEAN DEFAULT false;