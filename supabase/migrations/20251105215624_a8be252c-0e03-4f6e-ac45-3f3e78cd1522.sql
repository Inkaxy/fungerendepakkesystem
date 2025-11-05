-- Add status badge font size to display settings
ALTER TABLE display_settings 
ADD COLUMN status_badge_font_size INTEGER DEFAULT 14;