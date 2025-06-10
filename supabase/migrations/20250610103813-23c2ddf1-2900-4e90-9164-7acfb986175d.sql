
-- Add always_show_customer_name column to display_settings table
ALTER TABLE display_settings 
ADD COLUMN always_show_customer_name boolean DEFAULT true;
