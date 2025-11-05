-- Add new font size columns for granular product display control
ALTER TABLE public.display_settings
ADD COLUMN IF NOT EXISTS product_name_font_size INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS product_unit_font_size INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS line_items_count_font_size INTEGER DEFAULT 18;

-- Add comments for documentation
COMMENT ON COLUMN public.display_settings.product_name_font_size IS 'Font size for product names in pixels (14-48px)';
COMMENT ON COLUMN public.display_settings.product_unit_font_size IS 'Font size for product units (stk, kg) in pixels (12-48px)';
COMMENT ON COLUMN public.display_settings.line_items_count_font_size IS 'Font size for line items count (e.g. "3/5") in pixels (12-32px)';