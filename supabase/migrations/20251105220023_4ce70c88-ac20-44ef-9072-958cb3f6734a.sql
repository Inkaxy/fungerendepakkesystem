-- Add advanced settings to display_settings
ALTER TABLE display_settings 
ADD COLUMN product_spacing INTEGER DEFAULT 16,
ADD COLUMN product_card_padding INTEGER DEFAULT 16,
ADD COLUMN product_name_font_weight INTEGER DEFAULT 600,
ADD COLUMN product_quantity_font_weight INTEGER DEFAULT 700,
ADD COLUMN show_product_unit BOOLEAN DEFAULT true;