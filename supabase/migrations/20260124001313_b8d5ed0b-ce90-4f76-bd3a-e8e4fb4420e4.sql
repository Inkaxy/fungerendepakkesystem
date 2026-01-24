-- Add new customer display specific columns
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_display_show_date BOOLEAN DEFAULT true;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS customer_display_header_size INTEGER DEFAULT 32;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS hide_completed_products BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS high_contrast_mode BOOLEAN DEFAULT false;
ALTER TABLE display_settings ADD COLUMN IF NOT EXISTS compact_status_progress BOOLEAN DEFAULT true;