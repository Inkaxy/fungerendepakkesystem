-- Add UNIQUE constraint to prevent duplicate display settings per bakery and screen type
ALTER TABLE display_settings 
ADD CONSTRAINT unique_bakery_screen_type 
UNIQUE (bakery_id, screen_type);