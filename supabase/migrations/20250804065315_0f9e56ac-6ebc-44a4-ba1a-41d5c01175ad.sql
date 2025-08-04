-- Remove the problematic security definer view
DROP VIEW IF EXISTS public.public_customers;

-- Create a simple view without security definer
CREATE VIEW public.public_customers AS
SELECT 
  id,
  name,
  display_url,
  has_dedicated_display,
  status,
  bakery_id
FROM public.customers
WHERE display_url IS NOT NULL AND has_dedicated_display = true AND status = 'active';