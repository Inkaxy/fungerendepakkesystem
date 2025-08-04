
-- Create public views and functions for display access without authentication

-- Function to get bakery_id from display_url
CREATE OR REPLACE FUNCTION public.get_bakery_id_from_display_url(display_url_param text)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT bakery_id FROM public.customers WHERE display_url = display_url_param LIMIT 1;
$$;

-- Create a view for public customer access via display_url
CREATE OR REPLACE VIEW public.public_customers AS
SELECT 
  id,
  name,
  display_url,
  has_dedicated_display,
  status,
  bakery_id
FROM public.customers
WHERE display_url IS NOT NULL AND has_dedicated_display = true AND status = 'active';

-- Enable RLS on the view
ALTER VIEW public.public_customers SET (security_barrier = true);

-- Create policy for public customer access
DROP POLICY IF EXISTS "Public access to customers via display_url" ON public.customers;
CREATE POLICY "Public access to customers via display_url" 
  ON public.customers 
  FOR SELECT 
  USING (display_url IS NOT NULL AND has_dedicated_display = true AND status = 'active');

-- Create policy for public display settings access
DROP POLICY IF EXISTS "Public access to display settings" ON public.display_settings;
CREATE POLICY "Public access to display settings" 
  ON public.display_settings 
  FOR SELECT 
  USING (true); -- Allow public read access to all display settings

-- Create policy for public active packing products access
DROP POLICY IF EXISTS "Public access to active packing products" ON public.active_packing_products;
CREATE POLICY "Public access to active packing products" 
  ON public.active_packing_products 
  FOR SELECT 
  USING (true); -- Allow public read access

-- Create policy for public orders access
DROP POLICY IF EXISTS "Public access to orders for displays" ON public.orders;
CREATE POLICY "Public access to orders for displays" 
  ON public.orders 
  FOR SELECT 
  USING (true); -- Allow public read access

-- Create policy for public order_products access
DROP POLICY IF EXISTS "Public access to order_products for displays" ON public.order_products;
CREATE POLICY "Public access to order_products for displays" 
  ON public.order_products 
  FOR SELECT 
  USING (true); -- Allow public read access

-- Create policy for public products access
DROP POLICY IF EXISTS "Public access to products for displays" ON public.products;
CREATE POLICY "Public access to products for displays" 
  ON public.products 
  FOR SELECT 
  USING (true); -- Allow public read access
