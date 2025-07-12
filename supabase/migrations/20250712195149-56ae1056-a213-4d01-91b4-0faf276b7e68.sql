-- Add missing product_change_animation column to display_settings table
ALTER TABLE display_settings 
ADD COLUMN product_change_animation BOOLEAN DEFAULT false;