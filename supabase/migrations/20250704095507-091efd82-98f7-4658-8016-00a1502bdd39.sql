-- Add new display settings for enhanced shared display functionality
ALTER TABLE public.display_settings 
ADD COLUMN hide_empty_customers boolean DEFAULT false,
ADD COLUMN show_delivery_date_indicators boolean DEFAULT true,
ADD COLUMN auto_hide_completed_customers boolean DEFAULT false,
ADD COLUMN auto_hide_completed_timer integer DEFAULT 30,
ADD COLUMN customer_priority_mode varchar DEFAULT 'none',
ADD COLUMN show_basket_quantity boolean DEFAULT false,
ADD COLUMN basket_display_format varchar DEFAULT 'total_first';

-- Add comment to explain the new fields
COMMENT ON COLUMN public.display_settings.hide_empty_customers IS 'Hide customers that have no products for the current date on shared display';
COMMENT ON COLUMN public.display_settings.show_delivery_date_indicators IS 'Show delivery date indicators (today, tomorrow, etc.) on customer cards';
COMMENT ON COLUMN public.display_settings.auto_hide_completed_customers IS 'Automatically hide completed customers after specified time';
COMMENT ON COLUMN public.display_settings.auto_hide_completed_timer IS 'Minutes to wait before auto-hiding completed customers';
COMMENT ON COLUMN public.display_settings.customer_priority_mode IS 'Priority mode: none, delivery_date, progress, custom';
COMMENT ON COLUMN public.display_settings.show_basket_quantity IS 'Show basket quantity information on product displays';
COMMENT ON COLUMN public.display_settings.basket_display_format IS 'Format for basket quantity display: total_first or basket_first';