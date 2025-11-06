-- Add strikethrough_completed_products column to display_settings
ALTER TABLE display_settings 
ADD COLUMN IF NOT EXISTS strikethrough_completed_products BOOLEAN DEFAULT true;

COMMENT ON COLUMN display_settings.strikethrough_completed_products IS 'Show strikethrough on completed product names in displays';