-- Update the check constraint to allow more columns for large screens
ALTER TABLE display_settings 
DROP CONSTRAINT display_settings_customer_cards_columns_check;

ALTER TABLE display_settings 
ADD CONSTRAINT display_settings_customer_cards_columns_check 
CHECK (customer_cards_columns >= 1 AND customer_cards_columns <= 8);