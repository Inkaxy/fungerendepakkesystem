-- Add screen_type column to display_settings table
ALTER TABLE display_settings ADD COLUMN screen_type VARCHAR(20) DEFAULT 'shared';

-- Create index for better performance
CREATE INDEX idx_display_settings_bakery_screen_type ON display_settings(bakery_id, screen_type);

-- Update existing records to be 'shared' type
UPDATE display_settings SET screen_type = 'shared' WHERE screen_type IS NULL;

-- Make screen_type not null
ALTER TABLE display_settings ALTER COLUMN screen_type SET NOT NULL;

-- Add constraint to ensure valid screen types
ALTER TABLE display_settings ADD CONSTRAINT check_screen_type 
CHECK (screen_type IN ('small', 'large', 'shared'));