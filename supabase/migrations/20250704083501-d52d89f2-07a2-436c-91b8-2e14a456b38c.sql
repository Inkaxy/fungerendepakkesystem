-- Add basket_quantity field to products table
ALTER TABLE public.products 
ADD COLUMN basket_quantity integer;

-- Add comment to explain the field
COMMENT ON COLUMN public.products.basket_quantity IS 'Number of items per basket/container for packing display purposes';