-- Legg til konfigurerbar størrelse for produktantall på display
ALTER TABLE display_settings 
ADD COLUMN product_quantity_font_size INTEGER DEFAULT 48;