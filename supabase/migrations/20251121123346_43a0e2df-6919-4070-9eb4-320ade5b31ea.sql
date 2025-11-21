-- Add bakery_id column to order_products for efficient realtime filtering
ALTER TABLE order_products 
ADD COLUMN bakery_id uuid;

-- Add foreign key constraint
ALTER TABLE order_products
ADD CONSTRAINT fk_order_products_bakery 
FOREIGN KEY (bakery_id) REFERENCES bakeries(id) ON DELETE CASCADE;

-- Populate existing rows with bakery_id from orders table
UPDATE order_products op
SET bakery_id = o.bakery_id
FROM orders o
WHERE o.id = op.order_id;

-- Make it NOT NULL after populating existing data
ALTER TABLE order_products 
ALTER COLUMN bakery_id SET NOT NULL;

-- Add index for faster filtering and realtime performance
CREATE INDEX idx_order_products_bakery_id ON order_products(bakery_id);

-- Create trigger to auto-populate bakery_id on INSERT
CREATE OR REPLACE FUNCTION set_order_product_bakery_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Get bakery_id from the order
  SELECT bakery_id INTO NEW.bakery_id
  FROM orders
  WHERE id = NEW.order_id;
  
  -- If not found, raise error
  IF NEW.bakery_id IS NULL THEN
    RAISE EXCEPTION 'Could not find bakery_id for order_id %', NEW.order_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_product_set_bakery_id
BEFORE INSERT ON order_products
FOR EACH ROW
EXECUTE FUNCTION set_order_product_bakery_id();

-- Update RLS policies to use bakery_id directly (more efficient)
DROP POLICY IF EXISTS "Users can view order_products from their bakery" ON order_products;
DROP POLICY IF EXISTS "Users can insert order_products to their bakery" ON order_products;
DROP POLICY IF EXISTS "Users can update order_products from their bakery" ON order_products;
DROP POLICY IF EXISTS "Users can delete order_products from their bakery" ON order_products;
DROP POLICY IF EXISTS "Public access to order_products for displays" ON order_products;

-- Create new optimized RLS policies using bakery_id
CREATE POLICY "Users can view order_products from their bakery"
ON order_products FOR SELECT
TO authenticated
USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can insert order_products to their bakery"
ON order_products FOR INSERT
TO authenticated
WITH CHECK (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can update order_products from their bakery"
ON order_products FOR UPDATE
TO authenticated
USING (bakery_id = get_current_user_bakery_id());

CREATE POLICY "Users can delete order_products from their bakery"
ON order_products FOR DELETE
TO authenticated
USING (bakery_id = get_current_user_bakery_id());

-- Public access for displays
CREATE POLICY "Public access to order_products for displays"
ON order_products FOR SELECT
TO anon
USING (
  bakery_id IN (
    SELECT DISTINCT bakery_id
    FROM customers
    WHERE display_url IS NOT NULL
      AND has_dedicated_display = true
      AND status = 'active'
  )
);