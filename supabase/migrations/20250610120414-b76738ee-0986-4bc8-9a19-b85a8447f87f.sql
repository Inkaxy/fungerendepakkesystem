
-- Create table for tracking active packing products
CREATE TABLE public.active_packing_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bakery_id UUID NOT NULL,
  session_date DATE NOT NULL,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate products for same session
ALTER TABLE public.active_packing_products 
ADD CONSTRAINT unique_session_product 
UNIQUE (bakery_id, session_date, product_id);

-- Enable RLS
ALTER TABLE public.active_packing_products ENABLE ROW LEVEL Security;

-- Create RLS policies
CREATE POLICY "Users can view their bakery's active packing products" 
  ON public.active_packing_products 
  FOR SELECT 
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can insert their bakery's active packing products" 
  ON public.active_packing_products 
  FOR INSERT 
  WITH CHECK (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can update their bakery's active packing products" 
  ON public.active_packing_products 
  FOR UPDATE 
  USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can delete their bakery's active packing products" 
  ON public.active_packing_products 
  FOR DELETE 
  USING (bakery_id = get_current_user_bakery_id());
