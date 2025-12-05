-- Add unique constraint for product upsert (bakery_id + product_number)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_bakery_product_number 
ON public.products (bakery_id, product_number) 
WHERE product_number IS NOT NULL;

-- Add unique constraint for customer upsert (bakery_id + customer_number)
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_bakery_customer_number 
ON public.customers (bakery_id, customer_number) 
WHERE customer_number IS NOT NULL;